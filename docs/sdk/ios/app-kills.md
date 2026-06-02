---
title: "Application kill detection"
description: "How to enable heuristic detection of abnormal iOS app terminations caused by OOM conditions or an unresponsive main thread."
sidebar_position: 11
slug: "/sdk/ios/app-kills"
---

In some rare cases, iOS may decide to terminate an application due to excessive memory or CPU usage, as well as when it detects the app is not responding. These cases are not
registered as crashes. Bugsee may try to detect these and handle them as crashes, while collecting valuable statistics and analytics on devices and iOS versions it happens on.

> **Note:** This feature is based on heuristics and may result in false positives in some scenarios. Thus disabled by default. Use at your own risk.

In order to enable application kill detection, launch Bugsee with a `BugseeKillDetectionKey` option set to `YES`. Bugsee will try to automatically detect the following conditions:

- The app was terminated by the system due to OOM (Out of Memory) while in foreground
- The app was terminated by the system due to OOM (Out of Memory) while in background
- The app was terminated by the system or a user, because main UI thread became unresponsive

It should ignore other kill conditions (i.e., user application kill, application upgrade, system reboots etc.)

## Enabling kill detection

**Objective-C**

```objectivec
NSDictionary *options = @{
    BugseeKillDetectionKey : BugseeTrue
};

[Bugsee launchWithToken:@"<your_app_token>" andOptions:options];
```

**Swift**

```swift
let options: [String: Any] = [
    BugseeKillDetectionKey : true
]

Bugsee.launch(token: "<your_app_token>", options: options)
```
