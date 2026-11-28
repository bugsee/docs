---
title: "Symbolication: Dart"
description: "How Dart frames of a Flutter 10.x release build made with --split-debug-info and --obfuscate are sent, how to upload the symbols files, and exactly what is verified."
sidebar_position: 21
slug: "/sdk/flutter/symbolication/dart"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta (`10.0.0-beta.1`, a prerelease on pub.dev) and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

A Dart error from a debug build carries a readable stack. A release build made with `--split-debug-info`, with or without `--obfuscate`, does not: the stack is in the VM's non-symbolic format, and Bugsee needs the symbols file that the build wrote.

## What the SDK sends

With `--split-debug-info` the VM prints a stack as a header (`build_id: '...'` and the snapshot base addresses) followed by one `#NN` line per frame with addresses. The plugin sends that text unchanged, as the stack of the error. It never rewrites it: the backend reads the build ID from the header, looks up the symbols you uploaded for that build, and decodes the frames. A stack longer than 64 KiB is cut at a line boundary, header first.

`--obfuscate` also renames classes. A custom exception type is then named from its message when the message starts with `Name:`, the convention of `Exception.toString`. Otherwise the report shows the obfuscated type name. The stack is symbolicated either way.

## Build with symbols

```sh
flutter build apk --release --obfuscate --split-debug-info=build/symbols
```

`ios` and `appbundle` work the same way. The `build/symbols` folder gets one `.symbols` file per architecture and platform. Keep it, with the rest of the debug files, for every build you ship: the build ID ties a stack to its file. The folder holds your build machine's paths, so do not commit it.

## Upload the symbols

The upload is manual. Nothing in a Flutter build calls the Bugsee uploader, the plugin ships none, and `bugsee-cli` has no Flutter type yet (its `--type elf` is for native libraries).

The script the 9.x plugin used zips the symbols and uploads them to Bugsee. Production acceptance of this upload is not confirmed: see [What is verified](#what-is-verified). The script needs Python 3 with the `requests` package (`python3 -m pip install requests`); without it the command stops with `ModuleNotFoundError` before uploading. Run it after the build, in the project folder, pinned to a fixed commit and checked against its checksum:

```sh
curl -fsSL https://raw.githubusercontent.com/bugsee/bugsee-flutter/9bc0f8645755114491235dc68fec84fdc5671755/scripts/symbols.py -o symbols.py \
  && echo "ef2ed4c25b87da764fd5b70238a41d776f6aa88b5e3174faa4e33de2f08453f7  symbols.py" | shasum -a 256 -c - \
  && ls build/symbols/*.symbols > /dev/null \
  && python3 symbols.py -t <APP_TOKEN> -d build/symbols
```

The `ls` line stops the chain with a non-zero status when `build/symbols` has no `.symbols` file; the script itself exits `0` in that case and uploads nothing. The script also exits `0`, without uploading, when Bugsee refuses the first request (a wrong app token, an HTTP 401 or 500): it prints nothing, so a CI job passes. It exits `1` only when the server answers with an error or the archive transfer fails. After the first upload of a build, check that the symbols appear for the app in the Bugsee dashboard before you rely on the job.

| Option | Meaning |
| --- | --- |
| `-t` | The app token of the platform you built. |
| `-v` | Optional. The app version. Defaults to the `version:` of the `pubspec.yaml` in the folder you run it from. |
| `-d` | The folder you gave to `--split-debug-info`. |
| `-e` | Optional. Defaults to `https://api.bugsee.com/v2/`. |

Use the short options. The script also accepts the long spellings, but it reads only the short ones, so `--token` and `--symdir` are silently ignored and nothing is uploaded.

The script zips the `.symbols` files with a manifest and uploads the archive to Bugsee. Run it for each build you ship, and for each platform.

## What is verified

| Check | State |
| --- | --- |
| Android arm64 release build with the Dart snapshot layout before 3.14 (`--obfuscate`, emulator) | The report's stack decoded to the app's functions and lines with the build's own symbols file. |
| Android arm64 release build, Flutter 3.50 (Dart 3.14) | Decoded by the backend's decoder, **only when the stack's header is stripped first**. With the header, the decoder used by the backend and `flutter symbolize` of Flutter 3.50 both fail. See below. |
| Symbols of another build | Rejected by the offline check: the build ID is not in that file. |
| The symbols file reaching Bugsee through the production upload endpoint | **Not verified.** |
| iOS | **Not verified with a real stack.** A hand-written, header-less stack decoded correctly against the symbols file of a Flutter 3.50 iOS release build. A real iOS stack was not captured, so its header and address fields are unchecked. |
| Flutter 3.41 on a device | **Not verified.** |

### Dart 3.14

Symbols files from Dart 3.14 (Flutter 3.50) hold `_kDartSnapshotText` and no `_kDartIsolateSnapshotInstructions`, the symbol that the header-based decoders of older Dart versions look for. A decoder that reads the header therefore fails on a Dart 3.14 stack, while the same stack decodes once everything above the first `#00` line is removed.

That is what the backend's worker does today, as far as the plugin's tests could read. The decoding works because the header is stripped and the frames carry their virtual address, not because the decoder understands the new layout. If that processing changes, Dart 3.14 stacks can stop decoding. This is the state of the plugin's checks, not a guarantee about the server.

## Related

- [Dart errors](/sdk/flutter/dart-errors) and [Crash and error reporting](/sdk/flutter/manual/crash-error-reporting): how the errors are captured and what is in a report.
- [Symbolication overview](/sdk/flutter/symbolication/overview).
