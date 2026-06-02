---
title: "Adding custom data"
description: "How to attach user email, session attributes, custom traces, events, and file attachments to Bugsee reports in the .NET SDK."
sidebar_position: 3
slug: "/sdk/dotnet/custom"
---

Don't forget to import BugseePlugin in every file where you plan to use Bugsee:

```csharp
using BugseePlugin;
```

## User email

When you already have your users identified within your app, you might want to automatically attach their email to the bug report. Bugsee provides APIs for setting, getting, and clearing the email.

```csharp
// setting email
BugseePlugin.Bugsee.Email = "name@example.com";

// getting email, null will be returned if email was not set.
String email = BugseePlugin.Bugsee.Email;

// clearing email
BugseePlugin.Bugsee.Email = null;
```

## User/Session attributes

Besides email, any arbitrary attributes can be attached to the report. Issues are searchable by these attributes in the Bugsee dashboard.

:::warning
Note that each attribute has a limit of 1kB and the total size of all attributes must not exceed 25kB
:::

```csharp
BugseePlugin.Bugsee.SetAttribute("name", "John Doe");
BugseePlugin.Bugsee.SetAttribute("age", 23);
BugseePlugin.Bugsee.SetAttribute("married", false);
```

Once set, attributes persist until the application is uninstalled from the device. However, they can be cleared using the following API.

```csharp
// Clear a single attribute by name
BugseePlugin.Bugsee.ClearAttribute("name");

// ... or clear all of them
BugseePlugin.Bugsee.ClearAllAttributes();
```

## Custom traces

Traces may be useful when you want to track how a specific variable or state changes over time right before a problem occurs.

```csharp
// Number value
BugseePlugin.Bugsee.Trace("credit_balance", 15);

// String value
BugseePlugin.Bugsee.Trace("current_location", "USA");

// Boolean value
BugseePlugin.Bugsee.Trace("logged_in", true);
```

## Custom events

Events are identified by a string and can have an optional dictionary of parameters that will be stored and passed along with the report.

```csharp
// Without any additional parameters
BugseePlugin.Bugsee.Event("payment_processed");

// ...or with additional custom parameters
Dictionary<string, object> parameters = new Dictionary<string, object> ();

parameters.Add("amount", 125);
parameters.Add("currency", "USD");

BugseePlugin.Bugsee.Event("event with params", parameters);
```

## File Attachments

Binary files (attachments) can also be added to the report right before it is sent. The attachment will be available for download directly from the issue viewer.
Currently both the amount of attachments and their size is limited. Max of 3 attachments, 1M each.

You should provide an implementation for the **BugseeAttachmentsHandler** delegate and set it via the SetAttachmentsHandler() method.

```csharp
BugseePlugin.Bugsee.SetAttachmentsHandler(delegate (BugseePlugin.IBugseeReport report)
{
    var attachments = new List<BugseePlugin.IBugseeAttachment>();

    if (
        report.Severity == BugseeSeverityLevel.Blocker &&
        report.Type == BugseeIssueType.Crash
    )
    {
        attachments.Add(new BugseePlugin.BugseeAttachment()
        {
            Name = "Attachment1",
            FileName = "just_text.txt",
            DataString = "This is attachment content!"
        });
    }

    return attachments;
});
```