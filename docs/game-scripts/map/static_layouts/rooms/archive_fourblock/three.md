---
id: three
title: Three
description: Defines the static Tiled map layout data for a three-tile-wide chamber in the archive_fourblock map layout set.
tags: [map, static_layout, room]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: a68e210f
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file returns raw map layout data in Tiled JSON-compatible format, describing a 32×32 tile room used in the `archive_fourblock` map layout set. It specifies background tile placement, an object group for foreground entities (e.g., structural pillars), and metadata such as tile dimensions and orientation. The data is used by the world generation system to instantiate procedural or pre-designed room instances in the game world.

## Usage example
This file is not used directly in Lua code; it is a data definition consumed by the map loading infrastructure during world generation. No manual usage is expected for modders.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version. |
| `luaversion` | string | `"5.1"` | Lua version compatibility marker. |
| `orientation` | string | `"orthogonal"` | Map rendering orientation. |
| `width`, `height` | number | `32` | Dimensions of the map in tiles. |
| `tilewidth`, `tileheight` | number | `16` | Pixel size of each tile. |
| `tilesets` | table | See source | Tileset definition with reference to assets. |
| `layers` | table | See source | List of tile and object layers. |

## Main functions
Not applicable.

## Events & listeners
Not applicable.