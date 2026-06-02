---
title: "Feedback"
description: "How to show the in-app feedback messenger, receive new message notifications, and set a default greeting in the Bugsee .NET SDK."
sidebar_position: 6
slug: "/sdk/dotnet/feedback"
---

Bugsee implements built in single threaded messenger to allow your users to communicate with your support and developers. 

## Feedback controller

To start feedback controller from within your application

```csharp
BugseePlugin.Bugsee.ShowFeedbackUI();
```

## Notifications

To receive notifications about new messages arriving from the server, your should provide ```BugseeNewFeedbackMessagesHandler``` delegate callback:

```csharp
BugseePlugin.Bugsee.SetNewFeedbackMessagesHandler(delegate (string[] messages)
{
    // Handle messages here...
});
```

## Default greeting

Default greeting can be set on the server in your application settings. However, for the cases when network is not available, you can
set default greeting on the client as well:

```csharp
BugseePlugin.Bugsee.SetFeedbackGreetingMessage("Hi! How can we help?");
```