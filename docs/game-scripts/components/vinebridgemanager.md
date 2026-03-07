---
id: vinebridgemanager
title: Vinebridgemanager
description: Manages dynamic vine bridge tiles in the game world, including creation, damage, destruction, and animation.
tags: [world, environment, map, boss]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 0c578d02
system_scope: world
---
# Vinebridgemanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`VineBridgeManager` is a server-side component responsible for managing temporary vine bridge tiles introduced during the Charlie (boss) encounter in caves. It handles the creation, health tracking, damage, and automatic destruction of vine bridges over ocean or ocean-coastal tiles. The component uses `DataGrid` instances to store per-tile metadata (health, direction, damage prefabs) and integrates with `undertile` and `floater` components for terrain consistency.

This component only exists on the master simulation (`TheWorld.ismastersim`) and is not replicated to clients.

## Usage example
```lua
-- Typically attached to the world instance during boss encounter initialization
inst:AddComponent("vinebridgemanager")

-- Create a vine bridge at a point
inst.components.vinebridgemanager:CreateVineBridgeAtPoint(x, y, z, { x = 0, z = 1 })

-- Damage the bridge to begin destruction
inst.components.vinebridgemanager:DamageVineBridgeAtPoint(x, y, z, 10)

-- Manually queue destruction
inst.components.vinebridgemanager:QueueDestroyForVineBridgeAtPoint(x, y, z)
```

## Dependencies & tags
**Components used:** `undertile`, `floater`
**Tags:** Checks tags `floaterobject`, `cave`, `ignorewalkableplatforms`, `ignorewalkableplatformdrowning`, `activeprojectile`, `flying`, `FX`, `DECOR`, `INLIMBO`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance (typically the world) that owns this component. |
| `WIDTH`, `HEIGHT` | `number` | `nil` | Dimensions of the world map, initialized on `"worldmapsetsize"` event. |
| `marked_for_delete_grid` | `DataGrid` | `nil` | Grid tracking tiles queued for destruction. |
| `duration_grid` | `DataGrid` | `nil` | Grid storing `{ health, direction }` per tile. |
| `damage_prefabs_grid` | `DataGrid` | `nil` | Grid storing optional visual damage prefabs per tile. |
| `bridge_anims_grid` | `DataGrid` | `nil` | Grid storing `vine_bridge_fx` prefabs per tile. |

## Main functions
### `CreateVineBridgeAtPoint(x, y, z, direction)`
*   **Description:** Creates a vine bridge tile at the specified world point by converting the underlying tile to `WORLD_TILES.CHARLIE_VINE`. Updates internal grids and spawns the bridge visual.
*   **Parameters:**  
    `x`, `y`, `z` (numbers) — World coordinates.  
    `direction` (table) — `{ x = number, z = number }` vector indicating bridge orientation (used for animation rotation).
*   **Returns:** `true` on success.
*   **Error states:** Returns early if `undertile` data is missing or tile is not ocean/coastal.

### `CreateVineBridgeAtTile(tile_x, tile_y, x, z, direction)`
*   **Description:** Same as `CreateVineBridgeAtPoint`, but takes explicit tile coordinates (`tile_x`, `tile_y`) instead of world coordinates.
*   **Parameters:**  
    `tile_x`, `tile_y` (numbers) — Tile grid coordinates.  
    `x`, `z` (numbers, optional) — World coordinates used for floater updates and animation placement.  
    `direction` (table) — Bridge orientation vector.
*   **Returns:** `true` on success.

### `QueueCreateVineBridgeAtPoint(x, y, z, data)`
*   **Description:** Schedules vine bridge creation with a random delay. Does not overwrite existing bridge data.
*   **Parameters:**  
    `x`, `y`, `z` (numbers) — World point.  
    `data` (table, optional) — Contains `base_time`, `random_time`, and `direction`.
*   **Returns:** Nothing.

### `DestroyVineBridgeAtPoint(x, y, z, data)`
*   **Description:** Immediately destroys the vine bridge at the specified point, restoring the underlying tile and cleaning up all related grids and prefabs.
*   **Parameters:**  
    `x`, `y`, `z` (numbers) — World coordinates.  
    `data` (any) — Unused, included for API consistency.
*   **Returns:** `true` if destruction succeeded, `false` if no vine bridge tile was present.

### `QueueDestroyForVineBridgeAtPoint(x, y, z, data)`
*   **Description:** Schedules automatic vine bridge destruction after a delay (default ~70 frames). Triggers visual warnings and shake effect if `data.fxtime` is provided.
*   **Parameters:**  
    `x`, `y`, `z` (numbers) — World coordinates.  
    `data` (table, optional) — Contains `destroytime`, `fxtime`, `shaketime`.
*   **Returns:** Nothing.

### `DamageVineBridgeAtPoint(x, y, z, damage)`
*   **Description:** Applies damage to the vine bridge at a world point, reducing its health. If health reaches `0`, triggers destruction queue.
*   **Parameters:**  
    `x`, `y`, `z` (numbers) — World coordinates.  
    `damage` (number) — Amount of damage to apply.
*   **Returns:** `nil` if tile is missing or already destroyed; otherwise, the new health value (a number between `0` and `TUNING.VINEBRIDGE_HEALTH`).

### `DamageVineBridgeAtTile(tx, ty, damage)`
*   **Description:** Same as `DamageVineBridgeAtPoint`, but uses tile coordinates.
*   **Parameters:**  
    `tx`, `ty` (numbers) — Tile coordinates.  
    `damage` (number) — Damage amount.
*   **Returns:** Same as `DamageVineBridgeAtPoint`.

### `OnSave()`
*   **Description:** Serializes the `marked_for_delete_grid` and `duration_grid` for world save.
*   **Parameters:** None.
*   **Returns:** Encoded and compressed save data (string).

### `OnLoad(data)`
*   **Description:** Restores vine bridge state from saved data, reinitializing grids and rescheduling pending destruction tasks.
*   **Parameters:** `data` (string) — Encoded save data.
*   **Returns:** Nothing.
*   **Error states:** Early return if decoded data is `nil`.

### `FixupFloaterObjects(x, z, tile_radius_plus_overhang, is_ocean_tile)`
*   **Description:** Updates `floater` components on nearby entities based on whether they are now on ocean tiles after bridge placement/removal.
*   **Parameters:**  
    `x`, `z` (numbers) — Center point.  
    `tile_radius_plus_overhang` (number) — Search radius.  
    `is_ocean_tile` (boolean) — Flag indicating if current tile is ocean.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `worldmapsetsize` — Initializes grids when world map dimensions are known.
- **Pushes:** `on_landed`, `on_no_longer_landed` — Via `floaterobject` entities during bridge placement/removal.
- **Internally pushes:** Destruction warning via `TempTile_HandleTileChange_Warn` (not an entity event, but a world system callback).
