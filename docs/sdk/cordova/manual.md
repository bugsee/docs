---
title: "Manual invocation"
description: "How to programmatically show the Bugsee report dialog, upload reports silently, and capture non-fatal exceptions in Cordova."
sidebar_position: 2
slug: "/sdk/cordova/manual"
---

## Trigger Report view

In addition to detection of shake gesture or screenshot issue report view can be triggered programmatically from within
your Cordova application:

```javascript
Bugsee.showReportDialog();
```

Optionally you can pre-fill some fields (summary, description, severity, user will be able to modify them later.
```javascript
// Bugsee.showReportDialog(summary, description, severity)
Bugsee.showReportDialog("Problem summary", "Further description", Bugsee.Severity.Medium);
```

## Upload from code

User doesn't have to be involved, you can also generate and upload a report automatically from your code.

```javascript
// Bugsee.assert(summary, description, severity)
Bugsee.upload("Problem summary", "Further description", Bugsee.Severity.Blocker);
```
## Non-fatal exceptions

It is possible to report non-fatal exceptions from code. These reports will get combined similar to crashes, and you will be provided with statistics and a break down by unique devices, versions, etc.

```javascript
try {
	// Code, which can throw exception.
} catch(e) {
    Bugsee.logException(e);
}
```