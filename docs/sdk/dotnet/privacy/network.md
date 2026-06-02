---
title: "Privacy and Network traffic"
description: "How to disable or sanitize captured network traffic in the Bugsee .NET SDK to remove sensitive data from request and response logs."
sidebar_position: 3
slug: "/sdk/dotnet/privacy/network"
---

## Disabling network traffic collection

Network traffic collection can be disabled completely using **MonitorNetwork** launch option. See [configuration](/sdk/dotnet/configuration/) for more info. 

## Sanitizing data

Bugsee captures network activity from the application and stores headers and in some cases body of the request and response.
In order to allow you to hide user identifiable and other sensitive data from these network logs, we provide you with the
ability to set your own filter via a callback we will call for every event about to be recorded.

For every event to be recorded, Bugsee will call your method and provide you with an object implementing IBugseeNetworkEvent. It is your
method's responsibility to clean up all user identifiable data from that structure and call provided handler() to pass it
back to Bugsee.

### Providing handler

You should pass a callback method (either as delegate or anonymous function) of **BugseeNetworkEventFilterHandler** to Bugsee.SetNetworkEventFilter().

```csharp
var rgx = new System.Text.RegularExpressions.Regex("token=[^&]+", RegexOptions.IgnoreCase);

Bugsee.SetNetworkEventFilter(delegate (IBugseeNetworkEvent netEvent, BugseeNetworkEventFilterDecisionHandler handler)
{
    netEvent.Url = rgx.Replace(netEvent.Url, "<redacted>");

    // Pass null here to filter out that event
    handler.Invoke(netEvent);
});

// To stop using provided filter callback, just pass null
Bugsee.SetNetworkEventFilter(null);
```

### Network Events

The callback is going to be called several times for each network request, depending on its life cycle. Usually for
successful requests its going to be called twice, once with the request event (request headers and body) and one more time after
completion and will contain headers and body of the response. Note that callback can be called more times, initially without body and then with it for both request and response.


|Property|Description|Type|Read only|Notes
|---|---|---|---|---|
|Body|Body|Object|No|Raw body of the request or response where available.
|BugseeNetworkEventType|Type of network event|BugseeNetworkEventType|No|Can be one of Before, Complete, Error, Cancel
|Error|HTTP error information|IDictionary<string, string>|No|
|Headers|HTTP Headers|IDictionary<string, string>|No|
|Method|HTTP Request Method|String|No|'GET', 'POST', etc...
|NoBodyReason|Reason why body was not captured|Enum|No|Can be one of None, SizeTooLarge, UnsupportedContentType, NoContentType, CantReadData
|RedirectedFromURL|URL of Network event that we were redirected from|String|No|
|ResponseCode|HTTP response code|Int32|No|200, 304, 404, etc
|Url|Network event URL|String|No|