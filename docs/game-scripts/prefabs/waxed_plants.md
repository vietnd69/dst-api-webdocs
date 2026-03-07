---
id: waxed_plants
title: Waxed Plants
description: Generates prefabs for plants and trees with waxed appearances, providing animation, physics, and behavior configurations for a variety of flora.
tags: [world, environment, flora, animation]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f0556baf
system_scope: environment
---

# Waxed Plants

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`waxed_plants.lua` is a helper script that creates prefabs for various plant and tree types with “waxed” visual variants—typically used for seasonal or decorative variants in DST. It relies heavily on `WAXED_PLANTS.CreateWaxedPlant` (defined in `prefabs/waxed_plant_common.lua`) to instantiate entities with appropriate animation sets, physics, minimap icons, and dynamic behavior functions. It integrates with components such as `pickable`, `growable`, `witherable`, and `burnable` to adapt visuals based on game state (e.g., picking, growth stage, withering, burning).

## Usage example
```lua
-- Include the script to generate waxed plant prefabs
local waxed_plants = require "prefabs/waxed_plants"

-- Example: Access a generated waxed berrybush prefab by name
local berrybush_waxed = require "prefabs/waxed_plants.berrybush"

-- Create the entity and use standard prefab APIs
local inst =prefab_spawn(berrybush_waxed.prefab)
inst.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `burnable`, `growable`, `pickable`, `witherable`  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `Plantable_GetAnimFn(inst)`
*   **Description:** Returns the appropriate animation name based on the state of `pickable`, `witherable`, and `growable` components.
*   **Parameters:** `inst` (TheEntity) — entity instance with optional `pickable`, `growable`, `witherable` components.
*   **Returns:** String — `"idle"`, `"picked"`, or `"dead"`.

### `FarmPlant_GetAnimFn(inst)`
*   **Description:** Returns animation name based on growth stage and `oversized` flag, or `"randomseed"` for seeds.
*   **Parameters:** `inst` (TheEntity) — entity with `growable` component and optional `plant_def` and `is_oversized` properties.
*   **Returns:** String — stage name like `"crop_seed"`, `"crop_sprout"`, `"crop_oversized"`, etc.

### `WeedPlant_GetAnimFn(inst)`
*   **Description:** Returns animation name based on growth stage, adjusting for the `small_mature` state if plant is marked mature.
*   **Parameters:** `inst` (TheEntity) — entity with `growable` component and optional `mature` property.
*   **Returns:** String — stage name like `"small"`, `"small_mature"`, `"full"`, etc.

### `CreateWaxedBerryBush(name)`
*   **Description:** Factory function to create a waxed berry bush prefab instance.
*   **Parameters:** `name` (string) — prefab name variant (e.g., `"berrybush"`, `"berrybush2"`).
*   **Returns:** Table — finalized prefab definition.

### `CreateWaxedSapling(is_moon)`
*   **Description:** Factory function to create a waxed sapling (e.g., `"sapling"` or `"sapling_moon"`).
*   **Parameters:** `is_moon` (boolean) — whether to create the moon sapling.
*   **Returns:** Table — finalized prefab definition.

### `CreateWaxedFarmPlant(plant_def)`
*   **Description:** Factory function to create a waxed farm plant prefab, using a `PLANT_DEFS` entry.
*   **Parameters:** `plant_def` (table) — plant definition from `farm_plant_defs.lua`.
*   **Returns:** Table — finalized prefab definition.

### `CreateWaxedWeedPlant(plant_def)`
*   **Description:** Factory function to create a waxed weed plant prefab, using a `WEED_DEFS` entry.
*   **Parameters:** `plant_def` (table) — plant definition from `weed_defs.lua`.
*   **Returns:** Table — finalized prefab definition.

### `Evergreen_GetAnimFn(inst)`
*   **Description:** Returns animation name based on burn/stump state and sway animation.
*   **Parameters:** `inst` (TheEntity) — entity with `burnable`, `stump` tag, and `anims` table.
*   **Returns:** String — e.g., `"evergreen_stump"`, `"evergreen_sway1_loop_normal"`.

### `DeciduousTree_GetAnimFn(inst)`
*   **Description:** Returns animation name for deciduous trees, adjusted for burn/stump and leaf color variants.
*   **Parameters:** `inst` (TheEntity) — entity with `anims` and `build` properties.
*   **Returns:** String — e.g., `"tree_leaf_sway1_loop_red"`.

### `MoonAndPalmconeTree_GetAnimFn(inst)`
*   **Description:** Returns animation name for moon or palmcone trees based on sway and size.
*   **Parameters:** `inst` (TheEntity) — entity with `size` and animation state.
*   **Returns:** String — e.g., `"sway1_loop_tall"`, `"burnt_short"`.

### `OceanTree_GetAnimFn(inst)`
*   **Description:** Returns animation name for ocean trees, adjusting for bloom state (`#inst.buds_used > 0`) and burn/stump.
*   **Parameters:** `inst` (TheEntity) — entity with `buds_used` table and animation state.
*   **Returns:** String — e.g., `"sway1_loop_bloomed"`.

### `AncientTree_GetAnimFn(inst)`
*   **Description:** Returns animation name for ancient trees, adjusted for stump and `"pickable"` tag.
*   **Parameters:** `inst` (TheEntity) — entity with `type`, `"stump"` tag, and `"pickable"` tag.
*   **Returns:** String — e.g., `"ancienttree_pine_stump"`, `"sway1_loop_full"`.

### `CreateWaxedAncientTree(type, data)`
*   **Description:** Factory function for waxed ancient trees.
*   **Parameters:** `type` (string) — tree type; `data` (table) — tree definition from `ancienttree_defs.lua`.
*   **Returns:** Table — finalized prefab definition.

### `CreateWaxedAncientTreeSapling(type, data)`
*   **Description:** Factory function for waxed ancient tree saplings.
*   **Parameters:** `type` (string); `data` (table).
*   **Returns:** Table — finalized prefab definition.

## Events & listeners
None identified