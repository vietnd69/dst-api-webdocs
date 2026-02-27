---
id: chaseandattack
title: Chaseandattack
description: Implements a behavior node that directs an entity to chase and attack a target, handling pursuit logic, attack tracking, timeout conditions, and target validation.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: combat
source_hash: c38a8ac6
---

# Chaseandattack

## Overview
`ChaseAndAttack` is a BehaviourNode subclass that orchestrates an entity's chase-and-attack sequence against a combat target. It coordinates locomotion (`GoToPoint`, `Stop`, `WantsToRun`), combat (`SetTarget`, `ValidateTarget`, `TryAttack`, `BattleCry`, `GiveUp`), and health validation (`IsDead`) to pursue, engage, and optionally retreat from a target. This component integrates closely with the entity's state graph and locomotor, enforcing constraints like maximum chase time, attack count, and distance-based give-up thresholds.

It is typically used in AI decision trees (via the behaviour system) to delegate attack execution and pursuit to a reusable, self-contained node.

## Dependencies & Tags
- **Components used:**
  - `combat` (`components.combat`): accesses `target`, `ValidateTarget`, `SetTarget`, `BattleCry`, `GiveUp`, `CalcAttackRangeSq`, `TryAttack`
  - `health` (`components.health`): accessed for `IsDead` checks on the target
  - `locomotor` (`components.locomotor`): accesses `GoToPoint`, `Stop`, `WantsToRun`
- **Tags:** None explicitly added/removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this behavior belongs to. |
| `findnewtargetfn` | `function` or `nil` | `nil` | Optional callback function invoked to locate a new target when current one is lost (`combat.target == nil`). |
| `max_chase_time` | `number` or `nil` | `nil` | Maximum seconds to continue chasing before giving up. |
| `give_up_dist` | `number` or `nil` | `nil` | Squared distance threshold beyond which the entity abandons pursuit. |
| `max_attacks` | `number` or `nil` | `nil` | Maximum number of successful attacks before exiting with SUCCESS. |
| `numattacks` | `number` | `0` | Counter tracking the number of successful attacks (incremented on `onattackother` event). |
| `walk` | `boolean` | `false` | Controls whether the entity moves while walking (`false` = running). Passed to `GoToPoint`. |
| `distance_from_ocean_target` | `number`, `function`, or `nil` | `nil` | Optional offset used to adjust target point when target is in ocean (not on valid ground). Can be a number or a function of form `(inst, target) => number`. |
| `onattackfn` | `function` | — | Internal callback bound to `onattackother` and `onmissother` events to increment `numattacks` and reset chase timer. |
| `startruntime` | `number` or `nil` | `nil` | Timestamp marking the start of current chase/attack phase (set on entering RUNNING state). |

## Main Functions

### `ChaseAndAttack:OnStop()`
* **Description:** Cleans up event listeners when the behavior node is stopped. Removes callbacks for `onattackother` and `onmissother` to prevent stale references or duplicate triggers.
* **Parameters:** None.
* **Returns:** `nil`.

### `ChaseAndAttack:OnAttackOther()`
* **Description:** Incremented when the entity successfully attacks (`onattackother`) or misses (`onmissother`). Resets the `startruntime` timer to prevent premature timeout due to elapsed chase time during inactive periods (e.g., missed swing).
* **Parameters:** None (called via event listener).
* **Returns:** `nil`.

### `ChaseAndAttack:Visit()`
* **Description:** Core execution logic. Manages transitions from `READY` → `RUNNING` → (`SUCCESS` or `FAILED`). Performs target validation, pursuit (via locomotion), attack attempts, and timeout checks.
* **Parameters:** None.
* **Returns:** `nil`. Sets internal `self.status` to `SUCCESS` or `FAILED` and stops locomotion/targeting upon termination.

#### Behavior Flow (summarized):
1. **If `status == READY`:**
   - Validates current target (via `combat:ValidateTarget()`).
   - If no target and `findnewtargetfn` exists, attempts to acquire a new one.
   - If target exists: sets `startruntime`, resets `numattacks`, and transitions to `RUNNING`.
   - Otherwise: fails immediately.

2. **If `status == RUNNING`:**
   - Checks target validity (non-null, non-dead, valid entity).
   - Adjusts target point if target is in ocean (`distance_from_ocean_target` handling).
   - Commands locomotion (`GoToPoint`/`Stop`) based on distance and attack range.
   - Calls `combat:TryAttack()` to attempt an attack.
   - Tracks attack count; exits with `SUCCESS` if `max_attacks` reached.
   - Checks give-up conditions: distance (`give_up_dist`) or time (`max_chase_time`).
   - Sleeps `.125` seconds before next tick.

## Events & Listeners
- **Listens to:**
  - `"onattackother"` — triggers `OnAttackOther`, increments `numattacks`, resets `startruntime`.
  - `"onmissother"` — same handler as above (treats missed attacks the same for timer reset).
- **Pushes:** None — this component does not emit events directly.