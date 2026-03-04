---
id: warzone_2
title: Warzone 2
description: Static map layout definition for the Warzone 2 area, specifying tile placement and entity spawn points.
tags: [map, static_layout, worldgen]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: d06a344f
system_scope: world
---

# Warzone 2

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`warzone_2.lua` defines a static map layout used in Don't Starve Together for the Warzone 2 arena. It specifies tile layer data (background tiles), object layer entities (entity spawn points), and foundational map properties such as dimensions and orientation. This file is part of the `static_layouts` directory and is loaded by the world generation system to place pre-defined structures or arena configurations.

This file is data-only and does not contain any Lua components, classes, or executable code. It returns a structured table conforming to the Tiled map format (version 1.1, Lua syntax) and is consumed by external map loading utilities—not used directly as a component in the ECS.

## Usage example
This file is not intended for direct use in mod code. It is referenced internally by the world generation system. Modders typically interact with such layouts through higher-level APIs like `StaticLayoutLoader` or `WorldGenContext` when overriding or injecting custom arena layouts.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version assumed for data encoding. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width` | number | `16` | Map width in tiles. |
| `height` | number | `16` | Map height in tiles. |
| `tilewidth` | number | `16` | Width of each tile in pixels. |
| `tileheight` | number | `16` | Height of each tile in pixels. |
| `tilesets` | table | `{{...}}` | Array of tileset definitions, including image path and tile dimensions. |
| `layers` | table | `{{...}}` | Array of layer definitions: `BG_TILES` (tile layer) and `FG_OBJECTS` (object group). |

## Main functions
This file does not define any functions.

## Events & listeners
No events or listeners are defined or used.