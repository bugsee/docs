---
title: "Privacy and Network traffic"
description: "How to disable network monitoring or filter sensitive data from captured network requests and responses in Flutter using a callback handler."
sidebar_position: 3
slug: "/sdk/flutter/privacy/network"
---

## Disabling network traffic collection

Network traffic collection can be disabled completely using **monitorNetwork** launch option. See [configuration](/sdk/flutter/configuration/) for more info. 

## Initializing
In order to let Bugsee intercept network traffic, the following needs to be added to the launch code of your app.

```dart
HttpOverrides.global = Bugsee.defaultHttpOverrides;
```

## Sanitizing data

Bugsee captures network activity from the application and stores headers and in some cases body of the request and response.
In order to allow you to hide user identifiable and other sensitive data from these network logs, we provide you with the
ability to set your own filter via a callback we will call for every event about to be recorded.

For every event to be recorded, Bugsee will call your method and provide you with an **BugseeNetworkEvent** object. It is your
method's responsibility to clean up all user identifiable data from that structure and return a sanitized event back.


### Providing handler

You should pass a callback method:

```dart
Future<BugseeNetworkEvent> onBugseeNetworkEvent(BugseeNetworkEvent e) {
  e.url = "<redacted>";
  return Future.value(e);
}

Bugsee.setNetworkFilter(onBugseeNetworkEvent);
```

### Network Events

The callback is going to be called several times for each network request, depending on its life cycle. Usually for
successful requests its going to be called twice, once with the request event (request headers and body) and one more time after
completion and will contain headers and body of the response. Note that callback can be called more times, initially without body and then with it for both request and response.


|Property|Description|Type|Read only|Notes
|---|---|---|---|---|
|body|Body|String|No|Raw body of the request or response where available.
|type|Type of network event|String|No|Can be one of 'before', 'complete', 'error', 'cancel'
|headers|HTTP Headers|Map<String, String>|No|
|method|HTTP Request Method|String|No|'GET', 'POST', etc...
|redirectUrl|URL of Network event that we were redirected from|String|No|
|Url|Network event URL|String|No|