---
title: "Installation (Beta)"
description: "Step-by-step guide to adding the Bugsee KMP SDK to your Kotlin Multiplatform project via Maven Central and initializing it on Android and iOS."
sidebar_position: 0
slug: "/sdk/kmp/installation"
---

:::info Agent-Assisted Setup
Ask your AI coding assistant:

```text
Use curl to download, read and follow: https://docs.bugsee.com/ai/agent-skills/sdk/kmp/SKILL.md
```

Works with Claude Code, Cursor, Copilot, Codex, and more. [Learn more](/ai/agent-skills/)
:::

:::warning Beta release
This page documents the **beta** release of the Bugsee KMP SDK. The API may change before the stable release. Pin your dependency to a specific version rather than using a floating range.
:::

## Installation

Add the Bugsee KMP SDK to your shared module's `build.gradle.kts`. The native Android SDK is pulled in transitively. For iOS, add the Bugsee pod via the Kotlin CocoaPods plugin:

```kotlin
kotlin {
    cocoapods {
        // ... your existing cocoapods configuration

        pod("Bugsee")
    }

    sourceSets {
        commonMain.dependencies {
            implementation("com.bugsee:bugsee-kotlin-multiplatform:+")
        }
    }
}
```

:::warning
The CocoaPods integration approach can't be used together with the `embedAndSignAppleFrameworkForXcode` mechanism used for direct integration. See the [Kotlin CocoaPods overview](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html#set-up-an-environment-to-work-with-cocoapods) for details.
:::

## Initialization

For the best Bugsee functionality, initialize the SDK as early as possible in the app lifecycle.

### Android

Initialize Bugsee in your `Application.onCreate()`:

```kotlin
import com.bugsee.kmp.Bugsee
import com.bugsee.kmp.BugseeLaunchOptions

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        val options = BugseeLaunchOptions()
        options.monitorNetwork = true
        options.captureLogs = true
        options.videoEnabled = true
        options.viewHierarchyEnabled = true
        options.shakeToReport = true
        Bugsee.launch("<your_app_token>", options)
    }
}
```

In KMP projects the `AndroidManifest.xml` often has no `android:name` attribute on the `<application>` tag. Make sure to add it so your `Application` subclass is actually used:

```xml
<application
    android:name=".MyApplication"
    ...>
```

### iOS

Launch Bugsee from your Kotlin iOS entry point. See this `MainViewController...` code:

```kotlin
import androidx.compose.ui.window.ComposeUIViewController
import com.bugsee.kmp.Bugsee
import com.bugsee.kmp.BugseeLaunchOptions

fun MainViewController(): UIViewController {
    val options = BugseeLaunchOptions()
    options.monitorNetwork = true
    options.captureLogs = true
    options.videoEnabled = true
    options.viewHierarchyEnabled = true
    options.shakeToReport = true
    Bugsee.launch("<your_app_token>", options)

    return ComposeUIViewController {
        App()
    }
}
```

Alternatively, call `Bugsee.launch()` from your iOS `AppDelegate.application(_:didFinishLaunchingWithOptions:)` or SwiftUI App's init() — whichever entry point runs earliest in your app works.

> Replace `<your_app_token>` with the token from your Bugsee dashboard. It is common to use different tokens for iOS and Android apps.

See [configuration](/sdk/kmp/configuration/) to learn more about launch options and customizations.
