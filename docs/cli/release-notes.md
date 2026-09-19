---
title: "Release notes"
description: "Release history for the Bugsee CLI (bugsee-cli), listing new commands, behaviour changes, and fixes for each version."
sidebar_position: 11
slug: "/cli/release-notes"
---

# Release notes

Release history for the Bugsee CLI (`bugsee-cli`). To install or upgrade, see
[Installation](/cli/installation/) and [Updating the CLI](/cli/update/). The
Android Gradle plugin and the iOS build scripts keep the CLI they manage up to
date for you.

## 0.7.x

### 0.7.10 (September 18 2026)

Source maps upload several at a time, an empty build can be a no-op, and a path
you named but the tool can't find now stops the run.

- **Source-map uploads run concurrently.** `debug-files upload --type sourcemaps`
  sent one map at a time, so a web build with one map per chunk spent most of its
  upload time waiting on round-trips. Against a server with 50 ms of latency, 60
  maps went from 7.1 s to 1.3 s and 200 maps from 23.6 s to 4.1 s.

  `--concurrency <N>` (`1..=32`) sets a ceiling; left unset it scales with the
  batch — one upload per 8 maps, at least 4, at most 8. `--concurrency 1`
  restores the previous sequential behaviour. An explicit `--uuid` forces
  sequential uploads whatever the ceiling, because it keys every map under one
  ID and those registrations must not race. See
  [Source maps](/cli/sourcemaps/#concurrency).

- **`--allow-empty` makes "nothing to upload" a success.** A monorepo package
  built without maps, or a framework whose server output has none, previously
  failed the caller's build with exit `10`. The flag applies to
  `--type sourcemaps`; `xcode upload-dsyms` already treated nothing-to-upload as
  success.

- **A path that does not exist is now an error.**
  `debug-files upload --type sourcemaps dist/ missing/` used to warn about
  `missing/`, upload what it found under `dist/`, and exit `0`. It now exits `10`
  with `path does not exist: …` before uploading anything — a path you named and
  the tool can't find is a typo or a build that didn't run, and half-uploading a
  build's symbols hides that until a crash is unsymbolicated. Drop the missing
  path from the invocation if you relied on the old leniency. The bundler plugins
  pass a single output directory and are unaffected.

- **A failed upload stops the batch.** Now that uploads are concurrent, the first
  failure cancels the rest instead of letting every remaining map pack, register
  and transfer into a server that has already refused one — a rejected token on a
  200-chunk build was 400 doomed round-trips.

- **`--concurrency` and `--allow-empty` are rejected for other `--type`s**
  (exit `20`) rather than accepted and ignored, so a caller who passed
  `--allow-empty` to keep a build green can't still get exit `10`.

- **A throttled request is retried.** The symbol-metadata and build-registration
  `POST`s are sent without status retries, because a 5xx may mean the server
  processed the request and only the response was lost. A `429` carries no such
  ambiguity — the request was rejected without being processed — so it is now
  retried with the usual backoff. Those requests are also the first thing a
  server throttles when several uploads run at once.

### 0.7.9 (September 17 2026)

- **`sourcemaps inject` registers a debug ID another tool already wrote.** A
  bundle carrying its own `//# debugId=` — Rollup 4 writes one with
  `output.sourcemapDebugIds` — counted as already injected, so it never got the
  `globalThis._bugseeDebugIds` runtime registration and the SDK could not attach
  its debug ID to a crash frame. Such a bundle now keeps its ID, since its map
  already carries it, and gains only the registration, without a second comment.
  It is still never re-keyed. See [Source maps](/cli/sourcemaps/).

### 0.7.8 (September 17 2026)

Re-uploading a symbol the server already has no longer fails, including in an
Xcode build phase, and source-map uploads handle stylesheet maps and rebuilt
bundles correctly.

- **Symbols the server already has are skipped instead of failing.** A re-upload
  of a symbol already on the server failed with exit code `30`. It is now
  reported as already existing and exits `0`, as the
  [exit-code contract](/cli/exit-codes/) describes. When you uploaded a
  directory, that failure also stopped the run, so the files that had changed
  were never uploaded — for example, on the second production build of a web app
  with one unchanged chunk. This applies to dSYM, PDB, Rust, IL2CPP line map,
  source map, ProGuard and ELF uploads.

- **`xcode upload-dsyms` no longer fails your Xcode build on rebuilds.** A
  rebuild whose dSYMs were unchanged failed the build because of the issue
  above. Similarly, `xcode post-action` now reports `dsym_uploaded: true` in its
  JSON result when every dSYM was already on the server, instead of `false`.

- **Stylesheet and type-declaration source maps are skipped.** When
  `debug-files upload --type sourcemaps` scans a directory, maps named
  `.css.map`, `.d.ts.map`, `.d.mts.map` or `.d.cts.map` are skipped without being
  read. Previously they made the whole upload fail with exit code `11`. Any other
  map without a debug ID still fails the run, but now before anything is
  uploaded, so it no longer leaves a partial upload behind (a network or server
  error part-way through still can). A map you name explicitly on the command
  line, and a scan that leaves nothing to upload, also still fail.

- **`sourcemaps inject` derives a bundle's debug ID from its source map as well
  as the bundle itself.** The server keeps one source map per debug ID, and a
  minifier often produces identical JavaScript for a source edit that only moves
  lines — so an ID based on the bundle alone kept the stale map on the server.
  This includes webpack 5 rebuilds with `[contenthash]` filenames, which leave
  the already-injected bundle on disk and write only a new map: `inject` now
  gives such a bundle a new ID when its map comes back without a debug ID and
  with different content. A `//# debugId=` comment written by another tool is
  never changed, and a bundle without a source map keeps its bundle-only ID.
  When a newly injected bundle sits beside a map that already carries a
  different ID, the map is updated to the bundle's ID with a warning. See
  [Source maps](/cli/sourcemaps/).

  :::note
  After you upgrade, every bundle that has a source map gets a new debug ID
  once, so its map is uploaded again. Nothing else needs to change.
  :::

- **`--force` now applies to source maps.** `debug-files upload --type sourcemaps
  --force` asks the server to replace a map it already has, as `--force` already
  did for dSYM, PDB, Rust and IL2CPP line map uploads.

### 0.7.7 (September 16 2026)

Adds a dSYM upload command for Xcode build phases and prebuilt binaries for
Windows on ARM64.

- **New command: `xcode upload-dsyms`.** Uploads dSYMs from an Xcode Run Script
  build phase. It does not register a build or upload build info, and none of
  the `BUGSEE_BUILD_INFO_*` gating applies, so it is safe to run on every build.
  It is designed for setups such as React Native and Flutter, where a config
  plugin can add a build phase rather than a scheme post-action.
  - A real failure **fails the build**: a missing, empty or rejected app token
    (`20`/`21`), a server or network error (`30`/`31`), or a dSYM folder or bundle
    that could not be read (`10`/`11`). Finding nothing to upload — no dSYM
    folder, or no `.dSYM` bundles in it — is a success; finding bundles and
    uploading none is not.
  - Failing the build and running in the background are controlled
    independently: `--fail` / `--no-fail` (environment variable
    `BUGSEE_DSYM_UPLOAD_NO_FAIL`) and `--background` / `--no-background`
    (`BUGSEE_DSYM_UPLOAD_BACKGROUND`). A flag overrides its environment variable.
  - The default is to fail on error and upload synchronously. `--no-fail` on its
    own also moves the upload to the background unless you pass
    `--no-background`. `--no-fail --no-background` is usually what CI wants: the
    build never breaks, but it still waits, so a runner tearing down its
    processes cannot kill the upload mid-flight.
  - Asking to fail the build *and* run in the background is refused, because a
    background process's exit code reaches nobody: exit `2` when set with flags,
    `20` when set through environment variables.
  - `xcode post-action` is unchanged: `BUGSEE_BUILD_INFO_ENABLED=0` still
    disables its dSYM upload.

- **Windows on ARM64.** Prebuilt binaries are now published for
  `aarch64-pc-windows-msvc`, with the matching npm package
  `@bugsee/cli-win32-arm64`. The PowerShell install script detects ARM64
  hosts, including when run from 32-bit PowerShell, and `bugsee-cli update`
  works on Windows ARM64.

- **Fixes a crash caused by a non-UTF-8 environment variable.** `vcs-metadata`,
  `build-env machine-label` and `xcode post-action` crashed with exit code `101`
  — outside the documented [exit codes](/cli/exit-codes/) — when any variable in
  the environment had a name or value that was not valid UTF-8, even one the CLI
  does not read.

### 0.7.6 (September 16 2026)

A packaging and security release. Commands, exit codes, JSON output and the
upload format are unchanged from 0.7.5.

- **New npm package: `@bugsee/cli`.** The binary ships in per-platform packages
  (`@bugsee/cli-darwin-arm64`, `@bugsee/cli-darwin-x64`,
  `@bugsee/cli-linux-arm64`, `@bugsee/cli-linux-x64`, `@bugsee/cli-win32-x64`),
  declared as optional dependencies pinned to the same version. npm installs
  only the one for your platform, and nothing runs at install time, so it works
  with `--ignore-scripts`. If no platform package resolves, a `postinstall` step
  downloads the binary from the GitHub release instead, and never fails the
  install. `@bugsee/bugsee-cli` is unchanged and keeps working. A Windows ARM64
  package followed in 0.7.7.

- **Releases now reach `download.bugsee.com` automatically.** The install
  scripts and `bugsee-cli update` download from there. 0.7.4 had not been
  published there, so neither offered that version.

- **Security:** updates the TLS library used for every upload (`rustls`
  0.23.45) to fix
  [RUSTSEC-2026-0285](https://rustsec.org/advisories/RUSTSEC-2026-0285), where
  TLS 1.3 handshake messages were accepted across encryption level boundaries.

- **Fixes a crash in `build-env read-plist`** on binary plist files
  containing out-of-range dates.

### 0.7.5 (August 24 2026)

A security maintenance release with no functional changes: commands, exit
codes, JSON output and the upload format are identical to 0.7.4.

- **Security:** fixes two denial-of-service issues in XML parsing,
  [RUSTSEC-2026-0194](https://rustsec.org/advisories/RUSTSEC-2026-0194) and
  [RUSTSEC-2026-0195](https://rustsec.org/advisories/RUSTSEC-2026-0195), which
  were reachable when `build-env read-plist` parses an XML `Info.plist`.

- Other dependency updates, with no change in behaviour.

### 0.7.4 (August 11 2026)

Adds symbol uploads for Unity IL2CPP line-number mappings and for Rust projects.

- **New upload type: `debug-files upload --type il2cpp-linemap`.** Uploads Unity
  IL2CPP `LineNumberMappings.json` together with its sibling `MethodMap.tsv` and
  `il2cppFileRoot.txt`, keyed by the `libil2cpp` / `UnityFramework` module UUIDs.
  Pass the UUIDs with `--uuid` (repeat it or comma-separate the values), or
  append more with `--il2cpp-uuid`.

- **New upload type: `debug-files upload --type rust`.** One command for a Cargo
  project, whatever target it built for. It finds whichever debug format is
  present — a `.dSYM` (Apple), a `.pdb` (Windows MSVC targets), or the ELF
  binary itself, keyed by its GNU build ID (Linux and Android) — and uploads each
  one.
  - Formats are detected from file contents rather than the host OS, so a
    cross-compiled `target/<triple>/release` uploads correctly from any machine.
  - Cargo intermediates (`deps/`, `build/`, `incremental/`, `.fingerprint/`) are
    skipped.
  - `--uuid` is rejected: every Rust debug format carries its own identity.

- **Build-configuration checks for Rust.** Some Cargo settings produce an upload
  that is accepted but then symbolicates nothing: no debug info (`debug = 0`), no
  `.dSYM` (`split-debuginfo` not set to `"packed"`), or no build ID (missing
  `-Wl,--build-id`). The CLI warns about these with the exact setting that fixes
  them, and when it finds nothing uploadable it fails with the full recipe
  instead of a bare "not found".

See [Uploading debug information files](/cli/debug-files/).

### 0.7.3 (July 16 2026)

A security fix for credentials appearing in logs, plus hardening of `update` and
`sourcemaps inject`.

- **Security: the app token and upload signatures no longer appear in logs.** A
  network error message included the full request URL at the default log level,
  exposing the app token and the signature of the storage upload URL — including
  in the `xcode post-action` background log file. URLs are now removed from error
  messages and redacted in debug logs.

- **`bugsee-cli update` is stricter about what it downloads.** It refuses a
  non-HTTPS download base (`BUGSEE_CLI_UPDATE_BASE_URL`) other than a loopback
  address, limits download sizes (512 MiB for the release archive, 1 MiB for
  metadata) before the SHA-256 check, and rejects archives containing absolute or
  `..` paths. See [Updating the CLI](/cli/update/).

- **`sourcemaps inject` only follows a `//# sourceMappingURL=` inside the
  bundle's directory.** A URL with a `..` component or an absolute path is no
  longer followed; a `<bundle>.map` file next to the bundle is still used.

- **Fixes a possible file collision during native symbol uploads** when two
  libraries uploaded at the same time share a build ID.

### 0.7.2 (July 11 2026)

- A maintenance update to the library the CLI uses to read debug files. The
  identifiers it reads from ELF and Mach-O files are unchanged.

### 0.7.1 (July 6 2026)

- A maintenance update to the library the CLI uses to read debug files. The
  identifiers it reads from ELF and Mach-O files are unchanged.

### 0.7.0 (June 25 2026)

Adds self-hosted install scripts and uploads native symbols per library.

- **New install scripts on `download.bugsee.com`.** `install.sh` (macOS and
  Linux) and `install.ps1` (Windows PowerShell) resolve the latest version,
  download the binary for your host from `download.bugsee.com` with no GitHub
  dependency, verify its SHA-256 checksum, and install it. Override the version,
  install directory and download location with `BUGSEE_CLI_VERSION`,
  `BUGSEE_CLI_INSTALL_DIR` and `BUGSEE_CLI_BASE_URL`. See
  [Installation](/cli/installation/).

- **Native symbols are uploaded per library.** `debug-files upload --type elf`
  now uploads each `.so` as its own symbol, keyed by the library's GNU build ID
  instead of the build-level `--uuid`. Native symbols therefore no longer collide
  with the ProGuard mapping for the same build, and an unchanged library is
  skipped before its bytes are transferred. A `.so` built without
  `-Wl,--build-id` cannot be matched at crash time, so it is skipped with a
  warning. See [Native (ELF)](/cli/debug-files/#native-elf).

- **Fixes `upload build-info` failing with HTTP 403.** The storage upload was
  rejected with `SignatureDoesNotMatch`. See
  [`upload build-info`](/cli/builds/#upload-build-info).
