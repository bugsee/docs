---
title: "Custom recipes"
description: "Overview of Bugsee custom recipes — JavaScript-based scripts that customize how issues and notifications are pushed to integrated third-party services."
sidebar_position: 0
slug: "/integrations/recipes/recipes"
---

Some services Bugsee integrates with are highly customizable (e.g JIRA). Bugsee provides a mechanism to fully customize individual fields and creation of custom field mapping for such integrations.

![Edit recipes](recipe.png)

<p>&nbsp;</p>

Custom recipes are written in JavaScript. They differ, however, depending on the type of the tools you're integrating with:

- For bug tracking and collaboration tools, recipes are issue-based and described in [Issue-based recipes](/integrations/recipes/recipes_issues/).
- For messengers and other notification tools, recipes are event-based and described in [Event-based recipes](/integrations/recipes/recipes_notifications/).
