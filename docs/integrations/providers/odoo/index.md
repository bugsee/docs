---
title: "Odoo Integration"
description: "How to integrate Bugsee with Odoo using basic username and password authentication, including steps to set a local password on Odoo Online accounts."
sidebar_position: 20
slug: "/integrations/providers/odoo"
---

## Authentication

### Supported authentication methods

- [Basic (username and password)](#basic-authentication)


### Basic authentication

User accounts in Odoo Online instances (&lt;domain&gt;.odoo.com) are created without a local password. To use Odoo API there, you will need to set a password on the user account you want to use:

Log in your instance with an administrator account and click settings icon

![Open settings](menu_click.png)

Hover _"Users"_ menu and click _"Users"_ item in its drop-down

![Click user record](users_click.png)

Click the row with user you want to use in Bugsee integration

![Click user record](user_click.png)

Click the _"Change Password"_ button. Set a _"New Password"_ value and then click _"Change Password"_.

![Click Change password](change_pass_click.png)

Now, when you've made required changes in your Odoo instance, let's configure integration in Bugsee.

Pass through instructional steps in wizard and stop at authentication step. Provide valid host (URL to your Odoo), username and password. Click _"Next"_.

![Provide authentication info](wz_step1_basic.png)


## Configuration

There are no any specific configuration steps for Odoo. Refer to <a href="/integrations/configuration/">configuration</a> section for description about generic steps.