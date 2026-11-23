---
title: "Privacy overview"
description: "The privacy controls of Bugsee Flutter SDK 10.x: what a report can contain, the control for each kind of data, and the limits you need to know about."
sidebar_position: 13
slug: "/sdk/flutter/privacy/overview"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta, is not published on pub.dev yet and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

Bugsee records what makes a bug reproducible, so decide what must not be recorded. The SDK keeps what it captures in a rolling buffer on the device and sends it only when a report is created: by a crash or an error, from the report dialog, or from your code. A report can contain personal data (the screen video, touches, logs, network traffic, breadcrumbs, attributes and the text the user typed), and the SDK gives you a control at each point where that data is recorded.

Three parts of the Flutter SDK matter here, and they behave differently:

- **The native SDKs** record the video, the screenshot, touches and device information. You control them with launch options, `BugseeSecureView` and blackout.
- **The plugin** records what only Dart can see: the widget tree, `dart:io` network traffic, `print` output and Dart errors. Network and log capture are **opt-in**, and a Dart filter runs before anything reaches the SDK.
- **Your own calls** (`Bugsee.log`, events, attributes, `Bugsee.reportException`) record what you pass.

## What is captured, and the control for each

| Captured | Control |
| --- | --- |
| Video and report screenshot of the app | [`BugseeSecureView`](/sdk/flutter/privacy/video#hiding-a-widget-bugseesecureview); [`Bugsee.startBlackout()` and `Bugsee.endBlackout()`](/sdk/flutter/privacy/video#blackout) (video, screenshot, touches and the view hierarchy stop; logs and data continue); the `captureVideo` and `captureScreenshot` options. |
| The Flutter widget tree (box and widget type name only: no text, labels, field values, keys, semantics or route names; a `BugseeSecureView` subtree is one node) | `captureViewHierarchy: false`. It is built only while the SDK is launched and the app is in the foreground. See [View hierarchy](/sdk/flutter/view-hierarchy). |
| `dart:io` network traffic (opt-in) | `installNetworkCapture` is never called by `launch`. `setNetworkFilter` runs first and **fails closed**; the SDK's default sanitizer still runs after it. Text bodies only, up to `captureNetworkBodySizeLimit`. Requests to Bugsee itself are never recorded. See [Privacy: Network](/sdk/flutter/privacy/network). |
| `print` and `debugPrint` (opt-in), and `Bugsee.log` | `setLogFilter` (fails closed) and `captureLogsLevel`. **The SDKs have no log sanitizer.** See [Privacy: Console logs](/sdk/flutter/privacy/logs). |
| Dart errors (exception text and stack) | The text is whatever your error says; a `FlutterError` contributes its summary only. The SDKs' filters do not apply to it. See [Crash and error reporting](/sdk/flutter/manual/crash-error-reporting). |
| Attributes, events, traces, breadcrumbs and the user identifier | What you pass. |
| Everything the SDK itself captures (device and OS information, SDK logs, touches, crashes) | The SDK's options. See [Configuration](/sdk/flutter/configuration). |

| Page | Covers |
| --- | --- |
| [Video](/sdk/flutter/privacy/video) | `BugseeSecureView`, blackout, the video and screenshot options, and the Android startup hold. |
| [Console logs](/sdk/flutter/privacy/logs) | Turning log capture off, `captureLogsLevel`, `setLogFilter`, and the Android logcat echo. |
| [Network](/sdk/flutter/privacy/network) | Turning network capture off, body options, the SDK's redaction, `setNetworkFilter`, and the URL in Android HTTP breadcrumbs. |

## Limits you need to know about

- **Android logcat echo.** The SDK's own console capture records the same `print` again, raw, as source `LogCat` with the tag `flutter` (the `FlutterError` dump of a real app included), and **the Dart log filter does not apply to that echo**. On Android, add a native `Bugsee.setLogEventFilter` that drops `LogSource.LogCat` events tagged `flutter`. A debug build warns once. iOS recorded no echo on the simulator, and this was not verified on a physical device. See [Privacy: Console logs](/sdk/flutter/privacy/logs#the-android-logcat-echo).
- **Android HTTP breadcrumbs.** With `captureBreadcrumbs` on, the SDK records an `http` breadcrumb for each finished request with its URL. In the measurement behind these docs, Android kept the query string of that URL as given. Redact the URL in the network filter, which runs first. See [Privacy: Network](/sdk/flutter/privacy/network#http-breadcrumbs).
- **Secure views.** A region that has just appeared is recorded in the clear for its first frame or so. Pixels drawn outside a region's own subtree (an `Overlay` magnifier or tooltip) are not covered. Secure regions are verified in portrait on iOS only. See [Privacy: Video](/sdk/flutter/privacy/video#limits).
- **Nothing is recorded, and nothing is queued, before the SDK is launching or launched.** This applies to the logs, the network events and the view hierarchy. It also means filters protect only what is recorded after you install them.
- **Android startup.** The first seconds of a session are not recorded on Android, because the SDK holds capture until Flutter has drawn and published the secure regions. See [Privacy: Video](/sdk/flutter/privacy/video#android-startup-hold).
- **Install filters before `launch`.** A filter applies to what is recorded after it is set, so set the log and network filters at the top of `main`.

Bugsee also sends data outside reports, such as notifications you send with `Bugsee.notify` and the messages of the [feedback chat](/sdk/flutter/feedback). Neither carries video or logs.

It remains the responsibility of the application developer to keep sensitive data out of reports before they leave the device.
