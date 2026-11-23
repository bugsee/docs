---
title: "Bug reporting"
description: "Let users and your code file bug reports with the Bugsee JavaScript SDK: the browser report dialog, silent upload with attachments, and prepareUpload for a report that freezes the recording first."
sidebar_position: 1
slug: "/sdk/javascript/manual/bug-reporting"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

A bug report covers something that is wrong but did not throw. You can open the built-in report dialog in the browser, or send a report from your own code with `upload`, on every runtime. Crashes and handled exceptions are covered in [Crash & error reporting](/sdk/javascript/manual/crash-error-reporting).

All examples use the client returned by `launch`. Keep it in a module of your own:

```ts title="bugsee.ts"
import { launch } from '@bugsee/bugsee';

export const bugsee = await launch('<your_app_token>');
```

`launch` returns a promise in the browser and the client itself on Node.js and Bun. `await` works for both.

## Show the report dialog

`showReportDialog` is available in the browser only. It opens a form over the page, sends what the user fills in as a bug report, and resolves with the upload result, or `null` when the user cancels, a dialog is already open, or the SDK is not running. It never throws into your page.

```ts
import { bugsee } from './bugsee';

document.querySelector('#report-bug')?.addEventListener('click', async () => {
  const result = await bugsee.showReportDialog({
    summary: 'Checkout is broken',
    labels: ['checkout'],
    theme: 'auto',
  });
  if (result?.ok) {
    console.log('Report sent', result.issueId);
  }
});
```

The recording is frozen the moment you call `showReportDialog`, before the form appears. What the user types or does while filling in the form is not part of the report.

### Dialog options

Pass these per call.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `summary` | `string` | none | Pre-fill the summary. |
| `description` | `string` | none | Pre-fill the description. |
| `severity` | `'verylow' \| 'low' \| 'medium' \| 'high' \| 'critical' \| 'blocker'` | `reportDefaultBugPriority` (`high`) | Pre-select the severity. |
| `labels` | `string[]` | `[]` | Pre-fill the labels. |
| `theme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | `auto` follows the system color scheme. |
| `strings` | `Partial<ReportDialogStrings>` | English | Override any text in the dialog. This is how you localize it. |
| `css` | `string` | none | Extra CSS appended inside the dialog's shadow root. Write rules against the `bugsee-reporting-dialog-*` classes. |

### Launch options for the form

These launch options shape the form. They apply to the browser SDK.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `reportSummaryRequired` | `boolean` | `false` | The user must enter a summary. |
| `reportDescriptionRequired` | `boolean` | `false` | The user must enter a description. |
| `reportEmailRequired` | `boolean` | `false` | The user must enter an email. |
| `reportLabelsEnabled` | `boolean` | `false` | Show the labels field. |
| `reportLabelsRequired` | `boolean` | `false` | Require at least one label. Only with `reportLabelsEnabled`. |
| `reportPrioritySelectorEnabled` | `boolean` | `false` | Show the severity picker. |
| `reportDefaultBugPriority` | severity | `'high'` | Severity a bug report starts with. |

```ts
import { launch } from '@bugsee/bugsee';

export const bugsee = await launch('<your_app_token>', {
  reportSummaryRequired: true,
  reportLabelsEnabled: true,
  reportPrioritySelectorEnabled: true,
});
```

The email field is the global user identifier. A changed value is saved with `setUserIdentifier`, and an emptied one is cleared. No format check is applied, because the identifier is often not an email address. See [User & session data](/sdk/javascript/user-session-data).

### Translate the dialog

```ts
import { bugsee } from './bugsee';

await bugsee.showReportDialog({
  strings: {
    title: 'Ein Problem melden',
    send: 'Senden',
    summaryPlaceholder: 'Kurze Zusammenfassung',
  },
});
```

The strings you can override are `title`, `close`, `summaryPlaceholder`, `descriptionPlaceholder`, `labelsPlaceholder`, `emailPlaceholder`, `severityLegend`, `severityLow`, `severityMedium`, `severityHigh`, `severityCritical`, `severityBlocker`, `send`, `sending`, `summaryRequired`, `descriptionRequired`, `emailRequired`, `labelsRequired`, `discardTitle`, `discardBody`, `discardKeep`, `discardConfirm` and `poweredBy`.

The dialog fires the `BeforeReportShown` and `AfterReportShown` [lifecycle events](/sdk/javascript/lifecycle).

## Upload a report without UI

`upload` sends a bug report straight away. It works on every runtime, and it is neither de-duplicated nor rate limited: every call is a report you or a user asked for. It does run the [report handler](/sdk/javascript/report-handler).

```ts
import { bugsee } from './bugsee';

