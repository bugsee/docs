---
title: "Adding custom data"
description: "Attach user email, custom events, traces, session attributes, and file attachments to Bugsee reports in React Native."
sidebar_position: 3
slug: "/sdk/react_native/custom"
---

When you already have your users identified within your app, you might want to automatically attach their email to the bug report. Bugsee provides APIs for setting, getting, and clearing the email.

```javascript
// setting email
Bugsee.setEmail("name@example.com");

// clearing email
Bugsee.clearEmail();
```

## Custom events

Events are identified by a string and can have an optional dictionary of parameters that will be stored and passed along with the report.

```javascript
	// Without any additional parameters
    Bugsee.event("payment_processed");

    // ...or with additional custom parameters
    Bugsee.event("payment_processed", {
                	"amount": 125,
                	"currency": "USD"});
```

## Custom traces

Traces may be useful when you want to track how a specific variable or state changes over time right before a problem occurs.

```javascript
// Manually set value of 15 to property named "credit_balance"
// any time it changes
Bugsee.trace("credit_balance", 15);
```

## User/Session attributes

Besides email, any arbitrary attributes can be attached to the report. Issues are searchable by these attributes in the Bugsee dashboard.

:::warning
Note that each attribute has a limit of 1kB and the total size of all attributes must not exceed 25kB
:::

```javascript
Bugsee.setAttribute("name", "John Doe");
Bugsee.setAttribute("age", 23);
Bugsee.setAttribute("married", false);
```

Once set, attributes persist until the application is uninstalled from the device. However, they can be cleared using the following API.

```javascript
// Clear a single attribute by name
Bugsee.clearAttribute("name");

// .. or clear all of them
Bugsee.clearAllAttributes();
```

## File Attachments

Binary files (attachments) can also be added to the report right before it is sent. The attachment will be available for download directly from the issue viewer.
Currently both the amount of attachments and their size is limited. Max of 3 attachments, 3MB (size increased from 1MB starting from v3.0.11).

To specify attachments for the report, you should provide a corresponding handler by passing it into the ```setAttachmentsHandler()``` method. Your handler will be called each time a new report is being assembled, and it will be provided with the ```Report``` object that contains the following fields.

|Field|Type|Notes
|---|---|---|
|Report.type|String|One of 'crash', 'error' or 'bug'|
|Report.severity|Bugsee.Severity|One of Low (1), Medium (2), High (3), Critical (4), Blocker (5)|

Each attachment can be represented as an in-memory data or a file on disk.

|Field|Type|Notes
|---|---|---|
|fullpath|String|Full path to the file you want to attach. Set this field when you want to attach file from disk.|
|data|String|Actual data of the attachment. Set this field when you want to attach in-memory data|
|name|String|Name of the attachment that will be displayed in web dashboard|
|filename|String|Name that will be used when attachment data will be downloaded (name for the downloaded from web dashboard file)|

:::warning
Your handler must be asynchronous (decorated with **async** keyword) to function properly.
:::

```javascript
async function myAttachmentsHandler(report) {
    const attachments = [];

    // In-memory data attachment
    const accessLogData = await getAccessLogData();
    attachments.push({
        data: accessLogData,
        name: 'Access log',
        filename: 'access.log'
    });

    // Add error log only for crashes and errors
    if (report.type !== 'bug') {
        // On-disk file attachment
        const fullPath = await getErrorLogPath();
        attachments.push({
            fullpath: fullPath,
            name: 'Error log',
            filename: 'error.log'
        });
    }

    return attachments;
}

// ...

// Call setAttachmentsHandler to register your handler
Bugsee.setAttachmentsHandler(myAttachmentsHandler);
```
