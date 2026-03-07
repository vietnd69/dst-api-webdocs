---
id: dockmanager
title: Dockmanager
description: Manages the creation, destruction, health tracking, and structural integrity of monkey docks on Monkey Island maps.
tags: [map, structure, destroy, health, integrity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 162e7a2d
system_scope: world
---

# Dockmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DockManager` maintains the lifecycle of monkey docks in Monkey Island zones. It manages tile placement, health tracking, structural connectivity (via root detection using BFS), and safe destruction with debris and entity disposal logic. It operates exclusively on the master simulation and coordinates with the map, undertile, and inventory components to handle entity reactions during dock failures.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("dockmanager")

-- Create a dock tile at world coordinates
inst.components.dockmanager:CreateDockAtPoint(x, y, z, WORLD_TILES.MONKEY_DOCK)

-- Damage a dock tile (triggers destruction when health reaches 0)
inst.components.dockmanager:DamageDockAtPoint(x, y, z, 50)

-- Force structural integrity test on a dock tile
inst.components.dockmanager:ResolveDockSafetyAtPoint(x, y, z)
```

## Dependencies & tags
**Components used:** `undertile`, `inventoryitem`, `drownable`, `amphibiouscreature` (via `components.X` checks and calls).  
**Tags:** Uses and respects `IGNORE_DOCK_DROWNING_ONREMOVE_TAGS` (`ignorewalkableplatforms`, `ignorewalkableplatformdrowning`, `activeprojectile`, `flying`, `FX`, `DECOR`, `INLIMBO`) to control entity behavior during destruction.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity instance the component is attached to. |
| `_is_root_grid` | `DataGrid` | `nil` | Stores boolean flags indicating whether each tile is a dock root (connected to land). Initialized on map resize. |
| `_marked_for_delete_grid` | `DataGrid` | `nil` | Stores boolean flags indicating docks queued for delayed destruction. |
| `_dock_health_grid` | `DataGrid` | `nil` | Stores current health values for dock tiles. |
| `_dock_damage_prefabs_grid` | `DataGrid` | `nil` | Stores references to `dock_damage` prefabs used for visual health feedback. |
| `WIDTH`, `HEIGHT` | `number` | `nil` | Dimensions of the map, set after `"worldmapsetsize"` event. |

## Main functions
### `CreateDockAtPoint(x, y, z, dock_tile_type)`
*   **Description:** Creates a dock tile at the given world coordinates by setting the map tile and initializing dock metadata.
*   **Parameters:**  
    `x`, `y`, `z` (number) — World coordinates where the dock is placed.  
    `dock_tile_type` (number) — The `WORLD_TILES` constant representing the dock tile type (e.g., `WORLD_TILES.MONKEY_DOCK`).
*   **Returns:** `true` on success.
*   **Error states:** None documented.

### `DestroyDockAtPoint(x, y, z, dont_toss_loot)`
*   **Description:** Immediately destroys a dock tile at the specified point, handles entity drowning/displacement, and initiates structural integrity checks on adjacent docks. Spawns visual FX and debris if `dont_toss_loot` is false.
*   **Parameters:**  
    `x`, `y`, `z` (number) — World coordinates of the dock to destroy.  
    `dont_toss_loot` (boolean, optional) — When `true`, suppresses FX and debris.
*   **Returns:** `true` if a dock tile existed and was destroyed; `false` otherwise.
*   **Error states:** Returns `false` if the tile at coordinates is not a `MONKEY_DOCK`.

### `QueueDestroyForDockAtPoint(x, y, z, dont_toss_loot)`
*   **Description:** Schedules a dock tile for destruction after a short random delay, simulating progressive decay. Spawns crackle FX and sends `"abandon_ship"`/`"onpresink"` events to entities on the tile.
*   **Parameters:**  
    `x`, `y`, `z` (number) — World coordinates of the dock to destroy.  
    `dont_toss_loot` (boolean, optional) — Suppresses FX and debris.
*   **Returns:** Nothing.

### `ResolveDockSafetyAtPoint(x, y, z)`
*   **Description:** Triggers an immediate structural integrity test for the dock at the given coordinates. Destroys disconnected docks via `_TestForBreaking`.
*   **Parameters:**  
    `x`, `y`, `z` (number) — World coordinates to test.
*   **Returns:** `true` if any dock tiles were destroyed as a result; `false` otherwise.

### `DamageDockAtTile(tx, ty, damage)`
*   **Description:** Reduces the health of a dock tile by the specified damage amount. Triggers destruction queue if health reaches zero.
*   **Parameters:**  
    `tx`, `ty` (number) — Tile coordinates (grid space) of the dock.  
    `damage` (number) — Amount of damage to apply.
*   **Returns:** The updated health value (`number`) on success; `nil` if no dock data exists or tile was already broken.

### `GetCoordsFromIndex(index)`
*   **Description:** Converts a linear grid index back to tile coordinates (x, z).
*   **Parameters:** `index` (number) — Linear index in the data grid.
*   **Returns:** `x` (number), `z` (number) — Tile coordinates.

### `SpawnDamagePrefab(tile_index, health)`
*   **Description:** Manages the `dock_damage` visual prefab per tile based on remaining health. Spawns or removes the prefab as health changes.
*   **Parameters:**  
    `tile_index` (number) — Linear index in the health grid.  
    `health` (number) — Current health value for the tile.
*   **Returns:** Nothing.

## Save/Load functions
### `OnSave()`
*   **Description:** Serializes dock metadata grids (`_is_root_grid`, `_marked_for_delete_grid`, `_dock_health_grid`) into compressed save data.
*   **Returns:** String — Zip-encoded and base64-encoded save data.

### `OnLoad(data)`
*   **Description:** Loads and restores dock metadata grids from save data, and resumes pending destruction tasks for tiles marked for deletion.
*   **Parameters:**  
    `data` (string) — Zip-encoded and base64-encoded save data from `OnSave`.
*   **Returns:** Nothing.
*   **Error states:** Gracefully returns early if data is invalid (`nil` after decoding).

## Events & listeners
- **Listens to:**  
  `"worldmapsetsize"` — Initializes the dock metadata grids (`_is_root_grid`, `_marked_for_delete_grid`, `_dock_health_grid`, `_dock_damage_prefabs_grid`) when the map size changes.

- **Pushes:**  
  No direct event pushes are performed by `DockManager`. Entity events like `"onsink"`, `"abandon_ship"`, `"onpresink"`, `"on_landed"`, `"on_no_longer_landed"` are pushed to affected entities via their components, not via `DockManager` directly.
