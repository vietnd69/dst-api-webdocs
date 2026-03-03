---
id: maxwell
title: Maxwell
description: Registers four pre-defined map tasks for the Maxwell campaign (MaxPuzzle1–3 and MaxHome) with specific room constraints and visual settings.
tags: [map, level-design, campaign]
sidebar_position: 1

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: 2b10a086
system_scope: world
---

# Maxwell

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file defines and registers four map tasks using `AddTask` for the Maxwell campaign. Each task specifies allowed room types, lock and key requirements, background room, and background color used during world generation. It contributes to structuring the progression of the Maxwell campaign by associating specific dungeon layouts and visual themes with campaign stages.

## Usage example
This file does not expose a reusable component; it runs during worldgen initialization. Typical usage is handled internally by the game's map generation system:

```lua
-- Internally invoked at startup as part of map/tasks/index.lua
-- No direct modder interaction required.
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Uses `LOCKS.PIGKING`, `LOCKS.NONE`, `KEYS.WOOD`, `KEYS.NONE`, `WORLD_TILES.MARSH`, `WORLD_TILES.IMPASSABLE`, and `SIZE_VARIATION` (imported from elsewhere).

## Properties
No public properties. This script performs side-effect-only registrations during load.

## Main functions
### `AddTask(task_id, config)`
*   **Description:** Registers a new map task definition with the given `task_id` and configuration. This is a global helper exposed by the map system (not defined in this file), used to define which rooms may appear in a given campaign sequence and under what conditions.
*   **Parameters:**
    *   `task_id` (string) — unique identifier for the task (e.g., `"MaxPuzzle1"`).
    *   `config` (table) — configuration table containing:
        *   `locks` (optional, `LOCKS.*`) — lock type that must be unlocked to allow this task.
        *   `key_given` / `keys_given` (optional, `KEYS.*` or table) — key(s) granted upon completing the task.
        *   `room_choices` (table) — map of room prefab names to either static weights (number) or dynamic functions returning weights.
        *   `room_bg` (WORLD_TILES.*) — base tileset used for background generation.
        *   `background_room` (string) — name of the background room prefab.
        *   `colour` (table) — `{r,g,b,a}` table for background tinting.
*   **Returns:** Nothing (side-effect registration only).
*   **Error states:** None documented — invalid config values may be ignored or cause runtime generation errors.

## Events & listeners
None identified.