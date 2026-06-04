---
title: "Installation"
description: "How to install and initialize the Bugsee Cordova plugin for iOS and Android, including separate token setup for each platform."
sidebar_position: 0
slug: "/sdk/cordova/installation"
---

:::info[Agent-Assisted Setup]
Ask your AI coding assistant:

```text
Use curl to download, read and follow: https://docs.bugsee.com/ai/agent-skills/sdk/cordova/SKILL.md
```

Works with Claude Code, Cursor, Copilot, Codex, and more. [Learn more](/ai/agent-skills/)
:::

The Cordova plugin is currently supported for iOS and Android platforms. If you use Cordova to compile your app for both platforms, you should create separate applications within the Bugsee system and obtain separate tokens for your iOS and Android apps. Using [cordova-plugin-device](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-device/) will allow you to
determine which platform you are running on and use the appropriate token.

## Plugin Installation

In the root of your Cordova project run the following command:

```bash
cordova plugin add com.bugsee.cordova-plugin --save

# Optional: Install cordova-plugin device if you use both iOS and Android platform
cordova plugin add cordova-plugin-device --save
```

## Initialization

:::warning
iOS/iPadOS: Since v7.0.0 the underlying Bugsee iOS SDK supports the simulator; crash capture is excluded. For full functionality, launch your app with Bugsee on a real device.
:::

Initialize the Bugsee plugin when your application starts, preferably when the *deviceready* event fires, e.g.:

```javascript
onDeviceReady: function() {
  app.receivedEvent('deviceready');

  var appToken = (device.platform == "Android")?"<ANDROID_APP_TOKEN>":"<IOS_APP_TOKEN>";
  Bugsee.launch(appToken);
},
```