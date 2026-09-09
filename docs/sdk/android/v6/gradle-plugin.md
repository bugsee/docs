---
title: "Bugsee Gradle Plugin"
description: "Overview and configuration guide for the 3.x Bugsee Gradle plugin — ProGuard/R8 mapping uploads, NDK symbol uploads, and BUILD_UUID manifest injection for SDK 6.x."
sidebar_position: 12
slug: "/sdk/android/v6/gradle-plugin"
---

:::caution[Previous version]
This page documents Bugsee Android SDK **6.x**, the previous major version. The current line is **7.x** — see [Migrating from 6.x to 7.x](/sdk/android/migration) to upgrade, or [Installation](/sdk/android/installation) to start a new integration.
:::

This page documents the **3.x** Gradle plugin, the line that matches SDK 6.x. If you are on SDK 7.x, see the [current Gradle plugin reference](/sdk/android/gradle-plugin) instead.

The 3.x Bugsee Gradle Plugin integrates into your Android build to provide:

- **Mapping file upload** — uploads ProGuard/R8 mapping files to Bugsee for crash symbolication.
- **NDK symbol upload** — uploads native debug symbols for native crash symbolication.
- **Manifest injection** — injects a per-build `BUILD_UUID` meta-data entry into the merged manifest for build correlation.

You can find the plugin in the <a rel="noopener noreferrer" href="https://central.sonatype.com/artifact/com.bugsee/bugsee-android-gradle-plugin">Maven repository</a>.

## Installation

Add the plugin to your app module:

```kotlin title="app/build.gradle.kts"
plugins {
    id("com.android.application")
    id("com.bugsee.android.gradle") version "<version>"
}
```

Or using the legacy buildscript classpath:

```kotlin title="build.gradle.kts (root)"
buildscript {
    dependencies {
        classpath("com.bugsee:bugsee-android-gradle-plugin:<version>")
    }
}
```

```kotlin title="app/build.gradle.kts"
plugins {
    id("com.android.application")
    id("com.bugsee.android.gradle")
}
```

## Configuration

```kotlin title="app/build.gradle.kts"
bugsee {
    appToken("<your-app-token>")
    endpoint = "https://api.bugsee.com"  // custom endpoint (optional)
    debug = false                         // enable plugin debug logging
    ndk(true)                             // upload NDK debug symbols
}
```

:::note
**No bytecode instrumentation in 3.x.** Build-time bytecode instrumentation (Logcat, OkHttp, HttpEngine, thread registration, operation dispatch, main-thread misuse, Compose touch input), the Bugsee Kotlin compiler plugin (Compose tag injection and `Modifier.bugseeSecure()` auto-insertion), and auto-install of the `bugsee-android-*` extension modules were all introduced in the **4.x** plugin, which requires SDK 7.x. The 3.x plugin does not transform your classes at all. See [Gradle plugin — Instrumentation](/sdk/android/gradle-plugin/instrumentation) and [Gradle plugin — Auto-load & extensions](/sdk/android/gradle-plugin/auto-load) for those features.
:::

On SDK 6.x, HTTP clients other than `HttpURLConnection`/`HttpsURLConnection` are wired up manually in your own code — see [network events](/sdk/android/v6/network/).

## Build tasks

The plugin registers per-variant tasks on application variants. The manifest and mapping tasks are only created for variants that produce a mapping file; the native task is only created when `ndk(true)` is set:

| Task | Description |
| --- | --- |
| `createBugseeAppVar<Variant>ProguardConfig` | Injects the `BUILD_UUID` meta-data entry into the merged manifest. |
| `uploadBugseeAppVar<Variant>Mapping` | Uploads the ProGuard/R8 mapping file. |
| `uploadBugseeAppVar<Variant>Native` | Uploads NDK debug symbols (when `ndk(true)` is set). |

For Android feature variants the same tasks are registered with a `FeatVar` infix instead of `AppVar` (for example `uploadBugseeFeatVar<Variant>Mapping`).

## Compatibility

| Plugin version | SDK version | Min AGP | Min Gradle |
| --- | --- | --- | --- |
| 4.x | 7.x | 8.6.0 | 8.7+ |
| 3.x | 6.x | 4.2.2 | 7.0+ |

The `Min AGP` column is the *plugin's* own requirement. The 3.x plugin is built against the Android Gradle Plugin 4.2.2 API and uses only the older `applicationVariants` / `processManifestProvider` / `mappingFileProvider` APIs, so 4.2.2 is its floor — it also runs fine on AGP 8.x (SDK 6.0.0 is itself built with plugin 3.6 on AGP 8.6.0).

The SDK has a separate, higher requirement: SDK 6.0.0 is built with `compileSdk 35` and needs **AGP 8.6.0 or newer**. Your project's effective minimum is therefore AGP 8.6.0 — see the [SDK 6.x release notes](/sdk/android/v6/release-notes/).

:::caution
Plugin 4.x is **not** backward-compatible with SDK 6.x. The auto-install and instrumentation gating use the new `bugsee-android-*` artifact names introduced in SDK 7.x.
:::

## Release history

See [Gradle plugin releases](/sdk/android/v6/gradle-plugin-releases/) for the full changelog.
