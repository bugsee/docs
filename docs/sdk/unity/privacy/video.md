---
title: "Privacy and video"
description: "Disable video recording or hide sensitive screen regions in Unity using secure rectangles and pause/resume APIs."
sidebar_position: 1
slug: "/sdk/unity/privacy/video"
---

## Disabling video

Video recording can be disabled completely using **VideoEnabled** launch option. See [configuration](/sdk/unity/configuration/) for more info.

## Protecting by coordinates

Bugsee allows hiding screen area by absolute coordinates as well:

RectInt you make must be in pixels, with 0,0 coordinates in top left corner.

```csharp
Bugsee.AddSecureRect(new RectInt(10,10,100,100));

// Other methods
// Remove secure Rect
Bugsee.RemoveSecureRect(new RectInt(10, 10, 100, 100));

// Remove all rectangles
Bugsee.RemoveAllSecureRects();

// Get all rectangles (RectInt[])
Bugsee.GetAllSecureRects();
```

You need to be aware of the orientation that can be changed during application work.
Recreate Rect after orientation change, if 'black box' on video does not cover all secure data that you need.

## Going dark

In some rare cases you might want to conceal the whole screen and stop recording events completely. The following APIs will come in handy, no data is being gathered
between the calls to pause and resume.

```csharp
// To stop video recording use
Bugsee.Pause();

// And to continue
Bugsee.Resume();
```
