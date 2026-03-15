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
	onDuplicateRoutes: "warn",

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: "en",
		locales: ["en"],
	},
	markdown: {
		hooks: {
			onBrokenMarkdownLinks: "warn",
		},
	},

	// Thêm plugins
	plugins: [
		[
			"@docusaurus/plugin-client-redirects",
			{
				// fromExtensions: ["html", "htm"],
				// redirects: [
				// 	// Removed the root redirect as it's handled by index.tsx
				// ],
				// createRedirects: function (existingPath) {
				// 	// Redirect to /docs/introduction from /docs
				// 	if (existingPath.includes("/")) {
				// 		return [existingPath.replace("docs/getting-started/about-game-scripts", "")];
				// 	}
				// 	return undefined; // Return undefined if no redirect needed
				// },
			},
		],
		[
			"@docusaurus/plugin-google-tag-manager",
			{
				containerId: "GTM-P6HHVZPW",
			},
		],
		function sitemapHeadPlugin() {
			return {
				name: "sitemap-head-plugin",
				injectHtmlTags() {
					return {
						headTags: [
							{
								tagName: "link",
								attributes: {
									rel: "sitemap",
									type: "application/xml",
									title: "Sitemap",
									href: "https://vietnd69.github.io/dst-api-webdocs/sitemap.xml",
								},
							},
						],
					};
				},
			};
		},
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

	themes: [
		[
			require.resolve("@easyops-cn/docusaurus-search-local"),
			{
				// Bật tính năng băm (hash) để tránh lỗi cache trình duyệt khi bạn update docs
				hashed: true,

				// Vì web của bạn có vẻ nhắm tới người Việt, nên thêm "vi" để search tốt hơn
				language: ["en"],

				// Cấu hình vùng cần index dữ liệu
				indexDocs: true,
				indexBlog: false, // Đổi thành true nếu web bạn có phần Blog
				indexPages: true,

				// Tùy chọn giao diện (nếu muốn)
				highlightSearchTermsOnTargetPage: true, // Bôi vàng từ khóa khi click vào bài
				searchBarShortcut: true, // Hiển thị hint phím tắt
				searchBarPosition: "right", // Vị trí thanh search
			},
		],
	],

	themeConfig: {
		// Replace with your project's social card
		image: "img/docusaurus-social-card.png",
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
							to: "/docs/getting-started/about-game-scripts",
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
			defaultMode: "dark",
			disableSwitch: false,
			respectPrefersColorScheme: true,
		},

		metadata: [
			{ name: "description", content: "Comprehensive API documentation for Don't Starve Together game scripts, components, and modding tools." },
			{ name: "robots", content: "index, follow" },
		],
	} satisfies Preset.ThemeConfig,
};

export default config;
