---
title: "Network capture"
description: "How to set up network traffic capture in Xamarin apps using Bugsee, covering HttpWebRequest, HttpClient, and NSUrlConnection on iOS and Android."
sidebar_position: 8
slug: "/sdk/xamarin/network"
---

:::caution[Deprecated]
Microsoft ended support for Xamarin on May 1, 2024. The Bugsee Xamarin SDK is no longer actively maintained. For new projects, use the [Bugsee .NET SDK](/sdk/dotnet/installation/), which supports .NET MAUI and modern .NET workloads.
:::

Xamarin provides various options to request data from remote services (via HTTP, FTP, etc.). Some of them are quite easy to intercept while others need additional actions in your code.

## Capturing network in Android and iOS apps

This section describes network APIs, whose network events can be captured the same way for Android and iOS apps.

### HttpWebRequest / HttpWebResponse

All requests made with  ```WebRequest.Create('https://domain.com')``` are captured automatically and do not require any changes in your code. Bugsee will capture all the data passed through the returned ```HttpWebRequest``` instance.

:::warning
While capturing network requests made using the instances obtained through WebRequest.Create() work out of the box, currently we are not able to capture requests made from direct instantiation of HttpWebRequest: <code class="csharp"><span class="hljs-keyword">new</span> HttpWebRequest(<span class="hljs-string">"https://domain.com"</span>)
</code>
:::

## Capturing network in an iOS app

Bugsee captures network requests from the following classes:

### HttpClient

When using ```HttpClient``` check the back-end you are using for it. Xamarin offers 3 options (can be selected in project settings):

- NSUrlSession
- Managed
- CFNetwork

```NSUrlSession``` case will work out of the box, others require a minor change to your code. Bugsee provides a custom message handler which needs to be hooked to every ```HttpClient``` instance upon construction:

```csharp
using System.Net.Http;
using BugseePlugin;

// replace this:
var httpClient = new HttpClient();

// with this:
var httpClient = new HttpClient(Bugsee.GetHttpMessageHandler());

// Send requests as usual
// ...
```

### NSUrlConnection

All requests made with ```NSUrlConnection``` are captured automatically and do not require any changes in your code.

## Capturing network in Android app

Bugsee provides methods to capture ```HttpClient``` and ```ModernHttpClient``` network events.

### HttpClient

Bugsee provides a custom message handler which needs to be hooked to every ```HttpClient``` instance upon construction:

```csharp
using System.Net.Http;
using BugseePlugin;

// replace this:
var httpClient = new HttpClient();

// with this:
var httpClient = new HttpClient(Bugsee.GetHttpMessageHandler());

// Send requests as usual
// ...
```

## Wrapping existing HttpClientHandler (iOS and Android)

If you have your own `HttpClientHandler` or its implementation is provided by some third-party, you can wrap it with handler provided by Bugsee, to let us capture all the network requests made through that handler.

Consider an example with ```ModernHttpClient```, which works very similar to ```HttpClient```:

```csharp
using System.Net.Http;
using BugseePlugin;

// replace this:
var httpClient = new HttpClient(new NativeMessageHandler()); // NativeMessageHandler comes from ModernHttpClient library.

// with this:
var httpClient = new HttpClient(Bugsee.GetHttpMessageHandler(new NativeMessageHandler())); // Wrap NativeMessageHandler.

// Send requests as usual
// ...
```