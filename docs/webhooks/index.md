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

Your server must respond with HTTP 200 to inform Bugsee that you accepted and handled request. Any other response may be treated as failure.

## Rate limits

For now, we do not set any limits on requests being made to your servers. However, if there will be 5 or more consecutive failures, webhook will be marked as disabled and any further activity notifications will not be passed through it. To reset disabled state, make sure you've provided valid URL and enable webhook in web dashboard.



