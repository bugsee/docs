---
title: "Report handler"
description: "Inspect or enrich every report before Bugsee Flutter SDK 10.x sends it: setReportHandler, its two callbacks, ReportProxy edits, the time window, ReportClosedError, attachments and screenshots."
sidebar_position: 7
slug: "/sdk/flutter/report-handler"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta, is not published on pub.dev yet and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

A **report handler** is the one place to inspect or change a report before Bugsee sends it. It sees the reports that reach Dart: bug reports from the dialog or from `upload`, error reports, and crash reports when the SDK hands them to Dart (see [Limits](#limits)). Use it for anything that must apply to all of them: labels, attributes, a severity rule, a config snapshot as an attachment.

```dart
import 'package:bugsee_flutter/bugsee_flutter.dart';

Future<void> main() async {
  await Bugsee.setReportHandler(
    BugseeReportHandler(
      onAfterReportCreated: (report) async {
        await report.replaceLabels(['beta-build']);
        await report.setAttribute('screen', 'cart');
      },
    ),
  );
  await Bugsee.launch('<your app token>');
}
```

## Install it before launch

Call `Bugsee.setReportHandler` **before** `Bugsee.launch`. During launch the SDK recovers reports from the previous run, such as a crash, and a handler installed afterwards misses them. The registration is stored natively, so it works before launch.

- There is one handler at a time. A later call replaces it. `setReportHandler(null)`, or a handler with neither callback, clears it, and then the SDK is never kept waiting for Dart. `Bugsee.reportHandler` reads the current one back.
- A phase you leave out is not delivered to Dart at all.
- If your handler throws, the error is reported through `FlutterError.reportError` and the report still goes on.
- Reports the SDK recovers before the Flutter engine exists cannot reach Dart (see [Limits](#limits)).

## The two callbacks

| Callback | When it runs | Delivered |
| --- | --- | --- |
| `onBeforeReportCreated(report)` | Before the report is built. For the dialog, before it opens. | **At most once** per report, and may be skipped. |
| `onAfterReportCreated(report)` | After the report is built, before it is sent. | **At least once**: it can run again, in a later process, for a report that already carries the first run's changes (a recovered crash is one). |

Within one run of the app a repeat of the same report and phase is not delivered again. The id is recorded before the handler runs, so a handler that threw or overran counts as delivered and is not retried in that process; the SDK's own redelivery after a crash is the retry, in a later process.

Because `onAfterReportCreated` can run more than once, make it **idempotent**: running it twice must leave the report as running it once would. Set values rather than append them (`replaceLabels`, not `addLabels`; `setAttribute` replaces a value of the same name), and read `report.read()` before adding an attachment that an earlier run may already have added.

Each callback receives a `ReportProxy` and may be async (`FutureOr<void>`).

### Which call triggers which callback

| Call | `onBeforeReportCreated` | `onAfterReportCreated` |
| --- | --- | --- |
| `showReportDialog` | Before the dialog opens, so it does not see what the user types. | After the report is built from what the user sent. |
| `upload`, `logException`, installed error handlers | Before the report is built. | After it is built. |
| Crashes | May be skipped. | Depends on the platform and the kind of crash; see [Limits](#limits). |
| `createReport` on Android | Inside `createReport()`. | At the created report's `upload()`. |
| `createReport` on iOS | At `upload()`. | At `upload()`. Both run after the created report's fields are applied, so a handler's `replaceLabels` replaces the labels you set. |

To act on what a user typed into the dialog, such as redacting it, use `onAfterReportCreated`.

## The report object

`ReportProxy` is a handle on the live report, not a copy.

| Member | Notes |
| --- | --- |
| `id`, `type`, `typeName` | The SDK's report id (stable across a re-delivery) and its type: `ReportType.bug`, `crash` or `error` (`type` is `null` for a type this version does not know). |
| `deliveryId` | Stable for this report and phase. Two deliveries with the same `deliveryId` are the same report being handled again: use it to de-duplicate side effects outside the report (for example, a call to your own backend). |
| `isLive` | Whether edits can still reach the SDK. |
| `read()` | A `ReportSnapshot` now (a value, not live): `id`, `type`, `summary`, `description`, `email`, `severity`, `labels`, `attributes`, `attachments`, `screenshots`. |
| `setSummary`, `setDescription`, `setEmail`, `setSeverity` | Set a field. |
| `replaceLabels`, `addLabels`, `clearLabels` | `replaceLabels` replaces all labels in one atomic step and is the idempotent way. |
| `setAttribute`, `removeAttribute`, `clearAttributes` | Attributes of this report. The value must be a `String`, `bool`, `int` or finite `double`; anything else is an `ArgumentError` and nothing is sent. |
| `addAttachment`, `addAttachmentBytes`, `clearAttachments`, `setScreenshot`, `removeScreenshot` | See [Attachments and screenshots](#attachments-and-screenshots). |

```dart
await Bugsee.setReportHandler(
  BugseeReportHandler(
    onBeforeReportCreated: (report) async {
      if (report.type == ReportType.error) {
        await report.setSeverity(ReportSeverity.medium);
      }
    },
    onAfterReportCreated: (report) async {
      final snapshot = await report.read();
      if (snapshot.type == ReportType.crash) {
        await report.replaceLabels([...snapshot.labels, 'crash-triage']);
      }
    },
  ),
);
```

## Await every edit

Every operation on `ReportProxy` crosses to native, so it is asynchronous, and the report goes back to the SDK when your callback returns. **Await every edit before returning.** An edit that starts after the report is handed back throws `ReportClosedError` and changes nothing; the same error is thrown for an edit after the time window closed.

`ReportClosedError` extends `StateError`; a created report that was uploaded, discarded or expired throws its subclass `CreatedReportClosedError`.

## The time window

The SDK gives a handler a fixed budget and moves on when it runs out. The SDK's budget is 30 seconds per handler on iOS and, on Android, the `configReportHandlerCallbackTimeout` option (default 30; 0 or below means the 20 second default). The wrapper's window is that budget less a third, with at most 10 seconds of margin, and never more than 20 seconds:

| Situation | The SDK's budget | The window you get |
| --- | --- | --- |
| A live report (dialog, `upload`, error, a crash recovered after a normal session) | 30 seconds per handler by default | 20 seconds |
| iOS recovery of a previous run's report | 3 seconds | 2 seconds |

Do slow work **before** the edit calls and keep the callback short. The SDK's own limit for a whole chain of handlers is 60 seconds. The wrapper's pipeline never blocks the SDK: it completes the SDK's callback exactly once on every path (when you return, when the window ends, or at once when nothing is registered or Dart cannot run).

## Attachments and screenshots

Attachments and screenshots are **path-first**: you give a file path, and native copies, moves or decodes the file. The file never crosses to Dart as bytes. `addAttachmentBytes` is the convenience for a small payload.

```dart
import 'dart:io';
import 'dart:typed_data';

Future<void> attach(ReportProxy report, File log, File drawing) async {
  // Copies the file (the default)
  await report.addAttachment(log.path, name: 'app-log', mimeType: 'text/plain');

  // Consumes a temporary file you were about to delete
  await report.addAttachment('/path/to/tmp.json', name: 'state', mimeType: 'application/json', move: true);

  // Small payloads only
  await report.addAttachmentBytes(Uint8List.fromList([104, 105]), name: 'note');

  // An annotated screenshot for display 0
  await report.setScreenshot(drawing.path, annotated: true);
}
```

| Member | Notes |
| --- | --- |
| `addAttachment(path, {required name, mimeType, move = false})` | Adds the file at `path`. |
| `addAttachmentBytes(bytes, {required name, mimeType})` | At most 1 MiB. Empty data is valid for a handler report. |
| `clearAttachments()` | Removes every attachment, including ones the SDK or an earlier handler added, and deletes their files. |
| `setScreenshot(path, {displayId = 0, annotated = false})` | Replaces the screenshot of that display. Set `annotated` when the picture carries a drawing. |
| `removeScreenshot({displayId = 0})` | Does nothing when there is none. |

Rules:

- **Path.** An absolute file system path (`File.path`). A URL (`file:`, `content:`), a relative path, a path with control characters or one over 4096 units is a `BugseeArgumentException`. The OS decides what is readable: the app's own directories always are; on Android 10 and newer a path in shared storage is usually `unreadable` or `fileNotFound`.
- **Name and type.** `name` is 1 to 255 characters, not blank, with no control characters and no `/` or `\`. `mimeType` is `null` or `type/subtype` without parameters.
- **Copy and move.** A copy leaves the source. A move consumes it once the SDK accepted the file; a refused move never consumes the file. A symbolic link is copied by content, and with `move` only the link is removed. Do not delete your own file after a move.
- **Limits.** A file may be at most 20 MiB (`maxAttachmentFileBytes`), bytes at most 1 MiB (`maxAttachmentBytes`), a report holds at most 1000 attachments, and an image at most 4096 x 4096 pixels (`maxScreenshotPixels`, checked from the file header before any pixel is decoded). PNG and JPEG are the usual formats; whatever the platform decodes is accepted.
- **Threads.** File work runs on a background worker in call order, never on the platform thread. A request queued behind 64 others answers `busy`.
- **Orientation.** A JPEG with an orientation flag in its metadata is stored not rotated on Android and rotated on iOS. Normalize the picture first if that matters.
- **Annotated screenshots.** Without `annotated: true` the screenshot is stored as not annotated, which on a report that has a video the viewer does not offer over the video.

A refused file throws `ReportAttachmentException` and changes nothing, the source included. Its `reason` is a `ReportAttachmentFailure`:

| Reason | Meaning |
| --- | --- |
| `fileNotFound`, `notAFile`, `unreadable` | No file at the path, not a regular file, or not readable by this process. |
| `tooLarge` | Over the size limits above. |
| `limitReached` | The report holds as many attachments as it may. |
| `rejected` | The SDK declined (the report no longer accepts attachments, no storage, a full disk). The source is untouched. |
| `busy` | The file worker's queue is full. Try again. |
| `unsupported` | The platform cannot do it (an annotated screenshot on an iOS created report). |
| `imageUndecodable`, `imageTooLarge` | Not an image the platform decodes, or over the pixel limit. |

### Late attachments

The SDK's own timer does not wait for a copy that is still running. An attachment call that outlives the window is refused with `rejected` and the source file is left in place. A call made after the report was handed back is a `ReportClosedError`. Note that `setScreenshot` and `clearAttachments` cannot be undone once they started inside the window, so await them promptly.

## Limits

- **Before the engine exists.** A report recovered while no Flutter engine is attached cannot reach Dart (this includes recovery at an early launch and Android auto-init). With an engine attached, iOS recovery gives Dart 2 seconds. Not verified on a device.
- **Terminating.** Neither callback runs while the process is terminating, because Dart cannot run then. `isTerminating` is never passed to Dart.
- **Android native crash recovered after a normal session.** The report is dispatched on the SDK's report handler thread with the live window; Dart runs and its attribute, label and file land in the recovered report (device-measured).
- **A late edit can still be accepted.** The SDK starts its timer when it queues the handler, the wrapper's window starts when the handler is entered. The margin absorbs that wait; an edit after the SDK moved on is not always refused.
- **Several engines.** The most recently attached one that has a handler gets the delivery.
- **Hot restart.** A hot restart starts a new Dart isolate; calling `setReportHandler` in `main` registers the handler again on every start.
