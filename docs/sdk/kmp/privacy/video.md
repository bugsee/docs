---
title: "Privacy and video (Beta)"
description: "How to disable video recording or obscure sensitive views to protect user privacy in recorded sessions with the Bugsee KMP SDK."
sidebar_position: 1
slug: "/sdk/kmp/privacy/video"
---

## Disabling video

Video recording can be disabled completely using the **videoEnabled** launch option. See [configuration](/sdk/kmp/configuration/) for more info.

## Protecting Compose views

Bugsee automatically detects and hides secure input fields (e.g. password fields) from the recorded video. However, due to the declarative nature of Compose UI, automatic detection may not cover all cases. We recommend using the `BugseeProtect` composable to explicitly wrap any sensitive content. It places a secure overlay that hides the protected area from Bugsee video recordings and screenshots on both Android and iOS.

Add the `library-protect` dependency to your shared module:

```kotlin
commonMain.dependencies {
    implementation("com.bugsee:bugsee-kotlin-multiplatform:+")
    implementation("com.bugsee:bugsee-kotlin-multiplatform-protect:+")
}
```

Then wrap any composable content:

```kotlin
import com.bugsee.kmp.protect.BugseeProtect

@Composable
fun MyScreen() {
    Column {
        Text("Public content")

        BugseeProtect {
            // This content is obscured in video recordings
            Text("Sensitive data: credit card number")
        }

        BugseeProtect(modifier = Modifier.fillMaxWidth()) {
            TextField(value = password, onValueChange = { ... })
        }
    }
}
```

:::warning
`Bugsee.launch()` must be called before `BugseeProtect` enters composition. Calling it from a platform entry point (e.g. `Application.onCreate`, iOS `AppDelegate`) is recommended.
:::

## Protecting platform-native views

For non-Compose views, use the lower-level API to mark platform-native views as secure:

```kotlin
// Add a view to be obscured (android.view.View on Android, platform.UIKit.UIView on iOS)
Bugsee.addSecureView(myView)

// Remove a view from the secure list
Bugsee.removeSecureView(myView)
```

The parameter type is `Any?` so the API can live on the common `Bugsee` object, but only `android.view.View` (on Android) and `platform.UIKit.UIView` (on iOS) are accepted — anything else is logged as a warning and ignored. Call these from your `androidMain` / `iosMain` source sets where the platform view types are in scope.
