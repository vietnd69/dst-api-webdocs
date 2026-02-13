---
id: blowinwind
title: Blowinwind
description: Manages an entity's movement and sound to simulate being blown around by the wind.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Blowinwind

## Overview
The `Blowinwind` component simulates an entity being affected by wind, controlling its movement, rotation, and associated sound. It works by continuously applying a velocity towards a target wind direction, causing the entity to drift and turn smoothly. The movement speed is varied over time to create a more natural, gusting effect. This component requires the entity to also have a `locomotor` component to handle the actual movement.

## Dependencies & Tags
**Dependencies:**
- `locomotor`: Required for the entity to move.
- `SoundEmitter`: Required for playing and controlling wind sounds.

**Tags:**
- None identified.

## Properties
| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `maxSpeedMult` | number | `1.5` | The maximum speed multiplier applied during speed variation. |
| `minSpeedMult` | number | `0.5` | The minimum speed multiplier applied during speed variation. |
| `averageSpeed` | number | `(TUNING.WILSON_RUN_SPEED + TUNING.WILSON_WALK_SPEED)/2` | The base speed used for movement calculations. |
| `speed` | number | `0` | The current calculated movement speed of the entity. |
| `windAngle` | number | `0` | The target angle (in degrees) of the wind's direction. |
| `windVector` | Vector3 | `Vector3(0,0,0)` | The normalized vector representing the target wind direction. |
| `velocity` | Vector3 | `Vector3(0,0,0)` | The entity's current velocity vector, used for smooth direction changes. |
| `soundParameter` | string | `nil` | The FMOD sound parameter to be controlled by the entity's speed. |
| `soundName` | string | `nil` | The name/handle for the sound loop to play while moving. |

## Main Functions
### `OnEntitySleep()`
* **Description:** Automatically stops the component's update loop and sound when the entity goes to sleep.
* **Parameters:** None.

### `OnEntityWake()`
* **Description:** Automatically restarts the component's update loop and sound when the entity wakes up, using its last known wind angle and velocity.
* **Parameters:** None.

### `StartSoundLoop()`
* **Description:** Plays the configured sound loop if an `inst.SoundEmitter` is present and the sound is not already playing.
* **Parameters:** None.

### `StopSoundLoop()`
* **Description:** Stops the currently playing sound loop.
* **Parameters:** None.

### `Start(ang, vel)`
* **Description:** Initializes and starts the wind effect, enabling the component's update loop.
* **Parameters:**
    * `ang` (number, optional): The initial angle (in degrees) for the wind direction.
    * `vel` (number, optional): The initial velocity multiplier.

### `Stop()`
* **Description:** Stops the wind effect, halting the component's update loop and any associated sounds.
* **Parameters:** None.

### `ChangeDirection(ang, vel)`
* **Description:** Updates the target direction of the wind while the component is active.
* **Parameters:**
    * `ang` (number, optional): The new target angle (in degrees) for the wind.
    * `vel` (number, optional): This parameter is currently unused in the function's logic.

### `SetMaxSpeedMult(spd)`
* **Description:** Sets the maximum speed multiplier for wind gusts.
* **Parameters:**
    * `spd` (number): The new maximum speed multiplier.

### `SetMinSpeedMult(spd)`
* **Description:** Sets the minimum speed multiplier for wind lulls.
* **Parameters:**
    * `spd` (number): The new minimum speed multiplier.

### `SetAverageSpeed(spd)`
* **Description:** Sets the base average speed for movement calculations.
* **Parameters:**
    * `spd` (number): The new average speed.