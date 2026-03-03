---
id: migrationmanager
title: Migrationmanager
description: Manages population groups of migratory creatures (e.g., Crystal-Crested Buzzards) by tracking their location in world nodes, migration paths, and group membership.
tags: [migration, world, population]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a5c7d486
system_scope: world
---

# Migrationmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MigrationManager` is a server-side component responsible for simulating and tracking the movement of migratory creature populations across world nodes (biomes). It builds a map of node adjacency and distances from the world topology, maintains groups of creatures (populations) moving between nodes along computed paths, and supports save/load for persistence. Currently used exclusively for Crystal-Crested Buzzards, it is designed to be extensible for other migratory entities.

## Usage example
```lua
-- Add the component to an entity (typically a global or world root instance)
local inst = CreateEntity()
inst:AddComponent("migrationmanager")

-- Define a new migration type (e.g., for buzzards)
inst.components.migrationmanager:CreateMigrationType({
    type = "mutatedbuzzard_gestalt",
    GetMaxGroupPopulation = function() return 10 end,
    GetMigrateTime = function() return 60 end,
    GetMigrateTimeMult = function() return 1 end,
    num_path_nodes = 3,
})

-- Add an entity to migration tracking at its current location
inst.components.migrationmanager:EnterMigration("mutatedbuzzard_gestalt", some_entity)

-- Iterate over all entities in the migration system
inst.components.migrationmanager:ForEachEntityInMigration("mutatedbuzzard_gestalt", function(ent, group)
    print("Entity in group", group.uid, "at node", group.data.current_node)
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `CreateMigrationType(migration_data)`
*   **Description:** Registers a new migration type with associated data (e.g., max group size, migration timing). Called once per migrator species during initialization.
*   **Parameters:**  
    `migration_data` (table) — A table containing keys: `type` (string), `GetMaxGroupPopulation(fn)`, `GetMigrateTime(fn)`, `GetMigrateTimeMult(fn)`, `num_path_nodes` (number), and optionally `CanPopulationGroupMigrate(fn)`, `UpdatePopulationMigrationPath(fn)`.
*   **Returns:** Nothing.

### `GetNewPopulationGroupUID()`
*   **Description:** Returns a unique integer ID for a new population group.
*   **Parameters:** None.
*   **Returns:** number — Unique identifier (monotonically increasing).

### `GetMigrationNodeAtPoint(x, y, z)`
*   **Description:** Returns the world node name (e.g., `"Forest"`) at a given world position.
*   **Parameters:**  
    `x` (number or Vector3) — X coordinate or position vector.  
    `y` (number, optional) — Y coordinate (ignored if `x` is Vector3).  
    `z` (number, optional) — Z coordinate (ignored if `x` is Vector3).
*   **Returns:** string or `nil` — Node identifier, or `nil` if no node found.

### `GetMigrationNodeAtInst(inst)`
*   **Description:** Convenience wrapper to get the node name for an entity’s position.
*   **Parameters:**  
    `inst` (entity) — Entity whose position is queried.
*   **Returns:** string or `nil`.

### `GetDistanceNodeToNode(node1, node2)`
*   **Description:** Returns the precomputed shortest distance (in node hops) between two nodes, if both exist.
*   **Parameters:**  
    `node1`, `node2` (string) — Node identifiers.
*   **Returns:** number or `nil`.

### `CreatePopulationGroup(migrator_type, spawnnode)`
*   **Description:** Creates a new population group for a given migrator type in a specified node.
*   **Parameters:**  
    `migrator_type` (string) — The registered migration type.  
    `spawnnode` (string) — Node identifier where the group starts.
*   **Returns:** number — UID of the newly created group.

### `ClearPopulationGroup(migrator_type, uid)`
*   **Description:** Removes a population group entirely.
*   **Parameters:**  
    `migrator_type` (string)  
    `uid` (number) — Group UID.
*   **Returns:** Nothing.

### `AddEntityToPopulationGroup(group_uid, ent)`
*   **Description:** Registers an entity as part of a population group. Removes it from the scene and marks it as migrator-owned.
*   **Parameters:**  
    `group_uid` (number)  
    `ent` (entity)
*   **Returns:** boolean — `true` if successfully added; `false` if already in a group or group invalid.

### `RemoveEntityFromPopulationGroup(ent)`
*   **Description:** Removes an entity from its current population group. Returns it to the scene and clears its migration UID.
*   **Parameters:**  
    `ent` (entity)
*   **Returns:** boolean — `true` if removed; `false` if not tracked.

### `EnterMigration(migrator_type, ent)`
*   **Description:** Adds an entity to migration tracking at its current node—either joins an existing group (if capacity allows) or starts a new one.
*   **Parameters:**  
    `migrator_type` (string)  
    `ent` (entity)
*   **Returns:** Nothing.

### `MigratePopulationToNextNode(migration_data, population)`
*   **Description:** Advances a population group to the next node in its computed migration path.
*   **Parameters:**  
    `migration_data` (string or table) — Migration type or data table.  
    `population` (table) — Population group structure.
*   **Returns:** Nothing.

### `MigratePopulationToNode(migration_data, population, node)`
*   **Description:** Forces a population group to migrate directly to a specific node, updating its path and timer.
*   **Parameters:**  
    `migration_data` (string or table)  
    `population` (table)  
    `node` (string) — Target node.
*   **Returns:** Nothing.

### `UpdatePopulationMigrationPath(migration_data, population)`
*   **Description:** Updates the migration path for a group, either via a custom function or by appending a random neighbor.
*   **Parameters:**  
    `migration_data` (string or table)  
    `population` (table)
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Main update loop, called periodically (every `1/3` second). Updates player node positions and advances migration timers and paths.
*   **Parameters:**  
    `dt` (number) — Delta time since last update.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes population group state for saving.
*   **Parameters:** None.
*   **Returns:**  
    `data` (table) — Table containing `migrationpopulations` and `lastuid`.  
    `ents` (array of GUIDs) — List of entity GUIDs currently in groups.

### `OnLoad(data)`
*   **Description:** Restores migration state from saved data during load.
*   **Parameters:**  
    `data` (table) — Saved `MigrationManager` state.
*   **Returns:** Nothing.

### `LoadPostPass(newents, savedata)`
*   **Description:** After entities are loaded, re-associates saved entities with their population groups.
*   **Parameters:**  
    `newents` (table) — Map of GUID → entity.  
    `savedata` (table) — Same as passed to `OnLoad`.
*   **Returns:** Nothing.

### `Debug_GetMigrationMap()`
*   **Description:** Returns the internal node adjacency map.
*   **Parameters:** None.
*   **Returns:** table — `_migrationmap`.

### `Debug_GetMigrationPopulations()`
*   **Description:** Returns all population groups.
*   **Parameters:** None.
*   **Returns:** table — `_migrationpopulations`.

## Events & listeners
- **Listens to:**  
  `ms_playerjoined` — Adds new player to active player set and records their initial node.  
  `ms_playerleft` — Removes player from active set.  
  `onremove` (on migrator entities) — Automatically unregisters entity from its group upon removal.
- **Pushes:** None identified.
