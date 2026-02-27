---
id: boatphysics
title: Boatphysics
description: Manages a boat entity's movement, speed, turning, and collision physics.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 26dcb416
---

# Boatphysics

## Overview
The Boatphysics component is the core engine for all boat movement and physical interactions in the game. It is responsible for calculating and applying forces from various sources like masts, magnets, and rowing. It also manages the boat's velocity, turning via a rudder system, drag from water and anchors, and handles collision detection and response with land, other boats, and obstacles.

## Dependencies & Tags

**Dependencies:**
*   `health`: Used to kill the boat if an invalid vertical collision occurs.
*   `boatdrifter`: Notified when the boat starts or stops moving.
*   `physicsmodifiedexternally`: Notified when drag components are added or removed to recalculate velocity.

**Tags:**
*   Adds the `scarytoprey` tag to the entity when its velocity exceeds `TUNING.BOAT.SCARY_MINSPEED`.
*   Removes the `scarytoprey` tag when the velocity drops below this threshold.

## Properties

| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `velocity_x`, `velocity_z` | `number` | `0` | The boat's current velocity along the world X and Z axes. |
| `has_speed` | `boolean` | `false` | Tracks if the boat is moving fast enough to be considered a threat to prey. |
| `max_velocity` | `number` | `TUNING.BOAT.MAX_VELOCITY_MOD` | A modifier that scales the boat's maximum potential velocity. |
| `masts` | `table` | `{}` | A collection of active mast components attached to this boat. |
| `magnets` | `table` | `{}` | A collection of active magnet components attached to this boat. |
| `boatdraginstances` | `table` | `{}` | A collection of active components that apply drag, such as anchors. |
| `target_rudder_direction_x`, `target_rudder_direction_z` | `number` | `1`, `0` | The target direction vector for the rudder, typically set by player input. |
| `rudder_direction_x`, `rudder_direction_z` | `number` | `1`, `0` | The current, smoothly interpolated direction vector of the rudder. |
| `steering_rotate` | `boolean` | `false` | If true, the boat's visual transform will rotate to match the rudder's direction. |
| `emergencybrakesources` | `SourceModifierList` | `SourceModifierList()` | Manages external requests to apply an "emergency brake" and halt the boat. |

## Main Functions

### `AddBoatDrag(boatdraginst)`
* **Description:** Registers a component that applies drag to the boat (e.g., an anchor). It also sets up listeners to automatically remove the drag component if it is removed from the world.
* **Parameters:**
    * `boatdraginst`: The entity instance containing a `boatdrag` component to be added.

### `RemoveBoatDrag(boatdraginst)`
* **Description:** Unregisters a component that applies drag, removing its effects from the boat's physics calculations.
* **Parameters:**
    * `boatdraginst`: The entity instance containing a `boatdrag` component to be removed.

### `SetTargetRudderDirection(dir_x, dir_z)`
* **Description:** Sets the desired direction for the boat's rudder. The rudder will smoothly turn towards this target direction over time.
* **Parameters:**
    * `dir_x`: The X component of the target direction vector.
    * `dir_z`: The Z component of the target direction vector.

### `AddMast(mast)`
* **Description:** Adds a mast instance to the boat's list of propulsion sources.
* **Parameters:**
    * `mast`: The mast entity instance to add.

### `RemoveMast(mast)`
* **Description:** Removes a mast instance from the boat's list of propulsion sources.
* **Parameters:**
    * `mast`: The mast entity instance to remove.

### `AddMagnet(magnet)`
* **Description:** Adds a magnet instance to the boat's list of propulsion sources.
* **Parameters:**
    * `magnet`: The magnet entity instance to add.

### `RemoveMagnet(magnet)`
* **Description:** Removes a magnet instance from the boat's list of propulsion sources.
* **Parameters:**
    * `magnet`: The magnet entity instance to remove.

### `ApplyRowForce(dir_x, dir_z, force, max_velocity)`
* **Description:** Applies force to the boat as if from rowing. The force effectiveness is modified based on the current velocity and direction, simulating resistance from the water.
* **Parameters:**
    * `dir_x`, `dir_z`: The direction vector of the force.
    * `force`: The magnitude of the force to apply.
    * `max_velocity`: The maximum velocity achievable with this type of rowing.

### `ApplyForce(dir_x, dir_z, force)`
* **Description:** Applies a direct force to the boat, scaled by the boat's current total force dampening from drag sources.
* **Parameters:**
    * `dir_x`, `dir_z`: The direction vector of the force.
    * `force`: The magnitude of the force to apply.

### `GetMaxVelocity()`
* **Description:** Calculates the boat's theoretical maximum velocity. This is a complex calculation based on the combined power of all attached masts and magnets, with diminishing returns for multiple sources, and modified by any active drag components.
* **Returns:** A `number` representing the maximum achievable velocity.

### `SetCanSteeringRotate(can_rotate)`
* **Description:** Toggles whether the boat's visual model should rotate along with the rudder. When enabled, the boat's rotation offset is locked in to maintain a consistent orientation relative to the rudder.
* **Parameters:**
    * `can_rotate`: A `boolean` value; `true` to enable steering rotation, `false` to disable.

### `AddEmergencyBrakeSource(source)`
* **Description:** Adds a source that requests the boat to halt immediately. The boat will not move as long as at least one source is active. Used for gameplay mechanics that need to stop the boat.
* **Parameters:**
    * `source`: A unique identifier for the entity or system applying the brake.

### `RemoveEmergencyBrakeSource(source)`
* **Description:** Removes a source requesting the boat to halt. If no other sources are active, the boat will resume normal physics.
* **Parameters:**
    * `source`: The unique identifier for the source to be removed.

### `SetHalting(halt)`
* **Description:** A specific control function, primarily used by the `walkableplatform` component, to force the boat to stop if it is in a bad state (e.g., beached on land). For general gameplay use, `AddEmergencyBrakeSource` is preferred.
* **Parameters:**
    * `halt`: A `boolean`; `true` to halt the boat, `false` to release it.

### `CloseAllSails()`
* **Description:** Utility function that iterates through all attached masts and calls their `CloseSail` function.
* **Parameters:** None.

### `AddAnchorCmp(anchor)`
* **Description:** This function is deprecated. Use `AddBoatDrag` instead.
* **Parameters:**
    * `anchor`: The anchor component.

### `RemoveAnchorCmp(anchor)`
* **Description:** This function is deprecated. Use `RemoveBoatDrag` instead.
* **Parameters:**
    * `anchor`: The anchor component.

## Events & Listeners

**Listens For:**
*   `death`: When the boat entity is destroyed, this listener ensures the boat movement sound is killed.
*   `onremove` (on drag source): Listens for the removal of any attached drag source to properly clean it up.
*   `death` (on drag source): Listens for the destruction of any attached drag source to properly clean it up.
*   `onburnt` (on drag source): Listens for the burning of any attached drag source to properly clean it up.

**Pushes:**
*   `on_collide`: Pushed when the boat collides with another object. The event data includes details about the collision, such as the other object and contact points.
*   `hit_boat`: Pushed on the other entity that this boat collides with.
*   `stopturning`: Pushed when the rudder has finished turning and has aligned with its target direction.
*   `boat_stop_moving`: Pushed once when the boat's velocity drops to zero.
*   `boat_start_moving`: Pushed once when the boat begins to move from a standstill.