---
title: "Privacy and video"
description: "How to disable video recording, define secure screen regions by coordinates, and hide the keyboard from capture in the Bugsee .NET SDK."
sidebar_position: 1
slug: "/sdk/dotnet/privacy/video"
---

## Disabling video

Video recording can be disabled completely using **VideoEnabled** launch option. See [configuration](/sdk/dotnet/configuration/) for more info.

## Protecting by coordinates

Bugsee allows hiding screen area by absolute coordinates as well:

> **Note:** BugseeSecureRect coordinates are in pixels, with origin (0,0) being the top left corner.

```csharp
// Coordinates are: X, Y, Width, Height

// Add secure rect
Bugsee.AddSecureRect(new BugseeSecureRect(10, 10, 100, 100));

// Remove secure rect
Bugsee.RemoveSecureRect(new BugseeSecureRect(10, 10, 100, 100));

// Remove all rectangles
Bugsee.RemoveAllSecureRects();

// Get all rectangles as BugseeSecureRect[]
Bugsee.GetAllSecureRects();
```

You need to be aware of the orientation that can be changed during application work.
Recreate all rectangles after orientation change, if 'black box' on video does not cover all secure data that you need.


## Hiding keyboard (iOS only)

In some cases you might want to prevent keyboard to be captured on video (as well as touches). You can use the following method to achieve the desired effect.

```csharp
// To let us capture keyboard
Bugsee.SetKeyboardVisibility(true);

// To prevent keyboard from being captured
Bugsee.SetKeyboardVisibility(false);
```