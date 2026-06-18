---
title: "Updating the CLI"
description: "Keep the Bugsee CLI current with the self-update command — same-major upgrades, exact-version installs, and best-effort throttling for build tools."
sidebar_position: 8
slug: "/cli/update"
---

# Updating the CLI

The CLI updates itself in place:

```bash
bugsee-cli update
```

By default it adopts the newest published version **within the same major** as
the running binary — minor and patch releases are non-breaking under Bugsee's
release policy, and a breaking major bump is never auto-adopted. It downloads
and **SHA-256-verifies** the release for your host triple, then atomically
replaces the current executable (so even the Windows running-`.exe` case works).

The download is verified **before** the running binary is replaced, so a failed
or corrupt download never leaves you with a broken install.

## Options

| Option | Description |
|---|---|
| `--check` | Report whether a newer compatible version is available, without downloading or replacing anything. Exits `0` either way. |
| `--version <X.Y.Z>` | Install an exact version instead of the resolved latest-in-major. A different major is allowed but warned about. |
| `--force` | Re-install even when already on the target version (repairs a corrupt or partial install). |
| `--max-age <DURATION>` | Check at most once per interval, and treat any failure as best-effort (exit `0`). |

## Checking without updating

```bash
bugsee-cli update --check
```

This reports the available version and exits `0` whether or not an update
exists — handy in scripts that want to surface "an update is available" without
acting on it.

## Installing an exact version

```bash
bugsee-cli update --version 0.6.0
```

A version in a **different** major than the running binary is permitted but the
command warns, since it may contain breaking changes. Combine with `--force` to
reinstall the version you're already on.

## How build tools call it

The Android Gradle plugin and the iOS build scripts run `update` on the CLI they
manage, so a fix or improvement reaches every build without anyone re-installing
anything. They use `--max-age` so it stays cheap and never breaks a build:

```bash
bugsee-cli update --max-age 12h
```

`--max-age` does two things:

1. **Throttles.** The last-check time is recorded next to the binary, and the
   command no-ops while the check is still "fresh" (e.g. checked less than `12h`
   ago). Durations accept `s` / `m` / `h` / `d` suffixes — `30m`, `12h`, `1d`,
   `3600s` (a bare number is seconds).
2. **Implies best-effort.** Any check or download failure is logged and the
   command exits `0`. That lets a build tool run it on every invocation without
   ever failing the build over a transient network error.

Because the throttle and best-effort semantics live in the CLI itself, every
consumer gets identical update behaviour — the build tools just exec
`bugsee-cli update --max-age <interval>` and let the CLI own discovery, the
same-major cap, throttling, verification, and replacement.

## Discovery

The CLI resolves the newest compatible version from small version-pointer files
the release mirror publishes:

- `cli/latest/version.txt` — the absolute latest version.
- `cli/v<major>.x/version.txt` — the latest version **within** a major.

The per-major pointer is the shared contract `update` reads to find the newest
non-breaking version. Both pointers only ever advance. The download root can be
overridden with the `BUGSEE_CLI_UPDATE_BASE_URL` environment variable (e.g. for
an internal mirror).
