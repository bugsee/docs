---
title: "Source maps"
description: "Inject deterministic debug IDs into JavaScript bundles and upload the paired source maps to Bugsee with the CLI."
sidebar_position: 4
slug: "/cli/sourcemaps"
---

# Source maps

For JavaScript-based apps (React Native, web), Bugsee symbolicates minified
stack traces using **source maps** keyed by a **debug ID**. The CLI handles this
in two steps:

1. **Inject** a deterministic debug ID into your built bundles and their
   `.map` files.
2. **Upload** the injected maps, keyed by that debug ID.

```bash
# 1. Inject debug IDs into the build output
bugsee-cli sourcemaps inject ./dist

# 2. Upload the injected source maps
bugsee-cli debug-files upload ./dist --type sourcemaps --version 1.4.0 --build 1400
```

## How debug IDs work

`sourcemaps inject` rewrites every `.js` / `.cjs` / `.mjs` file to append:

- a `//# debugId=<uuid>` comment, and
- a small runtime stub that registers the debug ID with
  `globalThis._bugseeDebugIds`,

and rewrites every paired `.map` file to embed the same `debug_id` (plus a
`debugId` alias). The debug ID is a deterministic, content-derived UUIDv5, so
re-running inject on already-injected files is a no-op.

This debug ID is what ties a crashing bundle in production to the right source
map on the server — the runtime stub means the SDK can report the debug ID of
the exact bundle that ran, and the uploaded map carries the matching key.

## `sourcemaps inject`

```bash
bugsee-cli sourcemaps inject <paths>... [--dry-run]
```

| Option | Description |
|---|---|
| `<paths>...` | One or more directories or files to inject (typically your JS dist folder). |
| `--dry-run` | Report what would change without writing. |

Run inject **after** your bundler produces the final bundles and maps, and
**before** uploading. Because injection is idempotent, it's safe to run on every
build.

## Uploading injected maps

```bash
bugsee-cli debug-files upload <paths>... --type sourcemaps --version <v> --build <b>
```

The upload discovers `.map` files and keys each one by its embedded debug ID
(precedence: `debug_id` → `debugId` → legacy `uuid`, or a caller-supplied
`--uuid`), packs them, and uploads through the shared presigned protocol. The
server auto-detects the source-map format by content and re-derives the same
key.

## Relationship to the legacy `bugsee-sourcemaps` tool

The older [`bugsee-sourcemaps`](/tools/sourcemaps/) npm tool generates and
uploads source maps for some SDK versions. The Bugsee CLI's debug-ID-based flow
is the newer mechanism and is the one wired into current SDK build integrations.
Use whichever your SDK's installation guide points you to.
