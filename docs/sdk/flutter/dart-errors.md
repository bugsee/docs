---
title: "Dart errors"
description: "Capture the Dart errors nobody handled with Bugsee Flutter SDK 10.x: installErrorHandlers, runGuarded, listenToIsolateErrors, how the handlers chain with Crashlytics and Sentry, and their limits."
sidebar_position: 6
slug: "/sdk/flutter/dart-errors"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta (`10.0.0-beta.1`, a prerelease on pub.dev) and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

`Bugsee.installErrorHandlers` reports the Dart errors that reach the framework's last-resort hooks, without wrapping every call in `try`/`catch`. It is **opt-in**: `launch` never installs it. For errors you catch yourself, see [Crash & error reporting](/sdk/flutter/manual/crash-error-reporting).

```dart
import 'package:bugsee_flutter/bugsee_flutter.dart';
import 'package:flutter/material.dart';

void main() {
  // The bindings and runApp share the guarded zone, so Flutter finds no zone mismatch.
  Bugsee.runGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();
    await Bugsee.launch('<your app token>');

    // Opt in to the errors nobody handled. Chained: your handlers still run.
    Bugsee.installErrorHandlers();
    assert(Bugsee.errorHandlersActive); // false when another tool replaced them

    runApp(const MyApp());
  });
}
```

## What is hooked

```dart
Bugsee.installErrorHandlers({
  bool flutterErrors = true,
  bool platformErrors = true,
  bool isolateErrors = true,
  bool reportAsCrash = false,
});
```

| Argument | Hooks | Covers |
| --- | --- | --- |
| `flutterErrors` | `FlutterError.onError` | Errors the framework catches (build, layout, paint, gesture). |
| `platformErrors` | `PlatformDispatcher.instance.onError` | Uncaught asynchronous errors of the root zone. |
| `isolateErrors` | The root isolate's error listener | Uncaught errors of the root isolate. |
| `reportAsCrash` | none | See [Error or crash reports](#error-or-crash-reports). |

Errors in a zone you create need `Bugsee.runGuarded`, and errors in isolates you spawn need `Bugsee.listenToIsolateErrors`. Both are described below.

`Bugsee.uninstallErrorHandlers()` removes the hooks. `Bugsee.errorHandlersInstalled` says that `installErrorHandlers` was called and not undone; `Bugsee.errorHandlersActive` says that the hooks are in effect **and** are still the current `FlutterError.onError` and `PlatformDispatcher.onError` (see [Order of installation](#order-of-installation)). A second `installErrorHandlers` while installed does nothing, and a hot restart starts clean.

## Handlers chain, they never replace

The handler that was installed before (yours, Crashlytics', Sentry's) is still called and its answer is returned. With none, `PlatformDispatcher.onError` answers `false`, so the engine reports the error as it would have without Bugsee.

- For `FlutterError.onError` Bugsee's part runs first, and reports even if the previous handler throws.
- For `PlatformDispatcher.onError` the previous handler runs first, because its answer decides what the error is: an error the previous handler answers `true` for (the app handled it) is **never** filed as a crash, whatever `reportAsCrash` says. The report is made even when that handler throws, and its exception goes on to the app.
- Bugsee's part never throws and never blocks. A failure while reporting is swallowed and does not report itself.
- `uninstallErrorHandlers` puts the previous handlers back only if Bugsee's are still the current ones. If another tool wrapped them since, they cannot be unlinked: they stay in that tool's chain and pass every error on, reporting nothing.

### Order of installation

**Install after the tools that assign these handlers.** Crashlytics' documented setup (`FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError`, `PlatformDispatcher.instance.onError = ...`) **replaces** whatever handler is there, so a Bugsee installed before it is dropped from the chain and reports nothing. Sentry's `init` wraps the current handler and keeps Bugsee's.

```dart
await Firebase.initializeApp();
FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
PlatformDispatcher.instance.onError = (error, stack) {
  FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
  return true;
};

// After Crashlytics, so Bugsee is in the chain.
Bugsee.installErrorHandlers();
```

`errorHandlersActive` is `false` when another tool replaced the handlers (a debug build also prints a warning at `Bugsee.launch`). It is also `false` when a tool wrapped them: in that case Bugsee still reports whenever the wrapper calls through, which cannot be told from here.

## Error or crash reports

By default the handlers file **error** reports (`reportAsCrash: false`). A Dart error never ends the app, and a crash report counts against crash-free sessions, so every non-silent `FlutterError` (an image that fails to load offline) would. `installErrorHandlers(reportAsCrash: true)` files crash reports instead, which is what 9.x did for `FlutterError.onError`. See [Crash & error reporting](/sdk/flutter/manual/crash-error-reporting#error-or-crash) for the difference on each platform.

`FlutterErrorDetails.silent` errors are skipped. Nothing is reported while the last launch made through `Bugsee.launch` had `detect.crash` set to `false`.

## Once per error, and limits on floods

- The same throw reaching the handlers by two routes within a second (an uncaught root-zone error reaches both `PlatformDispatcher.onError` and the isolate listener) is **one** report.
- The same error (same first line of the message and top frames) is reported at most once in 30 seconds.
- At most 10 reports in 60 seconds, across all errors.
- 64 distinct errors are remembered, so a render error that repeats every frame opens one report, not sixty.

Explicit `logException` calls are not limited.

## What is read

Only the exception and its stack are read from `FlutterErrorDetails`. The information collector (the widget trees), the `context` and the `library` are not read. A `FlutterError` contributes its summary; any other object its `toString()`; file paths are reduced to the file name. Details are in [Crash & error reporting](/sdk/flutter/manual/crash-error-reporting#what-the-report-contains).

## Zones: `runGuarded`

```dart
Bugsee.runGuarded(
  () => runApp(const MyApp()),
  onError: (error, stack) => debugPrint('escaped: $error'),
);
```

`runGuarded<R>(R Function() body, {void Function(Object error, StackTrace stack)? onError})` is `runZonedGuarded` that reports what escapes `body` (errors from timers and futures started in it) and then calls `onError`. Without `onError` the error goes to `FlutterError.reportError`, so it is still printed and still reaches your handlers. It reports like the installed handlers do (an error report, or a crash report when `reportAsCrash: true`). The zone also records `print` output once [log capture](/sdk/flutter/logs) is installed. It returns `null` if the zone ends with an error.

## Isolates: `listenToIsolateErrors`

Errors in an isolate you spawn do not reach the root handlers. Start the isolate paused, add the listener, then resume it: an isolate that exits first is missed.

```dart
final isolate = await Isolate.spawn(worker, null, paused: true);
final listener = Bugsee.listenToIsolateErrors(isolate);
isolate.resume(isolate.pauseCapability!);

// Later, when you no longer need it
listener.cancel();
```

It works whether or not `installErrorHandlers` was called.

## Limits

- **Before `launch` and after `stop`** an error is dropped, not queued. Install the handlers before `launch` anyway: they cost nothing until an error happens, but reports start when the SDK does.
- **Several engines or isolates.** The handlers are Dart statics of one isolate; an engine started later needs its own install.
- **iOS Simulator.** Nothing is filed for a Dart error.
- **iOS crash reports** (`reportAsCrash: true`) arrive at the next launch, and each replaces the single stored one.
- **Android launched natively** (manifest auto-init) is not seen by the `detect.crash` gate.
