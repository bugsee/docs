---
title: "Release notes"
description: "Changelog for the Bugsee Unity SDK, listing all version updates, new features, bug fixes, and breaking changes."
sidebar_position: 10
slug: "/sdk/unity/release-notes"
---

## 6.0.2 (March 20 2026)
- Feat: Updated native SDKs to their latest versions (Android: [6.0.2](/sdk/android/v6/release-notes/#602-march-11-2026), iOS: [6.1.2](/sdk/ios/release-notes/#612-march-4-2026))

## 6.0.0 (March 6 2026)
- Feat: Updated native SDKs to their latest versions (Android: [6.0.0](/sdk/android/v6/release-notes/#600-december-9-2025), iOS: [6.1.2](/sdk/ios/release-notes/#612-march-4-2026))
- Breaking: \[iOS\] Minimum deployment target is iOS 12.0
- Breaking: \[Android\] Bugsee SDK is now built with Android SDK version 35, hence requires compileSDKVersion 35
- Breaking: \[Android\] AGP 8.6.0 or newer is now required

## 5.3.9 (December 5 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.9.3](/sdk/android/v6/release-notes/#593-december-4-2025), iOS: [5.5.9](/sdk/ios/release-notes/#559-november-17-2025))

## 5.3.8 (November 18 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.9.1](/sdk/android/v6/release-notes/#591-september-29-2025), iOS: [5.5.9](/sdk/ios/release-notes/#559-november-17-2025))

## 5.3.7 (August 21 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.8.4](/sdk/android/v6/release-notes/#584-august-21-2025), iOS: [5.5.8](/sdk/ios/release-notes/#558-august-21-2025))

## 5.3.6 (July 10 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.6](/sdk/android/v6/release-notes/#576-june-19-2025), iOS: [5.5.6](/sdk/ios/release-notes/#556-march-25-2025))
- Fix: \[iOS\] In some configurations, build may fail with "Undefined symbols" error

## 5.3.5 (June 8 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.5](/sdk/android/v6/release-notes/#575-june-8-2025), iOS: [5.5.6](/sdk/ios/release-notes/#556-march-25-2025))
- Fix: \[Android\] In some configurations, application may crash on device with 16KB memory pages

## 5.3.4 (May 6 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.3](/sdk/android/v6/release-notes/#573-may-5-2025), iOS: [5.5.6](/sdk/ios/release-notes/#556-march-25-2025))

## 5.3.3 (April 22 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.2](/sdk/android/v6/release-notes/#572-march-17-2025), iOS: [5.5.6](/sdk/ios/release-notes/#556-march-25-2025)) 

## 5.3.2 (February 4 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.6.5](/sdk/android/v6/release-notes/#565-february-3-2025), iOS: [5.5.4](/sdk/ios/release-notes/#554-january-27-2025))
- Fix: \[Android\] Built-in UI shifts upwards in some scenarios on Android 15 (specifically, when hosting application itself is targeting Android 15, i.e. target SDK version is 35)

## 5.3.1 (September 12 2024)
- Feat: Updated native SDKs to their latest versions (Android: 5.4.2, iOS: 5.3.2)
- Fix: \[Android\] Crash when bug is sent from built-in reporting UI after removing screenshot

## 5.3.0 (September 9 2024)
- Feat: Updated native SDKs to their latest versions (Android: 5.4.1, iOS: 5.3.2)
- Feat: \[Android\] 16KB memory pages support

## 5.2.0 (April 23 2024)
- Fix: \[Android\] In some cases, video before GF->BG->FG transitions may be absent
- Note: \[Android\] compileSdkVersion 34 and up is now required

## 5.1.0 (April 11 2024)
- Feat: Updated native SDKs to their latest versions (Android: 4.2.4, iOS: 5.0.2)

## 5.0.0 (January 10 2024)
- Feat: Updated native SDKs to their latest versions (Android: 4.2.1, iOS: 5.0.0)
- Breaking: \[iOS\] Bitcode is not present in the resulting binaries any more

## 4.0.0 (October 2 2023)
- Feat: Updated native SDKs to their latest versions (Android: [4.0.1](/sdk/android/v6/release-notes/#401-september-30-2023), iOS: [4.0.1](/sdk/ios/release-notes/#401-september-30-2023))
- Breaking: Changes for the underlying SDKs: [Android](/sdk/android/v6/release-notes/#401-september-30-2023) and [iOS](/sdk/ios/release-notes/#401-september-30-2023).

## 3.3.0 (September 4 2023)
- Feat: Updated native SDKs to their latest versions (Android: 3.10.0, iOS: 3.8.0)
- Feat: Add new API to manually trigger view hierarchy capturing. Multiple view hierarchies support.

## 3.2.0 (April 12 2023)
- Feature: Add Appearance API support \[[Learn more](/sdk/unity/appearance/)\]

## 3.1.0 (April 6 2023)
- Feature: Update native SDKs to the latest versions (Android: 3.6.0, iOS: 3.5.0)

## 3.0.5 (March 3 2023)
- Feature: Update native SDKs to the latest versions (Android: 3.4.0, iOS: 3.3.3)

## 3.0.4 (January 31 2023)
- Feature: Update native SDKs to the latest versions (Android: 3.4.0, iOS: 3.3.2)

## 3.0.3 (November 25 2022)
- Feature: Update native SDKs to the latest versions (Android: 3.1.0, iOS: 3.3.2)
- Feature: On iOS, captured video is now brighter than before and should be aligned (in brightness) with actual picture on real device

## 3.0.2 (November 25 2022)
- Feature: Update native SDKs to the latest versions (Android: 3.0.2, iOS: 3.2.1)

## 3.0.1 (October 25 2022)
- Feature: Update native SDKs to the latest versions (Android: 3.0.0, iOS: 3.1.1)
- Fix: "OSLog.framework" is not mandatory now

## 3.0.0 (September 2 2022)
- Feature: Update native SDKs to the latest versions (Android: 3.0.0, iOS: 3.0.0)
- Note: Please refer to the underlying SDKs release notes to get the detailed list of changes: [Android](/sdk/android/v6/release-notes/#300-august-19-2022) / [iOS](/sdk/ios/release-notes/#300-september-1-2022)
- Note: On iOS, “OSLog.framework” needs to be added to your project with Bugsee in Xcode into “Frameworks, Libraries and Embedded Content” to fix this. This is required as now Bugsee is able to intercept OSLog-based logged data.


## 2.0.3 (August 16 2022)
- Feature: Updated native Android SDKs to its latest version. Improvements for Unity as a Library scenario

## 2.0.2 (June 1 2022)
- Feature: Updated native Android SDKs to its latest version. Several race conditions are fixed

## 2.0.1 (May 11 2022)
- Feature: Update native SDKs to the latest versions (Android: 2.1.2, iOS: 2.1.7)

## 2.0.0 (Mar 23 2022)
- Feature: Update native SDKs to the latest versions (Android: 2.0.7, iOS: 2.1.1)
- Breaking change: Underlying Bugsee SDK was built with the iOS SDK 15.0
- Breaking change: Underlying Bugsee Android SDK is now completely AndroidX-based

## 1.8.0 (Dec 22 2021)
- Feature: Update native Android SDK to the latest version

## 1.7.6 (Aug 9 2021)
- Feature: Update native Android SDK to the latest version

## 1.7.5 (Dec 11 2020)
- Fix: Broken AddSecureRect API on Android
- Fix: Missing ClearAllAttributes API on Android
- Feature: Update native iOS SDK to the latest version

## 1.7.4 (Aug 31 2020)
- Feature: Update native SDKs to the latest versions

## 1.7.3 (Jun 15 2020)
- Fix: Build failure for Unity 2019+

## 1.7.2 (Jun 9 2020)
- Feature: Update native SDKs to their latest versions (Android: 1.18.0, iOS: 1.25.6)

## 1.7.1 (April 7 2020)
- Fix: Update native SDK, to disable on-device symbolication by default to prevent application crash \[iOS\]

## 1.7.0 (March 27 2020)
- Feature: Improve backward compatibility with older versions of Unity and .NET
- Feature: Update native SDKs to their latest versions (Android: 1.17.3, iOS: 1.25.3)

## 1.6.2 (December 12 2019)
- Fix: Completely strip all the references to UIWebView \[iOS\]

## 1.6.1 (December 8 2019)
- Fix: Do not report errors logged with Debug.LogError()
- Fix: Degrade syntax to make code backward compatible with previous Unity versions

## 1.6.0 (Nov 28 2019)
- Feature: Native SDKs are updated to their latest versions
- Fix: inconsistency in handled/unhandled report state propagation for iOS/Android

## 1.5.0 (Sep 27 2019)
- Fix: Make input fields in reporting UI always accessible \[iOS\]
- Fix: Do not skip WebView requests \[Android\]
- Feature: Add support for Android 10 \[Android\]
- Feature: Improve crashes and errors
- Native SDKs are updated to their latest versions

## 1.4.3 (Sep 16 2019)
- Fix: Crashes in video rendering pipeline
- Native SDKs are updated to their latest versions

## 1.4.2 (Jul 17 2019)
- Native SDKs are updated to their latest versions

## 1.4.1 (Jun 27 2019)
- Native SDKs are updated to their latest versions

## 1.4.0 (Jun 12 2019)
- Feature: lifecycle events are now supported
- Native SDKs are updated to their latest versions

## 1.3.1 (Dec 12 2018)
- Maintenance update

## 1.3.0 (Dec 11 2018)
- Update: Native SDKs are updated to its latest versions (contains fixes for known issues)

## 1.2.10 (Oct 26 2018)
- Feature: attachments are supported now both on iOS and Android platforms [read more](/sdk/unity/custom/)
- Fix: handle exceptions, thrown from worker threads, properly

## 1.2.9 (Sep 24 2018)
- Update iOS to 1.18.15 to fix iOS12 crash when collecting extended crash data

## 1.2.8 (Aug 28 2018)
- Feature: Add getDeviceID() method
- Bug fixes: various stability fixes
- Use iOS SDK 1.18.11 and Android SDK 1.12.9

## 1.2.7 (Apr 10 2018)
- Feature: Hide screen regions from video [read more](/sdk/unity/privacy/video/)
- Feature: SDK can now be stopped and relaunched [read more](/sdk/unity/configuration/)
- Feature: Video on Android is now disabled by default
- Updated native SDK: iOS 1.18.0 and Android SDK 1.11.8
- Minor bug fixes

## 1.2.6 (Mar 9 2018)
- Updated native SDK: iOS 1.17.20
- Feature: VideoScale option [read more](/sdk/unity/configuration/)
- Minor bug fixes