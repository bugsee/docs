---
title: "Network capture"
description: "How to enable Bugsee network traffic interception in Flutter by installing the custom HTTP overrides handler."
sidebar_position: 8
slug: "/sdk/flutter/network"
---

Flutter implements its own network stack and does not use the underlying iOS or Android ones. Capturing Dart traffic therefore takes **two** things, and both are required:

1. The **`monitorNetwork`** launch option must be enabled. It is `true` by default — see [configuration](/sdk/flutter/configuration/).
2. The Bugsee HTTP overrides handler must be **installed explicitly**. There is no default for this one:

```dart
  // This is required to let Bugsee intercept network requests
  HttpOverrides.global = Bugsee.defaultHttpOverrides;
```

We recommend adding this line into the `main` method of your application.

:::info[Why both]
`monitorNetwork` controls Bugsee's network capture as a whole, including traffic issued by native platform code. Installing `HttpOverrides.global` is what routes your **Dart** traffic — anything built on `dart:io`'s `HttpClient`, which includes `package:http` — through Bugsee in the first place. Leaving the overrides uninstalled means Dart requests are never seen, even though `monitorNetwork` defaults to on; setting `monitorNetwork` to `false` disables capture regardless of the overrides.
:::