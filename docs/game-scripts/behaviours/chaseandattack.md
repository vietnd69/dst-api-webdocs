---
id: chaseandattack
title: Chaseandattack
description: A behavior node that orchestrates chasing and attacking logic by interacting with the combat, locomotor, and health components.
tags: [combat, ai, behavior]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behavior
source_hash: c38a8ac6
system_scope: ai
---

# Chaseandattack

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ChaseAndAttack` is a behavior node that implements AI logic for entities to pursue and engage a target. It manages movement, targeting validation, attack initiation, and termination conditions such as time limits, distance thresholds, or attack counts. It integrates closely with the `combat` component to handle target selection and engagement, the `health` component to detect target death, and the `locomotor` component to control movement (chasing, stopping, facing).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("combat")
inst:AddComponent("health")
inst:AddComponent("locomotor")

local function findTargetFn(inst)
    -- Example: find nearest enemy
    return inst.components.combat:GetNearestEnemy()
end

inst:AddBehaviourNode("chaseandattack", ChaseAndAttack(inst, 10, 100, 3, findTargetFn, false, 2))
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`
**Tags:** Checks `attack`, `canrotate`, `jumping`, `longattack`, `hiding` (via target); no tags are added or removed directly by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this behavior node is attached to. |
| `findnewtargetfn` | function? | `nil` | Optional callback to find a new target; called when no target is set. |
| `max_chase_time` | number? | `nil` | Maximum duration (in seconds) to continue chasing before giving up. |
| `give_up_dist` | number? | `nil` | Distance threshold (squared) beyond which the target is considered unreachable. |
| `max_attacks` | number? | `nil` | Maximum number of successful attacks before success condition is met. |
| `numattacks` | number | `0` | Counter for number of attacks made. |
| `walk` | boolean | `false` | Whether movement should be walking (`true`) or running (`false`). |
| `distance_from_ocean_target` | function? | `nil` | Optional callback to compute offset distance from ocean target (used for water-based enemies). |
| `onattackfn` | function | — | Internal event callback for `onattackother` and `onmissother`. |
| `startruntime` | number? | `nil` | Timestamp marking when chase started; reset on each attack. |

## Main functions
### `Visit()`
*   **Description:** Main behavior logic; handles target validation, chase initiation, movement, attack attempts, and termination conditions (success, failure).
*   **Parameters:** None.
*   **Returns:** Nothing (calls `self:Sleep(.125)` when still running).
*   **Error states:** Returns early if `combat.target` is invalid or dead; may set status to `SUCCESS` or `FAILED` based on runtime conditions.

### `OnAttackOther()`
*   **Description:** Callback invoked on `onattackother` or `onmissother` events; increments `numattacks` and resets the chase timer.
*   **Parameters:** None (called via event).
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnStop()`
*   **Description:** Cleans up event listeners when the behavior node is stopped.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `__tostring()`
*   **Description:** String representation used for debugging; shows current target.
*   **Parameters:** None.
*   **Returns:** String: `"target <prefab_name>"` or `"target nil"`.

## Events & listeners
- **Listens to:** `onattackother` (via `self.onattackfn`), `onmissother` (via `self.onattackfn`)
- **Pushes:** None directly (uses `combat:GiveUp()` and `combat:SetTarget(nil)` internally).
