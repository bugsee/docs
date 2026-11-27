---
title: "Crash & error reporting"
description: "Report handled exceptions from code with the Bugsee JavaScript SDK: logException with severity, labels, domain and skipFrames, de-duplication and the rate limit, notify, and how to test crash capture."
sidebar_position: 2
slug: "/sdk/javascript/manual/crash-error-reporting"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

Bugsee reports uncaught errors and unhandled promise rejections on its own; see [Errors & crashes](/sdk/javascript/issue-detection/errors-and-crashes). This page covers the errors you catch yourself. A `try`/`catch` that swallows an exception hides it from automatic detection, so pass it to `logException` and it becomes a report with the recording that led up to it.

The examples use the client returned by `launch`:

```ts title="bugsee.ts"
import { launch } from '@bugsee/bugsee';

export const bugsee = await launch('<your_app_token>');
```

Capture covers only what runs after `launch()`, and code that runs earlier is not recorded. Top-level `await` delays only the modules that import this one: an unrelated app module that your entry file imports next can still run while `launch()` is pending. Either import this module from every app module that needs the client or capture, or have the entry file load the app after launch settles, with `import './bugsee'; await import('./app');`.

## Report a handled exception

```ts
import { bugsee } from './bugsee';

async function loadProject(id: string): Promise<void> {
  try {
    await fetch(`/api/projects/${id}`).then((response) => {
      if (!response.ok) throw new Error(`Project request failed: ${response.status}`);
    });
  } catch (error) {
    await bugsee.logException(error, {
      severity: 'medium',
      labels: ['projects'],
    });
  }
}
```

`logException(error, options?)` accepts any thrown value, not only an `Error`. It returns a promise of an `UploadResult` (`ok`, `issueId`, `recordingId`, `error`), the same shape `upload` returns. For an `Error`, the report summary is its message and the description is its stack followed by the `cause` chain. Other values are described as text, and the stack starts at your `logException` call.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `severity` | `'verylow' \| 'low' \| 'medium' \| 'high' \| 'critical' \| 'blocker'` | `reportDefaultErrorPriority` (`high`) | Severity of the issue. |
| `labels` | `string[]` | none | Labels on the issue. |
| `domain` | `string` | none | A short category such as `checkout`. Sent with the exception. JavaScript reports are not grouped by it yet. |
| `skipFrames` | `number` | `0` | Leave the top N frames of the error's own stack out of issue grouping. |

An invalid `domain` (not a non-empty string) or `skipFrames` (not a non-negative integer) is ignored and reported through the `onError` launch option.

### Frames to skip

Use `skipFrames` when you create the error, or log a non-`Error`, inside a helper, so errors do not all group at that helper.

```ts
import { bugsee } from './bugsee';

function fail(message: string): never {
  const error = new Error(message);
  void bugsee.logException(error, { domain: 'validation', skipFrames: 1 });
  throw error;
}
```

The skipped frames stay visible in the stack trace. They are only left out of grouping. A caught error's stack does not contain your `logException` call, so skipping frames there hides where it was thrown.

## De-duplication and the rate limit

`logException` protects you from error storms:

- **The same thrown object is reported once.** Logging an error object again, for example from a catch block that rethrows through several layers, does nothing and resolves `{ ok: false }`.
- **At most 100 reports in a rolling 60 seconds** per client. Further calls in that window are dropped and resolve `{ ok: false }`.
- **After `stop()`, and once the collector has switched the SDK off for your app,** `logException` is a silent no-op that resolves `{ ok: false }`.

Errors are rate limited, not sampled: every error that passes these checks is reported.

`upload` is different: it is neither de-duplicated nor rate limited, because every call is something a person asked for. See [Bug reporting](/sdk/javascript/manual/bug-reporting).

## Change or drop reports

The [report handler](/sdk/javascript/report-handler) sees every report, including the ones `logException` creates. Use its `before` callback to add labels or attributes, change the severity, or veto a report.

```ts
import { bugsee } from './bugsee';

bugsee.setReportHandler({
  before: (request) => {
    // Skip errors thrown by a browser extension
    if (request.report.description?.includes('chrome-extension://')) {
      return null;
    }
    return request;
  },
});
```

## Send a message instead of a report

`notify` relays a message to the messaging integrations you configured for the app, such as Slack or a webhook. It skips the report pipeline: no recording, logs or events, only the message.

```ts
import { bugsee } from './bugsee';

bugsee.notify(
  'Payment provider is down',
  'Charges have failed for the last 5 minutes.',
  'critical',
  { provider: 'example-pay', region: 'eu' },
  true,
);
```

| Argument | Type | Description |
| --- | --- | --- |
| `title` | `string` | Required. An empty title is ignored. |
| `body` | `string` | Optional text. |
| `severity` | severity | Optional. |
| `fields` | `Record<string, string>` | Optional. Only string values are kept. |
| `urgent` | `boolean` | Send this message at once, ahead of the batching window. |

Notifications are queued and sent in batches, and retried with backoff. The window is the `notifyFlushDelay` launch option, in milliseconds. It defaults to `0`, which sends at the end of the current tick. A call before `launch` or after `stop` does nothing.

Unlike the mobile SDKs, the queue is in memory. A page closed with an unsent message loses it. `flush()` and `stop()` deliver what is pending.

## Reports from your own server code

On Node.js and Bun the process can exit before a report is delivered. Wait for it:

```ts
import { bugsee } from './bugsee';

async function main(): Promise<void> {
  try {
    await runJob();
  } catch (error) {
    await bugsee.logException(error, { labels: ['nightly-job'] });
    await bugsee.flush(3000);
    process.exitCode = 1;
  }
}

async function runJob(): Promise<void> {
  throw new Error('Job failed');
}

void main();
```

`flush(timeout)` resolves `true` when pending uploads were drained within the timeout, in milliseconds. For uncaught exceptions, the SDK flushes before it exits the process; see the `shutdownTimeoutMs` and `exitOnUncaught` options in [Configuration](/sdk/javascript/configuration).

Framework adapters call `logException` for you on the errors their framework catches. See [Backend overview](/sdk/javascript/backend/overview).

## Test crash reporting

Throw an error outside any `try`/`catch`, after `launch` has finished:

```ts
setTimeout(() => {
  throw new Error('Bugsee test crash');
}, 0);
```

In the browser this is a `window` error and shows up as a crash. On Node.js it is an uncaught exception, and the SDK flushes and then exits the process unless you set `exitOnUncaught: false`. To test a handled error without ending anything, call `logException(new Error('Bugsee test error'))`.

The default severity of a crash report is `blocker`, controlled by `reportDefaultCrashPriority`. The default for an error report is `high`, controlled by `reportDefaultErrorPriority`.

## Related pages

- [Errors & crashes](/sdk/javascript/issue-detection/errors-and-crashes) — what Bugsee detects without any code.
- [HTTP errors](/sdk/javascript/issue-detection/http-errors) — turn 5xx responses into error reports.
- [Bug reporting](/sdk/javascript/manual/bug-reporting) — user-initiated reports, `upload` and the dialog.
- [Report handler](/sdk/javascript/report-handler) — inspect, change or veto every report.
- [Lifecycle](/sdk/javascript/lifecycle) — `flush`, `stop` and report events.
