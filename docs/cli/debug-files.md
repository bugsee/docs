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
| `--uuid <UUID>` | Override the auto-computed debug-id with a caller-supplied UUID. **Required** for `--type elf` (the SDK `BUILD_UUID`; each library is still keyed by GNU build-id). Rejected for `--type dsym`, `pdb`, and `rust`. |
| `--icon <ICON>` | Attach a launcher icon to the symbol zip (entry `icon.<ext>`). |
| `--zstd-level <N>` | Zstd level `9..=22` (default `11`); or pass `--no-zstd`. |
| `--force` | Re-upload even if the server already has the symbol. |
| `--dry-run` | Discover and pack files but skip the HTTP upload. |
| `--concurrency <N>` | *(`--type sourcemaps` only, CLI 0.7.10+)* Ceiling on uploads in flight, `1..=32`. |
| `--allow-empty` | *(`--type sourcemaps` only, CLI 0.7.10+)* Treat "nothing to upload" as success. |
| `--strip-sources-content` | *(`--type sourcemaps` only, CLI 0.7.11+)* Upload each map without its embedded original source. See [Source maps](/cli/sourcemaps/#keeping-your-source-private). |
| `--extension <SUFFIX>` | *(CLI 0.7.12+)* Also pick up files whose name ends in `SUFFIX`, on top of the names the `--type` already knows. See [Extra file suffixes](#extra-file-suffixes). |
| `--il2cpp-uuid <UUID>` | *(`--type il2cpp-linemap` only)* Additional module UUID for a multi-ABI build. |
| `--il2cpp-root <PATH>` | *(`--type il2cpp-linemap` only)* Path to `il2cppFileRoot.txt` when it isn't beside the JSON. |

`--concurrency`, `--allow-empty` and `--strip-sources-content` are **rejected with
exit `20`** for any other `--type`, rather than accepted and ignored — so a caller
who passed `--allow-empty` to keep a build green can't silently still get exit
`10`.

### Extra file suffixes

*(CLI 0.7.12 and newer.)* When a toolchain starts emitting a new file spelling
before the CLI learns it, `--extension` picks it up without waiting for a
release. Repeat the flag or comma-separate values; the leading `.` is optional
(`so.sym` means `.so.sym`):

```bash
bugsee-cli debug-files upload ./libs --type elf --extension so.debug,dbg \
    --version 1.4.0 --build 1400 \
    --uuid 6ba7b811-9dad-11d1-80b4-00c04fd430c8
```

Suffixes **add to** each type's built-in names and match the end of the whole file
name, so multi-part suffixes work. They only widen the *name* match: each type's
content check still applies (an ELF still needs a GNU build-id, a PDB the MSF
container, a dSYM its `DWARF` folder), and stylesheet and type-declaration source
maps are still skipped under the new spelling. An empty, dot-only or path-like
value is a configuration error (exit `20`).

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
    --type elf --version 1.4.0 --build 1400 \
    --uuid 6ba7b811-9dad-11d1-80b4-00c04fd430c8
```

```bash
bugsee-cli debug-files upload ./native-debug-symbols.zip \
    --type elf --version 1.4.0 --build 1400 \
    --uuid 6ba7b811-9dad-11d1-80b4-00c04fd430c8
```

`--uuid` is **required** (exit `20` without it). Pass the SDK's `BUILD_UUID` —
the same value the Gradle plugin writes into the asset channel. It only
correlates logs: each library is still keyed by its **GNU build-id**
(`.note.gnu.build-id`), so an unchanged library is skipped before its bytes
transfer.

ELF symbols are uploaded with a Breakpad transform so native crashes from the
Android NDK (or Linux) symbolicate. A library built **without** a build-id
(or a file that isn't an ELF at all) can't be matched at crash time and is
skipped with a warning; build native libraries with `-Wl,--build-id=sha1` to
ensure they're symbolicated (see
[Native crashes → Symbolication](/sdk/android/issue-detection/native-crashes#symbolication-and-native-debug-symbol-upload)).

### What you can pass

*(Directories: CLI 0.8.0 and newer.)* Pass one or more paths, each either:

- a **directory**, walked recursively for `.so`, `.so.dbg` and `.so.sym` files
  (plus any [`--extension`](#extra-file-suffixes) suffix) — typically the Android
  Gradle plugin's `build/intermediates/merged_native_libs/<variant>`; the
  libraries are read in place, nothing is re-zipped; or
- an AGP `native-debug-symbols.zip`.

You can mix them in one command. When several files share a GNU build-id — across
all the paths you pass — only one is uploaded, preferring the one with DWARF debug
info, then one with a symbol table, then the larger file. The server deduplicates on the
build-id, so switching a library from `SYMBOL_TABLE` (`.so.sym`, function names
only) to `FULL` needs `--force` to replace what it stores; the run tells you when
it skipped full-debug libraries for that reason.

| Situation | Result |
|---|---|
| A directory with no matching libraries | **Exit `10`**, so a mis-wired path can't pass silently (an empty *zip* only warns) |
| A path that does not exist | **Exit `10`** |
| A corrupt zip, or any I/O error while scanning a directory (unreadable subdirectory or library, dangling link) | **Exit `11`**, before anything is uploaded |
| A directory symlink | Not followed; a symlink to a library *file* is read |

:::caution
Libraries are memory-mapped while they are scanned, so the directory must hold
**finished** build output. Don't run the upload while a linker is still writing
into it.
:::

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

The mapping JSON is validated before anything is packed or sent *(CLI 0.8.0 and
newer)*: it must be `cpp_path` → `cs_path` → `{ cpp_line: cs_line }`, with
non-negative integer line numbers (an optional top-level `__debug-id__` entry is
ignored). A truncated, empty or wrong file exits `11` with a message naming the
file and the problem — also in a dry run — instead of uploading a map that can't
symbolicate anything.

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
