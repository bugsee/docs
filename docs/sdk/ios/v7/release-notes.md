---
title: "Release notes"
description: "Release history for Bugsee iOS SDK 7.x."
sidebar_position: 2
slug: "/sdk/ios/v7/release-notes"
---

Release history for Bugsee iOS SDK 7.x. For the current stable line, see the
[6.x release notes](/sdk/ios/release-notes). See the
[migration guide](/sdk/ios/v7/migration) when planning your upgrade from 6.x.

## 7.0.0-beta1 (September 15 2026)

First beta of the 7.x line. See the [migration guide](/sdk/ios/v7/migration) for the full
list of API changes and the order to apply them in.

**Requirements**

- The minimum deployment target moves from iOS 12 to **iOS 13**.
- tvOS 13 and visionOS 1 are now supported.

**Breaking changes**

- Every option constant is renamed into the `BugseeOption*` family, grouped by area:
  `BugseeOptionDetect*`, `BugseeOptionCapture*`, `BugseeOptionReporting*`,
  `BugseeOptionConfig*`, `BugseeOptionPerformance*`. The 6.x names still work, as constants
  or as plain strings, with one exception: `CaptureVideoAdaptive` is not translated and its
  `BugseeCaptureVideoAdaptiveKey` constant is removed — use
  `BugseeOptionCaptureVideoAdaptive`.
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
