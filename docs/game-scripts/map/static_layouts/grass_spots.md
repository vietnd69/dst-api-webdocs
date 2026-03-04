---
id: grass_spots
title: Grass Spots
description: Static layout definition containing background tile patterns used to render grassy terrain in DST maps.
tags: [map, static_layout, tileset, terrain]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 980a641a
system_scope: environment
---

# Grass Spots

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

This file (`grass_spots.lua`) defines a static layout in Tiled Map Editor format (JSON-compatible Lua table), not an ECS component. It specifies a 24x24 grid of tiles used for rendering background grass terrain in world generation. It contains no code logic, entity behavior, or runtime functionality — it serves purely as static map data consumed by the world generation system. As such, it does not interact with the Entity Component System and has no runtime component instances, properties, or methods.

## Usage example

This file is not used directly in gameplay code. It is referenced by the world generation system when populating map areas with specific terrain layouts. Example usage is internal to the engine:

```lua
-- Internally, static layouts like this are loaded and processed by map generation systems (e.g., worldgen.lua)
-- as part of room placement and terrain setup. No direct Lua code is expected to call this file.
```

## Dependencies & tags

**Components used:** None  
**Tags:** None  

This file is a static data definition and does not interact with components, tags, or ECS structures.

## Properties

This file does not define a component and thus has no component properties. It *is* a table of static map properties, documented as follows:

| Field         | Type    | Value                    | Description                                                  |
|---------------|---------|--------------------------|--------------------------------------------------------------|
| `version`     | string  | `"1.1"`                  | Tiled file format version                                     |
| `luaversion`  | string  | `"5.1"`                  | Lua version targeted for serialization                        |
| `orientation` | string  | `"orthogonal"`           | Tile orientation mode                                         |
| `width`       | integer | `24`                     | Map width in tiles                                            |
| `height`      | integer | `24`                     | Map height in tiles                                           |
| `tilewidth`   | integer | `16`                     | Width of each tile in pixels (grid coordinate system)       |
| `tileheight`  | integer | `16`                     | Height of each tile in pixels (grid coordinate system)      |
| `properties`  | table   | `{}`                     | Global properties (empty)                                     |
| `tilesets`    | array   | `[ { ... } ]`            | List of tileset references (contains one entry)              |
| `layers`      | array   | `{ BG_TILES, FG_OBJECTS }`| List of map layers (background tiles + foreground objects)  |

The `BG_TILES` layer contains a linearized 576-element (`24 * 24`) array of tile IDs. Non-zero values correspond to tile IDs in the referenced tileset (`tiles.png`). For example:
- Tile ID `5` and `6` appear at specific grid positions, forming repeating grass textures.
- Tile ID `0` indicates no tile (empty space).

## Main functions

This file does not contain any functions.

## Events & listeners

No events or listeners exist for this file.