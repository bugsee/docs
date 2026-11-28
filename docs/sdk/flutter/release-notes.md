---
title: "Release notes"
description: "Release history for Bugsee Flutter SDK 10.x (beta), with the native SDK versions each release is built on."
sidebar_position: 22
slug: "/sdk/flutter/release-notes"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta (`10.0.0-beta.1`, a prerelease on pub.dev) and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

Release history for Bugsee Flutter SDK 10.x: `bugsee_flutter` and `bugsee_flutter_feedback`, which are released together at the same version. Looking for the stable release? See the [9.x release notes](/sdk/flutter/v9/release-notes). Upgrading from 9.x? See the [migration guide](/sdk/flutter/migration).

Each release lists the native SDKs it is built on. Their own changes are in the native SDK release notes: [Android](/sdk/android/release-notes) and [iOS](/sdk/ios/release-notes).

## 10.0.0-beta.1 (prerelease, 2026-11-27)

A rewrite for the Bugsee 7.x native SDKs (Android 7.6.1, iOS 7.1.0). **A prerelease**: a plain `^9.0.0` constraint does not select it; ask for `^10.0.0-beta.1` explicitly. Existing 9.x apps should stay on 9.x: there is no compatibility layer: stay on 9.x or follow the migration guide. See [Migrating from 9.x to 10.x](/sdk/flutter/migration).

**Features**

- **Launch and configuration.** `Bugsee.launch(token, {options})` returns a `LaunchResult` (`launched`, `alreadyRunning`, `deferred`). Also `waitUntilLaunched`, `stop`, `status`, `statusChanges`, `getStatus`, `isLaunched`, `getLaunchOptions` and `getHostLaunchOptions`. `BugseeOptions` has a typed, documented field for each of the 100 options the SDKs register, generated from the manifests they publish; an unknown key or a wrong type is an `ArgumentError` before the SDK sees it. See [Lifecycle & status](/sdk/flutter/lifecycle) and [Configuration](/sdk/flutter/configuration).
- **Data.** Attributes (`setAttribute`, `getAttribute`, `getAllAttributes`, `clearAttribute`, `clearAllAttributes`), the user identifier, `event`, `trace`, `log`, `addBreadcrumb`, `notify`, blackout (`startBlackout`, `endBlackout`, `isBlackout`), `showReportDialog` and `upload`. See [Custom events & traces](/sdk/flutter/events-and-traces) and [User & session data](/sdk/flutter/user-session-data).
- **Reports.** `setReportHandler` with `ReportProxy` (before and after callbacks, edits to summary, description, severity, labels and attributes), report attachments and annotated screenshots (path-first, `addAttachmentBytes` up to 1 MiB), `Bugsee.createReport` returning a `CreatedReport`, and the `lifecycleEvents` stream. See [Report handler](/sdk/flutter/report-handler).
- **Privacy.** The `BugseeSecureView` widget, and the Flutter widget tree in reports (boxes and type names only, no text, keys or semantics; a secure view is one node), plus `Bugsee.captureViewHierarchy()`. See [Privacy](/sdk/flutter/privacy/overview) and [View hierarchy](/sdk/flutter/view-hierarchy).
- **Dart errors.** `logException`, `logUnhandledException` and `reportException`. Opt-in `installErrorHandlers` (chained, restored, once per error, rate limited, **error reports by default**, `reportAsCrash: true` for crash reports), `errorHandlersActive`, `runGuarded` and `listenToIsolateErrors`. Obfuscated (`--split-debug-info`) stacks are sent untouched for the backend to symbolicate. See [Dart errors](/sdk/flutter/dart-errors).
- **Network.** Opt-in `installNetworkCapture` records `dart:io` HTTP traffic (`package:http`, the default adapter of `dio`, `Image.network` and others) and hands it to the SDK with the SDK's body options and sanitizer. `setNetworkFilter` is a Dart-side, fail-closed filter that runs first. `networkCaptureStats`. See [Network capture](/sdk/flutter/network).
- **Logs.** Opt-in `installLogCapture` records `print` (in a zone: `runWithLogCapture`, `runGuarded`) and `debugPrint`; `forwardLog` for your own logging; `setLogFilter` (fail closed); `logCaptureStats`. Lines are recorded with the plugin's own source (`Custom`), not as `Bugsee.log`. See [Console logs](/sdk/flutter/logs).
- `bugseeFlutterVersion`, so the feedback package can check it runs with the core it was released with.
- The in-app feedback chat is the separate package `bugsee_flutter_feedback`, released in lock-step. See [Feedback](/sdk/flutter/feedback).
- The wrapper registers with the SDK before it can launch (an Android content provider; iOS at load time), so reports recovered after a crash carry the wrapper identity.

