---
id: hideout
title: Hideout
description: Manages an internal inventory of creatures, allowing an entity to store and release creature entities as needed—typically used for nest-like or lair-like behaviors.
tags: [creature, storage, ai, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 49ed7949
system_scope: world
---

# Hideout

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Hideout` is a component that acts as a creature storage container—granting an entity an "alternate home" to hold, store, and release other creatures. It supports spawning logic with configurable timing, saves/loads stored creatures across save/load cycles, and integrates with the brain system to Hibernate/Wake creatures when stored or released.

It interacts closely with the `brain` component (to manage sleep/wake states), `combat` (to assign targets upon release), and `health` (to prevent spawning when dead). It does not manage maximum capacity or tag filtering by default, as noted in comments.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("hideout")
inst.components.hideout:SetSpawnPeriod(25, 5)
inst.components.hideout:SetOccupiedFn(function(hideout, child) print("Hideout now occupied") end)
inst.components.hideout:SetGoHomeFn(function(hideout, child) print("Child returned to hideout") end)
inst.components.hideout:StartSpawning()
```

## Dependencies & tags
**Components used:** `brain`, `combat`, `health`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `storedcreatures` | table (map of entity → entity) | `{}` | Internal table storing currently stored creature entities. |
| `numstoredcreatures` | number | `0` | Count of currently stored creatures. |
| `onvacate` | function | `nil` | Callback triggered when the hideout becomes empty (after last creature is released). |
| `onoccupied` | function | `nil` | Callback triggered when the first creature enters the hideout. |
| `onspawned` | function | `nil` | Callback triggered after a creature is successfully released. |
| `ongohome` | function | `nil` | Callback triggered when a creature enters the hideout (goes "home"). |
| `timetonextspawn` | number | `0` | Time remaining until the next spawn attempt. |
| `spawnperiod` | number | `20` | Base interval (in seconds) between spawns. |
| `spawnvariance` | number | `2` | Random variance added to `spawnperiod`. |
| `spawnoffscreen` | boolean | `false` | If `true`, allows spawning even while the entity is offscreen/asleep. |
| `task` | Task | `nil` | Internal periodic task for spawning updates. |

## Main functions
### `SetSpawnPeriod(period, variance)`
* **Description:** Configures the base spawn interval and its variance. Spawns occur randomly within `period ± variance`.
* **Parameters:**  
  - `period` (number) – base time in seconds between spawn attempts.  
  - `variance` (number, optional) – maximum deviation; defaults to `10% of period` if omitted.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Updates the spawn timer and attempts to release a stored creature if conditions permit.
* **Parameters:** `dt` (number) – time elapsed since last frame.
* **Returns:** Nothing.

### `StartSpawning()`
* **Description:** Begins the spawn timer by resetting `timetonextspawn` to `0` and starting the periodic task.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopSpawning()`
* **Description:** Cancels the periodic task and sets `task` to `nil`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetOccupiedFn(fn)`
* **Description:** Sets the callback fired when the hideout transitions from empty to occupied.
* **Parameters:** `fn` (function) – callback with signature `fn(hideout_inst, child)`.
* **Returns:** Nothing.

### `SetSpawnedFn(fn)`
* **Description:** Sets the callback fired immediately after a creature is successfully released.
* **Parameters:** `fn` (function) – callback with signature `fn(hideout_inst, child)`.
* **Returns:** Nothing.

### `SetGoHomeFn(fn)`
* **Description:** Sets the callback fired when a creature enters the hideout.
* **Parameters:** `fn` (function) – callback with signature `fn(hideout_inst, count)`.  
  > Note: Parameter `count` is likely a bug—it should be `child`, but the code passes `count` which is undefined in scope.
* **Returns:** Nothing.

### `SetVacateFn(fn)`
* **Description:** Sets the callback fired when the hideout becomes empty (after releasing the last creature).
* **Parameters:** `fn` (function) – callback with signature `fn(hideout_inst)`.
* **Returns:** Nothing.

### `ReleaseChild(target, prefab, radius)`
* **Description:** Releases one randomly selected stored creature at a safe position near the hideout, optionally assigning it a combat target.
* **Parameters:**  
  - `target` (entity, optional) – combat target to assign via `combat:SetTarget`.  
  - `prefab` (string, unused) – legacy parameter; not used in implementation.  
  - `radius` (number, optional) – radius used to avoid obstacles during placement.
* **Returns:** `child` (entity or `nil`) – the released creature, or `nil` if release failed.
* **Error states:** Returns `nil` if no creatures are stored or if placement fails (e.g., no walkable space).

### `GoHome(child)`
* **Description:** Stores a creature in the hideout: removes it from the scene, hibernates its brain, silences sounds, and triggers callbacks.
* **Parameters:** `child` (entity) – creature to store.
* **Returns:** Nothing.
* **Error states:** Prints warning and returns early if the child is already stored.

### `CanRelease()`
* **Description:** Checks whether a creature may currently be released.
* **Parameters:** None.
* **Returns:** `boolean` – `true` if the hideout is non-empty, entity is valid, alive, and awake (or `spawnoffscreen` is `true`).
* **Error states:** Returns `false` if any condition fails. Note: `canrealeasefn` is misspelled (should be `canreleasefn`), but the code calls `self.canrealeasefn(...)`, so this function would silently do nothing if set.

### `ReleaseAllChildren(target, prefab)`
* **Description:** Releases all stored creatures sequentially until none remain.
* **Parameters:**  
  - `target` (entity, optional) – combat target for released creatures.  
  - `prefab` (string, unused) – ignored.
* **Returns:** Nothing.

### `DoReleaseChild(target, child, radius)`
* **Description:** Internal helper to place and activate a single child. Called by `ReleaseChild`.
* **Parameters:**  
  - `target` (entity, optional) – combat target.  
  - `child` (entity) – creature to release.  
  - `radius` (number, optional) – placement radius.
* **Returns:** `child` (entity) – the released creature.
* **Error states:** Returns `nil` if child is not stored or no valid offset is found.

### `LongUpdate(dt)`
* **Description:** Wrapper to forward `dt` to `OnUpdate` if the periodic task is active.
* **Parameters:** `dt` (number).
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging purposes, listing spawning status and stored creature prefabs.
* **Parameters:** None.
* **Returns:** `string` – debug info (e.g., `"Spawning :  Spawn in 3.45  Inside: beefalo, warg, and 2 more. "`).

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** None (no `inst:PushEvent` calls).

## Save/Load integration
- **`OnSave()`** returns `{ storedcreatures = {guids...}, spawning = boolean }` and a list of creature GUIDs for persistence.
- **`OnLoad(data, newents)`** resumes spawning if `data.spawning` is `true`.
- **`LoadPostPass(newents, data)`** retrieves stored creatures from `newents` and calls `GoHome` to re-store them post-load.
