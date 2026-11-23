---
title: "Privacy: Breadcrumbs"
description: "How to keep sensitive data out of the breadcrumbs Bugsee Unity SDK 7.x records: breadcrumbs are off by default, the CaptureBreadcrumbs options, and redacting breadcrumbs with SetBreadcrumbFilter."
sidebar_position: 5
slug: "/sdk/unity/privacy/breadcrumbs"
---

:::warning[Beta]
This page documents Bugsee Unity SDK **7.x**, which is in beta and can change between betas. The stable release is **6.x**: see the [6.x documentation](/sdk/unity/v6/installation). Upgrading? See [Migrating from 6.x to 7.x](/sdk/unity/migration).
:::

Breadcrumbs are short records of what the app was doing before an issue: navigation, taps, lifecycle changes, network requests, and the entries your code adds with `Bugsee.AddBreadcrumb`. See [Breadcrumbs](/sdk/unity/breadcrumbs) for what is recorded. This page covers how to keep sensitive data out of them.

The filter and the options forward to the native SDKs. For what each platform puts in a breadcrumb, see [Android breadcrumb privacy](/sdk/android/privacy/breadcrumbs) and [iOS breadcrumb privacy](/sdk/ios/privacy/breadcrumbs).

## Breadcrumbs are off by default

`CaptureBreadcrumbs` is off by default on both platforms. While it is off:

- `Bugsee.AddBreadcrumb` records nothing.
- The breadcrumb filter is never called.

Set `CaptureBreadcrumbs` to `true` on your launch options to use either. `CaptureBreadcrumbsExtras` is also off by default. It adds extra details to some breadcrumbs, and those details can carry personal data. On iOS, for example, a device-event breadcrumb can carry the `userInfo` of a system notification. Leave it off unless you need it. See the native pages for what the extras contain.

```csharp
using Bugsee.Contracts.Options;
using BugseeSdk = Bugsee.Bugsee;

public static class BugseeStartup
{
    public static void Launch()
    {
#if UNITY_ANDROID
        BugseeSdk.Launch("<your app token>", new AndroidLaunchOptions { CaptureBreadcrumbs = true });
#elif UNITY_IOS
        BugseeSdk.Launch("<your app token>", new IOSLaunchOptions { CaptureBreadcrumbs = true });
#endif
    }
}
```

To turn breadcrumbs back off, leave the option out or set it to `false`.

## What the Unity API records

`Bugsee.AddBreadcrumb(string category, string message, string levelName)` adds a breadcrumb. `levelName` is one of `"debug"`, `"info"`, `"warning"`, `"error"` and `"fatal"`, in lower case. Any other value throws an `ArgumentException`. Do not put personal data into the category or the message.

## Redacting with a breadcrumb filter

`Bugsee.SetBreadcrumbFilter(EventFilter<IBreadcrumb> filter)` sees every breadcrumb before it is recorded: the ones the SDK collects and the ones you add. Return the breadcrumb, changed or not, to keep it, or `null` to drop it.

An `IBreadcrumb` has these members, and you can set all of them:

| Member | Type |
| --- | --- |
| `Timestamp` | `long` |
| `Category` | `string` |
| `Message` | `string` |
| `Type` | `string` |
| `Level` | `LogLevel?` |
| `Data` | `IDictionary<string, object>` |

```csharp
using System.Text.RegularExpressions;
using Bugsee.Contracts.Exchange;
using BugseeSdk = Bugsee.Bugsee;

public static class BreadcrumbRedaction
{
    static readonly Regex Token =
        new Regex(@"([?&](?:token|access_token|api_key)=)[^&\s]+", RegexOptions.IgnoreCase);

    public static void Install()
    {
        BugseeSdk.SetBreadcrumbFilter(crumb =>
        {
            // Drop a whole category.
            if (crumb.Category == "internal")
                return null;

            // Mask tokens in the message.
            if (crumb.Message != null)
                crumb.Message = Token.Replace(crumb.Message, "$1<redacted>");

            // Mask tokens in the URL of an HTTP breadcrumb.
            var data = crumb.Data; // a copy: assign it back after you change it
            if (data != null && data.TryGetValue("url", out var url) && url is string text)
            {
                data["url"] = Token.Replace(text, "$1<redacted>");
                crumb.Data = data;
            }

            return crumb;
        });
    }
}
```

Call `Install()` before `Bugsee.Launch`, and launch with `CaptureBreadcrumbs = true`.

What to know:

- **The network filter does not reach breadcrumbs.** A URL that your [network filter](/sdk/unity/privacy/network) drops or rewrites can still appear in an HTTP request breadcrumb. Repeat your URL rules in the breadcrumb filter.
- **A filter that throws drops the breadcrumb.** The package does not record it unfiltered.
- **Use the breadcrumb you are given.** It is valid only inside the callback. Do not keep it.
- **Passing `null` to `SetBreadcrumbFilter` removes the filter.** Breadcrumbs are then recorded without it.
- **The filter runs on the Unity main thread.** The SDK calls it on its own thread, and the package hands the call to the main thread. While the app is in the background, Unity's loop is paused, and the calls wait until it resumes. The package gives the breadcrumb filter no timeout of its own.
- **Breadcrumbs from before you set the filter are not filtered.** Set the filter before `Bugsee.Launch`.
- **Blackout.** On iOS, gesture, keyboard and focus breadcrumbs are not recorded during a blackout. See [Privacy: Video](/sdk/unity/privacy/video#blackout) and the [iOS page](/sdk/ios/privacy/breadcrumbs).

## Related pages

- [Breadcrumbs](/sdk/unity/breadcrumbs): what is recorded and `AddBreadcrumb`.
- [Privacy: Network](/sdk/unity/privacy/network): the network filter.
- [Privacy overview](/sdk/unity/privacy/overview): every privacy control.
