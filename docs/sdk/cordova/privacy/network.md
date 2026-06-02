---
title: "Privacy and Network traffic"
description: "How to disable network capture or install a filter to remove sensitive data from network events in the Bugsee Cordova SDK."
sidebar_position: 2
slug: "/sdk/cordova/privacy/network"
---

## Disabling network traffic collection

Network traffic collection can be disabled completely by providing corresponding launch flags. Refer to [configuration](/sdk/cordova/configuration/) and look for **monitorNetwork** launch option for more info.


## Sanitizing data

Bugsee captures network activity from the application and stores headers and in some cases body of the request and response.
In order to allow you to hide user identifiable and other sensitive data from these network logs, we let you hook into network capturing by installing network filter handler that will be called for every event about to be recorded.

For every event to be recorded, Bugsee will call your method and provide you with an object containing captured data. It is your method's responsibility to clean up all user identifiable data from that structure and return it back to Bugsee.

```javascript
Bugsee.setNetworkFilter(function (netEvent) {
    // Filter event here as required, or return null to ignore it
    return netEvent;
});

// To remove previously set network filter handler, just pass null to setNetworkFilter()
Bugsee.setNetworkFilter(null);
```

### Network Events

The handler is going to be called several times for each network request, depending on its life-cycle. Usually for
successful requests its going to be called twice, once with the request event (request headers and body) and once after
completion and will contain headers and body of the response.


|Property|Description|Type|Read only|Notes
|---|---|---|---|---|
|type|Type of network event|String|YES| 'begin', 'complete', 'cancel' or 'error'|
|method|HTTP Request Method|String|YES|'GET', 'POST', etc...
|url|Network event URL|String|NO|
|redirected_from|URL of Network event that we were redirected from|String|NO|
|body|Body|String|NO|Raw body of the request or response where available.
|headers|HTTP Headers|Object|NO|Key-value map of HTTP headers associated with the event.|