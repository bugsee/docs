---
title: "Network events"
description: "How the Bugsee JavaScript SDK records fetch, XMLHttpRequest, WebSocket, SSE and node:http traffic, the capture options, the built-in redaction, and setNetworkEventFilter with getDefaultNetworkSanitizer."
sidebar_position: 20
slug: "/sdk/javascript/network"
---

:::warning[Beta]
This page documents the Bugsee JavaScript SDK, which is in beta (0.1.x) and can change between betas.
:::

Bugsee records the network requests your app makes, with their headers, bodies and status codes, and shows them on the report timeline next to the recording and logs. Capture is on by default and needs no code.

## What is captured

The SDK patches the network APIs of the runtime when it launches, and restores them when it stops.

| Mechanism (`event.mechanism`) | Source | Where |
| --- | --- | --- |
| `fetch` | Global `fetch` | Every runtime |
| `xhr` | `XMLHttpRequest` | Browsers |
| `ws` | `WebSocket` | Where `WebSocket` exists |
| `sse` | `EventSource` | Where `EventSource` exists |
| `webtransport` | `WebTransport` | Where `WebTransport` exists |
| `sendBeacon` | `navigator.sendBeacon` | Browsers |
| `http` | `node:http` and `node:https` clients, which libraries such as axios and got use | Node.js and Bun |

Each request produces several events that share an `id`, one per stage: `before`, `complete`, `redirect`, `error`, `abort` and `timing` for requests, and `open`, `message` and `close` for WebSocket, SSE and WebTransport connections. The SDK's own traffic to Bugsee is not recorded.

Network capture keeps running during a [blackout](/sdk/javascript/lifecycle). Only visual and interaction capture stop.

## Capture options

