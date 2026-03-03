---
id: archive_securitypulsebrain
title: Archive Securitypulsebrain
description: Manages AI behavior for an archive security entity that patrols between waypoints and targets power points when depleted.
tags: [ai, patrol, archive, boss]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 3bfd00dc
system_scope: brain
---

# Archive Securitypulsebrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Archive_SecurityPulseBrain` is a behavior tree–driven brain component that controls a non-player character in the Archipelago/Arcade map context (e.g., the Arcade Boss sequence). It prioritizes two patrol modes: first seeking and moving toward depleted security power points, and secondarily navigating between pre-designated waypoints. The brain uses a `PriorityNode` structure to select behavior based on the `inst.patrol` state. It depends on the `health` component to determine if a power point is low on health.

## Dependencies & tags
**Components used:** `health` (via `GetPercent()`), `Transform`
**Tags:** `archive_waypoint`, `security_powerpoint` (used for entity filtering), `INLIMBO`, `FX` (excluded during search)

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree root with a priority node. The tree first attempts to follow a depleted power point if `inst.patrol` is `true`; otherwise, it attempts to follow the next waypoint. If neither applies, the entity remains still.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None. Assumes `self.inst.patrol` and `self.inst.possession_range` are valid at time of call.

### `findwaypoint(inst)`
* **Description:** Finds the next valid waypoint in a chain using GUID-based history (`lastwaypointGUID`, `secondlastwaypointGUID`) and spatial filtering. Avoids backtracking and ensures line-of-sight between consecutive waypoints using `testbetweenpoints`.
* **Parameters:** `inst` (The entity instance) — used to query position, GUIDs, and connection to `Ents`.
* **Returns:** `TheEntity` (waypoint) or `nil` if no valid next waypoint found.
* **Error states:** May return `nil` if no waypoints exist in range, or if no valid next target passes the `testbetweenpoints` or history-checking filter.

### `FindPowerPoint(inst)`
* **Description:** Locates a nearby security power point that is sufficiently depleted (health < `MED_THRESHOLD_DOWN`, defaulting to 100%).
* **Parameters:** `inst` (The entity instance) — used to query position and distance.
* **Returns:** `TheEntity` (power point) or `nil` if none are found or all have sufficient health.
* **Error states:** Skips power points missing the `health` component or whose `GetPercent()` return value is `>= MED_THRESHOLD_DOWN`.

## Events & listeners
* **Pushes:** None.  
* **Listens to:** None. (Behavior tree execution is driven externally by the `BT` scheduler, not event callbacks.)

## Properties
*The brain does not declare public properties in its constructor. Behavior tuning is done via instance fields (e.g., `inst.patrol`, `inst.possession_range`, `inst.lastwaypointGUID`, etc.)*

## Constants & Helpers
The following local constants and helpers are defined within the module:

- `MIN_FOLLOW`, `MAX_FOLLOW`, `TARGET_FOLLOW`: Default Follow behavior thresholds for waypoints (`1`, `2`, `1`).
- `WAYPOINT_RANGE`: Search radius (34 units) for waypoints.
- `testbetweenpoints(pt1, pt2)`: Returns `true` if a midpoint between `pt1` and `pt2` is walkable ground (checked via `TheWorld.Map:IsVisualGroundAtPoint`).
- `findwaypoint(inst)` and `FindPowerPoint(inst)` are standalone functions used by the `Follow` behavior nodes.

## Usage example
This brain is intended to be assigned to a prefab via the ECS brain system:
```lua
inst:AddBrain("archive_securitypulsebrain")
-- Later, set patrol state and waypoints
inst.patrol = true
inst.possession_range = 15
inst.lastwaypointGUID = "some_waypoint_guid"
