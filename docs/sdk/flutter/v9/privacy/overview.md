---
title: "Privacy overview"
description: "Overview of privacy considerations and available tools to prevent or sanitize personally identifiable data in Bugsee Flutter SDK reports."
sidebar_position: 0
slug: "/sdk/flutter/v9/privacy/overview"
---

:::caution[Previous version]
This page documents Bugsee Flutter SDK **9.x** (`bugsee_flutter` 9.x), the current stable release. The new **10.x** SDK is a rewrite for the Bugsee 7.x native SDKs and is in beta, not yet published to pub.dev.
:::

Bugsee SDK does not continuously stream any personal data. The reports are stored locally on the phone in a cyclical buffer. Reports are being sent only when triggered by a crash, through a bug reporting UI or from an application's code.
Data sent along with the reports may include video recording of screen, network and console logs. These may potentially contain personal data (usernames, passwords, emails, etc).

It is the sole responsibility of the application developers to remove any such data from the reports before it leaves the users’ device.

Bugsee provides the tools and means to either prevent some data from being collected or clean the data during the collection process:

* [Video and Touch](/sdk/flutter/v9/privacy/video/)
* [Console logs](/sdk/flutter/v9/privacy/logs/)
* [Network logs](/sdk/flutter/v9/privacy/network/)