Set these in the options object you pass to `launch`.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `captureNetwork` | `boolean` | `true` | Record network requests and responses. |
| `captureNetworkBodies` | `boolean` | `true` | Record request and response bodies. When `false`, no body is kept. |
| `maxNetworkBodySize` | `number` | `20480` | Largest body kept, in bytes of UTF-8. A larger body is dropped. |
| `captureNetworkBodyWithoutType` | `boolean` | `false` | Also keep bodies that declare no `Content-Type`. |
| `captureNetworkDefaultSanitizer` | `boolean` | `true` | Apply the built-in redaction. See [below](#built-in-redaction). |
| `detectHttpErrors` | `boolean` | `false` | Turn HTTP 5xx responses into error reports. See [HTTP errors](/sdk/javascript/issue-detection/http-errors). |

```ts
import { launch } from '@bugsee/bugsee';

const bugsee = await launch('<your_app_token>', {
  captureNetworkBodies: true,
  maxNetworkBodySize: 10240,
});
```

A body that is dropped by the size or content-type rule is recorded as `null` with a reason, `size_too_large` or `no_content_type`, in `custom.no_body_reason`.

A malformed boolean (for example `captureNetwork: 'false'`) turns the option **off** and is reported through the `onError` launch option, rather than leaving capture on by accident.

## Built-in redaction

With `captureNetworkDefaultSanitizer` on, every event is redacted before it is stored. The redacted value is `<redacted>`.

- **Headers.** The value of a sensitive header is replaced. The match is on the exact name, case-insensitive. The list includes `authorization`, `proxy-authorization`, `cookie`, `set-cookie`, `x-api-key`, `x-auth-token`, `x-csrf-token`, `x-forwarded-for`, `x-real-ip` and a set of cloud and vendor token headers.
- **URL.** Values of sensitive query and fragment parameters, matrix parameters, and the password in `user:password@host` are replaced. The same pass runs on the error text of a failed request.
- **Bodies.** JSON, form-encoded, multipart, XML and `key: value` bodies have the values of sensitive keys replaced. Keys match by case-insensitive substring after separators are ignored, so `userPassword`, `api-key` and `oauth_token` all match. Substrings include `password`, `secret`, `token`, `auth`, `key`-style names such as `api_key`, card and bank fields such as `cvv` and `iban`, and national-id fields such as `ssn`. This is deliberately broad and can redact more than you need.
- **Secret shapes.** Values that look like a JSON Web Token or a well-known provider secret are replaced even under an innocent key name.

Card numbers in free text are not redacted by shape. A card field is redacted by its key name only.

## Filter network events

`setNetworkEventFilter(filter)` installs a function that sees each event before it is recorded. Return the event, changed or not, to keep it, or `null` to drop it. Pass `null` to remove the filter.

```ts
import { getDefaultNetworkSanitizer, launch } from '@bugsee/bugsee';

const bugsee = await launch('<your_app_token>');

bugsee.setNetworkEventFilter((event) => {
  // Drop health checks
  if (event.url.includes('/health')) {
    return null;
  }
  // Keep the built-in redaction (see below)
  return getDefaultNetworkSanitizer().sanitize(event);
});
```

:::caution
A network filter **replaces** the built-in redaction. It does not run on top of it. From the moment a filter is set, URLs, headers, bodies and error text are recorded exactly as they are unless your filter redacts them. The example above calls `getDefaultNetworkSanitizer().sanitize(event)` for that reason. A filter that returns the event as it is would record `Authorization` headers.
:::

### Keep the built-in redaction and add rules

Compose with `getDefaultNetworkSanitizer()`. Call `sanitize` inside your filter, then add your own rules.

```ts
import { getDefaultNetworkSanitizer, launch } from '@bugsee/bugsee';

const bugsee = await launch('<your_app_token>');
const defaults = getDefaultNetworkSanitizer();

bugsee.setNetworkEventFilter((event) => {
  // Drop analytics and health checks, at every stage
  if (event.url.includes('/health') || event.url.startsWith('https://analytics.example.com/')) {
    return null;
  }

  // Built-in redaction first
  const sanitized = defaults.sanitize(event);

  // Then your own rules: remove a tenant header entirely
  const headers = sanitized.custom?.headers;
  if (headers === undefined) {
    return sanitized;
  }
  const kept = Object.fromEntries(
    Object.entries(headers).filter(([name]) => name.toLowerCase() !== 'x-tenant-id'),
  );
  return { ...sanitized, custom: { ...sanitized.custom, headers: kept } };
});
```

`getDefaultNetworkSanitizer()` returns a frozen object with three functions:

| Function | Description |
| --- | --- |
| `sanitize(event)` | Redacts the URL, headers, body and error text of an event. Returns a new event, or the same one when nothing changed. Does not mutate its input. |
| `sanitizeUrl(url)` | Redacts sensitive query and fragment parameters and `user:password@` credentials in a URL. |
| `sanitizeErrorMessage(message)` | Redacts URLs and secrets quoted inside free text. |

### Rules for filters

- **A filter runs once per stage.** A request produces a `before` event, then a `complete` or `error` event, and so on. To drop a request, return `null` for every stage you recognize. Vetoing one stage does not hide the others. Match on `event.url`, or remember `event.id`.
- **A filter that throws drops the event.** The error goes to `onError`, and nothing unredacted is recorded.
- **The URL is made absolute first.** In a page or worker, a relative URL is completed with the document address before the filter runs.
- **The body policy runs first.** The filter sees the body after the size and content-type rules, so a dropped body is already `null`.
- **There is one filter at a time.** A later call replaces it. Set it right after `launch`, because events captured before the filter is installed are recorded with the built-in redaction. `relaunch()` returns a new client, so set the filter again on it.

### The event

The filter receives a `NetworkEvent`. These are the fields you will use most:

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Shared by all events of one request or connection. |
| `mechanism` | `'fetch' \| 'xhr' \| 'ws' \| 'sse' \| 'sendBeacon' \| 'webtransport' \| 'http'` | What recorded it. |
| `type` | `'before' \| 'complete' \| 'redirect' \| 'error' \| 'abort' \| 'timing' \| 'open' \| 'message' \| 'close'` | The stage. |
| `url` | `string` | The request or connection URL. |
| `method` | `string` | The HTTP method. |
| `status` | `number \| undefined` | The response status. |
| `statusText` | `string \| undefined` | The response reason phrase. |
| `customError` | `string \| null \| undefined` | Error text of a failed request. |
| `custom.headers` | `Record<string, string> \| undefined` | Request or response headers. |
| `custom.body` | `string \| null \| undefined` | The body as text. |
| `custom.no_body_reason` | `'size_too_large' \| 'no_content_type' \| 'unsupported_content_type' \| 'cant_read_data' \| null \| undefined` | Why a body is missing. |

Streamed connections also carry `direction`, `event`, `code`, `reason` and `channel`.

## Other places a URL can appear

Your network filter applies to network events only. A URL can also appear in:

- **Breadcrumbs.** See [Privacy: Breadcrumbs](/sdk/javascript/privacy/breadcrumbs).
- **The page address trace.** In the browser the SDK records the sanitized page address. The `urlSanitizer` launch option adds your own rule on top of the built-in one.
- **Performance spans.** With performance monitoring on, requests also become spans. Use `setSpanFilter` to change or drop them. See [Performance](/sdk/javascript/performance).

## Related pages

- [Privacy: Network](/sdk/javascript/privacy/network) — keep sensitive traffic out of reports.
- [HTTP errors](/sdk/javascript/issue-detection/http-errors) — report 5xx responses.
- [Console logs](/sdk/javascript/logs) — the other automatic capture stream.
- [Configuration](/sdk/javascript/configuration) — every launch option.
