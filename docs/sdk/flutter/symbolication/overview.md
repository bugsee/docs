---
title: "Symbolication overview"
description: "What Bugsee needs to turn Flutter 10.x release crash and error frames back into source, which build step uploads each piece, and which uploads are automatic or manual."
sidebar_position: 18
slug: "/sdk/flutter/symbolication/overview"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta (`10.0.0-beta.1`, a prerelease on pub.dev) and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

A release build ships Dart code compiled ahead of time, Java and Kotlin code renamed by R8, and stripped native libraries. A crash or error from that build carries addresses and renamed symbols. To show your own file names, functions and lines, Bugsee needs the debug files of that exact build, uploaded when you build it. Without them the report is stored but its frames stay unreadable.

A Flutter app has up to four kinds of frames in one report, and each has its own debug file and its own upload.

## What gets symbolicated

| Frames | Debug file | How it reaches Bugsee |
| --- | --- | --- |
| Android Java and Kotlin | R8 mapping (`mapping.txt`) | Automatic. The Bugsee Gradle plugin uploads it on every minified build (`upload<Variant>Mapping`). |
| Android native (`libflutter.so`, your own `.so` files) | Unstripped native libraries | Automatic once you turn it on: `bugsee { ndk { enabled.set(true) } }`. It covers non-debuggable builds only. |
| Dart frames of a release build made with `--split-debug-info` (and `--obfuscate`) | `build/symbols/*.symbols` | **Manual.** Nothing in a Flutter build calls the Bugsee uploader, and `bugsee-cli` has no Flutter type yet. |
| iOS native (the app, `Flutter.framework`) | The build's dSYMs | **Manual in a Flutter app.** A Run Script build phase that runs `bugsee-cli xcode upload-dsyms`, or an upload from CI. |

The Android Java and Kotlin mapping needs no setting at all once the Gradle plugin is applied, which the SDK requires anyway (see [Installation](/sdk/flutter/installation)).

:::warning[Keep the symbols of every build you ship]
The backend finds the symbols by the build, not by the app version. Keep the `build/symbols` folder, the dSYMs and the R8 mapping of every build that reaches users, and upload them before the first crash can arrive.
:::

## What is verified

| Piece | State |
| --- | --- |
| Android Java and Kotlin, R8 mapping | Verified on emulators: exceptions from a release build with R8 and `--obfuscate`. |
| Dart frames, Android arm64, Flutter 3.50 | Decoded by the backend's symbolizer when given the stack as the backend feeds it, see [Symbolication: Dart](/sdk/flutter/symbolication/dart#what-is-verified). The upload of the symbols file through the production endpoint was not verified. |
| Dart frames, iOS | Not verified with a real device stack. A hand-written, header-less stack decoded against the symbols file of a release build. |
| iOS dSYMs | The setup comes from the Bugsee CLI documentation. It has not been measured with a Flutter build. |
| Native frames on Android | The build step is documented. Native crash symbolication needs a non-debuggable build with its libraries uploaded. |

## Pages

- [Symbolication: Android](/sdk/flutter/symbolication/android): the Gradle plugin, the R8 mapping and the native symbols.
- [Symbolication: iOS](/sdk/flutter/symbolication/ios): the dSYM upload phase.
- [Symbolication: Dart](/sdk/flutter/symbolication/dart): `--split-debug-info`, `--obfuscate` and the symbols upload.
- [Crash and error reporting](/sdk/flutter/manual/crash-error-reporting): how Dart errors reach Bugsee.
