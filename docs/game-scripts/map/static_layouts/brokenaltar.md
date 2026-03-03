---
id: brokenaltar
title: Brokenaltar
description: Static map layout definition for the Broken Altar location in the Ruins, containing background tiles and object spawners.
tags: [map, static_layout, ruins]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 3f363581
system_scope: environment
---

# Brokenaltar

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

This file defines a static Tiled map layout used to generate the "Broken Altar" location within the Ruins biome of DST. It specifies the tile configuration (background tiles) and a set of object spawners (represented as objects in the Tiled format) that place in-game prefabs at specific coordinates. This is not an ECS component but a world generation asset used by the map system during level construction.

## Usage example

This file is loaded by the world generation system (typically via `map/tasks/caves.lua` or related task sets) and not instantiated directly by modders. Modders may reference or extend it in custom world generation tasks or static layouts.

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled file format version |
| `luaversion` | string | `"5.1"` | Lua version compatibility |
| `orientation` | string | `"orthogonal"` | Tilemap orientation |
| `width` | number | `40` | Map width in tiles |
| `height` | number | `40` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `properties` | table | `{}` | Global map properties (empty in this case) |
| `tilesets` | array | see source | Tileset definitions (contains one `"tiles"` tileset) |
| `layers` | array | see source | Array of map layers (includes `BG_TILES` and `FG_OBJECTS`) |

## Main functions

No functions — this file returns a data table describing the layout and is consumed by the map/level loading system.

## Events & listeners

No events or listeners — this is a passive data file used by the world generation system.