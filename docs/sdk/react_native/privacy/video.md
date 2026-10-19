---
title: "Privacy: Video"
description: "How to keep sensitive screens out of Bugsee React Native SDK 7.x recordings with BugseeSecure, setSecureRectangles and blackout, what the view hierarchy contains, and the video options that matter for privacy."
sidebar_position: 2
slug: "/sdk/react_native/privacy/video"
---

:::warning[Beta]
This page documents Bugsee React Native SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/react_native/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/react_native/migration).
:::

Bugsee records the screen so that a report shows what the user saw. Anything on screen ends up in that video and in the report screenshot unless you mask it. The React Native SDK gives you three tools: `<BugseeSecure>` for components, `Bugsee.setSecureRectangles` for regions you measure yourself, and a blackout for a whole flow.

## Disabling video

Turn screen recording off entirely with the `captureVideo` launch option. The report screenshot has its own switch, `com.bugsee.option.capture.screenshot`; see [Video and screenshot options](#video-and-screenshot-options).

```ts
import Bugsee, { createDefaultLaunchOptions } from '@bugsee/react-native';

const options = createDefaultLaunchOptions();
options.captureVideo = false;
options.setCustomOption('com.bugsee.option.capture.screenshot', false);

Bugsee.launch('<your app token>', options);
```

## Hiding a component: `<BugseeSecure>`

Wrap anything that must never be recorded in `<BugseeSecure>`:

```tsx
import { Text } from 'react-native';
import { BugseeSecure } from '@bugsee/react-native';

function AccountNumber({ value }: { value: string }) {
  return (
    <BugseeSecure>
      <Text>{value}</Text>
    </BugseeSecure>
  );
}
```

While it is mounted and enabled, the part of it that is on screen is masked in the video and in the report screenshot, and touches on it are dropped from the report.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | While `false`, nothing is masked and nothing is measured. |
| Other `View` props | | | `<BugseeSecure>` renders a `View`, and passes `style`, `onLayout` and the other `View` props to it, except `ref` (it does not forward a ref) and `collapsable` (always `false`, so the view is never flattened away). Style it as you would the `View` it replaces. |

How the mask follows the component:

- **On screen only.** The mask is cut to every ancestor that clips the component (a `ScrollView`'s viewport, a view with `overflow: 'hidden'`). A component scrolled fully out of sight masks nothing, so it does not mask, or drop the taps on, what is shown in its place.
- **Movement.** It re-measures itself on every layout and every 100 ms, and every frame while it moves, so it follows scrolling. It also follows react-native-screens push and pop transitions, sliding `<Modal>`s, and `Animated` transforms driven by the native driver. Where it cannot tell exactly where the component is drawn, it masks more rather than less.
- **Hidden screens.** A component on an inactive react-native-screens screen (an inactive tab that stays mounted, for example), or hidden with `display: 'none'` or a hidden `<Activity>`, masks nothing.
- **Growth at once, removal late.** A larger area is masked at once. What the component stops covering, by shrinking, moving, being hidden or unmounting, stays masked for about half a second (up to about 800 ms around a screen or Modal transition), because the native side may still draw it there. Only `enabled={false}` unmasks at once.
- **Fails closed.** A measurement that fails leaves the last mask in place.

The view hierarchy marks everything inside `<BugseeSecure>` as secure; see [The view hierarchy](#the-view-hierarchy).

### Known limits

- Content that mounts in a pushed screen or an opening `<Modal>` after it arrived (behind a spinner, for example), or that is first shown on the screen a pop uncovers, is masked for the rest of the transition. When a screen came or went is known only if a `<BugseeSecure>` saw it; otherwise the first one to look masks as if it happened then: the whole screen, or the Modal's band, for under a second.
- A value a native event drives (an `Animated.event` in an `Animated` component's `onScroll` or `onGestureEvent`, or `Animated.attachNativeEvent`, which React Native's own `ScrollView` uses for `stickyHeaderIndices`) moves with the scroll or the gesture. What it transforms is masked wherever it can be drawn, for as long as the event is attached, idle or not:
  - through a clamped interpolation, one whose ends are flat (a swipeable row without overshoot), or a `diffClamp`: over its output range;
  - on Android, through a `ScrollView`'s `contentOffset`, vertical or horizontal (a collapsing or parallax header): over the offsets the `ScrollView` can reach, plus 64 dp either way for a fling's overrun. A view inside the content of that `ScrollView` (a sticky header, from `stickyHeaderIndices` or a `SectionList`) is masked over the `ScrollView`'s whole viewport;
  - anything else (a gesture's translation through an interpolation that extends, an iOS `ScrollView`, which bounces and can be scrolled anywhere by `scrollTo`, a `ScrollView` in another React root, or under a scale other than 1): the whole surface around it, cut by the clipping ancestors above it.
- Native events are followed from when `@bugsee/react-native` is first evaluated: with Metro's `inlineRequires`, its first use. Import it (or call `Bugsee.launch`) at the top of `index.js` to follow them from the start. A value made native before then is masked as if anything could drive it, until JavaScript next animates or sets it. A native event attached without `Animated` (code that calls React Native's native Animated module itself) is not seen at all.
- A transform animated from JavaScript (`useNativeDriver: false`) is followed every frame while its animation runs. Other styles a JavaScript animation moves (`top`, `left`, `margin`, a size) are followed by the 100 ms re-measure only.
- Reanimated runs its animations on the UI thread, out of JavaScript's sight. A Reanimated component whose style sets a transform through an animated style, sets a shared value inline, or uses a CSS animation or transition masks the whole surface around it. Other Reanimated motion (an animated style that adds a transform only later, layout animations, `entering` / `exiting`, shared element transitions) is not followed.
- An interactive back gesture (iOS swipe-back, Android predictive back) moves a mounted screen without anything JavaScript can see.
- The mask is published in the same JavaScript task that starts a native animation (or sets, resets or offsets an `Animated.Value`), but the two reach native code separately: under heavy load, the animation's first frame could still be drawn before the mask lands.
- How an ancestor clips is read from its React props. An `overflow` changed natively (through `setNativeProps` or a native-driven style) is not seen.

Where these limits matter, combine `<BugseeSecure>` with a [blackout](#blackout) for the duration of the sensitive flow.

## Password fields

The native SDKs mask password fields on their own, with no Bugsee call:

- **iOS**: a text field or text view whose `secureTextEntry` is on. React Native's `<TextInput secureTextEntry>` is one.
- **Android**: a text field with a password input type, which React Native's `<TextInput secureTextEntry>` sets, and, on Android 8.0 and later, a text field whose autofill hint marks it as a password or credit card field. React Native sets that hint from the `autoComplete` prop: `password`, `password-new`, `cc-number`, `cc-csc`, and `cc-exp` with its `-day`, `-month` and `-year` variants.

On iOS the masking lasts while `secureTextEntry` is on: a "show password" toggle that turns it off also lifts it. On Android, a field the SDK has detected as a password or card field stays masked until it leaves the screen. Wrap the field in `<BugseeSecure>` if you need the same behavior on both.

On Android, windows with the system `FLAG_SECURE` flag are also protected, unless you turn off the Android-only option `com.bugsee.option.capture.respect-flag-secure` (default `true`). An activity whose own window has `FLAG_SECURE` is treated as a full blackout while it is shown: black frames, no recorded input, and no view hierarchy.

## Hiding a region: `setSecureRectangles`

`Bugsee.setSecureRectangles(rectangles, display?)` masks regions you measure yourself, for content `<BugseeSecure>` cannot wrap:

```tsx
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import Bugsee from '@bugsee/react-native';

type Region = { x: number; y: number; width: number; height: number };

// Every mounted MaskedRegion, so that each call publishes all of them:
// setSecureRectangles replaces the whole list.
const regions = new Map<symbol, Region>();
const publishAll = () => Bugsee.setSecureRectangles([...regions.values()]);

function MaskedRegion({ children }: { children: ReactNode }) {
  const ref = useRef<View>(null);
  const [id] = useState(() => Symbol('MaskedRegion'));
  const [masked, setMasked] = useState(false);
  const mounted = useRef(true);
  const measurement = useRef(0);

  const publish = () => {
    // Hide the content again until the new rectangle is published.
    const generation = ++measurement.current;
    setMasked(false);
    ref.current?.measureInWindow((x, y, width, height) => {
      // Ignore a late callback: after unmount, or superseded by a newer measurement.
      if (!mounted.current || generation !== measurement.current) return;
      regions.set(id, { x, y, width, height });
      publishAll();
      setMasked(true);
    });
  };

  // Unmask when the component goes away, keeping the other regions.
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      regions.delete(id);
      publishAll();
    };
  }, [id]);

  return (
    <View ref={ref} onLayout={publish} style={{ opacity: masked ? 1 : 0 }}>
      {/* Lay the content out while it is transparent, and show it once its region is published. */}
      {children}
    </View>
  );
}
```

The example keeps its children transparent while their bounds are measured, and shows them once the rectangle is published, after every layout. A region is applied when a frame is captured, so content shown before then could appear unmasked in the first frames. It masks only content that is already laid out and does not move: content that mounts later without changing the wrapper's size, or that scrolls or animates, can leave the rectangle stale. For that, use `<BugseeSecure>` or a blackout. The example keeps the regions of all its mounted instances together; any other code that calls `setSecureRectangles` replaces them, so give the call a single owner.

| Argument | Type | Default | Description |
| --- | --- | --- | --- |
| `rectangles` | `SecureRectangle[]` | | `{ x, y, width, height }` objects, in React Native points, in the coordinates `measureInWindow` returns for a view in your app's root. An empty array clears the regions. |
| `display` | `number` | `0` | The display the regions apply to; `0` is the main display. On iOS only display `0` is recorded. |

- Each call **replaces** the regions the previous call set for that display. The regions are kept apart from those of mounted `<BugseeSecure>` components: clearing them never uncovers a component, and a component unmounting never clears them.
- The regions do not move with your layout. Measure again and call it again when the content moves.
- The call is synchronous and returns nothing. The regions are read when the screen is captured: a few times a second on Android, with every captured frame on iOS.
- The regions are always placed relative to your app's root view. A region measured inside a `<Modal>`, whose `measureInWindow` coordinates are relative to the Modal, can land in the wrong place; use `<BugseeSecure>` inside Modals.
- The whole call throws `RangeError`, and changes nothing, when a rectangle has a non-finite coordinate, a negative width or height, or an edge too large for a 32-bit integer, or when `display` is not a non-negative integer. A bad rectangle is not skipped, because the rest being published would look like the region was masked.
- Edges are rounded outward, so a region covers at most one unit more per edge than you asked for, never less: a pixel on Android, a point on iOS.
- On Android, until the SDK has read where your app's root view is on the display (a fraction of a second after the first call), the regions are served as the whole display.
- After a JavaScript reload, the regions the previous runtime set are cleared. Set them again from the new runtime.

## Blackout

`Bugsee.startBlackout()` and `Bugsee.endBlackout()` bracket a flow during which everything that describes the screen is suppressed:

```ts
import Bugsee from '@bugsee/react-native';

// Your own sensitive flow
declare function presentRecoveryCodesScreen(): Promise<void>;

async function showRecoveryCodes(): Promise<void> {
  Bugsee.startBlackout();
  try {
    await presentRecoveryCodesScreen();
  } finally {
    Bugsee.endBlackout();
  }
}
```

| Suppressed during a blackout | Recorded as usual |
| --- | --- |
| The video (black frames), the report screenshot (black), touch and gesture recording, and the view hierarchy. On iOS, also the keyboard and focus breadcrumbs. | Logs, network events, custom events and traces. |

- `Bugsee.isBlackout()` resolves to the current state, so you can check that a blackout took effect.
- **Before launch**: both platforms honor a blackout started before `Bugsee.launch`, and capture then starts blacked out. Call `startBlackout()` before `launch` to keep the first seconds of a session hidden. This does not cover Android [auto-launch](/sdk/react_native/expo#auto-launch-on-android): the SDK records from process start, before any JavaScript can call `startBlackout()`. On both platforms, `endBlackout()` before launch cancels it.
- **On stop**: the platforms differ. On Android, `Bugsee.stop()` ends the blackout and the next launch starts without one; call `startBlackout()` again before launching to keep it. On iOS, only `endBlackout()` ends a blackout: it stays on across `stop` and the next `launch`. A `relaunch` keeps an active blackout on Android.
- The SDK dispatches the `BlackoutStarted` and `BlackoutEnded` [lifecycle events](/sdk/react_native/lifecycle#lifecycle-events).

For a full stop of all capture, logs and network included, use `Bugsee.stop()`; see [Lifecycle & status](/sdk/react_native/lifecycle).

## The view hierarchy

With your root component wrapped in [`Bugsee.wrap`](/sdk/react_native/installation#4-launch-bugsee), a report carries a view hierarchy of what was on screen. The tree the package builds holds component names, bounds and the `testID` and `nativeID` of host views. It holds no text content and no other props. Inside a `<BugseeSecure>`, nodes are marked secure and carry no `testID` or `nativeID`.

`Bugsee.captureViewHierarchy()` captures the view hierarchy at once, outside the SDK's normal pass. Turn view hierarchy capture off with `com.bugsee.option.capture.view-hierarchy`; during a blackout it is not captured.

## Video and screenshot options

| Option | Key | Default | Description |
| --- | --- | --- | --- |
| `captureVideo` | `com.bugsee.option.capture.video` | `true` | Record the screen. |
| (no accessor) | `com.bugsee.option.capture.screenshot` | `true` | Attach a screenshot to each report, independently of the video. |
| (no accessor) | `com.bugsee.option.capture.screenshot.scale` | `1` | Scale the screenshot down and back up, which destroys fine detail such as small text. `1` turns it off. |
| (no accessor) | `com.bugsee.option.capture.video.scale` | `1` | Extra down-scaling of the recorded video, for example `0.5`, which also reduces detail. |
| (no accessor) | `com.bugsee.option.capture.video.quality` | `VideoQuality.Default` | Quality of the encoded video. |
| (no accessor) | `com.bugsee.option.capture.video.frame-rate` | `FrameRate.High` | How often frames are captured. |
| (no accessor) | `com.bugsee.option.capture.view-hierarchy` | `true` | Capture the view hierarchy. |
| `videoMode` (Android) | `com.bugsee.option.capture.video.mode` | `VideoMode.V2` | Android screen-capture strategy. |
| (no accessor, Android) | `com.bugsee.option.capture.respect-flag-secure` | `true` | Blank windows with `FLAG_SECURE`. |
| (no accessor, iOS) | `com.bugsee.option.capture.video.privacy-blur` | `true` | Blur transition frames instead of skipping them; off, the video freezes for the transition. |

The defaults are the same on both platforms; read the values in effect with [`Bugsee.getLaunchOptions()`](/sdk/react_native/configuration#reading-the-effective-options). See [Configuration](/sdk/react_native/configuration) for setting keys without an accessor.

```ts
import Bugsee, { createDefaultLaunchOptions } from '@bugsee/react-native';

const options = createDefaultLaunchOptions();
// Keep the video, but make small text unreadable in the screenshot and video
options.setCustomOption('com.bugsee.option.capture.screenshot.scale', 0.5);
options.setCustomOption('com.bugsee.option.capture.video.scale', 0.5);

Bugsee.launch('<your app token>', options);
```

## Related pages

- [Privacy overview](/sdk/react_native/privacy/overview): every privacy control.
- [Lifecycle & status](/sdk/react_native/lifecycle): stop, relaunch and lifecycle events.
- [Configuration](/sdk/react_native/configuration): every launch option.
