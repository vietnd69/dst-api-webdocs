---
id: ruins
title: Ruins
description: Defines task configurations for generating Ruins-level cave maps with progressively difficult room sets, lock requirements, and reward keys.
tags: [map, dungeon, level-gen]
sidebar_position: 1

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: 804fe027
system_scope: world
---

# Ruins

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `ruins.lua` file defines a series of map generation tasks for the Ruins cave layer in Don't Starve Together. Each task specifies which rooms can appear in the level, the lock and key requirements to unlock it, and visual properties such as background and tint colour. These tasks are added via `AddTask`, which integrates with the game’s world generation system to dynamically assemble cave levels by selecting and arranging pre-defined rooms.

## Usage example
This component is not instantiated as an entity component; it is executed at load time to register tasks with the world generation system.

```lua
-- Task registration happens automatically during worldgen initialization.
-- A modder may add a custom Ruins task like so:
AddTask("MyCustomRuins", {
    locks = {LOCKS.TIER3, LOCKS.RUINS},
    keys_given = {KEYS.TIER4, KEYS.RUINS},
    room_tags = {"Nightmare"},
    room_choices = {
        ["CustomRoom1"] = 2,
        ["PitRoom"] = 1,
    },
    room_bg = WORLD_TILES.TILES,
    background_room = "CustomRuinsBg",
    colour = {r = 0.5, g = 0.5, b = 0.0, a = 1},
})
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `"Nightmare"` tag to all generated rooms.

## Properties
No public properties. The file exclusively uses top-level `AddTask` calls.

## Main functions
### `AddTask(name, config)`
*   **Description:** Registers a new map generation task for Ruins levels. Each task defines a unique layout configuration used by the world generation system to assemble cave levels.
*   **Parameters:**
    *   `name` (string) – Unique identifier for the task (e.g., `"LichenLand"`, `"TheLabyrinth"`).
    *   `config` (table) – Configuration table with the following keys:
        *   `locks`: List of lock identifiers (e.g., `{LOCKS.TIER2, LOCKS.RUINS}`) that must be resolved to unlock this task.
        *   `keys_given`: List of keys (e.g., `{KEYS.TIER3, KEYS.RUINS}`) awarded upon completing the task.
        *   `room_tags`: List of tags assigned to each room in the generated level (e.g., `{"Nightmare"}`).
        *   `room_choices`: Table mapping room names to weights (number or function returning number).
        *   `room_bg`: Background tileset (e.g., `WORLD_TILES.MUD`).
        *   `background_room`: Name of the background room template used.
        *   `colour`: `{r, g, b, a}` tint applied to the level (RGB values are typically between `0.0` and `1.0`).
        *   Optional: `entrance_room`, `maze_tiles`, `required_prefabs`, `make_loop`, `cove_room_chance`, `cove_room_max_edges`.
*   **Returns:** Nothing.
*   **Error states:** Invalid configurations (e.g., missing required keys) may cause silent failures or invalid level generation, depending on how `AddTask` validates inputs.

## Events & listeners
None identified