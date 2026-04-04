---
id: strings
title: Strings
description: Centralized string table management for game assets, including names, descriptions, and localized content used across the world, UI, and prefabs.
tags: [localization, ui, assets]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: data_patched
category_type: root
source_hash: eefbf573
system_scope: ui
---

# Strings

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `strings.lua` file defines the global `STRINGS` table, which serves as the authoritative source for all human-readable text in the game. It consolidates localization keys for prefabs, recipes, actions, directions, and other static content. The file imports and embeds the external `strings_stageactor.lua` module into `STRINGS.STAGEACTOR` and concludes by requiring `skin_strings`, indicating its role as the root module for hierarchical string organization. Despite being large and split across many chunks, it contains no logic functions, constructors, or event listeners—only static string tables used by the game engine for UI rendering, asset labeling, and translation.

## Usage example
```lua
-- Accessing prefab names
local name = STRINGS.CHARACTERS.WILSON.NAME

-- Using recipe descriptions in crafting UI
local recipe_desc = STRINGS.RECIPE_DESC.TORCH

-- Stage actor (cutscene actor) names
local actor_name = STRINGS.STAGEACTOR.ABIGENCY
```

## Dependencies & tags
**Components used:** None (pure data module; no component dependencies)
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `STRINGS.CHARACTERS.*` | `table` | (see source) | Per-character name and detail strings (e.g., `WILSON.NAME`, `WILSON.DESCRIPTION`) |
| `STRINGS.RECIPE_DESC.*` | `table` | (see source) | Descriptive text for crafted recipes (e.g., `TORCH = "Simple lighting source."`) |
| `STRINGS.NAMES.*` | `table` | (see source) | Generic object names (e.g., `BOAT_ROTATOR = "Rudder"`) |
| `STRINGS.STAGEACTOR` | `table` | (imported from `strings_stageactor.lua`) | Names and labels for cutscene actors/characters |
| `STRINGS.DIRECTIONS.*` | `table` | (e.g., `NORTH`, `SOUTH`) | Directional labels used in UI or map overlays |
| `STRINGS.NAME_DETAIL_EXTENTION` | `string` | (literal value) | Appended text fragment used in name generation (e.g., "the Great") |

## Main functions
No functions defined.

## Events & listeners
No events defined.