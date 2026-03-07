---
id: two
title: Two
description: Static room layout definition for the archive_fourblock region, specifying background tile patterns and a single pillar placement.
tags: [map, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: fd4a60c2
system_scope: world
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout for use in the game's world generation system, specifically as part of the `archive_fourblock` room category. It is a map data structure conforming to Tiled Map Editor format (version 1.1), used to render deterministic room layouts in the game world. It contains only background tile data and a single object placeholder for a pillar, with no Lua logic, components, or behaviors.

## Usage example
This file is not meant to be used directly as a component. It is loaded by the world generation system and used to instantiate tile-based room geometry.

```lua
-- Not used as a component; referenced internally by the world generation system.
-- The room layout is typically loaded via map loading utilities (e.g., from static_layouts loader).
-- Example internal usage (not exposed for modder use):
-- local layout = require("map/static_layouts/rooms/archive_fourblock/two")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version target |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `32` | Map width in tiles |
| `height` | number | `32` | Map height in tiles |
| `tilewidth` | number | `16` | Width of a single tile in pixels |
| `tileheight` | number | `16` | Height of a single tile in pixels |
| `tilesets` | table | Required tileset definition | Tileset metadata (not actively used in runtime) |
| `layers` | table | 2 layers: `BG_TILES`, `FG_OBJECTS` | Layer definitions containing tile and object data |

## Main functions
Not applicable — this is a static data definition and contains no executable functions.

## Events & listeners
Not applicable — this file has no event handling logic.