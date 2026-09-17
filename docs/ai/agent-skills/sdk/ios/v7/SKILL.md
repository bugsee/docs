---
title: "Bugsee iOS SDK 7.x (Beta)"
name: bugsee-ios-sdk-7x
description: Full Bugsee 7.x (beta) setup for iOS. Use when the user explicitly asks for Bugsee iOS 7.x / beta, or wants the next-gen features (breadcrumbs, blackout, notification relay, extensions, tvOS/visionOS). For stable production setup, use the 6.x skill instead.
sidebar_label: "iOS (7.x Beta)"
sidebar_position: 3
slug: "/ai/agent-skills/sdk/ios/v7/SKILL"
license: proprietary
category: sdk-setup
---

# Bugsee iOS SDK 7.x (Beta)

Opinionated wizard that scans an iOS project and either wires up Bugsee 7.x from scratch or migrates an existing 6.x integration — core SDK via Swift Package Manager, the separate Feedback package, breadcrumbs, blackout, and the new option-key family.

> **Beta.** 7.x is in beta — option keys and APIs may still change. Use this skill when the user asks for 7.x, or needs breadcrumbs, blackout, notification relay, the extension registry, or tvOS / visionOS support.

## Invoke This Skill When

- User explicitly says "Bugsee 7.x", "beta", or "next-gen Bugsee" for iOS.
- User mentions **breadcrumbs** (`Bugsee.addBreadcrumb`, `setBreadcrumbFilter`, `getExchangeFactory`).
- User mentions **blackout** (`startBlackout`, `endBlackout`, `isBlackout`).
- User mentions **notification relay** (`Bugsee.notify`).
- User mentions the **extension registry** (`Bugsee.registerExt`, `Bugsee.ext`) or the separate **`BugseeFeedback`** package.
- User mentions the `BugseeOption*` key family, `setUserIdentifier`, `showReportDialog`, `addSecureView`, or `addSecureRectangle`.
- User needs **tvOS** or **visionOS** support (7.x only).

For generic "add Bugsee to iOS" / "set up bug reporting" with no 7.x signal, switch to the 6.x skill.

