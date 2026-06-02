---
title: "Appearance (Beta)"
description: "Reference for all color and placeholder customization options available for the Report and Feedback UI in the Bugsee KMP SDK on iOS and Android."
sidebar_position: 7
slug: "/sdk/kmp/appearance"
---

You can customize colors of the [Report](/sdk/kmp/manual/) and [Feedback](/sdk/kmp/feedback/) UI through the `Bugsee.appearance` property.

Color values are ARGB `Int` values in Kotlin:

```kotlin
Bugsee.appearance.reportBackgroundColor = 0xFF6496B4.toInt()
Bugsee.appearance.feedbackOutgoingBubbleColor = 0xFF4CAF50.toInt()
Bugsee.appearance.reportSummaryPlaceholder = "Describe the issue..."
```

## Common properties

These properties are available on both platforms.

### Placeholders

|Property|Description|
|---|---|
|reportSummaryPlaceholder|Placeholder text for the summary input field|
|reportDescriptionPlaceholder|Placeholder text for the description input field|
|reportLabelsPlaceholder|Placeholder text for the labels input field|
|reportEmailPlaceholder|Placeholder text for the email input field|

### Report colors

|Property|Description|
|---|---|
|reportVersionColor|Version number text color|
|reportTextColor|General text color in Report UI|
|reportBackgroundColor|Background color of Report UI|

### Feedback colors

|Property|Description|
|---|---|
|feedbackBackgroundColor|Background color of Feedback UI|
|feedbackIncomingBubbleColor|Incoming message bubble background color|
|feedbackOutgoingBubbleColor|Outgoing message bubble background color|
|feedbackIncomingTextColor|Incoming message text color|
|feedbackOutgoingTextColor|Outgoing message text color|
|feedbackTitleTextColor|Title bar text color|
|feedbackEmailBackgroundColor|Email prompt popup background color|
|feedbackEmailContinueNotActiveColor|Email continue button color (disabled state)|
|feedbackEmailContinueActiveColor|Email continue button color (enabled state)|
|feedbackInputTextColor|Input message text color|

## Android-only properties

### Report

|Property|Description|
|---|---|
|reportActionBarColor|Action bar background color|
|reportEditTextBackgroundColor|EditText background color|
|reportHintColor|EditText hint text color|
|reportActionBarTextColor|Action bar button text color|
|reportActionBarButtonBackgroundClickedColor|Action bar button background in clicked state|
|reportSeverityLabelActiveColor|Severity label text color in active state|

### Feedback

|Property|Description|
|---|---|
|feedbackActionBarColor|Action bar background color|
|feedbackActionBarButtonBackgroundClickedColor|Action bar button background in clicked state|
|feedbackDateTextColor|Message date text color|
|feedbackEmailSkipTextColor|Email skip button text color|
|feedbackEmailSkipBackgroundClickedColor|Email skip button background in clicked state|
|feedbackEmailContinueClickedColor|Email continue button background in clicked state|
|feedbackInputTextHintColor|Input message hint text color|
|feedbackBottomDelimiterColor|Delimiter between message list and input field|
|feedbackLoadingBarBackgroundColor|Loading bar background color|
|feedbackLoadingTextColor|Loading bar text color|
|feedbackErrorTextColor|Error description text color|
|feedbackVersionChangedBackgroundColor|Version changed bar background color|
|feedbackVersionChangedTextColor|Version changed bar text color|

### Notification

|Property|Description|
|---|---|
|notificationTitleResId|Notification title resource ID|
|notificationTitle|Notification title string|

## iOS-only properties

### Report

|Property|Description|
|---|---|
|reportCellBackgroundColor|Table cell background color|
|reportSendButtonColor|Send button text color|
|reportCloseButtonColor|Close button color|
|reportPlaceholderColor|Input field placeholder color|
|reportNavigationBarColor|Navigation bar background color|

### Feedback

|Property|Description|
|---|---|
|feedbackBarsColor|Navigation and bottom bar colors|
|feedbackInputBackgroundColor|Input field background color|
|feedbackCloseButtonColor|Close button color|
|feedbackNavigationBarColor|Navigation bar color|

### Theme colors (read-only)

|Property|Description|
|---|---|
|mainBugseeColor|Primary Bugsee theme color|
|lowBugColor|Color for low-priority bugs|
|mediumBugColor|Color for medium-priority bugs|
|dotSelectorColor|Dot selector color|
