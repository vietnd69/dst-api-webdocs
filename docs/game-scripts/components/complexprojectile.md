---
id: complexprojectile
title: Complexprojectile
description: Manages physics-based projectile trajectories with configurable launch conditions, gravity, and hit/miss callbacks for ranged attacks.
tags: [combat, projectile, physics]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8c6e5772
system_scope: physics
---

# Complexprojectile

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Complexprojectile` handles complex projectile motion logic—including arc calculation, gravity, and target-based trajectory computation—for entities requiring precise throw mechanics (e.g., spears, rocks). It works alongside the base `projectile` tag and is mutually exclusive with `projectile`-only components due to shared tag usage. When attached, it automatically adds both `"projectile"` and `"complexprojectile"` tags to the entity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("complexprojectile")
inst.components.complexprojectile:SetHorizontalSpeed(6)
inst.components.complexprojectile:SetGravity(-19.62)
inst.components.complexprojectile:SetLaunchOffset(Vector3(1, 0.5, 0))
inst.components.complexprojectile:SetOnLaunch(function(proj, attacker, targetPos)
    -- custom launch logic
end)
inst.components.complexprojectile:Launch(Vector3(10, 0, 10), attacker, weapon)
```

## Dependencies & tags
**Components used:** None directly accessed beyond the owner entity's `Physics`, `Transform`, and optional platform physics.
**Tags:** Adds `"projectile"` and `"complexprojectile"` in constructor; removes `"complexprojectile"` on removal; adds `"activeprojectile"` on launch; removes both `"activeprojectile"` and conditionally `"projectile"` on removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `velocity` | `Vector3` | `Vector3(0, 0, 0)` | Current velocity vector of the projectile. |
| `gravity` | number | `-9.81` | Vertical acceleration due to gravity (negative = downward). |
| `horizontalSpeed` | number | `4` | Target horizontal speed used in trajectory calculation. |
| `launchoffset` | `Vector3` or `nil` | `nil` | Local offset (x = forward, y = height) from attacker position at launch. |
| `targetoffset` | `Vector3` or `nil` | `nil` | Height offset applied to target position for impact detection (y = height). |
| `owningweapon` | entity or `nil` | `nil` | The weapon entity associated with this projectile. |
| `attacker` | entity or `nil` | `nil` | The entity that launched the projectile. |
| `onlaunchfn` | function or `nil` | `nil` | Callback invoked on launch: `fn(proj, attacker, targetPos)`. |
| `onhitfn` | function or `nil` | `nil` | Callback invoked on hit/ground contact: `fn(proj, attacker, target)`. |
| `onmissfn` | function or `nil` | `nil` | Reserved for miss events (not used internally). |
| `onupdatefn` | function or `nil` | `nil` | Callback invoked each update: `fn(proj)`. Returning `true` skips physics update. |
| `usehigharc` | boolean | `true` | Whether to use the higher-angle solution for two-root trajectory calculations. |

## Main functions
### `SetHorizontalSpeed(speed)`
*   **Description:** Sets the horizontal speed used when computing the projectile trajectory.
*   **Parameters:** `speed` (number) - horizontal speed in units/second.
*   **Returns:** Nothing.

### `SetHorizontalSpeedForDistance(desired_horizontal_distance, fallback)`
*   **Description:** Computes and sets the minimum required horizontal speed to reach a given horizontal distance, using trajectory physics, or falls back to `fallback` if unreachable.
*   **Parameters:**  
    `desired_horizontal_distance` (number) - target horizontal distance.  
    `fallback` (number or `nil`) - fallback speed if no solution exists.
*   **Returns:** Nothing.

### `SetGravity(g)`
*   **Description:** Sets the gravitational acceleration used in trajectory and physics simulation.
*   **Parameters:** `g` (number) - gravity value (typically negative).
*   **Returns:** Nothing.

