---
title: "Lifecycle events"
description: "Subscribe to Bugsee SDK lifecycle events in React Native to be notified when the SDK starts, stops, pauses, or uploads reports."
sidebar_position: 8
slug: "/sdk/react_native/lifecycle"
---

Bugsee SDK silently works within your app and recording everything to assist you in debugging when something unexpected happens. Our SDK is designed as a black box, but there may be cases when you want to be notified about changes/events within Bugsee itself. Lifecycle events are designed exactly for that. Each time when internal state changes or some important event is raised, lifecycle event is dispatched to the user code.

## Implementing callback

Your should call **Bugsee.setLifecycleEventHandler** and provide the callback that will be executed when new lifecycle event is being dispatched:

```javascript
/**
    For eventType definition, refer to {@see Bugsee.LifecycleEventTypes} in
    "index.ts" in bugsee-react-native package.
*/
Bugsee.setLifecycleEventHandler((eventType) => {
    // Handle lifecycle event here...
});
```

## Available lifecycle events

|Name|Value|Description|
|-|-|-|
|Launched|0|Event is dispatched when Bugsee was successfully launched|
|Started|1|Event is dispatched when Bugsee is started after being stopped|
|Stopped|2|Event is dispatched when Bugsee is stopped|
|Resumed|3|Event is dispatched when Bugsee recording is resumed after being paused|
|Paused|4|Event is dispatched when Bugsee recording is paused|
|RelaunchedAfterCrash|5|Event is dispatched when Bugsee is launched and pending crash report is discovered. That usually means that app was relaunched after crash.|
|BeforeReportShown|6|Event is dispatched before the reporting UI is shown|
|AfterReportShown|7|Event is dispatched when reporting UI is shown|
|BeforeReportUploaded|8|Event is dispatched when report is about to be uploaded to the server|
|AfterReportUploaded|9|Event is dispatched when report was successfully uploaded to the server|
|BeforeFeedbackShown|10|Event is dispatched before the Feedback controller is shown|
|AfterFeedbackShown|11|Event is dispatched after the Feedback controller is shown|
