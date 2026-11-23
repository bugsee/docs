---
title: "FAQ"
description: "Questions and answers about Bugsee Flutter SDK 10.x (beta): supported platforms, limits, what is not captured, build problems and symbolication."
sidebar_position: 23
slug: "/sdk/flutter/faq"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta, is not published on pub.dev yet and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

Upgrading from 9.x? See the [migration guide](/sdk/flutter/migration).

## Platforms and limits

**1. Which Flutter, Android and iOS versions does 10.x need?**

Flutter 3.50.0 or newer (Dart 3.14). Android `minSdk` 21, built with JDK 17 or 21 and the Bugsee Gradle plugin 4.1.1. iOS 15.0 or newer, with Swift Package Manager only: Bugsee publishes no CocoaPods pod and the plugin has no podspec. The native SDKs are Android 7.6.0 and iOS 7.1.0. See [Installation](/sdk/flutter/installation).

<br />

**2. Does it work on web, desktop, tvOS or visionOS?**

No. On web and desktop the calls do nothing and `launch` throws. tvOS and visionOS are not covered.

<br />

**3. Can I call Bugsee from a background isolate?**

The API works from the main isolate. A call from a background isolate throws a `BugseeException`. Network and log capture and the error handlers belong to the isolate that installed them. To report errors of an isolate you spawn, use `Bugsee.listenToIsolateErrors`. Hot restart is handled: a new isolate takes over. See [Dart errors](/sdk/flutter/dart-errors).

<br />

**4. How much of this has been tested on real devices?**

Partly. Most of the evidence comes from Android emulators (API 28 to 33) and iOS simulators (iOS 26.5 and 27.0). Integration tests also ran on one Android 14 phone, an iPhone XS and an iPhone 16 Pro. On the phones, `view_hierarchy_test` fails on the debug builds of the Android phone and the iPhone XS (it passes in profile builds), and the iPhone 16 Pro ran only the `attachments`, `network` and `logs` tests. The recovered-crash scenarios for iOS exception bundles were not run on a phone. Treat device behavior as beta.

<br />

**5. Why do I see no crashes or Dart errors from the iOS simulator?**

The SDK's simulator slice has no crash reporter and files no logged exceptions, so crash recovery and Dart error reports cannot be tried there. Use a physical iPhone. Release and profile builds cannot run on a simulator at all.

<br />

**6. Is a newly appearing secure region hidden from the very first frame?**

No. A [`BugseeSecureView`](/sdk/flutter/privacy/video) does not cover the first frame of a region that has just appeared, or pixels drawn outside its subtree (an `Overlay` magnifier or tooltip). Secure regions are verified in portrait on iOS only.

<br />

**7. Why is the start of an Android session missing?**

The SDK holds capture from process start until the first Flutter frame is up and the secure rectangles are published, about 1 second after it. Time caps end the hold: 10 s after the last engine that attached before a frame, 20 s when none attached, and 60 s at most. The first seconds of a session are therefore not recorded.

## What is captured

**8. Why do my events, traces, logs, notifications or uploads vanish?**

They are dropped before `launch` and after `stop`. Nothing is queued. Attributes, the user identifier and blackout work before launch. See [Lifecycle](/sdk/flutter/lifecycle).

<br />

**9. Why is nothing captured from `dart:io`, `print` or Dart errors?**

Those are opt-in in 10.x and `launch` does not turn them on. Call `Bugsee.installNetworkCapture()`, `Bugsee.installLogCapture()` and `Bugsee.installErrorHandlers()`. See [Network](/sdk/flutter/network), [Console logs](/sdk/flutter/logs) and [Dart errors](/sdk/flutter/dart-errors).

<br />

**10. Dart errors are not reported. What do I check?**

Check `Bugsee.errorHandlersActive`. It is `false` when another tool, for example Crashlytics, replaced the handlers after `installErrorHandlers`: call `installErrorHandlers` after it, so Bugsee chains to it. Also make sure the error happens after launch. A debug build prints a warning at `launch` when the handlers are not current.

