---
id: ruins_start
title: Ruins Start
description: A Tiled map definition for the Ruins starting area, specifying tile layout and spawnpoint/object placements.
tags: [map, layout, worldgen]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 7479737a
system_scope: world
---

# Ruins Start

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines the static layout for the Ruins starting area using Tiled map format. It contains tile layer data (`BG_TILES`) and an object group (`FG_OBJECTS`) specifying locations for special in-game objects such as cave exits, spawn points, and spawners for pillar ruins and chess junk. It is used by the world generation system to instantiate the Ruins level during map initialization.

## Usage example
```lua
-- Not applicable: This is a data file loaded by the worldgen system,
-- not a component added at runtime.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | — | Contains tileset metadata. |
| `layers` | table | — | Contains tile layers and object groups. |

## Main functions
Not applicable — this file returns static map data, not a class or component.

## Events & listeners
Not applicable.