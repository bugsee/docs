---
title: "Configuration"
description: "Reference for all Bugsee Unity SDK launch options for iOS and Android, including video modes, crash reporting, and network monitoring."
sidebar_position: 1
slug: "/sdk/unity/configuration"
---

## Launching with options

Bugsee behavior is very customizable, if default configuration is not satisfying your needs you can launch the SDK with additional parameters. You'll need to create partial class ```BugseeLauncher``` within namespace ```BugseePlugin``` in a separate file. Use instance of ```IOSLaunchOptions``` or ```AndroidLaunchOptions``` for corresponding platform to change Bugsee behavior.

```csharp
namespace BugseePlugin
{
    public partial class BugseeLauncher
    {
        static BugseeLauncher()
        {
            AndroidOptionsHandler = GetAndroidOptions;
            IosOptionsHandler = GetIosOptions;
        }

        private static AndroidLaunchOptions GetAndroidOptions()
        {
            return new AndroidLaunchOptions()
            {
                // Set custom Android launch options here.
                VideoEnabled = false
            };
        }

        private static IOSLaunchOptions GetIosOptions()
        {
            return new IOSLaunchOptions()
            {
                // Set custom iOS launch options here. 
                MonitorNetwork = false
            };
        }
    }
}
```

## Stopping

Stopping will fully stop the SDK operation and clean up all the used resources. The operation may take a while to complete.

```csharp
Bugsee.Stop();
```

## Relaunching

Stopping will fully stop the SDK operation and clean up all the used resources. Upon completion it will relaunch it again with new options.

```csharp
BugseeLaunchOptions options = ...;
Bugsee.Relaunch(options);
```


### Available Options

#### For iOS

|Key|Default|Notes
|---|---|---|
|CaptureLogs|true|Automatically capture all console logs|
|CrashReport|true|Catch and report application crashes (\*)|
|DefaultBugPriority|Low|Default priority for bugs|
|DefaultCrashPriority|Blocker|Default priority for crashes|
|KillDetection|false|Detect abnormal termination (experimental, [read more](/sdk/ios/app-kills/))|
|MaxRecordingTime|60|Maximum recording duration|
|MonitorNetwork|true|Capture network traffic|
|ReportPrioritySelector|false|Allow user to modify priority when reporting manual|
|ScreenshotToReport|true|Screenshot key to trigger report|
|ShakeToReport|false|Shake gesture to trigger report|
|Style|Default|Enumeration of Default, Dark and BasedOnStatusBar
|VideoEnabled|true|Enable video recording|
|FrameRate|High|Specifies how often frames are captured|
|ScreenshotEnabled|true|Attach screenshot to a report. Note, that if VideoEnabled option is false, default value of this option is false too.|
|WifiOnlyUpload|false|Upload reports only when a device is connected to a WiFi network|
|MaxDataSize|50|Bugsee will avoid using more disk space than specified (in MB). If total Bugsee data size exceeds specified value, oldest recordings (even not sent) will be removed. Value should not be smaller than 10|
|VideoScale|1.0|Additional down scaling applied to recorded video, (e.g., 0.5 would reduce both width and height by half).|
|CaptureDeviceAndNetworkNames|true|Capture device name, wifi SSID and mobile carrier name.|
|DetectAppExit|false|Detect any kind of process termination (e.g. when user swipes off the application from multitasking UI, or when system unloads the app due memory pressure). Special error report is generated for this scenario with "BugseeAppExit" domain|
|ViewHierarchyEnabled|false|Capture view hierarchy for Bug and Error reports|
|CaptureOSLogs|false|Automatically capture OSLog and Logger print statements|
|MonitorBluetoothStatus|false|Monitor bluetooth state.<br />IMPORTANT: You must add "Privacy - Bluetooth Always Usage Description" key into your Info.plist with a string value explaining to the user why you need bluetooth permission|
|MonitorDiskSpace|false||
|AppLaunchCrashDetection|false|Controls whether early crashes are intercepted and uploaded. Early crashes are those happening within first 5 seconds after app launch. And they are uploaded synchronously (with blocking main thread) to guarantee upload|
|CaptureAVPlayer|false|When enabled, video playing via AVPlayerLayer and via AVPlayerViewController will be captured on video|

:::warning
* iOS allows only one crash detector to be active at a time, if you insist on using an alternative solution for handling crashes, you might want to use this option and disable Bugsee from taking over.
:::


#### For Android

