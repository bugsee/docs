---
title: "Feedback"
description: "How to open the Bugsee in-app feedback messenger from a Cordova application and configure the default greeting message."
sidebar_position: 6
slug: "/sdk/cordova/feedback"
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