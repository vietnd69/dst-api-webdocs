---
id: lunarriftmutationsmanager
title: Lunarriftmutationsmanager
description: Manages the progression and state tracking of defeated lunar rift mutations (Warg, Bearger, Deerclops) and controls Wagstaff's quest-related appearances and reward logic.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 54b2a794
---

# Lunarriftmutationsmanager

## Overview
This component tracks which lunar rift mutations (mutated warg, bearger, and deerclops) have been defeated by the player, manages the optional quest progression tied to these defeats (including Wagstaff's appearance and dialogue), and handles reward state for the associated questline. It exists only on the master simulation and is attached to the world entity, not individual players or entities.

## Dependencies & Tags
- **Requires**: `TheWorld.ismastersim` (asserted in constructor).
- **Interacts with**:
  - `TheWorld.components.wagboss_tracker` (checks Wagboss defeat status).
  - `ent.components.health.destroytime` (temporarily extended upon mutation defeat if Wagstaff not spawned).
- **No tags added or removed**.
- **No components explicitly added** to `inst`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the world entity the component is attached to. |
| `task_completed` | `boolean` | `false` | Indicates whether the full mutation quest reward has been given. |
| `_MUTATIONS_NAMES` | `table` (array) | `{"mutatedwarg", "mutatedbearger", "mutateddeerclops"}` | List of mutation prefab names (for mods compatibility). |
| `_MUTATIONS` | `table` (map) | inverted `_MUTATIONS_NAMES` | Maps prefab names to numeric indices (e.g., `"mutatedwarg" → 1`). |
| `defeated_mutations` | `table` (array) | `{}` | List of mutation *indices* (from `_MUTATIONS`) corresponding to defeated bosses. |
| `num_mutations` | `number` | `3` | Total number of tracked mutations (`#_MUTATIONS_NAMES`). |
| `wagstaff` | `Entity?` | `nil` | Reference to the currently spawned `wagstaff_npc_mutations` NPC. |

## Main Functions
### `RefreshDefeatedMutationsTable()`
* **Description:** Resets internal tracking: clears `defeated_mutations`, sets `wagstaff` to `nil`, and refreshes `num_mutations`.
* **Parameters:** None.

### `IsWagstaffSpawned()`
* **Description:** Returns `true` if `wagstaff` is non-`nil`, currently valid, and not in the process of eroding out (`erodingout` false).
* **Parameters:** None.

### `GetNumDefeatedMutations()`
* **Description:** Returns the count of defeated mutations (length of `defeated_mutations` array).
* **Parameters:** None.

### `HasDefeatedAllMutations()`
* **Description:** Returns `true` if the number of defeated mutations equals `num_mutations`.
* **Parameters:** None.

### `HasDefeatedThisMutation(prefab)`
* **Description:** Returns `true` if the given `prefab` name (e.g., `"mutatedwarg"`) corresponds to a defeated mutation.
* **Parameters:**  
  `prefab` (string) — The prefab name to check.

### `SetMutationDefeated(ent)`
* **Description:** Records a new defeat when a tracked mutation boss (`mutatedwarg`, `mutatedbearger`, or `mutateddeerclops`) dies. Triggers Wagstaff appearance or reward logic.
* **Parameters:**  
  `ent` (Entity) — The defeated mutation entity.

### `TriggerWagstaffAppearance(ent)`
* **Description:** Spawns `wagstaff_npc_mutations` near the defeated entity (`ent`) if not already spawned, faces him toward the corpse, and has him comment on the kill.
* **Parameters:**  
  `ent` (Entity) — The defeated mutation entity to reference in placement and dialogue.

### `ShouldGiveReward()`
* **Description:** Returns `true` if either the task is completed or all mutations have been defeated.
* **Parameters:** None.

### `OnRewardGiven()`
* **Description:** Marks the quest task as completed, broadcasts `"ms_lunarriftmutationsmanager_taskcompleted"` event, and resets `defeated_mutations` if all mutations were defeated.
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes `defeated_mutations` and `task_completed` state for networked or save-game persistence.
* **Parameters:** None.  
* **Returns:** `table?` — Non-`nil` only if data exists to save.

### `OnLoad(data)`
* **Description:** Restores saved state: `defeated_mutations` and `task_completed`, re-broadcasting `"ms_lunarriftmutationsmanager_taskcompleted"` if needed.
* **Parameters:**  
  `data` (table?) — Save data from `OnSave()`.

### `GetDebugString()`
* **Description:** Returns a formatted string for debug logs showing defeated mutation names, count, and task completion status.
* **Parameters:** None.  
* **Returns:** `string`

## Events & Listeners
- **Listens for**: None (explicit event listeners not found).
- **Triggers/Pushes**:
  - `"ms_lunarriftmutationsmanager_taskcompleted"` — Pushed on world when reward is given via `OnRewardGiven()` (either on first reward or task reset).