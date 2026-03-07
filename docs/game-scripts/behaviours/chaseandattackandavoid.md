---
id: chaseandattackandavoid
title: Chaseandattackandavoid
description: Manages AI behavior to chase, attack a target, and avoid obstacles when they are closer than a specified distance.
tags: [ai, combat, locomotion, avoidance]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviour
source_hash: a2504f3a
system_scope: ai
---

# Chaseandattackandavoid

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ChaseAndAttackAndAvoid` is a BehaviourNode implementation that controls an entity’s pursuit and attack behavior. It extends ` BehaviourNode` and integrates with the `combat`, `locomotor`, and `health` components. The behavior involves selecting or maintaining a combat target, navigating toward it, performing attacks, and dynamically rerouting to avoid obstacles (e.g., electrified fences, fire) if they lie closer than a given distance. It also supports optional constraints like maximum chase time, maximum attacks before ceasing, and distance-based give-up thresholds.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("combat")
inst:AddComponent("locomotor")
inst:AddComponent("health")

local find_target = function() return inst.components.combat.target end
local find_avoidance = function() return FindAvoidanceObject(inst) end

inst:AddBehaviourNode("chaseandattackandavoid", ChaseAndAttackAndAvoid(
    inst,
    find_target,
    2.5,        -- avoid_dist
    10,         -- max_chase_time (seconds)
    40,         -- give_up_dist
    nil,        -- max_attacks (nil = unlimited)
    find_avoidance,
    false       -- walk (false = run)
))
```

## Dependencies & tags
**Components used:** `combat`, `locomotor`, `health`  
**Tags:** Listens to `onattackother` and `onmissother` events; does not directly manage or modify entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | *(provided)* | Entity instance owning this behavior. |
| `findnewtargetfn` | function? | `nil` | Optional callback `(inst) → target?` used to locate a new target. |
| `findavoidanceobjectfn` | function? | `nil` | Optional callback `(inst) → object?` used to detect objects to avoid (e.g., fences). |
| `avoid_dist` | number | *(provided)* | Distance threshold; if an avoidance object is closer than this, pathing is adjusted. |
| `max_chase_time` | number? | `nil` | Maximum seconds to continue chasing before failing. |
| `give_up_dist` | number? | `nil` | Distance squared threshold beyond which the target is considered unreachable. |
| `max_attacks` | number? | `nil` | Maximum attack attempts before succeeding and ceasing. |
| `numattacks` | number | `0` | Count of successful attacks or misses since last target acquisition. |
| `walk` | boolean | `false` | If `true`, entity walks instead of runs when moving. |
| `avoidtarget` | Entity? | `nil` | Detected obstacle object to avoid (populated during `Visit`). |
| `startruntime` | number? | `nil` | Timestamp when chasing started (used with `max_chase_time`). |
| `onattackfn` | function | *(internal)* | Handler for `onattackother` and `onmissother` events. |

## Main functions
### `OnStop()`
*   **Description:** Cleanup function called when the behavior node is stopped. Removes event listeners to prevent leaks.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnAttackOther(target)`
*   **Description:** Event callback invoked on `onattackother` and `onmissother`. Increments `numattacks` and resets the chase timer (`startruntime`) to prevent early timeouts after an attack attempt.
*   **Parameters:** `target` (Entity?) — the target of the attack/miss event.
*   **Returns:** Nothing.

### `Visit()`
*   **Description:** Core behavior logic executed on each AI tick. Handles target acquisition, pathing, avoidance adjustment, attack attempts, and termination conditions (success, fail, give up).
*   **Parameters:** None.
*   **Returns:** Nothing. Calls `self:Sleep(0.125)` to schedule the next tick.
*   **Error states:**
    *   Fails immediately if no target is found during initial state (`status == READY`).
    *   Fails if target becomes invalid or dead.
    *   Fails if chase duration exceeds `max_chase_time` or distance exceeds `give_up_dist`.
    *   Succeeds if `max_attacks` is reached or no target needed further action.

## Events & listeners
- **Listens to:**  
  - `onattackother` — via `self.onattackfn` to track attacks and reset chase timer.  
  - `onmissother` — via same handler to also count misses as attack attempts.  
- **Pushes:** None (does not fire custom events directly; behavior outcomes are reflected in the stategraph via success/failure status of the node).
