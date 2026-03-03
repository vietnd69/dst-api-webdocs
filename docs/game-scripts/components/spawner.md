---
id: spawner
title: Spawner
description: Manages a single persistent entity (e.g., a named NPC) by spawning, housing, and releasing it according to configured timing and occupancy rules.
tags: [spawn, entity, persistence, ai]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: af2df356
system_scope: entity
---

# Spawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Spawner` manages a single persistent entity instance (e.g., a specific named pigman with unique state) as opposed to `ChildSpawner`, which manages multiple transient, generic entities (e.g., spiders). It handles spawning the entity after a delay, tracking ownership, relocating it in/out of the spawner (home), and reacting to life-cycle events (death, detachment, etc.). It integrates closely with `health`, `burnable`, `locomotor`, `homeseeker`, and `knownlocations` components on the managed child entity.

## Usage example
```lua
local spawner = inst:AddComponent("spawner")
spawner:Configure("pigman", 10) -- spawn a pigman after 10 seconds
spawner:SetOnOccupiedFn(function(inst, child) print("Child inside") end)
spawner:SetOnVacateFn(function(inst, child) print("Child released") end)
spawner:SetOnSpawnedFn(function(inst, child) child.components.inventory:EquipItem("hat_pig") end)
```

## Dependencies & tags
**Components used:** `health`, `burnable`, `locomotor`, `homeseeker`, `knownlocations`
**Tags:** None added, removed, or checked directly by `spawner`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (none) | Owner entity of this component. |
| `child` | `Entity` or `nil` | `nil` | The currently owned child entity. |
| `delay` | number | `0` | Default delay (seconds) between releases. |
| `onoccupied` | function or `nil` | `nil` | Callback when child enters spawner (child `GoHome`). |
| `onvacate` | function or `nil` | `nil` | Callback when child is released. |
| `onspawnedfn` | function or `nil` | `nil` | Callback after child is spawned. |
| `onkilledfn` | function or `nil` | `nil` | Callback when child is killed. |
| `spawnoffscreen` | boolean or `nil` | `nil` | If `true`, listens for `entitysleep` to release children offscreen. |
| `useexternaltimer` | boolean | `false` | If `true`, defers spawn timing logic to external handlers. |
| `task` | `Task` or `nil` | `nil` | Active scheduled task for delayed spawning. |
| `nextspawntime` | number or `nil` | `nil` | World time at which the next spawn should occur. |
| `queue_spawn` | boolean or `nil` | `nil` | If `true`, re-queue a spawn after releasing child. |
| `retryperiod` | number or `nil` | `nil` | Delay before re-spawning when `queue_spawn` is enabled. |
| `childname` | string or `nil` | `nil` | Prefab name to spawn when releasing. |
| `spawn_in_water` | boolean or `nil` | `nil` | Override for water spawning (set via `SetWaterSpawning`). |
| `spawn_on_boats` | boolean or `nil` | `nil` | Override for boat spawning (set via `SetWaterSpawning`). |

## Main functions
### `Configure(childname, delay, startdelay)`
* **Description:** Sets up the spawner to manage a specific prefab type and spawn delay, then starts an initial spawn timer.
* **Parameters:** `childname` (string) prefab name; `delay` (number) seconds between releases; `startdelay` (number, optional) initial delay before first spawn (defaults to `0`).
* **Returns:** Nothing.

### `SpawnWithDelay(delay)`
* **Description:** Schedules the next spawn after `delay` seconds. Uses either a local timer (`DoTaskInTime`) or external timer based on `useexternaltimer`.
* **Parameters:** `delay` (number) seconds until spawn.
* **Returns:** Nothing.

### `IsSpawnPending()`
* **Description:** Checks whether a spawn is currently scheduled.
* **Parameters:** None.
* **Returns:** `true` if a spawn task is pending or external timer indicates pending, otherwise `false`.

