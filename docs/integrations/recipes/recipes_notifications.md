---
title: "Event-based recipes"
description: "Reference for writing Bugsee event-based recipes that handle issue lifecycle events (created, updated, closed, etc.) for notification and messaging integrations."
sidebar_position: 2
slug: "/integrations/recipes/recipes_notifications"
---

These recipes handle data that is collected when some event is raised. Each event can be enabled per application in the _Events_ column of the integration's application mapping; the recipe runs for whichever events you enabled there.

|Event|Shown in the dashboard as|Carries an issue?|
|---|---|---|
|issue.created|New issue reported|Yes|
|issue.updated|Issue updated|Yes|
|issue.closed|Issue closed|Yes|
|issue.reopened|Issue reopened|Yes|
|issue.regressed|Issue regressed|Yes|
|issue.deleted|Issue deleted|Yes|
|issue.comment|New comment in issue|Yes|
|recording.created|Recording was added to an issue|No|
|recording.deleted|Recording was deleted from an issue|No|
|unsymbolicated.created|New issue without symbols|Yes|
|feedback.message.in|New message from device in feedback|No|
|feedback.message.out|New message from dashboard in feedback|No|

Not every event carries an issue, so inspect ```event.type``` before reaching into ```event.payload```:

```javascript
if (event.type === 'issue.created') {
    const issue = event.payload.issue;   // present
} else if (event.type === 'recording.created') {
    // no payload.issue here — the event is about the recording
}
```

The data structures passed to the ```handle()``` method follow the ones used in Webhooks, so for details on what is available for each event refer to the [Webhook events](/webhooks/events/). The match is close but not exact: the payload a recipe receives is rendered for messaging, so ```severity``` arrives as a name rather than the numeric level used in webhooks, and fields such as ```reporter```, ```attributes``` and ```statistics``` are not included.

:::info
Notification Relay messages sent with `Bugsee.notify` are delivered through a separate opt-in — the _Relay_ checkbox on the application mapping, together with the application's Notification Relay settings — and not through the _Events_ list above. They still reach the same ```handle()``` method, with the notification presented in the shape of an issue so that existing recipes keep working.
:::

```javascript
function handle(event) {
    const result = {};

    // To get familiar with recipes, please, refer to the docs
    // https://docs.bugsee.com/integrations/

    const eventType = event.type;
    const payload = event.payload;

    if (eventType === 'issue.created') {
        const issue = payload.issue;

        result.title = `${issue.key || '<#>'}: ${issue.summary || 'No summary'} [Bugsee]`;
    }

    result.fields = [
        // Add custom fields here that will be displayed with the message.
        // Each field is represented as { title: '', value: '' }
    ];

    return result;
}
```

Note that the result is not used as-is. Before executing the recipe, a default message object is constructed. Then, when recipe result is received, it extends that default object (replaces the default values on corresponding fields).

```result``` object is constructed from the following fields:

- title
- description
- severity
- fields

|Field|Type|Description|
|---|---|---|
|title|String|Title of the message|
|description|String|Description for the message|
|severity|Number|Message severity. Value from 1 through 5 (from lower to higher). Pass 0 to ignore severity.|
|fields|Array|Array of `{ title: '', value: '' }` objects, that denote the additional fields for the message.|

If you want to prevent pushing message to remote service, return ```null``` from the ```handle()```.