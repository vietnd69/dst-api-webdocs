---
id: forestdaywalkerspawner
title: Forestdaywalkerspawner
description: Manages the timing, state, and spawning logic for the Day Walker in the Forest biome, coordinating with junk pile objects and shard-level spawner settings.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: d052008e
---

# Forestdaywalkerspawner

## Overview
This component orchestrates the delayed spawning of the Day Walker in the Forest biome. It tracks respawn timing via a countdown of in-game days, interacts with a junk pile (`bigjunk`) to trigger the burial/spawn sequence, and responds to the Day Walker’s defeat to increment power levels. It only exists on the master simulation and synchronizes spawn readiness with the shard-level `shard_daywalkerspawner`.

## Dependencies & Tags
- **Required Components on `inst`:** None directly added by this component (assumes `inst` is a valid world or worldroot entity with appropriate tags).
- **External Components Used:**  
  - `TheWorld.components.wagpunk_manager`  
  - `TheWorld.shard.components.shard_daywalkerspawner`  
- **Entity Tags:** None explicitly added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `days_to_spawn` | `number` | `TUNING.DAYWALKER_RESPAWN_DAYS_COUNT` | Number of days remaining before the Forest can spawn the Day Walker. Decrements on each `OnDayChange`. |
| `power_level` | `number` | `1` | Current power level of the Forest (1 or 2). Incremented on Day Walker defeat. |
| `bigjunk` | `Entity` or `nil` | `nil` | Reference to the junk pile entity used to bury/spawn the Day Walker. Set during spawn attempt. |
| `daywalker` | `Entity` or `nil` | `nil` | Reference to the currently active Day Walker entity, if spawned. |

## Main Functions
### `IncrementPowerLevel()`
* **Description:** Increases the `power_level` by 1, up to a maximum of 2.
* **Parameters:** None.

### `GetPowerLevel()`
* **Description:** Returns the current `power_level`.
* **Parameters:** None.

### `TryToSetDayWalkerJunkPile()`
* **Description:** Attempts to retrieve and assign the `bigjunk` entity from `wagpunk_manager`. Returns `true` on success, `false` otherwise.
* **Parameters:** None.

### `ShouldShakeJunk()`
* **Description:** Returns `true` if a `bigjunk` entity is currently assigned.
* **Parameters:** None.

### `CanSpawnFromJunk()`
* **Description:** Determines whether the Forest can currently spawn the Day Walker. Requires either:  
  (a) an assigned `bigjunk` (burial-in-progress state), *or*  
  (b) a matching shard spawner location (`"forestjunkpile"`), *and* `days_to_spawn` ≤ 0.  
  Returns `false` if a Day Walker is already active.
* **Parameters:** None.

### `OnDayChange()`
* **Description:** Called at the start of each new day. Decrements `days_to_spawn` while > 0. When reaching 0, initiates the spawn sequence if `TryToSetDayWalkerJunkPile` succeeds, by calling `StartDaywalkerBuried()` on the junk pile.
* **Parameters:** None.

### `WatchDaywalker(daywalker)`
* **Description:** Registers the given Day Walker entity for tracking. Sets up an `onremove` event listener to increment `power_level` and notify the shard on defeat, then clears the reference.
* **Parameters:**  
  - `daywalker` (`Entity`): The Day Walker entity to monitor.

### `HasDaywalker()`
* **Description:** Returns `true` if a Day Walker is currently spawned and tracked.
* **Parameters:** None.

### `OnPostInit()`
* **Description:** Initializes event listening for world `cycles` (day changes) if `TUNING.SPAWN_DAYWALKER` is enabled. Immediately triggers `OnDayChange()` if `days_to_spawn` ≤ 0.
* **Parameters:** None.

### `OnSave()`
* **Description:** Prepares data and entity references for serialization. Includes `days_to_spawn`, `power_level`, and optional GUIDs for `daywalker` and `bigjunk`.
* **Parameters:** None.  
* **Returns:** `data` (table), `refs` (table of GUIDs or `nil`).

### `OnLoad(data)`
* **Description:** Restores saved state (`days_to_spawn`, `power_level`) from serialized data.
* **Parameters:**  
  - `data` (`table`): Data dictionary from `OnSave`.

### `LoadPostPass(ents, data)`
* **Description:** After all entities are loaded, restores references to `daywalker` and `bigjunk` using stored GUIDs. Calls `WatchDaywalker()` on the Day Walker to reattach listeners.
* **Parameters:**  
  - `ents` (`table`): Loaded entities map by GUID.  
  - `data` (`table`): Loaded data dictionary (same as passed to `OnLoad`).

## Events & Listeners
- **Listens to:**
  - `"onremove"` on the `daywalker` entity (set via `WatchDaywalker`) — triggers power-level increment and shard sync on defeat.
  - `"cycles"` on `TheWorld` (set in `OnPostInit`) — calls `OnDayChange()` at the start of each day.