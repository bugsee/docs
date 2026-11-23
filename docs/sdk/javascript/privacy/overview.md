---
title: "Privacy overview"
description: "The privacy controls of the Bugsee JavaScript SDK: what a report can contain, and where to mask, filter, redact or limit it before it leaves the device or server."
sidebar_position: 1
slug: "/sdk/javascript/privacy/overview"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

Bugsee does not stream data continuously. The SDK keeps what it captures in a rolling buffer, as long as the `maxRecordingTime` launch option (60 seconds by default), and sends it only when a report is created: by a crash or an error, from the report dialog, or from your code. The data in a report (session replay, console logs, network traffic, breadcrumbs, your attributes and the user identifier) can contain personal data, so the SDK gives you a control at each point where that data is recorded.

The controls work in four places:

- **On the page.** Replay masks text and inputs and blocks media by default. CSS classes and selectors refine that, and `startBlackout()` stops visual capture for a sensitive flow.
- **At record time.** A log, network or breadcrumb filter sees each event before it is recorded, and can rewrite or drop it. A filter that throws drops the event rather than recording it unfiltered.
- **Before upload.** A report handler can change the summary, description, severity, labels and attachments of a report, or veto it.
- **At rest.** Launch options turn whole streams off and choose whether captured data is kept in memory, in IndexedDB or on disk.

| Page | Covers |
| --- | --- |
| [Replay](/sdk/javascript/privacy/replay) | Default masking, the always-masked fields, the CSS classes, selectors, canvas and blackout. |
| [Console logs](/sdk/javascript/privacy/logs) | Turning log capture off, `captureLogsLevel`, and redacting lines with `setLogEventFilter`. |
| [Network](/sdk/javascript/privacy/network) | Capture options, the built-in redaction, and `setNetworkEventFilter` with `getDefaultNetworkSanitizer`. |
| [Breadcrumbs](/sdk/javascript/privacy/breadcrumbs) | Breadcrumb options and redacting with `setBreadcrumbFilter`. |
| [Report](/sdk/javascript/privacy/report) | What a report carries, the report handler, attributes and the user identifier. |
| [Cleanup](/sdk/javascript/privacy/cleanup) | Where captured data is stored, how long it stays, and how to limit it. |

## Defaults at a glance

| Stream | Captured by default | Built-in protection |
| --- | --- | --- |
| Replay (browser, Electron) | Yes | Masks all text and inputs, blocks media and iframes, always masks password, phone, card and one-time-code fields. |
| Console logs | Yes | None. Redact with a filter. |
| Network | Yes, with bodies up to 20 KB | Redacts sensitive headers, URL parameters, body keys and secret shapes. |
| Breadcrumbs | Yes | None. Redact with a filter. |
| Attributes, user identifier | Only what you set | None. |
| Typed text | No | Input values are masked, and typed characters are not recorded as input events. |

## Things to know

- **Install filters right after `launch`.** A filter applies to what is recorded after it is installed. Events recorded before that are kept as they are, except network events, which get the built-in redaction. Install filters and the report handler first thing after `launch` returns.
- **A network filter replaces the built-in redaction.** It does not add to it. Compose with `getDefaultNetworkSanitizer()` to keep both. See [Privacy: Network](/sdk/javascript/privacy/network).
- **Filters belong to a client.** `relaunch()` returns a new client, so install the filters again on it.
- **Filters are one per stream.** A later call replaces the earlier filter.
- **Breadcrumbs, logs, events and attributes are not sanitized for you.** `addBreadcrumb`, `log`, `event`, `trace` and `setAttribute` record what you pass.
- **Your network filter does not reach everything.** A URL can also appear in breadcrumbs, the page-address trace and performance spans. See [Privacy: Network](/sdk/javascript/privacy/network#other-places-a-url-can-appear).
- **The report handler is not a redaction boundary for every stream.** It cannot remove logs, network events, breadcrumbs or replay from a report. Keep sensitive data out where it is recorded.
- **Performance spans.** With performance monitoring on, requests also become spans. `setSpanFilter` changes or drops them, and replaces the built-in span sanitizer when you set it. See [Performance](/sdk/javascript/performance).

It remains the responsibility of the application developer to keep sensitive data out of reports before they leave the device.
