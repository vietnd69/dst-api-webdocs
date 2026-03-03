---
id: leif_forest
title: Leif Forest
description: A static map layout definition for the Leif Forest region, containing background tiles and object placements for trees and the boss Leif.
tags: [world, map, boss, layout, environment]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 2d101109
system_scope: world
---

# Leif Forest

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file defines a static map layout for the Leif Forest region in Don't Starve Together. It is a Tiled Map Editor data file (`.lua` format) used to specify background tile placements and object instances—including evergreen trees and boss spawns—for a specific level area. It does not function as an ECS component, but rather as a static data asset consumed by the world generation system to build the level geometry and entity placements.

## Usage example
This file is not instantiated as a component and is not loaded via standard Lua `require()` by modders. Instead, the game engine loads this file directly during world generation when the Leif Forest map layer is activated. Modders should not directly instantiate or interact with this file.

## Dependencies & tags
**Components used:** None — this is a static data definition, not an ECS component.
**Tags:** None identified.

## Properties
This file is a Lua table returned by the `return` statement. It does not define a class or constructor. The following are the top-level properties of the table structure:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Lua version used for encoding |
| `orientation` | string | `"orthogonal"` | Map tile orientation |
| `width` | number | `32` | Map width in tiles |
| `height` | number | `32` | Map height in tiles |
| `tilewidth` | number | `16` | Width of each tile in pixels |
| `tileheight` | number | `16` | Height of each tile in pixels |
| `properties` | table | `{}` | Map-level custom properties |
| `tilesets` | table | — | List of tileset definitions (contains one tileset) |
| `layers` | table | — | Array of map layers (includes tile layer and object group) |

## Main functions
This file contains no functions — it is a data-only structure.

## Events & listeners
This file defines no events or listeners, as it is not an ECS component or runtime entity.