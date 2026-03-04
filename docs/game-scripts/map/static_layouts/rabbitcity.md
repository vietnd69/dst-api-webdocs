---
id: rabbitcity
title: Rabbitcity
description: Defines a static map layout for rabbit cities using TMX map data with tile and object layers.
tags: [world, map, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: b7dfb96e
system_scope: world
---

# Rabbitcity

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`rabbitcity` is a static map layout definition file that specifies the visual and structural configuration for rabbit city areas in the game. It uses TMX map format data to define background tile layers (`BG_TILES`) and foreground object placements (`FG_OBJECTS`), including rabbit houses, cavelights, and carrot plots. This file does not define a component in the ECS sense, but rather a data structure used by the world generation system to instantiate rabbit city scenes.

## Usage example
Static layout files like this one are loaded and applied by the world generation system. They are not instantiated directly via `AddComponent`. Instead, they are referenced by map task or room generators (e.g., in `map/tasksets/caves.lua`), where the layout data is parsed and objects (e.g., `rabbithouse`, `carrot_planted`) are spawned accordingly.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | TMX map format version. |
| `luaversion` | string | `"5.1"` | Lua version used for encoding. |
| `orientation` | string | `"orthogonal"` | Map tile orientation. |
| `width` | number | `32` | Map width in tiles. |
| `height` | number | `32` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Map-level custom properties (empty). |
| `tilesets` | table | `{...}` | Array of tileset definitions (contains one entry: `tiles`). |
| `layers` | table | `{...}` | Array of layers: `BG_TILES` (tile layer) and `FG_OBJECTS` (object group). |

## Main functions
None — this file returns a static table of map data and does not define any functions.

## Events & listeners
None identified