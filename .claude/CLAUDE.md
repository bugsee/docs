# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bugsee documentation site (https://docs.bugsee.com/), built with **Docusaurus 3.9** and TypeScript. Documents SDKs for 8 platforms (iOS, Android, React Native, Cordova, Flutter, Unity, .NET/MAUI, Xamarin), dashboard features, 30+ integration providers, webhooks, and MCP.

## Commands

```bash
npm start                         # Dev server with live reload
npm run build                     # Production build → build/
npm run serve                     # Serve built site locally
npm run clear                     # Clear Docusaurus cache
npm run typecheck                 # TypeScript validation
scripts/build.sh                  # Full CI build: spellcheck → build → copy raw markdown
scripts/deploy.sh                 # Manual deploy fallback: sync build/ to S3 + invalidate CloudFront
npx cspell "docs/**/*.md" "docs/**/*.mdx" --no-cache -c cspell.json  # Spell check only
```

## Deployment & Git remote

- **Remote**: `origin` → `https://github.com/bugsee/docs` (public GitHub repo, canonical). Push here.
- **Push target**: do all work on **`main`** and push to `origin main` — there is no separate release branch.
- **Auto-deploy**: every push to `main` runs `.github/workflows/deploy.yml`, which builds the site, syncs `build/` to the production S3 bucket, and invalidates CloudFront. AWS access uses GitHub OIDC (keyless); the bucket name, distribution ID, region, and deploy-role ARN live in GitHub Actions **secrets/variables**, never in the repo.
- **Manual run**: the workflow also supports `workflow_dispatch` — trigger it from the **Actions** tab or with `gh workflow run "Build and Deploy"`.
- **Manual deploy (fallback)**: run `scripts/build.sh` then `scripts/deploy.sh` with `S3CMD_CONFIG`, `DEPLOY_ENDPOINT`, and `CLOUDFRONT_ID` set locally.

## Workflow Rules

- **Spell check after every change**: After making any content change, run `npx cspell "docs/**/*.md" "docs/**/*.mdx" --no-cache -c cspell.json` and ensure it reports no issues. If it flags a word, either add the term to `cspell.json` (when it's a valid product/technical term) or fix the actual misspelling. Do not consider a change complete until spell check passes clean.

## Architecture

### Configuration
- **docusaurus.config.ts** — Site config: navbar, footer, plugins, themes, Prism languages, client modules
- **sidebars.ts** — Explicit navigation structure (not auto-generated)
- **cspell.json** — Spell checker dictionary with Bugsee-specific terms
- **tsconfig.json** — Extends `@docusaurus/tsconfig`, IDE support only

### Content (`docs/`)
All markdown content, organized by section:
- `sdk/<platform>/` — 8 platform SDKs, each with consistent sub-pages
- `integrations/providers/` — 30+ integration providers
- `dashboard/`, `mcp/`, `webhooks/`, `tools/` — Other sections
- `index.md` — Home page with feature comparison table

### Customizations (`src/`)
- **css/custom.css** — Theme stylesheet with CSS custom properties, light/dark mode, responsive breakpoints (996px navbar, 800px tables)
- **clientModules/** — 5 JS modules injected via `onRouteDidUpdate()`:
  - `sessionSync.js` — iframe session sync with app.bugsee.com, Gravatar, auth UI
  - `tokenReplacer.js` — Replaces `<your_app_token>` in code blocks from cookies
  - `mobileTable.js` — Adds `data-title` attributes for responsive tables
  - `chatLink.js` — Tawk.to chat toggle handler
  - `aiPageActions.js` — "Copy page" split button: copy raw markdown, view as markdown, open in ChatGPT/Claude

### Build Pipeline (`scripts/`)
- **build.sh** — Runs spell check → `npm run build` → `node scripts/copy-raw-markdown.mjs`
- **deploy.sh** — Manual fallback deploy: S3 sync + CloudFront invalidation (requires `S3CMD_CONFIG`, `DEPLOY_ENDPOINT`, `CLOUDFRONT_ID` env vars). CI normally deploys automatically on every push to `main` — see **Deployment & Git remote**.
- **copy-raw-markdown.mjs** — Post-build: copies docs to `build/` as raw `.md` files for AI agents. Strips JSX from `.mdx` files (`<Tabs>` → bold labels), simplifies front matter to title/description/url only
- **migrate-content.mjs** — One-time MkDocs → Docusaurus migration script (already run, kept for reference)

### Static Assets (`static/`)
- `img/` — Logos, favicons, platform icons, screenshots
- Referenced in docs as `/img/...` (not `/static/img/`)

## Key Conventions

- **File extensions**: `.mdx` for files with `<Tabs>`/`<TabItem>` JSX components; `.md` for plain markdown
- **Front matter**: All files have `title`, `description`, `sidebar_position`, and `slug` fields
- **URLs**: Trailing slashes enabled (`/sdk/ios/installation/`)
- **Admonitions**: `:::warning` and `:::info` syntax
- **Tab groups**: Use `<Tabs groupId="lang-ios">` with `<TabItem>` for multi-language code blocks
- **Navigation**: Defined in `sidebars.ts` — new pages must be added there
- **Search**: Local client-side via `@easyops-cn/docusaurus-search-local`
- **Raw Markdown**: Every page is available as `.md` at its URL (e.g., `/sdk/ios/installation.md`) for AI agent consumption
- **Node**: Requires Node.js >= 20
