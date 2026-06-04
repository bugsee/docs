---
title: "Configuration (Beta)"
description: "All launch options and configuration parameters available for the Bugsee KMP SDK on iOS and Android, with platform-specific option tables."
sidebar_position: 1
slug: "/sdk/kmp/configuration"
---

:::warning[Beta release]
This page documents the Bugsee KMP SDK **beta**. Option names, defaults, and behavior may change before the stable release.
:::

## Launching with options

Bugsee behavior is highly customizable. Use `BugseeLaunchOptions` for common settings, or the platform-specific `BugseeLaunchOptionsAndroid` / `BugseeLaunchOptionsIos` classes to access all options for a given platform.

```kotlin
import com.bugsee.kmp.*

// Common options (work on both platforms)
val options = BugseeLaunchOptions()
options.videoEnabled = true
options.monitorNetwork = true
options.wifiOnlyUpload = false
Bugsee.launch("<your_app_token>", options)
```

For platform-specific options:

```kotlin
// Android-specific
val androidOptions = BugseeLaunchOptionsAndroid()
androidOptions.videoMode = BugseeVideoMode.V3
androidOptions.handleAnr = true
Bugsee.launch("<your_app_token>", androidOptions)

// iOS-specific
val iosOptions = BugseeLaunchOptionsIos()
iosOptions.killDetection = true
iosOptions.videoScale = 1.0
Bugsee.launch("<your_app_token>", iosOptions)
```

### Common Options

|Key|Default|Notes|
|---|---|---|
|videoEnabled|true|Enable video recording|
|crashReport|true|Catch and report application crashes|
|captureLogs|true|Automatically capture all console logs|
|monitorNetwork|true|Capture network traffic|
|shakeToReport|true (Android), false (iOS)|Shake gesture to trigger report|
|screenshotToReport|false (Android), true (iOS)|Screenshot key to trigger report|
|screenshotEnabled|true|Attach screenshot to a report|
|maxRecordingTime|60|Maximum recording duration in seconds|
|frameRate|BugseeFrameRate.High|How often frames are captured (Low, Medium, High)|
|minFrameRate|1|Minimum frame rate|
|maxFrameRate|30|Maximum frame rate|
|wifiOnlyUpload|false|Upload reports only on WiFi|
|maxDataSize|50|Maximum disk space in MB consumed by Bugsee|
|maxNetworkBodySize|20480|Maximum network body size in bytes to capture (0 = unlimited)|
|reportPrioritySelector|false|Allow user to modify priority when reporting|
|defaultBugPriority|BugseeSeverity.High|Default priority for bugs|
|defaultCrashPriority|BugseeSeverity.Blocker|Default priority for crashes|
|captureDeviceAndNetworkNames|true (Android), false (iOS)|Capture device name, WiFi SSID and carrier name|
|reportSummaryRequired|false|Require summary field in report UI|
|reportDescriptionRequired|false|Require description field in report UI|
|reportEmailRequired|false|Require email field in report UI|
|reportLabelsEnabled|false|Show labels field in report UI|
|reportLabelsRequired|false|Require labels field in report UI|
|viewHierarchyEnabled|true|Enable view hierarchy capturing|
|detectAppExit|false|Detect abnormal app termination|

### Android-Specific Options

|Key|Default|Notes|
|---|---|---|
|ndkCrashReport|false|Catch and report NDK (native) crashes|
|notificationBarTrigger|true|Show a notification to trigger report|
|serviceMode|false|Run without video/visual controls, continues in background|
|videoMode|BugseeVideoMode.V3|Video capture mechanism (None, V1, V2, V3)|
|videoQuality|BugseeVideoQuality.Default|Video quality (Default, Medium, High)|
|fallbackVideoMode|BugseeVideoMode.V1|Fallback if primary video mode fails|
|handleAnr|false|Detect and report ANR (Application Not Responding)|

### iOS-Specific Options

|Key|Default|Notes|
|---|---|---|
|monitorDiskSpace|false|Monitor available disk space|
|killDetection|false|Detect abnormal termination ([read more](/sdk/ios/app-kills/))|
|videoScale|1.0|Custom video scale factor|
|monitorBluetoothStatus|false|Monitor Bluetooth connection status|
|captureAVPlayer|false|Capture AVPlayer video content|
|captureOSLogs|false|Capture OS-level logs|
|monitorWebSocket|true|Monitor WebSocket connections|
|defaultErrorPriority|BugseeSeverity.High|Default priority for errors|
|enableMachExceptions|false|Enable Mach exception handling|
|statusBarInfo|false|Capture status bar information|
|bugseeStyle|"System"|UI style: "System", "Default", "Dark", or "BasedOnStatusBar"|

## Map-based launch

You can also launch with a raw options map:

```kotlin
val options = mapOf(
    "VideoEnabled" to true,
    "MaxRecordingTime" to 120
)
Bugsee.launch("<your_app_token>", options)
```

## Custom options

For options not exposed as typed properties:

```kotlin
val options = BugseeLaunchOptions()
options.setCustomOption("SomeKey", "SomeValue")
Bugsee.launch("<your_app_token>", options)
```
