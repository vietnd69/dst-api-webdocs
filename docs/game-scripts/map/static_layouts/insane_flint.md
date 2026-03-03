---
id: insane_flint
title: Insane Flint
description: Static layout file defining the arrangement of flint, sanity rocks, and basalt objects for a map room in the caves.
tags: [map, static_layout, caves, object_placement]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: e43e4c26
system_scope: world
---

# Insane Flint

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file is a static layout definition (`.lua` format) for a map room used in the caves level. It encodes tilemap and object placement data used by the world generation system to populate specific areas. It is not an Entity Component System component and does not define runtime behavior or logic; instead, it provides static configuration used during map initialization. The layout includes a background tile layer (`BG_TILES`) and an object group (`FG_OBJECTS`) specifying placements for flint, sanity rocks, and basalt entities.

## Usage example
Static layout files like this one are loaded and processed by the world generation system. They are not instantiated directly in mod code. A typical usage pattern involves referencing this file from a room or task configuration in the map system, for example:

```lua
-- Inside a room or task definition (e.g., in map/rooms/cave/)
room.static_layout = "insane_flint"
```

The engine will load and parse this file using Tiled map parsing utilities (via `TILELOADER`) and spawn the appropriate prefabs at the specified world coordinates.

## Dependencies & tags
**Components used:** None — this is a data-only file, not a component.
**Tags:** None identified.

## Properties
This file is a plain Lua table conforming to the Tiled map format. It does not define class properties or methods. Key top-level fields include:

| Field | Type | Default Value | Description |
|-------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled export version |
| `luaversion` | string | `"5.1"` | Target Lua version |
| `orientation` | string | `"orthogonal"` | Tilemap orientation |
| `width` | number | `16` | Width in tiles |
| `height` | number | `16` | Height in tiles |
| `tilewidth` | number | `16` | Tile width in pixels |
| `tileheight` | number | `16` | Tile height in pixels |
| `properties` | table | `{}` | Room-wide custom properties (unused here) |
| `tilesets` | table | *see source* | Tileset definitions |
| `layers` | table | *see source* | Tile and object layers |

No public instance properties are defined — this file returns a single static data table.

## Main functions
This file contains no functional methods — it is a declarative data container.

## Events & listeners
This file does not interact with events. No listeners or events are defined.