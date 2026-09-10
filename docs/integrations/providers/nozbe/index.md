---
title: "Nozbe integration"
description: "Connect Bugsee to Nozbe via OAuth to create a task in your Nozbe project each time an issue is reported."
sidebar_position: 20
slug: "/integrations/providers/nozbe"
---

Integration with Nozbe is based on tasks. Each time a new issue is reported to Bugsee, we create a new task in the Nozbe project you mapped the application to.

Make sure you have at least one project in your Nozbe account to map a Bugsee application to. Every account also has a built-in project for tasks that belong to no project, which appears in the mapping step as _"Single Tasks"_.

:::info
This integration connects to **Nozbe Classic** (`app.nozbe.com`). If your team has moved to the current Nozbe apps, this integration will not see those projects.
:::

## Authentication

### Supported authentication methods

- [OAuth](#oauth)

### OAuth

Select _"OAuth"_ authentication type and click _"Next"_. You will be redirected to Nozbe and asked to allow Bugsee access to your account. Approve the request to return to the wizard.

## Configuration

There are no specific configuration steps for Nozbe. Refer to <a href="/integrations/configuration/">configuration</a> section for description about generic steps.

## What is synchronized

- **Task creation.** The issue summary becomes the task name.
- **Description.** A Nozbe task has no description field, so the Bugsee description is posted as the first comment on the task instead. If that second step fails, the task still exists but arrives without its description.
- **Comments.** Comments added to the Bugsee issue are mirrored onto the task.
- **State and summary.** Closing or reopening the Bugsee issue completes or un-completes the Nozbe task, and a renamed issue renames the task. Priority and label changes are not sent to Nozbe.

Descriptions and comments are sent as Markdown — see [issue-based recipes](/integrations/recipes/recipes_issues/) if you want to change what gets pushed.
