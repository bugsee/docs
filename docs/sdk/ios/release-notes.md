---
title: "Release notes"
description: "Release history for Bugsee iOS SDK 7.x."
sidebar_position: 2
slug: "/sdk/ios/release-notes"
---

Release history for Bugsee iOS SDK 7.x. Looking for the previous major version? See the
[6.x release notes](/sdk/ios/v6/release-notes). See the
[migration guide](/sdk/ios/migration) when planning your upgrade from 6.x.

## 7.0.0 (October 30 2026)

The first stable release of the 7.x line. Coming from 6.x, follow the
[migration guide](/sdk/ios/migration): the minimum deployment target is iOS 15, the option keys
and many methods changed, and feedback moved to its own package. The notes below list what
changed since 7.0.0-beta7.

### iOS SDK

**Breaking changes**

- The interface for Bugsee's cross-platform wrappers and add-on modules moved to the
  `Bugsee.SPI` submodule, which `import Bugsee` does not include: `setWrapper:`,
  `registerExt:`, `BugseeCommunicationManager`, `BGSOptionsContainer` and the
  `BGSLifecycleEvent*` names. App code keeps `Bugsee.ext(_:)`. Headers that were never app
  API, such as `BGSContracts.h`, and the unprefixed protocol and type aliases they declared,
  are no longer public. `BGSAppearance` is removed (use `+[Bugsee getAppearance]`), and the data
  encryption option and `BugseeDataEncryptionMode` are no longer in the public headers.
- `BugseeOptionConfigMaxDataSize` now limits the disk space taken by reports waiting to be
  sent, and its default rises from 50 to 150 MB. Past the limit the oldest reports are deleted
  whole: errors first, then bug reports, then crashes. The newest crash is always kept.

**New features**

- Feat: Crash Report Extension (iOS 27 and later). A Crash Reporter Extension built on the new
  `BugseeCrashExtension` library reports the terminations no in-process handler survives, such
  as the launch watchdog and memory-limit kills, with the stack of every thread. See
  [Crash Report Extension](/sdk/ios/issue-detection/crash-report-extension).
- Feat: Report handler. `+[Bugsee setReportHandler:]` takes a `BugseeReportHandler` whose
  `onBeforeReportCreated` and `onAfterReportCreated` callbacks receive every report as a live
  `BugseeReport`, including crashes recovered at launch. In Swift, either callback can be an
  `async` method. `BugseeReport` is `Sendable`. See [Report handler](/sdk/ios/report-handler).
- Feat: `deleteCollectedDataOnDevice(includingIntermediate:includingBundles:completion:)` also
  deletes the reports waiting for upload. A report being uploaded at that moment is kept, and
  the completion receives `NO`.
- Feat: Pending-report limits. `BugseeOptionConfigMaxPendingReports` (30) and
  `BugseeOptionConfigMaxPendingReportAge` (30 days), also the `maxPendingReports` and
  `maxPendingReportAge` properties, cap how many reports wait to be sent and for how long.
- Feat: `Bugsee.defaultNetworkSanitizer` is the built-in network redaction. A network filter,
  which turns the built-in redaction off, can call `Bugsee.defaultNetworkSanitizer.sanitize(event)`
  to keep it. See [Network privacy](/sdk/ios/privacy/network).
- Feat: `addBreadcrumb(_:requiresFiltering:)` records a breadcrumb without running it through
  the breadcrumb filter, for a breadcrumb you have already filtered.
**Changes**

- Change: The log, network and breadcrumb filters must call their decision block within
  10 seconds. Past that the event is dropped, and a later call is ignored.
- Change: `stop` ends an active blackout. `BugseeLifecycleEventBlackoutEnded` is dispatched
  before the stop completes, and the next launch starts without a blackout. A relaunch keeps
  it, and a blackout started before launch still applies to that launch.
- Change: A launch whose capture fails to start now completes `started:` with `NO` and returns
  the SDK to stopped; before, it reported success. A `stop` while the SDK is launching also
  completes that launch with `NO`. Every launch and relaunch completion runs exactly once.
- Change: `relaunch` follows the SDK lifecycle: it is refused, and its completion receives
  `NO`, when the SDK is not launched or is launching or stopping; a refused call completes at
  once, on the calling thread. A second relaunch joins the one in progress, and a `stop` during
  a relaunch cancels it.
- Change: The bluetooth trace follows the system's state changes as they happen, instead of
  sampling the state once a second.

**Fixes**

- Fix: A crash file that cannot be read is dropped. Before, it was filed as an empty crash
  report.
- Fix: The user identifier is kept when the Keychain rejects it, as on an unsigned simulator
  build. Before, `getUserIdentifier` returned nothing.
- Fix: Reports still waiting for upload that a 7.0.0 beta bundled are deleted instead of
  uploaded. Up to 7.0.0-beta4, such a report could hold the SDK's own session request.
- Fix: Every video frame fills the exported movie. Before, a frame smaller than the largest one
  in the session, such as the iPhone Duo cover display, was drawn at its own size with black
  margins.
- Fix: The mask of a secure view or rectangle disappears from the video as soon as the view
  or rectangle is removed, also while adaptive capture idles.

### BugseeFeedback module

- Fix: `setListener` changes are applied in the order they are made.
- Note: as with every release, `BugseeFeedback` 7.0.0 requires the core SDK 7.0.0 exactly. Add both
  packages at the same exact version, and change both together.

