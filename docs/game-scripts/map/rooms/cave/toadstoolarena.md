---
id: toadstoolarena
title: Toadstoolarena
description: Defines decorative and structural room layouts for the Toadstool Arena biome in the game's cave world generation system.
tags: [world, generation, map, room]
sidebar_position: 10
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: f8a6ea1e
---
# Toadstoolarena

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This script registers four distinct room definitions used in the cave world generation for the Toadstool Arena biome. It does not implement an Entity Component System component, but rather uses `AddRoom` calls to define procedural terrain and entity placement rules for specific dungeon sections. Each room type controls colour, tile type, and probabilistic placement of prefabs (e.g., flora, structures) and static layouts (e.g., pre-designed arena zones). This file is part of the world generation pipeline and integrates with the `map/room_functions.lua` module.

## Usage example
This file is not intended for direct instantiation or manual usage. It is automatically loaded during world generation. Room definitions like the following are applied internally by the world generator when placing cave biome sections:

```lua
-- Internal usage by DST world generator — do not call directly
AddRoom("ToadstoolArenaMud", {
    colour={r=1.0,g=0.0,b=0.0,a=0.9},
    value = WORLD_TILES.MUD,
    tags = {},
    contents = {
        countstaticlayouts = { ["ToadstoolArena"] = 1 },
        distributepercent = 0.1,
        distributeprefabs = {
            flower_cave = 1.0,
            cave_fern = 0.1,
        },
    }
})
```

## Dependencies & tags
**Components used:** None (this is not a component script; it is a room definition script).
**Tags:** None identified.

## Properties
No properties are defined — this file contains only configuration for room generation via `AddRoom`.

## Main functions
No standalone functions are defined — this file exclusively uses `AddRoom` from `map/room_functions`.

### `AddRoom(name, room_data)`
* **Description:** Registers a new procedural room template for use in cave generation. Each room specifies visual colour, tile type, and content rules (e.g., static layouts, random prefab distribution).
* **Parameters:**
  * `name` (`string`): Unique identifier for the room (e.g., `"ToadstoolArenaMud"`).
  * `room_data` (`table`): Configuration table with keys:
    * `colour` (`{r, g, b, a}`): RGBA values for debug/visual feedback during generation.
    * `value` (`number`): `WORLD_TILES` enum value specifying tile type (e.g., `WORLD_TILES.MUD`, `WORLD_TILES.CAVE`).
    * `tags` (`table`): Room metadata tags (empty here).
    * `contents` (`table`): Sub-table containing:
      * `countstaticlayouts` (`{ [layout_name] = count }`): Instructs the generator to place the specified static layout exactly `count` times.
      * `distributepercent` (`number`): Probability weight for this room to be selected during generation.
      * `distributeprefabs` (`{ [prefab_name] = weight }`): Probabilistic mapping of prefabs and their spawn likelihoods.
* **Returns:** None (calls internal registration logic).
* **Error states:** None documented; invalid `room_data` structure may cause generation warnings or failures.

## Events & listeners
Not applicable — this is a world generation configuration file with no runtime entity or event logic.

