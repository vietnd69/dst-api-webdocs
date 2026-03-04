---
id: retrofit_brinepool_tiny
title: Retrofit Brinepool Tiny
description: Defines a compact static map layout for retrofit brinepool environments with designated salt stack placement zones and a cookiecutter spawner.
tags: [map, layout, environment, worldgen]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 01cbdece
system_scope: environment
---

# Retrofit Brinepool Tiny

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`retrofit_brinepool_tiny` is a static map layout file defining a small `4x4` tile area used in DST's world generation system. It specifies background tile coverage and foreground object placement—including multiple `saltstack_area` zones and a `cookiecutter_spawner`—that are used to populate brinepool environments with appropriate decorative and gameplay-relevant content.

This file is not a Lua component but a Tiled JSON map definition (`*.json`) parsed during world generation. It contributes to the `static_layouts` system used by the game's room/task placement engine to ensure consistent environmental styling in retrofit (remastered) brinepool maps.

## Usage example
This file is not directly instantiated or used via code. It is loaded and interpreted by the world generation system as part of layout templates.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `version` | string | `"1.1"` | Tiled map format version |
| `luaversion` | string | `"5.1"` | Target Lua interpreter version |
| `orientation` | string | `"orthogonal"` | Map rendering orientation |
| `width` | number | `4` | Map width in tiles |
| `height` | number | `4` | Map height in tiles |
| `tilewidth` | number | `64` | Width of each tile in pixels |
| `tileheight` | number | `64` | Height of each tile in pixels |
| `tilesets` | table | (see source) | List of tileset definitions used by the map |
| `layers` | table | (see source) | Array of map layers (tile and object layers) |

## Main functions
Not applicable — this is a static data definition, not a functional Lua module.

## Events & listeners
Not applicable — this file does not define any event handlers or listeners.