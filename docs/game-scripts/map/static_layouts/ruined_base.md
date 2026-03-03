---
id: ruined_base
title: Ruined Base
description: Stores static layout data for the Ruined Base map area, defining background tiles and foreground object placement using Tiled Map Editor format.
tags: [map, static_layout, tilemap]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 38d81661
system_scope: world
---

# Ruined Base

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`ruined_base.lua` is a static layout definition file for the Ruined Base area. It is not a component in the ECS sense but a Lua table (returned by a module) containing map geometry data imported from Tiled Map Editor. It specifies tile layer data for background tiles (`BG_TILES`) and object placement data (`FG_OBJECTS`) such as walls, skeletons, and construction areas. This file is used by the world generation system to reconstruct the Ruined Base environment in-game.

## Usage example
This file is not used directly as a component on an entity. Instead, it is loaded as data during world generation (e.g., via `load_map_file("map/static_layouts/ruined_base.lua")` internally). Modders should not call or modify this file directly — it is consumed by the engine’s map loading infrastructure.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version used to serialize the map. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `24` | Map width in tiles. |
| `height` | number | `24` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | — | Array of tileset definitions (includes image source and tile metadata). |
| `layers` | table | — | Array of layer definitions (tile layers and object groups). |

## Main functions
Not applicable — this file exports a static data structure and does not define any functional methods.

## Events & listeners
Not applicable — no event handling or listeners are defined in this file.