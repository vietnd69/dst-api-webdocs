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
			items: ["game-scripts/getting-started/index", "game-scripts/getting-started/about-game-scripts"],
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
				// Tổ chức lồng category theo đúng cấu trúc thư mục core-systems
				{
					type: "doc",
					id: "game-scripts/core-systems/core-systems-overview",
				},
				{
					type: "category",
					label: "Character Systems",
					link: { type: "doc", id: "game-scripts/core-systems/character-systems/character-systems-overview" },
					items: [
						"game-scripts/core-systems/character-systems/character-systems-overview",
						{
							type: "category",
							label: "Core",
							link: { type: "doc", id: "game-scripts/core-systems/character-systems/core/character-systems-core" },
							items: [
								"game-scripts/core-systems/character-systems/core/character-systems-core",
								"game-scripts/core-systems/character-systems/core/characterutil",
								"game-scripts/core-systems/character-systems/core/playerdeaths",
								"game-scripts/core-systems/character-systems/core/playerhistory",
								"game-scripts/core-systems/character-systems/core/playerprofile",
							],
						},
						{
							type: "category",
							label: "Customization",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/character-systems/customization/character-customization-overview",
							},
							items: [
								"game-scripts/core-systems/character-systems/customization/character-customization-overview",
								"game-scripts/core-systems/character-systems/customization/bebeefalo-clothing",
								"game-scripts/core-systems/character-systems/customization/clothing",
								"game-scripts/core-systems/character-systems/customization/skin-affinity-info",
								"game-scripts/core-systems/character-systems/customization/skin-assets",
								"game-scripts/core-systems/character-systems/customization/skin-gifts",
								"game-scripts/core-systems/character-systems/customization/skin-set-info",
								"game-scripts/core-systems/character-systems/customization/skins-defs-data",
								"game-scripts/core-systems/character-systems/customization/skinsfiltersutils",
								"game-scripts/core-systems/character-systems/customization/skinstradeutils",
								"game-scripts/core-systems/character-systems/customization/skinsutils",
							],
						},
						{
							type: "category",
							label: "Emotes",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/character-systems/emotes/character-emotes-overview",
							},
							items: [
								"game-scripts/core-systems/character-systems/emotes/character-emotes-overview",
								"game-scripts/core-systems/character-systems/emotes/emote-items",
								"game-scripts/core-systems/character-systems/emotes/emotes",
								"game-scripts/core-systems/character-systems/emotes/emoji-items",
							],
						},
						{
							type: "category",
							label: "Progression",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/character-systems/progression/progression-overview",
							},
							items: [
								"game-scripts/core-systems/character-systems/progression/progression-overview",
								"game-scripts/core-systems/character-systems/progression/progressionconstants",
								"game-scripts/core-systems/character-systems/progression/skilltreedata",
								"game-scripts/core-systems/character-systems/progression/wx78-moduledefs",
								"game-scripts/core-systems/character-systems/progression/wxputils",
							],
						},
						{
							type: "category",
							label: "Speech",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/character-systems/speech/speech-systems-overview",
							},
							items: [
								"game-scripts/core-systems/character-systems/speech/speech-systems-overview",
								"game-scripts/core-systems/character-systems/speech/speech-webber",
								"game-scripts/core-systems/character-systems/speech/speech-wendy",
								"game-scripts/core-systems/character-systems/speech/speech-wickerbottom",
								"game-scripts/core-systems/character-systems/speech/speech-willow",
								"game-scripts/core-systems/character-systems/speech/speech-wilson",
								"game-scripts/core-systems/character-systems/speech/speech-winona",
								"game-scripts/core-systems/character-systems/speech/speech-wolfgang",
								"game-scripts/core-systems/character-systems/speech/speech-woodie",
								"game-scripts/core-systems/character-systems/speech/speech-wormwood",
								"game-scripts/core-systems/character-systems/speech/speech-wortox",
								"game-scripts/core-systems/character-systems/speech/speech-wurt",
								"game-scripts/core-systems/character-systems/speech/speech-wx78",
								"game-scripts/core-systems/character-systems/speech/speech-walter",
								"game-scripts/core-systems/character-systems/speech/speech-wanda",
								"game-scripts/core-systems/character-systems/speech/speech-warly",
								"game-scripts/core-systems/character-systems/speech/speech-wathgrithr",
								"game-scripts/core-systems/character-systems/speech/speech-waxwell",
							],
						},
					],
				},
				{
					type: "category",
					label: "Data Management",
					link: { type: "doc", id: "game-scripts/core-systems/data-management/data-management-overview" },
					items: [
						{
							type: "category",
							label: "Assets",
							link: { type: "doc", id: "game-scripts/core-systems/data-management/assets/assets-overview" },
							items: [
								"game-scripts/core-systems/data-management/assets/assets-overview",
								"game-scripts/core-systems/data-management/assets/json",
								"game-scripts/core-systems/data-management/assets/klump",
								"game-scripts/core-systems/data-management/assets/klump_files",
								"game-scripts/core-systems/data-management/assets/mixes",
								"game-scripts/core-systems/data-management/assets/preloadsounds",
							],
						},
						{
							type: "category",
							label: "Saves",
							link: { type: "doc", id: "game-scripts/core-systems/data-management/saves/saves-overview" },
							items: [
								"game-scripts/core-systems/data-management/saves/saves-overview",
								"game-scripts/core-systems/data-management/saves/savefileupgrades",
								"game-scripts/core-systems/data-management/saves/saveindex",
								"game-scripts/core-systems/data-management/saves/scrapbook-partitions",
								"game-scripts/core-systems/data-management/saves/shardsaveindex",
							],
						},
						{
							type: "category",
							label: "Utilities",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/data-management/utilities/data-management-utilities-overview",
							},
							items: [
								"game-scripts/core-systems/data-management/utilities/data-management-utilities-overview",
								"game-scripts/core-systems/data-management/utilities/platformpostload",
								"game-scripts/core-systems/data-management/utilities/scheduler",
								"game-scripts/core-systems/data-management/utilities/traps",
							],
						},
					],
				},
				{
					type: "category",
					label: "Development Tools",
					link: { type: "doc", id: "game-scripts/core-systems/development-tools/development-tools-overview" },
					items: [
						{
							type: "category",
							label: "Console",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/development-tools/console/console-tools-overview",
							},
							items: [
								"game-scripts/core-systems/development-tools/console/console-tools-overview",
								"game-scripts/core-systems/development-tools/console/consolecommands",
								"game-scripts/core-systems/development-tools/console/reload",
							],
						},
						{
							type: "category",
							label: "Debugging",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/development-tools/debugging/debugging-tools-overview",
							},
							items: [
								"game-scripts/core-systems/development-tools/debugging/debugging-tools-overview",
								"game-scripts/core-systems/development-tools/debugging/debugcommands",
								"game-scripts/core-systems/development-tools/debugging/debughelpers",
								"game-scripts/core-systems/development-tools/debugging/debugkeys",
								"game-scripts/core-systems/development-tools/debugging/debugmenu",
								"game-scripts/core-systems/development-tools/debugging/debugprint",
								"game-scripts/core-systems/development-tools/debugging/debugsounds",
								"game-scripts/core-systems/development-tools/debugging/debugtools",
								"game-scripts/core-systems/development-tools/debugging/inspect",
								"game-scripts/core-systems/development-tools/debugging/stacktrace",
							],
						},
						{
							type: "category",
							label: "Profiling",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/development-tools/profiling/profiling-tools-overview",
							},
							items: [
								"game-scripts/core-systems/development-tools/profiling/profiling-tools-overview",
								"game-scripts/core-systems/development-tools/profiling/mixer",
								"game-scripts/core-systems/development-tools/profiling/profiler",
							],
						},
						{
							type: "category",
							label: "Utilities",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/development-tools/utilities/development-utilities-overview",
							},
							items: [
								"game-scripts/core-systems/development-tools/utilities/development-utilities-overview",
								"game-scripts/core-systems/development-tools/utilities/dumper",
								"game-scripts/core-systems/development-tools/utilities/fix-character-strings",
								"game-scripts/core-systems/development-tools/utilities/generickv",
								"game-scripts/core-systems/development-tools/utilities/knownerrors",
								"game-scripts/core-systems/development-tools/utilities/strict",
							],
						},
					],
				},
				{
					type: "category",
					label: "Fundamentals",
					link: { type: "doc", id: "game-scripts/core-systems/fundamentals/fundamentals-overview" },
					items: [
						{
							type: "category",
							label: "Core",
							link: { type: "doc", id: "game-scripts/core-systems/fundamentals/core/fundamentals-core-overview" },
							items: [
								"game-scripts/core-systems/fundamentals/core/fundamentals-core-overview",
								"game-scripts/core-systems/fundamentals/core/class",
								"game-scripts/core-systems/fundamentals/core/entityreplica",
								"game-scripts/core-systems/fundamentals/core/entityscript",
								"game-scripts/core-systems/fundamentals/core/entityscriptproxy",
								"game-scripts/core-systems/fundamentals/core/metaclass",
								"game-scripts/core-systems/fundamentals/core/standardcomponents",
							],
						},
						{
							type: "category",
							label: "Utilities",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/fundamentals/utilities/fundamentals-utilities-overview",
							},
							items: [
								"game-scripts/core-systems/fundamentals/utilities/fundamentals-utilities-overview",
								"game-scripts/core-systems/fundamentals/utilities/componentutil",
								"game-scripts/core-systems/fundamentals/utilities/fileutil",
								"game-scripts/core-systems/fundamentals/utilities/mathutil",
								"game-scripts/core-systems/fundamentals/utilities/perfutil",
								"game-scripts/core-systems/fundamentals/utilities/simutil",
								"game-scripts/core-systems/fundamentals/utilities/stringutil",
								"game-scripts/core-systems/fundamentals/utilities/util",
								"game-scripts/core-systems/fundamentals/utilities/vec3util",
								"game-scripts/core-systems/fundamentals/utilities/vector3",
								"game-scripts/core-systems/fundamentals/utilities/vecutil",
							],
						},
						{
							type: "category",
							label: "AI Systems",
							link: { type: "doc", id: "game-scripts/core-systems/fundamentals/ai-systems/ai-systems-overview" },
							items: [
								"game-scripts/core-systems/fundamentals/ai-systems/ai-systems-overview",
								"game-scripts/core-systems/fundamentals/ai-systems/behaviourtree",
								"game-scripts/core-systems/fundamentals/ai-systems/brain",
								"game-scripts/core-systems/fundamentals/ai-systems/stategraph",
							],
						},
						{
							type: "category",
							label: "Actions",
							link: { type: "doc", id: "game-scripts/core-systems/fundamentals/actions/actions-overview" },
							items: [
								"game-scripts/core-systems/fundamentals/actions/actions-overview",
								"game-scripts/core-systems/fundamentals/actions/actions",
								"game-scripts/core-systems/fundamentals/actions/bufferedaction",
								"game-scripts/core-systems/fundamentals/actions/componentactions",
								"game-scripts/core-systems/fundamentals/actions/equipslotutil",
							],
						},
					],
				},
				{
					type: "category",
					label: "Game Configuration",
					link: { type: "doc", id: "game-scripts/core-systems/game-configuration/game-configuration-overview" },
					items: [
						"game-scripts/core-systems/game-configuration/game-configuration-overview",
						{
							type: "category",
							label: "Game Configuration",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/game-configuration/modes/game-configuration-modes-overview",
							},
							items: [
								"game-scripts/core-systems/game-configuration/modes/game-configuration-modes-overview",
								"game-scripts/core-systems/game-configuration/modes/events",
								"game-scripts/core-systems/game-configuration/modes/gamelogic",
								"game-scripts/core-systems/game-configuration/modes/gamemodes",
							],
						},
						{
							type: "category",
							label: "Game Configuration",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/game-configuration/settings/game-configuration-settings-overview",
							},
							items: [
								"game-scripts/core-systems/game-configuration/settings/game-configuration-settings-overview",
								"game-scripts/core-systems/game-configuration/settings/config",
								"game-scripts/core-systems/game-configuration/settings/consolescreensettings",
								"game-scripts/core-systems/game-configuration/settings/constants",
								"game-scripts/core-systems/game-configuration/settings/firelevel",
								"game-scripts/core-systems/game-configuration/settings/globalvariableoverrides",
								"game-scripts/core-systems/game-configuration/settings/globalvariableoverrides-clean",
								"game-scripts/core-systems/game-configuration/settings/globalvariableoverrides-monkey",
								"game-scripts/core-systems/game-configuration/settings/globalvariableoverrides-pax-server",
								"game-scripts/core-systems/game-configuration/settings/tuning",
								"game-scripts/core-systems/game-configuration/settings/tuning-override",
							],
						},
						{
							type: "category",
							label: "Game Configuration",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/game-configuration/stats/game-configuration-stats-overview",
							},
							items: [
								"game-scripts/core-systems/game-configuration/stats/game-configuration-stats-overview",
								"game-scripts/core-systems/game-configuration/stats/item-blacklist",
								"game-scripts/core-systems/game-configuration/stats/stats",
							],
						},
					],
				},
				{
					type: "category",
					label: "Localization",
					link: { type: "doc", id: "game-scripts/core-systems/localization-content/localization-content-overview" },
					items: [
						{
							type: "category",
							label: "Content",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/localization-content/content/localization-content-content-overview",
							},
							items: [
								"game-scripts/core-systems/localization-content/content/localization-content-content-overview",
								"game-scripts/core-systems/localization-content/content/giantutils",
								"game-scripts/core-systems/localization-content/content/guitartab-dsmaintheme",
								"game-scripts/core-systems/localization-content/content/misc-items",
								"game-scripts/core-systems/localization-content/content/notetable-dsmaintheme",
								"game-scripts/core-systems/localization-content/content/play-commonfn",
								"game-scripts/core-systems/localization-content/content/play-generalscripts",
								"game-scripts/core-systems/localization-content/content/play-the-doll",
								"game-scripts/core-systems/localization-content/content/play-the-veil",
								"game-scripts/core-systems/localization-content/content/scrapbook-prefabs",
								"game-scripts/core-systems/localization-content/content/signgenerator",
								"game-scripts/core-systems/localization-content/content/strings-stageactor",
							],
						},
						{
							type: "category",
							label: "Strings",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/localization-content/strings/localization-content-strings-overview",
							},
							items: [
								"game-scripts/core-systems/localization-content/strings/localization-content-strings-overview",
								"game-scripts/core-systems/localization-content/strings/createstringspo",
								"game-scripts/core-systems/localization-content/strings/createstringspo_dlc",
								"game-scripts/core-systems/localization-content/strings/strings",
								"game-scripts/core-systems/localization-content/strings/strings-pretranslated",
								"game-scripts/core-systems/localization-content/strings/skin-strings",
							],
						},
						{
							type: "category",
							label: "Translation",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/localization-content/translation/translation-overview",
							},
							items: [
								"game-scripts/core-systems/localization-content/translation/translation-overview",
								"game-scripts/core-systems/localization-content/translation/translator",
								"game-scripts/core-systems/localization-content/translation/curse-monkey-util",
							],
						},
					],
				},
				{
					type: "category",
					label: "Mod Support",
					link: { type: "doc", id: "game-scripts/core-systems/mod-support/mod-support-overview" },
					items: [
						"game-scripts/core-systems/mod-support/mod-support-overview",
						{
							type: "category",
							label: "Core",
							link: { type: "doc", id: "game-scripts/core-systems/mod-support/core/mod-support-core-overview" },
							items: [
								"game-scripts/core-systems/mod-support/core/mod-support-core-overview",
								"game-scripts/core-systems/mod-support/core/mods",
								"game-scripts/core-systems/mod-support/core/modindex",
								"game-scripts/core-systems/mod-support/core/modutil",
								"game-scripts/core-systems/mod-support/core/modcompatability",
							],
						},
						{
							type: "category",
							label: "DLC",
							link: { type: "doc", id: "game-scripts/core-systems/mod-support/dlc/mod-support-dlc-overview" },
							items: [
								"game-scripts/core-systems/mod-support/dlc/mod-support-dlc-overview",
								"game-scripts/core-systems/mod-support/dlc/dlcsupport-strings",
								"game-scripts/core-systems/mod-support/dlc/dlcsupport-worldgen",
								"game-scripts/core-systems/mod-support/dlc/dlcsupport",
								"game-scripts/core-systems/mod-support/dlc/upsell",
							],
						},
					],
				},
				{
					type: "category",
					label: "Networking Communication",
					link: {
						type: "doc",
						id: "game-scripts/core-systems/networking-communication/networking-communication-overview",
					},
					items: [
						"game-scripts/core-systems/networking-communication/networking-communication-overview",
						{
							type: "category",
							label: "Chat Commands",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/networking-communication/chat-commands/chat-commands-overview",
							},
							items: [
								"game-scripts/core-systems/networking-communication/chat-commands/chat-commands-overview",
								"game-scripts/core-systems/networking-communication/chat-commands/builtinusercommands",
								"game-scripts/core-systems/networking-communication/chat-commands/chathistory",
								"game-scripts/core-systems/networking-communication/chat-commands/usercommands",
								"game-scripts/core-systems/networking-communication/chat-commands/voteutil",
								"game-scripts/core-systems/networking-communication/chat-commands/wordfilter",
							],
						},
						{
							type: "category",
							label: "Multiplayer",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/networking-communication/multiplayer/multiplayer-overview",
							},
							items: [
								"game-scripts/core-systems/networking-communication/multiplayer/multiplayer-overview",
								"game-scripts/core-systems/networking-communication/multiplayer/motdmanager",
								"game-scripts/core-systems/networking-communication/multiplayer/popupmanager",
								"game-scripts/core-systems/networking-communication/multiplayer/serverpreferences",
							],
						},
						{
							type: "category",
							label: "Networking",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/networking-communication/networking/networking-overview",
							},
							items: [
								"game-scripts/core-systems/networking-communication/networking/networking-overview",
								"game-scripts/core-systems/networking-communication/networking/networking",
								"game-scripts/core-systems/networking-communication/networking/networkclientrpc",
								"game-scripts/core-systems/networking-communication/networking/netvars",
								"game-scripts/core-systems/networking-communication/networking/shardindex",
								"game-scripts/core-systems/networking-communication/networking/shardnetworking",
							],
						},
					],
				},
				{
					type: "category",
					label: "System Core",
					link: { type: "doc", id: "game-scripts/core-systems/system-core/system-core-overview" },
					items: [
						"game-scripts/core-systems/system-core/system-core-overview",
						{
							type: "category",
							label: "Engine",
							link: { type: "doc", id: "game-scripts/core-systems/system-core/engine/engine-overview" },
							items: [
								"game-scripts/core-systems/system-core/engine/engine-overview",
								"game-scripts/core-systems/system-core/engine/main",
								"game-scripts/core-systems/system-core/engine/mainfunctions",
								"game-scripts/core-systems/system-core/engine/maputil",
								"game-scripts/core-systems/system-core/engine/physics",
							],
						},
						{
							type: "category",
							label: "Runtime",
							link: { type: "doc", id: "game-scripts/core-systems/system-core/runtime/runtime-overview" },
							items: [
								"game-scripts/core-systems/system-core/runtime/runtime-overview",
								"game-scripts/core-systems/system-core/runtime/update",
							],
						},
					],
				},
				{
					type: "category",
					label: "User Interface",
					link: { type: "doc", id: "game-scripts/core-systems/user-interface/user-interface-overview" },
					items: [
						"game-scripts/core-systems/user-interface/user-interface-overview",
						{
							type: "category",
							label: "Frontend",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/user-interface/frontend/frontend-systems-overview",
							},
							items: [
								"game-scripts/core-systems/user-interface/frontend/frontend-systems-overview",
								"game-scripts/core-systems/user-interface/frontend/frontend",
								"game-scripts/core-systems/user-interface/frontend/data-grid",
								"game-scripts/core-systems/user-interface/frontend/loadingtipsdata",
								"game-scripts/core-systems/user-interface/frontend/splitscreenutils-pc",
								"game-scripts/core-systems/user-interface/frontend/writeables",
							],
						},
						{
							type: "category",
							label: "Graphics",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/user-interface/graphics/graphics-systems-overview",
							},
							items: [
								"game-scripts/core-systems/user-interface/graphics/graphics-systems-overview",
								"game-scripts/core-systems/user-interface/graphics/camerashake",
								"game-scripts/core-systems/user-interface/graphics/emitters",
								"game-scripts/core-systems/user-interface/graphics/falloffdefs",
								"game-scripts/core-systems/user-interface/graphics/fx",
								"game-scripts/core-systems/user-interface/graphics/lighting",
								"game-scripts/core-systems/user-interface/graphics/postprocesseffects",
								"game-scripts/core-systems/user-interface/graphics/shadeeffects",
							],
						},
						{
							type: "category",
							label: "Input",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/user-interface/input/input-systems-overview",
							},
							items: [
								"game-scripts/core-systems/user-interface/input/input-systems-overview",
								"game-scripts/core-systems/user-interface/input/input",
								"game-scripts/core-systems/user-interface/input/haptics",
							],
						},
						{
							type: "category",
							label: "Typography",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/user-interface/typography/typography-systems-overview",
							},
							items: [
								"game-scripts/core-systems/user-interface/typography/typography-systems-overview",
								"game-scripts/core-systems/user-interface/typography/easing",
								"game-scripts/core-systems/user-interface/typography/fonts",
								"game-scripts/core-systems/user-interface/typography/fonthelper",
							],
						},
					],
				},
				{
					type: "category",
					label: "World Systems",
					link: { type: "doc", id: "game-scripts/core-systems/world-systems/world-systems-overview" },
					items: [
						"game-scripts/core-systems/world-systems/world-systems-overview",
						{
							type: "category",
							label: "Entities",
							link: { type: "doc", id: "game-scripts/core-systems/world-systems/entities/entities-overview" },
							items: [
								"game-scripts/core-systems/world-systems/entities/entities-overview",
								"game-scripts/core-systems/world-systems/entities/prefabs",
								"game-scripts/core-systems/world-systems/entities/prefablist",
								"game-scripts/core-systems/world-systems/entities/prefabskin",
								"game-scripts/core-systems/world-systems/entities/prefabskins",
								"game-scripts/core-systems/world-systems/entities/prefabutil",
								"game-scripts/core-systems/world-systems/entities/worldentities",
							],
						},
						{
							type: "category",
							label: "Generation",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/world-systems/generation/world-generation-overview",
							},
							items: [
								"game-scripts/core-systems/world-systems/generation/world-generation-overview",
								"game-scripts/core-systems/world-systems/generation/worldgen-main",
								"game-scripts/core-systems/world-systems/generation/custom-presets",
								"game-scripts/core-systems/world-systems/generation/prefabswaps",
								"game-scripts/core-systems/world-systems/generation/plantregistrydata",
								"game-scripts/core-systems/world-systems/generation/regrowthutil",
								"game-scripts/core-systems/world-systems/generation/worldsettingsutil",
								"game-scripts/core-systems/world-systems/generation/worldsettings_overrides",
							],
						},
						{
							type: "category",
							label: "Ocean",
							link: { type: "doc", id: "game-scripts/core-systems/world-systems/ocean/ocean-systems-overview" },
							items: [
								"game-scripts/core-systems/world-systems/ocean/ocean-systems-overview",
								"game-scripts/core-systems/world-systems/ocean/ocean-util",
							],
						},
						{
							type: "category",
							label: "Tiles & Terrain",
							link: {
								type: "doc",
								id: "game-scripts/core-systems/world-systems/tiles-terrain/tiles-terrain-overview",
							},
							items: [
								"game-scripts/core-systems/world-systems/tiles-terrain/tiles-terrain-overview",
								"game-scripts/core-systems/world-systems/tiles-terrain/tiledefs",
								"game-scripts/core-systems/world-systems/tiles-terrain/tilegroups",
								"game-scripts/core-systems/world-systems/tiles-terrain/tilemanager",
								"game-scripts/core-systems/world-systems/tiles-terrain/worldtiledefs",
								"game-scripts/core-systems/world-systems/tiles-terrain/noisetilefunctions",
								"game-scripts/core-systems/world-systems/tiles-terrain/groundcreepdefs",
							],
						},
					],
				},
			],
		},
	],
};

export default sidebars;
