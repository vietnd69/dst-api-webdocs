---
id: beargeroffscreen
title: Beargeroffscreen
description: Controls off-screen roaming behavior for Bearger by moving it along a predefined wandering path and destroying objects in its path.
tags: [ai, movement, boss, environment, combat]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 9085fc49
system_scope: world
---

# Beargeroffscreen

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BeargerOffScreen` is a behaviour node responsible for off-screen movement and environmental interaction for the Bearger boss. It manages pathfinding within a defined roaming boundary, destroys trees and boulders along its path, and drops trail items (e.g., fur tufts) as visual and loot feedback. The component extends `BehaviourNode`, integrates with the grid-based world topology, and depends on the `workable` and `lootdropper` components for destruction and loot handling.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("bearger")
inst:AddComponent("beargeroffscreen")
inst.components.beargeroffscreen:Visit()
```

## Dependencies & tags
**Components used:** `workable`, `lootdropper`
**Tags:** None added or removed by this component (check for `"running"`, `"tree"`, `"boulder"` tags on other entities).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (none) | The entity instance this behaviour controls (expected to be Bearger). |
| `waittime` | number | `0` | Timestamp of the next allowed move action. |
| `roamedBefore` | boolean | `false` | Tracks whether initial roaming region setup has occurred. |
| `boundary` | table | `nil` | Array of points defining the convex hull of the current roaming area. |
| `roamAreaNode` | `Node` | `nil` | The central topology node of the current roaming region. |
| `roamAreaReached` | boolean | `false` | Whether Bearger has entered its roaming boundary. |
| `destpos` | `Point` | `nil` | Current target destination position. |
| `lastangle` | number | `nil` | Last heading angle for smoothing wander direction. |
| `finaldest` | table | `nil` | Destination node for grid-aligned movement (unused in current `PickNewDirection_Rampage` path). |
| `lastvisitednode` | `Node` | `nil` | Previously visited topology node (for path redundancy avoidance). |

## Main functions
### `WorkEntitiesAlongLine(x1, y1, x2, y2, radius)`
* **Description:** Destroys all `workable` entities (trees, boulders) that lie within a given radius along a line segment. Also sets their loot table to empty if they are trees or boulders.
* **Parameters:**
  * `x1`, `y1` (number) — Start point of the line segment.
  * `x2`, `y2` (number) — End point of the line segment.
  * `radius` (number) — Tolerance radius for entity proximity to the line.
* **Returns:** Nothing.
* **Error states:** No effect if the entity lacks `workable` or if `CanBeWorked()` returns false.

### `DropTrailItem(x, y, z)`
* **Description:** Spawns a `furtuft` prefab at the specified world coordinates.
* **Parameters:**
  * `x`, `y`, `z` (number) — World position to spawn the trail item.
* **Returns:** Nothing.

### `DropTrail(x1, y1, x2, y2, dropsPerUnitChance)`
* **Description:** Iterates along a line segment and probabilistically drops trail items based on a per-unit chance.
* **Parameters:**
  * `x1`, `y1`, `x2`, `y2` (number) — Start and end coordinates.
  * `dropsPerUnitChance` (number) — Probability (0–1) of dropping an item per unit of distance.
* **Returns:** Nothing.

### `DropGroundPoundTrail()`
* **Description:** Drops a random number of trail items in a circular pattern around Bearger’s current position (used for ground pound effect, currently disabled in gameplay logic).
* **Parameters:** None.
* **Returns:** Nothing.

### `SetupRoaming()`
* **Description:** Initializes or updates the roaming boundary (via convex hull of nearby topology nodes) and sets initial state for wandering within that region.
* **Parameters:** None.
* **Returns:** Nothing.

### `Roam()`
* **Description:** Moves Bearger directly to `destpos`, destroys objects along the path, drops trail items, and computes the next wander destination.
* **Parameters:** None.
* **Returns:** Nothing.

### `Visit()`
* **Description:** Main entry point for the behaviour node. If status is `READY`, initializes roaming; otherwise executes one roam step and schedules the next after `timePerStep` seconds.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Calls `self:Sleep(0.01)` at the end to allow future node rescheduling.

### `GetRandomWanderDestWithinBoundary(lookAhead, moveRadius, curAngle)`
* **Description:** Samples candidate points in a fan pattern to find a valid walkable offset within the roaming boundary and within line-of-sight.
* **Parameters:**
  * `lookAhead` (number) — Max distance to scan ahead.
  * `moveRadius` (number) — Fraction of `lookAhead` to clamp final movement distance.
  * `curAngle` (number) — Starting angle (optional; defaults to stored `lastangle`).
* **Returns:** `Point`, number — Destination point and the final checked angle.

### `PickNewDirection_Rampage()`
* **Description:** Selects the next destination for Bearger. Initially steers toward the roaming center; afterward, uses `GetRandomWanderDestWithinBoundary` to pick random wander points inside the boundary.
* **Parameters:** None.
* **Returns:** Nothing.

### `PickNewDirection()`
* **Description:** Legacy grid-based pathfinding (unused in current `Visit()` flow). Populates `finaldest` with the next topology node.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified.
