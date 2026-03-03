---
id: wanderingtraderspawner
title: Wanderingtraderspawner
description: Manages the spawning, tracking, and removal of the Wandering Trader entity in the game world.
tags: [spawn, trader, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 02b302cc
system_scope: world
---

# Wanderingtraderspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Wanderingtraderspawner` is a server-only component responsible for spawning and managing a single instance of the `wanderingtrader` prefab. It maintains two lists of spawn points (`spawnpoints` and `spawnpoints_masters`) and attempts to spawn the trader once during world initialization if the tuning flag `TUNING.WANDERINGTRADER_ENABLED` is true. It tracks the spawned trader to automatically reset its reference when the trader is removed, and supports save/load serialization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wanderingtraderspawner")
-- Spawn points are typically registered elsewhere via "ms_registerspawnpoint" event
-- The trader is spawned automatically after world init if enabled
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawnpoints` | array | `{}` | Local (non-master) spawn point references for the current client session. |
| `spawnpoints_masters` | array | `{}` | Master (world-level) spawn point references used only on the server. |
| `wanderingtrader` | entity or nil | `nil` | Reference to the currently active wandering trader entity. |

## Main functions
### `SpawnWanderingTrader()`
* **Description:** Spawns a new `wanderingtrader` prefab instance and begins tracking it. Does not move it — position must be set externally after spawning.
* **Parameters:** None.
* **Returns:** The newly spawned `wanderingtrader` entity (type: `Entity`).
* **Error states:** Returns `nil` on failure only if `SpawnPrefab("wanderingtrader")` fails.

### `TryToSpawnWanderingTrader()`
* **Description:** Attempts to spawn a `wanderingtrader` only if none is currently active *and* at least one spawn point is available. Uses shuffled spawn points (first from `spawnpoints`, then from `spawnpoints_masters`) to select a location. Calls `SpawnWanderingTrader()` internally and sets the trader's position.
* **Parameters:** None.
* **Returns:** `false` if a trader already exists or no spawn points are registered; nothing (`nil`) otherwise.
* **Error states:** No effect if `self.wanderingtrader` is already set or both spawn point arrays are empty.

### `RemoveWanderingTrader()`
* **Description:** Immediately removes the tracked `wanderingtrader` entity, if any.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No effect if `self.wanderingtrader` is `nil`.

### `TrackWanderingTrader(wanderingtrader)`
* **Description:** Registers the given entity as the current wandering trader and listens for its `"onremove"` event to clear the reference automatically.
* **Parameters:** `wanderingtrader` (Entity) — the trader entity to track.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** serializes the component state for world save.
* **Parameters:** None.
* **Returns:**  
  - `data` (table): contains `wanderingtrader.GUID` if a trader is active.  
  - `ents` (array): list of GUIDs referencing entities to be saved (currently only the trader’s GUID if present).
* **Error states:** Returns empty `data` and `ents` if no trader is tracked.

### `LoadPostPass(newents, savedata)`
* **Description:** Restores the `wanderingtrader` reference from saved GUID after the world is loaded and entities are resolved.
* **Parameters:**  
  - `newents` (table): mapping of GUIDs to loaded entity objects.  
  - `savedata` (table): contains `savedata.wanderingtrader` with a GUID if a trader was tracked at save time.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"ms_registerspawnpoint"` — triggers `OnRegisterSpawnPoint` to add spawn points to `spawnpoints` or `spawnpoints_masters`.  
  - `"onremove"` (on tracked `wanderingtrader`) — triggers `OnRemove_wanderingtrader` to clear `self.wanderingtrader`.
- **Pushes:** None.
