---
title: "Privacy overview"
description: "The privacy controls of Bugsee Unity SDK 7.x: what the SDK records by default, the options that turn each stream off, and where to mask, filter, redact or delete data before it leaves the device."
sidebar_position: 1
slug: "/sdk/unity/privacy/overview"
---

:::warning[Beta]
This page documents Bugsee Unity SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/unity/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/unity/migration).
:::

Bugsee does not stream data continuously. The SDK keeps what it records in a rolling buffer on the device, as long as the `Duration` launch option (60 seconds by default on both platforms), and sends it only when a report is created: by a crash or another issue Bugsee detects, from the report dialog, or from your code. The shake trigger and the Android notification-bar trigger are off by default in 7.x. In 6.x, the Android shake trigger and the Android notification-bar trigger were on, the iOS shake trigger was off, and the iOS screenshot trigger was on (it is off in 7.x too).

The data in a report (screen video, touches, console logs, network traffic, breadcrumbs, attributes and the text a user types into the report dialog) can contain personal data. It is the responsibility of your application to keep sensitive data out of reports before they leave the device. Bugsee gives you a control at each point where data is recorded.

The Unity package is a wrapper. It starts the native Android and iOS SDKs, and the native SDKs do the recording and the redaction. Where a Unity API forwards to a native feature, the Unity pages say so and link to the native 7.x privacy page. On players other than Android and iOS, the Editor included, the package records nothing and the privacy calls do nothing.

## Where the controls are

| Page | Covers |
| --- | --- |
| [Video](/sdk/unity/privacy/video) | Turning video and the screenshot off, secure rectangles for Unity content, WebView secure views, blackout. |
| [Console logs](/sdk/unity/privacy/logs) | Turning log capture off, the log level, `SetLogEventFilter`, `Bugsee.Log` and the filter. |
| [Network](/sdk/unity/privacy/network) | Turning network capture off, body options, the built-in redaction, `SetNetworkEventFilter`, `ApplyDefaultNetworkSanitizer`. |
| [Breadcrumbs](/sdk/unity/privacy/breadcrumbs) | Breadcrumbs are off by default, `SetBreadcrumbFilter`. |
| [Report](/sdk/unity/privacy/report) | Editing or removing report fields, attributes, labels, attachments and the screenshot in a report handler. |
| [Cleanup](/sdk/unity/privacy/cleanup) | `DeleteCollectedDataOnDevice` and `DeleteScope`, clearing the user identifier and attributes, how much waits on the device. |

## What is recorded by default

You set every option below on the launch options you pass to `Bugsee.Launch`. See [Configuration](/sdk/unity/configuration) for how options reach the SDK.

| Data | Option | Default | Notes |
| --- | --- | --- | --- |
| Screen video and touches | `CaptureVideo` | on | [Privacy: Video](/sdk/unity/privacy/video) |
| Report screenshot | `CaptureScreenshot` | on | Separate from the video option. |
| Unity scene tree (names and component types, no text) | `CaptureViewHierarchy` | on | [View hierarchy](/sdk/unity/view-hierarchy). Secure rectangles can miss a node on a scaled or offset surface: see [Privacy: Video](/sdk/unity/privacy/video). |
| Console logs | `CaptureLogs` | on | Includes the Unity console output the package forwards. [Privacy: Console logs](/sdk/unity/privacy/logs) |
| Network traffic | `CaptureNetwork` | on | [Privacy: Network](/sdk/unity/privacy/network) |
| WebSocket traffic (iOS) | `CaptureWebSocket` | on | Set on `IOSLaunchOptions`. |
| Breadcrumbs | `CaptureBreadcrumbs` | off | [Privacy: Breadcrumbs](/sdk/unity/privacy/breadcrumbs) |

The defaults come from the option manifests of the native SDKs the package wraps, as shipped with this release. The data you add yourself is recorded as you pass it: [custom events and traces](/sdk/unity/events-and-traces), and the [user identifier and attributes](/sdk/unity/user-session-data).

## Options that record more

These options are off by default. Each one records data you may not want in a report, so enable it only when your users know about it and agree.