|Key|Default|Notes
|---|---|---|
|CaptureLogs|true|Automatically capture all console logs|
|CrashReport|true|Catch and report application crashes|
|DefaultBugPriority|High|Default priority for bugs|
|DefaultCrashPriority|Blocker|Default priority for crashes|
|VideoMode|V3| Screen capture mechanism. Video modes comparison is presented below in [**Video modes comparison**](#android-video-modes-comparison) section. Before 3.3.0, VideoMode had default value of None. |
|FrameRate|High|Specifies how often frames are captured|
|LogLevel|Verbose|Minimal log level of Logcat messages, which will be attached to report|
|MaxDataSize|50|Maximum disk space consumed by Bugsee|
|MaxRecordingTime|60|Maximum recording duration|
|MonitorNetwork|true|Capture network traffic|
|ReportPrioritySelector|false|Allow user to modify priority when reporting manual|
|NotificationBarTrigger|true|Trigger report from notification bar|
|ScreenshotEnabled|true|Attach screenshot to a report. Note, that if VideoEnabled option is false, default value of this option is false too.|
|ServiceMode|false|Used, when Bugsee is launched from service. No video and no visual controls available. Recording continues even in background.|
|ShakeToTrigger|true|Shake gesture to trigger report|
|VideoEnabled|true|Enable video recording|
|WifiOnlyUpload|false|Upload reports only when a device is connected to a WiFi network|
|VideoScale|1.0|Additional down scaling applied to recorded video, (e.g., 0.5 would reduce both width and height by half).|
|CaptureDeviceAndNetworkNames|true|Capture device name, wifi SSID and mobile carrier name.|
|ScreenshotToReport|false|Trigger bug report by taking screenshot on device.<br /><br />Bugsee Android SDK 5.0.0 and up.<br /><br />This feature requires additional permissions:<br />**Android 14+**: DETECT_SCREEN_CAPTURE permission is required. More details about the permission and the native API involved in [Android development documentation](https://developer.android.com/about/versions/14/features/screenshot-detection).<br /><br />**Android 13**: READ_MEDIA_IMAGES permission is required.<br /><br />**Android 12** and below: READ_EXTERNAL_STORAGE permission is required.<br /><br />On Android 13 and below, Bugsee SDK monitors the gallery to detect screenshot creation and that's why the permissions mentioned above are required.|
|DetectAppExit|false|Detect any kind of process termination (e.g. when user swipes off the application from multitasking UI, or when system unloads the app due memory pressure). Special error report is generated for this scenario with "BugseeAppExit" domain|
|ViewHierarchyEnabled|false|Capture view hierarchy for Bug and Error reports|

##### Android video modes comparison
|Mode name|Captures SurfaceView (GlSurfaceView, VideoView, MapView, etc.)|Captures system views (keyboard, status bar, etc.)|Requires user confirmation|Minimal supported Android API level|
|---|---|---|---|---|
|VideoMode.V1|-|-|-|21|
|VideoMode.V2\*\*|+|+|+|21|
|VideoMode.V3\*\*\*|+|-|-|24|
|VideoMove.V4\*\*\*\*|+|-|-|21|

### Built-in reporting UI adjustments

Alongside stylistic changes, you can also change the placeholders' texts shown in input controls within the built-in bug reporting UI

```csharp
Bugsee.Appearance.Report.SummaryPlaceholder = "What's happened? Only shortly";
Bugsee.Appearance.Report.DescriptionPlaceholder = "Here, describe all the pains and frustrations you had. In details";
Bugsee.Appearance.Report.EmailPlaceholder = "Identify yourself here";
Bugsee.Appearance.Report.LabelsPlaceholder = "Labels.For.Developers. [Comma separated]";
```

 <br />

**\*\*VideoMode.V2**: Starting Android 9 it requires [FOREGROUND_SERVICE](https://developer.android.com/reference/android/Manifest.permission#FOREGROUND_SERVICE) permission.
Starting Android 14 it requires additional [FOREGROUND_SERVICE_MEDIA_PROJECTION](https://developer.android.com/reference/android/Manifest.permission#FOREGROUND_SERVICE_MEDIA_PROJECTION) permission.
If you want to use V2 mode, your application will have to declare these permissions in manifest.

**\*\*\*VideoMode.V3**: On Samsung devices, VideoMode.V3 will work only on Android 8 and up. Earlier versions of Android on Samsung devices are known to have issues when VideoMode.V3 is being used and hence it preemptively disabled there.

**\*\*\*\*VideoMove.V4**: VideoMode.V4 (experimental) gives client code an ability to decide when to add frames to a video, calling Bugsee.Snapshot() method. If frames are added rarely, additional CPU and GPU load is relatively small, but the resulting video looks more like a slide show. And vice versa, in case of frequent calls to Bugsee.Snapshot() performance can be influenced essentially, but the resulting video looks better. By default frame is added to a video only on the start of recording and on exception.

Note that it is necessary to enable "Allow unsafe code" option in Player Settings and to execute an additional step, described in "Gather GPU info on Android" section of [Installation guide](/sdk/unity/installation/) to make VideoMode.V4 work. Also, note that starting with Bugsee Unity SDK 1.7.0 V4 is disabled and unavailable by default. You need to define ```BUGSEE_VIDEO_V4``` to enable VideoMode.V4. The reason for this, as stated above, is that V4 requires unsafe option to be set for the project, which is not usually desired. You can find out how to supply your own ```#define``` directives in <a class="external-link" href="https://docs.unity3d.com/Manual/PlatformDependentCompilation.html" rel="noopener noreferrer" target="_blank">Platform dependent compilation</a> section of Unity documentation.