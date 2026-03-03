---
id: skeleton_wizard_ice
title: Skeleton Wizard Ice
description: Defines a static layout map layer for the Skeleton Wizard's ice-themed boss lair, specifying tile placements and object spawn positions.
tags: [world, map, static_layout]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: d701535c
system_scope: world
---

# Skeleton Wizard Ice

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout used in the Skeleton Wizard's ice-themed boss arena. It is a Tiled JSON-compatible Lua table (not a traditional ECS component) describing background tiles, foreground object positions, and entity spawn points for the arena. It does not implement behavior logic itself — rather, it provides spatial configuration consumed by the world generation system to construct the arena environment.

## Usage example
This file is not used directly as a component. It is imported and processed by the world generation task system. Example integration (not direct usage):
```lua
-- Within a worldgen task, this layout may be referenced or merged:
-- static_layouts.skeleton_wizard_ice
-- The engine loads and renders tiles and spawns prefabs at specified positions.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version |
| `luaversion` | string | `"5.1"` | Target Lua version |
| `orientation` | string | `"orthogonal"` | Tile orientation |
| `width` / `height` | number | `16` | Grid dimensions in tiles (16×16) |
| `tilewidth` / `tileheight` | number | `16` | Size of individual tile units |
| `tilesets` | table | see source | Tileset definition with source image and properties |
| `layers` | table | see source | Array of layer definitions: background tiles (`BG_TILES`) and foreground objects (`FG_OBJECTS`) |

## Main functions
Not applicable — this is a static data definition, not a component with behavioral methods.

## Events & listeners
Not applicable — no event handling or scripting logic.