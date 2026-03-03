---
id: two
title: Two
description: Defines the static layout data for the Atrium Hallway Two map room, including tilemap and object placements.
tags: [map, room, static_layout]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 2a9e6cbf
system_scope: world
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file is a static room layout definition used by DST's world generation system. It specifies the tilemap (background tiles) and object placements (foreground objects) for the "Atrium Hallway Two" room. The data conforms to the Tiled Map Editor's JSON-like Lua format and is consumed by the map generation engine to place walls, floors, fences, rubbles, and special objects like pandora's chest in the game world.

## Usage example
This file is not instantiated as a component or entity. It is loaded and processed by the world generation system. A typical integration point is in a `static_layouts` loader or room template setup, where `include("map/static_layouts/rooms/atrium_hallway_two/two.lua")` loads this layout data for rendering.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Version of the Tiled export format. |
| `luaversion` | string | `"5.1"` | Target Lua version for export. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | (see source) | List of tilesets used (e.g., `"tiles"`). |
| `layers` | table | (see source) | List of layers: `"BG_TILES"` and `"FG_OBJECTS"`. |

## Main functions
Not applicable — this file returns a data table, not a component class or object with functions.

## Events & listeners
Not applicable.