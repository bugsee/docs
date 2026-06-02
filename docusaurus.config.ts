import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

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

  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',

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
              href: '#chat',
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
