---
title: "Appearance"
description: "How to customize the colors of the Bugsee Report and Feedback UI in Xamarin apps for both iOS and Android."
sidebar_position: 7
slug: "/sdk/xamarin/appearance"
---

:::caution Deprecated
Microsoft ended support for Xamarin on May 1, 2024. The Bugsee Xamarin SDK is no longer actively maintained. For new projects, use the [Bugsee .NET SDK](/sdk/dotnet/installation/), which supports .NET MAUI and modern .NET workloads.
:::

You can always change colors of the [Report](/sdk/xamarin/manual/) and [Feedback](/sdk/xamarin/feedback/) UI.

```csharp
// For example
Bugsee.Appearance.Report.BackgroundColor = BugseeColor.Red;
Bugsee.Appearance.Feedback.BackgroundColor = BugseeColor.Blue;

// ...
// Other colors you can find in Bugsee.Appearance.Report and Bugsee.Appearance.Feedback
```

## iOS appearance options

### Report appearance options

|Property|Description|
|---|---|
| BackgroundColor | Background color of Report Controller |
| BarsColor | Navigation bar and bottom bar colors |
| CellBackgroundColor | UITableView cells background color |
| CloseButtonColor | Close UIButton cross color |
| NavigationBarColor | UINavigation bar background color |
| PlaceholderColor | UIInputFields placeholder color |
| SendButtonColor | Send UIButton text color |
| TextColor | UILabels text color |
| VersionColor | UILabel with version number text color |

### Feedback appearance options

|Property|Description|
|---|---|
| BackgroundColor | Background color of feedback controller |
| CloseButtonColor | Close UIButton cross color |
| EmailBackgroundColor | Ask for email popup background color |
| EmailContinueActiveColor | Ask for email continue button background color |
| EmailContinueNotActiveColor | Ask for email continue not active button background color |
| EmailSkipColor | Ask for email popup skip button text color |
| IncomingBubbleColor | Incoming message bubble background color |
| IncomingTextColor | Incoming message text color |
| InputTextColor | Input message text color |
| NavigationBarColor | UINavigationBar color |
| OutgoingBubbleColor | Outgoing message bubble background color |
| OutgoingTextColor | Outgoing message text color |
| TitleTextColor | UINavigationBar title color |


## Android appearance options

### Report appearance options

|Property|Description|
|---|---|
| ActionBarButtonBackgroundClickedColor | Action bar buttons background color in clicked state in Report UI |
| ActionBarColor | Action bar background color in Report UI |
| ActionBarTextColor | Action bar buttons text color in Report UI |
| BackgroundColor | Report UI background color |
| EditTextBackgroundColor | EditTexts background color in Report UI |
| HintColor | EditTexts hint text color in Report UI |
| SeverityLabelActiveColor | Issue severity label text color in active state in Report UI |
| TextColor | TextViews and EditTexts text color in Report UI |
| VersionColor | Bugsee version number view text color in Report UI |

### Feedback appearance options

|Property|Description|
|---|---|
| ActionBarButtonBackgroundClickedColor | Action bar buttons background color in clicked state in Feedback UI |
| ActionBarColor | Action bar background color in Feedback UI |
| BackgroundColor | Feedback UI background color |
| BottomDelimiterColor | Color of delimiter between message list and EditText for new message inputting in Feedback UI |
| DateTextColor | Message date text color in Feedback UI |
| EmailBackgroundColor | Ask for email dialog background color in Feedback UI |
| EmailContinueActiveColor | Ask for email dialog "Continue" button background color in enabled state in Feedback UI |
| EmailContinueClickedColor | Ask for email dialog "Continue" button background color in clicked state in Feedback UI |
| EmailContinueNotActiveColor | Ask for email dialog "Continue" button background color in disabled state in Feedback UI |
| EmailSkipBackgroundClickedColor | Ask for email dialog "Skip" button background color in clicked state in Feedback UI |
| EmailSkipTextColor | Ask for email dialog "Skip" button text color in Feedback UI |
| ErrorTextColor | Error description text color in Feedback UI |
| IncomingBubbleColor | Incoming message bubble background color in Feedback UI |
| IncomingTextColor | Incoming message text color in Feedback UI |
| InputTextColor | Input message text color in Feedback UI |
| InputTextHintColor | Input message hint text color in Feedback UI |
| LoadingBarBackgroundColor | Background color of a bar in Feedback UI, which indicates loading state and shows error information if any |
| LoadingTextColor | Text color in a bar, which indicates loading state in Feedback UI |
| OutgoingBubbleColor | Outgoing message bubble background color in Feedback UI |
| OutgoingTextColor | Outgoing message text color in Feedback UI |
| TitleTextColor | Action bar title text color in Feedback UI |
| VersionChangedBackgroundColor | Background color of a bar in Feedback UI, which indicates that app version has changed |
| VersionChangedTextColor | Text color in a bar in Feedback UI, which indicates that app version has changed |