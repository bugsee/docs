---
title: "Release notes"
description: "Full version history of the Bugsee Android SDK, listing new features, improvements, and bug fixes for each release."
sidebar_position: 13
slug: "/sdk/android/v6/release-notes"
---

## 6.0.4 (June 22 2026)
- Fix: Screenshot-to-report was not triggered on some devices (specifically on Samsung, and possibly certain other manufacturers) running Android 14 and newer

## 6.0.3 (April 28 2026)
- Feat: Added compatibility with Ktor 3.x for network request capturing

## 6.0.2 (March 11 2026)
- Fix: Stripped tags in console logs

## 6.0.1 (March 6 2026)
- Fix: Improvements for touch events interception

## 6.0.0 (December 9 2025)
- Breaking: Bugsee SDK is now built with Android SDK version 35, hence requires compileSDKVersion 35
- Breaking: AGP 8.6.0 or newer is now required
- Feat: Multiple internal improvements in stability and performance

## 5.9.4 (February 11 2026)
- Fix: Improvements for touch events interception

## 5.9.3 (December 4 2025)
- Feat: Further improvements for disk space usage for assembled reports

## 5.9.2 (December 4 2025)
- Feat: Reduced disk space usage for assembled reports

## 5.9.1 (September 29 2025)
- Fix: In some specific scenarios (specifically, on Samsung devices) video encoding initialization may fail

## 5.9.0 (September 23 2025)
- Feat: All the built-in UIs are now constructed from code. There are no embedded resources any more.
- Feat: Improved touches interception logic
- Feat: Reworked screenshot capturing logic. It's now more reliable and stable.
- Fix: Screenshot editing screen did not follow device orientation (rotation)
- Feat: Stability and performance improvements


## 5.8.7 (September 9 2025)
- Feat: Improved built-in translations
- Feat: Better built-in UI screen size adaptation
- Feat: Stability and performance improvements

## 5.8.6 (September 4 2025)
- Fix: Video recording may not start when built-in Bugsee UI is shown, and application goes to background and later foregrounded again

## 5.8.5 (August 31 2025)
- Fix: Tiny memory leak when notification trigger is enabled

## 5.8.4 (August 21 2025)
- Feat: Better RTL support in the built-in bug reporting UI
- Feat: Internal concurrency improvements

## 5.8.3 (August 8 2025)
- Fix: Application may crash when Bugsee bug reporting UI was shown, then app went to background, was killed by the system, and later app was foregrounded again and with its process restored

## 5.8.2 (August 7 2025)
- Fix: Some newer Samsung devices (and possibly some other devices) may not be able to capture video

## 5.8.1 (August 5 2025)
- Fix: Video may be missing in some cases

## 5.8.0 (July 30 2025)
- Feat: From now on, VideoMode.V3 is used by default.
- Feat: Improved touch interception logic. Now all touches are also intercepted in popup windows (i.e. menus)
- Feat: Switch ANR from crash to handled error. Application will not terminate due to ANR anymore.
- Fix: When LaunchOptions object where used instead of a Map when calling Bugsee.launch(), the bug reporting UI may not appear when shake-to-report is enabled. Similar misbehavior occurs when screenshot-to-trigger is enabled and user takes the screenshot.

## 5.7.7 (July 29 2025)
- Fix: In some cases, application may crash due to ANR caused by the deadlock in video capturing

## 5.7.6 (June 19 2025)
- Fix: Small and rare memory leak in video capturing logic
- Fix: In some rare cases, main thread can be blocked (ANR generated)

## 5.7.5 (June 8 2025)
- Fix: In some configurations, application may crash on device with 16KB memory pages
- Feat: Ensure native crash interception does not interfere with previously set signal handlers

## 5.7.4 (June 3 2025)
- Fix: In some super-rare cases, Bugsee initialization may fail.

## 5.7.3 (May 5 2025)
- Fix: In some specific cases, video may be recording blank (i.e. black screen) when VideoMode.V3 is used

