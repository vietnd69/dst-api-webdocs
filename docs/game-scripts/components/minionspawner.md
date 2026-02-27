---
id: minionspawner
title: Minionspawner
description: Manages the spawning, tracking, and lifecycle of minion entities associated with a master entity in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 78ac6ef9
---

# Minionspawner

## Overview
This component handles the spawning, ownership tracking, and lifecycle management of minion entities (e.g., Eye Plants) for a master entity. It dynamically calculates valid spawn locations, maintains a pool of free position identifiers, and supports saving/loading state across sessions.

## Dependencies & Tags
- **Component Dependencies:** Relies on minion entities having `Transform` (for position), `Physics` (for teleportation), and `Health` (for killing minions) components.  
- **Event Tags:** Uses the `"eyeplant"` tag when checking for entity collisions during spawn location evaluation.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(none)* | Reference to the owning entity instance. |
| `miniontype` | `string` | `"eyeplant"` | Prefab name used to spawn minions. |
| `maxminions` | `number` | `27` | Maximum number of minions allowed simultaneously. |
| `minionspawntime` | `{ min: number, max: number }` | `{ min = 5, max = 10 }` | Range (in seconds) for randomized spawn intervals. |
| `minions` | `table` | `{}` | Dictionary mapping minion entity references to themselves. |
| `numminions` | `number` | `0` | Current count of active minions. |
| `distancemodifier` | `number` | `11` | Scaling factor for radial spawn positioning. |
| `onspawnminionfn` | `function` | `nil` | Optional callback executed after a minion spawns. |
| `onlostminionfn` | `function` | `nil` | Optional callback executed when a minion is lost. |
| `onminionattacked` | `function` | `nil` | Optional callback executed when any owned minion is attacked. |
| `onminionattack` | `function` | `nil` | Optional callback executed when any owned minion attacks. |
| `spawninprogress` | `boolean` | `false` | Flag indicating whether a spawn timer is active. |
| `nextspawninfo` | `{ start: number, time: number }` | `{}` | Metadata for the next scheduled spawn. |
| `shouldspawn` | `boolean` | `true` | Controls whether the spawner should auto-spawn minions. |
| `minionpositions` | `table<Vector3>` | `nil` | Precomputed list of valid spawn positions (3D vectors). |
| `validtiletypes` | `table<bool>` | `DEFAULT_VALID_TILE_TYPES` | Set of valid tile types where minions can spawn. |
| `freepositions` | `table<number>` | Generated list `[1..maxminions*POS_MODIFIER]` | Pool of available position IDs for minion assignment. |

## Main Functions

### `GetDebugString()`
* **Description:** Returns a formatted string summarizing key spawner state (minion count, spawn status, next spawn time, and spawn activation). Used for debugging.  
* **Parameters:** None.

### `RemovePosition(num)`
* **Description:** Removes a given position ID from the `freepositions` pool.  
* **Parameters:**  
  - `num` (`number`): Position ID to remove.

### `AddPosition(num, tbl)`
* **Description:** Inserts a position ID into a specified pool (defaults to `freepositions`), maintaining sorted order and avoiding duplicates.  
* **Parameters:**  
  - `num` (`number`): Position ID to insert.  
  - `tbl` (`table<number>?`): Target pool table (optional; defaults to `freepositions`).

### `OnSave()`
* **Description:** Serializes component state for save-game persistence. Returns a data table and a list of minion GUIDs.  
* **Parameters:** None.  
* **Returns:**  
  - `data` (`table`): Serialized state (minions, `maxminions`, positions, spawn progress).  
  - `guidtable` (`table<string>`): List of active minion GUIDs.

### `OnLoad(data)`
* **Description:** Restores component state from saved data (e.g., max minions, positions, and pending spawn progress).  
* **Parameters:**  
  - `data` (`table`): Deserialized save data.

