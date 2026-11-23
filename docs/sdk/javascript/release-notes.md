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
