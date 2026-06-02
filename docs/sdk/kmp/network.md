---
title: "Network capture (Beta)"
description: "How network traffic is captured in the Bugsee KMP SDK on Android and iOS, with links to filtering and privacy controls."
sidebar_position: 8
slug: "/sdk/kmp/network"
---

Unlike some wrapper SDKs that require explicit network interception setup, the Bugsee KMP SDK captures network traffic automatically through the underlying native SDKs.

## Ktor

[Ktor](https://ktor.io/docs/client-create-new-application.html) is the most popular networking library for Kotlin Multiplatform. Bugsee automatically intercepts network requests made via Ktor on both platforms without any additional setup.

## Android

Network requests made via OkHttp, Ktor, and standard `HttpURLConnection` are captured automatically.

## iOS

`URLSession`-based network traffic is captured automatically. Ktor's Darwin engine is built on top of `URLSession`, so Ktor requests on iOS are captured through the same mechanism.

## Filtering

To sanitize or suppress specific network events before they are recorded, see [Privacy and network traffic](/sdk/kmp/privacy/network/).

## Configuration

Network capture can be disabled entirely with the `monitorNetwork` launch option. See [configuration](/sdk/kmp/configuration/) for details.
