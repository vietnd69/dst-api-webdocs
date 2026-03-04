---
id: lavaarena
title: Lavaarena
description: Defines the Lava Arena map task configuration used during world generation to specify layout rules and constraints.
tags: [world, map, task]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: 58129bcc
system_scope: world
---

# Lavaarena

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This task file registers a map task named `LavaArenaTask` as part of the world generation system. It specifies how the Lava Arena map structure is placed, constrained, and visually represented. The task defines minimal configuration: it allows only the "Blank" room type, uses an impassable background tile, and assigns a distinct purple color for in-world visualization. It does not implement logic beyond static configuration; it serves as a declarative setup for map generation.

## Usage example
The task is automatically registered during world generation via the game’s map task system and does not require manual instantiation. Modders may reference it in custom tasksets or override its parameters in custom world generation logic.

```lua
-- This task is registered at load time via AddTask("LavaArenaTask", {...})
-- No manual component addition or calling is required.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `locks` | table | `{}` | Empty table; no locks are enforced for this task during placement. |
| `keys_given` | table | `{}` | Empty table; no keys are required to unlock or use this task. |
| `room_choices` | table | `{ ["Blank"] = 1 }` | Defines allowed room types and relative weights; only `"Blank"` is allowed with weight `1`. |
| `background_room` | string | `"Blank"` | Specifies the background room used for rendering this task’s area. |
| `room_bg` | constant | `WORLD_TILES.IMPASSABLE` | Tile type used for the background area of the task; here it blocks movement and placement. |
| `colour` | table | `{r=1, g=0, b=1, a=1}` | RGBA color used for debugging/overlay visualization (magenta/opaque). |

## Main functions
This file does not define any functions. It only calls `AddTask()` during module load.

## Events & listeners
None identified