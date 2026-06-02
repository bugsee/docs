---
title: "Release notes"
description: "Changelog for the Bugsee React Native SDK listing new features, bug fixes, and breaking changes for each released version."
sidebar_position: 11
slug: "/sdk/react_native/release-notes"
---

## 6.0.2 (March 20 2026)
- Feat: Updated native SDKs to their latest versions (Android: [6.0.2](/sdk/android/release-notes/#602-march-11-2026), iOS: [6.1.2](/sdk/ios/release-notes/#612-march-4-2026))

## 6.0.0 (March 6 2026)
- Feat: Updated native SDKs to their latest versions (Android: [6.0.0](/sdk/android/release-notes/#600-december-9-2025), iOS: [6.1.2](/sdk/ios/release-notes/#612-march-4-2026))
- Breaking: \[iOS\] Minimum deployment target is iOS 12.0
- Breaking: \[Android\] Bugsee SDK is now built with Android SDK version 35, hence requires compileSDKVersion 35
- Breaking: \[Android\] AGP 8.6.0 or newer is now required

## 5.5.10 (November 18 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.9.1](/sdk/android/release-notes/#591-september-29-2025), iOS: [5.5.9](/sdk/ios/release-notes/#559-november-17-2025))

## 5.5.9 (October 15 2025)
- Fix: \[Android\] In some scenarios, SDK may fail to launch

## 5.5.8 (October 15 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.9.1](/sdk/android/release-notes/#591-september-29-2025), iOS: [5.5.8](/sdk/ios/release-notes/#558-august-21-2025))

## 5.5.7 (August 21 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.8.4](/sdk/android/release-notes/#584-august-21-2025), iOS: [5.5.8](/sdk/ios/release-notes/#558-august-21-2025))

## 5.5.6 (August 8 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.8.3](/sdk/android/release-notes/#583-august-8-2025), iOS: [5.5.7](/sdk/ios/release-notes/#557-august-1-2025))

## 5.5.5 (June 7 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.8.2](/sdk/android/release-notes/#582-august-7-2025), iOS: [5.5.7](/sdk/ios/release-notes/#557-august-1-2025))

## 5.5.4 (June 12 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.5](/sdk/android/release-notes/#575-june-8-2025), iOS: [5.5.6](/sdk/ios/release-notes/#556-march-25-2025))
- Fix: \[Android\] In some configurations, application may crash on device with 16KB memory pages

## 5.5.3 (May 6 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.3](/sdk/android/release-notes/#573-may-5-2025), iOS: [5.5.6](/sdk/ios/release-notes/#556-march-25-2025))

## 5.5.2 (March 10 2025)
- Fix: Build failure on Android
- Feat: Updated native SDKs to their latest versions (Android: [5.7.2](/sdk/android/release-notes/#572-march-17-2025), iOS: [5.5.6](/sdk/ios/release-notes/#556-march-25-2025))

## 5.5.1 (March 10 2025)
- Feat: Add option to enable native crashes interception in Android SDK (NdkCrashReport)

## 5.5.0 (March 10 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.1](/sdk/android/release-notes/#571-march-4-2025), iOS: [5.5.5](/sdk/ios/release-notes/#555-february-13-2025))
- Feat: React Native "New architecture" support

## 5.4.3 (February 4 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.6.5](/sdk/android/release-notes/#565-february-3-2025), iOS: [5.5.4](/sdk/ios/release-notes/#554-january-27-2025))
- Fix: \[Android\] Built-in UI shifts upwards in some scenarios on Android 15 (specifically, when hosting application itself is targeting Android 15, i.e. target SDK version is 35)

## 5.4.2 (January 22 2025)
- Fix: \[Android\] Network requests may not complete when custom networking libraries are used

## 5.4.1 (January 14 2025)
- Fix: \[Android\] Ensure Bugsee notification entry is displayed right away when runtime notification permission is granted from within application

## 5.4.0 (January 9 2025)
- Feat: Updated native SDKs to their latest versions (Android: 5.6.1, iOS: 5.5.3)
- Feat: Add support for bug reporting via screenshot gesture on Android

## 5.3.0 (September 12 2024)
- Feat: Updated native SDKs to their latest versions (Android: 5.4.2, iOS: 5.3.2)
- Feat: \[Android\] Add support for 16KB memory pages
- Fix: \[Android\] Crash when bug is sent from built-in reporting UI after removing screenshot

## 5.2.0 (September 2 2024)
- Feat: Updated native SDKs to their latest versions (Android: 5.3.1, iOS: 5.3.2)

## 5.1.2 (May 08 2024)
- Fix: \[Android\] Video may be absent on some devices with Unisoc chipsets

## 5.1.1 (April 19 2024)
- Fix: \[Android\] In some cases, video before FG->BG->FG transitions may be absent
- Note: \[Android\] compileSdkVersion 34 and up is now required

## 5.1.0 (April 19 2024)
- Note: Broken release, please update to 5.1.1 or later

## 5.0.4 (April 18 2024)
- Fix: Sourcemaps were not uploaded properly in some cases for Android

## 5.0.3 (April 11 2024)
- Feat: Updated native SDKs to their latest versions (Android: 4.2.4, iOS: 5.0.2)

## 5.0.2 (April 2 2024)
- Fix: "handleRejections" launch option may not be respected in some cases

## 5.0.1 (March 21 2024)
- Feat: Updated native SDKs to their latest versions (Android: 4.2.4, iOS: 5.0.0)

## 5.0.0 (December 25 2023)
- Feat: Updated native SDKs to their latest versions (Android: 4.2.1, iOS: 5.0.0)
- Breaking: \[iOS\] Bitcode is not present in the resulting binaries any more

## 4.1.0 (December 6 2023)
- Feat: Updated native SDKs to their latest versions (Android: 4.2.1, iOS: 4.1.0)

## 4.0.0 (October 2 2023)
- Feat: Updated native SDKs to their latest versions (Android: [4.0.1](/sdk/android/release-notes/#401-september-30-2023), iOS: [4.0.1](/sdk/ios/release-notes/#401-september-30-2023))
- Breaking: Changes for the underlying SDKs: [Android](/sdk/android/release-notes/#401-september-30-2023) and [iOS](/sdk/ios/release-notes/#401-september-30-2023).
  
## 3.2.0 (September 1 2023)
- Feat: Updated native SDKs to their latest versions (Android: 3.10.0, iOS: 3.8.0)
- Feat: Add new API to manually trigger view hierarchy capturing. Multiple view hierarchies support.

## 3.1.3 (August 4 2023)
- Feat: Updated underlying Android SDKs to its latest version (3.8.3)
- Fix: \[Android\] Deadlock in some specific scenario when application comes to foreground

## 3.1.2 (July 12 2023)
- Feat: Updated native SDKs to their latest versions (Android: 3.8.2, iOS: 3.7.1)
- Fix: \[Android\] In some circumstances crashes may not be reported

## 3.1.1 (June 20 2023)
- Fix: Issue with logException() on iOS

## 3.1.0 (June 12 2023)
- Fix: Properly respect MonitorNetwork option during relaunch

## 3.0.10 (February 26 2023)
- Feature: Update native SDKs to the latest versions (Android: 3.4.0, iOS: 3.3.3)

## 3.0.9 (February 14 2023)
- Fix: Crash when attachment data contained non-text value (e.g. object, array, etc)

## 3.0.8 (January 26 2023)
- Feature: Update native SDKs to the latest versions (Android: 3.4.0, iOS: 3.3.2)
- Fix: \[Android\] Video was disabled on some Samsung devices due to the restrictive internal checks

## 3.0.7 (January 24 2023)
- Fix: Workaround for a bug in React Native build script which caused source maps collection failure

## 3.0.6 (January 23 2023)
- Fix: Incorrect selector in iOS bridging module may cause build errors

## 3.0.5 (January 20 2023)
- Feature: Update native SDKs to the latest versions (Android: 3.3.0, iOS: 3.3.2)

## 3.0.4 (December 7 2022)
- Fix: Some async exceptions were not properly handled which caused missing video and data in the consequent bug/error/crash reports
- Feature: Update native SDKs to the latest versions (Android: 3.1.0, iOS: 3.3.1)

## 3.0.3 (November 28 2022)
- Feature: Update native SDKs to the latest versions (Android: 3.0.2, iOS: 3.2.1)

## 3.0.2 (October 5 2022)
- Feature: Add fallbacks for Gradle properties (compileSdkVersion, targetSdkVersion, buildToolsVersion)

## 3.0.1 (October 4 2022)
- Fix: Messages sent to Bugsee.log() may not be registered properly

## 3.0.0 (September 19 2022)
- Feature: Update native SDKs to the latest versions (Android: 3.0.0, iOS: 3.0.0)
- Feature: Reworked debugging information uploading mechanism (source maps uploading) which is now fully automatic
- Note: Please refer to the underlying SDKs release notes to get the detailed list of changes: [Android](/sdk/android/release-notes/#300-august-19-2022) / [iOS](/sdk/ios/release-notes/#300-september-1-2022)

## 2.10.3 (June 1 2022)
- Feature: Updated native Android SDKs to its latest versions. Several race conditions are fixed

## 2.10.2 (May 11 2022)
- Feature: Updated native Android/iOS SDKs to their latest versions

## 2.10.1 (April 28 2022)
- Feature: Updated native Android/iOS SDKs to their latest versions

## 2.10.0 (April 14 2022)
- Feature: Updated native Android/iOS SDKs to their latest versions

## 2.9.1 (March 22 2022)
- Fix: Some network events were not captured properly when network filter was set (on Android)

## 2.9.0 (March 16 2022)
- Feature: Updated native iOS SDKs to its latest version
- Feature: Clean script is not required any more for iOS project

## 2.8.0 (February 04 2022)
- Feature: Updated native iOS SDKs to its latest version
- Feature: iOS SDK is not bundled within the NPM package any more, but rather is fetched via CocoaPods

## 2.7.0 (January 26 2022)
- Feature: Updated native SDKs to its newer versions.
- Fix \[iOS\]: Crash during video capture in some specific conditions

## 2.6.1 (November 12 2021)
- Feature: Improve exception information handling for better symbolication of JS call stacks

## 2.6.0 (October 4 2021)
- Feature: Updated native Android SDKs to its latest versions. They include full support for iOS 15 and Android 12

## 2.5.1 (August 12 2021)
- Feature: Automatically generate stack trace when non-Error instance is supplied to logException

## 2.5.0 (August 3 2021)
- Feature: Updated native Android SDKs to its latest versions. It includes many updates to embedded dependencies to mitigate the NonSdkApi warnings and errors.

## 2.4.6 (June 18 2021)
- Fix: Add missing reporting UI controlling flags to launch options

## 2.4.5 (June 17 2021)
- Fix: In some rare cases launch options may not be sent to the underlying SDKs correctly

## 2.4.4 (June 13 2021)
- Fix: Properly handle symbolication result from built-in symbolicator

## 2.4.3 (June 8 2021)
- Feature: Updated native SDKs to their latest versions
- Feature: Add video fallback mode launch option for Android

## 2.4.2 (May 17 2021)
- Feature: Updated native SDKs to their latest versions

## 2.4.1 (April 20 2021)
- Feature: Updated native SDKs to their latest versions

## 2.4.0 (February 24 2021)
- Feature: Updated native SDKs to their latest versions
- Feature: Improve autolinking support

## 2.3.8 (February 10 2021)
- Feature: Updated native SDKs to their latest versions

## 2.3.7 (November 10 2020)
- Feature: Updated native SDKs to their latest versions

## 2.3.6 (August 31 2020)
- Feature: Updated native SDKs to their latest versions

## 2.3.5 (August 11 2020)
- Feature: Updated native Android SDK to its latest version \[1.19.0\]

## 2.3.4 (June 9 2020)
- Feature: Updated native SDKs to their latest versions

## 2.3.3 (April 14 2020)
- Fix: Rare crash when using ref statements and node is not found

## 2.3.2 (June 7 2020)
- Feature: Updated native SDKs to their latest versions

## 2.3.1 (April 7 2020)
- Fix: Update native SDK, to disable on-device symbolication by default to prevent application crash \[iOS\]

## 2.2.2 (February 25 2020)
- Feature: Update native SDKs

## 2.2.1 (June 27 2019)
- Fix: Memory leak in report controller (iOS)

## 2.2.0 (June 21 2019)
- Feature: Add option to control bluetooth state monitoring (iOS)
- Feature: Add support for lifecycle events

## 2.0.14 (Mar 27 2019)
- Fix: Update iOS SDK to the latest version to fix a rare crash during view hierarchy capturing

## 2.0.13 (Mar 15 2019)
- Fix: Updated Android SDK to the latest version containing the fix for touch interception

## 2.0.12 (Mar 11 2019)
- Feature: Expose methods to trigger JS and native crashes manually

## 2.0.9 - 2.0.11 (Mar 4 2019)
- Fix: Correctly define and use Launch options in index.ts file

## 2.0.8 (Jan 29 2019)
- Fix: Properly check for Podfile presence during linking to prevent failure

## 2.0.1 - 2.0.7 (Jan 14 2019)
- Fix: Duplicate iOS crash/error reports
- Fix: Some crashes do not merge properly
- Fix: Fix automatic Bugsee iOS SDK module linking (via 'react-native link')
- Other minor improvements

## 2.0.1 (Jan 1 2019)
- Fix: Update iOS SDK to 1.19.1 to prevent app crashing in some cases. For more info look [here](/sdk/ios/release-notes/)

## 2.0.0 (December 26 2018)
- Feature: Much easier installation and initialization (via 'react-native link')
- Feature: New module design. Now everything can be controlled from JS
- Feature: Add support for custom attachments
- Feature: New exceptions capturing mechanism

## 1.1.0 (May 31 2018)
- Feature: Network and console logs filters (privacy)
- Feature: Enable/disable keyboard capture (privacy, iOS-only)
- Feature: Secure rectangles. Allows explicitly specify area which must be concealed from recording.
- Feature: Source maps. Added support for source maps to properly symbolicate stack traces for minified JS sources.

## 1.0.8 (Aug 31 2017)
- Maintenance and bug-fix release.

## 1.0.7 (Apr 11 2017)
- Maintenance and bug-fix release.

## 1.0.6 (Mar 7 2017)
- Maintenance and bug-fix release.

## 1.0.5 (Mar 4 2017)
- Maintenance and bug-fix release.

## 1.0.4 (Mar 4 2017)
- Maintenance and bug-fix release.

## 1.0.3 (Dec 16 2016)
- Maintenance and bug-fix release.

## 1.0.2 (Oct 13 2016)
- Maintenance and bug-fix release.

## 1.0.1 (Sep 14 2016)
- Maintenance and bug-fix release.

## 1.0.0 (Sep 14 2016)
- Initial release