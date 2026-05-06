---
id: shadow_heart_vein
title: Shadow Heart Vein
description: Harvestable shadow biome resource prefab that drops weighted loot based on map topology when chopped down, with visual variation and gem symbol overrides.
tags: [prefab, resource, harvestable, shadow]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: f72873a9
system_scope: entity
---

# Shadow Heart Vein

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`shadow_heart_vein.lua` registers a harvestable resource entity found in shadow biome areas. The prefab uses the `workable` component to accept chop actions, with loot determined by map topology (task, room, or static layout ID) via `tree_rock_data.lua` lookup tables. Visual variation (3 variants) and gem symbol overrides are applied based on the rolled loot type. The entity schedules itself for deletion after being fully chopped down.

## Usage example
```lua
-- Spawn at world origin:
local inst = SpawnPrefab("shadow_heart_vein")
inst.Transform:SetPosition(0, 0, 0)

-- Loot determination happens internally during entity initialization on master.
```

## Dependencies & tags
**External dependencies:**
- `prefabs/tree_rock_data` -- provides weighted loot tables, topology-to-loot key mappings, and extra loot modifiers

**Components used:**
- `inspectable` -- allows players to inspect the entity
- `lootdropper` -- spawns loot prefab at drop position when chopped down
- `workable` -- handles chop actions, work left counter, and work callbacks

**Tags:**
- `shadow_heart_vein` -- added in fn() for entity identification

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `NUM_VARIATIONS` | constant (local) | `3` | Number of visual animation variants (grow_1/2/3, idle_1/2/3, chop_1/2/3, fall_1/2/3). |
| `assets` | table | --- | Array of Asset entries for SCRIPT (tree_rock_data) and ANIM (shadow_heart_vein.zip). |
| `prefabs` | table | `{...}` | Array of potential loot prefab names: rocks, nitre, flint, goldnugget, moonrocknugget, moonglass. |
| `TUNING.SKILLS.WX78.SHADOWHEART_WORK_NEEDED` | constant | --- | Number of chop actions required to fully harvest the vein. Set on workable component. |
| `inst.vine_loot` | table | `nil` | Cached loot result from GetVineLoots. Persists across saves. Determines dropped item and gem symbol. |
| `inst.variation` | number | `nil` | Visual variant index (1-3). Determines which animation set is used. Persists across saves. |
| `inst.ScheduleForDelete` | function | --- | Assigned in fn(). Marks entity for removal after chop completion or on sleep. |
| `inst.OnSave` | function | --- | Assigned in fn(). Saves vine_loot and variation to persist across world saves. |
| `inst.OnLoad` | function | --- | Assigned in fn(). Restores vine_loot and variation, or initializes if no save data. |

## Main functions

### `fn()`
* **Description:** Prefab constructor that runs on both client and master. Entity setup (Transform, AnimState, SoundEmitter, Network) runs on all hosts. Gameplay components (inspectable, lootdropper, workable) and loot setup only run on master, guarded by TheWorld.ismastersim.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host. Master-only logic guarded by `TheWorld.ismastersim`.

### `GetLootKey(id)` (local)
* **Description:** Converts a topology ID to a loot key by checking static layouts, rooms, and tasks in priority order. Falls back to `CheckModifyLootArea` for area-based modifications. Returns `nil` if no matching key found.
* **Parameters:** `id` -- topology ID from ConvertTopologyIdToData
* **Returns:** loot key string or `nil`
* **Error states:** None — handles nil gen_data gracefully.

### `CountWeightedTotal(choices)` (local)
* **Description:** Sums all weight values in a weighted choices table. Used to normalize random selection in GetLootWeightedTable.
* **Parameters:** `choices` -- table of `{id = weight, ...}`
* **Returns:** total weight number
* **Error states:** None — iterates safely over pairs.

