---
id: leashandavoid
title: Leashandavoid
description: Manages AI movement to return an entity toward a home location while optionally avoiding specified obstacles, used primarily for leash-based behavior in world navigation.
tags: [ai, locomotion, pathfinding]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviours
source_hash: 7d8f022b
system_scope: locomotion
---

# Leashandavoid

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Leashandavoid` is a behaviour node used in the AI state machine system to enforce a "leash" mechanic — moving an entity back toward a designated home position while avoiding certain objects or danger zones. It inherits from `BehaviourNode` and integrates with the `locomotor` component to issue movement commands. The behaviour succeeds once the entity re-enters the allowed return radius around the home position, or fails if the home position is invalid or the entity is within the leash radius at activation. It optionally computes avoidance offsets around targets identified by a provided callback function.

## Usage example
```lua
inst:AddComponent("locomotor")
inst:AddBehaviourNode("leashandavoid", {
    findavoidanceobjectfn = function(ent) return ent.components.combat and ent.components.combat.target or nil end,
    avoid_dist = 2.5,
    homelocation = Vector3(0, 0, 0),
    max_dist = 15,
    inner_return_dist = 10,
    running = true
})
```

## Dependencies & tags
**Components used:** `locomotor`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `homepos` | function or Vector3 | — | The home location (either a `Vector3` or a function returning one) relative to which leash distance is measured. |
| `maxdist` | function or number | `nil` | Maximum leash distance (scalar or function returning scalar). Beyond this, behaviour fails. |
| `returndist` | function or number | `nil` | Distance threshold within which the entity must return to succeed. Must be less than `maxdist`. |
| `running` | function or boolean | `false` | Whether the entity should run (`true`) or walk (`false`) toward home. |
| `findavoidanceobjectfn` | function | `nil` | Callback returning an avoidance target (e.g., a danger entity) or `nil`. |
| `avoid_dist` | number | `0` | Minimum distance to maintain from the avoidance target, if any. |

## Main functions
### `Visit()`
*   **Description:** Core execution method called by the behaviour tree. Evaluates current leash status, initiates avoidance steering if needed, and issues movement commands to return the entity home.
*   **Parameters:** None.
*   **Returns:** Modifies internal `self.status` to `FAILED`, `RUNNING`, or `SUCCESS`.
*   **Error states:** Returns early without movement if `homepos` resolves to `nil` at activation, setting status to `FAILED`.

### `GetHomePos()`
*   **Description:** Resolves the home position, supporting both static `Vector3` and dynamic function values.
*   **Parameters:** None.
*   **Returns:** `Vector3` or `nil` — the resolved home location.
*   **Error states:** Returns `nil` if `homepos` is `nil` or a function returning `nil`.

### `GetDistFromHomeSq()`
*   **Description:** Computes the squared distance between the entity's current position and the resolved home position.
*   **Parameters:** None.
*   **Returns:** `number` (squared distance) or `nil` if `homepos` is `nil`.

### `GetMaxDistSq()`
*   **Description:** Returns the squared maximum leash distance.
*   **Parameters:** None.
*   **Returns:** `number` — squared `maxdist` value.

### `GetReturnDistSq()`
*   **Description:** Returns the squared inner return distance threshold.
*   **Parameters:** None.
*   **Returns:** `number` — squared `returndist` value.

### `IsInsideLeash()`
*   **Description:** Checks if the entity is currently within the maximum leash radius.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if inside, `false` otherwise.

### `IsOutsideReturnDist()`
*   **Description:** Checks if the entity is currently outside the required return radius.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if outside, `false` otherwise.

### `DBString()`
*   **Description:** Returns a debug string summarizing the current state (home pos, distance, avoidance target).
*   **Parameters:** None.
*   **Returns:** `string` — human-readable debug output.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
