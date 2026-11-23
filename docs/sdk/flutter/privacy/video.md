---
title: "Privacy: Video"
description: "How to keep sensitive screens out of the video and screenshots Bugsee Flutter SDK 10.x records: BugseeSecureView, blackout, the video and screenshot options, and the limits of each."
sidebar_position: 14
slug: "/sdk/flutter/privacy/video"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta, is not published on pub.dev yet and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

Bugsee records the screen as a video and takes a screenshot when a report is made. A screen can show a card number, a password, a message or a medical record, so the SDK gives you three ways to keep it out: turn the recording off, hide a widget, or black out the whole screen for a sensitive flow.

## Disabling video and screenshots

Set `captureVideo` to `false` to record no video, and `captureScreenshot` to `false` to take no report screenshot:

```dart
import 'package:bugsee_flutter/bugsee_flutter.dart';

await Bugsee.launch(
  'YOUR_APP_TOKEN',
  options: const BugseeOptions(
    captureVideo: false,
    captureScreenshot: false,
  ),
);
```

## Hiding a widget: BugseeSecureView

Wrap what must not be recorded in `BugseeSecureView`. The area the child occupies is blanked in the recorded video and in the report screenshot, and taps on it are dropped from the report. The user sees the child as usual.

```dart
import 'package:bugsee_flutter/bugsee_flutter.dart';
import 'package:flutter/material.dart';

Widget build(BuildContext context) => Column(
  children: [
    const Text('Card number'),
    // Blanked in the recorded video and in the report screenshot.
    BugseeSecureView(child: TextField(obscureText: true)),
  ],
);
```

| Parameter | Type | Description |
| --- | --- | --- |
| `child` | `Widget` | Required. What to hide. |
| `enabled` | `bool` | Default `true`. `false` removes the redaction, and the child is recorded as usual. A disabled `BugseeSecureView` costs nothing. |

The widget needs nothing to be set up. Where the child is (on screen, scrolled, transformed or animated) is measured every frame and handed to the SDK, which reads it a few times a second. A region that is moving is covered along its path.

**It fails closed.** A region the plugin cannot place is covered whole: the entire display is blanked rather than guessed at. Only a view known to be off screen is left uncovered.

`BugseeSecureView` hides the child from Bugsee's capture. It does not hide it from the user or from the operating system, and it does not set `FLAG_SECURE`. On Android, the `captureRespectFlagSecure` option (default `true`) makes the SDK treat an activity whose main window has `FLAG_SECURE` as a full-display blackout, so a window you secure yourself is covered as well.

The [view hierarchy](/sdk/flutter/view-hierarchy#secure-views) records a `BugseeSecureView` as a single node, with no text and no children.

### Limits

- **A region that has just appeared is recorded in the clear for its first frame or so.** Dart can publish a region only after layout has placed it, so a newly mounted `BugseeSecureView` is not yet covered in its first frame. For something that must never be captured, keep the `BugseeSecureView` mounted and swap its content, instead of inserting the whole widget when the content appears.
- **Pixels drawn outside the region's own subtree are not covered.** An `Overlay` magnifier or tooltip, for example, is not part of the region.
- **A rotated region is covered by its bounding box**, and a partly clipped region is covered whole, so it can cover a few neighboring pixels.
- **Only the app's main view is placed on mobile.**
- **A hot-restarted isolate** that has no regions leaves the previous isolate's regions in place until the engine detaches. This happens in debug builds only and covers more, not less.
- **iOS is verified in portrait only.** Secure regions were verified on Android emulators at three screen densities and on iOS simulators; they were not verified on a physical device.
- A region with more than 2000 descendants is covered even when it is off screen.

On Android, the SDK's own report screenshot captures Flutter's default `SurfaceView` from Android SDK 7.5.0, with the secure regions redacted. Earlier SDK versions produced a black screenshot. This release of the plugin uses Android SDK 7.6.0.

## Android startup hold

On Android the plugin turns on the SDK's startup hold (`com.bugsee.wrapper-hold`). From process start the SDK blacks out every display until the first Flutter frame is up and Dart has published the secure regions, about 750 ms after that frame. Without it, a secure view that is already on screen at startup would be recorded before Dart could say where it is.

- **The first seconds of a session are not recorded on Android.** In a profile build the hold was released 3.8 seconds after process start, 1.3 seconds after the first frame.
- **Time caps bound the hold**: 10 seconds after the last Flutter engine that attached before a frame was displayed, 20 seconds after process start when none ever attached, and 60 seconds at most. A hold that a cap ends does not guarantee that Dart had published its secure regions. The cap is a safety limit, not a privacy guarantee.
- **It happens once per process.** A second engine, a hot restart or a relaunch is not held again.
- iOS has no such hold.

You do not need to call anything to release the hold.

## Blackout

`Bugsee.startBlackout()` stops recording everything that describes the screen, for as long as you need it: the video (black frames), the report screenshot, touch recording and the view hierarchy. Logs, network events, traces and the rest keep being captured. `Bugsee.endBlackout()` ends it, and `Bugsee.isBlackout()` tells whether one is in effect.

```dart
await Bugsee.startBlackout();
try {
  await showPaymentSheet();
} finally {
  await Bugsee.endBlackout();
}
```

- **There is no pause and no resume.** A blackout does not suspend the log or network capture.
- **You can call `startBlackout` before `launch`** on both platforms. Capture then starts blacked out, and `isBlackout` reflects it at once.
- **On Android a blackout lasts from launch to `stop`.** Stopping ends it, with a `BlackoutEnded` lifecycle event, and a later launch starts without one. A blackout requested while the SDK is stopping is handed to the next launch.
- **Network events keep recording.** A blackout does not hide a request from the network capture; use the [network filter](/sdk/flutter/privacy/network) for that.

## Video and screenshot options

| Option | Default | Platforms | Description |
| --- | --- | --- | --- |
| `captureVideo` | `true` | Both | Record video. |
| `captureScreenshot` | `true` | Both | Take the report screenshot. |
| `captureVideoScale` | `1.0` | Both | Additional down-scaling of the recorded video, between `0.1` and `1.0`. `0.5` halves the width and the height. |
| `captureScreenshotScale` | `1.0` | Both | Scales the screenshot down and back up before it is stored, which blurs fine detail while keeping the layout. **It is not a redaction control**: large, high-contrast text can stay readable. Use a secure view or blackout for anything sensitive. Clamped to `0.05` to `1.0`; `1.0` turns the effect off. |
| `captureViewHierarchy` | `true` | Both | Capture the view hierarchy. See [View hierarchy](/sdk/flutter/view-hierarchy). |
| `captureRespectFlagSecure` | `true` | Android | Treat a window with `FLAG_SECURE` as a full-display blackout. Independent of `startBlackout`. |
| `captureVideoPrivacyBlur` | `true` | iOS | Blur transition frames instead of skipping them. Off, the video freezes for the transition and never records it unprotected. |
| `captureVideoSecureScrolling` | `false` | Android | In video mode `v1`, skip more frames while secure views are on screen. |

An option marked for one platform is skipped on the other, with a debug warning. See [Configuration](/sdk/flutter/configuration).

## Password fields

A Flutter `TextField` is drawn by Flutter, not as a native password control, and the plugin documents no automatic masking of Flutter text fields. Do not rely on `obscureText` to keep a field out of the video: wrap the field in `BugseeSecureView`.

## Related pages

- [Privacy overview](/sdk/flutter/privacy/overview)
- [View hierarchy](/sdk/flutter/view-hierarchy)
- [Lifecycle](/sdk/flutter/lifecycle): the `BlackoutEnded` event and the launch status.
