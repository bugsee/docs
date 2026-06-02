---
title: "Adding custom data"
description: "Attach user email, session attributes, custom events, traces, and file attachments to Bugsee reports in Unity."
sidebar_position: 3
slug: "/sdk/unity/custom"
---

## User email

When you already have your users identified within your app, you might want to automatically attach their email to the bug report. Bugsee provides APIs for setting, getting, and clearing the email.

```csharp
// setting email
BugseePlugin.Bugsee.SetEmail("name@example.com");

// getting email, null will be returned if email was not set.
String email = BugseePlugin.Bugsee.GetEmail();

// clearing email
BugseePlugin.Bugsee.ClearEmail();
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

Once set, attributes persist until the application is uninstalled from the device. They can be cleared however using the following API.

```csharp
// Clear a single attribute by name
BugseePlugin.Bugsee.ClearAttribute("name");

// .. or clear all of them
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

:::warning
"bgs_gameObject" GameObject is required to perform communication between managed code and our platform SDK. Please, do not remove or rename "bgs_gameObject".
:::

Binary files (attachments) can also be added to the report right before it is sent. The attachment will be available for download directly from the issue viewer.
Currently both the amount of attachments and their size is limited. Max of 3 attachments, 3MB (size increased from 1MB starting from v3.2.0).

You should provide an implementation for the **AttachmentForReport** delegate and subscribe it to the **Bugsee.OnAttachmentForReport** event.

```csharp
Bugsee.OnAttachmentForReport += delegate (BugseeReport report)
{
    var attachments = new List<BugseeAttachment>();

    if (
        report.Severity == BugseeSeverityLevel.Blocker &&
        report.Type == BugseeIssueType.Crash
    )
    {
        attachments.Add(new BugseeAttachment()
        {
            name = "Attachment1",
            filename = "just_text.txt",
            data = System.Text.Encoding.UTF8.GetBytes("This is attachment content!")
        });
    }

    return attachments;
};
```