## 5.7.2 (March 17 2025)
- Fix: Shake-to-report feature may not work under some conditions.

## 5.7.1 (March 4 2025)
- Feat: NDK crashes interception improvements. Now both native and Java stack traces are captured when NDK crash occurs. Note that Java stack traces may not be captured in cases of severe crashes (e.g. when heap/memory severely is corrupted)

## 5.7.0 (February 12 2025)
- Feat: New experimental NDK crash interception implementation. It replaced the existing one. It's controlled by the NdkCrashReport launch option.
- Feat: Multiple internal performance optimizations in hot paths
- Feat: Report upload reliability improvements

## 5.6.5 (February 3 2025)
- Fix: Built-in UI shifts upwards in some scenarios on Android 15 (specifically, when hosting application itself is targeting Android 15, i.e. target SDK version is 35)

## 5.6.4 (January 27 2025)
- Fix: Unhandled error may be thrown in WebView when Request/Response body is being locked (i.e. when it's represented as ReadableStream and was already read)

## 5.6.3 (January 21 2025)
- Fix: Network requests may miss the response in some specific scenarios (e.g. when custom libraries wrap response body object and provide incorrect/incomplete implementation)

## 5.6.2 (January 10 2025)
- Fix: Ensure Bugsee notification entry is displayed right away when runtime notification permission is granted from within application

## 5.6.1 (December 15 2024)
- Fix: Under some conditions, main thread may be blocked for a significant amount of time when screen capture is being stopped (e.g. when application goes to background)

## 5.6.0 (September 18 2024)
- Feat: Add new lifecycle events ReportUploadFailed and ReportUploadFailedWithFutureRetry

## 5.5.0 (September 16 2024)
- Feat: Add video exporting API to ExtendedReport created via Bugsee.createReport() \[[learn more](/sdk/android/v6/manual/)\]

## 5.4.2 (September 11 2024)
- Fix: Crash when bug is sent from built-in reporting UI after removing screenshot

## 5.4.1 (September 9 2024)
- Fix: Remove ContextCompat usage to eliminate the androidx requirement

## 5.4.0 (September 6 2024)
- Feat: Android 16KB memory pages support

## 5.3.2 (September 2 2024)
- Fix: Build with ProGuard/R8 may fail with missing classes for "io.ktor" in some scenarios

## 5.3.1 (August 29 2024)
- Fix: Exclude public interface ExtendedReportCreatedListener from ProGuard/R8 from obfuscation

## 5.3.0 (August 26 2024)
- Feat: New application exit detection feature behind the "DetectAppExit" launch option \[[learn more](/sdk/android/v6/configuration/)\].

## 5.2.3 (August 20 2024)
- Fix: Popup dialog may leak when built-in reporting UI is shown and activities stack is replaced

## 5.2.2 (July 27 2024)
- Fix: Rare crash when bug/error/crash report is being crafted from corrupted data

## 5.2.1 (July 22 2024)
- Fix: Deadlock in some cases when application goes to background

## 5.2.0 (July 16 2024)
- Feat: New API to delete all captured/collected data on the disk \[[learn more](/sdk/android/v6/privacy/cleanup/)\].

## 5.1.3 (July 10 2024)
- Feat: Switch from MD5 hash to SHA-256 in integrity validations to avoid potential security issues

## 5.1.2 (July 1 2024)
- Fix: In some cases, information may be lost in the ExtendedReport

## 5.1.1 (July 1 2024)
- Fix: Make popup windows (menus) and dialogs being captured properly in VideoMode.V3

## 5.1.0 (June 25 2024)
- Feat: New bug/error/crash report construction pipeline. Now capture is not stopped upon report creation and multiple concurrent reports contain all the data.
- Feat: Use more compact format for screenshot to reduce the final report bundle size (the size of data transfer to Bugsee servers)
- Feat: Capture device thermal state (new system trace)
- Feat: SDK is tested and got ready for Android 15

## 5.0.5 (May 28 2024)
- Feat: Detect Android preview builds and display properly in the web dashboard

## 5.0.4 (May 13 2024)
- Fix: In some cases, dialogs may not be captured in the video when VideoMode.V1 is used

## 5.0.3 (May 08 2024)
- Fix: Video may be absent on some devices with Unisoc chipsets

## 5.0.2 (April 19 2024)
- Fix: In some cases, video before FG->BG->FG transitions may be absent

## 5.0.1 (March 27 2024)
- Fix: Rare crash when Bugsee tried to pack and send an intercepted early crash

## 5.0.0 (March 14 2024)
- Breaking: Bugsee SDK now built with Android SDK version 34, hence requires compileSDKVersion 34
- Feat: Screenshot gesture as trigger for bug reporting (experimental)

## 4.2.4 (March 5 2024)
- Fix: In some cases, video may not be captured with reason of "Recording was not started"

## 4.2.3 (February 1 2024)
- Fix: Stalled video recording in some scenarios (e.g. when using VideoMode.V1)

## 4.2.2 (January 31 2024)
- Fix: Broken ripple effect on buttons on some old Android versions (e.g. API 23 and below)

## 4.2.1 (November 14 2023)
- Feat: Improve Ktor support. Properly capture request and responses bodies even when Content-Length header is absent.

## 4.2.0 (November 14 2023)
- Feat: Add support for Ktor \([learn more](/sdk/android/v6/network/#ktor)\)

## 4.1.0 (October 31 2023)
- Fix: One more scenario when console logs may not be captured right after returning from background
- Fix: Some internal fixes in 'VideoEnabled=false' mode

## 4.0.1 (September 30 2023)
- Fix: In some scenarios console logs may not be captured right after returning from background

## 4.0.0 (September 20 2023)
- Feat: Bugsee SDK is ready for Android 14.
- Breaking change: targetSdk and compileSdk versions are 33.
- Breaking change: Bugsee SDK is built against AGP 7.4.2, Gradle 7.5

## 3.11.0 (September 14 2023)
- Feat: New launch option to control the quality of the final video
- Feat: Improve reliability of video encoding
- Fix: Rare exception within WebView control logic

## 3.10.0 (August 17 2023)
- Feat: Compatibility improvements for VideoMode.V2 for Android 14

## 3.9.0 (August 12 2023)
- Feat: Add new API to manually trigger view hierarchy capturing. Multiple view hierarchies support.
- Fix: Background colors may be missing or incorrectly captured in view hierarchy.
- Feat: Improve video capture to prevent frames skipping during scrolling in most scenarios.

## 3.8.3 (August 4 2023)
- Fix: Deadlock in some specific scenario when application comes to foreground

## 3.8.2 (July 12 2023)
- Fix: In some circumstances crashes may not be reported

## 3.8.1 (May 26 2023)
- Fix: Crash in WebView integration logic under some specific conditions

## 3.8.0 (May 15 2023)
- Feat: New logException() API which accepts various options

## 3.7.0 (April 24 2023)
- Feat: Improved interaction with the WebView. Now it's stable and captures more network requests.

## 3.6.0 (April 5 2023)
- Feat: Add ability to change placeholder texts in built-in bug reporting UI
- Feat: Improvements for video capture started from wrappers

## 3.5.0 (March 23 2023)
- Feat: Custom attributes and email can now be set before Bugsee.launch() is executed
- Feat: Increase attachments size to 3MB each (total limit is the same: 3 attachments)
- Fix: Eliminate the call to setReadable() to prevent static analyzers to treat package vulnerable

## 3.4.0 (January 24 2023)
- Feat: Added new API to handle and filter report fields \([Learn more](/sdk/android/v6/privacy/report/)\)
- Fix: Video was disabled on some Samsung devices due to the restrictive internal checks

## 3.3.0 (January 12 2023)
- Feat: logException() API augmented to accept 'domain' argument which lets group/merge error reports into different depending on its value (value of 'domain' argument) 

## 3.2.0 (December 27 2022)
- Feat: New API which accepts Fragment as the target secure view `Bugsee.addSecureView(fragment, activity)`

## 3.1.0 (December 14 2022)
- Feat: Extend API (logException/upload) to not include video into a report
- Fix: Internal improvements for logs collection

## 3.0.2 (November 08 2022)
- Fix: Crash when secure views are added before the .launch() method is called

## 3.0.1 (October 26 2022)
- Fix: Rare ConcurrentModificationException in network interception setup logic

## 3.0.0 (August 19 2022)
- Breaking: minSdkVersion is now set to 21
- Feature: Full Android 13 support (e.g. POST_NOTIFICATIONS permission support)
- Feature: Early crashes are now sent synchronously which let Bugsee Android SDK to report application launch crashes
- Feature: Dark theme support
- Fix: Memory leak in notification management for VideoMode.V2

## 2.1.3 (May 22 2022)
- Fix: Race condition in video capture which leads to a crash in some rare cases
- Fix: Make interoperation with WebViews more secure

## 2.1.2 (May 4 2022)
- Fix: View hierarchy may not be captured in some cases
- Feat: When VideoMode.V2 is being used user permission for video capture is asked only upon launch (i.e. once)
## 2.1.1 (April 19 2022)
- Fix: In some rare and specific cases, some bug reports may not be sent to the server

## 2.1.0 (April 14 2022)
- Feat: Improve network requests capturing
- Fix:  Catch network exceptions

## 2.0.9 (April 8 2022)
- Fix: Internal improvements for View Hierarchy capturing

## 2.0.8 (April 6 2022)
- Feat: Custom view hierarchy capturing

## 2.0.7 (March 11 2022)
- Feat: Improve early crash info capturing (console, network, etc)

## 2.0.6 (February 09 2022)
- Feat: Improve rooted/jailbroken devices detection

## 2.0.5 (January 27 2022)
- Fix: Correctly handle requirement to request bluetooth permission explicitly from user on Android 12+

## 2.0.4 (January 26 2022)
- Fix: AndroidRuntime: java.lang.NoClassDefFoundError

## 2.0.3 (January 23 2022)
- Internal improvements and bug fixes

## 2.0.2 (January 20 2022)
- Fix: checking for an explicitly set VideoMode as None

## 1.21.5, 2.0.1 (December 23 2021)
- Fix: In some cases portion of the video may be obscured by black area

## 2.0.0 (December 2 2021)
- Feat: Bugsee Android SDK migrated to AndroidX. Jetifier is not required now for builds with Bugsee SDK.

## 1.21.4 (November 22 2021)
- Fix: Video may not be captured when some views have invalid dimensions (VideoMode.V1)

## 1.21.3 (November 11 2021)
- Feat: Remove ProGuard/R8 rules which prevented optimizations of R$ class
- Fix: Make VideoMode.V3 more resistant to failures

## 1.21.2 (November 1 2021)
- Feat: Small optimizations

## 1.21.1 (October 4 2021)
- Fix: Fix shake detector's behavior on Android 12.

## 1.21.0 (August 25 2021)
- Feat: VideoMode.V3 now works on most devices. Previously it was disabled on all Samsung devices. From now on, Samsung devices with Android 8 and up are supported.

## 1.20.0 (August 2 2021)
- Feat: Embedded dependencies updated to their latest versions to avoid NonSdkApi calls

## 1.19.18 (July 23 2021)
- Fix: In some rare cases network capturing may cause an unhandled exception

## 1.19.17 (May 26 2021)
- Fix: Video may not be captured if VideoMode not provided explicitly via launch options

## 1.19.16 (May 17 2021)
- Feat: Video capture initialization refactor

## 1.19.15 (April 28 2021)
- Fix: Add missing internal method for Unity wrapper

## 1.19.14 (April 27 2021)
- Fix: Improve WebViews management

## 1.19.13 (April 20 2021)
- Fix: Do not automatically fallback from VideoMode.V2 to VideoMode.V1 upon failure
- Fix: Rare crash during network interception initialization

## 1.19.12 (March 22 2021)
- Feat: New API to add attachments directly to the ExtendedReport instance

## 1.19.11 (February 10 2021)
- Fix: Notification bar trigger was mistakenly displayed in some scenarios

## 1.19.10 (February 4 2021)
- Fix: Rare crash during Bugsee launch with NullPointerException
- Fix: Rare launch failure in some wrappers introduced by the bug in 1.19.9

## 1.19.9 (January 28 2021)
- Fix: More cases when SDK were initially launched without video and then relaunched with video, touches may not be captured properly

## 1.19.8 (January 20 2021)
- Fix: In some cases when SDK was initially launched without video and then relaunched with video, touches may not be captured properly

## 1.19.7 (December 30 2020)
- Fix: In some cases, video capture will not restart when VideoMode.V2 is used and Bugsee.relaunch is called
- Fix: When some specific locales are chosen on device, SDK may improperly generate data file contents (which is worked around in web dashboard)

## 1.19.6 (December 12 2020)
- Fix: VideoMode.V2 did not capture video in some cases

## 1.19.5 (December 5 2020)
- Fix: VideoMode.V2 failed to restart video recording in some cases

## 1.19.4 (November 27 2020)
- Fix: Crash on application startup caused by the bug in Android Gradle Plugin

## 1.19.3 (November 25 2020)
- Fix: Properly pick device metrics to avoid IncorrectContextUseViolation on the latest Android
- Fix: VideoMode.V2 may fail to restart in some cases

## 1.19.2 (September 7 2020)
- Fix: Video may not be available in some cases when VideoMode.V2 is used on Android 10+ devices

## 1.19.1 (August 27 2020)
- Fix: Video recoding may stuck when software and hardware views are present simultaneously

## 1.19.0 (July 24 2020)
- Feat: Drag events are now properly intercepted
- Feat: Hide password fields for payment systems
- Feat: Bugsee now stores its settings and data in dedicated preferences file. This prevents interference with app settings.
- Fix: Crash due to illegal internal state of video capturing mechanism
- Fix: In some cases secure fields may be revealed during device rotation

## 1.18.0 (May 29 2020)
- Feat: Better hide secure fields
- Feat: Improve crash reports interception
- Feat: Better ANR handling

## 1.17.3 (March 24 2020)
- Fix: Properly capture DialogFragment UI elements when VideoMode.V1 is used

## 1.17.2 (February 17 2020)
- Fix: Rare crash while application is in background

## 1.17.1 (January 28 2020)
- Fix: Maintain backward compatibility for SD card settings

## 1.17.0 (January 24 2020)
- Feature: Deprecate SD card usage

## 1.16.1 (January 8 2020)
- Fix: Some bug/error/crash reports were not uploaded correctly on Android 10

## 1.16.0 (November 27 2019)
- Feature: Allow settings report labels (tags) via API methods and in reporting UI
- Fix: Video was not recorded in some cases on emulators

## 1.15.0 (October 24 2019)
- Feature: Add a set of launch options to make input fields in reporting UI mandatory
- Feature: Add two new life cycle events: BeforeReportAssembled and AfterReportAssembled
- Feature: Network requests and responses with content type of 'x-www-form-urlencoded' are now also intercepted
- Fix: Make VideoMode.V2 work on Android 10 again
- Fix: Network request/response body is now correctly intercepted for error responses
- **Note**: An update to the latest version of "compileSdkVersion" (API 29) may be required if build/sync is failing with "foregroundServiceType not found".

## 1.14.12 (October 1 2019)
- Fix: Improve WebView requests handling/interception

## 1.14.11 (September 26 2019)
- Fix: Do not skip WebView requests

## 1.14.10 (September 20 2019)
- Feat: Add support for Android 10

## 1.14.9 (August 29 2019)
- Fix: Properly set video settings and constraints upon relaunch

## 1.14.8 (August 19 2019)
- Fix: Add custom attributes size checks
- Fix: Add auto duration clamping for extra long recordings

## 1.14.7 (July 17 2019)
- Fix: crash when video management resources are released (MediaMuxer)

## 1.14.6 (July 9 2019)
- Fix: Tweak proguard rules to not interfere with application's activities

## 1.14.5 (July 9 2019)
- Feature: Add option to remember/reset the user decision for video capture for VideoMode.V2

## 1.14.4 (June 26 2019)
- Fix: Rare crash with FS

## 1.14.3 (June 12 2019)
- Feature: Add support for lifecycle events for Unity

## 1.14.2 (May 29 2019)
- Fix: Properly capture network body for requests made via URLConnection

## 1.14.1 (May 21 2019)
- Fix: Wrong ProGuard rules were used in 1.14.0 release

## 1.14.0 (May 21 2019)
- Feature: Lifecycle events
- Fix: OOM during screenshot capturing and preparation
- Fix: Properly intercept network requests via URLStreamHandler (when using proxy)

## 1.13.17 (May 14 2019)
- Fix: Rare crash with destroyed screenshot

## 1.13.16 (May 1 2019)
- Feature: Add launch option to enable/disable View hierarchy capturing

## 1.13.15 (Apr 22 2019)
- Fix: Special handling added for controls with infinite animations

## 1.13.14 (Apr 15 2019)
- Fix: Properly catch ANR errors
- Fix: Prevent some OOM errors 

## 1.13.13 (Apr 8 2019)
- Feature: View hierarchy capturing
- Feature: Introduce translations for Arabic, Chinese, Czech, French, German, Hindi, Japanese, Spanish

## 1.13.12 (Apr 05 2019)
- Fix: ViewMode.V1 was not capturing some activities with animations

## 1.13.11 (Mar 28 2019)
- Fix: Safely perform internal calls to several methods that are not implemented on some devices/firmware.

## 1.13.10 (Mar 12 2019)
- Fix: Properly intercept touches. Do not prevent them from being propagated to root views

## 1.13.9 (N/A)
- Skipped

## 1.13.8 (Dec 20 2018)
- Fix: Handle attachments asynchronously (required for wrappers)

## 1.13.7 (Dec 7 2018)
- Feature: Optimize recordings stop/relaunch

## 1.13.6 (Dec 04 2018)
- Various stability fixes

## 1.13.5 (Nov 15 2018)
- Feature: Keep all user events added before recording was started
- Feature: Add full support for AndroidX library
- Refactor: Change feedback messages request logic to make it unified with the one on iOS

## 1.13.4 (Oct 29 2018)
- Bug fix: Fix NullPointerException in some rare cases when MediaProjection is used to capture video

## 1.13.3 (Oct 26 2018)
- Various stability fixes

## 1.13.0 (Oct 24 2018)
- Feature: add ability to set launch options via LaunchOptions class [read more](/sdk/android/v6/configuration/)
- Feature: add HandleAnr launch option (experimental) [read more](/sdk/android/v6/configuration/)
- Feature: add new system trace "Carrier"
- Feature: gather more data for "Connection" trace
- Feature: add ability to stop recording for the time when custom report UI is shown [read more](/sdk/android/v6/manual/)

## 1.12.10 - 1.12.14
- Various stability fixes

## 1.12.9 (Aug 27 2018)
- Bug fix: Fix possible ANR cause when accessing user preferences

## 1.12.7 (Aug 14 2018)
- Feature: Do not generate sessions if last one was within 30 minutes
- Feature: Don't capture AppBarLayout, the component has internal bugs
- Feature: Add getDeviceId() method
- Feature: Treat invalid app token response as remote kill switch

## 1.12.6 (Aug 6 2018)
- Feature: Prepare for Android 9
- Feature: Add CaptureNetworkAndNetworkNames option for privacy [read more](/sdk/android/v6/configuration/)

## 1.12.0 (Jul 19 2018)
- Feature: Added CaptureDeviceAndNetworkNames launch option for privacy [read more](/sdk/android/v6/configuration/)
- Bug fix: Handle hidden fields in Polymer/Shadow DOM properly

## 1.11.12 (May 25 2018)
- Add MD5 hash to uploaded bundles headers
- Bug fix: hidden views placement within WebView
- Various stability fixes

## 1.11.11 (May 21 2018)
- Feature: Make bugsee notifications customizable [read more](/sdk/android/v6/appearance/)

## 1.11.10 (May 10 2018)
- Better handling for Video recording and animations interaction
- Various stability fixes

## 1.11.8 (Apr 10 2018)
- Feature: Screen regions can now be hidden by coordinates [read more](/sdk/android/v6/privacy/video/)
- Feature: SDK can now be stopped and relaunched with different options
- Bug fix: Removed ACCESS_WIFI_STATE permission request 

## 1.11.5 (Mar 9 2018)
- Feature: Draw black rectangle in place of keyboard
- Feature: Add VideoScale option for downgrading video quality [read more](/sdk/android/v6/configuration/)
- Various stability fixes

## 1.11.0 (Dec 26 2017)
- Added support for Instant Apps
- View drawing cache became the default way for screen capture (ExtendedVideoMode launch option is *false* by default now) [read more](/sdk/android/v6/configuration/)
- Various stability fixes

## 1.10.0 (Nov 1 2017)
- Added DefaultBugPriority, DefaultCrashPriority, ReportPrioritySelector options [read more](/sdk/android/v6/configuration/)
- Various stability fixes

## 1.9.1 (Oct 12 2017)
- Added 'WifiOnlyUpload' option to allow uploading issues only on WiFi [read more](/sdk/android/v6/configuration/)

## 1.9.0 (Oct 03 2017)
- Support for Russian locale
- Support for Android 8 (trace Picture-In-Picture mode).
- Various stability fixes

## 1.8.5 (Sep 01 2017)
- Support for Bugsee Xamarin plugin

## 1.8.2 - 1.8.4
- Various stability fixes

## 1.8.1 (Aug 02 2017)
- New launch option - MaxDataSize [read more](/sdk/android/v6/configuration/)

## 1.8.0 (Jul 13 2017)
- Feature: User Feedback [read more](/sdk/android/v6/feedback/)
- Various stability fixes

## 1.7.0 (May 26 2017)
- Feature: New experimental video capture method not involving MediaProject and system enforced user consent dialog.
  The mechanism does have some limitations: it does not record status bar, keyboard, GL and Media views, but it
  is expected to become the default mode in the next release. To enable, set **ExtendedVideoMode** launch
  option to **false** to disable MediaProjection and switch to the new method. [read more](/sdk/android/v6/configuration/)
- Feature: Crash reporting from services - experimental feature, enabled by **Service** launch flag. [read more](/sdk/android/v6/configuration/)
- Feature: Better handling for low disk space environment
- Various stability fixes

## 1.6.0 (Apr 14 2017)
- Feature: Add Secure views in XML [read more](/sdk/android/v6/privacy/video/)
- Feature: Support for maven builds [read more](/sdk/android/v6/maven-installation/)
- Feature: Charging and Bluetooth system traces added
- Various stability fixes

## 1.5.0 (Mar 03 2017)

- Feature: Proguard support [read more](/sdk/android/v6/crashes/)
- Remove "gson" library to reduce size and method count
- Various stability fixes

## 1.4.0 (Jan 23 2017)

- Feature: Network traffic capture in WebView
- Feature: Hidden fields concealment in WebView [read more](/sdk/android/v6/privacy/video/)
- Feature: User attachments [read more](/sdk/android/v6/custom/#file-attachments)
- Various stability fixes

## 1.3.0 (Nov 24 2016)

- Feature: Screenshot annotations
- Various stability fixes

## 1.2.0 (Oct 20 2016)

- Feature: Network traffic body is now captured as well
- Various stability fixes

