---
title: "Bugsee integrations"
description: "Directory of all Bugsee integrations with bug trackers, project management tools, messengers, help desks, and data forwarding services."
sidebar_position: 0
slug: "/integrations"
---

Bugsee integrates with most bug trackers, project management and collaboration tools available on the market.

For each new issue created within Bugsee, a corresponding item can be created within your tool of choice (the item might be an issue, a card, a task, a chat message depending on the type of the tool on the receiving end). The resulting item will have a direct link to a Bugsee player for that specific issue. You have an option to create the items automatically as soon as new issue appear within Bugsee, or to push individual issues manually from Bugsee to your tool of choice.

Integrations come in two flavours, and which one you get is decided by the tool on the receiving end:

- **Issue-based** — Bugsee creates an item in the remote tool for a Bugsee issue, then keeps it up to date and mirrors comments onto it. This covers the bug trackers, the help desks, and the data-forwarding services: Datadog and Splunk are driven through the same issue flow, they simply receive an event or a log entry instead of a ticket.
- **Event-based** — Bugsee posts a message when something happens, with nothing to keep in sync afterwards. Only Slack and Microsoft Teams work this way. You choose which events are worth a message per application; see [event-based recipes](/integrations/recipes/recipes_notifications/) for the full list.

If you don't find your tool among the available integrations, please contact <a href="mailto:support@bugsee.com">support@bugsee.com</a> and we will be happy to explore the option of adding it.

## Available integrations 

#### Bug tracker and task management tools

* [Aha!](providers/aha/)
* [Asana](providers/asana/)
* [Azure DevOps](providers/azure-devops/)
* [Basecamp](providers/basecamp/)
* [BugHerd](providers/bugherd/)
* [Bugzilla](providers/bugzilla/)
* [ClickUp](providers/clickup/)
* [GitHub](providers/github/)
* [GitLab](providers/gitlab/)
* [HubSpot](providers/hubspot/)
* [Jira](providers/jira/)
* [Linear](providers/linear/)
* [MantisBT](providers/mantisbt/)
* [monday.com](providers/monday/)
* [Notion](providers/notion/)
* [Nozbe](providers/nozbe/)
* [Odoo](providers/odoo/)
* [Redmine](providers/redmine/)
* [Shortcut](providers/shortcut/)
* [TargetProcess](providers/targetprocess/)
* [Teamwork Projects](providers/teamwork_projects/)
* [Trello](providers/trello/)
* [Visual Studio Team Services](providers/vsts/)
* [Wrike](providers/wrike/)
* [YouTrack](providers/youtrack/)
* [Zoho Projects](providers/zoho_projects/)

#### Messengers

* [Microsoft Teams](providers/microsoft_teams/)
* [Slack](providers/slack/)

#### Help desk tools
* [Freshdesk](providers/freshdesk/)
* [iTop](providers/itop/)
* [Zendesk](providers/zendesk/)
* [Zoho Desk](providers/zoho_desk/)

#### Data forwarding
* [Datadog](providers/datadog/)
* [Splunk](providers/splunk/)

## What each integration can do

_Create_ means Bugsee creates an item when an issue is pushed. _Update_ means later changes to the Bugsee issue — state, summary, description, labels, priority — are mirrored onto that item. _Comment_ means comments added in Bugsee are posted onto it. _Notify_ means the integration receives event messages rather than items. _Authentication_ lists the methods offered when setting the integration up.

