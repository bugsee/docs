---
title: "Feedback"
description: "How to show the in-app feedback messenger, receive new message notifications, and set a default greeting in the Bugsee Flutter SDK."
sidebar_position: 6
slug: "/sdk/flutter/v9/feedback"
---

:::caution[Previous version]
This page documents Bugsee Flutter SDK **9.x** (`bugsee_flutter` 9.x), the current stable release. The new **10.x** SDK is a rewrite for the Bugsee 7.x native SDKs and is in beta, not yet published to pub.dev.
:::

Bugsee implements a built-in single-threaded messenger to allow your users to communicate with your support and developers.

## Feedback controller

To start the feedback controller from within your application

```dart
Bugsee.showFeedbackUI();
```

## Notifications

To receive notifications about new messages arriving from the server, you should provide ```BugseeNewFeedbackMessagesHandler``` delegate callback:

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