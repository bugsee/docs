---
title: "Claude Code"
description: "Install the Bugsee plugin in Claude Code to set up SDKs and debug Bugsee issues without leaving your terminal."
sidebar_position: 2
slug: "/ai/plugins/claude-code"
---

# Bugsee plugin for Claude Code

Install the Bugsee plugin in Claude Code to add Bugsee's agent skills and connect the MCP server in one step.

## Install

Add the Bugsee marketplace, then install the plugin:

```bash
/plugin marketplace add bugsee/bugsee-for-ai
/plugin install bugsee@bugsee-plugin-marketplace
```

That's it — Claude Code now has the Bugsee SDK-setup and workflow skills, and the read-only Bugsee MCP server (`https://api.bugsee.com/mcp`) is configured.

## Connect the MCP server

The first time your assistant calls a Bugsee MCP tool, Claude Code asks you to authorize the connection. Sign in to Bugsee and approve it once (OAuth), or use a personal access token. See [MCP configuration](/mcp/configuration) for both flows.

## Use it

Ask Claude Code in natural language:

- *"Add Bugsee to this app"* — it detects your platform, then runs the matching [SDK setup skill](/ai/agent-skills).
- *"Fix Bugsee issue MYAPP-123"* — it pulls the issue from the MCP server, maps the stack trace to your code, and proposes a fix.
- *"Triage the open crashes in my latest release"* — it lists and ranks issues, then deep-dives the worst.
- *"Upload my dSYMs to Bugsee"* — it walks through making your release's stack traces readable.

## What's included

- **SDK setup skills** for every supported platform.
- **Workflow skills**: `bugsee-fix-issues` (uses the MCP server) and `bugsee-upload-symbols`.
- **MCP server** access to your Bugsee applications and issues (read-only).

See [Plugins](/ai/plugins) for the full list, or browse the source at [github.com/bugsee/bugsee-for-ai](https://github.com/bugsee/bugsee-for-ai).
