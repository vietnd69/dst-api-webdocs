---
id: terrain_moonisland
title: Terrain Moonisland
description: Defines procedural room templates and static layout placements for the Moon Island biome in Don't Starve Together.
tags: [world, map, generation, biome]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 8a5c20c6
---

# Terrain Moonisland

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines static room configurations for the Moon Island biome using the `AddRoom` world generation API. It specifies visual properties, tile types, connection behavior, and content distribution rules for seven distinct room variants (e.g., `MoonIsland_IslandShard`, `MoonIsland_Forest`, `MoonIsland_Mine`). These rooms are used by the procedural map generator to populate Moon Island instances during world generation. The file contains no reusable ECS components—it is purely declarative worldgen data.

## Usage example
This file is not intended for direct usage in mod code. Room definitions are loaded automatically during world initialization. To add custom Moon Island rooms, modders should use the `AddRoom` function in their own world generation scripts (e.g., `map/wORLDGEN_OVERRIDES` or `map/tasksets`), following the same structure.

```lua
-- Example mod patch to add a new custom room type
AddRoom("Custom_MoonIsland_Cove", {
    colour = {r = 0.4, g = 0.2, b = 0.1, a = 0.3},
    value = WORLD_TILES.PEBBLEBEACH,
    tags = {"RoadPoison"},
    contents = {
        countprefabs = { },
        distributepercent = 0.2,
        distributeprefabs = {
            custom_moon_plant = 1.0,
            flint = 0.5,
        },
    },
})
```

## Dependencies & tags
**Components used:** None. This file does not interact with entity components; it uses worldgen APIs.
**Tags:** All room definitions include `tags = {"RoadPoison"}` or `{"ForceDisconnected", "RoadPoison"}`, except `MoonIsland_Meadows` and `MoonIsland_Forest`, where the tags are commented out. Room types also set `type = NODE_TYPE.SeparatedRoom` or `NODE_TYPE.Blank`, and/or `internal_type = NODE_INTERNAL_CONNECTION_TYPE.EdgeCentroid`.

## Properties
This file does not define any component properties. It only invokes the global `AddRoom` function multiple times with room configuration tables.

## Main functions
### `AddRoom(name, config)`
* **Description:** Registers a new room template for use by the world generator. This function is called during early startup to populate the available room library.
* **Parameters:**
  * `name` (`string`): Unique identifier for the room (e.g., `"MoonIsland_Forest"`).
  * `config` (`table`): Configuration table with the following keys:
    * `colour` (`{r, g, b, a}`): Optional RGBA table for debug visualization.
    * `value` (`number`): A `WORLD_TILES` constant defining the base tile type (e.g., `WORLD_TILES.METEORCOAST_NOISE`).
    * `tags` (`table<string>`): Optional list of tag strings (e.g., `"RoadPoison"`, `"ForceDisconnected"`).
    * `type` (`NODE_TYPE.*`): Optional override for room type (default: `NODE_TYPE.Normal` if omitted).
    * `internal_type` (`NODE_INTERNAL_CONNECTION_TYPE.*`): Optional override for internal node connections (e.g., `EdgeCentroid`).
    * `random_node_entrance_weight` / `random_node_exit_weight` (`number`): Optional weights for random node selection; set to `0` to disable.
    * `contents.countstaticlayouts` (`table<string -> function|number>`): Optional static layout templates and counts or count functions (e.g., `["moontrees_2"] = function(area) ... end`).
    * `contents.countprefabs` (`table<string -> function|number>`): Optional entity prefabs and counts or count functions.
    * `contents.distributepercent` (`number`): Probability (0.0–1.0) that the room will be selected during generation.
    * `contents.distributeprefabs` (`table<string -> number>`): Optional distributed prefab placement weights.
* **Returns:** `nil`. Side effect only.
* **Error states:** Fails if `name` conflicts with an existing room or if required keys (`value`, `contents`) are missing.

## Events & listeners
This file does not register any event listeners or emit events.