---
id: barracks_two
title: Barracks Two
description: A static layout definition for the Ruins map section that specifies background tiles, foreground objects (ruins walls, broken walls), and spawner placements for monsters and decoratives.
tags: [map, layout, ruins, spawner]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: f544e2f7
system_scope: environment
---

# Barracks Two

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

`barracks_two.lua` defines a static map layout for the Ruins area in DST. It specifies the background tile layer (`BG_TILES`) and a collection of foreground objects (`FG_OBJECTS`) — including ruins walls, broken walls, spawners for entities such as Nightmare bishops, Chess Junk, and Ruins Statues — using Tiled map format metadata. This file is not a component script, but a declarative map layout configuration used by the world generation system to instantiate physical and interactive entities during level loading.

## Usage example

This file is automatically loaded by the map generation system when the Ruins map section is initialized. Modders typically do not interact with it directly. To reference this layout in a custom map task or room, include it in a `taskset` or `static_layouts` configuration:

```lua
-- Example: Use in a worldgen override or custom scenario
GLOBAL.Require("map/static_layouts/barracks_two")
```

## Dependencies & tags
**Components used:** None — this is a data file, not an ECS component. No components are instantiated or accessed via `inst.components.X`.
**Tags:** None identified.

## Properties
This file defines map metadata, not a Lua class or component, so there are no instance properties in the traditional ECS sense. However, the returned table includes the following top-level fields:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version |
| `luaversion` | string | `"5.1"` | Lua interpreter version target |
| `orientation` | string | `"orthogonal"` | Map tile orientation |
| `width` | number | `40` | Map width in tiles |
| `height` | number | `40` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `properties` | table | `{}` | Global map properties (unused) |
| `tilesets` | table | — | Array of tileset definitions (e.g., tile texture, mapping) |
| `layers` | table | — | Array of layer objects: `"BG_TILES"` (tile layer) and `"FG_OBJECTS"` (object group) |

The `layers` table contains:
- `layers[1]`: `"BG_TILES"` — a `tilelayer` with 40x40 grid data, referencing tile IDs (e.g., `27`, `29`) from the `tiles` tileset.
- `layers[2]`: `"FG_OBJECTS"` — an `objectgroup` listing 35+ objects (walls, spawners), each with `x`, `y`, `type`, and optional `properties` (e.g., health percentage).

## Main functions
None — this is a static data file that returns a configuration table. It contains no functions.

## Events & listeners
None — this file does not register or dispatch events.