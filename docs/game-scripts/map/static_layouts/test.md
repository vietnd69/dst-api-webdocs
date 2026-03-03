---
id: test
title: Test
description: Static map layout data for a test world area, defining tile layers and object groups for level generation.
tags: [map, worldgen, test]
sidebar_position: 1

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 3b8cfdd6
system_scope: world
---

# Test

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`./map/static_layouts/test.lua` is a static layout configuration file defining a 32×32 test map area using Tiled map format. It specifies tileset references, a background tile layer (`BG_TILES`), and an object layer (`FG_OBJECTS`) containing named placement markers for entities like `firepit`, `spawnpoint`, and `area_1`/`area_2`. This file is not a game component but a data definition used during world generation.

## Usage example
This file is loaded and processed by the world generation system and is not directly instantiated as an entity component. Modders should reference it when building or extending test-level layouts, but it is not added to entities via `inst:AddComponent`.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled format version. |
| `luaversion` | string | `"5.1"` | Target Lua version. |
| `orientation` | string | `"orthogonal"` | Map orientation type. |
| `width`, `height` | number | `32` | Map dimensions in tiles. |
| `tilewidth`, `tileheight` | number | `16` | Size of each tile in pixels. |
| `tilesets` | table | — | Array of tileset definitions including image path and `firstgid`. |
| `layers` | table | — | Array of layers (`tilelayer` and `objectgroup`). |
| `properties` | table | `{}` | Global map properties (empty in this case). |

## Main functions
Not applicable — this file is a data table definition, not a component with methods.

## Events & listeners
Not applicable.