---
id: areaaware
title: Areaaware
description: Tracks an entity's current topological area and watched tile types, pushing events when its area or tile status changes.
sidebar_position: 1

last_updated: 2026-02_13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# areaaware

## Overview
The `areaaware` component is responsible for tracking an entity's current position within the game world's topological areas (nodes) and specific tile types. It continuously monitors the entity's location and triggers events whenever it enters a new "visual node" or changes its status on a pre-defined "watched" tile type. This allows other systems or components to react to the entity's environment, such as determining if it's in a specific biome, a cave, or on water/land.

## Dependencies & Tags
None identified. This component primarily interacts with `TheWorld.Map` and `TheWorld.topology`.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | `Entity` | - | A reference to the entity this component is attached to. |
| `current_area` | `number` | `-1` | The index of the visual node (area) the entity is currently within. `0` indicates no specific node or an invalid one. |
| `current_area_data` | `table` or `nil` | `nil` | A table containing detailed information about the `current_area`, including `id`, `type`, `center`, `poly`, and `tags`. `nil` if no area is found. |
| `lastpt` | `Vector3` | `Vector3(-9999,0,-9999)` | The last position at which `UpdatePosition` was executed. Used to determine if the entity has moved significantly enough to warrant a new area check. |
| `updatedistsq` | `number` | `16` | The squared distance threshold (in units) the entity must move before `UpdatePosition` is called by `OnUpdate`. Defaults to `4*4 = 16`. |
| `_ForceUpdate` | `function` | - | An internal callback function bound to `self:UpdatePosition(self.inst.Transform:GetWorldPosition())`, used for the `done_embark_movement` event. |
| `watch_tiles` | `table` or `nil` | `nil` | A dictionary where keys are `WORLD_TILES` IDs and values are booleans indicating if the entity is currently on that tile type. Created and managed by `StartWatchingTile` and `StopWatchingTile`. |
| `checkpositiontask` | `task` or `nil` | `nil` | A handle to a periodic task started by `StartCheckingPosition`, if active. |

## Main Functions
### `OnRemoveFromEntity()`
*   **Description:** This method is called when the component is removed from its entity. It performs cleanup, stopping the component's update cycle and unregistering event listeners to prevent memory leaks or errors.
*   **Parameters:** None.

### `_TestArea(pt_x, pt_z, on_land, r)`
*   **Description:** An internal helper function (indicated by the leading underscore) designed to scan a small 3x3 grid around a given point `(pt_x, pt_z)` with radius `r`. It attempts to find the "best" tile within this area based on `render_layer` and whether it matches the `on_land` status. Currently, this function does not appear to be called by other methods within the `AreaAware` component.
*   **Parameters:**
    *   `pt_x` (`number`): The X-coordinate of the center point for the scan.
    *   `pt_z` (`number`): The Z-coordinate of the center point for the scan.
    *   `on_land` (`boolean`): If `true`, only land tiles are considered; if `false`, only water tiles.
    *   `r` (`number`): The radius offset for scanning the 3x3 grid.

### `UpdatePosition(x, y, z)`
*   **Description:** This is a core method that updates the entity's current area information. It queries `TheWorld.Map` to find the visual node at the given position. If the node index has changed from the `current_area`, it updates `current_area` and `current_area_data` and pushes a `"changearea"` event. It also checks any tile types registered for observation via `StartWatchingTile` and pushes specific events if the entity's current tile type status for a watched tile has changed.
*   **Parameters:**
    *   `x` (`number`): The X-coordinate of the entity's position.
    *   `y` (`number`): The Y-coordinate of the entity's position (often `0` for ground entities).
    *   `z` (`number`): The Z-coordinate of the entity's position.

### `OnUpdate(dt)`
*   **Description:** This method is called automatically by the game engine whenever the component is "updating" (activated by `self.inst:StartUpdatingComponent(self)`). It checks if the entity has moved a significant distance (greater than `updatedistsq`) since the last position update. If so, it calls `UpdatePosition` to refresh the area information.
*   **Parameters:**
    *   `dt` (`number`): The time elapsed since the last update frame.

### `SetUpdateDist(dist)`
*   **Description:** Sets the distance threshold for when `OnUpdate` will trigger a full position check. The input `dist` is squared internally, so `dist` represents the linear radius.
*   **Parameters:**
    *   `dist` (`number`): The new linear distance threshold.

### `GetCurrentArea()`
*   **Description:** A getter method that returns the data table for the visual node the entity is currently in.
*   **Parameters:** None.

### `CurrentlyInTag(tag)`
*   **Description:** Checks if the `current_area_data` exists and if its `tags` table contains the specified `tag`.
*   **Parameters:**
    *   `tag` (`string`): The tag to check for (e.g., `"FOREST"` or `"CAVE"`).

### `GetDebugString()`
*   **Description:** Generates a formatted string providing debug information about the current visual node/area the entity is in. This includes the area ID, type, and associated tags.
*   **Parameters:** None.

### `StartCheckingPosition(checkinterval)`
*   **Description:** Starts a periodic task on the entity that will call `UpdatePosition` at a regular interval. This provides an alternative or supplementary way to ensure position updates, independent of movement distance.
*   **Parameters:**
    *   `checkinterval` (`number`, optional): The time in seconds between each position check. If `nil`, a default interval (likely `self.checkinterval`, though not explicitly defined here, suggests an external configuration or a `nil` check that defaults to an immediate call).

### `StartWatchingTile(tile_id)`
*   **Description:** Adds a specific tile type to a list of tiles that `AreaAware` will monitor. When the entity moves onto or off of this `tile_id`, a corresponding event will be pushed.
*   **Parameters:**
    *   `tile_id` (`number`): The `WORLD_TILES` ID of the tile type to watch.

### `StopWatchingTile(tile_id)`
*   **Description:** Removes a specific tile type from the `watch_tiles` list, ceasing any further event pushes related to that tile type. If no other tiles are being watched, `self.watch_tiles` is set to `nil`.
*   **Parameters:**
    *   `tile_id` (`number`): The `WORLD_TILES` ID of the tile type to stop watching.

## Events & Listeners
*   **Listens For:**
    *   `"done_embark_movement"`: Triggered when an entity finishes an embark/disembark animation (e.g., leaving a boat). Upon this event, `_ForceUpdate` (which calls `self:UpdatePosition()` using the entity's current location) is executed to ensure the area information is immediately current.

*   **Pushes/Triggers:**
    *   `"changearea"`: Triggered when the entity moves into a new visual node/area.
        *   **Payload:** `table` containing `id`, `type`, `center`, `poly`, and `tags` of the new area.
    *   `"on_TILETYPE_tile"`: Triggered when the entity moves onto or off of a tile type that is being "watched" via `StartWatchingTile`. The `TILETYPE` part of the event name is dynamically generated using `INVERTED_WORLD_TILES` (e.g., `"on_forest_tile"`, `"on_ocean_shallow_tile"`).
        *   **Payload:** `boolean` indicating `true` if the entity is currently on that tile, `false` otherwise.