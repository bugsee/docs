---
title: "Crash symbolication"
description: "How Bugsee automatically collects and uploads debug symbols for Xamarin projects to produce human-readable crash stack traces."
sidebar_position: 10
slug: "/sdk/xamarin/symbolication"
---

:::caution[Deprecated]
Microsoft ended support for Xamarin on May 1, 2024. The Bugsee Xamarin SDK is no longer actively maintained. For new projects, use the [Bugsee .NET SDK](/sdk/dotnet/installation/), which supports .NET MAUI and modern .NET workloads.
:::

Bugsee is able to properly process and symbolicate crash reports that are uploaded from your users. Even if your binary has its symbol stripped, Bugsee will do wonders guessing the right symbols. In some cases it might be enough to root cause the problem, however best results will be achieved when Bugsee can match a crash report with a symbol file (dSYM) of crashed build.

Bugsee can automatically upload managed (PDB/MDB) and platform native (like, dSYM) debug symbols during the build phase. The system is smart enough to automatically match the right symbols to a crash report.

## Configuring

Before adding changes to trigger symbols collection and uploading, make sure your projects are configured to produce those symbols, as it's quite common practice to disable debug information completely for `Release` builds. Go to `Project options` -> `Compiler` and make sure `Debug information` option is set to either **Symbols only** or **Full**. As was noted above, we operate over managed and native symbols, which are generated alongside each other. Former contain debug information for managed code (which you write in one of IL-based languages, like C#) while latter contain information that lets us symbolicate crashes in native code (like, Objective-C in case of iOS-targeted build).

## Auto upload

Symbols are collected and uploaded during build. We install several hooks into target projects build flow which are triggered automatically.

The only thing you need to do is specify your Bugsee application token for your Project to let us properly link debug symbols. Add special assembly attribute ```BugseeAppToken``` to ${Project-Root}/Properties/AssemblyInfo.cs file (If it does not exists, create one). 

```csharp
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using BugseePlugin;

// Various [assembly: Attr()] declarations go here

// Add this line:
[assembly: BugseeAppToken("YOUR-ACTUAL-TOKEN-HERE")]
```

In case of solution with multiple projects, there is no need to annotate them all. Instead, you should only add that annotation to projects that directly reference [Bugsee NuGet package](https://www.nuget.org/packages/Bugsee.Xamarin/).

## Manual dSYM upload

In some cases you might need to upload dSYM files manually. Bugsee accepts .zip files with one or multiple dSYM files inside. Once you have located the files and compressed them into an archive, click on the "Manual upload" button within Bugsee and either drag your files over the dialog or click on it to
open the file browser:

![Manual upload](manual-upload.png)

Once a dSYM file is uploaded manually, we are going to re-process old issues related to that specific build, the process might take some time, usually several minutes.