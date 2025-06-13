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
				id: "getting-started",
			},
			items: [
				"api-vanilla/getting-started/introduction",
				"api-vanilla/getting-started/installation",
				"api-vanilla/getting-started/first-mod",
				"api-vanilla/getting-started/debugging-and-testing",
				"api-vanilla/getting-started/api-updates",
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
				{type: "html", value: "<p>Entity and Component Systems</p>", className: "sidebar-title"},
				"api-vanilla/core/entity-system",
				"api-vanilla/core/component-system",
				"api-vanilla/core/entityscript",
				"api-vanilla/core/event-system",
				"api-vanilla/core/stategraph-system",
				
				// Network and Communication
				{type: "html", value: "<p>Network and Communication</p>", className: "sidebar-title"},
				"api-vanilla/core/network-system",
				"api-vanilla/core/rpc-system",
				
				// Mod Development
				{type: "html", value: "<p>Mod Development</p>", className: "sidebar-title"},
				"api-vanilla/core/mod-structure",
				"api-vanilla/core/modoverrides",
				"api-vanilla/core/server-startup",
				"api-vanilla/core/constants",
				"api-vanilla/core/worldstate",
				
				// UI Systems
				{type: "html", value: "<p>UI Systems</p>", className: "sidebar-title"},
				"api-vanilla/core/ui-system",
				"api-vanilla/core/widgets",
				"api-vanilla/core/creating-screens",
				"api-vanilla/core/ui-events",
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
				"api-vanilla/examples/simple-item",
				"api-vanilla/examples/character-mod",
				"api-vanilla/examples/recipe-mod",
				"api-vanilla/examples/custom-component",
				"api-vanilla/examples/ui-mod",
				"api-vanilla/examples/stategraph-mod",
				"api-vanilla/examples/worldgen-mod",
				"api-vanilla/examples/optimization",
				"api-vanilla/examples/networking-mod",
				"api-vanilla/examples/case-geometric",
				"api-vanilla/examples/case-wormhole",
				"api-vanilla/examples/case-status",
				"api-vanilla/examples/project-tools",
				"api-vanilla/examples/project-biome",
				"api-vanilla/examples/project-boss"
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
			]
		},
	],
};

export default sidebars;
