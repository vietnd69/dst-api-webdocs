---
id: monkeyisland_01_small
title: Monkeyisland 01 Small
description: A static layout definition for Monkey Island in DST, containing tilemap data and object group metadata for static structures, portals, docks, and prefabs.
tags: [map, static_layout, world]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 093ccaf1
system_scope: world
---

# Monkeyisland 01 Small

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file defines a static layout used in the game map for Monkey Island. It is a Tiled map format JSON-style Lua table, containing tile data (`layers[1]`) and multiple object groups (`layers[2..6]`) that specify placement of static world objects like docks, monkey huts, pirate boats, pillars, and portal debris. It does not define a game component in the ECS sense (i.e., no `inst:AddComponent`, no runtime logic), but rather serves as raw world data consumed by the worldgen or level setup systems to instantiate prefabs and tiles.

## Usage example
This file is not meant to be directly instantiated as an entity component. It is loaded and processed by worldgen systems (e.g., `archive_worldgen.lua`, `levels.lua`) to populate the world. A typical usage would involve loading this layout as part of a level definition:

```lua
-- Not executable by modders directly — loaded internally by game
-- Example worldgen integration (pseudo-code)
local layout = require("map/static_layouts/monkeyisland_01_small")
world:AddStaticLayout(layout)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.  
This file is static layout metadata and does not interact with the ECS or register components/tags directly.

## Properties
No public properties. The file returns a Lua table with Tiled map structure (e.g., `width`, `height`, `layers`, `tilesets`, `properties`). Keys are data fields, not component properties.

## Main functions
This file does not define any functions — it returns a static data table.

## Events & listeners
None identified.