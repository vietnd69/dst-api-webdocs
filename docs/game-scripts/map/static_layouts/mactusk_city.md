---
id: mactusk_city
title: Mactusk City
description: A static map layout file defining background tile positions and foreground object placements for the Mactusk City level area in DST.
tags: [world, map, layout, static]
sidebar_position: 1
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: e8b5e6f8
system_scope: world
---
# Mactusk City

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

This file defines a static map layout for the "Mactusk City" area using Tiled Map Editor data. It specifies a 64x64 tile grid (`tilewidth=16`, `tileheight=16`) with a background tile layer (`BG_TILES`) and a foreground object layer (`FG_OBJECTS`) containing walrus camp placements. As a `static_layouts` asset, it is consumed by the world generation system to instantiate scene elements programmatically. It does not implement any ECS components or logic behavior — it is pure data used for layout and spatial referencing.

## Usage example

This file is loaded and processed internally by the world generator and is not directly instantiated by modders. A typical use in worldgen code would be via the `Map:LoadStaticLayout()` function, which parses this file and spawns prefabs at the coordinates listed in the `FG_OBJECTS` layer. Example pseudo-usage:

```lua
-- Inside a worldgen task or room setup script
local layout = require("map/static_layouts/mactusk_city")
Map:LoadStaticLayout(layout, function(tileset_data, obj)
    if obj.type == "walrus_camp" then
        inst:AddTag("walrus_camp")
        inst.Transform:SetPosition(obj.x, obj.y, 0)
    end
end)
```

Note: Direct instantiation is not required or typical for modders.

## Dependencies & tags

**Components used:** None — this file is a data-only layout descriptor.

**Tags:** None identified.

## Properties

This file is a pure data structure returned as a Lua table and does not define component properties. The table contains layout metadata and content as follows:

| Field | Type | Description |
|-------|------|-------------|
| `version` | string | Tiled format version (`"1.1"`). |
| `luaversion` | string | Lua compatibility version (`"5.1"`). |
| `orientation` | string | Map orientation mode (`"orthogonal"`). |
| `width`, `height` | number | Grid dimensions in tiles (64x64). |
| `tilewidth`, `tileheight` | number | Pixel dimensions per tile (16x16). |
| `tilesets` | table | List of tileset definitions, each with image path and geometry. |
| `layers` | table | List of layer definitions; in this case `BG_TILES` (tile layer) and `FG_OBJECTS` (object group). |
| `properties` | table | Empty top-level properties table. |

## Main functions

This file contains no runtime functions — it is a static data payload. There are no functions to document.

## Events & listeners

This file defines no event handling or listeners. No events are listened to or pushed.

