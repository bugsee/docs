---
title: "Feedback"
description: "Enable in-app user-to-support messaging in React Native by launching Bugsee's built-in feedback UI and configuring a default greeting."
sidebar_position: 6
slug: "/sdk/react_native/v6/feedback"
---

:::caution[Previous version]
This page documents Bugsee React Native SDK **6.x** (`react-native-bugsee`), the current stable release. The new **7.x** SDK (`@bugsee/react-native`) is in beta: see [Migrating from 6.x to 7.x](/sdk/react_native/migration) to evaluate it, or the [7.x overview](/sdk/react_native/overview) to start a new integration.
:::

Bugsee implements a built-in single-threaded messenger to allow your users to communicate with your support and developers.

## Feedback activity

To start feedback activity from within your application:

```javascript
Bugsee.showFeedbackUI();
```

## Default greeting

Default greeting can be set on the server in your application settings. However, for the cases when network is not available, you can set default greeting on the client as well:

```javascript
Bugsee.setDefaultFeedbackGreeting("Hi! How can we help?");
```
