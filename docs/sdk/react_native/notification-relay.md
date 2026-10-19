---
title: "Notification relay"
description: "Bugsee.notify in React Native SDK 7.x: sending a title, body, severity and fields straight to your messaging integrations and webhooks, without creating a bug report."
sidebar_position: 19
slug: "/sdk/react_native/notification-relay"
---

:::warning[Beta]
This page documents Bugsee React Native SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/react_native/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/react_native/migration).
:::

`Bugsee.notify(...)` sends a title, an optional body, an optional severity and optional string fields to the messaging integrations and webhooks you have set up for the app, **without** creating a bug report. Notification relay has no equivalent in 6.x.

## When to use it

A bug report (video, logs, network traffic, an issue in the dashboard) is a lot to pay for when all you need is to tell a person what happened: "the payment webhook returned 500 for order 42". If your code already knows that, `notify` is the direct path: one call, a few strings, delivered to the destinations your team already has.

It is not a replacement for bug reports. It records no video, logs or network traffic, and creates no Bugsee issue, so there is nothing to open and investigate afterward. When you need a session someone can replay, use [bug reporting](/sdk/react_native/manual/bug-reporting) or [crash & error reporting](/sdk/react_native/manual/crash-error-reporting).

## API

```text
Bugsee.notify(
  title: string,
  body?: string | null,
  severity?: IssueSeverity,
  fields?: Readonly<Record<string, string>> | null,
  urgent?: boolean,
): void
```

```ts
import Bugsee, { IssueSeverity } from '@bugsee/react-native';

// Title only
Bugsee.notify('Payment webhook failed');

// With a body and a severity
Bugsee.notify('Payment webhook failed', 'Stripe returned a 500 for order 42', IssueSeverity.High);

// With fields
Bugsee.notify('Payment webhook failed', 'Stripe returned a 500 for order 42', IssueSeverity.High, {
  order_id: '42',
  provider: 'stripe',
  status_code: '500',
});
```

| Argument | Rules |
| --- | --- |
| `title` | Required. A string that is not empty or only whitespace. |
| `body` | A string. Omitted or `null`, the notification has no body. |
| `severity` | An `IssueSeverity` value, an integer from 1 to 5: `VeryLow`, `Medium`, `High`, `Critical`, `Blocker`. Omitted, it is sent as `0`, which both SDKs treat as unset. |
| `fields` | An object whose values are all strings. Omitted or `null`, the notification has no fields. The object is copied when you call `notify`. |
| `urgent` | A boolean. Omitted, the call is not urgent; see [Urgent notifications](#urgent-notifications). |

To pass `fields` or `urgent` without a severity, pass `undefined` for the arguments you skip: `null` is not accepted for `severity`.

`notify` checks its arguments before anything is queued, and throws (sending nothing) for:

| Input | Thrown |
| --- | --- |
| More than five arguments | `TypeError` |
| A `title` that is not a string, or is empty or only whitespace | `TypeError` |
| A `body` that is not a string or `null` | `TypeError` |
| A `severity` that is not a number | `TypeError` |
| A `severity` that is not an integer from 1 to 5 | `RangeError` |
| `fields` that is not an object or `null` (an array, for example), or a field value that is not a string | `TypeError` |
| An `urgent` that is not a boolean | `TypeError` |

Field order: on Android, the fields keep the order of `Object.keys` (the order you wrote them in, except that integer-like keys such as `'1'` and `'42'` come first); on iOS, the order is not specified.

### Before launch

A call made before `Bugsee.launch` is ignored: it is not queued, and nothing is sent. On iOS, a call made while the SDK is still launching may be dropped. Call `notify` after `launch` has resolved.

`notify` returns nothing and takes no callback, so you cannot tell from the app whether a notification reached the server.

## Offline behavior and batching

Each notification is stored on the device before anything is sent, so it normally survives the app being killed, and it waits while the device is offline. The queue is bounded on both platforms: at most 500 notifications or 1 MB, the oldest evicted first, and notifications older than 72 hours are discarded. If writing a notification to disk fails, it is kept in memory only and lost if the app is killed before it is sent. The native SDKs upload queued notifications in batches, not one request per call, and honor the `wifiOnlyUpload` option.

The `com.bugsee.option.config.notify-flush-delay` option (milliseconds, default `0`) sets how long the SDK waits before it sends what is queued. With `0` it starts as soon as a notification is stored; a positive value lets calls made in quick succession share one batch. It has no effect on an urgent notification's immediate attempt; an urgent notification that cannot go out at once waits with the queue, delay included.

```ts
import Bugsee, { createDefaultLaunchOptions } from '@bugsee/react-native';

const options = createDefaultLaunchOptions();
options.setCustomOption('com.bugsee.option.config.notify-flush-delay', 2000);

Bugsee.launch('<your app token>', options);
```

There is no option to turn notification relay on or off in the SDK: it is available whenever the SDK is launched.

The queue is bounded differently per platform. Android: a notification larger than 256 KiB once serialized (the title, body, severity and fields, together with the user, environment and attribute data the SDK adds) is dropped rather than queued, silently unless the SDK's internal logging is on. iOS: there is no limit per notification, but the queue holds at most 500 notifications and 1 MB, and the oldest are dropped, silently, when it is over either.

### Urgent notifications

With `urgent` set to `true`, the SDK tries to send that one notification at once, ahead of the queue, when the network is available (and allowed by `wifiOnlyUpload`). Otherwise the notification is queued like any other and sent with the next batch. An urgent call never sends the older queued notifications; it only decides whether this one skips ahead. It also needs an active session; on Android, the call must also be made in the app's main process (an iOS app has only one).

```ts
import Bugsee, { IssueSeverity } from '@bugsee/react-native';

Bugsee.notify(
  'Checkout is failing',
  'Five payment errors in the last minute',
  IssueSeverity.Critical,
  { region: 'eu-west' },
  true,
);
```

## Delivery

Calling `notify` delivers nothing on its own. Notification relay has to be turned on for the app in Bugsee, and its destinations chosen; until then the call succeeds on the device and nothing arrives.

- **Integrations**: each application mapping of an integration has a _Relay_ option, off by default, that forwards relayed notifications to it; see [Configuring integrations](/integrations/configuration#mapping-applications). A recipe receives a relayed notification in the shape of an issue; see [Event-based recipes](/integrations/recipes/recipes_notifications).
- **Webhooks**: a subscribed webhook receives the [`notification.relayed`](/webhooks/events#notificationrelayed) event, which documents the payload.

## Privacy

A relayed notification carries the title, body, severity and fields you pass, plus the current [user identifier](/sdk/react_native/user-session-data#user-identity), the [attributes](/sdk/react_native/user-session-data#attributes) you set, and an environment snapshot (app, platform and hardware details). It carries no video, logs, network traffic or view hierarchy.

Nothing scrubs the title, body or fields before they are sent: the log, network and breadcrumb filters do not apply to them. Do not put anything in them that must not leave the device.

## Related pages

- [Bug reporting](/sdk/react_native/manual/bug-reporting): when you need a full report.
- [User & session data](/sdk/react_native/user-session-data): the identifier and attributes a notification carries.
- [Configuration](/sdk/react_native/configuration): every launch option.
