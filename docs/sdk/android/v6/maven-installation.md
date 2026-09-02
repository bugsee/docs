---
title: "Maven Installation"
description: "Instructions for adding the Bugsee Android SDK as a Maven dependency and configuring the required manifest entries manually."
sidebar_position: 1
slug: "/sdk/android/v6/maven-installation"
---

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
			<version>1.11.7</version> <!-- The latest Bugsee version -->
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
</manifest
```  