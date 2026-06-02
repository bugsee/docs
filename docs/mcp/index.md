---
title: "Overview"
description: "Overview of the Bugsee MCP server — a Model Context Protocol integration that gives AI agents and code assistants like Claude, Cursor, Windsurf, and VS Code full context on your Bugsee issues and builds."
sidebar_position: 0
slug: "/mcp"
---

The [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol) is a standardized protocol designed to facilitate communication and context sharing between AI agents and external services. It is especially useful for code assistants and chat-based AI tools that benefit from accessing a shared understanding of user intent, session state, and operational context.

## Bugsee MCP server

The Bugsee MCP server gives any MCP-aware AI agent secure, scoped access to your Bugsee data — issues (crashes, errors, and user-submitted bug reports) and builds (app/install size, dependency changes, build-timing regressions, and dependency vulnerabilities) — without the developer leaving the agent's chat or editor. Combined with a code assistant that has access to your local source tree, this enables an end-to-end workflow: the agent fetches the issue or build, reads the stack trace or regression, locates the relevant files, and proposes a fix in the same conversation.

## What you can do with it

- **Triage**: ask the agent which crashes are spiking, blocking the most users, or newly appearing in a specific app version.
- **Root-cause analysis**: pull a single issue with its stack trace and surrounding log entries, and have the agent map it to source files and explain the failure.
- **Regression hunting**: diff issues across releases to spot what's new in the next build.
- **Bug-report to PR**: turn a user-submitted bug report into a proposed code change without leaving the IDE.
- **Build health**: check a build's app/install size, see what a release added or removed, and catch size, dependency, or build-timing regressions against the baseline.
- **Dependency vulnerabilities**: read a build's vulnerability-scan summary and the diff versus the previous scan, or queue a fresh scan.

See [Usage](/mcp/usage) for concrete example prompts.

## Supported clients

The Bugsee MCP server works with any MCP client that supports HTTP transport. Tested clients include:

- Claude Desktop (via Connectors)
- Cursor
- Windsurf
- Visual Studio Code (GitHub Copilot Chat)
- Cline
- Zencoder
- Antigravity

[Configuration](/mcp/configuration) has per-client setup instructions.

## Authentication

Bugsee supports two ways for an MCP client to authenticate:

- **OAuth 2.1 with PKCE** (recommended). Most modern MCP clients support this — they prompt the user to sign in to Bugsee in the browser, the user approves access, and the client receives a scoped, rotated access token. No long-lived secret lives on the user's machine. See [Security](/mcp/security) for details.
- **Personal access token**. For clients that don't yet support OAuth, you can generate a long-lived personal token from the Bugsee dashboard and paste it into the client config. Treat it as a password.

Both modes resolve to the same set of tools and the same data your account already has access to. Most tools are read-only; the only mutating tool today (`trigger_build_vuln_scan`) requires `modify` permission on the target application.

## Availability

The Bugsee MCP server is generally available to all Bugsee users at no additional cost.
