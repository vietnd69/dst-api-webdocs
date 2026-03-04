---
id: maxwell_1
title: Maxwell 1
description: Tiled map data layout for the Maxwell level in Don't Starve Together, defining static tile layers and object placements for the arena environment.
tags: [map, static, level, layout, static_layout]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 3d43e2fe
system_scope: world
---

# Maxwell 1

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file is a Tiled map export (`maxwell_1.lua`) used to define the static geometry and object layout of the Maxwell arena level in Don't Starve Together. It contains two layers: a tile layer (`BG_TILES`) representing background floor patterns, and an object group (`FG_OBJECTS`) listing entity placements (e.g., `marblepillar`, `marbletree`, `flower_evil`, `knight`, `rook`). The file is a data definition with no runtime component logic and does not implement ECS components, event handling, or dynamic behavior. It is consumed at world initialization to spawn entities and place tiles.

## Usage example
This file is not instantiated or used directly in gameplay logic. Instead, it is referenced by the world generation system to load level data. No code snippet is applicable for modders to use as a component.

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
The file exports a table with static map metadata. The following keys are defined:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua interpreter version target |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `32` | Map width in tiles |
| `height` | number | `32` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `properties` | table | `{}` | Global map properties (empty) |
| `tilesets` | table | (see source) | Tileset definitions, including `tiles.png` reference and `firstgid = 1` |
| `layers` | table | (see source) | Array of layers: `BG_TILES` (tile layer) and `FG_OBJECTS` (object group) |

## Main functions
This file is data-only and defines no executable functions. It returns a static table used by the engine to reconstruct the arena environment.

## Events & listeners
None — this file is a data definition with no runtime behavior or event interaction.