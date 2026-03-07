---
id: wagboss_missile
title: Wagboss Missile
description: A non-networked projectile component that handles missile flight physics, targeting, visual effects, and area-of-effect detonation logic for the Wagboss boss encounter.
tags: [combat, boss, projectile, fx, ai]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 702e43b7
system_scope: combat
---

# Wagboss Missile

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wagboss_missile` is a specialized projectile entity used exclusively in the Wagboss boss encounter. It manages missile flight physics (including circling and retargeting behaviors), visual FX synchronization between server and client, target tracking, and area-of-effect detonation logic. The component relies heavily on the `updatelooper` for per-frame updates, integrates with `combat`, `planardamage`, and several utility components to resolve targets and apply effects, and operates in a split server/client architecture to maintain network efficiency.

## Usage example
```lua
-- Example: Launching a missile from the server
local launcher = TheSim:FindEntity(..., "wagboss") -- Get boss entity
local target = TheSim:FindEntity(..., "wilson")
local missile = SpawnPrefab("wagboss_missile")
missile.Launch(missile, 1, launcher, target, 0, {}) -- id=1, dir=0
missile.ShowMissile(missile)
```

## Dependencies & tags
**Components used:** `updatelooper`, `combat`, `planardamage`  
**Tags added by missile prefab:** `CLASSIFIED`, `pseudoprojectile`  
**Tags added by target FX prefab:** `CLASSIFIED`  
**FX-related tags used internally:** `FX`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tilt` | `net_smallbyte` (networked) | `0` | Current tilt angle in `0..60` units, mapped to animation frame. |
| `circling` | `net_bool` (networked) | `true` | Whether the missile is in circling mode. |
| `shown` | `net_bool` (networked) | `false` | Controls whether visual FX (rotator + looper) are spawned. |
| `id` | `net_tinybyte` (networked) | `0` | Unique ID for this missile instance (used in visual matching). |
| `launcher` | `net_entity` (networked) | `nil` | Reference to the launching entity (Wagboss). |
| `target` | `EntityScript` | `nil` | Current targeted entity. |
| `targetpos` | `Vector3` | `(0,0,0)` | Target position in world space. |
| `grouptargets` | `table` | `{}` | Shared table tracking which entities the missile group has already hit. |
| `ring` | `EntityScript` | `nil` | Visual ring FX associated with the target. |
| `rotator` | `EntityScript` | `nil` | Parent entity for visual FX loop and shadow. |
| `launchpt`, `pt0` | `Vector3` / `nil` | `nil` | Visual launch point (client) and physical start point (server). |

## Main functions
### `Launch(inst, id, launcher, targetorpos, dir, grouptargets)`
* **Description:** Initializes and launches the missile toward a target or fixed position. Sets up target ring, internal timers, and starts the flight physics loop.
* **Parameters:**  
  `id` (number) - Unique missile ID for visual effects alignment.  
  `launcher` (EntityScript) - The entity that fired this missile.  
  `targetorpos` (EntityScript or Vector3) - Target entity or absolute world position.  
  `dir` (number) - Initial launch direction in degrees.  
  `grouptargets` (table) - Shared tracking table for the missile group to avoid duplicate hits.
* **Returns:** Nothing.
* **Error states:** No-op if `pending` flag is `false`.

### `Retarget(inst, target)`
* **Description:** Updates the missile to track a new target. Handles smooth transition by reversing direction or continuing circling depending on current altitude.
* **Parameters:**  
  `target` (EntityScript) - New target entity.
* **Returns:** Nothing.
* **Error states:** No-op if currently `pending`, `noretarget` is set, or `target` is unchanged.

### `CancelTargetLock(inst)`
* **Description:** Immediately drops the current target without detonation. Clears associated event callbacks and ring parenting.
* **Parameters:** None.
* **Returns:** Nothing.

### `ShowMissile(inst)`
* **Description:** Enables visual FX (rotator, looper) and starts the tracking sound. Must be called after `Launch` to reveal the missile.
* **Parameters:** None.
* **Returns:** Nothing.

### `Detonate(inst)`
* **Description:** Triggers explosion FX, deals area-of-effect damage/ effects (fire/extinguish, perk burn, workables, pickables, tossable items), and destroys the missile entity.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateFlightPath(inst, dt)`
* **Description:** Core flight update logic. Handles circling, aimed flight, and retargeting flight paths using physics motor velocity and angle adjustments.
* **Parameters:**  
  `dt` (number) - Delta time since last frame.
* **Returns:** Nothing.

### `UpdateLaunchOffset(inst)`
* **Description:** (Client only) Adjusts visual FX launch position during the missile's initialization animation to match the launcher’s motion.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateShadow(inst)`
* **Description:** Dynamically scales the missile's shadow based on altitude.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateAnimTilt(inst)`
* **Description:** Updates the missile's visual tilt frame to match `inst.tilt`.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to (client):**  
  `launchdirty` - Triggers `OnLaunchDirty_Client` to show or initialize visual FX.  
  `tiltdirty` - Triggers `OnTiltDirty_Client` to manage circling update loop and animation tilt sync.  
  `wagboss_missile_target_detonated` - Set in `Launch` and `Retarget`; fires `inst._ontargetdetonated` to prevent rapid retargeting.  
  `onremove` (on target) - Triggers `inst._onremoveringtarget` to decouple target ring.
- **Pushes:**  
  `epicscare` on the target every frame during flight (duration `1`).  
  `wagboss_missile_target_detonated` on target when missile detonates on or near it.  
  `wagboss_missile_target_fx` prefabs do not push any events directly; they are managed via callbacks.