---
id: shadowthrallmanager
title: Shadowthrallmanager
description: Manages the lifecycle of a controlled fissure, spawns shadow thralls during Nightmare phase, and handles their combat state and release conditions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 62bbd71e
---

# Shadowthrallmanager

## Overview
The `ShadowthrallManager` is a server-only component attached to `TheWorld` that manages the controlled fissure during the Nightmare phase. When a rift spawns a qualifying thrall type (`TRIO` or `MOUTH`), it claims a fissure, spawns miasmas around it, and periodically schedules thrall spawning. It tracks thrall combat state, handles fissure release conditions (e.g., all thralls defeated or players distance), and persists its state across sessions.

## Dependencies & Tags
- **World State Watched:** `isnightmarewild`
- **Events Listened To:**
  - `"ms_riftaddedtopool"` (on `TheWorld`)
  - `"ms_riftremovedfrompool"` (on `TheWorld`)
  - `"onremove"` (on spawned thralls: `_thrall_hands`, `_thrall_horns`, `_thrall_wings`)
- **No explicit component dependencies** on `inst`, but relies on world-level components (` riftspawner`, `areaaware`) and entity components (`health`, `combat`, `lootdropper`, `workable`, `knownlocations`) of spawned entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | The entity this component is attached to (typically `TheWorld`). |
| `_fissure` | `Entity?` | `nil` | The currently controlled fissure. |
| `_fissure_animating` | `boolean?` | `nil` | Indicates if the fissure is still animating in. |
| `_potential_fissures` | `table` | `{}` | Set of fissure prefabs registered via `RegisterFissure`. |
| `_miasmas` | `table?` | `nil` | Set of active miasma entities. |
| `_thrall_hands` | `Entity?` | `nil` | The "hands" shadow thrall entity. |
| `_thrall_horns` | `Entity?` | `nil` | The "horns" shadow thrall entity. |
| `_thrall_wings` | `Entity?` | `nil` | The "wings" shadow thrall entity. |
| `_thrall_count` | `number` | `0` | Count of active thralls tracked for release logic. |
| `_internal_cooldown` | `number` | `0` | Timestamp when the next fissure spawn or action is allowed. |
| `_thrall_combatcheck_task` | `Task?` | `nil` | Periodic task to re-check combat status before releasing fissure. |
| `_find_fissure_task` | `Task?` | `nil` | Periodic task to locate a fissure if none is controlled. |
| `_dreadstone_regen_task` | `Task?` | `nil` | Delayed task for dreadstone regen cooldown. |
| `_spawn_thralls_task` | `Task?` | `nil` | Periodic task to attempt spawning thralls after fissure animation. |
| `_loading` | `boolean?` | `nil` | Grace-period flag used after load to prevent premature release. |
| `thralltype` | `string?` | `nil` | Type of thrall currently being spawned (`THRALL_TYPES.SHADOW.TRIO` or `THRALL_TYPES.SHADOW.MOUTH`). |

## Main Functions

### `IsGoodFissureLocation(pt)`
* **Description:** Determines if a point is a valid location for a fissure (above ground, and no blocking structures within radius).
* **Parameters:** `pt` (`Vector3`) — World position to test.

### `FindGoodFissureLocation()`
* **Description:** Attempts to find a valid spawn location near a player in the Nightmare zone using random offsets and walkability checks. Returns `nil` if no suitable spot is found.
* **Parameters:** None.

### `TickFindingGoodFissures()`
* **Description:** Checks for and claims a fissure if none is currently controlled, either by selecting the nearest existing fissure or spawning a new temporary one.
* **Parameters:** None.

### `StartFindingGoodFissures()`
* **Description:** Starts the periodic fissure-searching task (interval: `CHECK_FISSURE_INTERVAL = 1.13`).
* **Parameters:** None.

### `StopFindingGoodFissures()`
* **Description:** Cancels the fissure-searching task.
* **Parameters:** None.

### `RegisterFissure(inst)`
* **Description:** Registers a fissure entity as a candidate for control; if the fissure matches the currently controlled one, cancels combat-check tasks.
* **Parameters:** `inst` (`Entity`) — The fissure entity.

