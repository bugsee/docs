---
title: "Logging"
description: "Integrate Bugsee with the React Native logging system and send custom log messages with explicit log levels from JavaScript."
sidebar_position: 4
slug: "/sdk/react_native/logs"
---

Bugsee provides a way to hook Bugsee as custom logger to React native logging system. With this, console.log(), console.warn(), console.error() as well
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

You can use Bugsee logging interface directly from within Javascript bypassing the React logging system, we provide two API functions for send a message to a log:

```javascript
// With default log level (normal)
Bugsee.log("Some log message");

// Set the log level explicitly
// Levels are Bugsee.LogLevel.Error, Bugsee.LogLevel.Warning, Bugsee.LogLevel.Debug, Bugsee.LogLevel.Info, Bugsee.LogLevel.Verbose,
Bugsee.log("Some log message", Bugsee.LogLevel.Info);
```
