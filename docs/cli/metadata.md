---
title: "Build metadata resolvers"
description: "Resolve VCS metadata, iOS dependency graphs, build-environment values, and Mach-O UUIDs with the Bugsee CLI's resolver subcommands."
sidebar_position: 7
slug: "/cli/metadata"
---

# Build metadata resolvers

Beyond uploads, the CLI ships a family of **resolver** subcommands that gather
build-environment metadata in CI. They do no network I/O, print JSON (or a bare
string) to stdout, and exit `0` even when they find nothing — callers inspect
the output shape, not the exit code.

These are the canonical resolvers the Bugsee fastlane plugin and the iOS SDK's
build script call, replacing logic each of them used to duplicate.

| Command | Resolves |
|---|---|
| [`vcs-metadata`](#vcs-metadata) | Git provider, commit SHA, branch, PR number, repo. |
| [`ios-deps collect`](#ios-deps-collect) | iOS dependency graph from lockfiles + linked frameworks. |
| [`build-env`](#build-env) | Xcode version, CI machine label, Info.plist values. |
| [`dsym`](#dsym) | Mach-O UUIDs from a dSYM bundle or binary. |

## `vcs-metadata`

Resolves VCS metadata from CI provider environment variables (GitHub Actions,
GitLab CI, Bitbucket Pipelines, CircleCI, Bitrise, Jenkins, Xcode Cloud, a
generic `CI`) or a `git` fallback.

```bash
bugsee-cli vcs-metadata [--working-dir <PATH>]
```

```json
{
  "provider": "github",
  "commit_sha": "abc123…",
  "repo": "org/repo",
  "branch": "main"
}
```

`--working-dir` sets the directory the `git` fallback runs in (defaults to the
process working directory). Absent fields are omitted, not serialised as `null`.

## `ios-deps collect`

Scans a project root for iOS dependency manifests — `Podfile.lock` (CocoaPods),
`Package.resolved` (SPM), `Cartfile.resolved` (Carthage) — and, optionally, the
vendored frameworks linked into a product binary, then merges them into one
entry list.

```bash
bugsee-cli ios-deps collect --project-root <PATH> [--product-binary <PATH>] [--max-entries N]
```

| Option | Description |
|---|---|
| `--project-root <PATH>` | Project root. Lockfiles are searched here and up to 6 ancestor levels. |
| `--product-binary <PATH>` | Optional linked binary for the vendored-framework scan (runs `otool -L`). |
| `--max-entries <N>` | Truncation cap on the merged list (default `5000`). |

```json
{
  "entries": [{"id":"library::Alamofire","name":"Alamofire","direct":true,"type":"library","version":"5.10.0","url":"https://github.com/Alamofire/Alamofire.git"}],
  "scope_label": "all",
  "truncated": false
}
```

## `build-env`

Three build-environment resolvers, each printing its result to stdout (empty
string / empty object when unresolved).

```bash
bugsee-cli build-env xcode-version    # e.g. "16.2.0"
bugsee-cli build-env machine-label    # e.g. "github-actions:runner-1"
bugsee-cli build-env read-plist <plist>
```

| Subcommand | Resolves |
|---|---|
| `xcode-version` | Dotted Xcode version. Reads `$XCODE_VERSION_ACTUAL`, else `xcodebuild -version`. |
| `machine-label` | CI-provider-aware host label, or the local hostname. |
| `read-plist <plist>` | Top-level scalar keys of an Info.plist (binary or XML) as a JSON dict. |

## `dsym`

Extracts Mach-O UUIDs from a `.dSYM` bundle directory or a single Mach-O binary,
using one canonical `symbolic-debuginfo` parser (replacing `dwarfdump -u`
shell-outs).

```bash
bugsee-cli dsym uuid <path>     # JSON array of uppercase hyphenated UUIDs
bugsee-cli dsym slices <path>   # arch-aware: [{"uuid":"…","arch":"arm64"}, …]
```

`uuid` prints a JSON array of uppercase hyphenated UUID strings in archive
order. `slices` adds the per-slice architecture, used to pick the right slice
from a fat binary. Both return `[]` (exit `0`) on any parseable failure.

```json
["54D75FB3-747F-387F-8A93-4EA034B1F8CF","8D00647D-E563-30F9-9F17-E1FFCEFF70B4"]
```

## Output stability

Each resolver's stdout JSON shape is a stable contract — the fastlane plugin and
the iOS build script bind to it. Fields are added compatibly; renames, removals,
or `[]` ↔ `null` changes are treated as breaking and require a major version
bump. See [Exit codes & telemetry](/cli/exit-codes/) for how the
"exit 0 + inspect the JSON" convention works.
