---
id: complexprojectile
title: Complexprojectile
description: This component manages the physics and trajectory calculations for non-instant-hit projectiles, enabling customized launch and impact behaviors.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: combat
---

# Complexprojectile

## Overview
The `Complexprojectile` component is responsible for simulating the trajectory and movement of projectiles in Don't Starve Together. It handles gravity, calculates launch angles to reach a target, applies custom offsets for launch and target points, and provides callback hooks for custom behavior on launch, update, and hit events. This allows for projectiles with realistic arcs and varying speeds, facilitating dynamic combat and environmental interactions.

## Dependencies & Tags
This component relies on the entity having `Physics` and `Transform` components for position, velocity, and rotation management.

*   **Adds Tags:**
    *   `projectile`: General tag indicating the entity is a projectile.
    *   `complexprojectile`: Specific tag for entities using this component.
    *   `activeprojectile`: Added when the projectile is launched, removed when cancelled or hit.
*   **Removes Tags:**
    *   `complexprojectile`: Removed when the component is detached from the entity.
    *   `projectile`: Removed if no other `projectile` component exists on the entity when this component is removed.
    *   `activeprojectile`: Removed when `Cancel()` or `Hit()` is called.

## Properties
| Property          | Type            | Default Value    | Description                                                                                                                                                                                                                                                                                                                                    |
| :---------------- | :-------------- | :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `velocity`        | `Vector3`       | `Vector3(0,0,0)` | The current velocity vector of the projectile. Updated each frame by `OnUpdate`.                                                                                                                                                                                                                                                               |
| `gravity`         | `number`        | `-9.81`          | The gravitational acceleration applied to the projectile's vertical velocity (Y-axis). Negative values simulate downward pull.                                                                                                                                                                                                                    |
| `horizontalSpeed` | `number`        | `4`              | The initial horizontal speed used when calculating the projectile's trajectory. Can be overridden by `SetHorizontalSpeed` or `SetHorizontalSpeedForDistance`.                                                                                                                                                                                      |
| `launchoffset`    | `Vector3/table` | `nil`            | An optional offset (x: facing direction, y: height) from the attacker's position where the projectile is considered to originate. If set, the projectile's starting position will be adjusted relative to the attacker's facing direction.                                                                                                     |
| `targetoffset`    | `Vector3/table` | `nil`            | An optional vertical offset (`y` component) added to the target's position for trajectory calculation. This can be used to aim slightly above the ground or a specific part of a target.                                                                                                                                                      |
| `owningweapon`    | `Entity`        | `nil`            | The entity that represents the weapon or item responsible for launching this projectile. Defaults to the projectile entity itself if not specified during `Launch`.                                                                                                                                                                              |
| `attacker`        | `Entity`        | `nil`            | The entity that initiated the attack or launched the projectile.                                                                                                                                                                                                                                                                               |
| `onlaunchfn`      | `function`      | `nil`            | A callback function executed immediately after the projectile is launched. Signature: `fn(projectile_inst, attacker_inst, target_pos)`.                                                                                                                                                                                                             |
| `onhitfn`         | `function`      | `nil`            | A callback function executed when the projectile is cancelled (e.g., hits the ground or a target). Signature: `fn(projectile_inst, attacker_inst, hit_target_inst_or_nil)`.                                                                                                                                                                     |
| `onupdatefn`      | `function`      | `nil`            | A callback function executed on each game update tick (`OnUpdate`). If this function returns `true`, the component's default physics update logic for that frame is skipped. Signature: `fn(projectile_inst)`.                                                                                                                                  |
| `usehigharc`      | `boolean`       | `true`           | Determines whether the trajectory calculation should prefer the higher possible arc when two valid launch angles exist to reach the target. If `false`, the lower arc is chosen.                                                                                                                                                               |

## Main Functions
### `OnRemoveFromEntity()`
*   **Description:** Called automatically when the component is removed from its owner entity. It cleans up by removing the `complexprojectile` tag and conditionally removing the general `projectile` tag if no other projectile component is present on the entity.
*   **Parameters:** None.

### `GetDebugString()`
*   **Description:** Returns a string representation of the projectile's current velocity, primarily for debugging purposes.
*   **Parameters:** None.

### `SetHorizontalSpeed(speed)`
*   **Description:** Sets the initial horizontal speed that will be used for trajectory calculations.
*   **Parameters:**
    *   `speed` (`number`): The desired horizontal speed.

