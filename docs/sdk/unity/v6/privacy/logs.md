---
title: "Privacy and console logs"
description: "Disable console log collection in the Bugsee Unity SDK using the CaptureLogs launch option to protect sensitive information."
sidebar_position: 2
slug: "/sdk/unity/v6/privacy/logs"
---

:::caution[Previous version]
This page documents Bugsee Unity SDK **6.x**, the current stable release. The new **7.x** SDK is in beta: see [Migrating from 6.x to 7.x](/sdk/unity/migration) to evaluate it, or the [7.x overview](/sdk/unity/overview) to start a new integration.
:::

Bugsee automatically captures all standard application console logs. If those logs may contain PII data, the feature
can be completely disabled.

## Disabling log collection

Console log collection can be disabled completely using **CaptureLogs** launch option. See [configuration](/sdk/unity/v6/configuration/) for more info.