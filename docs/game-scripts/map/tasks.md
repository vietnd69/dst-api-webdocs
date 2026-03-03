---
id: tasks
title: Tasks
description: Manages the registration and retrieval of level generation tasks used to define world room layouts and progression constraints.
tags: [world, generation, progression, task]
sidebar_position: 100
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: d2e19b16
---
# Tasks

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This module provides a centralized registry and management system for level generation *tasks*. A task defines a set of criteria used during world generation, including required keys, lock states, allowed room types, and visual styling. It supports both base game tasks and mod-added tasks, with isolation of mod data per modname to prevent conflicts. This file serves as the entry point for registering new tasks and querying existing ones across the world generation pipeline.

## Usage example
```lua
-- Add a custom task in your mod's `modmain.lua`
local MyTaskData = {
    locks = LOCKS.NONE,
    keys_given = KEYS.PICKAXE,
    room_choices = {
        ["Forest"] = 2,
        ["Clearing"] = 1,
    },
    room_bg = WORLD_TILES.GRASS,
    background_room = "BGGrass",
    colour = { r = 0.5, g = 1.0, b = 0.5, a = 1.0 },
}

AddModTask("my_mod_name", "MY_CUSTOM_TASK", MyTaskData)

-- Query tasks from elsewhere in the codebase
local all_names = TheWorld.map.tasks.GetAllTaskNames()
local task = TheWorld.map.tasks.GetTaskByName("MY_CUSTOM_TASK")
```

## Dependencies & tags
**Components used:** None. This is a pure data module without component instantiation or entity interaction.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SIZE_VARIATION` | `number` | `3` | Global constant used for size scaling in room generation; defined at module level but not directly used within this file. |

## Main functions
### `AddTask(name, data)`
* **Description:** Registers a new base game task. Fails with an assertion error if a task with the given `name` already exists. Used exclusively for core game tasks during initial load.
* **Parameters:**
  - `name` (`string`): Unique identifier for the task.
  - `data` (`table`): Task configuration passed to the `Task()` constructor (`map/task.lua`), typically including `locks`, `keys_given`, `room_choices`, `room_bg`, `background_room`, and `colour`.
* **Returns:** None (void).
* **Error states:** Throws an assertion error if `name` is already registered.

### `AddModTask(mod, name, data)`
* **Description:** Registers a new mod-defined task, isolated under the calling mod's name. Prevents name collisions with base game or other mod tasks.
* **Parameters:**
  - `mod` (`string`): Mod name used as a namespace key in `modtaskdefinitions`.
  - `name` (`string`): Unique identifier for the task within the mod's namespace.
  - `data` (`table`): Task configuration passed to the `Task()` constructor.
* **Returns:** None (void).
* **Error states:** Logs a `moderror` and returns early if `name` already exists (in either base or mod tasks).

### `GetAllTaskNames()`
* **Description:** Returns a flat list of all registered task names, including base and mod-defined tasks.
* **Parameters:** None.
* **Returns:** `table` of `string`s, each a unique task identifier.
* **Error states:** None.

### `GetTaskByName(name)`
* **Description:** Retrieves the task definition (a `Task` object from `map/task.lua`) by its name across all registered sources.
* **Parameters:**
  - `name` (`string`): Task identifier to search for.
* **Returns:** `table` (the `Task` object) or `nil` if no task with that name exists.
* **Error states:** Returns `nil` if the task is not found.

### `ClearModData(mod)`
* **Description:** Removes all tasks registered under a specific mod name, or clears all mod tasks if `mod` is `nil`. Used for mod reloads or cleanups.
* **Parameters:**
  - `mod` (`string?`): Mod name to clear. If `nil`, clears all mod tasks.
* **Returns:** None (void).
* **Error states:** None.

## Events & listeners
None. This module is data-only and does not register or fire events.

