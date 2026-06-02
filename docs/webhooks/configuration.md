---
title: "Configuration"
description: "Webhooks can be managed in special Webhooks page in web dashboard. To create a new webhook, click \"Add webhook\" button at the top."
sidebar_position: 1
slug: "/webhooks/configuration"
---

## Add new Webhook

Webhooks can be managed in special [Webhooks](https://app.bugsee.com/#/settings/org/webhooks/) page in web dashboard. To create a new webhook, click "Add webhook" button at the top.

![Add webhook](add_webhook_button.png)

That will bring up a new webhook wizard. One the first step fill in the remote URL to your server and optionally provide some description.

![Fill URL](wizard_step1.png)

On the next step, check events you want to receive notifications about to the specified URL (they will be sent as POST requests).

![Select events](wizard_step2.png)

If you have selected any of _issue.\*_ events on the second step, you will be presented with the third one, where you can select applications you want these events to be triggered for (all unchecked applications will not triggering events).

![Select applications](wizard_step3.png)

Finally click "Save" to save the configured Webhook.


## Test Webhook

After you've created a Webhook you can test it to make sure your servers handle Bugsee requests correctly. To test a Webhook, go to [Webhooks](https://app.bugsee.com/#/settings/org/webhooks) list, open menu for an item and click "Test"

![Webhook menu](webhook_menu.png)

That will bring the "Test webhook" dialog where you can select an event you want to test, and make Bugsee send a test request to your servers.

![Test webhook dialog](test_dialog.png)

After you click test, we will issue a test request to your servers and display their response right in the test window

![Test webhook response](test_response.png)