---
id: mud
title: Mud
description: Defines cave environment room templates containing mud terrain tiles and procedurally placed flora, wildlife, and structures.
tags: [world, cave, terrain, room]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: d996a1f0
---

# Mud

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines a set of reusable cave room templates for the game's world generation system. It specifies different environmental variants of mud terrain (`WORLD_TILES.MUD`) using the `AddRoom` function and configuration tables. Each room describes visual appearance, tile type, tags, and contents (prefabs with spawn weights). These templates are used by the worldgen system to populate cave layouts with thematic cave floor sections, including variations focused on light plants, worm lights, ferns, slurtles, rabbit ruins, or mixed natural features.

## Usage example
This file is not used directly as a component; it registers room templates for use in world generation tasksets. Typical usage occurs when a world generation taskset references these room names, for example:

```lua
-- In a taskset definition (e.g., map/tasksets/caves.lua)
my_taskset:AddRoom("LightPlantField")
my_taskset:AddRoom("SlurtlePlains")
my_taskset:AddRoom("BGMudRoom")
```

## Dependencies & tags
**Components used:** None (pure data definition for world generation; does not use or define ECS components).
**Tags:** All room definitions include the tag `Hutch_Fishbowl`. This tag is applied to each room configuration via `tags = {"Hutch_Fishbowl"}`.

## Properties
Not applicable. This file defines only static room configurations and does not declare any entity-owned component properties.

## Main functions
### `AddRoom(name, room_config)`
* **Description:** Registers a named room template with the world generation system using the provided configuration. Used to define reusable cave or surface room layouts.
* **Parameters:**
  * `name` (string): Unique identifier for the room (e.g., `"LightPlantField"`).
  * `room_config` (table): Configuration table containing:
    * `colour` (table): RGBA values for rendering.
    * `value` (number): Tile constant (e.g., `WORLD_TILES.MUD`).
    * `tags` (table): List of room tags (e.g., `{"Hutch_Fishbowl"}`).
    * `contents`: Table specifying how prefabs are placed inside the room, via either `countprefabs`, `distributeprefabs`, `countstaticlayouts`, or `distributepercent`.
* **Returns:** None. Registers the room internally for use by the worldgen system.
* **Error states:** May fail silently or cause generation errors if `room_config` is malformed or `name` is a duplicate.

### `Roomify(room_config)`
* **Description:** Wraps a raw room configuration table into a standardized room definition suitable for use with `AddRoom`, typically adding default room properties if missing. Used to ensure consistent formatting for programmatically defined rooms.
* **Parameters:**
  * `room_config` (table): Raw room configuration table (same structure as used in `AddRoom`).
* **Returns:** (table) A fully formed room definition table ready for registration.
* **Error states:** May fail if `room_config` is `nil` or missing required fields (e.g., `value`, `contents`).

## Events & listeners
Not applicable. This file contains no runtime event handling.