---
id: boatphysics
title: Boatphysics
description: Manages boat movement, physics, steering, sail/magnet forces, drag, and collision response for watercraft entities.
tags: [physics, locomotion, water, vehicle, collision]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 26dcb416
system_scope: locomotion
---

# Boatphysics

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatPhysics` is the core component governing boat behavior in DST, handling velocity application, steering, sail/magnet force calculation, drag (including anchor drag), collision response, and state transitions (moving/stopped). It integrates with `boatdrag`, `boatdrifter`, `boatmagnetbeacon`, `health`, `physicsmodifiedexternally`, `steeringwheel`, and `waterphysics` components to simulate realistic boat dynamics and interactions with the environment. It is typically added to boat prefabs and updates physics state each frame via `OnUpdate`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("boatphysics")
inst:AddComponent("health")
inst:AddComponent("boatdrifter")

-- Apply forward force
inst.components.boatphysics:ApplyForce(1, 0, 10)

-- Set target rudder direction (turn right)
inst.components.boatphysics:SetTargetRudderDirection(0, -1)

-- Add an anchor (boat drag)
local anchor = CreateEntity()
anchor:AddComponent("boatdrag")
inst.components.boatphysics:AddBoatDrag(anchor)
```

## Dependencies & tags
**Components used:** `boatdrag`, `boatdrifter`, `boatmagnetbeacon`, `health`, `physicsmodifiedexternally`, `steeringwheel`, `waterphysics`  
**Tags:** Adds/removes `scarytoprey` based on velocity (`TUNING.BOAT.SCARY_MINSPEED`), sets mass to `0` during emergency braking.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `velocity_x` | number | `0` | X-component of current boat velocity. |
| `velocity_z` | number | `0` | Z-component of current boat velocity. |
| `has_speed` | boolean | `false` | Whether boat speed exceeds `SCARY_MINSPEED`. |
| `max_velocity` | number | `TUNING.BOAT.MAX_VELOCITY_MOD` | Global multiplier applied to max velocity calculations. |
| `rudder_turn_speed` | number | `TUNING.BOAT.RUDDER_TURN_SPEED` | Base turn speed when no sailor is engaged. |
| `masts` | table | `{}` | Set of attached mast components (used for sail force). |
| `magnets` | table | `{}` | Set of attached magnet components. |
| `boatdraginstances` | table | `{}` | Map of active `boatdrag` components to their components. |
| `target_rudder_direction_x` | number | `1` | Target rudder direction X-component. |
| `target_rudder_direction_z` | number | `0` | Target rudder direction Z-component. |
| `rudder_direction_x` | number | `1` | Current rudder direction X-component. |
| `rudder_direction_z` | number | `0` | Current rudder direction Z-component. |
| `boat_rotation_offset` | number | `0` | Rotation offset for steering wheel alignment. |
| `steering_rotate` | boolean | `false` | Whether the boat rotates with the rudder (vs masts rotating). |
| `emergencybrakesources` | SourceModifierList | `SourceModifierList(...) ` | Tracks emergency brake sources to halt boat. |
| `halting` | boolean | `false` | True if boat is being forcibly halted (e.g., emergency brake). |

## Main functions
### `AddBoatDrag(boatdraginst)`
*   **Description:** Registers a `boatdrag` component (e.g., anchor) to apply drag to the boat. Must be called before the drag component is active.
*   **Parameters:** `boatdraginst` (Entity) - Entity with `boatdrag` component.
*   **Returns:** Nothing.
*   **Error states:** Registers event listeners for `onremove`, `death`, and `onburnt` to auto-remove the drag source.

### `RemoveBoatDrag(boatdraginst)`
*   **Description:** Removes a previously added `boatdrag` component from the boat.
*   **Parameters:** `boatdraginst` (Entity) - Entity previously added via `AddBoatDrag`.
*   **Returns:** Nothing.
*   **Error states:** Removes associated event listeners.

