---
title: "Feedback"
description: "Installing and using @bugsee/react-native-feedback, the in-app feedback chat for Bugsee React Native SDK 7.x: showing the chat, the greeting, message listeners and chat colors."
sidebar_position: 18
slug: "/sdk/react_native/feedback"
---

:::warning[Beta]
This page documents Bugsee React Native SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/react_native/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/react_native/migration).
:::

Bugsee includes an in-app chat that lets your users talk to your support team and developers. In 7.x it ships as its own package, `@bugsee/react-native-feedback`, so apps that never show it do not depend on it.

## Installation

Add the feedback package next to `@bugsee/react-native`. The two must be the **same release**: install both at the same version, or both with the `@beta` tag. Nothing enforces it: the package's peer dependency accepts any `@bugsee/react-native` from `7.0.0-beta3` on.

```sh
yarn add @bugsee/react-native@beta @bugsee/react-native-feedback@beta
```

`npm install` and `pnpm add` work the same way. The requirements are those of `@bugsee/react-native`: React Native 0.81 or later with the New Architecture, Hermes, iOS 15.1 or later (15.0 with Swift Package Manager) and Android API 21 or later; see [Installation](/sdk/react_native/installation#requirements).

The native side comes with the package, at the versions the core package pins:

| Platform | What is added |
| --- | --- |
| Android | Autolinking adds the Android feedback module, `com.bugsee:bugsee-android-feedback`, at the same version as the core Android SDK (7.4.2 in this beta). No Gradle changes. |
| iOS | With CocoaPods, run `pod install`: the podspec fetches the sources of the iOS feedback package, `bugsee/feedback-spm`, at the same version as the core iOS SDK (7.0.0-beta7 in this beta), and compiles them. With React Native 0.87 and later, Swift Package Manager resolves that package instead. |

The package has no Expo config plugin.

## Showing the chat

Open the chat from your own UI, such as a "Contact support" button, with `showFeedbackUI()`:

```tsx
import { Button } from 'react-native';
import { showFeedbackUI } from '@bugsee/react-native-feedback';

function ContactSupportButton() {
  return <Button title="Contact support" onPress={() => showFeedbackUI()} />;
}
```

Call the feedback functions after `Bugsee.launch` has resolved. On Android, `showFeedbackUI()` does nothing before launch. On iOS the chat opens before launch, but nothing is sent until the SDK has launched. If the native module is not linked (for example, the app was not rebuilt after installing the package), importing `@bugsee/react-native-feedback` throws.

Before the conversation starts, the chat shows an e-mail screen. On this screen the user can leave an address for replies. The screen stays until the user continues or skips it. When the [user identifier](/sdk/react_native/user-session-data#user-identity) contains an `@`, the chat takes it as the user's address and does not ask. Android checks the identifier once per launch, at the first feedback call, so set the identifier before your first feedback call. On iOS, the chat's messages carry the user identifier when the user gave no address.

## Greeting

`setGreeting(greeting)` sets the app's greeting, shown at the top of an empty conversation. `null` clears it. Android: a greeting set in the Bugsee dashboard takes precedence over the app's. iOS: the chat shows the app's greeting; a greeting set in the dashboard is not used in this beta.

```ts
import { setGreeting } from '@bugsee/react-native-feedback';

setGreeting('Hi! How can we help?');
```

A value that is neither a string nor `null` throws `TypeError`.

## Message listeners

`setListener(listener)` tells you about chat traffic, for example to show a badge when support has replied:

```ts
import { setListener } from '@bugsee/react-native-feedback';

setListener({
  onNewMessagesReceived(messages) {
    // New messages from your support team
    console.log(`${messages.length} new support message(s)`);
  },
  onNewMessageSent(message) {
    // A message the user just sent
  },
});

// Later: stop listening
setListener(null);
```

| Callback | Receives | When |
| --- | --- | --- |
| `onNewMessagesReceived` | `readonly string[]` | New messages arrived from your support team. |
| `onNewMessageSent` | `string` | The user sent a message. |

- Both callbacks are optional, and both are called on the JavaScript thread.
- There is one listener at a time. A later call replaces it, and `null` removes it.
- A value that is not an object or `null` (an array, a function) throws `TypeError`.
- A listener is JavaScript state: after a JavaScript reload, call `setListener` again.

## Appearance

The `appearance` object sets the chat's colors. Assign a hex color to a property:

```ts
import { Platform } from 'react-native';
import { appearance } from '@bugsee/react-native-feedback';

appearance.backgroundColor = '#101828';
appearance.outgoingBubbleColor = '#7f56d9';

if (Platform.OS === 'android') {
  appearance.actionBarColor = '#101828';
}
```

- Colors are CSS hex strings: `#RGB`, `#RGBA`, `#RRGGBB` or `#RRGGBBAA`, alpha last. The `#` is optional, and `#RRGGBB` is opaque.
- A value that is not a string throws `TypeError`; a string that is not a hex color throws `RangeError`.
- Each color exists on Android, on iOS, or on both. Setting one on a platform that does not have it throws `RangeError`, so check `Platform.OS` for the platform-only ones.
- Reading a property returns the value you last set in this JavaScript runtime, or `undefined`.

| Property | Android | iOS |
| --- | --- | --- |
| `backgroundColor` | Yes | Yes |
| `incomingBubbleColor`, `outgoingBubbleColor` | Yes | Yes |
| `incomingTextColor`, `outgoingTextColor` | Yes | Yes |
| `inputTextColor` | Yes | Yes |
| `titleTextColor` | Yes | Yes |
| `emailBackgroundColor` | Yes | Yes |
| `emailContinueActiveColor`, `emailContinueNotActiveColor` | Yes | Yes |
| `actionBarColor`, `actionBarButtonBackgroundClickedColor` | Yes | |
| `bottomDelimiterColor` | Yes | |
| `dateTextColor` | Yes | |
| `emailContinueClickedColor` | Yes | |
| `emailSkipTextColor`, `emailSkipBackgroundClickedColor` | Yes | |
| `errorTextColor` | Yes | |
| `inputTextHintColor` | Yes | |
| `loadingBarBackgroundColor`, `loadingTextColor` | Yes | |
| `versionChangedBackgroundColor`, `versionChangedTextColor` | Yes | |
| `barsColor` | | Yes |
| `closeButtonColor` | | Yes |
| `emailSkipColor` | | Yes |
| `inputBackgroundColor` | | Yes |
| `navigationBarColor` | | Yes |

Native SDK reference for what each color paints: [Android feedback appearance](/sdk/android/appearance#feedbackappearance). The iOS documentation has no such list; the caution below says which colors the iOS chat applies.

:::caution[iOS: most chat colors are not applied in this beta]
On iOS, the colors are accepted, but the chat in this beta uses only some of them. It paints its background with `backgroundColor`, and its e-mail screen with `emailBackgroundColor`, `emailSkipColor`, `emailContinueActiveColor` and `emailContinueNotActiveColor`. The message bubbles use the system accent color and gray, and the other colors do not change the chat.
:::

The colors of the bug report dialog are set separately, on `Bugsee.appearance`; see [Appearance](/sdk/react_native/appearance).

## Privacy

The messages a user sends, and the e-mail address they leave, are sent to Bugsee for your team to read. A webhook can receive them as the [`feedback.message.in`](/webhooks/events#feedbackmessagein) and [`feedback.message.out`](/webhooks/events#feedbackmessageout) events.

## Related pages

- [Appearance](/sdk/react_native/appearance): the report dialog's colors.
- [User & session data](/sdk/react_native/user-session-data): the user identifier the chat reads.
- [Installation](/sdk/react_native/installation): the core package.
