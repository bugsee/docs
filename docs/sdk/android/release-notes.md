---
title: "Release notes"
description: "Release history for Bugsee Android SDK 7.x."
sidebar_position: 17
slug: "/sdk/android/release-notes"
---

Release history for Bugsee Android SDK 7.x. Looking for the previous major version? See the [6.x release notes](/sdk/android/v6/release-notes). See the [migration guide](/sdk/android/migration) when planning your upgrade from 6.x.

## 7.1.4

A patch release that keeps Bugsee out of your test runs and fixes three crashes that could reach
your users.

- **Your local unit tests pass again.** Bugsee could cause failures in ordinary JVM unit tests — in
  your own code, on lines that had nothing to do with Bugsee. Tests now run unaffected. If you
  turned off `mainThreadMisuse`, `log`, `thread` or `operationDispatch` instrumentation to get a
  green test run, you can turn them back on.

- **Trouble inside Bugsee can no longer surface from your logging calls.** Logging statements in
  your app are now unaffected by anything that happens while Bugsee is capturing.

- **Fixes a crash when the report screen is reopened.** Reporting an issue could crash if Android
  restored the screen after your app had been dropped from memory in the background.

- **Fixes a crash when the theme changes while a report is open.** Switching the device between
  light and dark mode with a notification-opened report on screen crashed the app.

- **The notification icon appears again on devices that need the fallback.** On Huawei devices
  running Android 6.0 and older, Bugsee's notification showed no small icon.

- **Screenshots are no longer lost on some storage configurations.** Where the device restricted how
  Bugsee stores identical screenshots, the screenshot was dropped from the report instead of being
  saved another way.

## 7.1.3

A single fix for how notification-initiated reports are labelled.

- **Reports opened from the Bugsee notification are attributed correctly.** They were recorded as if
  they had been started from code, so they could not be told apart from reports opened with
  `Bugsee.showReportDialog()`.

## 7.1.2

A patch release for native crash reporting. Crashes in the first moments of a launch — a window that
was previously uncovered — are now captured, and crashes that kill the app before it can report are
delivered on the next start.

- **Native crashes are captured from the very start of the first launch.** After an install or an
  update, the SDK needs a moment to prepare its out-of-process native crash handler, and a crash
  during that window went unreported. Bugsee now arms an in-process handler immediately at startup,
  so those crashes arrive with the faulting library, its build ID and a stack, and upgrades to the
  full handler as soon as it is ready. This is the window that used to hide crashes in native
  libraries an app loads early.

- **Crashes during startup, and crash loops, are now reported.** If your app crashes before capture
  is fully running — including a loop where it never stays alive long enough to send anything — the
  report is exported and uploaded during the next launch, instead of being handed to background work
  the app never survives to run. If the device is offline the report is kept and retried.

- **Reports created before capture starts are no longer discarded.** A report produced in that early
  window was assembled without the list of capture providers and then dropped as unprocessable, so
  the crash never arrived at all.

- **A damaged crash handler no longer disables native reporting.** If the helper Bugsee extracts is
  incomplete, or cannot be executed on a particular device, that is now detected during startup and
  the in-process handler is kept instead of arming one that cannot run. Previously the combination
  looked healthy and produced an empty report.

- **Steadier crash handling.** The code that runs inside a crash no longer depends on library
  functions that carry no guarantee of being safe there, and a race between arming the handler and a
  crash arriving on another thread has been closed. Either could previously cost you the report.

- **Optional libraries are no longer loaded merely to detect them.** Bugsee now checks whether
  Material Components, AndroidX or `androidx.fragment` are present without initializing their
  classes, so an app that never uses fragments never loads one on Bugsee's behalf.

- **`addSecureView()` and `removeSecureView()` now take `Object`.** One overload previously took
  `androidx.fragment.app.Fragment`. Passing a fragment still works exactly as before, and behavior is
  unchanged when `androidx.fragment` is on the classpath. This removes the last non-platform type
  from Bugsee's public API, which matters for hosts that inspect its methods reflectively — Unity
  bindings in particular.

  :::note
  Because the method signature changed, rebuild your app against 7.1.2 rather than dropping the new
  AAR onto an existing build. No source changes are required.
  :::

## 7.1.1

A patch release covering dependencies.

- **Bugsee no longer adds the Kotlin standard library to your app.** Previously every project that
  included Bugsee picked it up, even apps written entirely in Java. It is now gone from the core SDK
  and from every extension that does not genuinely need it, so your dependency graph stays smaller
  and Bugsee no longer influences which Kotlin version your build resolves.

  :::note
  If your build was relying on Bugsee to supply the Kotlin standard library or
  `org.jetbrains:annotations` indirectly, declare them yourself. Projects that already use Kotlin are unaffected.
  :::

## 7.1.0

A feature and hardening release. WebSocket traffic is now captured, crash / ANR / exit reports carry
substantially more diagnostic detail, and screens marked as secure by the Android platform are
excluded from capture by default. It also lands a large privacy and performance pass across screen
capture, and restores native crash reporting on older Android versions.

**New features**

