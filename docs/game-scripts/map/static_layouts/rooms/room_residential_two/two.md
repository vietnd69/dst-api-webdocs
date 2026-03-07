---
id: two
title: Two
description: Defines the static layout data for a residential-style room in the world generation system using Tiled Map Editor format.
tags: [world, map, room, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: c1a64bd6
system_scope: world
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`two.lua` is a static room layout definition for the `room_residential_two` room type in DST's world generation system. It specifies the tile-based background layer (`BG_TILES`) and a foreground object layer (`FG_OBJECTS`) containing static scene objects like debris or furniture. This file conforms to the Tiled Map Editor JSON schema (serialized as Lua), and is consumed by the map generation logic to populate in-game rooms procedurally.

This file contains no runtime components or logic; it is a declarative data structure used during world generation to instantiate map entities.

## Usage example
Static layouts like this one are not instantiated directly by modders. Instead, they are referenced internally by the world generation system. An example of how such data is consumed is not applicable for modding purposes.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled version used for the map format. |
| `luaversion` | string | `"5.1"` | Target Lua version for serialization compatibility. |
| `orientation` | string | `"orthogonal"` | Map projection orientation. |
| `width` | number | `32` | Width of the map in tiles. |
| `height` | number | `32` | Height of the map in tiles. |
| `tilewidth` | number | `16` | Pixel width of each tile. |
| `tileheight` | number | `16` | Pixel height of each tile. |
| `properties` | table | `{}` | Map-wide custom properties (currently empty). |
| `tilesets` | array of tables | — | Tileset definitions including path and image info. |
| `layers` | array of tables | — | List of layers: `tilelayer` (`BG_TILES`) and `objectgroup` (`FG_OBJECTS`). |

## Main functions
None identified. This is a pure data structure with no executable functions.

## Events & listeners
None identified. This file does not define or interact with any event listeners.