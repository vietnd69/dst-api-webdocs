import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
	docs: [
		{
			type: "category",
			label: "Getting Started",
			link: {
				type: "doc",
				id: "api-vanilla/getting-started",
			},
			items: [
				{
					type: "category",
					label: "Quick Start",
					className: "sidebar-title",
					collapsed: false,
					collapsible: false,
					items: ["api-vanilla/getting-started/introduction", "api-vanilla/getting-started/installation", "api-vanilla/getting-started/first-mod"],
				},
				{
					type: "category",
					label: "Development Tools",
					className: "sidebar-title",
					collapsed: false,
					collapsible: false,
					items: [
						"api-vanilla/getting-started/vscode-setup",
						"api-vanilla/getting-started/git-integration",
						"api-vanilla/getting-started/useful-extensions",
						"api-vanilla/getting-started/cicd-workflow",
						"api-vanilla/getting-started/project-management",
					],
				},
				{
					type: "category",
					label: "Debugging and Testing",
					className: "sidebar-title",
					collapsed: false,
					collapsible: false,
					items: [
						"api-vanilla/getting-started/debugging-and-testing",
						"api-vanilla/getting-started/testing-environment",
						"api-vanilla/getting-started/troubleshooting-guide",
					],
				},
			],
		},
		{
			type: "html",
			value: "<hr/>",
			className: "sidebar-divider",
		},
		{
			type: "category",
			label: "Core Systems",
			link: {
				type: "generated-index",
				title: "Core Systems",
				description: "Fundamental systems that power the Don't Starve Together game engine and modding API",
			},
			items: [
				// Entity and Component Systems
				{
					type: "category",
					label: "Entity and Component Systems",
					className: "sidebar-title",
					collapsed: false,
					collapsible: false,
					items: [
						"api-vanilla/core/entity-system",
						"api-vanilla/core/component-system",
						"api-vanilla/core/component-interactions",
						"api-vanilla/core/entityscript",
						"api-vanilla/core/event-system",
						"api-vanilla/core/stategraph-system",
					],
				},

				// Network and Communication
				{
					type: "category",
					label: "Network and Communication",
					className: "sidebar-title",
					collapsed: false,
					collapsible: false,
					items: ["api-vanilla/core/network-system", "api-vanilla/core/rpc-system"],
				},

				// Mod Development
				{
					type: "category",
					label: "Mod Development",
					className: "sidebar-title",
					collapsed: false,
					collapsible: false,
					items: [
								"api-vanilla/core/mod-structure",
						"api-vanilla/core/modoverrides",
						"api-vanilla/core/server-startup",
						"api-vanilla/core/worldstate",
						"api-vanilla/core/mod-interaction",
					],
				},

				// UI Systems
				{
					type: "category",
					label: "UI Systems",
					className: "sidebar-title",
					collapsed: false,
					collapsible: false,
					items: ["api-vanilla/core/ui-system", "api-vanilla/core/widgets", "api-vanilla/core/creating-screens", "api-vanilla/core/ui-events"],
				},
			],
		},

		{
			type: "category",
			label: "Entity Framework",
			link: {
				type: "generated-index",
				title: "Entity Framework",
				description: "Components of the entity system that define game objects in Don't Starve Together",
			},
			items: ["api-vanilla/entity-framework/entityscript", "api-vanilla/entity-framework/tags"],
		},

		{
			type: "category",
			label: "Global Objects",
			link: {
				type: "generated-index",
				title: "Global Objects",
				description: "Global objects and variables available in Don't Starve Together modding API",
			},
			items: [
				"api-vanilla/global-objects/global-objects-overview",
				"api-vanilla/global-objects/theworld",
				"api-vanilla/global-objects/theplayer",
				"api-vanilla/global-objects/thenet",
				"api-vanilla/global-objects/thesim",
				"api-vanilla/global-objects/global",
			],
		},
		{
			type: "html",
			value: "<hr/>",
			className: "sidebar-divider",
		},
		{
			type: "category",
			label: "Components",
			link: {
				type: "generated-index",
				title: "Components",
				description: "Component system for entity behaviors in Don't Starve Together",
			},
			items: [
				"api-vanilla/components/components-overview",
				"api-vanilla/components/combat",
				"api-vanilla/components/health",
				"api-vanilla/components/inventory",
				"api-vanilla/components/weapon",
				"api-vanilla/components/temperature",
				"api-vanilla/components/hunger",
				"api-vanilla/components/sanity",
				"api-vanilla/components/burnable",
				"api-vanilla/components/cookable",
				"api-vanilla/components/workable",
				"api-vanilla/components/growable",
				"api-vanilla/components/perishable",
				"api-vanilla/components/builder",
				"api-vanilla/components/container",
				"api-vanilla/components/eater",
				"api-vanilla/components/edible",
				"api-vanilla/components/equippable",
				"api-vanilla/components/inspectable",
				"api-vanilla/components/locomotor",
				"api-vanilla/components/lootdropper",
				"api-vanilla/components/stackable",
				"api-vanilla/components/trader",
				"api-vanilla/components/armor",
				"api-vanilla/components/other-components",
				// Add more components as needed
			],
		},
		{
			type: "html",
			value: "<hr/>",
			className: "sidebar-divider",
		},
		{
			type: "category",
			label: "World",
			link: {
				type: "generated-index",
				title: "World",
				description: "World-related API functionality in Don't Starve Together",
			},
			items: [
				"api-vanilla/world/world-overview",
				"api-vanilla/world/map",
				"api-vanilla/world/seasons",
				"api-vanilla/world/network",
				"api-vanilla/world/worldgen",
				"api-vanilla/world/worldsettings",
			],
		},

		{
			type: "category",
			label: "Prefabs",
			link: {
				type: "generated-index",
				title: "Prefabs",
				description: "Templates for creating entities in Don't Starve Together",
			},
			items: [
					"api-vanilla/prefabs/prefabs-overview",
				"api-vanilla/prefabs/characters",
				"api-vanilla/prefabs/creatures",
				"api-vanilla/prefabs/items",
				"api-vanilla/prefabs/structures",
				// Add more prefab types
			],
		},

		{
			type: "category",
			label: "Recipes",
			link: {
				type: "generated-index",
				title: "Recipes",
				description: "Recipe systems for crafting and cooking in Don't Starve Together",
			},
			items: ["api-vanilla/recipes/recipes-overview", "api-vanilla/recipes/crafting", "api-vanilla/recipes/cooking"],
		},

		{
			type: "category",
			label: "State Graphs",
			link: {
				type: "generated-index",
				title: "State Graphs",
				description: "State machine system for entity behavior and animations in Don't Starve Together",
			},
			items: [
				"api-vanilla/stategraphs/stategraphs-overview",
				"api-vanilla/stategraphs/states",
				"api-vanilla/stategraphs/events",
				"api-vanilla/stategraphs/actionhandlers",
				"api-vanilla/stategraphs/commonstates",
				"api-vanilla/stategraphs/animation-integration",
				"api-vanilla/stategraphs/examples",
			],
		},

		{
			type: "category",
			label: "Localization",
			link: {
				type: "generated-index",
				title: "Localization",
				description: "Tools and techniques for implementing multiple language support in Don't Starve Together mods",
			},
			items: [
				"api-vanilla/localization/localization-overview",
				"api-vanilla/localization/multilingual-support",
				"api-vanilla/localization/string-tables",
				"api-vanilla/localization/font-handling",
				"api-vanilla/localization/best-practices",
				"api-vanilla/localization/testing-localization",
			],
		},

		{
			type: "category",
			label: "Shared Properties",
			link: {
				type: "generated-index",
				title: "Shared Properties",
				description: "Common properties shared across entities in Don't Starve Together",
			},
			items: [
				"api-vanilla/shared-properties/shared-properties-overview",
				"api-vanilla/shared-properties/health-properties",
				"api-vanilla/shared-properties/interaction-properties",
				"api-vanilla/shared-properties/network-properties",
				"api-vanilla/shared-properties/transformation-properties",
			],
		},
		{
			type: "html",
			value: "<hr/>",
			className: "sidebar-divider",
		},
		{
			type: "category",
			label: "Node Types",
			link: {
				type: "generated-index",
				title: "Node Types",
				description: "Node types for creating behaviors and interactions in Don't Starve Together",
			},
			items: [
				"api-vanilla/node-types/node-types-overview",
				"api-vanilla/node-types/action-nodes",
				"api-vanilla/node-types/condition-nodes",
				"api-vanilla/node-types/decorator-nodes",
				"api-vanilla/node-types/priority-nodes",
				"api-vanilla/node-types/sequence-nodes",
			],
		},

		{
			type: "category",
			label: "Data Types",
			link: {
				type: "generated-index",
				title: "Data Types",
				description: "Lua data types used in Don't Starve Together API",
			},
			items: [
				"api-vanilla/data-types/data-types-overview",
				"api-vanilla/data-types/vector3",
				"api-vanilla/data-types/colour",
				"api-vanilla/data-types/rect",
				"api-vanilla/data-types/anim",
				"api-vanilla/data-types/userdata",
			],
		},

		{
			type: "category",
			label: "Utils",
			link: {
				type: "generated-index",
				title: "Utils",
				description: "Utility functions available in Don't Starve Together API",
			},
			items: [
				"api-vanilla/utils/utils-overview",
				"api-vanilla/utils/math-utils",
				"api-vanilla/utils/string-utils",
				"api-vanilla/utils/table-utils",
				"api-vanilla/utils/debug-utils",
				"api-vanilla/utils/file-utils",
			],
		},
		{
			type: "html",
			value: "<hr/>",
			className: "sidebar-divider",
		},
		{
			type: "category",
			label: "Examples",
			link: {
				type: "generated-index",
				title: "Examples",
				description: "Examples of how to use the Don't Starve Together API",
			},
			items: [
				"api-vanilla/examples/examples-overview",
				// Mod Examples
				{
					type: "category",
					label: "Mod Examples",
					className: "sidebar-title",
					collapsed: false,
					collapsible: false,
					items: [
						"api-vanilla/examples/simple-item",
						"api-vanilla/examples/complex-item",
						"api-vanilla/examples/character-mod",
						"api-vanilla/examples/full-character-example",
						"api-vanilla/examples/recipe-mod",
						"api-vanilla/examples/custom-recipes",
						"api-vanilla/examples/custom-component",
						"api-vanilla/examples/ui-mod",
						"api-vanilla/examples/custom-ui-elements",
						"api-vanilla/examples/custom-stategraphs-and-animations",
						"api-vanilla/examples/stategraph-mod",
						"api-vanilla/examples/worldgen-mod",
						"api-vanilla/examples/custom-world-generation",
						"api-vanilla/examples/custom-biomes",
						"api-vanilla/examples/custom-creatures",
						"api-vanilla/examples/custom-ai",
						"api-vanilla/examples/custom-game-mode",
						"api-vanilla/examples/custom-weather-effects",
						"api-vanilla/examples/optimization",
						"api-vanilla/examples/networking-mod",
						"api-vanilla/examples/resource-usage",
						"api-vanilla/examples/network-optimization",
						"api-vanilla/examples/profiling-debugging",
					],
				},
				// Case Studies
				{
					type: "category",
					label: "Case Studies",
					className: "sidebar-title",
					collapsed: false,
					collapsible: false,
					items: [
						"api-vanilla/examples/case-geometric", 
						"api-vanilla/examples/case-wormhole", 
						"api-vanilla/examples/case-status",
						"api-vanilla/examples/case-forge",
						"api-vanilla/examples/case-ia-core",
						"api-vanilla/examples/case-island-adventures",
						"api-vanilla/examples/island-adventures-relationship",
						"api-vanilla/examples/case-regorgeitaled",
						"api-vanilla/examples/case-global-position"
					],
				},
				// Projects
				{
					type: "category",
					label: "Projects",
					className: "sidebar-title",
					collapsed: false,
					collapsible: false,
					items: ["api-vanilla/examples/project-tools", "api-vanilla/examples/project-biome", "api-vanilla/examples/project-boss"],
				},
			],
		},
		{
			type: "category",
			label: "Snippets",
			link: {
				type: "generated-index",
				title: "Snippets",
				description: "Snippets of code for common tasks in Don't Starve Together",
			},
			items: [
				"api-vanilla/examples/snippets/entity-spawning",
				"api-vanilla/examples/snippets/event-handling",
				"api-vanilla/examples/snippets/saving-loading",
				"api-vanilla/examples/snippets/ui-snippets",
				"api-vanilla/examples/snippets/networking-snippets",
				"api-vanilla/examples/snippets/component-snippets",
				"api-vanilla/examples/snippets/animation-snippets",
				"api-vanilla/examples/snippets/prefab-snippets",
			],
		},
		{
			type: "html",
			value: "<hr/>",
			className: "sidebar-divider",
		},
		{
			type: "category",
			label: "Updates",
			link: {
				type: "generated-index",
				title: "Updates",
				description: "Updates to the Don't Starve Together API",
			},
			items: [
				"api-vanilla/getting-started/api-updates",
				"api-vanilla/getting-started/api-changelog",
				"api-vanilla/getting-started/mod-updating-guide",
				"api-vanilla/getting-started/deprecated-features",
				"api-vanilla/getting-started/backwards-compatibility",
				"api-vanilla/getting-started/migration-guides",
			],
		},
	],
};

export default sidebars;
