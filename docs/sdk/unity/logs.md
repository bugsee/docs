---
title: "Logging"
description: "Send custom log messages with explicit severity levels directly to Bugsee from Unity C# code without printing to the console."
sidebar_position: 4
slug: "/sdk/unity/logs"
---

Nothing needs to be done on your part if all you need is retrieve standard logs, Bugsee will extract the logs for the relevant period of time and upload it as part of the report. We provide an additional API to push logs directly into Bugsee without printing them to console.


```csharp
// With default log level (normal)
BugseePlugin.Bugsee.Log("Some log message");

// Set the log level explicitly
// Levels are BugseePlugin.BugseeLogLevel.Error, BugseePlugin.BugseeLogLevel.Warning,
// BugseePlugin.BugseeLogLevel.Info, BugseePlugin.BugseeLogLevel.Debug and BugseePlugin.BugseeLogLevel.Verbose
BugseePlugin.Bugsee.Log("Some log message", BugseePlugin.BugseeLogLevel.Warning);
```