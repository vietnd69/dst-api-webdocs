---
id: barracks
title: Barracks
description: Tiled map layout data defining the static structure of the Barracks level, including background tiles, foreground object placements, and spawner entities for ruins and nightmare chess pieces.
tags: [map, level, spawner, ruins]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 84de02eb
system_scope: world
---

# Barracks

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file is a Tiled map export (`barracks.lua`) used to define the static layout of the Barracks level in Don't Starve Together. It contains tile layer data (`BG_TILES`) and an object group (`FG_OBJECTS`) specifying placements for ruins, broken walls, and spawner entities (e.g., `chessjunk_spawner`, `rook_nightmare_spawner`, `bishop_nightmare_spawner`). The component is not an ECS component—it is a static data file consumed by the world generation system to instantiate the level geometry and entities.

## Usage example
This file is loaded and processed internally by the world generation system. It is not directly instantiated or manipulated by modders. However, a typical workflow would involve referencing the map in a level or task configuration:

```lua
-- Example: How this layout might be referenced in a level/task definition
return {
    static_layout = "barracks",
    spawn_points = {
        player = { x = 320, y = 320 },
        boss = { x = 256, y = 192 },
    },
}
```

## Dependencies & tags
**Components used:** None. This is a pure data file with no runtime component logic or component API calls.
**Tags:** None identified.

## Properties
The table returned by this file is a Tiled map export and contains no custom modder-facing properties or methods. Key structural fields include:

| Property       | Type   | Default Value | Description |
|----------------|--------|---------------|-------------|
| `version`      | string | `"1.1"`       | Tiled format version. |
| `luaversion`   | string | `"5.1"`       | Lua compatibility version. |
| `orientation`  | string | `"orthogonal"`| Map orientation. |
| `width`        | number | `40`          | Map width in tiles. |
| `height`       | number | `40`          | Map height in tiles. |
| `tilewidth`    | number | `16`          | Width of each tile in pixels. |
| `tileheight`   | number | `16`          | Height of each tile in pixels. |
| `tilesets`     | table  | (see source)  | Tileset definitions, including image and tile metadata. |
| `layers`       | table  | (see source)  | Array of layers (`tilelayer` and `objectgroup`). |

## Main functions
This file contains no functions. It returns a static data table only.

## Events & listeners
This file does not define or interact with any events or listeners.