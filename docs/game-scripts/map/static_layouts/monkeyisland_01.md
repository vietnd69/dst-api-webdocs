---
id: monkeyisland_01
title: Monkeyisland 01
description: Static map layout data for Monkey Island, defining terrain tiles and placement of islands-specific structures and objects.
tags: [world, map, static_layout]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: a676598f
system_scope: world
---

# Monkeyisland 01

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static world layout definition for Monkey Island, stored in Tiled map format (TSX/TSJ). It defines the ground tile layer (`BG_TILES`) and multiple object groups containing metadata for dynamic placement of in-game entities such as Monkey Queen, Monkey Pillars, dock tiles, monkey huts, portal debris, and pirate ships. The layout is not an ECS component — it is data used by the world generation system to instantiate prefabs and tiles during world load.

## Usage example
```lua
-- This file is loaded automatically by the world generation system.
-- Modders should not call or modify this directly.
-- To override layout data, use worldgen overrides or custom static layouts.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version. |
| `luaversion` | string | `"5.1"` | Lua version used for encoding. |
| `orientation` | string | `"orthogonal"` | Map orientation. |
| `width` | number | `36` | Map width in tiles. |
| `height` | number | `36` | Map height in tiles. |
| `tilewidth` | number | `64` | Width of each tile in pixels. |
| `tileheight` | number | `64` | Height of each tile in pixels. |
| `tilesets` | table | *see source* | Array of tileset definitions. |
| `layers` | table | *see source* | Array of layer definitions (tile layer + object groups). |

## Main functions
Not applicable — this file returns static data only.

## Events & listeners
Not applicable — no runtime logic or event handling.