---
id: friendlevels
title: Friendlevels
description: Manages friendship progression and reward distribution for friendly NPC entities based on completed tasks.
tags: [friendship, npc, rewards, progression]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 1c6de88c
system_scope: entity
---

# Friendlevels

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Friendlevels` implements a task-based progression system for entities (typically NPCs) to track friendship levels and distribute rewards. It maintains a list of friendly tasks, a level counter, reward definitions for specific levels, and a fallback default reward handler. When tasks are completed, the component advances the friendship level and queues rewards that are later distributed upon calling `DoRewards`. It also supports saving and loading of state across sessions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("friendlevels")

-- Configure level-specific and default rewards
inst.components.friendlevels:SetLevelRewards({
    function(inst, target, task) return {} end, -- Level 1
    function(inst, target, task) return {} end, -- Level 2
})
inst.components.friendlevels:SetDefaultRewards(function(inst, target, task) return {} end)

-- Define tasks
inst.components.friendlevels:SetFriendlyTasks({
    { name = "feed", complete = false, onetime = true },
    { name = "pet", complete = false, onetime = false },
})

-- Mark a task as complete
inst.components.friendlevels:CompleteTask("feed", some_doer)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to. |
| `friendlytasks` | table | `{}` | Map of task definitions; keys are task IDs, values are tables with `complete` and `onetime` booleans. |
| `annoytasks` | table | `{}` | Reserved for future use; currently unused. |
| `enabled` | boolean | `true` | Controls whether the component's functionality is active. |
| `level` | number | `0` | Current friendship level (0-based, incremented on successful level-up task completion). |
| `levelrewards` | table | `{}` | Array of reward generator functions indexed by level. Each function takes `(inst, target, task)` and returns a list of items. |
| `defaultrewards` | function or nil | `nil` | Fallback reward generator function used for tasks not tied to level progression. |
| `queuedrewards` | table | `{}` | List of reward objects (each with `level` and `task`) waiting to be processed by `DoRewards`. |
| `specifictaskreward` | table or nil | `nil` | List of prefab names to spawn directly as rewards (reset after use). |

## Main functions
### `GetDebugString()`
* **Description:** Returns a formatted string for debugging, showing the count of friendly tasks and current level.
* **Parameters:** None.
* **Returns:** `string` — A human-readable summary (e.g., `"number of tasks:2, level:1"`).

### `Enable(enabled)`
* **Description:** Enables or disables the component. When disabled, it also forces the entity into a neutral mood state by calling `SetIsInMood(false, false)`.
* **Parameters:** `enabled` (boolean) — whether to enable the component.
* **Returns:** Nothing.

### `SetDefaultRewards(fn)`
* **Description:** Sets the fallback reward generator used for tasks that do not correspond to a level-up event.
* **Parameters:** `fn` (function) — a reward generator taking `(inst, target, task)` and returning a list of items.
* **Returns:** Nothing.

### `SetLevelRewards(data)`
* **Description:** Configures the reward generators for each friendship level. The `data` table is an array where index corresponds to level (1-based).
* **Parameters:** `data` (table) — array of reward generator functions.
* **Returns:** Nothing.

### `SetFriendlyTasks(data)`
* **Description:** Replaces the current list of friendly tasks with new task definitions.
* **Parameters:** `data` (table) — table where keys are task IDs and values are tables with `complete` (boolean) and `onetime` (boolean) fields.
* **Returns:** Nothing.

### `DoRewards(target)`
* **Description:** Processes all queued rewards and returns a combined list of items to give. Handles both level-based rewards (via `levelrewards`) and default rewards (via `defaultrewards`). Also processes any `specifictaskreward` entries (prefab names to spawn), then clears that list and the reward queue.
* **Parameters:** `target` (Entity) — the entity receiving the rewards.
* **Returns:** `table` — a flat list of spawned item entities (or returned from reward functions).
* **Error states:** Returns an empty list if `queuedrewards` or `specifictaskreward` are empty.

### `CompleteTask(task, doer)`
* **Description:** Marks a task as complete and potentially advances the friendship level. Queues a reward if the task qualifies.
    * If the task belongs to `friendlytasks` and is incomplete, and the current level is below the number of configured rewards, it increments `level`, queues a level reward, and pushes `friend_level_changed`.
    * Otherwise, if a `defaultrewards` handler is set, it queues a default reward.
    * Finally, marks the task as `complete` (if not already).
* **Parameters:**  
  - `task` (string) — the task ID to complete.  
  - `doer` (Entity) — the entity performing the task (unused in logic but passed to reward generators).
* **Returns:** Nothing.
* **Event side effects:** Pushes `friend_level_changed` (on level-up) and `friend_task_complete` (always, with `defaulttask` boolean).

### `CompleteAllTasks(doer)`
* **Description:** Iterates over all tasks in `friendlytasks` and completes each one via `CompleteTask`.
* **Parameters:** `doer` (Entity) — the entity performing all tasks.
* **Returns:** Nothing.

### `GetLevel()`
* **Description:** Returns the current friendship level.
* **Parameters:** None.
* **Returns:** `number` — current level (0-based, incremented after each level-up task completion).

### `GetMaxLevel()`
* **Description:** Returns the maximum achievable friendship level (i.e., number of level reward entries).
* **Parameters:** None.
* **Returns:** `number` — count of entries in `levelrewards`.

### `OnSave()`
* **Description:** Serializes component state for saving. Includes `enabled`, `level`, completion status for each task, and `queuedrewards`.
* **Parameters:** None.
* **Returns:** `table` — save data object.

### `OnLoad(data)`
* **Description:** Restores component state from saved data. Marks completion of queued rewards and pushes `friend_task_complete` or `friend_level_changed` events if needed.
* **Parameters:** `data` (table) — saved state from `OnSave`.
* **Returns:** Nothing.

### `LoadPostPass(newents, data)`
* **Description:** Called after entity restoration to update `friendlytasks` completion status using saved data. Requires task indexing to be stable.
* **Parameters:**  
  - `newents` (table) — list of new entities (unused).  
  - `data` (table or nil) — contains `taskscomplete` array matching `friendlytasks` order.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.  
- **Pushes:**  
  - `friend_level_changed` — fired when level is incremented.  
  - `friend_task_complete` — fired when a task is marked complete; data passed includes a `defaulttask` boolean indicating whether default (non-level) rewards were queued.
