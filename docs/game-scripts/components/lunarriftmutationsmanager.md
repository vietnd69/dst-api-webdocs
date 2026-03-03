---
id: lunarriftmutationsmanager
title: Lunarriftmutationsmanager
description: Manages thequest progression and defeated mutation tracking for lunar rift boss encounters, including Wagstaff NPC appearances and reward logic.
tags: [boss, quest, world, combat]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 54b2a794
system_scope: world
---

# Lunarriftmutationsmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`LunarRiftMutationsManager` tracks the defeat of specific lunar rift mutated creatures (`mutatedwarg`, `mutatedbearger`, `mutateddeerclops`) and orchestrates related quest logic. It handles Wagstaff NPC appearances after defeating mutations, reward conditions, and persistence across saves. This component exists only on the server (`TheWorld.ismastersim`) and resides on the `TheWorld` entity. It collaborates closely with `wagboss_tracker` and `health` components.

## Usage example
```lua
-- The component is automatically added to TheWorld and should not be manually instantiated.
-- Typical interaction from mod code:
if TheWorld.components.lunarriftmutationsmanager then
    TheWorld.components.lunarriftmutationsmanager:OnRewardGiven()
end
```

## Dependencies & tags
**Components used:** `health`, `wagboss_tracker`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `task_completed` | boolean | `false` | Whether the final reward for completing the mutation quest has been given. |
| `_MUTATIONS_NAMES` | table | `{ "mutatedwarg", "mutatedbearger", "mutateddeerclops" }` | Copy of the mutation prefab names (for mods). |
| `_MUTATIONS` | table | inverted `MUTATIONS_NAMES` | Mapping from prefab name to 1-based index. |
| `wagstaff` | Entity or `nil` | `nil` | Reference to the currently spawned Wagstaff NPC. |
| `defeated_mutations` | table | `{}` | List of indices (1-based) corresponding to defeated mutations. |
| `num_mutations` | number | `3` | Total number of tracked mutations (size of `MUTATIONS_NAMES`). |

## Main functions
### `RefreshDefeatedMutationsTable()`
* **Description:** Resets internal state by clearing defeated mutations and Wagstaff reference, and reinitializes `num_mutations`.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsWagstaffSpawned()`
* **Description:** Checks if a Wagstaff NPC is currently spawned and valid (not eroding out).
* **Parameters:** None.
* **Returns:** `true` if `wagstaff` is valid and not eroding, otherwise `false`.

### `GetNumDefeatedMutations()`
* **Description:** Returns the number of mutations recorded as defeated.
* **Parameters:** None.
* **Returns:** Number of defeated mutations (length of `defeated_mutations`).

### `HasDefeatedAllMutations()`
* **Description:** Returns whether all tracked mutations have been defeated.
* **Parameters:** None.
* **Returns:** `true` if `GetNumDefeatedMutations()` ≥ `num_mutations`, otherwise `false`.

### `HasDefeatedThisMutation(prefab)`
* **Description:** Checks if the specified mutation prefab has been defeated.
* **Parameters:** `prefab` (string) — prefab name (e.g., `"mutatedwarg"`).
* **Returns:** `true` if the prefab is recognized and recorded as defeated; otherwise `false`.
* **Error states:** Returns `false` if `prefab` is not in `MUTATIONS_NAMES`.

### `SetMutationDefeated(ent)`
* **Description:** Records a defeated mutation and triggers appropriate behavior: spawns Wagstaff (if Wagboss is not yet defeated), sets extended destroy time on the corpse, or awards the reward if quest is complete.
* **Parameters:** `ent` (Entity) — the defeated mutation entity.
* **Returns:** Nothing.
* **Error states:** No effect if the mutation is already recorded or not in the tracked list.

### `TriggerWagstaffAppearance(ent)`
* **Description:** Spawns a `wagstaff_npc_mutations` NPC near the defeated mutation's position and makes Wagstaff comment on the encounter.
* **Parameters:** `ent` (Entity) — the defeated mutation entity (used for positioning and facing).
* **Returns:** Nothing.

### `ShouldGiveReward()`
* **Description:** Determines whether the quest reward should be given (either task is completed or all mutations defeated).
* **Parameters:** None.
* **Returns:** `true` if `task_completed` is `true` or `HasDefeatedAllMutations()` is `true`; otherwise `false`.

### `IsTaskCompleted()`
* **Description:** Returns whether the final reward has been awarded.
* **Parameters:** None.
* **Returns:** `true` if `task_completed` is `true`; otherwise `false`.

### `OnRewardGiven()`
* **Description:** Marks the task as completed and fires the `ms_lunarriftmutationsmanager_taskcompleted` event. Resets defeated mutations table if all mutations were defeated.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes component state for world save.
* **Parameters:** None.
* **Returns:** Table with `defeated_mutations` (array of indices) and `task_completed` (boolean), or `nil` if empty.

### `OnLoad(data)`
* **Description:** Restores component state from world save data.
* **Parameters:** `data` (table or `nil`) — serialized state from `OnSave()`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted debug string for inspecting the manager’s current state.
* **Parameters:** None.
* **Returns:** String in format: `"Mutations Defeated: X/Y [ list ]  ||  Task Completed: YES/NO"`.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** `ms_lunarriftmutationsmanager_taskcompleted` — fired when `OnRewardGiven()` is called.
