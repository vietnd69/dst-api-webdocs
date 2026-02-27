---
id: follow
title: Follow
description: A behaviour node that enables an entity to follow a target entity within configurable distance ranges, adjusting movement based on proximity, platform constraints, and run/walk settings.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: 60ba9131
---

# Follow

## Overview
The `Follow` component is a behaviour node used in the DST decision-making system to make an entity move toward (or away from) a specified target while maintaining a target distance range. It integrates with the `Locomotor` component for movement control and checks the `Health` component of the target to avoid following dead entities. The component dynamically evaluates distances using either fixed values or callable functions, supports platform-hopping behavior, and allows configuration of run/walk modes and evaluation frequency.

It is typically used in AI state graphs and behaviour trees to implement following, retreating, or pacing mechanics for characters and creatures.

## Dependencies & Tags
- **Components used:**  
  - `components.locomotor` – for movement commands (`GoToPoint`, `RunInDirection`, `WalkInDirection`, `Stop`)  
  - `components.health` – checked for `IsDead()` status to terminate following dead targets  
- **Tags:** None explicitly added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance that owns this component and performs the following behavior. |
| `target` | `Entity` or `function` | `nil` | The target entity to follow, or a function returning an entity. |
| `min_dist` | `number` or `nil` | `nil` | Minimum acceptable distance (in units). If closer, entity backs off. If a function, evaluated dynamically. |
| `max_dist` | `number` or `nil` | `nil` | Maximum acceptable distance (in units). If farther, entity approaches. If a function, evaluated dynamically. |
| `target_dist` | `number` or `nil` | `nil` | Desired distance to maintain. If reached, movement stops. If a function, evaluated dynamically. |
| `min_dist_fn` | `function` or `nil` | `nil` | Optional function returning `min_dist` (called during distance evaluation). |
| `max_dist_fn` | `function` or `nil` | `nil` | Optional function returning `max_dist` (called during distance evaluation). |
| `target_dist_fn` | `function` or `nil` | `nil` | Optional function returning `target_dist` (called during distance evaluation). |
| `canrun` | `boolean` | `true` | If `true`, allows running (`GoToPoint(..., true)`, `RunInDirection`). Otherwise uses walking. |
| `alwayseval` | `boolean` | `true` | If `true`, re-evaluates distances on every `Visit()` call. If `false`, only re-evaluated when target changes. |
| `inlimbo_invalid` | `boolean` or `nil` | `nil` | If `true`, following stops if the target enters limbo. |
| `currenttarget` | `Entity` or `nil` | `nil` | Cached current target entity (updated on initial evaluation). |
| `action` | `string` | `"STAND"` | Current movement action: `"APPROACH"`, `"BACKOFF"`, or `"STAND"`. |

## Main Functions

### `GetTarget()`
* **Description:** Resolves and validates the target entity. If `self.target` is a function, it is invoked; otherwise, `self.target` is used directly. Returns `nil` if the target is invalid, dead, or unreachable.
* **Parameters:** None.
* **Returns:** `Entity` or `nil` – The valid target entity or `nil`.

### `EvaluateDistances()`
* **Description:** Dynamically computes `min_dist`, `max_dist`, and `target_dist` if their corresponding `_fn` functions are set. Called when the target changes or when `alwayseval` is `true`.
* **Parameters:** None.
* **Returns:** `nil`.

### `DBString()`
* **Description:** Returns a debug-friendly string describing the current follow state, including target name (if valid), current action, and actual distance to target.
* **Parameters:** None.
* **Returns:** `string` – e.g., `"pine_tree APPROACH, (5.23) "`.

### `AreDifferentPlatforms(inst, target)`
* **Description:** Determines whether the entity and target are on different platforms (e.g., ground vs. floating islands). Returns `true` only if platform hopping is disabled and platforms differ.
* **Parameters:**  
  - `inst` (`Entity`) – The entity instance.  
  - `target` (`Entity`) – The target entity.  
* **Returns:** `boolean` – `true` if the two entities are on different platforms *and* platform hopping is not allowed.

### `Visit()`
* **Description:** Core logic of the behaviour node. Implements the follow state machine (ready → running → success/fail). It evaluates target validity, computes distances, selects movement action (`APPROACH`/`BACKOFF`), and delegates to `Locomotor`.
* **Parameters:** None.
* **Returns:** `nil` (sets internal `status` and triggers locomotion commands).

## Events & Listeners
None. This component does not register or dispatch events.