---
id: chaseandattack
title: Chaseandattack
description: AI behaviour node that makes entities chase and attack a target with configurable limits.
tags: [ai, behaviour, combat, locomotion]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: behaviours
source_hash: b3fe565b
system_scope: brain
---

# Chaseandattack

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`ChaseAndAttack` is a behaviour node that controls AI entity combat pursuit. It manages chasing a target, attacking within range, and giving up based on configurable constraints like maximum chase time, attack count, and distance thresholds. This behaviour integrates with the `combat` and `locomotor` components to coordinate movement and attacks, and is typically used within AI brain definitions for hostile entities.

## Usage example
```lua
local brain = Brain(inst)
local chase = ChaseAndAttack(inst, 30, 40, 5, FindNearestEnemy, false, 10)

brain:AddNode(
    PriorityNode(
        function() return A(ChaseAndAttack, inst, 30, 40, 5, FindNearestEnemy, false) end,
        "Chase and Attack",
        PRIORITY.URGENT
    )
)

RunBrain(inst, brain)
```

## Dependencies & tags
**External dependencies:**
- `BehaviourNode` -- parent class for behaviour tree nodes

**Components used:**
- `combat` -- validates target, sets target, triggers battle cry, attempts attacks, calculates attack range, gives up target
- `locomotor` -- stops movement, moves to point, checks run state
- `health` (on target) -- checks if target is dead
- `sg` -- checks state tags for attack and movement conditions

**Tags:**
- `longattack` -- checked before executing attack logic
- `jumping` -- checked before stopping locomotion
- `canrotate` -- checked before facing the target

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The entity instance this behaviour is attached to. |
| `findnewtargetfn` | function | `nil` | Callback function to find a new target when none exists. |
| `max_chase_time` | number | `nil` | Maximum time in seconds to chase before giving up. |
| `give_up_dist` | number | `nil` | Distance threshold squared at which to abandon the chase. |
| `max_attacks` | number | `nil` | Maximum number of attacks before marking behaviour as successful. |
| `numattacks` | number | `0` | Counter tracking how many attacks have been performed. |
| `walk` | boolean | `nil` | If true, entity walks instead of runs when chasing. |
| `distance_from_ocean_target` | number/function | `nil` | Special distance handling for targets on invalid ground (ocean). |
| `onattackfn` | function | `nil` | Internal callback bound to attack events. |
| `startruntime` | number | `nil` | Timestamp when the chase began, used for timeout calculation. |
| `status` | string | `READY` | Behaviour status: READY, RUNNING, FAILED, or SUCCESS. |

## Main functions

### `ChaseAndAttack(inst, max_chase_time, give_up_dist, max_attacks, findnewtargetfn, walk, distance_from_ocean_target)`
* **Description:** Constructor that initializes the behaviour node with chase and attack parameters. Registers event listeners for attack outcomes.
* **Parameters:**
  - `inst` -- entity instance to attach behaviour to
  - `max_chase_time` -- maximum chase duration in seconds (optional)
  - `give_up_dist` -- squared distance threshold to abandon chase (optional)
  - `max_attacks` -- maximum attacks before success (optional)
  - `findnewtargetfn` -- function to find new targets when current target is nil
  - `walk` -- boolean to walk instead of run during chase
  - `distance_from_ocean_target` -- distance value or function for ocean target handling
* **Returns:** New ChaseAndAttack behaviour instance.
* **Error states:** Errors if `inst` has no `combat` or `locomotor` component when `Visit()` is called (nil dereference on `self.inst.components.combat` or `self.inst.components.locomotor` — no guard present in Visit logic).

### `__tostring()`
* **Description:** Returns a string representation showing the current combat target.
* **Parameters:** None.
* **Returns:** String in format "target `{target_name}`" or "target nil".
* **Error states:** None.

### `OnStop()`
* **Description:** Cleanup function called when the behaviour stops. Removes event listeners registered during construction.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `OnAttackOther()`
* **Description:** Callback triggered when the entity attacks or misses another entity. Increments attack counter and resets chase timer.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `Visit()`
* **Description:** Main behaviour logic executed each tick. Validates target, manages chase state, controls locomotion, attempts attacks, and checks termination conditions (max attacks, timeout, distance).
* **Parameters:** None.
* **Returns:** None. Updates `self.status` to READY, RUNNING, FAILED, or SUCCESS.
* **Error states:** Errors if `self.inst.components.combat` is nil (no guard before accessing combat methods). Errors if `self.inst.components.locomotor` is nil (no guard before calling Stop/GoToPoint). Errors if `combat.target` exists but has no `entity` component (accesses `combat.target.entity:IsValid()` without nil check).

## Events & listeners
- **Listens to:** `onattackother` - increments attack counter and resets chase timer.
- **Listens to:** `onmissother` - increments attack counter and resets chase timer.
- **Pushes:** None directly (calls `combat:GiveUp()` which pushes `giveuptarget` event from combat component).