---
title: "Report handler"
description: "Inspect, enrich, redact or veto every report before the Bugsee JavaScript SDK sends it: setReportHandler, its before and after callbacks, the report fields you can change, and attachments."
sidebar_position: 9
slug: "/sdk/javascript/report-handler"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

A **report handler** is the one place to inspect or change a report before Bugsee sends it. It sees every kind of report: crashes and errors the SDK detects, handled exceptions from [`logException`](/sdk/javascript/manual/crash-error-reporting), and bug reports from [`upload`](/sdk/javascript/manual/bug-reporting) and the report dialog. That makes it the hook for anything that must apply to all of them: labels, a severity rule, an attachment, redacted text, or dropping a report you do not want.

```ts
import { launch } from '@bugsee/bugsee';

const bugsee = await launch('<your_app_token>');

bugsee.setReportHandler({
  before: (request) => {
    request.report.labels.push('beta-build');
    return request;
  },
});
```

## Install it

Call `setReportHandler(handler)` on the client `launch` returned, as soon as you have it. A handler applies to reports created after it is installed.

There is one handler at a time. A later call replaces it, and `setReportHandler(null)` removes it. `relaunch()` returns a new client, so install the handler again on that client.

## The two callbacks

| Callback | When it runs | Return value |
| --- | --- | --- |
| `before(request)` | Before the report is queued. | The request (changed or not) to keep the report, or `null` to veto it. |
| `after(request)` | After the report is created, before its bundle is assembled and uploaded. | Nothing. |

Both are optional and both must be synchronous. Keep them fast: for a crash they run while the page or process is already in trouble.

- **`before` can drop a report.** Returning `null` discards it: it is never sent, and `upload` or `logException` resolve `{ ok: false }`. A `before` that **throws** also drops the report, and the error goes to the `onError` launch option. A report that may not have been scrubbed is never sent by accident.
- **`after` can still change the report.** It runs once the report exists, so it can set labels, change the summary or add attachments, and the bundle carries the result. It is not called when no report was created: a veto, a report the queue refused, or an SDK that has been stopped. A throwing `after` goes to `onError` and does not stop the report.
- **How an upload ended** is not reported to `after`. Observe it with the `AfterReportUploaded` and `ReportUploadFailed` [lifecycle events](/sdk/javascript/lifecycle).

## The request

Both callbacks receive a `ReportingRequest`:

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | The report id. Read-only. |
| `source.type` | `string` | What triggered the report: `crash`, `error`, `code_upload`, `code_dialog` and others. Read-only. |
| `source.mechanism` | `string \| undefined` | How the error was caught: `uncaught`, `unhandledrejection`, `programmatic`, `http-error`, `hang` and others. |
| `report.type` | `'bug' \| 'error' \| 'crash'` | The issue type. |
| `report.summary` | `string \| undefined` | The title. |
| `report.description` | `string \| undefined` | The text. For an error this is its stack, followed by the `cause` chain. |
| `report.severity` | `'verylow' \| 'low' \| 'medium' \| 'high' \| 'critical' \| 'blocker'` | The severity. A severity the SDK derived from the report type is already replaced by `reportDefaultCrashPriority`, `reportDefaultErrorPriority` or `reportDefaultBugPriority` when `before` runs. |
| `report.labels` | `string[]` | Labels. |
| `report.email` | `string \| undefined` | Reporter email. When unset, the user identifier is used. |
| `report.userAttachments` | `ReportAttachmentInput[] \| undefined` | Files the application attaches. |

Change fields on `request.report` in place and return the same request, or return a new one.

## Add labels and change severity

```ts
import { bugsee } from './bugsee';

bugsee.setReportHandler({
  before: (request) => {
    const { report, source } = request;
    report.labels.push('beta-build');
    if (source.mechanism === 'unhandledrejection') {
      report.severity = 'medium';
    }
    return request;
  },
});
```

An explicit severity you passed to `logException` or `upload` is yours: the handler sees it and can still change it.

## Veto a report

```ts
import { bugsee } from './bugsee';

bugsee.setReportHandler({
  before: (request) => {
    const text = `${request.report.summary ?? ''}\n${request.report.description ?? ''}`;
    if (text.includes('ResizeObserver loop')) {
      return null; // known benign browser warning
    }
    return request;
  },
});
```

## Redact text

The summary and description of an error come from the error message and stack. If your messages can carry personal data, scrub them here:

```ts
import { bugsee } from './bugsee';

const EMAIL = /[\w.%+-]+@[\w-]+(?:\.[\w-]+)+/g;

bugsee.setReportHandler({
  before: (request) => {
    const { report } = request;
    if (report.summary !== undefined) {
      report.summary = report.summary.replace(EMAIL, '<email>');
    }
    if (report.description !== undefined) {
      report.description = report.description.replace(EMAIL, '<email>');
    }
    return request;
  },
});
```

This changes the report's summary and description only. It does not change the logs, network events, breadcrumbs, replay or the structured stack that travel in the same report. Keep that data clean where it is recorded; see [Privacy: Report](/sdk/javascript/privacy/report).

## Attach a file

`addReportAttachment(report, attachment)` appends a file to a report. It is exported by `@bugsee/bugsee`, and is the helper form of writing `report.userAttachments` yourself.

```ts
import { addReportAttachment } from '@bugsee/bugsee';
import { bugsee } from './bugsee';

bugsee.setReportHandler({
  after: (request) => {
    addReportAttachment(request.report, {
      name: 'App config',
      data: JSON.stringify({ build: 'beta', flags: ['new-checkout'] }),
      mimeType: 'application/json',
    });
  },
});
```

A report carries up to 3 attachments of up to 3 MB each. See the limits in [Bug reporting](/sdk/javascript/manual/bug-reporting#attachments).

## What a handler cannot do

- It cannot remove logs, network events, breadcrumbs or replay from the bundle. Use the [filters](/sdk/javascript/privacy/overview) and the replay masking options for that.
- It is not the only privacy control to rely on. Keep sensitive data out where it is recorded.

## Related pages

- [Bug reporting](/sdk/javascript/manual/bug-reporting) — `upload`, `prepareUpload` and the report dialog.
- [Crash & error reporting](/sdk/javascript/manual/crash-error-reporting) — `logException` and the rate limit.
- [Privacy: Report](/sdk/javascript/privacy/report) — what a report carries and how to keep it clean.
- [Lifecycle](/sdk/javascript/lifecycle) — report events such as `AfterReportUploaded`.
