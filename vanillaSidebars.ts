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

 const vanillaSidebars: SidebarsConfig = {
	vanilla: [
		{
			type: "category",
			label: "Getting Started",
			link: {
				type: "doc",
				id: "getting-started",
			},
			items:[]
		}
		]
	}

// const vanillaSidebars: SidebarsConfig = {
// 	vanilla: [
// 		{
// 			type: "category",
// 			label: "Getting Started",
// 			link: {
// 				type: "doc",
// 				id: "getting-started",
// 			},
// 			items: [
// 				{
// 					type: "category",
// 					label: "Quick Start",
// 					className: "sidebar-title",
// 					collapsed: false,
// 					collapsible: false,
// 					items: [
// 						"getting-started/introduction",
// 						"getting-started/installation",
// 						"getting-started/first-mod",
// 					],
// 				},
// 				{
// 					type: "category",
// 					label: "Development Tools",
// 					className: "sidebar-title",
// 					collapsed: false,
// 					collapsible: false,
// 					items: [
// 						"getting-started/vscode-setup",
// 						"getting-started/git-integration",
// 						"getting-started/useful-extensions",
// 						"getting-started/cicd-workflow",
// 						"getting-started/project-management",
// 					],
// 				},
// 				{
// 					type: "category",
// 					label: "Debugging and Testing",
// 					className: "sidebar-title",
// 					collapsed: false,
// 					collapsible: false,
// 					items: [
// 						"getting-started/debugging-and-testing",
// 						"getting-started/testing-environment",
// 						"getting-started/troubleshooting-guide",
// 					],
// 				},
// 			],
// 		},
// 		{
// 			type: "html",
// 			value: "<hr/>",
// 			className: "sidebar-divider",
// 		},
// 		{
// 			type: "category",
// 			label: "Core Systems",
// 			link: {
// 				type: "generated-index",
// 				title: "Core Systems",
// 				description: "Fundamental systems that power the Don't Starve Together game engine and modding API",
// 			},
// 			items: [
// 				// Entity and Component Systems
// 				{
// 					type: "category",
// 					label: "Entity and Component Systems",
// 					className: "sidebar-title",
// 					collapsed: false,
// 					collapsible: false,
// 					items: [
// 						"core/entity-system",
// 						"core/component-system",
// 						"core/component-interactions",
// 						"core/entityscript",
// 						"core/event-system",
// 						"core/stategraph-system",
// 					],
// 				},

// 				// Network and Communication
// 				{
// 					type: "category",
// 					label: "Network and Communication",
// 					className: "sidebar-title",
// 					collapsed: false,
// 					collapsible: false,
// 					items: ["core/network-system", "core/rpc-system"],
// 				},

// 				// Mod Development
// 				{
// 					type: "category",
// 					label: "Mod Development",
// 					className: "sidebar-title",
// 					collapsed: false,
// 					collapsible: false,
// 					items: [
// 						"core/mod-structure",
// 						"core/modoverrides",
// 						"core/server-startup",
// 						"core/constants",
// 						"core/worldstate",
// 						"core/mod-interaction",
// 					],
// 				},

// 				// UI Systems
// 				{
// 					type: "category",
// 					label: "UI Systems",
// 					className: "sidebar-title",
// 					collapsed: false,
// 					collapsible: false,
// 					items: [
// 						"core/ui-system",
// 						"core/widgets",
// 						"core/creating-screens",
// 						"core/ui-events",
// 					],
// 				},
// 			],
// 		},

// 		{
// 			type: "category",
// 			label: "Entity Framework",
// 			link: {
// 				type: "generated-index",
// 				title: "Entity Framework",
// 				description: "Components of the entity system that define game objects in Don't Starve Together",
// 			},
// 			items: ["entity-framework/entityscript", "entity-framework/tags"],
// 		},

