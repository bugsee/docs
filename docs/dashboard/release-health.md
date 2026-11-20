---
title: "Release health"
description: "How Bugsee computes crash-free sessions and crash-free users on an app's Overview page: what counts as a session, a user and a crash, how versions and builds are grouped, and how days are bucketed."
sidebar_position: 1
slug: "/dashboard/release-health"
---

# Release health

An app's **Overview** page in the dashboard tracks how stable each release is, day by day. Open the app and select **Overview**, the first item in its navigation (`https://app.bugsee.com/#/apps/<APP_KEY>/overview`). The **Stability** chart shows two lines, **Crash-free sessions** and **Crash-free users**, next to the **Sessions**, **Users** and **Crashes** charts they are computed from. Filter by app version and build to compare releases.

## Crash-free sessions and users

| Metric | How it is computed |
| --- | --- |
| **Crash-free sessions** | (sessions − crashes) ÷ sessions, as a percentage |
| **Crash-free users** | (users − crashed users) ÷ users, as a percentage |

Both are computed per day and rounded to one decimal place. A result below zero shows as 0%. A day with no sessions (or no users) shows 100%.

## What counts

- **Session.** Counted each time the Bugsee SDK on a device opens a session with Bugsee. Sessions opened from simulators and emulators, and from devices Bugsee recognizes as Apple or Google app review devices, are not counted.
- **User.** A device. Each device counts once per day. **New users** are devices Bugsee sees for the first time.
- **Crash.** Each crash report counts as one crash, on the day the report was created. If that time is in the future or more than a month in the past, the day Bugsee received the report is used instead. Crash reports count from any device, simulators and review devices included.
- **Crashed user.** A device that sent at least one crash report that day, counted once per app version and build.

Handled errors and bug reports have their own charts (**Handled errors** and **Bugs**) and never count as crashes.

A report of any kind (crash, handled error or bug report) can also add one session and one user to its own day. It does so when the device's record in Bugsee was last updated on a different day; opening a session and sending a report both update that record. So handled errors and bug reports can raise the session and user counts, and with them the crash-free numbers.

## Versions and builds

Bugsee groups the numbers by the app version and build that the SDK reports: `CFBundleShortVersionString` and `CFBundleVersion` on iOS, `versionName` and `versionCode` on Android.

- **All versions** (the default) shows the whole app.
- Pick a version to see only that version. With a version selected, pick a build to narrow it further, or keep **All builds**.

Versions are listed newest first. When every version consists of one to three numeric parts (such as `2`, `2.1` or `2.1.3`), they are ordered by version number. A single version with a suffix (`1.0.0-beta`) or a fourth part (`1.2.3.4`) switches the whole list to the order in which the versions first appeared.

With **All versions** selected, the user counts are the app's daily totals. A device that updates during a day counts toward both versions, so per-version user counts can add up to more than the total.

The **Version adoption** chart shows each version's share of the day's users.

## Time range and days

Choose **Last 7 days**, **Last 30 days**, **Year**, **All** or **Custom period**. The charts need at least 3 days; a shorter custom period shows no statistics.

Days start at midnight in the app's time zone, shown under the filters (for example, *Days start at midnight (GMT+2)*). Set it in the app's settings, under **General** → **Timezone**. The time zone is a fixed offset from GMT with no daylight saving time, so in a region that observes daylight saving time, days start an hour away from local midnight for part of the year.

Bugsee fixes the day of each entry when it receives it: a session counts on the day it is received, a report on the day it was created (see [What counts](#what-counts)), both in the time zone set at that moment. Changing the time zone affects only data received after the change.

## Sharing the Overview page

An organization admin can make an app's Overview page visible to people without a Bugsee account. In the app's settings, under **Sharing**, turn on **Overview sharing** and copy the **Shared overview URL**.

## All apps at once

The **Cross-application overview**, the row at the top of the applications list (`https://app.bugsee.com/#/apps/_global/overview`), charts **Crash-free sessions** and **Crash-free users** for several apps side by side, computed the same way across all versions of each app.
