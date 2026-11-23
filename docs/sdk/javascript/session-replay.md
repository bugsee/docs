---
title: "Session replay"
description: "How the Bugsee JavaScript SDK records DOM session replay in the browser and Electron, the replay options, the canvas add-on, blackout, and the opt-in pixel video for Electron."
sidebar_position: 25
slug: "/sdk/javascript/session-replay"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

Session replay shows what the user saw in the minutes before a report: the page, the clicks and the scrolling, played back next to the logs and network events. Bugsee records the **DOM**, not pixels. It stores the page structure and each change to it, and the viewer rebuilds the page from that. This keeps the recording small and lets the SDK mask text before it leaves the page.

## What you get

| Runtime | Replay |
| --- | --- |
| Browser | On by default. Recorded in the page. |
| Electron | On by default in each renderer. The renderers stream to the main process, which owns the session. |
| Node.js, Bun, edge runtimes | Not applicable. There is no DOM. |

Replay needs a DOM. During server rendering, for example in a meta-framework's server pass, nothing is recorded, whatever the option says.

Replay is recorded in a rolling window, the length of the `maxRecordingTime` launch option (60 seconds by default), and goes into a report when one is created. It is not streamed continuously.

## Turn replay off or customize it

The `replay` launch option takes `false`, `true` or an options object.

```ts
import { launch } from '@bugsee/bugsee';

// Replay on, with defaults
await launch('<your_app_token>');

// Replay off. The replay code is never loaded.
await launch('<your_app_token>', { replay: false });
```

A value that is not a boolean or a plain object (`0`, `null`, `'false'`) turns replay **off** and is reported through the `onError` launch option. Replay captures page content, so it never stays on by accident.

The replay recorder is loaded as a separate chunk only when replay runs, so `replay: false` keeps it out of your page entirely.

## Replay options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `maskAllText` | `boolean` | `true` | Mask every text node. |
| `maskAllInputs` | `boolean` | `true` | Mask every input value. |
| `blockAllMedia` | `boolean` | `true` | Block images, video, audio, SVG and iframes. A blocked element becomes an empty placeholder of the same size. |
| `blockAllCanvas` | `boolean` | `false` | Block every `<canvas>`, except the ones you mark with `bugsee-show`. |
| `maskTextSelector` | `string` | none | Extra CSS selector whose text is masked. |
| `blockSelector` | `string` | none | Extra CSS selector whose elements are blocked. |
| `ignoreSelector` | `string` | none | Extra CSS selector whose input events are ignored. |
| `checkoutEveryNms` | `number` | `60000` | Interval of a full page snapshot, in milliseconds. It bounds the length of the window that can be kept. |
| `canvas` | `boolean \| { fps?, quality?, imageType? }` | off | Record `<canvas>` content. See [below](#record-canvas-content). |

```ts
import { launch } from '@bugsee/bugsee';

await launch('<your_app_token>', {
  replay: {
    maskAllText: true,
    blockSelector: '.private-panel',
    ignoreSelector: '.secret-input',
  },
});
```

Masking is fail closed. Text, input values and media are masked or blocked unless you relax that. An invalid CSS selector is dropped and reported, and where dropping it would weaken privacy the strictest setting is used instead. Masking rules, the CSS classes and the always-masked fields are on the [Privacy: Replay](/sdk/javascript/privacy/replay) page.

## Mark elements in your markup

You can control single elements with a class or a data attribute, without code:

```html
<div class="bugsee-mask">Account number: 12345</div>
<div class="bugsee-block"><img src="/avatar.png" alt="" /></div>
<span class="bugsee-unmask">Order #1042</span>
<img class="bugsee-show" src="/logo.png" alt="Logo" />
```

See [Privacy: Replay](/sdk/javascript/privacy/replay#css-classes) for what each class does.

## Record canvas content

A `<canvas>` is a bitmap, so by default it is empty in the replay. The canvas add-on records its pixels. It is off by default, and it is loaded only when you enable it.

```ts
import { launch } from '@bugsee/bugsee';

await launch('<your_app_token>', {
  replay: {
    canvas: { fps: 2, quality: 0.6, imageType: 'image/webp' },
  },
});

// Or with the defaults:
// replay: { canvas: true }
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `fps` | `number \| 'all'` | `2` | Snapshots per second, clamped to 1 through 60. `'all'` records every draw call and is heavier. |
| `quality` | `number` | `0.6` | Image quality from 0 to 1. |
| `imageType` | `'image/webp' \| 'image/jpeg'` | `'image/webp'` | Image format. |

:::caution
Canvas pixels are recorded **unmasked**. Enable the add-on only for canvases that never show sensitive data. To record only some canvases, set `blockAllCanvas: true` and add the `bugsee-show` class, or a `data-bugsee-show` attribute, to each canvas you want. Put it on the `<canvas>` element itself.
:::

## Blackout

A blackout stops visual and interaction capture until you end it: replay, input, the automatic `ui.*` breadcrumbs and the view hierarchy. Logs, network events, traces and events carry on.

```ts
import { bugsee } from './bugsee';

bugsee.startBlackout();
// ... show the sensitive screen ...
bugsee.endBlackout();
```

When the blackout ends, replay resumes with a fresh full snapshot taken from the live page. End the blackout only **after** the sensitive view has gone, or the snapshot contains it. To start dark from the first frame, set the `startInBlackout` launch option. See [Lifecycle](/sdk/javascript/lifecycle).

## Pixel video in Electron

Electron records DOM replay by default, like the browser. It also offers an opt-in pixel video, for apps where DOM replay cannot show what matters, for example a window drawn by native code. You supply a capture source in the `video` option of `launchMain`. The video is taken when a report is created, and the OS may ask for screen capture permission. See [Electron](/sdk/javascript/platforms/electron).

## What replay does not record

- **Typed characters.** Input values are masked by default (`maskAllInputs: true`), and keystrokes are not recorded as text. If you set `maskAllInputs: false`, input values of ordinary fields are recorded as typed. Sensitive fields (password, tel, card and one-time-code) are always masked and their input events are ignored.
- **The report dialog.** The recording is frozen before the dialog opens, so what the user types into it is not in the replay of that report.
- **Iframes**, by default. A blocked iframe is an empty placeholder: its document is never recorded. Mark an iframe `bugsee-show` to record it. Its content is then masked like the rest of the page.

## Related pages

- [Privacy: Replay](/sdk/javascript/privacy/replay) — masking rules and CSS classes.
- [Browser](/sdk/javascript/platforms/browser) — the browser SDK.
- [Electron](/sdk/javascript/platforms/electron) — main and renderer setup.
- [Lifecycle](/sdk/javascript/lifecycle) — blackout and the SDK states.
- [Configuration](/sdk/javascript/configuration) — every launch option.
