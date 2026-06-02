---
title: "Privacy and console logs"
description: "How to disable or filter console log capture in the Bugsee Cordova SDK to prevent PII from being included in reports."
sidebar_position: 3
slug: "/sdk/cordova/privacy/logs"
---

## Disabling log collection

Console log collection can be disabled completely by providing corresponding launch flags. Refer to [configuration](/sdk/cordova/configuration/) and look for **captureLogs** launch option for more info.

## Sanitizing console logs

Bugsee automatically captures all standard applications console logs, but they can be protected as well.

For every event to be recorded, Bugsee will call your method and provide you with an object with captured data. It is your
method's responsibility to clean up all user identifiable data from that structure and return it back to Bugsee.

### Providing handler

You should pass a callback to Bugsee.setLogFilter().

```javascript
Bugsee.setLogFilter(function (logEvent) {
    // Filter log event here or return
    // null to prevent it from being
    // recorded at all
    return logEvent;
});

// To stop using provided filter callback, just pass null
Bugsee.setLogFilter(null);
```

### Logging Events

The handler is going to be called one time for each logged message.


|Property|Description|Type|Read only|Notes
|---|---|---|---|---|
|text|Text being logged|String|NO||
|level|Logging level|Number|NO|1 - error, 2 - warning, 3 - info, 4 - debug, 5 - verbose|