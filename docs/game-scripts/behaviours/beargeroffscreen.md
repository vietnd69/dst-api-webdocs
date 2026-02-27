---
id: beargeroffscreen
title: Beargeroffscreen
description: Controls off-screen movement and environmental interaction for Bearger during its off-screen phase, including path planning, terrain traversal, obstacle clearing, and trail item generation.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: 9085fc49
---

# Beargeroffscreen

## Overview

`BeargerOffScreen` is a behaviour node responsible for managing off-screen movement logic for the Bearger entity. It handles navigation within a defined roaming area, clears obstacles along its path (e.g., trees, boulders), and drops trail items as visual/audio feedback. It integrates with the pathfinding topology and uses convex hulls to define roam boundaries dynamically.

The component extends `BehaviourNode`, operating as a stateful unit within DST’s behaviour tree framework. It interacts with the `workable` and `lootdropper` components to destroy or strip loot from obstacles in its path, and ensures movement remains confined to walkable, non-water tiles within its boundary.

## Dependencies & Tags

- **Components used:**
  - `lootdropper`: Calls `SetLoot({})` and checks existence via `ent.components.lootdropper ~= nil`.
  - `workable`: Calls `CanBeWorked()` and `Destroy(self.inst)` to process and remove walkable obstacles.
- **Tags:**
  - Checks for `tree` and `boulder` tags via `inst:HasTag(...)`.
  - Filters entities with `musthaveoneoftags = {"running","tree"}` during line-scan.
- **No tags are added or removed** by this component.

## Properties

| Property           | Type       | Default Value | Description |
|--------------------|------------|---------------|-------------|
| `inst`             | `Entity`   | —             | Reference to the Bearger entity instance. |
| `waittime`         | `number`   | `0`           | Timestamp used to throttle update frequency (`timePerStep = 3` seconds). |
| `roamedBefore`     | `boolean`  | `nil` (→ `true`) | Marks whether the initial roaming area has been established. |
| `boundary`         | `array`    | `nil`         | Array of points representing the convex hull of the current roam area. |
| `roamAreaNode`     | `Node`     | `nil`         | Topology node at the center of the current roam area. |
| `roamAreaReached`  | `boolean`  | `false`       | Indicates whether the entity has entered its roam boundary. |
| `destpos`          | `Point`    | `nil`         | Target world position for the next step of movement. |
| `lastangle`        | `number`   | `nil`         | Last movement direction angle (used for correlated wandering). |
| `finaldest`        | `table`    | `nil`         | Destination node and position (used by `PickNewDirection`, though unused in `PickNewDirection_Rampage`). |
| `lastvisitednode`  | `Node`     | `nil`         | Previously visited node (used to avoid backtracking in `PickNewDirection`). |

## Main Functions

### `WorkEntitiesAlongLine(x1, y1, x2, y2, r)`
* **Description:** Detects entities (trees, boulders) lying within radius `r` along the line segment from `(x1,y1)` to `(x2,y2)`, destroys them via `workable:Destroy`, and clears associated loot for certain entity types.
* **Parameters:**
  - `x1`, `y1`: Start world coordinates (Z-axis used as Y).
  - `x2`, `y2`: End world coordinates.
  - `r`: Detection radius (in world units).
* **Returns:** `nil`.

### `DropTrailItem(x, y, z)`
* **Description:** Spawns the `furtuft` prefab at the specified world position.
* **Parameters:**
  - `x`, `y`, `z`: World coordinates for spawn.
* **Returns:** `nil`.

### `DropTrail(x1, y1, x2, y2, dropsPerUnitChance)`
* **Description:** Iterates along the line segment from `(x1,y1)` to `(x2,y2)` and spawns trail items probabilistically based on `dropsPerUnitChance`. Each step has a chance to drop a `furtuft` with slight positional spread.
* **Parameters:**
  - `x1`, `y1`, `x2`, `y2`: Line segment endpoints.
  - `dropsPerUnitChance`: Probability per world unit traveled (e.g., `0.05`).
* **Returns:** `nil`.

### `DropGroundPoundTrail()`
* **Description:** Generates a radial spray of `furtuft` items around Bearger’s current position. Intended for use with a ground-pound animation (currently disabled via `poundChance = 0`).
* **Parameters:** None.
* **Returns:** `nil`.

### `SetupRoaming()`
* **Description:** Initializes the roam area during first entry. Computes a convex hull around nodes reachable from the closest topology node (`GrabSubGraphAroundNode`) and sets `self.boundary`. Also sets `roamAreaNode`, `roamAreaReached`, and triggers `PickNewDirection_Rampage`.
* **Parameters:** None.
* **Returns:** `nil`.

### `Roam()`
* **Description:** Moves Bearger to `self.destpos`, clears obstacles along the path, and drops trail items. Resets direction via `PickNewDirection_Rampage`.
* **Parameters:** None.
* **Returns:** `nil`.

### `Visit()`
* **Description:** Main entry point for the behaviour tree step. If `status == READY`, initializes roaming area and sets `waittime`. Otherwise, moves and resets `waittime`. Uses `Sleep(0.01)` to return control to the behaviour tree.
* **Parameters:** None.
* **Returns:** `nil`.

### `GetRandomWanderDestWithinBoundary(lookAhead, moveRadius, curAngle)`
* **Description:** Finds a random destination within `self.boundary` using `FindWalkableOffsetWithBoundary`. Ensures the candidate point is within the polygon, on walkable terrain, and has line-of-sight.
* **Parameters:**
  - `lookAhead`: Maximum distance to scan for candidates (`scanAheadRadius = 15`).
  - `moveRadius`: Distance from candidate to actually move (`moveRadius = 10`).
  - `curAngle`: Current angle (ignored; uses `self.lastangle` instead).
* **Returns:** `{x,y,z} Point`, `check_angle` (scalar).

### `PickNewDirection_Rampage()`
* **Description:** Computes the next movement destination. If `roamAreaReached` is `false`, moves toward the center of the roam area (`roamAreaNode`). Otherwise, picks a random destination within the boundary via `GetRandomWanderDestWithinBoundary`.
* **Parameters:** None.
* **Returns:** `nil`.

### `PickNewDirection()`
* **Description:** Legacy path-planning function using topology nodes (not used by current `Roam` logic). Finds a connected node to proceed to, avoiding immediate backtracking.
* **Parameters:** None.
* **Returns:** `nil`.

## Events & Listeners

**None identified.**  
This component does not register or dispatch events; it operates via direct calls from the behaviour tree.