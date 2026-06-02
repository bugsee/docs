# Bugsee Documentation

Source for the Bugsee documentation site, built with
[Docusaurus 3](https://docusaurus.io/) and TypeScript. Covers the SDKs for 8 platforms
(iOS, Android, React Native, Cordova, Flutter, Unity, .NET/MAUI, Xamarin), dashboard
features, 30+ integration providers, webhooks, and MCP.

## Prerequisites

- Node.js >= 20

## Local development

```bash
npm install
npm start          # dev server with live reload on http://localhost:8000
```

## Build

```bash
npm run build      # production build → build/
npm run serve      # serve the built site locally
```

## Spell check

```bash
npx cspell "docs/**/*.md" "docs/**/*.mdx" --no-cache -c cspell.json
```

Add valid product/technical terms to `cspell.json`; fix genuine misspellings.

## Contributing

Documentation pages live under `docs/`, organized by section. Navigation is defined
explicitly in `sidebars.ts` — new pages must be added there. Use `.mdx` for files with
`<Tabs>`/`<TabItem>` components and `.md` for plain Markdown.

## Contact

- Website: [bugsee.com](https://bugsee.com)
- Email: [support@bugsee.com](mailto:support@bugsee.com)

## License

[MIT](LICENSE)
