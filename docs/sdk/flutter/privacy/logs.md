---
title: "Privacy: Console logs"
description: "How to keep sensitive data out of the logs Bugsee Flutter SDK 10.x records: turning capture off, setLogFilter, the missing SDK sanitizer, and the Android logcat echo that the Dart filter does not cover."
sidebar_position: 15
slug: "/sdk/flutter/privacy/logs"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta, is not published on pub.dev yet and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

Log lines often carry more than you meant to share: an access token in a URL, an e-mail address in a debug message, a payload dumped while a feature was being built. Bugsee records what Dart prints when you turn on [log capture](/sdk/flutter/logs), the native console of the app, and the lines you send with `Bugsee.log`. This page covers how to keep sensitive data out of them.

Two facts shape everything below:

- **The SDKs have no log sanitizer.** Unlike network events, nothing redacts a log line by rule. A line is recorded as printed unless your filter changes it. A line such as `card 4111111111111111 password=hunter2` printed with no filter was recorded verbatim on both platforms.
- **On Android the same line can be recorded twice, and the Dart filter covers only one copy.** See [the Android logcat echo](#the-android-logcat-echo).

## Do not enable what you do not need

Capturing `print` and `debugPrint` is opt-in: nothing from Dart is recorded until you call `Bugsee.installLogCapture()`. If you never call it, the lines your app prints are not recorded by the plugin.

`Bugsee.log` is a deliberate call, is always recorded and bypasses the filters: do not pass it anything you would not send.

## Disabling log capture

Set `captureLogs` to `false` to stop automatic log capture, on both routes: the plugin's capture of `print` and `debugPrint`, and the SDK's own console capture, which includes the Android logcat echo.

```dart
import 'package:bugsee_flutter/bugsee_flutter.dart';

await Bugsee.launch(
  'YOUR_APP_TOKEN',
  options: const BugseeOptions(captureLogs: false),
);
```

Lines you send with `Bugsee.log` are still recorded with `captureLogs` off: the option turns off only what is captured automatically.

## Filtering with setLogFilter

`Bugsee.setLogFilter` is where redaction of the lines the plugin records belongs. It runs in Dart, so nothing this capture records can skip it, and it sees each line before anything leaves the isolate. Return the event to keep it (modified if you like), or `null` to drop it:

```dart
Bugsee.setLogFilter((event) {
  if (event.message.contains('password')) return null;            // drop the line
  event.message = event.message.replaceAll(RegExp(r'\b\d{16}\b'), '<card>');
  return event;
});
```

It receives a `BugseeLogEvent` with a mutable `message`, `level` and `tag`. Remember:

- **A filter that returns the event with the secret untouched leaks it.** Where you can, write an allow-style rule, and keep secrets out of `print` in the first place.
- **It fails closed.** A filter that throws, returns something other than a `BugseeLogEvent` or `null`, or returns a `Future` that does not complete within its timeout (10 seconds by default, at most 5 minutes) drops that line. A debug build warns once, and `Bugsee.logCaptureStats.filterFailures` counts the drops.
- **A filter that never answers is switched off for 30 seconds** after three timeouts in a row, and its lines are dropped at once.
- **A filter you remove or replace still applies to what was queued under it.**
- **An empty message drops the line.**
- **Your native filter runs next.** If the app set a log filter on the native SDK, it runs on what the Dart filter returned, for every source other than `Bugsee`.
- **It does not apply to `Bugsee.log`**, nor to the SDK's own console capture.
- **Set it before lines are printed.** The filter applies to lines recorded after it is set; set it at the top of `main`, next to `installLogCapture`.

## The Android logcat echo

On Android the SDK reads the process's logcat on its own, where the Flutter engine writes every `print` and `debugPrint`. That copy is recorded raw as source `LogCat` with the tag `flutter`, **whatever your Dart filter did to the plugin's copy**:

```text
source level tag      message
3      3     flutter  card 4111111111111111 for order 7     <- the SDK's logcat capture: the Dart filter never ran on it
98     3     print    card <card> for order 7                    <- this plugin, after the Dart filter
```

The same applies to the `FlutterError` dump of a real app: its widget tree is written to logcat, and only the plugin's own copy is withheld.

No launch option turns the echo off on its own. `captureLogs` turns off both routes, and `captureLogsAllSources` only widens what the SDK reads. The options are not enough, so choose one of:

- **Add a native filter** in the host app that drops or redacts the echo. It runs on every source other than `Bugsee`:

  ```kotlin
  Bugsee.setLogEventFilter { event, callback ->
      when {
          // The plugin's own lines (source Custom) were filtered in Dart already.
          event.logSource == LogSource.LogCat && event.tag == "flutter" -> callback.run(null) // drop the echo
          else -> callback.run(event)
      }
  }
  ```

  Native filter reference: [Android: Privacy: Console logs](/sdk/android/privacy/logs).
- **Keep the secret out of `print`.** What is never printed is never in logcat.
- **Turn `captureLogs` off**, which stops the echo and the plugin's capture together.

iOS recorded no echo on the simulator: Flutter's `print` on iOS did not reach the stdout the SDK intercepts. This was not verified on a physical device or in a release build.

A debug build on Android prints a warning once when you set a Dart filter while `captureLogs` is on.

## Lines the plugin never records

- The `FlutterError` diagnostics dump, which carries widget trees and property values. The error itself is reported by [`Bugsee.reportException`](/sdk/flutter/manual/crash-error-reporting) and the [installed error handlers](/sdk/flutter/dart-errors). On Android the logcat echo can still record the dump.
- The plugin's own `bugsee_flutter:` messages.
- A `print` in the root zone, `dart:developer`'s `log()`, `stdout` and `stderr` writes, and output of another isolate. The SDK's own console capture may still record what reaches the console.

## Level threshold

`captureLogsLevel` drops lines more verbose than the level you set. It keeps chatty debug output out of reports, and it is not a privacy control: a secret printed at `error` passes any threshold. The plugin applies it to the lines it records on both platforms. The level of `print` and `debugPrint` lines is the `level` you pass to `installLogCapture` (default `LogLevel.info`).

## Related pages

- [Console logs](/sdk/flutter/logs): how capture works.
- [Privacy overview](/sdk/flutter/privacy/overview)
