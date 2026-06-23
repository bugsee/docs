---
title: "Uploading debug information files"
description: "Upload R8/ProGuard mappings, native ELF symbols, and Apple dSYMs to Bugsee with bugsee-cli debug-files upload."
sidebar_position: 3
slug: "/cli/debug-files"
---

# Uploading debug information files

Debug information files let Bugsee turn stripped, obfuscated, or native stack
traces back into readable symbols. The CLI discovers, packages, and uploads them
through a single command:

```bash
bugsee-cli debug-files upload <paths>... --version <X> --build <Y> [--type <TYPE>]
```

`<paths>` can be files or directories — the CLI scans them and discovers the
relevant debug files for the chosen type.

## Supported types

| `--type` | Use for | Notes |
|---|---|---|
| `proguard` *(default)* | Android R8 / ProGuard `mapping.txt` | The default when `--type` is unset. |
| `elf` | Native ELF symbols (Android NDK / Linux) | Also uploaded with a Breakpad transform. |
| `dsym` | Apple dSYM bundles | Recursive discovery + pre-upload UUID dedup. |
| `sourcemaps` | JavaScript source maps | See [Source maps](/cli/sourcemaps/). |

Other types (`pe`, `pdb`, `portable-pdb`, `breakpad`, `jvm`, `wasm`,
`sourcebundle`) are recognised by the discovery layer but not yet processed.

## Common options

| Option | Description |
|---|---|
| `--version <VERSION>` | App version (Android `versionName`) recorded on the symbol document. |
| `--build <BUILD>` | Build number (Android `versionCode`) recorded on the symbol document. |
| `--type <TYPE>` | Restrict discovery to a specific debug-file type (default `proguard`). |
| `--uuid <UUID>` | Override the auto-computed debug-id with a caller-supplied UUID. |
| `--icon <ICON>` | Attach a launcher icon to the symbol zip (entry `icon.<ext>`). |
| `--zstd-level <N>` | Zstd level `9..=22` (default `11`); or pass `--no-zstd`. |
| `--force` | Re-upload even if the server already has the symbol. |
| `--dry-run` | Discover and pack files but skip the HTTP upload. |

## Android (R8 / ProGuard)

`proguard` is the default type, so you can point the CLI at your mapping output
directory directly:

```bash
export BUGSEE_APP_TOKEN="your-app-token"

bugsee-cli debug-files upload ./app/build/outputs/mapping/release \
    --version 1.4.0 --build 1400
```

:::tip
For Android apps, the [Bugsee Gradle plugin](/sdk/android/gradle-plugin/)
runs this upload for you as part of the build. Run the CLI directly only when
you upload mappings outside Gradle.
:::

### The `--uuid` override

When a UUID is owned upstream — for example, the Android Gradle plugin writes a
build UUID into the SDK's asset channel — the upload **must** be keyed by that
exact UUID or crash symbolication never resolves. Pass it with `--uuid`:

```bash
bugsee-cli debug-files upload ./mapping \
    --version 1.4.0 --build 1400 \
    --uuid 6ba7b811-9dad-11d1-80b4-00c04fd430c8
```

If the supplied value differs from what the CLI would have computed, it logs a
warning and the override wins.

## Native (ELF)

```bash
bugsee-cli debug-files upload ./app/build/intermediates/merged_native_libs \
    --type elf --version 1.4.0 --build 1400
```

ELF symbols are uploaded with a Breakpad transform so native crashes from the
Android NDK (or Linux) symbolicate.

## Apple (dSYM)

Point the CLI at an archive's `dSYMs/` folder — or a whole DerivedData tree —
and every `*.dSYM` bundle is discovered and uploaded:

```bash
bugsee-cli debug-files upload "$ARCHIVE/dSYMs" \
    --type dsym --version 1.4.0 --build 1400
```

dSYM uploads declare each Mach-O slice's UUID up front so the server can skip
bundles it already has **before** the (possibly large) DWARF bytes are packed or
transferred. Pass `--force` to bypass that dedup and re-upload.

:::tip
For iOS apps, the [`xcode post-action`](/cli/xcode/) command uploads dSYMs as
part of the whole build-publish flow. Use `debug-files upload --type dsym`
directly for standalone or after-the-fact symbol uploads.
:::

## Compression

Symbol payloads are Zstd-compressed at level `11` by default. Tune it with
`--zstd-level` (values below `9` are rejected) or disable it for diagnostics
with `--no-zstd`.

## Dry runs

`--dry-run` runs full discovery and packaging but stops before the upload —
useful for confirming exactly which files the CLI would pick up:

```bash
bugsee-cli debug-files upload ./mapping --version 1.4.0 --build 1400 --dry-run
```
