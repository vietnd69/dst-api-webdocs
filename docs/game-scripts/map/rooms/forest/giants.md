---
id: giants
title: Giants
description: Registers the MooseGooseBreedingGrounds room configuration for forest world generation, defining its visual style, tags, and biome content rules.
tags: [world, map, procedural, room, forest]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 96651be2
---

# Giants

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file registers a map room called `MooseGooseBreedingGrounds` used in forest world generation. It defines the room's visual appearance (`colour`, `value`), functional tags (e.g., `ForceConnected`, `RoadPoison`), and the probabilistic placement rules for prefabs within the room via `contents.countprefabs` and `contents.distributeprefabs`. This is not a dynamic gameplay component but a static world generation definition registered at load time using the `AddRoom` API from `map/room_functions.lua`.

## Usage example
No typical component-style usage is present. This file is invoked during world generation setup to register the room definition, after which it is consumed by the world generator.

```lua
-- Internal registration (not modder-facing usage)
require("map/room_functions")
AddRoom("MooseGooseBreedingGrounds", {
    colour = {r = 0.2, g = 0.0, b = 0.2, a = 0.3},
    value = WORLD_TILES.GRASS,
    tags = {"ForceConnected", "RoadPoison"},
    contents = {
        countprefabs = {
            moose_nesting_ground = 4,
        },
        distributepercent = 0.275,
        distributeprefabs = {
            berrybush = 0.5,
            flower = 0.333,
            grass = 0.8,
            evergreen = 1,
            pond = 0.01,
        },
    },
})
```

## Dependencies & tags
**Components used:** None identified. This file does not interact with entity components (`inst.components.*`) or register entities at runtime.

**Tags:** The room definition includes two world generation tags:
- `"ForceConnected"`: Ensures the room is connected to adjacent rooms in the road network.
- `"RoadPoison"`: Marks the room as incompatible with certain road generation rules.

## Properties
No properties are defined as a class or component. This file only calls `AddRoom` with a configuration table.

## Main functions
No custom functions are defined in this file. The only externally invoked function is:
### `AddRoom(name, room_def)`
* **Description:** Registers a named room definition for use in world generation. The `room_def` table specifies visual and gameplay-related generation rules.
* **Parameters:**
  - `name`: String, the unique identifier for the room (e.g., `"MooseGooseBreedingGrounds"`).
  - `room_def`: Table containing:
    - `colour`: `{r, g, b, a}` for editor rendering.
    - `value`: `WORLD_TILES` constant (e.g., `WORLD_TILES.GRASS`), used for tile type mapping.
    - `tags`: Array of string tags affecting room connectivity or generation rules.
    - `contents`: Table defining placement logic:
      - `countprefabs`: `{ prefab_name = count }` — how many of each prefab to place unconditionally.
      - `distributepercent`: Float — probability the room is used when eligible.
      - `distributeprefabs`: `{ prefab_name = probability }` — per-tile chance to place a prefab.
* **Returns:** `nil`.
* **Error states:** None documented. Misconfiguration (e.g., invalid `WORLD_TILES` value) may cause generation failures.

## Events & listeners
None. This file performs a one-time registration at load time and does not register or listen to any events.