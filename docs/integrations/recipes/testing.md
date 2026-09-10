---
title: "Testing recipes"
description: "How to test Bugsee custom recipes from the recipe editor, including test scenarios, dry run versus live mode, and how to read the results."
sidebar_position: 3
slug: "/integrations/recipes/testing"
---

Recipes are just little pieces of code, and as any code they also may contain bugs or just unhandled corner cases. To help you find those, the recipe editor can run your recipe against a generated issue and show you exactly what would be pushed.

The controls sit directly above the editor: pick a _Scenario_, pick a _Mode_, and click _"Run test"_. Results appear in the _Results_ pane below.

## Scenario

A scenario decides which issue your recipe is handed. Rather than typing field values, you choose the shape you want to exercise — the awkward ones are the point, since a recipe that works on a typical issue may still break on one with no description or a summary in a right-to-left script.

Scenarios come in two groups:

- **Issue shapes** — a typical issue, one with no reporter, a minimal issue, issues missing the summary and/or description, a crash, an error, a user-reported bug, a very long summary, unicode text, and low- and high-severity issues.
- **Transitions**, used to exercise `update()` — an issue being reopened, closed, raised in severity, retitled, or assigned.

The platform is **not** something you pick. The dialog is opened from a specific application's mapping, so the generated issue uses that application's platform — testing an iOS application's recipe against a generated Android issue would prove nothing about production.

## Mode

|Mode|What it does|
|---|---|
|Dry run|Runs the recipe and shows you the result without contacting the remote service. This is the default.|
|Live|Runs the recipe **and actually pushes the result**, creating a real item or message in the remote service.|

:::warning
_Live_ mode creates a real ticket, card or message in the integrated service — remember to clean it up afterwards. _Dry run_ is the default precisely so that clicking _"Run test"_ without reading cannot post anything.
:::

Live mode also requires the integration to be saved: there is nothing to push through until it exists.

## Results

Both recipe entry points are exercised in a single run, so a result is reported for each.

For issue-based recipes the results are labelled **Create** and **Update**, showing the item that `create()` would produce and the fields `update()` would change. For event-based recipes they are labelled **Notification (issue created)** and **Notification (issue updated)** — the event family has a single `handle()` method, so it is run twice, once against an `issue.created`-shaped event and once against `issue.updated`, both derived from the same generated issue.

You can expand the generated issue that was used for the test alongside the results, which is usually the fastest way to understand why a recipe took the branch it did.

In live mode each result also reports what happened at the remote end — a link to the created item where the service returns one, a note that the push was delivered where it does not, or the failure.
