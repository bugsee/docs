---
title: "User & session data"
description: "Attach a user identifier and custom attributes to every report with the Bugsee JavaScript SDK: setUserIdentifier, setAttribute, accepted value types, persistence in the browser, and privacy."
sidebar_position: 24
slug: "/sdk/javascript/user-session-data"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

A **user identifier** and **attributes** describe who hit a problem and in what state the app was. Both are attached to every report.

The examples use the client returned by `launch`, kept in a module of your own:

```ts title="bugsee.ts"
import { launch } from '@bugsee/bugsee';

export const bugsee = await launch('<your_app_token>');
```

Capture covers only what runs after `launch()`, and code that runs earlier is not recorded. Top-level `await` delays only the modules that import this one: an unrelated app module that your entry file imports next can still run while `launch()` is pending. Either import this module from every app module that needs the client or capture, or have the entry file load the app after launch settles, with `import './bugsee'; await import('./app');`.

## User identifier

```ts
import { bugsee } from './bugsee';

// After sign-in
bugsee.setUserIdentifier('user-4821');

const current: string | null = bugsee.getUserIdentifier();

// At sign-out
bugsee.clearUserIdentifier();
```

| Method | Description |
| --- | --- |
| `setUserIdentifier(id: string)` | Set the identifier. A value that is not a string clears it. |
| `getUserIdentifier()` | The current identifier, or `null`. |
| `clearUserIdentifier()` | Remove it. Reports created afterwards carry none. |

On a server, `setUserIdentifier` writes the process-wide identifier, so two concurrent requests that each call it can overwrite one another. In server code, attach the user through the request context instead, with the framework adapter's `user` option (the context's user takes precedence for reports created in that request); see the [Backend overview](/sdk/javascript/backend/overview). The global call is for single-user or client runtimes.

The identifier is sent as the reporter's email on a report, unless the report has its own `email`. Use an id that is meaningful to your team. Prefer an opaque id to an email address, because the identifier is personal data.

The report dialog's email field is the same value: what the user types there is saved as the identifier.

### Persistence in the browser

By default the identifier lives in memory only and a page reload loses it. Set `persistUserIdentifier: true` in the browser to keep it in `localStorage` (one entry per app token) and restore it on the next page load, before any report.

```ts
import { launch } from '@bugsee/bugsee';

export const bugsee = await launch('<your_app_token>', {
  persistUserIdentifier: true,
});
```

This is off by default for a reason: the identifier is often an email address, and a browser can be shared, so the next person to open the page would be reported as the previous user. Enable it only for an app whose users sign in on their own device, and call `clearUserIdentifier()` on logout. While the option is off, nothing is written, and a value left by an earlier launch that turned it on is removed at launch.

On Node.js, Bun and the other server runtimes the identifier is kept in memory.

## Attributes

Attributes are key and value pairs that describe the session: plan, locale, feature flags, tenant.

```ts
import { bugsee } from './bugsee';

bugsee.setAttribute('plan', 'pro');
bugsee.setAttribute('seats', 12);
bugsee.setAttribute('betaUser', true);
bugsee.setAttribute('flags', ['new-checkout', 'dark-mode']);

const plan = bugsee.getAttribute('plan'); // 'pro'
const all = bugsee.getAllAttributes(); // Record<string, AttributeValue>

bugsee.clearAttribute('seats');
bugsee.clearAllAttributes();
```

| Method | Description |
| --- | --- |
| `setAttribute(key, value)` | Set or replace an attribute. |
| `getAttribute(key)` | The value, or `undefined`. |
| `getAllAttributes()` | A copy of all attributes. |
| `clearAttribute(key)` | Remove one. |
| `clearAllAttributes()` | Remove all. |

A value is an `AttributeValue`: `string | number | boolean | string[]`. The type is exported by `@bugsee/bugsee`.

Attributes live in memory. They are not persisted across page loads or process restarts, so set them again at startup, after you know the user.

### What a report carries

A report carries the identifier and the attributes as they were **when the report was created**. Changing an attribute later does not rewrite a report that was already created. In a server request that runs inside a [request context](/sdk/javascript/backend/overview), the context's user and attributes take precedence over the global ones for reports created in that request.

## Privacy

Everything you set here is uploaded with each report. Do not store passwords, tokens or other secrets in an attribute. Prefer opaque ids to names and email addresses. See [Privacy: Report](/sdk/javascript/privacy/report) for the full picture, and [Privacy: Cleanup](/sdk/javascript/privacy/cleanup) for sign-out.

## Related pages

- [Report handler](/sdk/javascript/report-handler) — add labels or change a report before it is sent.
- [Bug reporting](/sdk/javascript/manual/bug-reporting) — the report dialog and `upload`.
- [Privacy: Report](/sdk/javascript/privacy/report) — what a report carries.
- [Backend overview](/sdk/javascript/backend/overview) — request context and per-request users.
