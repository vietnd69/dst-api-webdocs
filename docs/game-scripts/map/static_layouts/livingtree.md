---
id: livingtree
title: Livingtree
description: Provides the static layout data for the Livingtree map room, specifying tile placement and object positions for Tiled-based world generation.
tags: [map, room, static_layout, procedural_generation]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 85ffefbb
system_scope: world
---

# Livingtree

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines the static layout for the Livingtree map room in Don't Starve Together. It is not a component in the Entity Component System (ECS) sense; rather, it is a Tiled JSON-compatible Lua data structure that encodes tile layer and object group information for procedural map generation. Specifically, it describes the visual background tiles and in-world entities (such as `flower_evil` and `evergreen`) placed in the Livingtree room, used by the worldgen system to construct the room during level generation.

The layout uses a 20x20 grid with 16x16 pixel tiles. The room includes an `FG_OBJECTS` object group listing multiple `flower_evil` and `evergreen` prefabs as placement markers, and a `BG_TILES` tile layer containing background tile IDs. This structure is consumed by the map generation system (e.g., `map/rooms/` loaders) to instantiate the room in-game.

## Usage example
While this file is not an ECS component and is not instantiated directly, it is referenced and loaded by the map generation system. An example of how such a layout is typically used within the game is shown below:

```lua
-- In map generation code (e.g., a room loader), the layout is loaded as data:
local layout = require "map/static_layouts/livingtree"

-- Then used to spawn objects and set tiles:
for _, obj in ipairs(layout.layers.FG_OBJECTS.objects) do
    if obj.type == "flower_evil" then
        local inst = ents:CreateEntity(obj.type)
        inst.Transform:SetPosition(obj.x / 32, 0, obj.y / 32)
    end
end
```

## Dependencies & tags
**Components used:** None. This file is pure data and does not reference or use any ECS components at runtime.
**Tags:** None identified.

## Properties
The file is a top-level table with no `self` context. Its structure mirrors standard Tiled JSON export format.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled version used for export. |
| `luaversion` | string | `"5.1"` | Lua version compatibility. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `20` | Map width in tiles. |
| `height` | number | `20` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Global map properties (currently empty). |
| `tilesets` | array | (see structure) | Array of tileset definitions used in the map. |
| `layers` | array | (see structure) | Array of layers, including tile layers and object groups. |

### `tilesets` item fields
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `name` | string | `"ground"` | Tileset name. |
| `firstgid` | number | `1` | First global tile ID in the tileset. |
| `filename` | string | (path) | Relative path to `.tsx` file. |
| `tilewidth` / `tileheight` | number | `64` | Pixel dimensions of each tile in this tileset. |
| `image` | string | (path) | Relative path to the tileset image. |
| `imagewidth` / `imageheight` | number | `512` | Image dimensions in pixels. |

### `layers` item fields
| Property | Type | Description |
|----------|------|-------------|
| `type` | string | Layer type (`"tilelayer"` or `"objectgroup"`). |
| `name` | string | Layer name (`"BG_TILES"` or `"FG_OBJECTS"`). |
| `width` / `height` | number | Layer dimensions (same as map unless overridden). |
| `visible` | boolean | Visibility flag. |
| `opacity` | number | Layer opacity (0 to 1). |
| `data` | array | For tile layers: flattened array of tile GIDs (0 = empty). |
| `objects` | array | For object groups: array of placement objects. |

### `objects` item fields (in object groups)
| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Object name (empty by default). |
| `type` | string | Prefab name to spawn (e.g., `"livingtree"`, `"flower_evil"`, `"evergreen"`). |
| `shape` | string | Geometry shape (always `"rectangle"` in this file). |
| `x`, `y` | number | Coordinates in pixels (relative to map origin). |
| `width` / `height` | number | Geometry dimensions (0 means "marker-only"). |
| `visible` | boolean | Visibility flag. |
| `properties` | table | Custom properties (empty here). |

## Main functions
This file contains no executable functions. It is a static data definition only.

## Events & listeners
This file does not register or push any events.