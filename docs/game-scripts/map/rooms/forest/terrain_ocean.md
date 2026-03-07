---
id: terrain_ocean
title: Terrain Ocean
description: Registers ocean terrain room definitions for procedural world generation, mapping tile types to loot and static layout spawn rules.
tags: [world, generation, room]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: a01d18d6
---

# Terrain Ocean

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This script defines and registers ocean terrain "rooms" used by the world generation system. Each room corresponds to a specific ocean tile type (e.g., Coastal, Swell, Rough) and specifies what entities (`distributeprefabs`) and static layouts (`countstaticlayouts`) may appear on tiles of that type. It does not implement an ECS component but rather serves as a configuration layer for the map generation system, populated via `AddRoom()` calls.

## Usage example
This file is loaded automatically during world generation initialization and does not require manual instantiation. However, modders can extend or override ocean room definitions by calling `AddRoom()` with the same parameters in their own mod's `modmain.lua`:

```lua
AddRoom("OceanDeep", {
    colour = { r = 0.3, g = 0.4, b = 0.1, a = 0.1 },
    value = WORLD_TILES.OCEAN_DEEP,
    contents = {
        distributepercent = 0.02,
        distributeprefabs = {
            deep_sea_fish_spawner = 0.5,
        },
        countstaticlayouts = {
            ["SunkenShip"] = 1,
        },
    }
})
```

## Dependencies & tags
**Components used:** None identified. This script operates at the map/world generation level and does not interact with ECS components.
**Tags:** None identified.

## Properties
The script itself contains no persistent properties or instance variables. It solely defines `room` configurations passed to `AddRoom()`.

## Main functions
The core functionality is provided by the global `AddRoom()` function, which is imported from the world generation engine.

### `AddRoom(name, roomDef)`
* **Description:** Registers a new terrain room definition for procedural world generation. The `name` is a unique identifier (e.g., `"OceanSwell"`), and `roomDef` specifies visual, logical, and content rules.
* **Parameters:**
  * `name` (`string`): Unique room identifier; used internally to reference the room type.
  * `roomDef` (`table`): Room configuration table with fields:
    * `colour` (`{r,g,b,a}`): Hex-like RGBA values used for debugging/preview rendering.
    * `value` (`number`): Matches a `WORLD_TILES.*` constant, identifying the tile this room corresponds to.
    * `contents` (`table`, optional): Spawn rules:
      * `distributepercent` (`number`, 0.0 to 1.0): Chance this room appears in adjacent tile sampling.
      * `distributeprefabs` (`{prefabName = weight}`): Dictionary of prefabs to spawn probabilistically.
      * `countstaticlayouts` (`{layoutName = countOrFunction}`): Static layouts to place, with optional count determinants (e.g., `math.random` or world-size checks).
      * `required_prefabs` (`{string}` or `string`, optional): Prefabs that *must* already be present for this room to spawn.
      * `countprefabs` (`table`, optional): Reserved for future use; currently unused.
* **Returns:** `nil`.
* **Error states:** None documented; invalid values may cause silent fallbacks or warnings during generation.

## Events & listeners
This script does not register or emit any events.