---
id: dead_sea_bones
title: Dead Sea Bones
description: A destructible environment object that yields bone shards and triggers visual collapse effects when hammered.
tags: [environment, destruction, loot]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 39635572
system_scope: environment
---

# Dead Sea Bones

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`dead_sea_bones` is a static environmental prefab representing skeletal remains found in the Dead Sea region. It functions as a workable object that players can destroy using a hammer. Upon successful completion, it drops randomized bone shard loot and spawns a small collapse FX prefab before self-removing. It integrates with the `lootdropper` and `workable` components, and supports save/load persistence and hauntable behavior.

## Usage example
This prefab is typically instantiated via the Prefab system and does not require manual component setup by modders. However, to replicate its behavior in a custom prefab:
```lua
local inst = CreateEntity()
inst:AddComponent("lootdropper")
inst.components.lootdropper:SetChanceLootTable("dead_sea_bones_loot")

inst:AddComponent("workable")
inst.components.workable:SetWorkAction(ACTIONS.HAMMER)
inst.components.workable:SetWorkLeft(TUNING.DEAD_SEA_BONES_HAMMERS)
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `inspectable`
**Tags:** None identified (no tags are added, removed, or checked directly by this prefab's code).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animnum` | number | `1`, `2`, or `3` (random) | Identifier for bone set variant; determines which idle/mine animation sequence is used. |

## Main functions
### `on_hammer(inst, worker, workleft, numworks)`
*   **Description:** Handles the hammering interaction animation. Plays a mine animation sequence followed by an idle animation if work remains.
*   **Parameters:** 
    * `inst` (Entity) - The bone entity being hammered.
    * `worker` (Entity) - The entity performing the hammering.
    * `workleft` (number) - Remaining work units needed to finish.
    * `numworks` (number) - Number of work units just performed.
*   **Returns:** Nothing.
*   **Error states:** Only plays animations if `workleft > 0`.

### `on_hammering_finished(inst)`
*   **Description:** Triggered upon successful hammer completion. Drops loot, spawns collapse FX, and removes the entity.
*   **Parameters:** `inst` (Entity) - The bone entity being destroyed.
*   **Returns:** Nothing.

### `set_bones_type(inst, animnum)`
*   **Description:** Initializes or reassigns the bone variant animation based on `animnum`. If `animnum` is `nil`, picks a random variant (`1`, `2`, or `3`) and plays the corresponding idle animation.
*   **Parameters:** 
    * `inst` (Entity) - The bone entity.
    * `animnum` (number or nil) - Desired variant number.
*   **Returns:** Nothing.

### `on_save(inst, data)`
*   **Description:** Saves the current `animnum` variant to the save data table.
*   **Parameters:** 
    * `inst` (Entity) - The bone entity.
    * `data` (table) - Save data table.
*   **Returns:** Nothing.

### `on_load(inst, data)`
*   **Description:** Restores the bone variant from saved data; falls back to random selection if data is missing.
*   **Parameters:** 
    * `inst` (Entity) - The bone entity.
    * `data` (table or nil) - Loaded save data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** `on_save`/`OnSave`, `OnLoad` — through entity hooks for persistence.
