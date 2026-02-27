---
id: abandonedboat
title: Abandonedboat
description: Defines the static layout and object placement for the Abandoned Boat map room, including tile data, object zones, and scenario-linked entities.
tags: [map, layout, static, room, scenario]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 147f3b41
---

# Abandonedboat

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines the static layout configuration for the "Abandoned Boat" map room. It specifies the tilemap structure (including background tiles), object zones, and area definitions used by the world generation system to spawn the room in the game world. It is not a runtime component but a data file consumed by the worldgen system to instantiate the physical layout and associated gameplay elements (e.g., loot, interactive zones, scenery) when the room is placed.

The file is a Tiled map export (`*.lua`) formatted as a Lua table, containing tile layer data, object group definitions, and properties that guide spawning logic. It has no direct ECS component interaction during runtime; instead, it serves as input to room placement and entity instantiation logic elsewhere in the codebase (e.g., `map/rooms/` or level/task loaders).

## Usage example
This file is loaded by the world generation system and not directly instantiated in mod code. However, a typical workflow for referencing or extending it would look like:

```lua
local layout = require("map/static_layouts/abandonedboat")

-- Access layout properties (e.g., dimensions, object zones)
print("Room size:", layout.width, "x", layout.height)
print("First object zone type:", layout.layers[2].objects[1].type)
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Target Lua version for the exported table |
| `orientation` | string | `"orthogonal"` | Tilemap orientation type |
| `width` | number | `6` | Map width in tiles |
| `height` | number | `6` | Map height in tiles |
| `tilewidth` | number | `64` | Width of each tile in pixels |
| `tileheight` | number | `64` | Height of each tile in pixels |
| `properties` | table | `{}` | Global map properties (empty in this case) |
| `tilesets` | table | *(see source)* | Array of tileset definitions |
| `layers` | table | *(see source)* | Array of map layers (background tiles + object group) |

## Main functions
This file returns a static Lua table and does not define any executable functions or methods. It is a data container only.

## Events & listeners
This file does not register or emit any events. It is not active code and has no runtime behavior beyond providing layout data during map generation.