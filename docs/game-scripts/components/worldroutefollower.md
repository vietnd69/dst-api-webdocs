---
id: worldroutefollower
title: Worldroutefollower
description: Coordinates movement along a predefined path in the world, handling walking, teleportation on failure, and sleep/wake synchronization.
tags: [locomotion, ai, route, entity]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 6fc13db2
system_scope: locomotion
---
# Worldroutefollower

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WorldRouteFollower` manages path-following behavior for entities using named routes defined in `WorldRoutes`. It supports walking between route points with automatic fallback to teleportation when movement is obstructed or the entity becomes stuck. The component integrates with `StuckDetection`, `Locomotor`, and `WorldRoutes`, and includes support for sleep-mode virtual walking to prevent entities from getting permanently stuck while asleep. It is typically added to creatures that need to patrol, migrate, or follow scripted routes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("worldroutefollower")
inst.components.worldroutefollower:FollowRoute("mypatrolpath")
inst.components.worldroutefollower:SetCloseEnoughDist(2)
inst.components.worldroutefollower:SetOnArrivedFn(function(entity)
    print("Arrived at route node")
end)
```

## Dependencies & tags
**Components used:** `locomotor`, `stuckdetection`, `worldroutes`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pausedsources` | `SourceModifierList` | N/A | Tracks pause reasons; accessed via `SetPaused(paused, reason)`. |
| `closeenoughdist` | number | `4` | Distance threshold (plus entity radius) to consider a route point reached. |
| `virtualwalkingspeedmult` | number | `1` | Speed multiplier used during virtual walk timers when entity is asleep. |
| `routename` | string? | `nil` | Name of the active route (internal). |
| `routeindex` | number? | `nil` | Current index into `self.route` (internal). |
| `route` | table? | `nil` | List of `Vector3` points for the current route (internal). |
| `routetimetoarrivemax` | number? | `nil` | Max time allowed to reach current route point (internal). |
| `routetimeelapsed` | number? | `0` | Time elapsed since current route point was targeted (internal). |
| `stuckteleportattempts` | number? | `nil` | Count of consecutive teleport attempts at same node (internal). |

## Main functions
### `SetCloseEnoughDist(dist)`
* **Description:** Overrides the base distance threshold used to determine when an entity has arrived at a route point.
* **Parameters:** `dist` (number) — additional distance tolerance added to the entity’s physics radius.
* **Returns:** Nothing.

### `SetVirtualWalkingSpeedMult(mult)`
* **Description:** Sets the speed multiplier applied when calculating virtual walk timeouts during entity sleep.
* **Parameters:** `mult` (number) — speed factor (e.g., `0.5` for half speed). Defaults to `1` if `nil`.
* **Returns:** Nothing.

### `SetIsValidPointForRouteFn(fn)`
* **Description:** Registers a custom predicate to validate candidate points on the route.
* **Parameters:** `fn` (function) — function `(x, y, z) -> boolean`.
* **Returns:** Nothing.

### `SetPreTeleportFn(fn)`
* **Description:** Registers a callback invoked before teleporting to a route destination.
* **Parameters:** `fn` (function) — function `(entity) -> boolean?`. If it returns `true`, the component expects the caller to invoke `TeleportToDestination()` later.
* **Returns:** Nothing.

### `SetPostTeleportFn(fn)`
* **Description:** Registers a callback invoked immediately after a successful teleport to a route destination.
* **Parameters:** `fn` (function) — function `(entity)`.
* **Returns:** Nothing.

### `SetOnArrivedFn(fn)`
* **Description:** Registers a callback invoked when the entity arrives at a route point (i.e., when `IterateRoute` succeeds).
* **Parameters:** `fn` (function) — function `(entity)`.
* **Returns:** Nothing.

### `GetRouteDestination()`
* **Description:** Returns the current target `Vector3` point in the active route.
* **Parameters:** None.
* **Returns:** `Vector3?` — target point, or `nil` if no route is active.

### `GetRoute()`
* **Description:** Returns the full active route table.
* **Parameters:** None.
* **Returns:** `table?` — array of `Vector3` points, or `nil` if no route is active.

### `IsValidPoint(x, y, z)`
* **Description:** Checks if a world point is valid for routing: respects both custom `isvalidpointforroutefn` and static entity collisions.
* **Parameters:**  
  `x`, `y`, `z` (numbers) — world coordinates.
* **Returns:** `boolean` — `true` if the point is clear and passes all validations.

### `FindValidPointNear(x, y, z)`
* **Description:** Attempts to find a nearby walkable point within `r=32` units if the target is obstructed.
* **Parameters:**  
  `x`, `y`, `z` (numbers) — intended destination.
* **Returns:**  
  `(x, y, z)` (numbers) — valid point, or `(nil, nil, nil)` if no valid point found.

### `TeleportToDestination()`
* **Description:** Teleports the entity to the stored destination and advances to the next route point.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Teleport uses physics if available (`Physics:Teleport`), otherwise falls back to `Transform:SetPosition`.

### `TryToTeleportToDestination()`
* **Description:** Attempts to locate a valid point near the current route destination and, if successful, teleports the entity.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if a teleport was attempted (even if later deferred), `false` if no destination or no valid point found.

### `ShouldIterate()`
* **Description:** Returns whether route progression is currently allowed.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if not paused via `pausedsources`.

### `IterateRoute(force)`
* **Description:** Advances the route index to the next point, or loops back to index `1` if at the end.
* **Parameters:**  
  `force` (boolean) — if `true`, advances immediately regardless of arrival distance.
* **Returns:** `boolean` — `true` if route index changed.

### `SetRouteIndex(routeindex)`
* **Description:** Sets the current route index and initializes timing for arrival estimation.
* **Parameters:**  
  `routeindex` (number) — 1-based index into `self.route`.
* **Returns:** Nothing.
* **Error states:** Automatically starts component updates if not already active.

### `SetPaused(paused, reason)`
* **Description:** Pauses or unpauses route following, with optional reason.
* **Parameters:**  
  `paused` (boolean) — whether to pause.  
  `reason` (string) — identifier for the pause source (e.g., `"combat"`, `"dialog"`).
* **Returns:** Nothing.

### `FollowRoute(routename, routeindexoverride)`
* **Description:** Loads and begins following a named route from `WorldRoutes`.
* **Parameters:**  
  `routename` (string) — name of the route.  
  `routeindexoverride` (number?) — optional starting index; if omitted, selects nearest point to entity.
* **Returns:** `boolean` — `true` if route loaded successfully, `false` if route doesn’t exist.

### `TryToStartVirtualWalk()`
* **Description:** Schedules a delayed teleport (if entity is asleep) to avoid long idle pauses.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if a task was scheduled, `false` otherwise.

### `OnUpdate(dt)`
* **Description:** Called each frame while updating; handles distance checks, stuck detection, and route progression.
* **Parameters:**  
  `dt` (number) — delta time in seconds.
* **Returns:** Nothing.
* **Error states:** Skips updates if route is `nil` or paused. If stuck for too long, advances the route index up to three times before skipping the node.

### `OnEntitySleep()`
* **Description:** Stops updating while the entity sleeps, and schedules a virtual walk timer.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntityWake()`
* **Description:** Restores component updates when the entity wakes and cancels any pending sleep-triggered teleport.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Returns persistent route state for serialization.
* **Parameters:** None.
* **Returns:** `{ routename = string, routeindex = number }?` — or `nil` if no route active.

### `OnLoad(data)`
* **Description:** Restores route state after loading.
* **Parameters:**  
  `data` (table) — output from `OnSave`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted diagnostic string for in-game debugging.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"mypatrolpath : Index(2 of 5) : TimeToTeleport 1.3 via stuckdetection check"`.

## Events & listeners
- **Listens to:** None.  
- **Pushes:** None.  
*(Note: This component does not directly fire events; behavior hooks (e.g., `onarrivedfn`) are implemented via callbacks rather than event system.)*
