---
id: adventure_portal_layout
title: Adventure Portal Layout
description: A static map layout definition used to position entities (e.g., adventure portals, flora, lighting) in the Adventure mode portal room.
tags: [map, layout, worldgen, adventure, static]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 0b230f03
---

# Adventure Portal Layout

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout used for the Adventure mode portal room in DST. It is a Tiled map export (in Lua format) that specifies tile placement (`BG_TILES` layer) and object instance positions (`FG_OBJECTS` layer), including entity types like `adventure_portal`, `flower_evil`, `evergreen_*`, and `fireflies`. The layout does not contain any executable logic or ECS components; it serves purely as a data structure for world generation systems to instantiate prefabs at specified coordinates during level loading.

The component is not a runtime-instantiated ECS component but a static configuration file typically consumed by world generation tools or level loaders (e.g., via `map/tasksets`, `levels`, or custom scenario logic).

## Usage example
While not an ECS component, this layout is used indirectly by world generation scripts. Below is a conceptual usage example illustrating how such a layout file is typically loaded and interpreted:

```lua
-- Example: Loading and using the layout (conceptual, pseudo-code)
local layout = require("map/static_layouts/adventure_portal_layout")
for _, obj in ipairs(layout.layers.FG_OBJECTS.objects) do
    if obj.type == "adventure_portal" then
        -- Instantiate the portal at (obj.x, obj.y) after converting to world space
        local portal = spawn_portal(obj.x / 16, obj.y / 16)
        portal:SetPosition(obj.x, obj.y)
    end
end
```

## Dependencies & tags
**Components used:** None identified — this file is a pure data structure and does not reference or instantiate any components.

**Tags:** None identified — no tags are added or removed at runtime.

## Properties
The following are top-level properties of the Tiled layout data structure. All values are static and read-only.

| Property       | Type      | Default Value | Description |
|----------------|-----------|---------------|-------------|
| `version`      | `string`  | `"1.1"`       | Tiled export version. |
| `luaversion`   | `string`  | `"5.1"`       | Lua version target for export. |
| `orientation`  | `string`  | `"orthogonal"`| Tilemap orientation. |
| `width`        | `integer` | `28`          | Map width in tiles. |
| `height`       | `integer` | `28`          | Map height in tiles. |
| `tilewidth`    | `integer` | `16`          | Width of each tile in pixels. |
| `tileheight`   | `integer` | `16`          | Height of each tile in pixels. |
| `properties`   | `table`   | `{}`          | Global layer properties (empty in this file). |
| `tilesets`     | `array`   | See below     | Tileset definitions. |
| `layers`       | `array`   | See below     | Tile and object layers. |

**`tilesets` array:**
- Contains one entry: ground tileset (`name: "ground"`) with 64x64px tiles sourced from `ground.tsx`.

**`layers` array:**
- `BG_TILES` (`type: "tilelayer"`): 28x28 grid of tile IDs (0 = empty, non-zero = ground tile ID).
- `FG_OBJECTS` (`type: "objectgroup"`): List of entity placement objects with coordinates in pixels (`x`, `y`).

## Main functions
This file is a plain Lua table export — it contains no functions or methods.

## Events & listeners
No events or listeners are associated with this file, as it is not an ECS component and does not execute at runtime.