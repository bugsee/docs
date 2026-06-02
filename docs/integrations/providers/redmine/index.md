---
title: "Redmine integration"
description: "How to integrate Bugsee with Redmine using basic authentication or a personal API token, including steps to enable the Redmine REST API."
sidebar_position: 22
slug: "/integrations/providers/redmine"
---

## Authentication

To let Bugsee integrate with your Redmine, you should enable REST API access. Enable it in *Administration -> Settings -> API*.

### Supported authentication methods

- [Basic (username and password)](#basic-authentication)
- [Personal token](#personal-token)


## Basic authentication

:::info
No custom configuration required in Redmine for this type of authentication.
:::

Select "Basic authentication" in the first step of integration wizard. Click "Next".

![Select basic authentication](wz_step1_basic.png)

Provide valid host (URL to your Redmine), username and password.

![Provide authentication info](wz_step2_basic.png)


### Personal token

You can find your personal API key on your account page (https://&lt;redmine-domain&gt;/my/account) when logged in, on the right-hand pane of the default layout.


Start Bugsee integration wizard and select _"Personal token"_ authentication type. Click _"Next"_.

![Select personal token](wz_step1_token.png)

Provide valid host (URL to your Redmine) and paste generated token.

![Paste personal token](wz_step2_token.png)


## Configuration

There are no any specific configuration steps for Redmine. Refer to <a href="/integrations/configuration/">configuration</a> section for description about generic steps.