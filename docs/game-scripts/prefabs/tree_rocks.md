---
id: tree_rocks
title: Tree Rocks
description: Defines the tree_rock prefab family, which functions as a growable tree that transforms into a mineable boulder upon being chopped or burnt.
tags: [prefab, resource, growable, loot]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: cfe59048
system_scope: entity
---

# Tree Rocks

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`tree_rocks.lua` registers a family of 7 spawnable prefabs representing rocky trees that can be chopped down or mined. The entity starts as a growable tree (`tree` tag) and transitions into a static boulder (`boulder` tag) when fully chopped or burnt. It features complex loot generation based on world topology (rooms, tasks, layouts) via `tree_rock_data.lua`, including special "vine loot" (gems) that are visually attached to the tree. The file uses a factory function `MakeRockTree` to generate variations (`tree_rock1`, `tree_rock2`, and their stage-specific variants).

## Usage example
```lua
-- Spawn a random tree rock at world origin:
local inst = SpawnPrefab("tree_rock")
inst.Transform:SetPosition(0, 0, 0)

-- Spawn a specific variant (e.g., rock1 at normal stage):
local inst2 = SpawnPrefab("tree_rock1_normal")

-- Access assets for preloading:
local assets = {
    Asset("ANIM", "anim/tree_rock_short.zip"),
    Asset("ANIM", "anim/tree_rock_normal.zip"),
    Asset("SOUND", "sound/rifts6.fsb"),
}
```

## Dependencies & tags
**External dependencies:**
- `prefabs/tree_rock_data` -- provides loot tables, growth stage data, and topology-based loot modifiers.

**Components used:**
- `lootdropper` -- manages resource drops (rocks, nitre, flint, gems) on chop/mine.
- `workable` -- handles chopping (tree state) and mining (boulder state).
- `growable` -- manages growth stages (short, normal).
- `plantregrowth` -- enables the tree to plant saplings nearby.
- `burnable` -- allows the tree to catch fire and transition to burnt state.
- `propagator` -- spreads fire to nearby entities.
- `inspectable` -- provides status text ("CHOPPED" when boulder).
- `inventory` -- GetEquippedItem() called in HasHardHat() to check for hard armor.

**Tags:**
- `tree` -- added in `fn()`; removed when chopped/burnt.
- `rock_tree` -- added in `fn()`; identifies entity type for regrowth.
- `shelter` -- added in `fn()`; provides shelter from rain.
- `nodangermusic` -- added in `fn()`; suppresses danger music.
- `burnt` -- added in `OnBurnt()`; indicates burnt state.
- `boulder` -- added in `MakeRock()`; indicates mined/chopped state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of `Asset(...)` entries for animations, sounds, and minimap icons. |
| `prefabs` | table | `{...}` | Array of dependent prefab names spawned as loot or FX (e.g., `rocks`, `rock_break_fx`). |
| `builds` | table | `{rock1, rock2}` | Configuration table defining animation banks, grow times, and damage values for the two rock tree variants. |
| `NUM_VINE_LOOT` | constant | `5` | Number of vine gem slots attached to the tree model. |
| `SWAY1_TIME` | constant | `15 * FRAMES` | Frame delay for first sway sound task. |
| `SWAY2_TIME` | constant | `45 * FRAMES` | Frame delay for second sway sound task. |
| `AOE_RANGE_PADDING` | constant | `3` | Padding added to drop damage range for entity search. |
| `AOE_TARGET_MUST_HAVE_TAGS` | table | `{ "_combat" }` | Tags required for entities to be affected by falling rock. |
| `AOE_TARGET_CANT_TAGS` | table | `{ "INLIMBO", "flight", "invisible", "notarget", "noattack" }` | Tags that exclude entities from falling rock damage. |
| `BOUNCE_FALL_DELAY` | constant | `11 * FRAMES` | Delay before OnRockFall is called after bounce animation. |
| `FALL_DELAY` | constant | `4 * FRAMES` | Delay before OnRockFall is called after miss animation. |
| `LEIF_TAGS` | table | `{ "leif" }` | Tags used to find nearby Leif entities when tree is chopped; triggers wakeup and target suggestion.

## Main functions
### `MakeRockTree(name, build, stage)` (local)
*   **Description:** Factory function that constructs and returns a `Prefab` object. Configures the prefab name, animation build, and initial growth stage. Called at the bottom of the file to register 7 distinct prefabs.
*   **Parameters:**
    - `name` -- string prefab name (e.g., `"tree_rock1"`)
    - `build` -- string key into `builds` table (`"rock1"` or `"rock2"`)
    - `stage` -- integer initial growth stage (1=short, 2=normal). Random if nil.
*   **Returns:** `Prefab` object
*   **Error states:** None.

### `OnChop(inst, chopper, chopsleft, numchops)` (local)
*   **Description:** Callback for `workable` component while tree is being chopped. Plays chop animation/sound, spawns chop FX, and wakes nearby Leifs. Suggests the chopper as a combat target to woken Leifs.
*   **Parameters:**
    - `inst` -- tree rock entity
    - `chopper` -- entity performing the chop
    - `chopsleft` -- remaining work
    - `numchops` -- total work
*   **Returns:** None
*   **Error states:** Errors if entity found by LEIF_TAGS search lacks `combat` component (no nil guard before `v.components.combat` access).

### `OnChopDown(inst, chopper)` (local)
*   **Description:** Callback for `workable` component when chopping is finished. Triggers falling animation, spawns loot (including vine loot), and converts the tree to a boulder via `MakeRock()`.
*   **Parameters:**
    - `inst` -- tree rock entity
    - `chopper` -- entity that finished chopping
