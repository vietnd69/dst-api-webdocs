---
id: terrain_noise
title: Terrain Noise
description: Adds a room template for procedural ground noise assets in forest and cave biomes, including flora, rocks, and spawn markers with weighted distribution rules.
tags: [world, procedural, terrain, room, spawn]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: environment
source_hash: a1f6df7b
---

# Terrain Noise

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `terrain_noise.lua` script defines a room template named `BGNoise` used during world generation to populate forest and cave environments with low-density decorative and functional ground-level assets. This template is not a physical room but a procedural placement configuration—applied via room templates and tasksets—to scatteredly distribute terrain features such as grass, flint, rocks, trees, and spawn markers (e.g., `deerspawningground`). It integrates with the world generation system through `AddRoom` and leverages `distributeprefabs` and `countprefabs` tables to control asset density and placement probability.

The component is self-contained: it does not define any component classes, interact with game entities via components, or emit or listen to runtime events. Its purpose is solely configuration for static world layout generation.

## Usage example

This template is not instantiated directly by modders at runtime. Instead, it is automatically used by the world generation system when referenced in a taskset or static layout. Modders can extend or override it by redefining `AddRoom("BGNoise", ...)` in their mod's world generation files.

Example of how to include it in a custom taskset (outside this file):
```lua
    AddPrefabPostInit("foresttaskset", function(taskset)
        taskset:AddRoom("BGNoise", { chance = 0.3 })
    end)
```

## Dependencies & tags
**Components used:** None  
**Tags:** The room is assigned the tags `ExitPiece` and `Chester_Eyebone`, indicating compatibility with exit-piece constraints and special placement rules for Chester-related content. These tags are consumed by the room placement logic, not runtime systems.

## Properties
No properties are defined in a traditional component sense; this file registers a single global room configuration via `AddRoom`. The configuration object contains the following key fields:

| Field | Type | Default Value | Description |
|-------|------|---------------|-------------|
| `colour` | `{r: number, g: number, b: number, a: number}` | `{r=0.66, g=0.66, b=0.66, a=0.50}` | Visual debug colour used in worldgen tools to highlight this room type. Not rendered in-game. |
| `value` | `WORLD_TILES` | `WORLD_TILES.GROUND_NOISE` | Internal tile identifier used by the world generation engine. |
| `tags` | `{string}` | `{"ExitPiece", "Chester_Eyebone"}` | Room placement constraints; `ExitPiece` restricts placement near room exits, and `Chester_Eyebone` enables special use in eyebone-related layouts. |
| `contents.countprefabs` | `table` | `{deerspawningground = 1}` | Specifies exact counts of certain prefabs to always place when this room is placed. |
| `contents.distributepercent` | `number` | `0.15` | Percentage of the room's area (0.0–1.0) that may be populated with distributed prefabs. |
| `contents.distributeprefabs` | `table` | See source | Key-value map where keys are prefab names (or nested table entries), and values define placement weights or structures (e.g., `weight` + `prefabs`). |

## Main functions
This file does not define any functions—only a single `AddRoom` call that registers the configuration with the game's world generation system. There are no callable methods or public APIs exposed for modder use.

## Events & listeners
No events are emitted or listened to by this component. It is purely declarative configuration for world generation.