---
id: worldroutefollower
title: Worldroutefollower
description: Enables an entity to automatically follow a named route on the game world map, handling movement, teleportation, and state persistence.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 6fc13db2
---

# Worldroutefollower

## Overview
The `WorldRouteFollower` component allows an entity to autonomously traverse a predefined sequence of world coordinates (a route) by walking, sleeping-based teleportation, or forced teleportation when stuck. It integrates with the `Locomotor`, `StuckDetection`, and `WorldRoutes` systems to manage path-following behavior, detect obstacles, and persist state across saves.

## Dependencies & Tags
- Requires components: `locomotor`, `stuckdetection` (used conditionally), `worldroutes` (expected on `TheWorld`), `physics` or `transform` (for teleportation).
- Adds no tags; internally checks for `"INLIMBO"`, `"NOCLICK"`, and `"FX"` tags when validating destination points.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the owning entity. |
| `pausedsources` | `SourceModifierList` | `SourceModifierList(inst, false, boolean)` | Tracks paused states (e.g., due to sleep or tasks); blocks route iteration while active. |
| `closeenoughdist` | `number` | `4` | Distance threshold (in world units) used to consider a route point "reached" during walking. |
| `virtualwalkingspeedmult` | `number` | `1` | Speed multiplier applied when teleporting on sleep, shortening the wait time for teleport. |
| `routename` | `string?` | `nil` | Name of the currently followed route (internal). |
| `routeindex` | `number?` | `nil` | Current index in the route array (1-based; internal). |
| `onarrivedfn` | `function?` | `nil` | Callback invoked when the entity successfully reaches and iterates a route node. |
| `isvalidpointforroutefn` | `function?` | `nil` | Custom validation function for route points (`function(x, y, z): boolean`). |
| `preteleportfn` | `function?` | `nil` | Callback invoked before teleporting; returning `true` defers the actual teleport. |
| `postteleportfn` | `function?` | `nil` | Callback invoked after teleporting completes. |
| `route` | `table?` | `nil` | Array of `{x, y, z}` coordinate tables representing the route (internal). |
| `routetimetoarrivemax` | `number?` | `nil` | Max expected arrival time at the current route point (internal). |
| `routetimeelapsed` | `number?` | `0` | Time elapsed since starting movement toward the current route point (internal). |
| `stuckteleportattempts` | `number?` | `nil` | Counter for consecutive teleport failure attempts; resets after success or on iteration. |

## Main Functions
### `SetCloseEnoughDist(dist)`
* **Description:** Configures the distance threshold (in world units) for considering a route point "reached" during walking.
* **Parameters:** `dist` (number) — New minimum distance for arrival detection.

### `SetVirtualWalkingSpeedMult(mult)`
* **Description:** Sets the speed multiplier used during sleep-based teleportation to calculate when to trigger teleport.
* **Parameters:** `mult` (number?) — Multiplier (default `1`); higher values shorten wait time.

### `SetIsValidPointForRouteFn(fn)`
* **Description:** Assigns a custom validation callback used to check if a route point is accessible (e.g., ignoring water or hazards).
* **Parameters:** `fn` (function) — Function of signature `function(x, y, z): boolean`.

### `SetPreTeleportFn(fn)`
* **Description:** Assigns a callback invoked before teleporting to the destination. If the callback returns `true`, teleport is deferred and must be invoked manually.
* **Parameters:** `fn` (function) — Function of signature `function(inst): boolean`.

### `SetPostTeleportFn(fn)`
* **Description:** Assigns a callback invoked after successful teleportation.
* **Parameters:** `fn` (function) — Function of signature `function(inst)`.

### `SetOnArrivedFn(fn)`
* **Description:** Assigns a callback invoked when the entity arrives at a route point and proceeds to the next.
* **Parameters:** `fn` (function) — Function of signature `function(inst)`.

### `GetRouteDestination()`
* **Description:** Returns the current route point (as `{x, y, z}`) or `nil` if no route is set.
* **Parameters:** None.

### `IsValidPoint(x, y, z)`
* **Description:** Checks if a point is valid for arrival: first using the custom validation function (if set), then ensuring no overlapping entities.
* **Parameters:** `x`, `y`, `z` (numbers) — Coordinates to validate.

### `FindValidPointNear(x, y, z)`
* **Description:** Attempts to find a nearby navigable point if the target destination is blocked. Searches outward from the target in concentric rings.
* **Parameters:** `x`, `y`, `z` (numbers) — Target coordinates.

### `TeleportToDestination()`
* **Description:** Executes the teleport to `self.teleportdest`, resets `teleportdest`, iterates the route, and invokes the post-teleport callback.
* **Parameters:** None.

### `TryToTeleportToDestination()`
* **Description:** Finds a valid point near the route destination, triggers pre-teleport callback, and initiates teleport if allowed. Returns `true` if teleport is scheduled or completed.
* **Parameters:** None.

### `IterateRoute(force)`
* **Description:** Advances to the next route point if the entity has reached the current one (`force=true` or within `closeenoughdist`) or is forced to skip (e.g., stuck). Returns `true` if the index changed.
* **Parameters:** `force` (boolean) — Skip arrival check and force progression.

### `SetRouteIndex(routeindex)`
* **Description:** Sets the current route point index, calculates max arrival time based on distance and speed, and starts the `OnUpdate` cycle if not already active.
* **Parameters:** `routeindex` (number) — 1-based index into `self.route`.

### `SetPaused(paused, reason)`
* **Description:** Pauses or unpauses route following using `SourceModifierList`. Unpausing resets stuck detection if present.
* **Parameters:** `paused` (boolean), `reason` (string) — Label for the pause source.

### `FollowRoute(routename, routeindexoverride)`
* **Description:** Starts following a named route from `TheWorld.components.worldroutes`. Finds the nearest point to the entity to begin if `routeindexoverride` is omitted.
* **Parameters:** `routename` (string), `routeindexoverride` (number?) — Optional starting index.

### `TryToStartVirtualWalk()`
* **Description:** Schedules a delayed teleport based on remaining travel time and `virtualwalkingspeedmult`. Used when the entity is asleep.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Core update loop; tracks elapsed time, detects stuck status, iterates route on arrival, and attempts teleport if stuck after repeated failures.
* **Parameters:** `dt` (number) — Delta time.

### `OnEntitySleep()`
* **Description:** Stops updates and schedules a sleep-based teleport if on a route.
* **Parameters:** None.

### `OnEntityWake()`
* **Description:** Cancels pending teleport timers and resumes updates if on a route.
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns route persistence data (name and index) or `nil` if not following a route.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores route following from saved data.
* **Parameters:** `data` (table?) — Must include `routename` and `routeindex`.

### `GetDebugString()`
* **Description:** Returns a formatted debug string showing route name, index, estimated teleport time, and trigger mechanism.
* **Parameters:** None.

## Events & Listeners
- Listens for:
  - `"entitysleep"` → `self:OnEntitySleep()`
  - `"entitywake"` → `self:OnEntityWake()`
  - `"sleepstampped"` (via `TheSim:ListenForEvent` pattern, handled in `OnSave`/`OnLoad`)
- Does not push events.