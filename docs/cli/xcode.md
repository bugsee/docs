---
title: "iOS build publishing"
description: "Run the entire iOS build-publish flow from an Xcode Run Script post-action with bugsee-cli xcode post-action."
sidebar_position: 6
slug: "/cli/xcode"
---

# iOS build publishing

`bugsee-cli xcode post-action` runs the entire iOS build-publish flow from an
Xcode "Run Script" post-action. It reads the Xcode build environment, decides
whether it should run, and — when admitted — registers the build, uploads the
build-info bundle, uploads the artefact (when size analysis is enabled), uploads
dSYMs, and optionally runs an in-build size check.

```bash
bugsee-cli xcode post-action
```

:::note
The iOS SDK wires this command into your project's build phases for you. You
generally don't invoke it by hand — this page documents the flags and
environment variables so you can tune its behaviour.
:::

## Background vs. foreground

By default the command runs in the **background**: it detaches into a daemon so
the archive returns immediately, and logs to `$PROJECT_TEMP_DIR/bugsee-cli.log`.

```bash
# Run synchronously instead (required for CI build gating)
bugsee-cli xcode post-action --force-foreground
```

`--force-foreground` is the **only** mode in which a size-check FAIL can
deliberately fail the build (exit code `40`). As a post-action, the default
background mode must never fail an already-signed build.

## Gating

The command only does work when it's admitted by its gating flags. By default it
runs on **Archive** actions for **Release** configurations.

| Behaviour | Flag | Environment variable | Default |
|---|---|---|---|
| Run the whole flow | `--enable-build-info` / `--disable-build-info` | `BUGSEE_BUILD_INFO_ENABLED` | on |
| Also run on plain Build actions | `--enable-all-actions` / `--disable-all-actions` | `BUGSEE_BUILD_INFO_ALL_ACTIONS` | off |
| Run for non-Release configurations | `--enable-all-configurations` / `--disable-all-configurations` | `BUGSEE_BUILD_INFO_ALL_CONFIGURATIONS` | off (Release-only) |

When gated out, the command is a no-op and exits `0`.

## What it collects and uploads

| Step | Flag | Environment variable | Default |
|---|---|---|---|
| Dependency graph | `--enable-dependencies` / `--disable-dependencies` | `BUGSEE_DEPENDENCIES_ENABLED` | on |
| Build timings (from `.xcactivitylog`) | `--enable-timings` / `--disable-timings` | `BUGSEE_BUILD_INFO_TIMINGS_ENABLED` | on |
| Upload `.ipa` for size analysis | `--enable-size-analysis` / `--disable-size-analysis` | `BUGSEE_SIZE_ANALYSIS_ENABLED` | off |
| Chunked artefact transport | `--enable-chunked-upload` / `--disable-chunked-upload` | `BUGSEE_CHUNKED_UPLOAD` | off |

dSYM upload and build-info registration always run when the command is admitted.

## In-build size check

The size check can deliberately **fail the build** (exit `40`) when the artefact
grows past a configured threshold — but only with `--force-foreground`.

| Behaviour | Flag | Environment variable | Default |
|---|---|---|---|
| Enable the size-growth check | `--enable-size-check` / `--disable-size-check` | `BUGSEE_SIZE_CHECK_ENABLED` | off |
| Warn at ≥ percent growth | `--size-check-warning-pct <PCT>` | `BUGSEE_SIZE_CHECK_WARNING_PCT` | — |
| Fail at ≥ percent growth | `--size-check-fail-pct <PCT>` | `BUGSEE_SIZE_CHECK_FAIL_PCT` | — |
| Warn at ≥ bytes growth | `--size-check-warning-bytes <BYTES>` | `BUGSEE_SIZE_CHECK_WARNING_BYTES` | — |
| Fail at ≥ bytes growth | `--size-check-fail-bytes <BYTES>` | `BUGSEE_SIZE_CHECK_FAIL_BYTES` | — |

Growth is measured against the previous build.

## Flags override environment variables

Every toggle above has both a CLI flag and an environment variable. The Xcode
build environment exports the `BUGSEE_*` variables; a flag passed on the command
line **overrides** its environment variable. Within a `--enable-x` / `--disable-x`
pair, the last flag wins; an unset flag falls back to the environment variable,
then the default.

The app token and endpoint come from `--app-token` / `--endpoint` (or
`BUGSEE_APP_TOKEN` / `BUGSEE_ENDPOINT`) like every other command — see
[Configuration](/cli/configuration/).

:::tip
`BUGSEE_BUILD_INFO_ALL_CONFIGURATIONS` has a legacy alias,
`BUGSEE_SIZE_ANALYSIS_ALL_CONFIGURATIONS`, which is still honoured.
:::

For the authoritative, always-current list, run:

```bash
bugsee-cli xcode post-action --help
```
