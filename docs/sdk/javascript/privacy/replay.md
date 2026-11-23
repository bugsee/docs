---
title: "Privacy: Replay"
description: "How to keep sensitive content out of Bugsee JavaScript SDK session replay: the default masking, the always-masked fields, the bugsee-mask, bugsee-block, bugsee-ignore, bugsee-unmask and bugsee-show classes, selectors, and blackout."
sidebar_position: 2
slug: "/sdk/javascript/privacy/replay"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

[Session replay](/sdk/javascript/session-replay) records the DOM of your page. The SDK masks what it records **before** it leaves the page, and the masking is fail closed: you opt content in, not out. This page covers the controls.

## Turn replay off

```ts
import { launch } from '@bugsee/bugsee';

await launch('<your_app_token>', { replay: false });
```

With `replay: false` the replay recorder is never loaded. For a single sensitive flow, use a [blackout](#blackout) instead.

## Defaults

| Option | Default | Effect |
| --- | --- | --- |
| `maskAllText` | `true` | Every text node is recorded as masked characters, with its length kept so the layout does not change. Attribute values are masked too, except the ones the page needs to render. |
| `maskAllInputs` | `true` | Every input value is masked. |
| `blockAllMedia` | `true` | `img`, `svg`, `video`, `audio`, `picture`, `object`, `embed`, `map`, `source` and `iframe` are recorded as empty placeholders of the same size. |
| `blockAllCanvas` | `false` | Canvas content is recorded only when the canvas add-on is on. See [Canvas](#canvas). |

You can relax a default, for example `maskAllText: false` to see page text. Elements you mark with `bugsee-mask` stay masked.

```ts
import { launch } from '@bugsee/bugsee';

await launch('<your_app_token>', {
  replay: {
    maskAllText: false, // record page text...
    maskAllInputs: true, // ...but never input values
    blockAllMedia: true,
  },
});
```

## Always masked

These inputs are masked whatever the options and the markup say. No option and no class lifts it:

| Field | Selector it matches |
| --- | --- |
| Passwords | `type="password"`, `autocomplete` containing `password` |
| Phone numbers | `type="tel"` |
| Payment cards | `autocomplete` containing `cc-` (`cc-number`, `cc-csc`, `cc-name` and the rest) |
| One-time codes | `autocomplete="one-time-code"` |

Matching is case-insensitive. The input events of these fields are not recorded either, so a changed value does not reach the replay even if `maskAllInputs` is `false`.

Use the right `type` and `autocomplete` values on your own sensitive fields. For other sensitive fields, add a `bugsee-mask` class.

## CSS classes

Mark elements in your markup with a class or a data attribute. Both forms work: `class="bugsee-mask"` and `data-bugsee-mask`.

| Class | Data attribute | Effect | Applies to |
| --- | --- | --- | --- |
| `bugsee-mask` | `data-bugsee-mask` | Mask the text and attribute values. | The element and everything inside it. |
| `bugsee-block` | `data-bugsee-block` | Record an empty placeholder of the same size. Nothing inside is recorded. | The element and everything inside it. |
| `bugsee-ignore` | `data-bugsee-ignore` | Ignore input events on the element. | The element. |
| `bugsee-unmask` | `data-bugsee-unmask` | Record text unmasked, when `maskAllText` is on. Sensitive inputs stay masked. | Text: the element and its content. An input value: the element only. |
| `bugsee-show` | `data-bugsee-show` | Record media, an iframe or a canvas that would be blocked. | The element only. |

```html
<section class="bugsee-block">
  <h2>Payment details</h2>
  <p>Nothing in this section reaches the replay.</p>
</section>

<p>Hello, <span class="bugsee-mask">Ada Lovelace</span></p>

<h1 class="bugsee-unmask">Orders</h1>

<img class="bugsee-show" src="/logo.png" alt="Company logo" />

<input name="notes" class="bugsee-ignore" />
```

:::caution
`bugsee-show` applies to the marked element only, not to its children. To record a canvas, put `bugsee-show` on the `<canvas>` itself. And `bugsee-unmask` on a container un-masks its text, but not the values of the inputs inside it. Mark each input.
:::

## Selectors

For content you cannot mark in markup, for example from a third-party widget, pass CSS selectors:

| Option | Effect |
| --- | --- |
| `maskTextSelector` | Mask the text of matching elements, in addition to `bugsee-mask`. |
| `blockSelector` | Block matching elements, in addition to `bugsee-block`. |
| `ignoreSelector` | Ignore input events of matching elements, in addition to `bugsee-ignore`. |

```ts
import { launch } from '@bugsee/bugsee';

await launch('<your_app_token>', {
  replay: {
    maskTextSelector: '.chat-message, [data-pii]',
    blockSelector: '#third-party-widget',
    ignoreSelector: 'input.internal-notes',
  },
});
```

An invalid selector cannot disable privacy. It is dropped and reported through the `onError` launch option, and where dropping it would weaken masking, the strictest setting for that kind of option is used instead.

## Iframes

An iframe is blocked by default, as a placeholder. Its document is never recorded, even when it is on your own origin. Add `bugsee-show` to an iframe to record it, and its content is then masked by the same rules as the rest of the page.

## Canvas

Canvas content is recorded only when you turn on the canvas add-on. It records pixels, and **canvas pixels are not masked**. Enable it only for canvases that never show sensitive data, and consider `blockAllCanvas: true` to record only the canvases you mark with `bugsee-show`:

```ts
import { launch } from '@bugsee/bugsee';

await launch('<your_app_token>', {
  replay: {
    canvas: { fps: 2 },
    blockAllCanvas: true, // only <canvas class="bugsee-show"> is recorded
  },
});
```

## Blackout

`startBlackout()` stops all visual and interaction capture (replay, input, the automatic `ui.*` breadcrumbs and the view hierarchy) until `endBlackout()`. Logs, network, traces and events continue.

```ts
import { bugsee } from './bugsee';

async function showCardForm(): Promise<void> {
  bugsee.startBlackout();
  try {
    await openCardForm(); // resolves when the user submits or cancels
  } finally {
    closeCardForm(); // remove the form on success AND on failure, before the blackout ends
    bugsee.endBlackout();
  }
}

declare function openCardForm(): Promise<void>;
declare function closeCardForm(): void; // removes the form from the page; safe to call twice
```

- A blackout is on or off. Calling `startBlackout()` twice and then `endBlackout()` once ends it.
- `startBlackout()` before the SDK has launched, or after `stop()`, does nothing and is not remembered. To start dark from the first frame, set `startInBlackout: true` in the launch options.
- `endBlackout()` resumes replay with a fresh full snapshot of the **live** page. If the sensitive view is still on screen then, the snapshot contains it. End the blackout only after the view is gone.
- `isBlackout()` tells you whether one is in force.

## What can still leak

- **URL attributes.** The values of `href`, `src` and `srcset` are recorded as the page has them. A signed link or an email address inside a URL is not masked by replay. Do not put secrets in URLs of links and images, or block the element.
- **Class names and ids.** They are recorded as they are. Do not put personal data in them.
- **Network and logs.** They are separate streams with their own controls. See [Network](/sdk/javascript/privacy/network) and [Console logs](/sdk/javascript/privacy/logs).

## Related pages

- [Session replay](/sdk/javascript/session-replay) — how replay works and its options.
- [Privacy overview](/sdk/javascript/privacy/overview) — all privacy controls.
- [Lifecycle](/sdk/javascript/lifecycle) — blackout events.
