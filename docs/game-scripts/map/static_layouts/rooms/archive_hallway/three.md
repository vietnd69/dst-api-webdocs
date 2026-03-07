---
id: three
title: Three
description: Static map layout definition for the archive hallway's three-room configuration, specifying tilemap and object placement via Tiled JSON data.
tags: [map, static_layout, architecture]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: ecb3bd2b
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines a static room layout (`three.lua`) for the archive hallway in Don't Starve Together. It specifies the tilemap background layer (`BG_TILES`) and a set of placed game objects (chandeliers, statues, security desks, walls, areas, etc.) using Tiled JSON format. The layout is used by the world generation system to assemble the caves' archive environment.

## Usage example
This file is not intended for direct instantiation in mod code. It is consumed by the world generation engine as part of room templates. A typical usage pattern inside the generation system would be:
```lua
local layout = require("map/static_layouts/rooms/archive_hallway/three")
-- The engine internally uses layout.layers, layout.tilesets, etc., to instantiate tiles and prefabs
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties. This module returns a plain Lua table with Tiled-compatible layout metadata.

## Main functions
Not applicable.

## Events & listeners
Not applicable.