- **WebSocket traffic is captured.** WebSocket connections opened through OkHttp are recorded
  alongside your other network activity — connection lifecycle, sent and received frames, close and
  error events — so a realtime feature is no longer a blank space in the timeline. Ktor is covered
  too: on the OkHttp engine it works automatically, and on the CIO engine you can route calls
  through the `bugseeWebSocket` helper to capture them. Automatic instrumentation requires Gradle
  plugin **4.0.3** or newer.
- **Richer ANR and app-exit reports.** ANR reports now understand the native-format traces Android
  produces on some devices, instead of degrading to a single synthetic frame — so you get the real
  stack. App-exit reports carry the full `ApplicationExitInfo` detail, including the sub-reason the
  system recorded. You can optionally have "application not responding" exits reported as crashes
  with the new `DetectAndReportExitNotRespondingAsCrash` option (off by default).
- **Adaptive video capture.** With the new `CaptureVideoAdaptive` option (off by default), the SDK
  skips redundant capture work while the screen is not changing, lowering CPU and battery cost
  during idle periods without losing meaningful frames.
- **Network capture from launch.** The new `CaptureNetworkOnLaunch` option (off by default) starts
  network capture as early as possible, so requests issued during startup are not missed.
- **Nothing is lost between `launch()` and capture starting.** Logs, events, traces, and breadcrumbs
  produced in the short window before capture is fully running are now buffered and folded into the
  session instead of being dropped.
- **Query the SDK state.** `Bugsee.getStatus()` reports whether the SDK is launched, running, or
  stopped, which makes conditional logic in host apps straightforward.
- **More device context.** Reports now include satellite-services state, and window tracking follows
  activity on secondary displays and while the app is in the background.

**Privacy**

- **Screens the platform marks as secure are excluded by default.** Windows with `FLAG_SECURE` — the
  flag apps set on sensitive screens, and the one payment and DRM surfaces set for you — are now
  blanked in video and screenshots, and taps and typed keys on them are not recorded. This is on by
  default; set `CaptureRespectFlagSecure` to `false` to restore the previous behavior.
- **Secure `SurfaceView` content is blanked.** A `SurfaceView` with `setSecure(true)` is now treated
  the same way, so protected media and camera surfaces do not appear in recordings.
- **Secure views are masked where they actually appear.** Views that are scaled, translated, or
  animated are now masked against their on-screen position rather than their layout position, so the
  mask no longer drifts away from the content it is protecting during transitions or while the
  keyboard pans the window.
- **Secure regions registered before the first screen are honored.** Marking views, fragments, or
  rectangles as secure during application startup now takes effect immediately, instead of being
  ignored until the first Activity appeared.
- **Secure content is kept out of the view hierarchy.** Labels and text of secure views are no longer
  included in the captured hierarchy, and everything inside a secure window is treated as secure.
- **Secure regions declared from cross-platform wrappers now filter interaction** as well as pixels.
- **Stronger network scrubbing.** Form-encoded request bodies are now scrubbed, and the list of sensitive
  field names now matches any key containing a sensitive term, not only exact matches.
- **Blackout mode applies everywhere,** including the screenshot attached to a report.

**Fixes**

- **Native crash reporting restored on Android 5.0–9 (API 21–28).** Native (NDK) crashes were not
  being reported on these versions; they are captured again, and the native handler has been
  hardened for signal-safety and multi-process apps.
- **No more duplicate or missing issues.** Report bundles are now named deterministically and
  published atomically, closing a window where a single incident could surface as two issues or be
  lost entirely. Report lifecycle callbacks now fire consistently for crashes and silent uploads.
- **More accurate problem detection.** Hang and ANR watchdogs are immune to device sleep and clock
  jumps, so a phone waking from a long sleep no longer produces a false report. App-exit
  classification now matches what Play Console shows, and long-lived streaming requests are no longer
  flagged as stuck.
- **Reports are no longer dropped on a slow network.** Request timeouts are treated as temporary and
  retried, expired sessions are refreshed automatically, and several upload paths were hardened.
- **Steadier screen and input capture.** Fixed leaks, stalls, and rare crashes in the capture
  pipeline; touch capture now recovers if the SDK is stopped and started again, and gesture tracking
  survives dialogs being dismissed and reopened.
- **Correct network event data.** Removed duplicate request events and fixed cases where a request
  could be recorded without its completion.

**Performance**

- **Screen capture costs substantially less CPU.** Unchanged frames are detected and skipped before
  any expensive work, color conversion is fused into a single pass, and redundant per-frame
  clearing and compositing was removed.
- **Secure-view tracking is roughly twice as cheap per frame,** and interaction hit-testing against
  secure regions is now allocation-free.
- **Compose screens no longer stall capture.** Scanning a Compose hierarchy for secure areas runs off
  the capture thread, removing a pause that was visible on busy screens.
- **Faster startup.** Reduced the SDK's cold-start cost through lazier initialization and a bundled
  baseline profile.

**Compatibility**

- Pairs with **Bugsee Android Gradle plugin 4.0.3**. WebSocket capture requires it; everything else
  works with 4.0.0 or newer.
- **Leaner dependencies.** The OkHttp and Cronet extensions no longer pull the Kotlin standard
  library or `androidx.annotation` into your dependency graph.

## 7.0.4

A follow-up privacy release that keeps WebView redaction reliable on the latest devices and extends it to more kinds of web content.

