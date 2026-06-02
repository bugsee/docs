---
title: "Logging"
description: "How to send custom log messages with severity levels directly into Bugsee reports using the .NET SDK logging API."
sidebar_position: 4
slug: "/sdk/dotnet/logs"
---

Out of the box Bugsee automatically captures all standard applications console logs both on Android and iOS.
If that behavior is not desired, it can be disabled through Bugsee launch options, see CaptureLogs option in [configuration](/sdk/dotnet/configuration/).

Alternatively, we provide other methods to log messages directly into Bugsee reports. These methods maintain log levels for each message and later allow filtering
in Bugsee report viewer.

## Logging API

You can use Bugsee logging interface directly, we provide two API functions for send a message to a log:

```csharp
// With default log level (normal)
BugseePlugin.Bugsee.Log("Some log message");

// Set the log level explicitly
// Levels are Error, Warning, Info, Debug, Verbose
BugseePlugin.Bugsee.Log("Some log message", BugseeLogLevel.Info);
```