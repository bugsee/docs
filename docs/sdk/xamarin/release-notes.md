---
title: "Release notes"
description: "Changelog for the Bugsee Xamarin SDK, listing all version updates, new features, bug fixes, and breaking changes."
sidebar_position: 11
slug: "/sdk/xamarin/release-notes"
---

:::caution[Deprecated]
Microsoft ended support for Xamarin on May 1, 2024. The Bugsee Xamarin SDK is no longer actively maintained. For new projects, use the [Bugsee .NET SDK](/sdk/dotnet/installation/), which supports .NET MAUI and modern .NET workloads.
:::

## 3.1.5 (April 28 2023)
- Fix: Deployment may fail due to mono-symbolicate not being found with .NET 6+

## 3.1.4 (March 14 2023)
- Feature: Updated native SDKs to its latest versions \(Android: [3.4.0](/sdk/android/v6/release-notes/#340-january-24-2023), iOS: [3.4.0](/sdk/ios/release-notes/#340-march-14-2023)\)

## 3.1.3 (February 26 2023)
- Feature: Updated native SDKs to its latest versions

## 3.1.1 (November 28 2022)
- Feature: Updated native Android SDKs to its latest versions

## 3.1.0 (October 31 2022)
- Feature: Updated native Android SDKs to its latest versions

## 3.0.0 (September 4 2022)
- Feature: Update native SDKs to the latest versions (Android: 3.0.0, iOS: 3.0.0)
- Note: Please refer to the underlying SDKs release notes to get the detailed list of changes: [Android](/sdk/android/v6/release-notes/#300-august-19-2022) / [iOS](/sdk/ios/release-notes/#300-september-1-2022)

## 2.2.0 (June 1 2022)
- Feature: Updated native Android SDKs to its latest versions. Several race conditions are fixed

## 2.1.0 (March 21 2022)
- Feature: Switch to using underlying XCFramework for iOS. This fixes builds for simulators
- Fix: Symbols collection is now skipped for non-Android and non-iOS projects. This removes superfluous build warnings

## 2.0.1 (March 11 2022)
- Feature: Update native SDKs to their latest versions \[iOS: [2.1.0](/sdk/ios/release-notes/#210-march-5-2022), Android: [2.0.7](/sdk/android/v6/release-notes/#207-march-11-2022)\]
- Feature: Switch build warnings to informational messages to prevent build failure when warnings are treated as errors

## 2.0.0 (February 10 2022)
- BREAKING: Bugsee Xamarin SDK is now .netstandard2.0 based
- BREAKING: Underlying Android SDK is now based on AndroidX
- BREAKING: Underlying iOS SDK was built using SDK 15.X
- Feat: Includes the latest versions of underlying Android \[2.0.6\] and iOS \[2.0.3\] SDKs with all the fixes

## 1.11.2 (December 24 2021)
- Feature: Update native SDKs to their latest versions \[iOS: 1.28.5, Android: 1.21.5\]
- Fix: In some cases portion of the video may be obscured by black area

## 1.11.1 (November 22 2021)
- Feature: Update native SDKs to their latest versions \[iOS: 1.28.5, Android: 1.21.4\]
- Fix: Video may be not captured in some Xamarin.Forms applications with VideoMode.V1

## 1.11.0 (October 26 2021)
- Feature: Update native SDKs to their latest versions \[iOS: 1.28.0, Android: 1.21.1\]

## 1.10.6 (August 11 2021)
- Feature: Update native SDKs to their latest versions \[iOS: 1.26.2, Android: 1.19.18\]

## 1.10.5 (February 11 2021)
- Feature: Update native SDKs to their latest versions \[iOS: 1.26.2, Android: 1.19.11\]

## 1.10.4 (October 8 2020)
- Feature: Update native SDKs to their latest versions \[iOS: 1.26.1, Android: 1.19.2\]

## 1.10.3 (August 31 2020)
- Feature: Update native SDKs to their latest versions \[iOS: 1.26.0, Android: 1.19.1\]

## 1.10.2 (August 11 2020)
- Feature: Update native Android SDK to the latest version \[1.19.0\]

## 1.10.1 (July 25 2020)
- Fix: Rare error during exception serialization on Android

## 1.10.0 (July 10 2020)
- Feature: New internal debug symbols format. Improves symbolication accuracy

## 1.9.3 (June 9 2020)
- Feature: Updated native SDKs to their latest versions

## 1.9.2 (April 7 2020)
- Fix: Update native SDK, to disable on-device symbolication by default to prevent application crash \[iOS\]

## 1.9.1 (March 6 2020)
- Fix: Properly collect information and symbolicate crashes/errors in class constructors

## 1.9.0 (December 23 2019)
- Feature: Update native SDKs to their latest versions
- Fix: Stack traces known to be incorrectly symbolicated are now correctly collected and processed

## 1.8.0 (October 25 2019)
- Feature: Add a set of launch options to make input fields in reporting UI mandatory
- Feature: Add two new life cycle events: BeforeReportAssembled and AfterReportAssembled
- **Note**: For Android projects, switching the SDK version used to compile code to the latest version may be required if build/sync is failing with "foregroundServiceType not found". You can do that in ```Project options → Build → General → Compile using Android version```

## 1.7.12 (October 7 2019)
- Fix: Race in network request body interception \[Android\]
- Feat: Better interception of network response bodies \[Android\]

## 1.7.11 (October 3 2019)
- Fix: Properly decompress and handle network requests and responses with Deflate and GZIP encoding \[iOS\]
- Feature: Update native SDKs to the latest versions \[1.23.12\]

## 1.7.10 (October 3 2019)
- Fix: Properly decompress and handle network requests and responses with Deflate and GZIP encoding \[iOS\]

## 1.7.9 (October 1 2019)
- Feature: Update native SDKs to the latest versions

## 1.7.8 (October 1 2019)
- Fix: Rare crash in screenshot capturing flow (iOS)
- Fix: Improve WebView requests handling/interception

## 1.7.7 (September 26 2019)
- Fix: Do not crash when network event serialized and sent to native SDK
- Fix: Properly serialize DateTime objects

## 1.7.6 (September 15 2019)
- Fix: Another crash in video rendering pipeline (iOS)
- Fix: Possible crash when specific value was provided for method Bugsee.Trace()

## 1.7.5 (September 10 2019)
- Fix: Crash in video rendering pipeline (iOS)

## 1.7.4 (August 29 2019)
- Fix: Remove dependency for IOSurface (iOS)

## 1.7.3 (August 27 2019)
- Feature: Update native SDKs to the latest versions
- Fix: crashes in rendering pipeline (iOS)
- Fix: input does not work in reporting UI on iOS 13 (iOS)

## 1.7.2 (August 4 2019)
- Fix: properly capture video with Zoomed mode enabled on iPadOS
- Feature: Update native SDKs to the latest versions 

## 1.7.1 (June 27 2019)
- Fix: memory leak in iOS bug reporting controller
- Feature: Update native SDKs to the latest versions

## 1.7.0 (June 21 2019)
- Feature: Added option to control bluetooth state capturing on iOS
- Fix: Crash in video capturing on iOS 13

## 1.6.0 (May 21 2019)
- Feature: SDKs were updated to their latest versions
- Feature: Lifecycle events support added
- Fix: Crash when URLStreamHandler was used with Proxy parameter (Android)

## 1.5.6 (May 1 2019)
- Feature: Update native SDKs to the latest versions
- Feature: Add option to enable/disable view hierarchy capturing
- Fix: New feedback messages handler was not called in some cases

## 1.5.5 (Apr 11 2019)
- Feature: Update native Android SDK to its latest version (1.13.13)
- Feature: View hierarchy is now also captured on Android

## 1.5.4 (Apr 3 2019)
- Fix: Correctly pick and update symbols during Archive phase
- Feature: Update native SDKs to the latest versions

## 1.5.3 (Mar 27 2019)
- Fix: Update iOS SDK to the latest version to fix a rare crash during view hierarchy capturing

## 1.5.2 (Mar 15 2019)
- Fix: Network interception mechanism may cause a crash under some conditions

## 1.5.1 (Mar 15 2019)
- Feature: Updated native SDKs to their latest versions.
- Feature: View hierarchy is now dumped for the bug reports (iOS only)
- Feature: Touch events will now contain more information about controls being tapped (iOS only)
- Fix: In some rare cases, touch events may not be propagated to root views properly

## 1.5.0 (Feb 28 2019)
- Feature: Refactored symbols collection and uploading. Now we upload all symbols for all architectures and ABIs.

## 1.4.23 (Feb 25 2019)
- Update: Update iOS SDK to the latest version. Includes improved memory management in rendering pipeline.

## 1.4.22 (Feb 20 2019)
- Update: Update native SDKs to their latest versions

## 1.4.21 (Jan 1 2019)
- Fix: Update iOS SDK to 1.19.1 to prevent app crashing in some cases. For more info look [here](/sdk/ios/release-notes/)

## 1.4.20 (December 23 2018)
- Feature: Update native SDKs to latest versions. Now, in iOS SDK we use new video capturing mechanism, that is up to 10x faster than the previous one. This release also contains the fix for the device overheating issue (may occur in some rare cases).

## 1.4.19 (November 7 2018)
- Fix: Updated native Android SDK to fix a rare crash

## 1.4.18 (November 2 2018)
- Fix: Properly handle and pass through feedback messages on start
- Feature: Add a mechanism to wrap existing HttpMessageHandler instances in iOS applications

## 1.4.17 (October 9 2018)
- Update: Updated native SDK to bring latest fixes and improvements. iOS SDK: 1.18.16, Android SDK: 1.12.13

## 1.4.16 (September 28 2018)
- Fix: Avoid deadlock that causes symbols upload stuck forever during build

## 1.4.15 (September 28 2018)
- Fix: Build may end in some cases with XamlCTask failure

## 1.4.14 (September 26 2018)
- Fix: Refactor symbols uploading to prevent timing out

## 1.4.13 (September 25 2018)
- Fix: Updated native iOS SDK to fix crash on iOS 12

## 1.4.12 (September 20 2018)
- Fix: Updated native iOS SDK to fix issue with WKWebView requests interception

## 1.4.11 (September 4 2018)
- Feature: Update native native libraries to their latest versions

## 1.4.10 (August 30 2018)
- Fix: Native debug symbols (dSYM) are now properly uploaded for device specific builds

## 1.4.9 (August 20 2018)
- Fix: Debug symbols may miss some info when app is built in Debug configuration

## 1.4.8 (August 16 2018)
- Fix: Crash data aggregation failure in some rare cases

## 1.4.7 (August 16 2018)
- Fix: Some symbols were not collected during project build

## 1.4.6 (August 14 2018)
- Feature: Enable handling of UnobservedTaskException by default
- Fix: Improve generic types info collection on crashes/errors

## 1.4.5 (July 25 2018)
- Fix: Check all inputs passed by MSBuild to prevent build failure

## 1.4.4 (July 24 2018)
- Feature: Add _CaptureDeviceAndNetworkNames_ launch options that instructs Bugsee to not capture device name and names of WiFi spots and cellular providers
- Fix: During symbols transformation we now gather more info, which leads to a better stack traces

## 1.4.3 (June 19 2018)
- Feature: We now also capture Exception.Data and display it in dashboard

## 1.4.2 (June 7 2018)
- Fix: Fixed an issue with network filtering in iOS
- Feature: We now also logging any failures in network callbacks to the console

## 1.4.1 (May 27 2018)
- Feature: Added reporting UI triggering source (Android)

## 1.4.0 (May 23 2018)
- Feature: Added appearance options. Now you can tweak the look of issue Report and Feedback UIs [read more](/sdk/xamarin/appearance/)
- Feature: Stop and Relaunch are now available. You can now change Bugsee behavior at any time while your app is running [read more](/sdk/xamarin/configuration/)
- Feature: Keyboard can now be ignored when video is captured [read more](/sdk/xamarin/privacy/video/)
- Fix: Native debug symbols are now collected correctly

## 1.3.3 (Apr 25 2018)
- Feature: Internal native libraries are updated to latest version to leverage latest fixes and enhancements
- Feature: We now collect even more symbols by deeply digging into async constructs

## 1.3.2 (Apr 15 2018)
- Feature: Internal native libraries are updated to latest version to leverage latest fixes and enhancements
- Fix: Some iOS projects may crash when run on pre-9.x iOS

## 1.3.1 (Mar 15 2018)
- Feature: Enhanced network collection for Android and iOS

## 1.3.0 (Mar 15 2018)
- Feature: Internal native libraries are updated to latest version to leverage latest fixes and enhancements
- Feature: Enhanced symbols collection. We now capture and put more symbolication info into our symbol files
- Fix: Symbolication information is now properly collected after crash/error which leads to properly symbolicated stack traces

## 1.2.2 (Jan 26 2018)
- Fix: Do not lock target file during build on Windows
- Fix: Better symbols collection for Android projects

## 1.2.1 (Jan 20 2018)
- Fix: Use latest iOS library with important fixtures

## 1.2.0 (Jan 17 2018)
- Feature: Console logs filtering implemented

## 1.1.2 (Jan 10 2018)
- Fix: properly handle secure WebView elements in Android

## 1.1.1 (Dec 22 2017)
- Fix: Better exception handling when passed to LogException()
- Fix: Do not fail when empty message is passed to LogException()

## 1.1.0 (Nov 14 2017)
- Feature: Crash reporting reworked and enhanced. Now it's fully automated [read more](/sdk/xamarin/symbolication/)
- Feature: Added 'WifiOnlyUpload' option to allow uploading issues only on WiFi [read more](/sdk/xamarin/configuration/)
- Feature: Localization for Bugsee UI was added (currently RU locale only)
- Feature: ProGuard rules for Bugsee are now automatically added to target project upon build (if ProGuard is enabled in project settings)
- Fix: Custom attributes now accept any value on both iOS and Android

## 1.0.4 (Oct 10 2017)
- Maintenance and bug-fix release.

## 1.0.3 (Sep 9 2017)
- Maintenance and bug-fix release.

## 1.0.2 (Aug 31 2017)
- Maintenance and bug-fix release.

## 1.0.1 (Aug 25 2017)
- Maintenance and bug-fix release.

## 1.0.0 (Aug 24 2017)
- Initial release