---
title: "Network capture"
description: "Enable Bugsee network traffic capture in React Native, including the required Android OkHttp client factory setup."
sidebar_position: 7
slug: "/sdk/react_native/network"
---

On both Android and iOS Bugsee is capable of capturing network events made either by your JS or platform code. On iOS we automatically install required hooks and no actions should be taken from user space. However, on Android, a single line should be added to the application bootstrap flow to let us intercept network events.

**Android**
```java
// ...

import com.facebook.react.modules.network.OkHttpClientProvider;
import com.bugsee.BugseeReactPackage;

public class MainApplication extends Application implements ReactApplication {
    public MainApplication() {
        super();
        OkHttpClientProvider.setOkHttpClientFactory(BugseeReactPackage.getDefaultHttpFactory());    // <--- Add this line
    }

    // ...
}
```