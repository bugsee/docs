---
title: "Logging"
description: "How to send custom log messages with severity levels directly into Bugsee reports using the Flutter SDK logging API."
sidebar_position: 4
slug: "/sdk/flutter/logs"
---

Out of the box Bugsee automatically captures all standard applications console logs both on Android and iOS.

Alternatively, we provide other methods to log messages directly into Bugsee reports. These methods maintain log levels for each message and later allow filtering
in Bugsee report viewer.

## Logging API

You can use Bugsee logging interface directly, we provide two API functions for send a message to a log:

```dart
// With default log level (normal)
Bugsee.log("Some log message");

// Set the log level explicitly
// Levels are error, warning, info, debug, verbose
Bugsee.log("Some log message", BugseeLogLevel.info);
```