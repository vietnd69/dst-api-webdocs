---
id: skeleton_winter_medium
title: Skeleton Winter Medium
description: A Tiled map layout definition for a winter-themed skeleton structure containing lootable items.
tags: [map, static_layout, loot]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: ec2b4a58
system_scope: world
---

# Skeleton Winter Medium

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static map layout (in Tiled JSON format) used by the game's world generation system to place winter-themed skeleton ruins in the game world. It specifies a 12x12 tile grid with background tile data (all empty) and an object group containing named spawn points for items (e.g., `skeleton`, `winterhat`, `trunkvest_summer`, `axe`). These object coordinates correspond to in-game world positions where entities are instantiated during map loading.

## Usage example
This file is not intended for direct use by mods or scripts. It is automatically loaded by the world generation system when spawning static layouts. Mods that extend or override world generation may reference this layout by name in `tasksets` or `levels` configuration.

```lua
-- Not directly instantiated; used internally by the level/task system.
-- See: map/tasksets/caves.lua, map/levels/caves.lua, or map/rooms/cave/
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version target. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `12` | Map width in tiles. |
| `height` | number | `12` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | array | — | List of tileset definitions (here: a single tiles.png reference). |
| `layers` | array | — | List of map layers (BG_TILES, FG_OBJECTS). |

## Main functions
This is a data-only module; it returns a Lua table and defines no executable functions. It is consumed by `map/archive_worldgen.lua` or related static layout loaders.

## Events & listeners
Not applicable.