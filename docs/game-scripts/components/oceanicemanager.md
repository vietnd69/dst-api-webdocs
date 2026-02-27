---
id: oceanicemanager
title: Oceanicemanager
description: Manages the creation, damage, and destruction of ocean ice tiles in the world, including visual effects, entity interactions, and save/load persistence.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: a7a2b308
---

# Oceanicemanager

## Overview
The `OceanIceManager` component is responsible for managing the lifecycle of ocean ice tiles in the game world. It handles tile creation and removal, tracks tile health, triggers damage effects and visual cracks, handles entities standing on ice during breaking events, and persists state across saves and loads. This component only exists on the master simulation and is attached to the world entity.

## Dependencies & Tags
- **Component Dependency:** None declared via `inst:AddComponent(...)`.
- **Tags Used (Read-only):**
  - `CRACK_MUST_TAGS = {"ice_crack_fx"}` – used to locate crack FX entities for removal.
  - `IGNORE_ICE_DROWNING_ONREMOVE_TAGS = { "ignorewalkableplatforms", "ignorewalkableplatformdrowning", "activeprojectile", "flying", "FX", "DECOR", "INLIMBO" }` – used to filter entities during ice destruction.
  - `FLOATEROBJECT_TAGS = {"floaterobject"}` – used to identify floater objects (e.g., rafts, ice floes) near ice tiles.
- **World Dependencies:** Relies on `TheWorld.Map`, `TheWorld.components.undertile`, and `TheWorld.components.sharkboimanager`.

## Properties
The following public properties are initialized in the constructor. All other state is stored in private module-level grids.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the world entity the component is attached to. |

*Note:* Grids (`_marked_for_delete_grid`, `_ice_health_grid`, `_ice_damage_prefabs_grid`) and map dimensions (`WIDTH`, `HEIGHT`) are private module-scoped variables and not exposed on `self`.

## Main Functions

### `CreateIceAtPoint(x, y, z)`
* **Description:** Creates an ocean ice tile at the specified world coordinates. Converts point coordinates to tile coordinates and delegates to `CreateIceAtTile`. Handles entity launching (e.g., ocean fish, kelp), floater objects, and ice health initialization.
* **Parameters:**
  - `x`, `y`, `z` (`number`): World position where the ice tile is created.

### `CreateIceAtTile(tile_x, tile_y, x, z)`
* **Description:** Creates an ocean ice tile at a specific map tile. Sets the tile to `WORLD_TILES.OCEAN_ICE`, restores the undertile if needed, initializes ice health, and handles launching nearby entities (e.g., fish, kelp, inventory items).
* **Parameters:**
  - `tile_x`, `tile_y` (`number`): Tile coordinates.
  - `x`, `z` (`number`, optional): World X and Z positions used for entity placement if not passed implicitly.

### `QueueCreateIceAtPoint(x, y, z, data)`
* **Description:** Schedules delayed creation of an ocean ice tile. Only queues if no ice currently exists at the point. Uses `TUNING.OCEAN_ICE_TILE_HEALTH` (note: typo in source, likely meant to be `TUNING.OCEAN_ICE_HEALTH`) as initial health.
* **Parameters:**
  - `x`, `y`, `z` (`number`): World position to queue ice creation.
  - `data` (`table`, optional): Contains optional `base_time` and `random_time` to control delay timing.

### `DestroyIceAtPoint(x, y, z, data)`
* **Description:** Immediately destroys the ocean ice tile at the given point, replaces it with the underlying tile (e.g., ocean swell), removes damage FX, spawns debris/ice-pop effects, and handles entities standing on the tile (e.g., creating ice floes, drowning logic, entity saving).
* **Parameters:**
  - `x`, `y`, `z` (`number`): World position to destroy.
  - `data` (`table`, optional): Contains flags like `silent` (suppresses FX) and `icefloe_prefab` (custom ice floe prefab).

### `QueueDestroyForIceAtPoint(x, y, z, data)`
* **Description:** Schedules ice tile destruction after a short delay (e.g., crack animation). Marks the tile for deletion, spawns crack FX, triggers `abandon_ship`/`onpresink` events for entities, and schedules the actual `destroy_ice_at_point` task.
* **Parameters:**
  - `x`, `y`, `z` (`number`): World position to queue for destruction.
  - `data` (`table`, optional): Contains optional `destroytime` to override default delay.

### `DamageIceAtPoint(x, y, z, damage)`
* **Description:** Damages the ice tile at a world point by a specified amount. Delegates to `DamageIceAtTile`.
* **Parameters:**
  - `x`, `y`, `z` (`number`): World position to damage.
  - `damage` (`number`): Amount of health to subtract.

### `DamageIceAtTile(tx, ty, damage)`
* **Description:** Damages the ice tile at tile coordinates. Updates health in the `_ice_health_grid`, spawns or updates the `oceanice_damage` FX prefab, and queues destruction if health reaches 0.
* **Parameters:**
  - `tx`, `ty` (`number`): Tile coordinates.
  - `damage` (`number`): Amount of health to subtract.

### `SpawnDamagePrefab(tile_index, health)`
* **Description:** Spawns or updates the `oceanice_damage` FX prefab on the tile based on current health percentage. If ice is fully healthy, removes existing damage FX.
* **Parameters:**
  - `tile_index` (`number`): Grid index for the tile.
  - `health` (`number`): Current health value.

### `FixupFloaterObjects(x, z, tile_radius_plus_overhang, is_ocean_tile)`
* **Description:** Updates floater objects near the ice tile to reflect whether they are now on solid ground (ice) or water. Triggers `on_landed` or `on_no_longer_landed` events accordingly.
* **Parameters:**
  - `x`, `z` (`number`): Center of the tile for entity search.
  - `tile_radius_plus_overhang` (`number`): Search radius (includes overhang).
  - `is_ocean_tile` (`boolean`): Whether the tile is now ocean.

### `OnSave()`
* **Description:** Serializes the ice grid states (`marked_for_delete` and `ice_health`) and returns compressed, encoded save data.
* **Returns:** `string` – Zip-compressed and Base64-encoded save data.

### `OnLoad(data)`
* **Description:** Restores ice grid state from save data. Reinitializes cracked/destruction tasks for tiles marked for deletion, and spawns damage FX for tiles with non-zero health.
* **Parameters:**
  - `data` (`string`): Encoded save data to load.

## Events & Listeners
- **Listens to:**
  - `"worldmapsetsize"` on `TheWorld` → triggers `initialize_grids()` to initialize data grids when map size is known.

- **Emits:**
  - `"icefloebreak"` on `TheWorld` → when an ice floe is successfully spawned after ice breaks.