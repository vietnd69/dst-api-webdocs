---
id: migrationmanager
title: Migrationmanager
description: Manages dynamic creature migration groups and pathfinding across biome nodes in the world, currently used by Crystal-Crested Buzzards.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: a5c7d486
---

# Migrationmanager

## Overview
The `MigrationManager` component implements a world-level system for managing creature population groups that migrate between biomes (called "nodes") using a topology-derived adjacency graph. It tracks active players, maintains migration paths, updates migration timers, and handles saving/loading of population state—currently supporting only the Crystal-Crested Buzzard but designed for extensibility.

## Dependencies & Tags
- Requires `TheWorld.ismastersim` (only exists on server).
- Registers events: `ms_playerjoined`, `ms_playerleft`.
- Attachments: Adds `migrationmanager_groupuid` to migrated entities to track group membership.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to (typically the world). |
| `_lastuid` | `number` | `-1` | Internal counter for generating unique population group UIDs. |
| `_activeplayers` | `table` | `{}` | Stores active players and their current migration node. |
| `_migrationtypes` | `table` | `{}` | Registry of registered migration types (e.g., `"mutatedbuzzard_gestalt"`), keyed by type name. |
| `_migrationpopulations` | `table` | `{}` | Stores population groups organized by migrator type. |
| `_migrationmap` | `table` | `nil` | Biome adjacency graph: `biome_name → { weight, neighbours = { ... } }`. |
| `mapdistancecache` | `table` | `{}` | Precomputed distances between biomes for pathfinding. |

## Main Functions

### `CreateMigrationType(migration_data)`
* **Description:** Registers a new migration type with configuration (e.g., max group size, migration timing logic).
* **Parameters:**  
  `migration_data`: Table with keys: `type` (string), `GetMaxGroupPopulation`, `GetMigrateTime`, `GetMigrateTimeMult`, `num_path_nodes`, and optionally `CanPopulationGroupMigrate`, `UpdatePopulationMigrationPath`.

### `GetNewPopulationGroupUID()`
* **Description:** Returns a new unique integer UID for population groups (incremental counter).
* **Parameters:** None.

### `GetMigrationNodeAtPoint(x, y, z)`
* **Description:** Returns the biome node name (e.g., `"Forest"`) at a given world position.
* **Parameters:**  
  `x`, `y`, `z`: World coordinates (supports `Vector3`, `(x,z)`, or `(x,y,z)` formats).

### `GetMigrationNodeAtInst(inst)`
* **Description:** Convenience wrapper for `GetMigrationNodeAtPoint`, using an entity's position.
* **Parameters:**  
  `inst`: Entity with `Transform` and world position.

### `GetDistanceNodeToNode(node1, node2)`
* **Description:** Returns the precomputed shortest-path distance between two biome nodes. Returns `0` for identical nodes, `nil` if either node is invalid or uncacheable.
* **Parameters:**  
  `node1`, `node2`: Biome node names.

### `GetPopulationGroup(uid)`
* **Description:** Searches across all migration types to find and return the population group with the given UID.
* **Parameters:**  
  `uid`: Unique group identifier.

### `GetFirstPopulationGroupInNode(migrator_type, node, filterfn)`
* **Description:** Returns the UID of the first population group matching criteria (e.g., not full) in a given biome node.
* **Parameters:**  
  `migrator_type`: Migration type name (e.g., `"mutatedbuzzard_gestalt"`).  
  `node`: Biome node name.  
  `filterfn`: Optional function `(migrator_type, population) → bool` to further filter groups.

### `GetEntityFromMigrationNode(migrator_type, node)`
* **Description:** Finds and returns (while removing it from its group) the first entity in a given node’s population.
* **Parameters:**  
  `migrator_type`: Migration type name.  
  `node`: Biome node name.

### `ForEachEntityInMigration(migrator_type, cb)`
* **Description:** Iterates over all entities in migration for a given type. Stops early if callback returns `true`.
* **Parameters:**  
  `migrator_type`: Migration type name.  
  `cb`: Callback `(ent, population) → stop: bool`.

### `CreatePopulationGroup(migrator_type, spawnnode)`
* **Description:** Creates a new population group in the specified node and returns its UID.
* **Parameters:**  
  `migrator_type`: Migration type name.  
  `spawnnode`: Biome node where group forms.

### `AddEntityToPopulationGroup(group_uid, ent)`
* **Description:** Adds an entity to an existing population group. Removes it from the scene and tags it.
* **Parameters:**  
  `group_uid`: UID of target group.  
  `ent`: Entity to add.
* **Returns:** `true` if successful, `false` if already in a group or group invalid.

### `EnterMigration(migrator_type, ent)`
* **Description:** Registers an entity for migration by placing it in the nearest valid population group at its position (or creating one if needed/full).
* **Parameters:**  
  `migrator_type`: Migration type name.  
  `ent`: Entity entering migration.
* **Side effects:** Removes `ent` if no valid node found at its position.

### `MigratePopulationToNode(migration_data, population, node)`
* **Description:** Instantly moves a population group to a specified node, updating path and timer.
* **Parameters:**  
  `migration_data`: Migration config (or type name string).  
  `population`: Population group table.  
  `node`: Target biome node name.

### `MigratePopulationToNextNode(migration_data, population)`
* **Description:** Advances a population group to the next node in its precomputed migration path.
* **Parameters:**  
  `migration_data`: Migration config (or type name string).  
  `population`: Population group table.

### `UpdatePopulationMigrationPath(migration_data, population)`
* **Description:** Expands the migration path for a population group toward its target, using either a custom logic or random neighbor selection.
* **Parameters:**  
  `migration_data`: Migration config (or type name string).  
  `population`: Population group table.

### `OnUpdate(dt)`
* **Description:** Periodic update (every `1/3` seconds) for player location tracking and migration timer/path advancement.
* **Parameters:**  
  `dt`: Delta time since last frame.

### `OnSave()` / `OnLoad(data)` / `LoadPostPass(newents, savedata)`
* **Description:** Serialization functions for persistent storage across saves/loads.
* **Parameters (for `OnLoad`/`LoadPostPass`):**  
  `data`: Saved migration data structure.  
  `newents`: Map of GUID→entity for post-load entity attachment.

## Events & Listeners
- Listens for `ms_playerjoined` → Calls `OnPlayerJoined`.
- Listens for `ms_playerleft` → Calls `OnPlayerLeft`.
- Registers `"onremove"` event callbacks on migrated entities to automatically remove them from groups upon entity deletion.