---
title: "Lifecycle & status"
description: "Launching, stopping and waiting for Bugsee Flutter SDK 10.x, reading its status, and subscribing to its lifecycle events."
sidebar_position: 3
slug: "/sdk/flutter/lifecycle"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta (`10.0.0-beta.1`, a prerelease on pub.dev) and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

You can launch and stop the SDK at runtime, ask for its status at any time, wait for a launch that is still starting, and subscribe to its lifecycle events: status transitions, report assembly and upload, blackouts and crash relaunches.

## Launch and stop

```dart
import 'package:bugsee_flutter/bugsee_flutter.dart';

final result = await Bugsee.launch('YOUR_APP_TOKEN', options: const BugseeOptions());
await Bugsee.stop();
```

| Method | Completes with | Notes |
| --- | --- | --- |
| `Bugsee.launch(token, {options})` | `LaunchResult` | When the SDK answers, which is not always "capture started". Throws a `BugseeLaunchException` when the SDK did not launch, and an `ArgumentError` for an option that no platform can honour; see [Configuration](/sdk/flutter/configuration). |
| `Bugsee.waitUntilLaunched({timeout})` | `bool` | Waits for a launch that is still starting. |
| `Bugsee.stop()` | `void` | When the SDK has stopped; at once if it was not running. |

`Bugsee.launch` registers the Flutter wrapper's identity with the SDK first, then launches. Launch before `runApp`, or early in `main`.

### LaunchResult

| Value | Meaning |
| --- | --- |
| `launched` | The SDK launched and capture started. |
| `alreadyRunning` | The SDK was already `launching` or `launched`. Nothing changed, and the options you passed were **not applied**. If it is still `launching`, capture has not started yet. |
| `deferred` | iOS only: the app is not active yet, and the SDK starts when it is. Nothing is capturing yet, and your options are kept for that start. |

`launched`, `alreadyRunning` and `deferred` are all "not a failure". Do not write `if (result != LaunchResult.launched)` as an error check: on iOS, a plain `await Bugsee.launch` before `runApp` can return `deferred`, because the SDK defers every launch made while the app's state is still `background`.

