---
id: lava_arena
title: Lava Arena
description: Static map layout definition for the Lava Arena event, specifying tiled background data and object placements for spawners, platforms, and crowd stands.
tags: [world, event, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 8b3cc291
system_scope: world
---

# Lava Arena

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`lava_arena.lua` defines a static Tiled map layout for the Lava Arena event. It contains a grid-based tile layer (`BG_TILES`) with baked background visuals, and an object layer (`FG_OBJECTS`) that specifies dynamic entities like spawners, crowd stands, floor grates, team banners, and ground target blockers. This file is used during world generation to populate the arena zone with pre-arranged scenery and gameplay markers.

This is *not* an ECS component class — it is a pure data definition in Lua table format exported from the Tiled map editor. It does not contain executable logic, constructors, methods, or component lifecycle hooks.

## Usage example
```lua
-- Not applicable — this file is a static layout definition.
-- The DST world generator loads this file via the map system to instantiate prefabs
-- and place map objects when building the Lava Arena event zone.
```

## Dependencies & tags
**Components used:** None — this is a data-only file.
**Tags:** None — this file does not interact with entity tags.

## Properties
No public properties exist in the ECS sense. The table returned by the file contains Tiled-specific metadata, not component variables.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled file format version. |
| `luaversion` | string | `"5.1"` | Lua version targeted for parsing. |
| `orientation` | string | `"orthogonal"` | Tile orientation. |
| `width` | number | `148` | Map width in tiles. |
| `height` | number | `148` | Map height in tiles. |
| `tilewidth` | number | `16` | Tile width in pixels. |
| `tileheight` | number | `16` | Tile height in pixels. |
| `tilesets` | table | `{...}` | Definition of the tileset image and tile mappings. |
| `layers` | table | `{...}` | Array of layers (`BG_TILES`, `FG_OBJECTS`). |

## Main functions
Not applicable — this file returns a data table and contains no functions.

## Events & listeners
Not applicable — this file contains no event handling or logic.