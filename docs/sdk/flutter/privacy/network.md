---
title: "Privacy: Network"
description: "How to keep credentials and personal data out of the network traffic Bugsee Flutter SDK 10.x records: opt-in capture, the Dart filter that runs first and fails closed, the SDK sanitizer, and the URL in Android HTTP breadcrumbs."
sidebar_position: 16
slug: "/sdk/flutter/privacy/network"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta (`10.0.0-beta.1`, a prerelease on pub.dev) and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

Recorded network traffic is one of the most useful parts of a report, and one of the most sensitive: request headers carry credentials, URLs carry tokens, and bodies carry whatever the user typed. [Network capture](/sdk/flutter/network) explains what the plugin records; this page covers how to keep sensitive values out of it.

## The order things happen in

Every captured event passes through these steps, in this order:

1. **The Dart filter** (`Bugsee.setNetworkFilter`), if you set one. It sees the raw event, and nothing leaves Dart before it has run.
2. **Plugin redaction of URLs and errors**, always (see [What the plugin always removes](#what-the-plugin-always-removes)).
3. **The native SDK.** Every event is submitted with filtering required, so the SDK runs its own pipeline on what your filter returned: **the filter you set on the native SDK**, if the app set one (`Bugsee.setNetworkEventFilter` from Kotlin or Swift), **or else the default sanitizer**.
4. The SDK's body limits, and the report.

## Capture is opt-in, and off until launch

`installNetworkCapture` is never called by `launch`. If you do not call it, the plugin records no `dart:io` traffic. Even when installed, nothing is recorded while the SDK is not `launched`, after `stop`, or with `captureNetwork` off. Requests to Bugsee itself (any host `bugsee.com` or below, and the host of the configured `endpoint`) are never recorded.

Set `captureNetwork` to `false` to record no network traffic at all:

```dart
import 'package:bugsee_flutter/bugsee_flutter.dart';

await Bugsee.launch(
  'YOUR_APP_TOKEN',
  options: const BugseeOptions(captureNetwork: false),
);
```

## Body options

| Option | Default | Effect |
| --- | --- | --- |
| `captureNetworkBodySizeLimit` | `20480` | Largest body kept, in bytes. A body over the limit is dropped, not cut. `0` keeps no body. The plugin caps the value at 2 MiB. |
| `captureNetworkBodyWithoutType` | `false` | Skips the content-type check, so bodies with no type, and bodies with any declared type (binary included, when they are readable text), are kept. Leave it off unless you need them. |

By default only **text** bodies are recorded: `text/*`, and types containing `json`, `xml` or `x-www-form-urlencoded`; with `captureNetworkBodyWithoutType` on, the type check is skipped. A binary body is counted and never copied. Request bodies and response bodies follow the same options; there is no separate switch for request bodies.

Neither option removes headers or URL parameters. Use the [Dart filter](#redacting-with-a-dart-filter) and the SDK sanitizer for those.

## The SDK sanitizer

With `captureNetworkDefaultSanitizer` on (the default), the native SDK redacts known sensitive values after your Dart filter has run: query parameters, header values and JSON body values with sensitive keys.

```dart
await Bugsee.launch(
  'YOUR_APP_TOKEN',
  options: const BugseeOptions(captureNetworkDefaultSanitizer: true), // the default
);
```

Three things to know:

- **A Dart filter does not replace it.** The SDK's own filter slot is the native one, which stays the app's. A Dart filter that returns the event with `authorization` untouched still gets it redacted by the sanitizer, unless you turned the option off.
- **It is skipped when the app set a native network filter.** The documentation of both SDKs says the sanitizer applies only when no network event filter is set. If you set one natively, it runs on the event after the Dart filter, and **it replaces the sanitizer**: it must redact what you do not want sent.
- **Its rules are the SDKs' and differ per platform.** In the verification, the same `x-session: s1` request header was redacted on Android and kept on iOS. `authorization`, `set-cookie`, the `token` query parameter and JSON `token` and `password` values were redacted on both. The sanitizer knows nothing about your own API: redact in the Dart filter whatever must be hidden on both platforms.

The native SDK documents its rules: [Android network privacy](/sdk/android/privacy/network) and [iOS network privacy](/sdk/ios/privacy/network).

## Redacting with a Dart filter

```dart
Bugsee.setNetworkFilter((event) {
  final uri = Uri.parse(event.url);
  if (uri.host == 'internal.example.com') return null;   // drop the event
  event.headers.remove('x-session');                     // redact in place
  event.body = null;                                     // or hide a body
  return event;
});
```

Set it at the top of `main`, next to `installNetworkCapture`, so it is in place for the first request.

- **It cannot be bypassed.** It runs in Dart, and there is no path to the SDK that does not go through it. It sees the raw event: headers, the URL with its query, and the body.
- **It fails closed.** A filter that throws, returns something other than a `BugseeNetworkEvent` or `null`, or returns a `Future` that does not complete within its timeout (10 seconds by default, at most 5 minutes) drops that event. Capture degrades to nothing, never to unfiltered. `Bugsee.networkCaptureStats.filterFailures` counts the drops.
- **`id`, `stage`, `method`, `statusCode` and `size` cannot be changed**: a change is ignored. A filter that blanks the URL drops the event.
- **Keep it fast and independent.** It runs on the isolate that made the request, one event at a time, in order. It must not call back into code that waits for the HTTP request it is filtering.
- **A filter you remove or replace** still applies to events that were queued under it.

## What the plugin always removes

These happen in Dart, whatever your filter returned:

- **Userinfo in URLs** (`user:password@host`, which `dart:io` accepts and turns into Basic auth) is stripped from `url`, `redirectedFrom`, URL-valued headers and error texts. The check is made once more on the way out, on whatever a filter returned.
- **Fragments** are dropped from every recorded URL and URL-valued header, because OAuth callbacks can put tokens in a redirect's `Location` fragment and no SDK looks at fragments.
- **URL-valued headers** (`location`, `content-location`, `referer`, `refresh`, in requests and responses) lose userinfo and every query **value**: `?token=abc` becomes `?token=<redacted>`. Neither SDK sanitizes a header by its value, only by its name. Other headers are the SDK sanitizer's business.
- **Error texts** of an `error` entry never carry a URL's query string or userinfo.
- **Request cookies** set through `request.cookies` are not captured. The response's `Set-Cookie` is a response header, so the sanitizer's rules apply to it (redacted on both platforms in the verification).

## HTTP breadcrumbs

With `captureBreadcrumbs` on, the SDK records an `http` breadcrumb for each finished request, with its URL. The breadcrumb sees the event **after your Dart filter and before the SDK sanitizer**.

In the verification, **Android recorded that URL verbatim** (`?token=abc123` stayed), which the SDK documents as the user's job through a breadcrumb filter, while iOS applied its query sanitizer to it. The SDK's option documentation for `captureNetworkDefaultSanitizer` says it also redacts the URL of `http` breadcrumbs; that was not re-measured with this plugin. Do not depend on it: **redact the URL in the Dart network filter**, which runs first and protects the breadcrumb on both platforms.

`setBreadcrumbFilter` is not exposed by this plugin. A breadcrumb filter the app set on the native SDK still applies.

## What is not covered

- **Data you pass yourself.** A URL you pass to `Bugsee.event`, `Bugsee.trace`, `Bugsee.log`, `Bugsee.addBreadcrumb` or an attribute is yours to redact.
- **Native stacks.** Traffic from `cronet_http`, `cupertino_http`, `native_dio_adapter`, a WebView or a platform channel goes through the native SDKs' own interception, not through the Dart filter, and is captured only if the app adds the matching native Bugsee module itself (the Flutter package does not include the optional HTTP modules; see [Installation](/sdk/flutter/installation#android)). Where it is captured, set a native network filter if that traffic matters.
- **WebSocket frames** are not captured at all; the handshake is a normal exchange and passes through the filter.
- **Other isolates** are not captured.

## Related pages

- [Network events](/sdk/flutter/network): what is recorded and the capture limits.
- [Privacy overview](/sdk/flutter/privacy/overview)
