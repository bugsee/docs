---
title: "Installation"
description: "Step-by-step guide to installing the Bugsee Flutter SDK via pub.dev and initializing it with proper error and isolate capture setup."
sidebar_position: 0
slug: "/sdk/flutter/installation"
---

:::info[Agent-Assisted Setup]
Ask your AI coding assistant:

```text
Use curl to download, read and follow: https://docs.bugsee.com/ai/agent-skills/sdk/flutter/SKILL.md
```

Works with Claude Code, Cursor, Copilot, Codex, and more. [Learn more](/ai/agent-skills/)
:::

## SDK Installation

Install the Bugsee plugin in your Dart project by adding it to dependencies in your pubspec.yaml

```
dependencies:
  bugsee_flutter: ^8.0.0
```

## Initialization

In order to allow Bugsee to properly intercept and report unhandled exceptions, it is best to first initialize Bugsee and then initialize the rest of the app. This approach will guarantee that the app is running in a Zone, binding channel, etc. The following example also assumes you are using different apps in Bugsee for Android and iOS deployments, which is very typical.

```dart
import 'package:bugsee_flutter/bugsee.dart';

String getApplicationToken() {
  return Platform.isAndroid
      ? '<android-app-token>'
      : (Platform.isIOS ? '<ios-app-token>' : '');
}

Future<void> launchBugsee(
    void Function(bool isBugseeLaunched) appRunner) async {
  await Bugsee.launch(getApplicationToken(), appRunCallback: appRunner);
}

Future<void> main() async {
  // This is required to let Bugsee intercept network requests. You can
  // remove the line below if you don't want/need to intercept them.
  HttpOverrides.global = Bugsee.defaultHttpOverrides;

  await launchBugsee((bool isBugseeLaunched) async {
    runApp(const MyApp());
  });
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // ....
}
```

See [configuration](/sdk/flutter/configuration/) to learn more on Bugsee launch options and customizations.

## Important tips to ensure all errors are captured

- To capture handled exceptions use a try/catch block and send the exception to Bugsee using ```Bugsee.logException()```.
```dart
void throwAndCatch() {
  try {
    throw FormatException('Expected at least 1 section');
  } catch (ex, st) {
    Bugsee.logException(ex, st);
  }
}
```
<div>&nbsp;</div>

- For instances of ```Future```, use a ```catchError``` block
- Isolate errors on the main ```Isolate``` (which is the equivalent of the main/UI thread) are captured automatically when Bugsee is launched according to the instructions above.
- Add an error listener to your ```Isolate``` by calling ```isolate.addBugseeErrorListener()``` or start the Isolate with ```BugseeIsolate.spawn()```.


```dart
// Example of adding an error listener to an Isolate
void startIsolate() async {
  // According to the Dart documentation:
  // ------------------------------------
  // Since isolates run concurrently, it's possible for it to
  // exit before the error listener is established. To avoid
  // this, start the isolate paused, add the listener and
  // then resume the isolate.

  Isolate isolate = await Isolate.spawn((message) {
    // Your code here
  }, "", paused: true, errorsAreFatal: false);
  isolate.addBugseeErrorListener();
  if (isolate.pauseCapability != null) {
    isolate.resume(isolate.pauseCapability!);
  }
}

// Example of starting an Isolate with BugseeIsolate.spawn()
void spawnIsolate() async {
  await BugseeIsolate.spawn((message) {
    // Your code here
  }, null);
}
```