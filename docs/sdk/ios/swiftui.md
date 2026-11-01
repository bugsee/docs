---
title: "SwiftUI"
description: "How to launch Bugsee iOS SDK 7.x from a SwiftUI App and hide sensitive SwiftUI views from the recorded video with the BugseeSwiftUI module."
sidebar_position: 2
slug: "/sdk/ios/swiftui"
---

## SwiftUI App lifecycle

If your app uses the SwiftUI App lifecycle, launch Bugsee in the initializer of your `App` type:

```swift
import Bugsee
import SwiftUI

@main
struct MyApp: App {
    init() {
        Bugsee.launch(token: "<your_app_token>")
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

To pass options, use a `BugseeOptions` object, or a dictionary of `BugseeOption*` keys with `launch(token:dictionaryOptions:)`:

```swift
init() {
    let options = BugseeOptions.default()
    options.maxRecordingTime = 60
    options.shakeToReport = true
    options.screenshotToReport = false

    Bugsee.launch(token: "<your_app_token>", options: options)
}
```

```swift
init() {
    let options: [String: Any] = [
        BugseeOptionConfigDuration: 60,
        BugseeOptionReportingTriggerByShake: true,
        BugseeOptionReportingTriggerByScreenshot: false,
    ]

    Bugsee.launch(token: "<your_app_token>", dictionaryOptions: options)
}
```

Always use the `BugseeOption*` constants as keys. See [Configuration](/sdk/ios/configuration/) for every option.

## Protecting views

System secure fields ([SecureField](https://developer.apple.com/documentation/swiftui/securefield)) are hidden from the recorded video automatically. To hide your own sensitive views the same way, use the view modifiers of the `BugseeSwiftUI` module.

`BugseeSwiftUI` is a library product of the Bugsee Swift package (`https://github.com/bugsee/spm`). Add the **BugseeSwiftUI** product to your app target; it links the core `Bugsee` framework too. Then import both modules where you use the modifiers:

```swift
import Bugsee
import BugseeSwiftUI
```

`BugseeSwiftUI` requires iOS 15 (tvOS 15, visionOS 1), like the core SDK. It is not part of the direct-download XCFramework.

**Static protection** — the view is always hidden:

```swift
Text(account.number)
    .bugseeProtect()
```

**Dynamic protection** — a `Binding<Bool>` turns the protection on and off:

```swift
@State private var isHidden = false

Text(account.number)
    .bugseeProtect(isEnabled: $isHidden)
```

If the view has offsets, apply `bugseeProtect()` before them, so the protected area follows the view:

```swift
CircleImage(image: profile.image)
    .bugseeProtect()
    .offset(y: -130)
```

The modifiers place a transparent overlay over the view and mark that overlay as protected, as `UIView.bugseeProtectedView` does for a UIKit view. The overlay does not take touches. To use the same overlay in your own view composition, `BugseeProtectedOverlayUIView(isProtected:)` is public too.

`bugseeProtect(_:)`, the variant that takes a closure receiving the overlay's `UIView`, is deprecated. Use `bugseeProtect()` or `bugseeProtect(isEnabled:)` instead.

See [Privacy: Video](/sdk/ios/privacy/video/) for the other ways to hide content: secure views, secure rectangles and blackout.
