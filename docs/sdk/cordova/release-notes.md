---
title: "Release notes"
description: "Full version history of the Bugsee Cordova SDK, including new features, breaking changes, and bug fixes for each release."
sidebar_position: 7
slug: "/sdk/cordova/release-notes"
---

## 7.0.1 (March 20 2026)
- Feat: Updated native SDKs to their latest versions (Android: [6.0.2](/sdk/android/release-notes/#602-march-11-2026), iOS: [6.1.2](/sdk/ios/release-notes/#612-march-4-2026))

## 7.0.0 (March 6 2026)
- Feat: Updated native SDKs to their latest versions (Android: [6.0.0](/sdk/android/release-notes/#600-december-9-2025), iOS: [6.1.2](/sdk/ios/release-notes/#612-march-4-2026))
- Breaking: \[iOS\] Minimum deployment target is iOS 12.0
- Breaking: \[Android\] Bugsee SDK is now built with Android SDK version 35, hence requires compileSDKVersion 35
- Breaking: \[Android\] AGP 8.6.0 or newer is now required

## 6.3.5 (November 18 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.9.1](/sdk/android/release-notes/#591-september-29-2025), iOS: [5.5.9](/sdk/ios/release-notes/#559-november-17-2025))

## 6.3.4 (August 21 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.8.4](/sdk/android/release-notes/#584-august-21-2025), iOS: [5.5.8](/sdk/ios/release-notes/#558-august-21-2025))

## 6.3.3 (June 12 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.5](/sdk/android/release-notes/#575-june-8-2025), iOS: [5.5.6](/sdk/ios/release-notes/#556-march-25-2025))
- Fix: \[Android\] In some configurations, application may crash on device with 16KB memory pages

## 6.3.2 (May 6 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.3](/sdk/android/release-notes/#573-may-5-2025), iOS: [5.5.6](/sdk/ios/release-notes/#556-march-25-2025))

## 6.3.1 (February 4 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.6.5](/sdk/android/release-notes/#565-february-3-2025), iOS: [5.5.4](/sdk/ios/release-notes/#554-january-27-2025))
- Fix: \[Android\] Built-in UI shifts upwards in some scenarios on Android 15 (specifically, when hosting application itself is targeting Android 15, i.e. target SDK version is 35)

## 6.3.0 (September 12 2024)
- Feat: Updated native SDKs to their latest versions (Android: 5.4.2, iOS: 5.3.2)
- Feat: \[Android\] Add support for 16KB memory pages
- Fix: \[Android\] Crash when bug is sent from built-in reporting UI after removing screenshot

## 6.2.0 (April 11 2024)
- Fix: \[Android\] In some cases, video before FG->BG->FG transitions may be absent
- Note: \[Android\] compileSdkVersion 34 and up is now required

## 6.1.0 (April 11 2024)
- Feat: Updated native SDKs to their latest versions (Android: 4.2.4, iOS: 5.0.2)

## 6.0.0 (December 26 2023)
- Feat: Updated native SDKs to their latest versions (Android: 4.2.1, iOS: 5.0.0)
- Breaking: \[iOS\] Bitcode is not present in the resulting binaries any more

## 5.1.0 (December 6 2023)
- Feat: Updated native SDKs to their latest versions (Android: 4.2.1, iOS: 4.1.0)

## 5.0.0 (October 2 2023)
- Feat: Updated native SDKs to their latest versions (Android: [4.0.1](/sdk/android/release-notes/#401-september-30-2023), iOS: [4.0.1](/sdk/ios/release-notes/#401-september-30-2023))
- Breaking: Changes for the underlying SDKs: [Android](/sdk/android/release-notes/#401-september-30-2023) and [iOS](/sdk/ios/release-notes/#401-september-30-2023).

## 4.1.0 (February 26 2023)
- Feature: Updated native Android SDKs to its latest versions \[iOS: 3.3.3, Android: 3.4.0\]

## 4.0.1 (November 28 2022)
- Feature: Updated native Android SDKs to its latest versions

## 4.0.0 (September 13 2022)
- Feature: Update native SDKs to the latest versions (Android: 3.0.0, iOS: 3.0.0)
- Note: Please refer to the underlying SDKs release notes to get the detailed list of changes: [Android](/sdk/android/release-notes/#300-august-19-2022) / [iOS](/sdk/ios/release-notes/#300-september-1-2022)

## 3.1.0 (June 1 2022)
- Feature: Updated native Android SDKs to its latest versions. Several race conditions are fixed

## 3.0.0 (March 21 2022)
- Feature: Updated native Android and iOS SDKs to its latest versions \[iOS: [2.1.0](/sdk/ios/release-notes/#210-march-5-2022), Android: [2.0.7](/sdk/android/release-notes/#207-march-11-2022\]

## 2.7.0 (December 13 2021)
- Feat: Update native iOS Bugsee SDK to 2.0.0 (dynamic XCFramework)
- Feat: Update native Android Bugsee SDK to 1.21.4

## 2.6.0 (October 4 2021)
- Feature: Updated native Android SDKs to its latest versions. They include full support for iOS 15 and Android 12

## 2.5.3 (March 4 2021)
- Feat: Update native iOS Bugsee SDKs to its latest version

## 2.5.2 (March 2 2021)
- Fix: Error when handling some specific values passed into console
- Feat: Update native Bugsee SDKs to their latest versions

## 2.5.1 (February 5 2021)
- Feat: Update native Bugsee SDKs to their latest versions to fix launch failure on Android

## 2.5.0 (February 1 2021)
- Feat: Update native Bugsee SDKs to their latest versions

## 2.4.3 (August 31 2020)
- Feat: Update native Bugsee SDKs to their latest versions

## 2.4.2 (August 11 2020)
- Feat: Update native Android SDK to its latest version \[1.19.0\]

## 2.4.1 (June 9 2020)
- Feat: Updated native SDKs to their latest versions

## 2.4.0 (April 27 2020)
- Feat: Improvements in exceptions handling

## 2.3.1 (April 7 2020)
- Fix: Update native SDK, to disable on-device symbolication by default to prevent application crash \[iOS\]

## 2.3.0 (March 25 2020)
- Feat: Switch to using references to native Bugsee SDKs instead of bundling them
- Fix: Make module work with Ionic with Capacitor

## 2.2.1 (January 21 2020)
- Fix: Missing header for iOS

## 2.2.0 (June 27 2019)
- Fix: Memory leak in report controller (iOS)
- Feature: Update native SDKs to the latest versions
- Feature: Add option to control bluetooth state monitoring (iOS)

## 2.1.0 (Mar 27 2019)
- Fix: Update iOS SDK to the latest version to fix a rare crash during view hierarchy capturing

## 2.0.0
- Massive revamp. New implementation and APIs.

## 1.0.1-27 (Sep 14 2016)
- Maintenance and bug-fix releases.

## 1.0.0 (Aug 16 2016)
- Initial release