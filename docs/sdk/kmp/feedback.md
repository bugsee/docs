---
title: "Feedback (Beta)"
description: "How to show the in-app feedback messenger, receive new message notifications, and set a default greeting in the Bugsee KMP SDK."
sidebar_position: 6
slug: "/sdk/kmp/feedback"
---

Bugsee implements a built-in single-threaded messenger to allow your users to communicate with your support and development team.

## Feedback UI

To show the feedback controller from within your application:

```kotlin
Bugsee.showFeedback()
```

## Notifications

To receive notifications about new messages arriving from the server:

```kotlin
Bugsee.setOnNewFeedbackListener { messages ->
    // messages is a List<String> of new message texts
    println("New feedback messages: ${messages.size}")
}
```

## Default greeting

The default greeting can be set on the server in your application settings. For cases when the network is not available, you can set a default greeting on the client:

```kotlin
Bugsee.setDefaultFeedbackGreeting("Hi! How can we help?")
```
