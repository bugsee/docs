---
title: "Feedback"
description: "How to show the in-app feedback messenger, receive new message notifications, and set a default greeting in the Bugsee Flutter SDK."
sidebar_position: 6
slug: "/sdk/flutter/feedback"
---

Bugsee implements built in single threaded messenger to allow your users to communicate with your support and developers. 

## Feedback controller

To start feedback controller from within your application

```dart
Bugsee.showFeedbackUI();
```

## Notifications

To receive notifications about new messages arriving from the server, your should provide ```BugseeNewFeedbackMessagesHandler``` delegate callback:

```dart
Bugsee.setNewFeedbackMessagesCallback((List<String> messages) {
    ...
});
```

## Default greeting

Default greeting can be set on the server in your application settings. However, for the cases when network is not available, you can
set default greeting on the client as well:

```dart
Bugsee.setDefaultFeedbackGreeting("Hi! How can we help?");
```