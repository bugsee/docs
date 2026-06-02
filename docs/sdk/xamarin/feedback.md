---
title: "Feedback"
description: "How to integrate Bugsee's in-app messaging UI in Xamarin to allow users to communicate with your team directly from the app."
sidebar_position: 6
slug: "/sdk/xamarin/feedback"
---

:::caution Deprecated
Microsoft ended support for Xamarin on May 1, 2024. The Bugsee Xamarin SDK is no longer actively maintained. For new projects, use the [Bugsee .NET SDK](/sdk/dotnet/installation/), which supports .NET MAUI and modern .NET workloads.
:::

Bugsee implements built in single threaded messenger to allow your users to communicate with your support and developers. 

## Feedback controller

To start feedback controller from within your application

```csharp
Bugsee.ShowFeedbackUI();
```

## Notifications

To receive notifications about new messages arriving from the server, your should provide ```BugseeNewFeedbackMessagesHandler``` delegate callback:

```csharp
Bugsee.SetNewFeedbackMessagesHandler(delegate (string[] messages)
{
    // Handle messages here...
});
```

## Default greeting

Default greeting can be set on the server in your application settings. However, for the cases when network is not available, you can
set default greeting on the client as well:

```csharp
Bugsee.SetFeedbackGreetingMessage("Hi! How can we help?");
```