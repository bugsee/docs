---
title: "Configuration"
description: "Configure the Bugsee CLI with the app token and API endpoint, via flags or environment variables."
sidebar_position: 2
slug: "/cli/configuration"
---

# Configuration

The Bugsee CLI is configured almost entirely through two values — your **app
token** and the **API endpoint** — each available as a global flag and an
environment variable. Everything else is per-command.

## App token

The app token identifies your application in Bugsee. It's required by the
upload-flavoured subcommands and ignored by the rest.

```bash
# As a flag
bugsee-cli debug-files upload ./mapping --app-token "your-app-token" --version 1.0.0 --build 100

# As an environment variable (preferred in CI)
export BUGSEE_APP_TOKEN="your-app-token"
bugsee-cli debug-files upload ./mapping --version 1.0.0 --build 100
```

| | |
|---|---|
| Flag | `--app-token <APP_TOKEN>` |
| Environment variable | `BUGSEE_APP_TOKEN` |
| Required by | `debug-files upload`, `upload build`, `upload build-info`, `xcode post-action` |

You can find your app token in the Bugsee dashboard under your application's
settings.

## API endpoint

The endpoint defaults to `https://api.bugsee.com`. Override it only for
self-hosted or regional deployments.

| | |
|---|---|
| Flag | `--endpoint <ENDPOINT>` |
| Environment variable | `BUGSEE_ENDPOINT` |
| Default | `https://api.bugsee.com` |

The endpoint is used only by the upload-flavoured subcommands. The metadata
resolvers (`vcs-metadata`, `ios-deps`, `build-env`, `dsym`, `sourcemaps inject`)
do no network I/O and ignore it.

## Flags vs. environment variables

Both `--app-token`/`--endpoint` are **global** — they can be passed before or
after the subcommand and every subcommand accepts them, so the same
environment-variable-driven invocation works across the whole CLI. A flag passed
on the command line takes precedence over the corresponding environment
variable.

This is why CI integrations typically `export BUGSEE_APP_TOKEN` and
`BUGSEE_ENDPOINT` once and then call the CLI without repeating credentials on
every line.

## Per-command configuration

Beyond the two globals, each command takes its own options — version/build
numbers for symbol uploads, compression levels, dry-run switches, and so on. The
`xcode post-action` command in particular reads a family of `BUGSEE_*`
environment variables from the Xcode build environment; see
[iOS build publishing](/cli/xcode/) for that full set. The authoritative
reference for any command is its built-in help:

```bash
bugsee-cli <command> --help
```

See the [command reference](/cli/commands/) for the full list.
