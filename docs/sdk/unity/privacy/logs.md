---
title: "Privacy and console logs"
description: "Disable console log collection in the Bugsee Unity SDK using the CaptureLogs launch option to protect sensitive information."
sidebar_position: 2
slug: "/sdk/unity/privacy/logs"
---

Bugsee automatically captures all standard applications console logs. The feature can be either completely disabled or
logs can be sanitized during recording to strip any PII data.

## Disabling log collection

Console log collection can be disabled completely using **CaptureLogs** launch option. See [configuration](/sdk/unity/configuration/) for more info.