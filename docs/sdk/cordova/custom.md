---
title: "Adding custom data"
description: "How to attach user email, custom events, traces, and session attributes to Bugsee reports in a Cordova application."
sidebar_position: 3
slug: "/sdk/cordova/custom"
---

## User email

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
    "currency": "USD"
});
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
