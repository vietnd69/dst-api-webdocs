---
id: two
title: Two
description: Static map layout definition for the Pit Room Armoury Two room in DST, specifying tile data and object spawner positions for a specific dungeon layout.
tags: [map, room, static, dungeon]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 85cc986b
system_scope: environment
---

# Two

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the static layout for the `pit_room_armoury_two` dungeon room in Don't Starve Together. It is a data-only module that returns a table describing the Tiled map format used for procedural room placement — including grid-based tile layers (`BG_TILES`) and object placement layers (`FG_OBJECTS`). The file does not implement a component or game object directly; instead, it provides layout metadata consumed by the world generation and room placement systems.

## Usage example
This file is not instantiated or used directly by modders. It is referenced internally by the game’s map generation logic when spawning the `pit_room_armoury_two` room. Example usage is not applicable for this type of static layout definition.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version used by Tiled. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | (see source) | Array of tileset definitions. |
| `layers` | table | (see source) | Array of layers: `BG_TILES` (tile layer) and `FG_OBJECTS` (object group). |

## Main functions
Not applicable — this file exports a static data table and does not define any functional methods.

## Events & listeners
None identified.