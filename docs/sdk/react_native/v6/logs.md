---
title: "Logging"
description: "Integrate Bugsee with the React Native logging system and send custom log messages with explicit log levels from JavaScript."
sidebar_position: 4
slug: "/sdk/react_native/v6/logs"
---

:::caution[Previous version]
This page documents Bugsee React Native SDK **6.x** (`react-native-bugsee`), the current stable release. The new **7.x** SDK (`@bugsee/react-native`) is in beta: see [Migrating from 6.x to 7.x](/sdk/react_native/migration) to evaluate it, or the [7.x overview](/sdk/react_native/overview) to start a new integration.
:::

Bugsee provides a way to hook Bugsee as custom logger to React Native logging system. With this, console.log(), console.warn(), console.error() as well
as React Native internal logs will be properly handled by Bugsee.

In your native code (AppDelegate) add the following:

```objectivec
#import <React/RCTLog.h>
#import <Bugsee/Bugsee.h>

// ...

// Set log level to Info to propagate everything to Bugsee
RCTSetLogThreshold(RCTLogLevelInfo);

// Add Bugsee custom logger
RCTAddLogFunction((RCTLogFunction)BugseeReactNativeLogger);
```

You can use the Bugsee logging interface directly from within Javascript bypassing the React logging system, we provide two API functions for sending a message to a log:

```javascript
// With default log level (info)
Bugsee.log("Some log message");

// Set the log level explicitly
// Levels are Bugsee.LogLevel.Error, Bugsee.LogLevel.Warning, Bugsee.LogLevel.Debug, Bugsee.LogLevel.Info, Bugsee.LogLevel.Verbose,
Bugsee.log("Some log message", Bugsee.LogLevel.Info);
```
