import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Wrapper SDKs share one layout: an installation page and a privacy section.
const wrapperSdks = ['cordova', 'dotnet', 'flutter', 'kmp', 'react_native', 'unity', 'xamarin'];

const config: Config = {
  title: 'Bugsee',
  tagline: 'Documentation',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://docs.bugsee.com',
  baseUrl: '/',
  trailingSlash: true,

  // Fail the build (and the PR check) on a dead internal link or #anchor instead of warning:
  // with 'warn' a broken /sdk/... link reached production unnoticed. Old URLs that must keep working
  // belong in the client-redirects list below, not in content.
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',

  markdown: {
    format: 'detect',
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://app.bugsee.com' } },
    { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
    { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' } },
    { tagName: 'link', attributes: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap' } },
    { tagName: 'meta', attributes: { name: 'google-site-verification', content: 'pSQYyObzOo2o2ch9t0rRUGMYzIsh7AfP50AK0PRVw5Q' } },
  ],

  scripts: [
    {
      src: 'https://embed.tawk.to/620e8c80a34c24564126d396/1fs4d9lsb',
      async: true,
      charset: 'UTF-8',
      crossorigin: '*',
    },
  ],

  clientModules: [
    './src/clientModules/sessionSync.js',
    './src/clientModules/tokenReplacer.js',
    './src/clientModules/mobileTable.js',
    './src/clientModules/chatLink.js',
    './src/clientModules/aiPageActions.js',
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsRouteBasePath: '/',
        indexBlog: false,
      },
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // Section roots have no page of their own; send them to the first page.
          { from: '/sdk/ios', to: '/sdk/ios/installation/' },
          { from: '/sdk/ios/v7', to: '/sdk/ios/v7/installation/' },
          { from: '/sdk/ios/builds', to: '/sdk/ios/builds/overview/' },
          { from: '/sdk/ios/privacy', to: '/sdk/ios/privacy/overview/' },
          { from: '/sdk/android', to: '/sdk/android/overview/' },
          { from: '/sdk/android/manual', to: '/sdk/android/manual/bug-reporting/' },
          { from: '/sdk/android/privacy', to: '/sdk/android/privacy/overview/' },
          { from: '/sdk/android/v6', to: '/sdk/android/v6/installation/' },
          { from: '/sdk/android/v6/privacy', to: '/sdk/android/v6/privacy/overview/' },
          ...wrapperSdks.flatMap((sdk) => [
            { from: `/sdk/${sdk}`, to: `/sdk/${sdk}/installation/` },
            { from: `/sdk/${sdk}/privacy`, to: `/sdk/${sdk}/privacy/overview/` },
          ]),
          // Android pages that were split or renamed.
          { from: '/sdk/android/custom', to: '/sdk/android/events-and-traces/' },
          { from: '/sdk/android/crashes', to: '/sdk/android/issue-detection/crashes/' },
          { from: '/sdk/android/gradle-plugin-releases', to: '/sdk/android/gradle-plugin/releases/' },
          { from: '/sdk/android/v7', to: '/sdk/android/overview/' },
          { from: '/sdk/android/v7/privacy', to: '/sdk/android/privacy/overview/' },
          { from: '/sdk/android/v7/custom', to: '/sdk/android/events-and-traces/' },
          { from: '/sdk/android/v7/crashes', to: '/sdk/android/issue-detection/crashes/' },
          { from: '/sdk/android/v7/detection', to: '/sdk/android/issue-detection/' },
          { from: '/sdk/android/v7/extensions', to: '/sdk/android/extensibility/bugsee-extensions/' },
          { from: '/sdk/android/v7/manual', to: '/sdk/android/manual/bug-reporting/' },
        ],
        // Android 7.x lived under /sdk/android/v7/ until it became the default;
        // every current Android page keeps answering at its old v7 address.
        createRedirects(existingPath: string) {
          if (existingPath.startsWith('/sdk/android/') && !existingPath.startsWith('/sdk/android/v6/')) {
            return existingPath.replace('/sdk/android/', '/sdk/android/v7/');
          }
          return undefined;
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Docs',
      logo: {
        alt: 'Bugsee Logo',
        src: 'img/bugsee_logo.svg',
        href: '/',
        target: '_self',
      },
      style: 'dark',
      items: [
        { to: '/cli/', label: 'CLI', position: 'left' },
        { href: 'https://bugsee.com/pricing/', label: 'Pricing', position: 'left' },
        { href: 'https://bugsee.com/faq/', label: 'FAQ', position: 'left' },
        { href: 'https://bugsee.com/blog/is-bugsee-any-good/', label: 'Is Bugsee Any Good?', position: 'left' },
        {
          href: 'https://app.bugsee.com/#/login?as=demo',
          label: 'Live demo',
          position: 'right',
        },
        {
          href: 'https://app.bugsee.com/#/signin',
          label: 'Login',
          position: 'right',
        },
        {
          href: 'https://app.bugsee.com/#/signup',
          label: 'Free Sign Up',
          position: 'right',
          className: 'navbar-signup-link',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Products',
          items: [
            { label: 'Bugsee for iOS', to: '/sdk/ios/installation/' },
            { label: 'Bugsee for Android', to: '/sdk/android/installation/' },
            { label: 'Bugsee for Cordova', to: '/sdk/cordova/installation/' },
            { label: 'Bugsee for React Native', to: '/sdk/react_native/installation/' },
            { label: 'Bugsee for Xamarin', to: '/sdk/xamarin/installation/' },
            { label: 'Bugsee for .NET/MAUI', to: '/sdk/dotnet/installation/' },
            { label: 'Bugsee for Flutter', to: '/sdk/flutter/installation/' },
            { label: 'Bugsee for Unity', to: '/sdk/unity/installation/' },
          ],
        },
        {
          title: 'Learn',
          items: [
            { label: 'About', href: 'https://bugsee.com/about/' },
            { label: 'FAQ', href: 'https://bugsee.com/faq/' },
            { label: 'Documentation', to: '/' },
            { label: 'Blog', href: 'https://bugsee.com/blog/' },
          ],
        },
        {
          title: 'Contact',
          items: [
            { label: 'Email', href: 'mailto:support@bugsee.com' },
            {
              label: 'Chat',
              href: 'https://bugsee.com/',
              className: 'bs-toggle-chat',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            { label: 'Privacy Policy', href: 'https://bugsee.com/privacy/' },
            { label: 'Terms of Service', href: 'https://bugsee.com/tos/' },
          ],
        },
      ],
      copyright: `\u00A9 ${new Date().getFullYear()} Bugsee Inc | All rights reserved`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'java', 'kotlin', 'swift', 'objectivec', 'csharp', 'dart', 'groovy', 'json', 'yaml', 'ruby', 'xml-doc'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
