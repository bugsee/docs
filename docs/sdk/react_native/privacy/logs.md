---
title: "Privacy: Console logs"
description: "How to keep sensitive data out of the logs Bugsee React Native SDK 7.x records: turning capture off, level thresholds per platform, and redacting or dropping lines with setLogFilter."
sidebar_position: 3
slug: "/sdk/react_native/privacy/logs"
---

:::warning[Beta]
This page documents Bugsee React Native SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/react_native/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/react_native/migration).
:::

Log lines often carry more than you meant to share: an access token in a URL, an e-mail address in a debug message, a payload dumped while a feature was being built. Bugsee records your JavaScript `console.*` output, the native logs of the app, and the lines you send with `Bugsee.log`; see [Console logs](/sdk/react_native/logs) for where each comes from. This page covers how to keep sensitive data out of them.

## Disabling log capture

Set `captureLogs` to `false` to stop capturing logs automatically: the package no longer forwards `console.*` output, and the native SDKs no longer capture the native logs.

```ts
import Bugsee, { createDefaultLaunchOptions } from '@bugsee/react-native';

const options = createDefaultLaunchOptions();
options.captureLogs = false;

Bugsee.launch('<your app token>', options);
```

Lines you send with `Bugsee.log` are still recorded with `captureLogs` off: the option turns off only what is captured automatically.

## What a console line contains

The package converts each argument of a `console.*` call with `String()` and joins them with a space. Objects are **not** serialized: `console.log('session', session)` is recorded as `session [object Object]`, so the fields of an object you log, a token among them, do not reach the report. A value you turn into text yourself, with `JSON.stringify` or a template string, is recorded in full.

## Level thresholds

`captureLogsLevel` drops lines less severe than the level you set. It is a way to keep chatty debug output out of reports, but it applies to different lines on each platform:

```ts
import Bugsee, { LogLevel, createDefaultLaunchOptions } from '@bugsee/react-native';

const options = createDefaultLaunchOptions();
options.captureLogsLevel = LogLevel.Warning; // keep Error and Warning

Bugsee.launch('<your app token>', options);
```

| Platform | `captureLogsLevel` applies to |
| --- | --- |
| Android | Only the lines the SDK reads from logcat (React Native itself and native modules). `console.*` lines and `Bugsee.log` lines are recorded whatever their level. |
| iOS | Every line the SDK records, `console.*` and `Bugsee.log` lines included. |

On Android, the level therefore does not keep a `console.debug` line out of a report. Use a [log filter](#redacting-with-a-log-filter) for that. See [Which lines the level applies to](/sdk/react_native/logs#which-lines-the-level-applies-to) for details.

## Redacting with a log filter

`Bugsee.setLogFilter(callback)` is the redaction boundary for logs: it sees each line before it is recorded, and what it returns is what the report gets. Return a changed string to redact the line, or `null` to drop it.

```ts
import Bugsee from '@bugsee/react-native';

const REDACTION_RULES: ReadonlyArray<[RegExp, string]> = [
  // Bearer tokens and token-like query parameters
  [/(bearer\s+)[\w.~+/-]+=*/gi, '$1<redacted>'],
  [/([?&](?:token|access_token|api_key|session)=)[^&\s]+/gi, '$1<redacted>'],
  // E-mail addresses
  [/[\w.%+-]+@[\w-]+(?:\.[\w-]+)+/g, '<email>'],
  // Card-like digit runs
  [/\b\d(?:[ -]?\d){12,18}\b/g, '<card>'],
];

Bugsee.setLogFilter((line) => {
  // Drop whole categories of lines
  if (line.startsWith('[payments]')) {
    return null;
  }
  return REDACTION_RULES.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    line,
  );
});

// Install filters first, then launch.
// Bugsee.launch('<your app token>', options);
```

What makes it a safe boundary:

- **It fails closed.** A line is dropped, not recorded unfiltered, when the callback throws, its promise rejects, or it returns something that is not a string. A line the filter does not answer is not recorded either: on Android it is dropped after about 10 seconds; on iOS a line whose filter never answers is never recorded.
- **It changes only the text.** The level and timestamp of the line stay as they were.
- **It sees the captured lines**: `console.*` output and the native log lines, on both platforms.

What it does not cover:

- **`Bugsee.log` lines skip it by default.** As in the native SDKs, a line you send with `Bugsee.log` is recorded without going through the filter. Pass `true` as the third argument for a line that may carry user data: `Bugsee.log(message, LogLevel.Info, true)`. See [`requiresFiltering`](/sdk/react_native/logs#requiresfiltering).
- **Lines recorded before the filter is installed.** Call `setLogFilter` before `Bugsee.launch`, at the top of your startup code. A filter set before `launch` stays in effect after it.
- **Android auto-launch.** With `autoLaunch`, the SDK records from process start on Android, before any JavaScript runs, and lines captured before your code calls `setLogFilter` are recorded unfiltered. Do not use auto-launch if that window must be filtered.
- **A cleared filter.** `setLogFilter(null)` removes the filter, and lines are then recorded unfiltered.
- **Development reloads.** On Android, after a JavaScript reload, lines are recorded **unfiltered** until the new runtime calls `setLogFilter` again. On iOS they are dropped until then. Install the filter first thing in your startup code, before anything logs. See [Reloads](/sdk/react_native/logs#reloads).

Keep the filter fast and synchronous where you can: every captured line in the session goes through it, and on Android a line the filter has not answered within about 10 seconds is dropped. On iOS there is no deadline, so a slow filter delays lines rather than losing them. See [Filtering log lines](/sdk/react_native/logs#filtering-log-lines) for the full contract, including what each return value does.

:::note
The SDK sets a log filter of its own on the native side, on both platforms, to drop duplicate copies of console lines. A log filter you set from native code with `setLogEventFilter` is replaced by it, so redact logs with `Bugsee.setLogFilter`.
:::

## Related pages

- [Console logs](/sdk/react_native/logs): where lines come from, `Bugsee.log`, and the filter contract.
- [Privacy: Network](/sdk/react_native/privacy/network): the matching network filter.
- [Privacy overview](/sdk/react_native/privacy/overview): every privacy control.
