---
id: avoidelectricfence
title: Avoidelectricfence
description: A behavior node that forces an entity to flee away from an active electric fence when it detects proximity or shock events.
tags: [ai, behavior, electric, panic, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: d15e4d1e
system_scope: locomotion
---

# Avoidelectricfence

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AvoidElectricFence` is a behavior node used in AI brain logic to trigger evasive movement when an entity comes into contact with or is near an electric fence. It calculates a safe run angle away from the fence(s) and commands the entity to move using the `locomotor` component. If the entity has a `combat` component, it drops any active target before fleeing.

This component integrates with the `BrainCommon.HasElectricFencePanicTriggerNode` mechanism by setting an internal tag on the entity, and responds to two key events: `startelectrocute` and `shocked_by_new_field`.

## Usage example
```lua
-- Typically added to prefabs via brain definition:
-- brain:InsertChild(AvoidElectricFence(inst))

-- The component does not need manual addition; it is instantiated and managed by the brain tree.
-- Internally, it registers event callbacks and uses `Combat:DropTarget()` and `Locomotor:RunInDirection()` when triggered.
```

## Dependencies & tags
**Components used:** `combat`, `locomotor`  
**Tags:** Sets `inst._has_electric_fence_panic_trigger = true` (private/internal flag for brain node detection)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | Reference to the entity instance the behavior belongs to. |
| `run_angle` | number | `nil` | Cached direction (in degrees, `0 <= x < 360`) to flee; set when `shocked_by_new_field` fires. |
| `shocked_by_field` | function | `nil` | Event handler for `"shocked_by_new_field"`; computes and caches `run_angle`. |

## Main functions
### `GetRunAngle(field)`
*   **Description:** Calculates the average direction *away* from all fences in the given electric fence `field`. It sums unit vectors pointing from the entity to each fence, then inverts the result and normalizes via `atan2`.
*   **Parameters:**  
  `field` (table) — an object containing a `fences` array, where each fence has a `Transform` component accessible via `field.fences[i].Transform`.
*   **Returns:**  
  `number` — a flee angle in degrees, normalized to the range `[0, 360)`.
*   **Error states:** Returns `0` if the field has no fences (empty `fences` array), though no explicit guard exists in the current implementation.

### `Visit()`
*   **Description:** The core behavior execution method. When the node is active (`status == READY`), it triggers fleeing behavior:
  - Drops the entity’s combat target (via `Combat:DropTarget()`), if present.
  - Initiates movement in the saved `run_angle` direction (via `Locomotor:RunInDirection()`).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No-op if `self.run_angle` is `nil`, or if the `locomotor` component is missing.

### `OnStop()`
*   **Description:** Cleans up event listeners when the behavior node is terminated.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `startelectrocute` — triggers `Brain:ForceUpdate()` to re-evaluate the node state (via the internal `onelectrocute` callback).  
  `shocked_by_new_field` — triggers `self.shocked_by_field`, which computes `run_angle` and forces a brain update.
- **Pushes:** None (this component does not fire custom events).
