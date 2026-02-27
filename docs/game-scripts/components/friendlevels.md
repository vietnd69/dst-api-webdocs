---
id: friendlevels
title: Friendlevels
description: Manages friendship level progression, task completion, and reward distribution for entities engaged in friendly interactions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 1c6de88c
---

# Friendlevels

## Overview
This component implements a hierarchical friendship system that tracks task progress, level progression, and associated rewards. It is designed to be attached to entities (typically players or companions) that can form friendships through repeated positive interactions. As tasks are completed, the entity's friendship level increases, unlocking new tiers of rewards. The component supports both level-specific and default (unranked) task rewards, and persists state across saves.

## Dependencies & Tags
- Relies on global function `ConcatArrays` (used for merging reward arrays).
- Relies on `SpawnPrefab` (used for spawning specific reward prefabs).
- No explicit component dependencies or tags are added or removed by this component.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance the component is attached to. |
| `friendlytasks` | `table` | `{}` | A list or map of tasks available for friendship progression; contains task definitions and completion status. |
| `annoytasks` | `table` | `{}` | Reserved field (currently unused in the codebase). |
| `enabled` | `boolean` | `true` | Controls whether the component is active; disables rewards if set to `false`. |
| `level` | `number` | `0` | Current friendship level (0-indexed, max defined by `#levelrewards`). |
| `levelrewards` | `table` | `{}` | A table mapping level indices (1-based) to reward-generating functions `(inst, target, task) → array of rewards`. |
| `defaultrewards` | `function?` | `nil` | Optional reward function used for tasks outside of level-based progression. |
| `queuedrewards` | `table` | `{}` | A list of pending reward requests, each containing `{level = number?, task = string}`. |
| `specifictaskreward` | `table?` | `nil` | Temporary storage for reward prefabs to spawn; cleared after `DoRewards` processes them. |

## Main Functions

### `GetDebugString()`
* **Description:** Returns a formatted debug string summarizing current state: task count and level.
* **Parameters:** None.

### `Enable(enabled)`
* **Description:** Enables or disables reward granting; also triggers mood state removal via `SetIsInMood(false, false)`.
* **Parameters:**
  - `enabled` (boolean): Whether to enable the component.

### `SetDefaultRewards(fn)`
* **Description:** Assigns the fallback reward function used for tasks not tied to a specific level.
* **Parameters:**
  - `fn` (function): A callback `(inst, target, task) → array_of_rewards`.

### `SetLevelRewards(data)`
* **Description:** Sets the reward function table keyed by level (1-based index).
* **Parameters:**
  - `data` (table): Mapping from level index to reward function.

### `SetFriendlyTasks(data)`
* **Description:** Overwrites the internal list of friendly tasks.
* **Parameters:**
  - `data` (table): Task definitions; may contain per-task metadata and completion flags.

### `DoRewards(target)`
* **Description:** Executes queued rewards, supporting both level-specific and default reward functions. Also handles one-off prefab rewards stored in `specifictaskreward`. Returns a flattened list of spawned reward items.
* **Parameters:**
  - `target` (Entity): The entity receiving the rewards (typically the player interacting with this friend).

### `CompleteTask(task, doer)`
* **Description:** Marks a task as complete. If the current level has unreached tiers, advances the level and queues a level reward. Otherwise, queues a default reward if configured. Emits events upon level change or task completion.
* **Parameters:**
  - `task` (string): Identifier of the task to complete.
  - `doer` (Entity): The entity performing the task (unused internally but included for context).

### `CompleteAllTasks(doer)`
* **Description:** Marks all registered tasks as complete, invoking `CompleteTask` for each.
* **Parameters:**
  - `doer` (Entity): The entity performing all tasks.

### `GetLevel()`
* **Description:** Returns the current friendship level.
* **Parameters:** None.

### `GetMaxLevel()`
* **Description:** Returns the maximum possible level (i.e., number of defined levels).
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes key state fields for save data, including task completion status and queued rewards.
* **Parameters:** None.
* **Returns:** Table containing `enabled`, `level`, `taskscomplete`, and `queuedrewards`.

### `OnLoad(data)`
* **Description:** Restores state from save data; emits `friend_task_complete` or `friend_level_changed` events if needed to sync listeners.
* **Parameters:**
  - `data` (table): Deserialized save data with saved state.

### `LoadPostPass(newents, data)`
* **Description:** Post-load hook that restores task completion flags (e.g., `complete`) using deserialized `taskscomplete` data.
* **Parameters:**
  - `newents` (table): New entities list (unused).
  - `data` (table): Save data containing `taskscomplete`.

## Events & Listeners
- Listens for no events (`inst:ListenForEvent` is not used).
- Emits the following events:
  - `"friend_level_changed"` — whenever level is incremented (in `CompleteTask`).
  - `"friend_task_complete"` — whenever a task is marked complete (in `CompleteTask` and `OnLoad`).
  - `"friend_task_complete"` — also emitted in `OnLoad` if `queuedrewards` is non-empty.