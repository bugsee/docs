---
title: "Adding custom data (Beta)"
description: "How to attach user email, session attributes, custom traces, events, and file attachments to Bugsee reports in the KMP SDK."
sidebar_position: 3
slug: "/sdk/kmp/custom"
---

## User email

When you already have your users identified within your app, you can automatically attach their email to bug reports.

```kotlin
// Set email
Bugsee.setEmail("user@example.com")

// Get email (returns null if not set)
val email = Bugsee.getEmail()

// Clear email
Bugsee.clearEmail()
```

## User/Session attributes

Arbitrary attributes can be attached to reports. Issues are searchable by these attributes in the Bugsee dashboard.

:::warning
Each attribute has a limit of 1kB and the total size of all attributes must not exceed 25kB.
:::

```kotlin
Bugsee.setAttribute("age", 36)
Bugsee.setAttribute("name", "John Doe")
Bugsee.setAttribute("premium", true)
```

Once set, attributes persist until the application is uninstalled. They can be read or cleared:

```kotlin
// Read an attribute
val name = Bugsee.getAttribute("name")

// Clear a single attribute
Bugsee.clearAttribute("name")

// Clear all attributes
Bugsee.clearAllAttributes()
```

## Custom traces

Traces are useful for tracking how a specific variable or state changes over time right before a problem occurs.

```kotlin
// Number value
Bugsee.trace("credit_balance", 15)

// String value
Bugsee.trace("current_screen", "checkout")

// Boolean value
Bugsee.trace("logged_in", true)
```

## Custom events

Events are identified by a string and can have an optional map of parameters stored with the report.

```kotlin
// Without parameters
Bugsee.event("payment_processed")

// With parameters
Bugsee.event("purchase", mapOf(
    "amount" to 125,
    "currency" to "USD"
))
```

## File attachments

Binary files can be added to reports right before they are sent. Attachments are available for download from the issue viewer. Max 3 attachments, 3MB each.

Provide an implementation via `setReportAttachmentsProvider`:

```kotlin
Bugsee.setReportAttachmentsProvider { report ->
    // 1. From a byte array
    val str = "Hello from Bugsee"
    val attachment1 = BugseeAttachment.create("from_bytes", str.toByteArray())

    // 2. From a Compose resource file
    val jsonUri = Res.getUri("files/sample_data.json")
    val attachment2 = BugseeAttachment.create("from_json_file", jsonUri)

    // 3. From a runtime-generated file
    val generatedFilePath = getPlatform().tempDir + "bugsee_generated.txt"
    writeTextFile(generatedFilePath, "Generated at runtime")
    val attachment3 = BugseeAttachment.create("from_generated_file", generatedFilePath)

    listOf(attachment1, attachment2, attachment3)
}
```

`BugseeAttachment.create()` accepts either a `ByteArray` or a file path (including Compose resource URIs) as the second argument.
