---
title: "Builds & artefacts"
description: "Register builds, upload artefacts for size analysis, and package build-info metadata with the Bugsee CLI."
sidebar_position: 5
slug: "/cli/builds"
---

# Builds & artefacts

The `upload` command tree is the single canonical origin for Bugsee's build-time
artefact and metadata uploads. Producers (the Gradle plugin, the iOS build
script, fastlane) shell to these commands instead of maintaining their own HTTP
client, compression, retry, chunking, and presigned-URL handshake.

There are three commands:

| Command | Purpose |
|---|---|
| [`upload build`](#upload-build) | Register a build and upload its artefact in one flow. |
| [`upload build-info`](#upload-build-info) | Upload per-build metadata sidecars (dependencies, timings). |
| [`pack`](#pack) | Build the normalized upload ZIP locally, without uploading. |

## `upload build`

Registers a build with Bugsee and uploads its artefact (`.aab` / `.apk` /
`.ipa`) for server-side size analysis — in one flow.

```bash
bugsee-cli upload build \
    --payload-json '{"version":"1.4.0","build":"1400", ...}' \
    --artifact ./app/build/outputs/bundle/release/app-release.aab \
    --mapping ./app/build/outputs/mapping/release/mapping.txt
```

| Option | Description |
|---|---|
| `--payload-json <JSON>` | Registration metadata — the POST body for `/v2/apps/<token>/builds`. |
| `--artifact <PATH>` | Build artefact (`.aab` / `.apk` / `.ipa`), STORED verbatim in the ZIP. |
| `--mapping <PATH>` | Optional R8/ProGuard `mapping.txt`, zstd-packed alongside the artefact. |
| `--deps <PATH>` | Optional `dependencies.json` sidecar. |
| `--timings <PATH>` | Optional `timings.json` sidecar. |
| `--chunked` | Upload the artefact via the chunked protocol (for large artefacts) instead of a single PUT. |
| `--zstd-level <N>` | Zstd level `9..=22` (default `11`); or `--no-zstd`. |
| `--out <PATH>` | With `--dry-run`, write the would-be-uploaded ZIP to this path. |
| `--dry-run` | Pack the upload ZIP but skip registration and all network I/O. |

The artefact itself is **STORED** verbatim (it's already a compressed container,
so re-compressing only burns CPU); the mapping is zstd-compressed. The command
prints the resulting `build_id` to stdout.

When `--deps` / `--timings` are supplied **and** your organisation's build-info
feature is enabled, the build-info bundle ships from the same registration — no
second request.

### Large artefacts

For artefacts above the single-PUT threshold, add `--chunked` to use the chunked
upload protocol (chunk options → streamed SHA-1 hashing → chunk check →
PUT-missing dedup → chunked submit):

```bash
bugsee-cli upload build --payload-json "$PAYLOAD" --artifact ./app-release.aab --chunked
```

## `upload build-info`

Bundles per-build metadata sidecars (`dependencies.json`, `timings.json`, and
future `*.json`) into one zstd ZIP and uploads it with a single PUT. Use this
when you want to ship build metadata without (re-)uploading the artefact.

```bash
bugsee-cli upload build-info \
    --payload-json "$PAYLOAD" \
    --deps ./dependencies.json \
    --timings ./timings.json
```

| Option | Description |
|---|---|
| `--payload-json <JSON>` | Registration metadata. Required unless `--upload-url` is given. |
| `--deps <PATH>` | `dependencies.json` (packed as the `dependencies.json` entry). |
| `--timings <PATH>` | `timings.json` (packed as the `timings.json` entry). |
| `--sidecar <NAME=PATH>` | Additional sidecar entry (repeatable); the bundle is additive. |
| `--upload-url <URL>` | PUT directly to a presigned URL and skip the registration POST. |
| `--out <PATH>` | With `--dry-run`, write the would-be-uploaded ZIP to this path. |
| `--dry-run` | Pack the bundle but skip all network I/O. |

Use `--upload-url` when the producer already registered the build and received a
build-info upload URL in that response.

## `pack`

Builds the normalized upload ZIP locally and writes it to disk — **no upload**.
This lets a producer delegate compression to the CLI but handle the upload
itself.

```bash
bugsee-cli pack \
    --artifact ./app-release.aab \
    --mapping ./mapping.txt \
    --out ./bugsee-upload.zip
```

| Option | Description |
|---|---|
| `--artifact <PATH>` | Build artefact (`.aab` / `.apk` / `.ipa`). STORED verbatim. |
| `--mapping <PATH>` | Optional R8/ProGuard `mapping.txt`, zstd-compressed (method 93). |
| `--out <PATH>` | Output ZIP path. |
| `--zstd-level <N>` | Zstd level `9..=22` (default `11`); or `--no-zstd`. |

The output is the exact ZIP the worker's size-analysis job consumes: the
artefact STORED, the mapping zstd-compressed.

:::tip
For Android, the [Gradle plugin](/sdk/android/v7/gradle-plugin/) drives these
commands as part of the build. For iOS, [`xcode post-action`](/cli/xcode/)
wraps the whole flow. Call `upload` / `pack` directly only for custom build
pipelines.
:::
