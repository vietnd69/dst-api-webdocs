---
id: acidbatwavemanager
title: Acidbatwavemanager
description: Manages spawning and tracking of acid bat waves in response to players accumulating nitre during acid rain.
tags: [environment, combat, boss, npc]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: d69c3f1d
system_scope: world
---

# Acidbatwavemanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Acidbatwavemanager` orchestrates the spawning and lifecycle of acid bat attacks for players during acid rain events. It monitors player inventory for nitre accumulation, calculates wave-spawning odds based on item progress, issues audible/visual warnings, and spawns batches of acid bats. It manages persistent state across saves and coordinates with `hounded`-style pause events to temporarily halt spawning. This component is server-authoritative (`ismastersim` only) and operates globally via a single instance attached to `TheWorld`.

## Usage example
```lua
-- Typically added to TheWorld in master mode via worldgen or startup logic:
TheWorld:AddComponent("acidbatwavemanager")

-- When acid rain begins:
TheWorld.state.isacidraining = true

-- When nitre is acquired by a player:
-- The component automatically listens for inventory events and updates wave odds.
```

## Dependencies & tags
**Components used:** `inventory`, `stackable`, `talker`, `health` (via `IsEntityDeadOrGhost`), `sleeper` (indirectly via `IsEntityDeadOrGhost`)  
**Tags:** None identified (does not add or remove entity tags directly)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawn_dist` | number | `TUNING.ACIDBATWAVE_SPAWN_DISTANCE` | Max distance from player to spawn acid bats. |
| `max_target_prefab` | number | `TUNING.ACIDBATWAVE_NUMBER_OF_ITEMS_TO_GUARANTEE_WAVE_SPAWN` | Cap on nitre count used for odds calculation. |
| `cooldown_between_waves` | number | `TUNING.ACIDBATWAVE_COOLDOWN_BETWEEN_WAVES` | Seconds between consecutive bat waves per player. |
| `time_for_warning` | number | `TUNING.ACIDBATWAVE_TIME_FOR_WARNING` | Seconds of warning before a bat wave spawns. |
| `target_prefab` | string | `"nitre"` | Item prefab whose count triggers waves. |
| `update_time_seconds` | number | `10` | Seconds between main update checks. |
| `update_time_accumulator` | number | `0` | Accumulator tracking time since last update loop. |
| `pausesources` | `SourceModifierList` | `SourceModifierList(inst, false, SourceModifierList.boolean)` | Tracks pause reasons (e.g., `hounded` events). |
| `acidbats` | table | `{}` | Map of active acid bat entities (`bat` → `true`). |
| `players` | table | `{}` | Cache of all players (`player` → `true`). |
| `watching` | table | `{}` | Per-player metadata for active watchers (`player` → `metadata`). |
| `savedplayermetadata` | table | `{}` | Persisted per-player metadata for players who were active at save time. |

## Main functions
### `TrackAcidBat(bat)`
* **Description:** Registers an acid bat for tracking and attaches a listener to automatically remove it from the internal `acidbats` map on removal.  
* **Parameters:** `bat` (entity) — the spawned acid bat instance.  
* **Returns:** Nothing.  
* **Error states:** No-op if `bat` is already tracked.

### `GetAcidBatSpawnPoint(pt)`
* **Description:** Finds a valid walkable spawn point for acid bats near a given point, avoiding holes.  
* **Parameters:** `pt` (vector3-like, `{x, z}`) — center point around which to search.  
* **Returns:** `{x, z}` (vector3-like) if a valid point is found, otherwise `nil`.  

### `SpawnAcidBatForPlayerAt(player, pt)`
* **Description:** Spawns a single acid bat at the given world coordinates, immediately removes it from the scene, and schedules return to scene.  
* **Parameters:**  
  * `player` (entity) — player for whom the bat is spawned (used for return timing).  
  * `pt` (vector3-like) — world position `{x, z}`.  
* **Returns:** `bat` (entity) — the spawned acid bat, or `nil` on failure.  

### `CreateAcidBatsForPlayer(player, playermetadata)`
* **Description:** Spawns a calculated number of acid bats for a given player based on their nitre count.  
* **Parameters:**  
  * `player` (entity) — target player.  
  * `playermetadata` (table) — player metadata containing `target_prefab_count`.  
* **Returns:** Nothing.  
* **Error states:** Spawning failures (e.g., invalid positions) are silently ignored.  

### `CountTargetPrefabForPlayer(player)
* **Description:** Counts total nitre items in a player's inventory, including overflow and containers.  
* **Parameters:** `player` (entity) — player whose inventory to inspect.  
* **Returns:** number — up to `max_target_prefab`.  

