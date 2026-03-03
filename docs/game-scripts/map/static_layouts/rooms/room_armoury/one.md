---
id: one
title: One
description: Defines a static room layout for the armoury map room using Tiled map format, specifying background tiles and object spawn points.
tags: [map, room, layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 6cc54c60
system_scope: environment
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the static layout for the `room_armoury/one` room in DST's world generation system. It is a Tiled JSON-compatible Lua table used by the `static_layouts` loader to instantiate room geometry and spawn points. The room features a 32×32 tile grid with a background tile layer (`BG_TILES`) and an object layer (`FG_OBJECTS`) specifying spawn locations for key raid boss entities and environmental props.

## Usage example
This file is not used directly by modders — it is loaded by the engine's world generation system when constructing the armoury room. Modders typically interact with it indirectly by extending or overriding room layouts via custom `static_layouts` entries.

```lua
-- This file is consumed internally by DST's room generation system
-- No direct instantiation or API calls are needed in mods
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version used. |
| `luaversion` | string | `"5.1"` | Lua version compatibility. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Size of each tile (width in pixels). |
| `tileheight` | number | `16` | Size of each tile (height in pixels). |
| `tilesets` | table | *populated* | Tileset definitions (e.g., `tiles`). |
| `layers` | table | *populated* | Layer definitions (`BG_TILES`, `FG_OBJECTS`). |

## Main functions
Not applicable — this file returns a static data table and does not define executable functions.

## Events & listeners
Not applicable — this is a pure data file with no event-driven behavior.