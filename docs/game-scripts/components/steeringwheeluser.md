---
id: steeringwheeluser
title: Steeringwheeluser
description: Manages a character's interaction with a steering wheel to control boat movement, including state transitions and rudder direction updates.
tags: [boat, locomotion, player]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5fced0e5
system_scope: locomotion
---
# Steeringwheeluser

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Steeringwheeluser` enables a character entity to take control of a boat via a `steeringwheel` component. It coordinates state transitions (entering/exiting steering), synchronizes the character's position with the steering wheel, manages rudder direction updates through the boat's `boatphysics` component, and listens for relevant events such as wheel or boat removal. It is typically attached to player prefabs to facilitate boat steering.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("steeringwheeluser")

-- Later, to begin steering:
local wheel = GetSomeSteeringWheelEntity()
inst.components.steeringwheeluser:SetSteeringWheel(wheel)

-- To manually steer toward a point:
inst.components.steeringwheeluser:Steer(target_x, target_z)

-- To steer in a specific direction:
inst.components.steeringwheeluser:SteerInDir(dir_x, dir_z)

-- To retrieve the current boat being steered:
local boat = inst.components.steeringwheeluser:GetBoat()
```

## Dependencies & tags
**Components used:**  
- `boatphysics` — accessed via `self.boat.components.boatphysics` to get/set rudder direction.  
- `steeringwheel` — accessed via `self.steering_wheel.components.steeringwheel` to start/stop steering.  

**Tags:** Adds `steeringboat` when actively steering; removes it when stopped.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to. |
| `steering_wheel` | `Entity?` | `nil` | Reference to the currently used steering wheel entity. |
| `boat` | `Entity?` | `nil` | Reference to the current boat platform (via `GetCurrentPlatform()`). |
| `should_play_left_turn_anim` | boolean | `false` | Indicates whether the left-turn animation should play based on rudder direction change. |
| `wheel_remove_callback` | function | — | Callback fired when the steering wheel is removed; handles cleanup. |
| `onstopturning` | function | — | Callback fired when the boat signals `stopturning` (e.g., rudder centered). |
| `onboatremoved` | function | — | Callback fired when the boat entity is removed. |

## Main functions
### `SetSteeringWheel(steering_wheel)`
* **Description:** Starts or stops steering a boat using the specified steering wheel. If a different wheel is provided, it cleanly transitions from the previous wheel. Passing `nil` ends steering and resets position/orientation state.  
* **Parameters:** `steering_wheel` (`Entity?`) — the steering wheel entity to use, or `nil` to stop steering.  
* **Returns:** Nothing.  
* **Error states:** No explicit error handling; silently ignores duplicate calls.

### `Steer(pos_x, pos_z)`
* **Description:** Calculates the steering direction from the boat's current position toward the given world coordinates (`pos_x`, `pos_z`) and sets the rudder accordingly.  
* **Parameters:**  
  - `pos_x` (number) — X coordinate of the target position.  
  - `pos_z` (number) — Z coordinate of the target position.  
* **Returns:** `boolean` — `true` if a boat is present and steering direction was computed; `false` if `self.boat` is `nil`.  

### `SteerInDir(dir_x, dir_z)`
* **Description:** Directly sets the boat's target rudder direction to the normalized input vector. Also determines whether to trigger the left-turn animation based on the cross product of current and target headings.  
* **Parameters:**  
  - `dir_x` (number) — X component of the desired rudder direction vector.  
  - `dir_z` (number) — Z component of the desired rudder direction vector.  
* **Returns:** Nothing.  
* **Error states:** Returns early (no-op) if `self.boat` is `nil`. Updates `should_play_left_turn_anim` only if the change in heading exceeds a small tolerance (`0.1`).

### `GetBoat()`
* **Description:** Returns the entity currently recognized as the boat platform.  
* **Parameters:** None.  
* **Returns:** `Entity?` — the boat entity, or `nil` if none.  

### `OnUpdate(dt)`
* **Description:** Called each frame while the character is updating as a steering user. Synchronizes the character's position with the steering wheel and validates steering state.  
* **Parameters:** `dt` (number) — delta time since the last frame.  
* **Returns:** Nothing.  
* **Error states:** Stops updating and exits steering if `self.steering_wheel` becomes `nil` or the state graph is no longer in a "steering" state.

## Events & listeners
- **Listens to:**  
  - `onremove` — on `steering_wheel` and `boat` entities, via `wheel_remove_callback` and `onboatremoved`.  
  - `stopturning` — on the boat entity, via `onstopturning` (fires `playerstopturning` event).  
- **Pushes:**  
  - `stop_steering_boat` — fired when steering ends.  
  - `playerstopturning` — fired when `stopturning` is received from the boat.  
  - `set_heading` — fired when rudder direction changes significantly (to trigger animation).
