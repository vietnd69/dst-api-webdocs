---
id: test
title: Test
description: Defines debug and test room templates for world generation, primarily used to validate static layouts and prefab distributions during development.
tags: [debug, testing, worldgen]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 6e18f946
---

## Overview
This file registers a set of static test rooms via the `AddRoom` function for use in world generation debugging and validation. It does not define a component in the Entity Component System (ECS) sense (i.e., no `Class(function(self, inst) ... end)` constructor or `inst:AddComponent` calls). Instead, it is a world generation utility that declares named room templates (e.g., `"MaxPuzzle1"`, `"TEST_ROOM"`) with specific tile values, colors, static layout placements, and dynamic prefab distribution rules.

These rooms are intended for internal use only — typically during development or testing — to ensure world gen logic, static layouts, and prefab spawning behave as expected. They are not used in production game worlds.

## Usage example
This file does not provide component usage. It is executed during world generation initialization to register room definitions. A modder could replicate its pattern to define custom test rooms:

```lua
AddRoom("MyTestRoom", {
    colour = { r=1.0, g=0.0, b=0.0, a=0.5 },
    value = WORLD_TILES.GRASS,
    contents = {
        countstaticlayouts = { ["MyStaticLayout"] = 1 },
        countprefabs = {
            tree = function() return 5 end,
            flower = 10,
        },
        distributeprefabs = {
            bush = 0.1,
        },
    },
})
```

## Dependencies & tags
**Components used:** None. This file does not use or interact with any ECS components.
**Tags:** None identified.

## Properties
No properties are defined in the ECS component sense. This file only uses local tables passed to `AddRoom`.

## Main functions
This file does not define any standalone functions beyond calling `AddRoom`.

### `AddRoom(name, roomdata)`
* **Description:** Registers a named room template with the world generation system. `roomdata` specifies tile type, visual appearance, static layouts, and dynamic prefab spawning behavior.
* **Parameters:**
  * `name` (`string`): Unique identifier for the room (e.g., `"TEST_ROOM"`).
  * `roomdata` (`table`): Configuration table with keys `colour`, `value`, and `contents`.
    * `colour` (`{r: number, g: number, b: number, a: number}`): RGBA color for debug visualization in the world editor.
    * `value` (`WORLD_TILES.*`): Tile type constant (e.g., `WORLD_TILES.GRASS`, `WORLD_TILES.FUNGUS`).
    * `contents`: Table containing one or more of:
      * `countstaticlayouts` (`{[layout_name] = count}`): Static layouts to place exactly this many times.
      * `countprefabs` (`table`): Prefabs to spawn with fixed counts or via `function() return count end`.
      * `distributepercent` (`number`): Chance (0.0–1.0) to use this room when building the world.
      * `distributeprefabs` (`table`): Prefabs to scatter with relative weights.
* **Returns:** None.
* **Error states:** Room names must be unique; duplicate names may cause undefined behavior or overwrite previous definitions.

## Events & listeners
No events are listened to or pushed by this file.

---