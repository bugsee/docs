---
title: "iTop integration"
description: "Connect Bugsee to iTop using basic auth or an application token to automatically create service desk tickets from Bugsee issues."
sidebar_position: 13
slug: "/integrations/providers/itop"
---

## Authentication

### Supported authentication methods

- [Basic (username and password)](#basic-authentication)
- [Personal token](#personal-token)


## Basic authentication

:::info
No custom configuration required in iTop for this type of authentication. The iTop user account you use must have sufficient permissions to create tickets via the REST API.
:::

Select "Basic authentication" in the first step of integration wizard. Click "Next".

![Select basic authentication](auth_basic_1.png)

Provide valid host (URL to your iTop instance), username and password. Click _"Next"_.

![Provide authentication info](auth_basic_2.png)


### Personal token

To integrate Bugsee with iTop using a personal token, you need to create an Application Token user with REST API access. Follow the steps below to set it up.

Log into your iTop instance and navigate to _"Administration"_ section. Under _"User management"_, click _"User accounts"_.

![Navigate to user accounts](01_nav_to_user_accounts.png)

In the user accounts list, click the _"+"_ (New) button to create a new user.

![Click add user button](02_add_user_button.png)

In the _"Creation of a new User"_ dialog, select _"Application Token"_ from the dropdown and click _"Apply"_.

![Select Application Token type](02_select_user_type_token.png)

Fill in the token details. Assign the _"REST Services User"_ profile (required for API access) and any additional profiles needed for creating tickets. Set the _"Scope"_ to _"REST/JSON"_ and provide a descriptive name for the _"Remote application"_ field (e.g. "Bugsee"). Make sure the _"Status"_ is set to _"Enabled"_. Save the user and copy the generated token.

![Set profiles and scope](04_set_profiles_and_scope.png)

Now, when you've obtained a token, let's configure integration in Bugsee. Select _"Personal token"_ authentication type and click _"Next"_.

![Select personal token](auth_token_1.png)

Specify the URL of your iTop instance in the _"Host"_ field and paste the generated token into the _"Token"_ field. Click _"Next"_ to proceed.

![Paste personal token](auth_token_2.png)


## Configuration

There are no any specific configuration steps for iTop. Refer to <a href="/integrations/configuration/">configuration</a> section for description about generic steps.
