---
id: bathbombedhotspring
title: Bathbombedhotspring
description: Defines a static map layout for a hotspring that has been enhanced with a bathbomb, including placed objects and tile data.
tags: [map, static_layout, bathbomb, hotspring]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 182b64d6
system_scope: world
---

# Bathbombedhotspring

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout (`bathbombedhotspring.lua`) used by the DST world generation system to place a modified hotspring in the game world. The layout includes a single tile layer (`BG_TILES`) and an object group (`FG_OBJECTS`) that specifies placed entities and their properties. The key feature is a hotspring object marked with `data.isbathbombed = true`, indicating it has been enhanced with a bathbomb, altering its behavior or appearance. The layout also contains a skeleton, two moon trees (one tall, one short), and an unmarked bathbomb with `data.perishable.paused = true`.

## Usage example
This component is not a runtime-instanced component but a map layout definition. It is referenced internally by the world generation system when spawning static room layouts. Example usage is implicit and occurs during world generation:

```lua
-- Internally, the worldgen system loads this file as part of room/static_layout loading
-- No direct modder interaction required in most cases
-- To use in a custom room or event, one would reference this layout via task/room definitions
-- Example pseudo-usage:
-- taskset:AddTask({ type = "room", roomname = "bathbombedhotspring" })
```

## Dependencies & tags
**Components used:** None (pure data file, no component instantiation or usage).
**Tags:** None identified.

## Properties
This file is a plain Lua table conforming to the Tiled map format. No component-specific properties exist.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled file format version. |
| `luaversion` | string | `"5.1"` | Target Lua version. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `2` | Map width in tiles. |
| `height` | number | `2` | Map height in tiles. |
| `tilewidth` | number | `64` | Width of each tile in pixels. |
| `tileheight` | number | `64` | Height of each tile in pixels. |
| `properties` | table | `{}` | Global map properties (empty here). |
| `tilesets` | array | (see code) | Tileset definitions (ground tileset). |
| `layers` | array | (see code) | Layers: one tile layer (`BG_TILES`) and one object group (`FG_OBJECTS`). |

## Main functions
This file contains no functions—only static layout data.

## Events & listeners
No events or listeners are associated with this file.