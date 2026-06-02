---
title: "Privacy overview"
description: "Overview of privacy considerations for Bugsee in Unity and links to controls for video, console logs, and network data collection."
sidebar_position: 0
slug: "/sdk/unity/privacy/overview"
---

Bugsee SDK does not continuously stream any personal data. The reports are stored locally on the phone in cyclical buffer. Reports are being sent only when triggered by a crash, through a bug reporting UI or from an applications code.
Data sent along with the reports may include video recording of screen, network and console logs. These may potentially contain personal data (usernames, passwords, emails, etc).

It is the sole responsibility of the application developers to remove any such data from the reports before it leaves the users’ device.

Bugsee provides the tools and means to either prevent some data of being collected or clean the data during the collection process:

* [Video and Touch](/sdk/unity/privacy/video/)
* [Console logs](/sdk/unity/privacy/logs/)
* [Network logs](/sdk/unity/privacy/network/)