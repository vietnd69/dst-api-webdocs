---
id: hound_rocks
title: Hound Rocks
description: Static layout configuration for the Hound Rock map region containing rocks and hound mounds as placed objects and background tiles.
tags: [world, map, static_layout, entity_placement]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 69e77dee
system_scope: world
---

# Hound Rocks

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static layout used for map generation in Don't Starve Together. It specifies a 32x32 tile map area with a background tile layer and an object group layer. The background layer contains no meaningful tile data (all zeroed), while the foreground object layer defines static placements of rocks (`rock1`, `rock2`, `rock_flintless`) and hound mounds (`houndmound`) as Tiled-style objects. This layout is consumed by the world generation system to populate the game world with pre-defined environmental features, particularly rock formations and hound mound spawns.

## Usage example
This file is loaded and processed internally by the world generation engine during map assembly. Modders typically do not instantiate or manipulate this layout directly in Lua code. To reference it in worldgen overrides or custom map recipes, use the filename `"hound_rocks"` as a key in `map.static_layouts`.

```lua
-- Example: Enabling custom hound rock placement via worldgen override
TheWorld.static_layouts.hound_rocks = {
  version = "1.1",
  luaversion = "5.1",
  orientation = "orthogonal",
  width = 32,
  height = 32,
  tilewidth = 16,
  tileheight = 16,
  properties = {},
  tilesets = { ... }, -- Same structure as provided in source
  layers = { ... }
}
```

## Dependencies & tags
**Components used:** None — This file contains only static layout metadata (JSON-like Tiled format) and does not directly interact with entity components.
**Tags:** None identified.

## Properties
No Lua-level properties are defined in this file. The returned table contains only Tiled map format fields (e.g., `width`, `height`, `layers`), not script variables or instance properties.

## Main functions
No functions are defined in this file. It is a pure data definition module returning a static Lua table conforming to the Tiled JSON export schema (v1.1).

## Events & listeners
No events or listeners are associated with this file.