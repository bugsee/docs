---
title: "Privacy: Report"
description: "What a Bugsee JavaScript SDK report carries, what a report handler can and cannot change before upload, and how to keep attributes, the user identifier and attachments free of sensitive data."
sidebar_position: 6
slug: "/sdk/javascript/privacy/report"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

A report is a bundle: the rolling capture window at the moment of the incident, plus the details of the incident itself. This page lists what is in it, and the controls you have over each part.

## What a report carries

| Part | Contents | Control |
| --- | --- | --- |
| Report details | Summary, description, severity, labels, the source of the report, and the reporter email or user identifier. | [Report handler](/sdk/javascript/report-handler) |
| Session replay | The page DOM and its changes, in the browser and Electron. | [Privacy: Replay](/sdk/javascript/privacy/replay) |
| Input | Pointer presses and named key presses, with a description of the target element. Typed characters are not recorded. | `captureInteractions` |
| Console logs | Console output and lines you write with `log`. | [Privacy: Console logs](/sdk/javascript/privacy/logs) |
| Network | Requests, responses, headers and bodies. | [Privacy: Network](/sdk/javascript/privacy/network) |
| Breadcrumbs | Your breadcrumbs and the automatic ones. | [Privacy: Breadcrumbs](/sdk/javascript/privacy/breadcrumbs) |
| Events and traces | Your `event` and `trace` calls, and the system events and traces the SDK records. | `captureSystemEvents`, `captureSystemTraces` |
| View hierarchy | A description of the DOM at report time, in the browser. | `captureViewHierarchy` |
| Crash detail | For an error or crash, the structured stack with source positions. | None. It is the stack of the error. |
| Environment | App id, version and build, the runtime and operating system, device and screen details. | Launch options for the identity fields |
| User and attributes | The user identifier and the attributes you set. | [Below](#attributes-and-the-user-identifier) |
| Attachments | Files you add, up to 3 of 3 MB each. | [Below](#attachments) |
| Performance | Transactions and spans, with the performance extension. | `performanceMonitoring`, `setSpanFilter` |

On Node.js and Bun a report can also carry a CPU profile and the local variables of a stack frame, but only when you turn those diagnostics on. They are off by default. See [Diagnostics](/sdk/javascript/issue-detection/diagnostics).

## What a report handler can change

A [report handler](/sdk/javascript/report-handler) can change the report details: summary, description, severity, labels, email and attachments. It can also veto the report.

```ts
import { bugsee } from './bugsee';

bugsee.setReportHandler({
  before: (request) => {
    const { report } = request;
    // Never send the stack text of a certain error
    if (report.summary?.includes('PaymentError')) {
      report.description = undefined;
    }
    // Do not report on behalf of staff accounts
    if (report.email?.endsWith('@example.com')) {
      return null;
    }
    return request;
  },
});
```

Where `bugsee` is the client `launch` returned:

```ts title="bugsee.ts"
import { launch } from '@bugsee/bugsee';

export const bugsee = await launch('<your_app_token>');
```

### What it cannot do

- It cannot remove console logs, network events, breadcrumbs, replay or traces from the bundle. Control these where they are recorded, with the filters and options on the pages above.
- It does not change the structured crash detail. The error message and stack are in the report's summary, description and crash detail, so keep personal data out of error messages.

## Attributes and the user identifier

Both are uploaded with every report, and neither is redacted. You decide what they contain.

- Use an opaque id, not an email address, in `setUserIdentifier`. The identifier is sent as the reporter email unless a report has its own email.
- Do not put secrets or personal data in `setAttribute`.
- Call `clearUserIdentifier()` and `clearAllAttributes()` at sign-out, so the next reports do not carry them.
- A report carries the identifier and attributes as they were when the report was created. Clearing them later does not rewrite a report that has already been created and is waiting in the upload queue.
- In the browser, the identifier stays in memory unless you set `persistUserIdentifier: true`.

See [User & session data](/sdk/javascript/user-session-data).

## Attachments

An attachment is exactly what you pass. It is not redacted, masked or filtered. Do not attach files that hold secrets, and review what a helper such as a config dump contains.

## Error messages

The summary and description of an error report come from the error's message and stack. A message such as `User jane@example.com not found` ends up in the report. Keep personal data out of error messages, or redact them in the report handler.

## Related pages

- [Report handler](/sdk/javascript/report-handler) — the callbacks and examples.
- [Privacy overview](/sdk/javascript/privacy/overview) — all privacy controls.
- [User & session data](/sdk/javascript/user-session-data) — identifier and attributes.
- [Privacy: Cleanup](/sdk/javascript/privacy/cleanup) — where data is stored and how to limit it.
