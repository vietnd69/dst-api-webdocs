---
id: walls_corner
title: Walls Corner
description: A Tiled map data file defining static wall corner decorations and ruins for the game world.
tags: [environment, map, static, walls, ruins]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: 53c2853c
system_scope: environment
---

# Walls Corner

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
`walls_corner.lua` is a static map layout file that defines wall corner decorations and ruin structures using Tiled JSON-compatible data. It specifies background tile layers (`BG_TILES`) and foreground object placements (`FG_OBJECTS`) representing `wall_ruins` and `brokenwall_ruins`. This file is used by the world generation system to place decorative and ruined wall assets in the game world—typically as part of static room layouts in the forest or cave biomes.

## Usage example
This file is not a component and is not used like a Lua component. It is a data file consumed by the map loader (`map/archive_worldgen.lua` and related systems) during world generation. No direct instantiation or API calls are performed by modders.

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties. This file returns a plain Lua table containing Tiled map metadata (e.g., `version`, `layers`, `tilesets`), not a component table with instance-based properties.

## Main functions
Not applicable.

## Events & listeners
Not applicable.