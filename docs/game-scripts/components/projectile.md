---
id: projectile
title: Projectile
description: Handles the logic for projectiles, including trajectory, homing, collisions, and throwing behavior in DST.
tags: [combat, physics, entity]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f475c083
system_scope: physics
---
# Projectile

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Projectile` component manages the flight, targeting, and impact behavior of thrown or launched objects (e.g., spears, rocks, arrows). It works in tandem with the `combat`, `weapon`, and `catcher` components to execute attacks, handle misses, or catch projectiles (e.g., by Beefalo). It is mutually exclusive with the `complexprojectile` component—only one may be attached to an entity at a time, and both rely on the `projectile` tag for internal logic. The component is automatically updated during entity updates to process movement, homing, and collision detection.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("projectile")
inst:AddTag("projectile") -- Required for internal consistency
inst:AddComponent("physics")
inst:AddComponent("combat")

inst.components.projectile:SetSpeed(10)
inst.components.projectile:SetHoming(true)
inst.components.projectile:SetHitDist(0.5)
inst.components.projectile:SetOnHitFn(function(projectile_inst, attacker, target) 
    -- Custom hit logic
end)

inst.components.projectile:Throw(attacker, target)
```

## Dependencies & tags
**Components used:** `combat`, `catcher`, `inventoryitem`, `weapon`  
**Tags added:** `projectile` (in constructor), `catchable` (added/removed dynamically via `cancatch` and `target` setters), `activeprojectile` (added during throw, removed on miss/hit/stop)  
**Tags checked:** `flight`, `invisible` (via `StateGraph` state tags on target)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity or `nil` | `nil` | The entity that launched the projectile (e.g., player). |
| `target` | entity or `nil` | `nil` | The intended target of the projectile. |
| `start` | Vector3 or `nil` | `nil` | Position where the projectile was thrown from. |
| `dest` | Vector3 | `nil` | Current or final target position for homing. |
| `cancatch` | boolean | `false` | If `true`, the projectile can be caught by a `catcher` component. |
| `speed` | number or `nil` | `nil` | Flight speed in units per second. |
| `hitdist` | number | `1` | Extra distance radius added to the target’s physics radius for hit detection. |
| `homing` | boolean | `true` | If `true`, the projectile adjusts its direction toward the current `dest`. |
| `range` | number or `nil` | `nil` | Maximum flight range; projectile will miss if exceeded. |
| `onthrown` | function or `nil` | `nil` | Callback fired on throw: `fn(projectile, owner, target, attacker)`. |
| `onhit` | function or `nil` | `nil` | Callback fired on hit: `fn(projectile, attacker, target)`. |
| `onprehit` | function or `nil` | `nil` | Callback fired *before* combat damage is applied: `fn(projectile, attacker, target)`. |
| `oncaught` | function or `nil` | `nil` | Callback fired on catch: `fn(projectile, catcher)`. |
| `onmiss` | function or `nil` | `nil` | Callback fired on miss: `fn(projectile, attacker, target)`. |
| `stimuli` | any or `nil` | `nil` | Optional stimuli passed to combat’s `DoAttack`. |
| `launchangle` | number (degrees) or `nil` | `nil` | Launch rotation (degrees). If `nil`, rotation is computed automatically. |
| `launchoffset` | Vector3-like or `nil` | `nil` | Offset (x = radius, y = height) applied at throw time relative to attacker facing. |
| `bounced` | boolean or `nil` | `nil` | If set, indicates the projectile has bounced (used externally). |
| `dozeOffTask` | task or `nil` | `nil` | Task for offscreen timeout (2 seconds). |

## Main functions
### `Throw(owner, target, attacker)`
*   **Description:** Launches the projectile toward the target. Sets up physics motor velocity, rotation, tracking, and notifies interested components.
*   **Parameters:**  
    `owner` (entity) — Entity that launched the projectile.  
    `target` (entity) — Intended target (must be valid and visible).  
    `attacker` (entity or `nil`) — Entity initiating the attack (may differ from `owner` in some cases, e.g., pets or summons).  
*   **Returns:** Nothing.
*   **Error states:** If the projectile entity is asleep (`IsAsleep()`), it triggers `DelayOffscreenMiss_Internal()` instead of launching immediately.

### `SetSpeed(speed)`
*   **Description:** Sets the projectile’s flight speed and immediately applies it to the physics motor if the projectile is thrown.
*   **Parameters:** `speed` (number) — Speed in world units per second.
*   **Returns:** Nothing.

### `SetOnHitFn(fn)`
*   **Description:** Sets the callback executed when the projectile successfully hits its target (after `DoAttack`).
*   **Parameters:** `fn` (function or `nil`) — Signature: `fn(projectile, attacker, target)`.
*   **Returns:** Nothing.

### `SetOnPreHitFn(fn)`
*   **Description:** Sets a pre-hit callback executed *before* `combat:DoAttack` is called.
*   **Parameters:** `fn` (function or `nil`) — Signature: `fn(projectile, attacker, target)`.
*   **Returns:** Nothing.

