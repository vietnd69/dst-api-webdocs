---
id: DLCtasks
title: Dlctasks
description: Registers the 'Oasis' custom task for the DST map system, defining its progression requirements and room placement rules.
tags: [map, task, progression]
sidebar_position: 1

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: map
source_hash: cad288f4
system_scope: map
---

# Dlctasks

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`DLCtasks.lua` defines a single map task named `"Oasis"` using the `AddTask` API. This task is part of the DST map generation system and specifies locking conditions, keys required to unlock it, and the set of candidate rooms that may be selected during world generation. The task uses existing task locks, keys, and world tile constants imported from core files.

## Usage example
```lua
-- This file is loaded automatically by the game; no manual instantiation.
-- It extends the global task registry via AddTask("Oasis", {
--     locks = {LOCKS.ADVANCED_COMBAT, ...},
--     keys_given = {KEYS.ROCKS, KEYS.TIER5},
--     room_choices = {...},
--     ...
-- })
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties — the file only invokes `AddTask` with a single configuration table.

## Main functions
This file does not define custom functions; it calls the global `AddTask` function.

### `AddTask(task_name, config)`
*   **Description:** Registers a new map task with the task generation system. This function is imported from `map/tasks/dst_tasks_forestworld` and used to define how and when a task appears during map generation.
*   **Parameters:**  
    `task_name` (string) — identifier for the task (e.g., `"Oasis"`).  
    `config` (table) — task configuration with the following fields:  
    - `locks` (array of `LOCK` constants) — locks that must be satisfied before the task becomes available.  
    - `keys_given` (array of `KEY` constants) — keys unlocked or granted upon completing the task.  
    - `room_choices` (table) — mapping of room prefabs to relative selection weights (e.g., `["Badlands"] = 3`).  
    - `room_bg` (WORLD_TILES constant) — base tile type used when placing rooms from this task.  
    - `background_room` (string) — name of the background room prefab used for visual rendering.  
    - `colour` (table) — RGBA table used for task indicator coloring (e.g., `{r=.05, g=.5, b=.05, a=1}`).  
*   **Returns:** Nothing.  

## Events & listeners
None identified