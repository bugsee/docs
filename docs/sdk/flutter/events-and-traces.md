---
title: "Custom events & traces"
description: "Record custom events, traces, log lines, breadcrumbs and notifications with Bugsee Flutter SDK 10.x: Bugsee.event, trace, log, addBreadcrumb and notify, the values they accept, and what is dropped before launch."
sidebar_position: 10
slug: "/sdk/flutter/events-and-traces"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta, is not published on pub.dev yet and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

Besides what Bugsee captures automatically, you can add your own signals to the session a report replays:

- **Events** mark that something happened (`checkout`, `onboarding_skipped`), optionally with parameters.
- **Traces** follow how one value changes over time (`cart-size`, `logged-in`), so you can see its state right before a problem.
- **Log lines** are your own deliberate lines in the report's log.
- **Breadcrumbs** are a trail of what the user did (off by default).
- **Notifications** go to your Slack or Teams integration without creating a report.

All of them are `Future`-returning statics on `Bugsee` and assume `import 'package:bugsee_flutter/bugsee_flutter.dart';`. An invalid argument is reported through the `Future` as a `BugseeArgumentException`, before anything reaches the SDK.

**Nothing is held until launch.** `event`, `trace`, `log` and `addBreadcrumb` are dropped before `Bugsee.launch` and after `Bugsee.stop`; `notify` is ignored (the SDK logs it). Nothing is queued and nothing throws. Record them after `launch`.

## Custom events

`Bugsee.event(name, [params])` records a named event on the report timeline:

```dart
// Without parameters
await Bugsee.event('payment_processed');

// With parameters
await Bugsee.event('payment_processed', {
  'amount': 125,
  'currency': 'USD',
  'items': [
    {'sku': 'A-100', 'quantity': 2},
  ],
  'coupon': null,
});
```

`name` must not be empty. `params` is a `Map<String, Object?>`; leave it out for an event without parameters. Its values may be `null`, `bool`, `num`, `String`, and `List`s and `Map<String, ...>`s of those.

| Rule | Detail |
| --- | --- |
| Numbers | Finite and below 2^63 in magnitude. |
| Depth | At most 16 levels. |
| Rejected | A cycle, a non-string map key or any other type. The `BugseeArgumentException` names the path of the bad value, for example `params.a.b[1]`. |
| Copy | The map is copied, so changing it afterwards changes nothing. |
| `null` values | A `null` member stays a `null` member on both platforms. |

## Traces

`Bugsee.trace(name, value)` records the value of a named signal at this moment:

```dart
await Bugsee.trace('cart-size', 3);
await Bugsee.trace('logged-in', true);
await Bugsee.trace('last-screen', 'checkout');
```

`value` is a `String`, `bool`, `int` or a finite `double` below 2^63 in magnitude. Call it each time the value changes.

## Log lines

`Bugsee.log(message, {level = LogLevel.info})` adds a line to the report's log:

```dart
await Bugsee.log('payment declined', level: LogLevel.warning);
```

`LogLevel` has `error`, `warning`, `info`, `debug` and `verbose`. This is the app-level log: it does not print to the console, it is recorded as your application's own deliberate line (source `Bugsee`), and it bypasses the log filter. The capture of Dart's `print` and `debugPrint` is separate and recorded with another source; see [Console logs](/sdk/flutter/logs).

## Breadcrumbs

A breadcrumb is a short entry in the report's trail ("opened the cart", "navigated to /settings"). Breadcrumb capture is **off by default** on both SDKs. Turn it on at launch with `captureBreadcrumbs`:

```dart
await Bugsee.launch(
  '<your app token>',
  options: const BugseeOptions(captureBreadcrumbs: true),
);

final taken = await Bugsee.addBreadcrumb(
  const BugseeBreadcrumb(
    category: 'nav',
    message: 'opened cart',
    level: BreadcrumbLevel.info,
    type: 'navigation',
    data: {'items': 3},
  ),
);
```

| `BugseeBreadcrumb` field | Notes |
| --- | --- |
| `category` | Required. A short grouping such as `navigation`, `ui` or `http`. |
| `message` | Required. |
| `level` | A `BreadcrumbLevel`: `debug`, `info` (default), `warning`, `error` or `fatal`. iOS has no `fatal` level and records it as `error`. |
| `type` | The kind of entry; default `'default'` (for example `user`, `navigation`, `error`). |
| `data` | Optional extra values; the same types as event parameters. |

The `Future` completes with whether the SDK was handed the breadcrumb. `false` means it was not: capture is off, or the SDK is not launching or launched (before launch and after `stop`). `true` is not proof that it is recorded, because a native breadcrumb filter set by your app may still drop it. `captureBreadcrumbsExtras` (default `false`) adds the raw notification payload to automatically collected device-event breadcrumbs.

The SDK also collects its own breadcrumbs when capture is on. On Android these include `http` breadcrumbs that keep the URL's query string as given; see [Network privacy](/sdk/flutter/privacy/network).

## Notifications

`Bugsee.notify` sends a message to the messaging integrations configured for your app (Slack, Teams, and so on) without creating a bug report: no video, logs or events are attached.

```dart
await Bugsee.notify(
  'Deploy finished',
  body: 'v2.1 is live',
  severity: ReportSeverity.medium,
  fields: {'environment': 'production', 'build': '4821'},
  urgent: false,
);
```

| Argument | Type | Notes |
| --- | --- | --- |
| `title` | `String` | Required, must not be blank. |
| `body` | `String?` | Optional text. |
| `severity` | `ReportSeverity?` | Optional. |
| `fields` | `Map<String, String>?` | Extra rows. Order is kept on Android; iOS takes an unordered dictionary. |
| `urgent` | `bool` | Default `false`. The SDK keeps a notification on the device and uploads in batches, so nothing is lost offline; `true` posts it at once, ahead of older queued ones, when a session and a network exist. |

Ignored before `launch`: the SDK logs a line and drops it.

## Limits

- Write-only calls (`event`, `trace`, `log`, `notify`) have no read-back in the SDKs. The calls complete without error while launched; whether and how they appear in the dashboard is the SDK's.
- Nothing is queued: a call before `launch` or after `stop` is lost.
