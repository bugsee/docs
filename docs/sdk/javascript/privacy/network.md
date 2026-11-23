---
title: "Privacy: Network"
description: "How to keep sensitive data out of the network events the Bugsee JavaScript SDK records: capture and body options, the built-in redaction, and a setNetworkEventFilter that composes with getDefaultNetworkSanitizer."
sidebar_position: 5
slug: "/sdk/javascript/privacy/network"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

Network events carry URLs, headers and bodies, which can hold tokens, personal data and payment details. Unlike logs and breadcrumbs, the SDK redacts network events for you by default. See [Network events](/sdk/javascript/network) for how capture works. This page covers the controls.

## Network options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `captureNetwork` | `boolean` | `true` | Record network traffic. `false` records none. |
| `captureNetworkBodies` | `boolean` | `true` | Record request and response bodies. `false` keeps headers and URLs only. |
| `maxNetworkBodySize` | `number` | `20480` | Largest body kept, in bytes. Larger bodies are dropped. |
| `captureNetworkBodyWithoutType` | `boolean` | `false` | Keep bodies with no `Content-Type`. Leave it off to drop them. |
| `captureNetworkDefaultSanitizer` | `boolean` | `true` | Apply the built-in redaction. `false` records events as they are. |

```ts
import { launch } from '@bugsee/bugsee';

await launch('<your_app_token>', {
  captureNetworkBodies: false, // never record bodies
});
```

Turning bodies off is the strongest control for payloads. A malformed boolean for a capture option turns it **off** and is reported through the `onError` launch option.

## What the built-in redaction does

With `captureNetworkDefaultSanitizer` on, every event is redacted before it is stored. The marker is `<redacted>`.

| Part | What is redacted |
| --- | --- |
| Headers | Sensitive header values, matched by exact name, case-insensitive: `authorization`, `proxy-authorization`, `cookie`, `set-cookie`, `x-api-key`, `x-auth-token`, `x-csrf-token`, `x-forwarded-for`, `x-real-ip` and a list of cloud and vendor token headers. Other header values get the secret-shape pass. |
| URL | Values of sensitive query and fragment parameters, `;` path parameters such as `;jsessionid=`, and the password in `user:password@host`. |
| Error text | URLs and secrets quoted in the message of a failed request. |
| JSON, form, multipart, XML and `key: value` bodies | The value of every sensitive key. Keys match by case-insensitive substring, ignoring `-`, `_`, `.` and spaces. |
| Secret shapes | JSON Web Tokens and well-known provider secrets, in any value, under any key name. |

Sensitive key substrings include `password`, `secret`, `token`, `auth`, `api_key`, `credit_card`, `cvv`, `ssn`, `iban` and `jwt`. The match is intentionally broad, so a key such as `author` is redacted too.

What it does **not** do:

- It does not redact card numbers in free text. A card field is redacted by its key name only.
- It does not recognize sensitive data in a field with an innocent key name, for example a name or an address under `value`. Use a filter for those.

## Redact with a filter

`setNetworkEventFilter` sees every event before it is recorded. Return the event to keep it, or `null` to drop it.

:::caution
Installing a network filter **replaces** the built-in redaction. From that moment nothing is redacted unless your filter does it. Compose your filter with `getDefaultNetworkSanitizer()` to keep both.
:::

```ts
import { getDefaultNetworkSanitizer } from '@bugsee/bugsee';
import { bugsee } from './bugsee';

const defaults = getDefaultNetworkSanitizer();

const SKIP = ['/health', '/metrics'];
const THIRD_PARTY = ['https://analytics.example.com/', 'https://ads.example.net/'];

bugsee.setNetworkEventFilter((event) => {
  // Drop the whole request, at every stage (before, complete, error, ...)
  if (SKIP.some((path) => event.url.includes(path))) {
    return null;
  }
  if (THIRD_PARTY.some((origin) => event.url.startsWith(origin))) {
    return null;
  }

  // Built-in redaction first
  const sanitized = defaults.sanitize(event);

  // Then yours: never record response bodies of the profile API
  if (sanitized.url.includes('/api/profile') && sanitized.custom !== undefined) {
    return {
      ...sanitized,
      custom: { ...sanitized.custom, body: null, no_body_reason: 'unsupported_content_type' },
    };
  }
  return sanitized;
});
```

Where `bugsee` is the client `launch` returned:

```ts title="bugsee.ts"
import { launch } from '@bugsee/bugsee';

export const bugsee = await launch('<your_app_token>');
```

What to know:

- **One call per stage.** A request produces a `before` event, then `complete`, `error` or `abort`, and so on, and your filter runs for each one. Return `null` for every stage of a request you want gone. Match on `event.url`, or remember `event.id`.
- **The filter fails closed.** If it throws, the event is dropped, and the error goes to the `onError` launch option.
- **Install it right after `launch`.** Events recorded before the filter is installed keep the built-in redaction.
- **One filter at a time.** A later call replaces it. `setNetworkEventFilter(null)` removes it, and the built-in redaction applies again. After `relaunch()`, install it again on the new client.
- **The body policy runs first.** Size and content-type rules apply before the filter sees the event.
- **The helper functions.** `defaults.sanitizeUrl(url)` and `defaults.sanitizeErrorMessage(message)` redact a single string. Use them in your own code, for example before you put a URL in a breadcrumb.

## Other places a URL can appear

A network filter changes network events only. A URL can also be recorded in:

- **Breadcrumbs.** A breadcrumb you add is recorded as it is. Use [`setBreadcrumbFilter`](/sdk/javascript/privacy/breadcrumbs).
- **The page address trace** in the browser. The SDK records a sanitized address. The `urlSanitizer` launch option adds your own rule after the built-in one. It receives the already sanitized address, and returns the string to record, or `null` to record nothing.
- **Performance spans.** With performance monitoring on, requests also become spans. `setSpanFilter` changes or drops them. See [Performance](/sdk/javascript/performance).
- **Replay.** `href` and `src` attributes are recorded as the page has them. See [Privacy: Replay](/sdk/javascript/privacy/replay#what-can-still-leak).

## Related pages

- [Network events](/sdk/javascript/network) — how capture works and the event shape.
- [Privacy overview](/sdk/javascript/privacy/overview) — all privacy controls.
- [HTTP errors](/sdk/javascript/issue-detection/http-errors) — what HTTP error reports contain.
