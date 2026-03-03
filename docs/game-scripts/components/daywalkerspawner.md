---
id: daywalkerspawner
title: Daywalkerspawner
description: Manages spawning and tracking of Daywalker boss arenas based on world time and configured spawning points.
tags: [boss, world, event, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: e939130d
system_scope: world
---

# Daywalkerspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Daywalkerspawner` is a server-only component responsible for triggering Daywalker boss arena spawns over time. It tracks the number of days remaining before the next spawn (`days_to_spawn`), maintains a list of registered spawning points, determines optimal spawn locations, constructs the arena with pillars, and spawns the Daywalker prefab. It coordinates with `shard_daywalkerspawner` to respect world/shard context (e.g., skip spawning in non-cavejail shards) and records boss defeat to increment `power_level`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("daywalkerspawner")
-- Optional: configure initial state before postinit
inst.components.daywalkerspawner.days_to_spawn = 3

-- Register spawning points
inst.components.daywalkerspawner:RegisterDayWalkerSpawningPoint(spawnpoint_entity)

-- Trigger spawning logic manually (e.g., mod hook or debug)
inst.components.daywalkerspawner:OnDayChange()
```

## Dependencies & tags
**Components used:** `workable`, `shard_daywalkerspawner` (via `TheWorld.shard.components`)
**Tags:** Adds `daywalker_spawner`; listens for `onremove` on spawning points and daywalker entities; checks tags like `NPC_workable`, `structure`, `plant`, `tree`, `locomotor`, `DECOR`, `INLIMBO`, and action-based workables (`CHOP_workable`, `DIG_workable`, `HAMMER_workable`, `MINE_workable`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to. |
| `days_to_spawn` | number | `0` | Days remaining until the next Daywalker arena can spawn. Decrements each day. |
| `power_level` | number | `1` | Current spawn difficulty tier (max `2`). Increases on Daywalker defeat. |
| `spawnpoints` | array of entities | `{}` | List of registered spawning point entities. |
| `daywalker` | `Entity` or `nil` | `nil` | Reference to the currently active Daywalker entity. |

## Main functions
### `TryToRegisterSpawningPoint(spawnpoint)`
* **Description:** Registers a spawning point entity if not already registered. Internally calls `RegisterDayWalkerSpawningPoint`. Meant for internal use and mod access.
* **Parameters:** `spawnpoint` (`Entity`) — Entity to register as a potential Daywalker spawn location.
* **Returns:** `true` if successfully registered; `false` if already present.
* **Error states:** No error states.

### `UnregisterDayWalkerSpawningPoint(spawnpoint)`
* **Description:** Removes a spawning point from the internal list.
* **Parameters:** `spawnpoint` (`Entity`) — Spawning point to unregister.
* **Returns:** Nothing.

### `RegisterDayWalkerSpawningPoint(spawnpoint)`
* **Description:** Registers the spawning point and sets up an `onremove` listener to automatically unregister it when the spawning point entity is removed.
* **Parameters:** `spawnpoint` (`Entity`) — Spawning point to register.
* **Returns:** Nothing.
* **Error states:** No error states.

### `IncrementPowerLevel()`
* **Description:** Increases the `power_level` by `1`, capped at `2`.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetPowerLevel()`
* **Description:** Returns the current power level.
* **Parameters:** None.
* **Returns:** `number` — Current power level (`1` or `2`).

### `IsValidSpawningPoint(x, y, z)`
* **Description:** Checks if the given world coordinates are valid for spawning (must be above ground within a 3×3 tile region).
* **Parameters:** 
  * `x`, `z` (`number`) — World coordinates (y is ignored; assumed `0`).
* **Returns:** `boolean` — `true` if all 9 adjacent tiles are above ground; `false` otherwise.

### `SpawnDayWalkerArena(x, y, z)`
* **Description:** Spawns the Daywalker prefab and surrounding arena pillars, and clears nearby entities that can be destroyed (e.g., structures, plants) via `workable:Destroy` or direct removal.
* **Parameters:** 
  * `x`, `y`, `z` (`number`) — World coordinates for center of the arena.
* **Returns:** `Entity` — The spawned Daywalker entity.
* **Error states:** None documented; assumes valid coordinates.

### `FindBestSpawningPoint()`
* **Description:** Selects the best spawn point from `spawnpoints`, prioritizing:
  1. Valid ground, no players within `NO_PLAYER_RADIUS`, and no blocking tags (`CANT_SPAWN_NEAR_TAGS`) and no structures.
  2. If none ideal, picks the spawning point with fewest nearby structures.
  3. If still none, picks a random point and attempts to find a nearby walkable offset within `5..15` tiles.
* **Parameters:** None.
* **Returns:** `x`, `y`, `z` (`number?`) — Coordinates of chosen spawn location, or `nil` if none found.

### `TryToSpawnDayWalkerArena()`
* **Description:** Shuffles `spawnpoints`, calls `FindBestSpawningPoint`, and if successful, converts the point to tile center and calls `SpawnDayWalkerArena`.
* **Parameters:** None.
* **Returns:** `Entity` or `nil` — Spawned Daywalker or `nil` if no valid location.

### `OnDayChange()`
* **Description:** Called daily (via `WatchWorldState`). Decrements `days_to_spawn` until zero, then attempts to spawn. Skips if:
  * A Daywalker is already spawned.
  * In a shard where `shard_daywalkerspawner` exists and location is not `"cavejail"`.
* **Parameters:** None.
* **Returns:** Nothing.

### `WatchDaywalker(daywalker)`
* **Description:** Stores reference to the spawned Daywalker and sets an `onremove` listener to increment `power_level` and sync boss defeat upon its death.
* **Parameters:** `daywalker` (`Entity`) — Daywalker instance to track.
* **Returns:** Nothing.

### `OnPostInit()`
* **Description:** If `TUNING.SPAWN_DAYWALKER` is `true`, starts daily cycle listener and attempts immediate spawn if `days_to_spawn <= 0`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Returns serializable state for save file, including `days_to_spawn`, `power_level`, and `daywalker_GUID` if active.
* **Parameters:** None.
* **Returns:** `data` (`table`), `refs` (`table?` or `nil`) — Save data and GUID references.

### `OnLoad(data)`
* **Description:** Loads state on scene load, hydrating `days_to_spawn` (capped by `TUNING.DAYWALKER_RESPAWN_DAYS_COUNT`) and `power_level`.
* **Parameters:** `data` (`table?`) — Saved data.
* **Returns:** Nothing.

### `LoadPostPass(ents, data)`
* **Description:** After entities are loaded, reattaches `daywalker` reference via GUID.
* **Parameters:** 
  * `ents` (`table`) — Map of `GUID → entity`.
  * `data` (`table`) — Loaded save data.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `ms_registerdaywalkerspawningground` — Triggers `TryToRegisterSpawningPoint` on new spawning points.
- **Listens to:** `onremove` — Removed on spawning points (unregister) and Daywalker entity (update `power_level` and clear `daywalker` reference).
- **Pushes:** None.
