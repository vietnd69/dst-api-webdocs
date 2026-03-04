---
id: room_functions
title: Room Functions
description: Provides generator functions and helpers for procedural room and terrain placement in world generation.
tags: [world, generation, terrain, room]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: cace8d6d
---

# Room Functions

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This file defines standalone generator functions used during world map generation to programmatically populate room sites with terrain tiles and placed entities. It provides two primary generator functions: `RunCA` (Cellular Automata–based terrain placement) and `MyTestTileSetFunction` (custom tile and item layout), along with helper functions such as `MakeSetpieceBlockerRoom` and `Roomify`. These functions are consumed by the world generation pipeline to construct diverse and structured environments like setpiece rooms or natural terrain areas.

The functions interface with `WorldSim` (the world simulation system) via `WorldSim:RunCA`, `WorldSim:GetPointsForSite`, `WorldSim:GetSiteCentroid`, and `WorldSim:SetTile`, and delegate entity placement to `data.node:AddEntity`. No component class is defined—this is a collection of procedural map-generation utilities.

## Usage example

A typical usage involves defining a generator configuration and associating it with a room node during world generation. Example:

```lua
local room_data = {
    GeneratorFunction = RunCA,
    DefaultArgs = { iterations = 4, seed_mode = CA_SEED_MODE.SEED_CENTROID, num_random_points = 1 }
}

-- When building a room node:
local room_node = {
    id = "forest_cave_entrance",
    type = NODE_TYPE.Room,
    width = 16,
    height = 16,
    generator = room_data
}
```

## Dependencies & tags

**Components used:** None directly—this file is a module of procedural helpers, not a component class. It calls:
- `WorldSim:RunCA(...)`
- `WorldSim:GetPointsForSite(id)`
- `WorldSim:GetSiteCentroid(id)`
- `WorldSim:SetTile(x, y, tile_type)`
- `data.node:AddEntity(...)`
- `WorldSim:PointInSite(id, x, z)`

**Tags:** None identified (no `AddTag`/`RemoveTag`/`HasTag` usage in this file).

## Properties

No persistent properties are stored in a class context. The file only defines top-level functions and data tables.

## Main functions

### `RunCA(id, entities, data)`
* **Description:** Runs a cellular automata (CA) simulation for a given room site ID, updates the tile layer, and optionally places items at calculated tile locations based on the data map. Handles both general tile mapping and a special centroid placement (e.g., for structures like light beams).
* **Parameters:**
  - `id` (`string` or `number`): The site identifier used to query and update points in `WorldSim`.
  - `entities` (`table`): List of entity definitions passed to `AddEntity`.
  - `data` (`table`): Configuration table with keys: `iterations` (CA passes), `seed_mode`, `num_random_points`, optional `translate` (tile mapping table), and optional `centroid` (special item placement).
* **Returns:** `nil`.
* **Error states:** Returns early (with a console print) if `GetPointsForSite(id)` yields an empty point list (`#points_x == 0`).

### `MakeSetpieceBlockerRoom(blocker_name)`
* **Description:** Constructs and returns a room definition table for use as a setpiece blocker room (e.g., walls or impassable structures). The room is configured to block movement, be tagged for specific worldgraph constraints, and contain one static layout.
* **Parameters:**
  - `blocker_name` (`string`): The name of the static layout to place inside the room (e.g., `"blocker_wall"`).
* **Returns:** (`table`) A room configuration table with:
  - `colour`: Dark purple (for debugging visualization).
  - `value`: `WORLD_TILES.IMPASSABLE`.
  - `tags`: `{"ForceConnected", "RoadPoison"}`.
  - `contents.countstaticlayouts`: `{ [blocker_name] = 1 }`.
* **Error states:** None.

### `Roomify(data)`
* **Description:** Wraps a generic data table into a room node definition by setting its `type` to `NODE_TYPE.Room` via deep copy.
* **Parameters:**
  - `data` (`table`): Arbitrary room configuration data.
* **Returns:** (`table`) A deep copy of `data` with `type = NODE_TYPE.Room`.
* **Error states:** None.

### `PlaceLightBeam`
* **Description:** A pre-configured generator entry point containing `MyTestTileSetFunction` (currently unimplemented beyond skeleton logic) and associated tile data. Intended for placing beam-centric layouts (e.g., glowshrooms or light sources surrounded by flora/tiles). Not actively used in current builds.
* **Type:** `table` with fields `GeneratorFunction` (`function`) and `DefaultArgs` (`table`).
* **Error states:** Function body is incomplete and includes placeholder logic (e.g., `if WorldSim:PointInSite(id, pos.x, pos.z) then`). Not functional as-is.

## Events & listeners

None—this module provides standalone procedural functions and does not use `inst:ListenForEvent` or `inst:PushEvent`.