**Breaking changes from 9.x**

- A new API: `Bugsee.launch` returns `LaunchResult` and takes `BugseeOptions` (no `AndroidLaunchOptions` or `IOSLaunchOptions`, no `appRunCallback`). The email becomes the user identifier. Attachments move to the report handler. Secure rectangles are replaced by `BugseeSecureView`. `pause` and `resume` are replaced by blackout. `relaunch`, the appearance system, `setApplicationVersion`, `registerNetworkEvent`, `BugseeIgnoreSecureView` and the test-crash calls are removed. Network, log and error capture are opt-in. The full mapping is in [Migrating from 9.x to 10.x](/sdk/flutter/migration).
- The Dart log, network and lifecycle types are new: `BugseeLogEvent.message` instead of `text`, `LifecycleEvent` instead of `BugseeLifecycleEventType`, `ReportSeverity` instead of `BugseeSeverityLevel`.

**Other changes**

- Log lines keep the time they were printed on both platforms: a line that a slow filter or a long queue delayed is no longer recorded late.
- With Android SDK 7.5.0 and later, the report screenshot captures Flutter's default `SurfaceView`, with the secure views redacted. On an older Android SDK the screenshot was black.

**Requirements**

- Flutter 3.50.0 or later, Dart 3.14 or later. The 10.0 major moves the floor to the release with Direct Interop, Android Gradle Plugin 9 and `material_ui`.
- Android: `minSdk` 24 (Flutter 3.50's own minimum; the Bugsee SDK itself supports 21), JDK 17 or 21, and the Bugsee Gradle plugin 4.1.1 applied by your app (mandatory). Turn on the native symbol upload with `bugsee { ndk { enabled.set(true) } }`: the plugin has it off, and without it native crashes in release builds are unreadable. See [Installation](/sdk/flutter/installation#android).
- Android: the SDK's startup hold is on, so capture is blacked out from process start until the first Flutter frame is up and the secure views are published (about one second after the frame). The first seconds of a session are not recorded. Time caps bound the hold (10 seconds after the last engine that attached before a frame, 20 seconds with none, 60 seconds at most); a cap is a safety limit, not a privacy guarantee.
- iOS: 15.0 or later, Swift Package Manager only (no CocoaPods).

**Compatibility**

- Android: Bugsee Android SDK 7.6.1, Bugsee Gradle plugin 4.1.1.
- iOS: Bugsee iOS SDK 7.1.0.

### Known limitations

- Verification is on Android emulators and iOS simulators, plus integration tests on one physical Android 14 phone, an iPhone XS and an iPhone 16 Pro. On the phones some tests failed or were not run: the view hierarchy test fails on the debug builds of the Android phone and the iPhone XS and passes in profile builds, and the iPhone 16 Pro ran only the attachments, network and logs tests.
- The iOS crash matrix ran on an iPhone XS: recovered reports of native signals, Objective-C exceptions and a Swift trap. A raised signal 7 (`SIGEMT` on iOS, not `SIGBUS`) leaves no report, and `SIGBUS` is not measured on a device. The iOS paths for Dart exceptions were not run on a phone.
- The iOS simulator slice has no crash reporter and files no logged exceptions, so crash recovery and Dart error reports cannot be tried on a simulator.
- Not exposed: APM transactions and spans, the appearance system, `relaunch`.
- Secure views do not cover the first frame of a region that has just appeared. See [Privacy: Video](/sdk/flutter/privacy/video).

For the previous stable line, see the [9.x release notes](/sdk/flutter/v9/release-notes).