## 7.0.0-beta7 (October 18 2026)

### iOS SDK

**Breaking changes**

- `crashHandlerType` replaces `enableMachExceptions`. Set `BugseeOptions.crashHandlerType`
  (`BugseeOptionCaptureCrashHandlerType`) to a `BugseeCrashHandlerType`: `BSD`, `Mach` or
  `MachAndBSD` (Swift `.bsd`, `.mach`, `.machAndBSD`). The default is `MachAndBSD`.
  `BugseeOptions.enableMachExceptions`, `BugseeOptionCaptureMachExceptions` and
  `BugseeEnableMachExceptionsKey` are removed. The old keys passed as strings are ignored,
  and Bugsee logs a warning to the console: if your app turned Mach exceptions off, set
  `crashHandlerType` to `BSD` to keep it that way. tvOS always uses BSD signal handlers.
- `logException` takes the domain and the number of frames to skip as parameters:
  `logException(exception:domain:skipFrames:completion:)` and
  `logException(name:reason:domain:skipFrames:completion:)`, plus shorter forms without
  them. `BugseeExceptionLoggingOptions` and `BugseeMergingRulesSkipFramesKey` are removed,
  and `includeVideo` has no replacement.
- `logError:labels:` is removed, and `logException` no longer takes labels. Add labels to the
  report in `bugseeAttachmentsForReport:`, which receives every report.
- `killDetection`, `BugseeOptionDetectAndReportKill` and `BugseeKillDetectionKey` are
  removed. The option had no effect in 7.x. Out-of-memory kills are still reported through
  `BugseeOptionDetectAndReportExit`, which is on by default.

**New features**

- Feat: Hybrid crash handler. The default `MachAndBSD` catches both hardware faults and fatal
  signals raised by software, such as a Unity fatal error. Before, with Mach exceptions on,
  a signal raised by software was not reported unless it was `SIGABRT`.
- Feat: `crashSignals` (`BugseeOptionCaptureCrashSignals`) chooses which fatal signals Bugsee
  intercepts: `SIGABRT`, `SIGSEGV`, `SIGBUS`, `SIGILL`, `SIGFPE` and `SIGTRAP`. Combine
  `BugseeCrashSignals` values (Swift `.abrt`, `.segv`, `.bus`, `.ill`, `.fpe`, `.trap`). By
  default every signal is intercepted, except that the Xamarin and .NET SDKs leave out
  `SIGSEGV` and `SIGBUS`, which the .NET runtime handles itself. Leaving out `SIGABRT` also
  stops uncaught Objective-C exceptions from being reported.
- Feat: `deleteCollectedDataOnDevice(completion:)` deletes everything Bugsee has collected on
  the device: the recording, reports not uploaded yet (their uploads are cancelled), crashes
  not reported yet and the performance baselines learned by anomaly detection. As with the
  other form, call `stop` first.

**Fixes**

- Fix: `logException`, `logError` and `uploadWithSummary` called right after `launch`,
  before recording has started, now file the report, without video or logs. Before, the call
  was dropped silently. A call made while the SDK is not launched is now logged as ignored.
- Fix: `logException` and `logUnhandledException` call their completion on the simulator and
  on Mac Catalyst. Before, the completion was never called there. Nothing is filed on these
  platforms, and Bugsee logs a line that says so.
- Fix: A report filed with `uploadWithSummary` is marked as sent from code. Before, its
  source was unknown.
- Fix: `deleteCollectedDataOnDevice(includingIntermediate:completion:)` calls its completion
  with `NO` when the SDK is not stopped. Before, the completion was never called. A launch
  called while a deletion runs, with either form, starts once the deletion has finished.
- Fix: `BugseeOptionCaptureNetworkBodyWithoutType` set to `NO` (the default) now leaves out
  a request or response body that has no `Content-Type` header. Before, the body was
  captured. WebSocket frames are kept.
- Fix: `captureLogs` set to `NO` now also stops recording CocoaLumberjack logs and the
  console output forwarded by the React Native, Flutter and Unity SDKs. Lines sent with
  `Bugsee.log` are always recorded.
- Fix: A report from `createReport` keeps its own attributes. Before, creating a second
  report cleared the attributes of the first. `isScreenshotChanged` is set only when an
  existing screenshot is replaced or removed, and changing a report's attributes from
  several threads no longer crashes.
- Fix (Unity): The app no longer crashes a few seconds after launch while Bugsee records
  the Unity view.

### BugseeFeedback module

- No API or behavior changes.

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

**Changes**

- Change: `reportCloseButtonColor` and `reportSendButtonColor` are deprecated. The report
  screen uses the system Cancel and Done buttons, so they have no effect.

**Build and distribution**

- The SDK version is stamped into the XCFramework's `Info.plist`.
- `PrivateHeaders` are no longer shipped in the XCFramework.
- The direct-download zip includes the `Tools` scripts.

### BugseeFeedback module

- Feat: On first open, the feedback screen asks for an e-mail address ("Get notified by
  email when the reply is available") before the chat, as on Android. **Continue** saves
  it, **Skip** settles the screen without one, and closing it with the cross asks again next
  time. A user identifier containing `@` spares the screen. The `feedbackEmail*` theme keys
  now apply to it.
- Fix: The feedback chat is painted with the theme's background color.
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

First beta of the 7.x line. See the [migration guide](/sdk/ios/migration) for the full
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
