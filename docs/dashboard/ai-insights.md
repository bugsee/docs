---
title: "AI Insights"
description: "Analyze a crash or handled error in the Bugsee dashboard with AI Insights: likely root cause, suggested fix, confidence and the sources it used, optionally grounded in your GitHub or GitLab repository."
sidebar_position: 2
slug: "/dashboard/ai-insights"
---

# AI Insights

AI Insights analyzes a crash or a handled error and explains it: the most likely root cause, whose code has to change, a suggested fix, and how confident the analysis is. It works from the report alone. Connect the app's GitHub or GitLab repository, with read-only access, and it also reads the code around the crashing frames.

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
| **Confidence** | 0–100%: how much the report itself establishes. Insights asks for values above 90% only when the stack, the message or the source shows the cause directly, and for lower values when the cause is inferred from a pattern. |
| **Implicated files** | Files named in the stack, the source excerpts or the exception message. |
| **Suggested fix** | What to change in your app's code. When the fix is in a file Insights read from your repository, it is shown as a diff. |
| **Bugsee SDK** | Notes on Bugsee's own SDK, when it is involved. Such reports are also marked **Bugsee SDK involved**. |
| **Sources** | The source files the analysis used. Files from your repository link to them in your provider, at the revision that was read. Android platform files link to the Android Open Source Project (AOSP). Bugsee SDK files are listed by path. |

## What it reads

To produce the analysis, AI Insights sends an AI model:

- the exception, the stack trace with its nested causes, and the device environment;
- the report's summary and description;
- up to 40 recent log entries from the report, only error entries when there are any;
- source excerpts around the frames in the stack: from your repository when one is connected, from the Bugsee SDK (at the version that produced the report) when SDK frames are in the stack, and from AOSP (at the device's OS release) for Android platform frames.

The report must include crash data; without it, the analysis fails with *Crash data was not available*.

## Connect a source repository

People who can modify the app connect its repository in the app's settings, under **Source repository**, or from the **AI Insights** tab with **Set up source repository**. Click **Setup** and choose a provider:

- **GitHub.** Install the **Bugsee AI Insights** GitHub App, with read-only access (Contents: Read and Metadata: Read). You sign in so Bugsee can list the installations you can see. Bugsee does not keep your GitHub user token after setup; Insights reads files with a short-lived installation token.
- **GitLab.** Authorize with OAuth and the `read_api` scope, which lists your projects and reads files. Insights stores a refresh token for the app. Use a bot or service account if you do not want to use a personal login.
- **Access token.** For GitHub Enterprise or a self-hosted GitLab, or if you prefer a token, choose **Use an access token instead** and enter the **Clone URL** (leave it blank for github.com and gitlab.com), the **Repository** and the **Access token**.

Then pick the **Default branch** and, if the app's source lives in a subdirectory of the repository, a **Path prefix**. **Disconnect** in the same panel removes the connection.

### Which revision is read

Insights reads the code that shipped, trying in this order:

1. the commit SHA of the matching build (same app version and build number), when that build was registered with Bugsee with a commit SHA (see [Builds & artefacts](/cli/builds));
2. a git tag that matches the app version, with or without a leading `v`;
3. the default branch.

## Monthly limit

Each analysis counts toward a monthly limit for the organization, set by its plan. Once the limit is reached, requests fail with *AI usage quota for this organization has been exceeded* until the next calendar month.

## Bug reports: UI/UX analysis

For a bug report, the **AI Insights** tab offers a UI/UX analysis instead: click **Request UI/UX analysis**. It reviews frames from the video recorded before the report, the screenshot (including annotations the user drew), and the report's summary and description, and describes what most likely led the user to file the report. It counts toward the same monthly limit.
