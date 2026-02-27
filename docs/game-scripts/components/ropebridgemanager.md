---
id: ropebridgemanager
title: Ropebridgemanager
description: Manages the creation, destruction, health, and earthquake resilience of rope bridges in the game world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: b891c293
---

# Ropebridgemanager

## Overview
The `RopebridgeManager` component is responsible for managing the full lifecycle of rope bridges in the game world—including their placement, health tracking, scheduled destruction (including timed拆除), visual effects, and earthquake damage response. It operates exclusively on the master simulation and uses multiple data grids to store tile-level metadata such as bridge health, direction, destruction state, and associated FX prefabs.

## Dependencies & Tags
- **Component**: None explicitly added via `AddComponent`; relies on `TheWorld` and `TheSim` APIs.
- **Event Listeners**: Listens for `"worldmapsetsize"` (to initialize grids) and `"startquake"` (to trigger earthquake response).
- **Tags Used Internally**: `"quake_blocker"` (to detect shielded zones for quake protection).
- **No tags are added to the host entity (`self.inst`)**.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in) | Reference to the component host (typically `TheWorld` or a world proxy). |
| `WIDTH`, `HEIGHT` | `number` | derived from map size | Dimensions of the map grid. Initialized via `"worldmapsetsize"` event. |
| `marked_for_delete_grid` | `DataGrid` | `nil` → initialized lazily | Tracks tiles marked for pending rope bridge destruction. |
| `duration_grid` | `DataGrid` | `nil` → initialized lazily | Stores tile data as `{health, direction, [icon_offset?]}` for active rope bridges. |
| `damage_prefabs_grid` | `DataGrid` | `nil` → initialized lazily | Stores reference to `"dock_damage"` prefabs for visual damage feedback. |
| `bridge_anims_grid` | `DataGrid` | `nil` → initialized lazily | Stores `"rope_bridge_fx"` prefabs for bridge animations. |
| `DEFAULT_BREAKDATA` | `table` | see code | Precomputed break timing values: `fxtime`, `shaketime`, and `destroytime`. |

## Main Functions

### `IsPointProtectedFromQuakes(x, y, z)`
* **Description:** Checks whether the given world point is shielded from earthquake damage (e.g., by a `"quake_blocker"` entity within range).
* **Parameters:**
  * `x, y, z` (number): World coordinates.

### `CalculateProtection_Internal(protected, i, tile_data)`
* **Description:** Determines whether a specific rope bridge tile is protected from earthquake damage, and propagates that protection to the entire bridge (via directional scanning). Updates the `protected` table in-place.
* **Parameters:**
  * `protected` (table): Map from grid index → boolean (updated in-place).
  * `i` (number): Grid index of the current tile.
  * `tile_data` (table): `{health, direction, ...}` entry from `duration_grid`.

### `OnQuaked()`
* **Description:** Executes earthquake damage: calculates protection per bridge, then damages unprotected tiles.
* **Parameters:** None.

### `OnStartQuake(data)`
* **Description:** Schedules `OnQuaked()` to run after a delay (based on `data.debrisperiod` or 0), allowing for visual buildup before quake effects.
* **Parameters:**
  * `data` (table, optional): May contain `debrisperiod` (seconds to delay).

### `OnPostInit()`
* **Description:** Registers `"startquake"` listener on the world’s network component.

### `CreateRopeBridgeAtPoint(x, y, z, direction, icon_offset)`
* **Description:** Instantiates a rope bridge at a world point, updating tile data and spawning FX. Converts coordinates to tile space.
* **Parameters:**
  * `x, y, z` (number): World coordinates.
  * `direction` (Vector3 or table): Bridge direction vector (e.g., `{x=1, z=0}`).
  * `icon_offset` (number, optional): Offset used by FX for icon alignment.

### `CreateRopeBridgeAtTile(tile_x, tile_y, x, z, direction, icon_offset)`
* **Description:** Internal helper for `CreateRopeBridgeAtPoint`; operates directly on tile coordinates.
* **Parameters:**
  * `tile_x, tile_y` (number): Tile coordinates.
  * `x, z` (number, optional): World X/Z used for FX positioning.
  * `direction` (Vector3/table)
  * `icon_offset` (number, optional)

### `QueueCreateRopeBridgeAtPoint(x, y, z, data)`
* **Description:** Schedules bridge creation with randomized delay for smoother multiplayer sync.
* **Parameters:**
  * `x, y, z` (number): World coordinates.
  * `data` (table, optional): May include `base_time`, `random_time`, `direction`, `icon_offset`.

### `DestroyRopeBridgeAtPoint(x, y, z, data)`
* **Description:** Immediately destroys a rope bridge tile (if present), restoring the underlying tile, removing FX/damage prefabs, and updating grids.
* **Parameters:**
  * `x, y, z` (number): World coordinates.
  * `data` (table, optional): Unused (reserved for future extensibility).
* **Returns:** `true` if a bridge existed and was destroyed; `false` otherwise.

### `QueueDestroyForRopeBridgeAtPoint(x, y, z, data)`
* **Description:** Schedules a timed rope bridge destruction with visual warnings (shake, FX, warning UI). Also sets `marked_for_delete`.
* **Parameters:**
  * `x, y, z` (number): World coordinates.
  * `data` (table, optional): Allows override of `destroytime`, `fxtime`, `shaketime`.

### `DamageRopeBridgeAtPoint(x, y, z, damage)`
* **Description:** Delegates to `DamageRopeBridgeAtTile`, converts world point to tile coordinates.
* **Parameters:**
  * `x, y, z` (number): World coordinates.
  * `damage` (number): Health to subtract.

### `DamageRopeBridgeAtTile(tx, ty, damage)`
* **Description:** Applies damage to a rope bridge at tile coordinates; reduces health, spawns/updates damage FX, and auto-queues destruction if health reaches 0.
* **Parameters:**
  * `tx, ty` (number): Tile coordinates.
  * `damage` (number)
* **Returns:** New health value (0–`TUNING.ROPEBRIDGE_HEALTH`) or `nil` if tile had no bridge.

### `SpawnDamagePrefab(tile_index, health)`
* **Description:** Spawns or updates `"dock_damage"` prefab to visually represent bridge health loss.
* **Parameters:**
  * `tile_index` (number): Grid index.
  * `health` (number): Current bridge health.

### `SpawnBridgeAnim(tile_index, x, z, direction, icon_offset)`
* **Description:** Spawns `"rope_bridge_fx"` prefab with correct rotation (based on direction) and icon offset.
* **Parameters:**
  * `tile_index` (number): Grid index.
  * `x, z` (number): World X/Z for position.
  * `direction` (Vector3/table)
  * `icon_offset` (number, optional)

### `OnSave()`
* **Description:** Serializes `marked_for_delete_grid` and `duration_grid` into a zip+base64 string for save data.

### `OnLoad(data)`
* **Description:** Loads and reconstructs bridge state from save data:
  * Restarts pending destructions (`marked_for_delete`).
  * Re-spawns FX and damage prefabs for loaded bridge tiles.
* **Parameters:**
  * `data` (string): Encoded save data.

## Events & Listeners
- **Listens for:**
  - `"worldmapsetsize"` → calls `initialize_grids`
  - `"startquake"` on `_world.net` → calls `OnStartQuake`
- **Pushes / Triggers no events** (does not call `inst:PushEvent`).