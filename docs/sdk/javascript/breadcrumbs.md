---
title: "Breadcrumbs"
description: "What breadcrumbs are in the Bugsee JavaScript SDK, which ones are recorded automatically, how to record your own with addBreadcrumb, and how to rewrite or drop them with setBreadcrumbFilter."
sidebar_position: 22
slug: "/sdk/javascript/breadcrumbs"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

Breadcrumbs are a short trail of steps leading up to an issue: a screen the user opened, a form they submitted, something your code decided. They appear on the report timeline. Unlike console logs, a breadcrumb is structured: it has a type, a category, a message and a data object.

The examples use the client returned by `launch`, kept in a module of your own:

```ts title="bugsee.ts"
import { launch } from '@bugsee/bugsee';

export const bugsee = await launch('<your_app_token>');
```

Import this module first in your entry file, before your app bootstraps, not lazily. Capture covers only what runs after `launch()`, and code that runs earlier is not recorded.

## Turning breadcrumbs on or off

Breadcrumb capture is **on by default** in the JavaScript SDK. The mobile Bugsee SDKs default it to off, because web UI breadcrumbs are a core signal.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `captureBreadcrumbs` | `boolean` | `true` | Record breadcrumbs: yours and the automatic ones. |
| `captureInteractions` | `boolean` | `true` | Browser. Also controls the automatic `ui.*` breadcrumbs, and the input stream. |

```ts
import { launch } from '@bugsee/bugsee';

export const bugsee = await launch('<your_app_token>', {
  captureBreadcrumbs: false, // no breadcrumb is recorded at all
});
```

A malformed `captureBreadcrumbs` value turns capture off and is reported through the `onError` launch option.

## Where breadcrumbs come from

- **Your code**, with `addBreadcrumb`.
- **User interface changes in the browser.** The SDK records `ui.change`, `ui.submit` and `ui.focus` breadcrumbs when a form value changes, a form is submitted, or an element gets focus. Each carries the target's element id, class and tag in `data` (`view.id`, `view.class`, `view.tag`) and never reads a value or any text the user typed. A field the SDK treats as sensitive, such as a password, and anything inside an element with a `data-bugsee-hidden` attribute, produces no breadcrumb at all.
- **Framework adapters.** Some adapters add breadcrumbs for navigation. For example the Next.js client hook records the destination of a route change.

During a [blackout](/sdk/javascript/lifecycle) the automatic `ui.*` breadcrumbs are not recorded. Breadcrumbs you add yourself still are.

## Record your own breadcrumb

```ts
import { bugsee } from './bugsee';

bugsee.addBreadcrumb({
  type: 'navigation',
  category: 'checkout',
  message: 'Opened the payment step',
  level: 'info',
  data: { step: 3, cartItems: 2 },
});
```

| Field | Type | Description |
| --- | --- | --- |
| `type` | `string` | A free-form kind, for example `navigation`, `user` or `http`. |
| `category` | `string` | A free-form group, for example `checkout` or `ui.click`. |
| `message` | `string` | A short description. |
| `level` | `'error' \| 'warning' \| 'info' \| 'debug' \| 'verbose'` | Severity of the step. |
| `data` | `Record<string, unknown>` | Extra structured detail. Keep it small and JSON-friendly. |
| `timestamp` | `number` | Milliseconds since the epoch. The SDK stamps the current time when you omit it. |

All fields are optional. The `Breadcrumb` and `BreadcrumbInput` types are exported by `@bugsee/bugsee`.

:::caution
`addBreadcrumb` does not sanitize anything. A breadcrumb is application data, so a URL with a token in `message` or `data` is recorded as it is. Redact it yourself, or use a [breadcrumb filter](#filter-breadcrumbs).
:::

### When nothing is recorded

`addBreadcrumb` does nothing when `captureBreadcrumbs` is `false`, or once the collector has switched the SDK off for your app.

## Filter breadcrumbs

`setBreadcrumbFilter(filter)` installs a function that sees every breadcrumb before it is recorded: yours, the automatic ones and the adapters'. Return the breadcrumb, changed or not, to keep it, or `null` to drop it. Pass `null` to remove the filter.

```ts
import { bugsee } from './bugsee';

const SECRET_PARAMS = /([?&](?:token|access_token|code|session)=)[^&#\s]*/gi;

bugsee.setBreadcrumbFilter((crumb) => {
  // Drop a whole category of your own breadcrumbs
  if (crumb.category === 'auth') {
    return null;
  }
  return {
    ...crumb,
    message: crumb.message?.replace(SECRET_PARAMS, '$1<redacted>'),
    // Remove data you do not want on a report
    data: crumb.data === undefined ? undefined : { ...crumb.data, email: undefined },
  };
});
```

The filter receives a `Breadcrumb`, which is the fields above with `timestamp` always set.

Rules:

- **A filter that throws drops the breadcrumb.** The error goes to `onError`, and nothing unredacted is recorded.
- **There is one filter at a time.** A later call replaces it. Set it right after `launch`. Breadcrumbs recorded before the filter is installed are kept as they are. `relaunch()` returns a new client, so set the filter again on it.
- **Your network filter does not reach breadcrumbs.** If a breadcrumb of yours carries a URL, redact it here. See [Privacy: Breadcrumbs](/sdk/javascript/privacy/breadcrumbs).

## Related pages

- [Privacy: Breadcrumbs](/sdk/javascript/privacy/breadcrumbs) — keep sensitive data out of the trail.
- [Console logs](/sdk/javascript/logs) — unstructured log lines.
- [Events & traces](/sdk/javascript/events-and-traces) — your own named events and values.
- [Configuration](/sdk/javascript/configuration) — every launch option.
