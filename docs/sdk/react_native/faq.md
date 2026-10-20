---
title: "FAQ"
description: "Practical questions and answers about Bugsee React Native SDK 7.x (beta): setup, tokens, crash testing, symbolication and known beta behavior."
sidebar_position: 24
slug: "/sdk/react_native/faq"
---

:::warning[Beta]
This page documents Bugsee React Native SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/react_native/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/react_native/migration).
:::

Upgrading from 6.x? See the [migration guide](/sdk/react_native/migration).

**1. Which React Native versions does 7.x support?**

React Native 0.81 or later, with the New Architecture enabled, on iOS 15.0 or later and Android API 21 or later. The New Architecture is the default from React Native 0.76; on 0.81 it can still be turned off, but this package requires it on, and its import fails on the legacy architecture. See [Overview](/sdk/react_native/overview#requirements).

<br />

**2. Can I use JavaScriptCore instead of Hermes? What happens if I turn Hermes off?**

Hermes is required, and JavaScriptCore is not supported. React Native removed JavaScriptCore from core in 0.81, so turning Hermes off means plugging in a third-party engine. The only one the ecosystem offers, `@react-native-community/javascriptcore`, did not work with current React Native when we tried it. On Android its JavaScriptCore cannot parse React Native's own bundle, and on iOS it fails to link on 0.87 and to `pod install` on 0.86. An app that turns Hermes off therefore usually cannot be built, before the Bugsee SDK is involved.

Nothing in the SDK blocks or warns about it, and some code adapts to it. Reports carry `js-engine: jsc` (for any engine that is not Hermes), stack traces are parsed in both engines' formats, unhandled promise rejections use the standard promise library's tracker, and the source-map build hooks have a plain-bundle path. None of this has been tested, because no test app could be built, so treat it as unsupported. If you try it anyway, report what you find together with your engine and React Native versions. See [Overview](/sdk/react_native/overview#requirements).

<br />

**3. Does it work in Expo Go?**

No. The package contains native code, which Expo Go does not have. Use a [development build](https://docs.expo.dev/develop/development-builds/introduction/) with `expo prebuild` and the config plugin. See [Expo](/sdk/react_native/expo).

<br />

**4. What do the npm `latest` and `beta` tags mean?**

For now both point at the current beta, so `yarn add @bugsee/react-native` and `yarn add @bugsee/react-native@beta` install the same version. Use `@beta` to keep following betas once a stable 7.x release exists, and install `@bugsee/react-native-feedback` at the same version. See [Installation](/sdk/react_native/installation#1-add-the-package).

<br />

**5. pnpm stops the install with `ERR_PNPM_IGNORED_BUILDS`. What should I allow?**

The package depends on `@bugsee/cli`, which has a `postinstall` script. pnpm 10 and later run no dependency's install script unless the project decides, and pnpm 11 fails until it does. The CLI binary comes from a platform-specific optional dependency, so the script is only a download fallback: set `'@bugsee/cli': false` under `allowBuilds` in `pnpm-workspace.yaml`, or `true` if your registry lacks `@bugsee/cli-<platform>`. React Native also needs `nodeLinker: hoisted`. See [pnpm](/sdk/react_native/installation#pnpm).

<br />

**6. `launch` rejects with `E_TOKEN`. Why?**

The token is missing, empty or blank. The package rejects it before launching the SDK. A token the backend rejects does not throw: `launch` resolves `false`. Remember that tokens are per platform; pick the right one from `Platform.OS`. See [What `launch` resolves to](/sdk/react_native/installation#what-launch-resolves-to).

<br />

**7. `launch` resolved, but no report arrives.**

Check that `launch` resolved `true`, and that you used the token of the platform you run. Capture comes up asynchronously, so a resolved `launch` does not yet mean recording; check `Bugsee.getStatus()` a moment later or use `Bugsee.onStatusChange`. `showReportDialog` and `upload` do nothing before launch. See [Installation](/sdk/react_native/installation#5-verify) and [Lifecycle & status](/sdk/react_native/lifecycle).

<br />

**8. How do I test crash reporting?**

Call `Bugsee.testJsCrash()` from a button handler, where nothing catches it, or `Bugsee.testNativeCrash()`, which raises the native SDK's test crash and ends the app. Relaunch the app afterward: a native crash report is sent at the next launch. Test on a physical device for iOS (see the next question). See [Testing crash reporting](/sdk/react_native/manual/crash-error-reporting#testing-crash-reporting).

<br />

**9. Why are there no crash reports from the iOS Simulator?**

In this beta, the iOS Simulator produces neither native nor JavaScript crash reports. Use a physical iPhone. See [Native crashes](/sdk/react_native/manual/crash-error-reporting#native-crashes).

<br />

**10. Crash reports show minified JavaScript or raw native addresses.**

The Release build did not upload its debug files. JavaScript frames need the source map, Android frames the R8 mapping and native symbols, iOS frames the dSYMs. An Expo app gets the uploads from the config plugin; a bare app needs a few build edits. Check the build log for `bugsee: uploaded source map <debug id>`. React Native's own frames on iOS need `RCT_SYMBOLICATE_PREBUILT_FRAMEWORKS=1` at `pod install`. See [Symbolication](/sdk/react_native/symbolication/overview).

<br />

**11. The build log says the upload was skipped because the token is the placeholder. What is that?**

Without a real app token, or with the placeholder token `00000000-0000-4000-8000-000000000000`, the source-map upload and the iOS dSYM post-action skip with one line, and the build carries on. The Bugsee Gradle plugin skips its uploads only when no token is set at all; with Expo, the config plugin leaves a missing or placeholder token out of `android/bugsee.properties`, so those uploads skip too. In a bare app, do not put the placeholder in `android/bugsee.properties`. Give CI the token through `BUGSEE_APP_TOKEN`, or `android/bugsee.properties` written from your secrets. See [Uploads without a token](/sdk/react_native/expo#uploads-without-a-token) and [Tokens and endpoints](/sdk/react_native/symbolication/overview#tokens-and-endpoints).

<br />

**12. Android reports have no `fetch` or XHR network events.**

React Native sends these requests through OkHttp, and the Bugsee Gradle plugin is what lets the SDK record OkHttp traffic. Without the plugin applied to `android/app`, they are not recorded on Android. See [Installation](/sdk/react_native/installation#android) and [Symbolication: Android](/sdk/react_native/symbolication/android#2-the-bugsee-gradle-plugin).

<br />

**13. With Android auto-launch, my JavaScript launch options are ignored.**

With `autoLaunch`, the SDK starts from the manifest at process start on Android, before your options object exists, and you call `Bugsee.attach()` instead of `launch`. Configure it with `com.bugsee.option.*` manifest meta-data, or call `Bugsee.relaunch(options)` after `attach()`. Until a `relaunch`, the session's reports also lack the JavaScript details of the wrapper. See [Auto-launch on Android](/sdk/react_native/expo#auto-launch-on-android) and [Attach to a running SDK](/sdk/react_native/lifecycle#attach-to-a-running-sdk).

<br />

**14. Can I set attributes or the user identifier before `launch`?**

What the native SDKs do with them before launch is not specified in this beta. Set the identifier and attributes after the promise from `launch` resolves. See [Before launch](/sdk/react_native/user-session-data#before-launch).

<br />

**15. After a development reload, logs or network events behave oddly.**

Filters are JavaScript functions. After a reload, the filters stay on while nothing in the new runtime answers them: network events and breadcrumbs are lost, and logs are dropped on iOS and recorded unfiltered on Android, until your code calls the setters again. Call `setLogFilter`, `setNetworkFilter` and `setBreadcrumbFilter` first thing in your startup code. See the "Reloads" sections of [Console logs](/sdk/react_native/logs#reloads), [Network events](/sdk/react_native/network#reloads) and [Breadcrumbs](/sdk/react_native/breadcrumbs#reloads).

<br />

**16. `logException` throws `TypeError: ExceptionOptions has unknown key "labels"`.**

`logException` takes `{ domain }` only, as the 7.x native SDKs do; `labels` and `includeVideo` throw before anything is sent. Set labels from a report handler instead. There is no replacement for `includeVideo`. See [Options](/sdk/react_native/manual/crash-error-reporting#options) and [Report handler](/sdk/react_native/report-handler).

<br />

**17. iOS build fails in `fmt` with "call to consteval function … is not a constant expression".**

This is not caused by Bugsee: it affects React Native 0.81 and 0.82 with Xcode 26.4 or later, and the fix is to build the `fmt` pod as C++17 from your `Podfile`. See [iOS build fails in `fmt`](/sdk/react_native/installation#ios-build-fails-in-fmt).

<br />

**18. A Release build fails with "Permission denied" on `hermesc-preserve-js.sh` or `bugsee-xcode.sh`.**

In 7.0.0-beta1 and 7.0.0-beta2 (fixed in 7.0.0-beta3) the package's shell scripts are published without the executable bit. On Android (bare and Expo, on macOS or Linux) and in a bare app's iOS bundle phase, they are run directly and fail. Run `chmod +x node_modules/@bugsee/react-native/scripts/*.sh` after every install, for example from a `postinstall` script, or on iOS run the script through `/bin/bash`. See [Symbolication: Android](/sdk/react_native/symbolication/android#1-javascript-source-maps) and [Symbolication: iOS](/sdk/react_native/symbolication/ios#1-the-bundle-phase-javascript-source-maps).

<br />

**19. Where are the 6.x answers?**

See the [6.x documentation](/sdk/react_native/v6/installation), and the [release notes](/sdk/react_native/release-notes) for what each 7.x beta changed.
