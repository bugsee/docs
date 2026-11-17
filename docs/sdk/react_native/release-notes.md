---
title: "Release notes"
description: "Release history for Bugsee React Native SDK 7.x (beta), with the native SDK versions each release is built on."
sidebar_position: 23
slug: "/sdk/react_native/release-notes"
---

:::warning[Beta]
This page documents Bugsee React Native SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/react_native/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/react_native/migration).
:::

Release history for Bugsee React Native SDK 7.x: `@bugsee/react-native` and `@bugsee/react-native-feedback`, which are released together at the same version. Looking for the stable release? See the [6.x release notes](/sdk/react_native/v6/release-notes). Upgrading from 6.x? See the [migration guide](/sdk/react_native/migration).

Each release lists the native SDKs it is built on. Their own changes are in the native SDK release notes: [Android](/sdk/android/release-notes) and [iOS](/sdk/ios/release-notes).

## 7.0.0-beta5 (November 17 2026)

Updates the Bugsee Gradle plugin the package builds against to **4.1.1** (it was 4.0.8). There are no changes to the JavaScript API.

**Changes**

- **Gradle plugin 4.1.1.** The Expo config plugin declares it by default, and the [installation](/sdk/react_native/installation) and [symbolication](/sdk/react_native/symbolication/android) pages use it for bare apps. If you pin the plugin yourself, set `id 'com.bugsee.android.gradle' version '4.1.1' apply false`.
- **The plugin needs the Android Gradle Plugin 8.6 or newer and Gradle 8.7 or newer** (Gradle 9 is supported). On older versions the build fails early with a message that says so. See [Gradle plugin requirements](/sdk/android/gradle-plugin/requirements).
- **Failing the build on an upload error is now possible.** Set `failOnUploadError` in the `bugsee { }` block to fail the build when a mapping, native symbol or build upload does not complete. By default it still only warns.
- **Native symbols** are still uploaded from the unstripped libraries, and an upload that did not change is skipped on the next build.
- **Uploads honour the JVM proxy settings,** secrets such as the app token stay out of build logs, and the plugin falls back to an installed `bugsee-cli` when the download fails.
- `@bugsee/react-native-feedback` requires `@bugsee/react-native` `^7.0.0-beta5`.

**Compatibility**

- Android: Bugsee Android SDK 7.6.0, Bugsee Gradle plugin 4.1.1.
- iOS: Bugsee iOS SDK 7.1.0.
- `@bugsee/cli` 0.7.12.

## 7.0.0-beta4 (November 16 2026)

Built on Bugsee Android SDK 7.6.0 and Bugsee iOS SDK 7.1.0, the first stable iOS SDK a 7.x release is built on. **Shake-to-report and the Android notification-bar trigger are now off by default.**

**Changes**

