---
id: tackler
title: Tackler
description: This component enables an entity to detect and interact with nearby targets—such as workable objects, structures, or creatures—by performing targeted attacks or trampling actions based on configurable collision properties and callbacks.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 8d34726b
---

# Tackler

## Overview
The `Tackler` component allows an entity to detect and interact with targets in a directional cone ahead of itself. It performs collision detection within a specified radius and distance, prioritizing workable objects and combat targets, and supports custom behavior hooks for collisions and trampling. It is typically used for AI-controlled entities (e.g., hounds) to perform structured, targeted attacks or mining interactions.

## Dependencies & Tags
- Requires the following components to be present on the owning entity: `combat`, `health`, `transform`.
- Relies on `workable` component on target entities.
- Adds `"_combat"` to `collide_tags`.
- Dynamically adds `"{action.id}_workable"` tags for each added work action.
- Uses the following `no_collide_tags`: `"NPC_workable"`, `"DIG_workable"`, `"FX"`, `"NOCLICK"`, `"DECOR"`, `"INLIMBO"`, and `"player"` when PVP is disabled.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `distance` | number | `0.5` | Forward offset (in world units) from the entity’s center where collision checks begin. |
| `radius` | number | `0.75` | Radius of the detection cone/area around the forward point. |
| `structure_damage_mult` | number | `2` | Damage multiplier applied specifically to structures during attacks. |
| `work_actions` | table | `{}` | Mapping of work action IDs to required work amounts (defaults to `1` if amount not specified). |
| `collide_tags` | table | `{"_combat"}` | Tags that entities must have to be considered for collision. |
| `no_collide_tags` | table | `{"NPC_workable", "DIG_workable", "FX", "NOCLICK", "DECOR", "INLIMBO", "player" (if PVP off)}` | Tags that exclude entities from collision checks. |
| `edgedistance` | number | `5` | Distance used for edge-detection checks (to avoid walking off cliffs). |
| `onstarttacklefn` | function or nil | `nil` | Callback invoked when `StartTackle()` is called; must return a boolean. |
| `oncollidefn` | function or nil | `nil` | Callback invoked when a primary collision occurs (before attack/work). |
| `ontramplefn` | function or nil | `nil` | Callback invoked when a trampling attack is performed on a valid creature. |

## Main Functions
### `SetOnStartTackleFn(fn)`
* **Description:** Sets the callback function executed when `StartTackle()` is invoked. Typically used to determine if the entity is allowed to initiate the tackle (e.g., based on readiness or animation state).
* **Parameters:**  
  `fn` (function or nil) — A function taking the entity instance as argument; must return a boolean indicating success.

### `StartTackle()`
* **Description:** Invokes the `onstarttacklefn` callback and returns its result. Used to gate the initiation of the tackle behavior.
* **Parameters:** None.

### `SetDistance(distance)`
* **Description:** Updates the forward offset distance for collision detection.
* **Parameters:**  
  `distance` (number) — New distance value.

### `SetRadius(radius)`
* **Description:** Updates the radial detection width for collision checks.
* **Parameters:**  
  `radius` (number) — New radius value.

### `SetStructureDamageMultiplier(mult)`
* **Description:** Sets the damage multiplier applied to structures during attacks.
* **Parameters:**  
  `mult` (number) — Multiplier to use (e.g., `2` for double damage to structures).

### `AddWorkAction(action, amount)`
* **Description:** Registers a work action type (e.g., "chop", "mine") and its required work amount for a workable target. Automatically updates `collide_tags` to include the action-specific tag.
* **Parameters:**  
  `action` (table) — A workable action object expected to have an `id` field.  
  `amount` (number or nil) — Work amount to assign; defaults to `1` if omitted.

### `SetOnCollideFn(fn)`
* **Description:** Sets the callback function invoked *after* collision is detected but *before* performing work or attack.
* **Parameters:**  
  `fn` (function or nil) — A function with signature `(entity_inst, target_inst)`.

### `SetOnTrampleFn(fn)`
* **Description:** Sets the callback function invoked *before* a trampling attack against a small creature.
* **Parameters:**  
  `fn` (function or nil) — A function with signature `(entity_inst, target_inst)`.

### `CheckCollision(ignores)`
* **Description:** Performs directional collision detection in front of the entity. Identifies the closest valid target: workable objects first, then structures or creatures. Executes work on workables, or attacks (with structure damage multiplier for structures) on valid combat targets. Also processes trampling on smaller creatures if closer than the primary target.
* **Parameters:**  
  `ignores` (table or nil) — Optional table used to mark ignored targets (in-place mutation).

### `SetEdgeDistance(distance)`
* **Description:** Updates the distance used for edge-detection to prevent walking off cliffs.
* **Parameters:**  
  `distance` (number) — New edge-detection distance.

### `CheckEdge()`
* **Description:** Checks whether the entity is at risk of walking off an edge. Requires a valid ground condition at three angles (±30° relative to current facing); returns `true` only if *all three* directions indicate a potential drop.
* **Parameters:** None.

## Events & Listeners
None.