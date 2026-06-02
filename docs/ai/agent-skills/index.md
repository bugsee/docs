---
title: "Agent Skills"
description: "Teach your AI coding assistant how to set up and configure Bugsee SDKs in your projects automatically."
sidebar_position: 0
slug: "/ai/agent-skills"
---

# Agent Skills

Agent skills are instruction sets that teach AI coding assistants how to perform specific tasks. Bugsee's official agent skills give your AI assistant the knowledge to set up and configure Bugsee SDKs in your projects with no manual configuration required.

## How It Works

1. Copy the prompt for your platform from the table below
2. Paste it into your AI coding assistant (Claude Code, Cursor, Copilot, Codex, etc.)
3. The assistant downloads the skill, scans your project, and walks you through the setup

The skill files are structured markdown documents that guide AI agents through project detection, dependency installation, SDK initialization, and verification.

## Available Skills

| Platform | Prompt |
|----------|--------|
| **Android** | `Use curl to download, read and follow: https://docs.bugsee.com/ai/agent-skills/sdk/android/SKILL.md` |
| **iOS** | `Use curl to download, read and follow: https://docs.bugsee.com/ai/agent-skills/sdk/ios/SKILL.md` |
| **Flutter** | `Use curl to download, read and follow: https://docs.bugsee.com/ai/agent-skills/sdk/flutter/SKILL.md` |
| **React Native** | `Use curl to download, read and follow: https://docs.bugsee.com/ai/agent-skills/sdk/react-native/SKILL.md` |
| **Unity** | `Use curl to download, read and follow: https://docs.bugsee.com/ai/agent-skills/sdk/unity/SKILL.md` |
| **.NET / MAUI** | `Use curl to download, read and follow: https://docs.bugsee.com/ai/agent-skills/sdk/dotnet/SKILL.md` |
| **Xamarin** | `Use curl to download, read and follow: https://docs.bugsee.com/ai/agent-skills/sdk/xamarin/SKILL.md` |
| **Cordova** | `Use curl to download, read and follow: https://docs.bugsee.com/ai/agent-skills/sdk/cordova/SKILL.md` |
| **KMP** | `Use curl to download, read and follow: https://docs.bugsee.com/ai/agent-skills/sdk/kmp/SKILL.md` |

## Quick Reference: Client Skill Paths

You can also install skills locally so your AI assistant discovers them automatically. Place the `SKILL.md` file in the appropriate path for your client:

| Client | User-Level Path | Project-Level Path |
|--------|----------------|-------------------|
| **Claude Code** | `~/.claude/skills/` | `.claude/skills/` |
| **Codex** | `~/.codex/skills/` | `.codex/skills/` |
| **Copilot** | `~/.copilot/skills/` | `.github/skills/` |
| **Cursor** | `~/.cursor/skills/` | `.cursor/skills/` |
| **OpenCode** | `~/.config/opencode/skill/` | `.opencode/skill/` |
| **AmpCode** | `~/.config/agents/skills/` | `.agents/skills/` |

For example, to install the Android skill for Claude Code at the project level:

```bash
mkdir -p .claude/skills/bugsee-android-sdk
curl -o .claude/skills/bugsee-android-sdk/SKILL.md \
  https://docs.bugsee.com/ai/agent-skills/sdk/android/SKILL.md
```

## What Each Skill Does

Every Bugsee skill follows a consistent 4-phase approach:

1. **Detect** — Scans your project to identify the build system, language, existing dependencies, and entry points
2. **Install** — Adds the Bugsee SDK dependency using your project's package manager
3. **Initialize** — Adds the `Bugsee.launch()` call in the correct location with your app token
4. **Configure** — Optionally customizes SDK behavior (video, network monitoring, crash reporting, etc.)

Each skill also includes a verification step and links to full documentation.
