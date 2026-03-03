---
id: maxwell_4
title: Maxwell 4
description: A static map layout file defining the physical structure of the Maxwell 4 level, including background tile layers and object placement for statues and marble trees.
tags: [world, map, level, static_layout]
sidebar_position: 1

last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 071cc10e
system_scope: world
---

# Maxwell 4

> Based on game build **714014** | Last updated: 2026-02-28

## Overview

`maxwell_4.lua` is a static map layout file used to define the static geometry and fixed asset placement for a specific level in the game world. It is not a component in the Entity Component System (ECS) sense but rather a configuration data file in Tiled Map Editor format (JSON-like Lua table structure). It specifies tile-based background layers (`BG_TILES`) and object layer placements (`FG_OBJECTS`) for static entities such as statues and marble trees. This file is loaded during world generation to instantiate the appropriate background tiles and spawn or link to corresponding prefabs (e.g., `statuemaxwell`, `marbletree`) at specified coordinates.

## Usage example

This file is not directly instantiated as a component. Instead, it is referenced and processed by world generation systems (e.g., `static_layouts.lua` loader or related level/task systems). A typical usage pattern in code is not applicable, as this file serves as input data for external map loaders.

## Dependencies & tags
**Components used:** None directly (this is a data-only file).
**Tags:** None identified.

## Properties

The file is a Lua table representing a Tiled map. Key top-level properties are as follows:

| Property       | Type     | Default Value | Description |
|----------------|----------|---------------|-------------|
| `version`      | `string` | `"1.1"`       | Tiled map format version |
| `luaversion`   | `string` | `"5.1"`       | Lua version compatibility target |
| `orientation`  | `string` | `"orthogonal"`| Map rendering orientation |
| `width`        | `number` | `20`          | Map width in tiles |
| `height`       | `number` | `20`          | Map height in tiles |
| `tilewidth`    | `number` | `16`          | Width of each tile in pixels |
| `tileheight`   | `number` | `16`          | Height of each tile in pixels |
| `properties`   | `table`  | `{}`          | Map-level custom properties (empty in this case) |
| `tilesets`     | `table`  | See source   | Array of tileset definitions, including source image and first GID |
| `layers`       | `table`  | See source   | Array of layer definitions (tile layer + object group) |

## Main functions

This file contains no executable functions; it is a data structure only.

## Events & listeners

This file does not define or interact with any events or listeners.