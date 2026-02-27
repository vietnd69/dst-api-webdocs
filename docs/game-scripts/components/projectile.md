---
id: projectile
title: Projectile
description: Manages the behavior, targeting, and lifecycle of thrown or launched projectiles in the game world.

sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f475c083
---

# Projectile

## Overview
This component handles the movement, targeting logic (homing or linear), collision detection, and event callbacks for projectiles—such as thrown spears, arrows, or other weapons—within the Entity Component System. It supports throwing projectiles at targets, homing in on moving targets, catching (e.g., by a catcher entity), missing (e.g., due to distance or target loss), and hit resolution via combat system integration.

## Dependencies & Tags
- Adds tag `"projectile"` on construction.
- Adds/removes tag `"catchable"` dynamically based on `cancatch` and `target` state.
- Adds tag `"activeprojectile"` when thrown.
- Requires `inst.Physics`, `inst.Transform`, and optionally `inst.components.complexprojectile` to coexist (mutually exclusive).
- Uses callbacks for `"onremove"` and `"newstate"` on delay owner for cleanup.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(none)* | Reference to the entity this component is attached to. |
| `owner` | `Entity?` | `nil` | The entity that launched the projectile. |
| `target` | `Entity?` | `nil` | The intended target entity. |
| `start` | `Vector3?` | `nil` | The 3D position where the projectile was launched. |
| `dest` | `Vector3?` | `nil` | Current intended destination (typically target position for homing). |
| `cancatch` | `boolean` | `false` | Whether this projectile can be caught (e.g., by a catcher component). |
| `speed` | `number?` | `nil` | Speed (units per second) of the projectile while moving. |
| `hitdist` | `number` | `1` | Additional distance threshold added to target radius for hit detection. |
| `homing` | `boolean` | `true` | Whether the projectile homes in on its target. |
| `range` | `number?` | `nil` | Maximum travel range before automatically missing. |
| `onthrown` | `function?` | `nil` | Callback fired when the projectile is thrown: `fn(inst, owner, target, attacker)`. |
| `onhit` | `function?` | `nil` | Callback fired on successful hit: `fn(inst, attacker, target)`. |
| `onprehit` | `function?` | `nil` | Callback fired just before hit resolution: `fn(inst, attacker, target)`. |
| `onmiss` | `function?` | `nil` | Callback fired when projectile misses or expires: `fn(inst, attacker, target)`. |
| `oncaught` | `function?` | `nil` | Callback fired when projectile is caught: `fn(inst, catcher)`. |
| `stimuli` | `any?` | `nil` | Optional stimuli data passed to combat system on hit. |
| `launchoffset` | `Vector3?` | `nil` | Launch offset relative to attacker’s facing (x = radius, y = height). |
| `launchangle` | `number?` | `nil` | Fixed launch angle in degrees. |
| `bounced` | `boolean?` | `nil` | Whether this projectile has bounced (stored for logic like repeating attacks). |
| `delaypos` | `table?` | `nil` | List of deferred position/rotation updates used for offscreen delay handling. |
| `delayowner` | `Entity?` | `nil` | Entity tracked for removal/newstate changes to cancel projectile on delay. |
| `delaytask` | `DoTaskInTimeTask?` | `nil` | Task for delayed visibility restoration. |
| `dozeOffTask` | `DoTaskInTimeTask?` | `nil` | Task to trigger a miss after being offscreen for `DOZE_OFF_TIME` seconds. |

## Main Functions

### `Projectile:Throw(owner, target, attacker)`
* **Description:** Launches the projectile toward a target, setting position, rotation, physics, and event callbacks. Initializes tracking and homing logic.
* **Parameters:**
  - `owner` (`Entity`): The entity that owns/throws the projectile.
  - `target` (`Entity`): The intended target.
  - `attacker` (`Entity?`): Optional alternate entity performing the attack (e.g., for weapon ownership logic).

### `Projectile:OnUpdate(dt)`
* **Description:** Update loop called each frame while active. Handles homing (if enabled), range limits, and collision checks. Supports deferred updates for offscreen positions.

### `Projectile:Hit(target)`
* **Description:** Handles projectile impact on a target, invoking `onprehit`, deal damage via combat component, and `onhit` callbacks.
* **Parameters:**
  - `target` (`Entity`): The entity that was hit.

### `Projectile:Miss(target)`
* **Description:** Handles projectile failing to hit, invoking `onmiss` and cleaning up tracking. Uses fallback attacker logic if owner is not directly a combat entity.
* **Parameters:**
  - `target` (`Entity?`): The originally targeted entity.

### `Projectile:Catch(catcher)`
* **Description:** Handles projectile being caught (e.g., by a `catcher` component), stopping physics and invoking `oncaught`.
* **Parameters:**
  - `catcher` (`Entity`): The entity that caught the projectile.

### `Projectile:Stop()`
* **Description:** Halts projectile movement and updates, removes `"activeprojectile"` tag, and clears internal tracking fields.

### `Projectile:SetSpeed(speed)`
* **Description:** Sets the projectile’s movement speed and applies it via physics motor velocity if thrown.

### `Projectile:SetRange(range)`
* **Description:** Sets the maximum travel range before auto-miss.

### `Projectile:SetHoming(homing)`
* **Description:** Enables/disables homing behavior.

### `Projectile:SetOnHitFn(fn)`
* **Description:** Assigns the hit callback function.

### `Projectile:SetOnMissFn(fn)`
* **Description:** Assigns the miss callback function.

### `Projectile:SetOnCaughtFn(fn)`
* **Description:** Assigns the catch callback function.

### `Projectile:RotateToTarget(dest)`
* **Description:** Rotates the projectile’s transform to face a destination point.

### `Projectile:IsThrown()`
* **Description:** Returns `true` if projectile is actively thrown (i.e., `target` is not `nil`).

### `Projectile:DelayVisibility(duration)`
* **Description:** Hides the projectile for a specified duration while deferring positional updates; restores visibility afterward.

### `Projectile:OnEntitySleep()` / `Projectile:OnEntityWake()`
* **Description:** Handle offscreen state changes. Sleep triggers a delayed miss; wake cancels it.

## Events & Listeners
- Listens for:
  - `"onthrown"`: Pushed internally when thrown; may trigger `onthrown` callbacks.
  - `"hostileprojectile"`: Pushed on `target` when projectile is thrown.
  - `"onremove"` and `"newstate"` on `delayowner` to cancel delayed operation.
  - `"activeprojectile"` tag added/removed as part of lifecycle.
- Pushes:
  - `"onthrown"` event on self with `{ thrower = owner, target = target }`.
  - `"hostileprojectile"` event on target with `{ thrower = owner, attacker = attacker, target = target }`.