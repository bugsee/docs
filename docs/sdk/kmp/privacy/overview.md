---
title: "Privacy overview (Beta)"
description: "Overview of privacy considerations and available tools to prevent or sanitize personally identifiable data in Bugsee KMP SDK reports."
sidebar_position: 0
slug: "/sdk/kmp/privacy/overview"
---

Bugsee SDK does not continuously stream any personal data. The reports are stored locally on the phone in a cyclical buffer. Reports are sent only when triggered by a crash, through the bug reporting UI, or from application code.

Data sent along with reports may include video recording of the screen, network and console logs. These may potentially contain personal data (usernames, passwords, emails, etc).

It is the sole responsibility of the application developers to remove any such data from the reports before it leaves the users' device.

Bugsee provides the tools and means to either prevent some data from being collected or clean the data during the collection process:

* [Video](/sdk/kmp/privacy/video/)
* [Console logs](/sdk/kmp/privacy/logs/)
* [Network logs](/sdk/kmp/privacy/network/)