// 		{
// 			type: "category",
// 			label: "Global Objects",
// 			link: {
// 				type: "generated-index",
// 				title: "Global Objects",
// 				description: "Global objects and variables available in Don't Starve Together modding API",
// 			},
// 			items: [
// 				"global-objects/global-objects-overview",
// 				"global-objects/theworld",
// 				"global-objects/theplayer",
// 				"global-objects/thenet",
// 				"global-objects/thesim",
// 				"global-objects/global",
// 			],
// 		},
// 		{
// 			type: "html",
// 			value: "<hr/>",
// 			className: "sidebar-divider",
// 		},
// 		{
// 			type: "category",
// 			label: "Components",
// 			link: {
// 				type: "generated-index",
// 				title: "Components",
// 				description: "Component system for entity behaviors in Don't Starve Together",
// 			},
// 			items: [
// 				"components/components-overview",
// 				"components/combat",
// 				"components/health",
// 				"components/inventory",
// 				"components/weapon",
// 				"components/temperature",
// 				"components/hunger",
// 				"components/sanity",
// 				"components/burnable",
// 				"components/cookable",
// 				"components/workable",
// 				"components/growable",
// 				"components/perishable",
// 				"components/builder",
// 				"components/container",
// 				"components/eater",
// 				"components/edible",
// 				"components/equippable",
// 				"components/inspectable",
// 				"components/locomotor",
// 				"components/lootdropper",
// 				"components/stackable",
// 				"components/trader",
// 				"components/armor",
// 				"components/other-components",
// 				// Add more components as needed
// 			],
// 		},
// 		{
// 			type: "html",
// 			value: "<hr/>",
// 			className: "sidebar-divider",
// 		},
// 		{
// 			type: "category",
// 			label: "World",
// 			link: {
// 				type: "generated-index",
// 				title: "World",
// 				description: "World-related API functionality in Don't Starve Together",
// 			},
// 			items: [
// 				"world/world-overview",
// 				"world/map",
// 				"world/seasons",
// 				"world/network",
// 				"world/worldgen",
// 				"world/worldsettings",
// 			],
// 		},

// 		{
// 			type: "category",
// 			label: "Prefabs",
// 			link: {
// 				type: "generated-index",
// 				title: "Prefabs",
// 				description: "Templates for creating entities in Don't Starve Together",
// 			},
// 			items: [
// 				"prefabs/prefabs-overview",
// 				"prefabs/characters",
// 				"prefabs/creatures",
// 				"prefabs/items",
// 				"prefabs/structures",
// 				// Add more prefab types
// 			],
// 		},

// 		{
// 			type: "category",
// 			label: "Recipes",
// 			link: {
// 				type: "generated-index",
// 				title: "Recipes",
// 				description: "Recipe systems for crafting and cooking in Don't Starve Together",
// 			},
// 			items: ["recipes/recipes-overview", "recipes/crafting", "recipes/cooking"],
// 		},

// 		{
// 			type: "category",
// 			label: "State Graphs",
// 			link: {
// 				type: "generated-index",
// 				title: "State Graphs",
// 				description: "State machine system for entity behavior and animations in Don't Starve Together",
// 			},
// 			items: [
// 				"stategraphs/stategraphs-overview",
// 				"stategraphs/states",
// 				"stategraphs/events",
// 				"stategraphs/actionhandlers",
// 				"stategraphs/commonstates",
// 				"stategraphs/animation-integration",
// 				"stategraphs/examples",
// 			],
// 		},

// 		{
// 			type: "category",
// 			label: "Localization",
// 			link: {
// 				type: "generated-index",
// 				title: "Localization",
// 				description: "Tools and techniques for implementing multiple language support in Don't Starve Together mods"
// 			},
// 			items: [
// 				"localization/localization-overview",
// 				"localization/multilingual-support",
// 				"localization/string-tables",
// 				"localization/font-handling",
// 				"localization/best-practices",
// 				"localization/testing-localization"
// 			],
// 		},

// 		{
// 			type: "category",
// 			label: "Shared Properties",
// 			link: {
// 				type: "generated-index",
// 				title: "Shared Properties",
// 				description: "Common properties shared across entities in Don't Starve Together",
// 			},
// 			items: [
// 				"shared-properties/shared-properties-overview",
// 				"shared-properties/health-properties",
// 				"shared-properties/interaction-properties",
// 				"shared-properties/network-properties",
// 				"shared-properties/transformation-properties",
// 			],
// 		},
// 		{
// 			type: "html",
// 			value: "<hr/>",
// 			className: "sidebar-divider",
// 		},
// 		{
// 			type: "category",
// 			label: "Node Types",
// 			link: {
// 				type: "generated-index",
// 				title: "Node Types",
// 				description: "Node types for creating behaviors and interactions in Don't Starve Together",
// 			},
// 			items: [
// 				"node-types/node-types-overview",
// 				"node-types/action-nodes",
// 				"node-types/condition-nodes",
// 				"node-types/decorator-nodes",
// 				"node-types/priority-nodes",
// 				"node-types/sequence-nodes",
// 			],
// 		},

