---
id: terrain_dirt
title: Terrain Dirt
description: Registers a room template named BGDirt with dirt tile type, specific tags, and probabilistic contents for rock prefabs.
tags: [world, room, terrain]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: ebf91c44
---

# Terrain Dirt

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This script defines and registers a room template named `BGDirt` for use in world generation. It specifies the visual and functional properties of a dirt-based terrain room, including tile type, colour tint, associated tags (used for room placement rules and gameplay interactions), and contents distribution for procedural item placement (e.g., rocks). The room is intended for background or non-interactive terrain generation within forest-level maps.

## Usage example
This component is not a reusable ECS component; it is a one-time registration script executed during world generation initialization. No typical entity-level usage is applicable. Room templates like `BGDirt` are registered globally via `AddRoom()` and consumed internally by the map generation system.

## Dependencies & tags
**Components used:** None  
**Tags:** `"ExitPiece"`, `"Chester_Eyebone"`, `"Astral_2"`

## Properties
The registration does not define a persistent component instance with modifiable properties. Instead, `AddRoom` consumes an inline table with the following key-value pairs:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `colour` | `{r: number, g: number, b: number, a: number}` | `{r=1.0, g=0.8, b=0.66, a=0.5}` | RGBA tint applied to the tile when rendered. |
| `value` | `number` | `WORLD_TILES.DIRT` | Tile type identifier; maps to the internal dirt tile enum. |
| `tags` | `{string}` | `{"ExitPiece", "Chester_Eyebone", "Astral_2"}` | Tags used by the map generator to control room placement and gameplay triggers. |
| `contents` | `table` | *(structured inline)* | Defines procedural item placement rules (e.g., rock prefabs with probabilities). |

## Main functions
No standalone functions are defined in this script. The `AddRoom` function is the sole external API invoked, used to register the room template.

## Events & listeners
No event listeners or event dispatching are present. This script is a static configuration definition executed during initialization.