---
id: tasksets
title: Tasksets
description: Manages registration, retrieval, and listing of task group definitions for world generation across different game locations (forest, caves, lava arena, quagmire).
tags: [worldgen, map, tasks, frontend]
sidebar_position: 100

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 600f040f
---

# Tasksets

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `tasksets` module is a central registry for task group definitions used during world generation. It supports both base game and mod-provided task sets, enabling dynamic selection and loading of task configurations per world location. Task sets define sequences of map generation tasks (e.g., room placements, event triggers) and are referenced by the world generation system. This module does not attach to entities; it is a utility library providing global functions for task set management.

## Usage example

```lua
-- Register a new task set for the forest world
AddTaskSet("my_custom_forest_taskset", {
    name = "My Custom Forest",
    location = "forest",
    tasks = { "room1", "room2", "boss_room" }
})

-- Register a mod-provided task set (modded)
AddModTaskSet("my_mod_id", "cave_adventure", {
    name = "Cave Adventure",
    location = "caves",
    hideinfrontend = false,
    tasks = { "entry_tunnel", "chamber", "arena" }
})

-- Retrieve task data by ID
local taskdata = GetGenTasks("my_custom_forest_taskset")

-- Get all task sets available for the caves (used by frontend)
local available_lists = GetGenTaskLists("caves")
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
No public properties exist in the returned module table. Internally, the following tables are used:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `taskgrouplist` | `table` | `{}` | Global registry of base game task group definitions (ID → data). |
| `modtaskgrouplist` | `table` | `{}` | Nested registry of mod-provided task group definitions (mod → ID → data). |

## Main functions

### `AddTaskSet(id, data)`
* **Description:** Registers a base game (or mod-compatible) task group. If the `id` already exists in the base `taskgrouplist`, an assertion error is thrown. Used to define standard task sets (e.g., `forest`, `caves`) before mod overrides.
* **Parameters:**
  - `id` (`string`): Unique identifier for the task set (e.g., `"forest"`, `"quagmire"`).
  - `data` (`table`): Task group configuration table containing at least `name` and optional `location`, `hideinfrontend`, and `tasks`.
* **Returns:** `nil`
* **Error states:** Fails with an assertion error if `id` is already registered in `taskgrouplist`.

### `AddModTaskSet(mod, id, data)`
* **Description:** Registers a mod-specific task group under the given mod name. Prevents overwriting base or other modded task sets with the same `id`. Preferred for modded content.
* **Parameters:**
  - `mod` (`string`): The mod identifier (e.g., `"my_mod"`).
  - `id` (`string`): Unique task set ID within the mod’s namespace.
  - `data` (`table`): Task group configuration table.
* **Returns:** `nil`
* **Error states:** Logs a mod error and aborts registration if a task set with the same `id` already exists (in either base or other modded registries).

### `GetGenTasks(id)`
* **Description:** Retrieves the deepest (highest-priority) task set definition for a given `id`. Checks modded registries first (in arbitrary mod order), then falls back to base `taskgrouplist`.
* **Parameters:**
  - `id` (`string`): Task set identifier to retrieve.
* **Returns:** `table` (deep copy of task set data) or `nil` if not found.
* **Error states:** None — returns `nil` if no matching task set exists.

### `GetGenTaskLists(world)`
* **Description:** Returns a list of task set names and IDs available for a specific world location (`"forest"`, `"caves"`, `"lavaarena"`, `"quagmire"`), filtered by `location` and `hideinfrontend` flags. Used to populate frontend selection menus.
* **Parameters:**
  - `world` (`string?`): World type to filter by (e.g., `"caves"`). If `nil`, includes all task sets regardless of location.
* **Returns:** `table` of `{text = "Name", data = id}` entries for UI display.
* **Error states:** If no task sets match, defaults to the `"default"` task set (if available) for UI safety.

### `ClearModData(mod)`
* **Description:** Removes task set data for a specific mod. If `mod` is `nil`, clears all modded task set data entirely.
* **Parameters:**
  - `mod` (`string?`): Mod identifier to clear. If `nil`, clears all mod registries.
* **Returns:** `nil`

## Events & listeners
None. This module is a pure utility library and does not interact with the event system.