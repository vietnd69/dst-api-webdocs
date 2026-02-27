---
id: wanderingtraderspawner
title: Wanderingtraderspawner
description: Manages the spawning, tracking, and lifecycle of a single Wandering Trader instance in response to world initialization and spawn point availability.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 02b302cc
---

# Wanderingtraderspawner

## Overview
This component is responsible for spawning and managing a single Wandering Trader instance in the game world. It registers and maintains lists of spawn points (separating master Sim and non-master Sim points), handles spawner logic on world initialization, tracks the spawned trader, and supports save/load persistence. It only runs on the master simulation.

## Dependencies & Tags
- **Component Dependencies:** Requires `Transform` component on `self.inst` (used implicitly via `spawnpoint.Transform` and `self.inst`).
- **Tags Used/Added:** No explicit tags are added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawnpoints` | `table` | `{}` | List of non-master spawn point entities (e.g., from client or non-Sim-side registrations). |
| `spawnpoints_masters` | `table` | `{}` | List of master Sim spawn point entities (used for authoritative spawning). |
| `wanderingtrader` | `Entity?` | `nil` | Reference to the currently spawned Wandering Trader prefab instance. |
| `OnRemove_wanderingtrader` | `function` | — | Event handler that clears `self.wanderingtrader` when the trader is removed. |

*Note:* The constructor (`_ctor`) is implemented as an anonymous function in the return statement. No public properties are declared before initialization.

## Main Functions

### `TrackWanderingTrader(wanderingtrader)`
* **Description:** Stores a reference to the given Wandering Trader entity and attaches an `"onremove"` event listener to clear the reference when the trader is removed.
* **Parameters:**
  * `wanderingtrader` (`Entity`): The Wandering Trader entity instance to track.

### `SpawnWanderingTrader()`
* **Description:** Instantiates and returns a new `wanderingtrader` prefab. Calls `TrackWanderingTrader` internally to manage lifecycle.
* **Parameters:** None.
* **Returns:** `Entity` — The newly spawned Wandering Trader.

### `TryToSpawnWanderingTrader()`
* **Description:** Attempts to spawn a Wandering Trader if one is not already active and spawn points exist. Selects a random spawn point from either `spawnpoints_masters` (priority) or `spawnpoints`, positions the new trader there, and spawns it.
* **Parameters:** None.
* **Returns:** `boolean` — `false` if spawning is skipped (either trader exists or no spawn points), otherwise implicitly returns `nil` after spawning.

### `RemoveWanderingTrader()`
* **Description:** Safely removes the currently tracked Wandering Trader if it exists.
* **Parameters:** None.

### `OnSave()`
* **Description:** Prepares save data for persistence. Records the GUID of the current Wandering Trader and includes it in the entities list.
* **Parameters:** None.
* **Returns:** `table, table` — Save data table (with `wanderingtrader` key), and list of tracked GUIDs.

### `LoadPostPass(newents, savedata)`
* **Description:** Restores the Wandering Trader reference after loading by resolving the saved GUID against `newents`. Calls `TrackWanderingTrader` to reattach event listeners.
* **Parameters:**
  * `newents` (`table`): Mapping of GUIDs to entity data as loaded from save.
  * `savedata` (`table`): Saved data from `OnSave`.

### `OnRegisterSpawnPoint(inst, spawnpoint)`
* **Description:** Registers a spawn point entity, distinguishing between master and non-master spawns. Adds it to the appropriate array and attaches an `"onremove"` listener to auto-unregister.
* **Parameters:**
  * `inst` (`Entity`): The entity sending the registration (unused).
  * `spawnpoint` (`Entity`): The spawn point entity being registered.

### `UnregisterSpawnPoint(spawnpoint)` / `UnregisterSpawnPoint_Master(spawnpoint)`
* **Description:** Helper functions to remove a spawn point from the non-master or master list, respectively. Called automatically when the spawn point emits `"onremove"`.

## Events & Listeners
- **Listens for:**
  - `"ms_registerspawnpoint"` on `self.inst` → triggers `OnRegisterSpawnPoint`.
  - `"onremove"` on tracked `wanderingtrader` → triggers `OnRemove_wanderingtrader`.
  - `"onremove"` on each registered `spawnpoint` → triggers corresponding `UnregisterSpawnPoint` or `UnregisterSpawnPoint_Master` handler.
- **Emits (via `inst:DoTaskInTime`):**
  - Immediately post-construction, schedules `OnWorldPostInit` to run once on `0` tick delay, which attempts spawning or removal based on `TUNING.WANDERINGTRADER_ENABLED`.