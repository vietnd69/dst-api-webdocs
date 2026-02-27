---
id: lureplantspawner
title: Lureplantspawner
description: Manages seasonal spawning of Lureplants near active players during Spring using trail-based and random location logic.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: a93c420b
---

# Lureplantspawner

## Overview
This component is a server-side (master simulation) entity responsible for spawning Lureplant prefabs during Spring. It tracks active players, records their movement trails to bias spawn locations near recent footpaths, and schedules periodic spawn attempts based on tuned intervals and luck checks. It dynamically activates/deactivates based on the current season.

## Dependencies & Tags
- **Component Requirements**: Requires `TheWorld.ismastersim`; fails on clients via `assert`.
- **Entity Tags Added/Removed**: None.
- **Dependencies**:
  - `TheWorld` global (for season and world state)
  - `TheWorld.Map` (for tile and deploy point validation)
  - `TheSim:FindEntities` (to check spawn point occupancy)
  - `SpawnPrefab`, `Vector3`, `TUNING`, `ALL_PLAYERS`, `TryLuckRoll`, `LuckFormulas`
  - Season and player lifecycle events (`ms_playerjoined`, `ms_playerleft`, `seasontick`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | The entity to which this component is attached; used as the event target and reference point. |
| `_activeplayers` | `array of tables` | `{}` | List of tracked active players, each with `{ player: Entity, trail: array of {pos: Vector3, weight: number} }`. |
| `_scheduledspawntasks` | `table` | `{}` | Map of player data → pending spawn task references. |
| `_scheduledtrailtasks` | `table` | `{}` | Map of player data → pending trail logging task references. |
| `_worldstate` | `WorldState` | `TheWorld.state` | Reference to global world state (used to check `isspring`, `iswinter`). |
| `_map` | `WorldMap` | `TheWorld.Map` | Map object used for tile and deploy point queries. |
| `_updating` | `boolean` | `false` | Whether active spawner/trail logging tasks are running. |
| `_spawninterval` | `number` | `TUNING.LUREPLANT_SPAWNINTERVAL` | Base delay (in seconds) between spawn attempts per player. |
| `_spawnintervalvariance` | `number` | `TUNING.LUREPLANT_SPAWNINTERVALVARIANCE` | Variance applied to spawn interval (uniformly random offset). |

> **Note**: The class constructor (`_ctor`) is implicit (via `Class(function(self, inst)...end)`). Public methods `SpawnMode*` are deprecated and unused.

## Main Functions
### `IsValidSpawnPoint(pt)`
* **Description:** Checks if a given point is a valid spawn location: must be on a valid tile (grass/dirt/mud/etc.), be empty of entities (radius 1), and pass the deploy point clearance test.
* **Parameters:**  
  `pt` (Vector3) — World position to validate.

### `FindSpawnLocation(x, y, z)`
* **Description:** Generates up to 40 candidate positions in a circle around the input coordinates (radius `MIN_OFFSET` to `MAX_OFFSET`), filters by `IsValidSpawnPoint`, and returns a random valid position or `nil`.
* **Parameters:**  
  `x, y, z` (numbers) — Center point for spawn search.

### `FindSpawnLocationInTrail(trail)`
* **Description:** Selects a spawn location from the player’s trail with probability weighted by recorded point weights (decay and reweight handled via `LogPlayerLocation`). Removes the chosen point from the trail and validates the tile/empty conditions.
* **Parameters:**  
  `trail` (array of `{pos: Vector3, weight: number}`) — Player’s movement trail history.

### `SpawnLurePlantForPlayer(playerinst, playerdata, reschedule)`
* **Description:** Attempts to spawn a Lureplant for a specific player during non-winter seasons, using trail-based or random location and a per-player chance (`1/#activeplayers`). Reschedules the next spawn attempt via the `reschedule` callback.
* **Parameters:**  
  `playerinst` (Entity) — Player entity.  
  `playerdata` (table) — Player’s trail and reference data.  
  `reschedule` (function) — Function to call to schedule the next spawn attempt.

### `RandomizeSpawnTime()`
* **Description:** Returns a randomized spawn delay: `_spawninterval + uniform(-_spawnintervalvariance, +_spawnintervalvariance)`.

### `StartUpdating(force)`
* **Description:** Begins or refreshes spawner/trail tasks for all active players if season is Spring and `_spawninterval > 0`. If `force`, cancels and restarts existing tasks.
* **Parameters:**  
  `force` (boolean, optional) — Whether to restart all tasks even if already updating.

### `StopUpdating()`
* **Description:** Cancels all scheduled trail logging and spawn tasks for active players and sets `_updating = false`.

### `GetDebugString()`
* **Description:** Returns a formatted debug string with current spawn interval and variance.
* **Parameters:** None.

## Events & Listeners
- **`ms_playerjoined`** — Listened on `TheWorld`; triggers `OnPlayerJoined` when a player joins.
- **`ms_playerleft`** — Listened on `TheWorld`; triggers `OnPlayerLeft` when a player leaves.
- **`seasontick`** — Listened on `TheWorld`; triggers `OnSeasonTick` to start/stop updating based on season (Spring only).
- `OnSeasonTick` calls `StartUpdating()` when season becomes `"spring"`, otherwise `StopUpdating()`.