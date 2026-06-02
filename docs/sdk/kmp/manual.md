---
title: "Manual invocation (Beta)"
description: "How to programmatically show the report dialog, upload issues, log handled exceptions, and work with extended reports using the Bugsee KMP SDK."
sidebar_position: 2
slug: "/sdk/kmp/manual"
---

## Report dialog

In addition to shake gesture or screenshot triggers, the report dialog can be shown programmatically:

```kotlin
Bugsee.showReportDialog()

// Or pre-fill fields (user can still modify them)
Bugsee.showReportDialog("Test summary", "Test description", BugseeSeverity.Medium)

// With labels
Bugsee.showReportDialog("Test summary", "Test description", BugseeSeverity.Medium, listOf("qa", "ui"))
```

## Programmatic upload

You can build your own custom UI and use the following calls to upload reports directly:

> **Note:** Do not use this for reporting errors automatically from code. Use [handled exceptions](#handled-exceptions) instead.

```kotlin
Bugsee.upload("Test summary", "Test description", BugseeSeverity.High)

// With labels
Bugsee.upload("Test summary", "Test description", BugseeSeverity.High, listOf("critical"))

// With labels and video control
Bugsee.upload("Test summary", "Test description", BugseeSeverity.High, listOf("critical"), includeVideo = true)
```

## Handled exceptions

Report handled exceptions from code. These reports get combined similar to crashes, with statistics and breakdowns by device, OS version, etc.

```kotlin
try {
    // Code that may throw
} catch (ex: Exception) {
    Bugsee.logException(ex)
}
```

For more control, use `BugseeExceptionLoggingOptions`:

```kotlin
try {
    // Code that may throw
} catch (ex: Exception) {
    val options = BugseeExceptionLoggingOptions()
    options.includeVideo = true
    options.labels = arrayListOf("payments")
    options.exceptionDomain = "com.example.payments"
    Bugsee.logException(ex, options)
}
```

## Extended reports

For full control over report contents, use the extended report API:

```kotlin
Bugsee.createReport { report ->
    report.summary = "Checkout failed"
    report.description = "Payment gateway returned 500"
    report.addLabel("payments")
    report.setAttribute("order_id", "12345")
    report.addAttachment(BugseeAttachment.create("log.txt", logData))
    Bugsee.upload(report)
}
```

The `BugseeExtendedReport` provides access to:
- `type` — report type (Bug, Error, Crash)
- `summary`, `description` — report text fields
- `screenshot` — accepts `ByteArray`
- `setAttribute()` / `getAttribute()` / `clearAttribute()` — custom attributes
- `addLabel()` / `removeLabel()` / `clearLabels()` / `getLabels()` — label management
- `addAttachment()` — file attachments

## Report field filters

Modify report fields before (pre-filter) or after (post-filter) the user interacts with the report UI:

```kotlin
// Pre-fill fields before the UI is shown
Bugsee.setReportFieldsPreFilter { fields ->
    fields.summary = "Bug: ${fields.summary}"
    fields.labels = fields.labels + listOf("kmp")
}

// Modify fields after the user submits
Bugsee.setReportFieldsPostFilter { fields ->
    fields.description = "${fields.description}\n\nApp version: 1.0.0"
    fields
}
```

## View hierarchy

Manually trigger a view hierarchy snapshot:

```kotlin
Bugsee.captureViewHierarchy()
```

The captured hierarchy will be included in the next report. Enable this feature with the `viewHierarchyEnabled` launch option.