> **Always verify against** [docs.bugsee.com/sdk/ios/v7/installation/](https://docs.bugsee.com/sdk/ios/v7/installation/) before implementing. 7.x docs live under `/sdk/ios/v7/`; `/sdk/ios/` is the stable 6.x tree.

---

## Phase 1: Detect

```bash
# Xcode project / workspace
ls *.xcodeproj *.xcworkspace 2>/dev/null

# Swift vs Objective-C
find . -name "*.swift" -not -path "*/Pods/*" -not -path "*/.build/*" 2>/dev/null | head -5
find . -name "*.m" -not -path "*/Pods/*" 2>/dev/null | head -5

# Dependency manager — 7.x ships via SPM
ls Podfile Package.swift Cartfile 2>/dev/null

# Existing Bugsee install (and which major version)
grep -ri bugsee Podfile Package.swift Package.resolved Cartfile 2>/dev/null | head -10

# Deployment target — 7.x requires iOS 13+
grep -r "IPHONEOS_DEPLOYMENT_TARGET" *.xcodeproj/project.pbxproj 2>/dev/null | sort -u | head -5

# Entry point
find . -name "AppDelegate.swift" -o -name "AppDelegate.m" 2>/dev/null | head -3
grep -r "@main" --include="*.swift" 2>/dev/null | head -3

# 6.x call sites that will not compile against 7.x
grep -rnE "showReportController|showFeedbackController|setDefaultFeedbackGreeting|didReceiveNewFeedback|setView:.*asHidden|setView\(.*asHidden|addSecureRect\b|removeSecureRect\b|removeAllSecureRects|getAllSecureRects|isViewHidden|registerEvent|traceKey|registerNetworkEvent|removeNetworkEventFilter|setEmail|getEmail|clearEmail|getDeviceId|logAssert|hideKeyboard|testExceptionCrash|testSignalCrash|setDefaultCrashPriority|setDefaultErrorPriority|setDefaultBugPriority|Bugsee\.pause|Bugsee\.resume|\[Bugsee pause\]|\[Bugsee resume\]" \
  --include="*.swift" --include="*.m" --include="*.mm" . 2>/dev/null | grep -v "/Pods/" | head -40

# Raw option-key strings — the ONLY silent break in 7.x
grep -rnE '"(BugseeAppLaunchCrashDetectionKey|BugseeDefaultBugPriority|BugseeDefaultCrashPriority|BugseeDefaultErrorPriority|BugseeEnableMachExceptions|BugseeEnableOnDeviceSymbolication|BugseeKillDetectionKey|BugseeReportPrioritySelector|BugseeStyle|BuildTarget|BuildType|CaptureAVPlayer|CaptureLogs|CaptureOSLogs|CaptureVideoAdaptive|CrashReport|DataEncryption|DetectAppExit|FrameRate|MaxDataSize|MaxFrameRate|MaxRecordingTime|MinFrameRate|MonitorBluetoothStatus|MonitorDiskSpace|MonitorNetwork|MonitorWebSocket|PerformanceAdaptiveSampling|PerformanceMonitoring|PerformanceSampleRate|ReportDescriptionRequired|ReportEmailRequired|ReportLabelsEnabled|ReportLabelsRequired|ReportSummaryRequired|SanitizeNetworkData|ScreenshotEnabled|ScreenshotToReport|ShakeToReport|StatusBarInfo|VideoEnabled|VideoScale|ViewHierarchyEnabled|WifiOnlyUpload|bodySizeLimit)"' \
  --include="*.swift" --include="*.m" --include="*.mm" . 2>/dev/null | grep -v "/Pods/" | head -20
```

| Question | Impact |
|----------|--------|
| Deployment target below iOS 13? | Raise it — 7.x will not link otherwise |
| `Podfile` / `Cartfile` only? | 7.x ships via SPM; the project needs an SPM dependency added |
| Existing Bugsee 6.x found? | This is a migration, not a fresh install — go to Phase 2b after Phase 2 |
| Raw option-key strings found? | **Fix these first** — they fail silently, with no compiler error |
| Feedback call sites found? | Feedback needs the separate `BugseeFeedback` package |
| Swift files found? | Show Swift init code |
| Objective-C files found? | Show Objective-C init code |
| SwiftUI `@main` lifecycle? | See [SwiftUI docs](https://docs.bugsee.com/sdk/ios/swiftui/) |

> **Swift-only rename to watch for.** 6.x misspelled one Swift label: `Bugsee.logUnhandledException(exception:comlletion:)`. In 7.x it is `logUnhandledException(exception:completion:)`. Objective-C callers are unaffected, and the grep above will not catch it — check Swift call sites of `logUnhandledException` by hand.

---

## Phase 2: Install

7.x is distributed through Swift Package Manager, from the same repository the stable line uses:

```
https://github.com/bugsee/spm
```

Which file you edit depends on how the project is laid out.

**`Package.swift` exists** — edit it directly. Add the dependency and wire the product into the target:

```swift
dependencies: [
    .package(url: "https://github.com/bugsee/spm", exact: "7.x"),
],
targets: [
    .target(
        name: "YourApp",
        dependencies: [
            // Package identity is "spm" — the last path component of the URL, not "bugsee".
            .product(name: "Bugsee", package: "spm"),
        ]
    ),
]
```

`exact:` is mandatory. SwiftPM excludes pre-release versions from version ranges, so `from:` silently fails to resolve a 7.x beta. The target must also declare `platforms: [.iOS(.v13)]` or resolution fails.

**`.xcodeproj` with no package manifest** — the reference lives in `<project>.xcodeproj/project.pbxproj` as an `XCRemoteSwiftPackageReference` plus an `XCSwiftPackageProductDependency` wired into the target's `packageProductDependencies`. Hand-editing that file corrupts projects. Do not attempt it: ask the user to add the package once through Xcode (**File → Add Package Dependencies…**, the URL above, dependency rule **Exact Version**), then continue from Phase 3. Confirm it landed before moving on:

```bash
grep -c "XCRemoteSwiftPackageReference" *.xcodeproj/project.pbxproj
grep -rn "bugsee/spm" *.xcodeproj/project.pbxproj *.xcworkspace/xcshareddata/swiftpm/Package.resolved 2>/dev/null | head
```

> **Do not guess the version.** Ask the user which 7.x version to pin. If an existing `Package.swift` or `Package.resolved` already references `bugsee/spm`, change the rule in place rather than adding a second dependency on the same repository.

Requirements: iOS 13+, tvOS 13+, visionOS 1+.

### Optional: in-app feedback

Feedback is no longer in the core framework. It ships as a separate Swift package, `BugseeFeedback`, published alongside the beta. Add it only if the app uses in-app feedback / chat.

---

## Phase 2b: Migrate 6.x call sites

Skip this phase for a fresh install. Run it whenever Phase 1 found existing Bugsee 6.x code.

Work in this order — it is not arbitrary:

1. **Replace hard-coded option strings first.** This is the only change that produces no
   build error. `@"ShakeToReport"` and the rest still compile and still run in 7.x, and
   Bugsee ignores them and uses its defaults. Swap each one for the constant in the
   [option tables](https://docs.bugsee.com/sdk/ios/v7/migration/#2-option-keys) — grouped
   by area as `BugseeOptionDetect*`, `BugseeOptionCapture*`, `BugseeOptionReporting*`,
   `BugseeOptionConfig*` and `BugseeOptionPerformance*`.
2. **Build.** Everything below surfaces as a compiler error, so let the build drive the
   rest.
3. **Apply the renames** in the table below.
4. **Rewire feedback** if the app uses it — see *Optional: in-app feedback* above.
5. **Re-check `pause` / `resume` by hand.** `startBlackout` / `endBlackout` is the closest
   match but is narrower: it suppresses only what describes the screen, while logs, network
   events and traces keep being recorded. If the app used `pause` to stop *all* capture,
   `[Bugsee stop:]` is the honest replacement.

Raising the deployment target to iOS 13 is a prerequisite for all of the above.


**Renamed.** A plain search and replace does most of these.

| 6.x | 7.x |
| --- | --- |
| `Bugsee.appearance()` | `Bugsee.getAppearance()` |
| `Bugsee.activeSpan()` | `Bugsee.getActiveSpan()` |
| `registerEvent:` | `event:` |
| `registerEvent:withParams:` | `event:params:` (params now optional) |
| `traceKey:withValue:` | `trace:value:` |
| `registerNetworkEvent:` | `addNetworkEvent:` |
| `registerNetworkEvent:needsToBeFiltered:` | `addNetworkEvent:requiresFiltering:` |
| `removeNetworkEventFilter` | `setNetworkEventFilter:nil` |
| `showReportController*` | `showReportDialog*` |
| `setView:asHidden:` | `addSecureView:` / `removeSecureView:` |
| `addSecureRect:` | `addSecureRectangle:` |
| `removeSecureRect:` | `removeSecureRectangle:` |
| `removeAllSecureRects` | `removeAllSecureRectangles` |
| `getAllSecureRects` | `getAllSecureRectangles` |
| `setEmail:` / `getEmail` / `clearEmail` | `setUserIdentifier:` / `getUserIdentifier` / `clearUserIdentifier` |
| `clearAllAttribute` | `clearAllAttributes` |
| `testExceptionCrash` / `testSignalCrash` | `testCrash` |
| `deleteCollectedDataOnDevice:` | `deleteCollectedDataOnDevice:completion:` |
| `uploadWithSummary:…:includeVideo:` | `uploadWithSummary:description:severity:labels:` |
| `logError:labels:includeVideo:` | `logError:labels:` |
| Swift `Bugsee.launch(token:options:)` _(dictionary)_ | Swift `Bugsee.launch(token:dictionaryOptions:)` |
| Swift `Bugsee.relaunch(options:)` _(dictionary)_ | Swift `Bugsee.relaunch(dictionaryOptions:)` |
| Swift `Bugsee.uploadReport(_:)` | Swift `Bugsee.upload(_:)` |
| `showFeedbackController` | `[BugseeFeedback.shared showFeedbackUI]` |
| `setDefaultFeedbackGreeting:` | `[BugseeFeedback.shared setGreeting:]` |
| `bugsee:didReceiveNewFeedback:` | `BugseeFeedbackListener` |

**Removed with no direct replacement.**

| 6.x | Notes |
| --- | --- |
| `pause` / `resume` | Closest is `startBlackout` / `endBlackout`, which is narrower — see [§3.2](https://docs.bugsee.com/sdk/ios/v7/migration/) |
| `getDeviceId` | — |
| `accessToken` | — |
| `isViewHidden:` | — |
| `hideKeyboard:` | — |
| `setInternalSecureRectangles:` | — |
| `logAssert:withLocation:` | Use `logException:reason:options:completion:` |
| `log:level:timestamp:` | `log:level:enforceFiltering:` takes the slot but does something different — it opts the message into the log filter |
| `setDefaultCrashPriority:` | `BugseeOptionReportingDefaultCrashPriority` at launch |
| `setDefaultErrorPriority:` | `BugseeOptionReportingDefaultErrorPriority` at launch |
| `setDefaultBugPriority:` | `BugseeOptionReportingDefaultBugPriority` at launch |
| `BugseeAttachmentOverrideLabels` | — |
| `BugseeOptions.captureVideoAdaptive` | `BugseeOptionCaptureVideoAdaptive` key |


Full detail, with before/after code for each: [migration guide](https://docs.bugsee.com/sdk/ios/v7/migration/).

---

## Phase 3: Initialize

**Swift:**

```swift
import Bugsee

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // ...other initialization code

    Bugsee.launch(token: "<your_app_token>")

    return true
}
```

**Objective-C:**

```objectivec
@import Bugsee;

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // ...other initialization code

    [Bugsee launchWithToken:@"<your_app_token>"];

    return YES;
}
```

> Replace `<your_app_token>` with the token from the Bugsee dashboard.

> Simulator slices are built without the native crash reporter. Run on a real device to exercise crash capture.

Capture is brought up off the main thread, so `launch` returns before the SDK is fully running. Use the `started:` completion block, or observe `Bugsee.sharedInstance()?.status` against `BugseeStatusLaunched`.

### Feedback wiring (only if `BugseeFeedback` was added)

**Swift:**

```swift
import BugseeFeedback

BugseeFeedback.register()          // optional; the package also registers itself on load
Bugsee.launch(token: "<your_app_token>")

// Present the chat
BugseeFeedback.shared.showFeedbackUI()
```

**Objective-C:**

```objectivec
@import BugseeFeedback;

[BugseeFeedback register];         // optional; the package also registers itself on load
[Bugsee launchWithToken:@"<your_app_token>"];

[BugseeFeedback.shared showFeedbackUI];
```

---

## Phase 4: Configure (Optional)

Options are passed as a `BugseeOptions` object, as a dictionary keyed by the `BugseeOption*` constants, or both.

**Swift:**

```swift
let options = BugseeOptions.defaultOptions()
options.shakeToReport = true
options.maxRecordingTime = 60

// Options with no BugseeOptions property are set by key:
options.updateLaunchOptions([
    BugseeOptionCaptureBreadcrumbs: true,
    BugseeOptionDetectAndReportHang: true,
])

Bugsee.launch(token: "<your_app_token>", options: options)
```

**Objective-C:**

```objectivec
BugseeOptions *options = [BugseeOptions defaultOptions];
options.shakeToReport = YES;
options.maxRecordingTime = 60;

[options updateLaunchOptions:@{
    BugseeOptionCaptureBreadcrumbs  : @YES,
    BugseeOptionDetectAndReportHang : @YES,
}];

[Bugsee launchWithToken:@"<your_app_token>" options:options];
```

> **Never pass raw option strings.** `@"ShakeToReport"` and friends resolved in 6.x and are ignored in 7.x, with no warning and no crash. Always use the constants.

Commonly used option keys:

| Key | Default | Description |
|-----|---------|-------------|
| `BugseeOptionCaptureVideo` | `YES` | Video recording. |
| `BugseeOptionCaptureLogs` | `YES` | Console log capture. |
| `BugseeOptionCaptureNetwork` | `YES` | Network traffic capture. |
| `BugseeOptionCaptureBreadcrumbs` | `NO` | Automatic breadcrumb collection (new in 7.x). |
| `BugseeOptionDetectAndReportCrash` | `YES` | Crash capture. |
| `BugseeOptionReportingTriggerByShake` | `YES` | Shake-to-report gesture. Was `NO` in 6.x. |
| `BugseeOptionReportingTriggerByScreenshot` | `NO` | Screenshot-to-report trigger. Was `YES` in 6.x. |
| `BugseeOptionConfigDuration` | `60` | Max recording duration, seconds. |
| `BugseeOptionConfigWifiOnlyUpload` | `NO` | Restrict uploads to Wi-Fi. |
| `BugseeOptionPerformanceMonitoring` | `YES` | APM master switch. |

Full list: [configuration](https://docs.bugsee.com/sdk/ios/configuration/) · [option keys](https://docs.bugsee.com/sdk/ios/v7/migration#2-option-keys).

### New 7.x APIs worth wiring

```swift
// Suppress everything that describes the screen during a sensitive flow.
// Logs, network events and traces keep being captured.
Bugsee.startBlackout()
Bugsee.endBlackout()

// Identify the user (replaces 6.x setEmail).
Bugsee.setUserIdentifier("user@example.com")

// Custom breadcrumb.
let crumb = Bugsee.getExchangeFactory().createBreadcrumb()
crumb.category = "checkout"
crumb.message  = "Coupon applied"
crumb.type     = "user"
Bugsee.addBreadcrumb(crumb)

// Lightweight notification straight to the messaging integrations —
// no video, logs or events attached.
Bugsee.notify(title: "Checkout failed", body: "Provider returned 502")
```

> A network filter does **not** reach breadcrumbs. If `setNetworkEventFilter` drops or rewrites a URL, repeat the rule in `setBreadcrumbFilter` or it will still appear in the breadcrumb trail.

---

## Verification

Build and run on a real device. Trigger a report end to end:

```swift
// Programmatic trigger
Bugsee.showReportDialog()

// Or test crash capture (remove after verifying)
Bugsee.testCrash()

// Or a logged error
Bugsee.logError(error: NSError(domain: "smoke", code: 1))
```

Check the Bugsee dashboard for the incoming report. If breadcrumbs are enabled, navigate a few screens first and confirm the trail appears on the report.

---

## Documentation Links

- [Installation (7.x)](https://docs.bugsee.com/sdk/ios/v7/installation/)
- [Migration from 6.x](https://docs.bugsee.com/sdk/ios/v7/migration/)
- [Configuration](https://docs.bugsee.com/sdk/ios/configuration/)
- [SwiftUI](https://docs.bugsee.com/sdk/ios/swiftui/)
- [Privacy](https://docs.bugsee.com/sdk/ios/privacy/overview/)
- [Crash symbolication](https://docs.bugsee.com/sdk/ios/symbolication/)
- [Manual invocation](https://docs.bugsee.com/sdk/ios/manual/)
