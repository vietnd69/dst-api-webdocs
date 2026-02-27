---
id: vinebridgemanager
title: Vinebridgemanager
description: Manages the creation, destruction, damage, and persistence of Charlie's vine bridges in the game world.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 0c578d02
---

# Vinebridgemanager

## Overview
The `VineBridgeManager` component is responsible for managing vine bridges in the game world—handling their creation, degradation, destruction, visual effects, and state persistence. It operates exclusively on the master simulation (server) and stores bridge state in grid-based data structures aligned with map tiles. Vine bridges are temporary terrain structures that break after being damaged or after a delay, and this component ensures proper tile updates, floating object repositioning, and save/load compatibility.

## Dependencies & Tags
- **Component Constraint**: Requires `TheWorld.ismastersim`; fails assertion on client.
- **Events Listened**: `"worldmapsetsize"` → initializes grids.
- **Tags Used Internally**:
  - `IGNORE_DROWNING_ONREMOVE_TAGS`: `{ "ignorewalkableplatforms", "ignorewalkableplatformdrowning", "activeprojectile", "flying", "FX", "DECOR", "INLIMBO" }` (used in logic related to drowning but not applied directly on the entity).
  - `FLOATEROBJECT_TAGS`: `{ "floaterobject" }`.
- **No components added or removed** from `inst`; it acts as a utility bound to the world instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this component is attached to (typically the world instance). |
| `WIDTH`, `HEIGHT` | `number` | `nil` → set on `"worldmapsetsize"` | World dimensions in tiles. |
| `marked_for_delete_grid` | `DataGrid` | `nil` | Tracks tiles scheduled for vine bridge destruction. |
| `duration_grid` | `DataGrid` | `nil` | Stores per-tile bridge health (index 1) and direction (index 2) as `{health, direction}`. |
| `damage_prefabs_grid` | `DataGrid` | `nil` | Holds references to damage visualization prefabs per tile. |
| `bridge_anims_grid` | `DataGrid` | `nil` | Holds references to `vine_bridge_fx` prefabs (visuals) per tile. |

*No public instance variables are initialized in `_ctor` except `inst`; grids are lazily initialized on map size change.*

## Main Functions

### `CreateVineBridgeAtPoint(x, y, z, direction)`
* **Description:** Creates a vine bridge at the specified world position by converting to tile coordinates, updating the tile type, initializing health/direction, spawning visuals, and adjusting floater objects. Returns `true` on success.
* **Parameters:**
  - `x`, `y`, `z` (`number`): World coordinates where the bridge is placed.
  - `direction` (`Vector3` or similar): Unit direction vector indicating bridge orientation (used to rotate FX).

### `CreateVineBridgeAtTile(tile_x, tile_y, x, z, direction)`
* **Description:** Internal variant of `CreateVineBridgeAtPoint`; sets tile to `WORLD_TILES.CHARLIE_VINE`, preserves underlying tile (undertile), updates grids, spawns FX, and adjusts floater objects. Used directly in save/load and internal callbacks.
* **Parameters:**
  - `tile_x`, `tile_y` (`number`): Tile coordinates.
  - `x`, `z` (`number`): Optional world coordinates (if missing, computed from tile center).
  - `direction` (`Vector3`): Bridge direction vector.

### `QueueCreateVineBridgeAtPoint(x, y, z, data)`
* **Description:** Schedules a vine bridge to be created after a randomized delay (default ~0.5–0.8 sec). Does not overwrite an existing bridge. Accepts optional `data` to override timing/direction.
* **Parameters:**
  - `x`, `y`, `z` (`number`): World position.
  - `data` (`table?`, optional): May contain `base_time`, `random_time`, and `direction`.

### `DestroyVineBridgeAtPoint(x, y, z, data)`
* **Description:** Immediately destroys a vine bridge at the given position (if present), restoring the underlying tile, removing FX/damage prefabs, and updating grids. Returns `true` if destroyed, `false` otherwise.
* **Parameters:**
  - `x`, `y`, `z` (`number`): World position of bridge to destroy.
  - `data` (`table?`, unused in current implementation).

### `QueueDestroyForVineBridgeAtPoint(x, y, z, data)`
* **Description:** Schedules delayed destruction of a vine bridge with optional FX timing overrides. Marks the tile for deletion, sets a countdown timer, triggers visual warnings (e.g., shaking, tile change warning), and spawns the actual destroy callback.
* **Parameters:**
  - `x`, `y`, `z` (`number`): World position.
  - `data` (`table?`, optional): May include `destroytime`, `fxtime`, `shaketime`.

### `DamageVineBridgeAtPoint(x, y, z, damage)`
* **Description:** Delegates to `DamageVineBridgeAtTile` using tile coordinates from world position. Handles bridge health reduction and queued destruction if health reaches 0.
* **Parameters:**
  - `x`, `y`, `z` (`number`): World position of bridge.
  - `damage` (`number`): Health amount to subtract.

### `DamageVineBridgeAtTile(tile_x, tile_y, damage)`
* **Description:** Reduces health of the bridge at the given tile, updates the `duration_grid`, spawns or updates visual damage indicator (e.g., partially broken FX), and queues destruction if health is exhausted. Returns new health value or `nil`.
* **Parameters:**
  - `tile_x`, `tile_y` (`number`): Tile coordinates.
  - `damage` (`number`): Health amount to subtract.

### `FixupFloaterObjects(x, z, tile_radius_plus_overhang, is_ocean_tile)`
* **Description:** Iterates over nearby floater objects (e.g., driftwood), updates their `on_landed`/`on_no_longer_landed` events based on whether the tile is ocean, ensuring correct floating behavior near vine bridges.
* **Parameters:**
  - `x`, `z` (`number`): Center position to search around.
  - `tile_radius_plus_overhang` (`number`): Search radius.
  - `is_ocean_tile` (`boolean`): Whether the tile type is ocean.

### `OnSave()`
* **Description:** serializes `marked_for_delete_grid` and `duration_grid` grids, compresses and encodes them for storage.
* **Returns:** `string` (encoded save data).

### `OnLoad(data)`
* **Description:** Restores grids from save data, re-spawns visuals and FX, and restarts pending destruction tasks for tiles marked for deletion. Includes backward compatibility for older grid formats.
* **Parameters:**
  - `data` (`string`): Encoded save data.

## Events & Listeners
- **Listens for:**
  - `"worldmapsetsize"` → calls `initialize_grids()` to create the internal data grids.
- **Triggers (via `inst:PushEvent`):**
  - `"on_landed"` or `"on_no_longer_landed"` → pushed on floater objects when bridge changes tile terrain.
  - Destruction warnings via `TempTile_HandleTileChange_Warn` when a bridge breaks.