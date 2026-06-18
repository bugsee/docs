---
title: "Exit codes & telemetry"
description: "The Bugsee CLI's exit-code contract and the single uploader header it sends."
sidebar_position: 9
slug: "/cli/exit-codes"
---

# Exit codes & telemetry

## Exit-code contract

The CLI's exit codes are a stable contract. Build-system integrations use them
to decide whether to fall back to their own in-language uploader when the CLI
can't do the job.

| Code | Meaning | Caller should fall back? |
|---|---|---|
| `0` | Success — uploaded, server reports already-exists, or a resolver returned empty/null output. | n/a |
| `1` | Unexpected / unhandled error. | **yes** |
| `2` | Usage / argv error (likely a plugin ↔ CLI version mismatch). | **yes** |
| `10–19` | Input / discovery problems (file not found, unparseable format). | no |
| `20–29` | Configuration problems (bad token, invalid flags). | no |
| `30–39` | Upload problems (network, server 4xx/5xx). | no |
| `40` | Size-check failed (the `xcode post-action` in-build size gate). | no |

The fallback rule: codes ≤ `2` mean the CLI never got a fair chance to run, so a
caller may retry with its own uploader; codes ≥ `10` are substantive failures
the in-language uploader would hit the same way, so falling back would just
fail again.

## Resolvers exit 0 even on "no result"

The metadata resolvers (`vcs-metadata`, `ios-deps collect`, `build-env *`,
`dsym *`) return exit **0** even when they find nothing useful. Callers
distinguish "no result" from "tool error" by checking the **JSON shape** — an
empty list, an empty object, or a specific field's absence — not the exit code.

This lets integrators invoke the CLI without branching on the return code and
simply parse stdout:

```bash
deps="$(bugsee-cli ios-deps collect --project-root .)"
# inspect $deps as JSON; an empty entries list means "nothing found", not "error"
```

## Telemetry header

The CLI reports nothing about your usage. The only self-identifying signal it
sends is a single HTTP header on metadata `POST`s:

```
X-Bugsee-Uploader: cli
```

The in-language fallback uploaders send a different value of the same header, so
the backend can count CLI-vs-fallback usage without any change to customer code.

The header is **not** added to the presigned storage `PUT` — that signature is
bound to a specific header set, and the storage backend would reject extras with
a signature mismatch.
