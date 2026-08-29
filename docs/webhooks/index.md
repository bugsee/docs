---
title: "Webhooks"
description: "Introduction to Bugsee webhooks, explaining how to receive real-time event notifications on your server and what response codes are expected."
sidebar_position: 0
slug: "/webhooks"
---

Webhooks give you an opportunity to handle and react to events in real time. Bugsee can automatically send updates to your servers through custom webhooks. To learn how to set up a webhook refer to [configuration page](configuration/).

## Triggering

To start receiving notifications via Webhooks you only need to set it up once via the web dashboard. No further tuning and/or configuration is required. You can review and/or manage your webhooks [here](https://app.bugsee.com/#/settings/org/webhooks).


## Responding

Your server must respond with **HTTP 200** to inform Bugsee that you accepted and handled the request. Any other status (including 201 and 204) is treated as a failure.

## Delivery and retries

Delivery is **at-least-once**. A transient failure (timeout, 408, 429, 5xx, network error) is retried; your handler may see the same event more than once.

Each request carries a stable delivery id in both places — use either to dedupe:

- JSON envelope field `id`
- request header `X-Bugsee-Delivery`

Both values are the same string and stay the same across retries of that delivery.

## Rate limits

There is no rate limit on requests to your server. Five or more **consecutive terminal** failures disable the webhook; further events are not sent until you re-enable it in the dashboard. Transient failures that later succeed do not count.



