---
id: chess_blocker
title: Chess Blocker
description: Defines a static map layout used for the chess minigame world generation, specifying tile backgrounds and object placements.
tags: [world, map, minigame]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: f8f82d22
system_scope: world
---

# Chess Blocker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`chess_blocker.lua` is not a component in the Entity Component System, but rather a static world generation data file. It defines a pre-designed map layout for the chess minigame (likely part of the "Mad Max" or "Dream World" content). The file is a Tiled Map Editor JSON/Lua-compatible export, specifying tile layers for background visuals and object groups for spawning in-game prefabs like `marblepillar`, `flower_evil`, and `knight` entities.

## Usage example
This file is loaded internally by the world generation system and is not instantiated manually by mods. However, it may be referenced or overridden in custom worldgen tasksets:

```lua
-- Example usage in a taskset definition (not in plugin code)
local CHESS_BLOCKER = require("map/static_layouts/chess_blocker")
-- Internally parsed by worldgen tasks to embed the layout in the generated level
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file exports a single table literal containing static layout metadata.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled export format version. |
| `luaversion` | string | `"5.1"` | Target Lua version for export. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `40` | Map width in tiles. |
| `height` | number | `40` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | array | — | List of tileset definitions (e.g., ground tiles). |
| `layers` | array | — | List of layers: `BG_TILES` (tile data), `FG_OBJECTS` (entity placements). |

## Main functions
Not applicable — this is a data-only file with no executable logic or methods.

## Events & listeners
Not applicable — no event handling is present.
