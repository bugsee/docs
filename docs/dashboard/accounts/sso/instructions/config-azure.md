---
title: "Configuring Single Sign-On in Azure"
description: "Step-by-step guide to integrating Bugsee with Azure Active Directory as a SAML SSO identity provider using a custom enterprise application."
sidebar_position: 1
slug: "/dashboard/accounts/sso/instructions/config-azure"
---

## Configuration

Navigate to your Azure. In the search bar at the top, type "Enterprise applications" and select the corresponding item.

![](azure-step-0.png?v=2)

Now, click `New application` button in the actions bar.

![](azure-step-1.png?v=2)

Click `Create your own application`, specify application name and check `Integrate any other application you don't find in the gallery (Non-gallery)` and click `Create` button at the bottom.

![](azure-step-2.png?v=2)

Open the newly created application and switch to `Manage` → `Single sign-on` section. Click SAML block to start configuring SSO.

![](azure-step-2a.png?v=2)

Click the pencil icon in the block #1 (`Basic SAML Configuration`)

![](azure-step-3.png?v=2)

Now, fill the fields as shown in the picture below, then click `Save` button and close the `Basic SAML Configuration` pane.

![](azure-step-4.png?v=2)

Next, click the pencil icon in the `Attributes & Claims` section.

![](azure-step-5.png?v=2)

Now, fill the fields as shown in the picture below and close the `Attributes & Claims` pane. You can clear the `Namespace` field for the entries in `Additional claims`. It's not being used or required.

![](azure-step-6.png?v=2)

Copy the attributes names. You must provide the same names in the Bugsee's SSO setup wizard dialog when prompted.

:::warning
Notice the claims names. You must provide the same names in the Bugsee's SSO setup wizard dialog when prompted. See the screenshot below. The `Name` field is the name of the attribute that will be used in Bugsee.
:::

![](azure-step-6a.png?v=2)

And the last step you need to take is to copy the `App Federation Metadata Url` and paste it into the `Metadata URL` in the Bugsee's SSO setup wizard.

![](azure-step-7.png?v=2)

That's all the steps required to configure SSO in Azure. Complete the configuration of SSO in Bugsee and you're all set.