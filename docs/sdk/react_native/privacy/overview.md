---
title: "Privacy overview"
description: "The privacy controls of Bugsee React Native SDK 7.x: what a report can contain, and where to mask, filter, redact or delete it before it leaves the device."
sidebar_position: 1
slug: "/sdk/react_native/privacy/overview"
---

:::warning[Beta]
This page documents Bugsee React Native SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/react_native/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/react_native/migration).
:::

Bugsee does not stream data continuously. The SDK keeps what it captures in a rolling buffer on the device, as long as the `duration` launch option, and send it only when a report is created: by a crash or an error, from the report dialog, or from your code. The data in a report (screen video, touches, console and native logs, network traffic, breadcrumbs, attributes and the text the user typed) can contain personal data, so the SDK gives you a control at each point where that data is recorded.

The controls work in four places:

- **On screen.** `<BugseeSecure>` masks a component in the video and the report screenshot, and drops the touches on it. `Bugsee.setSecureRectangles` masks regions you measure yourself. `Bugsee.startBlackout()` blanks the whole screen for a sensitive flow. The native SDKs also mask password fields on their own.
- **At record time.** A log, network or breadcrumb filter sees each event before it is recorded, and can rewrite or drop it. The filters fail closed: a filter that throws, rejects, or returns something it should not drops the event rather than recording it unfiltered.
- **Before upload.** A report handler can change the summary, description, severity, labels and attributes of a report before it is sent.
- **On the device.** Launch options turn whole streams off, and `Bugsee.deleteCollectedDataOnDevice` deletes the captured data while the SDK is stopped.

| Page | Covers |
| --- | --- |
| [Video](/sdk/react_native/privacy/video) | `<BugseeSecure>`, `setSecureRectangles`, `startBlackout` / `endBlackout`, password fields, the view hierarchy, and the video and screenshot options. |
| [Console logs](/sdk/react_native/privacy/logs) | Turning log capture off, `captureLogsLevel`, and redacting lines with `setLogFilter`. |
| [Network](/sdk/react_native/privacy/network) | Turning network capture off, body options, the built-in redaction, and redacting events with `setNetworkFilter`. |
| [Breadcrumbs](/sdk/react_native/privacy/breadcrumbs) | Breadcrumb options and redacting breadcrumbs with `setBreadcrumbFilter`. |
| [Report](/sdk/react_native/privacy/report) | What a report carries, what a report handler can change, attributes and the user identifier. |
| [Cleanup](/sdk/react_native/privacy/cleanup) | `deleteCollectedDataOnDevice`, and clearing attributes and the user identifier. |

## Things to know

- **Install filters before `Bugsee.launch`.** A filter applies to what is recorded after it is installed, so set the log, network and breadcrumb filters, and the report handler, at the top of your startup code.
- **Android auto-launch.** With `autoLaunch` (see [Expo](/sdk/react_native/expo#auto-launch-on-android)), the SDK records from process start on Android, before any JavaScript runs. Logs, network events and breadcrumbs captured before your code calls the filter setters are recorded unfiltered, and nothing is masked until your `<BugseeSecure>` components mount. Do not use auto-launch if that window must be filtered.
- **Filters and development reloads.** A filter is a function in the JavaScript runtime. After a JavaScript reload the filters stay on while nothing in the new runtime answers them, so network events and breadcrumbs are lost until your code installs the filter again. On Android the log filter is turned off on reload, so log lines are recorded **unfiltered** until `setLogFilter` runs again. Install the filters first thing in your startup code.
- **Performance spans.** With performance monitoring on (the default), the SDK records a performance transaction for each HTTP request, carrying its URL, and on iOS spans for file operations, carrying file paths. They are included in every report. Your network filter does not reach them. Span URLs get the built-in network redaction on Android, and are recorded in full, query string included, on iOS; see [Privacy: Network](/sdk/react_native/privacy/network). `com.bugsee.option.performance.enabled` set to `false` turns them off. See [Performance monitoring](/sdk/react_native/performance).
- **The platforms differ.** On Android the built-in network redaction runs before your network filter; on iOS your filter replaces it. See [Privacy: Network](/sdk/react_native/privacy/network).
- **The report handler is not a redaction boundary for every report.** It does not run for every crash (an Android native crash never reaches it), and it cannot remove the video, the screenshot, the logs or the network traffic from a report. Data that must never leave the device has to be kept out where it is recorded: masked on screen, or dropped by a filter.

Bugsee also sends data outside reports: [`Bugsee.notify`](/sdk/react_native/notification-relay) notifications, and the messages of the [feedback chat](/sdk/react_native/feedback). Neither carries video or logs.

It remains the responsibility of the application developer to keep sensitive data out of reports before they leave the device.