### `SetTargetRudderDirection(dir_x, dir_z)`
*   **Description:** Sets the target rudder direction (normalized vector) for steering.
*   **Parameters:** `dir_x` (number), `dir_z` (number) - Direction components.
*   **Returns:** Nothing.

### `GetRudderDirection()`
*   **Description:** Returns the current rudder direction (may lag behind target during turning).
*   **Parameters:** None.
*   **Returns:** `dir_x` (number), `dir_z` (number).

### `ApplyForce(dir_x, dir_z, force)`
*   **Description:** Applies a force vector in world space, multiplied by the current force dampening (based on anchors).
*   **Parameters:** `dir_x` (number), `dir_z` (number) - Force direction components. `force` (number) - Magnitude of force.
*   **Returns:** Nothing.

### `ApplyRowForce(dir_x, dir_z, force, max_velocity)`
*   **Description:** Simulates rowing: splits force into forward/side components relative to current velocity and applies dampening based on `easing.inExpo`.
*   **Parameters:** `dir_x` (number), `dir_z` (number) - Rowing direction. `force` (number) - Force magnitude. `max_velocity` (number) - Max speed limit for damping calculation.
*   **Returns:** Nothing.

### `GetMaxVelocity()`
*   **Description:** Computes the maximum allowed velocity based on active sails, masts, magnets, and drag anchors, capped by `TUNING.BOAT.MAX_ALLOWED_VELOCITY`.
*   **Parameters:** None.
*   **Returns:** `max_vel` (number).

### `GetTotalAnchorDrag()`
*   **Description:** Sums the `drag` values of all active `boatdrag` sources.
*   **Parameters:** None.
*   **Returns:** `total_anchor_drag` (number).

### `GetBoatDrag(velocity, total_anchor_drag)`
*   **Description:** Calculates total drag force using cubic easing for base drag and exponential easing for anchor drag.
*   **Parameters:** `velocity` (number), `total_anchor_drag` (number).
*   **Returns:** `drag_force` (number).

### `GetRudderTurnSpeed()`
*   **Description:** Returns current rudder turn speed, increased if a `master_crewman` is steering via a `steeringwheel`.
*   **Parameters:** None.
*   **Returns:** `speed` (number).

### `AddEmergencyBrakeSource(source)`
*   **Description:** Activates emergency brakes, halting the boat and setting its physics mass to `0`.
*   **Parameters:** `source` (string) - Unique identifier for the brake source.
*   **Returns:** Nothing.

### `RemoveEmergencyBrakeSource(source)`
*   **Description:** Deactivates a previously added emergency brake source.
*   **Parameters:** `source` (string).
*   **Returns:** Nothing.

### `SetHalting(halt)`
*   **Description:** Internal method to toggle the `HALTING_SOURCE` emergency brake, primarily used when the boat is in a bad state (e.g., unsupported). Closes all sails.
*   **Parameters:** `halt` (boolean).
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Per-frame update loop handling steering interpolation, sail/magnet forces, drag application, and state transitions (start/stop moving). Also updates tags, camera zoom, and physics motor velocity.
*   **Parameters:** `dt` (number) - Time since last frame.
*   **Returns:** Nothing.

### `OnDeath()`
*   **Description:** Stops boat movement sound when the boat dies.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `death` - calls `on_death` to stop sound; `onremove`, `onburnt` - auto-removes boat drag components via `on_boatdrag_removed`.
- **Pushes:** `on_collide` - on collision (includes impact data); `hit_boat` - sent to colliding entity; `boat_start_moving`, `boat_stop_moving` - state transitions; `stopturning` - when rudder reaches target within tolerance.
- **Listens to (events):** `death` → `on_death`; `onremove`, `onburnt` → `on_boatdrag_removed`.
- **Pushes (events):** `on_collide`, `hit_boat`, `boat_start_moving`, `boat_stop_moving`, `stopturning`.
