---
title: "View hierarchy"
description: "What the Flutter widget tree in a Bugsee Flutter SDK 10.x report contains (widget type names and boxes only), when it is built, how fresh it is, and how to turn it off."
sidebar_position: 12
slug: "/sdk/flutter/view-hierarchy"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta, is not published on pub.dev yet and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

A report carries the view hierarchy: a tree of the elements on screen, with their positions and sizes, that the Bugsee viewer shows next to the video.

A Flutter app is one native view, so the native SDKs' own capture sees a single `FlutterView` and nothing of the UI. The plugin therefore also builds the **Flutter widget tree** and gives it to the SDK, which stores it in the report beside the native tree. Nothing is needed to enable it: it is on by default, and it follows the SDK's own `captureViewHierarchy` option.

## What the tree contains

Each node of the Flutter tree describes one widget that is on stage and painted:

| Field | Meaning |
| --- | --- |
| `class_name` | The widget's `runtimeType` without generic arguments (`Scaffold`, `Text`, `_LoginState`), at most 80 characters. The root is `FlutterView`; a secure view is `BugseeSecureView`. |
| `base_class_name` | For widgets that own a render object, the render object's type (`RenderPadding`). |
| `bounds` | The box on the screen, in the unit of the platform's native tree (physical pixels on Android, points on iOS), rounded outward. |
| `options` | Only what is set: `secure`, `clickable` (a tap or long-press callback exists), `alpha` (an `Opacity` value), `content_kind` (`image` or `surface`, which says that pixels exist and nothing about them). The root also carries `age_ms`, `device_pixel_ratio`, `obfuscated` and `truncated`. |
| `subitems` | The painted children, in paint order, back to front. |

Only what is on stage and painted is listed. These are not in the tree: an `Offstage` subtree, a `Visibility(visible: false)`, a zero `Opacity`, the other children of an `IndexedStack`, a route an opaque route covers, a widget wholly outside the screen or outside a clip of an ancestor (a list item scrolled out of its viewport), and a widget that was never laid out. Inherited widgets such as `Theme` and `MediaQuery` have no box and are not nodes.

The soft keyboard and native windows are not Flutter's, so they come from the native tree. Only the app's main view (the implicit view) is described on mobile.

Under `--obfuscate`, type names are minified, and the root says so (`options.obfuscated`). They are flagged, not decoded.

## What it never contains

The SDK stores the Flutter tree without reading it, so the plugin enforces what goes into it. The tree is built from **type names and structure only**. It never contains:

- text of any kind: the content of `Text`, `RichText`, `SelectableText`, text fields, chips or list tiles;
- the value of a `TextEditingController` or anything the user typed;
- semantics labels, hints, values, identifiers or tooltips;
- a `Key` or `ValueKey`, a `Hero` tag, a route name or a restoration id;
- the result of `toString()` on a widget or element;
- image data.

Every name in the tree is an identifier (`[A-Za-z_$][A-Za-z0-9_$]*`); anything else is replaced by `Widget` (or `RenderObject`). A widget's node `id` is its position in the snapshot, not derived from anything your app wrote.

A class name is chosen by you as a developer and is not user data, but it is the one thing the tree says about your own code. Keep that in mind if a class name itself would be sensitive.

If building the tree fails for any reason, nothing is sent, and the previous snapshot is taken back. Nothing is thrown into your app.

### Secure views

A [`BugseeSecureView`](/sdk/flutter/privacy/video#hiding-a-widget-bugseesecureview) subtree is **one node**: the node is named `BugseeSecureView`, carries `secure: true` and a box that covers the same area as the video mask, and has nothing below it, not even the type names of the children.

Two cases are not covered, the same as for the video mask:

- Pixels a widget draws outside its own subtree (an `Overlay` tooltip or magnifier) are not part of the secure node. They appear as ordinary nodes with their type and box, never text.
- A secure region that has just appeared is described as an ordinary subtree (type names and boxes) until the next snapshot, at most the throttle plus the frame it appeared in.

### Blackout

During a [blackout](/sdk/flutter/privacy/video#blackout) the view hierarchy is not captured.

## When it is built

The plugin keeps a copy of the tree up to date, and the SDK reads it when it makes a report. Dart builds the tree only when all three hold:

1. The SDK is `launched`.
2. The `captureViewHierarchy` option is on (it is by default).
3. The app is in the foreground.

Otherwise nothing is built, and the copy the SDK would read is cleared. A detached engine serves nothing, never a stale tree.

While it is active, the plugin is built not to disturb your UI:

- It builds only after a frame or from a timer, never inside a frame, and schedules no frame of its own. An idle app does no work.
- It builds after the app has been quiet for 100 ms, so a scroll, a fling or an animation is not delayed by it. A screen that never stops drawing (a spinner) gets one build every 3 seconds.
- It spaces builds at least 300 ms apart, more after an expensive build, and sends a snapshot only when it changed.

## Calling it yourself

```dart
await Bugsee.captureViewHierarchy();
```

`Bugsee.captureViewHierarchy()` brings the plugin's copy up to date and asks the SDK to capture the view hierarchy now and keep it in the capture buffer, so it is in any report created afterwards. The SDK also captures it for every report on its own, at the moment the report is made, so you only need this call to get a screen that has just changed. If a frame is already scheduled (a route was just pushed), the call waits for it, up to 3 frames and 400 ms, then builds at once.

It does nothing before `launch`, after `stop`, and when the `captureViewHierarchy` option is off.

## Turning it off

```dart
await Bugsee.launch(
  'YOUR_APP_TOKEN',
  options: const BugseeOptions(captureViewHierarchy: false),
);
```

`captureViewHierarchy` is `true` by default and applies to both the native tree and the Flutter tree.

## Freshness

The Flutter tree is as of the last frame that changed it, plus the wait for a quiet app. Flutter draws only on a frame, so a screen that has not changed is described exactly, however old the snapshot is. A report made within about 400 ms of a change, in the middle of a scroll or an animation, or up to 3 seconds into an endless animation, can carry the screen from before the change. The root's `options.age_ms` says how old the snapshot is.

## Limits

- **Size.** The walk stops after 12 ms (about a third of one frame while a frame is due), 2000 nodes, 256 KiB or 512 element levels. A tree over a limit is cut, and the nodes whose children were cut carry `truncated: true`; the answer is still valid. A tree larger than the byte limit is dropped, not trimmed. A stock Material screen of about 770 nodes is not cut.
- **Debug builds are slower.** Building the tree takes several times longer in a debug build than in a profile or release build, so a large screen can be cut in debug. The integration test for the hierarchy fails in debug builds on the Android phone and the iPhone XS used in verification, and passes in profile builds. See the [FAQ](/sdk/flutter/faq).
- **One view.** Only the app's main Flutter view is described on mobile. A Flutter view that is not at the screen origin (add-to-app, split screen) is covered by unit tests, not verified on a device.
- **Several displays (Android).** The SDK does not say which display asks, so a Flutter display's tree can be served for another display's pass when nothing blanks it. The plugin serves nothing when the Flutter window has `FLAG_SECURE` (with `captureRespectFlagSecure` on, the default), during a blackout, or when it cannot tell.
- **iOS reports.** That the tree reaches an uploaded report bundle is shown on Android only; on the iOS simulator the test reads the SDK's capture buffer instead.

## Related pages

- [Privacy: Video](/sdk/flutter/privacy/video): `BugseeSecureView` and blackout.
- [Privacy overview](/sdk/flutter/privacy/overview): what a report can contain.
- [Configuration](/sdk/flutter/configuration): the full option list.
