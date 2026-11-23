---
title: "Privacy: Console logs"
description: "How to keep sensitive data out of the logs Bugsee Unity SDK 7.x records: turning capture off, the log level, and redacting or dropping lines with SetLogEventFilter."
sidebar_position: 3
slug: "/sdk/unity/privacy/logs"
---

:::warning[Beta]
This page documents Bugsee Unity SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/unity/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/unity/migration).
:::

Log lines often carry more than you meant to share: a token in a URL, an e-mail address in a debug message, a payload dumped while a feature was being built. Bugsee records the Unity console output, the native logs of the app, and the lines you send with `Bugsee.Log`. See [Console logs](/sdk/unity/logs) for where each comes from. This page covers how to keep sensitive data out of them.

The filter and the options forward to the native SDKs. For their behavior, see [Android log privacy](/sdk/android/privacy/logs) and [iOS log privacy](/sdk/ios/privacy/logs).

## Disabling log capture

Set `CaptureLogs` to `false` to stop the automatic capture of logs. It is on by default on both platforms. The property is on `BugseeLaunchOptions`, so `AndroidLaunchOptions` and `IOSLaunchOptions` have it.

```csharp
using Bugsee.Contracts.Options;
using BugseeSdk = Bugsee.Bugsee;

public static class BugseeStartup
{
    public static void Launch()
    {
#if UNITY_ANDROID
        BugseeSdk.Launch("<your app token>", new AndroidLaunchOptions { CaptureLogs = false });
#elif UNITY_IOS
        BugseeSdk.Launch("<your app token>", new IOSLaunchOptions { CaptureLogs = false });
#endif
    }
}
```

Lines you send with `Bugsee.Log` are still recorded with `CaptureLogs` off. The option turns off only what is captured automatically.

## What is captured

- **The Unity console.** From a launch until `Stop`, the package forwards what your code writes with `Debug.Log`, `Debug.LogWarning`, `Debug.LogError` and `Debug.LogAssertion` to the SDK. A line is the message followed by a new line and the stack trace Unity attaches, when there is one. `Debug.Log` lines are recorded at level `Info`, warnings at `Warning`, and errors and assertions at `Error`. Exceptions are not recorded as log lines: they go through the exception pipeline. See [Crash & error reporting](/sdk/unity/manual/crash-error-reporting).
- **The native logs.** On Android, the SDK also reads logcat.
- **Lines you send** with `Bugsee.Log`.

The Unity log and logcat both need `CaptureLogs`.

## Log level

`CaptureLogsLevel` takes a `LogLevel` (`Error`, `Warning`, `Info`, `Debug`, `Verbose`) and drops lines more verbose than it. The default is `Verbose` on both platforms, which keeps everything. The platforms apply it to different lines:

| Platform | `CaptureLogsLevel` applies to |
| --- | --- |
| Android | The lines the SDK reads from logcat. It does not apply to the lines you send with `Bugsee.Log`, which are recorded whatever their level. |
| iOS | Every line the SDK records, including the lines you send with `Bugsee.Log`. |

To keep a particular line out of a report whatever the level, use a log filter.

```csharp
using Bugsee.Contracts.Options;
using BugseeSdk = Bugsee.Bugsee;

public static class BugseeStartup
{
    public static void Launch()
    {
#if UNITY_ANDROID
        BugseeSdk.Launch("<your app token>", new AndroidLaunchOptions { CaptureLogsLevel = LogLevel.Warning });
#elif UNITY_IOS
        BugseeSdk.Launch("<your app token>", new IOSLaunchOptions { CaptureLogsLevel = LogLevel.Warning });
#endif
    }
}
```

`CaptureLogsUseAllSources` (Android only, off by default) makes the SDK query all logcat buffers instead of the default sources. Leave it off unless you need the other buffers.

## Redacting with a log filter

`Bugsee.SetLogEventFilter(EventFilter<ILogEvent> filter)` sees each captured line before it is recorded. Return the event, changed or not, to keep it, or `null` to drop it. An `ILogEvent` has a `Message` and a `Level`, and you can set both.

```csharp
using System.Text.RegularExpressions;
using Bugsee.Contracts.Exchange;
using BugseeSdk = Bugsee.Bugsee;

public static class LogRedaction
{
    static readonly Regex Token = new Regex(@"(token|access_token|api_key)=[^&\s]+", RegexOptions.IgnoreCase);
    static readonly Regex Email = new Regex(@"[\w.%+-]+@[\w-]+(?:\.[\w-]+)+");

    public static void Install()
    {
        BugseeSdk.SetLogEventFilter(line =>
        {
            if (line.Message == null || line.Message.StartsWith("[payments]"))
                return null; // drop the line

            line.Message = Token.Replace(line.Message, "$1=<redacted>");
            line.Message = Email.Replace(line.Message, "<email>");
            return line;
        });
    }
}
```

Call `Install()` before `Bugsee.Launch`.

What to know:

- **Use the event you are given.** The `ILogEvent` is valid only inside the callback. Do not keep it. On Android, a copy you stored throws `ObjectDisposedException` after the callback.
- **A filter that throws drops the line.** The package does not record the line unfiltered.
- **Passing `null` to `SetLogEventFilter` removes the filter.** Lines are then recorded without it.
- **The filter runs on the Unity main thread.** The SDK calls it on its own thread, and the package hands the call to the main thread. While the app is in the background, Unity's loop is paused, and the calls wait until it resumes. The Android SDK drops a line whose filter has not answered within 10 seconds. Keep the filter fast.
- **Lines recorded before you set the filter are not filtered.** Set the filter before `Bugsee.Launch`.

### `Bugsee.Log` and the filter

A line you send with `Bugsee.Log(message, level)` skips the log filter. This is the behavior of the native SDKs. If a line can carry user data, pass `true` as the third argument so that it goes through the filter:

```csharp
using Bugsee.Contracts.Options;
using BugseeSdk = Bugsee.Bugsee;

public static class SafeLog
{
    public static void Signed(string userEmail)
    {
        BugseeSdk.Log("Signed in as " + userEmail, LogLevel.Info, true);
    }
}
```

- The `level` default of `Bugsee.Log(string, LogLevel)` is `LogLevel.Info`.
- A line you send with `requiresFiltering` set to `true` is filtered even with `CaptureLogs` off.
- On iOS, a line below `CaptureLogsLevel` never reaches the filter. On Android, the level applies only to the logcat lines.
- Do not call `Bugsee.Log(..., true)` from inside the log filter. On Android the filter runs during the call, so it recurses.
- The call does nothing for a null message, and before the SDK is launched.

## Tombstone logs on Android

`CrashNdkIncludeTombstoneLogs` (Android only, off by default) adds the raw log buffers of the OS tombstone to a native crash report. Those buffers do not go through your log filter or the Bugsee redaction, and they can contain text that system or third-party libraries logged in your process. They are uploaded as the OS wrote them. Enable the option only if that is acceptable.

## Related pages

- [Console logs](/sdk/unity/logs): where lines come from and `Bugsee.Log`.
- [Privacy: Network](/sdk/unity/privacy/network): the matching network filter.
- [Privacy overview](/sdk/unity/privacy/overview): every privacy control.
