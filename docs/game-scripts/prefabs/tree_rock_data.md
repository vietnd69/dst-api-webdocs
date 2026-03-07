---
id: tree_rock_data
title: Tree Rock Data
description: Provides configuration data for loot tables and biome-specific drop mechanics for tree rock entities in DST.
tags: [loot, biome, worldgen, entity, data]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9260d749
system_scope: world
---

# Tree Rock Data

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file is a data module (not a component) that defines structured loot configurations for tree rock entities — specifically, the loot table mappings, biome assignments, and dynamic modifiers used when a tree rock is harvested. It enables the game to return different material rewards depending on the current biome, world task, room type, or special area conditions (e.g., shadow rifts). It does not contain logic to handle events or component behavior but serves as a lookup data source for external systems (e.g., mining components or task looting systems).

## Usage example
```lua
local tree_rock_data = require "prefabs/tree_rock_data"

-- Get the loot key for a specific biome (e.g., "RUINS_AREA")
local loot_key = "RUINS_AREA"
local loot_table = tree_rock_data.WEIGHTED_VINE_LOOT[loot_key]

-- Get the build and symbol for a specific item type
local gem_data = tree_rock_data.VINE_LOOT_DATA["redgem"]
-- gem_data = { build = "gems", symbols = { "swap_redgem" } }

-- Resolve area with dynamic modifiers (e.g., shadow rift override)
local effective_area = tree_rock_data.CheckModifyLootArea("VENT_AREA")
```

## Dependencies & tags
**Components used:**  
- `hounded` — accessed via `TheWorld.components.hounded:GetWorldEscalationLevel()` in `EXTRA_LOOT_MODIFIERS`  
- `riftspawner` — accessed via `TheWorld.components.riftspawner:IsShadowPortalActive()` in `AREA_MODIFIER_FNS`  

**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `WEIGHTED_VINE_LOOT` | table | See source | Mapping from biome/task area keys (e.g., `"FOREST_AREA"`) to weighted loot tables (item names → weights). Includes a `"DEFAULT"` fallback. |
| `VINE_LOOT_DATA` | table | See source | Mapping from item names (e.g., `"redgem"`, `"poop"`) to visual asset definitions (`build` and `symbols` arrays used for swapping in the entity). |
| `TASKS_TO_LOOT_KEY` | table | See source | Maps in-game task strings (e.g., `"Forest hunters"`) to biome area keys used in `WEIGHTED_VINE_LOOT`. |
| `ROOMS_TO_LOOT_KEY` | table | See source | Maps room names (e.g., `"BGRocky"`, `"SpidersAndBats"`) to biome area keys, overriding task-based mapping. |
| `STATIC_LAYOUTS_TO_LOOT_KEY` | table | See source | Maps static level layouts (e.g., `"HermitcrabIsland"`) to biome area keys. |
| `EXTRA_LOOT_MODIFIERS` | table | See source | Contains conditional loot modifiers with test functions and dynamic weight additions (e.g., `"WEB_CREEP"`, `"CAVE"`). |
| `AREA_MODIFIER_FNS` | table | See source | Contains functions to override biome area keys under specific world states (e.g., `"VENT_AREA" → "VENT_AREA_SHADOW_RIFT"` when a rift is active). |
| `CheckModifyLootArea(area)` | function | — | Returns the resolved biome area key after applying any active modifiers (e.g., returns `"VENT_AREA_SHADOW_RIFT"` for `area = "VENT_AREA"` if a shadow portal is active). |

## Main functions
### `CheckModifyLootArea(area)`
* **Description:** Evaluates and returns the appropriate biome area key for loot calculations, applying dynamic overrides (e.g., for shadow rifts in vent biomes).
* **Parameters:**  
  - `area` (string) — The base biome area key (e.g., `"VENT_AREA"`).
* **Returns:**  
  - (string) — The modified or original area key, depending on current world state.
* **Error states:** None documented; always returns a string.

## Events & listeners
Not applicable — this is a data-only module and does not register or dispatch events.