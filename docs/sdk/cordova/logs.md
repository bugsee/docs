---
title: "Logging"
description: "How to send custom log messages to Bugsee at specific severity levels from a Cordova application."
sidebar_position: 4
slug: "/sdk/cordova/logs"
---

You can use Bugsee logging interface directly, we provide two API functions to send a message to a log:

```javascript
// With default log level (normal)
Bugsee.log("Some log message");

// Set the log level explicitly
// Levels are Bugsee.LogLevel.Error, Bugsee.LogLevel.Warning, Bugsee.LogLevel.Debug, Bugsee.LogLevel.Info, Bugsee.LogLevel.Verbose,
Bugsee.log("Some log message", Bugsee.LogLevel.Info);
```
