---
title: "Installation"
description: "Install the Bugsee CLI with a one-line installer, npm, or Homebrew, and keep it up to date with self-update."
sidebar_position: 1
slug: "/cli/installation"
---

# Installation

The recommended way to install the Bugsee CLI is the self-hosted installer
script. It auto-detects your OS and architecture, downloads the matching binary
from `download.bugsee.com`, **SHA-256-verifies** it against the published
checksum, and installs it — with no GitHub dependency.

## macOS / Linux

```bash
curl --proto '=https' --tlsv1.2 -sSfL https://download.bugsee.com/cli/install.sh | sh
```

This installs to `/usr/local/bin` when it's writable, otherwise to
`~/.local/bin`. If the install directory isn't on your `PATH`, the script prints
a hint.

## Windows (PowerShell)

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://download.bugsee.com/cli/install.ps1 | iex"
```

This installs to `%LOCALAPPDATA%\Bugsee\bin`. Only 64-bit (x86_64/AMD64) Windows
is published.

## Installer environment overrides

Both installers accept the same environment variables:

| Variable | Effect |
|---|---|
| `BUGSEE_CLI_VERSION` | Pin an exact `X.Y.Z` instead of the latest release. |
| `BUGSEE_CLI_INSTALL_DIR` | Install to a specific directory. |
| `BUGSEE_CLI_BASE_URL` | Use an alternate download root (e.g. an internal mirror). |

For example, to pin a version into a specific directory:

```bash
BUGSEE_CLI_VERSION=0.6.0 BUGSEE_CLI_INSTALL_DIR="$HOME/bin" \
    sh -c "$(curl --proto '=https' --tlsv1.2 -sSfL https://download.bugsee.com/cli/install.sh)"
```

## Other channels

The CLI is also distributed through the package managers the various SDKs depend
on. These channels exist primarily so each SDK can bundle a pinned CLI, but they
work for direct installs too.

| Channel | Package |
|---|---|
| npm | `@bugsee/cli` (per-OS `optionalDependencies` pull the right binary) |
| Homebrew | the Bugsee tap |
| Maven Central | `com.bugsee:bugsee-cli` (consumed by the Android Gradle plugin) |

:::note
You normally don't install the CLI yourself for an SDK integration — the Bugsee
SDKs and build plugins download and pin a compatible CLI automatically. Install
it directly when you want to script uploads in CI, drive a custom build system,
or run the metadata resolvers by hand.
:::

## Verifying the install

```bash
bugsee-cli --version
bugsee-cli --help
```

`--version` prints the SemVer. `--help` prints the full command surface — every
subcommand, flag, and environment-variable alias.

## Keeping it up to date

```bash
bugsee-cli update
```

`update` adopts the newest published version **within the same major** as the
running binary (minor and patch releases are non-breaking; a breaking major bump
is never auto-adopted). It downloads and SHA-256-verifies the release for your
host, then atomically replaces the running executable. See
[Updating the CLI](/cli/update/) for `--check`, exact-version installs, and the
throttling options build tools use.
