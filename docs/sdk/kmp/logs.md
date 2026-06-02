---
title: "Logging (Beta)"
description: "How to send custom log messages with severity levels into Bugsee reports using the KMP SDK logging API."
sidebar_position: 4
slug: "/sdk/kmp/logs"
---

Out of the box Bugsee automatically captures all standard application console logs on both Android and iOS.

Alternatively, you can log messages directly into Bugsee reports. These methods maintain log levels for each message and allow filtering in the Bugsee report viewer.

## Logging API

```kotlin
// With default log level
Bugsee.log("User navigated to settings")

// With explicit log level
Bugsee.log("Payment failed", BugseeLogLevel.Error)
Bugsee.log("Retrying connection", BugseeLogLevel.Warning)
Bugsee.log("Session started", BugseeLogLevel.Info)
Bugsee.log("Cache hit for key=user_123", BugseeLogLevel.Debug)
Bugsee.log("Raw response body received", BugseeLogLevel.Verbose)
```

Available log levels: `Error`, `Warning`, `Info`, `Debug`, `Verbose`.
