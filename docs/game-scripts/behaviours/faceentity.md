---
id: faceentity
title: Faceentity
description: A behavior node that orients an entity toward a target entity, optionally triggering alert states and stopping locomotion during the facing operation.
tags: [ai, behavior, rotation, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviors
source_hash: 36e43862
system_scope: ai
---

# Faceentity

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FaceEntity` is a behavior node that extends `BehaviourNode` and is used in AI decision trees to make an entity rotate to face a specific target. It supports optional locomotor cancellation, timeout-based termination, and automatic state transitions (e.g., entering "alert" state). This component is typically used in scripts that define combat or interactive behavior where visual orientation toward a target is required.

## Usage example
```lua
-- Example usage inside a brain or behavior tree:
local get_target = function(inst)
    return inst.components.combat and inst.components.combat.target
end

local keep_target = function(inst, target)
    return target:IsValid() and inst:GetDistanceToInst(target) < 10
end

local face_node = FaceEntity(inst, get_target, keep_target, 2.0, "alert")
```

## Dependencies & tags
**Components used:** `locomotor` — accessed to stop movement while facing.
**Tags:** Checks `idle`, `alert`, and `canrotate` state tags on the entity’s stategraph.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `getfn` | function | *required* | A function that returns the target entity to face; signature: `fn(inst) → entity \| nil`. |
| `keepfn` | function | *required* | A predicate function determining if the target remains valid; signature: `fn(inst, target) → boolean`. |
| `timeout` | number \| nil | `nil` | Maximum time (in seconds) the behavior may run before succeeding. |
| `customalert` | string \| nil | `nil` | Optional custom state name to enter instead of default `"alert"` on detected idle state. |
| `inst` | Entity | *inherited* | The entity instance the behavior operates on. |
| `target` | Entity \| nil | `nil` | The current target entity being faced. |
| `starttime` | number | `0` | Timestamp (from `GetTime()`) when the behavior started running. |
| `status` | number | `READY` | Current status of the behavior node (`READY`, `RUNNING`, `SUCCESS`, `FAILED`). |

## Main functions
### `HasLocomotor()`
* **Description:** Checks whether the entity has a `locomotor` component attached.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `inst.components.locomotor` exists, otherwise `false`.

### `Visit()`
* **Description:** The core behavior execution logic. Handles initiating facing, stopping movement, entering alert state, handling timeouts, and evaluating target validity.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; fails gracefully by setting status to `FAILED` if target is invalid or `keepfn` returns `false`. Does not throw exceptions.

## Events & listeners
- **Listens to:** None (state transitions are triggered directly via `inst.sg:GoToState(...)`).
- **Pushes:** None (does not fire events directly; relies on stategraph transitions and behavior-tree consumer to interpret result).
