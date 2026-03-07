---
id: circler
title: Circler
description: Positions and animates an entity in a circular orbit around a target entity, modulating speed and scale using sine-based interpolation.
tags: [locomotion, fx, animation]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 73c5fdab
system_scope: locomotion
---

# Circler

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Circler` is a locomotion component that moves an entity in a circular path around a specified target entity. It dynamically adjusts the orbiting entity’s speed and scale over time using sine-based interpolation (`Lerp` with `GetSineVal`) to create animated effects such as pulsing or acceleration. The component operates by updating the entity’s position and rotation each frame while orbiting, and supports starting/stopping via `Start()` and `Stop()`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("circler")

-- Set a target to orbit around (e.g., a boss or structure)
inst.components.circler:SetCircleTarget(target)

-- Configure orbit parameters
inst.components.circler.minSpeed = 4
inst.components.circler.maxSpeed = 10
inst.components.circler.minDist = 10
inst.components.circler.maxDist = 18

-- Begin orbiting
inst.components.circler:Start()
```

## Dependencies & tags
**Components used:** None (uses `Transform` component implicitly via `inst.Transform`).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity reference | `nil` | The entity instance this component is attached to. |
| `scale` | number | `1` | Current scale applied to the entity (updated during `OnUpdate`). |
| `speed` | number | `math.random(3)` | Current orbital speed multiplier (updated each frame). |
| `circleTarget` | entity reference | `nil` | The entity being orbited; must be valid for orbiting to proceed. |
| `minSpeed` | number | `5` | Minimum speed multiplier (scaled internally to `0.01 * value`). |
| `maxSpeed` | number | `7` | Maximum speed multiplier (scaled internally to `0.01 * value`). |
| `minDist` | number | `8` | Minimum orbital radius (used in `Start()` to pick a random distance). |
| `maxDist` | number | `20` | Maximum orbital radius (used in `Start()` to pick a random distance). |
| `minScale` | number | `8` | Minimum scale multiplier (scaled internally to `0.1 * value`). |
| `maxScale` | number | `12` | Maximum scale multiplier (scaled internally to `0.1 * value`). |
| `sineMod` | number | `math.random(20, 30) * .001` | Modulation factor for sine wave animation speed. |
| `sine` | number | `0` | Current sine value, updated each frame via `GetSineVal`. |
| `circlerMode` | any | `nil` | Optional mode flag; stored but unused in current implementation. |

## Main functions
### `SetMode(mode)`
*   **Description:** Sets the `circlerMode` field. Not used for logic in the current implementation.
*   **Parameters:** `mode` (any) - arbitrary value to assign to `self.circlerMode`.
*   **Returns:** Nothing.

### `Start()`
*   **Description:** Initializes and begins the orbital motion. Calculates initial offset, speed, distance, and facing angle; places the entity at the starting orbit position; and enables component updates.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** If `circleTarget` is `nil` or invalid, clears `circleTarget`, returns early, and does not start orbiting.

### `Stop()`
*   **Description:** Halts orbital updates and removes the component from the entity’s update loop.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetCircleTarget(tar)`
*   **Description:** Assigns a target entity to orbit around.
*   **Parameters:** `tar` (entity reference) - the entity to orbit.
*   **Returns:** Nothing.

### `GetSpeed(dt)`
*   **Description:** Computes the orbital angular increment for the given time step.
*   **Parameters:** `dt` (number) - delta time in seconds.
*   **Returns:** number - signed angular speed increment, based on `self.speed`, `TWOPI`, `dt`, and `self.direction`.
*   **Error states:** Returns zero if `self.speed` is zero.

### `GetMinSpeed()`
*   **Description:** Returns the minimum usable orbital speed (scaled to `0.01 * minSpeed`).
*   **Parameters:** None.
*   **Returns:** number - `self.minSpeed * 0.01`.

### `GetMaxSpeed()`
*   **Description:** Returns the maximum usable orbital speed (scaled to `0.01 * maxSpeed`).
*   **Parameters:** None.
*   **Returns:** number - `self.maxSpeed * 0.01`.

### `GetMinScale()`
*   **Description:** Returns the minimum scale value (scaled to `0.1 * minScale`).
*   **Parameters:** None.
*   **Returns:** number - `self.minScale * 0.1`.

### `GetMaxScale()`
*   **Description:** Returns the maximum scale value (scaled to `0.1 * maxScale`).
*   **Parameters:** None.
*   **Returns:** number - `self.maxScale * 0.1`.

### `GetDebugString()`
*   **Description:** Returns a formatted string for debugging output, showing current sine value and speed metrics.
*   **Parameters:** None.
*   **Returns:** string - e.g., `"Sine: 0.4231, Speed: 0.070/0.080"`.

### `OnUpdate(dt)`
*   **Description:** Core update function. Runs every frame while the component is active. Updates sine-modulated speed and scale, computes new orbital position/rotation, and updates transform.
*   **Parameters:** `dt` (number) - delta time in seconds.
*   **Returns:** Nothing.
*   **Error states:** Stops orbit and clears `circleTarget` if the target becomes invalid.

## Events & listeners
- **Listens to:** `OnEntitySleep` → triggers `Stop()`.
- **Listens to:** `OnEntityWake` → triggers `Start()`.
- **Pushes:** None identified.

## Notes
- Internally uses `Lerp` for interpolation and `GetSineVal` (from `easing.lua`) for oscillation.
- Orbit is computed in the XZ-plane (horizontal plane), with `y = 0`.
- Speed and scale are interpolated between min/max values based on the sine wave, creating smooth pulsing effects.
- The `direction` field is randomly assigned as `±PI/2` in `Start()`, determining clockwise/counterclockwise orbital direction.
- Scale is derived from current speed relative to min/max range — faster motion yields smaller scale in this implementation.
