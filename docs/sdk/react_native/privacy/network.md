---
title: "Privacy: Network"
description: "How to keep credentials and personal data out of the network traffic Bugsee React Native SDK 7.x records: turning capture off, body options, the built-in redaction on each platform, and redacting events with setNetworkFilter."
sidebar_position: 4
slug: "/sdk/react_native/privacy/network"
---

:::warning[Beta]
This page documents Bugsee React Native SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/react_native/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/react_native/migration).
:::

Recorded network traffic is one of the most useful parts of a report, and one of the most sensitive: request headers carry credentials, URLs carry tokens, and bodies carry whatever the user typed. The native SDKs record the traffic (see [Network events](/sdk/react_native/network)); this page covers how to keep sensitive values out of it.

## Disabling network capture

Set `captureNetwork` to `false` to record no network traffic at all:

```ts
import Bugsee, { createDefaultLaunchOptions } from '@bugsee/react-native';

const options = createDefaultLaunchOptions();
options.captureNetwork = false;

Bugsee.launch('<your app token>', options);
```

## Body options

These options limit which bodies are kept. They have no accessor; set them with `setCustomOption`:

| Key | Default | Description |
| --- | --- | --- |
| `com.bugsee.option.capture.network.body-size-limit` | `20480` | Largest request or response body captured, in bytes. |
| `com.bugsee.option.capture.network.body-without-type` | `false` | Also keep bodies that declare no content type. Leave it off unless you need them. |

A body over the limit is dropped, not cut. On iOS both options apply after your network filter, so the filter still sees an oversized body or one without a content type; on Android they apply before it.

