---
id: oceanmonument
title: Oceanmonument
description: Defines the static layout data for the Ocean Monument map room using Tiled JSON format, including tile layer configurations and object placements for ocean-based encounters.
tags: [map, room, ocean]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 60c9f716
system_scope: world
---

# Oceanmonument

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`Oceanmonument` is a static map room layout definition for the Ocean Monument area in DST. It specifies the tile layer (`BG_TILES`) and object placements (`FG_OBJECTS`) using Tiled JSON format. This file describes the visual and spatial configuration of the ocean monument room, including ground tiles and interactive objects like sunken chests and sea stack resources. It is used during world generation to instantiate the room in the ocean biome.

## Usage example
```lua
-- Typically loaded automatically by the world generation system:
-- No direct usage in mod code is intended or required.
-- This file is consumed by the map room loading system via static_layouts.lua.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility flag. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `8` | Room width in tiles. |
| `height` | number | `8` | Room height in tiles. |
| `tilewidth` | number | `64` | Width of each tile in pixels. |
| `tileheight` | number | `64` | Height of each tile in pixels. |
| `tilesets[1].name` | string | `"ground"` | Name of the tileset used. |
| `tilesets[1].image` | string | `".../tiles.png"` | Path to the tileset image. |
| `layers[1].name` | string | `"BG_TILES"` | Background tile layer name. |
| `layers[1].data` | table | 8x8 tile ID array | Tile IDs for background layer (row-major order). |
| `layers[2].name` | string | `"FG_OBJECTS"` | Foreground object group name. |
| `layers[2].objects` | table |见 source | List of placed objects with position, type, and metadata. |

## Main functions
None identified — this file returns static data only.

## Events & listeners
None identified — no runtime logic or event handling is present.

## Notes
- The layout contains 8×8 tiles with a 64×64 tile size, resulting in a 512×512 pixel room.
- The `FG_OBJECTS` layer contains 10 objects:
  - 1 `sunkenchest` object with scenario tag `"sunkenchest_oceanmonument"`.
  - 9 `seastack` objects with `"data.stackid"` values of `"1"` or `"4"` (indicating resource variety).
- This file is part of the `static_layouts` subsystem, which provides deterministic room templates for world generation.
- The map is not a component or entity in the ECS; it is pure data, interpreted at runtime by room loading systems.