**Fixes**

- **WebView redaction restored on newer devices.** On devices whose system WebView had updated to a more recent build, redaction could stop reaching content inside iframes and certain embedded components — leaving password and hidden fields visible in the recording. The SDK now applies its protection to every frame in a more resilient way, so those fields stay blacked out regardless of the installed WebView version. No app changes required.
- **Secure fields inside web components are now redacted.** Password and hidden fields rendered inside Shadow DOM — used by many modern web components, in both open and closed modes — are now detected and blacked out like any other secure field.
- **Redaction keeps up as the page changes.** Masks now track more kinds of page updates — layout reflow, images and fonts finishing loading, scrolling inside a nested scroll area, and fields that appear or disappear dynamically — so secure content stays covered instead of briefly drifting out of place.

## 7.0.3

A broad privacy, reliability, and compatibility release.

**New features**

- **More context in every report.** Reports now capture additional device and app signals — a per-app language override, floating-window ("bubble") state, Game Mode, thermal headroom, key accessibility settings, and Doze / app-standby power status — giving you more to correlate against when reproducing an issue.

**Fixes**

- **Interaction on secure fields is no longer recorded.** Taps, gestures, and focus on password fields and other views you mark as secure are now excluded from capture. Previously the on-screen pixels were masked but the surrounding interaction data could still be collected. (Typed text was already protected.)
- **Stronger WebView redaction.** Password and hidden fields inside WebViews are now reliably blacked out across every frame and domain, including cross-origin iframes, and stay correctly positioned after the page is scrolled. If the first redaction attempt on a device doesn't take, the SDK now retries automatically instead of leaving those fields exposed.
- **Consistent network scrubbing.** Closed a path where some captured network events could bypass your data-scrubbing filters.
- **The SDK is guarded against crashing your app at startup.** Automatic initialization is now fully wrapped, so an unexpected failure on an unusual device or OS build makes Bugsee quietly disable itself rather than affecting your app.
- **Compatibility with older Android versions.** Fixed crashes that could occur on Android 5.0–6.0 (API 21–23) when newer platform APIs were used without a fallback.
- **More resilient handling of unexpected data.** Malformed, truncated, or unusually large inputs — crash markers, saved options, encrypted payloads, and server or WebView responses — are now handled gracefully instead of risking a crash or excessive memory use.
- **Thread-safety and resource-leak fixes.** Resolved several rare race conditions and small leaks across the capture, performance-monitoring, and reporting paths for steadier long-running sessions.
- **Cleaner video capture.** Empty or unreadable recordings are now detected and handled gracefully instead of producing a broken video.

**Compatibility**

- Now built against the stable **Bugsee Android Gradle plugin 4.0.0** (previously a 4.0.0 beta). Works with **4.0.0** or newer.


## 7.0.2

**Fixes**

- **Screen-capture crash.** Fixed a rare `NullPointerException` during video capture caused by a thread-safety issue in the internal video frame pipeline — the frame buffer could be recycled on another thread between being written and read. The capture pipeline now reads it through a single safe snapshot and skips the affected frame instead of crashing.
- **More resilient SurfaceView capture.** The `SurfaceView` / `PixelCopy` capture path now recovers if a copy-result callback is never delivered — a watchdog reschedules capture instead of stalling the recording — and additional capture callbacks and bitmap handling are guarded against null and concurrent recycling.


## 7.0.1

- **SurfaceView composition.** Captured SurfaceView may be incorrectly composited (in captured video) outside the app window after scrolling when activity is shown in a bubble (Android 17).


## 7.0.0

The first stable release of the 7.x line. It is the same modular, instrumented SDK as the late betas, with two reliability fixes on top of `7.0.0-beta15`. The full rewrite is summarized in the [migration guide](/sdk/android/migration); the per-beta history below documents how the line evolved.

**Fixes**

- **More resilient report uploads.** Creating an issue is now retried when the initial attempt fails with a transient network or TLS error, instead of dropping the report. Previously a single cold-connection blip at the moment the report was created could lose that report entirely — most visible on slow or flaky links and on older OS versions where the first TLS handshake is more likely to stall.
- **Screenshot-to-report triggering now works across device makers.** Triggering a report by taking a screenshot previously missed some OEMs (notably Samsung and other devices that save screenshots to `DCIM/Screenshots`). The SDK now runs an always-on MediaStore observer as a fallback alongside the Android 14 `ScreenCaptureCallback`, so screenshot detection is consistent regardless of where the device stores the image.

## 7.0.0-beta15

GLSurfaceView capture and the wrapper secure-rectangle API.

**New features**

- **GLSurfaceView / OpenGL content capture.** Surfaces driven by OpenGL are now captured with the same asynchronous `PixelCopy` path used for ordinary `SurfaceView`s, and each surface is composited into the session video according to its z-order (`SurfaceView.mSubLayer`) rather than being assumed to sit on top. OpenGL content — and any controls layered over or under it — now render in the correct order in the recording.
- **`BugseeWrapper.getSecureRects(int display)`.** Cross-platform wrappers can supply per-display secure rectangles, which the SDK redacts from the captured video (see beta14 for the redaction itself).

**Compatibility**

