---
title: "Appearance"
description: "Reference for all color customization options available for the Report and Feedback UI in the Bugsee Flutter SDK on iOS and Android."
sidebar_position: 7
slug: "/sdk/flutter/appearance"
---

You can always change colors of the [Report](/sdk/flutter/manual/) and [Feedback](/sdk/flutter/feedback/) UI.

```dart
// For example
  var bgColor = Color.fromARGB(255, 100, 150, 180);

  await Bugsee.appearance.iOS.setReportBackgroundColor(bgColor);
  await Bugsee.appearance.android.setReportBackgroundColor(bgColor);

// ...
// Other colors you can find in Bugsee.appearance.iOS and Bugsee.appearance.android
```

## iOS appearance options

### Report appearance options

|Property|Description|
|---|---|
| setReportBackgroundColor | Background color of Report Controller |
| setFeedbackBarsColor | Navigation bar and bottom bar colors |
| setReportCellBackgroundColor | UITableView cells background color |
| setReportCloseButtonColor | Close UIButton cross color |
| setReportNavigationBarColor | UINavigation bar background color |
| setReportPlaceholderColor | UIInputFields placeholder color |
| setReportSendButtonColor | Send UIButton text color |
| setReportTextColor | UILabels text color |
| setReportVersionColor | UILabel with version number text color |

### Feedback appearance options

|Property|Description|
|---|---|
| setFeedbackBackgroundColor | Background color of feedback controller |
| setFeedbackCloseButtonColor | Close UIButton cross color |
| setFeedbackEmailBackgroundColor | Ask for email popup background color |
| setFeedbackEmailContinueActiveColor | Ask for email continue button background color |
| setFeedbackEmailContinueNotActiveColor | Ask for email continue not active button background color |
| setFeedbackEmailSkipColor | Ask for email popup skip button text color |
| setFeedbackIncomingBubbleColor | Incoming message bubble background color |
| setFeedbackIncomingTextColor | Incoming message text color |
| setFeedbackInputTextColor | Input message text color |
| setFeedbackNavigationBarColor | UINavigationBar color |
| setFeedbackOutgoingBubbleColor | Outgoing message bubble background color |
| setFeedbackOutgoingTextColor | Outgoing message text color |
| setFeedbackTitleTextColor | UINavigationBar title color |


## Android appearance options

### Report appearance options

|Property|Description|
|---|---|
| setReportActionBarButtonBackgroundClickedColor | Action bar buttons background color in clicked state in Report UI |
| setReportActionBarColor | Action bar background color in Report UI |
| setReportActionBarTextColor | Action bar buttons text color in Report UI |
| setReportCellBackgroundColor | Report UI background color |
| setReportEditTextBackgroundColor | EditTexts background color in Report UI |
| setReportHintColor | EditTexts hint text color in Report UI |
| setReportSeverityLabelActiveColor | Issue severity label text color in active state in Report UI |
| setReportTextColor | TextViews and EditTexts text color in Report UI |
| setReportVersionColor | Bugsee version number view text color in Report UI |

### Feedback appearance options

|Property|Description|
|---|---|
| setFeedbackActionBarButtonBackgroundClickedColor | Action bar buttons background color in clicked state in Feedback UI |
| setFeedbackActionBarColor | Action bar background color in Feedback UI |
| setFeedbackBackgroundColor | Feedback UI background color |
| setFeedbackBottomDelimiterColor | Color of delimiter between message list and EditText for new message inputting in Feedback UI |
| setFeedbackDateTextColor | Message date text color in Feedback UI |
| setFeedbackEmailBackgroundColor | Ask for email dialog background color in Feedback UI |
| setFeedbackEmailContinueActiveColor | Ask for email dialog "Continue" button background color in enabled state in Feedback UI |
| setFeedbackEmailContinueClickedColor | Ask for email dialog "Continue" button background color in clicked state in Feedback UI |
| setFeedbackEmailContinueNotActiveColor | Ask for email dialog "Continue" button background color in disabled state in Feedback UI |
| setFeedbackEmailSkipBackgroundClickedColor | Ask for email dialog "Skip" button background color in clicked state in Feedback UI |
| setFeedbackEmailSkipTextColor | Ask for email dialog "Skip" button text color in Feedback UI |
| setFeedbackErrorTextColor | Error description text color in Feedback UI |
| setFeedbackIncomingBubbleColor | Incoming message bubble background color in Feedback UI |
| setFeedbackIncomingTextColor | Incoming message text color in Feedback UI |
| setFeedbackInputTextColor | Input message text color in Feedback UI |
| setFeedbackInputTextHintColor | Input message hint text color in Feedback UI |
| setFeedbackLoadingBarBackgroundColor | Background color of a bar in Feedback UI, which indicates loading state and shows error information if any |
| setFeedbackLoadingTextColor | Text color in a bar, which indicates loading state in Feedback UI |
| setFeedbackOutgoingBubbleColor | Outgoing message bubble background color in Feedback UI |
| setFeedbackOutgoingTextColor | Outgoing message text color in Feedback UI |
| setFeedbackTitleTextColor | Action bar title text color in Feedback UI |
| setFeedbackVersionChangedBackgroundColor | Background color of a bar in Feedback UI, which indicates that app version has changed |
| setFeedbackVersionChangedTextColor | Text color in a bar in Feedback UI, which indicates that app version has changed |