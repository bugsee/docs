---
title: "Release notes"
description: "Release history for Bugsee iOS SDK 7.x."
sidebar_position: 2
slug: "/sdk/ios/v7/release-notes"
---

Release history for Bugsee iOS SDK 7.x. For the current stable line, see the
[6.x release notes](/sdk/ios/release-notes). See the
[migration guide](/sdk/ios/v7/migration) when planning your upgrade from 6.x.

## 7.0.0-beta6 (October 12 2026)

### iOS SDK

**New features**

- Feat: The report handler (`onBeforeReportCreated` / `onAfterReportCreated`) can edit a crash
  recovered on the next launch, however long it takes to call its completion, within the
  handler window. Before, an edit made a few milliseconds after the handler was called, such
  as labels set from async work, was missing from the recovered report.

**Fixes**

- Fix: `BugseeOptionCaptureVideo` set to `NO` now records no video and no touches. The report
  screenshot no longer follows it: turn the screenshot off with `screenshotEnabled = NO`.
- Fix: `BugseeOptionCaptureNetworkBodySizeLimit` is applied at any value. Before, a value
  under 20480 bytes was raised to 20480. A body over the limit is skipped whole with
  `SizeTooLarge` instead of being cut, a limit of `0` captures no bodies, and WebSocket
  frames of exactly the limit are kept.
- Fix: `BugseeOptionCaptureBluetoothStatus` set to `NO` (the default) now records no
  bluetooth trace, and Bugsee no longer creates a Bluetooth central manager in that case.
- Fix: `BugseeOptionDetectAndReportEarlyCrash` set to `NO` now turns the early-crash
  protection off. Before, it was read by nothing.
- Fix: A recovered crash, an app-exit report and an unhandled exception reported by a wrapper
  take the crash priority of the run that crashed, not the priority of the launch that
  recovered them.
- Fix: `deleteCollectedDataOnDevice` now deletes the captured data of the 7.x SDK. Before,
  it reported success without deleting it, and its completion always reported success. The
  completion now reports whether the deletion succeeded.
- Fix: `setName` on a performance transaction sets its operation, as it does on a span. It
  does nothing once the transaction has finished.
- Fix: The feedback chat is painted with the theme's background color.

**Changes**

- Change: `reportCloseButtonColor` and `reportSendButtonColor` are deprecated. The report
  screen uses the system Cancel and Done buttons, so they have no effect.

**Build and distribution**

- The SDK version is stamped into the XCFramework's `Info.plist`.
- `PrivateHeaders` are no longer shipped in the XCFramework.
- The direct-download zip includes the `Tools` scripts.
- The SwiftUI module no longer needs a conditional `overlay` call and builds on iOS 15 and
  later.

### BugseeFeedback module

- Feat: On first open, the feedback screen asks for an e-mail address ("Get notified by
  email when the reply is available") before the chat, as on Android. **Continue** saves
  it, **Skip** settles the screen without one, and closing it with the cross asks again next
  time. A user identifier containing `@` spares the screen. The `feedbackEmail*` theme keys
  now apply to it.
- Change: The module requires iOS 15 or later, matching the SDK. The UIKit chat for iOS 13
  and 14 is removed.

## 7.0.0-beta5 (October 7 2026)

### iOS SDK

**Fixes**

- Fix: The Bugsee SDK's own requests no longer show up in your reports (network capture and
  APM).
- Fix: A crash on the first launch after an install or an app update, before the app became
  active, is now reported. So are some crashes shortly after launch that were lost before.

### BugseeFeedback module

- No API or behavior changes.

## 7.0.0-beta4 (October 6 2026)

### iOS SDK

**New features**

- Feat: iPhone Duo support:
  - the recording follows the app between the cover and the inner display as the device is
    folded and unfolded;
  - fold traces record the posture and hinge angle (iOS 27.1 and later);
  - display traces list every screen.
- Feat: Multi-window recording. On iPad (Split View, Stage Manager) and iPhone Duo, every
  window of the app on the screen is recorded.

