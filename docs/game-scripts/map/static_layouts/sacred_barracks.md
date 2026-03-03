---
id: sacred_barracks
title: Sacred Barracks
description: Defines a static map layout using Tiled map format for the Sacred Barracks area, containing tile layers for background tiles and an object group with spawners and ruins for gameplay content.
tags: [map, layout, static, environment]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 65333972
system_scope: environment
---

# Sacred Barracks

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`./map/static_layouts/sacred_barracks.lua` is a static layout file that defines the structural geometry and object placement for the Sacred Barracks area in DST. It uses the Tiled map format (version 1.1) and encodes map data in Lua tables. This file does not contain a component class and serves as procedural metadata rather than an ECS component. It specifies background tiles via `BG_TILES` and gameplay-relevant objects—including ruins, spawners, and lights—via the `FG_OBJECTS` group.

## Usage example
This file is loaded internally by the world generation system and does not require direct instantiation. Its structure follows standard Tiled Lua exports. Modders may reference this file when designing custom map layouts or verifying object positions for custom prefabs.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version used for encoding |
| `orientation` | string | `"orthogonal"` | Map orientation type |
| `width` | number | `40` | Map width in tiles |
| `height` | number | `40` | Map height in tiles |
| `tilewidth` | number | `16` | Width of a single tile in pixels |
| `tileheight` | number | `16` | Height of a single tile in pixels |
| `tilesets` | table | *see source* | Tileset definitions (e.g., `tiles.png`) |
| `layers` | table | *see source* | Array of layers (`BG_TILES`, `FG_OBJECTS`) |

## Main functions
None identified.

## Events & listeners
None identified.