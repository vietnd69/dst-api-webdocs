---
id: boatdrifter
title: Boatdrifter
description: Manages the physics and movement state of a boat entity, including drift detection, physics activation/deactivation, and wake test lifecycle.
tags: [boat, movement, physics, state]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 21e4680f
system_scope: locomotion
---

# Boatdrifter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatDrifter` tracks and controls the movement state of a boat entity—specifically whether it is moving, drifting, or asleep—and manages the associated physics and wake test behavior. It responds to state changes (start/stop moving, drift, sleep/wake) to coordinate physics engine interaction and waking systems. This component is typically attached to boat prefabs to ensure proper interaction with physics and environmental systems like water wakes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("boatdrifter")
inst:ListenForEvent("startmoving", function() inst.components.boatdrifter:OnStartMoving() end)
inst:ListenForEvent("stopdrifting", function() inst.components.boatdrifter:OnStopDrifting() end)
```

## Dependencies & tags
**Components used:** `PhysicsWaker`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `is_moving` | boolean | `false` | Whether the boat is currently in motion. |
| `is_drifting` | boolean | `false` | Whether the boat is currently drifting (a specific type of movement). |
| `stop_boat_physics_task` | Task or `nil` | `nil` | Delayed task scheduled to stop boat physics after inactivity. |

## Main functions
### `IsMoving()`
* **Description:** Returns whether the boat is currently moving.
* **Parameters:** None.
* **Returns:** `true` if `is_moving` is `true`, otherwise `false`.

### `IsDrifting()`
* **Description:** Returns whether the boat is currently drifting. A boat is drifting if it is moving *and* `is_drifting` is `true`.
* **Parameters:** None.
* **Returns:** `true` if both `is_moving` and `is_drifting` are `true`, otherwise `false`.

### `StartBoatPhysics()`
* **Description:** Ensures boat physics are active. If a delayed stop task exists, it is cancelled; otherwise, `inst:StartBoatPhysics()` is invoked directly.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopBoatPhysics()`
* **Description:** Schedules a delayed call to `inst:StopBoatPhysics()` after `BOAT_PHYSICS_SLEEP_DELAY` (1 second), unless a scheduled task already exists.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if a stop task is already scheduled.

### `StartWakeTests()`
* **Description:** Enables wake test detection on the boat's physics system via `PhysicsWaker:StartWakeTests()`.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopWakeTests()`
* **Description:** Disables wake test detection on the boat's physics system via `PhysicsWaker:StopWakeTests()`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnStartDrifting()`
* **Description:** Marks the boat as drifting. If the boat is already moving, wake tests are started.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnStopDrifting()`
* **Description:** Marks the boat as no longer drifting and stops wake tests.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnStopMoving()`
* **Description:** Marks the boat as stopped moving. If the entity is asleep, boat physics are stopped. Wake tests are always stopped.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnStartMoving()`
* **Description:** Marks the boat as moving and starts boat physics. If drifting, wake tests are also started.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntitySleep()`
* **Description:** If the entity is not moving, scheduled or active boat physics are stopped.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntityWake()`
* **Description:** Ensures boat physics are active when the entity wakes.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified.

## Additional notes
- The component expects the owned entity to expose methods `StartBoatPhysics()`, `StopBoatPhysics()`, `IsAsleep()`, and a `PhysicsWaker` component.
- `OnRemoveEntity()` cancels pending tasks and ensures cleanup; `OnRemoveFromEntity` is an alias for `OnRemoveEntity`.
- `BOAT_PHYSICS_SLEEP_DELAY` is a constant (`1`) used to defer physics shutdown, allowing brief pauses before full sleep.
