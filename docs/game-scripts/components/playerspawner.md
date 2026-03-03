---
id: playerspawner
title: Playerspawner
description: Manages player spawning logic, including position selection, spawn protection, and migration handling in the master simulation.
tags: [player, spawn, migration, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 1cff1d43
system_scope: world
---

# Playerspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Playerspawner` is a server-only component that handles the core logic for spawning players into the world. It manages spawn point registration, position selection (fixed or scatter modes), and coordinates player respawn, deletion, and world migration. The component ensures safe spawning conditions by evaluating surrounding entities and enabling spawn protection when necessary. It interacts closely with `playercontroller`, `locomotor`, `areaaware`, and `colourtweener` components on the player entity.

## Usage example
```lua
-- Typically attached automatically to TheWorld in master simulation.
-- Example of spawning a player at next available location:
if TheWorld and TheWorld.components.playerspawner then
    TheWorld.components.playerspawner:SpawnAtNextLocation(player)
end

-- Example of setting spawn mode:
TheWorld:PushEvent("ms_setspawnmode", "scatter")
```

## Dependencies & tags
**Components used:** `areaaware`, `colourtweener`, `locomotor`, `playercontroller`, `worldmigrator`, `migrationpetsoverrider`  
**Tags:** Adds `spawnlight` (via prefab), checks for `hostile`, `_combat`, `trapdamage`, `cursed`, `blocker`, `structure` for spawn protection.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity (always `TheWorld`) that owns this component. |

*Note: All other member variables (`_mode`, `_masterpt`, `_openpts`, `_usedpts`, `_players_spawned`) are private.*

## Main functions
### `SpawnAtNextLocation(inst, player)`
*   **Description:** Spawns the given `player` at the next available spawn position, chosen based on the current spawn mode (`fixed` or `scatter`). Internally calls `SpawnAtLocation`.
*   **Parameters:**  
    - `inst` (Entity) — the owner instance (typically ignored, used for event context).  
    - `player` (Entity) — the player entity to spawn.  
*   **Returns:** Nothing.

### `SpawnAtLocation(inst, player, x, y, z, isloading)`
*   **Description:** Spawns `player` at the specified world coordinates (`x`, `y`, `z`). Handles migration overrides, spawn protection checks, visual FX (including colour tweening), and light spawning in darkness.
*   **Parameters:**  
    - `inst` (Entity) — owner instance.  
    - `player` (Entity) — the player entity to spawn.  
    - `x`, `y`, `z` (numbers) — target world position.  
    - `isloading` (boolean) — if `true`, bypasses some FX and enables immediate control; used during world load.  
*   **Returns:** Nothing.
*   **Error states:** Raises no errors, but silently skips spawn protection if `BRANCH == "dev"`, or if `TheWorld.topology.overrides` is `nil`.

### `GetAnySpawnPosition()`
*   **Description:** Public reference to `GetNextSpawnPosition()`; returns the world coordinates of the next available spawn point.
*   **Parameters:** None.
*   **Returns:** `x` (number), `y` (always `0`), `z` (number) — spawn coordinates.

### `IsPlayersInitialSpawn(player)`
*   **Description:** Returns whether the given `player` has ever spawned in the current session.
*   **Parameters:**  
    - `player` (Entity) — the player to check.  
*   **Returns:** `true` if this is the player’s first spawn, `false` otherwise.

### `OnRemoveEntity()`
*   **Description:** Cleans up `ShardPortals` list on component/entity removal.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Saves `_players_spawned` state for serialization across sessions.
*   **Parameters:** None.
*   **Returns:** `nil` or a table `{ _players_spawned = _players_spawned }`.

### `OnLoad(data)`
*   **Description:** Restores `_players_spawned` state from saved data.
*   **Parameters:**  
    - `data` (table or `nil`) — the saved state.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `ms_playerdespawn` — triggers `OnPlayerDespawn` to begin fade-out and removal.  
  - `ms_playerdespawnanddelete` — triggers immediate despawn + deletion (no migration).  
  - `ms_playerdespawnandmigrate` — triggers migration-aware despawn with portal FX.  
  - `ms_setspawnmode` — updates spawn mode (`fixed` or `scatter`).  
  - `ms_registerspawnpoint` — registers a spawn point entity for future spawns.  
  - `ms_registermigrationportal` — registers a migration portal entity.  
- **Pushes:**  
  - None directly (but `OnPlayerDespawn` and its callbacks push via `player:PushEvent` or component internals).
