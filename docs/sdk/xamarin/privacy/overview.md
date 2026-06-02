---
title: "Privacy overview"
description: "Overview of the privacy controls available in the Bugsee Xamarin SDK to protect personally identifiable data in video, logs, and network traffic."
sidebar_position: 0
slug: "/sdk/xamarin/privacy/overview"
---

:::caution Deprecated
Microsoft ended support for Xamarin on May 1, 2024. The Bugsee Xamarin SDK is no longer actively maintained. For new projects, use the [Bugsee .NET SDK](/sdk/dotnet/installation/), which supports .NET MAUI and modern .NET workloads.
:::

Bugsee SDK does not continuously stream any personal data. The reports are stored locally on the phone in cyclical buffer. Reports are being sent only when triggered by a crash, through a bug reporting UI or from an applications code.
Data sent along with the reports may include video recording of screen, network and console logs. These may potentially contain personal data (usernames, passwords, emails, etc).

It is the sole responsibility of the application developers to remove any such data from the reports before it leaves the users’ device.

Bugsee provides the tools and means to either prevent some data of being collected or clean the data during the collection process:

* [Video and Touch](/sdk/xamarin/privacy/video/)
* [Console logs](/sdk/xamarin/privacy/logs/)
* [Network logs](/sdk/xamarin/privacy/network/)