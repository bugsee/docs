---
title: "Lifecycle events"
description: "Subscribe to Bugsee SDK lifecycle events in Unity to be notified when the SDK starts, stops, pauses, or uploads reports."
sidebar_position: 9
slug: "/sdk/unity/lifecycle"
---

Bugsee SDK silently works within your app and recording everything to assist you in debugging when something unexpected happens. Our SDK is designed as a black box, but there may be cases when you want to be notified about changes/events within Bugsee itself. Lifecycle events are designed exactly for that. Each time when internal state changes or some important event is raised, lifecycle event is dispatched to the user code.

## Implementing callback

:::warning
"bgs_gameObject" GameObject is required to perform communication between managed code and our platform SDK. Please, do not remove or rename "bgs_gameObject".
:::

Your should subscribe to **Bugsee.OnLifecycleEvent** event and handle incoming lifecycle changes in the attached handler:

```csharp
private void OnBugseeLifecycleEvent(BugseeLifecycleEventType eventType)
{
    // Handle lifecycle event here...
}

Bugsee.OnLifecycleEvent += OnBugseeLifecycleEvent;
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