### `SetCanCatch(cancatch)`
*   **Description:** Enables or disables the ability for the projectile to be caught by a `catcher` component. Also updates the `catchable` tag.
*   **Parameters:** `cancatch` (boolean).
*   **Returns:** Nothing.

### `SetHoming(homing)`
*   **Description:** Enables or disables homing behavior. When `true`, the projectile continuously updates `dest` to the target’s current position.
*   **Parameters:** `homing` (boolean).
*   **Returns:** Nothing.

### `SetLaunchAngle(angle)`
*   **Description:** Sets the projectile’s initial rotation (in degrees) for non-homing or fixed-angle throws.
*   **Parameters:** `angle` (number) — Rotation in degrees.
*   **Returns:** Nothing.

### `SetLaunchOffset(offset)`
*   **Description:** Stores a launch offset used during `Throw` to adjust the starting position relative to the attacker’s facing.
*   **Parameters:** `offset` (Vector3-like) — `{ x = radius, y = height }`.
*   **Returns:** Nothing.

### `SetRange(range)`
*   **Description:** Sets the maximum flight range (in world units). If exceeded before hitting, the projectile misses.
*   **Parameters:** `range` (number or `nil`).
*   **Returns:** Nothing.

### `SetHitDist(dist)`
*   **Description:** Changes the extra distance added to the target’s physics radius for hit detection.
*   **Parameters:** `dist` (number).
*   **Returns:** Nothing.

### `SetStimuli(stimuli)`
*   **Description:** Stores optional stimuli to be passed to `combat:DoAttack`.
*   **Parameters:** `stimuli` (any).
*   **Returns:** Nothing.

### `SetOnThrownFn(fn)`
*   **Description:** Sets a callback fired *after* the projectile is launched.
*   **Parameters:** `fn` (function or `nil`) — Signature: `fn(projectile, owner, target, attacker)`.
*   **Returns:** Nothing.

### `SetOnMissFn(fn)`
*   **Description:** Sets a callback fired when the projectile misses (e.g., out of range, target lost).
*   **Parameters:** `fn` (function or `nil`) — Signature: `fn(projectile, attacker, target)`.
*   **Returns:** Nothing.

### `SetOnCaughtFn(fn)`
*   **Description:** Sets a callback fired when the projectile is caught by a `catcher`.
*   **Parameters:** `fn` (function or `nil`) — Signature: `fn(projectile, catcher)`.
*   **Returns:** Nothing.

### `IsThrown()`
*   **Description:** Returns whether the projectile has been thrown (i.e., has a non-`nil` target).
*   **Parameters:** None.
*   **Returns:** `true` if `target` is not `nil`; otherwise `false`.

### `Hit(target)`
*   **Description:** Handles projectile impact. Applies combat damage (using `combat:DoAttack`) and fires `onhit` and `onprehit` callbacks.
*   **Parameters:** `target` (entity) — The hit target.
*   **Returns:** Nothing.

### `Miss(target)`
*   **Description:** Handles projectile miss (e.g., range exceeded, target vanished). Fires `onmiss`.
*   **Parameters:** `target` (entity) — The intended (but missed) target.
*   **Returns:** Nothing.

### `Catch(catcher)`
*   **Description:** Registers a catch by a `catcher` entity, stopping the projectile and firing `oncaught`.
*   **Parameters:** `catcher` (entity) — The entity that caught the projectile.
*   **Returns:** Nothing.
*   **Error states:** Only effects a catch if `cancatch` is `true`.

### `Stop()`
*   **Description:** Stops the projectile’s physics, removes the `activeprojectile` tag, cancels tracking tasks, and clears internal state (`owner`, `target`, etc.).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DelayVisibility(duration)`
*   **Description:** Temporarily hides the projectile for `duration` seconds, updating visibility and owner tracking.
*   **Parameters:** `duration` (number).
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string with `target` and `owner` debug values.
*   **Parameters:** None.
*   **Returns:** `string` — e.g., `"target: 123, owner 456"`.

### `SetBounced(bounced)`
*   **Description:** Marks the projectile as having bounced.
*   **Parameters:** `bounced` (boolean) — `false` to unset; any truthy value to set.
*   **Returns:** Nothing.

### `IsBounced()`
*   **Description:** Returns whether the projectile has bounced.
*   **Parameters:** None.
*   **Returns:** `true` if `bounced == true`; otherwise `false`.

## Events & listeners
- **Listens to:**  
  - `onremove`, `newstate` (from delay owner, used only when `DelayVisibility` is active) — Cancels the projectile if the owner is removed or changes state (e.g., dies).  
  - `OnEntitySleep` — Triggers offscreen timeout if a target is assigned.  
  - `OnEntityWake` — Cancels the offscreen timeout if the entity wakes.  
- **Pushes:**  
  - `onthrown` — Fired when the projectile is launched (data: `{ thrower = owner, target = target }`).  
  - `hostileprojectile` — Pushed on the target (data: `{ thrower = owner, attacker = attacker, target = target }`).
