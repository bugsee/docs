---
title: "Privacy and console logs (Beta)"
description: "How to disable console log collection or sanitize log content in the KMP SDK to remove personally identifiable information before it is recorded."
sidebar_position: 2
slug: "/sdk/kmp/privacy/logs"
---

## Disabling log collection

Console log collection can be disabled completely using the **captureLogs** launch option. See [configuration](/sdk/kmp/configuration/) for more info.

## Sanitizing console logs

Bugsee automatically captures all standard application console logs, but they can be filtered before recording.

For every log event to be recorded, Bugsee calls your filter and provides a `BugseeLogEvent` object. Clean up user-identifiable data and return a sanitized event. Return `null` to suppress the event entirely.

```kotlin
Bugsee.setLogFilter { logEvent ->
    logEvent?.let {
        it.message = it.message.replace(Regex("\\b[\\w.]+@[\\w.]+\\b"), "[REDACTED]")
        it
    }
}
```
