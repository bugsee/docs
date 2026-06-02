---
title: "Network capture"
description: "How to enable Bugsee network traffic interception in Flutter by installing the custom HTTP overrides handler."
sidebar_position: 8
slug: "/sdk/flutter/network"
---

Flutter implements its own network stack and does not use underlying iOS or Android ones. In order for Bugsee to intercept flutter network traffic, the handler has to be installed explicitly:

```dart
  // This is required to let Bugsee intercept network requests
  HttpOverrides.global = Bugsee.defaultHttpOverrides;
```

We recommend adding this line into the "main" method of your application.