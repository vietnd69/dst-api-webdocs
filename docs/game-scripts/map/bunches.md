---
id: bunches
title: Bunches
description: Defines static spawning rules for grouped environmental props (bunches) such as seastacks, saltstacks, and rubbles across specific tile types.
tags: [map, worldgen, spawning]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 876ea9f8
---

# Bunches

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines configuration tables for *bunches* — procedural groupings of static environmental objects (e.g., `seastack`, `saltstack`, `wobster_den`, `rock1`) that are spawned during world generation. Each entry specifies how and where such objects appear in the world, including valid tile types, spawn ranges, counts, and spacing constraints. `BunchBlockers` is present but empty, indicating no blocker definitions are used here.

This module is purely data-driven and is consumed by world generation systems (e.g., `static_layouts`, `rooms`, `tasksets`) to instantiate clustered geometry in the world.

## Usage example
```lua
local Bunches = require "map/bunches"
local world = GetWorld()

-- Example: Spawn a `seastack` bunch on rough ocean tiles at coordinates (x, z)
local bunch_config = Bunches.Bunches.seastack_spawner_rough
local spawnerx, spawnerz = 100, 200
-- Typically handled internally by worldgen systems like `AddBunch` or `AddCluster`
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `Bunches` | `table` | `nil` (module return value) | A table of named bunch definitions. Each key is a string identifier (e.g., `"seastack_spawner_rough"`) and each value is a configuration table. |
| `BunchBlockers` | `table` | `{}` | Reserved for future blocker definitions; currently unused and empty. |

Each entry in `Bunches` has the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `prefab` | `string` or `function` | Either the name of a prefab string or a function that dynamically returns a prefab name based on world coordinates and tile context. |
| `range` | `number` | — | Radius (in world units) within which bunch members are placed. |
| `min` | `number` | — | Minimum number of instances to spawn in the bunch. |
| `max` | `number` | — | Maximum number of instances to spawn in the bunch. |
| `min_spacing` | `number` | — | Minimum distance between spawned instances. |
| `valid_tile_types` | `table` | — | A list of `WORLD_TILES` constants indicating valid tiles where this bunch may spawn. |

## Main functions
This module exports only the data structure. It does not define or expose any callable functions.

### Dynamic prefab resolution (`prefab` field)
Some bunch entries use a function for `prefab` (e.g., `wobster_den_spawner_shore`) to determine the appropriate prefab at spawn time.  
**Behavior:**
- Iterates over a 3×3 grid of candidate positions around `(spawnerx, spawnerz)`.
- Checks tile type using `world:GetTile(x, z)`.
- Returns `"moonglass_wobster_den"` if tile is `PEBBLEBEACH`, `METEOR`, or `SHELLBEACH`.
- Returns `"wobster_den"` if tile is not oceanic.
- Returns `nil` if no valid spot found.

This allows context-sensitive spawning while respecting tile restrictions.

## Events & listeners
None. This module is pure data and does not register or dispatch events.