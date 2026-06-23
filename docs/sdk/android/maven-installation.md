---
title: "Maven Installation"
description: "Installing Bugsee Android SDK 7.0 via Apache Maven and the Android Maven Plugin."
sidebar_position: 16
slug: "/sdk/android/maven-installation"
---

:::caution[Gradle is strongly recommended]
A large portion of 7.0 functionality is delivered through the Bugsee Gradle plugin (`com.bugsee:bugsee-android-gradle-plugin`): bytecode instrumentation for APM, main-thread misuse detection, automatic network-client interception, Compose secure-modifier auto-injection, and mapping / native-symbol uploads. **None of those features are available under a plain Maven build** — you will need to wire equivalents manually, or accept that they are disabled.

If you have a choice, please use the [Gradle installation](/sdk/android/installation) instead.
:::

This page is for projects that must build with Apache Maven (typically via the Android Maven Plugin) and cannot use Gradle.

## Add the repository

7.0 is published to **Maven Central**. Maven Central is enabled by default in modern Maven installs, but if your `settings.xml` restricts repositories, add:

```xml
<repositories>
  <repository>
    <id>central</id>
    <url>https://repo.maven.apache.org/maven2</url>
  </repository>
</repositories>
```

## Add the core dependency

All 7.0 artifacts are published under the `com.bugsee` group as Android `aar` packages. Add the core SDK to your `pom.xml`:

```xml
<dependency>
  <groupId>com.bugsee</groupId>
  <artifactId>bugsee-android</artifactId>
  <version>7.0.0</version>
  <type>aar</type>
</dependency>
```

Replace the version with the latest 7.x release.

## Add extension modules

7.0 ships every optional capability as a separate extension artifact. Extensions auto-register at app startup via `ContentProvider`, so adding the dependency is enough to make them visible to the SDK at runtime. Add only the ones you need:

```xml
<!-- In-app feedback / chat UI -->
<dependency>
  <groupId>com.bugsee</groupId>
  <artifactId>bugsee-android-feedback</artifactId>
  <version>7.0.0</version>
  <type>aar</type>
</dependency>

<!-- OkHttp 3 / 4 network capture -->
<dependency>
  <groupId>com.bugsee</groupId>
  <artifactId>bugsee-android-okhttp</artifactId>
  <version>7.0.0</version>
  <type>aar</type>
</dependency>

<!-- Ktor 2.x network capture -->
<dependency>
  <groupId>com.bugsee</groupId>
  <artifactId>bugsee-android-ktor-2</artifactId>
  <version>7.0.0</version>
  <type>aar</type>
</dependency>

<!-- Ktor 3.x network capture -->
<dependency>
  <groupId>com.bugsee</groupId>
  <artifactId>bugsee-android-ktor-3</artifactId>
  <version>7.0.0</version>
  <type>aar</type>
</dependency>

<!-- Cronet network capture -->
<dependency>
  <groupId>com.bugsee</groupId>
  <artifactId>bugsee-android-cronet</artifactId>
  <version>7.0.0</version>
  <type>aar</type>
</dependency>

<!-- Jetpack Compose secure modifier + input capture -->
<dependency>
  <groupId>com.bugsee</groupId>
  <artifactId>bugsee-android-compose</artifactId>
  <version>7.0.0</version>
  <type>aar</type>
</dependency>
```

## Features that require the Gradle plugin

Under Maven the following 7.0 capabilities are **not available automatically** because they depend on build-time transformations performed by `com.bugsee:bugsee-android-gradle-plugin`:

- **APM database and file-I/O instrumentation** — `db.*` and `file.read` / `file.write` spans are produced by bytecode the plugin injects around guarded I/O calls. Without the plugin these spans are never emitted.
- **Main-thread misuse detection** (`Options.DetectAndReportMainThreadMisuse`) — relies on the same bytecode pass as APM dispatch.
- **Automatic OkHttp / Ktor / Cronet interceptor installation** — the plugin normally rewrites `OkHttpClient.Builder.build()` call sites and auto-pulls the matching extension. Under Maven you must manually install each interceptor on every client you create (see each extension's integration notes).
- **Compose secure-modifier auto-injection** — the Kotlin compiler plugin that inserts `Modifier.bugseeSecure()` into password `TextField` call sites does not run. Add the modifier manually to any sensitive Compose field.
- **Compose touch capture** — `AndroidComposeView.dispatchTouchEvent` instrumentation is not applied, so taps inside Compose UI are not recorded.
- **Mapping / NDK symbol / APK / AAB upload tasks** — ProGuard mappings and native debug symbols must be uploaded manually through the Bugsee dashboard or REST API. Crash stack traces will otherwise remain obfuscated / unsymbolicated.

If any of the above are important to your product, switch to the Gradle build. See the [Gradle installation guide](/sdk/android/installation).

## Manifest entries

The Android Maven Plugin merges library manifests, so in most cases no manual `AndroidManifest.xml` edits are required for 7.0. If your build pipeline disables manifest merging, consult each artifact's `AndroidManifest.xml` inside the published AAR and copy the relevant `<provider>`, `<activity>`, and `<uses-permission>` entries into your application manifest.
