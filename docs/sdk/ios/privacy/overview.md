---
title: "Privacy overview"
description: "Overview of privacy controls available in the Bugsee iOS SDK for protecting video, console logs, network traffic, report fields, and stored data."
sidebar_position: 0
slug: "/sdk/ios/privacy/overview"
---

Bugsee SDK does not continuously stream any personal data. The reports are stored locally on the phone in cyclical buffer. Reports are being sent only when triggered by a crash, through a bug reporting UI or from an applications code.
Data sent along with the reports may include video recording of screen, network and console logs. These may potentially contain personal data (usernames, passwords, emails, etc).

It is the sole responsibility of the application developers to remove any such data from the reports before it leaves the users’ device.

Bugsee provides the tools and means to either prevent some data of being collected or clean the data during the collection process:

* [Video and Touch](/sdk/ios/privacy/video/)
* [Console logs](/sdk/ios/privacy/logs/)
* [Network logs](/sdk/ios/privacy/network/)
* [Report](/sdk/ios/privacy/report/)
* [Cleanup](/sdk/ios/privacy/cleanup/)











