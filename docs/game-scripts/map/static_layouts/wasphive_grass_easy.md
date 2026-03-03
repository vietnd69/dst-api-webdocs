---
id: wasphive_grass_easy
title: Wasphive Grass Easy
description: Static map layout for the wasphive biome with easy difficulty grass placement and wasphive structures.
tags: [map, terrain, environment, structure]
sidebar_position: 1
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: e97952a6
system_scope: world
---
# Wasphive Grass Easy

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout (Tiled map format) used for generating the "Easy" difficulty variant of the wasphive biome in DST. It specifies background tile placements (`BG_TILES`) and foreground object placements (`FG_OBJECTS`) including grass and wasphive prefabs. The layout is used by the world generation system to place structures and decor in the wasphive environment during level setup.

## Usage example
This file is not meant to be used as a component directly. It is a static map definition imported by the world generation system. Typical usage involves referencing it via the map system, for example:

```lua
local map = require("map/static_layouts/wasphive_grass_easy")
-- The map table is used internally by the level/room loader
-- to spawn prefabs (e.g., "grass", "wasphive") at specified positions.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version target. |
| `orientation` | string | `"orthogonal"` | Map projection type. |
| `width` | number | `12` | Map width in tiles. |
| `height` | number | `12` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | (see source) | List of tileset definitions. |
| `layers` | table | (see source) | Array of map layers (tile and object layers). |

## Main functions
Not applicable — this file returns a static data structure, not a functional component.

## Events & listeners
Not applicable — this file contains no runtime logic, event listeners, or event pushes.

## Layers
### `BG_TILES`
- Type: `tilelayer`
- Size: 12×12 tiles
- Content: Background tiles only (data populated with tile IDs; value `6` appears at select positions).
- Purpose: Provides static environmental background visuals.

### `FG_OBJECTS`
- Type: `objectgroup`
- Content: Placement of `grass` and `wasphive` prefabs as Tiled objects with x/y coordinates in pixels.
- Purpose: Defines where decorative grass and structural wasphives are instantiated in the game world. Each object’s `type` field maps to a prefab name used by the game.

