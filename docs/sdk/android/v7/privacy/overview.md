---
title: "Privacy overview (7.x Beta)"
description: "Overview of privacy primitives in the Bugsee Android SDK 7.x: secure areas, blackout, content filters, report scrubbing, and data cleanup."
sidebar_position: 1
slug: "/sdk/android/v7/privacy/overview"
---

:::warning[7.x Beta]
This page documents the 7.x beta line. For the stable release, see the
[6.x privacy overview](/sdk/android/privacy/overview/).
:::

Bugsee does not continuously stream any personal data. Reports are stored
locally on the device in a cyclical buffer, and are sent only when triggered
by a crash, through the bug reporting UI, or from application code. The data
packaged with a report — screen video, touch events, logcat, network traffic
— may contain user-identifiable information, so the SDK ships a full set of
primitives to keep sensitive data off the wire.

7.x consolidates those primitives around three ideas: **secure areas** that
blank out parts of the screen (by `View`, `Fragment`, `Rect`, `Activity`
class name, or `WebView`), a generic **`EventFilter<T>`** that scrubs or
drops log, network, and breadcrumb events before they are persisted, and a
**`ReportHandler`** that inspects and mutates every report (fields,
attachments, severity) before upload. Collected on-device data can be wiped
via `Bugsee.deleteCollectedDataOnDevice(...)`.

| Page | Covers |
| --- | --- |
| [Video and touch](/sdk/android/v7/privacy/video) | `addSecureActivity`, `addSecureView`, `addSecureRectangle`, `addSecureWebView`, `startBlackout` / `endBlackout`, Compose `Modifier.bugseeSecure()`. |
| [Console logs](/sdk/android/v7/privacy/logs) | `Bugsee.setLogEventFilter(EventFilter<LogEvent>)`. |
| [Network traffic](/sdk/android/v7/privacy/network) | `Bugsee.setNetworkEventFilter(EventFilter<NetworkEvent>)`. |
| [Breadcrumbs](/sdk/android/v7/privacy/breadcrumbs) | `Bugsee.setBreadcrumbFilter(EventFilter<Breadcrumb>)` — _new in 7.0.0-beta6._ |
| [Report fields](/sdk/android/v7/privacy/report) | `Bugsee.setReportHandler(ReportHandler)` for pre/post report mutation. |
| [Cleanup](/sdk/android/v7/privacy/cleanup) | `Bugsee.deleteCollectedDataOnDevice(...)`, `clearAllAttributes()`. |

It remains the responsibility of the application developer to scrub any
sensitive data from reports before they leave the device.
