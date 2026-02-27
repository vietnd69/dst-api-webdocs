---
id: positionalwarp
title: Positionalwarp
description: Caches an entity's recent positional history and provides rollback functionality to restore previous locations, optionally rendering visual markers for the target warp position.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 7648397f
---

# PositionalWarp

## Overview
The `PositionalWarp` component tracks an entity's movement over time by caching positions at regular intervals into a fixed-size circular buffer. It supports rewinding to a prior position (e.g., for teleport rollback or warp-back mechanics), manages reusable marker prefabs for visual feedback, and persists history across save/load cycles. It operates independently of state graphs and only caches positions when teleporting is permitted at the current location.

## Dependencies & Tags
- **Dependencies:** Relies on `inst.Transform:GetWorldPosition()` and `inst:DoPeriodicTask()`/`inst:DoTaskInTime()` for scheduling. Requires `SpawnPrefab()` to create markers. Uses `Vec3Util_DistSq`, `VecUtil_DistSq`, and `IsTeleportingPermittedFromPointToPoint`.
- **Tags:** None added or removed.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `showmarker` | `boolean` | `false` | Controls whether visual markers are displayed. |
| `markers` | `table` | `{}` | Array of cached marker entities (size = `marker_cache_size`). |
| `cur_marker` | `integer` | `0` | Index (0-based) of the currently active marker in `markers`. |
| `marker_cache_size` | `integer` | `3` | Number of marker entities to pre-spawn and reuse. |
| `history_x`, `history_y`, `history_z` | `table` of `number` | Arrays of length `history_max` | Circular buffers storing cached X, Y, Z coordinates. |
| `history_rollback_dist` | `integer` | `1` | Number of history steps to rewind when retrieving a position. |
| `history_max` | `integer` | `60` | Maximum number of position entries retained. |
| `history_cur` | `integer` | `0` (0-based index) | Current write position in the history buffer. |
| `history_back` | `integer` | `0` (0-based index) | Oldest valid history position (read boundary); advances if history wraps. |
| `update_dist_sq` | `number` | `4.0` (2²) | Squared distance threshold to trigger a new position cache. |
| `updatetask` | `Task` | periodic (0.1s) | Periodic task that calls `CachePosition()`. |
| `inittask` | `Task` | `nil` initially | One-time deferred task that calls `Reset()` on first run. |

## Main Functions

### `CachePosition()`
* **Description:** Captures the entity’s current position if it has moved sufficiently since the last cache and if teleporting is allowed at the location. Appends the position to the circular history buffer.
* **Parameters:** None.

### `GetHistoryPosition(rewind)`
* **Description:** Returns the position (x, y, z) `history_rollback_dist` steps back in history. Optionally updates `history_cur` to that position (i.e., rewinds the buffer pointer) if `rewind` is `true`. Returns `nil` if the history is empty (i.e., `history_cur == history_back`).
* **Parameters:**
  - `rewind` (`boolean`): If `true`, updates `history_cur` to point to the returned position for future operations.

### `SetMarker(prefab)`
* **Description:** Pre-spawns and caches `marker_cache_size` instances of the given `prefab`, sets up listeners to respawn them on removal, and initializes the first marker to show the target warp position.
* **Parameters:**
  - `prefab` (`string`): Name of the prefab to spawn for markers.

### `SetWarpBackDist(num_cache_points)`
* **Description:** Adjusts how many history entries to skip when calculating the warp-back position. Calls `UpdateMarker()` to refresh the marker display.
* **Parameters:**
  - `num_cache_points` (`integer`): Number of historical points to rollback (i.e., sets `history_rollback_dist`).

### `UpdateMarker()`
* **Description:** Updates the visible marker to reflect the current `GetHistoryPosition(false)` location. If no valid position exists or `showmarker` is `false`, hides all markers.
* **Parameters:** None.

### `EnableMarker(enable)`
* **Description:** Toggles marker visibility by setting `showmarker` and refreshes the marker display.
* **Parameters:**
  - `enable` (`boolean`): Whether to enable markers.

### `Reset()`
* **Description:** Initializes the history buffer with the entity’s *current* position (if teleporting is permitted), resetting `history_cur` and `history_back` to `0`.
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns a table containing all history buffer state for persistence: `history_x`, `history_y`, `history_z`, `cur`, and `back`.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores history state from `data`, preserving in-memory buffers. Skips loading if `inst.migration` is active (i.e., across server resets). Cancels `inittask` after loading if present.
* **Parameters:**
  - `data` (`table?`): Saved state previously returned by `OnSave()`.

### `GetDebugString()`
* **Description:** Returns a string summarizing the number of valid entries in the history buffer for debugging.
* **Parameters:** None.

### `OnRemoveFromEntity()` / `OnRemoveEntity()`
* **Description:** Cleans up by canceling the periodic update task and removing all marker entities.
* **Parameters:** None.

## Events & Listeners
- Listens for `"onremove"` on each marker prefab; if a marker is removed externally, it respawns a replacement via `_MakeMarker`.
- Does **not** emit any events itself.
- Does **not** listen for any game or component events beyond marker removal.