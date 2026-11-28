---
title: "Privacy and video"
description: "How to disable video recording or obscure sensitive Flutter views and screen regions to protect user privacy in recorded sessions."
sidebar_position: 1
slug: "/sdk/flutter/v9/privacy/video"
---

:::caution[Previous version]
This page documents Bugsee Flutter SDK **9.x** (`bugsee_flutter` 9.x), the current stable release. The new **10.x** SDK is a rewrite for the Bugsee 7.x native SDKs and is in beta, not yet published to pub.dev: see [Migrating from 9.x to 10.x](/sdk/flutter/migration/) to evaluate it, or the [10.x overview](/sdk/flutter/overview/).
:::

## Disabling video

Video recording can be disabled completely using **videoEnabled** launch option. See [configuration](/sdk/flutter/v9/configuration/) for more info.

## Blackout

You can temporarily black out the whole video and stop recording touch events, without stopping the rest of the data capture (logs, network, events):

```dart
// Black out the video
Bugsee.pause();

// Resume normal video recording
Bugsee.resume();
```

## Protecting flutter views

Bugsee automatically obscures ```TextField``` views with ```obscureText``` option set to true. Also, you can wrap any view sub-tree with ```BugseeSecureView``` to make it obscured on video. ```BugseeSecureView``` has ```enabled``` option for your convenience, thus you don't need to add/remove the element to toggle obscuring on/off.

## Protecting by coordinates

Bugsee allows hiding screen area by absolute coordinates as well:

> **Note:** BugseeSecureRect coordinates are in pixels, with origin (0,0) being the top left corner.

```dart
// Coordinates are: X, Y, Width, Height

// Add secure rectangle
Bugsee.addSecureRect(new Rectangle(20, 20, 100, 100));

// Remove secure rectangle
Bugsee.removeSecureRect(new Rectangle(10, 10, 100, 100));

// Remove all rectangles
Bugsee.removeAllSecureRects();

// Get all rectangles as BugseeSecureRect[]
dynamic rectangles = await Bugsee.getAllSecureRects();
```

You need to be aware of the orientation that can be changed while the app is running.
Recreate all rectangles after orientation change, if 'black box' on video does not cover all secure data that you need.