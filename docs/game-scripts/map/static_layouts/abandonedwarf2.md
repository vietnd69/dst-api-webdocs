---
id: abandonedwarf2
title: Abandonedwarf2
description: A static map layout defining the tile-based geometry and object placements for the Abandoned Dwarf 2 map room.
tags: [map, room, static, layout, tile]
sidebar_position: 10

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 2818ddb5
---

# Abandonedwarf2

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
`abandonedwarf2.lua` defines a static map layout used to generate the "Abandoned Dwarf 2" room in the game world. It specifies the Tiled map data—including tile layers, object groups, and associated properties—required to construct the room's visual and structural composition. This file is not an ECS component but rather a world-generation asset that provides layout data, typically consumed by map/room loading systems. It contains no runtime logic, components, or behaviors; it serves purely as a declarative description of room geometry.

## Usage example
This file is not instantiated or used directly as a component. Instead, it is loaded and applied during world generation when the game engine processes room templates. A typical integration point would be within a room placement system (e.g., in a task or taskset script), where this layout is referenced by filename. No code snippet is applicable for modder-facing component usage.

## Dependencies & tags
**Components used:** None. This is a static data file with no component references.  
**Tags:** None identified.

## Properties
The file exports a table with the following top-level properties:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | `string` | `"1.1"` | Version of the Tiled map format. |
| `luaversion` | `string` | `"5.1"` | Target Lua version for encoding (used in map serialization). |
| `orientation` | `string` | `"orthogonal"` | Map orientation type (orthogonal, isometric, etc.). |
| `width` | `number` | `10` | Width of the map in tiles. |
| `height` | `number` | `10` | Height of the map in tiles. |
| `tilewidth` | `number` | `64` | Width (in pixels) of each tile. |
| `tileheight` | `number` | `64` | Height (in pixels) of each tile. |
| `properties` | `table` | `{}` | Map-level custom properties (empty here). |
| `tilesets` | `table[]` | — | Array of tileset definitions (e.g., ground tileset). |
| `layers` | `table[]` | — | Array of map layers (tile layers and object groups). |

## Main functions
This file is data-only and defines no functions.

## Events & listeners
This file is data-only and has no event listeners or event emissions.