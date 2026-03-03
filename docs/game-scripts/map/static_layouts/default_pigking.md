---
id: default_pigking
title: Default Pigking
description: Static map layout definition for the Pig King arena in Don't Starve Together, specifying background tiles and object placements including Pig King and sanity/insanity rocks.
tags: [map, layout, boss, arena, environment]
sidebar_position: 1
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: f64d1343
system_scope: environment
---
# Default Pigking

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static tilemap layout (`default_pigking.lua`) used for the Pig King arena in Don't Starve Together. It specifies the Tiled map format (version 1.1, orthogonal orientation, 32x32 grid with 16x16 tiles) containing background tile data and an object layer (`FG_OBJECTS`) that marks entity spawn points and decorative placements. The object layer includes placements for the Pig King boss, sanity rocks, and insanity rocks — critical environmental elements that affect player sanity during the encounter.

This component is not a gameplay component in the ECS sense; it is a data-driven map definition file imported during world generation. It serves as a static blueprint consumed by the engine’s map loading and entity spawner systems.

## Usage example
Static map layouts like this one are not instantiated directly by modders but are referenced by worldgen scripts (e.g., in `map/rooms/` or `map/static_layouts/`), often via task or room definitions.

Example integration in a room/task definition (not part of this file, but illustrative):
```lua
-- In a room or task script (e.g. map/rooms/forest/pigking.lua)
local DefaultPigking = require "map/static_layouts/default_pigking"
AddSimulator("PigKingRoom", {
    tiles = DefaultPigking,
    -- Additional room-specific properties...
})
```

Modders typically extend or override arenas by creating custom map layouts and referencing them in tasksets or scenarios.

## Dependencies & tags
**Components used:** None — this is a pure data file, not an ECS component. It does not call `inst.components.X` or interact with runtime components.

**Tags:** None identified.

## Properties
This file returns a table conforming to the Tiled map format. Key properties include:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version |
| `luaversion` | string | `"5.1"` | Lua version targeted by embedded data |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | integer | `32` | Map width in tiles |
| `height` | integer | `32` | Map height in tiles |
| `tilewidth` | integer | `16` | Width of each tile in pixels |
| `tileheight` | integer | `16` | Height of each tile in pixels |
| `properties` | table | `{}` | Map-level custom properties (unused here) |
| `tilesets` | table | (see source) | Tileset definitions (e.g., tile texture, GID mapping) |
| `layers` | table | (see source) | Layer definitions (`tilelayer` and `objectgroup`) |

**Layer-specific properties:**
- `BG_TILES`: `tilelayer` containing a flat array of 1024 tile GIDs (row-major order). Non-zero values reference tiles in the `tiles` tileset.
- `FG_OBJECTS`: `objectgroup` containing entity placement markers:
  - `pigking`: Boss spawn point (at grid coordinates approx. (16,16))
  - `sanityrock`: Four rock placements (used to restore sanity)
  - `insanityrock`: Three rock placements (used to reduce sanity, often near edges)

## Main functions
This file is a pure data loader and contains no executable functions.

## Events & listeners
This file is a static data definition and does not listen to or emit events.

