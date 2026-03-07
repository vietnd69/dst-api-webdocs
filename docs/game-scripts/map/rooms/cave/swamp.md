---
id: swamp
title: Swamp
description: Defines cave swamp map room templates with varying layouts, densities, and prefab distributions for procedural world generation.
tags: [map, procedural, room, worldgen]
sidebar_position: 10
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: environment
source_hash: 4c040fdd
---
# Swamp

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines multiple pre-configured cave swamp room templates for use in DST's procedural world generation system. Each room variant (e.g., `SinkholeSwamp`, `DarkSwamp`, `TentacleMud`) specifies visual properties (`colour`), terrain type (`WORLD_TILES.MARSH`), and content rules for distributing random prefabs like `tentacle`, `marsh_bush`, `spiderden`, and cave lights. Rooms are registered using `AddRoom`, and one layout (`BGSinkholeSwamp`) is additionally converted into a static room via `Roomify`. These definitions influence how swampy caverns appear and behave in the Caves layer during map generation.

## Usage example
This file is executed during world generation initialization and does not require manual instantiation. It registers room templates for use by the map generation system.

```lua
-- The following is registered automatically when the game loads this file:
-- An example of how these rooms may be referenced internally during worldgen:
local room = GetRoom("SinkholeSwamp")  -- Retrieves the registered room definition
-- (This is illustrative; actual room lookup and usage occurs in the map generation system.)
```

## Dependencies & tags
**Components used:** None identified. This file interacts solely with the `map/room_functions` module via `require` to register room templates.

**Tags:** All defined rooms include the `"Hutch_Fishbowl"` tag, which indicates they are part of the Hutch/Fishbowl generation rule set (likely used for cave-specific placement rules).

## Properties
No component or instance-level properties exist; this file only declares map room templates using `AddRoom`.

## Main functions
This file does not define any standalone Lua functions. It calls `AddRoom` with room configuration tables to register each swamp variant.

### `AddRoom(name, config)`
* **Description:** Registers a map room template for use in procedural world generation. Each call defines a unique room variant with specific content rules.
* **Parameters:**
  - `name` (`string`): The identifier used to reference the room in worldgen tasksets (e.g., `"SinkholeSwamp"`).
  - `config` (`table`): A room definition table containing:
    - `colour` (`{r,g,b,a}`): Room-specific tint applied during rendering.
    - `value` (`WORLD_TILES.*`): Terrain tile type (here, `WORLD_TILES.MARSH`).
    - `tags` (`table`): List of generation tags (e.g., `{"Hutch_Fishbowl"}`).
    - `contents`: Rules for random item placement:
      - `distributepercent` (`number`): Probability threshold for random item distribution.
      - `distributeprefabs`: Map of `prefabname → weight` for random placement.
      - `countstaticlayouts` (`table`, optional): Static layout templates (e.g., `["Mudlights"]=6`) and their count.
      - `prefabdata` (`function`, optional): Custom data generator for specific prefabs (e.g., `spiderden` growth stage).
* **Returns:** None. Registers the room definition internally for use by the world generator.

## Events & listeners
None identified.

