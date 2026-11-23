---
title: "Release notes"
description: "Release history for Bugsee Unity SDK 7.x (beta), with the native SDK versions each release is built on."
sidebar_position: 23
slug: "/sdk/unity/release-notes"
---

:::warning[Beta]
This page documents Bugsee Unity SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/unity/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/unity/migration).
:::

Release history for Bugsee Unity SDK 7.x, the package `com.bugsee.unity`. Looking for the stable release? See the [6.x release notes](/sdk/unity/v6/release-notes). Upgrading from 6.x? See the [migration guide](/sdk/unity/migration).

Each release lists the native SDKs it is built on. Their own changes are in the native SDK release notes: [Android](/sdk/android/release-notes) and [iOS](/sdk/ios/release-notes).

## 7.0.0-beta.1 (November 23, 2026)

The first beta of the 7.x line, which continues the sequence from 6.x. It is a new package with a new C# API, built on Bugsee Android SDK 7.6.0 and Bugsee iOS SDK 7.1.0. It is a beta: it can contain rough edges, and the API can change in later betas.

**Highlights**

- **A new package and a new C# API.** You install `com.bugsee.unity` from a git tag with the Unity Package Manager, and you call the static class `Bugsee` (namespace `Bugsee`). See [Installation](/sdk/unity/installation).
- **Typed launch options** for Android and iOS, `AndroidLaunchOptions` and `IOSLaunchOptions`, with the same keys the native SDKs read. See [Configuration](/sdk/unity/configuration).
- **iOS Crash Report Extension** (Xcode 27 and later) and opt-in **iOS native early launch**. See [Crash Report Extension](/sdk/unity/issue-detection/crash-report-extension).
- **Symbol upload from the build** for Android and iOS. See [Symbolication](/sdk/unity/symbolication/overview).

**Breaking changes**

The [migration guide](/sdk/unity/migration) lists every change from 6.x, with the old and the new code. These are the main ones.

- **New package, new API.** The `.unitypackage` and the `Assets/Plugins/Bugsee` files, the `BugseeLauncher` component and the namespace `BugseePlugin` are replaced by the git package and the namespace `Bugsee`. Remove the 6.x plugin files and the old AAR, and port your calls.
- **Shake-to-report and the Android notification-bar trigger are off by default** (iOS SDK 7.1.0 and Android SDK 7.6.0). Set `ReportingTriggerByShake = true` (both platforms) and `AndroidLaunchOptions.ReportingTriggerByNotification = true` (Android) to turn them on.
- **`ShowReportDialog` and `Upload` take `IssueSeverity? severity = null`.** `null` uses the `ReportingDefaultBugPriority` option. They used to always send High.
- **Attribute values read back as `long` and `double` on Android**, as on iOS: `GetAttribute`, `GetAllAttributes` and `IReport.GetAttribute`. Replace `(int)` unboxing with `Convert.ToInt32` or a cast to `long`.
- **There is no typed `Debug` or `Endpoint` launch option.** Set an endpoint with `SetCustomOption("com.bugsee.option.$$ENDPOINT", url)`.
- **The iOS key `BugseeEnableMachExceptions` is not supported.** Use `IOSLaunchOptions.CrashHandlerType`.
- **The client signature of managed exceptions changed**, so existing issues can regroup after the update.
- **If your CI sets `BUGSEE_BUILD_UUID`,** the Android mapping upload is now keyed by the build id the built app carries. The variable applies only when the app has none and the value is a UUID.
- **An iOS export on Xcode 27 or later can add a `BugseeCrashReport` extension target** and an App Group entitlement. Set `BUGSEE_IOS_CRASH_EXTENSION=0` to keep the export as before.

**Added**