<br />

**11. Why are unhandled Dart errors error reports and not crash reports?**

`reportAsCrash` defaults to `false`. A Dart error does not end the app, and a crash report counts against crash-free sessions. Pass `reportAsCrash: true` to `installErrorHandlers` to file crash reports, which is what 9.x did for `FlutterError.onError`.

<br />

**12. Why does my app's `print` output appear twice in an Android report?**

The SDK's own console capture records the same `print` output again, raw, as source `LogCat` with the tag `flutter`. The Dart log filter does not apply to that echo. If your logs can hold sensitive text, add a native `Bugsee.setLogEventFilter` that drops `LogSource.LogCat` events tagged `flutter`. See [Privacy: logs](/sdk/flutter/privacy/logs).

<br />

**13. Why do the options I pass to `Bugsee.launch` have no effect on Android?**

`launch` answered `alreadyRunning`. This happens when the manifest has `com.bugsee.app-token`: the SDK launched itself before Dart, and its options are not replaced. A second `launch` in the same run is also answered `alreadyRunning`. See [Installation](/sdk/flutter/installation).

<br />

**14. Option values from `getLaunchOptions` show numbers for enums. Is that a bug?**

No. Enums cross to the SDK by the SDK's own value, so reading options back shows the SDK's internal integers. See [Configuration](/sdk/flutter/configuration).

<br />

**15. What is deliberately not available in 10.x?**

The appearance system, APM transactions and spans, `relaunch`, the secure rectangles API, `pause` and `resume` (use blackout), and the test-crash calls. See [Migrating from 9.x to 10.x](/sdk/flutter/migration#6-removed-without-a-replacement).

## Build problems

**16. The Android build fails Gradle task validation on `injectBugsee...BuildId`.**

The Bugsee Gradle plugin is older than 4.1.0. Use 4.1.1. Versions 4.0.x needed an ordering workaround that is no longer needed.

<br />

**17. No native crashes arrive from Android, and the build is green.**

Either the `bugsee-android-ndk` artifact is not on the classpath (the plugin declares it: run `./gradlew :app:dependencies | grep bugsee-android-ndk`), or the `detect.crash-ndk` option is off. For readable native frames also turn on the native symbol upload: see [Symbolication: Android](/sdk/flutter/symbolication/android).

<br />

**18. Extensions such as the feedback chat never register on Android.**

The Gradle plugin is older than 4.0.7. Version 4.0.6 strips the extension providers and injects nothing. Use 4.1.1.

<br />

**19. A report recovered after a crash lacks the wrapper identity.**

The wrapper is registered natively, before the SDK launches, by a content provider of the plugin. Do not add a provider of your own named `Bugsee<Anything>InitProvider`: the Bugsee Gradle plugin deletes it from the APK.

<br />

**20. `flutter pub get` says the package is "only Swift Package Manager compatible".**

Flutter is older than 3.50.0 (3.41.0 for the Swift Package Manager check alone).

<br />

**21. iOS reports a package resolution or deployment target error.**

Raise the deployment target to 15.0 and run `flutter config --enable-swift-package-manager` where it is not the default.

<br />

**22. Gradle cannot parse the JDK version.**

The JDK is newer than the Gradle in use understands. Use JDK 17 or 21. JDK 25 is not in the supported set.

<br />

**23. The Android report screenshot is black.**

The Android SDK is older than 7.5.0, which skipped Flutter's default `SurfaceView`. This release uses 7.6.0.

## Symbolication

**24. Obfuscated stacks are not readable.**

Upload the `--split-debug-info` symbols of that exact build. See [Symbolication: Dart](/sdk/flutter/symbolication/dart).

<br />

**25. Are the Dart and iOS symbols uploaded for me?**

No. The Android R8 mapping is uploaded by the Gradle plugin, and native symbols after you enable them. The Dart symbols and the iOS dSYMs are manual steps. See [Symbolication overview](/sdk/flutter/symbolication/overview).
