---
title: "Frequently asked questions"
description: "Answers to common questions about Bugsee iOS SDK 7.x: supported platforms, installation channels, report triggers, delayed or missing reports, and on-device storage limits."
sidebar_position: 24
slug: "/sdk/ios/faq"
---

**1. Which platforms and versions does the Bugsee iOS SDK support?**

Bugsee iOS SDK 7.x supports iOS 15.0, tvOS 15.0 and visionOS 1.0 and later. Simulator builds of the SDK have no crash reporter, so crashes are captured only on real devices.

<br />

**2. Can I install the SDK with CocoaPods or Carthage?**

No. 7.x is distributed through Swift Package Manager (`https://github.com/bugsee/spm`). For builds that cannot resolve a Swift package, download the XCFramework directly. See [Installation](/sdk/ios/installation/).

<br />

**3. Taking a screenshot no longer opens the report dialog. Why?**

In 7.x, shaking the device opens the report dialog by default and taking a screenshot does not. To change either trigger, set `BugseeOptionReportingTriggerByShake` and `BugseeOptionReportingTriggerByScreenshot`. See [Configuration](/sdk/ios/configuration/#reporting). Shake to report is not available on tvOS; open the dialog from code there with `showReportDialog`.

<br />

**4. Do my 6.x option keys still work?**

The 6.x key constants, such as `BugseeShakeToReportKey`, still compile and map to the new `BugseeOption*` keys, but a few options were removed and several defaults changed. See [Migrating from 6.x to 7.x](/sdk/ios/migration).

<br />

**5. It takes too long for a report to appear in the Bugsee dashboard. Why?**

Check the following:

- The device is connected to the Internet (for example, try to open a web page in the browser).
- `BugseeOptionConfigWifiOnlyUpload` is not on. If it is, the device must be on Wi-Fi for the report to be uploaded.
- A crash report is uploaded on the app's next launch. Relaunch the app to send it.

<br />

**6. A crash report does not appear in the Bugsee dashboard. Why?**

- Make sure the app launches Bugsee with the correct app token.
- Make sure the device is connected to the Internet and that `BugseeOptionConfigWifiOnlyUpload` is not on, or the device is on Wi-Fi.
- Do not trigger the crash with the debugger attached. The debugger handles the signal or exception and does not let Bugsee see it. Launch the app from the Home Screen instead of from Xcode.
- Test on a real device. Simulator builds of the SDK have no crash reporter, and `logError:` and `logException` file nothing there.
- If the app uses another crash reporting tool, try disabling it. Crash reporters can interfere with each other, because only one can handle a crash.
- For builds installed through TestFlight, the system can take the crash before Bugsee does. On test devices, turn off **Share With App Developers** in *Settings > Privacy & Security > Analytics & Improvements*.
- A crash report is uploaded on the app's next launch. Relaunch the app to send it.

<br />

**7. How much space do reports take on the device?**

Reports are stored on the device until they are uploaded. By default, reports waiting to be sent may take up to 150 MB, at most 30 reports are kept, and a report is deleted after 30 days. Past the size or count limit, reports are deleted whole, oldest first: errors before bug reports, and bug reports before crashes. The newest crash is kept. To change the limits, set `BugseeOptionConfigMaxDataSize`, `BugseeOptionConfigMaxPendingReports` and `BugseeOptionConfigMaxPendingReportAge`. See [Configuration](/sdk/ios/configuration/#config).

<br />

**8. How do I remove the data Bugsee has stored on the device?**

Stop the SDK, then call `deleteCollectedDataOnDevice`. See [Privacy: Cleanup](/sdk/ios/privacy/cleanup/).

<br />

---

If your question is not listed here, please let us know at [support@bugsee.com](mailto:support@bugsee.com)
