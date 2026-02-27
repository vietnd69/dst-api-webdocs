---
id: forest_map
title: Forest Map
description: Handles procedural generation of the Forest biome's terrain, topology, entities, roads, and seasonal/weather configuration for Don't Starve Together world generation.
tags: [world, generation, terrain, procedural, season]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: f840f6db
---

# Forest Map

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `forest_map.lua` script is the core world generation module for the Forest biome in Don't Starve Together. It defines the procedural generation logic that constructs terrain, topology, entity placement, road networks, and seasonal settings for a new world instance. This script does not define a Component in the ECS sense; rather, it is a world generation utility module whose primary `Generate` function orchestrates the full process of building a forest world. It relies heavily on external modules like `storygen`, `object_layout`, `bunch_spawner`, `ocean_gen_config`, and terrain utilities (`noisetilefunctions`, `terrain`), and integrates closely with `WorldSim` and `topology` data structures during world build time.

## Usage example

This module is not used as an ECS Component. It is invoked internally by the game's world generation system. The following example shows how its primary API is typically used:

```lua
local forest_map = require "map/forest_map"

local save_data = forest_map.Generate(
    "forest",       -- prefab name
    425,            -- initial map_width
    425,            -- initial map_height
    tasks,          -- table of task nodes and room assignments
    level,          -- level config table containing overrides
    "forest"        -- level_type string
)

if save_data ~= nil then
    -- World generation succeeded; save_data contains fully populated map topology and entities
    WorldArchetype:Save(save_data)
else
    -- Generation failed; likely due to validation checks (e.g., disconnected tiles, missing required prefabs)
end
```

## Dependencies & tags

**Modules required:**  
- `map/startlocations`  
- `map/terrain`  
- `map/ocean_gen`  
- `map/bunch_spawner`  
- `map/archive_worldgen`  
- `map/monkeyisland_worldgen`  
- `map/object_layout`  
- `map/storygen`  
- `map/ocean_gen_config`  
- `noisetilefunctions`

**No tags are added or removed at runtime.** This module runs during world generation and does not interact with entity tags in the ECS.

## Properties

No persistent instance properties exist, as this module is a utility and not an ECS Component. However, it exposes several constant tables and functions as its public API.

| Property                 | Type     | Default Value              | Description |
|--------------------------|----------|----------------------------|-------------|
| `TRANSLATE_TO_PREFABS`   | table    | *internal mapping*         | Maps worldgen tweak names (e.g. `"trees"`, `"rabbits"`) to one or more concrete prefabs (e.g. `{"evergreen", "deciduoustree"}`). Used to expand user-facing settings into game entities. |
| `MULTIPLY`               | table    | *density multipliers*      | Maps rarity names (`"always"`, `"rare"`, `"ocean_default"`, etc.) to numeric density scaling factors used for entity counts. |
| `CLUMP`                  | table    | *clump size constants*     | Maps rarity names to maximum clump counts (e.g., `"often" → 8`, `"always" → 30`). |
| `CLUMPSIZE`              | table    | *min/max clump size table* | Maps rarity names to `{min, max}` clump size ranges. Used when entities spawn in clustered formations. |
| `MULTIPLY_PREFABS`       | table    | *spawner overrides*        | Maps specific spawner prefabs (e.g. `"tumbleweedspawner"`) to custom multiplier functions to adjust density adjustments for clustered or multi-item spawns. |
| `TRANSLATE_AND_OVERRIDE` | table    | *override+translate map*   | Maps worldgen settings that should be both translated to prefabs *and* passed as runtime overrides (e.g. `"flowers" → {"flower", "flower_evil"}`). |
| `TRANSLATE_TO_CLUMP`     | table    | *clump-only mappings*      | Maps settings (e.g. `"chess"`) to prefabs that should only receive clumping behavior, not density scaling. |
| `SEASONS`                | table    | *season function map*      | Maps season names (`"autumn"`, `"winter"`, `"spring"`, `"summer"`) to functions that return season/temperature/precipitation configuration. |
| `DEFAULT_SEASON`         | string   | `"autumn"`                 | Default starting season for new worlds. |

## Main functions

### `Generate(prefab, map_width, map_height, tasks, level, level_type)`
* **Description:** The central world generation function for the Forest biome. It constructs terrain topology (via Voronoi), spawns terrain tiles, entities, roads, and handles ocean generation if enabled. It validates required prefabs, applies worldgen overrides (e.g., rarity settings), and returns a complete `save` table ready for persistence.
* **Parameters:**
  * `prefab` (string): Name of the biome prefab (e.g. `"forest"`).
  * `map_width` (number): Initial intended map width (modified internally based on world size).
  * `map_height` (number): Initial intended map height (modified internally).
  * `tasks` (table): Task set and node assignments defining map structure.
  * `level` (table): Contains `overrides` (user/chosen worldgen settings), `required_prefabs`, `ocean_prefill_setpieces`, and other biome-level configuration.
  * `level_type` (string): Arbitrary type tag used by storygen.
* **Returns:**  
  A `save` table containing map data (`tiles`, `nav`, `adj`, `topology`, `roads`, `generated`, `world_tile_map`) and entity placements (`ents`). Returns `nil` if generation fails validation.
* **Error states:**  
  Returns `nil` if topology fails to commit, if too many tiles become disconnected (`>5%` threshold), if critical required prefabs are missing (unless explicitly disabled in overrides), or if no valid spawnpoint is found. May also return `nil` if `level.overrides` is `nil`.

## Events & listeners

**No events are listened to or fired.** This module executes synchronously during world generation and does not use the entity event system.