// 		{
// 			type: "category",
// 			label: "Data Types",
// 			link: {
// 				type: "generated-index",
// 				title: "Data Types",
// 				description: "Lua data types used in Don't Starve Together API",
// 			},
// 			items: [
// 				"data-types/data-types-overview",
// 				"data-types/vector3",
// 				"data-types/colour",
// 				"data-types/rect",
// 				"data-types/anim",
// 				"data-types/userdata",
// 			],
// 		},

// 		{
// 			type: "category",
// 			label: "Utils",
// 			link: {
// 				type: "generated-index",
// 				title: "Utils",
// 				description: "Utility functions available in Don't Starve Together API",
// 			},
// 			items: [
// 				"utils/utils-overview",
// 				"utils/math-utils",
// 				"utils/string-utils",
// 				"utils/table-utils",
// 				"utils/debug-utils",
// 				"utils/file-utils",
// 			],
// 		},
// 		{
// 			type: "html",
// 			value: "<hr/>",
// 			className: "sidebar-divider",
// 		},
// 		{
// 			type: "category",
// 			label: "Examples",
// 			link: {
// 				type: "generated-index",
// 				title: "Examples",
// 				description: "Examples of how to use the Don't Starve Together API",
// 			},
// 			items: [
// 				"examples/examples-overview",
// 				// Mod Examples
// 				{
// 					type: "category",
// 					label: "Mod Examples",
// 					className: "sidebar-title",
// 					collapsed: false,
// 					collapsible: false,
// 					items: [
// 						"examples/simple-item",
// 						"examples/complex-item",
// 						"examples/character-mod",
// 						"examples/full-character-example",
// 						"examples/recipe-mod",
// 						"examples/custom-recipes",
// 						"examples/custom-component",
// 						"examples/ui-mod",
// 						"examples/custom-ui-elements",
// 						"examples/custom-stategraphs-and-animations",
// 						"examples/stategraph-mod",
// 						"examples/worldgen-mod",
// 						"examples/optimization",
// 						"examples/networking-mod",
// 						"examples/resource-usage",
// 						"examples/network-optimization",
// 						"examples/profiling-debugging",
// 					],
// 				},
// 				// Case Studies
// 				{
// 					type: "category",
// 					label: "Case Studies",
// 					className: "sidebar-title",
// 					collapsed: false,
// 					collapsible: false,
// 					items: [
// 						"examples/case-geometric",
// 						"examples/case-wormhole",
// 						"examples/case-status",
// 					],
// 				},
// 				// Projects
// 				{
// 					type: "category",
// 					label: "Projects",
// 					className: "sidebar-title",
// 					collapsed: false,
// 					collapsible: false,
// 					items: [
// 						"examples/project-tools",
// 						"examples/project-biome",
// 						"examples/project-boss",
// 					],
// 				},
// 			],
// 		},
// 		{
// 			type: "category",
// 			label: "Snippets",
// 			link: {
// 				type: "generated-index",
// 				title: "Snippets",
// 				description: "Snippets of code for common tasks in Don't Starve Together",
// 			},
// 			items: [
// 				"examples/snippets/entity-spawning",
// 				"examples/snippets/event-handling",
// 				"examples/snippets/saving-loading",
// 				"examples/snippets/ui-snippets",
// 				"examples/snippets/networking-snippets",
// 				"examples/snippets/component-snippets",
// 				"examples/snippets/animation-snippets",
// 				"examples/snippets/prefab-snippets",
// 			],
// 		},
// 		{
// 			type: "html",
// 			value: "<hr/>",
// 			className: "sidebar-divider",
// 		},
// 		{
// 			type: "category",
// 			label: "Updates",
// 			link: {
// 				type: "generated-index",
// 				title: "Updates",
// 				description: "Updates to the Don't Starve Together API",
// 			},
// 			items: [
// 				"getting-started/api-updates",
// 				"getting-started/api-changelog",
// 				"getting-started/mod-updating-guide",
// 				"getting-started/deprecated-features",
// 				"getting-started/backwards-compatibility",
// 				"getting-started/migration-guides",
// 			],
// 		},
// 	],
	
// };

export default vanillaSidebars;
