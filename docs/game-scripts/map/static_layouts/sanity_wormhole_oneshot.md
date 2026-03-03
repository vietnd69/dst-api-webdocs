---
id: sanity_wormhole_oneshot
title: Sanity Wormhole Oneshot
description: A Tiled map definition file specifying static layout data for a sanity wormhole room, including tile layers and object placement for sanity rocks and one wormhole.
tags: [map, worldgen, static]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 7e270b7f
system_scope: world
---

# Sanity Wormhole Oneshot

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`sanity_wormhole_oneshot.lua` is a static layout map definition used in DST’s world generation system. It defines the structure and content of a single-use sanity wormhole room (likely for caves or special events), specifying:
- A 16×16 tile layer (`BG_TILES`) with tile IDs (only IDs `8` appear at fixed coordinates).
- An object group (`FG_OBJECTS`) containing:
  - Multiple `sanityrock` objects positioned throughout the room.
  - Exactly one `wormhole_limited_1` object, indicating a one-time-use wormhole entrance.

This file is consumed by the world generation tooling to instantiate the room in the game world, and does not contain executable game logic (e.g., no components, classes, or Lua functions).

## Usage example
This file is not used directly via API by modders. It is referenced internally by DST’s map/room generation systems (e.g., `map/tasksets/` or `map/rooms/`) when spawning the sanity wormhole room.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility declared. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` / `height` | number | `16` | Dimensions in tiles. |
| `tilewidth` / `tileheight` | number | `16` | Size of each tile in pixels. |
| `tilesets` | table | — | Tileset definition (single `tiles.png` reference). |
| `layers` | table | — | List of layers: `BG_TILES` (tile layer), `FG_OBJECTS` (object group). |

## Main functions
Not applicable — this file returns static data only, no functions are defined.

## Events & listeners
Not applicable — no event listeners or event firing logic present.