---
title: "Crash & error reporting"
description: "Report Dart errors with Bugsee Flutter SDK 10.x: logException, logUnhandledException and reportException, error versus crash reports, and what a Dart error report contains."
sidebar_position: 5
slug: "/sdk/flutter/manual/crash-error-reporting"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta, is not published on pub.dev yet and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

Bugsee detects native crashes on its own (see [Overview](/sdk/flutter/overview)). A Dart error is different: it never ends the app, so nothing crashes and nothing is reported unless you say so. This page covers the calls you make yourself. To report the errors nobody handled, without wrapping every call, see [Dart errors](/sdk/flutter/dart-errors).

The snippets assume `import 'package:bugsee_flutter/bugsee_flutter.dart';`.

## Report a caught error

```dart
try {
  await syncOrders();
} catch (error, stack) {
  await Bugsee.logException(error, stack);                  // an error report
  await Bugsee.logUnhandledException(error, stack);         // a crash report
  await Bugsee.reportException(error, stackTrace: stack, domain: 'sync');   // an error report with a grouping domain
}
```

In practice you pick one. All three return `Future<bool>`: `true` when the SDK was handed the error.

| Call | Report type | Notes |
| --- | --- | --- |
| `Bugsee.logException(error, [stackTrace])` | Error | The usual call for an error you caught and handled. |
| `Bugsee.logUnhandledException(error, [stackTrace])` | Crash | For an error you caught at the top of something yourself and treat as fatal to the operation. |
| `Bugsee.reportException(error, {stackTrace, handled = true, domain})` | Error, or crash with `handled: false` | The one with options. `domain` is 1 to 256 characters; issues of one domain group together on the dashboard. On iOS the domain is dropped when `handled` is `false`. |

Any object can be thrown in Dart, so `error` is an `Object`. Without a `stackTrace` the stack at the call is used, starting where you called. A bad `domain` is a `BugseeArgumentException`.

There is no severity argument: neither native SDK takes one for an exception. Set it in a [report handler](/sdk/flutter/report-handler) with `setSeverity`, which runs for error and crash reports. For the default priorities see `reportingDefaultsErrorPriority` and `reportingDefaultsCrashPriority` in [Configuration](/sdk/flutter/configuration).

## Error or crash

| | Error report | Crash report |
| --- | --- | --- |
| Raised by | `logException`, `reportException` (default), the installed handlers (default) | `logUnhandledException`, `reportException(handled: false)`, the installed handlers with `reportAsCrash: true` |
| Counts against crash-free sessions | No | Yes |
| Android | Built in the background and sent with the session. | Written on the plugin's own thread, which snapshots the capture buffer ("up to a couple of seconds"). |
| iOS | Sent with the session. | Stored on disk and sent at the **next launch**, one at a time: each new one replaces the single stored crash report. |

Prefer error reports. A Dart error does not terminate the app on either SDK, so filing it as a crash would inflate your crash numbers, and on iOS ten crash reports in a minute would still deliver only the last. That is why `reportAsCrash` defaults to `false` (the 9.x plugin reported `FlutterError.onError` as unhandled; pass `reportAsCrash: true` to [`installErrorHandlers`](/sdk/flutter/dart-errors#error-or-crash-reports) to get that back).

## What the report contains

The issue shows the Dart exception type, its message and its Dart stack frames, with app frames marked apart from Flutter and `dart:` frames. Reports are grouped by the exception type, the first line of the message (with what varies between runs removed: addresses, UUIDs, long numbers) and the top five app frames, so one error on two days is one issue and different errors are different issues. The application version is not part of the grouping: the same error in two app versions is one issue.

- A `FlutterError` contributes its **summary** only. The framework's long diagnostic text (widget descriptions, property dumps) is not sent.
- Any other object contributes its type and `toString()`. That is whatever your app put in the error message. The SDK's [privacy filters](/sdk/flutter/privacy/overview) do not apply to exception text, so keep secrets out of error messages.
- File paths of the machine that built the app are reduced to the file name.
- In a build with `--obfuscate` or `--split-debug-info` the stack is sent exactly as the VM printed it and Bugsee turns it into readable frames from the symbols you upload. See [Dart symbolication](/sdk/flutter/symbolication/dart).

## Before launch and after stop

Both SDKs drop an error reported before `launch` or after `stop`, and nothing is queued. The wrapper applies the same gate to both paths on both platforms, so the answer `false` means the error was not handed over. Nothing is reported while the last launch made through `Bugsee.launch` had `detect.crash` set to `false`; that gate applies to the [installed handlers](/sdk/flutter/dart-errors), and a launch made natively (Android manifest auto-init) is not seen by it.

## Limits

- The iOS Simulator files nothing for a logged or unhandled Dart error. Test on a device.
- An iOS crash report from `logUnhandledException` arrives at the next launch, not at once. Verification of this path on an iOS device is not part of the repo's recorded evidence, so treat it as expected behavior rather than measured.
- On Android the call runs on a bounded queue of 32. A full queue drops the call and answers `false`. Explicit `logException` calls are not rate limited, so do not call it in a tight loop.
- Argument and attach failures throw a `BugseeException` subclass through the returned `Future`; never because of the error you pass.
