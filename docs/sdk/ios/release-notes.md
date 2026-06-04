---
title: "Release notes"
description: "Changelog for the Bugsee iOS SDK listing new features, bug fixes, and breaking changes for each released version."
sidebar_position: 12
slug: "/sdk/ios/release-notes"
---

## 6.1.6 (May 30 2026)
- Fix: Customized "Done" button could be invisible or unresponsive when the host app applies custom navigation-bar button styling.
- Fix: Crash when handling malformed network data from WebViews (non-string URL values).
- Feat: Internal improvements for WebView.

## 6.1.5 (May 13 2026)
- Feat: Build info & size analysis support. Every Archive now registers a build record on Bugsee with version, configuration, VCS context, timings, and the main executable's Mach-O `LC_UUID` — joining every crash report deterministically to the build that produced it. See [Build size analysis](/sdk/ios/build-size-analysis) for setup.
- Feat: Optional IPA upload for server-side size analysis (download / install size, per-category breakdown, per-file diffs). Opt in via `BUGSEE_SIZE_ANALYSIS_ENABLED=1` in the scheme's Environment Variables.
- Feat: In-build size-check gate. Fail the build (or just warn) when the IPA grows beyond a configured threshold versus the previous Archive of the same configuration. Configured via `BUGSEE_SIZE_CHECK_*` env vars.
- Feat: Chunked upload. Splits the IPA into 8 MiB content-addressed chunks and only re-uploads the ones that changed since the prior build — typically cuts CI upload time by 70–90% on incremental builds. Opt in via `BUGSEE_CHUNKED_UPLOAD=1`. Any failure falls back to the single-PUT path automatically.
- Feat: Build info / size analysis flow runs from `BugseeAgent` as a detached post-action, alongside the existing dSYM upload. Failures in one flow no longer affect the other.

## 6.1.4 (May 6 2026)
- Fix: Race conditions in screen capture
- Fix: Rare crash due to improperly filtered exception keys

## 6.1.3 (April 21 2026)
- Feat: A new opt-out network filter.
It automatically sanitizes sensitive data (PII) from captured network events.
It is controlled by sanitizeNetworkData/BugseeSanitizeNetworkDataKey option (default: YES).
- Fix: 'bugseeAddFieldsBeforeReportCreated' delegate method erases parameters set to showReportController(summary:description:severity:).
- Fix: Properly protect WebView with cross-origin iframes on video.
- Fix: Internal improvements.

## 6.1.2 (March 4 2026)
- Fix: Minor UI improvements for Bugsee Report view controller

## 6.1.1 (February 26 2026)
- Added Annotations to Bugsee API for Swift 6 strict concurrency compliance
- Fix: Internal improvements

## 6.1.0 (February 19 2026)
- Feat: Update PLCrashReporter version
- Fix: Typo in Bugsee's clearAllAttributes() method name (not a breaking change)
- Fix: Minor improvements to Report Controller's UI
- Fix: Internal improvements

## 6.0.0 (December 15 2025)
- Breaking change: Minimum deployment target is iOS 12.0.
- Note: Underlying Bugsee SDK is built against iOS SDK 18.5.
- Feat: Bugsee runs on iOS simulator. Note: Crash capturing is excluded.
- Fix: Report Controller's UI on iOS 26.
- Fix: Memory leaks and internal improvements.

## 5.5.9 (November 17 2025)
- Fix: Error in view hierarchy dumping on iOS 26:
"Fatal error: Use of unimplemented initializer 'init(layer:)' for class 'CameraUI.ModeLoupeLayer'".

## 5.5.8 (August 21 2025)
- Feat: Add launch option to control the maximal size of the body of network requests which will be captured. \(See _BugseeMaxNetworkBodySizeKey_ in [configuration](/sdk/ios/configuration/)\)

## 5.5.7 (August 1 2025)
- Feat: Internal improvements.

## 5.5.6 (March 25 2025)
- Fix: Improve network requests capturing (especially asynchronous URLSession methods using async/await).

## 5.5.5 (February 13 2025)
- Fix: Improve bundle uploading mechanism
- Feat: Internal improvements.

