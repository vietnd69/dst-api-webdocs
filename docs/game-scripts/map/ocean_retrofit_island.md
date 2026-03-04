---
id: ocean_retrofit_island
title: Ocean Retrofit Island
description: A map-generation utility module that inserts ocean-based setpieces (moon islands, hermit islands, crab kings, waterlog biomes, monkey islands) into an existing world by validating terrain constraints and adding topology nodes.
tags: [map, worldgen, ocean, setpiece]
sidebar_position: 10
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 4efae2a0
---
# Ocean Retrofit Island

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This module provides world-generation utility functions for retrofitting oceanic setpieces into an already-generated world. It is used during post-processing of world save data (`savedata`) to place fixed-layout structures (e.g., Moon Island, HermitcrabIsland, CrabKing, Waterlog biomes, Monkey Island) in valid oceanic terrain locations.

The module depends on `map/object_layout` for layout placement and uses helper functions to validate terrain (e.g., `WORLD_TILES.OCEAN_ROUGH`, `OCEAN_SWELL`), detect and remove obstructing entities, and add topology nodes for world navigation and room logic. It does not define a component in the ECS sense; rather, it exports top-level functions meant to be called directly during worldgen or savegame patching.

## Usage example

```lua
local ocean_retrofit = require("map/ocean_retrofit_island")

-- Add a Moon Island to the world during retrofiting (e.g., for Turn of Tides DLC)
ocean_retrofit.TurnOfTidesRetrofitting_MoonIsland(map, savedata)

-- Add HermitcrabIsland and CrabKing setpieces
ocean_retrofit.TurnOfTidesRetrofitting_HermitIsland(map, savedata)

-- Add up to 3 Waterlogged setpieces
ocean_retrofit.WaterloggedRetrofitting_WaterlogSetpiece(map, savedata, 3)

-- Add a Monkey Island (Curse of Moon Quay DLC)
ocean_retrofit.CurseOfMoonQuayRetrofitting_MonkeyIsland(map, savedata)
```

## Dependencies & tags
**Components used:** None. This module operates on raw `savedata` structures and map APIs. It uses external functions via `require("map/object_layout")` and `require("constants")`, `require("mathutil")`, `require("map/terrain")`.

**Tags:** The module itself does not add, remove, or check entity tags. Tags are passed as arguments to topology helpers (`AddSquareTopology`) for room classification, e.g., `{"moonhunt", "nohasslers", "lunacyarea", "not_mainland"}`.

## Properties
No properties are defined. This module exports only functions.

## Main functions
### `TurnOfTidesRetrofitting_MoonIsland(map, savedata)`
* **Description:** Attempts to place a Moon Island setpiece (large > medium > small) on ocean terrain. Adds topology nodes and removes obstructing entities (e.g., boats, monsters). Logs success/failure.
* **Parameters:**
  - `map`: The world map object with `GetTile(x, y)` and `SetTileNodeId(x, y, node_index)` methods.
  - `savedata`: Table containing `map.width`, `map.height`, `ents`, `map.topology`, `map.generated.densities`.
* **Returns:** `nil`. Side-effect only.
* **Error states:** Fails silently if no suitable terrain area is found; prints a warning message in logs.

### `TurnOfTidesRetrofitting_HermitIsland(map, savedata)`
* **Description:** Attempts to place HermitcrabIsland and CrabKing setpieces on ocean terrain, prioritizing `OCEAN_ROUGH` and `OCEAN_SWELL` tiles. Removes blocking entities and adds topology nodes if layout specifies `add_topology`.
* **Parameters:**
  - `map`: Map object with `GetTile(x, y)` and `SetTileNodeId(x, y, node_index)` methods.
  - `savedata`: Table with keys `map.width`, `map.height`, `ents`, `map.topology`.
* **Returns:** `nil`. Side-effect only.
* **Error states:** Fails silently if no valid terrain or space is found; logs candidate count and placement results.

### `WaterloggedRetrofitting_WaterlogSetpiece(map, savedata, max_count)`
* **Description:** Inserts up to `max_count` Waterlogged setpieces (Waterlogged1–4) into ocean terrain (`OCEAN_ROUGH` or `OCEAN_SWELL`). Uses 4x scale for world coordinates. Adds topology nodes but skips tile node IDs (ocean lacks them).
* **Parameters:**
  - `map`: Map object.
  - `savedata`: Save data table.
  - `max_count`: Integer (default `3`) specifying maximum number of setpieces to place.
* **Returns:** `nil`. Side-effect only.
* **Error states:** Fails silently per attempt; logs per-setpiece success/failure.

### `CurseOfMoonQuayRetrofitting_MonkeyIsland(map, savedata)`
* **Description:** Places one randomly selected Monkey Island variant (large or small, variant 1 or 2) on ocean terrain. Uses a separate 4x scale coordinate system. Removes blocking entities, adds topology nodes, and populates tile node IDs.
* **Parameters:**
  - `map`: Map object.
  - `savedata`: Save data table with `ents`, `map.topology`, etc.
* **Returns:** `nil`. Side-effect only.
* **Error states:** Fails silently if no valid placement location found; logs failure message.

## Events & listeners
None. This module performs synchronous, side-effect-only operations and does not register or dispatch events.

