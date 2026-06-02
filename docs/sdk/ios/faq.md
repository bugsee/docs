---
title: "Frequently asked questions"
description: "Answers to common questions about iOS SDK minimum requirements, memory usage, delayed reports, and missing crash reports in the Bugsee dashboard."
sidebar_position: 13
slug: "/sdk/ios/faq"
---

**1. What is the minimum iOS version supported by Bugsee iOS SDK?**

Bugsee iOS SDK supports iOS 12.0 and up.

<br />

**2. What is the memory footprint of Bugsee iOS SDK?**

The precise amount of RAM used by Bugsee depends on the device specifications and application behavior (e.g. screen resolution, frame rate, etc). The generic application case is presented in the table below.

|Bugsee state|Bugsee RAM footprint (MB)
|---|---|
|Without Bugsee|44|
|With Bugsee enabled|60|

These values were produced by testing Bugsee SDK in a sample application on iPhone Xs. The "Without Bugsee" row shows the baseline RAM usage of the app.

<br />

**3. It takes too much time for the report to appear in the Bugsee web dashboard. Why?**

Please check the following:

- Make sure Internet is available on the device (e.g. try to open a web page in the browser)
- Make sure you don't have WifiOnlyUpload enabled via launch options. If it's enabled, you need to be connected to WiFi for the report to be uploaded.
- If you're trying to upload crash report, you need to relaunch the application to trigger the upload. Crash report is uploaded on the next application launch.


<br />

**4. Crash report does not appear in Bugsee dashboard. Why?**

- Make sure you're using the correct application token when launching Bugsee in your code
- Make sure Internet is available on the device (e.g. try to open a web page in the browser)
- Make sure you don't have WifiOnlyUpload enabled via launch options. If it's enabled, you need to be connected to WiFi for the report to be uploaded.
- Make sure you're not triggering the crash with Debugger attached. When Debugger is attached, it will handle the signal/unhandled exception and will not let Bugsee handle it.
- If you're using multiple crash reporting tools, try disabling other crash reporters. It's a known limitation that crash reporters may interfere with each other.
- If you're trying to upload crash report, you need to relaunch the application to trigger the upload. Crash report is uploaded on the next application launch.

<br />

---
If your question is not listed here, please let us know at [support@bugsee.com](mailto:support@bugsee.com)