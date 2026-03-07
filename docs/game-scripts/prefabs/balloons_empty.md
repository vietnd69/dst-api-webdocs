---
id: balloons_empty
title: Balloons Empty
description: A decayable container prefab that spawns mosquito sacks upon decay and water balloons when placed in inventories, with haunt mechanics that may spawn balloons.
tags: [decay, inventory, haunt, loot, world]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e9254641
system_scope: world
---

# Balloons Empty

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`balloons_empty` is a decayable inventory item prefab that serves as a source of mosquito sacks upon decomposition. It supports server-side persistence across world saves/restores via decay time tracking and interacts with inventory events to start/stop decay. It also enables haunting behavior (with a chance to spawn a `balloon`) and triggers a water balloon splash effect when placed into an inventory. The component references `moisture`, `hauntable`, `lootdropper`, and `balloonmaker` components but does not itself define any new component classes.

## Usage example
This prefab is typically instantiated by the game engine and does not require manual instantiation by modders. However, a modder might reference it as a loot source or customize its behavior via the `OnBuiltFn`, `OnSave`, and `OnLoad` callbacks.

```lua
-- Example: Trigger decay manually on an existing balloon pile
local pile = SpawnPrefab("balloons_empty")
if pile and TheWorld.ismastersim then
    pile.components.hauntable:SetHauntValue(50)
    pile.components.hauntable:SetOnHauntFn(function(inst)
        -- custom haunt logic
        return false
    end)
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `balloonmaker`, `hauntable`, `lootdropper` (added dynamically during `dodecay`), `moisture` (read-only during `onbuilt`).
**Tags:** Adds `cattoy` to the entity.

## Properties
No public properties are initialized directly in this file. Internal state is stored on the instance (`inst._decaytask`, `inst._decaystart`), but these are implementation details and not part of the public API.

## Main functions
### `dodecay(inst)`
*   **Description:** Destroys the `balloons_empty` entity and spawns two `mosquitosack` prefabs and a `small_puff` effect at its location.
*   **Parameters:** `inst` (Entity) - the entity to decay.
*   **Returns:** Nothing.
*   **Error states:** None. Always spawns loot and removes the instance.

### `startdecay(inst)`
*   **Description:** Schedules the `dodecay` function to run after `TUNING.BALLOON_PILE_DECAY_TIME` seconds, storing the task and start time on the instance.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.
*   **Error states:** If `inst._decaytask` already exists, no new task is scheduled.

### `stopdecay(inst)`
*   **Description:** Cancels any pending decay task and clears decay timing fields on the instance.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Serializes elapsed decay time into `data.decaytime` if decay has started.
*   **Parameters:** 
    - `inst` (Entity) - the entity being saved.
    - `data` (table) - save data table to mutate.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Resumes decay scheduling based on saved `decaytime`, adjusting the remaining delay appropriately.
*   **Parameters:** 
    - `inst` (Entity) - the entity being loaded.
    - `data` (table) - loaded save data.
*   **Returns:** Nothing.
*   **Error states:** Only acts if `inst._decaytask` exists, `data` is non-nil, and `data.decaytime` is present.

### `onbuilt(inst, builder)`
*   **Description:** Called when the item is placed in an inventory. Spawns a `waterballoon_splash` at the item's position and increases the builder's moisture level based on waterproofness.
*   **Parameters:** 
    - `inst` (Entity) - the `balloons_empty` entity.
    - `builder` (Entity) - the entity that built/placed this item.
*   **Returns:** Nothing.

### `OnHaunt(inst)`
*   **Description:** Haunt callback. With probability `TUNING.HAUNT_CHANCE_OFTEN`, spawns a `balloon` at the item's location and returns `true`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `true` if a balloon was spawned (triggering haunter effects); `false` otherwise.

## Events & listeners
- **Listens to:** 
  - `onputininventory` - calls `stopdecay` when the item is placed in an inventory.
  - `ondropped` - calls `startdecay` when the item is dropped from inventory.
- **Pushes:** None directly (events are handled via callbacks like `OnBuiltFn`, `OnSave`, and `OnLoad`).
