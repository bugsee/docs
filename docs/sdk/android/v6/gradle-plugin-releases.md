---
title: "Gradle Plugin Releases"
description: "Release history for the Bugsee Android Gradle Plugin."
sidebar_position: 13
slug: "/sdk/android/v6/gradle-plugin-releases"
---

# Gradle Plugin Releases

## 4.x (SDK 7.x)

### 4.0.0-beta10 (May 26 2026)

DSL tidy + apply-time SDK version gate replacing the per-class runtime probe, plus the unblock of `androidx.startup.InitializationProvider` instrumentation.

**DSL changes (require migration on upgrade)**

- **`ndk` is now a nested block, not a boolean.** Replace `bugsee { ndk(true) }` with `bugsee { ndk { enabled.set(true) } }`. The old convenience method has been removed; pairing with an old script triggers a "Type mismatch: inferred type is () -> Unit but Boolean was expected" Kotlin compile error in the consumer's `app/build.gradle.kts`.
- **`chunkedUpload` moved under `buildInfo.sizeAnalysis`.** Replace `bugsee { chunkedUpload(true) }` (and equivalents) with `bugsee { buildInfo { sizeAnalysis { chunkedUpload.set(true) } } }`. See the [migration guide](/sdk/android/migration) → "7.x beta DSL changes".
- **DSL aliases dropped, several keys renamed and re-nested.** General tidy pass — see the [Gradle plugin reference](/sdk/android/gradle-plugin/configuration#configuring-the-plugin) for the current shape.

**New features**

- **`bugsee.properties` as a plugin config source.** Plugin options can now be set from a project-local `bugsee.properties` file via `plugin.<dotted-path>` keys (e.g. `plugin.ndk.enabled=true`, `plugin.instrumentation.startupTier=DETAILED`). Resolution order: DSL > `bugsee.properties` > built-in defaults. See [Configuring via bugsee.properties](/sdk/android/gradle-plugin/configuration#configuring-via-bugseeproperties).
- **`androidx.startup.InitializationProvider.onCreate`** is now instrumented like any other ContentProvider. Previously skipped by an exact-FQN guard in the class-kind classifier; the umbrella span now appears in the cold-start waterfall alongside any user-defined `Initializer.create()` calls it dispatches, matching Sentry's behavior.

**Improvements**

- **Apply-time SDK version gate.** `AppStartupTracingInstrumentation.shouldApply()` now parses the declared `com.bugsee:bugsee-android` version against `MIN_SDK_VERSION_WITH_DISPATCHER = 7.0.0-beta11` (the first SDK that ships `BugseeAppStartupDispatcher`). If the declared SDK is older, the plugin emits a Gradle warning and skips app-startup instrumentation entirely — preventing the `NoClassDefFoundError` that would otherwise crash the host app inside `InitializationProvider.onCreate`, before `Application.onCreate`. Dynamic versions (`7.+`, version catalogs that don't resolve at configuration time, project deps) parse to null and are treated permissively (proceed without refusing).
- **Removed the per-class `ClassContext.loadClassData` SDK presence probe.** It was unreliable across AGP's artifact-transform isolation boundaries: third-party JARs (Sentry, AndroidX, Firebase, etc.) ran in transform contexts where the consumer's `:library` dep was not visible, so the probe spuriously returned null and silently skipped valid instrumentation targets. Replaced with the apply-time check above.
- **Extension `ContentProvider`s consolidated into `BugseeInitProvider`.** Feedback, NDK, and other extension init providers no longer register their own provider authority — they piggyback on the core provider's `onCreate`, reducing manifest-merger churn and tightening the cold-start path.

### 4.0.0-beta9 (May 18 2026)

Build-info collection improvements plus internal hygiene from the perf review.

**New features**

- **`buildInfo` now collects per-task timings + the dependency graph.** When build-info upload is enabled (default ON in Release), the plugin includes a `tasks` array (per-task wall time, attribute hash) and a `dependencies` array (group:artifact:version with configurations) alongside the existing build metadata. Surfaces in the Bugsee dashboard's build-info section.

**Improvements**

- **Two code-hygiene wins from the perf review.** Removed an avoidable allocation in the per-class instrumentation hot path; eliminated a redundant cache lookup in `StartupMethodFilter`.

### 4.0.0-beta8 (May 14 2026)

App-startup bytecode tracing tiers (MINIMAL through FULL) plus the typed `StartupTier` DSL.

**New features**

- **App-startup tracing.** Configurable bytecode instrumentation that wraps cold-start init methods (`Application.attachBaseContext` / `onCreate`, `ContentProvider.attachInfo` / `onCreate`, `androidx.startup.Initializer.create`, Firebase `ComponentRegistrar.getComponents`, WorkManager `Configuration.Provider.getWorkManagerConfiguration`, and — at FULL tier — any `@BugseeTrace`-annotated method anywhere in the app) with calls to the SDK's `BugseeAppStartupDispatcher`. The SDK folds those events into a child-span tree under the cold-start transaction, surfacing per-method (and finer-grained, at higher tiers) latency. Five tiers: `OFF` / `MINIMAL` (method start/end on the init set) / `STANDARD` (default — adds per-call wraps on top-level `INVOKE*` instructions) / `DETAILED` (+ per-loop wraps) / `FULL` (+ `@BugseeTrace` annotation pickup). Hilt-generated `Hilt_MyApp` subclasses are picked up transitively via the `superClasses` chain.

  ```kotlin
  import com.bugsee.android.gradle.StartupTier

  bugsee {
      instrumentation {
          startupTier.set(StartupTier.STANDARD)
      }
  }
  ```
- **Typed `StartupTier` DSL.** `startupTier` is exposed as `Property<StartupTier>` so an invalid value (`StartupTier.FULLL`) fails to compile rather than silently falling through. Gradle-property (`bugsee.instrumentation.startupTier=DETAILED`) and manifest-meta-data sources remain string-typed; invalid values warn and fall through to the default.

**Improvements**

- **SDK presence probe cache.** Subsequent class-loading checks against the same dispatcher FQN now short-circuit on the cached PRESENT result. Misses from third-party JAR transform contexts are silenced (they're indistinguishable from a genuine SDK-absent build at probe time, but the probe is best-effort — the real safety net is the version-coupled release pairing). *(The per-class probe was later removed in `4.0.0-beta10` — see above.)*
- **`StartupTier` hoisted to top-level package.** Importable as `com.bugsee.android.gradle.StartupTier` (was a nested type). Internal helpers locked to `internal` visibility.
- **`AppStartupTracingClassVisitorFactory` is configuration-cache safe** — the factory is serializable across AGP's artifact-transform isolation boundary.

**Tests**

- **TestKit-driven integration tests** for app-startup tracing — every tier produces the expected bytecode against a controlled fixture project. Plus unit-level coverage of the tier resolver, the method filter, and the per-kind dispatch mapping.

**Build**

- Pins SDK min version to `7.0.0-beta11` in `bugsee-sdk-min-version.txt` (the resource the plugin reads when auto-adding the SDK to a consuming app that doesn't declare it explicitly).

### 4.0.0-beta7 (May 12 2026)

- **Fix: chunked-upload S3 signature mismatch.** Per-chunk PUTs from the chunked-upload client now send `Content-Type: application/octet-stream`, matching the value the appserver signs the presigned URLs with. Without it S3 returned `SignatureDoesNotMatch` on every chunk and the client silently fell back to the single-PUT path — meaning `chunkedUpload.set(true)` was effectively a no-op in 4.0.0-beta6.
- HTTP-driven test coverage for `ChunkedBundleUploader` against an in-process server harness — every fault-injection scenario (5xx at each phase, per-chunk retry semantics, oversized archives, malformed `chunk_size`, duplicate-content chunks) is now pinned so future refactors can't silently regress the chunked path.

### 4.0.0-beta6 (May 10 2026)

- **Build info / size analysis split.** The single upload step now has two layers, configured independently. `bugsee.buildInfo` (default ON, Release-only) registers a lightweight build record on Bugsee servers — version, configuration, VCS context, timings, artefact byte count — without sending the artifact itself. `bugsee.sizeAnalysis` (default OFF, sub-feature of build info) additionally ships the AAB/APK for server-side tree analysis. See the [Gradle plugin reference](/sdk/android/gradle-plugin/builds-upload#build-info--size-analysis) for the DSL.
- **In-build size check.** A new `bugsee.buildInfo.sizeCheck { ... }` block compares each build's artifact size against the most recent prior build for the same `(package_id, format, build_configuration)`. Crossing the warning threshold prints a Gradle warning; crossing the fail threshold throws `GradleException`. Each gate is independently optional (`0` disables); both percent and absolute-byte variants are supported.
- **App token from `bugsee.properties`.** The plugin now reads the app token from a project-local `bugsee.properties` file at build time, so the token doesn't need to live in `build.gradle.kts` (which often ends up in version control).
- **Auto-install of SDK + Feedback module.** When the Gradle plugin is applied without an explicit Bugsee SDK dependency, it auto-adds the matching SDK + feedback module at the same version, reducing the configuration surface for new integrations.

### 4.0.0-beta5 (April 27 2026)

- Fix: `isInstrumentable` now matches all classes within the Jetpack Compose platform package, not just direct subtypes. Restores Compose tag injection / secure-modifier auto-injection for projects using compiler-emitted intermediate classes.

### 4.0.0-beta4 (April 27 2026)

- Build size-analysis uploads now include richer build metadata: host machine, configuration / instrumentation / total timings, managed-code time, and the build system and SDK versions used.
- VCS information (branch, commit, dirty flag) is now sent as a nested object in the upload payload rather than flat fields.
- Bundle upload tasks are now compatible with Gradle's configuration cache, and the app token is masked in log output.
- Maven publishing signing tasks are now disabled cleanly when GPG credentials aren't present, replacing a workaround that broke configuration cache.
- Adds Kotlin 2.3 compatibility.

### 4.0.0-beta3 (April 23 2026)

- **Build size-analysis upload.** New `uploadBugsee<Variant>Apk` and `uploadBugsee<Variant>Bundle` tasks let you upload APK/AAB size data to Bugsee. Opt in via `bugsee { sizeAnalysis { enabled.set(true) } }`. Both direct and chunked uploads are supported. See the [Gradle plugin reference](/sdk/android/gradle-plugin) for the DSL.
- **Smarter native symbol uploads.** The plugin now caches native symbol uploads and skips them when nothing has changed. Use `bugseeNdkForceUpload` to bypass the cache, and uploads are limited to the current variant rather than all variants.
- Fix: Several improvements to chunked uploads — deduplication, retry, validation, and clearer error messages.

### 4.0.0-beta2 (April 18 2026)

- Migrated to a multi-project build and configured Maven Central publication: Dokka Javadoc JARs, full POM metadata, and signed artifacts for the Gradle plugins.
- Updated repository URLs to the new Sonatype Central endpoints.

### 4.0.0-beta1 (April 13 2026)

First beta of the 4.x plugin line — a full rewrite in Kotlin, required by SDK 7.x. Highlights:

- **Bytecode instrumentation** for Logcat capture, thread registration, I/O / database / SharedPreferences / network operation dispatch (powering APM spans), main-thread misuse detection, Android 14+ platform HTTP (`HttpEngine`), OkHttp 3/4 interceptor injection, and Compose touch capture.
- **Compose support.** A Kotlin compiler plugin injects Compose tags and automatically applies `Modifier.bugseeSecure()` to password `TextField` call sites.
- **Auto-install** of SDK extension modules (Compose, OkHttp, Ktor 2/3, Cronet) based on what your project already uses.
- **Per-build `BUILD_UUID`** injected via the AGP manifest transform API.
- **Symbol uploads.** NDK debug symbols are collected and uploaded, and ProGuard/R8 mapping files are uploaded via the AGP artifact API.
- Every instrumentation can be toggled individually through the `bugsee { instrumentation { ... } }` block.
- Plugin ID `com.bugsee.android.gradle` is registered with the Gradle Plugin Portal and works with the `plugins { }` DSL.

:::caution
4.x requires SDK 7.x (`bugsee-android-*` artifacts). It is not backward-compatible with SDK 6.x.
:::

---

## 3.x (SDK 6.x)

### 3.6 (April 28 2025)
- Feat: Add NDK symbols handling support (collection and upload)

### 3.5 (November 15 2024)
- Fix: Ensure AAB targets are handled correctly

### 3.4 (September 10 2024)
- Feat: Add artifacts which can be referenced by the plugin ID

### 3.3 (September 10 2024)
- Fix: Properly define plugin name in Gradle environment

### 3.2 (March 13 2023)
- Fix: SSL/TLS issues

### 3.1 (September 16 2022)
- Fix: Internal issues

### 3.0 (September 13 2022)
- Feat: Latest Gradle version support

---

## 2.x

### 2.3 (August 3 2022)
- Feat: Internal improvements

### 2.2 (August 9 2021)
- Feat: Internal improvements

### 2.1 (August 5 2021)
- Feat: Internal improvements

### 2.0 (August 5 2021)
- Feat: Migrate to Gradle 7.1.1

---

## 1.x

### 1.2 (October 28 2020)
- Feat: Gradle 4.1+ support

### 1.1 (May 27 2020)
- Feat: Latest Gradle version support

### 1.0.7 (March 21 2019)
- Fix: Remove deprecated calls to leftShift()

### 1.0.6 (February 13 2019)
- Fix: Handle manifestOutputDirectory properly in Gradle 3.3.x

### 1.0.5 (November 2 2018)
- Feat: Add support for instant apps
- Feat: Add support for split sections

### 1.0.4 (December 26 2017)
- Fix: Internal issues

### 1.0.3 (November 18 2017)
- Fix: Internal issues

### 1.0.2 (November 14 2017)
- Fix: Internal issues

### 1.0.1 (March 3 2017)
- Fix: Ensure all symbols archives are uploaded correctly

### 1.0.0 (March 3 2017)
- Feat: Initial release
