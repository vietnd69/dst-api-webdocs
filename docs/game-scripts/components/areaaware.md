---
id: areaaware
title: Areaaware
description: Tracks an entity's current map area node and tile type, pushing events when location changes occur.
tags: [map, location, events]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: components
source_hash: 44218891
system_scope: world
---

# Areaaware

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`AreaAware` monitors an entity's position on the world map and tracks which topology node (area) and tile type the entity currently occupies. It pushes events when the entity changes areas or enters/exits specific tile types. This component is commonly used for location-based logic, region triggers, and tile-dependent behaviors. It integrates with `TheWorld.Map` and `TheWorld.topology` systems to determine area data.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("areaaware")
inst.components.areaaware:SetUpdateDist(5)
inst.components.areaaware:StartWatchingTile(WORLD_TILES.MARSH)
inst.components.areaaware:StartCheckingPosition(1)
```

## Dependencies & tags
**Components used:** None identified (self-contained component)
**Tags:** None identified (does not add or check entity tags)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `current_area` | number | `-1` | Index of the current topology node the entity occupies. |
| `current_area_data` | table | `nil` | Table containing area info (id, type, center, poly, tags) or `nil` if no node. |
| `lastpt` | Vector3 | `(-9999, 0, -9999)` | Stores the last checked position coordinates. |
| `updatedistsq` | number | `16` | Distance squared threshold before triggering position update. |
| `watch_tiles` | table | `nil` | Optional table tracking watched tile types and their current state. |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleanup function called when the component is removed from an entity. Stops updating and removes event listeners.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdatePosition(x, y, z)`
*   **Description:** Updates the current area data based on world position. Pushes `changearea` event if the area node changes. Also checks watched tiles and pushes tile events.
*   **Parameters:** `x` (number), `y` (number), `z` (number) - world coordinates to check.
*   **Returns:** Nothing.
*   **Error states:** If `node_index` is `nil`, `current_area_data` is set to `nil`.

### `OnUpdate(dt)`
*   **Description:** Called periodically by the component system. Checks if entity has moved beyond `updatedistsq` threshold and triggers `UpdatePosition` if so.
*   **Parameters:** `dt` (number) - delta time since last update.
*   **Returns:** Nothing.

### `SetUpdateDist(dist)`
*   **Description:** Configures the distance threshold for position updates.
*   **Parameters:** `dist` (number) - distance in world units (squared internally).
*   **Returns:** Nothing.

### `GetCurrentArea()`
*   **Description:** Returns the current area data table containing node information.
*   **Parameters:** None.
*   **Returns:** Table with area info (id, type, center, poly, tags) or `nil` if no current node.

### `CurrentlyInTag(tag)`
*   **Description:** Checks if the current area node has a specific tag.
*   **Parameters:** `tag` (string) - the topology tag to check for.
*   **Returns:** Boolean - `true` if the area has the tag, `false` otherwise.
*   **Error states:** Returns `false` if `current_area_data` or `tags` is `nil`.

### `GetDebugString()`
*   **Description:** Returns a formatted debug string showing current node info, area ID, node type, and tags.
*   **Parameters:** None.
*   **Returns:** String - debug information or "No current node" message with coordinates.

### `StartCheckingPosition(checkinterval)`
*   **Description:** Starts a periodic task to check position at regular intervals.
*   **Parameters:** `checkinterval` (number) - time in seconds between checks. Uses `self.checkinterval` if not provided.
*   **Returns:** Nothing.
*   **Error states:** Creates task stored in `self.checkpositiontask`.

### `StartWatchingTile(tile_id)`
*   **Description:** Begins monitoring a specific tile type for entry/exit events.
*   **Parameters:** `tile_id` (number) - the `WORLD_TILES` constant to watch.
*   **Returns:** Nothing.
*   **Error states:** Initializes `watch_tiles` table if `nil`, otherwise adds the tile to existing table.

### `StopWatchingTile(tile_id)`
*   **Description:** Stops monitoring a specific tile type.
*   **Parameters:** `tile_id` (number) - the `WORLD_TILES` constant to stop watching.
*   **Returns:** Nothing.
*   **Error states:** Removes tile from `watch_tiles`. If table becomes empty, sets `watch_tiles` to `nil`.

## Events & listeners
- **Listens to:** `done_embark_movement` - forces position update when embark movement completes.
- **Pushes:** `changearea` - fired when entity enters a new topology node, includes `current_area_data` table.
- **Pushes:** `on_<tile>_tile` - fired when watched tile state changes, includes boolean indicating current presence.