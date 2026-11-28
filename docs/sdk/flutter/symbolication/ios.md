---
title: "Symbolication: iOS"
description: "Uploading dSYMs for a Flutter 10.x iOS app with a bugsee-cli Run Script build phase, what to set on the target, and which exit codes fail the build."
sidebar_position: 20
slug: "/sdk/flutter/symbolication/ios"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta (`10.0.0-beta.1`, a prerelease on pub.dev) and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

Native iOS frames (your app, `Flutter.framework`, other plugins) show as addresses until Bugsee has the dSYMs of the build that produced them. In a Flutter app nothing uploads them for you: the Flutter build does not call the Bugsee uploader, and the plugin has no hook into Xcode.

:::note[Not measured with a Flutter build]
This page follows the [Bugsee CLI documentation](/cli/xcode). The phase below was not run with a Flutter iOS build here, and a symbolicated native iOS crash from a Flutter app was not verified. Check the first release build you ship: see [Check that the upload happened](#check-that-the-upload-happened).
:::

For the Dart frames of the same app see [Symbolication: Dart](/sdk/flutter/symbolication/dart). The native iOS side is covered in [iOS symbolication](/sdk/ios/symbolication).

## Upload from a Run Script phase

In Xcode, open the Runner target, **Build Phases**, add a **Run Script** phase after **Embed Frameworks** and call the CLI. `bugsee-cli` **0.7.7 or newer** (the version that has `xcode upload-dsyms`) has to be installed where the build can reach it, see [CLI installation](/cli/installation).

```sh title="Run Script phase"
"$SRCROOT/path/to/bugsee-cli" xcode upload-dsyms --app-token "$BUGSEE_APP_TOKEN"
```

The command scans `DWARF_DSYM_FOLDER_PATH`, which Xcode sets for every Run Script phase, and falls back to `<ARCHIVE_PATH>/dSYMs`. It uploads dSYMs only: it does not register a build and is safe on every build.

Two settings make it work:

| Setting | Why |
| --- | --- |
| `ENABLE_USER_SCRIPT_SANDBOXING = NO` on the target | From Xcode 15 it defaults to `YES`, which stops a build phase from reading the dSYM folder. Alternatively declare the folder in the phase's input file lists. |
| `BUGSEE_APP_TOKEN` in the script's environment | A user-defined build setting of the target named `BUGSEE_APP_TOKEN` provides it. Use your **iOS** app token. |

The CLI fails the build, exit code `20`, when the token is missing or empty. A failed upload fails the build on purpose: otherwise symbolication stops silently and the first sign is an unreadable report. The exit codes are in the [CLI documentation](/cli/xcode#xcode-upload-dsyms).

## Upload from CI

If you archive on a CI machine, upload the dSYMs of the archive instead of using a build phase:

```sh
bugsee-cli debug-files upload <archive>/dSYMs --type dsym --version <v> --build <n>
```

See [Debug files](/cli/debug-files) for the options.

## Check that the upload happened

After the first release archive you ship, open a native crash from it in the dashboard and confirm that the frames show function names and lines. A crash on an iOS simulator is not a test: the SDK's simulator slice has no crash reporter, so use a physical iPhone.
