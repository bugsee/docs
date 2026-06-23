---
title: "FAQ"
description: "Frequently asked questions about Bugsee Android SDK 7.0.0."
sidebar_position: 18
slug: "/sdk/android/faq"
---

Looking for the previous major version? See the [6.x FAQ](/sdk/android/v6/faq). See the [migration guide](/sdk/android/migration) if you are upgrading from 6.x.

**1. What is the minimum Android version supported by Bugsee Android SDK?**

Bugsee Android SDK 7.0.0 supports Android 5.0 (API level 21) and up.

<br />

**2. What are the minimum required build tooling versions?**

| Requirement | Minimum |
|---|---|
| `minSdk` | API 21 (Android 5.0) |
| `compileSdk` | 36 |
| `targetSdk` | 35 |
| Android Gradle Plugin | 8.6.0+ |
| Gradle | 8.7+ |
| Kotlin | 2.1.0 (used by the Bugsee Gradle plugin) |
| JDK (to build your app) | 17 |

The SDK itself targets Java 8 bytecode, so it runs on API 21 devices — but **building** your app requires JDK 17 and the toolchain versions above, because the Bugsee Android Gradle plugin and its instrumentation depend on them. See the [Gradle plugin docs](/sdk/android/gradle-plugin) for details.

<br />

**3. What is the memory footprint of Bugsee Android SDK?**

Amount of RAM, used by Bugsee, depends on the chosen video mode and is presented in the following table

|VideoMode|SDK 6.x (MB)|SDK 7.0.0 (MB)|
|---|---|---|
|None|20|10|
|Default|28|22|

<br />

**4. How much does Bugsee add to app launch (cold start)?**

Very little. Bugsee defers all heavy work (native library loading, capture-provider setup, the server session handshake, video encoding) to background threads, so the only cost on your launch path is the small, bounded amount of main-thread wiring during initialization.

Measured as the median of force-stopped cold starts on release (R8) builds:

- **Core SDK** (no extensions): ~107 ms on a low-end device / ~16 ms on a high-end device.
- **Core SDK + all extensions**: ~139 ms / ~19 ms — the seven extensions together add only ~32 ms on the low-end device.

The largest single extension is NDK native crash reporting (~24 ms on low-end), because it spawns an out-of-process Crashpad handler; leave it out if your app has no native code. See [App launch overhead](/sdk/android/startup-overhead) for the full breakdown and how to measure it in your own app.

<br />

**5. Which CPU ABIs does the native code support?**

Bugsee's native components ship for `armeabi-v7a`, `arm64-v8a`, `x86`, and `x86_64`. If you target only a subset of architectures, you can use `abiFilters` (or app bundle ABI splits) to drop the unused native libraries and keep your APK size down:

```groovy
android {
    defaultConfig {
        ndk {
            abiFilters "arm64-v8a", "armeabi-v7a"
        }
    }
}
```

<br />

**6. What permissions does Bugsee require?**

Bugsee declares the permissions it needs in its own manifest, which the Android manifest merger folds into your app:

- `INTERNET` — required, to upload reports and session data.
- `ACCESS_NETWORK_STATE` — to detect connectivity and honor the WiFi-only upload option.

Triggering a report by taking a screenshot also relies on `DETECT_SCREEN_CAPTURE` (Android 14 / API 34+) and `READ_MEDIA_IMAGES` so the SDK can observe screenshots; these are merged in from the SDK manifest as well. No permission prompts are shown to the user for the core capture functionality.

<br />

**7. Do I need to configure ProGuard / R8?**

No. The SDK ships its consumer ProGuard/R8 rules inside the AAR, so they are applied to your minified build automatically — you do not need to add keep rules for Bugsee. Uploading the mapping file so crashes are deobfuscated in the dashboard is handled for you by the Bugsee Android Gradle plugin, which uploads ProGuard/R8 mappings (and NDK symbols) as a finalizer of your assemble/bundle tasks. See the [Gradle plugin docs](/sdk/android/gradle-plugin).

<br />

**8. Why do I need the Bugsee Gradle plugin now?**

7.0.0 relies on bytecode and Kotlin-compiler instrumentation provided by the Bugsee Android Gradle plugin. It is mandatory even if you only use the core artifact — without it, logcat capture, OkHttp capture, Android 14+ `HttpEngine` capture, Compose touch capture, the native-crash thread map, and APM operation dispatch all stop working. The plugin also auto-installs the right extension modules based on dependencies it detects in your build, injects the build UUID into the manifest, and uploads ProGuard/R8 mappings and NDK symbols as a finalizer of your assemble/bundle tasks.

See the [migration guide](/sdk/android/migration) for the full list of plugin capabilities.

<br />

**9. Where did `Bugsee.addNetworkLoggingToOkHttpBuilder(...)` and friends go?**

In 7.0.0, HTTP-client capture is provided through dedicated extension modules rather than the old `addNetworkLogging*` / `newOkHttpWrappedWebSocket` helpers on the `Bugsee` facade. Each supported HTTP client is a separate extension module:

- `bugsee-android-okhttp` (OkHttp 3+ and Picasso)
- `bugsee-android-ktor-2` (Ktor 2.x)
- `bugsee-android-ktor-3` (Ktor 3.x)
- `bugsee-android-cronet` (Cronet / `HttpEngine`)

OkHttp is wired up entirely at build time by the Gradle plugin — no call-site changes. Ktor and Cronet still require a one-line wire-up per client. OkHttp 2 is no longer supported.

Details in the [network client docs](/sdk/android/network) and the [migration guide](/sdk/android/migration).

<br />

**10. Is APM free? Does it slow the app down?**

Application Performance Monitoring is included in the core SDK at no extra cost. It is enabled by default.

The capture path is designed for minimal overhead: spans use volatile fields and a lock-free dispatcher, provider callbacks run in try/catch isolation, and context propagation is thread-local. The stand-alone APM upload pipeline is sampled (`Options.PerformanceSampleRate`, default `0.01`); sampling gates only uploads, not capture into bug reports.

If you need to disable APM entirely, set `Options.PerformanceMonitoring` to `false` — the public `startSpan` / `startTransaction` APIs then return zero-allocation no-op implementations.

<br />

**11. I updated to 7.0.0 and see errors about `compileSdk` or `foregroundServiceType`.**

Switch `compileSdk` in your `build.gradle` to 36, and `targetSdk` to 35:

```groovy
android {
    compileSdk 36
    defaultConfig {
        targetSdk 35
    }
    // ...
}
```

7.0.0 also requires Android Gradle Plugin 8.6.0 or newer.

<br />

**12. It takes too much time for the report to appear in the Bugsee web dashboard. Why?**

Please check the following:

- Make sure Internet is available on the device (e.g. try to open a web page in the browser).
- Make sure you do not have `WifiOnlyUpload` enabled. If it is enabled, you need to be connected to WiFi for the report to be uploaded.
- If you are trying to upload a crash report, you need to relaunch the application to trigger the upload. Crash reports are uploaded on the next application launch.

<br />

---
If your question is not listed here, please let us know at [support@bugsee.com](mailto:support@bugsee.com).
