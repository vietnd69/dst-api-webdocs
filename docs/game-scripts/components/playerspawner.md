---
id: playerspawner
title: Playerspawner
description: Manages player spawning behavior, spawn point registration, and migration logic in the DST server.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 1cff1d43
---

# Playerspawner

## Overview
This component handles the server-side logic for spawning players in the game world. It supports configurable spawn modes (fixed and scatter), manages registered spawn points, handles player despawn and migration sequences, enforces spawn protection rules, and persists spawn history across saves.

## Dependencies & Tags
- Requires the `easing` module for scatter spawn point selection.
- Adds the `ms_playerdespawn`, `ms_playerdespawnanddelete`, `ms_playerdespawnandmigrate`, `ms_setspawnmode`, `ms_registerspawnpoint`, and `ms_registermigrationportal` event listeners.
- Listens for `"onremove"` events on registered spawn points and migration portals to automatically unregister them.
- Uses `ShardPortals` as a global list and modifies it during registration/unregistration.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this component is attached to (typically the world). |
| `_mode` | `string` | `"fixed"` | Current spawn mode (`"fixed"` or `"scatter"`). |
| `_masterpt` | `table` | `nil` | The designated master spawn point, if one exists with `master = true`. |
| `_openpts` | `table` | `{}` | List of currently available (unused) spawn points. |
| `_usedpts` | `table` | `{}` | List of spawn points already used in the current cycle. |
| `_players_spawned` | `table` | `{}` | Tracks which players (by `userid`) have spawned at least once. |

## Main Functions

### `SpawnAtNextLocation(inst, player)`
* **Description:** Spawns the player at the next available position according to the current spawn mode (fixed or scatter).  
* **Parameters:**  
  - `inst`: The component's host entity (world).  
  - `player`: The player entity to spawn.

### `SpawnAtLocation(inst, player, x, y, z, isloading)`
* **Description:** Spawns the player at the specified world coordinates. Handles migration location resolution, spawn protection, lighting, and visual effects based on spawn context.  
* **Parameters:**  
  - `inst`: The component's host entity.  
  - `player`: The player entity to spawn.  
  - `x`, `y`, `z`: World coordinates for spawning.  
  - `isloading`: Boolean indicating whether this is an initial load (vs. respawn/migration). Affects visual FX and event emission.

### `IsPlayersInitialSpawn(player)`
* **Description:** Returns `true` if the given player has never spawned before (based on `userid` tracking in `_players_spawned`).  
* **Parameters:**  
  - `player`: The player entity to check.

### `OnSave()`
* **Description:** Serializes the `_players_spawned` tracking table for persistence across saves.  
* **Returns:** A table containing `{ _players_spawned = _players_spawned }` if non-empty; `nil` otherwise.

### `OnLoad(data)`
* **Description:** Restores the `_players_spawned` tracking table from saved data.  
* **Parameters:**  
  - `data`: Saved data table containing `_players_spawned` if present.

### `GetNextSpawnPosition()`
* **Description:** Private helper that returns the next spawn coordinate (x, y, z) based on current mode. Resets cycles by swapping `_openpts` and `_usedpts` when exhausted.  
* **Returns:** `x, y, z` (y always `0`).

### `OnRemoveEntity()`
* **Description:** Cleans up all registered migration portals by clearing the global `ShardPortals` table. Called when the host entity is removed.

## Events & Listeners
- **Listens for:**
  - `"ms_playerdespawn"` → triggers `OnPlayerDespawn` (standard spawn effect + callback-based removal)
  - `"ms_playerdespawnanddelete"` → triggers `OnPlayerDespawnAndDelete` (removes player immediately after despawn FX)
  - `"ms_playerdespawnandmigrate"` → triggers `OnPlayerDespawnAndMigrate` (migrates player to another shard after FX)
  - `"ms_setspawnmode"` → triggers `OnSetSpawnMode` (updates internal spawn mode)
  - `"ms_registerspawnpoint"` → triggers `OnRegisterSpawnPoint` (registers a new spawn point)
  - `"ms_registermigrationportal"` → triggers `OnRegisterMigrationPortal` (adds portal to global list)

- **Emits:**
  - `"ms_newplayercharacterspawned"` (via `TheWorld:PushEvent`) only when spawning normally (not loading or scatter mode).