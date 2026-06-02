---
title: "SwiftUI"
description: "How to initialize Bugsee in a SwiftUI app lifecycle and protect sensitive SwiftUI views from being captured on video."
sidebar_position: 2
slug: "/sdk/ios/swiftui"
---

## SwiftUI App Lifecycle

If your app adopts the SwiftUI App Life Cycle, the simplest approach is to launch Bugsee within the App conformer’s initializer:

```swift
import Bugsee
import SwiftUI

@main
struct BugseeSwiftUIApp: App {
    init() {
        let options : [String: Any] =
            [ BugseeMaxRecordingTimeKey   : 60,
              BugseeShakeToReportKey      : false,
              BugseeScreenshotToReportKey : true,
              BugseeCrashReportKey        : true ]

        Bugsee.launch(token: "<your_app_token>", options: options)
    }
}
```

## Protecting views

All system secure fields ([SecureField](https://developer.apple.com/documentation/swiftui/securefield)) are hidden from the recorded video automatically. In addition we support a way to mark your custom sensitive views so they will be treated similarly. We provide a View extension for this ([View+Bugsee.swift](https://github.com/bugsee/bugsee-swiftui)) with `bugseeProtect()` and `bugseeProtect(isEnabled:)` methods.

**Static protection** (view is always hidden):

```swift
Text(landmark.description)
    .bugseeProtect()
```

**Dynamic protection** (visibility controlled by state or binding):

```swift
@State private var isHidden = false

Text(landmark.description)
    .bugseeProtect(isEnabled: $isHidden)
    .onAppear {
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            isHidden = true
        }
    }
```
