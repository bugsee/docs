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

:::warning[`inject` only rewrites `.js`, `.cjs` and `.mjs` files]
A bundle with any other extension is skipped **silently**: the run reports
`js_injected=0` and exits `0`, and the problem only surfaces at upload time as a
map with no debug ID. React Native's default `main.jsbundle` output is the
common case — either emit the bundle with a `.js` name, or use the
[`bugsee-sourcemaps`](/tools/sourcemaps/) tool, which handles that naming. Check
the `js_injected` count in the log to confirm injection actually happened.
:::

A bundle that already carries a `//# debugId=` written by **another tool** — for
example Rollup 4 with `output.sourcemapDebugIds` — keeps that ID, since its map
already carries it, and gains only the `globalThis._bugseeDebugIds`
registration, without a second comment. The SDK needs that registration to
attach the debug ID to a crash frame. *(CLI 0.7.9 and newer.)*

## `sourcemaps inject`

```bash
bugsee-cli sourcemaps inject <paths>... [--exclude <glob>] [--allow-sri] [--dry-run]
```

| Option | Description |
|---|---|
| `<paths>...` | One or more directories or files to inject (typically your JS dist folder). |
| `--exclude <GLOB>` | *(CLI 0.7.11+)* Leave matching files alone. Repeatable. |
| `--allow-sri` | *(CLI 0.7.11+)* Proceed even though the build pins its own script hashes — see [Subresource Integrity](#subresource-integrity). |
| `--dry-run` | Report what would change without writing. |

Run inject **after** your bundler produces the final bundles and maps, and
**before** uploading. Because injection is idempotent, it's safe to run on every
build.

### Leaving files alone

*(CLI 0.7.11 and newer.)* A stock `next build` with browser source maps has dozens
of JavaScript files, and a Nuxt `.output/server/node_modules` holds vendored
`.mjs` files you don't want stamped. `--exclude` keeps `inject` out of them:

```bash
bugsee-cli sourcemaps inject ./dist --exclude '**/node_modules/**' --exclude 'dist/vendor/**'
```

The pattern is matched against the absolute path, the path relative to the
current directory and the path relative to each root you pass, so
`dist/vendor/**`, `vendor/**` and an absolute path all work whether you wrote the
root as `dist`, `./dist` or an absolute path. `*` crosses `/`, so `*.js` also
matches `vendor/v.js` — anchor with a leading `/` or a directory prefix to avoid
that. An empty or unparseable pattern is a configuration error (exit `20`), never
a silent "matches nothing" that would rewrite the files you meant to protect.

### Subresource Integrity

*(CLI 0.7.11 and newer.)* Injecting appends bytes to every `.js` file, so a hash
your HTML already pins with `integrity="…"` stops matching and the browser
refuses to run the script: the page loads and **nothing executes**. That is worse
than having no debug IDs, so `inject` refuses a build that pins its own hashes and
exits `20`.

It detects `integrity` on `<script>` and on `<link rel="modulepreload">` /
`rel="preload"` in any `.html`, `.htm` or `.xhtml` under the paths you give it
(plus any directly in a path's parent, the usual `dist/index.html` beside
`dist/assets/*.js` layout). URLs are resolved literally first and then by file
name, so a CDN `publicPath` still resolves to the local bytes it names. It only
refuses over a file this run would really **rewrite**, so re-running `inject` on
an already-stamped build stays a no-op, and `--dry-run` refuses too.

If your build recomputes its hashes after this step, pass `--allow-sri`. `inject`
cannot see integrity that never reaches the emitted HTML — a manifest read by a
server template, or a page rendered at request time (such as Next.js
`experimental.sri`) — so check those yourself.

### Failure behaviour

*(CLI 0.8.0 and newer.)* `inject` edits files in place, so permissions, symlinks
and hard links are kept. A map that can't take the debug ID — not a JSON object,
invalid JSON, or read-only — is refused **before** the bundle is touched, so a
failed run never leaves a bundle stamped with an ID its map didn't receive.

## Uploading injected maps

```bash
bugsee-cli debug-files upload <paths>... --type sourcemaps --version <v> --build <b>
```

The upload discovers `.map` files and keys each one by its embedded debug ID
(precedence: `debug_id` → `debugId` → legacy `uuid`, or a caller-supplied
`--uuid`), packs them, and uploads through the shared presigned protocol. The
server auto-detects the source-map format by content and re-derives the same
key.

A map the server already has is skipped and the batch continues, so rebuilding
an app with unchanged chunks uploads only the ones that changed. `--force`
re-uploads anyway.

### Keeping your source private

*(CLI 0.7.11 and newer.)* A map's `sourcesContent` carries your original source
verbatim — it is what lets a symbolicated crash show source lines. If you'd rather
it didn't leave the build machine, strip it from what is uploaded:

```bash
bugsee-cli debug-files upload ./dist --type sourcemaps \
    --version 1.4.0 --build 1400 --strip-sources-content
```

File, line and column resolution keep working; only the source snippet is lost.
The map on disk is **never modified** — only the uploaded copy — and the declared
hash describes the stripped bytes. Indexed maps are stripped too, including their
nested sections. A map with no `sourcesContent` is uploaded unchanged. If a map
can't be processed, the upload carries on with the original and **logs a warning
that it went out unstripped** (CLI 0.8.0+), so check your logs if the privacy
setting matters. The option is only valid with `--type sourcemaps` (exit `20`
otherwise).

### What fails, and when

Directory scans are processed in sorted order, and every map is identified
**before** anything is uploaded — so these failures don't leave a partial upload
behind (a network or server error part-way through still can).

| Situation | Result |
|---|---|
| A map named as a stylesheet or type declaration (`.css.map`, `.d.ts.map`, `.d.mts.map`, `.d.cts.map`) in a scanned directory | Skipped without being read |
| Any other map with no debug ID | **Exit `11`** — `inject` never stamped that bundle |
| A path that does not exist | **Exit `10`**, even when other paths hold maps |
| Nothing found to upload | **Exit `10`**, unless `--allow-empty` |
| One upload fails | The rest of the batch is cancelled |

With `--dry-run`, a map without a debug ID is reported and counted instead of
failing the run (CLI 0.7.11+), so the preview works on a freshly built directory
that `inject --dry-run` hasn't stamped. A real run still exits `11`.

`--allow-empty` (CLI 0.7.10+) turns "nothing to upload" into success. A monorepo
package built without maps, or a framework whose server output has none, is a
legitimate no-op rather than a reason to fail the build. A path that does not
exist is still an error, so a typo'd output directory isn't swallowed by the
flag.

### Concurrency

*(CLI 0.7.10 and newer.)* Each map is an independent register + `PUT` pair, so a
web build with one map per chunk used to spend its upload time waiting on
round-trips. Maps now upload several at a time.

```bash
bugsee-cli debug-files upload ./dist --type sourcemaps \
    --version 1.4.0 --build 1400 --concurrency 8
```

`--concurrency N` (`1..=32`) is a **ceiling**, not a fixed width — no more
uploads run than there are maps. Left unset it scales with the batch: one upload
per 8 maps, at least 4, at most 8. That default is deliberately modest, because
the machine that suffers most from serial uploads is a CI box on a thin uplink,
where the transfer is bandwidth-bound and extra streams only add latency. Raise
it if you've measured your own link.

`--concurrency 1` restores strictly sequential uploads. An explicit `--uuid`
forces sequential uploads whatever the ceiling says: it keys every map in the
scan under one ID, and those registrations must not race each other.

## Relationship to the legacy `bugsee-sourcemaps` tool

The older [`bugsee-sourcemaps`](/tools/sourcemaps/) npm tool generates and
uploads source maps for some SDK versions. The Bugsee CLI's debug-ID-based flow
is the newer mechanism and is the one wired into current SDK build integrations.
Use whichever your SDK's installation guide points you to.
