---
title: "Codex"
description: "Use the Bugsee plugin with OpenAI Codex — add Bugsee's agent skills and connect the MCP server."
sidebar_position: 3
slug: "/ai/plugins/codex"
---

# Bugsee plugin for Codex

The Bugsee repository is a Codex plugin: it ships a `.codex-plugin/plugin.json` manifest, and Codex discovers the bundled agent skills from `skills/` and the MCP server from `.mcp.json` at the repository root.

## Add the skills

The quickest way to give Codex Bugsee's skills is to drop them into its skills directory. Codex auto-discovers skills in `~/.codex/skills/` (user-level) or `.codex/skills/` (project-level). For example, to add the iOS skill:

```bash
mkdir -p ~/.codex/skills/bugsee-ios-sdk
curl -o ~/.codex/skills/bugsee-ios-sdk/SKILL.md \
  https://docs.bugsee.com/ai/agent-skills/sdk/ios/SKILL.md
```

Repeat for any platform you need, or point Codex at the [bugsee-for-ai](https://github.com/bugsee/bugsee-for-ai) repository to pick up the whole bundle through Codex's plugin mechanism. The full list of skills and their paths is on the [Agent Skills](/ai/agent-skills) page.

## Connect the MCP server

Add the read-only Bugsee MCP server to your Codex configuration (`~/.codex/config.toml`) so the assistant can read your issues. Use the OAuth URL `https://api.bugsee.com/mcp`, or the personal-token URL `https://api.bugsee.com/mcp/<token>` for unattended setups. See [MCP configuration](/mcp/configuration) for how to generate a token and the security model.

## Use it

Ask Codex to *"add Bugsee to my app"*, *"fix Bugsee issue MYAPP-123"*, or *"upload my dSYMs to Bugsee"* — it loads the matching skill, scans your project (or fetches the issue from the MCP server), and walks you through the rest.

See [Plugins](/ai/plugins) for what's included, or the source at [github.com/bugsee/bugsee-for-ai](https://github.com/bugsee/bugsee-for-ai).
