---
id: panicandavoid
title: Panicandavoid
description: Triggers panicked movement in a random direction while avoiding nearby threats when a specified avoidance condition is met.
tags: [ai, locomotion, combat]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviours
source_hash: 382f8197
system_scope: locomotion
---

# Panicandavoid

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PanicAndAvoid` is a behaviour node used in DST's AI state machines to implement panic-based evasive movement. It extends `BehaviourNode`, and when visited, causes the entity to move in a randomized direction. If a valid avoidance target (e.g., a threat) is within proximity, it adjusts the movement direction to avoid that target using angular offset calculations. This behaviour integrates with the `locomotor` component to drive actual movement.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("behaviourtree")
inst:AddComponent("locomotor")

local find_threat_fn = function(ent) return ent.components.combat ~= nil and ent.components.combat:GetEnemy() end

inst.components.behaviourtree:AddNode("panicandavoid", PanicAndAvoid, find_threat_fn, 6)

-- In a stategraph:
-- bt:PushNode("panicandavoid")
```

## Dependencies & tags
**Components used:** `locomotor`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance the behaviour operates on. |
| `waittime` | number | `0` | Timestamp used to determine when to re-evaluate direction. |
| `findavoidanceobjectfn` | function or `nil` | — | Optional callback that returns the current threat/target to avoid. |
| `avoid_dist` | number | — | Distance threshold used to determine if avoidance response should be triggered. |
| `avoidtarget` | `Entity` or `nil` | `nil` | Computed target to avoid during movement (set at runtime). |

## Main functions
### `Visit()`
* **Description:** Executes the behaviour logic. If the status is `READY`, initializes the `avoidtarget` and picks a new movement direction. If `RUNNING`, either picks a new direction after the wait time expires, or continues moving with optional avoidance adjustment.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does not return errors, but no movement occurs if `locomotor:RunInDirection()` is blocked (e.g., by state tags or missing component).

### `PickNewDirection()`
* **Description:** Initiates immediate movement in a randomly chosen direction (`0°–360°`) and sets `waittime` to ~0.25–0.5 seconds in the future, after which the next random direction is chosen.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No explicit failure conditions; relies on `locomotor:RunInDirection()` for movement execution.

### `ResolveDirection(rot)`
* **Description:** Adjusts the given rotation (`rot`) to steer away from `avoidtarget` if the target is within `avoid_dist * 2` distance and the current heading is within ±45° of the target. Otherwise, returns `rot` unchanged.
* **Parameters:** `rot` (number) — current rotation angle in degrees.
* **Returns:** number — adjusted rotation (in degrees), or original `rot` if avoidance not needed.
* **Error states:** Returns `rot` unchanged if `avoidtarget` is `nil`, invalid, or too far away. Misalignment handling assumes 2D plane (Y-axis ignored in point comparison).

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
