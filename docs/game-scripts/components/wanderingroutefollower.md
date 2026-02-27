---
id: wanderingroutefollower
title: Wanderingroutefollower
description: This component manages routing logic for entities that follow a sequence of interpolated points, supporting route definition, switching, and periodic path evaluation.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 78c1facd
---

# Wanderingroutefollower

## Overview
The `wanderingroutefollower` component enables an entity to follow a predefined sequence of points in the world by managing route definitions, interpolating smooth paths between points, tracking current route state, and periodically evaluating which route the entity should follow (via an optional picker function). It is strictly server-side (`ismastersim` only) and intended for non-player entities needing dynamic path behavior, such as wandering creatures or moving objects.

## Dependencies & Tags
- Requires the `inst` entity to have `Transform` and (indirectly) `Map` and `TheWorld` available.
- Asserts `TheWorld.ismastersim`, so it must only be instantiated on the master simulation (server).
- No explicit component dependencies (`AddComponent`) are added within the class.
- No tags are added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PERIODIC_TICK_TIME` | `number` | `10` | Interval (in seconds) between route evaluations (e.g., route picker calls). |
| `DISTANCE_PER_INTERPOLATED_POINT` | `number` | `8` | Target distance (in units) between interpolated points along segments of a route. |
| `CLOSE_ENOUGH_DISTANCE_SQ_TO_POINT` | `number` | `16` | Square of 4 units; not currently used in the provided code (likely reserved for future use). |
| `STATES.IDLE` | `number` | `0` | State constant indicating the entity is not actively following. |
| `STATES.FOLLOWING` | `number` | `1` | State constant indicating the entity is following a route. |
| `accumulator` | `number` | `0` | Internal timer tracking time elapsed since the last tick (not saved). |
| `routes` | `table` | `{}` | Map of route names to arrays of `{x, z}` point tables (raw, uninterpolated). |
| `routestate` | `number` | `STATES.IDLE` | Current route-following state (IDLE or FOLLOWING). |
| `routename` | `string?` | `nil` | Name of the currently assigned route (if any). |
| `routeindex` | `number?` | `nil` | Current index into the interpolated route points array. |
| `interpolatedroutes` | `table` | `{}` | Map of route names to arrays of interpolated `{x, z}` points. |
| `IsValidPointFn` | `function` | `-- inline function` | Validation callback used during interpolation to filter out points on invisible tiles or near holes. |

## Main Functions
### `DefineRoute(routename, xzpositions)`
* **Description:** Defines or updates a named route by storing raw point data and generating an interpolated version. If `xzpositions` is `nil`, the route is effectively cleared.
* **Parameters:**
  - `routename` (`string`): Unique identifier for the route.
  - `xzpositions` (`table?`): Array of `{x = number, z = number}` tables representing the path’s key points. May be `nil` to remove the route.

### `ForgetRoute(routename)`
* **Description:** Removes a named route and its interpolated counterpart from memory.
* **Parameters:**
  - `routename` (`string`): Name of the route to delete.

### `SetCurrentRoute(routename)`
* **Description:** Assigns a new route to the entity and resets the route index. If a valid route is set, it finds the closest interpolated point to the entity's current position and initializes `routeindex` to that point.
* **Parameters:**
  - `routename` (`string?`): Name of the route to follow, or `nil` to clear the route.

### `SetRoutePickerFn(fn)`
* **Description:** Registers a callback function that will be invoked periodically (every `PERIODIC_TICK_TIME` seconds) to dynamically select the current route name based on the entity instance.
* **Parameters:**
  - `fn` (`function`): Function of signature `fn(inst: Entity) -> routename: string?`.

### `GetDesiredPosition()`
* **Description:** Returns the world position the entity *should* move toward, based on the current route state. If no route is active, returns the entity’s current position. **Note:** The current implementation always returns `(0, 0, 0)` when a route *is* active — this appears incomplete or placeholder behavior.
* **Parameters:** None.

### `Tick()`
* **Description:** Executes one evaluation cycle: calls the route picker (if registered) to update the current route, and prints debug information.
* **Parameters:** None.

### `OnUpdate(dt)` / `LongUpdate(dt)`
* **Description:** Accumulates elapsed time (`dt`) and triggers `Tick()` when `PERIODIC_TICK_TIME` has passed. Used as a periodic upkeep function (e.g., attached to `Update`/`LongUpdate` game loops).
* **Parameters:**
  - `dt` (`number`): Delta time (seconds) since last frame.

### `OnSave()`
* **Description:** Serializes essential persistent route state into a table (route definitions, name, index, and state enum).
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores serialized route state from a table. Converts string state back to enum value.
* **Parameters:**
  - `data` (`table?`): Data returned by `OnSave`.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging, showing active route name, index, state, and time until next tick.
* **Parameters:** None.

## Events & Listeners
None identified. The component does not listen for or dispatch any events via `inst:ListenForEvent`/`inst:PushEvent`.