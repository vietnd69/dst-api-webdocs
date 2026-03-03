---
id: flotsamgenerator
title: Flotsamgenerator
description: Spawns and manages floating debris (flotsam) in ocean environments, including scheduled natural spawns and guaranteed items like message bottles.
tags: [world, entity, spawning, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 21ec6175
system_scope: world
---

# Flotsamgenerator

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `flotsamgenerator` component manages the spawning, tracking, and removal of floating debris (flotsam) in ocean regions of DST. It operates exclusively on the server (`TheWorld.ismastersim`) and coordinates with players to spawn random items like driftwood, boat fragments, and twigs near their position, while also ensuring certain guaranteed items (e.g., message bottles) are spawned over time. It relies on the `boatphysics` component to adjust spawn locations based on boat movement and uses the `timer` component to assign lifespans to flotsam entities before they sink.

## Usage example
```lua
-- Typically added automatically by the world to TheWorld.Usr
-- To modify behavior, access its methods via:
TheWorld.components.flotsamgenerator:SetSpawnTimes({ min = 60, max = 120 })
TheWorld.components.flotsamgenerator:ToggleUpdate()
```

## Dependencies & tags
**Components used:** `timer`, `boatphysics`
**Tags:** Adds `flotsam` to spawned entities (unless `notrealflotsam` is `true`); checks `INLIMBO`, `fx`, `player`, and `debris` (implicit via `FindEntities`) for spawn validity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the world instance that owns this component. |

*No other public properties are initialized in the constructor.*

## Main functions
### `SetSpawnTimes(delay)`
* **Description:** Sets the minimum and maximum delays between automatic flotsam spawns. *Note:* This method is deprecated and prints a warning; use `birdattractor.spawnmodifier` instead.
* **Parameters:** `delay` (table) — a table with `min` and `max` numeric fields (e.g., `{ min = 30, max = 90 }`).
* **Returns:** Nothing.

### `ToggleUpdate()`
* **Description:** Enables or restarts flotsam spawning based on the current `_maxflotsam` limit and active players. If disabled and re-enabled, reschedules all pending spawns immediately.
* **Parameters:** None.
* **Returns:** Nothing.

### `setinsttoflotsam(inst, time, notag)`
* **Description:** Configures an entity as flotsam by adding the `flotsam` tag, starting a sink timer, and registering lifetime event callbacks.
* **Parameters:**  
  `inst` (Entity) — the entity to mark as flotsam.  
  `time` (number, optional) — lifespan in seconds; defaults to `LIFESPAN.base + random variance`.  
  `notag` (boolean, optional) — if `true`, skips adding the `flotsam` tag.
* **Returns:** Nothing.

### `SpawnFlotsam(spawnpoint, prefab, notrealflotsam)`
* **Description:** Spawns a flotsam entity at the given position, possibly adjusting orientation, and applies flotsam lifecycle behavior.
* **Parameters:**  
  `spawnpoint` (Vector) — world position for spawning.  
  `prefab` (string, optional) — specific prefab name; if omitted, a random weighted flotsam is chosen.  
  `notrealflotsam` (boolean, optional) — if `true`, the spawned entity won’t block other flotsam spawns.
* **Returns:** `Entity` — the spawned flotsam instance, or `nil` if `prefab` cannot be resolved.

### `StartTracking(target)`
* **Description:** Begins tracking a flotsam entity for auto-removal when asleep. Prevents persistence of transient flotsam.
* **Parameters:** `target` (Entity) — the flotsam entity to track.
* **Returns:** Nothing.

### `StopTracking(target)`
* **Description:** Stops tracking a flotsam entity and restores its original `persists` state.
* **Parameters:** `target` (Entity) — the flotsam entity to stop tracking.
* **Returns:** Nothing.

### `ScheduleGuaranteedSpawn(player, preset, override_time)`
* **Description:** Schedules a guaranteed flotsam (e.g., message bottle) spawn for a specific player after a delay derived from the preset.
* **Parameters:**  
  `player` (Entity) — the target player.  
  `preset` (table) — a guaranteed preset entry (e.g., `guaranteed_presets.messagebottle`).  
  `override_time` (number, optional) — custom delay before spawning.
* **Returns:** Nothing.

### `OnPostInit()`
* **Description:** Called after component initialization; kicks off the spawn update loop if `_maxflotsam > 0`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes the current state, including tracked flotsam entities, their remaining timer values, and internal tuning values.
* **Parameters:** None.
* **Returns:** `{ data, ents }` — `data` contains state fields, `ents` is an array of tracked flotsam GUIDs for persistence.

### `OnLoad(data)`
* **Description:** Restores tuning and spawn limits from saved data and re-enables spawning.
* **Parameters:** `data` (table) — saved state for this component.
* **Returns:** Nothing.

### `LoadPostPass(newents, savedata)`
* **Description:** Reapplies flotsam lifecycle behavior to loaded flotsam entities after world reconstruction.
* **Parameters:**  
  `newents` (table) — map of GUID → entity for loaded prefabs.  
  `savedata` (table) — saved flotsam metadata (e.g., remaining time, tag status).
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted debug string indicating current and maximum flotsam counts.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"flotsam:3/10"`.

## Events & listeners
- **Listens to:**  
  - `ms_playerjoined` (world) — triggers `OnPlayerJoined`, starts spawning for new players.  
  - `ms_playerleft` (world) — triggers `OnPlayerLeft`, cancels pending spawns for leaving players.  
  - `timerdone` (flotsam entities) — triggers sink behavior (`OnTimerDone`).  
  - `onpickup` / `onremove` (flotsam entities) — cancels timer and removes tracking.  
  - `entitysleep` (tracked flotsam entities) — schedules auto-removal (`AutoRemoveTarget`).
- **Pushes:** None.
