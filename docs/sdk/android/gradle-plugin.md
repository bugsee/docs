---
title: "Bugsee Gradle Plugin"
description: "Overview and configuration guide for the Bugsee Gradle plugin — bytecode instrumentation, mapping uploads, NDK symbols, and auto-install of SDK extension modules."
sidebar_position: 12
slug: "/sdk/android/gradle-plugin"
---

The Bugsee Gradle Plugin integrates into your Android build to provide:

- **Bytecode instrumentation** — automatic capture of Logcat calls, OkHttp traffic, HttpEngine traffic, Compose touch events, thread registration, operation dispatch for APM, and main-thread misuse detection.
- **Kotlin compiler plugin** — Compose tag injection and automatic `Modifier.bugseeSecure()` insertion for password `TextField` call sites.
- **Mapping file upload** — uploads ProGuard/R8 mapping files to Bugsee for crash symbolication.
- **NDK symbol upload** — uploads native debug symbols for native crash symbolication.
- **Manifest injection** — injects a per-build `BUILD_UUID` into the merged manifest for build correlation.
- **Extension auto-install** — detects third-party dependencies (OkHttp, Ktor, Cronet, Compose) and automatically adds the matching Bugsee SDK extension module.

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

## Bytecode instrumentation

The plugin transforms your application's compiled classes at build time. Each instrumentation is gated on the presence of a specific dependency and can be toggled individually.

| Instrumentation | What it does | Gating dependency |
| --- | --- | --- |
| `log` | Redirects `android.util.Log.*` calls through Bugsee's capture pipeline, then delegates to the original method. | `bugsee-android` |
| `thread` | Injects `registerThread()` at the start of every `Runnable.run()` / `Thread.run()` to build the Java-to-native thread ID map for NDK crash reporting. | `bugsee-android` |
| `operationDispatch` | Injects start/end hooks around I/O, network, DB, and SharedPreferences operations for APM span tracking. | `bugsee-android` |
| `mainThreadMisuse` | Injects pre-call checks before guarded operations and reports violations when the calling thread is the main thread. | `bugsee-android` |
| `http_engine` | Wraps every `HttpEngine.Builder.build()` call site (Android 14+ platform HTTP API) for network capture. | `bugsee-android` |
| `okhttp` | Injects `BugseeOkHttpInterceptor` into every `OkHttpClient.Builder.build()` call site. | `bugsee-android-okhttp` |
| `composeInput` | Instruments `AndroidComposeView.dispatchTouchEvent` to capture Compose touch events. | `bugsee-android` + `androidx.compose.ui:ui` |

### Disabling specific instrumentations

```kotlin title="app/build.gradle.kts"
bugsee {
    instrumentation {
        log             = true  // default
        thread          = true  // default
        operationDispatch = true  // default
        mainThreadMisuse = true  // default
        http_engine     = true  // default
        okhttp          = true  // default
        composeInput    = true  // default
        compose         = true  // Compose tag injection (compiler plugin)
        composeSecure   = true  // password TextField auto-redaction (compiler plugin)
    }
}
```

Disabling an instrumentation key only skips the build-time transformation. The corresponding runtime feature still functions but loses what the bytecode hook provides (e.g. disabling `log` means `Bugsee.log(...)` still works, but `android.util.Log` calls from your app are no longer captured).

## Kotlin compiler plugin

When Compose dependencies are detected, the Gradle plugin automatically loads a Kotlin compiler plugin that provides two features:

| Feature | Option | Description |
| --- | --- | --- |
| Compose tag injection | `instrumentation.compose` | Injects element tags into Compose IR so the SDK can correlate captured input/screenshots with composables. |
| Secure modifier auto-injection | `instrumentation.composeSecure` | Walks the Compose IR for password `TextField` call sites and auto-inserts `Modifier.bugseeSecure()`. |

Both are enabled by default.

## Extension auto-install

The plugin scans your declared dependencies and automatically adds the matching Bugsee extension module at the same version as the plugin:

| Detected dependency | Auto-added module |
| --- | --- |
| `androidx.compose.*` | `com.bugsee:bugsee-android-compose` |
| `com.squareup.okhttp3:*` | `com.bugsee:bugsee-android-okhttp` |
| `io.ktor:* (2.x)` | `com.bugsee:bugsee-android-ktor-2` |
| `io.ktor:* (3.x)` | `com.bugsee:bugsee-android-ktor-3` |
| `org.chromium.net:*` | `com.bugsee:bugsee-android-cronet` |

You can still add the extension modules manually if you prefer explicit control.

:::note
**Ktor and Cronet require manual wiring.** While the plugin auto-adds the dependency, you must still install the Bugsee plugin in each Ktor `HttpClient` and wrap your `CronetEngine` with `BugseeCronet.instrument(engine)`. See the [network events](/sdk/android/network/) documentation for details.
:::

## Build tasks

The plugin registers per-variant tasks:

| Task | Description |
| --- | --- |
| `createBugsee<Variant>ManifestConfig` | Injects `BUILD_UUID` into the merged manifest. |
| `uploadBugsee<Variant>Mapping` | Uploads the ProGuard/R8 mapping file after `assemble<Variant>` / `bundle<Variant>`. |
| `uploadBugsee<Variant>Native` | Uploads NDK debug symbols (when `ndk(true)` is set). |

## Compatibility

| Plugin version | SDK version | Min AGP | Min Gradle |
| --- | --- | --- | --- |
| 4.x | 7.x | 8.6.0 | 8.7+ |
| 3.x | 6.x | 7.0.0 | 7.0+ |

:::caution
Plugin 4.x is **not** backward-compatible with SDK 6.x. The auto-install and instrumentation gating use the new `bugsee-android-*` artifact names introduced in SDK 7.x.
:::

## Release history

See [Gradle plugin releases](/sdk/android/gradle-plugin-releases/) for the full changelog.
