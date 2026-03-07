---
id: terrain_savanna
title: Terrain Savanna
description: Registers Savanna-style terrain room templates for world generation in DST, defining biome-specific prefabs and placement probabilities for forest biomes.
tags: [world, terrain, roomgen]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: c20033f5
---

# Terrain Savanna

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines three room templates — `BGSavanna`, `Plain`, and `BarePlain` — used for procedural world generation of Savanna terrain in the Forest world. Each room specifies tile type (`WORLD_TILES.SAVANNA`), a visual tint color, required tags for compatibility with game systems (e.g., exiting regions, Chester/Eyebone compatibility, Astral progression markers), and probabilistic prefab placement rules. These templates are registered via the global `AddRoom` function and used by the worldgen system to populate Savanna biomes in forest maps.

## Usage example
This component is not instantiated as an ECS component. It is invoked during worldgen initialization to register room definitions. A typical use in modding context involves calling `AddRoom` during `modmain.lua` or `main.lua` load time:

```lua
AddRoom("MyCustomSavannaRoom", {
    colour = {r = 0.9, g = 0.7, b = 0.3, a = 0.5},
    value = WORLD_TILES.SAVANNA,
    tags = {"ExitPiece"},
    contents = {
        distributepercent = 0.15,
        distributeprefabs = {
            perma_grass = 0.6,
            rabbithole = 0.1,
            beefalo_hurd = 0.05,
        }
    }
})
```

## Dependencies & tags
**Components used:** None — this file uses only global API (`AddRoom`) and constants (`WORLD_TILES.SAVANNA`).  
**Tags:** All registered rooms include the following tags:
- `ExitPiece`: Marks room as an exit/transition piece.
- `Chester_Eyebone`: Allows room generation when Chester follows the player.
- `Astral_1` or `Astral_2`: Indicates Astral progression stage compatibility.
- `CharlieStage_Spawner`: Specific to `BGSavanna`; enables Charlie night spawner logic.

## Properties
This file does not define a component class or ECS component. No properties are initialized beyond inline table parameters passed to `AddRoom`. Table parameters for each room are:
- `colour` (`table`): RGBA color values (0.0–1.0 range) used for debug rendering or tinting.
- `value` (`WORLD_TILES` constant): Tile type identifier (here, `WORLD_TILES.SAVANNA`).
- `tags` (`table` of strings): Room compatibility tags.
- `contents.distributepercent` (`number`): Relative probability weight for room selection.
- `contents.distributeprefabs` (`table`): Prefab name → spawn probability mapping.

## Main functions
This file contains no functions beyond top-level `AddRoom` calls. No custom methods are defined.

## Events & listeners
This file does not register or fire any events.