---
title: "Feedback"
description: "Enable in-app user-to-support messaging in React Native by launching Bugsee's built-in feedback UI and configuring a default greeting."
sidebar_position: 6
slug: "/sdk/react_native/feedback"
---

Bugsee implements built in single threaded messenger to allow your users to communicate with your support and developers. 

## Feedback activity

To start feedback activity from within your application:

```javascript
Bugsee.showFeedbackUI();
```

## Default greeting

Default greeting can be set on the server in your application settings. However, for the cases when network is not available, you can set default greeting on the client as well:

```java
Bugsee.setDefaultFeedbackGreeting("Hi! How can we help?");
```