- No plugin upgrade required — continues to work with the Bugsee Android Gradle plugin **4.0.0-beta10** or newer.

## 7.0.0-beta14

A privacy refinement for wrapper-driven redaction, plus packaging fixes.

**New features**

- **Redaction of wrapper-supplied secure rectangles.** Secure rectangles contributed by a cross-platform wrapper (via the wrapper hook) are now blacked out in the captured video, giving wrapper SDKs the same view-level privacy controls available natively.

**Fixes**

- Restored a few public API declarations that were inadvertently missing from the published surface.
- Tightened the bundled R8 / ProGuard keep rules.

**Compatibility**

- No plugin upgrade required — continues to work with the Bugsee Android Gradle plugin **4.0.0-beta10** or newer.

## 7.0.0-beta13

A large release: a new memory & thread leak-detection module, hardened multi-process support, cross-platform wrapper integration, broader input capture, and the groundwork that makes the SDK run cleanly on every Android device type.

**New features**

- **Memory & thread leak detection** (new `bugsee-android-leak` extension module — Phase 1). Detects leaked objects (via a vendored Shark-based analysis) and leaked threads, surfaced as issues in the dashboard. Detection modes are configurable; on debuggable builds a confirmed leak can additionally trigger an in-process heap dump with reference-chain analysis. Deep-dump sampling is configurable through a launch option, frequency caps can be bypassed on debug builds, and a "deep everywhere" mode is available for aggressive local diagnosis. Raw heap dumps are never uploaded.
- **Multi-process support.** Native (NDK) crash handling is now isolated per process, and the feedback database is multi-process-safe (WAL + a cross-process construction lock); the leak module's heap-dump storage is likewise multi-process-safe. The SDK behaves correctly when initialized in more than one process.
- **Cross-platform wrapper integration (`BugseeWrapper`).** A registered wrapper can forward lifecycle events, act as a `ReportHandler`, and contribute metadata to reports — the foundation the cross-platform (React Native / Flutter / etc.) SDKs build on. The early-crash window and activity event names are exposed for wrapper use.
- **Broader input capture.** Input interception now extends beyond touch to hardware keys, gamepad, rotary (Wear OS crown), and trackball, and also covers dialogs and popups — so non-touch interactions are reflected in the session timeline.
- **All Android device types.** Added platform/device-type detection and the changes needed for the SDK to initialize and capture correctly across phones, tablets, Android TV, Wear OS, and Android Automotive (see [Device types & form factors](/sdk/android/overview#device-types--form-factors)).
- **Synthesized `BUILD_UUID` fallback.** Apps that don't use the Bugsee Gradle plugin (for example, fastlane-only mapping uploads) now get a deterministic build identifier derived from the app token and version, so uploaded mapping/symbol files still match the build at symbolication time.
- **Manifest-driven component loading.** Capture components and custom detection providers can be registered from per-key `<meta-data>` entries in the manifest, and event/log/network filters can be initialized early from the manifest — enabling configuration before the first `Bugsee.launch(...)`.
- **HTTP 5xx error detection.** Server-error responses are flagged as issues via subscription-driven network interception.
- **DirectBuffers video pipeline and `FrameRate.Raw`**, plus an `enforceFiltering` option on `Bugsee.log`.

**Improvements & fixes**

- **NDK hardening.** A minidump privacy gate, native crash-report retry, recovery from a previously disabled run, and synchronous recovery for crashes that occur very early in startup.
- **Fixed a `SurfaceView` `PixelCopy` native crash** (uncatchable `SIGSEGV` when a surface died between liveness check and native acquire — ANDROID-11099).
- **Native (JNI) hardening** — capacity guards across the native buffers, plus corrected rotate / I420 frame geometry and a clamp on the empty-frame chroma fill.
- **Cold-start work moved off the critical path** — asynchronous server-session warm-up on launch, and leak setup deferred off the cold-start main thread.
- WebView interception is gated on `FEATURE_WEBVIEW` availability; the feedback database is opened off the main thread; late-registered capture providers are auto-started.

**Compatibility**

- Requires the Bugsee Android Gradle plugin **4.0.0-beta10** or newer.

## 7.0.0-beta12

This release completes the cold-start tracing rollout: per-method spans now correctly bracket the user-method body for Activity lifecycle callbacks on API 29+, the cold-start waterfall uses distinct operation names per source kind, and the underlying event pipeline is driven by an event-folder rather than SDK-centric phase spans.

**New features**

- **Cold-start waterfall — per-kind operation names.** Wrapped methods produce child spans under the cold-start transaction with operation names that reflect the source kind: `app.startup.application`, `app.startup.provider` (now including `androidx.startup.InitializationProvider.onCreate` — see the matching plugin release note), `app.startup.activity` (first Activity `onCreate` / `onStart` / `onResume`), `app.startup.annotated` (`@BugseeTrace`-tagged methods at FULL tier), `app.startup.method` (fallback), `app.startup.call` (per-call wraps at STANDARD+), and `app.startup.loop` (per-loop wraps at DETAILED+). System-phase boundary spans (`app.start.process_init`, `app.start.first_paint`) anchor the timeline.
- **Accurate Activity-body bracketing on API 29+.** The first Activity's `onStart` / `onResume` spans now use the OS `onActivityPreXxx` / `onActivityPostXxx` callbacks to bracket the full user-method body. Previously the legacy `onActivityStarted` callback fired from inside `super.onStart()` (AOSP `Activity.onStart()` calls `dispatchActivityStarted()` mid-body), clipping every line after `super.*`. The fix shows up as user code that previously appeared in the gap before/after the lifecycle span now landing inside it. On API 21-28 no per-method Activity spans are emitted (the legacy callbacks fire mid-body on those APIs too — the same blind spot Sentry has).
- **WebView WebSocket / SSE support.** `WebViewClientWrapper` now captures WebSocket and Server-Sent-Events traffic alongside conventional requests, and orphan sub-resource spans are paired with their completion or error callback rather than left hanging.
- **`BugseeCompose` extension facade.** Consolidates extension-loading wiring so Compose-aware initialization happens through a single named entry point.

**Improvements**

- **`BUILD_UUID` read from asset file (post-R8 channel).** The per-build UUID injected by the Gradle plugin is now also accessible via a packaged asset, surviving R8 string-pool repacking that would otherwise corrupt the manifest-meta-data channel on some R8 configurations.
- **OkHttp interceptor injection is idempotent.** `BugseeOkHttpInterceptor.addIfAbsent` prevents duplicate interceptor registration when the host app re-creates its `OkHttpClient` or the SDK is launched more than once.
- **APM span/transaction stores.** Replaced the per-store `CopyOnWriteArrayList` with a `synchronized ArrayList` to remove churn on high-frequency span finalization paths.
- **Retroactive span insertion in cold-start waterfall.** Spans backdated to their real emit time are inserted at their chronological position rather than appended, keeping the waterfall ordered.
- **MediaCodec pre-M compatibility.** Video capture handles the absence of the `Handler`-taking callback API on pre-M devices.
- **Deferred extension launch.** `BugseeFeedback.launch` is deferred until the first API call so the extension contributes no work to cold-start when unused.
- **Pre-launch extension installer deferred on Compose.** The Compose installer no longer fires before SDK launch, removing a known cold-start regression.

**Fixes**

- **Outdated public API declaration file regenerated** so the Kotlin Binary Compatibility Validator no longer flags the bytecode-emitted extension entry points.
- **Internal init providers self-instrument** so every Bugsee init provider's `onCreate` shows up in the waterfall under the same `app.startup.provider` row as user-defined providers.
- **`IOUtils.writeBitmapToStream`** properly guards null inputs (logged + swallowed; previously could throw mid-write in the catch-any boundary).

**Build**

- Requires Bugsee Android Gradle plugin **4.0.0-beta10** or newer. The plugin gates instrumentation against `MIN_SDK_VERSION_WITH_DISPATCHER = 7.0.0-beta11` at configuration time; pairing an older plugin with this SDK won't crash, but pairing this plugin with an older SDK (`< 7.0.0-beta11`) is refused with a Gradle warning rather than a runtime `NoClassDefFoundError`.

## 7.0.0-beta11

This release rewrites the UI performance provider for accurate TTID/TTI metrics, ships privacy scaling for screen capture, closes a year-long screen-capture memory + concurrency audit, and adds frustration detection.

**New features**

- **TTID / TTI bring-up metrics.** `UIPerformanceProvider` is rewritten end-to-end. For each Activity bring-up it emits a detached `ui.activity` transaction whose child spans `ui.load` (cold) and `ui.display` (warm) measure the time-to-initial-display and time-to-interactive intervals through the pre-draw and first-idle signals, surviving transparent overlays and `onPause`/`onResume` flips. Multiple activities in the back stack are tracked independently via an `IdentityHashMap`.
- **Privacy scaling for screen capture.** A new option scales redaction overlays (secure views, password fields, custom regions) consistently with the captured frame's resolution, so blackout rectangles stay aligned through quality-scaling changes. Applies to both video and screenshot paths.
- **Frustration-detection provider.** A new detection provider watches APM transactions for four parity signals — rage taps, dead clicks, slow renders, and excessive scroll — and reports the matching pattern as a frustration event. Off by default; enable with the new option in the detection group.

**Improvements**

- **View-hierarchy off-main best-effort fallback.** When the main thread is hung, view-hierarchy capture now falls back to an off-main best-effort pass rather than producing an empty hierarchy.
- **Endpoint resolution.** Deduplicated across reporting paths so a single source of truth handles `Bugsee.endpoint` / `Options.Endpoint` / manifest meta-data.
- **APM "finished" property always emitted.** The piped binary→JSON output now always emits the `finished` flag on spans/transactions.
- **Threading: postAndAwait timeouts cancel late wrappers** so a slow handler can't leak its delayed body once the awaiter has timed out.

**Fixes**

- **Screen-capture memory + concurrency leaks (audit cycles A–J).** Closes a 10-cycle audit pass against the screen-capture pipeline: muxer crashes during finalization, encoder hangs under load, listener-list lifecycle leaks, secure-view single-frame leaks, and several oblique threading races between the capture and APM coordinators.

**Build**

- Requires Bugsee Android Gradle plugin **4.0.0-beta7** or newer.

## 7.0.0-beta10

Maintenance release shipping the frustration-detection provider's parity detectors and a tracker-initialization refactor for tests.

**New features**

- **Frustration-detection parity detectors.** Backed by the `Bugsee.setFrustrationListener(...)` and `Options.DetectAndReportFrustration` surface introduced here. The detectors land in beta10 but the bulk of the user-facing frustration-detection feature graduates in `7.0.0-beta11` — see that release for the full description.

**Improvements**

- **`BugseeTrackerActivity` test seam.** Tracker initialization no longer depends on a process-wide singleton during tests; the refactor makes the activity tracker injectable, unblocking unit-level coverage of consumers (notably the new APM providers).
- **`finished` property is now always stored on spans / transactions** so consumers reading from the capture pipeline don't have to special-case the in-progress state.

**Build**

- Requires Bugsee Android Gradle plugin **4.0.0-beta6** or newer.

## 7.0.0-beta9

This release adds dynamic debug logging, hardens tracker initialization and report uploads against early-launch and session-expiry edge cases, and decouples touch capture from breadcrumb capture.

**Improvements**
- **Activity-discovery fallback.** `BugseeTrackerActivity` now falls back to scanning attached, visible root views (via `BugseeTrackerUI`) when standard lifecycle tracking and reflection both fail to populate the activity map during early initialization. The discovered activities are filtered to skip finishing/destroyed instances.
- **Lifecycle-callback registration is always retried.** The previous "registered once" guard inside `BugseeTrackerActivity#initialize()` could leave activity lifecycle monitoring permanently disabled when the very first registration attempt happened before the global context/application was available. The check is removed; explicit initialization always re-attempts registration.
- **Managed-profile detection on Android 11+.** `EnvironmentInfoProvider` now uses the official `UserManager#isManagedProfile()` API on API 30+, with null-safety on the system-service lookup.
- **Launch robustness.** `Bugsee.launch(...)` now auto-registers the supplied context as the current top activity if it is an `Activity` instance, and aborts cleanly with no side effects if no application context can be resolved.

**Fixes**
- **Touch capture is no longer gated by `CaptureBreadcrumbs`.** Touch data is primarily used for video overlays, so the input capture provider is now controlled solely by `Options.CaptureVideo` and remains active when breadcrumbs are disabled.
- **Session-expiry recovery during upload.** Report-upload jobs that hit an expired access token (`AUTH_EXPIRED`, including the newly-mapped `SessionNotFoundError` / code 14002) now invalidate the cached session, clear the stale token, and re-queue for retry with fresh credentials instead of failing permanently. Server error parsing now reads the error code from the nested `error` object in the JSON response.
- **MediaProjection startup diagnostics.** `ScreenCaptureEngineMediaProjection` now logs a warning when `start()` / `startWithRequestingPermission()` exits early because of a missing context or a foreground-service restriction; previously these paths returned silently.

**Build**
- No Gradle plugin upgrade required — continues to work with **4.0.0-beta4** or newer.

## 7.0.0-beta8

This release adds an exchange factory for constructing `Breadcrumb` and `NetworkEvent` containers without allocating them yourself, makes hang detection thresholds configurable, and reduces GC pressure on the network-event fallback path.

**New features**

  - **`Bugsee.getExchangeFactory()`** — returns a shared `BugseeExchangeFactory` for constructing the exchange objects you pass to [`addBreadcrumb`](/sdk/android/privacy/breadcrumbs) and [`addNetworkEvent`](/sdk/android/network). The factory delegates to the SDK's pooled capture-side containers, so you do not allocate per event:
  - `createBreadcrumb()` / `createBreadcrumb(timestamp, category, message, level, type, data)` — short and fully-populated overloads for breadcrumbs.
  - `createNetworkEvent(timestamp, stage, id, mechanism, httpMethod)` plus a fully-populated 16-argument overload covering URL, headers, body, response code, error fields, and timings.

  Each `create*` method may return `null` when the underlying capture subsystem isn't yet available (for example, before launch) — always null-check. Once populated, hand the returned object to the matching `Bugsee.add*` method and don't retain it: instances are pooled and the SDK recycles them after submission.
  - **Configurable hang detection thresholds.** Three new options control the millisecond thresholds that trigger Fair, Medium, and Severe hang reports. Previously these were hardcoded to 3 s, 5 s, and 10 s.
  - `Options.DetectAndReportHangFairLevel` (default `3000`)
  - `Options.DetectAndReportHangMediumLevel` (default `5000`)
  - `Options.DetectAndReportHangSevereLevel` (default `10000`)

  Thresholds must be strictly increasing and positive; invalid configurations fall back to the documented defaults. Detection resolution is approximately 1 second — values smaller than that are rounded up by the watchdog tick. See [Issue detection → Hangs](/sdk/android/issue-detection/hangs).

**Improvements**
- The fallback `NetworkEvent` allocation path used when no capture-side pool entry is available now reuses instances via an intrusive 15-slot free list. Producers see no API change; the SDK's network coordinator recycles each instance after dispatch, eliminating allocation churn for hub-only consumers (APM, extension listeners) when the network capture provider isn't running.
- Network event listeners (`NetworkEventListener.onNetworkEvent`) now have an explicit "do not retain past the callback" clause in the contract — matching the long-standing log-listener convention. The event instance may be pooled and reused for a subsequent network event; copy any values that need to outlive the callback.

**Build**
- No Gradle plugin upgrade required — continues to work with **4.0.0-beta4** or newer.

## 7.0.0-beta7

This release adds three small public APIs for inspecting blackout state and injecting custom network events and breadcrumbs into the capture pipeline.

**New features**
- **`Bugsee.isBlackout()`** — returns `true` while a complete blackout is active (i.e. between `startBlackout()` and `endBlackout()`). Reads the same state the existing pair already manages, with no separate cache; safe to call before launch.
- **`Bugsee.addNetworkEvent(NetworkEvent, boolean)`** — record a `NetworkEvent` produced outside of the SDK's built-in interception (custom HTTP clients, native bridges, hand-built request/response pairs). The event is forwarded to the same capture pipeline that automatically intercepted events go through, so it appears in reports and session recordings alongside them. The `requiresFiltering` flag controls whether the event is run through the registered [`setNetworkEventFilter`](/sdk/android/network#filtering-and-redacting-network-events) — pass `true` for raw payloads that may need redaction, `false` when the caller has already sanitized the event. See [Network events](/sdk/android/network).
- **`Bugsee.addBreadcrumb(Breadcrumb)`** — record a `Breadcrumb` produced outside of the SDK's automatic breadcrumb sources (custom navigation events, business-domain checkpoints, breadcrumbs forwarded from a wrapper SDK). The breadcrumb runs through the registered [`setBreadcrumbFilter`](/sdk/android/privacy/breadcrumbs#filtering-breadcrumbs) before being recorded. See [Privacy → Breadcrumbs](/sdk/android/privacy/breadcrumbs).

**Improvements**
- The internal network-event delivery path now goes directly to the shared network interception coordinator rather than resolving the consumer through the capture coordinator on every call. No behavior change for SDK users; one fewer hop on the producer hot path.

**Build**
- No Gradle plugin upgrade required — continues to work with **4.0.0-beta4** or newer.

## 7.0.0-beta6

This release introduces anomaly detection, splits NDK crash reporting into its own optional module, and consolidates how the SDK captures logs, network, input, and WebView events.

**Breaking changes**
- Native (NDK) crash detection now ships as a separate `bugsee-android-ndk` extension. Apps that need native crash capture must add `implementation("com.bugsee:bugsee-android-ndk:7.x.x")` and switch from `Options.DetectAndReportCrashNdk` to `NdkOptions.DetectAndReport`. The underlying option key is unchanged. See the updated [Native crashes guide](/sdk/android/issue-detection/native-crashes).
- The legacy WebView capture provider has been removed. WebView content now flows through the new unified interception layer, so no action is needed beyond updating to this version.

**New features**
- **Anomaly detection.** A new built-in provider watches APM transactions and surfaces statistical outliers — using exponentially weighted mean/variance baselines maintained per bucket (e.g. HTTP method + host + path template) and a z-score threshold. High-severity outliers are reported as errors; medium-severity ones as breadcrumbs. Off by default — enable with `Options.DetectAndReportAnomaly` and ensure APM is on. Baselines persist across sessions.
- **Breadcrumb filtering.** A new public `Bugsee.setBreadcrumbFilter(...)` lets you inspect, modify, or drop breadcrumbs before they're recorded — mirroring the existing log and network filters. The previous hardcoded URL sanitization on HTTP breadcrumbs has been removed in favour of this user-controlled filter. See [Privacy → Breadcrumbs](/sdk/android/privacy/breadcrumbs).
- **Adaptive APM sampling.** A new `Options.PerformanceAdaptiveSampling` option (on by default) lets the SDK automatically tune transaction sampling based on observed traffic.
- **Richer NDK crash reports.** Native crashes are now matched against the system's historical exit records, attaching the matching tombstone to the report when one is available.
- **Extension APIs.** New public hooks let extension modules listen for completed transactions, log events, and input events, and register custom capture data entries synchronously at startup.
- **Breadcrumbs.** HTTP-request breadcrumbs now carry a mechanism field, and producer types have been aligned with the icons shown in the report viewer.
- New optional `:ai` base module providing a `TfliteModel` abstraction. Reserved for a future AI-based anomaly detection extension; the built-in anomaly detector that ships today is purely statistical.

**Improvements**
- A new unified interception layer routes logs, network calls, input events, and WebView traffic through shared hubs, so capture and APM no longer duplicate work.
- Extension content providers initialize in a guaranteed order relative to the core SDK.
- WebView debugging initialization no longer runs on a background thread.

**Fixes**
- Secure views no longer leak a single frame around asynchronous screen captures.
- The V2 video encoder no longer stalls under load.
- ANR and NDK trace payloads are smaller and contain less duplicate data.
- Bluetooth state is now reported as "unknown" on error rather than being dropped.
- Updated ProGuard rules keep extension-facing APIs intact through R8.
- Internal option keys on the wire now match the backend's expected format.

**Build**
- Requires the Bugsee Android Gradle plugin **4.0.0-beta4** or newer.
- Adds new `:ndk` and `:ai` modules and enables Bugsee's own build size analysis in CI.
- Expanded test coverage: end-to-end tests for anomaly detection, load tests across all interception paths, and new encoder and leak benchmarks.

## 7.0.0-beta5

- Network monitoring is now driven by a single shared coordinator consumed by both capture and APM, removing duplicated work between the two pipelines.
- A new capture data entry registry eliminates a class of startup race conditions around provider and exporter discovery.
- Requires the Bugsee Android Gradle plugin 4.0.0-beta2 or newer.
- Adds comprehensive instrumentation tests for network interception.

## 7.0.0-beta4

This release focuses on startup performance and resource footprint.

- Capture sources, codec metadata, HTTP connection pools, and internal thread pools all initialize lazily or with leaner defaults, reducing startup overhead and steady-state resource use.
- The first captured frame is now tied to a launch timestamp recorded earlier in the process, tightening alignment between launch and the first frame.
- Improves thread safety of listener management in tracker internals.
- Removes a redundant back-press override in the feedback activity.
- Adds behavioral tests for the connection and thread pool configurations.

## 7.0.0-beta3

- Cold start is faster — non-critical initialization has been moved off the startup path.
- The feedback activity now supports Android's predictive back gesture.
- Fix: Provider discovery in minified builds — runtime annotations used by capture and detection are now preserved through ProGuard/R8.
- Adds annotation-integrity checks and release-AAR verification to the test suite.

## 7.0.0-beta2

- All SDK modules are now published to Maven Central as `bugsee-android-*` artifacts (core, feedback, okhttp, ktor-2, ktor-3, cronet, compose), with proper Javadoc and source JARs.
- All extension modules are now built with R8 minification and self-obfuscation enabled.
- The public API surface is now validated and tracked using the Kotlin Binary Compatibility Validator; obfuscated classes are filtered out of the surface.
- Detection contracts have been refined and stabilized for the public API.
- Fix: ProGuard rules updated to keep capture data classes, exporter constructors, and the LZ4 / XXHash JNI-bound classes from being stripped.
- Requires the Bugsee Android Gradle plugin 4.0.0-beta1 or newer.
- Adds fuzz tests for capture data entries, core utilities, native components, and the screen-capture bitmap cache.

## 7.0.0-beta1

First public beta of the 7.x line — a ground-up rewrite of every major subsystem.

**What's new**
- **Multi-display and foldable support.** Each display is tracked independently and composited into the report.
- **New screen capture engine.** Multiple strategies are selected automatically based on device, Android version, and display, with encoding decoupled from the capture thread.
- **Modular detection.** Independent providers for Java/Kotlin crashes, native (NDK) crashes via Breakpad, hangs, abnormal exits (ANR/OOM/user-stop/package-update), and main-thread misuse.
- **Expanded system telemetry.** 9 system event types and 23 system trace types covering display state, thermal, connectivity, FPS, memory, power, orientation, UI mode, and more.
- **Breadcrumb capture (beta).** Built-in app, UI, network, and system breadcrumb sources, opt-in via `CaptureBreadcrumbs`.
- **Modular architecture.** A core library plus separate extension modules for feedback and HTTP clients (OkHttp, Ktor 2, Ktor 3, Cronet, Jetpack Compose). Extensions auto-register at startup.
- **Automatic initialization.** Adding the `com.bugsee.app-token` manifest entry is enough to launch the SDK; programmatic launch with async completion callbacks is still supported.
- **Application Performance Monitoring.** Built-in providers for UI load/display, cold-start, HTTP, database, and file I/O, plus custom `Transaction` and `Span` APIs that propagate context across threads.
- **New Gradle plugin (4.0.0-beta1) — required.** Provides bytecode instrumentation for logcat, OkHttp, `HttpEngine`, Compose touch capture, native threads, and APM, plus mapping/NDK-symbol upload and extension auto-install.

**Breaking changes**
- `LaunchOptions` is gone — configure via a `Map<String, Serializable>` keyed by `Options.*` constants, or via manifest `meta-data`.
- Network-client helpers for OkHttp, Ktor, and Picasso have been replaced by extension modules. OkHttp 2 is no longer supported.
- Feedback now lives in the `bugsee-android-feedback` extension; access it via `Bugsee.ext(Feedback.class)`.
- Option keys have been renamed across detection, capture, reporting UI, and trigger groups. `IssueSeverity.Critical` has been removed.
- `pause()`, `resume()`, and `isResumed()` have been replaced by the blackout APIs `startBlackout()` and `endBlackout()`.
- `getDeviceId()`, `setEmail()`, and `getEmail()` have been removed. Use `setUserIdentifier()` / `getUserIdentifier()` / `clearUserIdentifier()`.
- The `ExtendedReport` / `ExtendedReportCreatedListener` / `setReportFieldsFilter` / `setReportAttachmentsProvider` APIs are replaced by the new `Report` and `ReportHandler` contracts. `createReport(...)` is unchanged; a new `showReportDialog(...)` API has been added for opening the report UI directly.
- The public-field `BugseeAppearance` is replaced by the typed `Appearance` contract with `setColor` and `setString` accessors.

See the [migration guide](/sdk/android/migration) for a complete change-by-change walkthrough.
