---
id: shadowhandspawner
title: Shadowhandspawner
description: Spawns shadow hands for players during nighttime when they meet specific conditions, including sanity thresholds, proximity to fire or repairable boats, and vault room restrictions.
tags: [boss, night, environmental, multiplayer]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: a89ef302
system_scope: world
---

# Shadowhandspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shadowhandspawner` is a world-scoped component responsible for spawning `shadowhand` prefabs on behalf of players during nighttime. It operates only on the master simulation (server) and ensures hands spawn under controlled conditions: players must be mature enough (older than `INITIAL_SPAWN_THRESHOLD`), have low sanity (`<= 0.75`), and be near a valid fire or repairable boat (not in the `puzzle2` vault room). It tracks spawned hands via player and entity references, and respects per-fire hand limits (`MAX_HANDS_PER_FIRE`). The component uses the world's day/night cycle to start/stop its scheduling loop for each player.

## Usage example
```lua
-- Typically added automatically by the world prefabs (e.g., `dst_world`) on the master server:
-- inst:AddComponent("shadowhandspawner")

-- No manual interaction is needed during normal gameplay.
-- Custom wave logic would interact with its public methods:
-- inst.components.shadowhandspawner:reservewaveyjonestarget(boat)
-- inst.components.shadowhandspawner:removewaveyjonestarget(boat)
```

## Dependencies & tags
**Components used:** `age`, `burnable`, `entitytracker`, `fueled`, `hull`, `mast`, `anchor`, `vaultroom`, `vaultroommanager`  
**Tags:** Listens to `ms_playerjoined` and `ms_playerleft`; tracks `"boat"`, `"fire"` tags; avoids `"_equippable"`; checks for `"boat_repaired_patch"`, `"mast"`, `"anchor"`, and special fuel tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity instance this component owns. |

**Private member tables:** `_players`, `_fires`, `_boats`, `_boattargets`, `_fueltags` — internal state not exposed publicly.

## Main functions
### `GetDebugString()`
* **Description:** Returns a human-readable string indicating how many shadow hands are currently active across all tracked players.
* **Parameters:** None.
* **Returns:** String (e.g., `"3 shadowhands"`, `"1 shadowhand"`, or empty string if none).

### `spawnwaveyjones(boat)`
* **Description:** Spawns a `waveyjones_marker` prefab at the boat’s position and registers the boat as a tracked target to prevent duplicate wavey jones spawns.
* **Parameters:** `boat` (Entity) — The boat entity near which to spawn the marker.
* **Returns:** `waveyjones_marker` prefab instance.
* **Error states:** Does not validate if boat is valid or exists; caller must ensure.

### `checkwaveyjonestarget(target)`
* **Description:** Returns whether the given entity is currently reserved as a wavey jones target.
* **Parameters:** `target` (Entity) — Entity to check.
* **Returns:** `true` if reserved; `nil` otherwise.

### `reservewaveyjonestarget(target)`
* **Description:** Marks the target entity as reserved to prevent re-use by another spawner iteration.
* **Parameters:** `target` (Entity).
* **Returns:** Nothing.

### `removewaveyjonestarget(target)`
* **Description:** Clears the reservation for the given entity.
* **Parameters:** `target` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `ms_playerjoined` — Adds new player tracking and schedules hand spawning if currently night.  
  - `ms_playerleft` — Stops scheduling and cleans up tracking for the departing player.  
  - `isnight` — Global world state watcher; starts/stops all scheduled tasks when day/night transitions.  
  - `onremove` — For each player, boat, or spawned hand; cleans up internal references.

- **Pushes:**  
  - None.
