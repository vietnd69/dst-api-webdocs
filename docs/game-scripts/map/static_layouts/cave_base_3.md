---
id: cave_base_3
title: Cave Base 3
description: Static layout definition for a specific cave base map configuration used in the world generation system.
tags: [world, map, static_layout, generation]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 0e79b0a1
system_scope: world
---

# Cave Base 3

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
`cave_base_3` is a static map layout file that defines the pre-designed layout for a cave base area in the game's world generation system. It is a Tiled JSON-compatible map definition (stored as Lua table) specifying tile layers for background visuals, object groups for interactive or decorative entities, and layout metadata. This file contributes to procedural or semi-procedural map composition, likely used when generating or populating specific cave biomes during world initialization. It contains no executable logic or ECS components itself — it serves as declarative data consumed by the map generation and rendering subsystems.

## Usage example
This file is not meant to be used directly in mod code as a component. Instead, it is referenced by the world generation system (e.g., via `map/static_layouts.lua`, `map/levels/caves.lua`, or related task/taskset files). A typical usage would be loaded internally by the engine like:
```lua
local layout = require "map/static_layouts/cave_base_3"
-- Layout data is then passed to map generation functions:
-- worldgenerator:AddStaticLayout(layout, x, y)
```
No direct component instantiation or function calls occur in mod scripts; the data structure is consumed at runtime by core engine systems.

## Dependencies & tags
**Components used:** None — this file is a data definition, not an ECS component.
**Tags:** None identified.

## Properties
This file does not define an ECS component and contains no dynamic properties or instance variables. It is a static table with Tiled map schema fields:
- `version` (string): `"1.1"`
- `luaversion` (string): `"5.1"`
- `orientation` (string): `"orthogonal"`
- `width` (number): `24` (tiles)
- `height` (number): `24` (tiles)
- `tilewidth` (number): `16` (pixels)
- `tileheight` (number): `16` (pixels)
- `properties` (table): Empty
- `tilesets` (table): One tileset definition referencing an image and tile metadata
- `layers` (table): Two layers (`BG_TILES` and `FG_OBJECTS`)

## Main functions
This file does not define any functions. It is a pure data structure.

## Events & listeners
Not applicable — this is a static layout definition, not an ECS component, and does not register or fire events.