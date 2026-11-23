---
title: "Build environment variables"
description: "Every environment variable and Unity Editor setting the Bugsee Unity SDK 7.x package reads at build time, with its default, platform and effect."
sidebar_position: 5
slug: "/sdk/unity/symbolication/environment-variables"
---

:::warning[Beta]
This page documents Bugsee Unity SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/unity/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/unity/migration).
:::

The package reads these variables in the Unity Editor and in the Xcode Run Script, not in the player. The Runtime code reads none of them. Set them in the environment of the process that does the work: the Unity Editor or its batch-mode command line for the Editor variables, and Xcode or `xcodebuild` for the iOS Run Script variables.

A "flag" below means the variable counts as set when it exists in the environment with any value. Unless a row says otherwise, you do not need to set a value.

A Unity Editor started from the Hub or the Finder does not inherit your shell's environment. Start it from a terminal that has the variables, or set them in your CI job.

## Symbol upload

| Variable | Platform | Default | What it does |
| --- | --- | --- | --- |
| `BUGSEE_APP_TOKEN` | Android, iOS | Unset | Turns the symbol upload on. The Editor uses it after an Android build. The iOS Run Script reads it from the Xcode environment. In an Export Project, the Gradle plugin reads it from the Gradle build's environment. |
| `BUGSEE_NO_SYMBOL_UPLOAD` | Android, iOS | Unset | Flag. Turns every symbol upload off, including the Run Script's and the Gradle plugin's in an exported project, even with a token. |
| `BUGSEE_ENDPOINT` | Android, iOS | The CLI's own default, `https://api.bugsee.com` | The Bugsee API endpoint that `bugsee-cli` uploads to. The Editor passes it to the CLI. The Gradle plugin of an exported project reads it too. |
| `BUGSEE_VERSION` | Android, iOS | Player Settings **Version** on Android; the built app's `Info.plist` on iOS | The app version the upload carries. On iOS, the Run Script reads it from the Xcode environment. |
| `BUGSEE_BUILD` | Android, iOS | The Android version code; the iOS build number, else a UTC timestamp (`yyyyMMddHHmmss`) from the Editor; the built app's `Info.plist` for the Run Script | The build number the upload carries. On iOS, the Run Script reads it from the Xcode environment. |
| `BUGSEE_BUILD_UUID` | Android | Unset | The build id of the app. For the R8 mapping it is used only when the built app has no `bugsee_build_id.properties` and the value is a UUID. Any non-empty value keys the native symbols upload. It never overrides the id the app carries. |
| `BUGSEE_NO_TOKEN_CHECK` | Android, iOS | Unset | Flag. Records no token fingerprint in the build, so `Bugsee.Launch` never warns about a different token. On iOS, set it in the Xcode environment. See [the build token and the launch token](/sdk/unity/symbolication/overview#the-build-token-and-the-launch-token). |

## Bugsee CLI

| Variable | Platform | Default | What it does |
| --- | --- | --- | --- |
| `BUGSEE_CLI_PATH` | Android, iOS | Unset | The `bugsee-cli` binary to use, as a path or a command name on `PATH`. The Editor, the iOS Run Script and the Gradle plugin of an exported project all read it. The Editor warns when the CLI at a path it names is older than 0.8.1. It does not warn for a bare command name. |
| `BUGSEE_CLI_VERSION` | Android, iOS | The default CLI version the package downloads (see the release notes) | The CLI release to download. A leading `v` is ignored. A value that is not a release version, or is older than 0.8.1, is ignored with a warning. For the Mono step, a value below 0.9.0 is ignored. The Run Script looks for this release in the cache first. |
| `BUGSEE_NO_CLI_DOWNLOAD` | Android | Unset | Flag. The Editor does not download a CLI. Without a token the Editor never downloads. |
| `BUGSEE_CLI_BASE_URL` | Android | `https://download.bugsee.com/cli` | A mirror to download the CLI from. HTTPS only. |

## IL2CPP line map and iOS dSYMs

| Variable | Platform | Default | What it does |
| --- | --- | --- | --- |
| `BUGSEE_NO_IL2CPP_MAPPING` | Android, iOS | Unset | Flag. Turns off the IL2CPP line map flags and the line map upload. The iOS Run Script reads it too, and still uploads the dSYMs. |
| `BUGSEE_IL2CPP_MAPPING` | Android, iOS | Unset | Path to a `LineNumberMappings.json` of your own to upload instead of the build's. Set it, and `BUGSEE_APP_TOKEN`, in the Unity Editor's environment before the build: the Editor reads it, and a Run Script in Xcode does not. A missing file gives a warning and no upload. |
| `BUGSEE_IL2CPP_UUIDS` | Android, iOS | Read from the build | The IL2CPP module UUIDs, comma separated, for the line map upload. The iOS Run Script reads it from the Xcode environment. |
| `BUGSEE_SKIP_UPLOAD_ON_DEBUG` | iOS | Unset | Set to `1` in the Xcode environment to skip the upload for the Debug configuration. |
| `BUGSEE_NO_DSYM_FORCE` | iOS | Unset | Flag. The export keeps Unity's `DEBUG_INFORMATION_FORMAT` and does not force `dwarf-with-dsym`. The Debug configuration then has no dSYM. |

## Android Gradle setup

| Variable | Platform | Default | What it does |
| --- | --- | --- | --- |
| `BUGSEE_ANDROID_FULL_SYMBOLS` | Android | Unset | Set to exactly `1` to build with the Debugging symbol level and a symbols zip, then restore your Player Settings. The same as the **Use Full Native Symbols** menu item. See [Public and Debugging symbols](/sdk/unity/symbolication/android#public-and-debugging-symbols). |
| `BUGSEE_NO_GRADLE_BUILD_ID` | Android | Unset | Flag. The package does not add its build-id block to the launcher's Gradle file (and removes one an earlier build added). The SDK then derives its own build id. |
| `BUGSEE_NO_GRADLE_REPO_INJECTION` | Android | Unset | Flag. The package does not add Maven Central to the project's plugin or buildscript repositories. If the Bugsee Gradle plugin then cannot resolve from your repositories, it is not applied and the build warns. |

## Feedback and iOS add-ons

| Variable | Platform | Default | What it does |
| --- | --- | --- | --- |
| `BUGSEE_FEEDBACK` | Android, iOS | Unset | Set to `1` or `true` in the Editor process that exports the build to link the Feedback add-on. Adding the scripting define `BUGSEE_FEEDBACK` in Player Settings does the same. See [Feedback](/sdk/unity/feedback). |
| `BUGSEE_IOS_CRASH_EXTENSION` | iOS | Auto | `auto`, `1` (also `on`, `true`, `yes`, `enable`, `enabled`) or `0` (also `off`, `false`, `no`, `disable`, `disabled`). Any other value means auto. Overrides the **Bugsee > iOS > Crash Report Extension** menu. See [Crash report extension](/sdk/unity/issue-detection/crash-report-extension). |
| `BUGSEE_IOS_APP_GROUP` | iOS | `group.<bundle id>` | The App Group id of the Crash Report Extension. It wins over `BugseeIosCrashExtensionPostProcess.AppGroupOverride` set in a build script. |
| `BUGSEE_IOS_EARLY_LAUNCH` | iOS | Off | `1` (also `on`, `true`, `yes`) turns native early launch on. Any other value is off. Overrides the Early Launch window. With early launch on, the SDK starts before any consent check of yours, and the next launch after an iOS launch that died before the app was active can block the main thread for up to about 8 seconds. See [Early launch](/sdk/unity/build-setup/ios#early-launch). |
| `BUGSEE_IOS_APP_TOKEN` | iOS | Unset | The iOS app token that early launch writes into the app's `Info.plist`. Overrides the Early Launch window. |
| `BUGSEE_IOS_EARLY_LAUNCH_OPTIONS` | iOS | Unset | A JSON object of launch options, with the same keys as the C# options, for the early session. Overrides the Early Launch window. |

## Other variables the package reads

| Variable | What the package does with it |
| --- | --- |
| `PATH` | Looks for `bugsee-cli` in the Editor's `PATH`. |
| `LOCALAPPDATA` | On Windows, finds the CLI install directory and the download cache. |
| `XDG_CACHE_HOME` | On Linux, the CLI download cache is `$XDG_CACHE_HOME/bugsee/cli`, else `~/.cache/bugsee/cli`. |
| `IL2CPP_ADDITIONAL_ARGS` | The Editor sets it for the build (adding the line map flags to any value it already has) and restores the earlier value afterwards. |

## Editor settings

These are stored with Unity's `EditorPrefs` on your machine. A variable above overrides the matching setting, where one exists.

| Menu item | Platform | Default | What it does |
| --- | --- | --- | --- |
| **Bugsee > Android > Use Full Native Symbols (Debugging) For Symbol Upload** | Android | Off | Builds with the Debugging level and a symbols zip, then restores your setting. A toggle. Preference `Bugsee.Android.FullNativeSymbols`. |
| **Bugsee > Android > Force Gradle Plugin On Older AGP (unsupported)** | Android | Off | Applies the Bugsee Gradle plugin on an AGP older than 8.6. Plugin 4.x needs AGP 8.6 or newer, so this will likely fail Gradle configuration. A toggle. Preference `Bugsee.Android.ForceGradlePlugin`. |
| **Bugsee > Android > Remove Legacy Gradle Templates** | Android | none | Checks `Assets/Plugins/Android` for Gradle templates that earlier package versions wrote. An action, not a setting. |
| **Bugsee > iOS > Keep Xcode Debug Info Format (skip dSYM force)** | iOS | Off | The same as `BUGSEE_NO_DSYM_FORCE`. A toggle, applied at the next iOS export. Preference `Bugsee.Ios.NoDsymForce`. |
| **Bugsee > iOS > Crash Report Extension > Auto, On, Off** | iOS | Auto | Whether the export adds the Crash Report Extension target. Preference `Bugsee.Ios.CrashExtension`. |
| **Bugsee > iOS > Early Launch...** | iOS | Off | A window with the early launch switch, the iOS app token and the launch options JSON. Preferences `Bugsee.Ios.EarlyLaunch`, `Bugsee.Ios.EarlyLaunch.Token` and `Bugsee.Ios.EarlyLaunch.Options`. |

## Scripting defines set by the package

The package's runtime assembly defines `BUGSEE_HAS_SCREENCAPTURE` (when Unity's screen capture module is present) and `BUGSEE_UNITY_CAPTURE` (on Unity 2022.2 or newer). Do not define them yourself. They are not environment variables. `BUGSEE_FEEDBACK` is both a scripting define and an environment variable, as listed above.
