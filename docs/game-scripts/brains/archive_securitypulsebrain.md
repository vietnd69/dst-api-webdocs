---
id: archive_securitypulsebrain
title: Archive Securitypulsebrain
description: Controls the patrol and power-point-following behavior for archive security entities in the DST Archive worldgen system.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 3bfd00dc
---

# Archive Securitypulsebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component implements behavior logic for archive security entities (e.g., security pulse guardians), enabling them to patrol using a sequence of waypoints or seek out damaged power points when `inst.patrol` is enabled. It is a subclass of `Brain` and constructs a behavior tree (`BT`) upon activation. The brain relies on external helper functions (`findwaypoint`, `FindPowerPoint`) to locate movement targets and integrates with the `Health` component to verify power point usability.

It fits into the larger game architecture as part of the entity behavior system, specifically supporting dynamic patrol routing in the Archive world generation context.

## Dependencies & Tags

- **Components used:**
  - `Health` (`self.inst.components.health:GetPercent()`) — Used to check if a power point is below its MED_THRESHOLD_DOWN health ratio.

- **Tags:**
  - `archive_waypoint` — Required tag for waypoint entities used in patrol routing.
  - `security_powerpoint` — Required tag for power point entities targeted for repair.

- **Excluded tags (ignored entities):**
  - `INLIMBO`, `FX` — Entities with these tags are filtered out when searching for power points.

## Properties

No public properties are initialized in the constructor. The component primarily uses instance fields (`inst.lastwaypointGUID`, `inst.secondlastwaypointGUID`) and runtime behavior tree logic.

## Main Functions

### `findwaypoint(inst)`
* **Description:** Locates the next waypoint in a patrol sequence for the entity. It first attempts to reuse the last known waypoint by GUID. If unavailable or invalid, it searches for nearby waypoints (within `WAYPOINT_RANGE = 34`) and filters them to avoid backtracking (using `secondlastwaypointGUID`). If multiple candidates remain, it selects one at random.
* **Parameters:**
  - `inst` (`Entity`) — The entity instance that owns this brain and is currently patrolling.
* **Returns:**
  - `Entity?` — The chosen next waypoint entity, or `nil` if no valid waypoints are found.

### `FindPowerPoint(inst)`
* **Description:** Finds a nearby power point that is still functional (i.e., health percentage is `>= MED_THRESHOLD_DOWN`). Filters out power points below this threshold.
* **Parameters:**
  - `inst` (`Entity`) — The entity instance initiating the search.
* **Returns:**
  - `Entity?` — The first valid functional power point within a 20-unit radius, or `nil` if none are found.

### `testbetweenpoints(pt1, pt2)`
* **Description:** Checks whether two points are connected by an unobstructed visual line of sight (checks ground and elevation via `TheWorld.Map:IsVisualGroundAtPoint` at the midpoint). Used to avoid waypoint chains that jump over terrain discontinuities.
* **Parameters:**
  - `pt1` (`Entity`) — First point entity.
  - `pt2` (`Entity`) — Second point entity.
* **Returns:**
  - `boolean` — `true` if a direct visual path exists between the points, `false` otherwise.

### `Archive_SecurityPulseBrain:OnStart()`
* **Description:** Initializes the behavior tree root node when the brain starts. Defines two patrol strategies under a `WhileNode` guard based on `self.inst.patrol`. If `patrol` is true, the entity prioritizes moving toward functional power points before falling back to waypoint-based patrol. If `patrol` is false, the entity remains idle via `StandStill`.
* **Parameters:** None.
* **Returns:** None (sets `self.bt`).

## Events & Listeners

None identified.

## Key Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `MIN_FOLLOW` | `1` | Minimum distance to maintain from target during waypoint patrol. |
| `MAX_FOLLOW` | `2` | Maximum distance allowed before stopping pursuit during waypoint patrol. |
| `TARGET_FOLLOW` | `1` | Target distance used for smooth movement interpolation. |
| `WAYPOINT_RANGE` | `34` | Search radius for finding nearby waypoints. |
| `POWERPOINT_RANGE` (implicit) | `20` | Search radius for finding nearby power points. |