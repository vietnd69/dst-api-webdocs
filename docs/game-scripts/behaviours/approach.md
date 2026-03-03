---
id: approach
title: Approach
description: A behavior node that moves an entity toward a target until it reaches a specified distance.
tags: [ai, locomotion, behavior]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d20b827b
system_scope: locomotion
---

# Approach

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Approach` is a behavior node used in the DST AI behavior tree system to move an entity toward a specified target until it comes within a defined distance threshold. It relies on the `locomotor` component to execute movement and integrates with the `health` component to detect target validity (e.g., whether the target is dead). The node transitions to `SUCCESS` when the target is within range or `FAILED` when the target becomes invalid or unreachable.

## Usage example
```lua
local approach = inst.components.behaviourtree:GetNode("Approach")
    or inst.components.behaviourtree:AddNode("Approach", inst, target_entity, 3.0, true)
approach:EvaluateDistances()
-- In stategraph or behavior tree context:
if approach:Visit() == "SUCCESS" then
    -- Target reached within range
end
```

## Dependencies & tags
**Components used:** `locomotor`, `health`
**Tags:** Checks `running` (state tag) on the entity's stategraph; no custom tags added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The entity instance that will move (owner of the component). |
| `target` | entity/function | `nil` | The target entity, or a function returning an entity. |
| `dist` | number/function | `nil` | The squared distance threshold (if number) or a function computing it. |
| `canrun` | boolean | `true` | Whether the entity is allowed to run (use `GoToPoint(..., nil, true)`). |
| `currenttarget` | entity | `nil` | The currently targeted entity (cached during evaluation). |
| `dist_fn` | function | `nil` | Optional function that computes distance dynamically (set if `dist` is a function). |

## Main functions
### `GetTarget()`
* **Description:** Retrieves the target entity by evaluating `self.target` (which may be a function or direct reference) and validates it.
* **Parameters:** None.
* **Returns:** `entity` if valid and not destroyed, otherwise `nil`.

### `EvaluateDistances()`
* **Description:** Updates the `self.dist` value if `self.dist_fn` is set. Called when the target changes to recompute dynamic distance thresholds.
* **Parameters:** None.
* **Returns:** Nothing.

### `DBString()`
* **Description:** Returns a debug string containing the current target name and distance (in meters), useful for behavior tree visualization or logging.
* **Parameters:** None.
* **Returns:** `string` — formatted as `"<target>, (xx.xx) "`.

### `AreDifferentPlatforms(inst, target)`
* **Description:** Determines whether the entity and target are on different platforms, respecting the `allow_platform_hopping` setting on `locomotor`.
* **Parameters:**  
  - `inst` (entity) — the moving entity.  
  - `target` (entity) — the target entity.  
* **Returns:** `boolean` — `true` if platforms differ and platform hopping is disabled; otherwise `false`.

### `Visit()`
* **Description:** The core method called by the behavior tree to execute the node's logic. Evaluates target validity, computes distances, and moves the entity toward the target if needed.
* **Parameters:** None.
* **Returns:** Implicitly returns `nil`, but sets `self.status` to `"READY"`, `"RUNNING"`, `"SUCCESS"`, or `"FAILED"`.
* **Error states:**  
  - Returns early (sets `status = FAILED`) if `self.currenttarget` is `nil` or invalid.  
  - Stops movement via `locomotor:Stop()` and returns `nil` if target becomes invalid during `RUNNING`.

## Events & listeners
- **Listens to:** None (does not register event listeners directly).
- **Pushes:** None (does not fire events directly; relies on stategraph or behavior tree node handling).
