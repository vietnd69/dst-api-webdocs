---
id: insanity_wormhole_1
title: Insanity Wormhole 1
description: Defines a static map layout for an Insanity-themed wormhole arena using Tiled JSON-style data, including tile layers for background visuals and an object group for placing scenery and wormhole entry points.
tags: [map, static_layout, wormhole, arena]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 012d5cae
system_scope: world
---

# Insanity Wormhole 1

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout used for generating an "Insanity" theme arena (e.g., during the Max Fight or similar events). It is a Tiled-compatible data structure describing the visual and spatial configuration of a 16x16 tile map. The layout includes a background tile layer (`BG_TILES`) that places visual elements (tile ID `8` in two rows) and an object layer (`FG_OBJECTS`) containing 16 `insanityrock` placement markers and one `wormhole` object at the center. This file does not represent an ECS component but rather a map-level static layout definition consumed by the world generation system to instantiate scenery and wormhole entries in the game world.

## Usage example
This file is a static data definition loaded by the world generation engine and not directly used in component scripts. It is included in the static layout registry via `map/static_layouts/insanity_wormhole_1.lua` and referenced in relevant `tasksets` or `task` files (e.g., during event-based world generation). No direct Lua instantiation is required by modders.

## Dependencies & tags
**Components used:** None — this file contains only raw static layout data (a Tiled map format) and does not use any ECS components.
**Tags:** None identified.

## Properties
The file exports a top-level Lua table with fixed structure defined by Tiled map format. No custom component constructor or class logic exists.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled version compatibility tag. |
| `luaversion` | string | `"5.1"` | Lua version used for embedded scripts (none present). |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `16` | Map width in tiles. |
| `height` | number | `16` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{ ["wormhole"] = "{foo=\"bar\"}" }` | Custom properties attached to the map; includes `"wormhole"` key indicating this layout contains a wormhole entry. |
| `tilesets` | table | (see source) | Tileset definitions used for tile layers. |
| `layers` | table | (see source) | Layer data including background tiles (`tilelayer`) and foreground objects (`objectgroup`). |

## Main functions
This file exports only a static data structure. There are no functional methods or constructors defined.

## Events & listeners
This file is a pure data container and does not register or emit events. There are no event listeners or event pushes associated with it.