---
title: "Lifecycle events (Beta)"
description: "How to subscribe to Bugsee SDK lifecycle events in KMP, with a reference table of all available event types and control methods."
sidebar_position: 9
slug: "/sdk/kmp/lifecycle"
---

Bugsee SDK works silently within your app, recording everything to assist debugging. Lifecycle events let you be notified about internal state changes and important events within the SDK.

## Implementing callback

```kotlin
Bugsee.setLifecycleEventsListener { event ->
    when (event) {
        BugseeLifecycleEvent.Launched -> println("Bugsee launched")
        BugseeLifecycleEvent.ReportUploadFailed -> println("Report upload failed")
        else -> println("Bugsee event: $event")
    }
}
```

## Available lifecycle events

|Name|Description|
|---|---|
|Launched|Bugsee was successfully launched|
|Started|Bugsee started after being stopped|
|Stopped|Bugsee was stopped|
|Resumed|Recording resumed after being paused|
|Paused|Recording was paused|
|RelaunchedAfterCrash|Bugsee launched with a pending crash report (app was relaunched after crash)|
|BeforeReportShown|About to show the reporting UI|
|AfterReportShown|Reporting UI is shown|
|BeforeReportUploaded|Report is about to be uploaded|
|AfterReportUploaded|Report was successfully uploaded|
|BeforeFeedbackShown|About to show the feedback controller|
|AfterFeedbackShown|Feedback controller is shown|
|BeforeReportAssembled|Report is about to be assembled|
|AfterReportAssembled|Report was assembled|
|ReportUploadFailedWithFutureRetry|Upload failed, will retry later|
|ReportUploadFailed|Upload failed permanently|

## Pause and resume

Temporarily pause and resume Bugsee recording:

```kotlin
Bugsee.pause()

// ... later
Bugsee.resume()
```

## Stop and relaunch

Completely stop or restart the SDK:

```kotlin
Bugsee.stop()

// Check if running
val isRunning = Bugsee.isLaunched()

// Relaunch with the same configuration
Bugsee.relaunch()

// Relaunch with new options
Bugsee.relaunch(BugseeLaunchOptions().apply {
    videoEnabled = false
})
```

## Data cleanup

Delete all collected data stored on the device:

```kotlin
Bugsee.deleteCollectedDataOnDevice { success ->
    println("Data deleted: $success")
}
```
