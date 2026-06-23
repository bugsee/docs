---
title: "Privacy overview"
description: "Overview of privacy primitives in the Bugsee Android SDK 7.x: secure areas, blackout, content filters, report scrubbing, and data cleanup."
sidebar_position: 1
slug: "/sdk/android/privacy/overview"
---

:::note
Looking for the previous SDK? See the
[6.x privacy overview](/sdk/android/v6/privacy/overview).
:::

Bugsee does not continuously stream any personal data. Reports are stored
locally on the device in a cyclical buffer, and are sent only when triggered
by a crash, through the bug reporting UI, or from application code. The data
packaged with a report — screen video, touch events, logcat, network traffic
— may contain user-identifiable information, so the SDK ships a full set of
primitives to keep sensitive data off the wire.

7.0.0 consolidates those primitives around three ideas: **secure areas** that
blank out parts of the screen (by `View`, `Fragment`, `Rect`, `Activity`
class name, or `WebView`), a generic **`EventFilter<T>`** that scrubs or
drops log, network, and breadcrumb events before they are persisted, and a
**`ReportHandler`** that inspects and mutates every report (fields,
attachments, severity) before upload. Collected on-device data can be wiped
via `Bugsee.deleteCollectedDataOnDevice(...)`.

| Page | Covers |
| --- | --- |
| [Video and touch](/sdk/android/privacy/video) | `addSecureActivity`, `addSecureView`, `addSecureRectangle`, `addSecureWebView`, `startBlackout` / `endBlackout`, Compose `Modifier.bugseeSecure()`. |
| [Console logs](/sdk/android/privacy/logs) | `Bugsee.setLogEventFilter(EventFilter<LogEvent>)`. |
| [Network traffic](/sdk/android/privacy/network) | `Bugsee.setNetworkEventFilter(EventFilter<NetworkEvent>)`. |
| [Breadcrumbs](/sdk/android/privacy/breadcrumbs) | `Bugsee.setBreadcrumbFilter(EventFilter<Breadcrumb>)` — _new in 7.0.0._ |
| [Report fields](/sdk/android/privacy/report) | `Bugsee.setReportHandler(ReportHandler)` for pre/post report mutation. |
| [Cleanup](/sdk/android/privacy/cleanup) | `Bugsee.deleteCollectedDataOnDevice(...)`, `clearAllAttributes()`. |

It remains the responsibility of the application developer to scrub any
sensitive data from reports before they leave the device.
