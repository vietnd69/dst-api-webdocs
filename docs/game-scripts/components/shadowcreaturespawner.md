---
id: shadowcreaturespawner
title: Shadowcreaturespawner
description: Manages the spawning, tracking, and population control of sanity-based shadow creatures (e.g., Crawling Horrors, Ocean Horrors, Terrorbeaks) for each player in the game world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 43493884
---

# Shadowcreaturespawner

## Overview
This component is responsible for dynamically managing the population of shadow creatures (such as Crawling Horrors, Ocean Horrors, and Terrorbeaks) that spawn in response to a player’s sanity level and state (e.g., induced insanity). It operates exclusively on the server (master) side and tracks one or more shadow creatures per player, adjusting their numbers over time based on sanity thresholds and game tuning values. It also handles the replacement of shadow creatures when they are exchanged (e.g., via mod interactions), and ensures creatures are removed appropriately when the player goes to sleep or logs out.

## Dependencies & Tags
- **Component依赖**: None explicitly added or removed by this component itself. However, it relies on the presence of the following components on the `player` entity:
  - `sanity`
  - `walkableplatform` (for boat radius calculations)
- **Tag依赖**: 
  - Checks for `"boat"` tag on the player’s current platform.
- **World systems**:
  - Uses `TheWorld.Map:IsOceanAtPoint()` and `IsPassableAtPoint()`.
- **Network scope**: Explicitly asserts `TheWorld.ismastersim`; will not initialize on clients.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `self` instance passed to constructor | Reference to the spawner’s owner entity (typically the world root). |
| `_players` | `table` | Empty `{}` table | Internal dictionary mapping `player` → `params`, where `params` holds per-player state: `{ents = {}, targetpop = 0, spawntask = ..., poptask = ...}`. |
| `_failed_ocean_spawn_attempts` | `number` | `0` | Counter tracking consecutive failed ocean spawn attempts (max `OCEAN_SPAWN_ATTEMPTS = 4` before falling back to land spawn). |
| `NON_INSANITY_MODE_DESPAWN_INTERVAL` | `number` | `0.1` | Interval for population update tasks when *not* in induced-insanity mode. |
| `NON_INSANITY_MODE_DESPAWN_VARIANCE` | `number` | `0.1` | Random variance added to non-insanity mode update interval. |
| `OCEAN_SPAWN_ATTEMPTS` | `number` | `4` | Max consecutive failed ocean spawns before attempting a land spawn. |

> Note: No public `self.*` properties beyond `inst` and `_failed_ocean_spawn_attempts` are directly exposed; most state is held in the private `_players` table.

## Main Functions

### `self:SpawnShadowCreature(player, params)`
* **Description:** Attempts to spawn a single shadow creature near the given player, choosing between land-based (`CrawlingHorror`, `Terrorbeak`) or ocean-based (`OceanHorror`) depending on the player’s sanity, platform (boat), and world geometry. On boats in induced-insanity mode, it prioritizes ocean spawns. If ocean spawns repeatedly fail, it falls back to land spawns near the boat. Otherwise, spawns near the player on passable ground.
* **Parameters:**
  - `player` (`Entity`): The player for whom to spawn the creature.
  - `params` (`table`, optional): The player’s spawner state table (from `_players`). If omitted, looks up via `player`.

### `UpdateSpawn(player, params)`
* **Description:** Main loop that maintains the target population (`params.targetpop`) by either spawning new creatures or removing excess ones. Schedules itself to run again if the target hasn’t been reached or exceeded.
* **Parameters:**
  - `player` (`Entity`)
  - `params` (`table`): Player’s spawner state.

### `UpdatePopulation(player, params)`
* **Description:** Computes the new target population for the player based on current sanity, sanity mode (normal vs induced), and tuning tables. Updates `params.targetpop` if changed and reschedules `UpdateSpawn`. Also reschedules itself for the next population update.
* **Parameters:**
  - `player` (`Entity`)
  - `params` (`table`): Player’s spawner state.

### `Start(player, params)`
* **Description:** Ensures the population update task (`poptask`) is running (if not already).
* **Parameters:**
  - `player` (`Entity`)
  - `params` (`table`)

### `Stop(player, params)`
* **Description:** Cancels both the population update task (`poptask`) and the spawn task (`spawntask`), halting all creature management for the player.
* **Parameters:**
  - `player` (`Entity`)
  - `params` (`table`)

### `GetDebugString()`
* **Description:** Returns a human-readable string summarizing the total number of active shadow creatures across all players (e.g., `"3 shadowcreatures"`).
* **Parameters:** None.

## Events & Listeners
- **Listens for events on the spawner’s `inst` (world root):**
  - `"ms_playerjoined"` → calls `OnPlayerJoined`
  - `"ms_playerleft"` → calls `OnPlayerLeft`
  - `"ms_exchangeshadowcreature"` → calls `OnExchangeShadowCreature`

- **Listens for events per player:**
  - `"inducedinsanity"` → calls `OnInducedInsanity`
  - `"sanitymodechanged"` → calls `OnInducedInsanity`
  - `"onremove"` → triggers `StopTracking` for that creature (only if `inst.spawnedforplayer == player`)
  - `"entitysleep"` → removes the creature after `0s` delay
  - `"onremove"` on the player → marks spawned creature as `wantstodespawn = true`, sets `persists = false`, and clears `spawnedforplayer` reference

- **No events are explicitly pushed** by this component; it relies on existing game events and internal task callbacks.