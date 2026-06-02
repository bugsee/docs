#!/usr/bin/env bash
set -euo pipefail

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPTS_DIR")"

cd "$PROJECT_DIR"

# Spell check
echo "Running spell check..."
if command -v bun &> /dev/null; then
  bun x cspell "$PROJECT_DIR/docs/**/*.md" "$PROJECT_DIR/docs/**/*.mdx" \
    --no-cache -c "$PROJECT_DIR/cspell.json"
else
  npx --yes cspell "$PROJECT_DIR/docs/**/*.md" "$PROJECT_DIR/docs/**/*.mdx" \
    --no-cache -c "$PROJECT_DIR/cspell.json"
fi

npm install

# Sync agent skill files from docs/ to static/ (strips Docusaurus frontmatter)
echo "Syncing agent skill files..."
node "$SCRIPTS_DIR/sync-skills.mjs"

# Build
echo "Building Docusaurus site..."
npm run build

# Copy raw Markdown files into build/ for AI agents
echo "Copying raw Markdown files..."
node "$SCRIPTS_DIR/copy-raw-markdown.mjs"

echo "Build complete! Output in $PROJECT_DIR/build/"
