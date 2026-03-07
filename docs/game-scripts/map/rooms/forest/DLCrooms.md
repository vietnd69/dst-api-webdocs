---
id: DLCrooms
title: Dlcrooms
description: Registers forest biome-specific room templates with unique entity distribution and static layouts for procedural world generation.
tags: [world, map, procedural, dlc, room]
sidebar_position: 10
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: d47f0139
---
# Dlcrooms

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines a set of custom forest- and desert-themed room templates for procedural world generation by calling the global `AddRoom` function. Each room specifies visual properties (e.g., tile colour and value), semantic tags, required prefabs, static layouts, and weighted entity distribution for vegetation, structures, and special entities. It is used during map generation to populate the overworld with themed areas, including DLC-exclusive variants like DragonflyArena, LightningBluffOasis, and MagicalDeciduous.

## Usage example
This file is not meant for direct instantiation or component usage. It is loaded automatically during world generation setup and contributes definitions to the global room registry. Modders can extend or override rooms by calling `AddRoom` in their own mod code with the same or new room names.

```lua
-- Example: Add a custom room (e.g., in modmain.lua)
AddRoom("MyCustomForest", {
    colour = {r=0.2, g=0.8, b=0.2, a=0.4},
    value = WORLD_TILES.DECIDUOUS,
    tags = {"ExitPiece"},
    contents = {
        distributepercent = 0.15,
        distributeprefabs = {
            deciduoustree = 3,
            grass = 0.5,
            flower = 1.0,
        },
    },
})
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** The rooms define various tags for runtime filtering and logic (e.g., `"CharlieStage_Spawner"`, `"ExitPiece"`, `"Astral_1"`, `"RoadPoison"`, `"sandstorm"`). Tags vary per room and are used internally by the world generation system and gameplay logic.

## Properties
This file does not define a class or component with persistent properties. It consists solely of top-level `AddRoom` calls that register room configurations in a global registry (handled by the engine's map system).

## Main functions
This file does not define any internal functions. All functionality is delegated to the engine’s `AddRoom` function, which is a global API registered elsewhere in the codebase (not shown in the provided source).

## Events & listeners
None identified. This file performs static registration during load-time and does not register or listen to any game events.

