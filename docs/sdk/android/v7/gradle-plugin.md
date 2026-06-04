---
title: "Gradle plugin (7.x Beta)"
description: "The Bugsee Android Gradle plugin — bytecode instrumentations, Kotlin compiler plugin, extension auto-install, and build-time tasks."
sidebar_position: 15
slug: "/sdk/android/v7/gradle-plugin"
---

:::caution[7.x Beta]
This document describes the Bugsee Android SDK **7.x (beta)**. In 6.x, no Gradle plugin was required — the SDK worked purely as a runtime library. In 7.x, the `com.bugsee:bugsee-android-gradle-plugin` is **mandatory** even when you only depend on the core `bugsee-android` artifact. The plugin is what unlocks:

- **APM** — DB, file-I/O, and network operation instrumentation that feeds `db.*` / `file.*` / `http.client` spans.
- **Main-thread misuse detection** — pre-call checks around guarded I/O / network / DB / `SharedPreferences` operations.
- **Network-client auto-install** — OkHttp, Ktor 2/3, and Cronet extensions pulled in automatically based on your dependency graph.
- **Feedback auto-install** — extension modules wired by dependency detection.
- **Compose secure-content transforms** — Kotlin compiler plugin that injects `Modifier.bugseeSecure()` into password `TextField` call sites and tags Compose IR for input/screenshot correlation.

Without the plugin, several of the features above stop working entirely or require manual wiring.
:::

You can find the plugin in the <a rel="noopener noreferrer" href="https://central.sonatype.com/artifact/com.bugsee/bugsee-android-gradle-plugin">Maven repository</a>.

## Install

Apply the plugin to your **application** module. Bytecode instrumentation is only applied to modules with `com.android.application` — library modules are not instrumented.

### Using the `plugins` block (recommended)

```kotlin title="app/build.gradle.kts"
plugins {
    id("com.android.application")
    id("com.bugsee.android.gradle") version "<plugin-version>"
}
```

```groovy title="app/build.gradle"
plugins {
    id 'com.android.application'
    id 'com.bugsee.android.gradle' version '<plugin-version>'
}
```

### Using the legacy buildscript classpath

```kotlin title="build.gradle.kts (root)"
buildscript {
    dependencies {
        classpath("com.bugsee:bugsee-android-gradle-plugin:<plugin-version>")
    }
}
```

```kotlin title="app/build.gradle.kts"
plugins {
    id("com.android.application")
    id("com.bugsee.android.gradle")
}
```

```groovy title="build.gradle (root)"
buildscript {
    dependencies {
        classpath 'com.bugsee:bugsee-android-gradle-plugin:<plugin-version>'
    }
}
```

```groovy title="app/build.gradle"
plugins {
    id 'com.android.application'
    id 'com.bugsee.android.gradle'
}
```

## Bytecode instrumentations

Each instrumentation runs against every class in the application variant via AGP's `transformClassesWith` pipeline. Each is gated on the presence of a specific dependency, and each can be toggled individually via the `bugsee { instrumentation { … } }` block.

| Key | Gating dependency | What it injects | SDK feature unlocked |
| --- | --- | --- | --- |
| `log` | `bugsee-android` | Rewrites every `android.util.Log.*` static call to `BugseeLogAdapter.*`, which forwards the entry to the capture pipeline and then delegates to the original `Log` method. | Logcat capture without requiring embedders to switch logging APIs. |
| `thread` | `bugsee-android` | Injects `BugseeThreadAdapter.registerThread()` as the first instruction of every `run()` method in classes that implement `Runnable` or extend `Thread`. | JVM ↔ native thread ID map used by NDK crash reporting and thread tracing. |
| `operationDispatch` | `bugsee-android` | Injects `BugseeOperationDispatcher.onXxxOperationStart/End()` around guarded I/O, network, DB, and `SharedPreferences` operations. | Feeds the APM `DatabasePerformanceProvider`, `FileIOPerformanceProvider`, and `NetworkPerformanceProvider` — emits `db.*` / `file.*` / `http.client` spans without runtime reflection. |
| `mainThreadMisuse` | `bugsee-android` | Injects lightweight pre-call checks before the same set of guarded operations as `operationDispatch`. The checks bridge to `BugseeMainThreadGuardAdapter`, which reports the violation when the current thread is the main thread. | Powers `Options.DetectAndReportMainThreadMisuse`. |
| `http_engine` | `bugsee-android` | Wraps every `android.net.http.HttpEngine.Builder.build()` call site with `BugseeHttpEngineAdapter.wrapHttpEngine(...)`. | Captures traffic from the Android 14+ platform `HttpEngine` (Cronet-derived) without requiring embedders to wrap engine builders by hand. |
| `okhttp` | `bugsee-android-okhttp` | Injects `BugseeOkHttpInterceptor` into every `OkHttpClient.Builder.build()` call site (frame computation: `COPY_FRAMES`). | Makes the OkHttp extension fully transparent — embedders never call any wiring API. |
| `composeInput` | `bugsee-android` **and** `androidx.compose.ui:ui` | Instruments `AndroidComposeView.dispatchTouchEvent(MotionEvent)` to call `BugseeComposeInputAdapter.onComposeTouch(view, event)` at the start of the method. | Captures touch events inside Jetpack Compose UI. `AndroidComposeView` overrides `dispatchTouchEvent` without calling `super`, so neither overlay views nor `OnTouchListener` see Compose touches. |

