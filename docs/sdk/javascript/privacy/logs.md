---
title: "Privacy: Console logs"
description: "How to keep sensitive data out of the console logs the Bugsee JavaScript SDK records: turning capture off, the capture level, and redacting or dropping lines with setLogEventFilter."
sidebar_position: 3
slug: "/sdk/javascript/privacy/logs"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

The SDK records your console output and the lines you write with `log`. Nothing redacts them for you: a line is recorded as it is printed. A log line can carry a token, an email address or a response body that your code printed while debugging. See [Console logs](/sdk/javascript/logs) for how capture works. This page covers keeping sensitive data out.

## Turn log capture off

Turning it off is the simplest control. No console line and no `log` line is recorded.

```ts
import { launch } from '@bugsee/bugsee';

await launch('<your_app_token>', { captureLogs: false });
```

## Record fewer lines

`captureLogsLevel` drops lines less severe than the level you set. Debug output is where secrets most often appear, so a production build can keep only warnings and errors.

```ts
import { launch } from '@bugsee/bugsee';

await launch('<your_app_token>', { captureLogsLevel: 'warning' });
```

| Level | Keeps |
| --- | --- |
| `'error'` | `console.error` |
| `'warning'` | `console.error`, `console.warn` |
| `'info'` | the above and `console.log`, `console.info` |
| `'debug'` | the above and `console.debug` |
| `'verbose'` (default) | everything, including `console.trace` |

## Redact with a filter

`setLogEventFilter` sees every line before it is recorded. Return the line to keep it, or `null` to drop it. Redact in the filter rather than relying on remembering what you print.

```ts
import { bugsee } from './bugsee';

const PATTERNS: Array<[RegExp, string]> = [
  [/\b(?:Bearer|Basic)\s+[A-Za-z0-9._~+/=-]+/gi, '<auth>'],
  [/[\w.%+-]+@[\w-]+(?:\.[\w-]+)+/g, '<email>'],
  [/\b(?:\d[ -]?){13,19}\b/g, '<number>'],
  // The whole value: a quoted string (spaces and escapes included), else a bare word.
  // A quote that never closes redacts the rest of the line, so nothing is left behind.
  [
    /(["']?(?:password|token|secret)["']?\s*[:=]\s*)(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|["'][^\n]*|[^\s,"'}]+)/gi,
    '$1<redacted>',
  ],
];

bugsee.setLogEventFilter((line) => {
  // Never record lines from a module that prints user data
  if (line.message.startsWith('[user-service]')) {
    return null;
  }
  let message = line.message;
  for (const [pattern, replacement] of PATTERNS) {
    message = message.replace(pattern, replacement);
  }
  return { ...line, message };
});
```

Where `bugsee` is the client `launch` returned:

```ts title="bugsee.ts"
import { launch } from '@bugsee/bugsee';

export const bugsee = await launch('<your_app_token>');
```

Capture covers only what runs after `launch()`, and code that runs earlier is not recorded. Top-level `await` delays only the modules that import this one: an unrelated app module that your entry file imports next can still run while `launch()` is pending. Either import this module from every app module that needs the client or capture, or have the entry file load the app after launch settles, with `import './bugsee'; await import('./app');`. Install any filter in this module too, right after `launch` and before the export, so no application code runs before the filter exists.

What to know:

- **The filter fails closed.** If it throws, the line is dropped, and the error goes to the `onError` launch option.
- **Install it right after `launch`.** Lines printed before the filter is installed are recorded as they were.
- **It does not change your console.** The filter shapes what Bugsee records. The original console output is unchanged.
- **One filter at a time.** A later call replaces it. `setLogEventFilter(null)` removes it. After `relaunch()`, install it again on the new client.
- **Objects are already text.** The message is the formatted line, with objects written as JSON, so your patterns run on the final text.
- **Stack traces in `console.error` are in the message.** An `Error` passed to the console is recorded as its stack, so redact file paths there if they are sensitive.

## Related pages

- [Console logs](/sdk/javascript/logs) — how capture works, and writing your own lines.
- [Privacy overview](/sdk/javascript/privacy/overview) — all privacy controls.
- [Privacy: Network](/sdk/javascript/privacy/network) — the other automatic stream.
