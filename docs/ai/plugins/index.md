---
title: "Plugins"
description: "Install the Bugsee plugin in Claude Code, Cursor, Codex, and other AI coding assistants — one install adds Bugsee's agent skills and connects the MCP server."
sidebar_position: 1
slug: "/ai/plugins"
---

# Plugins

The Bugsee plugin gives your AI coding assistant everything it needs to work with Bugsee in a single install: the official **agent skills** (SDK setup wizards and debugging workflows) plus a connection to the **Bugsee MCP server**. It is open source at [github.com/bugsee/bugsee-for-ai](https://github.com/bugsee/bugsee-for-ai).

## What the plugin provides

- **SDK setup skills** — opinionated wizards for iOS, Android (and Android 7.x beta), Flutter, React Native, Unity, .NET/MAUI, Xamarin, Cordova, and Kotlin Multiplatform. Your assistant detects the platform and walks through install, initialization, and configuration. See [Agent Skills](/ai/agent-skills).
- **Workflow skills** — *fix issues* (triage and root-cause crashes, errors, and bug reports through the MCP server), *build insights* (build size, regressions, and dependency vulnerabilities through the MCP server), and *upload symbols* (dSYMs, JavaScript source maps, Android mapping files).
- **MCP server** — connects your assistant to your Bugsee issues and builds at `https://api.bugsee.com/mcp`. See [MCP](/mcp).

## Supported clients

| Client | Guide |
|--------|-------|
| **Claude Code** | [Install in Claude Code](/ai/plugins/claude-code) |
| **Codex** | [Install in Codex](/ai/plugins/codex) |
| **Cursor & other agents** | [Install in other agents](/ai/plugins/other-agents) |

Any MCP- or skills-capable assistant can use Bugsee — the [Other agents](/ai/plugins/other-agents) guide covers the general approach.

## What you can do once it's installed

Ask your assistant things like:

- *"Add Bugsee to my app."*
- *"Fix Bugsee issue MYAPP-123."*
- *"Triage the top crashes in my latest release."*
- *"Upload my dSYMs to Bugsee so this stack trace is readable."*

The assistant loads the matching skill, scans your project (or fetches the issue from the MCP server), and walks you through the rest.
