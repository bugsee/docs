---
title: "Privacy: Report"
description: "What a Bugsee React Native SDK 7.x report carries, what a report handler can and cannot change before upload, and how to keep attributes and the user identifier free of sensitive data."
sidebar_position: 6
slug: "/sdk/react_native/privacy/report"
---

:::warning[Beta]
This page documents Bugsee React Native SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/react_native/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/react_native/migration).
:::

A report bundles what the SDK captured with what the user, or your code, put into it. The capture streams have their own controls, covered on the other privacy pages. This page covers the rest: the report's own fields, attributes and the user identifier, and what a [report handler](/sdk/react_native/report-handler) can do about them before the report is sent.

## What a report carries

| Part | Where it comes from | Control |
| --- | --- | --- |
| Video, screenshot, touches, view hierarchy | Screen capture | [Privacy: Video](/sdk/react_native/privacy/video) |
| Console and native logs | Log capture and `Bugsee.log` | [Privacy: Console logs](/sdk/react_native/privacy/logs) |
| Network traffic | Network capture and `Bugsee.addNetworkEvent` | [Privacy: Network](/sdk/react_native/privacy/network) |
| Breadcrumbs | `Bugsee.addBreadcrumb` and the native SDKs | [Privacy: Breadcrumbs](/sdk/react_native/privacy/breadcrumbs) |
| Custom events and traces | `Bugsee.event`, `Bugsee.trace` | What you pass in. See [Custom events & traces](/sdk/react_native/events-and-traces). |
| Summary, description, labels, severity | The report dialog, `upload`, `createReport`, or the error that raised the report | A report handler |
| E-mail address | The report dialog's e-mail field | The report handler cannot read or change it in this beta. |
| Attributes and the user identifier | `Bugsee.setAttribute`, `Bugsee.setUserIdentifier` | [Attributes and the user identifier](#attributes-and-the-user-identifier); per report, a report handler |
| Attachments | Your report handler or created report | You add them; see below. |

## What a report handler can change

A report handler runs before a report is sent and can rewrite its text fields. Use it to remove what a user typed into the dialog, or what an error message quoted:

```ts
import Bugsee from '@bugsee/react-native';

const CARD_NUMBER = /\b\d(?:[ -]?\d){12,18}\b/g;
const EMAIL = /[\w.%+-]+@[\w-]+(?:\.[\w-]+)+/g;

function scrub(text: string | undefined): string | null {
  return text === undefined ? null : text.replace(CARD_NUMBER, '[CARD]').replace(EMAIL, '[EMAIL]');
}

Bugsee.setReportHandler({
  onAfterReportCreated: async (report) => {
    const { summary, description } = await report.read();
    await report.update({
      summary: scrub(summary),
      description: scrub(description),
      // Keep this attribute off reports, but not off the device
      attributes: { accountEmail: null },
    });
  },
});
```

Run the redaction in `onAfterReportCreated`: for the report dialog, `onBeforeReportCreated` runs before the dialog opens, so it does not see what the user types. `onAfterReportCreated` can run more than once for the same report, which is harmless for a redaction like this one. Install the handler before `Bugsee.launch`.

| You can | With |
| --- | --- |
| Rewrite or clear the summary and the description | `setSummary`, `setDescription`, or `update`; `null` clears |
| Replace the labels | `setLabels` (replaces the whole list) |
| Change the severity | `setSeverity` |
| Remove one attribute, or all of them, from this report | `setAttribute(name, null)`, `clearAttributes()`, or `update` |
| Add attachments | `addFileAttachment`, `addDataAttachment` |

A change made in the report handler applies to that report only. It does not touch the attributes stored on the device.

### What it cannot do

- **It cannot drop a report.** To keep data out of one, redact it.
- **It cannot remove the video, the screenshot, the logs or the network traffic.** Neither SDK can leave the video out of a single report. Keep sensitive content out of the capture itself.
- **It cannot remove an attachment** once added.
- **It does not see every report.** An Android native (NDK) crash, Android's early recovery at startup, and reports recovered before JavaScript runs under Android auto-launch never reach it. On iOS, a report recovered at launch gets only a short, best-effort window. See [Async callbacks and deadlines](/sdk/react_native/report-handler#async-callbacks-and-deadlines).

So a report handler is the place to scrub user-entered text and adjust what your own code put in, not a guarantee for data that must never leave the device. A callback that throws does not stop the report: the changes made before the throw are kept, and the report is sent.

## Attributes and the user identifier

The user identifier and every attribute are sent with every report, and with every [`Bugsee.notify`](/sdk/react_native/notification-relay) notification. Attributes **persist across launches** until you clear them.

- Do not put passwords, tokens or other secrets in them.
- Keep personal data to what you need to find a user's reports. An internal user ID is usually enough; you rarely need an e-mail address or a name.
- Clear them when the user signs out, and when they withdraw consent:

```ts
import Bugsee from '@bugsee/react-native';

async function onSignOut(): Promise<void> {
  Bugsee.clearUserIdentifier();
  await Bugsee.clearAllAttributes();
}
```

The [feedback chat](/sdk/react_native/feedback) uses the user identifier too: on both platforms, an identifier that contains an `@` is taken as the user's e-mail address, and on iOS the chat's messages carry the identifier when the user gave no e-mail address.

See [User & session data](/sdk/react_native/user-session-data) for the attribute API.

## Reports you build yourself

A report from `createReport` carries the fields you set on it, and the report handler still runs on it. See [Bug reporting](/sdk/react_native/manual/bug-reporting#build-a-report-yourself).

## Related pages

- [Report handler](/sdk/react_native/report-handler): the full contract, deadlines and errors.
- [Privacy: Cleanup](/sdk/react_native/privacy/cleanup): deleting collected data on the device.
- [Privacy overview](/sdk/react_native/privacy/overview): every privacy control.
