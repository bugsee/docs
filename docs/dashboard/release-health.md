---
title: "Release health"
description: "How Bugsee computes crash-free sessions and crash-free users on an app's Overview page: what counts as a session, a user and a crash, how versions and builds are grouped, and how days are bucketed."
sidebar_position: 1
slug: "/dashboard/release-health"
---

# Release health

An app's **Overview** page in the dashboard tracks how stable each release is, day by day. The **Stability** chart shows two lines, **Crash-free sessions** and **Crash-free users**, next to the **Sessions**, **Users** and **Crashes** charts they are computed from. Filter by app version and build to compare releases.

## Crash-free sessions and users

| Metric | How it is computed |
| --- | --- |
| **Crash-free sessions** | (sessions − crashes) ÷ sessions, as a percentage |
| **Crash-free users** | (users − crashed users) ÷ users, as a percentage |

Both are computed per day and rounded to one decimal place. A result below zero shows as 0%. A day with no sessions (or no users) shows 100%.

## What counts

- **Session.** Counted each time the Bugsee SDK on a device opens a session with Bugsee. Sessions from simulators and emulators, and from devices Bugsee recognizes as Apple or Google app review devices, are left out of these charts.
- **User.** A device. Each device counts once per day. **New users** are devices Bugsee sees for the first time.
- **Crash.** Each crash report counts as one crash, on the day the report was created. If that time is in the future or more than a month in the past, the day Bugsee received the report is used instead. Crash reports count whatever the device, simulators and review devices included.
- **Crashed user.** A device that sent at least one crash report that day, counted once per app version and build.

Handled errors and bug reports have their own charts (**Handled errors** and **Bugs**) and do not affect the crash-free numbers.

A crash report dated to a day other than the day its device last opened a session also adds one session and one user to the report's day.

## Versions and builds

Bugsee groups the numbers by the app version and build that the SDK reports: `CFBundleShortVersionString` and `CFBundleVersion` on iOS, `versionName` and `versionCode` on Android.

- **All versions** (the default) shows the whole app.
- Pick a version to see only that version. With a version selected, pick a build to narrow it further, or keep **All builds**.

Versions are listed newest first: by semantic version when every version is a valid semantic version, otherwise by when each version first appeared.

With **All versions** selected, the user counts are the app's daily totals. A device that updates during a day counts toward both versions, so per-version user counts can add up to more than the total.

The **Version adoption** chart shows each version's share of the day's users.

## Time range and days

Choose **Last 7 days**, **Last 30 days**, **Year**, **All** or **Custom period**. The charts need at least 3 days; a shorter custom period shows no statistics.

Days start at midnight in the app's time zone, shown under the filters (for example, *Days start at midnight (GMT+2)*). Set it in the app's settings, under **General** → **Timezone**. Bugsee assigns each session and report to a day when it receives it, so a new time zone applies to data received after the change.

## Sharing the Overview page

An organization admin can make an app's Overview page visible to people without a Bugsee account. In the app's settings, under **Sharing**, turn on **Overview sharing** and copy the **Shared overview URL**.

## All apps at once

The organization-wide Overview page (**Applications** → **Overview**) charts **Crash-free sessions** and **Crash-free users** for several apps side by side, computed the same way across all versions of each app.
