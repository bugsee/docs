---
title: "Custom events & traces"
description: "Record your own events and traces on the report timeline with the Bugsee JavaScript SDK: event and trace, what the SDK records on its own, and the options that control system data."
sidebar_position: 23
slug: "/sdk/javascript/events-and-traces"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

Events and traces are the two ways to put your own data on the report timeline:

- An **event** is something that happened at a moment in time: `checkout_started`, `coupon_applied`. It has a name and optional parameters.
- A **trace** is a named value that changes over time: `cart_size`, `queue_length`. Each call adds one point to the curve.

The examples use the client returned by `launch`, kept in a module of your own:

```ts title="bugsee.ts"
import { launch } from '@bugsee/bugsee';

export const bugsee = await launch('<your_app_token>');
```

Import this module first in your entry file, before your app bootstraps, not lazily. Capture covers only what runs after `launch()`, and code that runs earlier is not recorded.

## Custom events

```ts
import { bugsee } from './bugsee';

bugsee.event('checkout_started');
bugsee.event('coupon_applied', { code: 'SPRING', discountPercent: 15 });
```

`event(name, params?)` takes a `string` name and an optional object of parameters. The SDK stamps the time of the call. Parameters travel with the report as JSON, so keep them to strings, numbers, booleans, arrays and plain objects.

## Custom traces

```ts
import { bugsee } from './bugsee';

bugsee.trace('cart_size', 3);
bugsee.trace('queue_length', 120);
bugsee.trace('current_plan', 'pro');
```

`trace(name, value)` takes a `string` name and a value. Use a number for a value you want to see as a curve.

## What these calls do not do

- They do nothing after the SDK has been switched off for your app.
- There is no filter for events and traces. Whatever you pass is recorded, so do not put personal data or secrets in names or parameters.
- The SDK validates nothing here. A name or value that cannot be serialized as JSON can be lost.

:::note
Events and traces you record are kept apart from the ones the SDK records itself. The SDK never writes into your event and trace streams, and you never overwrite its own.
:::

## What the SDK records by itself

Besides your own data, the SDK records **system events** and **system traces**. They appear on the same timeline.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `captureSystemEvents` | `boolean` | `true` | Record system events, such as the process start and, in the browser, the page being hidden. |
| `captureSystemTraces` | `boolean` | `true` | Record system traces, such as memory use, in a browser also the sanitized page address, and on Node.js the process metrics. |

```ts
import { launch } from '@bugsee/bugsee';

export const bugsee = await launch('<your_app_token>', {
  captureSystemEvents: true,
  captureSystemTraces: false,
});
```

In a hidden or background browser tab, timers are throttled or frozen and animation frames stop. Before a report is built, Bugsee re-records any held trace (such as memory use) that has gone stale at the end of the capture range, and carries the value in force to its start, so the traces cover the whole range. Polled values such as frame rate are never carried, so a hidden tab shows an honest gap there. For a report opened from the report dialog, the range ends when the dialog opened.

A malformed value turns the option off and is reported through the `onError` launch option. For the options that tune individual browser traces, see [Configuration](/sdk/javascript/configuration).

## Route and view

`setRoute(route)` and `setView(view)` record the screen the user is on as system traces. Framework adapters call them for you on every navigation. Call them yourself when your app has its own router.

```ts
import { bugsee } from './bugsee';

// Pass the route PATTERN, never the URL with real ids
bugsee.setRoute('/orders/:id');

// A name, or a name and the type of view
bugsee.setView({ name: 'OrderDetails', type: 'page' });
bugsee.setView(null); // no view
```

`setRoute` expects a router pattern. The SDK strips any query and fragment, redacts an email address in a path segment, and clips the string at 1024 characters. A value that is empty or not a string is ignored. These traces are written where the platform records a page or screen: the browser, and an Electron renderer. On Node.js and the edge runtimes the call is accepted and writes nothing.

## Related pages

- [Breadcrumbs](/sdk/javascript/breadcrumbs) — a structured trail of steps.
- [User & session data](/sdk/javascript/user-session-data) — attach an identifier and attributes to every report.
- [Console logs](/sdk/javascript/logs) — text lines on the timeline.
- [Performance](/sdk/javascript/performance) — transactions, spans and web vitals.
