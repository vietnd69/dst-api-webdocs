---
id: daywalkerspawner
title: Daywalkerspawner
description: This component manages the spawning, tracking, and power level progression of the Daywalker boss entity in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: world
source_hash: e939130d
---

# Daywalkerspawner

## Overview
The `DayWalkerSpawner` component is responsible for orchestrating the appearance and behavior of the Daywalker boss within the game world. It tracks the number of days until the Daywalker spawns, identifies suitable spawning locations, creates the Daywalker entity along with its arena, and manages its power level based on player defeats. It integrates with world state changes and shard-level boss tracking.

## Dependencies & Tags
None identified. This component primarily manages external prefabs ("daywalker", "daywalker_pillar") and interacts with global world systems like `TheWorld` and `TheSim`.

## Properties
| Property          | Type      | Default Value | Description                                                                                                                                              |
| :---------------- | :-------- | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inst`            | `Entity`  | `nil`         | A reference to the entity this component is attached to.                                                                                                 |
| `days_to_spawn`   | `number`  | `0`           | The number of days remaining until the Daywalker will attempt to spawn. This value is saved and loaded.                                                  |
| `power_level`     | `number`  | `1`           | The current power level of the Daywalker, which increases upon defeat. This value is saved and loaded, clamped between 1 and 2.                        |
| `daywalker`       | `Entity`  | `nil`         | A reference to the currently spawned Daywalker entity. This is set when a Daywalker is active and cleared upon its removal.                                |
| `spawnpoints`     | `table`   | `{}`          | A table containing references to entities designated as potential Daywalker spawning points.                                                             |

## Main Functions
### `UnregisterDayWalkerSpawningPoint(spawnpoint)`
*   **Description:** Removes a specified entity from the list of potential Daywalker spawning points.
*   **Parameters:**
    *   `spawnpoint`: The entity to remove from the spawn points list.

### `RegisterDayWalkerSpawningPoint(spawnpoint)`
*   **Description:** Adds an entity to the list of potential Daywalker spawning points. It also sets up a listener to automatically unregister the spawn point if the entity is removed. This function is noted as primarily for mod access.
*   **Parameters:**
    *   `spawnpoint`: The entity to add as a Daywalker spawn point.

### `TryToRegisterSpawningPoint(spawnpoint)`
*   **Description:** Attempts to register a spawn point if it is not already present in the list.
*   **Parameters:**
    *   `spawnpoint`: The entity to potentially register as a spawn point.
*   **Returns:** `true` if the spawn point was registered, `false` otherwise (if it was already present).

### `IncrementPowerLevel()`
*   **Description:** Increases the Daywalker's internal power level by 1, up to a maximum of 2. This is typically called after the Daywalker has been defeated.

### `GetPowerLevel()`
*   **Description:** Returns the current power level of the Daywalker.
*   **Returns:** The current `power_level` as a number.

### `IsValidSpawningPoint(x, y, z)`
*   **Description:** Checks if a given world position is suitable for spawning by ensuring the area around it is above ground.
*   **Parameters:**
    *   `x`: The X-coordinate of the position.
    *   `y`: The Y-coordinate of the position (typically 0 for ground).
    *   `z`: The Z-coordinate of the position.
*   **Returns:** `true` if the position is valid, `false` otherwise.

### `SpawnDayWalkerArena(x, y, z)`
*   **Description:** Spawns a "daywalker" prefab and several "daywalker_pillar" prefabs to create an arena at the specified coordinates. It also clears out any obstructing entities (like trees, plants, or collapsible structures) within a defined radius. This function is noted as primarily for mod access.
*   **Parameters:**
    *   `x`: The X-coordinate for the arena center.
    *   `y`: The Y-coordinate for the arena center.
    *   `z`: The Z-coordinate for the arena center.
*   **Returns:** The spawned Daywalker entity.

### `FindBestSpawningPoint()`
*   **Description:** Iterates through all registered spawn points to find the most suitable location for the Daywalker arena. It prioritizes locations that are clear of players and other specific entities, and have fewer structures. If no ideal spot is found, it attempts to find any valid walkable location near an existing spawn point.
*   **Returns:** The X, Y, Z coordinates of the chosen spawn point, or `nil, nil, nil` if no suitable point can be found.

### `TryToSpawnDayWalkerArena()`
*   **Description:** Initiates the process of spawning a Daywalker arena. It randomizes the order of spawn points, attempts to find the best location using `FindBestSpawningPoint()`, and if successful, calls `SpawnDayWalkerArena()` to create the entities.
*   **Returns:** The spawned Daywalker entity if successful, otherwise `nil`.

### `OnDayChange()`
*   **Description:** This function is called at the start of each new day cycle. It checks if the Daywalker is already spawned or if the spawn conditions are not met (e.g., in a specific shard location). If conditions are met and `days_to_spawn` reaches 0, it attempts to spawn a Daywalker. If successful, it sets the `days_to_spawn` for the next cycle.

### `WatchDaywalker(daywalker)`
*   **Description:** Sets the component's internal `daywalker` reference to the provided entity and establishes an `onremove` listener on that entity. When the Daywalker is removed (e.g., defeated), it increments the power level and syncs the boss defeat status, then clears the internal reference.
*   **Parameters:**
    *   `daywalker`: The Daywalker entity to track.

### `OnPostInit()`
*   **Description:** Called after the component is fully initialized. If `TUNING.SPAWN_DAYWALKER` is enabled, it sets up a listener for world day `cycles` (via `WatchWorldState`) to trigger `OnDayChange`. If `days_to_spawn` is 0 or less, it immediately attempts to spawn a Daywalker, assuming it's the first attempt or a previous attempt failed.

### `OnSave()`
*   **Description:** Serializes the component's state for saving the game.
*   **Returns:** A `data` table containing `days_to_spawn`, `power_level`, and potentially the `GUID` of the currently tracked Daywalker, and a `refs` table with the Daywalker's `GUID`.

### `OnLoad(data)`
*   **Description:** Deserializes the component's state when loading a game. It restores `days_to_spawn` (clamped to `TUNING.DAYWALKER_RESPAWN_DAYS_COUNT`) and `power_level`.
*   **Parameters:**
    *   `data`: The table containing the saved component data.

### `LoadPostPass(ents, data)`
*   **Description:** Called during the second pass of game loading to re-establish entity references. If a Daywalker `GUID` was saved, it attempts to find the corresponding entity in the loaded `ents` table and calls `WatchDaywalker()` to resume tracking it.
*   **Parameters:**
    *   `ents`: A table of all loaded entities.
    *   `data`: The table containing the saved component data.

## Events & Listeners
*   **Listens for (on `self.inst`):**
    *   `ms_registerdaywalkerspawningground`: Triggers `OnRegisterDayWalkerSpawningPoint` to register a new spawn point.
*   **Listens for (on registered `spawnpoint` entities):**
    *   `onremove`: Automatically unregisters the `spawnpoint` when it is removed from the world.
*   **Listens for (on the spawned `daywalker` entity):**
    *   `onremove`: When the Daywalker is defeated or removed, it increments `power_level` and triggers `Shard_SyncBossDefeated`.
*   **Listens for (world state changes):**
    *   `cycles`: Triggers `OnDayChange` at the start of each new day cycle.
*   **Pushes/Triggers:**
    *   `Shard_SyncBossDefeated("daywalker")`: A global function call that syncs the defeat of the Daywalker boss across shards.