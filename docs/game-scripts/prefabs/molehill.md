---
id: molehill
title: Molehill
description: A structure that spawns moles underground and drops loot when dug up.
tags: [environment, spawner, loot, structure]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7b75586a
system_scope: environment
---

# Molehill

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`molehill` is a static environmental structure that serves as both a visual marker for moles and a spawner for the `mole` prefab. When interacted with via the `DIG` action, it yields loot and removes itself. The molehill monitors cave day/night cycles to control mole spawning behavior: spawning resumes when the cave is occupied and reactivates during the night phase. It integrates with the spawner, lootdropper, inventory, workable, and hauntable systems.

## Usage example
```lua
local molehill = SpawnPrefab("molehill")
molehill.Transform:SetPosition(x, y, z)
if TheWorld.ismastersim then
    molehill.components.lootdropper:DropLoot(Vector3(x, y, z)) -- manually trigger loot drop
end
```

## Dependencies & tags
**Components used:** `lootdropper`, `inventory`, `spawner`, `workable`, `inspectable`, `hauntable`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `AdoptChild` | function or nil | `nil` | Callback assigned externally to claim and stop spawning for a specific mole. |

## Main functions
### `dig_up(inst)`
*   **Description:** Handles the completion of the `DIG` action on the molehill. Releases the contained mole, drops inventory and loot, and removes the entity.
*   **Parameters:** `inst` (entity) — the molehill instance.
*   **Returns:** Nothing.
*   **Error states:** Safe if `inst.components.spawner.child` is nil or invalid; no child is released but loot/inventory are still dropped.

### `startspawning(inst)`
*   **Description:** Resumes mole spawning by disabling queue mode and scheduling an immediate spawn if pending is false.
*   **Parameters:** `inst` (entity) — the molehill instance.
*   **Returns:** Nothing.

### `stopspawning(inst)`
*   **Description:** Pauses mole spawning by enabling queue mode with a random delay.
*   **Parameters:** `inst` (entity) — the molehill instance.
*   **Returns:** Nothing.

### `OnIsDay(inst, isday)`
*   **Description:** Callback triggered when the world's `iscaveday` state changes. If `isday` is false and a mole is currently occupying the hill, starts spawning again; otherwise, stops spawning.
*   **Parameters:**  
    * `inst` (entity) — the molehill instance.  
    * `isday` (boolean) — whether the cave is currently in day phase.
*   **Returns:** Nothing.

### `AdoptChild(inst, child)`
*   **Description:** External hook for a mole to claim the molehill. Cancels pending spawning, takes ownership, and stops further spawning.
*   **Parameters:**  
    * `inst` (entity) — the molehill instance.  
    * `child` (entity) — the mole claiming the hill.
*   **Returns:** Nothing.

### `OnHaunt(inst)`
*   **Description:** Haunt behavior that releases the mole when hauntable conditions are met (i.e., molehill is occupied).
*   **Parameters:** `inst` (entity) — the molehill instance.
*   **Returns:** The result of `ReleaseChild()` (boolean `true` on success), or `nil` if not occupied.

## Events & listeners
- **Listens to:** `WorldStateChange("iscaveday")` — handled via `inst:WatchWorldState("iscaveday", OnIsDay)`.
- **Pushes:** `molehill_dug_up` — pushed on the mole child when vacated (via `onvacatedig_up_vacate`).
- **Pushes:** `entity_droploot` — fired by `lootdropper:DropLoot()`.