---
id: wintersurprisespawner
title: Wintersurprisespawner
description: Manages the spawning of winter surprise trees (Leif trees with gift loot) during winter in Don't Starve Together, based on world state and setup constraints.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 1035c689
---

# Wintersurprisespawner

## Overview
This component orchestrates the timed, conditional spawning of `winter_tree` entities (known as "surprise trees") during the winter season. It coordinates with other systems to validate spawn locations, avoid conflicts (e.g., Klaus Sack proximity, existing Leif trees), and populate each tree with randomized real or fake gift loot based on world escalation levels. It tracks how many trees have spawned this winter and respawns new ones until the seasonal limit is reached.

## Dependencies & Tags
- **Requires**: `TheWorld.ismastersim` — throws an assertion if instantiated on client.
- **Tags used internally**:
  - `INLIMBO_TAGS = { "INLIMBO" }`
  - `WINTER_TREE_TAGS = { "winter_tree" }`
  - `STRUCTURES_ONEOF_TAGS = { "structure", "klaussacklock" }`
- **Listens to**:
  - `"ms_registerdeerspawningground"` — registers spawner points via `OnRegisterSurpriseSpawningPt`.
  - `"onremove"` — on registered spawner removal via `OnRemoveSpawner`.
- **Watches world state**:
  - `"iswinter"` — triggers spawning logic on winter onset/exit.
- **Uses**:
  - `TheWorld.components.klaussackspawner`
  - `TheWorld.components.hounded`
  - `TheWorld.components.worldsettingstimer`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | The component’s owning entity instance. |
| `_spawners` | `table` | `{}` | List of registered spawner points (e.g., Deer Spawning Grounds). |
| `_spawnsthiswinter` | `number` | `0` | Counter tracking how many surprise trees have spawned this winter. |
| `WINTERSURPRISE_TIMERNAME` | `string` | `"wintersurprise_spawntimer"` | Internal name for timer used by `worldsettingstimer`. |

> Note: No additional public instance properties are exposed beyond `self.inst`.

## Main Functions
### `ConfigureWinterSurprise(tree)`
* **Description:** Modifies a newly spawned `winter_tree` entity to act as a surprise tree: sets it as Leif-type (`is_leif = true`), maxes growth stage, fills its container with ornaments, and spawns a randomized number of real or fake gifts around it. Real gifts contain bonus loot; fake gifts contain junk and a surprise entity (e.g., hound).
* **Parameters:**  
  - `tree` (`Entity`) — The `winter_tree` prefab instance to configure.

### `SpawnWinterSurprise()`
* **Description:** Attempts to spawn one surprise tree by selecting a valid spawner point, finding a walkable location that satisfies proximity, terrain, and occupancy rules, and then instantiating/configuring the tree. If successful, triggers `ConfigureWinterSurprise`.
* **Parameters:**  
  - None.

### `OnRespawnWinterSurpriseTimer()`
* **Description:** Timer callback executed when the respawn delay expires. Calls `SpawnWinterSurprise()`, increments `_spawnsthiswinter`, and reschedules the timer if more spawns are allowed this winter.
* **Parameters:**  
  - None.

### `StartWinterSurpriseSpawnTimer()`
* **Description:** Starts the respawn timer with a randomized delay based on `TUNING.WINTERSURPRISE_SPAWN_DELAY` and `_VARIANCE`.
* **Parameters:**  
  - None.

### `OnIsWinter(self, iswinter)`
* **Description:** Handles transitions into/out of winter. Starts or stops spawning logic depending on season state and remaining spawn capacity.
* **Parameters:**  
  - `self` (`Component`) — Component instance.  
  - `iswinter` (`boolean`) — Whether the current season is winter.

### `OnRegisterSurpriseSpawningPt(inst, spawner)`
* **Description:** Registers a new spawner point (e.g., Deer Spawning Ground), adds it to `_spawners`, and listens for its removal to auto-deregister.
* **Parameters:**  
  - `inst` (`Entity`) — Ignored.  
  - `spawner` (`Entity`) — The spawner entity to register.

### `OnRemoveSpawner(spawner)`
* **Description:** Removes a spawner from `_spawners` when it is removed from the world.
* **Parameters:**  
  - `spawner` (`Entity`) — The spawner to remove.

### `IsValidSpawner(x, y, z)`
* **Description:** Validates whether a given world coordinate is eligible for spawning a surprise tree. Checks: proximity to Klaus Sack, overlap with existing Leif trees, terrain passability, and tile centering.
* **Parameters:**  
  - `x`, `y`, `z` (`number`) — World coordinates.

### `IsValidSpawnOffset(pos)`
* **Description:** Confirms a candidate offset position is usable (no limbo entities, no blockers within radius).
* **Parameters:**  
  - `pos` (`Vector3`) — Candidate position.

### `OnSave()`
* **Description:** Returns a table containing persistent state (`spawnsthiswinter`) for savegame serialization.
* **Parameters:**  
  - None.

### `OnLoad(data)`
* **Description:** Restores `_spawnsthiswinter` from saved data during load.
* **Parameters:**  
  - `data` (`table`) — Saved component data.

### `GetDebugString()`
* **Description:** Returns a debug-formatted string indicating how many trees spawned this winter.
* **Parameters:**  
  - None.

## Events & Listeners
- Listens for `"ms_registerdeerspawningground"` → calls `OnRegisterSurpriseSpawningPt`.
- Listens for `"onremove"` on registered spawner entities → calls `OnRemoveSpawner`.
- Watches world state `"iswinter"` → calls `OnIsWinter`.
- Internal use of `TheWorld.components.worldsettingstimer`: timer callback `OnRespawnWinterSurpriseTimer`.