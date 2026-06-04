---
title: "Lifecycle events"
description: "How to subscribe to Bugsee SDK lifecycle events in Xamarin to be notified of state changes such as launch, stop, pause, and report upload."
sidebar_position: 9
slug: "/sdk/xamarin/lifecycle"
---

:::caution[Deprecated]
Microsoft ended support for Xamarin on May 1, 2024. The Bugsee Xamarin SDK is no longer actively maintained. For new projects, use the [Bugsee .NET SDK](/sdk/dotnet/installation/), which supports .NET MAUI and modern .NET workloads.
:::

Bugsee SDK silently works within your app and recording everything to assist you in debugging when something unexpected happens. Our SDK is designed as a black box, but there may be cases when you want to be notified about changes/events within Bugsee itself. Lifecycle events are designed exactly for that. Each time when internal state changes or some important event is raised, lifecycle event is dispatched to the user code.

## Implementing callback

Your should call **Bugsee.SetLifecycleEventHandler** and provide the callback of **BugseeLifecycleEventHandler** as the only parameter to it:

```csharp
Bugsee.SetLifecycleEventHandler((BugseeLifecycleEventType eventType) =>
{
    // Handle lifecycle event here...
});
```

## Available lifecycle events

|Name|Description|
|-|-|
|Launched|Event is dispatched when Bugsee was successfully launched|
|Started|Event is dispatched when Bugsee is started after being stopped|
|Stopped|Event is dispatched when Bugsee is stopped|
|Resumed|Event is dispatched when Bugsee recording is resumed after being paused|
|Paused|Event is dispatched when Bugsee recording is paused|
|RelaunchedAfterCrash|Event is dispatched when Bugsee is launched and pending crash report is discovered. That usually means that app was relaunched after crash.|
|BeforeReportShown|Event is dispatched before the reporting UI is shown|
|AfterReportShown|Event is dispatched when reporting UI is shown|
|BeforeReportUploaded|Event is dispatched when report is about to be uploaded to the server|
|AfterReportUploaded|Event is dispatched when report was successfully uploaded to the server|
|BeforeFeedbackShown|Event is dispatched before the Feedback controller is shown|
|AfterFeedbackShown|Event is dispatched after the Feedback controller is shown|
|BeforeReportAssembled|Event is dispatched right before bug/error/crash report is about to be assembled|
|AfterReportAssembled|Event is dispatched right after bug/error/crash report is assembled|