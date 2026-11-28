---
title: "Bug reporting"
description: "Let users and your code file bug reports with Bugsee Flutter SDK 10.x: the built-in triggers, the report dialog, silent upload, and building a report with createReport."
sidebar_position: 4
slug: "/sdk/flutter/manual/bug-reporting"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta (`10.0.0-beta.1`, a prerelease on pub.dev) and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

Bug reports cover something that is wrong but did not crash the app. Your users can raise one with a gesture, or you can open the report dialog, or submit a report silently, from your own code. Handled and unhandled Dart errors are covered separately, in [Crash & error reporting](/sdk/flutter/manual/crash-error-reporting).

The calls on this page need a launched SDK; see [Before launch](#before-launch). The snippets assume `import 'package:bugsee_flutter/bugsee_flutter.dart';`.

## Built-in report triggers

The native SDKs can open the report dialog on their own, without any call from your code. The triggers are launch options on `BugseeOptions`, all off by default:

| Field | Option key | Platforms | Default | Opens the report dialog when |
| --- | --- | --- | --- | --- |
| `reportingTriggersShake` | `com.bugsee.option.reporting.triggers.shake` | both | `false` | The user shakes the device. |
| `reportingTriggersScreenshot` | `com.bugsee.option.reporting.triggers.screenshot` | both | `false` | The user takes a screenshot. |
| `reportingTriggersNotificationBar` | `com.bugsee.option.reporting.triggers.notification-bar` | Android | `false` | The user taps the Bugsee entry in the notification bar. |
| `reportingTriggersBroadcast` | `com.bugsee.option.reporting.triggers.broadcast` | Android | `false` | An Android broadcast intent asks for a report. |

An option that exists on one platform only is ignored on the other, with a warning in debug builds. See [Configuration](/sdk/flutter/configuration) for how options are passed and validated.

```dart
await Bugsee.launch(
  '<your app token>',
  options: const BugseeOptions(
    reportingTriggersShake: true,
    reportingTriggersScreenshot: true,
  ),
);
```

The options that shape the dialog itself are `reportingUiSummaryRequired`, `reportingUiDescriptionRequired`, `reportingUiEmailRequired`, `reportingUiLabelsEnabled`, `reportingUiLabelsRequired` and `reportingUiPrioritySelectorEnabled` (all `false` by default), plus `reportingUiStyle` (iOS only). The priority a report gets when nobody picks one comes from `reportingDefaultsBugPriority`, `reportingDefaultsCrashPriority` and `reportingDefaultsErrorPriority`.

## Show the report dialog

`Bugsee.showReportDialog` opens the standard reporting UI. Every argument is optional and only pre-fills the form: the user can still edit the values before sending.

```dart
// An empty form
await Bugsee.showReportDialog();

// Pre-fill the summary and description
await Bugsee.showReportDialog(
  summary: 'Checkout is frozen',
  description: 'The spinner never stops.',
);

// Pre-fill everything
await Bugsee.showReportDialog(
  summary: 'Checkout is frozen',
  description: 'The spinner never stops.',
  severity: ReportSeverity.high,
  labels: ['checkout'],
);
```

| Argument | Type | When omitted |
| --- | --- | --- |
| `summary` | `String?` | The field is left empty. |
| `description` | `String?` | The field is left empty. |
| `severity` | `ReportSeverity?` | The SDK's default bug priority. |
| `labels` | `List<String>?` | No labels are pre-filled. |

`ReportSeverity` has the values `veryLow`, `medium`, `high`, `critical` and `blocker` (`ReportSeverity.low` is the iOS name for `veryLow`).

The returned `Future` completes with nothing: it does not tell you whether the user sent the report or dismissed the dialog. To follow it, listen to [`Bugsee.lifecycleEvents`](/sdk/flutter/lifecycle). The call is a no-op while a dialog is already showing. The dialog runs your [report handler](/sdk/flutter/report-handler)'s `onBeforeReportCreated` before it opens.

## Silent upload

`Bugsee.upload(summary, description, {severity, labels})` creates and uploads a bug report at once, without UI, from what the SDK has captured. Summary and description are required.

```dart
await Bugsee.upload(
  'Sync failed',
  'The background sync gave up after three retries.',
  severity: ReportSeverity.high,
  labels: ['sync'],
);
```

Without a `severity` the SDK applies its default bug priority. To edit a report as it is created (labels, attributes, attachments), use a [report handler](/sdk/flutter/report-handler).

## Build a report yourself

`Bugsee.createReport` hands you a report object to fill in, and sends it only when you call `upload()`. Use it when the content is assembled over time or after an async step.

```dart
final report = await Bugsee.createReport();
if (report != null) {
  await report.setSummary('Checkout failed');
  await report.setSeverity(ReportSeverity.high);
  await report.replaceLabels(['checkout']);
  await report.setAttribute('cart-size', 3);
  await report.addAttachment(logFile.path, name: 'checkout-log', mimeType: 'text/plain');
  await report.upload();
}
```

`createReport({Duration timeToLive = const Duration(minutes: 10)})` completes with `null` when the SDK did not hand a report back. Call it after `launch`. A `CreatedReport` offers:

| Member | Notes |
| --- | --- |
| `read()` | A `CreatedReportSnapshot` of the report now (a value, not live). |
| `setSummary`, `setDescription`, `setSeverity` | Set the fields. |
| `replaceLabels` | Replaces all labels. |
| `setAttribute`, `removeAttribute`, `clearAttributes` | Attributes of this report only; same value types as [attributes](/sdk/flutter/user-session-data#attributes). |
| `addAttachment(path, {name, mimeType})` | Copies the file. |
| `addAttachmentBytes(bytes, {name, mimeType})` | 1 byte to 1 MiB. |
| `clearAttachments`, `setScreenshot(path, {annotated})` | Attachments and the screenshot. |
| `upload()` | Hands the report to the SDK. Completes with `false` if the SDK declined. |
| `discard()` | Releases the report without sending it. |
| `isLive` | `false` once uploaded, discarded or expired. |

Rules to know:

- **One at a time, process-wide.** A second `createReport` while one is outstanding throws `CreateReportException` with reason `busy`. At most 6 can be started a minute (`rateLimited`).
- **Time to live.** An unfinished report is discarded after `timeToLive` (between one second and one hour). Every later call on it throws `CreatedReportClosedError`.
- **Deadlines.** The SDK has 45 seconds to answer `createReport` (`timeout`) and 45 seconds to answer `upload()`. On `uploadTimeout` the report may still be sent: do not upload it again.
- **No cancel.** The SDKs cannot cancel a created report. A discarded or expired one is never sent, but the SDK keeps its opened snapshot on disk until the next launch, which is why the rate limit exists.
- **Your report handler runs for it too.** On Android `onBeforeReportCreated` runs inside `createReport()` and `onAfterReportCreated` at `upload()`. On iOS both run at `upload()`, after your fields are applied, so a handler's `replaceLabels` replaces the labels you set.

### Android and iOS differ

| | Android | iOS |
| --- | --- | --- |
| Report id | `reportId` is set. | `reportId` is `null`. |
| Attachments | Copied into the report's storage at once. | Held in memory until `upload()`: at most 3, each 1 byte to 3 MiB, and no `mimeType` is kept. |
| Screenshot | Any display; `annotated` is supported. | One screenshot; `annotated: true` is refused with `ReportAttachmentFailure.unsupported`. |

File and screenshot limits (path rules, 20 MiB per file, 4096 x 4096 pixels) and the `ReportAttachmentException` reasons are shared with the report handler; see [Attachments and screenshots](/sdk/flutter/report-handler#attachments-and-screenshots).

## Before launch

The wrapper queues nothing before `launch`: each call does what the native SDK does.

| Call | Before `launch` |
| --- | --- |
| `showReportDialog` | No-op (on iOS it needs the launched state, not `launching`). |
| `upload` | No-op. |

Neither SDK throws for these; the call is dropped. Call `createReport` after `launch` too.
