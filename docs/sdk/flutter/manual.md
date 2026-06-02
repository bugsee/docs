---
title: "Manual invocation"
description: "How to programmatically show the report dialog, upload issues from custom UI, and log handled exceptions using the Bugsee Flutter SDK."
sidebar_position: 2
slug: "/sdk/flutter/manual"
---

## Report view

In addition to detection of shake gesture or screenshot issue report view can be triggered programmatically:

```dart
Bugsee.showReportDialog();

// or pre-fill some fields, user will be able to modify them
Bugsee.showReportDialog('Test summary', 'Test description');
```


## Issue create

You can build your own custom UI for collecting summary, description and severity from a user and use the following call to send it to Bugsee
to upload.

> **Note:** You should not use it for reporting errors automatically from within code, use [handled exceptions](#handled-exceptions) for this instead.

```dart
Bugsee.upload('Test summary', 'Test description');
```

## Handled exceptions

It is possible to report handled exceptions from code. These reports will get combined similar to crashes, and you will be provided with statistics and a break down by unique devices, OS versions, etc.

```dart
try {
	// Code, which can throw exception.
} catch (ex, st) {
    Bugsee.logException(ex, st);
}
```