const result = await bugsee.upload({
  summary: 'Export produced an empty file',
  description: 'The user clicked Export on a project with 3 sheets.',
  severity: 'medium',
  labels: ['export'],
  email: 'user@example.com',
});

if (result.ok) {
  console.log('Report', result.issueId);
} else {
  console.warn('Upload failed', result.error?.message);
}
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `summary` | `string` | none | Short title. |
| `description` | `string` | none | Longer text. |
| `severity` | severity | `reportDefaultBugPriority` (`high`) | `verylow`, `low`, `medium`, `high`, `critical` or `blocker`. |
| `labels` | `string[]` | none | Labels on the issue. |
| `email` | `string` | the user identifier | Reporter email. |
| `attachments` | `ReportAttachmentInput[]` | none | Files to attach, see below. |

`upload` resolves with an `UploadResult`:

| Field | Type | Description |
| --- | --- | --- |
| `ok` | `boolean` | `true` when the report was accepted. |
| `issueId` | `string \| undefined` | The id of the created issue. |
| `recordingId` | `string \| undefined` | The id of the recording. |
| `error` | `BugseeError \| undefined` | Why it failed. |

After `stop()`, or once the collector has switched the SDK off for your app, `upload` is a silent no-op that resolves `{ ok: false }`. A report that cannot be sent right now is kept in the durable queue and sent on a later launch where the platform persists data; see [Privacy: Cleanup](/sdk/javascript/privacy/cleanup).

### Attachments

A report carries up to **3** attachments of up to **3 MB** each. An attachment over the limit, a malformed one, and any beyond the third are dropped and reported through the `onError` launch option. They are never thrown.

```ts
import { bugsee } from './bugsee';

const cart = { items: 3, total: 42.5 };

await bugsee.upload({
  summary: 'Wrong total in cart',
  attachments: [
    {
      name: 'Cart state',
      data: JSON.stringify(cart, null, 2),
      mimeType: 'application/json',
      fileName: 'cart.json',
    },
    { name: 'Screenshot', data: new Uint8Array([137, 80, 78, 71]), mimeType: 'image/png' },
  ],
});
```

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Label shown for the attachment. Required. |
| `data` | `Uint8Array \| string` | The content. A string is encoded as UTF-8. |
| `mimeType` | `string` | Defaults to `text/plain` for a string and `application/octet-stream` for bytes. |
| `fileName` | `string` | Suggested download name. Directory parts are stripped. Derived from `name` when omitted. |

To attach a file to every report, or only to some, use `addReportAttachment` in a callback of the [report handler](/sdk/javascript/report-handler#attach-a-file).

:::caution
Attachment content is not redacted. Keep secrets out of the data you attach.
:::

## Freeze the recording first with prepareUpload

`prepareUpload` freezes the recording now and returns a handle you can send later. Use it when you collect information from the user first, for example in your own form: the minutes they spend typing do not push the incident out of the rolling window.

```ts
import { bugsee } from './bugsee';

async function reportFromMyForm(readForm: () => Promise<{ summary: string } | null>): Promise<void> {
  const prepared = bugsee.prepareUpload();
  if (prepared === null) {
    return; // the SDK is stopped or switched off
  }
  const form = await readForm();
  if (form === null) {
    prepared.discard(); // release the frozen recording, send nothing
    return;
  }
  const result = await prepared.send({ summary: form.summary, severity: 'high' });
  console.log(result.ok);
}
```

- `prepareUpload()` returns `null` after `stop()` or once the SDK is switched off.
- `send(options?)` takes the same options as `upload`. It sends at most once: a second call resolves `{ ok: false }`.
- `discard()` releases the frozen recording without sending anything.

The built-in report dialog uses this mechanism.

## Related pages

- [Crash & error reporting](/sdk/javascript/manual/crash-error-reporting) — send handled exceptions with `logException`.
- [Report handler](/sdk/javascript/report-handler) — change or veto every report before it is sent.
- [User & session data](/sdk/javascript/user-session-data) — the identifier and attributes a report carries.
- [Lifecycle](/sdk/javascript/lifecycle) — report events such as `AfterReportUploaded`.
- [Configuration](/sdk/javascript/configuration) — every launch option.
