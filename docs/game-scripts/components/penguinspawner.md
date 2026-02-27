---
id: penguinspawner
title: Penguinspawner
description: This component manages the spawning, colonization, and lifecycle of penguin flocks and rookeries during winter in Don't Starve Together, including handling mutations and map persistence.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 8c7cc50b
---

# Penguinspawner

## Overview
The `Penguinspawner` component is responsible for autonomously generating penguin colonies (rookeries) during winter when conditions are met (e.g., sufficient distance from players and structures, proximity to water, and seasonal timing). It tracks active colonies, manages flock spawning logic, handles penguin lifecycle events (birth, death, mutation), and persists colony data across sessions. It operates exclusively on the master simulation and enforces world-wide constraints such as maximum penguin count and colony spacing.

## Dependencies & Tags
- Requires `TheWorld.ismastersim` (asserted in constructor).
- Uses components `knownlocations` (on spawned penguins) and `MiniMapEntity` (on `penguin_ice` objects).
- Spawns prefabs: `penguin`, `mutated_penguin`, `penguin_ice`, `rock_ice`.
- No components are added to its owner entity (`self.inst`) beyond internal logic; it is attached to a dedicated world-level entity (e.g., the world spawner or manager).
- No tags are added to the spawner itself.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The owning entity (world spawner instance). |
| `_colonies` | `table` | `{}` | Array of colony tables, each containing `rookery` (position), `members` (set of penguins), `ice` (prefab instance), `is_mutated` (bool), and `numspawned` (count). |
| `_maxColonySize` | `number` | `12` | Maximum penguins allowed per colony. |
| `_totalBirds` | `number` | `0` | Current total number of live penguins (global). |
| `_flockSize` | `number` | `TUNING.PENGUINS_FLOCK_SIZE` | Base flock size for new spawns. |
| `_spacing` | `number` | `60` | Minimum squared distance between rookeries (in tiles²). |
| `_checktime` | `number` | `5` | Interval (in seconds) between colony spawn checks. |
| `_lastSpawnTime` | `number` | `0` | Timestamp of the last successful flock spawn. |
| `_maxColonies` | `number` | `TUNING.PENGUINS_MAX_COLONIES` | Maximum number of colonies allowed in the world. |
| `_maxPenguins` | `number` | `_flockSize × (TUNING.PENGUINS_MAX_COLONIES + TUNING.PENGUINS_MAX_COLONIES_BUFFER)` | Hard cap on total penguins in the world. |
| `_spawnInterval` | `number` | `TUNING.PENGUINS_SPAWN_INTERVAL` | Minimum time (in seconds) between consecutive spawns. |
| `_numBoulders` | `number` | `TUNING.PENGUINS_DEFAULT_NUM_BOULDERS` | Number of `rock_ice` boulders to generate per rookery. |
| `_activeplayers` | `table` | `{}` | List of `{player = PlayerEntity, lastSpawnLoc = Vector3 or nil}` objects tracking player proximity for spawn avoidance. |

## Main Functions

### `AddToColony(colonyNum, pengu)`
* **Description:** Assigns a newly spawned penguin to an existing colony. Updates colony membership, increments counters, registers death callbacks, and stores colony location as `rookery` and `home` on the penguin’s `knownlocations` component.
* **Parameters:**
  - `colonyNum` (`number`): Index of the target colony in `_colonies`. If `nil`, the penguin is not assigned.
  - `pengu` (`Entity`): The penguin entity being added.

### `EstablishColony(loc)`
* **Description:** Attempts to find or create a new rookery at or near the given world position (`loc`), ensuring compliance with spacing, terrain, LOS, structure, and water proximity rules. If successful, creates a `penguin_ice` prefab, populates it with boulders, marks it as mutated if in a Lunacy Area, and registers the colony in `_colonies`.
* **Parameters:**
  - `loc` (`Vector3`): Approximate spawn center (typically land near water).
* **Returns:** `number` (colony index) or `false` on failure.

### `SpawnFlock(colonyNum, loc, check_angle)`
* **Description:** Spawns a randomized flock of penguins (size = `_flockSize ± variance`) around `loc` for the specified colony. Delays each spawn slightly using `DoTaskInTime` and respects the colony’s current `numspawned`.
* **Parameters:**
  - `colonyNum` (`number`): Index of the colony to assign spawned penguins.
  - `loc` (`Vector3`): Center position of the spawn area.
  - `check_angle` (`number`): Orientation angle (in degrees) for the initial penguin placement.

### `SpawnPenguin(inst, spawner, colonyNum, pos, angle)`
* **Description:** Spawns a single penguin (`penguin` or `mutated_penguin` depending on colony status) at `pos` with the given `angle`. Registers it with the colony.
* **Parameters:**
  - `inst`, `spawner`: Context arguments (unused; retained for callback compatibility).
  - `colonyNum` (`number`): Colony index.
  - `pos` (`Vector3`): Spawn position.
  - `angle` (`number`): Heading (in degrees).

### `OnSave()`
* **Description:** Serializes active colonies for world save. Stores rookery coordinates, mutation status, and `numspawned` count per colony.
* **Returns:** `table` with key `colonies`, an array of `{x, y, z, is_mutated, numspawned}` tables.

### `OnLoad(data)`
* **Description:** Loads colony data from a saved state, restoring `penguin_ice` prefabs and their mutation status.
* **Parameters:**
  - `data` (`table`): Save data containing `colonies`.

### `GetDebugString()`
* **Description:** Returns a formatted string summarizing current penguin/spawner state for debugging (e.g., counts, limits, next spawn time).
* **Returns:** `string` (e.g., `"10/120 Penguins, 3/5 Colonies, next spawn in :2.5"`).

## Events & Listeners
- Listens for `ms_playerjoined` → triggers `OnPlayerJoined`
- Listens for `ms_playerleft` → triggers `OnPlayerLeft`
- Listens for `ms_setpenguinnumboulders` → triggers `OnSetNumBoulders(val)` (note: function `OnSetNumBoulders` is referenced but not defined in the source; likely a no-op or stub)
- Listens for `seasontick` → triggers `OnSeasonTick`
- Triggers `death` and `onremove` events on each penguin (handled via `LostPenguin`)
- Uses `DoTaskInTime` to schedule recurring `TryToSpawnFlock` checks and per-flock penguin spawns.