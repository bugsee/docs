---
title: "FAQ (7.x Beta)"
description: "Frequently asked questions about Bugsee Android SDK 7.x."
sidebar_position: 18
slug: "/sdk/android/v7/faq"
---

:::caution[Beta]
This FAQ covers the 7.x beta line. For the current stable release, see the [6.x FAQ](/sdk/android/faq). See the [migration guide](/sdk/android/v7/migration) if you are upgrading from 6.x.
:::

**1. What is the minimum Android version supported by Bugsee Android SDK 7.x?**

Bugsee Android SDK 7.x supports Android 5.0 (API level 21) and up, the same as 6.x.

<br />

**2. What is the memory footprint of Bugsee Android SDK?**

Amount of RAM, used by Bugsee, depends on the chosen video mode and is presented in the following table

|VideoMode|SDK 6.x (MB)|SDK 7.x (MB)|
|---|---|---|
|None|20|10|
|Default|28|22|

<br />

**3. What is "beta" — can I use 7.x in production?**

7.x is feature-complete but still undergoing real-world validation. Public APIs, option keys, and the Gradle plugin contract may still change between beta releases. For production workloads, we recommend staying on the [6.x line](/sdk/android/release-notes) until 7.x is declared stable. Use 7.x in staging, QA, internal builds, and early-access channels to help shape the stable release.

<br />

**4. Why do I need the Bugsee Gradle plugin now?**

7.x relies on bytecode and Kotlin-compiler instrumentation provided by the Bugsee Android Gradle plugin. It is mandatory even if you only use the core artifact — without it, logcat capture, OkHttp capture, Android 14+ `HttpEngine` capture, Compose touch capture, the native-crash thread map, and APM operation dispatch all stop working. The plugin also auto-installs the right extension modules based on dependencies it detects in your build, injects the build UUID into the manifest, and uploads ProGuard/R8 mappings and NDK symbols as a finalizer of your assemble/bundle tasks.

See the [migration guide](/sdk/android/v7/migration) for the full list of plugin capabilities.

<br />

**5. Where did `Bugsee.addNetworkLoggingToOkHttpBuilder(...)` and friends go?**

All HTTP-client integration helpers (`addNetworkLoggingToOkHttpBuilder`, `addNetworkLoggingToOkHttpClient`, `addNetworkLoggingToKtorHttpClient`, `addNetworkLoggingToPicassoDownloader`, `newOkHttpWrappedWebSocket`) were removed in 7.x. Each supported HTTP client is now a separate extension module:

- `bugsee-android-okhttp` (OkHttp 3+ and Picasso)
- `bugsee-android-ktor-2` (Ktor 2.x)
- `bugsee-android-ktor-3` (Ktor 3.x)
- `bugsee-android-cronet` (Cronet / `HttpEngine`)

OkHttp is wired up entirely at build time by the Gradle plugin — no call-site changes. Ktor and Cronet still require a one-line wire-up per client. OkHttp 2 is no longer supported.

Details in the [network client docs](/sdk/android/v7/network) and the [migration guide](/sdk/android/v7/migration).

<br />

**6. Can I keep my 6.x `LaunchOptions` code?**

No. The fluent `LaunchOptions` builder (and its nested `General`/`Video`/`Network`/`Custom`/`Anr` builders) does not exist in 7.x. Replace it with either:

- A `Map<String, Serializable>` keyed by the new `Options.*` constants, passed to `Bugsee.launch(context, token, optionsMap)`, or
- `<meta-data>` entries in `AndroidManifest.xml` using the `com.bugsee.option.*` key scheme.

Every option key was also renamed (e.g. `Bugsee.Option.ShakeToTrigger` → `Options.ReportingTriggerByShake`). See the option-key rename table in the [migration guide](/sdk/android/v7/migration).

<br />

**7. Is APM free? Does it slow the app down?**

Application Performance Monitoring is included in the core SDK at no extra cost. It is enabled by default.

The capture path is designed for minimal overhead: spans use volatile fields and a lock-free dispatcher, provider callbacks run in try/catch isolation, and context propagation is thread-local. The stand-alone APM upload pipeline is sampled (`Options.PerformanceSampleRate`, default `0.01`); sampling gates only uploads, not capture into bug reports.

If you need to disable APM entirely, set `Options.PerformanceMonitoring` to `false` — the public `startSpan` / `startTransaction` APIs then return zero-allocation no-op implementations.

<br />

**8. I updated to 7.x and see errors about `compileSdk` or `foregroundServiceType`.**

Switch `compileSdk` in your `build.gradle` to 35 or newer, the same as for 6.x:

```groovy
android {
    compileSdk 35
    // ...
}
```

7.x also requires Android Gradle Plugin 8.6.0 or newer.

<br />

**9. It takes too much time for the report to appear in the Bugsee web dashboard. Why?**

Please check the following:

- Make sure Internet is available on the device (e.g. try to open a web page in the browser).
- Make sure you do not have `WifiOnlyUpload` enabled. If it is enabled, you need to be connected to WiFi for the report to be uploaded.
- If you are trying to upload a crash report, you need to relaunch the application to trigger the upload. Crash reports are uploaded on the next application launch.

<br />

---
If your question is not listed here, please let us know at [support@bugsee.com](mailto:support@bugsee.com).
