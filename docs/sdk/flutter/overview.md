---
title: "Overview"
description: "What the Bugsee Flutter SDK 10.x records and detects, how it wraps the native Android and iOS SDKs, and what your app needs to run it."
sidebar_position: 0
slug: "/sdk/flutter/overview"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta, is not published on pub.dev yet and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

The Bugsee Flutter SDK (`bugsee_flutter`) captures what happened before a bug: a video of the screen, network traffic, console logs and the steps that led to it. It attaches that timeline to crash, error and bug reports you can replay in the Bugsee dashboard.

The package wraps the native Bugsee 7.x SDKs for Android and iOS; it adds a Dart layer on top of them. A report from a Flutter app is the report a native app produces, plus what only Dart can see: the widget tree, `dart:io` network traffic, `print` output and Dart errors.

10.x is a rewrite for the 7.x native SDKs and a breaking change from 9.x. There is no compatibility layer: stay on 9.x or follow the migration guide. See [Migrating from 9.x to 10.x](/sdk/flutter/migration).

## What Bugsee records

Every report carries a synchronized timeline of the session that led up to it:

- **Video**: a rolling recording of the screen. Wrap anything that must never be recorded in `BugseeSecureView`; see [Privacy: Video](/sdk/flutter/privacy/video).
- **Network**: the native SDKs cannot see `dart:io` (`package:http`, the default adapter of `dio`, `Image.network`, a plain `HttpClient`), so the plugin records it in Dart and hands the events to the SDK. This is opt-in; see [Network capture](/sdk/flutter/network).
- **Console logs**: `print` and `debugPrint` output, opt-in, and lines from your own logger through `forwardLog`; see [Console logs](/sdk/flutter/logs). Lines you send with `Bugsee.log` are recorded once the SDK has launched, with no opt-in.
- **Widget tree**: the Flutter widget tree, as boxes and widget type names only (no text, field values, keys or route names); see [View hierarchy](/sdk/flutter/view-hierarchy).
- **Breadcrumbs, custom events, traces and attributes**: see [Custom events & traces](/sdk/flutter/events-and-traces) and [User & session data](/sdk/flutter/user-session-data). Breadcrumb capture is off until you turn it on.

## What Bugsee detects

- **Native crashes**: on Android, uncaught Java and Kotlin exceptions and native crashes (the NDK crash handler); on iOS, uncaught Objective-C exceptions and fatal signals. The native SDKs also detect app hangs, when you turn that on with the `detectHang` option.
- **Dart errors**: you report handled errors yourself with `Bugsee.logException`, and can opt in to the errors nobody handled with `Bugsee.installErrorHandlers`. They are filed as error reports by default, not crash reports. See [Crash & error reporting](/sdk/flutter/manual/crash-error-reporting) and [Dart errors](/sdk/flutter/dart-errors).
- **Manual reports**: open the report dialog or upload a report from code, or turn on a built-in trigger such as shake to report (off by default); see [Bug reporting](/sdk/flutter/manual/bug-reporting).

## How it works

- **One package, two native SDKs.** The Android SDK comes through Gradle and the iOS SDK through Swift Package Manager. There is no CocoaPods pod.
- **Launch from Dart.** One call, `Bugsee.launch(token, options: ...)`, starts the SDK; see [Installation](/sdk/flutter/installation) and [Lifecycle & status](/sdk/flutter/lifecycle). On Android the SDK can also launch itself before any Dart code runs.
- **One option class.** `BugseeOptions` has a typed field for every option the two SDKs register, and one set of options configures both platforms; see [Configuration](/sdk/flutter/configuration).
- **Privacy on the device.** Secure views, blackout, and Dart-side filters for network and log data that run before anything reaches the SDK; see [Privacy](/sdk/flutter/privacy/overview).
- **Readable release reports.** Android mapping files upload with the Bugsee Gradle plugin. Android native symbols, iOS dSYMs and Dart symbols need a step from you; see [Symbolication](/sdk/flutter/symbolication/overview).
- **Automatic upload.** Reports upload to the dashboard in the background.

The in-app feedback chat ships separately, as `bugsee_flutter_feedback`, so apps that never show it do not carry its UI; see [Feedback](/sdk/flutter/feedback).

## What is opt-in

Nothing below is turned on by `Bugsee.launch`:

| Capability | How to turn it on |
| --- | --- |
| Network capture of `dart:io` | `Bugsee.installNetworkCapture()` |
| `print` and `debugPrint` capture | `Bugsee.installLogCapture()`, with `print` also needing a zone: `Bugsee.runWithLogCapture` or `Bugsee.runGuarded` |
| Capture of unhandled Dart errors | `Bugsee.installErrorHandlers()` |
| Breadcrumbs | `BugseeOptions(captureBreadcrumbs: true)` |
| Shake to report | `BugseeOptions(reportingTriggersShake: true)` |

## Requirements

| | |
| --- | --- |
| Flutter / Dart | 3.50.0 or later / 3.14 or later |
| Android | `minSdk` 21; JDK 17 or 21 for the build; the Bugsee Gradle plugin 4.1.1, applied by your app |
| iOS | 15.0 or later; Swift Package Manager only |
| Not covered | web, desktop (the calls do nothing there), tvOS, visionOS |

## Versions

This beta, `10.0.0-beta.1`, is built on these native SDKs:

| Platform | Native SDK | Notes |
| --- | --- | --- |
| Android | `com.bugsee:bugsee-android` 7.6.0 | Bugsee Gradle plugin 4.1.1 is mandatory |
| iOS | Bugsee iOS SDK 7.1.0 | Distributed through Swift Package Manager |

## Platform notes

- The API works from the main isolate. A call from a background isolate is a `BugseeException`.
- On web and desktop the calls do nothing, and `Bugsee.launch` throws a `BugseeLaunchException`.
- The iOS simulator has no crash reporter and files no logged exceptions, so crash recovery and Dart error reports need a physical iPhone to try.

## Get started

Head to [Installation](/sdk/flutter/installation). From there, [Configuration](/sdk/flutter/configuration) covers the launch options, and [Privacy](/sdk/flutter/privacy/overview) covers redaction.
