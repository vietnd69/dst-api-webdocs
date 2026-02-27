---
id: leash
title: Leash
description: A behaviour node that moves an entity toward a fixed home position if it exceeds a maximum leash distance, and stops movement when it returns within the return radius.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: 36fb1960
---

# Leash

## Overview
The `Leash` component implements a behaviour node used in AI decision trees to enforce positional constraints on an entity. It ensures the entity moves back toward a specified home location if it ventures outside a defined "leash" radius (`max_dist`). Once the entity moves within a tighter "return" radius (`inner_return_dist`), movement ceases and the behaviour completes successfully. This is commonly used for creatures that must stay within a zone (e.g., tethered animals, boss arena constraints), and integrates with the `Locomotor` component to control motion.

## Dependencies & Tags
- **Components used:** `inst.components.locomotor` (calls `GoToPoint` and `Stop`)
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `homepos` | `Vector3` or `function` | — | Target position (or a function returning it) the entity must return to. |
| `maxdist` | `number` or `function` | — | Maximum leash radius; if distance from home exceeds this, the entity must move back. |
| `inst` | `GObject` | — | The entity instance the behaviour is attached to. |
| `returndist` | `number` or `function` | — | Radius within which movement stops and behaviour succeeds (`inner_return_dist`). |
| `running` | `boolean` or `function` | `false` | Determines if the entity sprints (`true`) or walks (`false`) when moving toward home. |

## Main Functions
### `Leash:Visit()`
* **Description:** Main behaviour logic executed each frame while the node is active. Evaluates state transitions based on current distance to home: transitions from `READY` to `RUNNING` if outside leash, moves entity via `Locomotor` if still outside return distance, and succeeds when within return radius.
* **Parameters:** None (method).
* **Returns:** `nil` (modifies `self.status` in-place: `READY` → `RUNNING` → `SUCCESS` or `FAILED`).

### `Leash:GetHomePos()`
* **Description:** Resolves and returns the actual home position, supporting both direct vectors and lazily-evaluated functions.
* **Parameters:** None.
* **Returns:** `Vector3?` — The resolved home position, or `nil` if unavailable.

### `Leash:GetDistFromHomeSq()`
* **Description:** Computes the squared distance from the entity to home, avoiding expensive square root operations.
* **Parameters:** None.
* **Returns:** `number?` — Squared Euclidean distance, or `nil` if home position is unavailable.

### `Leash:IsInsideLeash()`
* **Description:** Checks if the entity is currently within the leash radius.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if distance² < maxDist² (i.e., inside leash), otherwise `false`.

### `Leash:IsOutsideReturnDist()`
* **Description:** Checks if the entity has moved far enough from home to require resuming movement.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if distance² > returnDist² (i.e., outside return radius), otherwise `false`.

### `Leash:GetMaxDistSq()`
* **Description:** Returns the squared maximum leash distance.
* **Parameters:** None.
* **Returns:** `number` — `maxdist²`, where `maxdist` may be a number or function.

### `Leash:GetReturnDistSq()`
* **Description:** Returns the squared return radius distance.
* **Parameters:** None.
* **Returns:** `number` — `returndist²`, where `returndist` may be a number or function.

### `Leash:DBString()`
* **Description:** Returns a formatted debug string (e.g., `"Vector3(10, 0, 20), 5.32"`) for logging or debugging.
* **Parameters:** None.
* **Returns:** `string` — Debug-friendly representation of home position and current distance.

## Events & Listeners
None.