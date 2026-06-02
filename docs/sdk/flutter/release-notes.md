---
title: "Release notes"
description: "Changelog for the Bugsee Flutter SDK listing new features, bug fixes, and breaking changes for each released version."
sidebar_position: 11
slug: "/sdk/flutter/release-notes"
---

## 9.0.3 (March 26 2026)
- Fix: Improper artifacts placement for iOS

## 9.0.2 (March 20 2026)
- Feat: Updated native SDKs to their latest versions (Android: [6.0.2](/sdk/android/release-notes/#602-march-11-2026), iOS: [6.1.2](/sdk/ios/release-notes/#612-march-4-2026))

## 9.0.0 (March 6 2026)
- Feat: Updated native SDKs to their latest versions (Android: [6.0.0](/sdk/android/release-notes/#600-december-9-2025), iOS: [6.1.2](/sdk/ios/release-notes/#612-march-4-2026))
- Breaking: \[iOS\] Minimum deployment target is iOS 12.0
- Breaking: \[Android\] Bugsee SDK is now built with Android SDK version 35, hence requires compileSDKVersion 35
- Breaking: \[Android\] AGP 8.6.0 or newer is now required

## 8.6.9 (November 18 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.9.1](/sdk/android/release-notes/#591-september-29-2025), iOS: [5.5.9](/sdk/ios/release-notes/#559-november-17-2025))

## 8.6.8 (October 15 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.9.1](/sdk/android/release-notes/#591-september-29-2025), iOS: [5.5.8](/sdk/ios/release-notes/#558-august-21-2025))

## 8.6.7 (September 23 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.8.7](/sdk/android/release-notes/#587-september-9-2025), iOS: [5.5.8](/sdk/ios/release-notes/#557-august-1-2025))

## 8.6.6 (August 21 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.8.4](/sdk/android/release-notes/#584-august-21-2025), iOS: [5.5.8](/sdk/ios/release-notes/#558-august-21-2025))

## 8.6.5 (June 12 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.5](/sdk/android/release-notes/#575-june-8-2025), iOS: [5.5.6](/sdk/ios/release-notes/#556-march-25-2025))
- Fix: \[Android\] In some configurations, application may crash on device with 16KB memory pages

## 8.6.4 (May 6 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.3](/sdk/android/release-notes/#573-may-5-2025), iOS: [5.5.6](/sdk/ios/release-notes/#556-march-25-2025))

## 8.6.3 (March 17 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.2](/sdk/android/release-notes/#572-march-17-2025), iOS: [5.5.5](/sdk/ios/release-notes/#555-february-13-2025))

## 8.6.0 - 8.6.2 (March 10 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.1](/sdk/android/release-notes/#571-march-4-2025), iOS: [5.5.5](/sdk/ios/release-notes/#555-february-13-2025))
- Feat: Swift Package Manager support added

## 8.5.0 (February 20 2025)
- Feat: Full Flutter 3.29 support
- Feat: Updated native SDKs to their latest versions (Android: [5.7.0](/sdk/android/release-notes/#570-february-12-2025), iOS: [5.5.5](/sdk/ios/release-notes/#555-february-13-2025))

## 8.4.3 (February 4 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.6.5](/sdk/android/release-notes/#565-february-3-2025), iOS: [5.5.4](/sdk/ios/release-notes/#554-january-27-2025))
- Fix: \[Android\] Built-in UI shifts upwards in some scenarios on Android 15 (specifically, when hosting application itself is targeting Android 15, i.e. target SDK version is 35)

## 8.4.2 (November 23 2024)
- Feat: Updated native SDKs to their latest versions (Android: 5.6.5, iOS: 5.5.4)

## 8.4.1 (November 20 2024)
- Feat: Internal improvements

## 8.4.0 (September 12 2024)
- Feat: Updated native SDKs to their latest versions (Android: 5.4.2, iOS: 5.3.2)
- Feat: \[Android\] Add support for 16KB memory pages
- Fix: \[Android\] Crash when bug is sent from built-in reporting UI after removing screenshot

## 8.3.0 (August 5 2024)
- Feat: Improved Isolate errors handling and corresponding new APIs

## 8.2.1 (April 24 2024)
- Fix: Use SDK version 34 for Android build

## 8.2.0 (April 22 2024)
- Fix: More reliable stack trace capture
- Feat: MonitorDiskSpace launch option is added

## 8.1.0 (April 19 2024)
- Fix: \[Android\] In some cases, video before FG->BG->FG transitions may be absent
- Note: \[Android\] compileSdkVersion 34 and up is now required

## 8.0.2 (April 11 2024)
- Feat: Updated dependencies to their latest versions (Android: 4.2.4, iOS: 5.0.2)

## 8.0.1 (April 11 2024)
- Feat: Updated dependencies to their latest versions (Android: 4.2.4, iOS: 5.0.0)

## 8.0.0 (January 15 2024)
- Feat: Updated dependencies to their latest versions
- Breaking: Minimal supported Dart SDK version is now 3.0.0

## 7.0.0 (December 25 2023)
- Feat: Updated native SDKs to their latest versions (Android: 4.2.1, iOS: 5.0.0)
- Breaking: \[iOS\] Bitcode is not present in the resulting binaries any more

## 6.1.0 (December 6 2023)
- Feat: Updated native SDKs to their latest versions (Android: 4.2.1, iOS: 4.1.0)

## 6.0.1 (October 2 2023)
- Feat: Updated native SDKs to their latest versions (Android: [4.0.1](/sdk/android/release-notes/#401-september-30-2023), iOS: [4.0.1](/sdk/ios/release-notes/#401-september-30-2023))

## 6.0.0 (September 25 2023)
- Feat: Updated native SDKs to their latest versions (Android: 4.0.0, iOS: 4.0.0)
- Feat: Full compatibility with iOS 17.0 and Android 14
- Breaking: \[iOS\] Minimum deployment target is iOS 11.0 (was 9.0)
- Breaking: \[iOS\] ARMv7 is not supported any more.
- Breaking: \[Android\] Bugsee SDK is build against Gradle 7.5, AGP 7.4.2
- Breaking: \[Android\] Bugsee SDK is build with targetSdk and compileSdk of version 33

## 5.4.0 (August 31 2023)
- Feat: Updated native SDKs to their latest versions (Android: 3.10.0, iOS: 3.8.0)
- Feat: Add new API to manually trigger view hierarchy capturing. Multiple view hierarchies support.

## 5.3.2 (August 17 2023)
- Fix: Build on iOS may fail due to invalid methods' signatures

## 5.3.1 (July 12 2023)
- Feat: Updated native SDKs to their latest versions (Android: 3.8.2, iOS: 3.7.1)
- Fix: \[Android\] In some circumstances crashes may not be reported

## 5.3.0 (June 6 2023)
- Feature: Update native SDKs to the latest versions (Android: 3.8.1, iOS: 3.6.0)
- Feature: Improved backward compatibility with upcoming versions of Flutter and Dart

## 5.2.0 (April 24 2023)
- Feature: Update native Android SDK to the latest version 3.7.0
- Feature: Improved interaction with the WebView. Now it's stable and captures more network requests.

## 5.1.0 (April 6 2023)
- Feature: Update native SDKs to the latest versions (Android: 3.6.0, iOS: 3.5.0)
- Feature: Ability to change placeholders for the input fields in the built-in bug reporting UI

## 5.0.5 (March 8 2023)
- Fix: Incorrect underlying Bugsee Android SDK was used. Now using (Android: 3.4.0, iOS: 3.3.3)

## 5.0.4 (February 26 2023)
- Feature: Updated native SDKs to its latest versions

## 5.0.3 (January 26 2022)
- Feature: Updated native SDKs to its latest versions

## 5.0.2 (November 24 2022)
- Feature: Update native SDKs to the latest versions (Android: 3.0.2, iOS: 3.2.1)
- Fix: Properly specify fallback value for 'compileSdkVersion'

## 5.0.1 (October 26 2022)
- Feature: Update native SDKs to the latest versions (Android: 3.0.0, iOS: 3.1.2)
- Fix: Secure rectangles serialization/deserialization issues

## 5.0.0 (October 14 2022)
- Breaking: Support for Flutter 2.X and earlier is dropped. Only Flutter 3.0 and up is now supported
- Fix: Exception may be thrown when showReportDialog() and upload() is called with no data

## 4.0.0 (September 6 2022)
- Fix: Properly intercept and filter network requests made from native code
- Feature: Update native SDKs to the latest versions (Android: 3.0.0, iOS: 3.0.0)
- Note: Please refer to the underlying SDKs release notes to get the detailed list of changes: [Android](/sdk/android/release-notes/#300-august-19-2022) / [iOS](/sdk/ios/release-notes/#300-september-1-2022)

## 3.1.0 (July 8 2022)
- Feat: Update public method types and improve code style

## 3.0.3 (May 30 2022)
- Feat: Update underlying SDKs to their latest versions (several race conditions were fixed)

## 3.0.2 (May 23 2022)
- Feat: Add missing parts (example and pubspec fields) to pub.dev package

## 3.0.1 (May 16 2022)
- Feat: Flutter 3 support

## 2.1.2 (April 18 2022)
- Feat: Update underlying SDKs to their latest versions
- Feat: View hierarchy now captures more data for each node

## 2.1.1 (April 8 2022)
- Fix: Add missing required components for view hierarchy capturing

## 2.1.0 (April 7 2022)
- Feat: View hierarchy is now also captured for the Flutter widget tree

## 2.0.0 (March 7 2022)
- Feat: Update underlying SDKs to their latest versions
- Fix: iOS SDK does not require cleanup script any more
- Feat: Secure views are now automatically obscured on video
- Breaking change: Underlying Bugsee Android SDK is now fully migrated to AndroidX

## 1.3.1 (January 17 2022)
- Fix: Add missing NotificationBarTrigger launch option for Android
- Feat: Update dependencies to their latest versions

## 1.3.0 (December 16 2021)
- Fix: In some rare cases not all crash reports may be sent to the server upon next relaunch \[iOS\]

## 1.2.0 (November 14 2021)
- Feat: Make Bugsee Flutter SDK compatible with Flutter pre-2.5

## 1.1.1 (November 9 2021)
- Fix: Properly intercept all console logs
- Fix: Do not block/hang when Bugsee is launched from background app

## 1.1.0 (October 4 2021)
- Feat: Update native SDKs to their latest versions
- Feat: Make SDK compatible and fully functional on iOS 15 and Android 12

## 1.0.8 (September 17 2021)
- Fix: Make code compatible with Flutter 2.5

## 1.0.7 (August 9 2021)
- Fix: Build failure with CocoaPods 1.10.2

## 1.0.6 (July 25 2021)
- Fix: Previous deployment ended up with inconsistent versions. This follow up release fixes it

## 1.0.5 (July 25 2021)
- Fix: Properly populate versions for Bugsee Flutter wrapper and native Bugsee SDKs

## 1.0.4 (July 18 2021)
- Fix: Properly handle exceptions with empty stack traces

## 1.0.3 (July 10 2021)
- Fix: Add missing checks in the Android bridging module

## 1.0.2 (July 6 2021)
- Fix: Fixing iOS build failure in some environments

## 1.0.1 (June 28 2021)
- Fix: Network events interception and filtering

## 1.0.0 (May 25 2021)
- Initial release