### `SetHorizontalSpeedForDistance(desired_horizontal_distance, fallback)`
*   **Description:** Calculates and sets the minimum horizontal speed required to travel a `desired_horizontal_distance` given the current gravity and launch/target offsets. If a speed cannot be calculated (e.g., distance is unreachable), it uses a `fallback` speed.
*   **Parameters:**
    *   `desired_horizontal_distance` (`number`): The horizontal distance the projectile is intended to travel.
    *   `fallback` (`number`): The speed to use if `CalculateMinimumSpeedForDistance` returns `nil`.

### `SetGravity(g)`
*   **Description:** Sets the gravitational acceleration applied to the projectile.
*   **Parameters:**
    *   `g` (`number`): The new gravity value. A negative value is typically used for downward force.

### `SetLaunchOffset(offset)`
*   **Description:** Sets an offset from the attacker's position where the projectile visually or physically originates. The `x` component is an offset along the attacker's facing direction, `y` is a vertical offset.
*   **Parameters:**
    *   `offset` (`Vector3` or `table` with `x`, `y`): The offset vector.

### `SetTargetOffset(offset)`
*   **Description:** Sets a vertical offset to be applied to the target's position during trajectory calculations. This allows for aiming at a specific height on the target.
*   **Parameters:**
    *   `offset` (`Vector3` or `table` with `y`): The offset vector. Only the `y` component is used.

### `SetOnLaunch(fn)`
*   **Description:** Sets a callback function to be invoked when the projectile is launched.
*   **Parameters:**
    *   `fn` (`function`): The function to call, with signature `fn(projectile_inst, attacker_inst, target_pos)`.

### `SetOnHit(fn)`
*   **Description:** Sets a callback function to be invoked when the projectile hits something or the ground, or is manually cancelled.
*   **Parameters:**
    *   `fn` (`function`): The function to call, with signature `fn(projectile_inst, attacker_inst, hit_target_inst_or_nil)`.

### `SetOnUpdate(fn)`
*   **Description:** Sets a callback function to be invoked on each game update tick while the projectile is active. If this function returns `true`, the component's default physics update logic for that frame is skipped.
*   **Parameters:**
    *   `fn` (`function`): The function to call, with signature `fn(projectile_inst)`.

### `CalculateMinimumSpeedForDistance(desired_horizontal_distance)`
*   **Description:** Calculates the minimum horizontal speed required for the projectile to travel a specified horizontal distance, considering current gravity and launch/target offsets. Returns `nil` if the distance is impossible to reach.
*   **Parameters:**
    *   `desired_horizontal_distance` (`number`): The target horizontal distance.
*   **Returns:** `number` (minimum speed) or `nil`.

### `CalculateTrajectory(startPos, endPos, speed)`
*   **Description:** Calculates the initial velocity vector (`self.velocity`) needed for the projectile to travel from `startPos` to `endPos` with a given `speed`, taking gravity and `usehigharc` into account. If multiple arcs are possible, `usehigharc` determines which is chosen. If no arc is possible, a default 30-degree angle is used.
*   **Parameters:**
    *   `startPos` (`Vector3`): The starting world position of the projectile.
    *   `endPos` (`Vector3`): The target world position the projectile aims to hit.
    *   `speed` (`number`): The magnitude of the initial horizontal velocity.

### `Launch(targetPos, attacker, owningweapon)`
*   **Description:** Initiates the projectile's movement. It adjusts the projectile's starting position based on `launchoffset`, calculates the trajectory to `targetPos`, applies inherited velocity from the `attacker`'s platform if present, and then calls the `onlaunchfn` callback. The projectile starts updating and gains the `activeprojectile` tag.
*   **Parameters:**
    *   `targetPos` (`Vector3`): The world position the projectile aims to hit.
    *   `attacker` (`Entity`): The entity that launched the projectile.
    *   `owningweapon` (`Entity`): The weapon or item responsible for the launch. Defaults to the projectile's instance if `nil`.

### `Cancel()`
*   **Description:** Immediately stops the projectile's movement, clears its velocity, and stops it from updating. Removes the `activeprojectile` tag and resets the physics motor.
*   **Parameters:** None.

### `Hit(target)`
*   **Description:** Simulates the projectile hitting something. It calls `Cancel()` to stop the projectile and then invokes the `onhitfn` callback, passing the hit `target` (if any).
*   **Parameters:**
    *   `target` (`Entity`, optional): The entity that was hit by the projectile. Can be `nil` if it hit the ground.

### `OnUpdate(dt)`
*   **Description:** Called every game frame while the projectile is active (`StartUpdatingComponent`). It applies gravity to the vertical velocity and updates the entity's physics. If `onupdatefn` is set and returns `true`, the component's default physics update logic is skipped for that frame. Checks if the projectile has hit the ground `(Y <= 0.05)` and calls `Hit()` if so.
*   **Parameters:**
    *   `dt` (`number`): The delta time (time elapsed since the last frame).