---
title: "Privacy: Cleanup"
description: "How to delete the data the Bugsee Unity SDK 7.x has stored on the device with DeleteCollectedDataOnDevice and DeleteScope, and how the retention options bound the reports that wait for upload."
sidebar_position: 7
slug: "/sdk/unity/privacy/cleanup"
---

:::warning[Beta]
This page documents Bugsee Unity SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/unity/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/unity/migration).
:::

Bugsee does not stream data continuously. What it records, and the reports built from it, stay on the device until a report is uploaded. When you need that data gone, for example when a user signs out or withdraws consent, delete it with `Bugsee.DeleteCollectedDataOnDevice`. The call forwards to the native `deleteCollectedDataOnDevice`. See [Android cleanup](/sdk/android/privacy/cleanup) and [iOS cleanup](/sdk/ios/privacy/cleanup) for the native side.

## Deleting everything

`Bugsee.DeleteCollectedDataOnDevice()` deletes what the SDK collected on the device, including the finished reports that are not uploaded yet. You do not stop the SDK first: the package stops it if it is not stopped, and leaves it stopped. Call `Bugsee.Launch` again to resume.

```csharp
using BugseeSdk = Bugsee.Bugsee;

public static class UserData
{
    public static void Forget()
    {
        BugseeSdk.DeleteCollectedDataOnDevice(); // no result: a failure is logged
    }
}
```

The call has no result. A failure is only logged. To get the result, or to delete less, use `DeleteCollectedDataOnDeviceAsync`.

:::warning[Android: the delete now also removes finished reports that were not uploaded]
In 7.x, `DeleteCollectedDataOnDevice` on Android also deletes the finished reports that wait for upload, and it stops the SDK first when it is not stopped. To keep the finished reports that wait for upload, call `DeleteCollectedDataOnDevice(DeleteScope.CaptureAndIntermediate)`.
:::

## Deleting less

`DeleteScope` chooses how much a delete removes. Every scope stops the SDK.

| `DeleteScope` | Deletes | Keeps |
| --- | --- | --- |
| `CaptureOnly` | The recorded capture. | The report snapshots and the finished reports that wait for upload. |
| `CaptureAndIntermediate` | The recorded capture and the report snapshots (the data set aside for a report that is not bundled yet). | The finished reports that wait for upload. |
| `Everything` (the default) | Everything the SDK collected on disk, including the finished reports that are not uploaded yet. Their uploads are cancelled. On iOS it also deletes the crashes that are not reported yet and the performance baselines that anomaly detection has learned. | |

On iOS, the two narrower scopes keep the crashes that are not reported yet, so the next launch can still report them. On Android, the scopes map to `includingIntermediate` and `includingBundles` of the native call. See the native pages for the details.

Pass the scope to the synchronous overload or to the async one:

```csharp
using System.Threading.Tasks;
using Bugsee.Contracts.Lifecycle;
using BugseeSdk = Bugsee.Bugsee;

public static class UserData
{
    public static async Task SignOut()
    {
        // The user identifier and the attributes are not deleted by any scope: clear them yourself.
        BugseeSdk.ClearUserIdentifier();
        BugseeSdk.ClearAllAttributes();

        bool deleted = await BugseeSdk.DeleteCollectedDataOnDeviceAsync(DeleteScope.CaptureAndIntermediate);
        UnityEngine.Debug.Log("Bugsee data deleted: " + deleted);

        // The SDK is stopped. Call BugseeSdk.Launch again to resume.
    }

    public static void ForgetCaptureOnly()
    {
        BugseeSdk.DeleteCollectedDataOnDevice(DeleteScope.CaptureOnly);
    }
}
```

## How every form behaves

- **The SDK is left stopped.** Every form stops the SDK first, joining a stop that is already in flight, and leaves it stopped. A managed report that is not finished and a managed upload that is in flight are dropped, as with `Stop`.
- **The async form returns a `Task<bool>`.** It completes with `true` when the SDK reported the data deleted. It completes with `false` when the SDK refused, gave no answer in time, or, on iOS, when the call did not reach the Unity main thread within 5 seconds, which means the delete never started. A timeout is a `false`, not a `TimeoutException`. A `false` after a timeout can still be followed by the delete finishing. A failure of the call itself is carried by the `Task`. Awaited from the Unity main thread, the continuation resumes there.
- **The default scope is `Everything`.** `DeleteCollectedDataOnDeviceAsync()` with no argument deletes the same as `DeleteCollectedDataOnDevice()`.
- **An undefined `DeleteScope` value throws.** A value that is not one of the three, such as `(DeleteScope)5`, throws `ArgumentOutOfRangeException`. It is never read as one of the three.
- **Order with `Launch` and `Relaunch`.** On Android, `Launch`, `Relaunch` and deletes run one at a time, in the order you requested them. On iOS, a `Launch` or `Relaunch` that you request after a delete waits for it to finish. A delete is never skipped because a `Launch` follows it.
- **Other players.** On players other than Android and iOS, the Editor included, nothing is collected, so the async form completes `true`.
- **It is not a reset.** No scope deletes the user identifier or the attributes. Clear them with `Bugsee.ClearUserIdentifier()` and `Bugsee.ClearAllAttributes()`. See [User & session data](/sdk/unity/user-session-data). On iOS, no scope deletes the notification relay queue or the Feedback conversation cache either. See [iOS cleanup](/sdk/ios/privacy/cleanup).

If your app embeds the iOS [Crash Report Extension](/sdk/unity/issue-detection/crash-report-extension), the documents the extension writes are not deleted by these calls. See [iOS cleanup](/sdk/ios/privacy/cleanup#crash-report-extension-documents).

## Reports waiting on the device

A report that cannot be sent right away waits on the device. Three launch options on `BugseeLaunchOptions` bound how much waits and for how long. Past a limit, whole reports are deleted: errors first, then bug reports, then crashes, oldest first. The newest crash is kept, and on Android so is a report that is being sent.

| Option | Default | Meaning |
| --- | --- | --- |
| `MaxDataSize` | 150 | Disk space in MB that waiting reports may take up. A value below 10 is raised to 10. |
| `MaxPendingReports` | 30 | The most reports that may wait. A value below 1 is raised to 1. |
| `MaxPendingReportAge` | 30 | Days a report may wait before it is deleted, whatever its type. 0 or a negative value turns the age limit off. |

`MaxDataSize` defaults to 150 on both platforms. A low value loses reports sooner. See [Configuration](/sdk/unity/configuration) for how to set them.

```csharp
using Bugsee.Contracts.Options;
using BugseeSdk = Bugsee.Bugsee;

public static class BugseeStartup
{
    public static void Launch()
    {
#if UNITY_ANDROID
        BugseeSdk.Launch("<your app token>", new AndroidLaunchOptions { MaxPendingReports = 5, MaxPendingReportAge = 7 });
#elif UNITY_IOS
        BugseeSdk.Launch("<your app token>", new IOSLaunchOptions { MaxPendingReports = 5, MaxPendingReportAge = 7 });
#endif
    }
}
```

## Related pages

- [Lifecycle](/sdk/unity/lifecycle): `Launch`, `Relaunch`, `Stop` and the deadlines.
- [Privacy: Report](/sdk/unity/privacy/report): editing a report before upload.
- [Privacy overview](/sdk/unity/privacy/overview): every privacy control.
