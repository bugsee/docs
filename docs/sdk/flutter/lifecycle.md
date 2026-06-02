---
title: "Lifecycle events"
description: "How to subscribe to Bugsee SDK lifecycle events in Flutter, with a reference table of all available event types and their descriptions."
sidebar_position: 9
slug: "/sdk/flutter/lifecycle"
---

Bugsee SDK silently works within your app and recording everything to assist you in debugging when something unexpected happens. Our SDK is designed as a black box, but there may be cases when you want to be notified about changes/events within Bugsee itself. Lifecycle events are designed exactly for that. Each time when internal state changes or some important event is raised, lifecycle event is dispatched to the user code.

## Implementing callback

Your should call **Bugsee.setLifecycleCallback** and provide the callback:

```dart
void onBugseeLifecycleEvent(BugseeLifecycleEventType e) {
  print(e);
}

Bugsee.setLifecycleCallback(onBugseeLifecycleEvent);
```

## Available lifecycle events

|Name|Description|
|-|-|
|launched|Event is dispatched when Bugsee was successfully launched|
|started|Event is dispatched when Bugsee is started after being stopped|
|stopped|Event is dispatched when Bugsee is stopped|
|resumed|Event is dispatched when Bugsee recording is resumed after being paused|
|paused|Event is dispatched when Bugsee recording is paused|
|relaunchedAfterCrash|Event is dispatched when Bugsee is launched and pending crash report is discovered. That usually means that app was relaunched after crash.|
|beforeReportShown|Event is dispatched before the reporting UI is shown|
|afterReportShown|Event is dispatched when reporting UI is shown|
|beforeReportUploaded|Event is dispatched when report is about to be uploaded to the server|
|afterReportUploaded|Event is dispatched when report was successfully uploaded to the server|
|beforeFeedbackShown|Event is dispatched before the Feedback controller is shown|
|afterFeedbackShown|Event is dispatched after the Feedback controller is shown|
|beforeReportAssembled|Event is dispatched right before bug/error/crash report is about to be assembled|
|afterReportAssembled|Event is dispatched right after bug/error/crash report is assembled|