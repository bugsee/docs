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
| `pdb` | Windows PDB files | Keyed by the PDB debug id (GUID + age). |
| `sourcemaps` | JavaScript source maps | See [Source maps](/cli/sourcemaps/). |
| `rust` | Rust (Cargo) build output | Discovers whichever format the target emitted. See [Rust](#rust-cargo). |
| `il2cpp-linemap` | Unity IL2CPP line-number mappings | See [Unity IL2CPP](#unity-il2cpp). |

Other types (`pe`, `portable-pdb`, `breakpad`, `jvm`, `wasm`, `sourcebundle`)
are recognised by the discovery layer but not yet processed.

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
| `--concurrency <N>` | *(`--type sourcemaps` only, CLI 0.7.10+)* Ceiling on uploads in flight, `1..=32`. |
| `--allow-empty` | *(`--type sourcemaps` only, CLI 0.7.10+)* Treat "nothing to upload" as success. |
| `--il2cpp-uuid <UUID>` | *(`--type il2cpp-linemap` only)* Additional module UUID for a multi-ABI build. |
| `--il2cpp-root <PATH>` | *(`--type il2cpp-linemap` only)* Path to `il2cppFileRoot.txt` when it isn't beside the JSON. |

`--concurrency` and `--allow-empty` are **rejected with exit `20`** for any other
`--type`, rather than accepted and ignored — so a caller who passed
`--allow-empty` to keep a build green can't silently still get exit `10`.

## Re-uploads and missing paths

A symbol the server already has is **skipped, and the batch continues** — so
rebuilding an app uploads only what changed. Pass `--force` to re-upload anyway.

A path that **does not exist is an error** (exit `10`, `path does not exist: …`),
even when other paths in the same invocation do hold symbols, and nothing is
uploaded. A path you named and the tool cannot find is a typo or a build that
never ran, and half-uploading a build's symbols hides that until a crash arrives
unsymbolicated.

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
Android NDK (or Linux) symbolicate. Each `.so` is uploaded as its own symbol,
keyed by its **GNU build-id** (`.note.gnu.build-id`) — so an unchanged library
is skipped before its bytes transfer. A library built **without** a build-id
can't be matched at crash time and is skipped with a warning; build native
libraries with `-Wl,--build-id=sha1` to ensure they're symbolicated (see
[Native crashes → Symbolication](/sdk/android/issue-detection/native-crashes#symbolication-and-native-debug-symbol-upload)).

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

## Rust (Cargo)

A Rust project has no single symbol format: it's a `.dSYM` bundle for Apple
targets, a `.pdb` for `*-pc-windows-msvc`, and the ELF binary itself (keyed by
its GNU build-id) for Linux and Android. `--type rust` discovers whichever the
build produced, so one command covers every target:

```bash
bugsee-cli debug-files upload --type rust target/release \
    --version 1.4.0 --build 250
```

Artefacts are classified by container magic rather than by host OS, so a
cross-compiled `target/<triple>/release` uploads correctly from any machine.
Cargo intermediates (`deps/`, `build/`, `incremental/`, `.fingerprint/`) are
skipped, and `--uuid` is rejected — every Rust debug format carries its own
identity, which is what the SDK reports at crash time.

A stock `cargo build --release` emits nothing uploadable. Each format needs a
build setting that, if missing, produces an upload that is accepted and then
resolves nothing:

```toml
# Cargo.toml
[profile.release]
debug = 1                       # emit DWARF at all
split-debuginfo = "packed"      # macOS/iOS: collect it into a .dSYM
```

```toml
# .cargo/config.toml — Linux and Android only
[target.'cfg(target_os = "linux")']
rustflags = ["-C", "link-arg=-Wl,--build-id"]
```

The command reports whichever setting is missing and exits `10` when it finds no
symbols at all. Use `--dry-run` to see the diagnosis without uploading.

## Unity IL2CPP

An IL2CPP build needs its line-number mapping in addition to the platform's
native symbols (iOS dSYMs, Android ELF):

```bash
bugsee-cli debug-files upload path/to/Symbols/LineNumberMappings.json \
    --type il2cpp-linemap \
    --version 1.2.3 --build 45 \
    --uuid <arm64-build-id>,<armeabi-build-id>
```

The mapping is keyed by the IL2CPP module UUID(s) (`libil2cpp` on Android,
`UnityFramework` on iOS). For a multi-ABI Android build, comma-separate the
values, repeat `--uuid`, or append with `--il2cpp-uuid`. Sibling
`MethodMap.tsv` and `il2cppFileRoot.txt` files are picked up automatically when
they sit next to the JSON.

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
