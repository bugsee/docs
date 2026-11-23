---
title: "Privacy: Cleanup"
description: "Where the Bugsee JavaScript SDK stores captured data in the browser and on Node.js and Bun, how long it stays, and how to limit it with persist, capturedDataStore, recover and sign-out calls."
sidebar_position: 7
slug: "/sdk/javascript/privacy/cleanup"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

The JavaScript SDK has no call that deletes everything it has collected. What you control is where captured data is kept in the first place, how long it is kept, and what identifies the user. This page lists those controls, and what is stored where.

## Where data is kept

| Runtime | Rolling capture | Reports waiting for upload |
| --- | --- | --- |
| Browser | IndexedDB when the page has IndexedDB and Web Locks, otherwise memory. | IndexedDB, or memory when persistence is off. |
| Node.js and Bun | Files under a data directory (default), or memory. | The same data directory. |
| Edge runtimes and Cloudflare | Memory. | Memory. A report is sent when an incident happens. |

Data in memory is gone when the page or process ends. Data on disk or in IndexedDB is kept so that a crash does not lose the recording that led to it. On the next launch the SDK finds what a previous run left behind, sends it, and deletes it.

## Keep everything in memory

If your policy says captured data must never be written to the device, keep it in memory.

```ts
import { launch } from '@bugsee/bugsee';

// Browser: no IndexedDB, nothing survives a reload
await launch('<your_app_token>', { persist: false });
```

```ts
import { launch } from '@bugsee/bugsee';

// Node.js and Bun: no files, nothing survives a restart
launch('<your_app_token>', { capturedDataStore: 'memory' });
```

The cost is the same in both: if the page or process dies before a report is assembled, the recording is lost, and a report that could not be sent is not retried at the next launch.

| Option | Runtime | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `persist` | Browser | `boolean` | `true` where IndexedDB and Web Locks exist | Keep the capture window and report queue in IndexedDB. `false` keeps them in memory. |
| `capturedDataStore` | Node.js, Bun | `'disk' \| 'memory'` | `'disk'` | Where the capture buffer lives. |
| `recover` | Browser, Node.js, Bun | `boolean` | `true` | Persist each report before upload and send those left by a previous run at the next launch. It needs a persistent location. |
| `maxRecordingTime` | All | `number` | `60` | Seconds of history kept in the rolling window. |
| `maxDataSize` | All | `number` | `20` in the browser (30 with IndexedDB), `50` on Node.js and Bun | The most captured data kept, in megabytes. |

A shorter `maxRecordingTime` and a smaller `maxDataSize` mean less data at rest and in a report.

## Node.js and Bun: the data directory

By default the SDK writes under `<os.tmpdir()>/bugsee/<hash of the app token>`. Each running instance (a process, or a worker thread) writes its own subdirectory inside it, so several instances can share the directory safely. A subdirectory left by an instance that is no longer alive is recovered by a later launch, its reports are sent, and it is removed.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `dataDir` | `string` | `<os.tmpdir()>/bugsee/...` | Put the data in a directory you choose, for example one that is encrypted or cleaned on a schedule. |
| `dataRootBase` | `string` | `os.tmpdir()` | The base of the default directory. Ignored when `dataDir` is set. |

```ts
import { launch } from '@bugsee/bugsee';

launch('<your_app_token>', {
  dataDir: '/var/lib/myapp/bugsee',
  maxDataSize: 20,
});
```

The default directory is checked for ownership and permissions before use. If it is not safe, the SDK falls back to memory. An explicit `dataDir` is your decision and is not checked, so make sure only your service can read it.

Capture files hold the same data as a report: console output, network events and so on, as recorded after your filters and redaction.

## Pending reports

A report that could not be sent, for example when the network is down, waits in a durable queue and is retried with backoff and at the next launch.

- The queue holds up to **32** reports and **64 MiB**. When it is full, the oldest are dropped.
- A report older than **7 days** is dropped.
- A report the collector refuses permanently is deleted.

## Disk and storage pressure

With `diskProtection` on (the default), the browser SDK watches the storage quota and stops writing when headroom runs low: below 50 MiB it stops persisting replay, logs and network data, and below 10 MiB it persists nothing. The in-memory window is kept, so a live report is still complete.

## What identifies the user

| Stored item | Where | How to remove it |
| --- | --- | --- |
| User identifier | Memory. In the browser, `localStorage` too when `persistUserIdentifier` is `true`. | `clearUserIdentifier()` |
| Attributes | Memory only. | `clearAttribute(key)` or `clearAllAttributes()` |
| Device id | Browser only: a random UUID kept in `localStorage`, a first-party cookie, IndexedDB and the Cache API, so that it survives a cleared store. | Clear the site data in the browser. There is no SDK call. |

Call both clear methods at sign-out:

```ts
import { bugsee } from './bugsee';

function onSignOut(): void {
  bugsee.clearUserIdentifier();
  bugsee.clearAllAttributes();
}
```

Where `bugsee` is the client `launch` returned:

```ts title="bugsee.ts"
import { launch } from '@bugsee/bugsee';

export const bugsee = await launch('<your_app_token>');
```

Clearing applies to reports created afterwards. A report that is already assembled and waiting in the queue, and the recovery record of an incident that has not been delivered, keep the identifier they were created with until they are uploaded or expire.

## Stop capture

`stop()` stops capture and drains the pending uploads. It does not delete data that is waiting for a later launch. See [Lifecycle](/sdk/javascript/lifecycle).

## Related pages

- [Privacy overview](/sdk/javascript/privacy/overview) — all privacy controls.
- [Privacy: Report](/sdk/javascript/privacy/report) — what a report carries.
- [User & session data](/sdk/javascript/user-session-data) — identifier and attributes.
- [Configuration](/sdk/javascript/configuration) — every launch option.
