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

All system secure fields ([SecureField](https://developer.apple.com/documentation/swiftui/securefield)) are hidden from the recorded video automatically. In addition we support a way to mark your custom sensitive views so they will be treated similarly, through the `bugseeProtect()` and `bugseeProtect(isEnabled:)` View extensions.

These extensions ship with the SDK in a separate `BugseeSwiftUI` module of the [Bugsee Swift package](/sdk/ios/installation/#swift-package-manager). When adding `https://github.com/bugsee/spm` to your project, pick the **BugseeSwiftUI** library product (it also links the core `Bugsee` framework), then import it in the files where you use the modifiers:

```swift
import Bugsee
import BugseeSwiftUI
```

:::info
`BugseeSwiftUI` requires iOS 13.0 or later; on iOS 12 the core `Bugsee` module remains fully usable. The module is part of the Swift Package Manager distribution only — the CocoaPods pod and the Carthage/manual XCFramework ship the core `Bugsee` framework alone.
:::

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
