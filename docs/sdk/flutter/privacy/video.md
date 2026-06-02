---
title: "Privacy and video"
description: "How to disable video recording or obscure sensitive Flutter views and screen regions to protect user privacy in recorded sessions."
sidebar_position: 1
slug: "/sdk/flutter/privacy/video"
---

## Disabling video

Video recording can be disabled completely using **videoEnabled** launch option. See [configuration](/sdk/flutter/configuration/) for more info.

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

You need to be aware of the orientation that can be changed during application work.
Recreate all rectangles after orientation change, if 'black box' on video does not cover all secure data that you need.