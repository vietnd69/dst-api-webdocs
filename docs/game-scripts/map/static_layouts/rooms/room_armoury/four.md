---
id: four
title: Four
description: Defines the layout data for the 'four' room variant in the armoury map room, including tile positions and object placements using Tiled map format.
tags: [map, room, layout]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 838fc51a
system_scope: environment
---

# Four

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the static map layout for the `four` variant of the `room_armoury` room type in DST's world generation system. It is a data file written in the Tiled Map Editor format (JSON-compatible Lua syntax), containing tilemap layers (`BG_TILES`) and object placements (`FG_OBJECTS`). The layout uses a 32×32 grid with 16×16 pixel tiles and references a tileset image for rendering ground-layer tiles. Object entries (e.g., `nightmarelight`) are placed via the `FG_OBJECTS` object group.

## Usage example
This file is not a component and is not added to entities. It is loaded as a data table by room placement systems (e.g., `map/rooms/armoury.lua`) when generating the armoury map section. No direct instantiation is required.
```lua
-- Example: How the game *loads* this layout (pseudocode)
local room_layout = require "map/static_layouts/rooms/room_armoury/four"
-- room_layout.layers[1].data contains tile data
-- room_layout.layers[2].objects contains object placements
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
This is a pure data module that returns a Lua table. It contains no functions.

## Events & listeners
None identified