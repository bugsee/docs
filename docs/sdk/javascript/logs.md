---
title: "Console logs"
description: "How the Bugsee JavaScript SDK captures console output, how to write your own lines with log, the capture level, and how to rewrite or drop lines with setLogEventFilter."
sidebar_position: 21
slug: "/sdk/javascript/logs"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

Bugsee records your console output and shows it on the report timeline, in time order with the recording and network events. Capture is on by default and needs no code. The SDK wraps the console methods, records each call, and then runs the original method, so your console output is unchanged.

## What is captured

| Console method | Recorded level |
| --- | --- |
| `console.error` | `error` |
| `console.warn` | `warning` |
| `console.log` | `info` |
| `console.info` | `info` |
| `console.debug` | `debug` |
| `console.trace` | `verbose`, with the call stack appended to the message |

Arguments are joined with a space. Strings are kept as they are, an `Error` becomes its stack, and objects are written as JSON. There is no `%s` style substitution. Output written straight to `process.stdout` is not captured.

Each captured line has a `timestamp`, a `level`, a `source` (`console` for console output, `logger` for lines you write with `log`) and a `message`.

## Capture options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `captureLogs` | `boolean` | `true` | Record console output. |
| `captureLogsLevel` | `'error' \| 'warning' \| 'info' \| 'debug' \| 'verbose'` or `1` to `5` | `'verbose'` | The least severe level to record. Less severe lines are dropped. |

```ts
import { launch } from '@bugsee/bugsee';

const bugsee = await launch('<your_app_token>', {
  captureLogsLevel: 'warning', // keep warnings and errors only
});
```

The numeric form follows the mobile SDKs: `1` is `error`, `2` is `warning`, `3` is `info`, `4` is `debug` and `5` is `verbose`. A malformed value for `captureLogs` turns capture off and is reported through the `onError` launch option. An unrecognized `captureLogsLevel` is reported and everything is kept.

The level applies to the lines you write with `log` as well as to console output.

## Write your own lines

The examples on this page use the client returned by `launch`, kept in a module of your own:

```ts title="bugsee.ts"
import { launch } from '@bugsee/bugsee';

export const bugsee = await launch('<your_app_token>');
```

`log(message, level?, timestamp?)` adds a line to the log stream. The level defaults to `'info'`.

```ts
import { bugsee } from './bugsee';

bugsee.log('Checkout started');
bugsee.log('Payment declined', 'warning');
bugsee.log('Replayed from queue', 'debug', Date.now() - 5000);
```

`log` goes through the same level setting and the same filter as console output. It does nothing after the SDK has been switched off for your app.

## Filter log lines

`setLogEventFilter(filter)` installs a function that sees each line before it is recorded. Return the line, changed or not, to keep it, or `null` to drop it. Pass `null` to remove the filter.

```ts
import { bugsee } from './bugsee';

const TOKEN = /\b(?:Bearer|Token)\s+[A-Za-z0-9._~+/-]+=*/gi;
const EMAIL = /[\w.%+-]+@[\w-]+(?:\.[\w-]+)+/g;

bugsee.setLogEventFilter((line) => {
  // Drop noisy third-party output
  if (line.message.startsWith('[HMR]')) {
    return null;
  }
  // Redact secrets in everything else
  return {
    ...line,
    message: line.message.replace(TOKEN, '<token>').replace(EMAIL, '<email>'),
  };
});
```

The filter receives a `LogEvent`:

| Field | Type | Description |
| --- | --- | --- |
| `timestamp` | `number` | Milliseconds since the epoch. |
| `level` | `'error' \| 'warning' \| 'info' \| 'debug' \| 'verbose'` | The friendly level name. The SDK converts it to the numeric wire level after your filter has run. |
| `source` | `string` | `console` or `logger`. |
| `tag` | `string \| undefined` | An optional tag. |
| `message` | `string` | The formatted line. |

Rules:

- **A filter that throws drops the line.** The error goes to the `onError` launch option and the line is not recorded unredacted.
- **The level setting runs first.** The filter only sees lines at or above `captureLogsLevel`.
- **There is one filter at a time.** A later call replaces it. Set it right after `launch`. Lines logged before the filter is installed are recorded as they are. `relaunch()` returns a new client, so set the filter again on it.
- **The original console output is not affected.** The filter changes what Bugsee records, not what your console prints.

:::tip
The most reliable control is not to log secrets. A filter is a safety net. See [Privacy: Console logs](/sdk/javascript/privacy/logs).
:::

## Related pages

- [Privacy: Console logs](/sdk/javascript/privacy/logs) — turn capture off and keep sensitive lines out.
- [Breadcrumbs](/sdk/javascript/breadcrumbs) — structured trail entries.
- [Network events](/sdk/javascript/network) — the other automatic capture stream.
- [Configuration](/sdk/javascript/configuration) — every launch option.
