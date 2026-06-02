---
title: "Privacy and console logs"
description: "How to disable or sanitize console log collection in Bugsee for Xamarin to prevent sensitive data from being included in reports."
sidebar_position: 2
slug: "/sdk/xamarin/privacy/logs"
---

:::caution Deprecated
Microsoft ended support for Xamarin on May 1, 2024. The Bugsee Xamarin SDK is no longer actively maintained. For new projects, use the [Bugsee .NET SDK](/sdk/dotnet/installation/), which supports .NET MAUI and modern .NET workloads.
:::

## Disabling log collection

Console log collection can be disabled completely using **CaptureLogs** launch option. See [configuration](/sdk/xamarin/configuration/) for more info.

## Sanitizing console logs

Bugsee automatically captures all standard applications console logs, but they can be protected as well.

For every event to be recorded, Bugsee will call your method and provide you with an object implementing IBugseeLogEvent. It is your
method's responsibility to clean up all user identifiable data from that structure and call provided handler() to pass it
back to Bugsee.

### Providing handler

You should pass a callback method (either as delegate or anonymous function) of **BugseeLogEventFilterHandler** to Bugsee.SetLogFilter().

```csharp
var rgx = new System.Text.RegularExpressions.Regex("Internal:.*", RegexOptions.IgnoreCase);

Bugsee.SetLogFilter(delegate (IBugseeLogEvent logEvent, BugseeLogEventFilterDecisionHandler handler)
{
    logEvent.Message = rgx.Replace(logEvent.Message, "<redacted>");
    
    // Pass null here to filter out that event
    handler.Invoke(logEvent);
});

// To stop using provided filter callback, just pass null
Bugsee.SetLogFilter(null);
```
