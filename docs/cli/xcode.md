---
title: "iOS build publishing"
description: "Publish iOS builds and upload dSYMs from Xcode with bugsee-cli xcode post-action and xcode upload-dsyms."
sidebar_position: 6
slug: "/cli/xcode"
---

# iOS build publishing

Two commands read the Xcode build environment and upload from within a build.

| Command | Runs from | Uploads | Can fail the build |
|---|---|---|---|
| [`xcode post-action`](#xcode-post-action) | A scheme's **Archive → Post-actions** | dSYMs, build registration, build-info, artefact, size check | Only the size check, and only with `--force-foreground` |
| [`xcode upload-dsyms`](#xcode-upload-dsyms) | A target's **Run Script build phase** | dSYMs only | Yes — by design |

Choose `post-action` for the full build-publish flow, which is what the iOS SDK
wires up. Choose `upload-dsyms` when you only want symbols, when a build phase
is easier to generate than scheme XML (a React Native or Flutter config plugin
editing `project.pbxproj`), or when you want a failed upload to be visible
rather than silent.

## `xcode post-action`

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

## `xcode upload-dsyms`

:::info[Requires CLI 0.7.7 or newer]
:::

`bugsee-cli xcode upload-dsyms` uploads dSYMs from an Xcode **Run Script build
phase**, with none of the `BUGSEE_BUILD_INFO_*` gating. It neither registers a
build nor uploads build-info, so it is safe to run on every build.

Add a "Run Script" phase to your target — after "Embed Frameworks" — with:

```bash
"$SRCROOT/path/to/bugsee-cli" xcode upload-dsyms --app-token "$BUGSEE_APP_TOKEN"
```

It scans `DWARF_DSYM_FOLDER_PATH`, which Xcode sets in every Run Script phase,
and falls back to `<ARCHIVE_PATH>/dSYMs`.

:::warning[Xcode 15 and newer]
`ENABLE_USER_SCRIPT_SANDBOXING` defaults to `YES`, which stops a build phase
from reading the dSYM folder. Set it to `NO` on the target, or declare the
folder in the phase's input file lists. The scheme post-action is unaffected.
:::

### A genuine failure fails the build

This is the opposite of `post-action`'s policy, and it is deliberate: a build
phase that swallows errors means symbolication silently stops working and nobody
notices until a crash report is unreadable.

| Situation | Exit code | Build |
|---|---|---|
| Uploaded, or there was nothing to upload | `0` | continues |
| A bundle could not be read or packed | `10` / `11` | **fails** |
| Missing or rejected app token, or a refused flag combination from the environment | `20` / `21` | **fails** |
| Server error or network failure | `30` / `31` | **fails** |
| A refused flag combination passed as flags | `2` | **fails** |

"Nothing to upload" — no dSYM folder, or a folder with no `.dSYM` bundles — is a
success. A target that produces no debug symbols is a normal state; only real
problems fail the build.

### Failing and detaching are independent

Each has a flag pair and an environment variable, and a flag overrides its
variable.

| Behaviour | Flags | Environment variable | Default |
|---|---|---|---|
| Fail the build on error | `--fail` / `--no-fail` | `BUGSEE_DSYM_UPLOAD_NO_FAIL` | fail |
| Detach the upload | `--background` / `--no-background` | `BUGSEE_DSYM_UPLOAD_BACKGROUND` | follows the failure policy |

| Invocation | Fails the build | Waits for the upload |
|---|---|---|
| *(default)* | yes | yes |
| `--no-fail` | no | no — detaches |
| `--no-fail --no-background` | no | **yes** |
| `--fail --background` | *refused* | — |

`--no-fail --no-background` is usually what CI wants: never break the build, but
still wait for the upload, so a runner tearing down its process tree the moment
`xcodebuild` returns cannot kill it mid-flight.

`--fail --background` is **refused**, not honoured — exit `2` when given as
flags, exit `20` when it arrives through the environment. A detached process's
exit code reaches nobody, so "fail the build" would silently do nothing.

A detached run logs to `$PROJECT_TEMP_DIR/bugsee-cli.log` instead of the Xcode
build log, so `--no-background` is also how you keep its warnings visible. On
Windows there is no fork and every run is synchronous.

```bash
bugsee-cli xcode upload-dsyms --help
```
