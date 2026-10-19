---
title: "Appearance"
description: "Customizing the colors of the Bugsee report dialog in React Native SDK 7.x with Bugsee.appearance: the color properties on each platform, reading them back, and errors."
sidebar_position: 20
slug: "/sdk/react_native/appearance"
---

:::warning[Beta]
This page documents Bugsee React Native SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/react_native/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/react_native/migration).
:::

`Bugsee.appearance` sets the colors of the bug report dialog, so that it matches your app. It is one surface for both platforms: each property sets one color of the report dialog, on Android, on iOS, or on both.

The colors of the feedback chat are set on the feedback package's own `appearance`; see [Feedback](/sdk/react_native/feedback#appearance).

## Setting colors

Assign a hex color string to a property:

```ts
import { Platform } from 'react-native';
import Bugsee from '@bugsee/react-native';

Bugsee.appearance.backgroundColor = '#101828';
Bugsee.appearance.textColor = '#ffffff';
Bugsee.appearance.versionColor = '#98a2b3';

if (Platform.OS === 'android') {
  Bugsee.appearance.actionBarColor = '#1d2939';
  Bugsee.appearance.actionBarTextColor = '#ffffff';
} else {
  Bugsee.appearance.navigationBarColor = '#1d2939';
  Bugsee.appearance.cellBackgroundColor = '#1d2939';
}
```

- Colors are CSS hex strings: `#RGB`, `#RGBA`, `#RRGGBB` or `#RRGGBBAA`, with alpha last. The `#` is optional, and `#RRGGBB` is opaque.
- The color is applied during the assignment, synchronously.
- Set the colors in your startup code, before a report dialog can open. You can set them before or after `Bugsee.launch`. Colors are kept in memory only, on both platforms, so set them at every app start.

## Color properties

Each property exists on Android, on iOS, or on both:

| Property | Android | iOS |
| --- | --- | --- |
| `backgroundColor` | `ReportAppearance.BackgroundColor`: the dialog's background. | `reportBackgroundColor` |
| `textColor` | `ReportAppearance.TextColor`: text and input text. | `reportTextColor`: label text. |
| `versionColor` | `ReportAppearance.VersionColor`: the version label. | `reportVersionColor`: the version label. |
| `actionBarColor` | `ReportAppearance.ActionBarColor`: the action bar's background. | |
| `actionBarTextColor` | `ReportAppearance.ActionBarTextColor`: the action bar's button text. | |
| `actionBarButtonBackgroundClickedColor` | `ReportAppearance.ActionBarButtonBackgroundClickedColor`: an action bar button's background while pressed. | |
| `editTextBackgroundColor` | `ReportAppearance.EditTextBackgroundColor`: the input fields' background. | |
| `hintColor` | `ReportAppearance.HintColor`: the input fields' hint text. | |
| `severityLabelActiveColor` | `ReportAppearance.SeverityLabelActiveColor`: the selected severity label. | |
| `cellBackgroundColor` | | `reportCellBackgroundColor`: the background of the table cells. |
| `navigationBarColor` | | `reportNavigationBarColor` |
| `placeholderColor` | | `reportPlaceholderColor`: the input fields' placeholder text. |
| `sendButtonColor` | | `reportSendButtonColor`. **Not applied** in iOS SDK 7.0.0-beta7, whose report screen uses the system Done button. |
| `closeButtonColor` | | `reportCloseButtonColor`. **Not applied** in iOS SDK 7.0.0-beta7, whose report screen uses the system Cancel button. |

Check `Platform.OS` before setting a property that exists on one platform only: setting it on the other throws.

The report dialog has more appearance settings than these colors. The field placeholder texts (`ReportAppearance.SummaryPlaceholder` and the others on Android, `reportSummaryPlaceholder` and the others on iOS), the title of the Android notification, and the iOS theme `style` are not available from JavaScript in this beta.

## Reading colors

Reading a property returns the color in effect, as a lowercase `#rrggbbaa` string, alpha last:

```ts
import Bugsee from '@bugsee/react-native';

const background = Bugsee.appearance.backgroundColor; // for example '#101828ff', or undefined
```

| Platform | A color you have not set |
| --- | --- |
| Android | `undefined`: only the colors you set are stored. |
| iOS | The iOS theme's default for that color. |

Reading a property that does not exist on the running platform returns `undefined`.

## Errors

An assignment that is rejected throws, and changes nothing:

| Assignment | Thrown |
| --- | --- |
| A value that is not a string | `TypeError` |
| A string that is not a hex color | `RangeError` |
| A property that does not exist on the running platform | `RangeError` |
| A name that is not one of the properties above (a typo, for example) | `RangeError` |
| A color that could not be applied | `Error` (`… was not applied`) |

Error messages name the property, never the value you assigned.

## Related pages

- [Feedback](/sdk/react_native/feedback#appearance): the feedback chat's colors.
- [Bug reporting](/sdk/react_native/manual/bug-reporting): the report dialog and its fields.
- Native SDK reference: [Android appearance](/sdk/android/appearance#reportappearance) and [iOS appearance](/sdk/ios/appearance).
