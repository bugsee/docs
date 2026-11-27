---
title: "Notification relay"
description: "Bugsee.Notify in Unity SDK 7.x: send a title, body, severity and fields straight to your messaging integrations and webhooks, without creating a bug report."
sidebar_position: 19
slug: "/sdk/unity/notification-relay"
---

:::warning[Beta]
This page documents Bugsee Unity SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/unity/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/unity/migration).
:::

`Bugsee.Notify` sends a title, an optional body, a severity and optional string fields to the messaging integrations and webhooks you set up for the app, **without** creating a bug report. No video, logs, network events or events are attached. The call works the same on Android and iOS.

## When to use it

A bug report (video, logs, network traffic, an issue in the dashboard) is a lot to pay for when all you need is to tell a person what happened: "the payment webhook returned 500 for order 42". If your code already knows that, `Notify` is the direct path: one call, a few strings, delivered to the destinations your team already has.

It is not a replacement for bug reports. It creates no Bugsee issue, so there is nothing to open and investigate afterward. When you need a session someone can replay, use [bug reporting](/sdk/unity/manual/bug-reporting) or [crash & error reporting](/sdk/unity/manual/crash-error-reporting).

## API

```csharp
public static void Notify(
    string title,
    string body = null,
    IssueSeverity severity = IssueSeverity.Medium,
    IDictionary<string, string> fields = null,
    bool urgent = false)
```

```csharp
using System.Collections.Generic;
using Bugsee.Contracts.Options;
using BugseeSdk = Bugsee.Bugsee;

// Title only
BugseeSdk.Notify("Payment webhook failed");

// With a body and a severity
BugseeSdk.Notify("Payment webhook failed", "Stripe returned a 500 for order 42", IssueSeverity.High);

// With fields
BugseeSdk.Notify(
    "Payment webhook failed",
    "Stripe returned a 500 for order 42",
    IssueSeverity.High,
    new Dictionary<string, string>
    {
        { "order_id", "42" },
        { "provider", "stripe" },
    });
```

| Argument | Rules |
| --- | --- |
| `title` | Required. An empty or `null` title is ignored: the call logs the warning `[Bugsee] Notify ignored: a title is required.` and sends nothing. |
| `body` | Optional. `null` is sent as an empty string. |
| `severity` | An `IssueSeverity`: `VeryLow`, `Medium`, `High`, `Critical` or `Blocker`. The default is `Medium`, and the severity is always sent. |
| `fields` | Optional extra string pairs. Entries with a `null` key or a `null` value are dropped. |
| `urgent` | `true` asks for delivery without waiting for the next batch. See [Urgent notifications](#urgent-notifications). |

`Notify` returns nothing and takes no callback, so your game cannot tell whether a notification reached the server.

### Before launch

Call `Notify` after `Bugsee.Launch`. A call made when the SDK is not launched is ignored by the native SDK, with a warning in the native log, and is not queued. In the Unity Editor the call does nothing.

## Offline behavior and batching

The SDK stores each notification on the device and uploads notifications in batches. A notification waits while the device is offline. See the native pages for the queue limits: [Android](/sdk/android/notification-relay) and [iOS](/sdk/ios/notification-relay).

The launch option `NotifyFlushDelay` sets how long the SDK waits before it drains its queue, in milliseconds. The default is `0`, which posts a notification as soon as it is on disk. A positive value lets calls made in quick succession share one batch.

```csharp
using Bugsee.Contracts.Options;
using BugseeSdk = Bugsee.Bugsee;

#if UNITY_ANDROID
var options = new AndroidLaunchOptions { NotifyFlushDelay = 2000 };
BugseeSdk.Launch("<your Android app token>", options);
#elif UNITY_IOS
var options = new IOSLaunchOptions { NotifyFlushDelay = 2000 };
BugseeSdk.Launch("<your iOS app token>", options);
#endif
```

There is no option to turn notification relay on or off in the SDK: it is available whenever the SDK is launched.

### Urgent notifications

With `urgent` set to `true`, the SDK asks to deliver that notification without waiting for the batch. If it cannot be sent at once, it is queued like any other. See the native pages for the exact rules.

```csharp
using System.Collections.Generic;
using Bugsee.Contracts.Options;
using BugseeSdk = Bugsee.Bugsee;

BugseeSdk.Notify(
    "Checkout is failing",
    "Five payment errors in the last minute",
    IssueSeverity.Critical,
    new Dictionary<string, string> { { "region", "eu-west" } },
    urgent: true);
```

## Delivery

Calling `Notify` delivers nothing on its own. Notification relay has to be turned on for the app in Bugsee, and its destinations chosen. Until then the call succeeds on the device and nothing arrives.

- **Integrations:** each application mapping of an integration has a _Relay_ option that forwards relayed notifications to it. See [Configuring integrations](/integrations/configuration#mapping-applications). A recipe receives a relayed notification in the shape of an issue: see [Event-based recipes](/integrations/recipes/recipes_notifications).
- **Webhooks:** a subscribed webhook receives the [`notification.relayed`](/webhooks/events#notificationrelayed) event, which documents the payload.

## Privacy

Nothing scrubs the title, body or fields before they are sent: the log, network and breadcrumb filters do not apply to them. Do not put anything in them that must not leave the device. For what else a notification carries, such as the user identifier and attributes, see the native pages and [User & session data](/sdk/unity/user-session-data).

## Related pages

- [Bug reporting](/sdk/unity/manual/bug-reporting): when you need a full report.
- [Configuration](/sdk/unity/configuration): every launch option.