|Integration|Create|Update|Comment|Notify|Authentication|
|---|---|---|---|---|---|
|[Aha!](providers/aha/)|✓|✓|✓|—|Basic, Personal token, OAuth|
|[Asana](providers/asana/)|✓|✓|✓|—|Personal token, OAuth|
|[Azure DevOps](providers/azure-devops/)|✓|✓|✓|—|Personal token|
|[Basecamp](providers/basecamp/)|✓|✓|✓|—|OAuth|
|[BugHerd](providers/bugherd/)|✓|✓ <sup>1</sup>|✓|—|Personal token|
|[Bugzilla](providers/bugzilla/)|✓|✓ <sup>2</sup>|✓|—|Basic|
|[ClickUp](providers/clickup/)|✓|✓|✓|—|Personal token, OAuth|
|[Datadog](providers/datadog/)|✓|— <sup>3</sup>|✓|—|Personal token|
|[Freshdesk](providers/freshdesk/)|✓|✓|✓|—|Basic, Personal token|
|[GitHub](providers/github/)|✓|✓|✓|—|Personal token, OAuth|
|[GitLab](providers/gitlab/)|✓|✓|✓|—|Personal token, OAuth|
|[HubSpot](providers/hubspot/)|✓|✓|✓|—|OAuth|
|[iTop](providers/itop/)|✓|✓ <sup>4</sup>|✓|—|Basic, Personal token|
|[Jira](providers/jira/)|✓|✓|✓|—|Basic, Personal token, OAuth|
|[Linear](providers/linear/)|✓|✓|✓|—|Personal token, OAuth|
|[MantisBT](providers/mantisbt/)|✓|✓|✓|—|Personal token|
|[Microsoft Teams](providers/microsoft_teams/)|—|—|—|✓|OAuth|
|[monday.com](providers/monday/)|✓|Partial <sup>5</sup>|✓|—|Personal token|
|[Notion](providers/notion/)|✓|✓|✓|—|OAuth|
|[Nozbe](providers/nozbe/)|✓|Partial <sup>6</sup>|✓|—|OAuth|
|[Odoo](providers/odoo/)|✓|✓ <sup>7</sup>|✓|—|Basic|
|[Redmine](providers/redmine/)|✓|✓ <sup>7</sup>|✓|—|Basic, Personal token|
|[Shortcut](providers/shortcut/)|✓|✓|✓|—|Personal token|
|[Slack](providers/slack/)|—|—|—|✓|OAuth|
|[Splunk](providers/splunk/)|✓|— <sup>8</sup>|—|—|Personal token|
|[TargetProcess](providers/targetprocess/)|✓|✓|✓|—|Basic, Personal token|
|[Teamwork Projects](providers/teamwork_projects/)|✓|✓|✓|—|Personal token|
|[Trello](providers/trello/)|✓|✓ <sup>9</sup>|✓|—|Personal token|
|[Visual Studio Team Services](providers/vsts/)|✓|✓ <sup>10</sup>|✓|—|Personal token|
|[Wrike](providers/wrike/)|✓|✓|✓|—|Personal token, OAuth|
|[YouTrack](providers/youtrack/)|✓|✓|✓|—|Personal token|
|[Zendesk](providers/zendesk/)|✓|✓|✓|—|OAuth|
|[Zoho Desk](providers/zoho_desk/)|✓|✓|✓|—|OAuth|
|[Zoho Projects](providers/zoho_projects/)|✓|✓|✓|—|Personal token|

1. BugHerd has no separate title field — the summary and description are stored as one body, so editing either rewrites the whole thing.
2. Bugzilla cannot update a description after creation, and labels only sync if they already exist as administrator-defined Bugzilla keywords.
3. Datadog receives an event per pushed issue. Later changes to the Bugsee issue are not mirrored.
4. iTop only mirrors closing, and does so on a best-effort basis — a ticket that cannot take the transition keeps its state while the rest of the edit still applies.
5. monday.com mirrors the item name and status only. Description, priority and label changes are not sent.
6. Nozbe mirrors state and summary only. Because a Nozbe task has no description field, the Bugsee description is posted as a comment on the task.
7. Odoo and Redmine do not sync priority; Redmine does not sync labels.
8. Splunk receives an event through the HTTP Event Collector, which returns no id, so there is nothing to update or comment on afterwards.
9. Trello has no status field — closing a Bugsee issue archives the card.
10. Visual Studio Team Services shares its implementation with Azure DevOps, adapted for VSTS-era hosts and on-premise Azure DevOps Server. Comments are appended to the work item's history.
