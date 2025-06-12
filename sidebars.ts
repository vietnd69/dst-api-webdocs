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
				type: "generated-index",
				title: "Getting Started with DST API",
				description: "Learn the basics of Don't Starve Together API",
			},
			items: [
				"getting-started",
				"api-vanilla/getting-started/introduction",

				// Add other getting started docs here
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
				description: "Fundamental systems that power the Don't Starve Together game engine",
			},
			items: [
				"api-vanilla/core-systems/entity-system",
				"api-vanilla/core-systems/component-system",
				"api-vanilla/core-systems/event-system",
				"api-vanilla/core-systems/stategraph-system",
				"api-vanilla/core-systems/network-system",
			],
		},
		{
			type: "html",
			value: "<hr/>",
			className: "sidebar-divider",
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
			type: "html",
			value: "<hr/>",
			className: "sidebar-divider",
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
			label: "Core Concepts",
			link: {
				type: "generated-index",
				title: "Core API Concepts",
				description: "Core functionality of the Don't Starve Together API",
			},
			items: [
				"api-vanilla/core/entityscript",
				"api-vanilla/core/event-system",
				"api-vanilla/core/constants",
				"api-vanilla/core/server-startup",
				"api-vanilla/core/mod-structure",
				"api-vanilla/core/modoverrides",
				"api-vanilla/core/component-system",
				"api-vanilla/core/worldstate",
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
			type: "html",
			value: "<hr/>",
			className: "sidebar-divider",
		},
		{
			type: "category",
			label: "Recipes",
			link: {
				type: "generated-index",
				title: "Recipes",
				description: "Recipe systems for crafting and cooking in Don't Starve Together",
			},
			items: [
				"api-vanilla/recipes/recipes-overview",
				"api-vanilla/recipes/crafting",
				"api-vanilla/recipes/cooking",
			],
		},
		{
			type: "html",
			value: "<hr/>",
			className: "sidebar-divider",
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
				"api-vanilla/stategraphs/examples",
			],
		},
		{
			type: "html",
			value: "<hr/>",
			className: "sidebar-divider",
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
				"api-vanilla/shared-properties/transform",
				"api-vanilla/shared-properties/network",
				"api-vanilla/shared-properties/tags",
			],
		},
		{
			type: "html",
			value: "<hr/>",
			className: "sidebar-divider",
		},
		{
			type: "category",
			label: "Utility Functions",
			link: {
				type: "generated-index",
				title: "Utility Functions",
				description: "Helper functions and utilities for Don't Starve Together modding",
			},
			items: [
				"api-vanilla/utils/utils-overview",
				"api-vanilla/utils/vector",
				"api-vanilla/utils/string",
				"api-vanilla/utils/table",
				"api-vanilla/utils/math",
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
				description: "Different node types that make up the game architecture in Don't Starve Together",
			},
			items: [
				"api-vanilla/node-types/node-types-overview",
				"api-vanilla/node-types/entity",
				"api-vanilla/node-types/component",
				"api-vanilla/node-types/prefab",
				"api-vanilla/node-types/brain",
				"api-vanilla/node-types/stategraph",
				"api-vanilla/node-types/widget",
				"api-vanilla/node-types/network",
			],
		},
		{
			type: "html",
			value: "<hr/>",
			className: "sidebar-divider",
		},
		{
			type: "category",
			label: "Data Types",
			link: {
				type: "generated-index",
				title: "Data Types",
				description: "Data types used in the Don't Starve Together API",
			},
			items: [
				"api-vanilla/data-types/data-types-overview",
				"api-vanilla/data-types/vector",
				"api-vanilla/data-types/colour",
				"api-vanilla/data-types/netvar",
				"api-vanilla/data-types/luatable",
			],
		}
	],
};

export default sidebars;
