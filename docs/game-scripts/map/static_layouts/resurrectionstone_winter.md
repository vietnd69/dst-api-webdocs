---
id: resurrectionstone_winter
title: Resurrectionstone Winter
description: Defines the tilemap layout for the Resurrection Stone in the winter season, including background tiles and object placements (e.g., resurrection stone, pig heads, resource area).
tags: [map, static_layout, seasonal]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: ff0770db
system_scope: world
---

# Resurrectionstone Winter

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static map layout definition for the Resurrection Stone area in winter. It specifies tilemap data (8×8 grid, 16×16 px tiles) using TMX-style JSON format. The layout includes background tile layers (via GID `9`) and an object group (`FG_OBJECTS`) defining spawn points for entities such as `resurrectionstone`, `pighead`, and a `resource_area`. This file is used by the world generation system to place the area in the game world during winter seasons.

## Usage example
Static layouts like this are not instantiated directly by mod code. They are loaded automatically by DST's map generator when the corresponding world seed includes the `resurrectionstone_winter` layout. Example workflow:

```lua
-- Internally invoked during worldgen
local layout = require("map/static_layouts/resurrectionstone_winter")
-- Layout data is consumed by the map/rooms system to spawn prefabs at object positions
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file is a pure data definition (a Lua table returning static map metadata), not an ECS component.

## Main functions
This file exports only one value: the static layout table. It contains no executable functions.

## Events & listeners
Not applicable