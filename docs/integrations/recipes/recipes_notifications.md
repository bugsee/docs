---
title: "Event-based recipes"
description: "Reference for writing Bugsee event-based recipes that handle issue lifecycle events (created, updated, closed, etc.) for notification and messaging integrations."
sidebar_position: 2
slug: "/integrations/recipes/recipes_notifications"
---

These recipes handle data that is collected when some event is raised. For now, the list of supported events includes:

- issue.created
- issue.updated
- issue.closed
- issue.reopened
- issue.regressed
- issue.deleted
- issue.comment

For simplicity, we unified the data structures passed to the ```handle()``` method to the ones being used in Webhooks. So, for details, on what data is available for each of the events listed above, refer to the [Webhook events](/webhooks/events/).

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

Note, that result is not used as is. Before executing the recipe, a default message object is constructed. Then, when recipe result is received, it extends that default object (replaces the default values on corresponding fields).

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
|fields|Array|Array of ```{ title: '', value: '' }``` objects, that denote the additional fields for the message.|

If you want to prevent pushing message to remote service, return ```null``` from the ```handle()```.