:::note[Cronet and Ktor are not bytecode-instrumented]
The plugin **does not** bytecode-instrument Cronet (`org.chromium.net.CronetEngine`). Cronet has no interceptor pipeline and the `Builder.build()` call site sits inside the Cronet artifact, so the only mechanism that works is wrapping the engine. The plugin auto-pulls `bugsee-android-cronet` when it detects a Cronet dependency, but the embedder still has to call `BugseeCronet.instrument(engine)` once per engine instance. The same pattern applies to Ktor 2 / Ktor 3 — the plugin auto-pulls the artifact, but the embedder must `install(...)` the plugin in each `HttpClient` because Ktor's pipeline is opt-in per client.
:::

Disabling an instrumentation key only disables the build-time transformation; the corresponding runtime feature still functions but loses whatever the bytecode hook gave it (e.g. disabling `log` means `Bugsee.log(...)` calls still work, but `android.util.Log` calls from your app are no longer captured).

## Kotlin compiler plugin (`com.bugsee.compose.compiler`)

Loaded automatically whenever any Compose dependency is detected. It exposes two independent subfeatures, each gated by its own option:

| Subfeature | Option | Behavior |
| --- | --- | --- |
| Compose tag injection | `instrumentation.compose` | Injects element tags into Compose IR so the SDK can correlate captured input/screenshots with composables. |
| Secure modifier auto-injection | `instrumentation.composeSecure` | Walks the Compose IR for password `TextField` call sites and automatically inserts `Modifier.bugseeSecure()`. Embedders get redaction of password fields without touching their UI code. |

Both subfeatures stay on by default and can be disabled independently in the `bugsee { instrumentation { … } }` block.

## Auto-install of extension modules

During `withDependencies` evaluation of the `implementation` configuration, the plugin scans the host project's declared dependencies and adds the matching Bugsee extension artifact at the same version as the plugin itself, unless the embedder has already declared it.

| Detected dependency | Auto-added Bugsee module |
| --- | --- |
| `androidx.compose.*` | `com.bugsee:bugsee-android-compose` |
| `com.squareup.okhttp3:*` | `com.bugsee:bugsee-android-okhttp` |
| `io.ktor:* (2.x)` | `com.bugsee:bugsee-android-ktor-2` |
| `io.ktor:* (3.x)` | `com.bugsee:bugsee-android-ktor-3` |
| `org.chromium.net:*` | `com.bugsee:bugsee-android-cronet` |

If you already declared the matching Bugsee artifact yourself, the plugin leaves your declaration alone. Each auto-install rule can be disabled via the corresponding DSL property — for example `instrumentation.ktor.set(false)` suppresses Ktor auto-install, and `instrumentation.cronet.set(false)` suppresses Cronet auto-install.

Auto-install is also suppressed when the plugin is applied to a project that is itself a Bugsee SDK module (avoiding circular dependencies on `:library`, `:okhttp`, etc.).

