import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Don\'t Starve Together Vanilla API',
  tagline: 'DST Vanilla API Documentation v0.5.2',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://vietnd69.github.io', // Thay thế USERNAME bằng username GitHub của bạn
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/dst-api-webdocs/', // Sửa thành tên repository của bạn

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'vietnd69', // Thay thế USERNAME bằng username GitHub của bạn
  projectName: 'dst-api-webdocs', // Thay thế bằng tên repo GitHub của bạn
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Thêm plugins
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html', 'htm'],
        createRedirects: function (existingPath) {
          // Redirect to /docs/introduction from /docs
          if (existingPath.includes('/docs')) {
            return [existingPath.replace('/docs', '')];
          }
          return undefined; // Return undefined if no redirect needed
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'DST Vanilla API Docs v0.5.2',
      logo: {
        alt: 'DST Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'DST Vanilla',
        },
        {
          href: 'https://github.com/vietnd69/dst-api-webdocs', // Cập nhật URL Github repository
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'DST Vanilla',
              to: '/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Klei Forums',
              href: 'https://forums.kleientertainment.com/',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/dst',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/vietnd69/dst-api-webdocs', // Cập nhật URL Github repository
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Don't Starve Together Vanilla API v0.5.2 Docs.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
