---
id: sculptures_2
title: Sculptures 2
description: Defines a static layout for decorative and interactive sculptures in the game world using Tiled map data.
tags: [map, decoration, static]
sidebar_position: 10
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: fd2274f1
system_scope: environment
---
# Sculptures 2

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is not a component, but a static map layout definition written in Tiled JSON format (exported as Lua table). It describes the placement of decorative and interactive elements—including statues, flowers, and named sculpture prefabs (`statue_marble_muse`, `flower`, `sculpture_random`, `sculpture_bishop`, `sculpture_knight`)—within a 16x16 tile grid in the game world. It belongs to the `map/static_layouts` directory and is used during world generation to populate areas with pre-configured visual and thematic content.

## Usage example
This file is consumed by the game's map loading system and is not instantiated directly by modders. It is referenced by higher-level world generation scripts (e.g., in `map/tasksets/` or `map/levels/`) via `static_layouts.sculptures_2`.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version used for embedded data |
| `orientation` | string | `"orthogonal"` | Map rendering orientation |
| `width` | number | `16` | Map width in tiles |
| `height` | number | `16` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels (collision grid) |
| `tileheight` | number | `16` | Height of each tile in pixels (collision grid) |
| `tilesets` | array | See source | Tileset metadata (image, dimensions, firstgid) |
| `layers` | array | See source | Layer definitions (e.g., `"BG_TILES"`, `"FG_OBJECTS"`) |

## Main functions
Not applicable — this file exports static data, not executable logic.

## Events & listeners
Not applicable — this file contains no event logic.

## Notes for Modders
- The `objects` array in the `"FG_OBJECTS"` layer specifies entity placements via `x`, `y` (in pixels, grid-aligned) and `type` fields corresponding to prefab names (e.g., `"sculpture_bishop"`).
- Tile layers (e.g., `"BG_TILES"`) use zero-based padding; non-zero values map to `tilesets[1]` (e.g., `data[1] = 0` → empty, `data[4] = 10` → specific tile from `tiles.png`).
- This file must be manually loaded and spawned in world generation code using `StaticLayout.Load(...)` or similar engine APIs; it is not auto-applied.
- Modders may modify or extend this layout by creating new `.lua` files in `map/static_layouts/` and referencing them in worldgen overrides.
