---
title: "Privacy and data cleanup"
description: "How to delete all locally stored Bugsee recording data from the device using the .NET SDK cleanup API."
sidebar_position: 4
slug: "/sdk/dotnet/privacy/cleanup"
---

Bugsee SDK does not continuously stream any personal data. The collected data and the reports built from it are stored locally on the device. In some specific cases, there might be a need to clean up the data stored on the disk.

## Data cleanup

Bugsee SDK provides a way to clean up the data stored on the disk. This can be useful in cases when you want to remove all the data collected by Bugsee from the device.

:::warning
Note that this API does not delete the session-related data, such as [attributes](/sdk/dotnet/custom/#usersession-attributes). To cleanup up those, use corresponding API (e.g. `Bugsee.ClearAllAttributes()`)
:::

```csharp

// Bugsee must be stopped before deleting the data
await Bugsee.Stop();

// Clean up all the data stored on the disk
var isDeletionSuccessful = await Bugsee.DeleteCollectedDataOnDevice();
if (isDeletionSuccessful) {
    Console.WriteLine("Data deleted successfully");
} else {
    Console.WriteLine("Failed to delete data");
}

```