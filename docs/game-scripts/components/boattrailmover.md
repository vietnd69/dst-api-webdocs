---
id: boattrailmover
title: Boattrailmover
description: Manages movement and trajectory tracking for a boat entity in the game world.
tags: [locomotion, boat, physics]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4076a7ff
system_scope: locomotion
---

# Boattrailmover

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatTrailMover` is a movement component responsible for updating a boat entity's position over time based on velocity and acceleration. It handles linear motion along a calculated direction vector and dynamically rotates the entity to align with its movement direction (via rudder angle). The component is started via `Setup` and updated each frame through `OnUpdate`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("boattrailmover")
inst.components.boattrailmover:Setup(1, 0, 5.0, -1.0) -- Move right with deceleration
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `track_boat_time` | number | `0.4` | Internal timer (unused in current implementation). |
| `dir_x` | number | — | Negative X-component of the movement direction vector. |
| `dir_z` | number | — | Negative Z-component of the movement direction vector. |
| `velocity` | number | — | Current movement speed (updated each frame). |
| `acceleration` | number | — | Rate of change of velocity (positive accelerates, negative decelerates). |

## Main functions
### `Setup(dir_x, dir_z, velocity, acceleration)`
* **Description:** Initializes the component's motion parameters, computes and sets the entity's rotation to match the rudder angle, and starts the update loop.
* **Parameters:**
  * `dir_x` (number) — X direction of motion (forward is positive).
  * `dir_z` (number) — Z direction of motion (forward is positive).
  * `velocity` (number) — Initial velocity (in units per second).
  * `acceleration` (number) — Constant acceleration (positive for speed up, negative for slow down).
* **Returns:** Nothing.
* **Error states:** None identified.

### `OnUpdate(dt)`
* **Description:** Advances the boat's position by applying velocity and acceleration over the time delta `dt`, and updates the entity's position in world space.
* **Parameters:**
  * `dt` (number) — Delta time since the last frame (in seconds).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
