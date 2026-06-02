---
title: "Security"
description: "How the Bugsee MCP server handles authentication, authorization, and revocation — OAuth 2.1 with PKCE, Dynamic Client Registration, audience-bound tokens, refresh-token rotation."
sidebar_position: 3
slug: "/mcp/security"
---

The Bugsee MCP server is designed to be safe to expose to remote AI clients you don't fully control. This page summarizes how authentication and authorization work, what each token grants, and how to revoke access.

## Read-only by design

All three exported tools (`list_applications`, `list_issues`, `get_issue`) are declared as `readOnlyHint: true` and `destructiveHint: false`. The server has **no** mutating tool surface — there is no way for an MCP client to modify Bugsee data, regardless of which auth flow it used. The value of the connector is entirely in delivering crash and bug context into the agent's conversation.

## Authentication options

### OAuth 2.1 with PKCE (recommended)

The Bugsee MCP server implements the OAuth 2.1 authorization-code flow with PKCE ([RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636)). PKCE protects against authorization-code interception on the client side and is **required** for every client — there is no non-PKCE path.

**Flow at a glance:**

1. The MCP client calls `https://api.bugsee.com/mcp`. The server responds with `401 Unauthorized` and a `WWW-Authenticate` header pointing at the protected-resource metadata.
2. The client fetches OAuth metadata from `/.well-known/oauth-authorization-server` and `/.well-known/oauth-protected-resource/mcp` ([RFC 8414](https://datatracker.ietf.org/doc/html/rfc8414), [RFC 9728](https://datatracker.ietf.org/doc/html/rfc9728)).
3. If the client isn't already registered, it self-registers via Dynamic Client Registration ([RFC 7591](https://datatracker.ietf.org/doc/html/rfc7591)) at `/mcp/oauth/register`. Registration is anonymous and supports public clients (PKCE, no client secret) as well as confidential clients (`client_secret_post`, `client_secret_basic`).
4. The client opens the user's browser at `/mcp/oauth/authorize?...`. The user signs in to Bugsee, sees the requesting application's name, and confirms or denies the connection.
5. On approval, Bugsee redirects back to the client's `redirect_uri` with a short-lived authorization code.
6. The client exchanges the code at `/mcp/oauth/token` (using the PKCE verifier) for an access token and a refresh token.
7. Subsequent MCP calls carry the access token as `Authorization: Bearer ...`.

**Discovery endpoints** the server advertises:

| Endpoint | Purpose |
|---|---|
| `/.well-known/oauth-authorization-server` | Server-wide metadata: supported grant types, scopes, code-challenge methods, etc. ([RFC 8414](https://datatracker.ietf.org/doc/html/rfc8414)) |
| `/.well-known/oauth-protected-resource/mcp` | Resource-server metadata advertising the authorization server ([RFC 9728](https://datatracker.ietf.org/doc/html/rfc9728)) |
| `/mcp/oauth/authorize` | Authorization endpoint (browser) |
| `/mcp/oauth/token` | Token endpoint |
| `/mcp/oauth/register` | Dynamic Client Registration |
| `/mcp/oauth/revoke` | Token revocation ([RFC 7009](https://datatracker.ietf.org/doc/html/rfc7009)) |

**Audience binding (RFC 8707).** Tokens issued for the Bugsee MCP server carry the MCP resource indicator. The server rejects bearer tokens whose audience claim doesn't include it — so a token leaked to another service can't be replayed against Bugsee MCP, and vice-versa.

**Refresh-token rotation.** Each refresh-token exchange returns a brand-new refresh token and invalidates the previous one. If a rotated token is ever presented again, that's treated as a theft signal and the entire token chain — every access and refresh token descended from the original authorization code — is revoked. This is OAuth 2.1 §4.13.1 behavior.

**Lifetimes** (subject to change; check the configured values for your deployment):

- Authorization code: ≤ 60 seconds, single-use
- Access token: ~1 hour
- Refresh token: longer-lived, rotated on each use
- Unused clients (registered via DCR but never completed a sign-in) age out after a configurable TTL via a MongoDB index

### Personal access tokens

The `/mcp/<token>` URL form is a long-lived bearer-token shortcut for clients that don't speak OAuth. The token is created and revoked from the Bugsee dashboard at **My Integrations**. Treat it exactly like a password — it grants the same access as your account.

Personal tokens do not refresh, do not rotate, and have no audience binding. We recommend OAuth wherever the client supports it.

## Scopes

The Bugsee MCP server currently exposes one scope:

| Scope | Grants |
|---|---|
| `mcp:read` | Read access to the three MCP tools, scoped to the user's accessible applications. Equivalent to what the user sees in the Bugsee dashboard. |

`mcp:read` is the default and only scope. Future scopes will be additive and explicitly requested by clients.

## Where granted access is visible and revocable

From the Bugsee dashboard, open **My Integrations** in the user menu, or visit [app.bugsee.com/#/settings/user/integrations](https://app.bugsee.com/#/settings/user/integrations). Two lists are shown:

- **OAuth sessions** — every client that's currently connected via OAuth. Each entry shows the application name supplied at registration, the date of the most recent approval, and a **Revoke** action. Revoking immediately invalidates the access token and any pending refresh token; the client will be challenged to re-authenticate.
- **Personal tokens** — every personal access token you've created. Each entry shows the title you gave it, creation date, and a **Revoke** action.

Revocation is immediate. There is no grace period.

## Threat model summary

- **Stolen access token** → bounded by its short TTL (~1h) and audience binding; only usable against the Bugsee MCP resource.
- **Stolen refresh token** → the next legitimate refresh will detect rotation reuse and revoke the entire chain.
- **Stolen authorization code** → protected by PKCE (single-use, requires the verifier); replay revokes the resulting chain.
- **Stolen personal token** → grants full read access until revoked; the user must rotate manually. Prefer OAuth.
- **Compromised registered client** → revoke from the dashboard; the client will need to re-register and re-authorize.

If you suspect a compromise, revoke the affected session or token from **My Integrations**, then rotate any other credentials that may have been exposed in the same incident.
