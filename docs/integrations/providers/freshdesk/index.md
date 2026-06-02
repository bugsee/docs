---
title: "Freshdesk integration"
description: "Connect Bugsee to Freshdesk using basic auth or a personal token to automatically create and update support tickets from Bugsee issues."
sidebar_position: 8
slug: "/integrations/providers/freshdesk"
---

## Authentication

### Supported authentication methods

- [Basic (username and password)](#basic-authentication)
- [Personal token](#personal-token)


### Basic authentication

:::info
No custom configuration required in Freshdesk for this type of authentication.
:::

Select "Basic authentication" in the first step of integration wizard. Click "Next".

![Select basic authentication](wz_step1_basic.png)

Provide valid host (URL to your Freshdesk), username and password.

![Provide authentication info](wz_step2_basic.png)


### Personal token

To proceed with this authentication type you need to obtain API token from Freshdesk. Steps below will instruct you how to do that.

Click on your _"Profile Picture"_ in the top right and then click _"Profile Settings"_ in revealed menu.

![Profile settings](profile_settings.png)

In your profile settings page, in the right pane under _"Change Password"_ block, you'll find _"Your API Key"_ area. Copy token from it.

![API key](api_key.png)

Now, when you've obtained a token, let's configure integration in Bugsee.

![Select personal token](wz_step1_token.png)

Provide valid host (URL to your Freshdesk) and paste generated token.

![Paste personal token](wz_step2_token.png)


## Configuration

There are no any specific configuration steps for Freshdesk. Refer to <a href="/integrations/configuration/">configuration</a> section for description about generic steps.


## Custom recipes

Bugsee can accommodate all these customizations with the help of [custom recipes](/integrations/recipes/recipes/). This section provides a few examples of using custom recipes specifically with Freshdesk. For basic introduction, refer to custom recipe [documentation](/integrations/recipes/recipes/).

### Setting labels field

By default Bugsee creates and updates Freshdesk tickets with Bugsee issue _labels_ as Freshdesk _tags_. But _labels_ list can be overridden inside your custom recipe. For example you can add some new _label_ (Freshdesk _tag_) to existing ones:

```javascript
function create(context) {
	// ....

    return {
    	// ...
    	labels: [...issue.labels, "My awesome tag"]
    };
}

function update(context, changes) {
	const result = {};
	// ...
    
    if (changes.labels) {
        result.labels = [...changes.labels.to, "My awesome tag"];
    }

	return {
        issue: {
            custom: {}
        },
        changes: result
    };
}
```
