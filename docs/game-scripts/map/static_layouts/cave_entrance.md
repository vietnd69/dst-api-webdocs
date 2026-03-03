---
id: cave_entrance
title: Cave Entrance
description: Static Tiled map layout defining the visual and structural setup for cave entrances in the DST caves.
tags: [map, layout, worldgen]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 12b73141
system_scope: world
---

# Cave Entrance

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

This file defines a static map layout for cave entrances using the Tiled map format. It is not a game component attached to entities via `AddComponent`, but rather a static data structure used during world generation to define tile placement and object placement for the cave entrance area. It includes background tile layer (`BG_TILES`) with visual patterns (e.g., tile ID `4` placed at specific coordinates) and an object group (`FG_OBJECTS`) containing a single cave entrance marker (`type = "cave_entrance"`). The layout serves as a reusable blueprint for placing cave entry points in the caves world level.

## Usage example

This file is loaded by the world generation system, not instantiated directly by modders. It is referenced in level/task definitions (e.g., in `map/levels/caves.lua` or `map/tasksets/caves.lua`) to insert this layout at a designated world position.

```lua
-- The file is typically loaded and embedded via worldgen scripts like:
-- level:AddStaticLayout("cave_entrance", { x = worldx, y = worldy })
-- This file itself returns a Tiled-compatible table, not a component or prefab.
```

## Dependencies & tags

**Components used:** None — this is a static data file, not a Lua component.

**Tags:** None — no entity tags are modified.

## Properties

The file returns a plain Lua table conforming to the Tiled JSON/CSV export schema (converted to Lua format). Key properties are:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled version compatibility identifier. |
| `luaversion` | string | `"5.1"` | Lua runtime version used for serialization. |
| `orientation` | string | `"orthogonal"` | Map coordinate system orientation. |
| `width` | number | `16` | Map width in tiles. |
| `height` | number | `16` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Custom map-level properties (empty in this case). |
| `tilesets` | array | See source | Array of tileset definitions (references external image and tile mappings). |
| `layers` | array | See source | Array of layers: one `tilelayer` (background tiles), one `objectgroup` (cave entrance marker). |

## Main functions

No functions are defined. The file returns a single data table with no executable methods.

## Events & listeners

Not applicable — this is a static data file, not an active component. No events are listened to or pushed.