---
id: frograin
title: Frograin
description: Manages the spawning and lifecycle of frogs during rainy spring weather, including logic for lunar rift influence and player-specific spawning.
tags: [weather, spawner, environment]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: b28bfe7a
system_scope: environment
---

# Frograin

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FrogRain` is a world-scoped component responsible for dynamically spawning frogs during appropriate weather conditions (rainy spring). It tracks active players, schedules frog spawns at random intervals, respects a cap on total frogs, and reacts to lunar rift activity by occasionally spawning `lunarfrog` instead of regular `frog`. The component is server-only (`ismastersim`) and integrates with world state listeners (`israining`, `precipitationrate`) and player join/leave events.

## Usage example
```lua
-- Typically added to TheWorld via worldgen or scenario logic:
TheWorld:AddComponent("frograin")

-- Adjust spawning behavior at runtime (e.g., during events):
if TheWorld.components.frograin then
    TheWorld.components.frograin:SetSpawnTimes({ min = 5, max = 10 })
    TheWorld.components.frograin:SetMaxFrogs(20)
end
```

## Dependencies & tags
**Components used:** ` riftspawner` (for `IsLunarPortalActive` check)
**Tags:** None added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | — | Reference to the entity (`TheWorld`) this component is attached to. |
| `_activeplayers` | table (array of `GPlayer`) | `{}` | List of currently active players. |
| `_scheduledtasks` | table | `{}` | Map of player → pending scheduled spawn task (used to cancel/reschedule). |
| `_frogs` | table | `{}` | Map of spawned frogs to `true` if non-persistent (`persists == false`) or stored `persists` value if it was modified. |
| `_frogcap` | number | `0` | Maximum number of frogs allowed in the current rain event. |
| `_spawntime` | table `{ min, max }` | `TUNING.FROG_RAIN_DELAY` | Interval range (seconds) between frog spawns per player. |
| `_updating` | boolean | `false` | Whether active frog spawning logic is running. |
| `_lunarriftopen` | boolean | `false` | Whether a lunar rift is currently active. |

## Main functions
### `SetSpawnTimes(times)`
* **Description:** Updates the spawn interval range and forces a re-evaluation of spawning activity based on current weather.
* **Parameters:** `times` (table `{ min: number, max: number }`) — new minimum and maximum delay between spawns.
* **Returns:** Nothing.

### `SetMaxFrogs(max)`
* **Description:** Sets a new hard cap on the number of frogs allowed in the world.
* **Parameters:** `max` (number) — maximum number of concurrent frogs.
* **Returns:** Nothing.

### `StartTracking(target)`
* **Description:** Begins tracking a spawned frog: sets `persists = false`, registers callbacks for removal/sleep events, and records its original `persists` state for restore on removal.
* **Parameters:** `target` (`GEntity`) — the frog entity to track.
* **Returns:** Nothing.

### `StopTracking(target)`
* **Description:** Stops tracking a frog: restores its original `persists` value and removes registered callbacks.
* **Parameters:** `target` (`GEntity`) — the frog entity to stop tracking.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Returns world state for persistence — only the current frog cap is saved.
* **Parameters:** None.
* **Returns:** Table `{ frogcap = number }`.

### `OnLoad(data)`
* **Description:** Restores frog cap from saved data and re-evaluates spawning based on current world state.
* **Parameters:** `data` (table) — saved state, expected to contain `data.frogcap`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a debug string summarizing current spawn state.
* **Parameters:** None.
* **Returns:** `string` — formatted as `"Frograin: {count}/{cap}, updating:{bool} min: {min:.2f} max:{max:.2f}"`.

## Events & listeners
- **Listens to:**
  - `"ms_playerjoined"` — triggers `OnPlayerJoined` to add new players to the spawn pool.
  - `"ms_playerleft"` — triggers `OnPlayerLeft` to cancel pending spawns and remove players.
  - `"entitysleep"` (on frogs) — triggers `AutoRemoveTarget` to auto-remove sleeping frogs.
  - `"onremove"` / `"enterlimbo"` (on frogs) — triggers `StopTrackingFn` to clean up tracking.
  - `"exitlimbo"` (on frogs) — triggers `StartTrackingFn` to resume tracking if frog re-enters the world.

- **Pushes:** None.

### World state listeners
- `"israining"` — calls `OnIsRaining` to update frog cap and toggle spawning.
- `"precipitationrate"` — calls `ToggleUpdate` to refresh spawning state without resetting cap.

### Private listeners
- Internal scheduling uses `player:DoTaskInTime(...)` callbacks to schedule/unschedule frog spawns.
