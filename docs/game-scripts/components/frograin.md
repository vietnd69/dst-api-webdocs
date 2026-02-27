---
id: frograin
title: Frograin
description: Manages the spawning and lifecycle of frogs during rainy spring weather in Don't Starve Together, based on active players and world conditions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: b28bfe7a
---

# Frograin

## Overview
The `Frograin` component orchestrates frog rain events in the game world. It dynamically spawns frogs above active players during rainy spring weather, respects per-player and global limits, and tracks spawned frogs for cleanup. It also handles lunar rift effects (e.g., lunar frog spawns) and supports persistence state via save/load hooks.

## Dependencies & Tags
- Requires the master simulation context (`TheWorld.ismastersim`).
- Uses world state variables: `israining`, `precipitationrate`, `spring` (implicitly checked via `TheWorld.state.isspring`), `moistureceil`.
- Dependent components: `TheWorld.components.riftspawner` (for lunar rift detection).
- No explicit tags are added or removed on entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the component's owner entity (typically the world root). |
| `_activeplayers` | `table` | `{}` | List of active players currently tracked for spawning. |
| `_scheduledtasks` | `table` | `{}` | Stores pending scheduled spawn tasks keyed by player instance. |
| `_frogs` | `table` | `{}` | Tracks spawned frogs, with values indicating whether they persisted before tracking began. |
| `_frogcap` | `number` | `0` | Maximum number of frogs allowed per player's rain event. |
| `_spawntime` | `table` (with `min` and `max`) | `TUNING.FROG_RAIN_DELAY` | Interval over which spawns are scheduled for each player. |
| `_updating` | `boolean` | `false` | Indicates whether the component is currently in an active spawning state. |
| `_lunarriftopen` | `boolean` | `false` | Whether the lunar rift is currently active (affects frog type). |
| `_localfrogs` | `table` | `{ min = TUNING.FROG_RAIN_LOCAL_MIN, max = TUNING.FROG_RAIN_LOCAL_MAX }` | Per-event frog cap range for randomness. |

## Main Functions

### `SetSpawnTimes(times)`
* **Description:** Updates the global spawn time range and immediately re-evaluates spawning conditions (e.g., restarting all scheduled tasks if active).
* **Parameters:** `times` — A table with `min` and `max` numeric values defining the new spawn delay range.

### `SetMaxFrogs(max)`
* **Description:** Sets the global frog cap directly, overriding per-event randomization. Useful for testing or mod overrides.
* **Parameters:** `max` — An integer specifying the new maximum frog count.

### `StartTracking(target)`
* **Description:** Begins tracking a spawned frog, ensuring it is non-persistent and automatically removed if it goes to sleep. Registers event listeners for lifecycle changes.
* **Parameters:** `target` — The frog entity to begin tracking.

### `StopTracking(target)`
* **Description:** Stops tracking a frog, restoring its original `persists` property and cleaning up event listeners. Accepts either the frog entity (conventionally) or an incorrect argument (legacy alias).
* **Parameters:** `target` — The frog entity to stop tracking.

### `OnSave()`
* **Description:** Returns a save payload containing the current `_frogcap` value.
* **Returns:** `table` — `{ frogcap = number }`

### `OnLoad(data)`
* **Description:** Restores `_frogcap` from saved data and re-evaluates spawning conditions.
* **Parameters:** `data` — The saved data table (must contain `frogcap` if present).

### `GetDebugString()`
* **Description:** Returns a formatted debug string reporting current spawn activity, frog counts, and timing.
* **Returns:** `string` — e.g., `"Frograin: 3/5, updating:true min: 300.00 max:600.00"`

## Events & Listeners
- **Listens for:**
  - `ms_playerjoined` (on `TheWorld`) — Adds new players to `_activeplayers` and schedules spawns if updates are active.
  - `ms_playerleft` (on `TheWorld`) — Cancels pending spawns and removes players from tracking.
  - `israining` (via `WatchWorldState`) — Triggers rain-specific logic to set `_frogcap` and toggle updates.
  - `precipitationrate` (via `WatchWorldState`) — Re-evaluates spawning eligibility.
  - `entitysleep` (on tracked frogs) — Schedules automatic removal when a frog sleeps.
  - `onremove`, `enterlimbo` (on tracked frogs) — Stops tracking to prevent leaks.
  - `exitlimbo` (on tracked frogs) — Re-starts tracking if the frog re-enters the world.

## Auto-Triggered Event Handlers
- `OnIsRaining` — Sets `_frogcap` randomly (if conditions met) and calls `ToggleUpdate()`.
- `OnTargetSleep` — Schedules `AutoRemoveTarget` to clean up sleeping frogs.
- `AutoRemoveTarget` — Immediately removes a frog if it is asleep and still tracked.