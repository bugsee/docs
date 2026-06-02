---
title: "Feedback"
description: "Enable in-app user-to-support messaging in Unity by launching Bugsee's built-in feedback UI and setting a default greeting message."
sidebar_position: 6
slug: "/sdk/unity/feedback"
---

Bugsee implements built in single threaded messenger to allow your users to communicate with your support and developers. 

## Feedback controller

To start feedback controller from within your application

```csharp
Bugsee.ShowFeedbackUI();
```

## Default greeting

Default greeting can be set on the server in your application settings. However, for the cases when network is not available, you can
set default greeting on the client as well:

```csharp
Bugsee.SetFeedbackGreetingMessage("Hi! How can we help?");
```