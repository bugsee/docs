---
title: "Privacy: Breadcrumbs"
description: "How to keep sensitive data out of the breadcrumbs Bugsee React Native SDK 7.x records: the breadcrumb options, and redacting or dropping breadcrumbs with setBreadcrumbFilter."
sidebar_position: 5
slug: "/sdk/react_native/privacy/breadcrumbs"
---

:::warning[Beta]
This page documents Bugsee React Native SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/react_native/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/react_native/migration).
:::

Breadcrumbs record the steps leading up to an issue: the ones you add with `Bugsee.addBreadcrumb`, and the ones the native SDKs record themselves, such as app lifecycle changes, system events and HTTP requests. Their messages and data can carry a URL with a token in it, an identifier, or a value from your own code. See [Breadcrumbs](/sdk/react_native/breadcrumbs) for how they are recorded; this page covers how to keep sensitive data out of them.

## Breadcrumb options

Breadcrumb capture is **off by default**, on both platforms. Leaving it off is the simplest control: no breadcrumb is recorded, yours or the native SDK's.

| Option | Key | Default | Description |
| --- | --- | --- | --- |
| `captureBreadcrumbs` | `com.bugsee.option.capture.breadcrumbs` | `false` | Record breadcrumbs. |
| (no accessor) | `com.bugsee.option.capture.breadcrumbs.extras` | `false` | Attach raw system data to the breadcrumbs the native SDK records for system events: the `Intent` extras of system broadcasts on Android, the notification `userInfo` of device events on iOS. That data is not yours to vet, so leave it off unless you need it. |

```ts
import Bugsee, { createDefaultLaunchOptions } from '@bugsee/react-native';

const options = createDefaultLaunchOptions();
options.captureBreadcrumbs = true;
// Leave com.bugsee.option.capture.breadcrumbs.extras at its default, false

Bugsee.launch('<your app token>', options);
```

On iOS, the keyboard and focus breadcrumbs are not recorded during a [blackout](/sdk/react_native/privacy/video#blackout).

## Network URLs in breadcrumbs

The breadcrumb the native SDK records for an HTTP request can carry the request's URL. Your [network filter](/sdk/react_native/privacy/network) does **not** reach breadcrumbs: a request it drops or rewrites can still appear, with its URL, in the breadcrumb trail.

- **iOS**: the built-in query-parameter redaction (`com.bugsee.option.capture.network.default-sanitizer`) is applied to breadcrumb URLs, but a network filter is not.
- **Android**: the URL is recorded as it is.

Repeat your URL rules in the breadcrumb filter, as in the example below.

## Redacting with a breadcrumb filter

`Bugsee.setBreadcrumbFilter(callback)` sees every breadcrumb before it is recorded, yours and the native SDK's. Return the breadcrumb with its fields redacted to keep it, or `null` to drop it.

The example below does not depend on how the native SDKs name their categories: it scrubs every string in the message and the data.

```ts
import Bugsee, { type BreadcrumbSnapshot } from '@bugsee/react-native';

const SECRET_PARAMS = /([?&](?:token|access_token|code|session)=)[^&#\s]*/gi;
const EMAIL = /[\w.%+-]+@[\w-]+(?:\.[\w-]+)+/g;

function scrub(text: string): string {
  return text.replace(SECRET_PARAMS, '$1<redacted>').replace(EMAIL, '<email>');
}

// Scrubs every string in a breadcrumb's data, at any depth
function scrubValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return scrub(value);
  }
  if (Array.isArray(value)) {
    return value.map(scrubValue);
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = scrubValue(item);
    }
    return out;
  }
  return value;
}

Bugsee.setBreadcrumbFilter((crumb: BreadcrumbSnapshot) => {
  // Drop a whole category of your own breadcrumbs
  if (crumb.category === 'auth') {
    return null;
  }

  // Start from a spread, so every field you were sent is still there
  const redacted: BreadcrumbSnapshot = { ...crumb };
  if (crumb.message !== undefined) {
    redacted.message = scrub(crumb.message);
  }
  if (crumb.data !== undefined && crumb.data !== null) {
    redacted.data = scrubValue(crumb.data);
  }
  return redacted;
});

// Install filters first, then launch.
// Bugsee.launch('<your app token>', options);
```

What makes it a safe boundary:

- **It fails closed.** The breadcrumb is dropped, not recorded unredacted, when the callback throws, its promise rejects, it returns something that is not an object, it leaves out a writable field the breadcrumb had, or a value is invalid. Set `data` to `null` to clear it; leaving it out drops the whole breadcrumb.
- **No late recording of the original.** Neither platform sets a deadline for the breadcrumb filter, and the original is never recorded in place of an answer. A callback that never settles means the breadcrumb is never recorded, so make sure yours always settles.
- **Your own breadcrumbs keep their filter.** A breadcrumb you pass to `addBreadcrumb` is answered by the filter that was installed at that moment, even if you clear or replace it on the same turn.

What it does not cover:

- **Breadcrumbs recorded before the filter is installed.** Call `setBreadcrumbFilter` before `Bugsee.launch`, at the top of your startup code.
- **Android auto-launch.** With `autoLaunch`, the SDK records from process start on Android, before any JavaScript runs, and breadcrumbs recorded before your code calls `setBreadcrumbFilter` are not filtered. Do not use auto-launch if that window must be filtered.
- **A cleared filter.** `setBreadcrumbFilter(null)` removes the filter, and breadcrumbs are then recorded unfiltered.
- **Development reloads.** After a JavaScript reload the filter stays on, but nothing in the new runtime answers it, so no breadcrumb is recorded until your code calls `setBreadcrumbFilter` again. Nothing is recorded unfiltered.

For your own breadcrumbs, the simplest redaction is not to put the value in at all: build the `message` and `data` you pass to `addBreadcrumb` from what you are willing to send. See [Filtering breadcrumbs](/sdk/react_native/breadcrumbs#filtering-breadcrumbs) for the full contract: the fields of the breadcrumb, what each return value does, and which values `data` accepts.

## Related pages

- [Breadcrumbs](/sdk/react_native/breadcrumbs): turning them on, `addBreadcrumb`, and the filter contract.
- [Privacy: Network](/sdk/react_native/privacy/network): the network filter, which does not reach breadcrumbs.
- [Privacy overview](/sdk/react_native/privacy/overview): every privacy control.