### `OnSpawnThralls()`
* **Description:** Spawns the set of three shadow thralls (hands, horns, wings) near the fissure if a player is within range (`SPAWN_THRALL_DIST = 14`). Sets up mutual tracking between thralls.
* **Parameters:** None.

### `IsThrallInCombat(thrall)`
* **Description:** Returns `true` if the thrall has an active target or was recently in combat (within `TUNING.FISSURE_TIME_THRALLS_OUT_OF_COMBAT` seconds).
* **Parameters:** `thrall` (`Entity`) — The thrall entity.

### `SafeToReleaseFissure()`
* **Description:** Returns `true` if all thralls are no longer in combat and the loading grace period has elapsed.
* **Parameters:** None.

### `ReleaseFissure(cooldown)`
* **Description:** Releases control of the fissure, kills all thralls (without loot), clears miasmas, sets the internal cooldown, and triggers respawn logic.
* **Parameters:** `cooldown` (`number?`) — Duration in seconds for the fissure cooldown; defaults to `5` if negative or `nil`.

### `UnregisterFissure(inst)`
* **Description:** Removes a fissure from the candidate set; if it was the controlled fissure and safe, attempts release; otherwise starts a combat-check task.
* **Parameters:** `inst` (`Entity`) — The fissure entity being unregistered.

### `SpawnThrallFromPoint(prefabname, x, z, angle, delay)`
* **Description:** Spawns a thrall near the fissure with a random offset and applies a spawn delay state.
* **Parameters:**  
  - `prefabname` (`string`)  
  - `x` (`number`)  
  - `z` (`number`)  
  - `angle` (`number`, degrees)  
  - `delay` (`number`, seconds)

### `KillThrall(thrall)`
* **Description:** Removes loot from the thrall and sets its health to 0 (no death animation).
* **Parameters:** `thrall` (`Entity`).

### `OnFissureAnimationsFinished(fissure)`
* **Description:** Triggered when the fissure finishes its spawn animations. Spawns miasmas and schedules thrall spawning.
* **Parameters:** `fissure` (`Entity`) — The fissure entity.

### `ControlFissure(fissure)`
* **Description:** Claim ownership of a fissure and mark it as controlled. Must be called only once per fissure.
* **Parameters:** `fissure` (`Entity`).

### `GetControlledFissure()`
* **Description:** Returns the currently controlled fissure (if any).
* **Parameters:** None.

### `GetThrallCount()`
* **Description:** Returns the count of currently tracked thralls.
* **Parameters:** None.

### `CheckForNoThralls()`
* **Description:** Immediately releases the fissure if no thralls remain.
* **Parameters:** None.

### `OnDreadstoneMineCooldown(fromload)`
* **Description:** Invoked when the dreadstone regen cooldown ends; notifies the fissure.
* **Parameters:** `fromload` (`boolean`) — Indicates if this is called after a save/load cycle.

### `OnFissureMinedFinished(fissure)`
* **Description:** Resets the dreadstone regen task timer after fissure mining completes.
* **Parameters:** `fissure` (`Entity`).

### `OnSave()`
* **Description:** Returns save data and entity GUIDs for persistence (fissure, miasmas, thralls, tasks).
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores internal state and task timers from saved data.
* **Parameters:** `data` (`table?`) — The saved state.

### `LoadPostPass(newents, savedata)`
* **Description:** After world entities are resolved, reconnects persisted entities (fissure, miasmas, thralls), reinitializes event listeners, and restarts logic.
* **Parameters:**  
  - `newents` (`table`)  
  - `savedata` (`table`)

### `GetDebugString()`
* **Description:** Returns a formatted string with current manager state for debugging.
* **Parameters:** None.

## Events & Listeners
- Listens to `"ms_riftaddedtopool"` on `TheWorld` (calls `OnRiftAddedToPool`)
- Listens to `"ms_riftremovedfrompool"` on `TheWorld` (calls `StartOrStopFindingGoodFissures`)
- Listens to `"onremove"` on `_thrall_hands`, `_thrall_horns`, `_thrall_wings` (calls per-thrall remove handlers)
- Watches `"isnightmarewild"` world state (calls `OnIsNightmareWild`)