### `UpdateOddsForPlayer(player, playermetadata)`
* **Description:** Updates the `odds_to_spawn_wave` value for a player based on nitre count, using an easing curve. Returns `0` for invalid positions or dead/ghost players.  
* **Parameters:**  
  * `player` (entity) — target player.  
  * `playermetadata` (table) — player metadata to update.  
* **Returns:** Nothing.  

### `TryToSpawnWaveForPlayer(player, playermetadata, t)`
* **Description:** Implements wave-spawning logic: respects cooldowns/warnings, rolls luck, and schedules spawn or warning state.  
* **Parameters:**  
  * `player` (entity) — target player.  
  * `playermetadata` (table) — player metadata (updated in-place).  
  * `t` (number) — current game time (via `GetTime()`).  
* **Returns:** Nothing.  

### `SpawnWaveForPlayer(player, playermetadata)`
* **Description:** Triggers actual bat spawning for the player.  
* **Parameters:**  
  * `player` (entity) — target player.  
  * `playermetadata` (table) — player metadata.  
* **Returns:** Nothing.  

### `IssueWarningForPlayer(player, playermetadata, t)`
* **Description:** Plays warning SFX and sets `last_warn_time` to prevent spam.  
* **Parameters:**  
  * `player` (entity) — target player.  
  * `playermetadata` (table) — player metadata (updated with `last_warn_time`).  
  * `t` (number) — current game time.  
* **Returns:** Nothing.  

### `OnUpdate(dt)`
* **Description:** Periodic server-side update function. Updates odds and attempts to spawn waves for all watched players. Also handles warning SFX timing.  
* **Parameters:** `dt` (number) — delta time since last update.  
* **Returns:** Nothing.  

### `StartWatchingPlayer(player)` / `StopWatchingPlayer(player)`
* **Description:** Manages per-player event listeners and metadata. `StartWatchingPlayer` begins tracking and updates inventory callbacks; `StopWatchingPlayer` cleans up and persists state if acid rain is active.  
* **Parameters:** `player` (entity) — player to start/stop watching.  
* **Returns:** Nothing.  

### `StartWatchingPlayers()` / `StopWatchingPlayers()`
* **Description:** Batch versions of `StartWatchingPlayer`/`StopWatchingPlayer` over all known players.  
* **Parameters:** None.  
* **Returns:** Nothing.  

### `OnIsAcidRaining(isacidraining)`
* **Description:** Activates/deactivates all player watching based on current acid rain state.  
* **Parameters:** `isacidraining` (boolean) — whether acid rain is active.  
* **Returns:** Nothing.  

### `OnSave()`
* **Description:** Serializes player wave metadata and active bat GUIDs for world save.  
* **Parameters:** None.  
* **Returns:**  
  * `data` (table) — save data (`{userids, bats}`) or `nil` if nothing to save.  
  * `ents` (table) — list of bat GUIDs needing save lookup.  

### `OnLoad(data)`
* **Description:** Loads per-player wave metadata (e.g., from players who left mid-wave).  
* **Parameters:** `data` (table) — saved data.  
* **Returns:** Nothing.  

### `LoadPostPass(newents, savedata)`
* **Description:** Re-registers acid bats after world load using GUIDs from `OnSave()`.  
* **Parameters:**  
  * `newents` (table) — map of GUID → `{entity, ...}`.  
  * `savedata` (table) — loaded save data (contains `bats`).  
* **Returns:** Nothing.  

## Events & listeners
- **Listens to:**  
  * `ms_playerjoined` — triggers `OnPlayerJoined`.  
  * `ms_playerleft` — triggers `OnPlayerLeft`.  
  * `pausehounded` / `unpausehounded` — updates pause sources.  
  * Per-player: `itemget`, `itemlose`, `newactiveitem`, `stacksizechange` — inventory updates.  
  * Per-bat: `onremove` — cleanup from `acidbats` map.  
- **Pushes:** None.
