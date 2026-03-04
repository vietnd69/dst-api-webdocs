---
id: skeleton_winter_easy
title: Skeleton Winter Easy
description: Defines a static pregenerated dungeon layout containing loot and skeletal remains for the winter season in DST's world generation system.
tags: [map, loot, dungeon]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 2f01b168
system_scope: environment
---

# Skeleton Winter Easy

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`./map/static_layouts/skeleton_winter_easy.lua` is a Tiled map file that defines a small, prebuilt environmental layout used in world generation. It specifies a 12×12 grid background layer and an object layer containing references to prefabs — including `"skeleton"`, `"winterhat"`, `"trunkvest_winter"`, `"backpack"`, and `"axe"` — placed at specific coordinates. This layout serves as a spawnable room or scatterable feature (likely in caves or outdoor winter biomes) containing minimal loot and thematic decorative elements for seasonal immersion.

## Usage example
This file is not a component and is not instantiated via `AddComponent`. It is consumed by the world generation engine via Tiled-compatible loading logic. Modders typically reference it indirectly through task/room definitions or scenario content. Example usage in a room or task definition might look like:

```lua
-- Example reference in a room/task definition (not part of this file's code)
AddSimpleRoom("skeleton_winter_easy", {
    width = 12,
    height = 12,
    -- additional placement logic...
})
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  
This file is a pure data definition (JSON-like Lua table) and contains no entity logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version compatibility |
| `orientation` | string | `"orthogonal"` | Tilemap projection mode |
| `width` | number | `12` | Map width in tiles |
| `height` | number | `12` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `tilesets` | array | — | Tileset metadata (one entry: `"tiles"`) |
| `layers` | array | — | Layer definitions: `"BG_TILES"` (tilelayer) and `"FG_OBJECTS"` (objectgroup) |

### Tileset properties
| Tileset Property | Value |
|------------------|-------|
| `name` | `"tiles"` |
| `firstgid` | `1` |
| `image` | `"../../../../tools/tiled/dont_starve/tiles.png"` |

### Layer: `"FG_OBJECTS"`
Objects (prefab placement instructions):
| Name | Type | X | Y | Properties |
|------|------|---|---|------------|
| `""` | `"skeleton"` | `80` | `80` | — |
| `""` | `"winterhat"` | `32` | `80` | — |
| `""` | `"trunkvest_winter"` | `96` | `128` | — |
| `""` | `"backpack"` | `128` | `48` | `scenario = "container_giveloot"` |
| `""` | `"axe"` | `64` | `32` | — |

## Main functions
Not applicable — this file exports only static data. No runtime functions are defined.

## Events & listeners
Not applicable — this file contains no Lua logic or event handling.

## Notes for Modders
- This layout is imported and interpreted by DST's worldgen and room-placement systems.
- Object placement coordinates (`x`, `y`) are in pixels, relative to the map origin (`0,0`), using tile-sized grid (`tilewidth = 16`, `tileheight = 16`).
- The `"backpack"` object includes a special property `"scenario": "container_giveloot"`, suggesting it may trigger special loot generation behavior when placed.
- Modifiers like `tileset`, `layer`, and `object` names should match expected identifiers in the game’s static layout loader (`Map.lua`, `Room.lua`, or scenario-specific loaders).