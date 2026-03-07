---
id: terrain_impassable
title: Terrain Impassable
description: Defines impassable room templates for the forest world map, including visual and gameplay properties for untraversable terrain.
tags: [map, terrain, room]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: f690fc88
---

# Terrain Impassable

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines three map room prefabs (`BGImpassable`, `BGImpassableRock`, and `Nothing`) used to render impassable terrain in the forest world. These rooms are not entities with components, but rather static map room definitions registered via `AddRoom`. They specify tile types, colours, and node type (all `NODE_TYPE.Blank`), indicating they serve as placeholders for visually or functionally impassable areas in world generation.

## Usage example
This file does not define a component and is not added to entities. Instead, the room templates it defines are referenced internally by the map/room system during world generation:

```lua
-- Example of how a room generator might reference one of these rooms
local room = GetRoom("BGImpassable")
-- room.value == WORLD_TILES.IMPASSABLE
-- room.colour == {r=0.6, g=0.35, b=0.8, a=0.5}
```

## Dependencies & tags
**Components used:** None — this is a plain data registration script.
**Tags:** None — no tags are added or modified.

## Properties
This file does not define a component class, so no component-level properties exist. It defines room definitions passed to `AddRoom`, which populate a global room registry.

## Main functions
### `AddRoom(name, room_def)`
* **Description:** Registers a new map room template with the given name and definition. Used here to define three impassable terrain room prefabs.
* **Parameters:**
  * `name` (string): The unique identifier for the room (e.g., `"BGImpassable"`).
  * `room_def` (table): A table describing the room's properties:
    * `colour` (table): RGBA colour used for rendering the room (e.g., `{r=0.6, g=0.35, b=0.8, a=0.5}`).
    * `value` (string): The tile identifier (e.g., `WORLD_TILES.IMPASSABLE`, `WORLD_TILES.ABYSS_NOISE`).
    * `type` (string): The node type, always `NODE_TYPE.Blank` here.
    * `contents` (table): A list of entities or sub-rooms to place inside (empty in all three cases).
* **Returns:** None — registration is side-effect only.
* **Error states:** Not applicable.

## Events & listeners
None — this file performs only static registration and does not listen to or dispatch events.