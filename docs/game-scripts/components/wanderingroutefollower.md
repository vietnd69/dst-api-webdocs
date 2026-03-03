---
id: wanderingroutefollower
title: Wanderingroutefollower
description: Manages path routes and interpolation for entities that follow wandering paths, used for AI navigation in maps.
tags: [ai, locomotion, map, path]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 78c1facd
system_scope: locomotion
---
# Wanderingroutefollower

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Wanderingroutefollower` is a server-only component that manages named routes composed of 2D (XZ-plane) positions. It supports route definition, interpolation between points for smoother motion, and selecting active routes dynamically. It is intended for entities that need to follow a predefined or dynamically selected wandering path, such as periodic patrol monsters or environmental wanderers. The component operates exclusively on the master simulation (server) and is not replicated to clients.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wanderingroutefollower")

-- Define a route named "patrol1" with three points
inst.components.wanderingroutefollower:DefineRoute("patrol1", {
    {x = 0, z = 0},
    {x = 20, z = 10},
    {x = 10, z = 20},
})

-- Set a picker function to dynamically choose the active route
inst.components.wanderingroutefollower:SetRoutePickerFn(function(entity)
    return "patrol1"
end)

-- Start processing route updates (required for OnUpdate/LongUpdate)
inst:AddChildComponent(inst.components.wanderingroutefollower)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PERIODIC_TICK_TIME` | number | `10` | Interval in seconds between automatic route updates via `Tick()`. |
| `DISTANCE_PER_INTERPOLATED_POINT` | number | `8` | Approximate distance (in world units) between interpolated points along a route segment. |
| `CLOSE_ENOUGH_DISTANCE_SQ_TO_POINT` | number | `16` | Squared distance threshold used to determine proximity to a route point (not currently used in code). |
| `STATES.IDLE` | number | `0` | Route state constant indicating the entity is not following a route. |
| `STATES.FOLLOWING` | number | `1` | Route state constant indicating the entity is following a route. |
| `routes` | table | `{}` | Map of route names to arrays of `{x, z}` points. |
| `routestate` | number | `STATES.IDLE` | Current route state (`IDLE` or `FOLLOWING`). |
| `routename` | string? | `nil` | Name of the currently active route. |
| `routeindex` | number? | `nil` | Index of the next target point in the interpolated route. |
| `interpolatedroutes` | table | `{}` | Map of route names to arrays of interpolated `{x, z}` points for smoother traversal. |
| `IsValidPointFn` | function | (see code) | Validation function used during interpolation to reject points near holes or on invisible tiles. |
| `routepickerfn` | function? | `nil` | Optional callback that returns the next route name based on the entity instance. |

## Main functions
### `DefineRoute(routename, xzpositions)`
*   **Description:** Defines or updates a named route by storing raw control points and interpolating them for smoother motion. Interpolated points are added to the `purplemooneye` debug prefab at each interpolated position (currently left in code for debugging).
*   **Parameters:**  
    `routename` (string) — Unique identifier for the route.  
    `xzpositions` (table) — Array of `{x = number, z = number}` coordinate tables defining the route path.
*   **Returns:** Nothing.
*   **Error states:** Accepts `nil` for `xzpositions` to clear the route.

### `ForgetRoute(routename)`
*   **Description:** Removes a route entirely (both raw and interpolated) from internal storage.
*   **Parameters:**  
    `routename` (string) — Name of the route to delete.
*   **Returns:** Nothing.

### `SetCurrentRoute(routename)`
*   **Description:** Sets the active route and computes the nearest route point index to the entity’s current position. Resets `routestate` to `IDLE` if the route changes.
*   **Parameters:**  
    `routename` (string? — may be `nil`) — Name of the route to activate; `nil` clears the active route.
*   **Returns:** Nothing.

### `SetRoutePickerFn(fn)`
*   **Description:** Assigns a callback function that determines which route should be active. Called automatically during periodic updates.
*   **Parameters:**  
    `fn` (function) — A function that takes the entity instance (`self.inst`) and returns a route name (string) or `nil`.
*   **Returns:** Nothing.

### `GetDesiredPosition()`
*   **Description:** Returns the entity’s current world position if no route is active; otherwise, returns `0, 0, 0` as a placeholder (actual target logic is not implemented in this version).
*   **Parameters:** None.
*   **Returns:** `x, y, z` (numbers) — Current position if no route; otherwise `0, 0, 0`.

### `Tick()`
*   **Description:** Handles route selection logic: if a `routepickerfn` is set, it updates the active route using that function. Currently only logs route updates and desired positions for debugging.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Accumulates elapsed time and triggers `Tick()` when `PERIODIC_TICK_TIME` is exceeded. Called automatically via `LongUpdate()` (see source).
*   **Parameters:**  
    `dt` (number) — Time delta in seconds since last frame.
*   **Returns:** Nothing.

### `LongUpdate(dt)`
*   **Description:** Entry point for periodic ticking; simply delegates to `OnUpdate(dt)`.
*   **Parameters:**  
    `dt` (number) — Time delta in seconds.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes the component’s persistent state for world save. Converts `routestate` enum to its string key name for compatibility.
*   **Parameters:** None.
*   **Returns:** `data` (table) — Save data containing `routes`, `routename`, `routeindex`, and `routestate` (as string key).

### `OnLoad(data)`
*   **Description:** Restores state from world load data. Converts `routestate` from its string key back to enum value.
*   **Parameters:**  
    `data` (table? — may be `nil`) — Data from `OnSave()`.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted debug string for inspection (e.g., via in-game debug UI).
*   **Parameters:** None.
*   **Returns:** `string` — Debug info including route name, index, state, and time until next tick.

## Events & listeners
None identified
