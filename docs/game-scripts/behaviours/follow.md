---
id: follow
title: Follow
description: Controls an entity's movement to maintain a specified distance from a target, supporting approach, retreat, and idle behaviors based on distance thresholds.
tags: [ai, locomotion, targeting]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviours
source_hash: 60ba9131
system_scope: locomotion
---

# Follow

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Follow` is a behaviour node that enables an entity to dynamically adjust its position relative to a target entity. It maintains a target distance by either approaching the target when too far (`APPROACH`), backing off when too close (`BACKOFF`), or succeeding (idle) when within the desired range. The behaviour integrates with the `locomotor` component to execute movement and checks the target's `health` component to avoid pursuing dead entities. It supports dynamic distance thresholds via functions and platform-aware movement logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("behaviourtree")
local follow_node = inst.components.behaviourtree:AddNode("Follow", inst, target_ent, 2, 10, 5, true, false, true)
```

## Dependencies & tags
**Components used:** `health`, `locomotor`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity that will follow the target. |
| `target` | `Entity` or `function` | — | Target entity, or a function returning an entity. |
| `min_dist` | number or `function` | — | Minimum acceptable distance (below which entity backs off), or a function returning it. |
| `max_dist` | number or `function` | — | Maximum distance threshold (beyond which entity approaches), or a function returning it. |
| `target_dist` | number or `function` | — | Desired distance to stop moving (for success), or a function returning it. |
| `canrun` | boolean | `true` | Whether the entity is allowed to run instead of walk. |
| `alwayseval` | boolean | `true` | Whether distance functions are re-evaluated on every visit. |
| `inlimbo_invalid` | boolean | — | If `true`, fails if the target is in limbo (e.g., unreachable). |
| `currenttarget` | `Entity` | `nil` | Cached reference to the current valid target. |
| `action` | string | `"STAND"` | Current movement action (`APPROACH`, `BACKOFF`, or `STAND`). |

## Main functions
### `GetTarget()`
* **Description:** Returns the current valid target entity, resolving `self.target` if it is a function, and verifying it is valid and not dead.
* **Parameters:** None.
* **Returns:** `Entity` or `nil`.

### `EvaluateDistances()`
* **Description:** Recomputes `min_dist`, `max_dist`, and `target_dist` by evaluating any associated functions. Typically called when the target changes or `alwayseval` is enabled.
* **Parameters:** None.
* **Returns:** Nothing.

### `DBString()`
* **Description:** Returns a debug string showing the current target, action, and Euclidean distance in meters.
* **Parameters:** None.
* **Returns:** `string` — formatted as `"<target> <action>, (<distance>) "`.

### `AreDifferentPlatforms(inst, target)`
* **Description:** Determines whether the entity and target are on different platforms (e.g., ground vs. air), based on `locomotor.allow_platform_hopping`.
* **Parameters:**  
  - `inst` (`Entity`) — entity to check.  
  - `target` (`Entity`) — target entity.  
* **Returns:** `boolean` — `true` if on different platforms and platform hopping is disallowed; otherwise `false`.

### `Visit()`
* **Description:** The core behaviour node tick logic. Evaluates target presence, distance thresholds, and platform configuration to decide action (`APPROACH`, `BACKOFF`, or success). Executes movement via `locomotor` commands.
* **Parameters:** None.
* **Returns:** Nothing. Updates `self.status` (`READY`, `RUNNING`, `SUCCESS`, or `FAILED`).
* **Error states:**  
  - Fails (`status = FAILED`) if target is `nil`, invalid, dead, or in limbo (when `inlimbo_invalid`).  
  - Fails and stops locomotion if target becomes unreachable during `RUNNING` state.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.  
  *(Note: Event handling is delegated to the behaviour tree framework and `locomotor`, not directly fired by this component.)*
