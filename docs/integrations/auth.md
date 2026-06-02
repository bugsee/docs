---
title: "Integration authentication types"
description: "Explains the three authentication methods Bugsee supports for integrations: basic username/password, token-based, and OAuth."
sidebar_position: 1
slug: "/integrations/auth"
---

We support three ways to authenticate Bugsee in remote service:

- [Integration authentication types](#integration-authentication-types)
  - [Basic authentication](#basic-authentication)
  - [Token based authentication](#token-based-authentication)
  - [OAuth](#oauth)

:::info
All authentication types imply that you have access to the remote service you're willing to integrate Bugsee with.
:::


## Basic authentication

This authentication type requires username and password of the user on whose behalf you want Bugsee to perform related activities in remote service. This is the simplest and quickest way to configure integration, as it relies on existing authentication data, but is also the least secure of all available methods.

We do not apply any limitations to both username and password. All the validation is done within remote service that actually uses them to identify user.

:::info
We strongly recommend creating a dedicated user when basic authentication is used.
:::


## Token based authentication

This approach requires you to provide a special unique sequence of characters (token) that will authenticate Bugsee to remote service. This lets you keep your authentication data private (username and password) and easily revoke access rights if that token becomes compromised.


## OAuth

OAuth was specifically designed to allow authenticating/authorizing one application into another without sharing actual authentication info. It's described in great variety of articles, hence we will not discuss its principles here.

:::info
This is the recommended way to authenticate Bugsee in any integration that supports it.
:::