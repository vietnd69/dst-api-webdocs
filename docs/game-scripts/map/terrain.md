---
id: terrain
title: Terrain
description: Defines global terrain spawn filtering rules that specify which items or structures can or cannot appear on specific tile types in the game world.
tags: [world, map, spawning, terrain, filtering]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 362ac1b1
---

# Terrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines a global `TERRAIN_FILTER` table that specifies, for each entity type (e.g., `berrybush`, `rock1`, `tentacle`), which `WORLD_TILES` types are *not allowed* for spawning that entity. In other words, an entity will not spawn on any terrain tile listed in its corresponding filter array.

It also provides the helper function `OnlyAllow(approved)` that returns the *inverse* of a list—i.e., all tile types *except* those in `approved`, useful for specifying "whitelist-only" behavior concisely.

A read-only `terrain.rooms` entry is exposed for legacy compatibility (though direct access triggers a deprecation warning), sourcing room definitions via `map/rooms.lua` internally.

This module is central to worldgen logic: it prevents invalid placements (e.g., trees on wood floors) to maintain world integrity and gameplay consistency.

## Dependencies & tags
**Components used:**  
- `GetWorldTileMap()` — global utility function (not a component), returns list of all `WORLD_TILES` enum values.
- `table.contains(t, val)` — utility function to check membership in a table.
- `moderror(msg)` — global error function (triggers warning in log when deprecated patterns are used).

**Tags:**  
- `WORLD_TILES` constants are used extensively (e.g., `WORLD_TILES.ROAD`, `WORLD_TILES.METEOR`).  
- No entity tags are added/removed by this file.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `TERRAIN_FILTER` | `table<string, table<WORLD_TILES, boolean>>` | Structured lookup table keyed by entity prefabs, each value being a list of forbidden `WORLD_TILES` constants | Defines, per entity type, the set of terrain types where that entity cannot spawn. Includes helper functions like `.Print()`. |
| `terrain` | `table` | `{ rooms = old_rooms, filter = TERRAIN_FILTER }` | Global export table containing legacy `rooms` accessor (deprecated) and the `filter` table. |

## Main functions

### `OnlyAllow(approved)`
* **Description:** Returns a list of all `WORLD_TILES` values *except* those in the `approved` list. Used to define "allow only these tiles" rules by generating the inverse (i.e., forbidden) list for inclusion in `TERRAIN_FILTER`.  
* **Parameters:**  
  - `approved` (`table<WORLD_TILES>`) — List of `WORLD_TILES` constants considered valid for the associated entity.  
* **Returns:** `table<WORLD_TILES>` — All tile types *not* in `approved`.  
* **Error states:** None—returns empty table if `approved` includes all known tile types.

## Events & listeners
None.

## Usage example
```lua
-- Check whether a berrybush can spawn on a given tile type
local tile = GetTile(x, y)
local allowed = not table.contains(TERRAIN_FILTER.berrybush, tile)

-- Verify allowed tiles using the helper .Print() function
print("Forbidden tiles for berrybush:", TERRAIN_FILTER.berrybush:Print())

-- Add a custom entity to the filter (e.g., for a modded item)
TERRAIN_FILTER.mymodded_shrub = { WORLD_TILES.ROAD, WORLD_TILES.WOODFLOOR }
```
Note: Direct modification of `TERRAIN_FILTER` at runtime is possible but strongly discouraged outside mod pre-init stages; use `AddRoomPreInit` for room-specific placement changes.