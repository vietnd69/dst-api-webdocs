---
id: circler
title: Circler
description: This component enables an entity to orbit around a specified target entity at a variable speed and distance, dynamically adjusting its scale.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Circler

## Overview
The `Circler` component is responsible for making an entity orbit around a designated target entity. It controls the orbiting entity's position, rotation, speed, distance from the target, and visual scale. The component utilizes a sine wave to interpolate speed and scale values, creating a dynamic and visually interesting circling pattern.

## Dependencies & Tags
This component relies on the entity having a `Transform` component to manipulate its world position, rotation, and scale.
No specific tags are added or removed by this component.

## Properties
| Property         | Type           | Default Value               | Description                                                                                                                              |
| :--------------- | :------------- | :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `scale`          | `number`       | `1`                         | The current visual scale multiplier applied to the entity.                                                                               |
| `speed`          | `number`       | `math.random(3)`            | The base speed multiplier used for orbiting.                                                                                             |
| `circleTarget`   | `Entity`       | `nil`                       | The target entity around which `self.inst` will orbit. Must be a valid `Entity`.                                                         |
| `minSpeed`       | `number`       | `5`                         | The minimum speed value used in `Lerp` calculations (before scaling by `.01`).                                                           |
| `maxSpeed`       | `number`       | `7`                         | The maximum speed value used in `Lerp` calculations (before scaling by `.01`).                                                           |
| `minDist`        | `number`       | `8`                         | The minimum distance from the `circleTarget` (in world units).                                                                           |
| `maxDist`        | `number`       | `20`                        | The maximum distance from the `circleTarget` (in world units).                                                                           |
| `minScale`       | `number`       | `8`                         | The minimum scale value used in `Lerp` calculations (before scaling by `.1`).                                                            |
| `maxScale`       | `number`       | `12`                        | The maximum scale value used in `Lerp` calculations (before scaling by `.1`).                                                            |
| `onaccelerate`   | `function`     | `nil`                       | A callback function that could be triggered on acceleration events (not used internally by this component).                              |
| `numAccelerates` | `number`       | `0`                         | A counter for acceleration events (not used internally by this component).                                                               |
| `sineMod`        | `number`       | `math.random(20, 30) * .001`| A modifier for the sine wave calculation, affecting the frequency or amplitude of speed/scale variation.                                 |
| `sine`           | `number`       | `0`                         | The current value of the sine wave (between 0 and 1), used for interpolating `speed` and `scale`.                                      |

## Main Functions
### `SetMode(mode)`
*   **Description:** Sets an internal mode variable for the circler. This variable (`self.circlerMode`) is not used by the component's internal logic.
*   **Parameters:**
    *   `mode`: (`any`) A value representing the desired circler mode.

### `Start()`
*   **Description:** Initializes the component's state, including a random initial speed, distance, angular position, and direction. It then sets the entity's initial position and rotation relative to the `circleTarget` and begins updating the component every frame. If `circleTarget` is not valid, the component will not start.
*   **Parameters:** None.

### `Stop()`
*   **Description:** Halts the component's update loop, effectively stopping the entity from orbiting.
*   **Parameters:** None.

### `SetCircleTarget(tar)`
*   **Description:** Sets the entity that `self.inst` will orbit around.
*   **Parameters:**
    *   `tar`: (`Entity`) The new target entity to orbit.

### `GetSpeed(dt)`
*   **Description:** Calculates the angular speed for the current frame based on the `self.speed` property and the `dt` (delta time). The result is scaled by `TWOPI` and `dt` to represent angular displacement per frame. The sign of the return value determines the circling direction.
*   **Parameters:**
    *   `dt`: (`number`) The time elapsed since the last frame.

### `GetMinSpeed()`
*   **Description:** Returns the minimum effective speed value for orbiting, which is `self.minSpeed` scaled by `0.01`.
*   **Parameters:** None.

### `GetMaxSpeed()`
*   **Description:** Returns the maximum effective speed value for orbiting, which is `self.maxSpeed` scaled by `0.01`.
*   **Parameters:** None.

### `GetMinScale()`
*   **Description:** Returns the minimum effective visual scale value, which is `self.minScale` scaled by `0.1`.
*   **Parameters:** None.

### `GetMaxScale()`
*   **Description:** Returns the maximum effective visual scale value, which is `self.maxScale` scaled by `0.1`.
*   **Parameters:** None.

### `GetDebugString()`
*   **Description:** Generates a formatted string containing debug information about the current sine wave value and the entity's speed.
*   **Parameters:** None.

### `OnUpdate(dt)`
*   **Description:** This function is called every frame when the component is active. It updates the entity's position, rotation, and scale. It calculates a sine wave value using `GetSineVal` (a global function), then interpolates `speed` and `scale` between their min/max values based on this sine wave. Finally, it calculates the new angular position, offset from the target, and sets the entity's transform accordingly. If `circleTarget` becomes invalid, the component stops updating.
*   **Parameters:**
    *   `dt`: (`number`) The time elapsed since the last frame.

## Events & Listeners
*   `OnEntitySleep`: When the entity goes to sleep, `Circler.Stop` is called to halt updates.
*   `OnEntityWake`: When the entity wakes up, `Circler.Start` is called to resume orbiting.