### `GetLootWeightedTable(inst)` (local)
* **Description:** Determines the weighted loot table based on entity position. Queries TheWorld.Map for topology ID at entity position, resolves to loot key, then merges in any EXTRA_LOOT_MODIFIERS that pass their test_fn. Falls back to WEIGHTED_VINE_LOOT.DEFAULT if no topology match.
* **Parameters:** `inst` -- entity instance
* **Returns:** weighted loot table or DEFAULT table
* **Error states:** None — handles nil id and nil loot_key gracefully.

### `GetVineLoots(inst)` (local)
* **Description:** Selects one random loot entry from the weighted table using weighted_random_choices. Called once per entity to determine drop.
* **Parameters:** `inst` -- entity instance
* **Returns:** table with single loot prefab name (e.g., `{"goldnugget"}`)
* **Error states:** None — weighted_random_choices handles empty tables internally.

### `SetupVineLoot(inst, loots)` (local)
* **Description:** Configures the entity's loot and visual gem symbol. If loot is "EMPTY", hides the swap_gem symbol. Otherwise, overrides swap_gem with the build and symbol from VINE_LOOT_DATA. Caches result in inst.vine_loot to prevent re-rolling. Called via DoTaskInTime(0) on master.
* **Parameters:**
  - `inst` -- entity instance
  - `loots` -- optional pre-rolled loot table (from save data)
* **Returns:** None
* **Error states:** Errors if VINE_LOOT_DATA[inst.vine_loot[1]] is nil for non-EMPTY loot (data integrity issue).

### `OnChopDown(inst, chopper)` (local)
* **Description:** Called when workable component reaches zero work left. Plays impact sound, spawns loot prefab at entity position (offset +1.2 Y), sets persists to false, plays fall animation, and listens for animover to remove entity.
* **Parameters:**
  - `inst` -- entity instance
  - `chopper` -- entity performing the chop
* **Returns:** None
* **Error states:** Errors if inst.components.lootdropper is nil (should not occur on master).

### `OnChop(inst, chopper, chopsleft, numchops)` (local)
* **Description:** Called on each chop action. Plays impact sound (unless chopper is player ghost), plays chop animation for current variation, then pushes idle animation loop.
* **Parameters:**
  - `inst` -- entity instance
  - `chopper` -- entity performing the chop
  - `chopsleft` -- remaining work before completion
  - `numchops` -- work done in this action
* **Returns:** None
* **Error states:** None — guards against playerghost chopper for sound.

### `SetVariation(inst, variation)` (local)
* **Description:** Sets the visual variant (1-3). If not variant 1, plays grow animation then pushes idle loop. Defaults to random variation if not specified. Called in fn() (non-populating) and OnLoad.
* **Parameters:**
  - `inst` -- entity instance
  - `variation` -- number 1-3, or nil for random
* **Returns:** None
* **Error states:** None — math.random handles nil safely.

### `ScheduleForDelete(inst)` (local)
* **Description:** Marks entity for removal. If already asleep, removes immediately. Otherwise, sets persists to false, plays fall animation, listens for animover to remove, and sets OnEntitySleep to Remove for cleanup if entity sleeps mid-fall. Assigned to inst.ScheduleForDelete in fn().
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None — guards against awake/asleep state.

### `OnSave(inst, data)` (local)
* **Description:** Saves vine_loot and variation to the data table for world persistence. Assigned to inst.OnSave in fn().
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- save data table
* **Returns:** None
* **Error states:** None — only writes if values exist.

### `OnLoad(inst, data)` (local)
* **Description:** Restores vine_loot and variation from save data. If no data exists, initializes variation randomly. Calls SetupVineLoot with saved loot. Assigned to inst.OnLoad in fn().
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- loaded save data table or nil
* **Returns:** None
* **Error states:** None — handles nil data gracefully.

## Events & listeners
- **Listens to:** `animover` -- triggers inst.Remove after fall animation completes (set in OnChopDown and ScheduleForDelete)
- **Pushes:** None identified