**Fixes**

- Fix: Attributes, the user identifier and the default severity now reach reports. Before,
  crash and error reports had no severity.
- Fix (security): The internal log attached to each report no longer contains Bugsee's
  tokens or the full URL of some of your app's requests.
- Fix: The video now follows window and screen size changes during a session, such as an
  iPad window being resized.
- Fix: In a landscape app, device info now reports the screen's pixel size in portrait, as
  it does for points.
- Fix (React Native, Flutter, Unity): An unhandled exception reported by the wrapper is now
  the crash report, instead of the native crash that followed it.

### BugseeFeedback module

- No API or behavior changes.

## 7.0.0-beta3 (September 28 2026)

### iOS SDK

**Breaking changes**

- Mach exceptions are caught by default: `BugseeOptionCaptureMachExceptions` is now `YES` on
  iOS and visionOS. Set it to `NO` to keep BSD signal handlers. tvOS always uses BSD signal
  handlers.
- `log:level:enforceFiltering:` is renamed `log:level:requiresFiltering:`.
- `BugseeReport`: `type` is read-only, `labels` is no longer nullable, and there is no
  public initializer.
- A severity outside 1–5 is ignored, on the report, in `BugseeReportFields` and in the
  default priority options.

**New features**

- Feat: Change the report before it is sent. In `bugseeAttachmentsForReport:`, the
  `BugseeReport` lets you change the summary, description, email, severity, attributes,
  labels and attachments, as on Android.
- Feat: Mouse input. Mouse buttons, modifier keys and scrolling are recorded with touches.
- Feat: Wrapper SDK support: the React Native, Flutter and Unity SDKs can record their own
  logs and network events and change reports. Apps using the iOS SDK directly see no change.

**Fixes**

- Fix: A log filter that throws an exception is now reported once in the SDK's internal log
  instead of failing silently.

### BugseeFeedback module

- No API or behavior changes.

## 7.0.0-beta2 (September 18 2026)

### iOS SDK

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

### BugseeFeedback module

**New features**

- Feat: The `BugseeFeedback` package is published for the beta. Add
  `https://github.com/bugsee/feedback-spm` at `7.0.0-beta2`; it depends on the matching
  core version, iOS 15 or later.

**Fixes**

- Fix: Stopping the SDK now stops the chat's polling and outgoing requests, a stop during an
  in-flight send no longer delivers the same message twice, and the SwiftUI chat can
  dismiss the keyboard.

## 7.0.0-beta1 (September 15 2026)

First beta of the 7.x line. See the [migration guide](/sdk/ios/v7/migration) for the full
list of API changes and the order to apply them in.

### iOS SDK

**Requirements**

- The minimum deployment target moves from iOS 12 to **iOS 13**.
- tvOS 13 and visionOS 1 are now supported.

**Breaking changes**

- Every option constant is renamed into the `BugseeOption*` family, grouped by area:
  `BugseeOptionDetect*`, `BugseeOptionCapture*`, `BugseeOptionReporting*`,
  `BugseeOptionConfig*`, `BugseeOptionPerformance*`. Launch options passed as hard-coded
  strings rather than constants are no longer recognized and fall back to the defaults.
- Feedback is no longer part of the core framework. `showFeedbackController`,
  `setDefaultFeedbackGreeting:` and the `bugsee:didReceiveNewFeedback:` delegate method are
  removed. See the `BugseeFeedback` module below.
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

### BugseeFeedback module

**New features**

- Feat: Feedback ships as a separate Swift package, `BugseeFeedback`, layered on the core
  SDK and reached through `BugseeFeedback.shared`. `showFeedbackUI` replaces
  `showFeedbackController`, `setGreeting:` replaces `setDefaultFeedbackGreeting:`, and a
  `BugseeFeedbackListener` set with `setListener:` receives `onNewMessagesReceived:` and the
  new `onNewMessageSent:`. The package registers itself with the SDK through the extension
  registry.
