---
title: "Privacy overview"
description: "Overview of privacy controls in the Bugsee Cordova SDK, covering how to prevent or sanitize PII in video, console logs, and network reports."
sidebar_position: 0
slug: "/sdk/cordova/privacy/overview"
---

Bugsee SDK does not continuously stream any personal data. The reports are stored locally on the phone in cyclical buffer. Reports are being sent only when triggered by a crash, through a bug reporting UI or from an applications code.
Data sent along with the reports may include video recording of screen, network and console logs. These may potentially contain PII (Personally Identifiable Information).

It is the sole responsibility of the application developers to remove any such data from the reports before it leaves the users’ device.

Bugsee provides the tools and means to either prevent some data of being collected or clean the data during the collection process:

* [Video and Touch](/sdk/cordova/privacy/video/)
* [Console logs](/sdk/cordova/privacy/logs/)
* [Network logs](/sdk/cordova/privacy/network/)











