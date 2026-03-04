---
id: moonaltarrockidol
title: Moonaltarrockidol
description: Static layout data defining the placement and configuration of a moon altar rock idol in a static map layout.
tags: [layout, static, decor]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: c8913a5f
system_scope: world
---

# Moonaltarrockidol

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a Tiled JSON-style static layout definition used in DST to place a specific decorative object — the moon altar rock idol — within a predefined world region. It is not an ECS component but a static data structure used during world generation to instantiate map assets. It specifies tile layer configurations and object placement metadata, including type identification for the engine to correctly spawn the referenced entity (`moon_altar_rock_idol`).

## Usage example
This file is not directly instantiated by modders. It is loaded by the world generation system (e.g., via `static_layouts` loader) and applied to rooms or prefabs during world build. Example integration in worldgen context (not modder-facing usage):
```lua
-- Internally invoked by static layout loader
local layout = require "map/static_layouts/moonaltarrockidol"
-- layout.objects[1].type == "moon_altar_rock_idol"
-- layout.layers[1].data[1] == 34 -- tile ID for background
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled data format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility tag (likely legacy). |
| `orientation` | string | `"orthogonal"` | Tilemap orientation type. |
| `width` | number | `2` | Layout width in tiles. |
| `height` | number | `2` | Layout height in tiles. |
| `tilewidth` | number | `64` | Width of each tile in pixels. |
| `tileheight` | number | `64` | Height of each tile in pixels. |
| `tilesets` | table | `{{...}}` | Tileset reference data (see `ground` tileset). |
| `layers` | table | `{{...}, {...}}` | List of layers: background tiles (`BG_TILES`) and object placements (`FG_OBJECTS`). |
| `properties` | table | `{}` | Empty root-level properties. |

## Main functions
Not applicable.

## Events & listeners
Not applicable.