---
id: terrain_grass
title: Terrain Grass
description: Defines several forest-themed terrain room templates for procedural world generation, specifying tile type, visual tint, spawn tags, and content distribution rules for flora and objects.
tags: [world, procedural, room, terrain, generation]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 5ea35030
---

# Terrain Grass

This file registers five forest terrain room templates used by the world generation system to populate the Forest biome. Each room defines a grass tile type (`WORLD_TILES.GRASS`) with a specific RGBA colour tint and sets of tags that control where and how the room can be used (e.g., as an exit piece or for event spawners). The `contents` field dictates what prefabs are procedurally spawned inside the room, using either `distributepercent` + `distributeprefabs` or `countprefabs` mechanisms.

No Component class is defined in this file. Instead, the file is a declarative configuration used by `AddRoom` (a worldgen utility) to populate the `WORLDMAP.rooms` registry.

## Usage example

This file is not used directly by modders in typical modding workflows. However, to replicate its functionality for a custom terrain room, you could do:

```lua
AddRoom("MyCustomGrassPatch", {
    colour = {r = 0.4, g = 0.9, b = 0.4, a = 0.5},
    value = WORLD_TILES.GRASS,
    tags = {"ExitPiece", "CustomTag"},
    contents = {
        distributepercent = 0.15,
        distributeprefabs = {
            flower = 1.0,
            grass = 0.5,
            smallmammal = {weight = 0.02, prefabs = {"rabbithole"}},
        }
    }
})
```

## Dependencies & tags
**Components used:** None — this file does not define or use any ECS components.
**Tags:** The following tags are used across room definitions:
- `ExitPiece`
- `Chester_Eyebone`
- `Astral_1`
- `Astral_2`
- `StagehandGarden`
- `StatueHarp_HedgeSpawner`
- `CharlieStage_Spawner`

These tags likely indicate compatibility or usage constraints with specific game systems (e.g., boss arenas, quest triggers, or procedural spawners).

## Properties
No component or entity-level properties are defined in this file.

## Main functions
This file does not define any Lua functions or methods. It solely invokes the `AddRoom` utility for each terrain template.

## Events & listeners
No events or listeners are registered in this file.

---