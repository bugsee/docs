---
title: "FAQ"
description: "Practical questions and answers about the Bugsee JavaScript SDK (beta): runtimes, packages, tokens, privacy defaults, errors that are not reported and known beta behavior."
sidebar_position: 22
slug: "/sdk/javascript/faq"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

**1. Which runtimes does the SDK support?**

Browsers, Node.js 18 or later, and Bun 1.1.13 or later are the main targets. Electron, Cloudflare Workers, Vercel Edge, and Web and Service Workers are supported through their own packages. Deno is not supported. See [Overview](/sdk/javascript/overview#requirements).

<br />

**2. Which package do I install?**

For a browser app or a Node.js server, `@bugsee/bugsee`. For Bun, Electron, Cloudflare, Vercel Edge and workers, the package named for the runtime. Frameworks use their adapter package alone, which includes `@bugsee/bugsee`. The table in [Quick start](/sdk/javascript/quick-start#1-add-the-package) lists them all, and [Packages](/sdk/javascript/packages) explains the rest.

<br />

**3. Should I install `@bugsee/browser`, `@bugsee/node` or `@bugsee/core`?**

No. Those are the building blocks the umbrella and the other packages are made from. Their APIs can change without notice. Install `@bugsee/bugsee` or the package for your runtime.

<br />

**4. Is there an SDK for React Native, or for web content inside a native app?**

React Native has its own SDK; see the [React Native documentation](/sdk/react_native/overview). Web content shown in a native WebView is covered by the native Bugsee SDKs.

<br />

**5. What do the npm `latest` and `beta` tags mean?**

For now both point at the current beta, so the install commands in these docs need no tag. Add `@beta` yourself if you want to keep following betas once a stable release exists, and keep all `@bugsee/*` packages at the same version. See [Release notes](/sdk/javascript/release-notes).

<br />

**6. `launch()` does not throw, but nothing is captured.**

A missing, empty or non-string token returns a disabled client and reports one message through `onError` (or `console.warn` when you gave none). Check that the token reaches your code at runtime; an environment variable that is not set, or that your bundler does not expose to browser code, is the usual cause. See [Quick start](/sdk/javascript/quick-start#troubleshooting).

<br />

**7. Why does `launch()` return a `Promise` in the browser but not on Node.js?**

In the browser the launch is asynchronous, because part of the SDK (session replay) is loaded on demand. Servers, edge runtimes and workers return the client directly. Await the browser result only when you need the client right away; capture starts either way. See [Lifecycle & status](/sdk/javascript/lifecycle#launch).

<br />

**8. I called `launch()` twice and my second options were ignored.**

Bugsee is a per-process singleton. A second call returns the existing client and reports the repeat through `onError`. Use `relaunch(options)` to restart with new options; it starts from defaults, not from your previous options. See [Lifecycle & status](/sdk/javascript/lifecycle#relaunch).

<br />

**9. What is captured by default, and is it safe for personal data?**

Console logs, network requests (with request and response bodies), breadcrumbs, system traces and events, and in the browser a DOM replay and interactions. Replay masks all text and inputs and blocks media by default. Network URLs, headers and bodies pass through a built-in redaction (sensitive headers and keys, and secret-looking values). Redaction is a safety net, not a guarantee: review what your app sends, and use the filters. See [Privacy](/sdk/javascript/privacy/overview).

<br />

**10. I set a network filter and sensitive data showed up.**

A network filter you set with `setNetworkEventFilter` replaces the default redaction instead of adding to it. Compose your filter with the default one by calling `getDefaultNetworkSanitizer()` inside it. See [Privacy: Network](/sdk/javascript/privacy/network).

<br />

**11. Breadcrumbs are on although the mobile SDKs default them to off.**

Yes. In JavaScript, `captureBreadcrumbs` defaults to `true`, because UI interactions are a core signal on the web. Set `captureBreadcrumbs: false` to turn them off. See [Breadcrumbs](/sdk/javascript/breadcrumbs).

<br />

**12. An error in my framework is not reported.**

Many frameworks catch errors before they reach the global handler, so the SDK never sees them. Add the adapter for your framework: React needs its error boundary, Vue needs `installBugseeErrorHandler` in production, Angular needs `BugseeErrorHandler`, and backend frameworks need their adapter's error hook. On the backend, 4xx errors are skipped by default. See [Frameworks](/sdk/javascript/frameworks/react) and [Backend overview](/sdk/javascript/backend/overview).

<br />

**13. My Node.js process exits after an uncaught exception. Is that the SDK?**

The SDK flushes the crash report first, then exits with code 1, as Node.js would. That is `exitOnUncaught: true`, the default. Unhandled rejections follow `unhandledRejections`: the default `'preserve'` captures them and then reproduces Node.js's own outcome. See [Configuration](/sdk/javascript/configuration#process-and-capture-buffer).

<br />

**14. A short script finishes before its report is uploaded.**

Await `bugsee.flush()` or `bugsee.stop()` before exiting. A long-running server does not need to. See [Lifecycle & status](/sdk/javascript/lifecycle#flush-and-stop).

<br />

**15. Where does the SDK write data on a server, and what if the filesystem is read-only or ephemeral?**

By default on Node.js and Bun the SDK keeps its rolling capture buffer and report queue on disk under `<os tmpdir>/bugsee`, so a crash or kill still delivers its recording on the next launch. Set `dataDir` to move it. On a read-only or throwaway filesystem, set `capturedDataStore: 'memory'`, which gives up durable capture and recovery. See [Configuration](/sdk/javascript/configuration#process-and-capture-buffer).

<br />

**16. Why is `captureLocalVariables` or `captureSourceContext` off?**

Both are opt-in by design. Local variables cost steady overhead and can contain personal data, and source context uploads your source code. `captureLocalVariables` does not work on Bun at all. See [Diagnostics](/sdk/javascript/issue-detection/diagnostics).

<br />

**17. My stack traces are minified.**

Upload source maps for each release, with the same version and build you pass to `launch()`. The Vite and webpack plugins do it at build time; other build tools use `bugsee-cli`. Angular needs the CLI step. See [Symbolication](/sdk/javascript/symbolication/overview).

<br />

**18. Reports show version `0.0.0`.**

The SDK could not detect your app version. Pass `appVersion` to `launch()`, set `BUGSEE_APP_VERSION`, or give your `package.json` a version. See [Quick start](/sdk/javascript/quick-start#app-version-and-build).

<br />

**19. Does `RelaunchedAfterCrash` always mean a crash?**

No. It is a hint based on evidence left on storage. It can report a crash that did not happen, and miss one that did. See [Lifecycle & status](/sdk/javascript/lifecycle#lifecycle-events).

<br />

**20. `logException` seems to send fewer reports than I call it.**

Identical errors are deduplicated, and `logException` is rate-limited to 100 reports per 60 seconds. Errors are not sampled; only performance transactions have a sample rate (`performanceSampleRate`). See [Crash & error reporting](/sdk/javascript/manual/crash-error-reporting).

<br />

**21. Which bundlers are supported for source maps?**

Vite and webpack have dedicated plugins and are the best exercised. Rollup, esbuild and Rspack use the shared plugin engine and are less exercised. Other tools can use `bugsee-cli` directly. See [Bundler plugins](/sdk/javascript/symbolication/bundler-plugins).

<br />

**22. Is the SDK stable?**

It is in beta. APIs, options and defaults can change between betas, and the internal packages carry no stability promise at all. Read the [release notes](/sdk/javascript/release-notes) before updating.