### `SetLaunchOffset(offset)`
*   **Description:** Defines the local launch position offset relative to the attacker's facing direction.
*   **Parameters:** `offset` (`Vector3` or `nil`) - x = forward offset, y = height above attacker, z ignored.
*   **Returns:** Nothing.

### `SetTargetOffset(offset)`
*   **Description:** Sets the target height used to determine when the projectile hits the ground.
*   **Parameters:** `offset` (`Vector3` or `nil`) - y = height above ground to consider a hit.
*   **Returns:** Nothing.

### `SetOnLaunch(fn)`
*   **Description:** Registers a callback function executed when `Launch` is called.
*   **Parameters:** `fn` (function or `nil`) - function signature: `fn(proj, attacker, targetPos)`.
*   **Returns:** Nothing.

### `SetOnHit(fn)`
*   **Description:** Registers a callback function executed on impact (ground or custom hit).
*   **Parameters:** `fn` (function or `nil`) - function signature: `fn(proj, attacker, target)`.
*   **Returns:** Nothing.

### `SetOnUpdate(fn)`
*   **Description:** Registers a callback function executed every physics update.
*   **Parameters:** `fn` (function or `nil`) - function signature: `fn(proj)`. Returning `true` skips physics update.
*   **Returns:** Nothing.

### `CalculateMinimumSpeedForDistance(desired_horizontal_distance)`
*   **Description:** Computes the minimum horizontal speed required to reach the given horizontal distance, considering launch and target offsets.
*   **Parameters:** `desired_horizontal_distance` (number) - target horizontal range.
*   **Returns:** `number` if reachable, `nil` if no valid speed exists (e.g., impossible trajectory).
*   **Error states:** Returns `nil` if the discriminant in the quadratic solution is negative (target out of range).

### `CalculateTrajectory(startPos, endPos, speed)`
*   **Description:** Computes the launch velocity vector to hit `endPos` from `startPos` at the given `speed`, using high or low arc based on `usehigharc`.
*   **Parameters:**  
    `startPos` (`Vector3` or `Vector`) - launch origin.  
    `endPos` (`Vector3` or `Vector`) - target position.  
    `speed` (number) - fixed speed for the projectile.
*   **Returns:** Nothing (sets `self.velocity` internally).
*   **Error states:** If no valid trajectory exists (e.g., speed too low), uses a default 30° elevation.

### `Launch(targetPos, attacker, owningweapon)`
*   **Description:** Initiates the projectile by calculating its trajectory, adjusting its position (with `launchoffset`), inheriting platform velocity, and starting physics updates.
*   **Parameters:**  
    `targetPos` (`Vector3` or `Vector`) - intended target position.  
    `attacker` (entity or `nil`) - entity launching the projectile.  
    `owningweapon` (entity or `nil`) - weapon entity associated with this projectile.
*   **Returns:** Nothing.
*   **Error states:** Does not validate attacker/target validity; physics errors may occur if `Physics` component is missing or misconfigured.

### `Cancel()`
*   **Description:** Immediately stops the projectile by clearing velocity, removing physics motor velocity, and removing tags.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Hit(target)`
*   **Description:** Handles projectile impact. Cancels the projectile and invokes the registered `onhitfn`.
*   **Parameters:** `target` (entity or `nil`) - target entity hit (if any).
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Physics update step executed while the projectile is active. Applies gravity, sets motor velocity, and checks for ground contact.
*   **Parameters:** `dt` (number) - time delta in seconds.
*   **Returns:** Nothing.
*   **Error states:** Triggers `Hit()` when `y <= 0.05` after descending (i.e., near-ground contact), invoking `onhitfn` with no explicit target.

## Events & listeners
- **Listens to:** None (does not register `inst:ListenForEvent`).
- **Pushes:** None (does not fire `inst:PushEvent`).  
    However, callbacks like `onhitfn` and `onlaunchfn` are invoked programmatically during `Launch`, `Hit`, and `OnUpdate`.
