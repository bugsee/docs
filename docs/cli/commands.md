---
title: "Command reference"
description: "A map of every Bugsee CLI command and where to find its options."
sidebar_position: 10
slug: "/cli/commands"
---

# Command reference

Every command and flag is documented in the CLI's built-in help, which is always
in sync with the installed version:

```bash
bugsee-cli --help              # top-level command list + global flags
bugsee-cli <command> --help    # full options for one command
```

This page maps the command tree to the guides in this section.

## Global flags

| Flag | Environment variable | Description |
|---|---|---|
| `--app-token <APP_TOKEN>` | `BUGSEE_APP_TOKEN` | App token. Required by the upload commands; ignored by the resolvers. |
| `--endpoint <ENDPOINT>` | `BUGSEE_ENDPOINT` | API endpoint (default `https://api.bugsee.com`). Used only by upload commands. |
| `-h, --help` | — | Print help. |
| `-V, --version` | — | Print the CLI version. |

See [Configuration](/cli/configuration/) for details.

## Commands

| Command | What it does | Guide |
|---|---|---|
| `debug-files upload` | Discover, package, and upload debug information files (ProGuard, ELF, dSYM, source maps). | [Debug files](/cli/debug-files/) |
| `sourcemaps inject` | Inject deterministic debug IDs into JS bundles and their `.map` files. | [Source maps](/cli/sourcemaps/) |
| `upload build` | Register a build and upload its artefact (single-PUT or chunked). | [Builds](/cli/builds/#upload-build) |
| `upload build-info` | Upload per-build metadata sidecars in one bundle. | [Builds](/cli/builds/#upload-build-info) |
| `pack` | Build the normalized upload ZIP locally, without uploading. | [Builds](/cli/builds/#pack) |
| `xcode post-action` | Run the whole iOS build-publish flow from an Xcode post-action. | [iOS build publishing](/cli/xcode/) |
| `vcs-metadata` | Resolve VCS metadata (provider, commit, branch, PR, repo). | [Metadata resolvers](/cli/metadata/#vcs-metadata) |
| `ios-deps collect` | Collect the iOS dependency graph from lockfiles + linked frameworks. | [Metadata resolvers](/cli/metadata/#ios-deps-collect) |
| `build-env xcode-version` | Resolve the dotted Xcode version. | [Metadata resolvers](/cli/metadata/#build-env) |
| `build-env machine-label` | Emit the CI-aware host label. | [Metadata resolvers](/cli/metadata/#build-env) |
| `build-env read-plist` | Read an Info.plist's scalar keys as JSON. | [Metadata resolvers](/cli/metadata/#build-env) |
| `dsym uuid` | Extract Mach-O UUIDs from a dSYM bundle or binary. | [Metadata resolvers](/cli/metadata/#dsym) |
| `dsym slices` | Same as `uuid`, with per-slice architecture. | [Metadata resolvers](/cli/metadata/#dsym) |
| `update` | Self-update the binary (same-major). | [Updating the CLI](/cli/update/) |

## Exit codes

Upload commands follow a [structured exit-code contract](/cli/exit-codes/);
resolvers exit `0` and signal "no result" through their JSON output shape.
