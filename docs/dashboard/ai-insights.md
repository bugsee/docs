---
title: "AI Insights"
description: "Analyze a crash or handled error in the Bugsee dashboard with AI Insights: likely root cause, suggested fix, confidence and the sources it used, optionally grounded in your GitHub or GitLab repository."
sidebar_position: 2
slug: "/dashboard/ai-insights"
---

# AI Insights

AI Insights analyzes a crash or a handled error and explains it: the most likely root cause, whose code has to change, a suggested fix, and how confident the analysis is. It works from the report alone. Connect the app's GitHub or GitLab repository, read-only, and it also reads the code around the crashing frames.

:::info[Beta]
AI Insights is in beta. It is available on every plan except Lite, and during a trial.
:::

## Run an analysis

1. Open a crash or an error in the dashboard and select the **AI Insights** tab.
2. Optionally check **Notify me when it finishes** to get an email when the analysis is ready or has failed.
3. Click **Request incident analysis**.

The analysis runs in the background, so you can leave the page. The tab waits for the result for two minutes; if the analysis is still running after that, click **Keep waiting**.

- **Failed runs.** The tab shows the error and a **Retry incident analysis** button. If a new run fails after an earlier one succeeded, the earlier result stays on screen.
- **Running it again.** Use the **Analyze incident** action on the tab. A new analysis replaces the existing one.
- **One run at a time.** While an analysis is running, requesting another one does not start a second run.

## What the analysis contains

| Part | What it says |
| --- | --- |
| Summary and **Root cause** | The most likely reason for the failure. The analysis walks nested causes and quotes the implicated lines when it has source code. Without source, it says so and reasons from the stack, the exception message and the device environment. |
| **Likely origin** | Whose code has to change: **Application code**, **Bugsee SDK**, **System** (nothing the app's author can change, such as an OS or device fault or a kill from outside the process) or **Unknown**. A crash inside platform code that failed on what the app handed it counts as application code. |
| **Confidence** | The model's own rating, from 0 to 100%, of how well the evidence in the report (the stack, the exception message and any source it read) supports the stated cause. A high value means the evidence shows the cause directly; a low value means the cause is inferred and other causes could look the same. It is an estimate, not a measured probability. |
| **Implicated files** | Files named in the stack, the source excerpts or the exception message. |
| **Suggested fix** | What to change in your app's code. When the fix is in a file Insights read from your repository, it can be shown as a diff: only when the lines it replaces appear exactly once in the code that was read, and the replacement is at most 20 lines. Otherwise the fix is described in prose. |
| **Bugsee SDK** | Notes on Bugsee's own SDK, when it is involved. Such reports are also marked **Bugsee SDK involved**. |
| **Sources** | The source files the analysis used. Files from your repository link to them in your provider, at the revision that was read. Android platform files link to the Android Open Source Project (AOSP). Bugsee SDK files are listed by path. |

## What it reads

To produce the analysis, AI Insights sends an AI model the following:

- the report's full environment record without device identifiers: device, OS and app details, locale, network and cellular state; on Android also app permissions, installer and boot time; on iOS with `BugseeOptionCaptureDeviceAndNetworkNames`, also the device name, Wi-Fi SSID and carrier; plus the wrapper (runtime) and Bugsee SDK type, version and build;
- whether Bugsee flagged the report as an error in its own SDK;
- the report's summary and description;
- how the report was triggered: trigger, mechanism and origin;
- the exception: crash or handled error, the signal name and code, the reason or message, and the stack trace with its nested causes (or the crashed thread's stack when there is no exception);
- for native crashes, the machine code around the crashing instruction, decoded, when the SDK captured it;
- when a repository is connected: its provider, its name, and the revision that was read;
- when Bugsee SDK frames were matched against Bugsee's own debug symbols: details of those symbols (SDK version, format, image UUIDs);
- source excerpts around the frames in the stack: from your repository when one is connected, from the Bugsee SDK (at the version that produced the report) when SDK frames are in the stack, and from AOSP (at the device's OS release) for Android platform frames;
- up to 40 recent log entries from the report (only error entries when there are any), at most 24 KB;
- the Bugsee SDK's own diagnostic log around the recording, at most 12 KB; used for the analysis, not shown in the result.

The report must include crash data; without it, the analysis fails with *Crash data was not available*.

## Connect a source repository

People who can modify the app connect its repository in the app's settings, under **Source repository**, or from the **AI Insights** tab with **Set up source repository**. Click **Setup** and choose a provider:

- **GitHub.** Install the **Bugsee AI Insights** GitHub App, with read-only access (Contents: Read and Metadata: Read). You sign in so Bugsee can list the installations you can see. Bugsee does not keep your GitHub user token after setup; Insights reads files with a short-lived installation token.
- **GitLab.** Authorize with OAuth and the `read_api` scope, which gives read access through the API to everything the authorizing account can see; Insights uses it to list projects and read files. Insights stores a refresh token for the app. Use a bot or service account if you do not want to use a personal login.
- **Access token.** Inside the GitHub or GitLab setup, click **Use an access token instead**. Leave **Clone URL** blank: Insights reads only from github.com and gitlab.com, so GitHub Enterprise and self-hosted GitLab are not supported. On GitHub, prefer a fine-grained token with read-only Contents; a classic token needs the full `repo` scope for private repositories.

Then pick the **Default branch** and, if the app's source lives in a subdirectory of the repository, a **Path prefix**. **Disconnect** in the same panel removes the connection.

### Which revision is read

If the matching build (same version and build number) was registered with a commit SHA (see [`vcs-metadata`](/cli/metadata#vcs-metadata)), Insights reads that commit only. Otherwise it tries a git tag matching the app version (with or without `v`, and without a pre-release suffix), then the default branch.

## Monthly limit

Each request that starts an analysis counts toward a monthly limit for the organization, set by its plan. That includes runs that fail and retries; a request is refunded only when Bugsee cannot schedule the run at all. Once the limit is reached, the dashboard shows *Your organization account has reached the maximum number of AI Insights requests allowed per month (N)*, with N the limit, until the next calendar month. Contact Bugsee support to raise it.

## Bug reports: UI/UX analysis

For a bug report, the **AI Insights** tab offers a UI/UX analysis instead: click **Request UI/UX analysis**. It reviews frames from the video recorded before the report, the screenshot (including annotations the user drew), and the report's summary and description, plus the platform and OS version, device make and model, package ID, app version, framework and report type, and describes what most likely led the user to file the report. It counts toward the same monthly limit.

The analysis needs the report's video. For a report without one, no analysis is produced, but the request still counts toward the limit; after 60 seconds the tab stops waiting and suggests reloading the page later.
