---
id: areaaware
title: Areaaware
description: Tracks the current map area (visual node) an entity occupies and notifies when the entity moves between areas.
tags: [world, map, area]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 44218891
system_scope: world
---

# Areaaware

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AreaAware` is a component that continuously monitors an entity's position to determine which map area (visual node) it occupies. It compares the entity's current coordinates against the game's topology data and fires a `changearea` event when the entity transitions between distinct areas. It also optionally watches for specific tile types and fires corresponding events when those tiles are entered or exited. The component is designed for entities that need to react to their location in the world, such as characters, bosses, or interactive objects.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("areaaware")

-- Start periodic position updates (every 0.1 seconds)
inst.components.areaaware:StartCheckingPosition(0.1)

-- Watch for swamp tile changes
inst.components.areaaware:StartWatchingTile(WORLD_TILES.SWAMP)

-- Read current area data
local area = inst.components.areaaware:GetCurrentArea()
if area and inst.components.areaaware:CurrentlyInTag("water") then
    print("Entity is in a water area.")
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `areaaware` tag via entity ownership (not directly managed by this component); checks `node.tags` internally for area-specific tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `current_area` | number | `-1` | Index of the current visual node; `-1` indicates no node assigned. |
| `current_area_data` | table? | `nil` | Table containing area metadata (`id`, `type`, `center`, `poly`, `tags`) or `nil` if no area detected. |
| `lastpt` | Vector3 | `(-9999, 0, -9999)` | Last recorded world position used to determine when to update position. |
| `updatedistsq` | number | `16` | Squared distance threshold (i.e., 4 units) that triggers a position update. |
| `watch_tiles` | table? | `nil` | Map of `WORLD_TILES.*` IDs to booleans; tracks current tile type status for each watched tile. |

## Main functions
### `UpdatePosition(x, y, z)`
*   **Description:** Updates the entity's current area based on world coordinates. If the area index changes, it populates `current_area_data` and fires a `changearea` event.
*   **Parameters:**  
    `x`, `y`, `z` (number) — World coordinates to evaluate.
*   **Returns:** Nothing.
*   **Error states:** If no visual node exists at the point, `current_area_data` becomes `nil`.

### `GetCurrentArea()`
*   **Description:** Returns detailed data about the entity's current map area.
*   **Parameters:** None.
*   **Returns:** table? — Area metadata table (`id`, `type`, `center`, `poly`, `tags`) or `nil` if no area is active.

### `CurrentlyInTag(tag)`
*   **Description:** Checks if the current area contains a specific tag.
*   **Parameters:**  
    `tag` (string) — The tag name to search for in `current_area_data.tags`.
*   **Returns:** boolean — `true` if the tag exists in the area, `false` otherwise.

### `SetUpdateDist(dist)`
*   **Description:** Sets the movement distance threshold (in units) that triggers an area update.
*   **Parameters:**  
    `dist` (number) — Minimum distance the entity must move (squared = `dist*dist`) to trigger an update.
*   **Returns:** Nothing.

### `StartCheckingPosition(checkinterval)`
*   **Description:** Begins periodic polling of the entity's position to update the current area.
*   **Parameters:**  
    `checkinterval` (number?) — Time in seconds between updates. Defaults to `self.checkinterval` if omitted (not set in constructor, defaults to `nil`).
*   **Returns:** Nothing.
*   **Error states:** Repeated calls may create multiple periodic tasks if not canceled.

### `StartWatchingTile(tile_id)`
*   **Description:** Adds a tile type to monitor for entry/exit events.
*   **Parameters:**  
    `tile_id` (WORLD_TILES.* enum) — The tile type to track.
*   **Returns:** Nothing.

### `StopWatchingTile(tile_id)`
*   **Description:** Removes a tile type from the watch list.
*   **Parameters:**  
    `tile_id` (WORLD_TILES.* enum) — The tile type to stop tracking.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string describing the current area, including its ID, type, and tags.
*   **Parameters:** None.
*   **Returns:** string — Formatted string like `"AreaID: FOREST [2], {water, danger}"` or `"No current node: 12, -8"`.

## Events & listeners
- **Listens to:**  
    `done_embark_movement` — Triggers an immediate position update via `_ForceUpdate`.
- **Pushes:**  
    `changearea` — Fired when the entity enters a new area. Payload is `current_area_data` (or `nil`).  
    `on_<TILE>_tile` — Fired when a watched tile is entered/exited. `<TILE>` is replaced by the inverted tile name (e.g., `on_land_tile`, `on_water_tile`), and the payload is a boolean indicating entry (`true`) or exit (`false`).