### `CancelSpawning()`
* **Description:** Cancels any pending spawn task and clears spawn time tracking.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetQueueSpawning(queued, retryperiod)`
* **Description:** Configures whether released children trigger an immediate re-spawn after a `retryperiod`.
* **Parameters:** `queued` (boolean) enable/disable queuing; `retryperiod` (number, optional) delay before next spawn (only used when `queued` is `true`).
* **Returns:** Nothing.

### `TakeOwnership(child)`
* **Description:** Registers the given child entity as the spawner’s owned entity, sets up event listeners for its death/detachment, and configures it to track home at the spawner’s position. Adds `homeseeker` component if missing.
* **Parameters:** `child` (`Entity`) the entity to own.
* **Returns:** Nothing.

### `GoHome(child)`
* **Description:** Returns the child to the spawner (adds as child, sets local position `0,0,0`, removes from scene, stops movement, extinguishes fire if burning, removes `homeseeker`). Fires `onoccupied` callback if set.
* **Parameters:** `child` (`Entity`) the entity to house.
* **Returns:** `true` if successful, otherwise `false` (child is not owned or spawner is already occupied) and fires `gohomefailed` event on child.

### `ReleaseChild()`
* **Description:** Releases the child entity to the world at a safe location adjacent to the spawner, or spawns a new child if none exists. Uses `FindWalkableOffset` (with custom `NoHoles` predicate) to find a valid spawn point, or falls back to manual placement. Fires `onvacate` callback if set.
* **Parameters:** None.
* **Returns:** `true` if the child was successfully released; `nil` otherwise (e.g., queued spawn deferred).

### `OnChildKilled(child)`
* **Description:** Callback invoked when the tracked child is killed. Triggers `onkilledfn` if set, nullifies child, and restarts the spawn timer.
* **Parameters:** `child` (`Entity`) the killed child.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a debug string summarizing current state (child, occupied, queued, and next spawn time).
* **Parameters:** None.
* **Returns:** `string` human-readable status.

### `SetOnSpawnedFn(fn)`
* **Description:** Sets the callback function invoked when a child is spawned (after `TakeOwnership` and `GoHome`/release).
* **Parameters:** `fn` (function) takes `(spawner_inst, child)`.
* **Returns:** Nothing.

### `SetOnKilledFn(fn)`
* **Description:** Sets the callback function invoked when the child is killed.
* **Parameters:** `fn` (function) takes `(spawner_inst, child)`.
* **Returns:** Nothing.

### `SetOnOccupiedFn(fn)`
* **Description:** Sets the callback function invoked when the child is moved into the spawner (`GoHome`).
* **Parameters:** `fn` (function) takes `(spawner_inst, child)`.
* **Returns:** Nothing.

### `SetOnVacateFn(fn)`
* **Description:** Sets the callback function invoked when the child is released from the spawner.
* **Parameters:** `fn` (function) takes `(spawner_inst, child)`.
* **Returns:** Nothing.

### `SetWaterSpawning(spawn_in_water, spawn_on_boats)`
* **Description:** Configures whether spawned children may be placed in water or on boats.
* **Parameters:** `spawn_in_water` (boolean); `spawn_on_boats` (boolean).
* **Returns:** Nothing.

### `SetOnlySpawnOffscreen(offscreen)`
* **Description:** Enables spawning only when the spawner goes to sleep (`entitysleep` event). Uses `OnEntitySleep` logic.
* **Parameters:** `offscreen` (boolean).
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes the spawner’s state (e.g., child presence, pending spawns, external timer flags).
* **Parameters:** None.
* **Returns:** `data` (table) and `refs` (array of GUIDs, optional) for world save.

### `OnLoad(data, newents)`
* **Description:** Restores spawner state from save data, including child reference by GUID or full save record.
* **Parameters:** `data` (table) from `OnSave`; `newents` (table) entity map.
* **Returns:** Nothing.

### `LoadPostPass(newents, savedata)`
* **Description:** Resolves child entity GUID to object reference after initial load.
* **Parameters:** `newents` (table); `savedata` (table).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `ontrapped` (child) — triggers `OnChildKilled`; `death` (child) — triggers `OnChildKilled`; `detachchild` (child) — triggers `OnChildKilled`; `onremove` (child) — triggers `OnChildKilled`; `entitysleep` (spawner, when `spawnoffscreen` is true) — triggers conditional `ReleaseChild`.
- **Pushes:** `gohomefailed` (child) — fired when `GoHome` fails (e.g., child not owned or spawner occupied); `onextinguish` (child) — via `burnable:Extinguish` call.
