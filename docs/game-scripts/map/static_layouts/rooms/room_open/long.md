---
id: long
title: Long
description: Defines the static layout data for the 'Long' room used in world generation.
tags: [world, room, layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 098e8c37
system_scope: world
---

# Long

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a static layout definition for the "Long" room used by the game's world generation system. It specifies the 2D tile grid and metadata required to render and integrate the room into cave or surface maps during world creation. It does not implement logic components or behavior — it is a data-only definition used by tools like `static_layouts.lua` to instantiate rooms.

## Usage example
This file is loaded automatically by the world generation system. Modders typically do not interact with it directly. To override or reference this layout, use the static layout system via `map/static_layouts.lua`.

```lua
-- Not applicable: this is a data file only.
-- Referenced internally as "room_open/long" during room placement.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua interpreter version targeted. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Global room properties (empty). |
| `tilesets` | table | — | Tileset definitions (uses `tiles.png` at 64×64 tile size). |
| `layers` | table | — | Layer definitions: contains one tile layer (`BG_TILES`) and one object group (`FG_OBJECTS`). |

## Main functions
None identified — this file returns only static data.

## Events & listeners
None identified — this is a pure data file with no event logic.