- **Shake-to-report is off by default on both platforms** (`com.bugsee.option.reporting.triggers.shake`, iOS SDK 7.1.0 and Android SDK 7.6.0). If your app relied on it, turn it on at launch: `options.setCustomOption('com.bugsee.option.reporting.triggers.shake', true)`. See [Bug reporting](/sdk/react_native/manual/bug-reporting#built-in-report-triggers).
- **The Android notification-bar trigger is off by default** (`triggerByNotification`, Android SDK 7.6.0). Set `options.triggerByNotification = true` on an Android options object to keep it.
- **`crashSignals` is available on both platforms.** Both native SDKs now register `com.bugsee.option.capture.crash-signals`, with the same bit values (`ABRT` 1, `SEGV` 2, `BUS` 4, `ILL` 8, `FPE` 16, `TRAP` 32). The accessor moved from the iOS options to the shared options. The default, 128, means every signal when it is the whole value; combined with other bits it is dropped and only the signal bits count. On Android it is read once, when the native crash handler is armed. See [Configuration](/sdk/react_native/configuration#shared-accessors).
- Launch options are synchronized with the option manifests the two native SDKs published for these versions.
- `@bugsee/react-native-feedback` requires `@bugsee/react-native` `^7.0.0-beta4`.

**Also since 7.0.0-beta3**

- Exceptions: `ErrorBoundary` honours `detect.crash`, and a crash after a handled report is kept.
- Spans: status is synced after finish, and open JavaScript spans are cancelled on reload.
- iOS: an active blackout ends on `stop()`, matching Android.
- `deleteCollectedDataOnDevice` exposes `includingFinishedReports`, and iOS resolves with the real outcome.
- Android: a warning at launch when Bugsee's OkHttp interceptor is missing.
- Log, network and breadcrumb filters fail closed on a 9 second deadline, and after a JavaScript reload until the new runtime installs its filter.
- Auto-launch: `attach()` registers the wrapper identity, with an opt-in fail-closed filter hold at process start.
- Breadcrumbs: an opt-in URL scrubber for HTTP breadcrumbs.
- Build tooling: the dSYM token is read from `.xcode.env.local`, `editGradleFiles` supports Kotlin projects, and there is a strip `sourcesContent` option.
- The Expo plugin removes the `com.bugsee.app-token` it wrote earlier when `autoLaunch` is off.

**Compatibility**

- Android: Bugsee Android SDK 7.6.0, Bugsee Gradle plugin 4.0.8.
- iOS: Bugsee iOS SDK 7.1.0.
- `@bugsee/cli` 0.7.12.

## 7.0.0-beta3 (October 20 2026)

Fixes the package's shell scripts, which 7.0.0-beta1 and 7.0.0-beta2 published without the executable bit.

**Fixes**

- **Release builds work without a `chmod`.** `scripts/bugsee-xcode.sh` and `scripts/hermesc-preserve-js.sh` (and the two Node scripts next to them) are now published as executable. Android Release builds on macOS and Linux, and the bundle phase of a bare iOS app, no longer fail with "Permission denied". If you added the `chmod +x` workaround for 7.0.0-beta1 or 7.0.0-beta2, you can remove it after upgrading. The release process now packs with `npm pack` and fails if a file that is executable in the repository is not executable in the package.
- `@bugsee/react-native-feedback` requires `@bugsee/react-native` `^7.0.0-beta3`.

**Compatibility**

- Android: Bugsee Android SDK 7.4.2, Bugsee Gradle plugin 4.0.8.
- iOS: Bugsee iOS SDK 7.0.0-beta7.
- `@bugsee/cli` 0.7.12.

## 7.0.0-beta2 (October 19 2026)

`launch` and `relaunch` take the options object as is.

**Changes**

- **No serialize step.** `Bugsee.launch(token, options)` and `Bugsee.relaunch(options)` accept the object from `createDefaultLaunchOptions()` directly. They still accept the plain map of `com.bugsee.option.*` keys, and `BugseeLaunchOptions.serialize(options)` still returns that map, so code written for `7.0.0-beta1` keeps working. See [Configuration](/sdk/react_native/configuration#two-ways-to-pass-options).

  ```ts
  import Bugsee, { createDefaultLaunchOptions } from '@bugsee/react-native';

  const options = createDefaultLaunchOptions();
  options.captureLogs = true;

  // 7.0.0-beta1: Bugsee.launch(token, BugseeLaunchOptions.serialize(options));
  Bugsee.launch(token, options);
  ```

- **npm tags.** The `latest` and `beta` tags both point at this beta, so a plain `yarn add @bugsee/react-native` installs it. Install with `@beta` to keep following betas once a stable 7.x release exists. See [Installation](/sdk/react_native/installation#1-add-the-package).
- `@bugsee/react-native-feedback` requires `@bugsee/react-native` `^7.0.0-beta2`.

**Known issues**

- The package's shell scripts (`scripts/bugsee-xcode.sh`, `scripts/hermesc-preserve-js.sh`) are published without the executable bit. Android Release builds on macOS and Linux, and the bundle phase of a bare iOS app, fail with "Permission denied" until you run `chmod +x node_modules/@bugsee/react-native/scripts/*.sh`. Fixed in 7.0.0-beta3. See [Symbolication: Android](/sdk/react_native/symbolication/android#1-javascript-source-maps) and [Symbolication: iOS](/sdk/react_native/symbolication/ios#1-the-bundle-phase-javascript-source-maps).

**Compatibility**

- Android: Bugsee Android SDK 7.4.2, Bugsee Gradle plugin 4.0.8.
- iOS: Bugsee iOS SDK 7.0.0-beta7.
- `@bugsee/cli` 0.7.12.

## 7.0.0-beta1 (October 19 2026)

The first public beta of the rewritten React Native SDK. `@bugsee/react-native` replaces `react-native-bugsee` 6.x: it is a new package with a new API, built on the 7.x native SDKs. See [Migrating from 6.x to 7.x](/sdk/react_native/migration).

**Highlights**

- **Requirements**: React Native 0.81 or later with the New Architecture, Hermes, iOS 15.0 or later, Android API 21 or later. See [Overview](/sdk/react_native/overview#requirements).
- **One package with the native SDKs.** Autolinking adds the Android SDK with its NDK and OkHttp modules; on iOS the SDK comes through the package's `Package.swift` (React Native 0.87 and later) or its podspec. See [Installation](/sdk/react_native/installation).
- **One options namespace.** Both platforms read the same `com.bugsee.option.*` keys, set through `createDefaultLaunchOptions()` or a plain map. In this beta, `launch` and `relaunch` take the plain map, so an options object is passed as `BugseeLaunchOptions.serialize(options)`. See [Configuration](/sdk/react_native/configuration).
- **Lifecycle**: `launch` and `relaunch` resolve to whether the SDK started, `attach()` for Android auto-launch, `getStatus()`, `onStatusChange()` and `onLifecycleEvent()` with named events. See [Lifecycle & status](/sdk/react_native/lifecycle).
- **Crash and error reporting**: uncaught JavaScript errors, unhandled promise rejections, uncaught render errors through `Bugsee.wrap(App)`, native crashes, `logException(error, { domain })`, `logUnhandledException()` and `<ErrorBoundary>`. See [Crash & error reporting](/sdk/react_native/manual/crash-error-reporting).
- **Reports**: `showReportDialog()`, `upload()`, `createReport()` and a [report handler](/sdk/react_native/report-handler) that reads and changes reports and adds attachments.
- **Data capture**: console logs with a native-side filter, network events with a filter and `addNetworkEvent()`, [breadcrumbs](/sdk/react_native/breadcrumbs), custom events and traces, attributes and a user identifier.
- **Privacy**: `<BugseeSecure>`, `setSecureRectangles()`, blackout, and filters for logs, network events and breadcrumbs. See [Privacy](/sdk/react_native/privacy/overview).
- **Performance monitoring**: transactions and spans from JavaScript. See [Performance monitoring](/sdk/react_native/performance).
- **Notification relay**: `notify()`. See [Notification relay](/sdk/react_native/notification-relay).
- **Appearance**: one camelCase surface for the report UI colors. See [Appearance](/sdk/react_native/appearance).
- **Feedback** in its own package, `@bugsee/react-native-feedback`. See [Feedback](/sdk/react_native/feedback).
- **Expo config plugin** for prebuild: the Bugsee Gradle plugin, the source-map hooks, the dSYM post-action, Android auto-launch and a custom endpoint. See [Expo](/sdk/react_native/expo).
- **Symbolication**: JavaScript source maps matched by debug ID, the Android R8 mapping and native symbols through the Bugsee Gradle plugin, and iOS dSYMs, optionally with React Native's own. See [Symbolication](/sdk/react_native/symbolication/overview).

**Known issues**

- The package's shell scripts (`scripts/bugsee-xcode.sh`, `scripts/hermesc-preserve-js.sh`) are published without the executable bit. Android Release builds on macOS and Linux, and the bundle phase of a bare iOS app, fail with "Permission denied" until you run `chmod +x node_modules/@bugsee/react-native/scripts/*.sh`. Fixed in 7.0.0-beta3. See [Symbolication: Android](/sdk/react_native/symbolication/android#1-javascript-source-maps) and [Symbolication: iOS](/sdk/react_native/symbolication/ios#1-the-bundle-phase-javascript-source-maps).

**Compatibility**

- Android: Bugsee Android SDK 7.4.2, Bugsee Gradle plugin 4.0.8.
- iOS: Bugsee iOS SDK 7.0.0-beta7, itself a beta.
- `@bugsee/cli` 0.7.12.
