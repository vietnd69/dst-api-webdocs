---
id: chaseandattackandavoid
title: Chaseandattackandavoid
description: A behaviour node that enables an entity to chase a target, attack it, and avoid hazardous objects when in close proximity, while supporting timeouts and attack limits.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: a2504f3a
---

# Chaseandattackandavoid

## Overview
`ChaseAndAttackAndAvoid` is a `BehaviourNode` that orchestrates an entity’s movement and combat behavior by combining pathfinding, target engagement, and dynamic hazard avoidance. It extends ` BehaviourNode` and integrates tightly with the `combat`, `locomotor`, and `health` components to manage chasing, attacking, and fleeing from danger in real time. The node operates within a state machine (typically managed by a `Brain`) and returns `SUCCESS`, `FAILED`, or remains `RUNNING` based on combat outcomes, timeouts, or distance thresholds.

Key design aspects:
- Dynamically finds targets via a user-provided function (`findnewtargetfn`).
- Avoids hazards (e.g., fire, electric fences) by recalculating movement direction when near obstacles, if `findavoidanceobjectfn` is provided.
- Supports attack-rate limiting (`max_attacks`) and chase timeouts (`max_chase_time`).
- Hooks into `onattackother` and `onmissother` events to track successful hits and misses.

## Dependencies & Tags
- **Components used:**
  - `combat` (via `inst.components.combat`): manages target state, battle cry, attack attempts, and range calculations.
  - `health` (via `inst.components.health`): checks if target is dead.
  - `locomotor` (via `inst.components.locomotor`): handles movement commands (`GoToPoint`, `Stop`, `WantsToRun`).
- **Tags:** None added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *required* | The entity instance this behaviour controls. |
| `findnewtargetfn` | `function(inst): Entity?` | `nil` | Callback function to find a new valid target (e.g., nearest enemy). |
| `avoid_dist` | `number` | *required* | Minimum separation distance to trigger avoidance steering offset (in world units). |
| `max_chase_time` | `number` | `nil` | Maximum duration (in seconds) to continue chasing before failing. |
| `give_up_dist` | `number` | `nil` | Distance threshold (squared comparison) where the entity gives up pursuit. |
| `max_attacks` | `number` | `nil` | Maximum number of attacks allowed before succeeding (regardless of combat outcome). |
| `numattacks` | `number` | `0` | Counter for successful attacks/misses tracked via events. |
| `walk` | `boolean` | *required* | If `false`, the entity moves at full run speed; if `true`, moves at walk speed. |
| `findavoidanceobjectfn` | `function(inst): Entity?` | `nil` | Callback to locate a nearby hazard to avoid (e.g., fire, fence). |
| `avoidtarget` | `Entity?` | `nil` | Current hazard entity being avoided (set during `Visit`). |
| `startruntime` | `number?` | `nil` | Timestamp marking when the chase began (for `max_chase_time` tracking). |
| `onattackfn` | `function(inst, data)` | *internal* | Shared callback for `onattackother` and `onmissother` events. |

## Main Functions
### `ChaseAndAttackAndAvoid:Visit()`
* **Description:** The core behavior execution method (part of the `BehaviourNode` interface). Handles state transitions from `READY` to `RUNNING` to either `SUCCESS` or `FAILED`, manages movement toward target, avoids hazards, and enforces attack/distance/time limits.
* **Parameters:** None (uses `self` state).
* **Returns:** None (sets `self.status` internally and calls `self:Sleep(.125)`).

### `ChaseAndAttackAndAvoid:OnStop()`
* **Description:** Cleanup method called when the behaviour node terminates (via `SUCCESS`, `FAILED`, or preemption). Removes the `onattackother` and `onmissother` event callbacks to prevent leaks.
* **Parameters:** None.
* **Returns:** None.

### `ChaseAndAttackAndAvoid:OnAttackOther(target)`
* **Description:** Callback invoked on `onattackother` or `onmissother` events. Increments `numattacks` and resets the `startruntime` timer to allow extended chasing after a hit/miss.
* **Parameters:**
  - `target` (`Entity?`): The target that was attacked or missed (may be `nil` if target died).
* **Returns:** None.

### `ChaseAndAttackAndAvoid:__tostring()`
* **Description:** Human-readable representation for debugging, showing current combat target and avoidance target.
* **Parameters:** None.
* **Returns:** `string` formatted as `"target <target>, avoiding <avoidtarget>"`.

## Events & Listeners
- **Listens to:**
  - `"onattackother"`: fires when a successful attack lands; handled by `self.onattackfn`.
  - `"onmissother"`: fires when an attack attempt misses; handled by `self.onattackfn`.
- **Pushes:** None (does not fire custom events).