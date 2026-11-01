---
title: "Privacy overview"
description: "Overview of privacy controls available in the Bugsee iOS SDK for protecting video, console logs, network traffic, report fields, and stored data."
sidebar_position: 0
slug: "/sdk/ios/v6/privacy/overview"
---

:::caution[Previous version]
This page documents Bugsee iOS SDK **6.x**, the previous major version. The current line is **7.x** — see [Migrating from 6.x to 7.x](/sdk/ios/migration) to upgrade, or [Installation](/sdk/ios/installation) to start a new integration.
:::

Bugsee SDK does not continuously stream any personal data. The reports are stored locally on the phone in a cyclical buffer. Reports are being sent only when triggered by a crash, through a bug reporting UI or from an application's code.
Data sent along with the reports may include video recording of screen, network and console logs. These may potentially contain personal data (usernames, passwords, emails, etc).

It is the sole responsibility of the application developers to remove any such data from the reports before it leaves the users’ device.

Bugsee provides the tools and means to either prevent some data from being collected or clean the data during the collection process:

* [Video and Touch](/sdk/ios/v6/privacy/video/)
* [Console logs](/sdk/ios/v6/privacy/logs/)
* [Network logs](/sdk/ios/v6/privacy/network/)
* [Report](/sdk/ios/v6/privacy/report/)
* [Cleanup](/sdk/ios/v6/privacy/cleanup/)











