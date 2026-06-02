---
title: "Configuration"
description: "All launch options and configuration parameters available for the Bugsee Flutter SDK on iOS and Android, with platform-specific option tables."
sidebar_position: 1
slug: "/sdk/flutter/configuration"
---

## Launching with options

:::warning
iOS/iPadOS: Since v9.0.0 the underlying Bugsee iOS SDK supports the simulator; crash capture is excluded. For full functionality, launch your app with Bugsee on a real device.
:::

Bugsee behavior is very customizable, if default configuration is not satisfying your needs you can launch the SDK with additional parameters. Use instance of ```IOSLaunchOptions``` or ```AndroidLaunchOptions``` for corresponding platform to change Bugsee behavior.

Example:

```dart
BugseeLaunchOptions? createLaunchOptions() {
  if (Platform.isAndroid) {
    var options = AndroidLaunchOptions();
    // You can set Android-specific options here
    return options;
  }

  if (Platform.isIOS) {
    var options = IOSLaunchOptions();
    // You can set iOS-specific options here
    return options;
  }

  return null;
}

Future<void> launchBugsee(
    void Function(bool isBugseeLaunched) appRunner) async {
  var launchOptions = createLaunchOptions();

  // Set all the required launch options to the desired state
  launchOptions?.videoEnabled = true;
  launchOptions?.wifiOnlyUpload = true;
  launchOptions?.viewHierarchyEnabled = false;

  await Bugsee.launch(getApplicationToken(),
      appRunCallback: appRunner, launchOptions: launchOptions);
}

String getApplicationToken() {
  return Platform.isAndroid
      ? '<android-app-token>'
      : (Platform.isIOS ? '<ios-app-token>' : '');
}

Future<void> main() async {
  // This is required to let Bugsee intercept network requests
  HttpOverrides.global = Bugsee.defaultHttpOverrides;

  await launchBugsee((bool isBugseeLaunched) async {
    runApp(const MyApp());
  });
}
```

### Available Options

#### For iOS

|Key|Default|Notes
|---|---|---|
|captureLogs|true|Automatically capture all console logs|
|crashReport|true|Catch and report application crashes (\*)|
|defaultBugPriority|BugseeSeverityLevel.high|Default priority for bugs|
|defaultCrashPriority|BugseeSeverityLevel.blocker|Default priority for crashes|
|killDetection|false|Detect abnormal termination (experimental, [read more](/sdk/ios/app-kills/))|
|maxRecordingTime|60|Maximum recording duration|
|monitorNetwork|true|Capture network traffic|
|reportPrioritySelector|false|Allow user to modify priority when reporting manual|
|screenshotToReport|true|Screenshot key to trigger report|
|shakeToReport|false|Shake gesture to trigger report|
|style|Default|Enumeration of Default, Dark and BasedOnStatusBar
|videoEnabled|true|Enable video recording|
|videoScale|1.0|Custom video scale|
|frameRate|BugseeFrameRate.high|Specifies how often frames are captured|
|screenshotEnabled|true|Attach screenshot to a report|
|wifiOnlyUpload|false|Upload reports only when a device is connected to a WiFi network|
|maxDataSize|50|Bugsee will avoid using more disk space than specified (in MB). If total Bugsee data size exceeds specified value, oldest recordings (even not sent) will be removed. Value should not be smaller than 10|
|captureDeviceAndNetworkNames|false|Capture device name, wifi SSID and mobile carrier name.|


#### For Android

|Key|Default|Notes
|---|---|---|
|captureLogs|true|Automatically capture all console logs|
|crashReport|true|Catch and report application crashes|
|defaultBugPriority|BugseeSeverityLevel.high|Default priority for bugs|
|defaultCrashPriority|BugseeSeverityLevel.blocker|Default priority for crashes|
|videoMode|BugseeVideoMode.v3|Video capture mechanism to use|
|frameRate|BugseeFrameRate.high|Specifies how often frames are captured|
|maxDataSize|50|Maximum disk space consumed by Bugsee|
|maxRecordingTime|60|Maximum recording duration|
|monitorNetwork|true|Capture network traffic|
|reportPrioritySelector|false|Allow user to modify priority when reporting manual|
|screenshotEnabled|true|Attach screenshot to a report|
|serviceMode|false|Used, when Bugsee is launched from service. No video and no visual controls available. Recording continues even in background.|
|shakeToTrigger|false|Shake gesture to trigger report|
|videoEnabled|true|Enable video recording|
|videoScale|1.0|Custom video scale|
|wifiOnlyUpload|false|Upload reports only when a device is connected to a WiFi network|
|captureDeviceAndNetworkNames|false|Capture device name, wifi SSID and mobile carrier name.|
