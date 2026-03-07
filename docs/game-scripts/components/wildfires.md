---
id: wildfires
title: Wildfires
description: Manages wildfire ignition mechanics based on environmental conditions and active players.
tags: [environment, world, fire]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: c0be1b7a
system_scope: environment
---

# Wildfires

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Wildfires` is a world-scoped component responsible for scheduling and triggering wildfires during valid environmental conditions (summer, daytime, hot, dry weather). It monitors active players and initiates fire events at random intervals using proximity-based FindEntities logic. This component only runs on the master simulation (server) and integrates with several components (`burnable`, `pickable`, `crop`, `growable`, `workable`, `witherable`, `sandstorms`) to validate and execute fire ignition attempts.

## Usage example
```lua
-- Typically added automatically by the world initialization system.
-- Modders do not normally add this component directly.
-- Example of triggering a forced wildfire for a specific player:
inst:PushEvent("ms_lightwildfireforplayer", { player = someplayer })
```

## Dependencies & tags
**Components used:** `burnable`, `pickable`, `crop`, `growable`, `workable`, `witherable`, `sandstorms`  
**Tags checked (excluded from fire start):** `wildfireprotected`, `fire`, `burnt`, `player`, `companion`, `NOCLICK`, `INLIMBO`  
**Tags checked (wildfire priority):** `wildfirepriority`  
**Tags checked (canopy shade):** `shadecanopy`, `shadecanopysmall`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(none)* | The world entity instance that owns this component. |

## Main functions
### `GetDebugString()`
* **Description:** Returns a debug string indicating whether wildfire scheduling is currently active.
* **Parameters:** None.
* **Returns:** `"Active"` if wildfires are being scheduled; `"Inactive"` otherwise.

### `LightFireForPlayer(player, rescheduleFn)`
* **Description:** Attempts to ignite a wildfire near the given player if luck roll passes, weather permits, and a valid fire starter entity exists within radius.
* **Parameters:**  
  * `player` (`Entity`) — the player to use as center for fire search.  
  * `rescheduleFn` (`function`) — callback function used to reschedule the next attempt for the player.
* **Returns:** Nothing.
* **Error states:** May return without effect if luck fails, player is in a sandstorm, no valid fire starters found, or all candidates fail `CheckValidWildfireStarter`.

### `ScheduleSpawn(player)`
* **Description:** Schedules a delayed wildfire attempt for a player after `TUNING.WILDFIRE_RETRY_TIME` seconds.
* **Parameters:**  
  * `player` (`Entity`) — the player to schedule wildfire for.
* **Returns:** Nothing.
* **Error states:** Does nothing if a task is already scheduled for the player.

### `CancelSpawn(player)`
* **Description:** Cancels any pending wildfire attempt task for a player.
* **Parameters:**  
  * `player` (`Entity`) — the player whose task should be canceled.
* **Returns:** Nothing.

### `ToggleUpdate()`
* **Description:** Enables or disables wildfire scheduling based on current season, weather, temperature, and time-of-day conditions.
* **Parameters:** None.
* **Returns:** Nothing.

### `CheckValidWildfireStarter(obj)`
* **Description:** Evaluates whether an entity is a valid candidate to be ignited by a wildfire (e.g., not immune, not under canopy shade, not withered crop with protection).
* **Parameters:**  
  * `obj` (`Entity`) — the candidate entity to evaluate.
* **Returns:** `true` if valid; `false` otherwise.

### `Checkforcanopyshade(obj)`
* **Description:** Checks if an entity is under dense foliage that suppresses wildfires.
* **Parameters:**  
  * `obj` (`Entity`) — the entity whose position is checked.
* **Returns:** `true` if under canopy; `false` otherwise.

## Events & listeners
- **Listens to:**
  * `weathertick` — updates `_iswet` condition and toggles wildfire state.
  * `seasontick` — updates `_issummer` condition and toggles wildfire state.
  * `temperaturetick` — updates `_ishot` condition and toggles wildfire state.
  * `phasechanged` — updates `_isday` condition and toggles wildfire state.
  * `ms_lightwildfireforplayer` — triggers immediate wildfire attempt for specified player.
  * `ms_playerjoined` — registers new active player and schedules tasks if updating.
  * `ms_playerleft` — unregisters departing player and cancels pending tasks.
- **Pushes:** None.
