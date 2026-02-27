---
id: shadow_leechbrain
title: Shadow Leechbrain
description: Implements AI behavior for the Shadow Leech entity, coordinating jumping attacks, leash-based movement toward the Daywalker, facing the target, and wandering when no target is present.
tags: [ai, combat, boss, entity, controller]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 7a24c8c3
---

# Shadow Leechbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `Shadow_LeechBrain` component defines the behavior tree for the Shadow Leech entity in Don't Starve Together. It enables the leech to pursue and launch physical attacks against the `daywalker` entity when within range, while falling back to leash-following, orientation toward the target, and eventually wandering when no valid target is present. This component depends on the `EntityTracker` component to locate the target and integrates several custom behaviors (`Leash`, `FaceEntity`, `Wander`) to orchestrate movement and combat logic.

## Usage example
Typically, this brain is assigned to a Shadow Leech entity during its construction, and no additional manual setup is required:

```lua
inst:AddBrain("shadow_leechbrain")
```

The component initializes automatically when added, registering the behavior tree root node. It responds to the `"jump"` event internally and emits `"incoming_jump"` to the target upon launch.

## Dependencies & tags
**Components used:**
- `entitytracker`: Used via `inst.components.entitytracker:GetEntity("daywalker")` to retrieve the target entity.

**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GameObject` | N/A | Reference to the entity instance this brain controls. |
| `bt` | `BehaviorTree` | `nil` | Initialized in `OnStart()`; holds the active behavior tree instance. |

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the root behavior tree node for the Shadow Leech. Constructs a priority-based behavior tree that evaluates whether to jump, leash to the target, face it, or wander.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** If the `entitytracker` component is missing or does not contain a `"daywalker"` entry, `GetTarget()` returns `nil`, causing `Leash`, `FaceEntity`, and `Jump` actions to effectively no-op or fall through to `Wander`.

### `GetTarget(inst)`
* **Description:** Retrieves the target entity named `"daywalker"` from the `entitytracker` component.
* **Parameters:**
  - `inst`: The entity instance (typically `self.inst` in the brain).
* **Returns:** `GameObject?` — The target entity if present and valid; otherwise `nil`.

### `GetTargetPos(inst)`
* **Description:** Returns the world position of the `"daywalker"` target, or `nil` if the target is absent.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `Vector3?` — World position of the target or `nil`.

### `KeepTarget(inst, target)`
* **Description:** Guard function that returns `true` if the target entity is still valid.
* **Parameters:**
  - `inst`: The entity instance.
  - `target`: The candidate target entity.
* **Returns:** `boolean` — `true` if `target:IsValid()` holds.

### `ShouldJump(inst)`
* **Description:** Determines whether the Shadow Leech is close enough to the target to initiate a jump.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `boolean` — `true` if the distance to the target is `<= JUMP_DIST` (6 units), otherwise `false`.

## Events & listeners
- **Listens to:** None.
- **Pushes:**
  - `"jump"`: Fired when the leech initiates a jump toward the target (only if target is valid).
  - `"incoming_jump"`: Fired on the target entity when the leech is about to jump onto it.

Note: This brain itself does not register event listeners. Event emission occurs within the behavior tree's action node during jump execution.