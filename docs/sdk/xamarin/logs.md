---
title: "Logging"
description: "How console logs are captured automatically by Bugsee in Xamarin, and how to send log messages with explicit severity levels using the logging API."
sidebar_position: 4
slug: "/sdk/xamarin/logs"
---

:::caution[Deprecated]
Microsoft ended support for Xamarin on May 1, 2024. The Bugsee Xamarin SDK is no longer actively maintained. For new projects, use the [Bugsee .NET SDK](/sdk/dotnet/installation/), which supports .NET MAUI and modern .NET workloads.
:::

Out of the box Bugsee automatically captures all standard applications console logs both on Android and iOS.
If that behavior is not desired, it can be disabled through Bugsee launch options, see CaptureLogs option in [configuration](/sdk/xamarin/configuration/).

Alternatively, we provide other methods to log messages directly into Bugsee reports. These methods maintain log levels for each message and later allow filtering
in Bugsee report viewer.

## Logging API

You can use Bugsee logging interface directly, we provide two API functions for send a message to a log:

```csharp
// With default log level (normal)
Bugsee.Log("Some log message");

// Set the log level explicitly
// Levels are Error, Warning, Info, Debug, Verbose
Bugsee.Log("Some log message", BugseeLogLevel.Info);
```