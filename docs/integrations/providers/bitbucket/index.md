---
title: "Bitbucket integration"
description: "Connect Bugsee to Bitbucket via OAuth to push issues directly into Bitbucket repository issue trackers."
sidebar_position: 3
slug: "/integrations/providers/bitbucket"
---

:::warning[This integration is retired]
Bitbucket Cloud removed its native issue tracker and the Issues REST APIs on **20 August 2026**. Bugsee can no longer create or update Bitbucket issues, and attempting to push to an existing Bitbucket integration returns an error.

Existing configurations are left in place so historical links keep resolving, but no new issues will be delivered. Migrate issue tracking to [Jira](/integrations/providers/jira/) or another supported provider.
:::

To push issues from Bugsee to Bitbucket you must have properly configured issue trackers in all target repositories. Follow the steps below to validate your configuration.


## Prepare

Navigate to your [Bitbucket account](https://bitbucket.org) and open the repository you want to check.

![Open repo](open_repo.png)

Open repository settings section:

![Open settings](open_settings2.png)

Select "Issue tracker" section in settings navigation pane:

![Open tracker](open_tracker.png)

Ensure that option "Issue tracker" is set to anything other than "No issue tracker":

![Check tracker](check_tracker.png)


## Authentication

### Supported authentication methods

- [OAuth](#oauth)

### OAuth

Select _"OAuth"_ authentication type and click _"Next"_.

![Select OAuth](wz_step1_oauth.png)

You will be presented with the following window asking you to grant Bugsee access to your Bitbucket. Click _"Grant access"_ to give Bugsee requested permissions.

![Grant permissions](grant.png)


## Configuration

There are no specific configuration steps for Bitbucket. Refer to <a href="/integrations/configuration/">configuration</a> section for description about generic steps.