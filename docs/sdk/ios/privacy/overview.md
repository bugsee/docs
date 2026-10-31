---
title: "Privacy overview"
description: "Overview of the privacy controls in the Bugsee iOS SDK 7.x: secure views and rectangles, blackout, log, network and breadcrumb filters, report editing, and data cleanup."
sidebar_position: 0
slug: "/sdk/ios/privacy/overview"
---

:::note
Looking for the previous SDK? See the [6.x privacy overview](/sdk/ios/v6/privacy/overview).
:::

Bugsee does not continuously stream any personal data. What the SDK records is kept on the
device in a cyclical buffer that covers the last stretch of the session, and a report is sent
only when something triggers it: a crash or another issue Bugsee detects (app exits are detected
by default; see [Issue detection](/sdk/ios/issue-detection)), the bug reporting UI, or your
application's code.

The data packaged with a report — screen video, touches, console logs, network traffic,
breadcrumbs — may contain personal data such as user names, passwords or email addresses. It is
the sole responsibility of the application developers to remove such data before it leaves the
user's device. Bugsee gives you the tools to keep it out of the recording, or to clean it while
it is recorded:

| Page | Covers |
| --- | --- |
| [Video and touches](/sdk/ios/privacy/video) | What is hidden automatically, `addSecureView:`, `bugseeProtectedView`, SwiftUI `bugseeProtect()`, secure rectangles, WebView elements, blackout, lower-detail capture. |
| [Console logs](/sdk/ios/privacy/logs) | Turning log capture off, the minimum log level, log filters. |
| [Network](/sdk/ios/privacy/network) | The built-in network sanitizer, network filters, body size limits. |
| [Breadcrumbs](/sdk/ios/privacy/breadcrumbs) | The breadcrumb filter, notification extras, what blackout suppresses. |
| [Report](/sdk/ios/privacy/report) | Editing or stripping report fields, attributes, labels and attachments before upload. |
| [Cleanup](/sdk/ios/privacy/cleanup) | Deleting what Bugsee has stored on the device. |

## Reports waiting on the device

A report that cannot be sent right away (no connection, or Wi-Fi-only upload) waits on the
device. Three options bound how much waits and for how long; past a limit the oldest reports are
deleted whole — errors first, then bug reports, then crashes, keeping the newest crash:

| Option | Default | Meaning |
| --- | --- | --- |
| `BugseeOptionConfigMaxDataSize` | 150 | Most disk space, in MB, that waiting reports may take up. Values below 10 count as 10. |
| `BugseeOptionConfigMaxPendingReports` | 30 | Most reports that may wait. Values below 1 count as 1. |
| `BugseeOptionConfigMaxPendingReportAge` | 30 | Days a report may wait before it is deleted, crashes included. 0 or less keeps reports with no time limit. |

See [Configuration](/sdk/ios/configuration) for how to set them.

## Data sent outside reports

Two features send data without a report, and only when your app calls them:

- [Notification relay](/sdk/ios/notification-relay): `notify` sends the title, body and fields
  you pass to your messaging integrations, together with the global attributes, the user's
  identity and a snapshot of the device environment. No video, logs or events are attached.
- [Feedback](/sdk/ios/feedback): the messages a user types into the feedback chat, with the email
  address they gave or else the user identifier.

## Crash Report Extension

If you embed the [Crash Report Extension](/sdk/ios/issue-detection/crash-report-extension)
(iOS 27 and later), the system runs it for every termination it handles — also when the app
has not called `Bugsee.launch`, for example before the user gave consent. The extension sends
nothing anywhere. It writes a small JSON document into your App Group container: the exit
reason, process details such as its id and start time, the stack addresses of the threads (up to
128 threads of 64 frames) with system symbol names, and the list of loaded binaries with their
paths. The SDK reads and deletes the documents on its next launch while exit detection
(`BugseeOptionDetectAndReportExit`) is on; until then they stay on the device, at most eight, the
oldest going first. In Debug builds the extension
also keeps a small diagnostic log there, capped at 64 KB.
