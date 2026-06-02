---
title: "BugHerd integration"
description: "Connect Bugsee to BugHerd using a personal API token to push Bugsee issues as tasks into your BugHerd projects."
sidebar_position: 4
slug: "/integrations/providers/bugherd"
---

## Authentication

### Supported authentication methods

- [Personal token](#personal-token)


### Personal token

To proceed with this authentication type you need to obtain API token from BugHerd. Steps below will instruct you on how to do that.

Navigate to BugHerd and log in. Reveal user menu by clicking on your avatar icon at the top right and then click _"edit your profile"_.

![Click edit profile](edit_profile.png)

Then, in the left pane click the organization you want to obtain token for.

![Switch to the desired organization](open_org.png)

Finally, scroll the page down to the _"Authentication Token"_ section. Copy the token inside the input field.

![Scroll down and copy token](copy_token.png)

Now, when you've obtained a token, let's configure integration in Bugsee.

Start Bugsee integration wizard and select _"Personal token"_ authentication type. Click _"Next"_.

![Select personal token](wz_step1_token.png)

Paste generated token into _"Personal token"_ field and click _"Next"_ to proceed.

![Paste personal token](wz_step2_token.png)


## Configuration

There are no any specific configuration steps for BugHerd. Refer to <a href="/integrations/configuration/">configuration</a> section for description about generic steps.
