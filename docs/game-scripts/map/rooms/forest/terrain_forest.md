---
id: terrain_forest
title: Terrain Forest
description: Registers multiple forest-themed world room templates with specific tile values, spawn weights, and static layout counts for procedural map generation.
tags: [world, map, procedural]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 7e71503e
---

# Terrain Forest

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file registers a collection of forest-related room templates using the `AddRoom` function. Each room defines a distinct procedural layout for forest biomes, including variations such as `Forest`, `DeepForest`, `BurntForest`, and specialized variants like `SpiderForest` or `MoonbaseOne`. Rooms specify tile type (`WORLD_TILES.FOREST`), display color (RGBA), tags (used by spawners and systems), content generation parameters (distributeprefabs, countstaticlayouts, countprefabs), and per-prefab spawn logic. This is part of the world generation system, not an Entity Component System component.

## Usage example
Typical usage is internal to world generation and not instantiated directly by modders. However, modders may register custom forest rooms similarly:

```lua
AddRoom("MyCustomForest", {
    colour = {r = 0.1, g = 0.9, b = 0.1, a = 0.5},
    value = WORLD_TILES.FOREST,
    tags = {"ExitPiece", "Chester_Eyebone"},
    contents = {
        distributepercent = 0.5,
        distributeprefabs = {
            evergreen = 2.0,
            berrybush = 0.05,
            trees = {weight = 4, prefabs = {"evergreen", "evergreen_sparse"}}
        }
    }
})
```

## Dependencies & tags
**Components used:** None (no component interactions; uses global functions `AddRoom`, `WORLD_TILES`, and `TUNING`).
**Tags:** All registered rooms may include one or more of the following tags: `ExitPiece`, `Chester_Eyebone`, `StatueHarp_HedgeSpawner`, `CharlieStage_Spawner`, `StagehandGarden`, `Terrarium_Spawner`, `Junkyard_Spawner`, `Balatro_Spawner`, `RoadPoison`.

## Properties
No public properties are exposed in the traditional component sense. This file consists solely of top-level calls to `AddRoom` with configuration tables.

## Main functions
This file does not define functions; it invokes `AddRoom` with room definitions.

### `AddRoom(roomname, config)`
* **Description:** Registers a room template used by the world generator to populate forest biomes. Defines how prefabs (e.g., trees, mushrooms, structures) are spawned, with optional static layout counts and per-prefab initialization logic.
* **Parameters:**
  * `roomname` (`string`): Unique identifier for the room (e.g., `"BGForest"`).
  * `config` (`table`): Configuration table with the following optional keys:
    * `colour` (`{r, g, b, a}`): RGBA values used for minimap rendering.
    * `value` (`WORLD_TILES.*`): Tile type identifier (here always `WORLD_TILES.FOREST`).
    * `tags` (`table`): List of string tags used by world generation spawners and systems.
    * `contents` (`table`): Room content specification:
      * `distributepercent` (`number`): Relative probability weight for this room to be selected during generation.
      * `distributeprefabs` (`table` or `function`): Maps prefab names to spawn weight (`number`) or dynamic weight function (`function` returning `number`). Also supports special key `"trees"` with sub-table `{weight, prefabs}`.
      * `countprefabs` (`table`): Maps prefab names to exact count (e.g., `spawnpoint_multiplayer = 1`).
      * `countstaticlayouts` (`table`): Maps static layout names to count function (`function` returning `number`).
      * `prefabdata` (`table`): Maps prefab names to data function (`function` returning `table`), used to set per-instance prefab data (e.g., `growable.stage` or `burnt=true`).
* **Returns:** None.
* **Error states:** Invalid room names, non-table `contents`, or malformed `distributeprefabs` / `prefabdata` structures may cause runtime errors or unexpected room generation.

## Events & listeners
None.