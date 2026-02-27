---
id: steeringwheeluser
title: Steeringwheeluser
description: Manages a player entity's interaction with a steering wheel, including orientation, animation triggers, and boat rudder control.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 5fced0e5
---

# Steeringwheeluser

## Overview
This component enables a player entity to operate a steering wheel by linking to a steering wheel entity, orienting the player, managing the `"steeringboat"` tag, and controlling the boat's rudder direction through the boat’s `boatphysics` component. It also handles animation state and cleanup when disengaging or moving away from the steering wheel.

## Dependencies & Tags
- **Dependencies:**  
  - Requires `inst.Physics:Teleport()` to reposition the player to the wheel.
  - Assumes presence of `inst.sg` (state graph) with `"is_using_steering_wheel"` state tag.
  - Relies on `self.steering_wheel.components.steeringwheel` (specifically `StartSteering()` and `StopSteering()` methods).
  - Relies on `self.boat.components.boatphysics` (specifically `GetRudderDirection()` and `SetTargetRudderDirection()` methods).
- **Tags Added/Removed:**  
  - Adds `"steeringboat"` tag when actively steering (`inst:AddTag("steeringboat")`).
  - Removes `"steeringboat"` tag upon disengaging (`inst:RemoveTag("steeringboat")`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | Reference to the owning player entity. |
| `should_play_left_turn_anim` | `boolean` | `false` | Indicates whether the left-turn animation should be played (used for visual feedback during rudder input). |
| `steering_wheel` | `Entity?` | `nil` | Reference to the currently engaged steering wheel entity. |
| `boat` | `Entity?` | `nil` | Reference to the boat currently under control (retrieved via `GetCurrentPlatform()`). |
| `wheel_remove_callback` | `function` | anonymous function | Callback triggered when the steering wheel is removed; handles disengagement and cleanup. |
| `onstopturning` | `function` | anonymous function | Callback triggered when the boat stops turning; emits `"playerstopturning"` event. |
| `onboatremoved` | `function` | anonymous function | Callback triggered when the boat is removed; clears the `boat` reference. |

## Main Functions

### `SetSteeringWheel(steering_wheel)`
* **Description:** Assigns or clears the currently active steering wheel. If switching wheels or clearing, it handles cleanup of old connections, tag management, event listeners, and state transitions (e.g., exiting `"stop_steering"` state). If assigning a new wheel, it links the player, updates position via teleport, sets `"steeringboat"` tag, registers listeners, and activates steering on the wheel.
* **Parameters:**  
  - `steering_wheel` (`Entity?`): The steering wheel entity to engage, or `nil` to disengage.

### `Steer(pos_x, pos_z)`
* **Description:** Computes a normalized direction vector from the boat’s current position toward the given world coordinates and initiates steering in that direction via `SteerInDir`. Returns `false` if no boat is attached.
* **Parameters:**  
  - `pos_x` (`number`): X-coordinate of the target position.  
  - `pos_z` (`number`): Z-coordinate of the target position.  
* **Returns:** `boolean` — `true` if steering was initiated, `false` if `self.boat` is `nil`.

### `SteerInDir(dir_x, dir_z)`
* **Description:** Sets the boat’s target rudder direction to the provided normalized direction vector. Determines whether a left-turn animation should play based on cross-product sign of current vs. target rudder direction, and triggers the `"set_heading"` event if direction change is significant (> tolerance).
* **Parameters:**  
  - `dir_x` (`number`): X-component of the target rudder direction (normalized).  
  - `dir_z` (`number`): Z-component of the target rudder direction (normalized).  

### `GetBoat()`
* **Description:** Returns the entity currently identified as the player’s platform (typically the boat).
* **Returns:** `Entity?` — The current platform entity.

### `OnUpdate(dt)`
* **Description:** Periodically called while the component is being updated. Verifies the steering wheel is still valid and that the state graph remains in `"is_using_steering_wheel"`; if not, it aborts. Ensures player position is synchronized with the steering wheel.
* **Parameters:**  
  - `dt` (`number`): Delta time since last update (unused in logic but passed by engine).

## Events & Listeners
- Listens for `"onremove"` on `steering_wheel` → triggers `wheel_remove_callback`.
- Listens for `"stopturning"` on `boat` → triggers `onstopturning`.
- Listens for `"onremove"` on `boat` → triggers `onboatremoved`.
- Pushes `"playerstopturning"` when `onstopturning` is invoked.
- Pushes `"set_heading"` when a new rudder direction is set and animation should play.
- Pushes `"stop_steering_boat"` when disengaging from a steering wheel (via `wheel_remove_callback`).