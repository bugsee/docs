---
title: "Maven Installation"
description: "Instructions for adding the Bugsee Android SDK as a Maven dependency and configuring the required manifest entries manually."
sidebar_position: 1
slug: "/sdk/android/v6/maven-installation"
---

:::caution[Previous version]
This page documents Bugsee Android SDK **6.x**, the previous major version. The current line is **7.x** — see [Migrating from 6.x to 7.x](/sdk/android/migration) to upgrade, or [Installation](/sdk/android/installation) to start a new integration.
:::

> **Note:** this information is only for those, who use Maven to build their Android projects.

Add Bugsee dependency to your pom.xml

```xml
<project >
	<dependencies>
	<!-- App dependencies... -->
	
	<!-- Bugsee dependency-->
		<dependency>
			<groupId>com.bugsee</groupId>
			<artifactId>bugsee-android</artifactId>
			<version>6.0.4</version> <!-- Check Maven Central for the latest 6.x release -->
			<type>aar</type>
		</dependency>
	</dependencies>
</project>
```

Maven can't merge app's and library's manifests automatically. That's why it is necessary to add library's permissions and activities to app's AndroidManifest.xml manually

```xml
<manifest >
	<!-- Bugsee permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
	
	<application >
	<!-- App activities ... -->
	
	<!-- Bugsee activities -->
		<activity
            android:name="com.bugsee.library.RequestPermissionsActivity"
            android:theme="@style/BugseeTheme.Transparent" />
        <activity
            android:name="com.bugsee.library.send.SendBundleActivity"
            android:theme="@style/BugseeActivityStyle" >
        </activity>
        <activity
            android:name="com.bugsee.library.activity.EditScreenshotActivity"
            android:theme="@style/BugseeActivityStyle" >
        </activity>
		<activity 
			android:name="com.bugsee.library.activity.FeedbackActivity"
            android:theme="@style/BugseeActivityStyle">
        </activity>
	</application>
</manifest>
```  