| Option | Platform | What it adds |
| --- | --- | --- |
| `CaptureCameraPreview` | iOS | The live image of a native `AVCaptureVideoPreviewLayer`, so a report shows what the camera sees. It also makes Bugsee take part in your capture session. It does not record Unity's `WebCamTexture`. |
| `CaptureDeviceNetworkNames` | iOS | The device name and the Wi-Fi network name, which are personal data. Without it the SDK sends a redacted value. |
| `CrashNdkIncludeTombstoneLogs` | Android | The raw log buffers of the OS tombstone in a native crash report. They skip the Bugsee log filters and redaction, so they are uploaded as the OS wrote them. |

:::warning[iOS early launch starts before your consent check]
If you turn on the optional iOS early launch at build time, the iOS SDK starts natively before any C# code runs, so before any consent check of yours, and even if your app never calls `Bugsee.Launch`. Do not turn it on if Bugsee must wait for user consent. See [iOS build setup](/sdk/unity/build-setup/ios).

With early launch, options you pass to `Bugsee.Launch` that differ from the early options are logged and not applied. A privacy option you set in C#, such as `CaptureNetwork = false` or `CaptureLogs = false`, is ignored: put it in the early launch options. Filters and the report handler are set from C# later, so what the SDK captures before you set them is not filtered. With early launch on, an `IReportHandler` registered from C# cannot see or edit the report of the previous run's crash, so do not rely on a report handler to redact it.
:::

The optional iOS [Crash Report Extension](/sdk/unity/issue-detection/crash-report-extension) is a separate component. Read its page before you add it to an app that asks for consent.

## Reports waiting on the device

A report that cannot be sent right away waits on the device. Three launch options bound how much waits and for how long. Past a limit, the oldest reports are deleted whole: errors first, then bug reports, then crashes, and the newest crash is kept.

| Option | Default | Meaning |
| --- | --- | --- |
| `MaxDataSize` | 150 | Disk space in MB that waiting reports may take up. A value below 10 is raised to 10. |
| `MaxPendingReports` | 30 | The most reports that may wait. A value below 1 is raised to 1. |
| `MaxPendingReportAge` | 30 | Days a report may wait before it is deleted, whatever its type. 0 or a negative value turns the age limit off. |

`MaxDataSize` defaults to 150 on both platforms. It was 50 on iOS in earlier native versions. See [Privacy: Cleanup](/sdk/unity/privacy/cleanup).

## Data sent outside reports

Two features send data without a report, and only when your app calls them:

- [Notification relay](/sdk/unity/notification-relay): `Bugsee.Notify` sends the title, body and fields you pass to your messaging integrations. No video, logs or events are attached.
- [Feedback](/sdk/unity/feedback): the messages a user types into the feedback chat. The add-on is opt-in.

## Things to know

- **Install filters and the report handler before `Bugsee.Launch`.** A filter applies to what is recorded after you set it. Set the log, network and breadcrumb filters and the report handler at the top of your startup code.
- **Filters and the report handler run on the Unity main thread.** The native SDKs can call them on other threads, and the package hands each call to the main thread. While the app is in the background, Unity's loop is paused, and filter calls wait until it resumes.
- **A filter that throws drops the event.** The package drops an event when your filter throws an exception. It does not record the event unfiltered.
- **A report handler that throws does not drop the report.** The package logs the exception. On Android the edits made before the throw are kept and later edits are blocked. On iOS every edit except a screenshot change is dropped. If a handler makes some edits and then throws, Android keeps the earlier edits and iOS drops them. A redaction handler that throws before its first edit uploads the report unredacted on both platforms, so the handler is not a redaction boundary. Make the edits inside a `try` block and call `completionCallback()` in a `finally` block. An exception thrown after an `await` in an `async void` handler is not caught, and the report waits about 31 seconds for the abandon timeout. See [Privacy: Report](/sdk/unity/privacy/report).
- **A network filter turns the built-in network redaction off.** Run `Bugsee.ApplyDefaultNetworkSanitizer` first in your filter to keep it. See [Privacy: Network](/sdk/unity/privacy/network).
- **The report handler is not a redaction boundary for every report.** It is skipped for a report that is created while the process is terminating, it uploads the report unredacted if it throws, and it cannot remove the video, the logs or the network traffic from a report. See [Privacy: Report](/sdk/unity/privacy/report).
- **Secure rectangles cover Unity content.** Unity draws its UI itself, so the native secure views and the automatic masking of native password fields do not know your Unity elements. Register a rectangle for each one. See [Privacy: Video](/sdk/unity/privacy/video).

## Native references

- Android: [Privacy overview](/sdk/android/privacy/overview).
- iOS: [Privacy overview](/sdk/ios/privacy/overview).
