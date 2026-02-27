---
id: panicandavoid
title: Panicandavoid
description: Causes an entity to panic and randomly change direction while attempting to avoid a nearby target object when it is within a specified distance.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: 382f8197
---

# Panicandavoid

## Overview
The `PanicAndAvoid` behaviour is a stateful node used in decision-making systems (typically in AI brains) to simulate panicked movement. When active, it directs the entity to run in a randomized direction and periodically re-evaluates whether to change course. If a target object is nearby (within `avoid_dist`), it attempts to steer the entity away from the target—not directly opposite, but at a ~45° offset to maintain dynamic, evasive motion.

It inherits from `BehaviourNode` and integrates with the `Locomotor` component to execute movement via `RunInDirection`. This node is typically used for reactive, short-term evasion during threats (e.g., fleeing from fire, electric fences, or predators), and reverts to normal AI control when completed.

## Dependencies & Tags
- **Components used:**  
  - `locomotor` — accessed via `self.inst.components.locomotor:RunInDirection(...)`
- **Tags:** None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this behaviour operates on. |
| `waittime` | `number` | `0` | Timestamp (via `GetTime()`) indicating when the next direction change is allowed. Used to avoid erratic micro-updates. |
| `findavoidanceobjectfn` | `function(inst): Entity?` | — | Callback function that returns the target object to avoid, or `nil` if none exists. |
| `avoid_dist` | `number` | — | Distance threshold (in world units) at which avoidance logic activates. |
| `avoidtarget` | `Entity?` | `nil` | Cached reference to the target object to avoid; updated only when `status == READY`. |
| `status` | `BehaviourStatus` | `READY` | Inherited from `BehaviourNode`; tracks node state (`READY`, `RUNNING`, `SUCCESS`, `FAILURE`). |

## Main Functions

### `PanicAndAvoid:Visit()`
* **Description:** The primary entry point for behaviour evaluation. On first invocation (`status == READY`), it resolves the avoidance target (if `findavoidanceobjectfn` is defined), picks a new random direction, and sets `status` to `RUNNING`. On subsequent invocations, if the cooldown (`waittime`) has elapsed, it chooses a new direction; otherwise, it attempts to run toward the computed current direction—adjusting rotation only if needed to avoid overshooting or oscillation.
* **Parameters:** None.
* **Returns:** `nil` (as part of the behaviour tree protocol, success/failure state is inferred via `self.status`, though not explicitly set in this method).

### `PanicAndAvoid:PickNewDirection()`
* **Description:** Immediately sets the entity to run in a new random direction (0°–360°) and schedules the next direction update (0.25–0.50 seconds later). This creates a jittery, panic-like movement pattern.
* **Parameters:** None.
* **Returns:** `nil`.

### `PanicAndAvoid:ResolveDirection(rot)`
* **Description:** Determines the optimal movement direction given a base rotation `rot`. If `avoidtarget` is valid and within `2 * avoid_dist`, and the target lies within ±45° of the desired heading, it computes a safe offset direction (left or right by ~45°) to strafe away while avoiding sharp 180° turns. Otherwise, it returns `rot` unchanged.
* **Parameters:**  
  - `rot` (`number`) — Desired rotation in degrees (typically from `PickNewDirection` or `Visit`).  
* **Returns:**  
  - `number` — Updated rotation (in degrees) to use for movement. May be equal to `rot` if no avoidance is needed or safe.

## Events & Listeners
None. This component does not register or fire any events.