---
title: "Other agents"
description: "Use Bugsee with Cursor and any other MCP- or skills-capable AI coding assistant — install the agent skills and connect the MCP server."
sidebar_position: 4
slug: "/ai/plugins/other-agents"
---

# Bugsee plugin for other agents

Any assistant that supports agent skills or the Model Context Protocol can use Bugsee. The two building blocks are the same everywhere: install the **skills** so the assistant knows how to set up and debug Bugsee, and connect the **MCP server** so it can read your issues.

## Cursor

The [bugsee-for-ai](https://github.com/bugsee/bugsee-for-ai) repository includes a Cursor plugin manifest (`.cursor-plugin/`); the skills and MCP configuration live at the repository root and are picked up by Cursor. To connect the Bugsee MCP server in Cursor directly, follow the Cursor steps in [MCP configuration](/mcp/configuration).

## Any skills-capable client

Install a skill by placing its `SKILL.md` in your client's skills directory. The [Agent Skills](/ai/agent-skills) page lists the per-client paths (Claude Code, Codex, Copilot, Cursor, OpenCode, and more) and the download URL for every platform. For example:

```bash
mkdir -p .claude/skills/bugsee-android-sdk
curl -o .claude/skills/bugsee-android-sdk/SKILL.md \
  https://docs.bugsee.com/ai/agent-skills/sdk/android/SKILL.md
```

## Any MCP-capable client

Connect the read-only Bugsee MCP server (`https://api.bugsee.com/mcp`) to read your applications and issues. [MCP configuration](/mcp/configuration) has per-client setup for Claude Desktop, Cursor, Windsurf, VS Code, Cline, Zencoder, and Antigravity, plus the OAuth and personal-token flows for anything else.

## What you get

Once the skills and MCP server are in place, ask your assistant to *"add Bugsee to my app"*, *"fix Bugsee issue MYAPP-123"*, or *"upload my dSYMs to Bugsee"*. See [Plugins](/ai/plugins) for the full picture.