- **`DeleteScope` and `DeleteCollectedDataOnDeviceAsync`.** `Bugsee.DeleteCollectedDataOnDeviceAsync(DeleteScope scope = DeleteScope.Everything)` returns a `Task<bool>`, and `DeleteCollectedDataOnDevice(DeleteScope scope)` is the fire-and-forget form: it returns before the data is deleted and has no result, and a failure is only logged. Use `DeleteCollectedDataOnDeviceAsync` when you need to know that the delete finished. On Android, `DeleteCollectedDataOnDevice()` also deletes finished reports that were not uploaded yet, and stops the SDK first. Use `DeleteScope.CaptureAndIntermediate` to keep them. See [Lifecycle & status](/sdk/unity/lifecycle#delete-collected-data).
- **`IReport.Severity` is `IssueSeverity?`.** `null` is unset.
- **Typed options.** Android options such as `MaxDataSize` and iOS options such as `CrashSignals`, `CaptureOnDeviceSymbolication`, `CrashSwiftAsyncStackTraces`, `CrashFillEmptyExceptionStacks` and `CaptureWebSocket` have typed properties and `Options` constants. They were reachable only through `SetCustomOption`.
- **`CaptureUnobservedTaskExceptions`.** A Unity-only option, `true` by default, that needs `CaptureManagedExceptions`. Set it to `false` to stop reporting `TaskScheduler.UnobservedTaskException` as a handled error.
- **`Bugsee.ApplyDefaultNetworkSanitizer`** runs the SDK's built-in network redaction on an event, on Android and now on iOS (it returns `false` in the Editor). Call it first in a network filter to keep the redaction. See [Network events](/sdk/unity/network).
- **iOS native early launch** (opt-in, off by default). With `BUGSEE_IOS_EARLY_LAUNCH=1` and `BUGSEE_IOS_APP_TOKEN`, or **Bugsee > iOS > Early Launch**, the iOS SDK starts at app launch, before Unity's first scene, and the first `Bugsee.Launch` adopts that session. The SDK then starts before any C# consent check. See [Lifecycle & status](/sdk/unity/lifecycle#ios-early-launch).
- **iOS Crash Report Extension.** On Xcode 27 and later the iOS export adds a `BugseeCrashReport` extension target, so that devices on iOS 27 and later report foreground (crash) and background (non-fatal) out-of-memory kills and exits. See [Crash Report Extension](/sdk/unity/issue-detection/crash-report-extension).
- **Built-in module declarations.** The package declares the Unity modules `com.unity.modules.androidjni`, `jsonserialize` and `ui`. Without them, a project that had those modules disabled failed to compile. `com.unity.modules.screencapture` stays optional.

**Changed**

- **`CrashSignals` reaches Android.** It is a shared launch option with a typed property. Before, the iOS key was reachable only through `SetCustomOption` and was not sent to Android. On Android it is read by the NDK module. A mask meant only for iOS, such as `CrashSignals.None`, also narrows or switches off native signal capture on Android when the NDK module is present, for example when iOS and Android share one options object. Leave it out of the Android options to keep every signal. See [Configuration](/sdk/unity/configuration#crashsignals).
- **Native SDKs moved to Android SDK 7.6.0 and iOS SDK 7.1.0.** Their option defaults changed: see the shake and notification-bar item under Breaking changes.
- **Feedback is opt-in and works when on.** Add the scripting define `BUGSEE_FEEDBACK` (or set the environment variable `BUGSEE_FEEDBACK=1` for the export) to link the feedback add-on. See [Feedback](/sdk/unity/feedback).
- **Android symbols.** The Editor's upload of Unity's `symbols.zip` now gives `libunity.so`, `libil2cpp.so` and `libmain.so` the unwind tables that Unity strips from that copy, taken from the same-build-id libraries in the built APK or AAB.
- **Option constants.** The package's tests check the `Options` constants against the option manifests that the native SDKs publish.
- **`Relaunch` and `RelaunchAsync` replace the whole option set** on both platforms. Pass the full set again. See [Lifecycle & status](/sdk/unity/lifecycle).
- **Breadcrumbs and log lines.** `CaptureBreadcrumbs` is off by default on both native SDKs, so `Bugsee.AddBreadcrumb` records nothing until you set it. `Bugsee.Log(message, level)` lines skip the log filter on both platforms.
- **`ResetVideoCapturePermission()` on iOS** logs a warning once, because iOS has no capture permission to reset.
- **`Bugsee.SetAttribute` in the Editor and on unsupported platforms** applies the same validation as on a device and throws `ArgumentException` for an invalid key or value. It still stores nothing.
- **The iOS Simulator.** The SDK logs a warning once at the first launch on the iOS or tvOS Simulator: its build has no crash reporter, so crashes, hangs and managed exceptions are reported only from a device.
- **`Bugsee.IsBlackout` on iOS** reads the state from the iOS SDK.

**Fixed**

- The Android Mono Portable PDB upload fetches `bugsee-cli` 0.9.0 when the installed CLI is older. Before, a machine with CLI 0.8.1 or 0.8.2 got a warning and no mapping, and managed frames stayed IL offsets.
- iOS: `xcodebuild` of an export with `BUGSEE_APP_TOKEN` and the Crash Report Extension on no longer fails with `Cycle inside Unity-iPhone`.
- iOS: an Append export no longer lists the Run Script phase twice after the IL2CPP arguments change.
- iOS: the symbol upload Run Script no longer passes an empty `--version` or `--build` when the export has no `MARKETING_VERSION` or `CURRENT_PROJECT_VERSION`. The values come from `BUGSEE_VERSION` and `BUGSEE_BUILD`, then from the built app.
- Android, Export Project: `assembleRelease` no longer fails in `:unityLibrary:buildIl2Cpp` on Unity 6 and 2021.3 because of the IL2CPP line map arguments.
- Android, Unity 6: a Minify build no longer stops in `:launcher:minifyReleaseWithR8` with a missing class such as `android.telephony.satellite.SatelliteManager`.
- Android: native (NDK) crash capture is set up on a Unity 6 build with AGP 9.0.0.
- Android, Windows: a build output under a path over 260 characters no longer breaks the symbol upload's reads or uploads a mapping under a wrong build id.
- The Bugsee Editor assembly compiles in an Editor without iOS Build Support.
- The build-output scans no longer stop at one bad folder or hide it silently.
- iOS: `BUGSEE_NO_SYMBOL_UPLOAD` also turns off the IL2CPP line map upload, as it does for the R8 mapping and native symbol uploads. Before, the line map upload ran when a token was set even with the switch set.
- The symbol upload also sends the native libraries that Unity's `symbols.zip` does not hold, when they are the build's own and still carry symbols.
- The client signature of a managed exception no longer depends on the Java call site on Android, and is the same recipe on both platforms.
- `Bugsee.Trace` with a map, list or array records the same JSON on both platforms (at most 8192 UTF-16 units). On Android, maps, lists and arrays you pass to the SDK are sent as JSON text and not as their type name.
- `AddAttachmentFile` on a report from `CreateReport` copies the file under the app's cache directory, not `/data/local/tmp`, which some Android 11 devices do not let the app write.
- Values that cross to native or become identifiers no longer follow the device's culture: a device with a decimal comma wrote `1,5`, and a bool was `"True"`.
- iOS: lifecycle events that arrive before the managed callback is registered are held (up to 128) and replayed in order after the registering `Launch` or `Relaunch` call, as on Android. A lifecycle payload that is a dictionary reaches your listener as a `Dictionary<string, object>`.
- Managed exceptions the SDK reports from Unity's log text no longer forward a hex value found in that text as a frame address.

**Known issues**

- Handled managed exceptions in a Release IL2CPP build on Android without IL2CPP line information stay unsymbolicated (no file and line) when the symbols are Public (symbol table only). Use Debugging symbols plus the IL2CPP line map. Development builds send no addresses on Android, and Debugging symbols do not change that. See [Symbolication: Android](/sdk/unity/symbolication/android#public-and-debugging-symbols).
- Switching the symbol level from Public to Debugging for the same `libil2cpp.so` build id may leave frames raw on the dashboard. This is open and under investigation ([issue 263](https://github.com/bugsee/bugsee-unity/issues/263)).
- After an iOS launch that ended before the app became active, the next launch may block the main thread for up to about 8 seconds while the crash report uploads. The fix is in the native iOS SDK and is not released yet. Normal Unity launches do not hit it, because the SDK starts while the app is active. The opt-in iOS native early launch starts the SDK at app launch, before the app is active, so an app that uses it can hit this.

**Compatibility**

- Unity 2021.3 or later. iOS 15.0 or later, Android API 21 or later.
- Android: Bugsee Android SDK 7.6.0 (with `bugsee-android-ndk` 7.6.0), Bugsee Gradle plugin 4.1.1.
- iOS: Bugsee iOS SDK 7.1.0.
- `bugsee-cli` 0.9.0.

## Earlier releases

The 6.x release history is in the [6.x release notes](/sdk/unity/v6/release-notes).
