---
id: forestdaywalkerspawner
title: Forestdaywalkerspawner
description: Manages the spawning and state tracking of the Day Walker boss in the Forest world, coordinating with the junk pile and shard-level spawner.
tags: [boss, spawner, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d052008e
system_scope: world
---

# Forestdaywalkerspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ForestDayWalkerSpawner` orchestrates the spawning logic for the Day Walker boss in the Forest world. It tracks respawn delays (`days_to_spawn`), manages the relationship with the `bigjunk` entity (junk pile), and synchronizes with `shard_daywalkerspawner` to determine when and where Day Walker should appear. It also persists state across saves and tracks boss defeat to increment the boss's `power_level`. This component only exists on the master simulation and is intended to be attached to a world-level entity.

## Usage example
```lua
-- Typically added automatically to the world entity in the Forest
-- Manual usage in modding would look like:
local world = TheWorld
world:AddComponent("forestdaywalkerspawner")
-- To force an immediate spawn attempt (if conditions met):
world.components.forestdaywalkerspawner:OnDayChange()
```

## Dependencies & tags
**Components used:** `wagpunk_manager`, `shard_daywalkerspawner`  
**Tags:** Checks `daywalker` tag via entity; does not add/remove tags itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `days_to_spawn` | number | `TUNING.DAYWALKER_RESPAWN_DAYS_COUNT` | Days remaining until the next Day Walker spawn attempt (decremented per `OnDayChange`). |
| `power_level` | number | `1` | Current difficulty tier of the Day Walker; increments to max `2` on defeat. |
| `bigjunk` | entity or `nil` | `nil` | Reference to the `bigjunk` entity (the junk pile) used for spawning Day Walker. |
| `daywalker` | entity or `nil` | `nil` | Reference to the currently active Day Walker entity. |

## Main functions
### `IncrementPowerLevel()`
*   **Description:** Increases the `power_level` by `1`, capped at `2`. Typically called after Day Walker is defeated.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetPowerLevel()`
*   **Description:** Returns the current `power_level`.
*   **Parameters:** None.
*   **Returns:** number — the current power level (`1` or `2`).

### `TryToSetDayWalkerJunkPile()`
*   **Description:** Attempts to retrieve and cache the `bigjunk` entity via `wagpunk_manager:GetBigJunk()`. Required before spawning Day Walker from the junk pile.
*   **Parameters:** None.
*   **Returns:** `true` if `bigjunk` was successfully set (or already set); `false` otherwise.

### `ShouldShakeJunk()`
*   **Description:** Determines whether the junk pile is currently active and should be shaken (i.e., Day Walker is buried there).
*   **Parameters:** None.
*   **Returns:** `true` if `bigjunk ~= nil`; `false` otherwise.

### `CanSpawnFromJunk()`
*   **Description:** Evaluates whether the forest can spawn Day Walker from the junk pile *right now*.
*   **Parameters:** None.
*   **Returns:** `true` if `bigjunk` is active and ready to spawn, or if shard conditions match and `days_to_spawn <= 0`; otherwise `false`.
*   **Error states:** Returns `false` if `daywalker` already exists, or if the shard spawner is not pointing to `"forestjunkpile"`.

### `OnDayChange()`
*   **Description:** Called daily to decrement `days_to_spawn`. When countdown reaches `0`, triggers spawning logic via `bigjunk:StartDaywalkerBuried()` (if setup succeeds), and resets the countdown.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `daywalker` or `bigjunk` already exists, or if shard spawner location is not `"forestjunkpile"`.

### `WatchDaywalker(daywalker)`
*   **Description:** Registers a listener on the `daywalker` entity to handle post-defeat cleanup and `power_level` increment. Clears the `bigjunk` reference and sets `daywalker`.
*   **Parameters:** `daywalker` (entity) — the Day Walker instance being watched.
*   **Returns:** Nothing.

### `HasDaywalker()`
*   **Description:** Checks whether a Day Walker is currently active.
*   **Parameters:** None.
*   **Returns:** `true` if `daywalker ~= nil`; `false` otherwise.

### `OnPostInit()`
*   **Description:** Called after component initialization. If `TUNING.SPAWN_DAYWALKER` is enabled, sets up the `"cycles"` event listener and triggers an immediate `OnDayChange()` if `days_to_spawn <= 0`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes component state (including `days_to_spawn`, `power_level`, and references to `daywalker`/`bigjunk` by `GUID`) for saving.
*   **Parameters:** None.
*   **Returns:** `{ data, refs }` where:
    *   `data` (table) — contains `days_to_spawn`, `power_level`, and optionally `daywalker_GUID`, `bigjunk_GUID`.
    *   `refs` (table or `nil`) — list of `GUID`s of referenced entities.

### `OnLoad(data)`
*   **Description:** Restores component state from saved data during world load.
*   **Parameters:** `data` (table or `nil`) — saved data table.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `data` is `nil`.

### `LoadPostPass(ents, data)`
*   **Description:** Resolves saved entity `GUID`s to live entities using the `ents` table post-load. Sets `self.daywalker` and `self.bigjunk`.
*   **Parameters:**
    *   `ents` (table) — map of `GUID -> entity`.
    *   `data` (table) — loaded data (may include `daywalker_GUID`, `bigjunk_GUID`).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"cycles"` (on `TheWorld`) — triggers `OnDayChange()`.  
  - `"onremove"` (on `self.daywalker`) — triggers power level increment and saves defeat.

- **Pushes:**  
  - None identified.

