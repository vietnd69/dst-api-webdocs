---
id: level
title: Level
description: Manages level configuration including task selection, set piece assignment, and world generation overrides for map generation in Don't Starve Together.
tags: [map, level, task, worldgen, setpiece]
sidebar_position: 100

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 8a1dd037
---

# Level

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `Level` component encapsulates all data and logic for a single playable level in Don't Starve Together's world generation system. It defines how tasks (room layouts) and set pieces (fixed structures) are selected, configured, and applied during world generation. This class is instantiated once per level during worldgen and serves as the central authority for level-specific overrides, task substitutions, and mod integration hooks. It interacts with the `tasks` and `tasksets` modules to resolve task and task set definitions.

## Usage example
```lua
local Level = require("map/level")
local level_data = {
    id = "forest_cave",
    baseid = "forest_cave",
    name = "Forest Cave",
    desc = "A cave entrance near the forest",
    location = "forest_cave",
    hideinfrontend = false,
    hideminimap = false,
    overrides = {
        task_set = "forest_cave_taskset"
    },
    required_prefabs = { "cave_entrance" },
    required_setpieces = { "cave_entrance" },
    random_set_pieces = { "random_cave_1", "random_cave_2" },
    numrandom_set_pieces = 2
}

local level = Level(level_data)
level:ChooseTasks()
level:ChooseSetPieces()
local tasks = level:GetTasksForLevel()
```

## Dependencies & tags
**Components used:** None (this is a standalone data/configuration class, not attached to entities).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `id` | `string` | `nil` | Unique identifier for the level; asserted during construction. |
| `baseid` | `string` | Same as `id` | Base identifier used for world generation. |
| `name` | `string` | `""` | Human-readable name of the level. |
| `desc` | `string` | `""` | Human-readable description of the level. |
| `override_level_string` | `boolean` | `false` | If `true`, disables default localization fallbacks. |
| `location` | `string` | `nil` | Location identifier (e.g., `"forest_cave"`) used by worldgen; asserted. |
| `hideinfrontend` | `boolean` | `nil` | Whether the level is hidden in the frontend menu. |
| `overrides` | `table` | `{}` | Dictionary of overrides, especially `task_set`. |
| `substitutes` | `table` | `{}` | Task/resource substitution rules. |
| `set_pieces` | `table` | `nil` | Deprecated; assert prevents usage. |
| `numoptionaltasks` | `number` | `nil` | Deprecated; assert prevents usage. |
| `optionaltasks` | `table` | `nil` | Deprecated; assert prevents usage. |
| `valid_start_tasks` | `table` | `nil` | Deprecated; assert prevents usage. |
| `hideminimap` | `boolean` | `false` | Hides the level from minimap. |
| `min_playlist_position` | `number` | `0` | Minimum playlist slot position (unused). |
| `max_playlist_position` | `number` | `999` | Maximum playlist slot position (unused). |
| `ordered_story_setpieces` | `table` | `nil` | Deprecated ordered story set pieces (unused). |
| `required_prefabs` | `table` | `nil` | List of required prefabs for the level. |
| `background_node_range` | `table` | `nil` | Background node range configuration. |
| `blocker_blank_room_name` | `string` | `nil` | Name of the blank room used for blockers. |
| `required_setpieces` | `table` | `nil` | List of required set pieces. |
| `numrandom_set_pieces` | `number` | `0` | Number of random set pieces to assign. |
| `random_set_pieces` | `table` | `nil` | Pool of random set pieces to draw from. |
| `playstyle` | `string` | `nil` | Playstyle tag for level categorization. |
| `chosen_tasks` | `table` | `nil` | List of selected tasks after `ChooseTasks()` is called. |
| `version` | `number` | `1` | Version of the level definition. |

## Main functions
### `Level:ApplyModsToTasks(tasklist)`
* **Description:** Applies mod-defined post-initialization functions to each task in the provided task list, allowing mods to alter task definitions before use.
* **Parameters:**  
  - `tasklist`: `table` — List of task definitions to mod.
* **Returns:** `nil`
* **Error states:** None.

### `Level:GetOverridesForTasks(tasklist)`
* **Description:** Applies task substitution rules defined in `self.substitutes` to the task list. Each task is randomly checked against `perstory` and, if passed, has its corresponding task name replaced with the substitute name (based on `pertask` chance).
* **Parameters:**  
  - `tasklist`: `table` — List of task definitions to apply overrides to.
* **Returns:** `table` — The modified `tasklist` with substitution entries added (if any).
* **Error states:** None.

### `Level:GetTasksForLevel()`
* **Description:** Returns the list of chosen tasks after `ChooseTasks()` has been called.
* **Parameters:** None.
* **Returns:** `table` — The `self.chosen_tasks` list; `nil` if `ChooseTasks()` has not been called.
* **Error states:** Returns `nil` if called before `ChooseTasks()`.

### `Level:ChooseTasks()`
* **Description:** Selects and prepares tasks for this level by loading the task set defined in `overrides.task_set`, applying mod hooks, and processing optional and random tasks. Sets `self.chosen_tasks`.
* **Parameters:** None.
* **Returns:** `nil`
* **Error states:**  
  - Asserts if `overrides.task_set` is missing.  
  - Asserts if the resolved `task_set_data` is `nil` (e.g., if modded preset is used without mods enabled).

### `Level:GetTasksForLevelSetPieces()`
* **Description:** Filters `self.chosen_tasks` to exclude tasks marked with `level_set_piece_blocker`.
* **Parameters:** None.
* **Returns:** `table` — List of tasks suitable for random set piece assignment.
* **Error states:** None.

### `Level:ChooseSetPieces()`
* **Description:** Assigns required and random set pieces to tasks. If `required_setpieces` or `numrandom_set_pieces` are defined, set pieces are randomly assigned to non-blocker tasks. Also processes `set_pieces` entry to place set pieces on tasks matching `choicedata.tasks`.
* **Parameters:** None.
* **Returns:** `nil`
* **Error states:**  
  - Asserts if `ChooseTasks()` has not been called (`self.chosen_tasks == nil`).  
  - Asserts if no valid tasks exist for `set_pieces` choices.

### `Level:EnqueueATask(tasklist, taskname)`
* **Description:** Adds a deep copy of the named task to `tasklist` using `tasks.GetTaskByName`.
* **Parameters:**  
  - `tasklist`: `table` — Target list to append the task to.  
  - `taskname`: `string` — Name of the task to retrieve and copy.
* **Returns:** `nil`
* **Error states:** Asserts if `taskname` is not found.

### `Level:SetID(id)`
* **Description:** Sets the `id` and `worldgen_id` fields; used internally during construction.
* **Parameters:**  
  - `id`: `string` — Level identifier.
* **Returns:** `nil`
* **Error states:** Asserts if `id` is `nil`.

### `Level:SetBaseID(id)`
* **Description:** Sets the `baseid` and `worldgen_baseid` fields; used internally during construction.
* **Parameters:**  
  - `id`: `string` — Base level identifier.
* **Returns:** `nil`

### `Level:SetNameAndDesc(name, desc)`
* **Description:** Sets `name`, `desc`, `worldgen_name`, and `worldgen_desc`.
* **Parameters:**  
  - `name`: `string?` — Level name. May be `nil`.  
  - `desc`: `string?` — Level description. May be `nil`.
* **Returns:** `nil`

## Events & listeners
None.