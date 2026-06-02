---
title: "Manual invocation"
description: "Programmatically trigger the report dialog, silently upload issues, and log non-fatal exceptions from Unity C# code."
sidebar_position: 2
slug: "/sdk/unity/manual"
---

## Report view

In addition to detection of shake gesture or launching with notification bar item, report view can be triggered programmatically:

```csharp
BugseePlugin.Bugsee.ShowReportDialog();

// or pre-fill some fields, user will be able to modify them
BugseePlugin.Bugsee.ShowReportDialog("Pre-filled summary",
										"Pre-filled description",
										BugseePlugin.BugseeSeverityLevel.Critical);
```

## Issue create

You can build your own custom UI for collecting summary, description and severity from a user and use the following call to send it to Bugsee
to upload.

```csharp
BugseePlugin.Bugsee.Upload("Upload summary", "Upload description", BugseePlugin.BugseeSeverityLevel.High);
```

## Non-fatal exceptions

It is possible to report non-fatal exceptions from code. These reports will get combined similar to crashes, and you will be provided with statistics and a break down by unique devices, OS versions, etc.

```csharp
try {
	// Code, which can throw exception.
} catch(Exception ex) {
    BugseePlugin.Bugsee.LogException(ex);
}
```