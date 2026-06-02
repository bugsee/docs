---
title: "Release notes"
description: "Full version history of the Bugsee .NET SDK, including new features, breaking changes, and bug fixes for each release."
sidebar_position: 11
slug: "/sdk/dotnet/release-notes"
---

## 6.0.2 (March 20 2026)
- Feat: Updated native SDKs to their latest versions (Android: [6.0.2](/sdk/android/release-notes/#602-march-11-2026), iOS: [6.1.2](/sdk/ios/release-notes/#612-march-4-2026))

## 6.0.0 (March 6 2026)
- Feat: Updated native SDKs to their latest versions (Android: [6.0.0](/sdk/android/release-notes/#600-december-9-2025), iOS: [6.1.2](/sdk/ios/release-notes/#612-march-4-2026))
- Breaking: \[iOS\] Minimum deployment target is iOS 12.0
- Breaking: \[Android\] Bugsee SDK is now built with Android SDK version 35, hence requires compileSDKVersion 35
- Breaking: \[Android\] AGP 8.6.0 or newer is now required

## 5.8.11 (February 18 2026)
- Fix: Duplicated embedded .so files

## 5.8.10 (February 18 2026)
- Fix: Build warnings

## 5.8.9 (February 18 2026)
- Fix: Updated vulnerable dependencies

## 5.8.8 (February 11 2026)
- Fix: Touches interception interference with some UI components

## 5.8.7 (November 18 2025)
- Fix: Build failure on .NET 10 due to missing package name

## 5.8.6 (November 18 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.9.1](/sdk/android/release-notes/#591-september-29-2025), iOS: [5.5.9](/sdk/ios/release-notes/#559-november-17-2025))

## 5.8.5 (August 21 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.8.4](/sdk/android/release-notes/#584-august-21-2025), iOS: [5.5.8](/sdk/ios/release-notes/#558-august-21-2025))

## 5.8.4 (June 12 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.5](/sdk/android/release-notes/#575-june-8-2025), iOS: [5.5.6](/sdk/ios/release-notes/#556-march-25-2025))
- Fix: \[Android\] In some configurations, application may crash on device with 16KB memory pages

## 5.8.3 (May 5 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.3](/sdk/android/release-notes/#573-may-5-2025), iOS: [5.5.6](/sdk/ios/release-notes/#556-march-25-2025))

## 3.8.2 (April 21 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.7.2](/sdk/android/release-notes/#572-march-17-2025), iOS: [5.5.6](/sdk/ios/release-notes/#556-march-25-2025))

## 3.8.1 (February 4 2025)
- Feat: Updated native SDKs to their latest versions (Android: [5.6.5](/sdk/android/release-notes/#565-february-3-2025), iOS: [5.5.4](/sdk/ios/release-notes/#554-january-27-2025))
- Fix: \[Android\] Built-in UI shifts upwards in some scenarios on Android 15 (specifically, when hosting application itself is targeting Android 15, i.e. target SDK version is 35)

## 3.8.0 (November 13 2024)
- Feat: Updated native SDKs to their latest versions (Android: 5.4.2, iOS: 5.5.3)
- Feat: Full NativeAOT support on iOS
- Fix: Handled exceptions interference with NativeAOT on iOS

## 3.7.0 (September 12 2024)
- Feat: Updated native SDKs to their latest versions (Android: 5.4.2, iOS: 5.3.2)
- Feat: \[Android\] Add support for 16KB memory pages
- Fix: \[Android\] Crash when bug is sent from built-in reporting UI after removing screenshot

## 3.6.2 (August 30 2024)
- Feat: Updated native SDKs to their latest versions (Android: 5.3.1, iOS: 5.3.1)
- Feat: Add screenshot to ExtendedReport

## 3.6.1 (August 30 2024)
- Fix: Add missing iOS launch options

## 3.6.0 (August 30 2024)
- Feat: Updated native SDKs to their latest versions (Android: 5.3.1, iOS: 5.3.1)
- Feat: New application exit detection feature behind the "DetectAppExit" launch option \[[learn more](/sdk/dotnet/configuration/)\].

## 3.5.2 (August 20 2024)
- Feat: Updated native SDKs to their latest versions (Android: 5.2.2, iOS: 5.2.1)

## 3.5.1 (July 22 2024)
- Feat: Updated native SDKs to their latest versions (Android: 5.2.1, iOS: 5.2.0)

## 3.5.0 (July 16 2024)
- Feat: Updated native SDKs to their latest versions (Android: 5.2.0, iOS: 5.2.0)
- Feat: New API to delete all captured/collected data on the disk \[[learn more](/sdk/dotnet/privacy/cleanup/)\].

## 3.4.0 (May 22 2024)
- Feat: New variation of Launch() API which accepts context provider delegate

## 3.3.0 (April 19 2024)
- Fix: \[Android\] In some cases, video before FG->BG->FG transitions may be absent
- Note: \[Android\] compileSdkVersion 34 and up is now required

## 3.2.0 (April 11 2024)
- Feat: Updated native SDKs to their latest versions (Android: 4.2.4, iOS: 5.0.2)

## 3.0.1 (March 5 2024)
- Feat: Updated native SDKs to their latest versions (Android: 4.2.4, iOS: 5.0.0)
- Fix: \[Android\] In some cases, video may not be captured with reason of "Recording was not started"

## 3.0.0 (December 25 2023)
- Feat: Updated native SDKs to their latest versions (Android: 4.2.1, iOS: 5.0.0)
- Breaking: \[iOS\] Bitcode is not present in the resulting binaries any more

## 2.1.0 (December 6 2023)
- Feat: Updated native SDKs to their latest versions

## 2.0.0 (October 12 2023)
- Feat: Updated native SDKs to their latest versions (Android: [4.0.1](/sdk/android/release-notes/#401-september-30-2023), iOS: [4.0.1](/sdk/ios/release-notes/#401-september-30-2023))
- Breaking: Changes for the underlying SDKs: [Android](/sdk/android/release-notes/#401-september-30-2023) and [iOS](/sdk/ios/release-notes/#401-september-30-2023).

## 1.0.1 (July 12 2023)
- Feat: Updated native SDKs to their latest versions
- Fix: \[Android\] In some circumstances crashes may not be reported

## 1.0.0 (June 27 2023)
- Initial release