---
title: "FAQ"
description: "Practical questions and answers about Bugsee Unity SDK 7.x (beta): compile errors, platforms, symbolication, build variables and known beta behavior."
sidebar_position: 24
slug: "/sdk/unity/faq"
---

:::warning[Beta]
This page documents Bugsee Unity SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/unity/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/unity/migration).
:::

Upgrading from 6.x? See the [migration guide](/sdk/unity/migration).

**1. Why does `Bugsee.Launch(...)` not compile?**

The package namespace and its static class are both named `Bugsee`. In code outside the `Bugsee` namespace, `Bugsee` resolves to the namespace, so `Bugsee.Launch(...)` is an error. Alias the class and call the alias. You can also write the full name, `Bugsee.Bugsee.Launch(...)`.

```csharp
using BugseeSdk = Bugsee.Bugsee;

BugseeSdk.Launch("<your app token>");
```

Import the other types with `using Bugsee.Contracts.Options;` and the namespaces listed in the [migration guide](/sdk/unity/migration#13-namespaces-and-the-name-clash). The examples on this site use the alias. See [Installation](/sdk/unity/installation#launch-the-sdk).

<br />

**2. Which Unity versions and platforms does 7.x support?**

Unity 2021.3 or later, for iOS builds (iOS 15.0 or later) and Android builds (API 21 or later). The package compiles for every build target, but it records and sends data only on iOS and Android. See [Overview](/sdk/unity/overview#requirements).

<br />

**3. Do I need a `BugseeLauncher` component or a special GameObject?**

No. 7.x has no launcher component. You call `Launch` from any script. The package creates its own helper object, `Bugsee.MainThreadDispatcher`, before the first scene loads. If you used the 6.x `BugseeLauncher` or `AddComponent<Bugsee>()`, remove them: see the [migration guide](/sdk/unity/migration#11-replace-the-plugin).

<br />

**4. Nothing is captured when I press Play in the Editor. Is that a bug?**

No. In the Unity Editor, `Launch` does nothing: `Bugsee.Status` is `Stopped`, `Bugsee.IsLaunched` is `false`, and `LaunchAsync` completes `false`. The Editor does not record or send anything. Build to a device to test launch, capture and reports. See [Lifecycle & status](/sdk/unity/lifecycle#status) and [Installation](/sdk/unity/installation#check-that-it-works).

<br />

**5. What happens on WebGL, standalone and other platforms?**

The package compiles there, and the API calls are stubs: `Launch` does nothing and nothing is collected. `SetAttribute` still validates its key and value and throws `ArgumentException` for an invalid one, but it stores nothing, so `GetAttribute` returns `null`. Your code needs no `#if` guards to build. See [User & session data](/sdk/unity/user-session-data#in-the-editor).

<br />

**6. The shake gesture and the notification-bar trigger do not open the report dialog. Why?**

They are off by default in 7.x. Shake-to-report is off on both platforms, and the Android notification-bar trigger is off on Android. Turn them on in the launch options: `ReportingTriggerByShake = true` (both platforms) and `ReportingTriggerByNotification = true` on `AndroidLaunchOptions`. See [Bug reporting](/sdk/unity/manual/bug-reporting#built-in-report-triggers) and [Configuration](/sdk/unity/configuration#reporting).

<br />

**7. What differs between IL2CPP and Mono?**

- **iOS** builds use IL2CPP, the only scripting backend Unity offers for iOS.
- **Android IL2CPP** is the supported configuration for fully symbolicated native crashes.
- **Android Mono** works, but frames inside the Mono runtime libraries stay unsymbolicated, and the build logs a warning once. Unity 2021.3 has no Mono ARM64 build.
- **C# frames** resolve differently: a Mono Release build sends IL offsets that Bugsee maps from your portable `.pdb` files (CLI 0.9.0 or newer), and an IL2CPP Release build sends native addresses that Bugsee maps with the IL2CPP line map and native symbols.

See [Android build setup](/sdk/unity/build-setup/android) and [Symbolication: C# code](/sdk/unity/symbolication/managed-code).

<br />

**8. Why are the frames of my handled exceptions not symbolicated? What are Public and Debugging symbols?**

This is a known issue in 7.0.0-beta.1. Handled managed exceptions in a Release IL2CPP build on Android, without IL2CPP line information, stay unsymbolicated (no file and line) when the symbols are Public, which means a symbol table only. Use Debugging symbols plus the IL2CPP line map: set **Create symbols.zip** to Debugging, or use the menu item **Bugsee > Android > Use Full Native Symbols (Debugging) For Symbol Upload**. Development builds send no addresses on Android, and Debugging symbols do not change that.

Also, switching from Public to Debugging symbols for the same `libil2cpp.so` build id may leave frames raw on the dashboard. This is open and under investigation: [issue 263](https://github.com/bugsee/bugsee-unity/issues/263). See [Symbolication: Android](/sdk/unity/symbolication/android#public-and-debugging-symbols).

<br />

**9. Do I need `il2cppFileRoot.txt`?**

No. Unity writes it next to the IL2CPP line map. The upload sends it when it is there, and it is not required. See [Symbolication: C# code](/sdk/unity/symbolication/managed-code#upload-the-il2cpp-line-map-from-ci).

<br />

**10. My crash test on the iOS Simulator is not reported.**

The iOS Simulator build of the SDK has no crash reporter. On the Simulator, native crashes, hangs and managed exceptions are not reported. The SDK logs a warning once at the first launch there. Test crashes on a physical device. Bug reports from the report dialog still work. See [Crash & error reporting](/sdk/unity/manual/crash-error-reporting) and the [iOS FAQ](/sdk/ios/faq).

<br />

**11. How do I turn off the symbol upload?**

The upload is opt-in. It runs only when `BUGSEE_APP_TOKEN` is set in the environment of the process that builds. To turn every upload off, even with a token, set `BUGSEE_NO_SYMBOL_UPLOAD` to any value. On iOS, set it in the Xcode environment as well. An upload never fails your build: a missing token, tool or map is a warning. See [Build environment variables](/sdk/unity/symbolication/environment-variables) and [Symbolication](/sdk/unity/symbolication/overview).

<br />

**12. I get a warning that the build token and the launch token are different.**

Symbols follow `BUGSEE_APP_TOKEN` at build time, and crashes follow the token you pass to `Launch`. When they name different apps, the symbols sit in another app than the crashes. Fix the token, or set `BUGSEE_NO_TOKEN_CHECK` for the build when you choose the token at run time. See [the build token and the launch token](/sdk/unity/symbolication/overview#the-build-token-and-the-launch-token).

<br />

**13. How do I update the pinned version?**

Change the tag in the package URL, either in the Package Manager or in `Packages/manifest.json`:

```json
{
  "dependencies": {
    "com.bugsee.unity": "https://github.com/bugsee/bugsee-unity.git#v7.0.0-beta.1"
  }
}
```

Always keep a `#tag` in the URL. Without one, Unity follows the repository's default branch, which is not a release. Read the [release notes](/sdk/unity/release-notes) before you move to a new beta, because the API can change between betas. See [Installation](/sdk/unity/installation#install-the-package).

<br />

**14. Which native SDK versions does this release use?**

The package pins the Bugsee Android SDK (with its NDK module), the Bugsee iOS SDK, the Bugsee Gradle plugin and the default `bugsee-cli` version it was tested with. The [release notes](/sdk/unity/release-notes) list the versions of each release. The package adds the native SDKs to the generated Gradle and Xcode projects when you build. See [Overview](/sdk/unity/overview#versions).

<br />

**15. Does the iOS native early launch skip my consent check?**

Yes. With early launch on (`BUGSEE_IOS_EARLY_LAUNCH=1`), the iOS SDK starts at app launch, before Unity's first scene, so it starts before any C# consent check. It is off by default. If you need consent first, leave it off and call `Launch` after the user agrees. See [Lifecycle & status](/sdk/unity/lifecycle#ios-early-launch).

<br />

**16. Where are the 6.x docs?**

The 6.x documentation, the stable release, starts at [Installation (6.x)](/sdk/unity/v6/installation), with the [6.x release notes](/sdk/unity/v6/release-notes). To move to 7.x, follow the [migration guide](/sdk/unity/migration).

<br />

**17. Where do I report a problem with the beta?**

On the [issue tracker of the repository](https://github.com/bugsee/bugsee-unity/issues). The known issues of this beta are listed in the [release notes](/sdk/unity/release-notes#700-beta1-november-23-2026).