### `LoadPostPass(newents, savedata)`
* **Description:** Ensures all minions from `savedata.minions` are re-associated with the spawner after world entities are loaded. Teleports minions to their saved positions and recycles position IDs.  
* **Parameters:**  
  - `newents` (`table<GUID, Entity>`): Mapping of loaded GUIDs to entity references.  
  - `savedata` (`table`): Save data containing minion associations.

### `TakeOwnership(minion)`
* **Description:** Registers a minion under this spawner, assigns it a position ID (if missing), sets up event listeners, and increments the active minion count.  
* **Parameters:**  
  - `minion` (`Entity`): The minion entity to register.

### `OnLostMinion(minion)`
* **Description:** Deregisters a minion, decrements the count, cancels its event listeners, schedules position ID recycling, and triggers respawning if conditions allow.  
* **Parameters:**  
  - `minion` (`Entity`): The minion entity that was lost.

### `MakeMinion()`
* **Description:** Spawns a new minion prefab if the limit has not been reached and `miniontype` is set.  
* **Parameters:** None.  
* **Returns:** `Entity?` — The spawned minion, or `nil` if spawning failed.

### `CheckTileCompatibility(tile)`
* **Description:** Checks if a given tile type is in the `validtiletypes` set.  
* **Parameters:**  
  - `tile` (`number`): Tile ID to validate.

### `MakeSpawnLocations()`
* **Description:** Computes up to `maxminions * 1.2` valid radial spawn positions around the master, based on terrain, pathing, and entity density constraints. Updates `minionpositions` and regenerates `freepositions` if needed.  
* **Parameters:** None.  
* **Returns:** `table<Vector3>?` — List of valid positions, or `nil` if none found.

### `GetSpawnLocation(num)`
* **Description:** Retrieves a precomputed spawn position by ID, verifying its tile compatibility.  
* **Parameters:**  
  - `num` (`number`): Position ID (from 1 to `maxminions`).  
* **Returns:** `Vector3?` — The position vector, or `nil` if invalid.

### `GetNextSpawnTime()`
* **Description:** Returns a random interval (in seconds) between `minionspawntime.min` and `minionspawntime.max`.  
* **Parameters:** None.

### `KillAllMinions()`
* **Description:** Immediately kills all owned minions with randomized small delays. Cancels any pending spawn.  
* **Parameters:** None.

### `SpawnNewMinion()`
* **Description:** Attempts to spawn a minion by assigning a free position ID, placing the minion at its saved location, and scheduling the next spawn. Handles dynamic regeneration of spawn positions if needed.  
* **Parameters:** None.

### `MaxedMinions()`
* **Description:** Checks if the current minion count has reached the maximum.  
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if `numminions >= maxminions`.

### `SetSpawnInfo(time)`
* **Description:** Records the timing metadata for the next spawn (start time and duration).  
* **Parameters:**  
  - `time` (`number`): Duration (seconds) until the next spawn.

### `StartNextSpawn()`
* **Description:** Schedules the next minion spawn using a delayed task if spawning is enabled and not already in progress.  
* **Parameters:** None.

### `ResumeSpawn(time)`
* **Description:** Resumes a previously interrupted spawn timer with a specified remaining time.  
* **Parameters:**  
  - `time` (`number`): Seconds remaining until spawn.

### `LongUpdate(dt)`
* **Description:** Handles time-delta updates during long frame skips (e.g., fast-forwarding). Cancels existing spawn tasks and forces immediate spawns for each skipped interval.  
* **Parameters:**  
  - `dt` (`number`): Elapsed time (seconds) since last update.

## Events & Listeners
- **Listens For:**
  - `"attacked"` (on each minion): Triggers `onminionattacked` callback.
  - `"onattackother"` (on each minion): Triggers `onminionattack` callback.
  - `"death"` (on each minion): Triggers `OnLostMinion` logic.
  - `"onremove"` (on each minion): Triggers `OnLostMinion` logic.
- **Triggers:**
  - `"minionchange"`: Pushed after adding or removing a minion to notify listeners (e.g., UI updates).