## 5.5.4 (January 27 2025)
- Fix: Unhandled error may be thrown in WebView when Request/Response body is being locked (i.e. when it's represented as ReadableStream and was already read)

## 5.5.3 (November 12 2024)
- Fix: Improve crash handling initialization
- Feat: Internal improvements.

## 5.5.2 (October 4 2024)
- Fix: In some specific scenarios involving fast BG->FB switching, some report data may be lost.

## 5.5.1 (September 23 2024)
- Fix: In some scenarios captured network events data may include incorrect entries, which breaks the presentation in web dashboard \[The presentation workaround is already in place in web viewer\]

## 5.5.0 (September 18 2024)
- Feat: Add new lifecycle events BugseeLifecycleEventReportUploadFailed and BugseeLifecycleEventReportUploadFailedWithFutureRetry

## 5.4.1 (September 16 2024)
- Fix: Memory leak when video export is triggered from ExtendedReport created via Bugsee.createReport()

## 5.4.0 (September 16 2024)
- Feat: Add video exporting API to ExtendedReport created via Bugsee.createReport() \[[learn more](/sdk/ios/manual/)\]

## 5.3.2 (September 6 2024)
- Fix: Ensure globally set attributes \(via \[Bugsee setAttribute\]\) are also attached to extended reports \(created via \[Bugsee createReport\]\)
- Fix: Add missing attachments properties and methods to BugseeExtendedReport \(created via \[Bugsee createReport\]\)
- Fix: In a very rare and outstanding scenarios, crashes may not be handled correctly.

## 5.3.1 (August 28 2024)
- Fix: Proper key name for "DetectAppExit" launch option \[[learn more](/sdk/ios/configuration/)\].

## 5.3.0 (August 27 2024)
- Feat: New application exit detection feature behind the "DetectAppExit" launch option \[[learn more](/sdk/ios/configuration/)\].

## 5.2.1 (August 8 2024)
- Fix: Under specific conditions data files in the report bundle (containing logs, network events, etc.) may be duplicated. Backend services and web frontend are able to handle such cases properly.

## 5.2.0 (July 16 2024)
- Feat: New API to delete all captured/collected data on the disk \[[learn more](/sdk/ios/privacy/cleanup/)\].

## 5.1.1 (June 26 2024)
- Fix: Possible crash when screenshot is being edited in the built-in reporting UI

## 5.1.0 (June 18 2024)
- Feat: Streaming bug/error/crash data processing, which eliminates the excessive memory usage for large data sets
- Feat: New bug/error/crash report construction pipeline. Now capture is not stopped upon report creation and multiple concurrent reports contain all the data.
- Feat: More reliable report construction and uploading. Now, if application crashes during report generation, it will be re-generated upon next launch.
- Feat: Use more compact format for screenshot to reduce the final report bundle size (the size of data transfer to Bugsee servers)
- Feat: Capture thermal device thermal state (new system trace)
- Feat: Re-prioritize report bundle uploads. This improves the bug/error/crash report upload times and makes it more reliable.
- Fix: Rare memory leak when reporting UI is shown and dismissed

## 5.0.3 (May 22 2024)
- Feat: Add new API to manually specify secure WebViews

## 5.0.2 (April 11 2024)
- Feat: Final and complete PrivacyInfo.manifest is now bundled with the SDK

## 5.0.1 (April 11 2024)
- Note: Broken release, please skip

## 5.0.0 (December 22 2023)
- Feat: Bitcode support was dropped. Starting with Xcode 14 Bitcode is disabled by default.

## 4.1.0 (October 27 2023)
- Feat: Add PrivacyInfo.xcprivacy manifest in Bugsee SDK

## 4.0.1 (September 30 2023)
- Feat: Update bundled ZLIB to version 1.13 to fix all known vulnerabilities

## 4.0.0 (September 20 2023)
- Feat: Bugsee SDK is ready for iOS 17.
- Breaking change: Minimum deployment target is iOS 11.0.
- Breaking change: Cut off support of ARMv7.
- Note: Underlying Bugsee SDK is built against iOS SDK 15.0.

## 3.8.1 (September 5 2023)
- Fix: Make secure inputs for payment frameworks (e.g. Stripe) being properly hidden in iOS 17

## 3.8.0 (August 12 2023)
- Feat: Add new API to manually trigger view hierarchy capturing. Multiple view hierarchies support.
- Fix: Rare crash when report bundle contents may not be fully packed
- Fix: Background color may be incorrect in captured view hierarchy when wide color gamut is used

## 3.7.5 (August 6 2023)
- Fix: Video shifting in some cases when AVPlayerLayer is used for video capturing and  experimental AVPlayerLayer based video capturing is enabled

## 3.7.4 (July 28 2023)
- Fix: HDR video is now correctly captured in AVPlayerLayer when AVCapture is enabled
- Fix: Some rare crashes when CPU video rendering fallbacks are triggered

## 3.7.3 (July 25 2023)
- Fix: Prevent overexposure for displayed HDR video in AVPlayerLayer when AVCapture is enabled

## 3.7.2 (July 19 2023)
- Feat: Performance and stability improvements for AVPlayerLayer based video capturing. Occasional flickering fixed.

## 3.7.1 (July 11 2023)
- Fix: Improvements and fixes for experimental AVPlayerLayer based video capturing

## 3.7.0 (July 5 2023)
- Feat: New experimental feature: AVPlayerLayer based video capturing
- Feat: Small video capturing optimization which decreases the CPU/GPU usage a bit
- Fix: Exception may be raised on older platforms (iOS 14 and earlier) in some cases when WebView is present on the screen

## 3.6.3 (June 27 2023)
- Feat: Internal improvements

## 3.6.2 (June 20 2023)
- Feat: Internal improvements

## 3.6.1 (June 8 2023)
- Fix: Incorrect handling of 'monitorNetwork' option during relaunch

## 3.6.0 (June 4 2023)
- Feat: Improved interaction with the WebView. Now it's stable and captures more network requests.
- Feat: New logException() API which accepts various options
- Feat: Internal improvements

## 3.5.0 (April 5 2023)
- Feat: Add ability to change placeholder texts in built-in bug reporting UI

## 3.4.1 (March 23 2023)
- Fix: Rare crash when specific data is being written to Keychain
- Fix: Rare crash when double-tapping the suggestion may crash an app (known iOS bug: http://openradar.appspot.com/7428013)
- Fix: Under specific conditions network data could not be intercepted

## 3.4.0 (March 14 2023)
- Feat: Increase attachments size limit from 1 MB to 3MB
- Fix: Rare crash during logs collection

## 3.3.3 (February 25 2023)
- Fix: Remove OSLog from dependencies and make SDK be usable on iOS versions below 14
- Fix: Make getting top view correct in all cases
- Fix: Sometimes battery trace may start with incorrect value

## 3.3.2 (December 26 2022)
- Feat: Make video brightness to be closer to the actual picture brightness on device

## 3.3.1 (December 15 2022)
- Fix: Build issues with Bugsee.xcframework

## 3.3.0 (December 14 2022)
- Feat: Extend API (logException/logError/uploadWithSummary) to not include video into a report
- Feat: Extend BugseeDelegate protocol to edit Report Controller fields before/after controller is presented
- Fix: Rare crash during screen recording
- Fix: WKWebView swizzling
- Fix: High severity was always set in Report Controller

## 3.2.1 (November 9 2022)
- Feat: Better support for Stage Manager on iPad
- Fix: Memory leak in stop-relaunch cycle
- Fix: Rare memory leak in internal logging
- Fix: Rare crash during report construction due to race
- Fix: Rare crash during network interception due to race

## 3.2.0 (October 31 2022)
- Feat: Mac Catalyst support
- Fix: change URLFileProtection of Bugsee generated files

## 3.1.2 (October 25 2022)
- Fix: Internal tweaks for wrappers

## 3.1.1 (October 25 2022)
- Fix: Layout warnings when reporting UI is brought up
- Fix: Rare crash in screenshot generation
- Fix: Possible small memory leaks in internal manipulations

## 3.1.0 (October 12 2022)
- Fix: Change the file protection of Bugsee generated files
- Fix: Improve capturing of network requests
- Fix: Make a linking to OSLog.framework optional. But it's required if you wish to capture OSLog print statements
- Fix: Internal race condition fix

## 3.0.0 (September 1 2022)
- Feat: Improve handling of directly logged exceptions
- Feat: Implement synchronous crash reporting to let Bugsee send early crashes (the ones happening on application launch)
- Feat: Full iOS 16 support
- Feat: Lots of tiny improvements
- Feat: Add OSLog support
- Fix: Properly handle incorrect values used for custom attributes
- Fix: Small memory leak in network interception mechanism
- Fix: Memory leak in crash handling mechanism
- Fix: Crash in video capture pipeline in certain conditions
- Fix: Rare unhandled exception when working with internal ZIP files
- Breaking: Minimal iOS version is now set to 9.0

## 2.1.8 (May 23 2022)
- Fix: Race condition in video capture which leads to a crash in some cases

## 2.1.7 (May 5 2022)
- Fix: Rare crash in video capturing pipeline

## 2.1.6 (April 28 2022)
- Feat: Update embedded ZLIB to the latest version to fix all known vulnerabilities

## 2.1.5 (April 14 2022)
- Feat: Improve reports to include the latest actual system traces when there is no free disk space on device.

## 2.1.4 (April 6 2022)
- Feat: Improve network requests capturing
- Feat: Custom view hierarchy capturing

## 2.1.3 (March 27 2022)
- Fix: Improve korean text input handling in built-in reporting UI (Bug report dialog)

## 2.1.2 (March 23 2022)
- Fix: In some specific scenarios, korean text input may not be correctly handled in built-in reporting UI (Bug report dialog)

## 2.1.1 (March 22 2022)
- Feature: Internal improvements

## 2.1.0 (March 5 2022)
- Helper scripts: **Use Python3 to run BugseeAgent**
- Helper scripts: BugseeClean step is not necessary starting from 2.1.0

## 2.0.4 (February 10 2022)
- Fix: Internal fixes

## 2.0.3 (February 1 2022)
- Fix: Crash on iOS 15.4

## 2.0.2 (January 26 2022)
- Fix: Under some conditions application may crash due to the incorrect video capture initialization

## 2.0.1 (December 15 2021)
- Fix: In some rare cases not all crash reports may be sent to the server upon next relaunch

## 2.0.0 (December 13 2021)
- Feat: Bugsee SDK is built with the latest iOS 15.0
- Feat: CocoaPods is distributed as dynamic XCFramework

## 1.28.5 (November 18 2021)
- Fix: Improve network events de-duplication mechanism
- Feat: Further improvements for Carthage and SPM artifacts

## 1.28.4 (November 15 2021)
- Fix: Proper artifacts for Carthage and SPM

## 1.28.3 (November 11 2021)
- Fix: Proper architectures in standalone fat lib

## 1.28.2 (November 9 2021)
- Fix: Ensure unsafe APIs are not used in App extensions
- Fix: Possible crash when launch from App extension

## 1.28.1 (October 19 2021)
- Fix: Crash on launch in some specific scenarios

## 1.28.0 (September 14 2021)
- Feat: Do not bundle i386 arch for simulator slice in XCFramework any more
- Fix: Improve SPM support
- Fix: Improve hidden fields handling in WKWebView pages
- Fix: Use proper colors for dark/light modes

## 1.27.4 (July 12 2021)
- Fix: Trigger callback passed to launchWithToken (regardless of the result) when Bugsee is being launched in Simulator

## 1.27.3 (May 13 2021)
- Fix: Rare crash when data serialization not possible
- Fix: Do not merge errors with different domain
- Feat: Add initial support for XCF in Carthage

## 1.27.2 (Feb 24 2021)
- Fix: Rare crash when multiple WKWebView instances share the same configuration and internal state
- Fix: Always trigger callback passed to launchWithToken (regardless of the result)

## 1.27.1 (Feb 20 2021)
- Fix: Bugsee agent missing from Carthage package
- Add Swift Package Manager, see ([installation](/sdk/ios/installation/)) for details.

## 1.27.0 (Jan 2 2021)
- Feat: Bugsee is now shipped as an XCFramework, this is in order to support Xcode builds on M1 based computers. Note: Bugsee is still not supported on Simulators, but the change fixes a build issue resulting from conflicting arm64 implementations.
<br />**IMPORTANT**: Please make sure you're using CocoaPods 1.10.0 or later, as in earlier versions of CocoaPods there was a bug with correct slice selection from XCFramework, which will result in build failure.

## 1.26.2 (Oct 19 2020)
- Fix: Network interception on iOS 14

## 1.26.1 (Sep 24 2020)
- Fix: Keyboard is not shown in some cases when was previously hidden in the default Bugsee reporting UI
- Feat: Interaction events are now automatically enabled (if they were disabled) when reporting UI is brought up and are automatically reverted (if required) upon its dismissal

## 1.26.0 (Aug 15 2020)
- Fix: Crash during on-device symbolication (disabled by default)
- Fix: Crash when attempting to obtain WiFi information in some cases due to insufficient permissions (controlled by CaptureDeviceAndNetworkNames which is now disabled by default)
- Fix: Improve network requests interception when there are other data collection/interception SDKs in use
- Fix: Keyboard no showing after screenshot deletion in bug reporting UI
- Feat: Improve video capturing. This fixes the absence of video in some cases when application is moving in/out of background

## 1.25.6 (Apr 28 2020)
- Fix: Problems with application UI after Bugsee Reporting dialog or Feedback dialog is dismissed

## 1.25.5 (Apr 7 2020)
- Fix: Disable on-device symbolication by default to prevent application crash

## 1.25.4 (Mar 27 2020)
- Fix: Sometimes HTTP response headers were not captured
- Fix: Sometimes extra view were left after reporting UI disposal

## 1.25.3 (Jan 19 2020)
- Fix: In some cases, extra view was left open after report dialog closing

## 1.25.2 (December 11 2019)
- Fix: Revert fix for symbolicator

## 1.25.1 (December 9 2019)
- Fix: Remove some of the leftovers of UIWebView
- Fix: Rare crash in symbolicator

## 1.25.0 (November 25 2019)
- Feat: labels managing via API and UI
- Feat: detect memory footprint
- Feat: remove support for deprecated UIWebView
- Fix: Respect UI safe areas in Feedback

## 1.24.1 (October 30 2019)
- Feat: DarkMode support for iOS 13+
- Fix: Rare crash in Feedback when scrolling
- Fix: Get rid of retain cycle in views management
- Fix: Wrong screenshot is captured when keyboard is displayed

## 1.24.0 (October 24 2019)
- Feat: Add an option to override report video
- Feat: Add a set of launch options to make input fields in reporting UI mandatory
- Feat: Add two new life cycle events: BeforeReportAssembled and AfterReportAssembled
- Fix: Crash in NSURLSession when delegate was not supplied during instantiation (iOS 13 only)

## 1.23.12 (October 3 2019)
- Fix: Properly work with modal windows
- Fix: Properly export BugseeMonitorBluetoothStatusKey

## 1.23.11 (October 1 2019)
- Fix: Rare screenshot capturing crash

## 1.23.10 (September 27 2019)
- Fix: Make input fields in reporting UI always accessible

## 1.23.9 (September 15 2019)
- Fix: Another crash in video rendering pipeline

## 1.23.8 (September 10 2019)
- Fix: Crash in video rendering pipeline

## 1.23.7 (August 29 2019)
- Fix: Remove dependency for IOSurface

## 1.23.6 (August 27 2019)
- Fix: crashes in rendering pipeline
- Fix: input does not work in reporting UI on iOS 13

## 1.23.5 (August 14 2019)
- Fix: add custom attributes size limitation

## 1.23.4 (August 11 2019)
- Revert: Fix: Wrong video scale in Zoom mode on iPadOS

## 1.23.3 (August 10 2019)
- Fix: Wrong video scale in Zoom mode on iPadOS

## 1.23.2 (June 27 2019)
- Fix: Memory leak in reporting controller

## 1.23.1 (June 21 2019)
- Fix: Fix video capture on iOS 13

## 1.23.0 (June 20 2019)
- Feature: Add launch option to enable/disable bluetooth state monitoring. From now on, bluetooth monitoring is disabled by default due to privacy/security restrictions in iOS ([read more](/sdk/ios/configuration/)).

## 1.22.1 (May 29 2019)
- Fix: Crashes in video capturing pipeline (Various Metal-related crashes)

## 1.22.0 (May 16 2019)
- Feature: Lifecycle events support added
- Feature: Custom report creation and upload mechanism added

## 1.21.5 (May 1 2019)
- Feature: Add launch option to enable/disable View hierarchy capturing

## 1.21.4 (Apr 16 2019)
- Fix: Properly pick class names in all cases

## 1.21.3 (Apr 14 2019)
- Fix: Crash in A/V players interception mechanisms in some cases

## 1.21.2 (Apr 2 2019)
- Fix: Rare bug in memory releasing mechanism for video capture

## 1.21.1 (Mar 26 2019)
- Fix: View hierarchy dumping may cause a crash in some rare conditions

## 1.21.0 (Mar 7 2019)
- Feature: View hierarchy is now captured for bug reports
- Feature: Touches are now contain more information about the target view (ID, tag, class)

## 1.20.2 (Feb 25 2019)
- Bug fix: Improve memory management in rendering pipeline

## 1.20.1 (Jan 26 2019)
- Bug fix: Refactor WebView events swizzling to prevent failure in some cases.
- Update instructions in build scripts
- Other stability improvements

## 1.20.0 (Jan 22 2019)
- Bug fix: Fix dSYM uploading issue that is caused by race when new Apple's build system is used. Two separate scripts are now should be used. Take a look [here](/sdk/ios/installation/#publishing-to-app-store) and [here](/sdk/ios/symbolication/) for more information and detailed instructions.
- Bug fix: Fix potential problem in WebKit events swizzling mechanism

## 1.19.4 (Jan 10 2019)
- Maintenance release primarily required for React Native and Cordova wrappers

## 1.19.3 (Jan 10 2019)
- Feature: Add new method signature for logException that accepts completion block to react to actual async operation completion

## 1.19.2 (Jan 8 2019)
- Bug fix: Fix bug in that could lead to an app crash when some of the deprecated UI elements are used.

## 1.19.1 (Jan 1 2019)
- Bug fix: Fix bug in rendering pipeline that could lead to an app crash in some cases

## 1.19.0 (Dec 21 2018)
- Feature: New video capture implementation. It's up to 10x more performant and prevents device overheating.
- Other stability improvements

## 1.18.16 (Oct 7 2018)
- Bug fix: In some scenarios, HTTP headers could be incorrectly recorded
- Bug fix: Network events for media players were incorrectly captured

## 1.18.15 (Sep 18 2018)
- Bug fix: Fix iOS12 crash when handling extended crash data
- Bug fix: Handle network interception when form sending files
- Bug fix: Fix issue with framework signing (extra files in folder)

## 1.18.10 (Aug 14 2018)
- Feature: Add Battery/Carrier/SSID traces
- Feature: Add getDeviceId() 
- Bug fix: Fixes for iOS12+

## 1.18.9 (Jul 19 2018)
- Feature: Added CaptureDeviceAndNetworkNames launch option for privacy [read more](/sdk/ios/configuration/)
- Bug fix: Handle hidden fields in Polymer/Shadow DOM properly

## 1.18.5 (May 25 2018)
- Feature: Add Carthage support [read more](/sdk/ios/installation/)
- Bug fix: Do not disable battery monitoring if it was enabled by the app
- Stability bug fixes

## 1.18.0 (Apr 5 2018)
- Feature: Stop and Relaunch SDK [read more](/sdk/ios/configuration/)
- Feature: Mark secure elements by coordinates [read more](/sdk/ios/privacy/video/)
- Feature: Extended crash info is now available on some crashes
- Minor bug fixes

## 1.17.20 (Mar 9 2018)
- Minor bug fixes

## 1.17.17 (Feb 28 2018)
- Feature: Add a way to customize Bugsee UI [read more](/sdk/ios/appearance/)
- Various bug fixes, mostly stability issues

## 1.17.12 (Feb 14 2018)
- Bug fix: Bug priority setting ignored when reporting manually
- Bug fix: Incorrect orientation  reported if it changed during background period
- Bug fix: Incorrect call stack reported for logError API.
- Bug fix: Removed openGLES and Quartz dependencies from CocoaPod spec, they are not needed

## 1.17.10 (Jan 29 2018)
- Bug fix: Removed redundant class pre-loads
- Bug fix: Ad-Hoc and Debug are detected as TestFlight distribution

## 1.17.9 (Jan 24 2018)
- Update Podfile to download zip from https link to avoid CocoaPods warnings

## 1.17.8 (Jan 23 2018)
- Bug fix: Treat launch options properly when app launched by push/background

## 1.17.7 (Jan 19 2018)
- Bug fix: Prevent feedback manager accessing files during background push case
- Bug fix: Incorrect initialization of CFMutableData object in network capture

## 1.17.4 (Jan 15 2018)
- Bug fix: Max body size option was not properly used in some launch configurations
- Bug fix: Fix linking error with latest Xamarin release 

## 1.17.0 (Jan 9 2018)
- Feature: Filter system for console logs [read more](/sdk/ios/privacy/logs/)
- Feature: UDP network monitoring
- Feature: Better distribution detection (AppStore/TestFlight,Enterprise, MDM, Ad-Hoc)
- Feature: Improved UIWindow traces (trace all, indicate which were recorded)

## 1.16.5 (Nov 30 2017)
- Feature: Screenshot is now available in VideoLess mode read more
- Feature: Localization for report controller was added (currently RU locale only)
- Feature: Major refactor of a tracing system to reduce and isolate Bugsee heap footprint

## 1.16.4 (Nov 13 2017)
- Bug fix: Hiding private views on iPhone X
- Feature: Additional parameter to control video down-scaling [read more](/sdk/ios/configuration/)

## 1.16.1 (Nov 4 2017)
- Bug fix: Video scaling fix for iPhone X

## 1.16.0 (Nov 1 2017)
- Feature: Screenshot is now available in VideoLess mode [read more](/sdk/ios/configuration/)
- Feature: Localization for report controller was added (currently RU locale only)
- Feature: Major refactor of a tracing system to reduce and isolate Bugsee heap footprint
- Feature: Added 'WifiOnlyUpload' option to allow uploading issues only on WiFi [read more](/sdk/ios/configuration/)
- Updated build SDK to 11.1
- Various bug fixes, mostly stability issues

## 1.15.5 (Oct 11 2017)
- Fixed proper video scaling for legacy applications in zoomed mode.

## 1.15.4 (Oct 4 2017)
- Fixed bug preventing report controller to be closed on iOS 11
- Updated build SDK to 11

## 1.15.3 (Oct 2 2017)
- Added frame rate low/med/high setting [read more](/sdk/ios/configuration/)

## 1.15.1 (Sep 5 2017)
- Various bug fixes for Xamarin interoperability
- Removed stack trace collection for application kills
- Various bug fixes, mostly stability issues

## 1.15.0 (Aug 23 2017)
- Feature: Proper support for CocoaLumberJack in Swift
- Feature: Better support for wrappers (Xamarin, Unity)
- Various bug fixes, mostly stability issues

## 1.14.3 (Jul 13 2017)
- Feature: Custom attributes [read more](/sdk/ios/custom/)

## 1.14.1 (Jun 13 2017)
- Feature: User Feedback [read more](/sdk/ios/feedback/)
- Bug fixes: Better handling of hidden views, more accurate detection
- Various bug fixes, mostly stability issues

## 1.13.0 (Apr 7 2017)
- Feature: Refactor logging capturing system to produce cleaner logs
- Feature: Better handling of multi-window hierarchies, lower cpu load.
- Feature: Auto-hide CC text fields in common payment libraries (Stripe, Braintree, card.io)
- Feature: Add React native custom logger [read more](/sdk/react_native/logs/)
- Bug fix: Incorrect addresses in C++ exceptions in some cases


## 1.12.6 (Mar 15 2017)
- Bug fix: Rename methods to prevent link conflicts with user library

## 1.12.5 (Mar 9 2017)
- Bug fix: Fix simulator (i386) linkage errors for users of custom attachments and custom loggers.

## 1.12.3, 1.12.4 (Mar 8 2017)
- Bug fix: Properly handle non-ascii characters in logs 

## 1.12.2 (Mar 6 2017)
- Bug fix: Properly handle older internal file format pending logs 

## 1.12.1 (Mar 5 2017)
- Rename global function to avoid name collision with another framework

## 1.12.0 (Mar 3 2017)
- Feature: Reduce Pod size by removing unused i386
- Bug fix: Proper support for dynamic framework dSYM files upload
- Various bug fixes, mostly stability issues

## 1.11.8 (Feb 8 2017)
- Bug fix: Date strings within logs were treated as beginning of newlines.

## 1.11.7 (Feb 7 2017)
- Bug fix: More stability fixes for CocoaLumberjack logger

## 1.11.6 (Feb 6 2017)
- Bug fix: Custom formatter for CocoaLumberjack was crashing
- Added LICENSE file

## 1.11.5 (Feb 5 2017)
- Feature: Mark BugseeNetworkEvent properties as nullable to make Swift mark them as optionals.
- Increase custom attachment size to 10mb

## 1.11.4 (Jan 31 2017)
- Bug fix: Refactor CocoaLumberjack logger to allow custom loggers
- Add option to disable auto console log capture

## 1.11.3 (Jan 23 2017)
- Bug fix: Various bug fixes for video-less recording modes

## 1.11.2 (Jan 17 2017)
- Bug fix: Various bug fixes for network capture mechanisms

## 1.11.0 (Jan 10 2017)

- Feature: Always hide secure text fields, not only under focus
- Feature: WebView secure fields detection and concealment in dynamically created DOM
- Feature: Better support for apps with multiple windows
- Feature: New reporting UI, screenshot is attached now by default
- Feature: On device symbolication for frameworks.
- Feature: BugseeAgent script support for Fastlane integration
- Feature: Graceful degradation when running low on disk space, first video stops recording then the rest.
- Experimental: Detect abnormal application kills. [read more](/sdk/ios/app-kills/)
- Various bug fixes, mostly stability issues


## 1.10.2 (Dec 26 2016)

- Feature: Now all console logs are properly captured
- Upload mechanism improved to work properly on slow network and upload in the background
- Various bug fixes, mostly stability issues

## 1.9.0 (Oct 18 2016)

- Feature: Interception of Ajax network traffic with WebViews
- Feature: APIs for Swift refactored for 3.0 to be more swift-like
- Feature: Automatic top view detection for React Native apps using NavigatorIOS
- Bug fix: Various fixed for stability issues introduced by iOS 10.0
- Bug fix: Symbol files uploading fixed, in some cases dSYM files failed to upload

## 1.8.0 (Aug 25 2016)

- Feature: Remove bundle from the package, one less thing to copy during manual install
- Feature: Allow users to add attachments to the report through delegate [read more](/sdk/ios/custom/#file-attachments/)
- Optimizations: Optimize start up time
- Bug fix: Make symbol collection agent truly run in the background
- Big fix: Various bug fixes for Cordova applications

## 1.7.0 (Jul 28 2016)

- Feature: Body and Headers of network requests are now being recorded (json/xml/text under 5K in size only)
- Feature: More robust [filtering mechanism](/sdk/ios/privacy/network/#network-events) for cleaning sensitive data from network logs
- Feature: User can now add annotations to the last recorded screenshot before sending
- Feature: Better support for C++ crash call stacks where possible
- Feature: Record keyWindow in traces
- Feature: Proper support for iPad Pro split view
- Bug fix: Better crash report recovery: less reports with missing video and/or traces
- Bug fix: Improved overall stability, multiple issues resolved

## 1.6.0 (Jun 7 2016)

- Bug fix: Window now doesn't affect orientations/status bar styles
- Feature: Improve crash report recovery
- Feature: Automatic icon extraction by Bugsee Agent at build
- Feature: Support for multiple dSYM files per application (dynamic frameworks)

## 1.5.7 (Jun 2 2016)

- Bug fix: Proper network handling for special URL types
- Bug fix: Refactor UI controller to prevent interaction with user controls.

## 1.5.6 (May 29 2016)

- Bug fix: Handle the case when Bugsee initialized before all windows

## 1.5.5 (May 25 2016)

- Feature: Added email set/get/clear API [read more](/sdk/ios/custom/#user-email)
- Bug Fix: Namespace collision with ZipArchive 

## 1.5.3 (May 24 2016)

- Visual tweaks to report controller

## 1.5.2 (May 20 2016)

- Bug fix: Handle nil properly when writing events

## 1.5.1 (May 13 2016)

- Bug fix: Video crash related to Apple handling of memory pools
- UI tweaks to report controller

## 1.5.0 (May 11 2016)

- Feature: Our report UI now has an optional field to add your email. Enter it once (tap on the gear), and all your reports will now be grouped under your name. 
- Feature:Improve network error handling.
- Feature: Improve Swift Apps crash report symbolication. 
- Performance and stability fixes across the board.

## 1.4.5 (Apr 26 2016)

- Maintenance release, many stability fixes

## 1.4.2 (Mar 28 2016)

- Feature: Network capture had been added. NSURLSession and NSURLConnection requests
  are being logged now. Network traffic from UIWebKit and WKWebKit are being logged as well.
- Preliminary support for hiding sensitive fields (passwords) within WebViews has been implemented.  
- Stability issues resolves (major cause of a rare but nasty crash was eliminated)

## 1.3.5 (Mar 8 2016)

- Stability issues resolved
- Bug fix: Namespace collision with Reachability library
- Feature: [Pause/Resume](/sdk/ios/privacy/video/#going-dark) APIs to have the ability to avoid recording sensitive screens.


## 1.3.4 (Mar 1 2016)

- Feature: Added BITCODE support, now applications using BITCODE can compile with Bugsee

## 1.3.3 (Feb 29 2016)

- Bug fix: Support old applications which do not have "window" property in their app delegate
- Feature: Detect when the debugger is attached and don't start Bugsee crash reporting, let Xcode handle it 

## 1.3.2 (Feb 28 2016)

- Feature: Prevent Bugsee from running on iOS older than 8.0 and the simulators
- Bug fixes

## 1.3.1 (Feb 25 2016)

- Feature: Gather dispatch queues latencies as traces (main UI and default ones)
- Feature: When video recovery fails, produce a proper recording with no video
- Bug fix: Various fixes for 32bit systems

## 1.3.0 (Feb 22 2016)

- Feature: New refactored mechanism for video recording, requires less memory and CPU
- Feature: Properly track background time, record no video (black frame) when in background
- Feature: Logging levels added for NSLog, Bugsee.log() and CocoaLumberjack logs.
- Bug fix: Add support for 32bit systems
