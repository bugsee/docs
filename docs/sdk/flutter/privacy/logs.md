---
title: "Privacy and console logs"
description: "How to disable console log collection or sanitize log content in Flutter to remove personally identifiable information before it is recorded."
sidebar_position: 2
slug: "/sdk/flutter/privacy/logs"
---

## Disabling log collection

Console log collection can be disabled completely using **captureLogs** launch option. See [configuration](/sdk/flutter/configuration/) for more info.

## Sanitizing console logs

Bugsee automatically captures all standard applications console logs, but they can be protected as well.

For every event to be recorded, Bugsee will call your method and provide you with a **BugseeLogEvent** object. It is your
method's responsibility to clean up all user identifiable data from that structure and return a sanitized event back

### Providing handler

You should pass a callback method to Bugsee.setLogFilter().

```dart
Future<BugseeLogEvent> onBugseeLogEvent(BugseeLogEvent logEvent) {
  logEvent.text = "Filtered: " + logEvent.text;
  return Future.value(logEvent);
}

Bugsee.setLogFilter(onBugseeLogEvent);
```
