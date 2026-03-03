---
id: cave_test_start
title: Cave Test Start
description: A static layout configuration file for the cave test start area, defining tilemap data, object placements, and spawn points used for early-game testing and tutorial scenarios in Don't Starve Together.
tags: [map, layout, test, spawn, cave]
sidebar_position: 1
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: dad897e8
system_scope: environment
---
# Cave Test Start

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static layout for the cave test start area, used for testing, tutorials, or demonstration scenarios in the Caves dimension. It specifies a 16x16 grid (with 64x64 px tiles) for background tiles and an object group containing critical gameplay fixtures such as spawn points, entrance markers, a treasure chest, a research lab, and a cookpot. The layout uses Tiled map format version 1.1 and is authored in Lua for integration with DST's world generation system.

This file is not a component in the ECS sense—it is a static data structure returned as a table, intended for consumption by the world generation or map loading system to instantiate entities and tile content. It does not define or interact with runtime ECS components directly.

## Usage example
This file is loaded by the engine during world generation when the `cave_test_start` layout is referenced. Modders rarely instantiate it directly; instead, it is used by map/room/task systems:

```lua
-- Example: referencing this layout from a taskset or room file (pseudo-code)
local cave_test_start = require "map/static_layouts/cave_test_start"

-- In a room script, the layout might be used like:
room:SetLayout(cave_test_start)
room:PlaceObjects() -- internally processes tile layer and object group
```

## Dependencies & tags
**Components used:** None. This file is a static data descriptor and does not directly access or depend on ECS components.

**Tags:** None. It does not tag entities—it provides the blueprint for where entities (e.g., `treasurechest`, `researchlab2`) will be placed, and those prefabs themselves may define tags.

## Properties
This is a data-return file, not a constructor. It defines a top-level table with the following structure:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | `string` | `"1.1"` | Tiled map format version. |
| `luaversion` | `string` | `"5.1"` | Lua version for the file. |
| `orientation` | `string` | `"orthogonal"` | Tilemap orientation. |
| `width` | `number` | `16` | Map width in tiles. |
| `height` | `number` | `16` | Map height in tiles. |
| `tilewidth` | `number` | `16` | Logical tile width (not used directly; actual visual tile is 64x64). |
| `tileheight` | `number` | `16` | Logical tile height (not used directly). |
| `properties` | `table` | `{}` | Map-level custom properties (empty here). |
| `tilesets` | `array<table>` | *(see source)* | Contains tileset definitions for rendering background layers. |
| `layers` | `array<table>` | *(see source)* | Contains layer definitions (tile layer and object group). |

### Tileset (`tilesets[1]`)
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `name` | `string` | `"ground"` | Tileset name. |
| `firstgid` | `number` | `1` | First global tile ID. |
| `filename` | `string` | Path to `.tsx` file | Tileset definition source. |
| `image` | `string` | Path to `.png` | Tileset image path. |
| `imagewidth` | `number` | `512` | Width of tileset image in pixels. |
| `imageheight` | `number` | `256` | Height of tileset image in pixels. |
| `tilewidth` | `number` | `64` | Width of a single tile in pixels. |
| `tileheight` | `number` | `64` | Height of a single tile in pixels. |

### Layers (`layers`)
Two layers defined:

#### `layers[1]` — BG_TILES (tile layer)
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `type` | `string` | `"tilelayer"` | Layer type. |
| `name` | `string` | `"BG_TILES"` | Layer name. |
| `width` | `number` | `16` | Layer width in tiles. |
| `height` | `number` | `16` | Layer height in tiles. |
| `data` | `array<number>` | `16x16` grid | Row-major tile IDs (`0` = empty, `3`, `6` = ground tile IDs). |

#### `layers[2]` — FG_OBJECTS (object group)
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `type` | `string` | `"objectgroup"` | Layer type. |
| `name` | `string` | `"FG_OBJECTS"` | Layer name. |
| `objects` | `array<table>` | *(see source)* | List of placement objects. |

### Objects (`layers[2].objects`)
Each object defines a placement marker:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `name` | `string` | `""` | Object name (unused). |
| `type` | `string` | `"spawnpoint"`, etc. | Object type—interpreted by engine to spawn a specific prefab. |
| `x` / `y` | `number` | e.g. `176`, `80` | Screen coordinates in pixels (tilesize `64` → coords align to 2.75x, 1.25x tile units). |
| `width` / `height` | `number` | `0` | Typically `0` for point markers. |
| `properties` | `table` | `{}` | Optional extra data (e.g., `["scenario"] = "chest_cave"`). |

## Main functions
This file does not define any functions. It is a static data descriptor returning a table.

## Events & listeners
This file does not register or fire any events, as it is not an ECS component. Event logic resides in the prefabs or systems that consume this layout (e.g., `treasurechest` prefab logic on instantiation).

