---
id: junkball
title: Junkball
description: Manages the launch and fall phases of a junk projectile used in the game's combat and environmental mechanics, handling physics, visuals, sound, and damage application.
tags: [combat, fx, physics, projectile, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 10415545
system_scope: physics
---

# Junkball

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `junkball` prefab implements two distinct phases of a junk projectile: a high-speed "launch" phase (`junkball_fx`) and a descending "fall" phase (`junkball_fall_fx`). It handles visual effects (including shadow animation and fading), trajectory calculation, sound emission, and area-of-effect (AOE) damage or destruction of colliding entities. The component relies heavily on the `updatelooper` to perform periodic updates on both game thread and world thread, and interacts with `combat`, `workable`, `pickable`, `mine`, and `inventory` components during impact.

## Usage example
```lua
-- Launch a junk projectile from the attacker toward a target
local launch = SpawnPrefab("junkball_fx")
launch.SetupJunkTossAttack(attacker, offset, target, targetpos)

-- Set up the fall phase manually (e.g., from an existing position)
local fall = SpawnPrefab("junkball_fall_fx")
fall.SetupJunkFall(attacker, x, z, x1, z1, formpile, pileupchance, targets)
```

## Dependencies & tags
**Components used:** `updatelooper`, `combat`, `transform`, `animstate`, `soundemitter`, `network`
**Tags added/used:** `NOCLICK`, `FX`, `junk`, `junk_pile`, `junk_pile_big`, `wall`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `attacker` | `Entity` | `nil` | Reference to the entity that launched the junk. |
| `target` | `Entity` | `nil` | Reference to the intended target (if any). |
| `targetpos` | `Vector3` | `nil` | Cached world position of the target at launch. |
| `dir` | number | `nil` | Direction angle (in degrees) of the junk's flight path. |
| `pileupchance` | number | `0.25` (launch), `0.75` (fall) | Probability of forming a junk pile on successful impact. |
| `dist` | number | `DEFAULT_DIST` (`12`) | Target distance for the launch arc. |
| `speedx`, `speedz` | number | `0` | Horizontal velocity components for trajectory interpolation. |
| `x`, `z`, `x1`, `z1` | number | `0` | Source and destination positions for interpolation. |
| `t` | number | `0` | Elapsed time during the fall phase. |
| `formpile` | boolean | `false` | Whether a junk pile should be spawned upon landing. |
| `targets` | table | `{}` | Cache of affected entities and their interaction type (`"worked"`, `"picked"`, `"attacked"`, `"pile"`). |

## Main functions
### `SetupJunkTossAttack(attacker, offset, target, targetpos)`
* **Description:** Initializes a launch-phase junkball for an attack. Calculates trajectory based on attacker position, offset, and optional target tracking. Sets up wall-thread position updates.
* **Parameters:**  
  - `attacker` (`Entity`) — The entity performing the attack.  
  - `offset` (`number?`) — Additional lateral offset in the attacker's facing direction.  
  - `target` (`Entity?`) — Target entity to track.  
  - `targetpos` (`Vector3?`) — Pre-fetched target position. |
* **Returns:** Nothing.
* **Error states:** May clamp distance to `MIN_DIST` or `MAX_DIST` if calculations yield values outside those bounds.

### `SetupJunkTossFromPile(x, z, x1, z1)`
* **Description:** Initializes a launch-phase junkball to travel from a junk pile to a destination. Uses the line between two points to determine direction and distance.
* **Parameters:**  
  - `x`, `z` (`number`) — Starting position.  
  - `x1`, `z1` (`number`) — Destination position. |
* **Returns:** Nothing.
* **Error states:** Falls back to `MIN_DIST` and a random direction if source and destination positions are identical.

### `SetupJunkFall(attacker, x, z, x1, z1, formpile, pileupchance, targets)`
* **Description:** Prepares the fall-phase junkball for descent. Sets up position interpolation to the landing point and registers wall-thread updates.
* **Parameters:**  
  - `attacker` (`Entity`) — The original attacker.  
  - `x`, `z` (`number`) — Launch position.  
  - `x1`, `z1` (`number`) — Landing position.  
  - `formpile` (`boolean`) — Whether to attempt creating a junk pile.  
  - `pileupchance` (`number`) — Chance to form a pile.  
  - `targets` (`table`) — Table to record affected entities. |
* **Returns:** Nothing.

### `OnAnimOver(inst)`
* **Description:** Called when the launch animation completes. Finalizes trajectory, computes the descent arc, spawns falling debris FX tasks, emits a landing sound, and schedules removal.
* **Parameters:** `inst` (`Entity`) — The junkball instance.
* **Returns:** Nothing.
* **Error states:** Early exit if `inst.x` is `nil` (premature removal before animation ends).

### `DoDamage(inst, targets)`
* **Description:** Handles area-of-effect interactions when the fall-phase junkball lands. Applies damage to combat-capable entities, destroys `workable` objects (e.g., walls, trees), picks `pickable` objects, deactivates `mine`s, and applies knockback or tosses inventory items.
* **Parameters:**  
  - `inst` (`Entity`) — The junkball instance.  
  - `targets` (`table`) — Table populated during damage resolution. |
* **Returns:** Nothing.
* **Error states:** Skips invalid, dead, or `INLIMBO` entities; avoids reprocessing the same entity twice.

## Events & listeners
- **Listens to:** `animover` — Triggers `OnAnimOver` for launch phase, or `inst.Remove` for fall phase.
- **Pushes:** None directly; delegates to prefabs `junkball_fall_fx` and FX prefabs (`junk_pile`, `splash_green_large`).