`alreadyRunning` has two usual causes: Android auto-init (the manifest declares `com.bugsee.app-token`, so the SDK launched before any Dart code) and launching twice from Dart. See [Installation](/sdk/flutter/installation#launching-twice-and-auto-init). To change options, `await Bugsee.stop()` and launch again.

### LaunchFailure

A launch that did not happen throws a `BugseeLaunchException`; its `reason` is a `LaunchFailure`:

| Reason | Meaning |
| --- | --- |
| `invalidToken` | The token is empty or blank. Nothing reached the SDK. |
| `stopping` | A stop is still in progress, and the SDK refuses a launch until it completes: `await Bugsee.stop()` first. |
| `rejected` | The SDK declined without a reason this plugin can read: a token it rejects, no application context, capture that did not start, or a stop that overtook the launch. The SDK's own log has the reason (the `Bugsee` tag on Android, the console on iOS). |
| `nativeError` | The native side threw while launching. |
| `unsupportedPlatform` | The app runs on a platform the plugin has no SDK for (anything but Android and iOS). |

### Waiting for capture

`Bugsee.waitUntilLaunched` settles `launched`, `alreadyRunning` and `deferred` launches alike:

```dart
await Bugsee.launch('YOUR_APP_TOKEN');
if (await Bugsee.waitUntilLaunched()) {
  // Capture is up.
}
```

It returns `true` as soon as the status is `launched`. It returns `false` when the launch failed (the status went back to `stopped` after `launching`) or nothing happened within `timeout` (30 seconds by default). A deferred launch that never starts, because the app is never active, times out. It never throws for a failed launch.

## Before launch

The wrapper queues and gates nothing before `launch`: each call reaches the SDK as it is, and does what that SDK does. Nothing is queued, so events, traces, logs and notifications sent before launch are lost.

| Call before `launch` | Result |
| --- | --- |
| Attributes (`setAttribute`, `getAttribute`, ...) | Works on both platforms, persisted across launches and stops. |
| `setUserIdentifier`, `getUserIdentifier`, `clearUserIdentifier` | Works on both platforms. |
| `startBlackout`, `endBlackout`, `isBlackout` | Works on both platforms: a blackout requested before launch is held, so capture starts blacked out, and `endBlackout` before launch cancels it. |
| `event`, `trace`, `log`, `notify` | Dropped; nothing throws and nothing is queued. |
| `addBreadcrumb` | The `Future` completes `false` unless the SDK is launching or launched and `captureBreadcrumbs` is on. |
| `upload`, `showReportDialog` | Do nothing. |
| `setReportHandler` | Stored natively and works. |
| `lifecycleEvents` | Events are buffered natively until Dart attaches, then replayed in order. |

The same applies after `stop`: events, traces, logs, notifications and uploads are dropped.

:::tip[Install the report handler first]
Call `Bugsee.setReportHandler` **before** `Bugsee.launch`. During launch the SDK recovers reports from the previous run, such as a crash, and a handler registered afterwards misses them. See [Report handler](/sdk/flutter/report-handler).
:::

If the plugin is not attached to an engine, every call is a `BugseeException` with a "not registered" message, never a crash and never a silent success. On a platform with no SDK (desktop, web) the calls are no-ops that return neutral values, and `launch` is the call that throws.

## Status

The SDK has four states, as a `BugseeStatus`:

| `BugseeStatus` | Meaning |
| --- | --- |
| `stopped` | Not launched, or fully stopped. |
| `launching` | A launch was accepted and the SDK is starting. Capture is not recording yet. |
| `launched` | Fully running: capture is recording. |
| `stopping` | A stop is in progress. A launch now is refused. |

```dart
final BugseeStatus last = Bugsee.status;            // what the SDK last announced
final BugseeStatus now = await Bugsee.getStatus();  // the SDK's own answer
final bool running = await Bugsee.isLaunched();     // status == launched
```

| Member | Returns |
| --- | --- |
| `Bugsee.status` | The status the SDK last announced to this app, or `stopped` before it announced one. Kept from lifecycle events, so it is not available the instant the app starts: the first call attaches to the SDK, and a launch made natively before that (the Android manifest auto-init) is reported once attached. |
| `Bugsee.getStatus()` | The SDK's current status, read from the SDK. |
| `Bugsee.isLaunched()` | `true` only when the status is `launched`. False while capture is still starting. |
| `Bugsee.statusChanges` | A broadcast `Stream<BugseeStatus>` of every transition. |

A launch is not live capture until the status is `launched`. After `launch` returns `launched`, capture has started. After `alreadyRunning` or `deferred`, check `getStatus()` or wait with `waitUntilLaunched`.

### Status changes

```dart
final subscription = Bugsee.statusChanges.listen((status) {
  if (status == BugseeStatus.launched) {
    // Capture is up.
  }
});

// Later
await subscription.cancel();
```

`statusChanges` emits from when a listener subscribes. A transition that happened before the first call into the plugin is delivered when it attaches (the latest status is replayed). Only `launching`, `launched`, `stopping` and `stopped` change the status; no other lifecycle event does.

## Lifecycle events

`Bugsee.lifecycleEvents` is a broadcast `Stream<LifecycleEvent>` of every event the SDK dispatches:

```dart
final subscription = Bugsee.lifecycleEvents.listen((event) {
  if (event.name == 'RelaunchedAfterCrash') {
    // The previous session ended with a crash.
  }
  if (event.reportId != null) {
    print('${event.name}: ${event.reportId}');
  }
});
```

A `LifecycleEvent` has these members:

| Member | Type | Meaning |
| --- | --- | --- |
| `name` | `String` | The event name, with the `com.bugsee.lifecycle.` prefix already removed, for example `RelaunchedAfterCrash`. |
| `reportId` | `String?` | The id of the report the event is about, for the report events in the table below; `null` for the rest. |
| `data` | `Map<String, String>` | String-to-string payload entries; usually empty. |

The events:

| Event | `reportId` | Description |
| --- | --- | --- |
| `Launching` / `Launched` | no | The SDK is starting / has started. |
| `Stopping` / `Stopped` | no | The SDK is stopping / has stopped. |
| `BlackoutStarted` / `BlackoutEnded` | no | Visual capture paused / resumed by `startBlackout()` / `endBlackout()`. |
| `RelaunchedAfterCrash` | no | The SDK launched and found a crash from the previous session. |
| `BeforeReportShown` / `AfterReportShown` | no | The report UI is about to be shown / has been shown. |
| `BeforeReportAssembled` / `AfterReportAssembled` / `ReportAssemblyFailed` | yes | Report assembly stages. |
| `BeforeReportUploaded` / `AfterReportUploaded` | yes | Report upload start / success. |
| `ReportUploadFailedWithFutureRetry` / `ReportUploadFailed` | yes | Upload failed, to be retried / permanently. |

The two platforms do not emit exactly the same set of events.

How events are delivered:

- `name` is an open string, not an enum. An event this version does not know is delivered unchanged, so a newer native SDK reaches your listener through an older package. Compare `name` against the names you handle and ignore the rest.
- Events arrive on the app's main isolate, in the order the SDK raised them. Native code strips the prefix once and hops to the platform thread before touching Flutter.
- Events reach every attached Flutter engine.
- While no engine is attached, native buffers events (at most 64; the oldest are dropped first) and delivers them when one attaches. The latest status is replayed to each new receiver. The first call into the plugin attaches it.
- Once attached, nothing is buffered for a Dart listener that has not subscribed yet: a stream listener that subscribes late misses what came before. Ask `getStatus()` for the current state rather than rebuilding it from events.
- An event is never proof that a report exists: `RelaunchedAfterCrash` fires whether or not a crash report was produced.

## Blackout

`Bugsee.startBlackout()` and `Bugsee.endBlackout()` bracket a window in which everything that describes the screen is suppressed (the video, the report screenshot, touches and the view hierarchy), while logs, network events, custom events and traces keep recording. `Bugsee.isBlackout()` returns the current state. On Android a blackout lasts from launch to `stop`, which ends it. See [Privacy: Video](/sdk/flutter/privacy/video). To shut the SDK down, use `stop()`.

## Related pages

- [Installation](/sdk/flutter/installation): the first launch and Android auto-init.
- [Configuration](/sdk/flutter/configuration): the options `launch` takes.
- [Report handler](/sdk/flutter/report-handler): changing reports before they are sent.
- [Privacy: Video](/sdk/flutter/privacy/video): blackout and secure views.
