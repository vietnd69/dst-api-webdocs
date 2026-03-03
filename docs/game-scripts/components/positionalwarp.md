---
id: positionalwarp
title: Positionalwarp
description: Caches entity position history for rollback-style teleportation and manages visual position markers.
tags: [teleport, position, history, marker]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7648397f
system_scope: entity
---

# Positionalwarp

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PositionalWarp` tracks and stores an entity’s position history over time to support position rollback and warp functionality. It maintains a circular buffer of up to `history_max` positional samples and optionally displays a marker entity at a rewound position. This component is typically attached to players or other teleport-capable entities to enable safe, history-aware warping and to prevent teleporting into invalid locations.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("positionalwarp")
inst.components.positionalwarp:SetMarker("positionmarker")
inst.components.positionalwarp:SetWarpBackDist(5)
inst.components.positionalwarp:EnableMarker(true)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this component is attached to. |
| `showmarker` | boolean | `false` | Whether the marker entity should be visible. |
| `markers` | table | `{}` | Array of marker prefab instances for position visualization. |
| `cur_marker` | number | `0` | Current index in the marker cache (0-based). |
| `marker_cache_size` | number | `3` | Maximum number of marker instances to cache and reuse. |
| `history_x`, `history_y`, `history_z` | table of number | `{0}` (size `history_max`) | Circular history buffers for X, Y, and Z coordinates. |
| `history_rollback_dist` | number | `1` | Number of history steps to rewind when fetching a position. |
| `history_max` | number | `60` | Maximum number of history entries. |
| `history_cur` | number | `0` | Current write index in history buffers (0-based). |
| `history_back` | number | `0` | oldest readable index in history buffers (0-based). |
| `update_dist_sq` | number | `4` | Minimum squared distance required to register a new history entry. |
| `updatetask` | `Task` | `Task` | Periodic task responsible for caching positions. |
| `inittask` | `Task` | `Task` | One-time initialization task that calls `Reset()` on first frame. |

## Main functions
### `SetMarker(prefab)`
*   **Description:** Spawns up to `marker_cache_size` instances of the given prefab and caches them for repeated use as position markers. Listens for marker removal to re-spawn on demand.
*   **Parameters:** `prefab` (string) — name of the prefab to spawn as a marker (e.g., `"positionmarker"`).
*   **Returns:** Nothing.

### `SetWarpBackDist(num_cache_points)`
*   **Description:** Configures how many historical steps back to warp when `GetHistoryPosition(true)` is called.
*   **Parameters:** `num_cache_points` (number) — number of history entries to rewind.
*   **Returns:** Nothing.

### `UpdateMarker()`
*   **Description:** Positions and shows/hides the active marker entity based on the current history position and `showmarker` flag. Uses marker recycling to avoid frequent instantiation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CachePosition()`
*   **Description:** Records the entity’s current world position into history if movement exceeds `update_dist_sq`, and if teleportation is permitted at the current point. Skips recording during `jumping` state.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `self.inst.sg == nil` or the current state has tag `"jumping"`, or if `IsTeleportingPermittedFromPointToPoint` returns `false`.

### `GetHistoryPosition(rewind)`
*   **Description:** Returns the world coordinates (`x`, `y`, `z`) at `history_cur - history_rollback_dist`, or `nil` if history is empty. Optionally updates `history_cur` to that position if `rewind` is `true`.
*   **Parameters:**  
  `rewind` (boolean) — if `true`, updates `history_cur` to the returned position and refreshes the marker.
*   **Returns:** `x`, `y`, `z` (number, number, number) or `nil` (if history is exhausted).
*   **Error states:** Returns `nil` if `history_cur == history_back`.

### `Reset()`
*   **Description:** Initializes history at the entity’s current location. Records origin position only if teleporting is permitted; otherwise clears history with `(0,0,0)`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `EnableMarker(enable)`
*   **Description:** Toggles marker visibility.
*   **Parameters:** `enable` (boolean) — whether to show the marker.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes history state for saving.
*   **Parameters:** None.
*   **Returns:** table with keys: `history_x`, `history_y`, `history_z`, `cur`, `back`.

### `OnLoad(data)`
*   **Description:** Restores history state from saved data. Skips loading during world migration.
*   **Parameters:** `data` (table or `nil`) — table returned by `OnSave()`.
*   **Returns:** Nothing.
*   **Error states:** Skips restoration if `data == nil` or `self.inst.migration ~= nil`.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string indicating current history size.
*   **Parameters:** None.
*   **Returns:** string — e.g., `"history size: 23"`.

## Events & listeners
- **Listens to:** `onremove` — attached to each marker prefab to clear its slot and respawn on demand via `self:_MakeMarker(i, prefab)`.
- **Pushes:** None identified
