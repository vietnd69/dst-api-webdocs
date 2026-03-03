---
id: nightmare_begin_blocker
title: Nightmare Begin Blocker
description: Defines the initial static layout for the nightmare event map, specifying tile data and object placements.
tags: [map, worldgen, event]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 08a4a8f6
system_scope: world
---

# Nightmare Begin Blocker

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static layout definition for the beginning area of the nightmare event map. It is not an ECS component but a data structure in Tiled Map Editor format (`*.json`-style Lua table) used during world generation to place background tiles and foreground objects. It contains no executable logic or component code — only map metadata, tile layer data, and an object group listing placements for entities like firepits, rabbitholes, grass, saplings, torches, and skeletons.

## Usage example
This file is loaded automatically by the world generation system. Modders typically do not interact with it directly, but can override or reference it when defining custom nightmare event layouts.

```lua
-- This file is consumed by the map system during worldgen; no direct usage required.
-- To customize, override the map layout using worldgen overrides or scenario logic.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width`, `height` | number | `32` | Map dimensions in tiles. |
| `tilewidth`, `tileheight` | number | `16` | Size of each tile in pixels. |
| `tilesets` | table | — | Tileset definitions (here, only one named `"tiles"`). |
| `layers` | table | — | Contains background tile layer (`"BG_TILES"`) and object group (`"FG_OBJECTS"`). |

## Main functions
Not applicable — this is a static data structure, not a component or script with functional methods.

## Events & listeners
Not applicable — no event handling is performed in this file.