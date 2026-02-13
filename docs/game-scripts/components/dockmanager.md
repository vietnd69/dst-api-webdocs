---
id: dockmanager
title: Dockmanager
description: Manages the creation, destruction, health, and structural integrity of dock tiles within the world.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# Dockmanager

## Overview
This component is responsible for managing the lifecycle and state of dock tiles throughout the game world. It handles the creation of new dock tiles, their structural integrity and health, and their eventual destruction. A key feature is its ability to identify "root" dock tiles (those adjacent to solid land) and determine if disconnected dock segments should break apart and decay into the ocean. It also manages visual damage indicators and handles the consequences of dock destruction for entities on them.

## Dependencies & Tags
This component implicitly relies on `TheWorld` and its `Map` and `undertile` components. It does not add or remove any specific tags from the entity it is attached to.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | `self` | The entity instance this component is attached to. |

## Main Functions
### `CreateDockAtPoint(x, y, z, dock_tile_type)`
*   **Description:** Creates a dock tile at the specified world coordinates. It converts the world coordinates to tile coordinates and then calls `CreateDockAtTile`.
*   **Parameters:**
    *   `x`: (number) The X-coordinate in the world.
    *   `y`: (number) The Y-coordinate in the world (usually 0).
    *   `z`: (number) The Z-coordinate in the world.
    *   `dock_tile_type`: (number) The `WORLD_TILES` ID for the dock tile to be created.

### `CreateDockAtTile(tile_x, tile_y, dock_tile_type)`
*   **Description:** Creates a dock tile at the specified tile coordinates. It sets the map tile, handles the `undertile` component if present, and generates necessary dock data (root status, health) for the new tile.
*   **Parameters:**
    *   `tile_x`: (number) The X-coordinate of the tile on the map grid.
    *   `tile_y`: (number) The Y-coordinate of the tile on the map grid.
    *   `dock_tile_type`: (number) The `WORLD_TILES` ID for the dock tile to be created.

### `DestroyDockAtPoint(x, y, z, dont_toss_loot)`
*   **Description:** Immediately destroys a dock tile at the specified world coordinates, converting it back to its underlying tile (usually ocean). It removes damage prefabs, clears dock data, triggers visual/audio effects, and causes entities on the dock to sink or move to shore. It also initiates a check for adjacent docks that might become disconnected and need to be destroyed.
*   **Parameters:**
    *   `x`: (number) The X-coordinate in the world.
    *   `y`: (number) The Y-coordinate in the world (usually 0).
    *   `z`: (number) The Z-coordinate in the world.
    *   `dont_toss_loot`: (boolean, optional) If true, no debris or loot will be spawned when the dock is destroyed.

### `QueueDestroyForDockAtPoint(x, y, z, dont_toss_loot)`
*   **Description:** Initiates a timed destruction sequence for a dock tile at the specified world coordinates. It marks the tile for deletion, spawns a cracking visual effect, and schedules the actual destruction via `destroy_dock_at_point` after a delay. It also pushes "abandon_ship" and "onpresink" events to entities currently on the dock.
*   **Parameters:**
    *   `x`: (number) The X-coordinate in the world.
    *   `y`: (number) The Y-coordinate in the world (usually 0).
    *   `z`: (number) The Z-coordinate in the world.
    *   `dont_toss_loot`: (boolean, optional) Passed to `DestroyDockAtPoint` when the delayed destruction occurs.

### `ResolveDockSafetyAtPoint(x, y, z)`
*   **Description:** Checks if the dock tile at the given world coordinates is structurally sound or if it has become disconnected from a "root" (land-adjacent) dock segment and needs to be destroyed. This function can trigger the destruction of the dock if it's unsafe.
*   **Parameters:**
    *   `x`: (number) The X-coordinate in the world.
    *   `y`: (number) The Y-coordinate in the world (usually 0).
    *   `z`: (number) The Z-coordinate in the world.

### `DamageDockAtPoint(x, y, z, damage)`
*   **Description:** Applies damage to the dock tile at the specified world coordinates. If the dock's health drops to 0 or below, it queues the dock for destruction. It also updates or spawns a visual damage prefab.
*   **Parameters:**
    *   `x`: (number) The X-coordinate in the world.
    *   `y`: (number) The Y-coordinate in the world (usually 0).
    *   `z`: (number) The Z-coordinate in the world.
    *   `damage`: (number) The amount of damage to apply.

### `DamageDockAtTile(tx, ty, damage)`
*   **Description:** Applies damage to the dock tile at the specified tile coordinates. If the dock's health drops to 0 or below, it queues the dock for destruction. It also updates or spawns a visual damage prefab.
*   **Parameters:**
    *   `tx`: (number) The X-coordinate of the tile on the map grid.
    *   `ty`: (number) The Y-coordinate of the tile on the map grid.
    *   `damage`: (number) The amount of damage to apply.

### `GetCoordsFromIndex(index)`
*   **Description:** Converts a 1D grid index back into 2D tile coordinates (X, Z).
*   **Parameters:**
    *   `index`: (number) The 1D index within the data grid.

### `SpawnDamagePrefab(tile_index, health)`
*   **Description:** Spawns or updates a visual "dock_damage" prefab at the given tile index based on the current health of the dock. If health is full, any existing damage prefab is removed.
*   **Parameters:**
    *   `tile_index`: (number) The 1D index of the tile within the data grid.
    *   `health`: (number) The current health value of the dock tile.

### `OnSave()`
*   **Description:** Gathers and serializes the current state of the dock data grids (`_is_root_grid`, `_marked_for_delete_grid`, `_dock_health_grid`) for saving.
*   **Parameters:** None.

### `OnLoad(data)`
*   **Description:** Deserializes and restores the state of the dock data grids from saved data. If a dock was marked for deletion during save, its destruction process is re-queued. Existing damage prefabs are also re-spawned based on loaded health.
*   **Parameters:**
    *   `data`: (table) The table containing the saved component data.

## Events & Listeners
*   **Listens For:**
    *   `worldmapsetsize` (from `_world`): Triggers `initialize_grids` to set up or resize the internal data grids when the world map dimensions change.
*   **Pushes/Triggers:**
    *   `onsink` (on relevant entities during `DestroyDockAtPoint`): Indicates an entity is sinking, potentially with a boat and a target shore point.
    *   `abandon_ship` (on relevant entities during `QueueDestroyForDockAtPoint`): Notifies entities on a dock that it is about to be destroyed.
    *   `onpresink` (on entities with the "player" tag during `QueueDestroyForDockAtPoint`): A specific notification for players before a dock sinks.