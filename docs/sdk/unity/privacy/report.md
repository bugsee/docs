---
title: "Privacy: Report"
description: "How to strip sensitive data from Bugsee Unity SDK 7.x reports before upload: what a report carries, what a report handler can change, the report screenshot, and turning the screenshot off."
sidebar_position: 6
slug: "/sdk/unity/privacy/report"
---

:::warning[Beta]
This page documents Bugsee Unity SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/unity/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/unity/migration).
:::

A report bundles what the SDK recorded with what the user or your code put into it. The recorded streams have their own controls on the other privacy pages. This page covers the rest: the report's own fields, attributes, labels and attachments, and the report screenshot. You change them with a report handler before the report is sent. See [Report handler](/sdk/unity/report-handler) for the full contract, and the native pages [Android report privacy](/sdk/android/privacy/report) and [iOS report privacy](/sdk/ios/privacy/report) for the native side.

## What a report carries

| Part | Where it comes from | Control |
| --- | --- | --- |
| Video, screenshot, touches | Screen capture | [Privacy: Video](/sdk/unity/privacy/video) |
| Unity scene tree | `CaptureViewHierarchy` | [View hierarchy](/sdk/unity/view-hierarchy) |
| Console logs | Log capture and `Bugsee.Log` | [Privacy: Console logs](/sdk/unity/privacy/logs) |
| Network traffic | Network capture and `Bugsee.AddNetworkEvent` | [Privacy: Network](/sdk/unity/privacy/network) |
| Breadcrumbs | `Bugsee.AddBreadcrumb` and the native SDKs | [Privacy: Breadcrumbs](/sdk/unity/privacy/breadcrumbs) |
| Custom events and traces | `Bugsee.Event`, `Bugsee.Trace` | What you pass in. See [Custom events & traces](/sdk/unity/events-and-traces). |
| Summary, description, email, severity | The report dialog, `Bugsee.Upload`, `Bugsee.CreateReport`, or the error that raised the report | A report handler |
| Labels | The report dialog and your code | A report handler |
| Attributes and the user identifier | `Bugsee.SetAttribute`, `Bugsee.SetUserIdentifier` | [User & session data](/sdk/unity/user-session-data); per report, a report handler |
| Attachments | Your code | You add them. A report handler can clear them. |

## What a report handler can change

`Bugsee.SetReportHandler(IReportHandler handler)` registers an object whose two methods run around the reports the native SDK builds:

- `OnBeforeReportCreated(IReport report, bool isTerminating, Action completionCallback)`
- `OnAfterReportCreated(IReport report, bool isTerminating, Action completionCallback)`

Derive from `ReportHandlerBase` and override what you need. Each method must call `completionCallback()` when it is done. The `IReport` you receive is the report: when the handler finishes, the changes you made are what is uploaded.

| You can | With |
| --- | --- |
| Rewrite or clear the summary, the description and the email | `report.Summary`, `report.Description`, `report.Email` |
| Change the severity | `report.Severity` (an `IssueSeverity?`) |
| Remove or change attributes | `report.RemoveAttribute(name)`, `report.SetAttribute(name, value)`, `report.ClearAllAttributes()`; `report.Attributes` lists them |
| Replace or clear the labels | `report.SetLabels(labels)`, `report.ClearLabels()`; `report.Labels` lists them |
| Remove the attachments | `report.ClearAttachments()`; `report.Attachments` lists them |
| Add an attachment | `report.AddAttachmentFile(path, name, mimeType)`, `report.AddAttachmentBytes(data, name, mimeType)` |
| List, read, replace or remove the screenshot | `ScreenshotDisplayIds`, `GetScreenshotPng`, `SetScreenshotPng` (see below) |

```csharp
using System;
using System.Text.RegularExpressions;
using Bugsee.Contracts.Reporting;
using BugseeSdk = Bugsee.Bugsee;

public sealed class RedactingReportHandler : ReportHandlerBase
{
    static readonly Regex CardNumber = new Regex(@"\b\d(?:[ -]?\d){12,18}\b");

    public override void OnBeforeReportCreated(IReport report, bool isTerminating, Action completionCallback)
    {
        try { Redact(report); }
        finally { completionCallback(); }
    }

    public override void OnAfterReportCreated(IReport report, bool isTerminating, Action completionCallback)
    {
        try { Redact(report); }
        finally { completionCallback(); }
    }

    static void Redact(IReport report)
    {
        // Strip what the user may have typed into the report dialog.
        report.Email = null;
        if (report.Description != null)
            report.Description = CardNumber.Replace(report.Description, "[CARD]");

        // Keep an attribute off the report.
        report.RemoveAttribute("session_token");

        // No attachments at all.
        report.ClearAttachments();
    }

    public static void Install()
    {
        BugseeSdk.SetReportHandler(new RedactingReportHandler());
    }
}
```

Call `RedactingReportHandler.Install()` before `Bugsee.Launch`.

The example runs the same redaction in both phases. Which phase already holds the text a user typed into the report dialog is the native SDK's behavior: see [Android report privacy](/sdk/android/privacy/report) and [iOS report privacy](/sdk/ios/privacy/report). A redaction that runs in both phases does not depend on it.

