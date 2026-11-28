---
title: "Logging"
description: "How to send custom log messages with severity levels directly into Bugsee reports using the Flutter SDK logging API."
sidebar_position: 4
slug: "/sdk/flutter/v9/logs"
---

:::caution[Previous version]
This page documents Bugsee Flutter SDK **9.x** (`bugsee_flutter` 9.x), the current stable release. The new **10.x** SDK is a rewrite for the Bugsee 7.x native SDKs and is in beta, not yet published to pub.dev: see [Migrating from 9.x to 10.x](/sdk/flutter/migration/) to evaluate it, or the [10.x overview](/sdk/flutter/overview/).
:::

Out of the box Bugsee automatically captures all standard application console logs both on Android and iOS.

Alternatively, we provide other methods to log messages directly into Bugsee reports. These methods maintain log levels for each message and later allow filtering
in Bugsee report viewer.

## Logging API

You can use the Bugsee logging interface directly, we provide two API functions for sending a message to a log:

```dart
// With default log level (info)
Bugsee.log("Some log message");

// Set the log level explicitly
// Levels are error, warning, info, debug, verbose
Bugsee.log("Some log message", BugseeLogLevel.info);
```