:::note[When the plugin is absent]
Auto-install happens only when the Bugsee Gradle plugin is applied. In Maven builds, or in Gradle builds where you have chosen not to apply the plugin, **every extension module must be added manually** to your `dependencies { }` / `pom.xml` — nothing is pulled in for you, even when the third-party dependency (OkHttp, Ktor, Cronet, Compose) is present. See [Extensions — Without the Bugsee Gradle plugin](/sdk/android/v7/extensions#without-the-bugsee-gradle-plugin) for the full manual declaration set.
:::

## Build-time tasks

The plugin registers per-variant tasks:

| Task | Trigger | Purpose |
| --- | --- | --- |
| `createBugsee<Variant>ManifestConfig` | Wired into `SingleArtifact.MERGED_MANIFEST` transform. | Injects a deterministic per-build fallback `BUILD_UUID` (derived from the merged manifest + variant name + plugin version) into the merged `AndroidManifest.xml`. The SDK reads this when no asset-channel UUID is available. |
| `resolveBugsee<Variant>BuildId` + `injectBugsee<Variant>BuildId` | Post-R8 (listens to `SingleArtifact.OBFUSCATION_MAPPING_FILE`) + assets transform (`SingleArtifact.ASSETS`). | When R8 is enabled, derives the BUILD_UUID from a hash of the `mapping.txt` content — every bytecode change flips the UUID, so the server-side mapping lookup is correct even without a `versionCode` bump. Writes `assets/bugsee_build_id.properties`, which the SDK reads at first launch (preferred over the manifest fallback). When R8 is off, the asset carries the same fallback UUID the manifest holds. |
| `uploadBugsee<Variant>Mapping` | Finalizes `assemble<Variant>` and `bundle<Variant>`. | Uploads the ProGuard / R8 mapping file under the post-R8-resolved BUILD_UUID so the server can symbolicate obfuscated stack traces against the exact build the SDK reports at runtime. |
| `uploadBugsee<Variant>Native` | Finalizes `assemble<Variant>` / `bundle<Variant>` when `bugsee { ndk { enabled.set(true) } }`. | Uploads NDK native debug symbols (after `extract<Variant>NativeDebugMetadata`) so native crashes can be symbolicated. |
| `uploadBugsee<Variant>Bundle` | Finalizes `bundle<Variant>` for every Release variant when `bugsee { buildInfo { enabled.set(true) } }` (the default). | Registers the build record on Bugsee servers (version, configuration, VCS context, timings, artefact size). When `buildInfo.sizeAnalysis.enabled = true` also uploads the AAB for size analysis. |
| `uploadBugsee<Variant>Apk` | Finalizes `assemble<Variant>` for every Release variant when `bugsee { buildInfo { enabled.set(true) } }` (the default). | Same as above for APK builds. |

## Build info & Size analysis

The plugin's upload step has two layers, configured independently.

**Build info** (`bugsee.buildInfo`) — **default ON, Release-only.** Every Release archive registers a build record on Bugsee servers carrying:

- `uuid`, `package_id`, `version`, `build`, `build_configuration`, `format`
- VCS context (commit SHA, branch, base branch, PR number, repo, provider) when resolvable from CI env vars or a local `git` invocation
- Build-machine label (`GITHUB_RUNNER_NAME`, hostname, …), plugin version, Gradle version, `compileSdk`
- Per-category Gradle timings (managed-code / native / resources / packaging / other), top-N slowest tasks, total wall-clock
- Raw artefact byte count

The record exists from the moment of the upload — no artefact bytes are sent by default. Build info unlocks crash-context enrichment (commit lookup), build-history navigation in the dashboard, and the in-build size-check baseline. Set `buildInfo.enabled = false` to opt out entirely (firewalled CI, privacy-sensitive builds).

**Size analysis** (`bugsee.buildInfo.sizeAnalysis`) — **default OFF, sub-feature of build info.** When enabled, the same upload task additionally requests a presigned PUT URL from the server and ships the artefact zip (AAB / APK + optional `mapping.txt`) for server-side tree analysis, size diffs, and optimization insights.

Validation rule: `buildInfo.sizeAnalysis.enabled = true` while `buildInfo.enabled = false` logs a warning and skips both — size analysis on its own has nothing to attach to.

The release-only filter can be widened to all build types via `buildInfo.allBuildTypes = true` (useful for projects with custom non-`debug` configurations like `staging`, `internalRelease`).

Both registration paths emit a `build.created` webhook — see [Webhook events → build.created](/webhooks/events#buildcreated) for the payload shape on each trigger.

**Chunked upload** (`bugsee.buildInfo.sizeAnalysis.chunkedUpload`) — **default OFF.** Opt-in optimisation for the size-analysis upload. The artefact is split into content-addressed chunks; on subsequent builds only the chunks that actually changed are re-uploaded, typically cutting upload time by 70–90% on incremental CI. Has no effect when `buildInfo.sizeAnalysis.enabled = false`. Lives inside the `sizeAnalysis` block.

### Hand the setup to your AI coding assistant

If you use a local AI coding assistant (Claude Code, Cursor, GitHub Copilot, Windsurf, etc.), paste the prompt below. It enables size analysis with the minimum config and then walks you through each optional tweak interactively — you can skip straight through if none apply.

```text
Enable Bugsee build size analysis for my Android app, then walk me
through optional tweaks.

PART 1 — required setup
========================

1. Find the app module's Gradle build script. Look for the
   `com.android.application` plugin in `*/build.gradle.kts` (Kotlin DSL)
   or `*/build.gradle` (Groovy DSL) — the file that contains it is the
   app module's build script.

2. Confirm the Bugsee Gradle plugin is applied in that file
   (`id("com.bugsee.android.gradle")` in Kotlin DSL, or
   `apply plugin: 'com.bugsee.android.gradle'` /
   `id 'com.bugsee.android.gradle'` in Groovy). If it isn't, STOP and
   tell me — I need to follow the SDK installation instructions first.
   Do not add the plugin yourself.

3. Locate the existing `bugsee { ... }` extension block. Add (or merge)
   the `buildInfo.sizeAnalysis` sub-block with `enabled.set(true)`
   (Kotlin DSL) or `enabled = true` (Groovy DSL). End state for Kotlin
   DSL:

       bugsee {
           buildInfo {
               sizeAnalysis {
                   enabled.set(true)
               }
           }
       }

   Note: the Bugsee app token is wired up at SDK installation time
   (in `AndroidManifest.xml` meta-data, or via `appToken(...)` inside
   the `bugsee` DSL block). Size analysis re-uses it — do NOT add a
   separate token to the Gradle config.

PART 2 — optional tweaks
========================

Now walk me through each option below ONE AT A TIME. For each option:

  a. Read me the full description so I know what it does and why I
     might want it. Don't summarise — read it as written.
  b. Ask yes/no.
  c. If no, move on without editing anything.
  d. If yes, apply the change and show me the resulting
     `bugsee { ... }` block before moving to the next option.

When all four options are done, summarise what changed (or say
"no changes" if I said no to everything).

----------------------------------------------------------------------
Option 1 — Override the configuration label

  What it does: Builds sharing a "configuration label" are diffed
  against each other on the Bugsee dashboard. By default the plugin
  uses the Gradle variant name (`release`, `freeRelease`, `proRelease`,
  etc.), which means different flavours appear as separate timelines.

  When you want it: Your CI produces multiple comparable flavours
  (e.g. `freeRelease` + `proRelease` that ship the same way) and you'd
  rather see them in a single timeline so size diffs are meaningful.

  When you skip it: You only ship one release flavour, or your flavours
  legitimately have different size footprints and shouldn't be diffed.

  If yes: ask me which label string to use, then inside the
  `buildInfo.sizeAnalysis` sub-block add
  `buildConfiguration.set("<my-label>")` (Kotlin DSL) or
  `buildConfiguration = "<my-label>"` (Groovy DSL).

----------------------------------------------------------------------
Option 2 — Speed up CI with chunked upload

  What it does: Enables a deduplicated chunk-upload protocol. The
  artifact is split into content-addressed chunks; on subsequent
  builds only the chunks that actually changed get re-uploaded.

  When you want it: Your CI runs frequently and most builds are
  incremental — chunked upload typically cuts upload time by 70–90%
  on subsequent builds. The big win is on long pipelines where upload
  bandwidth dominates.

  When you skip it: One-off / infrequent builds, or you've already
  hit some chunked-upload-specific issue in the past.

  If yes: inside the `buildInfo.sizeAnalysis` sub-block (same block
  as `enabled`, NOT a separate sibling), add
  `chunkedUpload.set(true)` (Kotlin DSL) or `chunkedUpload = true`
  (Groovy DSL).

----------------------------------------------------------------------
Option 3 — In-build size regression check

  What it does: Compares each build's artifact size against the
  most-recent prior build for the same configuration. Crossing the
  warning threshold prints a warning in Gradle output; crossing the
  fail threshold fails the build. Either gate is independently
  optional (`0` disables it).

  When you want it: You want a guardrail that catches size
  regressions before they ship — especially useful on PR pipelines
  so reviewers see "this PR adds 4% download size" alongside test
  results.

  When you skip it: You're still establishing a baseline (the very
  first builds), or you'd rather watch size on the dashboard than
  block CI on it.

  If yes: ask me for the warning percentage (default 5.0) and the
  fail percentage (default 10.0) — either can be `0` to disable. Then
  add a nested `sizeCheck` block under `buildInfo` (alongside
  `sizeAnalysis`):

      bugsee {
          buildInfo {
              sizeCheck {
                  enabled.set(true)
                  warningPercent.set(<value>)
                  failPercent.set(<value>)
              }
              sizeAnalysis {
                  enabled.set(true)
              }
          }
      }

  `buildInfo` itself is ON by default — do NOT set `buildInfo.enabled`
  explicitly.

----------------------------------------------------------------------
Option 4 — ProGuard / R8 mapping

  No question to ask — just inform me: if my build produces a
  `mapping.txt`, the plugin uploads it alongside the bundle
  automatically. The dashboard shows deobfuscated class names in the
  size breakdown. Nothing to configure.

----------------------------------------------------------------------

Do not run Gradle yourself — I'll verify by building when I'm ready.
```

## In-build size check (`bugsee.buildInfo.sizeCheck`)

Compares the freshly built artefact's file size against the most recent prior build's recorded `artifact_size` for the same `(package_id, format, build_configuration)` tuple. Crossing a configured threshold emits a Gradle warning; crossing a fail threshold throws `GradleException` and fails the upload task.

Each gate is independently optional — a `0` (or unset) disables that gate. Fail wins over warn; percent gate is checked before bytes within the same severity. Negative deltas (artefact shrunk) never trigger anything.

Also configurable via:
- **Environment variables** — `BUGSEE_SIZE_CHECK_ENABLED`, `BUGSEE_SIZE_CHECK_WARNING_PCT`, `BUGSEE_SIZE_CHECK_FAIL_PCT`, `BUGSEE_SIZE_CHECK_WARNING_BYTES`, `BUGSEE_SIZE_CHECK_FAIL_BYTES`.
- **`bugsee.properties`** — `plugin.buildInfo.sizeCheck.enabled`, `plugin.buildInfo.sizeCheck.warningPercent`, `plugin.buildInfo.sizeCheck.failPercent`, `plugin.buildInfo.sizeCheck.warningBytes`, `plugin.buildInfo.sizeCheck.failBytes`. See [Configuring via `bugsee.properties`](#configuring-via-bugseeproperties).

CI runs that prefer not to mutate the Gradle DSL can configure the check from either source.

## Configuring the plugin

```kotlin title="app/build.gradle.kts"
plugins {
    id("com.android.application")
    id("com.bugsee.android.gradle")
}

bugsee {
    appToken("…")                                 // or: appToken { variantName -> resolveToken(variantName) }
    endpoint.set("https://api.bugsee.com")        // default
    debug.set(false)                              // default
    feedback.set(false)                           // default
    optimizeExtensionsLoading.set(true)           // default — merges Bugsee extension ContentProviders into the SDK's single BugseeInitProvider to shave cold-start overhead

    ndk {                                         // native crash / NDK symbol upload
        enabled.set(true)                         // turn on NDK support
        forceDebugSymbolsUpload.set(false)        // re-upload symbols even when the build UUID hasn't changed
    }

    buildInfo {                                   // default ON, Release-only
        // enabled.set(true)                      // default
        // allBuildTypes.set(false)               // default — only release variants register

        sizeAnalysis {                            // opt-in size analysis (server-side AAB/APK upload)
            enabled.set(true)
            buildConfiguration.set("release")     // defaults to variant name
            chunkedUpload.set(false)              // opt-in deduplicated chunk-upload protocol; on subsequent builds only changed chunks are re-uploaded (typically 70–90% faster on CI)
        }

        sizeCheck {                               // opt-in size regression gates
            enabled.set(true)
            warningPercent.set(5.0)               // warn at +5% vs the prior build
            failPercent.set(10.0)                 // fail the task at +10%
            // warningBytes.set(500_000L)
            // failBytes.set(2_000_000L)
        }

        dependencies {
            // enabled defaults to true
        }
        timings {
            // enabled defaults to true
        }
    }

    instrumentation {
        // enabled defaults to true (via Gradle-property/manifest fallback chain)
        log.set(true)               // android.util.Log redirection
        thread.set(true)            // Thread/Runnable registration
        operationDispatch.set(true) // I/O, network, DB operation tracking
        mainThreadMisuse.set(true)  // main-thread misuse detection
        httpEngine.set(true)        // HttpEngine (Cronet-derived) instrumentation
        okhttp.set(true)            // OkHttp interceptor injection
        composeInput.set(true)      // Compose touch input capture
        compose.set(true)           // Compose tag injection (compiler plugin)
        composeSecure.set(true)     // password TextField auto-redaction (compiler plugin)
        ktor.set(true)              // Ktor extension auto-install
        cronet.set(true)            // Cronet extension auto-install
        startupTier.set(StartupTier.STANDARD) // cold-start tracing tier
    }
}
```

```groovy title="app/build.gradle"
plugins {
    id 'com.android.application'
    id 'com.bugsee.android.gradle'
}

bugsee {
    appToken '…'
    endpoint.set 'https://api.bugsee.com'
    debug.set false
    feedback.set false
    optimizeExtensionsLoading.set true       // default — merges extension ContentProviders into BugseeInitProvider

    ndk {
        enabled.set true
        forceDebugSymbolsUpload.set false
    }

    buildInfo {
        // enabled.set true                 // default
        // allBuildTypes.set false          // default

        sizeAnalysis {
            enabled.set true
            buildConfiguration.set 'release'
            chunkedUpload.set false
        }

        sizeCheck {
            enabled.set true
            warningPercent.set 5.0
            failPercent.set 10.0
        }

        dependencies {
            // enabled defaults to true
        }
        timings {
            // enabled defaults to true
        }
    }

    instrumentation {
        log.set true
        thread.set true
        operationDispatch.set true
        mainThreadMisuse.set true
        httpEngine.set true
        okhttp.set true
        composeInput.set true
        compose.set true
        composeSecure.set true
        ktor.set true
        cronet.set true
        startupTier.set StartupTier.STANDARD
    }
}
```

:::note
Bytecode instrumentation is only applied to **application** modules (i.e. modules with `com.android.application`). Library modules are not instrumented.
:::

## Configuring via `bugsee.properties`

Every plugin option is also settable through a `bugsee.properties` file
at the **root project** directory, using keys prefixed `plugin.`. The
same file already hosts the `app_token=` key used by the plugin's
token resolver — the new `plugin.*` namespace coexists with it.

This is the recommended surface for CI-specific configuration: it lets
each CI runner ship a different config without touching the build
script.

### Precedence

```
DSL .set(…)  >  bugsee.properties plugin.X  >  built-in default
```

A DSL `.set(…)` call in the `bugsee { … }` block always wins. The
properties file then fills in any keys the DSL didn't touch, and
anything still unset falls through to the plugin's built-in defaults.
The two layers are additive — DSL can override a single key from
properties without invalidating the rest.

The plugin reads the file via `providers.fileContents(...)` so editing
`bugsee.properties` invalidates Gradle's configuration cache and
triggers a re-load on the next build.

### File location and shape

`<rootProject>/bugsee.properties` — at the top-level directory of your
Gradle build (the parent of `settings.gradle.kts`), **not** inside each
`:app` module.

```properties title="<rootProject>/bugsee.properties"
# App token used by the plugin's token resolver (unprefixed — not a plugin.* key)
app_token=YOUR_APP_TOKEN_HERE

# Plugin options — every DSL field has a matching `plugin.<dotted-path>` key
plugin.debug=true
plugin.ndk.enabled=true
plugin.buildInfo.sizeAnalysis.enabled=true
plugin.buildInfo.sizeCheck.warningPercent=10.0
plugin.buildInfo.sizeCheck.failPercent=25.0
plugin.instrumentation.startupTier=DETAILED
```

### Key reference

Each key path mirrors the DSL field name (camelCase, dotted-path).

| Key | Type | Default |
| --- | --- | --- |
| `plugin.endpoint` | String | `https://api.bugsee.com` |
| `plugin.debug` | Boolean | `false` |
| `plugin.feedback` | Boolean | `false` |
| `plugin.optimizeExtensionsLoading` | Boolean | `true` |
| `plugin.ndk.enabled` | Boolean | `false` |
| `plugin.ndk.forceDebugSymbolsUpload` | Boolean | `false` |
| `plugin.buildInfo.enabled` | Boolean | `true` |
| `plugin.buildInfo.allBuildTypes` | Boolean | `false` |
| `plugin.buildInfo.sizeAnalysis.enabled` | Boolean | `false` |
| `plugin.buildInfo.sizeAnalysis.buildConfiguration` | String | unset — falls back to the Gradle variant name |
| `plugin.buildInfo.sizeAnalysis.chunkedUpload` | Boolean | `false` |
| `plugin.buildInfo.sizeCheck.enabled` | Boolean | unset — gate disabled |
| `plugin.buildInfo.sizeCheck.warningPercent` | Double | unset — threshold disabled |
| `plugin.buildInfo.sizeCheck.failPercent` | Double | unset — threshold disabled |
| `plugin.buildInfo.sizeCheck.warningBytes` | Long (bytes) | unset — threshold disabled |
| `plugin.buildInfo.sizeCheck.failBytes` | Long (bytes) | unset — threshold disabled |
| `plugin.buildInfo.dependencies.enabled` | Boolean | `true` |
| `plugin.buildInfo.dependencies.scope` | String | `runtime` |
| `plugin.buildInfo.dependencies.includeSelectedReason` | Boolean | `false` |
| `plugin.buildInfo.dependencies.maxCount` | Int | `5000` |
| `plugin.buildInfo.timings.enabled` | Boolean | `true` |
| `plugin.instrumentation.enabled` | Boolean | `true` |
| `plugin.instrumentation.okhttp` | Boolean | `true` |
| `plugin.instrumentation.httpEngine` | Boolean | `true` |
| `plugin.instrumentation.log` | Boolean | `true` |
| `plugin.instrumentation.thread` | Boolean | `true` |
| `plugin.instrumentation.mainThreadMisuse` | Boolean | `true` |
| `plugin.instrumentation.operationDispatch` | Boolean | `true` |
| `plugin.instrumentation.compose` | Boolean | `true` |
| `plugin.instrumentation.composeSecure` | Boolean | `true` |
| `plugin.instrumentation.composeInput` | Boolean | `true` |
| `plugin.instrumentation.ktor` | Boolean | `true` |
| `plugin.instrumentation.cronet` | Boolean | `true` |
| `plugin.instrumentation.startupTier` | Enum (`OFF`, `MINIMAL`, `STANDARD`, `DETAILED`, `FULL`) | `STANDARD` |

:::note[App token uses an unprefixed key]
The app token is set via the unprefixed `app_token=…` key, **not**
`plugin.appToken=…`. The DSL provides richer token-resolution forms
(closure, provider, per-variant resolver) that have no
properties-file equivalent — `app_token=` covers only the literal
default-token case.
:::

### Type coercion

| Property type | Accepted forms |
| --- | --- |
| Boolean | `true` / `false`, `yes` / `no`, `on` / `off`, `1` / `0` (case-insensitive) |
| Int / Long | Standard integer literal |
| Double | Standard decimal literal |
| String | Trimmed; empty / whitespace-only is rejected with a warn (default holds) |
| Enum | Case-insensitive match against the enum's constant names |

Malformed values emit a `warn` naming the key + bad value, then fall
back to the built-in default — the plugin never crashes the build on
a typo in `bugsee.properties`.

### Diagnostics

| Event | Log level | Why |
| --- | --- | --- |
| File absent | (silent) | Most consumers don't use the file. |
| File present, no `plugin.*` keys | (silent) | Coexisting with `app_token=` is the common shape. |
| File malformed | `warn` | User error — surface always. |
| Value malformed | `warn` | User error; the key + bad value are named. |
| Empty/whitespace string value | `warn` | Likely a half-edited line; default holds. |
| Unknown `plugin.*` key | `info` | Forward-compat — run with `--info` to surface typos. |
| Successful apply | `warn`, only if `plugin.debug=true` | Echoes each applied key when verbose mode is on. |

To debug what was actually applied, run with `--info`:

```bash
./gradlew assembleRelease --info | grep Bugsee
```

### Worked example — DSL + properties together

```properties title="<rootProject>/bugsee.properties"
app_token=YOUR_APP_TOKEN_HERE

plugin.debug=true
plugin.ndk.enabled=true
plugin.buildInfo.sizeAnalysis.enabled=true
plugin.buildInfo.sizeCheck.warningPercent=10.0
plugin.buildInfo.sizeCheck.failPercent=25.0
plugin.instrumentation.startupTier=DETAILED
```

```kotlin title="app/build.gradle.kts"
bugsee {
    // (1) Overrides plugin.endpoint from bugsee.properties (DSL > properties).
    endpoint.set("https://api.bugsee-internal.example.com")

    // (2) Sets a key that bugsee.properties did NOT touch — additive.
    feedback.set(true)
}
```

**Effective configuration** for the example above:

| Key | Effective value | From |
| --- | --- | --- |
| `endpoint` | `https://api.bugsee-internal.example.com` | DSL (overrides properties) |
| `feedback` | `true` | DSL (additive — no properties value) |
| `debug` | `true` | `bugsee.properties` |
| `ndk.enabled` | `true` | `bugsee.properties` |
| `ndk.forceDebugSymbolsUpload` | `false` | built-in default |
| `buildInfo.sizeAnalysis.enabled` | `true` | `bugsee.properties` |
| `buildInfo.sizeCheck.warningPercent` | `10.0` | `bugsee.properties` |
| `instrumentation.startupTier` | `DETAILED` | `bugsee.properties` |

### CI gotcha — instrumentation chain bypass

Boolean instrumentation flags (and `startupTier`) have a deeper
resolution chain than other options because they pre-date the
properties-file feature:

```
DSL .set(…)  >  plugin.instrumentation.X (bugsee.properties)  >  -Pbugsee.instrumentation.X (legacy Gradle property)  >  manifest <meta-data com.bugsee.android.instrumentation.X />  >  default
```

Setting an instrumentation flag in `bugsee.properties` makes the
underlying DSL property "present" (`isPresent == true`), and the
plugin's resolver short-circuits at the highest layer — so
`plugin.instrumentation.X` **bypasses** the legacy
`-Pbugsee.instrumentation.X` Gradle-property and the manifest
meta-data fallback for that key. The user's DSL `.set(…)` still wins
over both sources.

**If your CI relies on `-Pbugsee.instrumentation.X` overrides**, either:

- Don't put the same key in `bugsee.properties`, or
- Read the `-P` flag explicitly in your DSL so it flows through the
  highest-priority layer:

  ```kotlin title="app/build.gradle.kts"
  bugsee {
      instrumentation {
          okhttp.set(findProperty("bugsee.instrumentation.okhttp") as? Boolean ?: true)
      }
  }
  ```

This pattern keeps the CLI override authoritative and matches the
idiom recommended by other major Android tooling plugins.

## Requirements and compatibility

The Gradle plugin and the SDK runtime library are versioned independently but
released as a **matched pair**. There is no cross-line compatibility — the
plugin expects the exact runtime-library shape shipped alongside it.

| Plugin line | SDK line | Status | Min AGP | Min Gradle |
| --- | --- | --- | --- | --- |
| 3.x | 6.x | Stable | — | — |
| **4.x** | **7.x** | **Beta** | 8.6.0 | 8.7+ |

:::caution[Compatibility is strict between lines]
- Use **plugin 4.x only with SDK 7.x**, and **plugin 3.x only with SDK 6.x**. Mixing lines will fail at build or runtime.
- Plugin 4.x introduces new instrumentation hooks and auto-install rules keyed on the `bugsee-android-*` artifact names introduced in SDK 7.x; it cannot target the single-AAR 6.x layout.
- Plugin 3.x has no knowledge of the 7.x module split, APM operation dispatch, Compose transforms, or the new manifest-metadata auto-launch, so SDK 7.x will not function correctly under it.
- **Both lines are currently in beta** and are expected to graduate to GA together. Pin the plugin to a specific beta version rather than a floating range while the APIs are still stabilizing.
:::

### App-startup tracing — SDK version gate

The app-startup tracing instrumentation injects `INVOKESTATIC` calls
against `com.bugsee.library.adapters.BugseeAppStartupDispatcher` — a
class that first ships in SDK `7.0.0-beta11`. Pairing a recent plugin
with an SDK older than that would crash the host app at launch with
`NoClassDefFoundError` inside `InitializationProvider.onCreate`
(which runs BEFORE `Application.onCreate`, so there is no SDK code
path to absorb the failure).

Since plugin `4.0.0-beta10` the plugin guards against this at
configuration time. `AppStartupTracingInstrumentation.shouldApply()`
parses the declared `com.bugsee:bugsee-android` version and refuses
instrumentation with a Gradle warning if it is older than
`MIN_SDK_VERSION_WITH_DISPATCHER = 7.0.0-beta11`:

```
Bugsee gradle plugin: app-startup tracing requires
`com.bugsee:bugsee-android` 7.0.0-beta11 or newer (found 6.5.0).
Skipping instrumentation to avoid NoClassDefFoundError on
BugseeAppStartupDispatcher at app launch. Upgrade the SDK or
downgrade the plugin to a compatible release.
```

Dynamic / range versions (`7.+`, version catalogs that don't resolve
at configuration time, project deps without a string version) parse
to `null` and are treated **permissively** — instrumentation
proceeds. Gradle's lazy model makes strict resolution at configuration
time too costly to apply universally; the common case is a pinned
version string that the gate can parse.

A previous per-class `ClassContext.loadClassData` runtime probe was
removed in plugin `4.0.0-beta10` because it was non-deterministic
across AGP's artifact-transform isolation boundaries — third-party
JARs ran in contexts where the consumer's `:library` dep was not
visible, so the probe spuriously returned null and silently skipped
valid instrumentation targets like `androidx.startup.InitializationProvider`
and `io.sentry.android.core.SentryInitProvider`.
