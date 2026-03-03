---
id: three
title: Three
description: Defines the layout data for the "Armoury" map room (three.lua), specifying background tile patterns and object spawn points using Tiled Map Editor format.
tags: [map, layout, spawn]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 5615b81b
system_scope: world
---

# Three

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file defines the static layout for the "Armoury" room variant `three` in DST’s world generation system. It is not a component but a Lua table returning Tiled-compatible map data. It specifies background tile placement (`BG_TILES` layer) and placement points for dynamic entities like statues and nightmare knights/bishops (`FG_OBJECTS` group). The data is consumed by the world generation system to instantiate physical and entity elements in the game world.

## Usage example
This file is not intended for direct manual instantiation. It is loaded by the world generation engine via `map/tasksets/rooms.lua` or similar. Example integration context:
```lua
-- Internally referenced by map/rooms loader (e.g., room_armoury.lua)
local layout_data = require("map/static_layouts/rooms/room_armoury/three")
-- layout_data.layers[1].data contains the tile grid
-- layout_data.layers[2].objects contains spawn locations
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file returns a data-only Lua table defining map geometry.

## Main functions
Not applicable — this is a static data definition, not a component with executable methods.

## Events & listeners
Not applicable — this file does not define event-driven logic.