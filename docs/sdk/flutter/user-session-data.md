---
title: "User & session data"
description: "Attach a user identifier and custom attributes to every report with Bugsee Flutter SDK 10.x: accepted values, platform size limits, reading them back, and the errors."
sidebar_position: 11
slug: "/sdk/flutter/user-session-data"
---

:::warning[Beta]
This page documents Bugsee Flutter SDK **10.x**, which is in beta (`10.0.0-beta.1`, a prerelease on pub.dev) and can change between betas. The stable release is **9.x**: see the [9.x documentation](/sdk/flutter/v9/installation). Upgrading? See [Migrating from 9.x to 10.x](/sdk/flutter/migration).
:::

Annotate every report with facts about the current user and session: a **user identifier**, which says who the user is, and custom key/value **attributes**, for anything else (plan, region, feature flags). Both go with every report the SDK sends.

The snippets assume `import 'package:bugsee_flutter/bugsee_flutter.dart';`.

## User identity

The user identifier is one string, such as your backend user ID, that ties a user's reports together in the Bugsee dashboard. If it is an email address, the server may link reports to that user's account. The SDKs have this one field: there is no separate name or email (9.x had a separate email call; see [Migrating from 9.x to 10.x](/sdk/flutter/migration)).

```dart
// Once the user has signed in
await Bugsee.setUserIdentifier('user-8f3a2c');

// Read it back: null when none is set
final id = await Bugsee.getUserIdentifier();

// On sign-out: attributes persist across launches, so clear them too
await Bugsee.clearUserIdentifier();
await Bugsee.clearAllAttributes();
```

| Method | Returns | Notes |
| --- | --- | --- |
| `setUserIdentifier(identifier)` | `Future<void>` | An empty string clears the identifier, on both platforms. |
| `getUserIdentifier()` | `Future<String?>` | `null` when none is set. |
| `clearUserIdentifier()` | `Future<void>` | Reports are no longer associated with a user. |

The identifier is attached to every report from now on and persists across launches. It works before `launch` on both platforms.

## Attributes

Attributes are key/value pairs attached to every report. They **persist across launches** until you clear them, so set them when the fact changes (at sign-in, when the plan changes) rather than at every launch.

```dart
await Bugsee.setAttribute('plan', 'pro');
await Bugsee.setAttribute('beta-tester', true);
await Bugsee.setAttribute('seats', 12);
await Bugsee.setAttribute('discount', 0.15);

final plan = await Bugsee.getAttribute('plan');        // 'pro', or null when not set
final all = await Bugsee.getAllAttributes();           // Map<String, Object>, empty when none
await Bugsee.clearAttribute('discount');
await Bugsee.clearAllAttributes();
```

| Method | Returns | Notes |
| --- | --- | --- |
| `setAttribute(name, value)` | `Future<void>` | Sets or replaces the attribute. |
| `getAttribute(name)` | `Future<Object?>` | `null` when not set. |
| `getAllAttributes()` | `Future<Map<String, Object>>` | Empty when none. The map is not modifiable. |
| `clearAttribute(name)` | `Future<void>` | Does nothing when it is not set. |
| `clearAllAttributes()` | `Future<void>` | Removes every attribute. |

Attributes work **before `launch`** on both platforms: the SDKs keep them outside the session, persisted across launches and stops. That makes `main()` before `Bugsee.launch` a fine place to restore them.

### Accepted values

| Part | Rule |
| --- | --- |
| `name` | Not empty. |
| `value` | A `String` (at most 1024 UTF-16 units), a `bool`, an `int`, or a finite `double` smaller in magnitude than the largest 32-bit float. |

A `List`, `Map`, `null` or `DateTime` is refused in Dart. Convert them to a string first.

Android stores a non-integer as a 32-bit float, and both `getAttribute` and `getAllAttributes` answer with that float's shortest decimal: `3.141592653589793` reads back as `3.1415927`. iOS keeps the double. If you need exact precision, store the number as a string.

### Size limits and the read-back

The SDKs **drop an over-limit value without saying so**: Android's call returns nothing, and iOS answers success even when it ignored the value. The wrapper therefore reads the value back after setting it. A value the SDK did not keep throws `BugseeAttributeException` with reason `AttributeFailure.rejected`, and the previous value stays.

The limits differ per platform (measured by the maintainers): Android keeps a 1024-character string and about 42 values of 600 characters in all; iOS refuses a 1024-character string (its limit is the 1124-byte archive) and takes about 40 values of 600 characters. Keep attributes short and few, and do not put large blobs in them.

### Errors

Attribute calls throw `BugseeAttributeException` through the `Future`. It is a `BugseeException` but deliberately **not** a `BugseeArgumentException`, so `on BugseeArgumentException` keeps meaning "refused before the SDK".

| `reason` | When |
| --- | --- |
| `AttributeFailure.invalidName` | The name is empty. Nothing reached the SDK. |
| `AttributeFailure.invalidValue` | The value is another type, a string over 1024 units, or not finite. Nothing reached the SDK. |
| `AttributeFailure.rejected` | The SDK did not keep the value (a size limit, or it could not store it). |

`BugseeAttributeException.argument` names the parameter at fault (`name` or `value`). The message never contains the attribute value.

```dart
try {
  await Bugsee.setAttribute('notes', veryLongString);
} on BugseeAttributeException catch (e) {
  debugPrint('attribute not stored: ${e.reason.name}');
}
```

### Attributes on one report

To set an attribute on a single report rather than on every report, use a [report handler](/sdk/flutter/report-handler) (`ReportProxy.setAttribute`) or a [created report](/sdk/flutter/manual/bug-reporting#build-a-report-yourself).

## Privacy

Attributes and the user identifier are exactly what you pass; Bugsee does not filter them. Do not store secrets or personal data you would not want in a report. See [Privacy](/sdk/flutter/privacy/overview).
