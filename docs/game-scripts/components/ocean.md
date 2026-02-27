---
id: ocean
title: Ocean
description: Calculates and stores a 2D directional flow for ocean currents using randomized angles and a constant speed value.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 568610d1
---

# Ocean

## Overview
The Ocean component manages a simple 2D directional flow for ocean currents. It initializes with a random direction (aligned to eight cardinal/oriented diagonals offset by 22.5°) and a fixed speed, then provides methods to query the current angle, speed, and resulting directional vector (as a 3D vector with zero Y component).

## Dependencies & Tags
None identified

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity the component is attached to (assigned in constructor) |
| `currentAngle` | `number` | `0` | Current flow direction in degrees, initialized to one of eight discrete values: 22.5, 67.5, ..., 337.5 |
| `currentSpeed` | `number` | `1` | Constant scalar speed of the ocean flow |

## Main Functions

### `OnUpdate(dt)`
* **Description:** Placeholder method intended for per-frame updates; currently does nothing.
* **Parameters:** `dt` — Delta time since last frame (unused).

### `GetCurrentAngle()`
* **Description:** Returns the current ocean flow direction in degrees.
* **Parameters:** None

### `GetCurrentSpeed()`
* **Description:** Returns the fixed scalar speed of the ocean flow.
* **Parameters:** None

### `GetCurrentVec3()`
* **Description:** Computes and returns a 3D directional vector (x, 0, z) representing the ocean flow direction scaled by current speed. Uses standard trigonometric conversion from angle (in degrees) to unit vector components.
* **Parameters:** None  
* **Returns:** `(x, 0, z)` — x and z components computed as `speed * cos(angle)` and `speed * sin(angle)`, respectively.

## Events & Listeners
None