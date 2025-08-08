import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
	title: "Don't Starve Together Vanilla API",
	tagline: "Don't Starve Together Vanilla API Documentation v0.5.2",
	favicon: "img/favicon.ico",

	// Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
	future: {
		v4: true, // Improve compatibility with the upcoming Docusaurus v4
	},

	// Set the production url of your site here
	url: "https://vietnd69.github.io", // Thay thế USERNAME bằng username GitHub của bạn
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: "/dst-api-webdocs/", // Sửa thành tên repository của bạn

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: "vietnd69", // Thay thế USERNAME bằng username GitHub của bạn
	projectName: "dst-api-webdocs", // Thay thế bằng tên repo GitHub của bạn
	trailingSlash: false,
	deploymentBranch: "gh-pages",

	onBrokenLinks: "ignore",
	onBrokenMarkdownLinks: "warn",
	onDuplicateRoutes: "warn",

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: "en",
		locales: ["en"],
	},

	// Thêm plugins
	plugins: [
		[
			"@docusaurus/plugin-client-redirects",
			{
				fromExtensions: ["html", "htm"],
				redirects: [
					// Removed the root redirect as it's handled by index.tsx
				],
				createRedirects: function (existingPath) {
					// Redirect to /docs/introduction from /docs
					if (existingPath.includes("docs/game-scripts/getting-started/about-game-scripts")) {
						return [existingPath.replace("docs/game-scripts/getting-started/about-game-scripts", "")];
					}
					return undefined; // Return undefined if no redirect needed
				},
			},
		],
		[
			'@docusaurus/plugin-google-tag-manager',
			{
			  containerId: 'GTM-P6HHVZPW',
			},
		  ],
	],

	presets: [
		[
			"classic",
			{
				docs: {
					sidebarPath: "./sidebars.ts",
					routeBasePath: "docs",
				},
				blog: false,
				theme: {
					customCss: "./src/css/custom.css",
				},
				sitemap: {
					changefreq: "weekly",
					priority: 0.5,
					ignorePatterns: ["/tags/**", "/pages/**"],
					filename: "sitemap.xml",
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		// Replace with your project's social card
		image: "img/docusaurus-social-card.jpg",
		navbar: {
			logo: {
				alt: "Don't Starve Together Logo",
				src: "img/logo.png",
			},
			items: [
				{
					type: "docSidebar",
					sidebarId: "docs",
					position: "left",
					label: "Game Scripts",
				},
				{
					href: "https://github.com/vietnd69/dst-api-webdocs", // Cập nhật URL Github repository
					label: "GitHub Docs",
					position: "right",
				},
				{
					href: "https://github.com/vietnd69/dst-scripts", // Cập nhật URL Github repository
					label: "Base Game Scripts Code",
					position: "right",
				},
			],
		},
		footer: {
			style: "dark",
			links: [
				{
					title: "Docs",
					items: [
						{
							label: "DST Vanilla",
							// Sử dụng đường dẫn tương đối so với baseUrl
							// Docusaurus sẽ tự động thêm baseUrl vào đường dẫn này
							to: "/docs/game-scripts/getting-started/about-game-scripts",
						},
					],
				},
				{
					title: "Community",
					items: [
						{
							label: "Klei Forums",
							href: "https://forums.kleientertainment.com/",
						},
					],
				},
				{
					title: "More",
					items: [
						{
							label: "Contribute",
							href: "https://github.com/vietnd69/dst-api-webdocs", // Cập nhật URL Github repository
						},
						{
							label: "Game Scripts",
							href: "https://github.com/vietnd69/dst-scripts",
						},
						{
							label: "Sitemap",
							href: "https://vietnd69.github.io/dst-api-webdocs/sitemap.xml",
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} Don't Starve Together Vanilla API v2.0.0 Docs.`,
		},
		prism: {
			theme: require("prism-react-renderer").themes.github,
			darkTheme: require("prism-react-renderer").themes.dracula,
			additionalLanguages: ["lua"],
		},
		// Thêm cấu hình theo dõi theme hệ thống
		colorMode: {
			defaultMode: "light",
			disableSwitch: false,
			respectPrefersColorScheme: true,
		},
		// Thêm cấu hình Algolia DocSearch
		algolia: {
			// Các giá trị này sẽ được cung cấp sau khi đăng ký với DocSearch
			appId: "P9GA1YAAFR",
			apiKey: "5f8489e3578120b54de886d560f78022",
			indexName: "dst-docs crawl",

			// Các thiết lập tuỳ chọn
			contextualSearch: true,
			searchPagePath: "search",
		},
	} satisfies Preset.ThemeConfig,
};

export default config;
