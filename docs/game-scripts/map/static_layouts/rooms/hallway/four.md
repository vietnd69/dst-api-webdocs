---
id: four
title: Four
description: Defines a static hallway room layout for the game's world generation system using Tiled map format metadata.
tags: [map, room, static_layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 4b425914
system_scope: world
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file describes a static room layout named "four" used in the game's world generation system. It is not an ECS component, but rather a Tiled map export in Lua format that defines tile data and object placements for a hallway-style room. It is consumed by the map/room generation system to instantiate physical room structures in-game.

The room is 32×32 tiles in size with 16×16 tile dimensions. Tile layer "BG_TILES" contains static floor/background tiles (mostly empty, with specific non-zero values at certain positions), while "FG_OBJECTS" defines a single foreground object (a `pigtorch`) placed at world coordinates.

## Usage example
This file is not instantiated directly by modders. It is referenced internally by the world generation system when building static layouts, typically via `MapRooms:LoadRoom("rooms/hallway/four")` or similar utilities. No direct modder interaction is intended.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version targeted by export. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width` | number | `32` | Room width in tiles. |
| `height` | number | `32` | Room height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `properties` | table | `{}` | Optional room-level metadata. |
| `tilesets` | array | `{{...}}` | Tileset definitions (single set referenced). |
| `layers` | array | `{{...}, {...}}` | Layer definitions: background tiles + foreground objects. |

## Main functions
Not applicable.

## Events & listeners
Not applicable.