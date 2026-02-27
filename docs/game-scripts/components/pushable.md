---
id: pushable
title: Pushable
description: Enables an entity to be pushed by another entity, managing motion, state transitions, and event notifications during push interactions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: f111f77c
---

# Pushable

## Overview
The `Pushable` component allows an entity to be moved (pushed) by another entity, such as a player. It controls the pushed entity's physics velocity, enforces distance constraints between the pusher and the pushed object, and emits events to coordinate animations, logic, and synchronization during pushing interactions.

## Dependencies & Tags
- **Component Dependency**: `Physics` component (used via `self.inst.Physics:SetMotorVel`, `self.inst:StartUpdatingComponent`, etc.)
- **Tags Added/Removed**: None explicitly added or removed by this component.
- **Event Dependencies**: Relies on `doer` having a valid `sg` (state graph) and `IsValid()` check.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to. |
| `speed` | `number` | `3` | Base forward speed during pushing. |
| `doer` | `Entity?` | `nil` | Reference to the entity currently pushing this object (`nil` when not being pushed). |
| `targetdist` | `number?` | `nil` | Optional desired distance behind the pusher; used for speed compensation. |
| `mindist` | `number?` | `nil` | Minimum allowed separation distance; used to halt forward motion if too close. |
| `maxdist` | `number?` | `nil` | Maximum allowed separation distance; pushing ends if exceeded. |
| `onstartpushingfn` | `function?` | `nil` | Optional callback invoked when pushing begins: `fn(entity, pusher)`. |
| `onstoppushingfn` | `function?` | `nil` | Optional callback invoked when pushing ends: `fn(entity, pusher)`. |

## Main Functions

### `SetTargetDist(dist)`
* **Description:** Sets the desired distance the pushed entity maintains behind the pusher. Adjusts pushing speed dynamically to maintain this distance.
* **Parameters:**  
  `dist` (`number`) – Target separation distance in units.

### `SetMinDist(dist)`
* **Description:** Configures the minimum separation threshold. When the pusher gets this close or closer, forward motion stops to prevent overlap or collision.
* **Parameters:**  
  `dist` (`number`) – Minimum allowed distance in units.

### `SetMaxDist(dist)`
* **Description:** Sets the maximum separation distance. Pushing ends automatically if the distance between entities exceeds this value.
* **Parameters:**  
  `dist` (`number`) – Maximum allowed distance in units.

### `SetPushingSpeed(speed)`
* **Description:** Overrides the base pushing speed used during movement.
* **Parameters:**  
  `speed` (`number`) – New constant speed value (e.g., `3` for default walk speed).

### `SetOnStartPushingFn(fn)`
* **Description:** Assigns a callback to run when pushing begins.
* **Parameters:**  
  `fn` (`function?`) – Function signature: `function(entity, pusher)`.

### `SetOnStopPushingFn(fn)`
* **Description:** Assigns a callback to run when pushing ends.
* **Parameters:**  
  `fn` (`function?`) – Function signature: `function(entity, pusher)`.

### `IsPushing()`
* **Description:** Returns whether this entity is currently being pushed.
* **Returns:** `boolean` – `true` if being pushed by a valid doer.

### `GetPushingSpeed()`
* **Description:** Returns the currently configured base pushing speed.
* **Returns:** `number` – Speed value.

### `ShouldStopForwardMotion()`
* **Description:** Checks if forward motion should be halted because the pusher is too close (within `mindist`). Only meaningful if `mindist` is set and a valid pusher exists.
* **Returns:** `boolean` – `true` if forward motion should stop.

### `StartPushing(doer)`
* **Description:** Initiates pushing behavior on this entity. Sets up the pusher reference, starts physics updates, fires callbacks, and emits a `"startpushing"` event.
* **Parameters:**  
  `doer` (`Entity`) – The entity initiating the push (must be valid and have a state graph).

### `StopPushing(doer)`
* **Description:** Halts pushing behavior. Stops physics, fires optional callbacks, emits `"stoppushing"` event, and clears the pusher reference. Accepts optional `doer` parameter for verification; if `nil`, stops regardless of the current doer.
* **Parameters:**  
  `doer` (`Entity?`) – Optional expected pusher entity for confirmation.

### `OnUpdate(dt)`
* **Description:** Called every frame while pushing. Maintains motion using `SetMotorVel`, adjusts speed based on `targetdist`, and stops pushing if constraints (`maxdist`, invalid doer, missing state tags) are violated.
* **Parameters:**  
  `dt` (`number`) – Delta time in seconds.

## Events & Listeners
- **Emits:**
  - `"startpushing"` – Pushing begins. Event payload: `{ doer = pusher_entity }`.
  - `"stoppushing"` – Pushing ends. Event payload: `{ doer = pusher_entity }`.
- **Listens For:**
  - None (this component does not actively listen for external events).