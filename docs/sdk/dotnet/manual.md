---
title: "Manual invocation"
description: "How to programmatically show the report dialog, upload issues from custom UI, and log handled exceptions using the Bugsee .NET SDK."
sidebar_position: 2
slug: "/sdk/dotnet/manual"
---

## Report view

In addition to detection of shake gesture or screenshot issue report view can be triggered programmatically:

```csharp
Bugsee.ShowReport();

// or pre-fill some fields, user will be able to modify them
Bugsee.ShowReport("Some problem", "", BugseeSeverityLevel.Medium);
```


## Issue create

You can build your own custom UI for collecting summary, description and severity from a user and use the following call to send it to Bugsee
to upload.

> **Note:** You should not use it for reporting errors automatically from within code, use [handled exceptions](#handled-exceptions) for this instead.

```csharp
Bugsee.Upload("Upload from code", "Some description", BugseeSeverityLevel.Medium);
```

You can also use the API managing IBugseeExtendedReport to fill it with information and upload. This is useful when you want to provide a custom UI for the user to fill in the report details. Please see the example below:

```csharp
Bugsee.CreateReport((report) => {
    // Update summary
    report.Summary = "Test Report";

    // Set custom description
    report.Description = "This is a test report";

    // Change severity
    report.Severity = BugseeSeverityLevel.Critical;

    // Set desired labels
    report.Labels = new List<string> { "Test", "Report" };

    // Augment with custom attributes
    report.Attributes = new Dictionary<string, object> {
        { "Test", "Attribute" }
    };

    // Upload formed report.
    Bugsee.Upload(report);    
});
```

## Handled exceptions

It is possible to report handled exceptions from code. These reports will get combined similar to crashes, and you will be provided with statistics and a break down by unique devices, OS versions, etc.

```csharp
try {
	// Code, which can throw exception.
} catch(Exception e) {
    Bugsee.LogException(e);
}
```