What to know:

- **The handler runs on the Unity main thread, inside its turn.** Do the redaction there, keep it short, and call `completionCallback()` when you are done.
- **The SDK does not wait indefinitely.** The native SDK carries on with the report unchanged after the handler timeout, 30 seconds by default. A before-phase handler that only gets to run after that is skipped. On Android, the `ReportHandlerCallbackTimeout` launch option sets the timeout. The iOS SDK does not read that option. While the app is in the background, Unity's loop is paused, and the handler waits until it resumes.
- **The handler is skipped for a report that is created while the process is terminating.** When `isTerminating` is `true`, the package acknowledges the native SDK at once and does not call your handler. Do not rely on the handler to redact those reports. Keep the data out where it is recorded: mask it on screen, or drop it in a filter.
- **A handler that throws does not drop the report, and it is not a redaction boundary.** The package logs the exception ([bugsee-unity#293](https://github.com/bugsee/bugsee-unity/issues/293)). On Android, the edits made before the throw are kept, because the setters write to the native report at once, and later edits are blocked. On iOS, every edit except a screenshot change is dropped, because the wrapper buffers the edits and sends them with a successful completion. A redaction handler that throws before its first edit therefore uploads the report unredacted on both platforms. A filter differs: a filter that throws drops the event. Make the edits inside a `try` block and call `completionCallback()` in a `finally` block, as the example does.
- **An `async void` handler is not covered by the package.** An exception thrown after an `await` is not caught by the package, the completion never runs, and the report waits for the abandon timeout (about 31 seconds with the default 30-second handler timeout) before it continues unchanged.
- **Edits after the handler's turn are not applied.** Do not keep the `IReport` and change it later.
- **The handler cannot remove the video, the logs or the network traffic from a report.** Use the capture options and the filters.
- **A report from `Bugsee.CreateReport`.** `IReport.Email` set on a report from `Bugsee.CreateReport` is used on Android. On iOS it is dropped with a warning, because the managed upload cannot carry it. Use `Bugsee.SetUserIdentifier` there.

## The report screenshot

The SDK attaches a screenshot of the screen to the report. Secure rectangles and blackout redact what is captured. To send no screenshot at all, set `CaptureScreenshot` to `false` on your launch options. See [Privacy: Video](/sdk/unity/privacy/video#disabling-video).

In a report handler you can read, replace or remove the screenshot, as PNG bytes, per display:

```csharp
using System;
using System.Collections.Generic;
using Bugsee.Contracts.Reporting;

public sealed class ScreenshotRemovingHandler : ReportHandlerBase
{
    public override void OnBeforeReportCreated(IReport report, bool isTerminating, Action completionCallback)
    {
        var displays = new List<int>(report.ScreenshotDisplayIds); // usually 0
        foreach (int display in displays)
        {
            report.SetScreenshotPng(display, null); // remove it
        }
        completionCallback();
    }
}
```

- `ScreenshotDisplayIds` lists the displays that hold a screenshot, and is empty when there is none. `GetScreenshotPng(displayId)` returns the PNG bytes as a copy you own. `SetScreenshotPng(displayId, png)` replaces the screenshot, and `null` removes it. `IsScreenshotChanged` becomes `true` once a screenshot the report holds is replaced or removed.
- These calls work in both phases, on Android and iOS, on the report a handler receives. They are not available on a report from `Bugsee.CreateReport`: it holds no screenshot, the getters return nothing, and a set returns `false` and logs a warning once.
- `GetScreenshotPng` returns `null` both for a display with no screenshot and for a listed display whose screenshot cannot be read. If a display is listed and you get `null`, do not assume there is nothing to redact. Replace or remove that screenshot.
- `SetScreenshotPng` returns `true` when the report took the change. It returns `false`, with a warning, for data that is not a PNG, for data over 32 MiB, for a PNG with a side over 8192 pixels, and for a PNG the platform cannot decode.
- Call them on Unity's main thread, inside the handler's turn. `GetScreenshotPng` blocks that thread while the SDK produces the PNG.

:::warning[A screenshot you set is not redacted]
A screenshot is the screen as it was captured. It can show personal data. Nothing re-checks a bitmap you read or replace, and a screenshot you set replaces the captured one in the report and its upload with no redaction added for you. Do not log the bytes or send them anywhere the report does not go. To send none at all, use `CaptureScreenshot = false`.
:::

Attachments cannot remove, replace or redact the SDK's screenshot.

## Attributes and the user identifier

Attributes you set with `Bugsee.SetAttribute` and the user identifier you set with `Bugsee.SetUserIdentifier` are included in the reports Bugsee builds while they are set. Clear them with `Bugsee.ClearAttribute`, `Bugsee.ClearAllAttributes` and `Bugsee.ClearUserIdentifier`. See [User & session data](/sdk/unity/user-session-data) and [Privacy: Cleanup](/sdk/unity/privacy/cleanup).

## Related pages

- [Report handler](/sdk/unity/report-handler): the full contract.
- [Privacy: Cleanup](/sdk/unity/privacy/cleanup): deleting what is stored on the device.
- [Privacy overview](/sdk/unity/privacy/overview): every privacy control.
