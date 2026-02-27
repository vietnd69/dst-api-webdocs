---
id: faceentity
title: Faceentity
description: A behaviour node that orients an entity toward a dynamic target entity and optionally triggers an alert state, primarily used during AI decision-making.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: brain
source_hash: 36e43862
---

# Faceentity

## Overview
`FaceEntity` is a behaviour node used in AI decision trees to rotate an entity (e.g., a creature or character) to face a target entity, as determined by a provided function (`getfn`). It is part of the `behaviours` subsystem, inheriting from `BehaviourNode`, and integrates with the state graph via `inst.sg` to manage transitions like entering the `"alert"` state. The node supports optional timeout enforcement, a custom alert state, and verification that the target remains valid and suitable via a `keepfn` predicate. It interacts directly with the `locomotor` component to halt movement before rotating, ensuring stable orientation.

## Dependencies & Tags
- **Components used:**  
  - `inst.components.locomotor`: Used to stop motion before rotating (`Stop()` method).
- **Tags:**  
  - Reads state graph tags: `"idle"`, `"alert"`, `"canrotate"` via `self.inst.sg:HasStateTag(tag)`.
  - Does not add or remove any tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this behaviour node controls. |
| `getfn` | `function(inst): Entity?` | `nil` | Callback function that returns the current target entity to face; may return `nil` if no valid target exists. |
| `keepfn` | `function(inst, target): boolean` | `nil` | Predicate function that verifies whether the target remains acceptable (e.g., still in range or visible). |
| `timeout` | `number?` | `nil` | Optional maximum duration (in seconds) to allow rotation before succeeding. |
| `customalert` | `string?` | `nil` | Optional custom state name to transition to instead of `"alert"` when entering alert mode. |
| `starttime` | `number` | `0` | Internal timestamp marking when rotation began; used for timeout evaluation. |
| `target` | `Entity?` | `nil` | The currently targeted entity. |

## Main Functions
### `HasLocomotor()`
* **Description:** Checks whether the owner entity has a `locomotor` component attached. Used internally to determine if motion should be stopped before rotating.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `inst.components.locomotor` exists, otherwise `false`.

### `Visit()`
* **Description:** Core behaviour execution method, called each tick while the behaviour is active. Handles target acquisition, motion stopping, orientation (`FacePoint`), alert state transitions, timeout enforcement, and failure/success conditions.
* **Parameters:** None.
* **Returns:** `void`.

**Logic flow:**
- **If `status == READY`:**
  - Invokes `getfn(inst)` to retrieve the target.
  - If target is `nil`, sets status to `FAILED`.
  - If target exists:
    - Sets status to `RUNNING`.
    - If `locomotor` exists, calls `Stop()` to halt movement.
    - Records `starttime`.
- **If `status == RUNNING`:**
  - *Alert transition:* If in `"idle"` state and not already `"alert"`, and the `"alert"` state exists in the state graph, transitions to either `customalert` (if specified) or `"alert"`.
  - *Timeout check:* If `timeout` is set and elapsed time exceeds it, sets status to `SUCCESS` and exits early.
  - *Target validation:* If target is `nil`, invalid, or `keepfn(inst, target)` returns `false`, sets status to `FAILED`.
  - *Rotation:* If `"canrotate"` state tag is present, calls `inst:FacePoint(target.Transform:GetWorldPosition())`.
  - Calls `self:Sleep(0.5)` to defer next execution to the next tick (prevents busy looping).

## Events & Listeners
None.  
The component does not register or emit any events via `inst:ListenForEvent` or `inst:PushEvent`. Interaction with the game occurs solely through state graph transitions (`GoToState`), component method calls (`Stop`, `FacePoint`), and polling logic within `Visit`.