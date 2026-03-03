---
id: default_plus_start
title: Default Plus Start
description: Static map layout definition for the default plus start area containing initial resources and spawn points.
tags: [map, spawn, resources, layout]
sidebar_position: 1
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: d1d63ec7
system_scope: world
---
# Default Plus Start

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout for the default plus start area in Don't Starve Together. It specifies the foundational world geometry using a Tiled map format, including background tile layers, object placements (such as treasure chests, spawn points, and portals), and metadata like dimensions and tile sets. This layout is used during world generation to establish the initial playable area with essential resources and entry points.

The component does not represent a traditional ECS component but rather a data definition consumed by the world generation system to populate the game world. It does not contain logic, state, or interaction methods typical of in-game components.

## Usage example
This file is used internally during world generation. Modders typically do not interact with it directly but can reference or override it via worldgen overrides.

```lua
-- This is a data file; it is loaded and processed by the world generation system.
-- No direct usage in mod code is expected or required.
```

## Dependencies & tags
**Components used:** None — this is a pure data definition file.

**Tags:** None — no tags are added, removed, or checked.

## Properties
No properties are defined in the traditional ECS component sense, as this file returns a static Lua table used as a configuration template.

The following keys are present in the returned table:

| Key | Type | Default Value | Description |
|-----|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version targeted by the map. |
| `orientation` | string | `"orthogonal"` | Tile orientation mode. |
| `width` | number | `16` | Map width in tiles. |
| `height` | number | `16` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Custom map-level properties (unused). |
| `tilesets` | table | See source | Defines the tileset image and metadata. |
| `layers` | table | See source | Array of map layers (tile and object layers). |

## Main functions
No executable functions — this file is a pure data definition returning a table. It does not expose callable methods.

## Events & listeners
No events or listeners — this file does not interact with the event system.

