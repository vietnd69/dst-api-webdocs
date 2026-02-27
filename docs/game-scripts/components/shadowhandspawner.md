---
id: shadowhandspawner
title: Shadowhandspawner
description: Manages the spawning and tracking of Shadow Hands and Wavey Joneses during nighttime, based on player sanity, proximity to fires or boats, and game world state.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: a89ef302
---

# Shadowhandspawner

## Overview
This component coordinates the timed, context-sensitive spawning of shadow-themed entities (`shadowhand` and `waveyjones_marker`) during nighttime. It tracks active players, monitors their sanity levels, proximity to valid fuel-fueled fires, or association with boats undergoing repair, and schedules spawns accordingly using a recurring task system. The component operates exclusively on the master simulation and is destroyed on clients.

## Dependencies & Tags
- **Component Dependencies:** Relies on `TheWorld.ismastersim` (worldmaster-only execution), `TheWorld.Map`, `TheSim`, and world components like `vaultroommanager`.
- **Tags Used:**
  - Spawned entity tags: `"shadowhand"`, `"waveyjones_marker"`, `"boat_repaired_patch"`, `"fire"`, `"boat"`.
  - Exclusion tags for fire search: `"_equippable"`.
  - Fuel-related tags dynamically built from `FUELTYPE` (e.g., `"wood_fueled"`, `"town_fueled"`).
- **No components are added to `self.inst`**—this is a standalone logic container for the spawner.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | The host entity (typically the world root) on which this component operates. |
| `_map` | `Map` | `TheWorld.Map` | Internal reference to the game world map for spatial queries and passability checks. |
| `_players` | `table` | `{}` | Map of player entities → spawn state objects (`{ents = {}}`), keyed by player. |
| `_fueltags` | `array` | Dynamically built | List of fuel-type tags (e.g., `"wood_fueled"`, `"tallow_fueled"`) used to identify valid fire sources. |
| `_fires` | `table` | `{}` | Maps fire GUIDs → arrays of `shadowhand` entities currently spawned for that fire. |
| `_boats` | `table` | `{}` | Maps boat GUIDs → arrays of `waveyjones_marker` entities currently spawned for that boat. |
| `_boattargets` | `table` | `{}` | Tracks GUIDs of boats reserved for `waveyjones_marker` spawning to prevent duplicates. |

## Main Functions

### `SpawnHand(player, params)`
* **Description:** Core logic that attempts to spawn 1–2 `shadowhand` entities near a nearby fire, or one `waveyjones_marker` on a qualifying boat, depending on context (sanity, platform, fire proximity, etc.). If spawning succeeds, updates tracking tables and schedules the next spawn attempt.
* **Parameters:**
  - `player` (`Entity`): The player for whom to spawn hands.
  - `params` (`table`): Contains spawn state: `ents` (array of spawned entities), `task`, `delay`, `time`.

### `Reschedule(player, params, delay, time)`
* **Description:** Schedules the next `SpawnHand` attempt for a player using `DoTaskInTime`. Recalculates delay with randomness unless explicitly provided.
* **Parameters:**
  - `player` (`Entity`): The player whose schedule is being updated.
  - `params` (`table`): Spawn state table (updated with new `delay`, `time`, and `task`).
  - `delay` (`number`, optional): Custom delay in seconds; defaults to `TUNING.SEG_TIME * 4 ± variance`.
  - `time` (`number`, optional): Reference time for delay adjustment; defaults to `GetTime()`.

### `Start(player, params, time)`
* **Description:** Initiates or resumes scheduling for a player if not already running (e.g., at nightfall or when joining at night). Calls `Reschedule` if no active task exists.
* **Parameters:**
  - `player` (`Entity`)
  - `params` (`table`)
  - `time` (`number`): Current simulation time for scheduling adjustments.

### `Stop(player, params, time)`
* **Description:** Cancels the pending spawn task for a player and adjusts remaining delay (e.g., at dawn or player leave). Preserves elapsed delay for resumed scheduling.
* **Parameters:**
  - `player` (`Entity`)
  - `params` (`table`)
  - `time` (`number`): Current time to compute remaining delay.

### `spawnwaveyjones(inst, boat)`
* **Description:** Spawns a `waveyjones_marker` prefab at the boat's location and links it to the boat via `entitytracker`. Returns the spawned entity.
* **Parameters:**
  - `boat` (`Entity`): The boat entity on which to spawn the marker.

### `testfortinkerthings(boat)`
* **Description:** Checks if a boat has any "finker" components (`boat_repaired_patch`, `mast`, `anchor`, or special extinguishable fuel) indicating it's repair-eligible for `waveyjones` spawning.
* **Parameters:**
  - `boat` (`Entity`)

### `GetDebugString()`
* **Description:** Returns a human-readable count of currently active Shadow Hands across all tracked players (e.g., `"3 shadowhands"`).
* **Parameters:** None.

## Events & Listeners
- **Listens for:**
  - `"ms_playerjoined"` → `OnPlayerJoined`
  - `"ms_playerleft"` → `OnPlayerLeft`
  - `"onremove"` (on each tracked entity—players, fires, or boats) → internal cleanup handlers (`StopTracking`, `StopTrackingBoat`)
- **Triggers:**
  - None (does not push custom events).
- **World State Watches:**
  - `"isnight"` → `OnIsNight` (started when first player joins, stopped when last player leaves).