Neither option removes headers or URL parameters. Use the built-in redaction and a [network filter](#redacting-with-a-network-filter) for those.

## The built-in redaction

With `com.bugsee.option.capture.network.default-sanitizer` on (the default), known sensitive values are replaced with `<redacted>`. Key matching is case-insensitive.

| | Android | iOS |
| --- | --- | --- |
| Headers | `Authorization`, `Proxy-Authorization`, `Cookie`, `Set-Cookie`, `X-Api-Key`, `X-Auth-Token`, `X-CSRF-Token`, `X-Forwarded-For`, `X-Real-IP`, and any header whose name contains `password`, `secret`, `token`, `session` or `apikey`, among others | The same nine names, matched exactly. |
| URL parameters and bodies | Known sensitive keys, and any key whose name contains `password`, `secret`, `token`, `session` or `apikey`, among others, in query parameters and in JSON, form-encoded and `key: value` bodies. Also removes `user:password@` credentials from URLs, and redacts the error texts (`errorDescription`, `errorShortMessage`). | A fixed list of key names, matched exactly (`password`, `secret`, `token`, `access_token`, `refresh_token`, `api_key`, `authorization`, card numbers, `cvv`, `ssn`, `pin`, `private_key` and a few variants), in query parameters, in the redirect URL and in JSON bodies. Bodies that are not JSON are left unchanged. |

Native SDK reference: [Android network privacy](/sdk/android/privacy/network#a-filter-replaces-the-built-in-redaction) (the full Android list) and [iOS network privacy](/sdk/ios/privacy/network#built-in-redaction).

The built-in redaction knows nothing about your own API. On iOS, a header such as `X-Session-Id` is recorded as it is; Android redacts it because its name contains `session`. A JSON field such as `otp`, or a value in a plain-text body, is recorded as it is on both platforms unless your filter removes it.

### With a network filter installed

Installing a filter changes the built-in redaction differently on each platform:

| Platform | With a filter installed |
| --- | --- |
| Android | The built-in redaction runs **before** your filter, so the event you receive is already redacted, and your filter adds to it. Turn the option off to receive the raw event. |
| iOS | Your filter **replaces** the built-in redaction. The event you receive is not redacted, and your filter must remove everything you do not want sent, including the headers in the table above. |

Write one filter that redacts everything you need on both platforms, as in the example below, rather than relying on the built-in redaction.

## Redacting with a network filter

`Bugsee.setNetworkFilter(callback)` sees each network event before it is recorded, the captured traffic and the events you add with `addNetworkEvent`. Return the event with its fields redacted to keep it, or `null` to drop it.

The example below is a starting point, not an exhaustive policy: review it against your data. Its lists repeat the iOS built-in header names and keys, because on iOS the filter replaces the built-in redaction, and add a few names for your own API. All names are matched case-insensitively.

```ts
import Bugsee, { type NetworkFilterEvent } from '@bugsee/react-native';

// Header names (lowercase). The first nine are the iOS built-in list.
const SECRET_HEADERS = new Set([
  'authorization', 'proxy-authorization', 'cookie', 'set-cookie', 'x-api-key',
  'x-auth-token', 'x-csrf-token', 'x-forwarded-for', 'x-real-ip',
  'x-session-id', // your own API
]);

// URL query parameter and JSON key names (lowercase). All but the last line are the iOS built-in list.
const SECRET_KEYS = new Set([
  'password', 'passwd', 'pass', 'secret', 'client_secret',
  'token', 'access_token', 'refresh_token', 'id_token', 'auth_token',
  'api_key', 'apikey', 'authorization',
  'credit_card', 'creditcard', 'card_number', 'cardnumber', 'cvv', 'cvc', 'cvv2',
  'ssn', 'social_security', 'pin', 'private_key', 'privatekey',
  'otp', 'code', 'session', // your own API
]);

function redactUrl(url: string | null): string | null {
  if (url === null) {
    return null;
  }
  return url.replace(/([?&])([^=&#]+)=[^&#]*/g, (match: string, sep: string, name: string) =>
    SECRET_KEYS.has(name.toLowerCase()) ? `${sep}${name}=<redacted>` : match,
  );
}

function redactHeaders(headers: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(headers)) {
    out[name] = SECRET_HEADERS.has(name.toLowerCase()) ? '<redacted>' : value;
  }
  return out;
}

function redactBody(body: string): string | null {
  try {
    const parsed: unknown = JSON.parse(body);
    return JSON.stringify(parsed, (key, value: unknown) =>
      SECRET_KEYS.has(key.toLowerCase()) ? '<redacted>' : value,
    );
  } catch {
    return null; // not JSON: drop the body rather than guess
  }
}

Bugsee.setNetworkFilter((event: NetworkFilterEvent) => {
  // Drop requests to an endpoint whose traffic must never be recorded
  if (event.url?.includes('/v1/identity/')) {
    return null;
  }

  // Start from a spread, so every field you were sent is still there
  const redacted: NetworkFilterEvent = { ...event, url: redactUrl(event.url) };
  if (event.headers) {
    redacted.headers = redactHeaders(event.headers);
  }
  if (typeof event.body === 'string') {
    redacted.body = redactBody(event.body);
  }
  if (event.redirectedFromURL !== undefined) {
    redacted.redirectedFromURL = redactUrl(event.redirectedFromURL); // iOS only
  }
  return redacted;
});

// Install filters first, then launch.
// Bugsee.launch('<your app token>', options);
```

What makes it a safe boundary:

- **It fails closed.** The event is dropped, not recorded unredacted, when the callback throws, its promise rejects, it returns something that is not an event object, or it leaves out a writable field the event had. To clear a field, set it to `null`; leaving it out drops the whole event.
- **Late answers are not recorded unfiltered.** Android: an event the filter has not answered within about 10 seconds is dropped. iOS: there is no deadline, and an answer that arrives late is still applied then.
- **It writes back only the writable fields**: `url`, `headers` and `body` on both platforms, `errorDescription`, `errorShortMessage` and `statusText` on Android, and `redirectedFromURL` and `error` on iOS. The error texts can quote a URL, so redact them too if your URLs carry secrets.

What it does not cover:

- **Traffic recorded before the filter is installed.** Call `setNetworkFilter` before `Bugsee.launch`, at the top of your startup code.
- **Android auto-launch.** With `autoLaunch`, the SDK records from process start on Android, before any JavaScript runs, and network events captured before your code calls `setNetworkFilter` are not filtered by it. Do not use auto-launch if that window must be filtered.
- **A cleared filter.** `setNetworkFilter(null)` removes the filter, and events are then recorded without it.
- **Development reloads.** After a JavaScript reload the filter stays on, but nothing in the new runtime answers it, so every network event is lost until your code calls `setNetworkFilter` again. Nothing is recorded unfiltered.
- **Breadcrumbs.** The network filter does not reach breadcrumbs. If you turn breadcrumbs on, an HTTP request breadcrumb can carry the request's URL: on iOS with the built-in query-parameter redaction applied, on Android as it is. Repeat your URL rules in a [breadcrumb filter](/sdk/react_native/privacy/breadcrumbs).
- **Performance transactions.** With performance monitoring on (the default), each HTTP request also becomes a performance transaction that carries its URL, and it is included in reports. Your network filter does not reach it. On Android the built-in redaction is applied to that URL. On iOS it is not: see the warning below.
- **HTTP error reports.** With `com.bugsee.option.detect.http-errors` on, the request's URL, normalized, goes into the report's `http_url` attribute on iOS. Remove it in a [report handler](/sdk/react_native/privacy/report) if needed.

:::warning[iOS: performance transactions record full URLs]
On iOS, the performance transaction of each HTTP request records the request's full URL, query string included, as it is: neither the built-in redaction nor your network filter applies to it. If your URLs carry tokens or personal data, turn performance monitoring off with `com.bugsee.option.performance.enabled: false`, or keep secrets out of URLs. See [Performance monitoring](/sdk/react_native/performance).
:::

See [Filtering network events](/sdk/react_native/network#filtering-network-events) for the full contract: the fields of the event, what each return value does, and the deadlines.

## Related pages

- [Network events](/sdk/react_native/network): what is recorded, `addNetworkEvent`, and the filter contract.
- [Privacy: Breadcrumbs](/sdk/react_native/privacy/breadcrumbs): redacting breadcrumbs.
- [Privacy overview](/sdk/react_native/privacy/overview): every privacy control.
