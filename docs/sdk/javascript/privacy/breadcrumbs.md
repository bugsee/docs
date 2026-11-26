---
title: "Privacy: Breadcrumbs"
description: "How to keep sensitive data out of the breadcrumbs the Bugsee JavaScript SDK records: the breadcrumb options, what the automatic ui breadcrumbs contain, and redacting or dropping breadcrumbs with setBreadcrumbFilter."
sidebar_position: 4
slug: "/sdk/javascript/privacy/breadcrumbs"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

Breadcrumbs record the steps leading up to an issue: the ones you add with `addBreadcrumb`, the automatic `ui.*` breadcrumbs in the browser, and the navigation breadcrumbs some framework adapters add. A message or data object can carry a URL with a token in it, an identifier, or a value from your own code. See [Breadcrumbs](/sdk/javascript/breadcrumbs) for how they are recorded. This page covers keeping sensitive data out.

## Breadcrumb options

Breadcrumb capture is **on by default** in the JavaScript SDK, unlike the mobile SDKs. Turning it off is the simplest control.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `captureBreadcrumbs` | `boolean` | `true` | Record breadcrumbs. When `false`, no breadcrumb is recorded, yours or the SDK's. |
| `captureInteractions` | `boolean` | `true` | Browser. When `false`, the automatic `ui.*` breadcrumbs and the input stream are not recorded. |

```ts
import { launch } from '@bugsee/bugsee';

await launch('<your_app_token>', {
  captureBreadcrumbs: true,
  captureInteractions: false, // keep your own breadcrumbs, drop the automatic ui.* ones
});
```

## What the automatic breadcrumbs contain

The browser records `ui.change`, `ui.submit` and `ui.focus` breadcrumbs. Each has the element's id, class and tag name in `data`. They never contain a value or text the user typed. A sensitive field (password, phone, card, one-time code) and any element inside an element with a `data-bugsee-hidden` attribute produce no breadcrumb at all.

Mark an area you want left out of these breadcrumbs. The input stream describes such an element only as masked:

```html
<form data-bugsee-hidden>
  <input name="ssn" />
</form>
```

During a [blackout](/sdk/javascript/privacy/replay#blackout) these breadcrumbs are not recorded.

## Breadcrumbs are not sanitized

`addBreadcrumb` applies no sanitizer. A URL you put in `message` or `data` is recorded as it is, and **your network filter does not reach breadcrumbs.** If you record a navigation or a request, scrub the URL yourself or in the filter below. The Next.js adapter sanitizes the destination it records, for example. Do the same for your own breadcrumbs.

## Redact with a filter

`setBreadcrumbFilter` sees every breadcrumb before it is recorded: yours, the automatic ones and the adapters'. Return the breadcrumb, redacted, to keep it, or `null` to drop it.

The example redacts the values of keys that look like secrets (`token`, `password` and similar) and scrubs every other string in a breadcrumb, whatever its category:

```ts
import { bugsee } from './bugsee';

const SECRET_PARAMS = /([?&](?:token|access_token|code|session)=)[^&#\s]*/gi;
const EMAIL = /[\w.%+-]+@[\w-]+(?:\.[\w-]+)+/g;

function scrub(text: string): string {
  return text.replace(SECRET_PARAMS, '$1<redacted>').replace(EMAIL, '<email>');
}

// Matches keys that usually hold a secret
const SECRET_KEY = /pass|secret|token|auth|key|cookie/i;

// Redacts values under a secret-looking key, and scrubs every other string, at any depth
function scrubValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return scrub(value);
  }
  if (Array.isArray(value)) {
    return value.map(scrubValue);
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = SECRET_KEY.test(key) ? '<redacted>' : scrubValue(item);
    }
    return out;
  }
  return value;
}

bugsee.setBreadcrumbFilter((crumb) => {
  // Drop a whole category of your own breadcrumbs
  if (crumb.category === 'auth') {
    return null;
  }
  return {
    ...crumb,
    message: crumb.message === undefined ? undefined : scrub(crumb.message),
    data: crumb.data === undefined ? undefined : (scrubValue(crumb.data) as Record<string, unknown>),
  };
});
```

Where `bugsee` is the client `launch` returned:

```ts title="bugsee.ts"
import { launch } from '@bugsee/bugsee';

export const bugsee = await launch('<your_app_token>');
```

Import this module first in your entry file, before your app bootstraps, not lazily. Capture covers only what runs after `launch()`, and code that runs earlier is not recorded.

What to know:

- **The filter fails closed.** If it throws, the breadcrumb is dropped, and the error goes to the `onError` launch option.
- **Install it right after `launch`.** Breadcrumbs recorded before the filter is installed are kept as they were.
- **One filter at a time.** A later call replaces it. `setBreadcrumbFilter(null)` removes it. After `relaunch()`, install it again on the new client.

## Related pages

- [Breadcrumbs](/sdk/javascript/breadcrumbs) — how breadcrumbs are recorded.
- [Privacy overview](/sdk/javascript/privacy/overview) — all privacy controls.
- [Privacy: Network](/sdk/javascript/privacy/network) — keep URLs and bodies out of network events.
