---
id: junk_yard1
title: Junk Yard1
description: Tiled map layout definition for the Junk Yard biome, containing static tile data and object placement metadata for procedural world generation.
tags: [world, map, layout, static]
sidebar_position: 1
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: e8be6429
system_scope: world
---
# Junk Yard1

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static Tiled map layout (`junk_yard1.lua`) used for the Junk Yard biome in Don't Starve Together. It specifies the tile layer (`BG_TILES`) and object placement data (`FG_OBJECTS`) that dictate the layout and placement of junk piles, areas, and special markers in the game world. This layout is consumed during world generation to instantiate level geometry, not as a runtime ECS component. It conforms to Tiled's JSON-compatible Lua table format and is used by the `static_layouts` system to populate map rooms.

## Usage example
This file is not instantiated as a runtime component; it is loaded by the map generation system when assigning layouts to rooms. Modders may reference or override this layout in custom world generation configurations. For example, in a custom `worldgenoverride.lua`:

```lua
return {
    custom_map_settings = {
        { name = "junk_yard1", rooms = { "junk_yard1" } },
    },
}
```

The engine internally parses this file via `Map.SetLayout(layout_table)` and uses its `layers` and `objects` to generate in-game entities.

## Dependencies & tags
**Components used:** None. This is a static data file, not a component with runtime logic.  
**Tags:** None identified.

## Properties
No public instance properties are defined at runtime. This file is a pure data definition table with the following top-level fields:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version. |
| `luaversion` | string | `"5.1"` | Lua version target. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `24` | Map width in tiles. |
| `height` | number | `24` | Map height in tiles. |
| `tilewidth` | number | `16` | Tile width in pixels. |
| `tileheight` | number | `16` | Tile height in pixels. |
| `properties` | table | `{}` | Empty custom properties. |
| `tilesets` | array | (see source) | Tileset definitions (one entry: `"tiles"`). |
| `layers` | array | (see source) | Layer definitions (`BG_TILES`, `FG_OBJECTS`). |

## Main functions
No functions are defined. This file returns a static Lua table used for data serialization/deserialization.

## Events & listeners
This file does not define or interact with any events or listeners. It is not an ECS component and has no runtime lifecycle.