*   **Returns:** None
*   **Error states:** None.

### `OnMine(inst, miner, minesleft, nummines)` (local)
*   **Description:** Callback for `workable` component when in boulder state. Plays mining animation. If `minesleft <= 0`, spawns break FX, drops loot, and removes the entity. May spook the miner if they have the `spooked` component and animation is not `burnt_full_normal` or `fall_full_normal`.
*   **Parameters:**
    - `inst` -- tree rock entity
    - `miner` -- entity performing the mine
    - `minesleft` -- remaining work
    - `nummines` -- total work
*   **Returns:** None
*   **Error states:** Errors if `inst.components.lootdropper` is nil (no nil guard before `DropLoot` call).

### `OnBurnt(inst, immediate)` (local)
*   **Description:** Callback for `burnable` component. Adds `burnt` tag. If `immediate` (e.g., loaded from save), converts to boulder instantly. Otherwise, plays falling animation and schedules conversion via `MakeRock()`.
*   **Parameters:**
    - `inst` -- tree rock entity
    - `immediate` -- boolean forcing instant conversion
*   **Returns:** None
*   **Error states:** Errors if `inst.components.workable` is nil (no nil guard before `workleft` access).

### `OnRockFall(inst)` (local)
*   **Description:** Called after falling animation completes. If current animation is a miss or bounce variant (`fall_miss`, `fall_miss_burnt`, `fall_bounce`, `fall_bounce_burnt`), triggers camera shake and deals AOE damage to entities within `drop_damage_range`, applying knockback. Changes physics to obstacle.
*   **Parameters:** `inst` -- tree rock entity
*   **Returns:** None
*   **Error states:** Errors if affected entity lacks `combat` component (no nil guard before `v.components.combat` access).

### `OnAnimOver(inst)` (local)
*   **Description:** Listener for `animover` event during falling sequence. Determines if the rock should break (if `tree_rock_breaker` below), bounce (if `tree_rock_bouncer` or hard hat below), or continue falling. Spawns loot if breaking.
*   **Parameters:** `inst` -- tree rock entity
*   **Returns:** None
*   **Error states:** Errors if `inst.components.lootdropper` is nil (no nil guard before component access).

### `OnSave(inst, data)`
*   **Description:** Serializes entity state for world save. Records `burnt`, `boulder`, and `vine_loot` status.
*   **Parameters:**
    - `inst` -- entity instance
    - `data` -- table to populate
*   **Returns:** None (modifies `data` table)
*   **Error states:** None.

### `OnLoad(inst, data)`
*   **Description:** Restores entity state from world save. Re-applies burnt/boulder state and vine loot configuration.
*   **Parameters:**
    - `inst` -- entity instance
    - `data` -- saved data table
*   **Returns:** None
*   **Error states:** None

### `GetStatus(inst)`
*   **Description:** Callback for `inspectable` component. Returns status text based on entity state.
*   **Parameters:** `inst` -- tree rock entity
*   **Returns:** `"CHOPPED"` if `boulder` tag is present, `nil` otherwise
*   **Error states:** None

### `handler_growfromseed(inst)`
*   **Description:** Assigned to `inst.growfromseed`. Called during regrowth from seed to set initial growth stage and play animation.
*   **Parameters:** `inst` -- tree rock entity
*   **Returns:** None
*   **Error states:** Errors if `inst.components.growable` is nil (no nil guard present).

### `ResetSwaySoundTasks(inst)` (local)
*   **Description:** Manages sway sound timing tasks. Cancels existing tasks and schedules new `PlaySwaySound` callbacks if current animation is sway1.
*   **Parameters:** `inst` -- tree rock entity
*   **Returns:** None
*   **Error states:** None

### `PlaySwaySound(inst)` (local)
*   **Description:** Task callback that plays sway sound if current animation matches sway1.
*   **Parameters:** `inst` -- tree rock entity
*   **Returns:** None
*   **Error states:** None

### `WakeUpLeif(ent)` (local)
*   **Description:** Wakes a sleeping Leif entity. Called via `DoTaskInTime` when tree is chopped to alert nearby Leifs.
*   **Parameters:** `ent` -- Leif entity
*   **Returns:** None
*   **Error states:** Errors if `ent.components.sleeper` is nil (no nil guard before `WakeUp` call).

### `SetupVineLoot(inst, loots)` (local)
*   **Description:** Assigns gem loot to the 5 vine slots on the tree model. Overrides animation symbols to display the gems. Called during construction and load.
*   **Parameters:**
    - `inst` -- tree rock entity
    - `loots` -- array of loot prefab names (optional, generated if nil)
*   **Returns:** None
*   **Error states:** None.

### `GetLootWeightedTable(inst)` (local)
*   **Description:** Calculates the loot table for this specific tree based on its world topology (room, task, or static layout ID). Merges in extra loot modifiers if tests pass.
*   **Parameters:** `inst` -- tree rock entity
*   **Returns:** table of weighted loot choices
*   **Error states:** None.

## Events & listeners
- **Listens to:** `animover` -- triggers `OnAnimOver` to handle falling physics and break/bounce logic.
- **Pushes:** `knockback` -- fired by `OnRockFall` on entities hit by falling rock. Data: `{ knocker, radius, strengthmult, forcelanded }`.
- **Pushes:** `broke_tree_rock` -- fired by `OnAnimOver` if rock breaks on an entity. Data: `{ tree_rock = inst }`.
- **World state watchers:** None identified.