---
id: three
title: Three
description: Defines the tilemap layout for a static open-room asset used in world generation.
tags: [room, worldgen, tilemap]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 17b8b321
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file describes a static Tiled-compatible tilemap layout used for a 32x32 grid room in the "open" room category (`room_open`). It defines background tiles and an empty foreground object layer. The data is purely static layout metadata and does not implement any game logic, components, or entity behavior. It is consumed by the world generation system to instantiate visual and collision geometry for map rooms.

## Usage example
This file is not instantiated or used directly in mod code. Instead, it is loaded automatically by the world generation pipeline when the corresponding room layout is selected. Modders do not need to interact with this file directly.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua interpreter version expected by Tiled. |
| `orientation` | string | `"orthogonal"` | Map orientation (DST uses orthogonal grids). |
| `width` | number | `32` | Width of the room in tiles (x-dimension). |
| `height` | number | `32` | Height of the room in tiles (y-dimension). |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | array | `...` | Contains external tileset definitions (only one entry). |
| `layers` | array | `...` | Contains layer definitions: background tiles (`BG_TILES`) and foreground objects (`FG_OBJECTS`). |

## Main functions
Not applicable — this file is a pure data definition and exports no functional logic.

## Events & listeners
Not applicable — no events or listeners are registered.