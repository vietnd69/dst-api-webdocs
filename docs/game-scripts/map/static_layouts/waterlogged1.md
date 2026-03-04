---
id: waterlogged1
title: Waterlogged1
description: Defines a static map layout for waterlogged environments, containing tile data and object group metadata for world generation.
tags: [map, worldgen, layout]
sidebar_position: 10
last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 5760ef35
system_scope: world
---
# Waterlogged1

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`Waterlogged1` is a static map layout definition used in world generation for Don't Starve Together. It specifies a 30×30 tile grid with tile data, tileset configuration, and object layers marking tree spawn areas and special structures like "watertree_pillar". This layout is not a component in the ECS; it is a data structure returned by a Lua module and consumed by the world generation system to populate map tiles and object placements.

## Usage example
This layout is loaded and applied by the world generation system during level construction. It is not instantiated directly by modders.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Map format version (Tiled format). |
| `luaversion` | string | `"5.1"` | Lua version used. |
| `orientation` | string | `"orthogonal"` | Tilemap orientation type. |
| `width` | number | `30` | Map width in tiles. |
| `height` | number | `30` | Map height in tiles. |
| `tilewidth` | number | `64` | Width of each tile in pixels. |
| `tileheight` | number | `64` | Height of each tile in pixels. |
| `tilesets` | table | (see source) | List of tileset definitions used. |
| `layers` | table | (see source) | Layer definitions, including tile layer `BG_TILES` and object group `FG_OBJECTS`. |

## Main functions
Not applicable. This module is a pure data definition and contains no executable logic or functions.

## Events & listeners
Not applicable. This module does not interact with events.

