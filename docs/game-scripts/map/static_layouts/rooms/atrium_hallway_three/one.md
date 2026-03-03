---
id: one
title: One
description: Defines the static layout data for the Atrium Hallway Three room in the Don't Starve Together world generation system.
tags: [map, room, static_layout, worldgen]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 8f9ccf3f
system_scope: world
---

# One

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
This file (`one.lua`) is a static layout data module for the `atrium_hallway_three` room. It exports a table containing map configuration in the Tiled Map Editor format (TMX-like), describing the tile layer (`BG_TILES`) and object layer (`FG_OBJECTS`) used to render the room in-game. It does not implement a component class and contains no logic — it serves purely as static procedural generation metadata for the worldgen system.

## Usage example
This file is not directly instantiated or used by modders. It is consumed internally by the world generation pipeline (e.g., via `static_layouts.lua` and `room.lua` systems) when placing the `atrium_hallway_three` room during map generation.

```lua
-- Not applicable: this is a data file, not a component or script.
-- Modders would typically interact with the room via its prefab or room definition.
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
No public properties. The exported table is a static data structure containing map metadata.

## Main functions
None identified.

## Events & listeners
Not applicable.