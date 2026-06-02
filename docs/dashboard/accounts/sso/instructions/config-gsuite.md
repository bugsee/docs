---
title: "Configuring Single Sign-On in Google Workspace"
description: "Step-by-step guide to configuring Bugsee as a custom SAML application in Google Workspace for Single Sign-On authentication."
sidebar_position: 2
slug: "/dashboard/accounts/sso/instructions/config-gsuite"
---

## Configuration

Go to your Google Workspace administration dashboard (Usually, it's [https://admin.google.com](https://admin.google.com)) and there, open "Apps" settings.

![](gsuite-step-1.png)

Next, navigate to the "SAML apps"

![](gsuite-step-2.png)

From there, click the _"plus"_ button at the bottom right corner of the page to bring up the _"Enable SSO for SAML Application"_ dialog. Within that dialog, click _"Setup my own custom app"_ at the bottom.

![](gsuite-step-3.png)

Click _"Download"_ button in _"Option 2"_ to download the XML metadata for the IdP. Keep it for now, we will use it later.

![](gsuite-step-4.png)

On the next step, fill the _"Application name"_, _"Description"_ and _"Logo"_.

![](gsuite-step-5.png)

Now, on _"Service Provider Details"_ step, you need to fill information available in _"SSO setup"_ wizard in Bugsee. Please, follow the instructions shown in the screenshot below.

![](gsuite-step-6.png)

Finally, on the _"Attribute Mapping"_ step, you need to list attributes that will be available to Bugsee (as Service Provider). Please, follow the instructions shown in the screenshot below. Copy the attributes names. You must provide the same names in the Bugsee's SSO setup wizard dialog when prompted.

:::info
Note that Bugsee is using single field to store user name, while Google Workspace does not provide similar one by default. In this tutorial, we use "Last name" as the target value for the "name" attribute.
:::

![](gsuite-step-7.png)

Now, remember the IdP metadata file you've downloaded. Open it, copy its contents. On the second step in _"SSO setup"_ wizard in Bugsee dashboard select _"XML"_ as Idp metadata source and paste the copied contents.

![](gsuite-step-8.png)

That's all the steps required to configure SSO in Google Workspace. Complete the configuration of SSO in Bugsee and you're all set.