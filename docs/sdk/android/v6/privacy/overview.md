---
title: "Privacy overview"
description: "Overview of what data the Bugsee Android SDK collects and the available tools to protect user privacy before reports are sent."
sidebar_position: 0
slug: "/sdk/android/v6/privacy/overview"
---

Bugsee SDK does not continuously stream any personal data. The reports are stored locally on the phone in cyclical buffer. Reports are being sent only when triggered by a crash, through a bug reporting UI or from an applications code.
Data sent along with the reports may include video recording of screen, network and console logs. These may potentially contain personal data (usernames, passwords, emails, etc).

It is the sole responsibility of the application developers to remove any such data from the reports before it leaves the users’ device.

Bugsee provides the tools and means to either prevent some data of being collected or clean the data during the collection process:

* [Video and Touch](/sdk/android/v6/privacy/video/)
* [Console logs](/sdk/android/v6/privacy/logs/)
* [Network logs](/sdk/android/v6/privacy/network/)
* [Report](/sdk/android/v6/privacy/report/)
* [Cleanup](/sdk/android/v6/privacy/cleanup/)