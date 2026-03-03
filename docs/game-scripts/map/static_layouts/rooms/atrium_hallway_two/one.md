---
id: one
title: One
description: Defines a static room layout for the Atrium Hallway Two using Tiled map data, containing background tiles, foreground objects (sanity/insanity rocks, fences, rubble), and chests.
tags: [map, level-design, static-layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: f4c8ebf8
system_scope: world
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout (`atrium_hallway_two/one.lua`) for use in DST's map generation system. It is a Tiled-formatted JSON-like Lua table specifying a 32x32 grid of tiles and a set of object placements (e.g., sanity rocks, fences, chests) used to construct a specific section of the Atrium area in the Caves. It contains no executable logic—its purpose is to serve as static geometry data consumed by the world generation system.

## Usage example
This file is not instantiated as a component or entity at runtime. It is referenced internally by the map generation system via `map/levels/caves.lua` and room templates, and loaded as data during world generation.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled export format version. |
| `luaversion` | string | `"5.1"` | Lua version target. |
| `orientation` | string | `"orthogonal"` | Tilemap orientation. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Tile width in pixels. |
| `tileheight` | number | `16` | Tile height in pixels. |
| `properties` | table | `{}` | Room-level properties (empty here). |
| `tilesets` | array | `{...}` | Tileset definitions (one entry referencing `tiles.png`). |
| `layers` | array | `{...}` | Layer definitions: `BG_TILES` (tile layer) and `FG_OBJECTS` (object layer with spawn points). |

## Main functions
Not applicable. This file returns a static data table and contains no functions.

## Events & listeners
Not applicable.