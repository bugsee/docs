---
title: "Feedback"
description: "Installing and using bugsee_flutter_feedback, the in-app feedback chat for Bugsee Flutter SDK 10.x: showing the chat, the greeting, message streams and errors."
sidebar_position: 17
slug: "/sdk/flutter/feedback"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta, is not published on pub.dev yet and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

Bugsee includes an in-app chat where your users write to you from inside the app, with the same session context Bugsee already captures, and you answer from the Bugsee dashboard. In 10.x it is its own package, `bugsee_flutter_feedback`, so apps that never show it do not carry it. It replaces the 9.x `showFeedbackUI`, `setDefaultFeedbackGreeting` and `setNewFeedbackMessagesCallback`.

On iOS the chat is a SwiftUI screen, on Android a Jetpack Compose activity (Compose, Material 3 and a rich-text editor come with the package). `bugsee_flutter` itself has neither.

## Installation

The package is a beta and is not on pub.dev yet, so the hosted constraint cannot resolve today. Depend on the repository: give `bugsee_flutter_feedback` a git entry (`path: packages/bugsee_flutter_feedback`, with the same `url` and `ref` as the core, see [Installation](/sdk/flutter/installation)), **and** a `dependency_overrides:` entry for `bugsee_flutter` with the same git source.

Once the packages are published, add both at the same version and nothing else:

```yaml
dependencies:
  bugsee_flutter: ^10.0.0-beta.1
  bugsee_flutter_feedback: ^10.0.0-beta.1
```

The two are released together and pin the same native SDK versions: Android 7.6.0 and iOS 7.1.0. The feedback package accepts a core from the same version up to the next minor, and checks at run time that the core has the same major and minor version.

Everything [Installation](/sdk/flutter/installation) asks for applies unchanged: Flutter 3.50.0 or newer, the `com.bugsee.android.gradle` Gradle plugin applied in your app, iOS 15.0 or newer and Swift Package Manager for iOS.

There is nothing to add to the manifest or to `Info.plist`:

| Platform | What is added |
| --- | --- |
| Android | `com.bugsee:bugsee-android-feedback`, at the same version as the core SDK. Its `FeedbackActivity` and the `INTERNET` permission are merged into your manifest from the AAR. The activity sets its own AppCompat theme, so your app theme does not matter. minSdk 21. |
| iOS | The `BugseeFeedback` product of [`feedback-spm`](https://github.com/bugsee/feedback-spm), pinned to the core SDK's version, through the package's own SwiftPM plugin package. No `Info.plist` keys: the chat sends text only, so it needs no camera, microphone or photo access. |

### How the module registers itself

You do not register anything. The package adds no initialization provider of its own on Android: the feedback AAR declares its own, and with the Bugsee Gradle plugin's default settings the plugin has the SDK register the module instead. If neither happened, the package registers it when the engine attaches. On iOS it registers the module at image load.

`await BugseeFeedback.isAvailable()` tells you whether the SDK has the module. Use it before offering a "Contact support" button.

## Showing the chat

Call the feedback functions after `Bugsee.launch`. On Android, `show()` does nothing before the SDK has launched. On iOS it opens a chat that cannot reach the backend.

```dart
import 'package:bugsee_flutter/bugsee_flutter.dart';
import 'package:bugsee_flutter_feedback/bugsee_flutter_feedback.dart';
import 'package:flutter/widgets.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Bugsee.launch('YOUR_APP_TOKEN');

  // The text an empty conversation opens with (null clears it).
  await BugseeFeedback.setGreeting('How can we help?');

  runApp(const MyApp());
}

// Wherever you offer it, for example a "Contact support" button.
Future<void> onContactSupport() async {
  try {
    if (await Bugsee.waitUntilLaunched() && await BugseeFeedback.isAvailable()) {
      await BugseeFeedback.show();
    }
  } on BugseeFeedbackException {
    // Hide the button or tell the user to try later.
  }
}
```

`waitUntilLaunched` also settles a launch that answered `alreadyRunning` or `deferred`, see [Lifecycle](/sdk/flutter/lifecycle).

## The API

| Member | Description |
| --- | --- |
| `BugseeFeedback.show()` | Presents the chat. |
| `BugseeFeedback.setGreeting(String?)` | The text an empty conversation opens with. `null` clears it. |
| `BugseeFeedback.messagesReceived` | `Stream<List<String>>`: messages from the dashboard, oldest first. |
| `BugseeFeedback.messageSent` | `Stream<String>`: a message the user sent. |
| `BugseeFeedback.isAvailable()` | Whether the SDK has the feedback module. |

Messages are text only. The native listener is installed while a stream has a listener.

The streams fire **only while the chat is on screen**, because both SDKs poll the backend only then. They are not a source of unread badges or notifications, and neither SDK has an unread count.

### User identity

The chat asks the user for an e-mail address itself. It skips that screen when the identifier you set with [`Bugsee.setUserIdentifier`](/sdk/flutter/user-session-data) contains an `@`. The SDKs have no separate user name or e-mail field.

### What is not exposed

The chat's colors (`FeedbackAppearance` on Android, `BugseeTheme` on iOS) are not exposed, like the appearance system of the core package. Neither SDK has an option key for the chat.

## Errors

Every error is a `BugseeFeedbackException`, which is a `BugseeException`, with a `reason`:

| Reason | Meaning |
| --- | --- |
| `notRegistered` | The SDK has no feedback module registered. |
| `incompatibleCore` | The `bugsee_flutter` in the build is not the version this package was released with: a path, git or overridden dependency, or a stale build. |
| `nativeError` | The plugin is not part of the build (a rebuild is missing after adding the package), or the SDK threw. |

On a platform without a Bugsee SDK (desktop, web) the calls do nothing.

## Coming from 9.x

| 9.x | 10.x |
| --- | --- |
| `Bugsee.showFeedbackUI()` | `BugseeFeedback.show()` |
| `Bugsee.setDefaultFeedbackGreeting(greeting)` | `BugseeFeedback.setGreeting(greeting)` |
| `Bugsee.setNewFeedbackMessagesCallback(callback)` | `BugseeFeedback.messagesReceived` and `messageSent` streams |
