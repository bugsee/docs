---
title: "Privacy: Cleanup"
description: "How to delete the data Bugsee React Native SDK 7.x has collected on the device with deleteCollectedDataOnDevice, what it keeps, and how to clear attributes and the user identifier at sign-out or when consent is withdrawn."
sidebar_position: 7
slug: "/sdk/react_native/privacy/cleanup"
---

:::warning[Beta]
This page documents Bugsee React Native SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/react_native/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/react_native/migration).
:::

The native SDKs keep the rolling capture (video, logs, network events and the rest of the timeline), data set aside for reports, and reports waiting to be uploaded on the device. `Bugsee.deleteCollectedDataOnDevice` deletes the captured data, for example when a user signs out, deletes their account, or withdraws consent.

## Deleting collected data

```ts
import Bugsee from '@bugsee/react-native';

async function deleteBugseeData(): Promise<boolean> {
  // While the SDK runs, the deletion is refused
  await Bugsee.stop();
  return Bugsee.deleteCollectedDataOnDevice(true);
}
```

`deleteCollectedDataOnDevice(includingIntermediate)` resolves to whether the data was deleted.

| `includingIntermediate` | Deletes | Keeps |
| --- | --- | --- |
| `false` | The rolling capture data. | Intermediate data, and finished reports waiting to be uploaded. |
| `true` | The rolling capture data, and the intermediate data: the snapshots set aside for reports that are not assembled yet, and exported reports (documented for Android; not specified for iOS in this beta). | Finished reports waiting to be uploaded. |

- **The SDK must be stopped.** While it is launched, both platforms refuse the deletion, delete nothing, and the promise resolves `false`. Await `Bugsee.stop()` first; it resolves once the SDK has stopped.
- **The result can be late or early.** Android: the promise resolves when the deletion has finished. iOS: the promise resolves `false` if the deletion has not finished within 1.5 seconds, even though it may still complete afterward.
- **Finished reports are kept, and uploaded later.** Neither value deletes a report that has already been assembled and is waiting for upload: it is uploaded once the SDK runs again. This beta has no call that deletes those too.

## Clearing attributes and the user identifier

`deleteCollectedDataOnDevice` deletes captured data. It does not clear the [user identifier or attributes](/sdk/react_native/user-session-data), which persist across launches and are sent with every report. Clear them yourself, while the SDK is still running:

```ts
import Bugsee from '@bugsee/react-native';

async function forgetUser(): Promise<boolean> {
  // 1. Clear what identifies the user, while the SDK runs
  Bugsee.clearUserIdentifier();
  await Bugsee.clearAllAttributes();

  // 2. Stop, then delete what was captured
  await Bugsee.stop();
  const deleted = await Bugsee.deleteCollectedDataOnDevice(true);

  // 3. Relaunch later, once you may record again
  return deleted;
}
```

To remove a single attribute, use `Bugsee.clearAttribute(name)`.

## When to call it

| Event | What to do |
| --- | --- |
| The user signs out | Clear the user identifier and the attributes that describe them. Delete collected data too if the next user of the device must not appear in reports with the previous one's session. |
| The user withdraws consent | Clear the identifier and attributes, stop the SDK, delete collected data, and do not launch again until consent is given. |
| The user deletes their account | As for withdrawn consent. Reports already uploaded live on the Bugsee server, not on the device; this API does not reach them. |

After `stop`, nothing more is recorded until you call `Bugsee.launch` again; see [Lifecycle & status](/sdk/react_native/lifecycle).

## Pausing capture without deleting

To keep a sensitive flow out of the video without stopping the SDK, use a [blackout](/sdk/react_native/privacy/video#blackout): logs and network events keep recording, and nothing is deleted. To stop all capture, call `Bugsee.stop()`, and `Bugsee.launch` again later.

## Automatic retention

The rolling capture keeps only the last `duration` seconds, on both platforms. How much space reports waiting to be uploaded may take differs per platform:

| Option | Key | Android | iOS |
| --- | --- | --- | --- |
| `maxDataSize` | `com.bugsee.option.config.max-data-size` | `150` MB by default. Past any of these limits, whole reports are removed: errors first, then bug reports, then crashes, oldest first. | `50` by default, but **not enforced** in this beta: the key is accepted and has no effect. |
| `maxPendingReports` (Android) | `com.bugsee.option.config.max-pending-reports` | `30` by default: the most reports kept waiting to be sent. | No equivalent. |
| `maxPendingReportAge` (Android) | `com.bugsee.option.config.max-pending-report-age` | `30` days by default: the oldest a report waiting to be sent may get. | No equivalent. |

:::caution[iOS: no cap on pending reports in this beta]
On iOS, nothing in this beta limits the reports waiting to be uploaded. On a device that stays offline, or keeps failing to upload, they accumulate until they are sent, and `deleteCollectedDataOnDevice` does not remove them.
:::

See [Configuration](/sdk/react_native/configuration) for every option.

## Related pages

- [Privacy: Report](/sdk/react_native/privacy/report): what a report sends.
- [User & session data](/sdk/react_native/user-session-data): the attribute API.
- [Lifecycle & status](/sdk/react_native/lifecycle): stop and launch.
