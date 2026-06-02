---
title: "Privacy and network traffic (Beta)"
description: "How to disable network monitoring or filter sensitive data from captured network requests and responses in the Bugsee KMP SDK."
sidebar_position: 3
slug: "/sdk/kmp/privacy/network"
---

## Disabling network traffic collection

Network traffic collection can be disabled completely using the **monitorNetwork** launch option. See [configuration](/sdk/kmp/configuration/) for more info.

## Sanitizing data

Bugsee captures network activity and stores headers and, in some cases, the body of requests and responses. To hide user-identifiable or sensitive data, set a filter callback that Bugsee calls for every network event about to be recorded.

Return `null` from the filter to suppress the event entirely.

```kotlin
Bugsee.setNetworkEventFilter { event ->
    event?.let {
        // Redact authorization headers
        it.headers = it.headers?.filterKeys { key ->
            !key.equals("Authorization", ignoreCase = true)
        }
        // Redact sensitive URLs
        if (it.url?.contains("/api/auth") == true) {
            it.body = "[REDACTED]"
        }
        it
    }
}
```

The callback is called multiple times for each request depending on its lifecycle — usually twice for successful requests: once with the request event and once after completion with the response.
