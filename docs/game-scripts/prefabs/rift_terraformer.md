---
id: rift_terraformer
title: Rift Terraformer
description: Manages tile-level world transformation and reversion in the Rift biome, coordinating visual effects and sound synchronization over time.
tags: [ rift, world, terrain, visual, timer ]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 737def84
system_scope: world
---

# Rift Terraformer

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `rift_terraformer` component orchestrates timed tile transformation and reversion for the Rift biome. It operates on the master simulation and manages scheduled operations (`_TerraformTile`/`_RevertTile`) that change terrain tiles to `WORLD_TILES.RIFT_MOON` or revert them to underlying tiles (e.g., `WORLD_TILES.DIRT`). It coordinates visual prefabs (`lunarrift_terraformer_visual`, `lunarrift_terraformer_explosion`), handles entity cleanup on affected tiles (via `workable`, `pickable`, `lootdropper`, `undertile`), and supports save/load and `OnLongUpdate` for time-sliced operations. The component is typically attached to Rift-related structures (e.g., Moon crystals) and exposes helper methods to schedule, inspect, and force-terminate terraforming tasks.

## Usage example
```lua
local inst = SpawnPrefab("rift_terraformer")
inst:AddTerraformTask(tx, ty, 10.0, facing_vector, false) -- Schedule terraform
inst:AddTerraformTask(tx, ty, 5.0, nil, true)            -- Schedule revert

local remaining = inst:TaskTimeForTile(tx, ty)          -- Get remaining time for tile

inst:PushEvent("forcefinishterraforming")               -- Immediately complete all pending tasks
```

## Dependencies & tags
**Components used:** `timer`, `undertile`, `workable`, `pickable`, `lootdropper`
**Tags:** Adds `birdblocker`, `FX`, `ignorewalkableplatforms`, `NOBLOCK`, `scarytoprey`. Visual sub-prefab adds `FX` only.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_terraform_tasks` | table | `{}` | Dictionary mapping tile coordinates (e.g., `"x y"`) to task metadata (tx, ty, is_revert, task, visuals, endtime). |

## Main functions
### `AddTerraformTask(tx, ty, time, facing, is_revert)`
*   **Description:** Schedules a terraform or reversion task for the specified tile. Cancels any existing task for the same tile, terminates prior visuals early, and spawns visual effects if not reverting.
*   **Parameters:**
    *   `tx` (number) — Tile X coordinate.
    *   `ty` (number) — Tile Y coordinate.
    *   `time` (number) — Delay in seconds before the tile is transformed/reverted.
    *   `facing` (table) — Direction vector `{x, z}` used to orient visuals.
    *   `is_revert` (boolean) — If `true`, reverts the tile to its underlying tile; otherwise, terraforms it to Rift Moon tile.
*   **Returns:** Nothing.
*   **Error states:** Skips scheduling if `is_revert` and the tile is not already Rift Moon, or if not `is_revert` and the tile is Ocean or Rift Moon.

### `OnParentRemoved()`
*   **Description:** Cleanup hook called when the parent entity is removed. Cancels all pending tasks and removes associated visuals.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `TaskTimeForTile(tx, ty)`
*   **Description:** Returns the remaining time (in seconds) until the scheduled task for the specified tile executes.
*   **Parameters:**
    *   `tx` (number) — Tile X coordinate.
    *   `ty` (number) — Tile Y coordinate.
*   **Returns:** (number) Remaining time in seconds; `0` if no task is pending.

### `ForceFinishTerraforming()`
*   **Description:** Immediately executes all pending terraform/revert tasks, cancels their timers, and triggers associated visuals (including explosions).
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `forcefinishterraforming` — triggers `ForceFinishTerraforming`. `timerdone` — handles timer expiration (`"remove"` fires `inst:Remove()`).
- **Pushes:** None directly on the main prefab; visual sub-prefab pushes `earlyexit` to visuals during cancellation.
