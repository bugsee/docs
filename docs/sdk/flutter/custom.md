---
title: "Adding custom data"
description: "How to attach user email, session attributes, custom traces, events, and file attachments to Bugsee reports in the Flutter SDK."
sidebar_position: 3
slug: "/sdk/flutter/custom"
---

## User email

When you already have your users identified within your app, you might want to automatically attach their email to the bug report. Bugsee provides APIs for setting, getting, and clearing the email.

```dart
// setting email
Bugsee.setEmail('name@example.com');

// getting email, null will be returned if email was not set.
email = await Bugsee.getEmail();

// clearing email
Bugsee.clearEmail();
```

## User/Session attributes

Besides email, any arbitrary attributes can be attached to the report. Issues are searchable by these attributes in the Bugsee dashboard.

:::warning
Note that each attribute has a limit of 1kB and the total size of all attributes must not exceed 25kB
:::

```dart
Bugsee.setAttribute('age', 36);
Bugsee.setAttribute('name', 'John Doe');
Bugsee.setAttribute('married', false);
```

Once set, attributes persist until the application is uninstalled from the device. However, they can be cleared using the following API.

```dart
// Clear a single attribute by name
Bugsee.clearAttribute("name");

// ... or clear all of them
Bugsee.clearAllAttributes();
```

## Custom traces

Traces may be useful when you want to track how a specific variable or state changes over time right before a problem occurs.

```dart
// Number value
Bugsee.trace('credit_balance', 15);

// String value
Bugsee.trace('current_location', 'USA');

// Boolean value
Bugsee.trace('logged_in', true);
```

## Custom events

Events are identified by a string and can have an optional dictionary of parameters that will be stored and passed along with the report.

```dart
// Without any additional parameters
Bugsee.event("payment_processed");

// ...or with additional custom parameters
dynamic params = <String, dynamic>{};

params['amount'] = 125;
params['currency'] = 'USD';

Bugsee.event("event with params", parameters);
```

## File Attachments

Binary files (attachments) can also be added to the report right before it is sent. The attachment will be available for download directly from the issue viewer.
Currently both the amount of attachments and their size is limited. Max of 3 attachments, 3MB each (size increased from 1MB starting from v5.1.0).

You should provide an implementation for **BugseeAttachmentsCallback** and set it via the setAttachmentsCallback() method.

```dart
Future<List<BugseeAttachment>> onBugseeAttachmentsRequest(BugseeReport report) {
  var attachments = <BugseeAttachment>[];
  var list = utf8.encode("This is the contents of the attachment!");
  var data = list is Uint8List ? list : new Uint8List.fromList(list);
  attachments.add(BugseeAttachment("testAttachment", "", data));
  return Future.value(attachments);
}

Bugsee.setAttachmentsCallback(onBugseeAttachmentsRequest);
```