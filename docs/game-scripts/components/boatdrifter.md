---
id: boatdrifter
title: Boatdrifter
description: Manages the physics and movement states of a boat, distinguishing between active movement and passive drifting.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 21e4680f
---

# Boatdrifter

## Overview
The `boatdrifter` component is responsible for managing a boat's movement state, specifically tracking whether it is actively moving or passively drifting. It controls the boat's physics simulation, putting it to sleep to save performance when it is stationary and waking it up when it needs to move. This component also interfaces with the `PhysicsWaker` to handle interactions with waves.

## Dependencies & Tags
**Dependencies:**
- `PhysicsWaker`: This component relies on `inst.PhysicsWaker` to manage wake tests, which determine if the boat should be woken up by environmental factors like waves.

**Tags:**
- None identified.

## Properties

| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `is_moving` | boolean | `false` | Tracks if the boat is currently considered to be in motion. |
| `is_drifting` | boolean | `false` | Tracks if the boat is specifically in a drifting state (moving without active propulsion). |
| `stop_boat_physics_task` | task | `nil` | Holds the task handle for the delayed call to stop the boat's physics simulation. |

## Main Functions
### `IsMoving()`
* **Description:** Returns `true` if the boat is currently considered to be moving, either through propulsion or drifting.
* **Parameters:** None.

### `IsDrifting()`
* **Description:** Returns `true` only if the boat is both moving and in a drifting state.
* **Parameters:** None.

### `StartBoatPhysics()`
* **Description:** Activates the boat's physics simulation. If a task to stop the physics was pending, it is cancelled.
* **Parameters:** None.

### `StopBoatPhysics()`
* **Description:** Schedules a task to stop the boat's physics simulation after a short delay (`BOAT_PHYSICS_SLEEP_DELAY`). This prevents the physics from being rapidly toggled on and off.
* **Parameters:** None.

### `StartWakeTests()`
* **Description:** Tells the associated `PhysicsWaker` component to begin testing for conditions (like waves) that should wake the boat's physics simulation.
* **Parameters:** None.

### `StopWakeTests()`
* **Description:** Tells the associated `PhysicsWaker` component to stop its wake tests.
* **Parameters:** None.

### `OnStartDrifting()`
* **Description:** Sets the boat's state to drifting. If the boat is already moving, it will start wake tests.
* **Parameters:** None.

### `OnStopDrifting()`
* **Description:** Sets the boat's state to not drifting and stops all wake tests.
* **Parameters:** None.

### `OnStartMoving()`
* **Description:** Sets the boat's state to moving and starts the boat's physics simulation. If the boat is also drifting, it will start wake tests.
* **Parameters:** None.

### `OnStopMoving()`
* **Description:** Sets the boat's state to not moving, stops wake tests, and stops the boat's physics simulation if the entity is asleep.
* **Parameters:** None.

### `OnEntitySleep()`
* **Description:** A handler called when the entity enters a sleep state. It stops the boat's physics if the boat is not moving.
* **Parameters:** None.

### `OnEntityWake()`
* **Description:** A handler called when the entity wakes up. It ensures the boat's physics are active.
* **Parameters:** None.