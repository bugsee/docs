---
title: "Manual invocation"
description: "How to programmatically trigger the Bugsee report UI, create issues from code, and report handled exceptions in Xamarin apps."
sidebar_position: 2
slug: "/sdk/xamarin/manual"
---

:::caution Deprecated
Microsoft ended support for Xamarin on May 1, 2024. The Bugsee Xamarin SDK is no longer actively maintained. For new projects, use the [Bugsee .NET SDK](/sdk/dotnet/installation/), which supports .NET MAUI and modern .NET workloads.
:::

## Report view

In addition to detection of shake gesture or screenshot issue report view can be triggered programmatically:

```csharp
Bugsee.ShowReport();

// or pre-fill some fields, user will be able to modify them
Bugsee.ShowReport("Some problem", "", BugseeSeverityLevel.Medium);
```


## Issue create

You can build your own custom UI for collecting summary, description and severity from a user and use the following call to send it to Bugsee
to upload.

> **Note:** You should not use it for reporting errors automatically from within code, use [handled exceptions](#handled-exceptions) for this instead.

```csharp
Bugsee.Upload("Upload from code", "Some description", BugseeSeverityLevel.Medium);
```

## Handled exceptions

It is possible to report handled exceptions from code. These reports will get combined similar to crashes, and you will be provided with statistics and a break down by unique devices, OS versions, etc.

```csharp
try {
	// Code, which can throw exception.
} catch(Exception e) {
    Bugsee.LogException(e);
}
```