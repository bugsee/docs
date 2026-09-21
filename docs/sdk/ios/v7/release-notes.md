---
title: "Release notes"
description: "Release history for Bugsee iOS SDK 7.x."
sidebar_position: 2
slug: "/sdk/ios/v7/release-notes"
---

Release history for Bugsee iOS SDK 7.x. For the current stable line, see the
[6.x release notes](/sdk/ios/release-notes). See the
[migration guide](/sdk/ios/v7/migration) when planning your upgrade from 6.x.

## 7.0.0-beta2 (September 18 2026)

**Requirements**

- The minimum deployment target moves from iOS 13 to **iOS 15**, and from tvOS 13 to
  **tvOS 15**. Xcode 27 no longer builds for anything older. visionOS 1 is unchanged.
- Swift Package Manager is the only distribution channel for 7.x. CocoaPods and Carthage
  are retired. A manual `Bugsee.xcframework.zip` download remains available.

**Breaking changes**

- Rectangles added with `addSecureRectangle:` now hide touches as well as pixels, the same
  way secure views already did.
- The React Native log hook (`BugseeReactNativeLogger` and
  `BugseeLogger.reactNativeLogger`) is removed from the core framework. The React Native
  7.x SDK installs its own hook, so no app code is needed.

**New features**

- Feat: The `BugseeFeedback` package is published for the beta. Add
  `https://github.com/bugsee/feedback-spm` at `7.0.0-beta2`; it depends on the matching
  core version, iOS 15 or later.
- Feat: `getHostLaunchOptions` returns the launch options your app supplied, as the SDK
  accepted them. Together with `getLaunchOptions` this matches Android.
- Feat: Lifecycle events. The delegate now receives `RelaunchedAfterCrash`,
  `BeforeReportAssembled`, `AfterReportAssembled`, `ReportAssemblyFailed`,
  `BeforeReportUploaded`, `AfterReportUploaded`, `ReportUploadFailedWithFutureRetry` and
  `ReportUploadFailed`. None of them were emitted in beta1.
- Feat: Wrapper SDK support for React Native, Flutter and Unity: the wrapper can contribute
  its own view hierarchy and secure rectangles, receive lifecycle events, and adjust a
  report before it is assembled. Apps using the iOS SDK directly see no change.

**Fixes**

- Fix: With `BugseeOptionCaptureBreadcrumbs` enabled, a `stop` or `relaunch` that landed
  while capture was still starting could deadlock the main thread, and the `started:`
  callback was never called.
- Fix: Crash reports whose instruction window could not be captured now still carry the
  crashing address and the CPU architecture.
- Fix: `setWrapper:` now populates the wrapper information attached to each session.
  Previously only the `wrapper_info` launch option did.
- Fix (Feedback): stopping the SDK now stops the chat's polling and outgoing requests,
  a stop during an in-flight send no longer delivers the same message twice, and the
  SwiftUI chat can dismiss the keyboard.

## 7.0.0-beta1 (September 15 2026)

First beta of the 7.x line. See the [migration guide](/sdk/ios/v7/migration) for the full
list of API changes and the order to apply them in.

**Requirements**

- The minimum deployment target moves from iOS 12 to **iOS 13**.
- tvOS 13 and visionOS 1 are now supported.

**Breaking changes**

- Every option constant is renamed into the `BugseeOption*` family, grouped by area:
  `BugseeOptionDetect*`, `BugseeOptionCapture*`, `BugseeOptionReporting*`,
  `BugseeOptionConfig*`, `BugseeOptionPerformance*`. Launch options passed as hard-coded
  strings rather than constants are no longer recognized and fall back to the defaults.
- Feedback is no longer part of the core framework. It ships as a separate Swift package,
  `BugseeFeedback`, reached through `BugseeFeedback.shared`.
  `showFeedbackController`, `setDefaultFeedbackGreeting:` and the
  `bugsee:didReceiveNewFeedback:` delegate method are removed.
- `pause` and `resume` are removed.
- Renamed: `showReportController*` to `showReportDialog*`, `setView:asHidden:` to
  `addSecureView:` / `removeSecureView:`, `addSecureRect:` and friends to
  `addSecureRectangle:`, `registerEvent:` to `event:`, `traceKey:withValue:` to
  `trace:value:`, `registerNetworkEvent:` to `addNetworkEvent:`, `setEmail:` to
  `setUserIdentifier:`, `appearance` to `getAppearance`, `activeSpan` to `getActiveSpan`,
  and `testExceptionCrash` / `testSignalCrash` to `testCrash`.
- Removed with no replacement: `getDeviceId`, `accessToken`, `isViewHidden:`,
  `hideKeyboard:`, `logAssert:withLocation:`, the `setDefault*Priority:` setters (use the
  matching launch options) and the `includeVideo:` overloads of `uploadWithSummary:` and
  `logError:`.

**New features**

- Feat: Breadcrumbs. The SDK collects them automatically once
  `BugseeOptionCaptureBreadcrumbs` is enabled, and `Bugsee.addBreadcrumb` records your own.
  `setBreadcrumbFilter:` redacts or drops them.
- Feat: Blackout. `startBlackout` / `endBlackout` suppress everything that describes the
  screen — video, the report screenshot, touches and the view hierarchy — while logs,
  network events and traces keep being captured.
- Feat: Notification relay. `Bugsee.notify` sends a message straight to your messaging
  integrations without creating an issue and without attaching video, logs or events.
- Feat: New issue detection — hangs, HTTP errors, main-thread misuse, anomalies and
  frustration, each behind its own `BugseeOptionDetect*` option.
- Feat: User identity. `setUserIdentifier:` / `getUserIdentifier` / `clearUserIdentifier`
  record an arbitrary identifier in place of 6.x's email-only API, and `getAllAttributes`
  returns every attribute currently set.
- Feat: `setLogEventFilter:` filters console logs with a block, alongside the existing
  delegate hook.
- Feat: SDK status. A `status` property and the `bugseeDidChangeStatus:` delegate method
  report the `Launching` and `Stopping` steps that no lifecycle event covers.
- Feat: New capture options — video quality and privacy blur, screenshot scale, network
  interception installed during launch, camera preview and `AVSampleBufferDisplayLayer`.
- Feat: `relaunch` restarts with the current app token and default options.
- Feat: An extension registry (`registerExt:` / `ext:`) for optional modules. Feedback is
  the first to use it.
