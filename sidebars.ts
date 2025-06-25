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
				id: "game-scripts/getting-started/index",
			},
			items: [
				// "game-scripts/getting-started/introduction",
				// "game-scripts/getting-started/first-mod",
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
				"game-scripts/core-systems/actions",
				"game-scripts/core-systems/constants",
				"game-scripts/core-systems/cooking",
				"game-scripts/core-systems/recipes",
				"game-scripts/core-systems/tuning",
				// // Entity and Component Systems
				// {
				// 	type: "category",
				// 	label: "Entity and Component Systems",
				// 	className: "sidebar-title",
				// 	collapsed: false,
				// 	collapsible: false,
				// 	items: [
				// 		"game-scripts/core/entity-system",
				// 		"game-scripts/core/component-system",
				// 		"game-scripts/core/component-interactions",
				// 		"game-scripts/core/entityscript",
				// 		"game-scripts/core/event-system",
				// 		"game-scripts/core/stategraph-system",
				// 		"game-scripts/core/tuning",
				// 		"game-scripts/core/animstate-system",
				// 	],
				// },

				// // Network and Communication
				// {
				// 	type: "category",
				// 	label: "Network and Communication",
				// 	className: "sidebar-title",
				// 	collapsed: false,
				// 	collapsible: false,
				// 	items: ["game-scripts/core/network-system", "game-scripts/core/rpc-system"],
				// },

				// // Mod Development
				// {
				// 	type: "category",
				// 	label: "Mod Development",
				// 	className: "sidebar-title",
				// 	collapsed: false,
				// 	collapsible: false,
				// 	items: [
				// 		"game-scripts/core/mod-structure",
				// 		"game-scripts/core/modoverrides",
				// 		"game-scripts/core/server-startup",
				// 		"game-scripts/core/worldstate",
				// 		"game-scripts/core/mod-interaction",
				// 	],
				// },

				// // UI Systems
				// {
				// 	type: "category",
				// 	label: "UI Systems",
				// 	className: "sidebar-title",
				// 	collapsed: false,
				// 	collapsible: false,
				// 	items: [
				// 		"game-scripts/core/ui-system",
				// 		"game-scripts/core/widgets",
				// 		"game-scripts/core/creating-screens",
				// 		"game-scripts/core/ui-events",
				// 	],
				// },
			],
		},

		// {
		// 	type: "category",
		// 	label: "Entity Framework",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "Entity Framework",
		// 		description: "Components of the entity system that define game objects in Don't Starve Together",
		// 	},
		// 	items: ["game-scripts/entity-framework/entityscript", "game-scripts/entity-framework/tags"],
		// },

		// {
		// 	type: "category",
		// 	label: "Global Objects",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "Global Objects",
		// 		description: "Global objects and variables available in Don't Starve Together modding API",
		// 	},
		// 	items: [
		// 		"game-scripts/global-objects/global-objects-overview",
		// 		"game-scripts/global-objects/theworld",
		// 		"game-scripts/global-objects/theplayer",
		// 		"game-scripts/global-objects/thenet",
		// 		"game-scripts/global-objects/thesim",
		// 		"game-scripts/global-objects/global",
		// 	],
		// },
		// {
		// 	type: "html",
		// 	value: "<hr/>",
		// 	className: "sidebar-divider",
		// },
		// {
		// 	type: "category",
		// 	label: "Components",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "Components",
		// 		description: "Component system for entity behaviors in Don't Starve Together",
		// 	},
		// 	items: [
		// 		"game-scripts/components/components-overview",
		// 		"game-scripts/components/combat",
		// 		"game-scripts/components/health",
		// 		"game-scripts/components/inventory",
		// 		"game-scripts/components/weapon",
		// 		"game-scripts/components/temperature",
		// 		"game-scripts/components/hunger",
		// 		"game-scripts/components/sanity",
		// 		"game-scripts/components/burnable",
		// 		"game-scripts/components/cookable",
		// 		"game-scripts/components/workable",
		// 		"game-scripts/components/growable",
		// 		"game-scripts/components/perishable",
		// 		"game-scripts/components/builder",
		// 		"game-scripts/components/container",
		// 		"game-scripts/components/eater",
		// 		"game-scripts/components/edible",
		// 		"game-scripts/components/equippable",
		// 		"game-scripts/components/inspectable",
		// 		"game-scripts/components/locomotor",
		// 		"game-scripts/components/lootdropper",
		// 		"game-scripts/components/stackable",
		// 		"game-scripts/components/trader",
		// 		"game-scripts/components/armor",
		// 		"game-scripts/components/other-components",
		// 		// Add more components as needed
		// 	],
		// },
		// {
		// 	type: "html",
		// 	value: "<hr/>",
		// 	className: "sidebar-divider",
		// },
		// {
		// 	type: "category",
		// 	label: "World",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "World",
		// 		description: "World-related API functionality in Don't Starve Together",
		// 	},
		// 	items: [
		// 		"game-scripts/world/world-overview",
		// 		"game-scripts/world/map",
		// 		"game-scripts/world/seasons",
		// 		"game-scripts/world/network",
		// 		"game-scripts/world/worldgen",
		// 		"game-scripts/world/worldsettings",
		// 	],
		// },

		// {
		// 	type: "category",
		// 	label: "Prefabs",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "Prefabs",
		// 		description: "Templates for creating entities in Don't Starve Together",
		// 	},
		// 	items: [
		// 		"game-scripts/prefabs/prefabs-overview",
		// 		"game-scripts/prefabs/characters",
		// 		"game-scripts/prefabs/creatures",
		// 		"game-scripts/prefabs/items",
		// 		"game-scripts/prefabs/structures",
		// 		// Add more prefab types
		// 	],
		// },

		// {
		// 	type: "category",
		// 	label: "Recipes",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "Recipes",
		// 		description: "Recipe systems for crafting and cooking in Don't Starve Together",
		// 	},
		// 	items: ["game-scripts/recipes/recipes-overview", "game-scripts/recipes/crafting", "game-scripts/recipes/cooking"],
		// },

		// {
		// 	type: "category",
		// 	label: "State Graphs",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "State Graphs",
		// 		description: "State machine system for entity behavior and animations in Don't Starve Together",
		// 	},
		// 	items: [
		// 		"game-scripts/stategraphs/stategraphs-overview",
		// 		"game-scripts/stategraphs/states",
		// 		"game-scripts/stategraphs/events",
		// 		"game-scripts/stategraphs/actionhandlers",
		// 		"game-scripts/stategraphs/commonstates",
		// 		"game-scripts/stategraphs/animation-integration",
		// 		"game-scripts/stategraphs/examples",
		// 	],
		// },

		// {
		// 	type: "category",
		// 	label: "Localization",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "Localization",
		// 		description: "Tools and techniques for implementing multiple language support in Don't Starve Together mods",
		// 	},
		// 	items: [
		// 		"game-scripts/localization/localization-overview",
		// 		"game-scripts/localization/multilingual-support",
		// 		"game-scripts/localization/string-tables",
		// 		"game-scripts/localization/font-handling",
		// 		"game-scripts/localization/best-practices",
		// 		"game-scripts/localization/testing-localization",
		// 	],
		// },

		// {
		// 	type: "category",
		// 	label: "Shared Properties",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "Shared Properties",
		// 		description: "Common properties shared across entities in Don't Starve Together",
		// 	},
		// 	items: [
		// 		"game-scripts/shared-properties/shared-properties-overview",
		// 		"game-scripts/shared-properties/health-properties",
		// 		"game-scripts/shared-properties/interaction-properties",
		// 		"game-scripts/shared-properties/network-properties",
		// 		"game-scripts/shared-properties/transformation-properties",
		// 	],
		// },
		// {
		// 	type: "html",
		// 	value: "<hr/>",
		// 	className: "sidebar-divider",
		// },
		// {
		// 	type: "category",
		// 	label: "Node Types",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "Node Types",
		// 		description: "Node types for creating behaviors and interactions in Don't Starve Together",
		// 	},
		// 	items: [
		// 		"game-scripts/node-types/node-types-overview",
		// 		"game-scripts/node-types/action-nodes",
		// 		"game-scripts/node-types/condition-nodes",
		// 		"game-scripts/node-types/decorator-nodes",
		// 		"game-scripts/node-types/priority-nodes",
		// 		"game-scripts/node-types/sequence-nodes",
		// 		"game-scripts/node-types/brain",
		// 	],
		// },

		// {
		// 	type: "category",
		// 	label: "Data Types",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "Data Types",
		// 		description: "Lua data types used in Don't Starve Together API",
		// 	},
		// 	items: [
		// 		"game-scripts/data-types/data-types-overview",
		// 		"game-scripts/data-types/vector3",
		// 		"game-scripts/data-types/colour",
		// 		"game-scripts/data-types/rect",
		// 		"game-scripts/data-types/anim",
		// 		"game-scripts/data-types/userdata",
		// 	],
		// },

		// {
		// 	type: "category",
		// 	label: "Utils",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "Utils",
		// 		description: "Utility functions available in Don't Starve Together API",
		// 	},
		// 	items: [
		// 		"game-scripts/utils/utils-overview",
		// 		"game-scripts/utils/math",
		// 		"game-scripts/utils/string",
		// 		"game-scripts/utils/table",
		// 		"game-scripts/utils/debug-utils",
		// 		"game-scripts/utils/file-utils",
		// 		"game-scripts/utils/vector",
		// 	],
		// },
		// {
		// 	type: "html",
		// 	value: "<hr/>",
		// 	className: "sidebar-divider",
		// },
		// {
		// 	type: "category",
		// 	label: "Examples",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "Examples",
		// 		description: "Examples of how to use the Don't Starve Together API",
		// 	},
		// 	items: [
		// 		"game-scripts/examples/examples-overview",
		// 		// Mod Examples
		// 		{
		// 			type: "category",
		// 			label: "Mod Examples",
		// 			className: "sidebar-title",
		// 			collapsed: false,
		// 			collapsible: false,
		// 			items: [
		// 				"game-scripts/examples/simple-item",
		// 				"game-scripts/examples/complex-item",
		// 				"game-scripts/examples/character-mod",
		// 				"game-scripts/examples/full-character-example",
		// 				"game-scripts/examples/recipe-mod",
		// 				"game-scripts/examples/custom-recipes",
		// 				"game-scripts/examples/custom-component",
		// 				"game-scripts/examples/ui-mod",
		// 				"game-scripts/examples/custom-ui-elements",
		// 				"game-scripts/examples/custom-stategraphs-and-animations",
		// 				"game-scripts/examples/stategraph-mod",
		// 				"game-scripts/examples/worldgen-mod",
		// 				"game-scripts/examples/custom-world-generation",
		// 				"game-scripts/examples/custom-biomes",
		// 				"game-scripts/examples/custom-creatures",
		// 				"game-scripts/examples/custom-ai",
		// 				"game-scripts/examples/custom-game-mode",
		// 				"game-scripts/examples/custom-weather-effects",
		// 				"game-scripts/examples/optimization",
		// 				"game-scripts/examples/networking-mod",
		// 				"game-scripts/examples/resource-usage",
		// 				"game-scripts/examples/network-optimization",
		// 				"game-scripts/examples/profiling-debugging",
		// 			],
		// 		},
		// 		// Case Studies
		// 		{
		// 			type: "category",
		// 			label: "Case Studies",
		// 			className: "sidebar-title",
		// 			collapsed: false,
		// 			collapsible: false,
		// 			items: [
		// 				"game-scripts/examples/case-geometric",
		// 				"game-scripts/examples/case-wormhole",
		// 				"game-scripts/examples/case-status",
		// 				"game-scripts/examples/case-forge",
		// 				"game-scripts/examples/case-ia-core",
		// 				"game-scripts/examples/case-island-adventures",
		// 				"game-scripts/examples/island-adventures-relationship",
		// 				"game-scripts/examples/case-regorgeitaled",
		// 				"game-scripts/examples/case-global-position",
		// 			],
		// 		},
		// 		// Projects
		// 		{
		// 			type: "category",
		// 			label: "Projects",
		// 			className: "sidebar-title",
		// 			collapsed: false,
		// 			collapsible: false,
		// 			items: [
		// 				"game-scripts/examples/project-tools",
		// 				"game-scripts/examples/project-biome",
		// 				"game-scripts/examples/project-boss",
		// 			],
		// 		},
		// 	],
		// },
		// {
		// 	type: "category",
		// 	label: "Snippets",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "Snippets",
		// 		description: "Snippets of code for common tasks in Don't Starve Together",
		// 	},
		// 	items: [
		// 		"game-scripts/examples/snippets/entity-spawning",
		// 		"game-scripts/examples/snippets/event-handling",
		// 		"game-scripts/examples/snippets/saving-loading",
		// 		"game-scripts/examples/snippets/ui-snippets",
		// 		"game-scripts/examples/snippets/networking-snippets",
		// 		"game-scripts/examples/snippets/component-snippets",
		// 		"game-scripts/examples/snippets/animation-snippets",
		// 		"game-scripts/examples/snippets/prefab-snippets",
		// 	],
		// },
		// {
		// 	type: "html",
		// 	value: "<hr/>",
		// 	className: "sidebar-divider",
		// },
		// {
		// 	type: "category",
		// 	label: "Updates",
		// 	link: {
		// 		type: "doc",
		// 		id: "game-scripts/updates/api-updates",
		// 	},
		// 	items: [
		// 		"game-scripts/updates/api-changelog",
		// 		"game-scripts/updates/mod-release-ids",
		// 		"game-scripts/updates/mod-updating-guide",
		// 		"game-scripts/updates/deprecated-features",
		// 		"game-scripts/updates/backwards-compatibility",
		// 		"game-scripts/updates/migration-guides",
		// 	],
		// },
		// {
		// 	type: "html",
		// 	value: "<hr/>",
		// 	className: "sidebar-divider",
		// },
		// {
		// 	type: "category",
		// 	label: "Debugging and Testing",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "Debugging and Testing",
		// 		description: "Debugging and testing tools for Don't Starve Together",
		// 	},
		// 	items: [
		// 		"game-scripts/debugging-and-testing/debugging-and-testing",
		// 		"game-scripts/debugging-and-testing/testing-environment",
		// 		"game-scripts/debugging-and-testing/troubleshooting-guide",
		// 	],
		// },
		// {
		// 	type: "html",
		// 	value: "<hr/>",
		// 	className: "sidebar-divider",
		// },
		// {
		// 	type: "category",
		// 	label: "Development tools",
		// 	link: {
		// 		type: "generated-index",
		// 		title: "Development tools",
		// 		description: "Development tools for Don't Starve Together",
		// 	},
		// 	items: [
		// 		"game-scripts/development-tools/vscode-setup",
		// 		"game-scripts/development-tools/git-integration",
		// 		"game-scripts/development-tools/useful-extensions",
		// 		"game-scripts/development-tools/cicd-workflow",
		// 		"game-scripts/development-tools/project-management",
		// 	],
		// },
	],
};

export default sidebars;
