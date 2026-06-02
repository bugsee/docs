---
title: "Frequently asked questions"
description: "Answers to common questions about the Bugsee Android SDK, including minimum OS version, memory usage, and migration issues."
sidebar_position: 14
slug: "/sdk/android/faq"
---

**1. What is the minimum Android version supported by Bugsee Android SDK?**

Bugsee Android SDK supports Android 5.0 (API level 21) and up.

<br />

**2. What is the memory footprint of Bugsee Android SDK?**

Amount of RAM, used by Bugsee, depends on the chosen video mode and is presented in the following table

|VideoMode|Bugsee RAM footprint (MB)
|---|---|
|None|20|
|V1|27|
|V2|28|
|V3 (default)|28|

These values were measured on Google Pixel 5 with Android 12 and can be influenced by device screen size.

<br />

**3. After updating Bugsee Android SDK to version ```1.15.0``` I get the following error:**

```text
AAPT: error: attribute android:foregroundServiceType not found.
```

Please, switch `compileSdk` in your build.gradle to the latest version (at least 35, as shown below).
```groovy
android {
    compileSdk 35
    // ...
}
```

<br />

**4. It takes too much time for the report to appear in the Bugsee web dashboard. Why?**

Please check the following:

- Make sure Internet is available on the device (e.g. try to open a web page in the browser)
- Make sure you don't have WifiOnlyUpload enabled via launch options. If it's enabled, you need to be connected to WiFi for the report to be uploaded.
- If you're trying to upload crash report, you need to relaunch the application to trigger the upload. Crash report is uploaded on the next application launch.


<br />

---
If your question is not listed here, please let us know at [support@bugsee.com](mailto:support@bugsee.com)