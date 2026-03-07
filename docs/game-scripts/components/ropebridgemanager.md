---
id: ropebridgemanager
title: Ropebridgemanager
description: Manages rope bridge creation, destruction, health tracking, and earthquake damage response across the world grid.
tags: [world, map, physics, entity, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: b891c293
system_scope: world
---

# Ropebridgemanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Ropebridgemanager` is a server-side component responsible for managing the lifecycle of rope bridges in the world. It maintains a grid-based state for bridge tiles—including health, direction, and destruction state—and handles creation, damage, scheduled destruction (e.g., due to aging or quakes), and visualFX. It integrates closely with `undertile` to preserve underlying tile data during bridge placement and removal. The component responds to world-level `startquake` events by applying uniform damage to unshielded bridges, scanning for `quake_blocker` entities to determine protected segments.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("ropebridgemanager")
inst:OnPostInit()

-- Create a rope bridge at a point
inst.components.ropebridgemanager:CreateRopeBridgeAtPoint(x, y, z, {x=1, z=0}, 0)

-- Damage a bridge tile
inst.components.ropebridgemanager:DamageRopeBridgeAtPoint(x, y, z, 10)

-- Queue destruction (e.g., due to breakage or timer)
inst.components.ropebridgemanager:QueueDestroyForRopeBridgeAtPoint(x, y, z, { destroytime = 1 * FRAMES })
```

## Dependencies & tags
**Components used:** `undertile` (accessed via `_world.components.undertile`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (none) | Entity owning this component (typically `TheWorld`). |
| `WIDTH`, `HEIGHT` | `number` | `nil` (initialized on world map set) | Dimensions of the world grid in tiles. |
| `marked_for_delete_grid` | `DataGrid` | `nil` | Tracks tiles scheduled for imminent destruction. |
| `duration_grid` | `DataGrid` | `nil` | Stores per-tile bridge health, direction, and optional icon offset as `{health, direction, icon_offset}`. |
| `damage_prefabs_grid` | `DataGrid` | `nil` | Holds references to `dock_damage` prefabs per bridge tile. |
| `bridge_anims_grid` | `DataGrid` | `nil` | Holds references to `rope_bridge_fx` FX prefabs per bridge tile. |
| `DEFAULT_BREAKDATA` | `table` | (see constructor) | Default timing parameters for bridge break FX and cleanup. |

## Main functions
### `CreateRopeBridgeAtPoint(x, y, z, direction, icon_offset)`
*   **Description:** Places a rope bridge tile at world coordinates `(x, y, z)`, updating the tile layer and recording metadata in internal grids. Calls `CreateRopeBridgeAtTile`.
*   **Parameters:**  
    `x`, `y`, `z` (numbers) – World position.  
    `direction` (table with `x`, `z` keys) – Unit vector indicating bridge orientation.  
    `icon_offset` (number) – Offset for visual icon alignment.
*   **Returns:** `true` on success.

### `CreateRopeBridgeAtTile(tile_x, tile_y, x, z, direction, icon_offset)`
*   **Description:** Internal implementation for bridge creation at tile coordinates. Updates tile type, ensures undertile consistency, initializes grid state, and spawns visualFX.
*   **Parameters:**  
    `tile_x`, `tile_y` (integers) – Tile coordinates.  
    `x`, `z` (numbers) – World coordinates (optional; computed if `nil`).  
    `direction`, `icon_offset` – As above.
*   **Returns:** `true` on success.

### `QueueCreateRopeBridgeAtPoint(x, y, z, data)`
*   **Description:** Schedules delayed bridge creation (for procedural/worldgen pacing), adding tile metadata to `duration_grid` and spawning creation after a randomized delay.
*   **Parameters:**  
    `x`, `y`, `z` (numbers) – Position.  
    `data` (table, optional) – May contain `base_time`, `random_time`, `direction`, `icon_offset`.
*   **Returns:** `nil`.

### `DestroyRopeBridgeAtPoint(x, y, z, data)`
*   **Description:** Immediately removes the rope bridge tile at world position, restoring underlying tile and cleaning up all associated state (grid, FX, damage prefabs).
*   **Parameters:**  
    `x`, `y`, `z` (numbers) – Position.  
    `data` (table, optional) – Not used in this method.
*   **Returns:** `true` if a bridge existed at the point; `false` otherwise.

### `QueueDestroyForRopeBridgeAtPoint(x, y, z, data)`
*   **Description:** Schedules bridge destruction after a delay with visual/auditory cues (shake, warning), used for dynamic breakage (e.g., quakes or overloading). Marks tile in `marked_for_delete_grid` to prevent duplicate destruction.
*   **Parameters:**  
    `x`, `y`, `z` (numbers) – Position.  
    `data` (table, optional) – Timing overrides (`fxtime`, `shaketime`, `destroytime`); defaults to `DEFAULT_BREAKDATA`.
*   **Returns:** `nil`.

### `DamageRopeBridgeAtPoint(x, y, z, damage)`
*   **Description:** Applies damage to a bridge tile at world coordinates; triggers destruction if health reaches `0`. Calls `DamageRopeBridgeAtTile`.
*   **Parameters:**  
    `x`, `y`, `z` (numbers) – Position.  
    `damage` (number) – Damage amount.
*   **Returns:** New health value (number) or `nil` if tile is already at `0` health or nonexistent.

### `DamageRopeBridgeAtTile(tx, ty, damage)`
*   **Description:** Internal damage implementation at tile coordinates. Updates `duration_grid` health value, spawns or updates `dock_damage` prefab based on health percentage, and queues destruction if `new_health == 0`.
*   **Parameters:**  
    `tx`, `ty` (integers) – Tile coordinates.  
    `damage` (number).
*   **Returns:** New health value (number) or `nil`.

### `OnQuaked()`
*   **Description:** Applies earthquake damage to all bridge tiles in `duration_grid`, skipping those covered by a `quake_blocker` entity.
*   **Parameters:** None.
*   **Returns:** `nil`.

### `OnStartQuake(data)`
*   **Description:** Callback triggered by `startquake` event; schedules `OnQuaked` after an optional debris delay.
*   **Parameters:**  
    `data` (table, optional) – May contain `debrisperiod` (delay before damage).
*   **Returns:** `nil`.

### `SpawnBridgeAnim(tile_index, x, z, direction, icon_offset)`
*   **Description:** Spawns and positions `rope_bridge_fx` prefab if none exists at the tile index. Sets orientation based on direction.
*   **Parameters:**  
    `tile_index` (integer) – Index in `bridge_anims_grid`.  
    `x`, `z` (numbers) – World position.  
    `direction`, `icon_offset` – As in creation.
*   **Returns:** `nil`.

### `SpawnDamagePrefab(tile_index, health)`
*   **Description:** Creates or updates a `dock_damage` FX prefab at the tile to visually indicate bridge degradation.
*   **Parameters:**  
    `tile_index` (integer).  
    `health` (number).
*   **Returns:** `nil`.

### `OnSave()`
*   **Description:** Serializes `marked_for_delete_grid` and `duration_grid` into a zip-encoded save table.
*   **Parameters:** None.
*   **Returns:** Encoded save data (table).

### `OnLoad(data)`
*   **Description:** Loads grid state from save data, reconstructs bridge tiles and animations, and restarts pending destruction tasks if tiles were marked for deletion.
*   **Parameters:**  
    `data` (table) – Encoded save data from `OnSave`.
*   **Returns:** `nil`.

### `IsPointProtectedFromQuakes(x, y, z)`
*   **Description:** Helper that checks if a point is within `TUNING.QUAKE_BLOCKER_RANGE` of an entity with tag `quake_blocker`.
*   **Parameters:**  
    `x`, `y`, `z` (numbers) – World position.
*   **Returns:** `true` if protected; `false` otherwise.

### `CalculateProtection_Internal(protected, i, tile_data)`
*   **Description:** Scans tile direction to determine if the entire bridge segment is protected (all tiles must be checked for any `quake_blocker` proximity). Marks all tiles in the bridge as protected/unprotected in the `protected` array.
*   **Parameters:**  
    `protected` (table) – Output table indexed by grid index.  
    `i` (integer) – Current grid index.  
    `tile_data` (table) – `{health, direction}` entry.
*   **Returns:** `nil`.

## Events & listeners
- **Listens to:**  
  `worldmapsetsize` (on `TheWorld`) – Initializes grid dimensions.  
  `startquake` (on `TheWorld.net`) – Triggers bridge damage via `OnStartQuake`.
- **Pushes:** None.
