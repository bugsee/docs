---
title: "Privacy overview"
description: "Overview of privacy considerations for Bugsee in Unity and links to controls for video, console logs, and network data collection."
sidebar_position: 0
slug: "/sdk/unity/v6/privacy/overview"
---

:::caution[Previous version]
This page documents Bugsee Unity SDK **6.x**, the current stable release. The new **7.x** SDK is in beta: see [Migrating from 6.x to 7.x](/sdk/unity/migration) to evaluate it, or the [7.x overview](/sdk/unity/overview) to start a new integration.
:::

Bugsee SDK does not continuously stream any personal data. The reports are stored locally on the phone in a cyclical buffer. Reports are being sent only when triggered by a crash, through a bug reporting UI or from an application's code.
Data sent along with the reports may include video recording of screen, network and console logs. These may potentially contain personal data (usernames, passwords, emails, etc).

It is the sole responsibility of the application developers to remove any such data from the reports before it leaves the users’ device.

Bugsee provides the tools and means to either prevent some data from being collected or clean the data during the collection process:

* [Video and Touch](/sdk/unity/v6/privacy/video/)
* [Console logs](/sdk/unity/v6/privacy/logs/)
* [Network logs](/sdk/unity/v6/privacy/network/)