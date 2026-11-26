---
title: "Release notes"
description: "Release history for the Bugsee JavaScript SDK (beta): what changed in each 0.1.0 beta release."
sidebar_position: 21
slug: "/sdk/javascript/release-notes"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

Release history for the Bugsee JavaScript SDK. All packages (`@bugsee/bugsee`, the platform packages, the framework adapters, the bundler plugins and the internal packages) are released together and share one version number. See [Packages](/sdk/javascript/packages) for the list.

The npm `latest` and `beta` tags both point at the newest beta, so `npm install @bugsee/bugsee` and `npm install @bugsee/bugsee@beta` install the same version, and the install commands in these docs need no tag. Keep every `@bugsee/*` package you use at the same version.

## 0.1.0-beta.9 (November 26 2026)

Source maps get a safer in-build stamp, an offline doctor and Angular and Next.js integrations, and several reports become more accurate.

**Changes**

- **Debug IDs are stamped inside the build for Vite, Rollup and Rspack.** The stamp now happens before the bundler writes files, as it already did in webpack 5, so Subresource Integrity hashes taken later describe the stamped bytes and a page that pins them keeps loading, with its maps uploaded. List the Bugsee plugin before any SRI plugin. If an in-build stamp is not possible, the plugin falls back to stamping after the files are written. Every stamp is now verified, and a `.map` file is deleted only after a confirmed upload and only when it carries a debug ID. See [Bundler plugins](/sdk/javascript/symbolication/bundler-plugins#where-the-stamp-happens).
- **`bugsee-sourcemaps-doctor`.** A new offline check of a build output folder that tells you why a crash from the build would not symbolicate, with stable check ids, `--json` and `--strict` output, and exit codes 0, 1 and 2. See [Source map doctor](/sdk/javascript/symbolication/doctor).
- **Angular: `ng add`, source-map upload and SRI re-seal.** `ng add @bugsee/angular` launches the SDK, registers the error handler and adds a `build:bugsee` script. The new `bugsee-angular-upload` command stamps, uploads and re-seals the integrity hashes, including import maps and service worker manifests. See [Angular](/sdk/javascript/frameworks/angular#source-maps).
- **Next.js: `withBugsee`.** `@bugsee/nextjs/config` makes `next build` stamp debug IDs and upload source maps on webpack and Turbopack. See [Next.js](/sdk/javascript/frameworks/nextjs#source-maps).
- **Session replay records inline `<svg>`.** Icons and charts were replayed as empty boxes because SVG was blocked with other media. Inline `<svg>` is now recorded by default. `<image>` and `<feImage>` stay blocked. See [Replay privacy](/sdk/javascript/privacy/replay).
- **App version and build are detected from more places.** On Node.js and Bun, the folder of the entry script is searched for a `package.json` when the working directory has none. On Cloudflare and Vercel Edge, the new `bindings` option reads `BUGSEE_APP_VERSION`, `BUGSEE_APP_BUILD` and a `CF_VERSION_METADATA` binding from your Worker's `env`. See [Browser](/sdk/javascript/platforms/browser#app-version-and-build), [Node.js](/sdk/javascript/platforms/node#app-version-and-build) and [Cloudflare](/sdk/javascript/platforms/cloudflare#app-version-and-build).
- **Traces cover the whole capture range.** In a throttled or hidden browser tab, system traces no longer start late or stop early, and a report opened from the report dialog ends where the dialog opened. See [Events and traces](/sdk/javascript/events-and-traces).
- **Failed module loads name the module.** A failed dynamic `import()` in the browser, and a failed module load on Node.js and Bun, produce a report that names the module instead of an error with no usable location. See [Errors and crashes](/sdk/javascript/issue-detection/errors-and-crashes).
- **OpenTelemetry 3.** The optional `@opentelemetry/sdk-trace-base` peer allows 1.x and 2.x, and `@opentelemetry/sdk-trace` (2.9 or newer) covers 3.x. `@bugsee/nextjs` registers its provider only when none is registered yet and works on OpenTelemetry 3. See [OpenTelemetry](/sdk/javascript/opentelemetry).
- **Security fixes.** Hardening for several code-scanning findings: regular expressions that could run for a long time on crafted input, URL host checks, and timers. The Subresource Integrity page scan in the build plugins is now linear, and pages larger than 8 MiB are skipped.
- **Nuxt.** The module's default export carries an explicit type, so the declaration build works against Nuxt 4.6 and later.

## 0.1.0-beta.8 (November 20 2026)

A fix for stack traces of thrown values that are not `Error` objects.

**Changes**

- **Debug IDs on caller-site frames of a thrown non-`Error`.** When your code throws a value that is not an `Error` (a string or a plain object, for example), the frames of the call site now carry the debug IDs of your bundles, so the stack trace resolves against uploaded source maps like any other. See [Symbolication](/sdk/javascript/symbolication/overview).

## 0.1.0-beta.7 (November 19 2026)

**Changes**

- **`launch()` with a missing token no longer throws.** A missing, empty or non-string token returns a disabled client and reports one error through `onError` (or `console.warn` when you gave none). Nothing is captured or uploaded and every method is safe to call. See [Quick start](/sdk/javascript/quick-start#2-get-your-app-token).
- **Bundler plugins read `.env.bugsee-build-plugin`.** The plugins depend on `@bugsee/cli` and read `BUGSEE_APP_TOKEN`, `BUGSEE_APP_VERSION` and `BUGSEE_APP_BUILD` from a `.env.bugsee-build-plugin` file. Real environment variables take precedence. See [Symbolication environment](/sdk/javascript/symbolication/environment).
- **Hang reports carry the blocking stack.** An `AppHang` report on Node.js and Bun includes a `crash.json` with the stack that blocked the event loop. See [Hangs](/sdk/javascript/issue-detection/hangs).
- **Angular builds.** A fix in `@bugsee/rrweb` for Angular's esbuild builder: the inlined replay worker no longer ends with a stray `sourceMappingURL` line that broke the build.

## 0.1.0-beta.1 to 0.1.0-beta.6

The initial public beta line. These releases introduced the SDK across browsers, Node.js, Bun, Electron, Cloudflare Workers, Vercel Edge and Web and Service Workers, with the framework, meta-framework and backend adapters, session replay, performance monitoring, OpenTelemetry interop and the source-map tooling. Changes before beta.7 are not itemized here.

## Compatibility

| | |
| --- | --- |
| Node.js | 18 or later |
| Bun | 1.1.13 or later (tested on 1.3) |
| Module formats | ESM and CommonJS |
| Language level | ES2022 |

Upgrading between betas: update every `@bugsee/*` package together, and check these notes for behavior changes. Notes before beta.7 are not itemized, so if you upgrade from one of those betas, re-test your launch, privacy filters and upload setup. Betas can change between releases.

## Related pages

- [Quick start](/sdk/javascript/quick-start) — add the package, launch the SDK and send a first report.
- [Packages](/sdk/javascript/packages) — which packages to install.
- [FAQ](/sdk/javascript/faq) — practical questions and answers.
