---
id: approach
title: Approach
description: A behaviour node that moves an entity toward a target entity until it reaches a specified distance threshold.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: d20b827b
---

# Approach

## Overview
The `Approach` component is a behaviour node used within DST's behaviour tree system to programmatically move an entity toward a target entity. It calculates the distance to the target and controls locomotion via the `locomotor` component, optionally allowing running or platform-hopping based on state and configuration. It is typically used for AI pathfinding in scenarios such as chasing enemies, following allies, or navigating terrain with platform constraints. The component integrates with the `health` component to gracefully abort movement if the target dies during navigation.

## Dependencies & Tags
- **Components used:**  
  - `locomotor`: Used for movement (`GoToPoint`, `Stop`) and platform-hopping logic (`allow_platform_hopping` property).  
  - `health`: Checked for `IsDead()` state to determine if the target is still valid.  
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance that owns this behaviour component. |
| `target` | `Entity` or `function` | — | The target entity, or a function returning a target entity (resolved via `FunctionOrValue`). |
| `dist` | `number` or `nil` | `nil` | Static squared distance threshold (converted from `dist^2`). If `dist` is provided as a function, `self.dist_fn` stores it instead. |
| `dist_fn` | `function` or `nil` | `nil` | A callable function that returns the dynamic distance threshold. Called in `EvaluateDistances()`. |
| `canrun` | `boolean` | `true` | Whether the entity is allowed to run (high-speed movement) when approaching. |
| `currenttarget` | `Entity` or `nil` | `nil` | Cache of the currently active target, resolved during the `READY` phase. |

## Main Functions
### `GetTarget()`
* **Description:** Resolves and validates the stored `target`. If `target` is a function, it is invoked with `self.inst` as an argument. Returns the target entity only if valid and non-nil; otherwise returns `nil`.
* **Parameters:** None.
* **Returns:** `Entity?` — The validated target entity, or `nil` if no valid target exists.

### `EvaluateDistances()`
* **Description:** Recomputes the `dist` threshold if `dist_fn` is set. This is called when the target changes (to ensure fresh distance criteria) during the `Visit()` logic.
* **Parameters:** None.
* **Returns:** `nil` — Updates `self.dist` in-place.

### `DBString()`
* **Description:** Provides a debug-friendly string representation of the current state, including the resolved target and the Euclidean distance to it.
* **Parameters:** None.
* **Returns:** `string` — Formatted string like `"Entity(123), (5.42) "`.

### `AreDifferentPlatforms(inst, target)`
* **Description:** Checks if `inst` and `target` occupy different terrain platforms (e.g., ground vs. floating island). Respects the `allow_platform_hopping` setting in the `locomotor` component.
* **Parameters:**  
  - `inst` (`Entity`) — The moving entity.  
  - `target` (`Entity`) — The target entity.  
* **Returns:** `boolean` — `true` if platforms differ *and* platform-hopping is disabled; otherwise `false`.

### `Visit()`
* **Description:** Core state machine logic for the behaviour node. Handles transition from `READY` to `RUNNING` (initiating movement) or `SUCCESS` (distance threshold met), and updates movement based on target validity, distance, and platform state. Re-evaluates every ~0.25 seconds via `Sleep()`.
* **Parameters:** None.
* **Returns:** `nil` — Modifies `self.status` and calls `locomotor` methods.

## Events & Listeners
None. The `Approach` component does not register or fire events directly; it interacts via direct method calls and state tracking.