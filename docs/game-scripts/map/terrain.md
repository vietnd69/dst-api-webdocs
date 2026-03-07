---
id: terrain
title: Terrain
description: Defines terrain tile restrictions for spawning in-game objects and provides access to room definitions via a deprecated lookup mechanism.
tags: [world, spawning, room, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: map
source_hash: 362ac1b1
system_scope: world
---

# Terrain

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`terrain` is a global table that specifies which terrain tile types are allowed or disallowed for spawning specific in-game objects (e.g., trees, bushes, structures). It contains two key elements:
- `filter`: A mapping from object type names to lists of disallowed terrain tile types (`WORLD_TILES.*` constants).
- `rooms`: A legacy accessor to room definitions via `map/rooms.lua`, now deprecated and triggers a warning on use.

This table is used by the world generation system to prevent invalid placements (e.g., grass on carpet tiles) and ensure compatibility with tile sets used in different biomes and game modes.

## Usage example
```lua
-- Check if a berrybush can spawn on a given tile (e.g., WORLD_TILES.DIRT)
if not table.contains(terrain.filter.berrybush, WORLD_TILES.DIRT) then
    print("berrybush can spawn on dirt")
end

-- Access a room via the deprecated API (triggers a moderror warning)
-- local room = terrain.rooms["forest_tree_large"]
```

## Dependencies & tags
**Components used:** None. This is a pure data table.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `filter` | table | `{}` | A dictionary mapping object prefabs to lists of disallowed `WORLD_TILES.*` tile types. |
| `rooms` | table (deprecated) | `{}` | Legacy proxy to `map/rooms.lua` room definitions; triggers `moderror` on access. |

## Main functions
### `OnlyAllow(approved)`
*   **Description:** Helper function that returns a list of *all* terrain tiles *except* those in `approved`. Used to define `TERRAIN_FILTER` entries where only specific tile types are allowed.
*   **Parameters:** `approved` (table) — A list of `WORLD_TILES.*` constants that *are* allowed; all others are included in the returned filter list.
*   **Returns:** table — A list of disallowed `WORLD_TILES.*` constants.
*   **Error states:** None.

## Events & listeners
Not applicable.
