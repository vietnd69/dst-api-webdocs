---
id: tilegroups
title: Tilegroups
description: Provides tile classification utilities and manages tile groups for world generation and entity placement logic in Don't Starve Together.
tags: [world, terrain, map, tiles]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: dfd4d62f
system_scope: world
---

# Tilegroups

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `TileGroupManager` is a utility system that categorizes world tiles into logical groups (e.g., land, ocean, impassable) and provides predicate functions to query tile types. It is primarily used during world generation and by systems (like undertile components) that need to reason about terrain placement and collision. The script defines and configures global `TileGroups` table entries referencing prebuilt or custom tile groups, enabling modders to extend or query tile classifications consistently.

## Usage example
```lua
-- Check if a tile belongs to a specific group
if TileGroupManager:IsLandTile(tile_id) then
    print("This is a land tile.")
end

-- Access predefined tile groups for placement logic
local dock_tile_group = TileGroups.DockTiles
-- Use tile_group_id with undertile or worldgen APIs as needed
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `TileGroupManager` | table | (global) | A singleton-like manager table containing predicate methods and group management functions (inherited via metatable). |
| `TileGroups` | table | (global) | A table populated with tile group identifiers (e.g., `LandTiles`, `OceanTiles`, `InvalidTiles`) used as arguments for `TileGroupManager` functions. |

## Main functions
### `IsLandTile(tile)`
* **Description:** Returns `true` if `tile` falls within the defined land tile ranges (legacy or current).
* **Parameters:** `tile` (number) — A tile ID constant (e.g., `WORLD_TILES.LAND_GRASS`).
* **Returns:** `true` if tile is land; otherwise `false`.

### `IsOceanTile(tile)`
* **Description:** Returns `true` if `tile` falls within the defined ocean tile ranges (legacy or current).
* **Parameters:** `tile` (number) — A tile ID constant.
* **Returns:** `true` if tile is ocean; otherwise `false`.

### `IsImpassableTile(tile)`
* **Description:** Returns `true` if `tile` is impassable, including `WORLD_TILES.IMPASSABLE` or within defined impassable ranges.
* **Parameters:** `tile` (number) — A tile ID constant.
* **Returns:** `true` if tile is impassable; otherwise `false`.

### `IsInvalidTile(tile)`
* **Description:** Returns `true` if `tile` is invalid (`WORLD_TILES.INVALID`) or impassable.
* **Parameters:** `tile` (number) — A tile ID constant.
* **Returns:** `true` if tile is invalid or impassable; otherwise `false`.

### `IsNoiseTile(tile)`
* **Description:** Returns `true` if `tile` falls within the noise tile ranges (used for procedural textures).
* **Parameters:** `tile` (number) — A tile ID constant.
* **Returns:** `true` if tile is a noise tile; otherwise `false`.

### `IsTemporaryTile(tile)`
* **Description:** Returns `true` if `tile` is a temporary tile (used to prevent collisions with undertile components).
* **Parameters:** `tile` (number) — A tile ID constant.
* **Returns:** `true` if `GROUND_ISTEMPTILE[tile]` is truthy; otherwise `false`.

### `IsShallowOceanTile(tile)`
* **Description:** Returns `true` if `tile` is one of the explicitly defined shallow ocean tile types.
* **Parameters:** `tile` (number) — A tile ID constant.
* **Returns:** `true` if tile is shallow ocean (`WORLD_TILES.OCEAN_COASTAL_SHORE`, `OCEAN_COASTAL`, or `OCEAN_WATERLOG`); otherwise `false`.

## Events & listeners
None identified