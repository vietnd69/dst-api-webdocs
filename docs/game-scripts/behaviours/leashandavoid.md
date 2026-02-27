---
id: leashandavoid
title: Leashandavoid
description: A behaviour node that moves an entity toward a home location while avoiding an optional target object, ceasing movement if the entity is within the leash radius or succeeding when the return distance is reached.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: 7d8f022b
---

# Leashandavoid

## Overview
The `Leashandavoid` component is a behaviour node (inheriting from `BehaviourNode`) used in the AI decision-making system. It controls entity movement by navigating toward a specified home position while optionally avoiding a detected target object, and enforces a *leash* distance boundary. If the entity strays outside the leash distance, it attempts to return; if it gets too far beyond a stricter *return* distance, it actively moves toward home using the locomotor. Once it re-enters the return radius, the behaviour succeeds.

This behaviour is primarily used for AI entities that must patrol, tether, or retreat within a bounded area (e.g., domesticated creatures, stationary guardians), and integrates with the `Locomotor` component for movement control.

## Dependencies & Tags
- **Components used:**  
  - `inst.components.locomotor` — Accessed to call `GoToPoint` and `Stop`.
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `homepos` | `vector3 | function` | — | Target position (either a `vector3` or a function returning one) representing the home location. |
| `maxdist` | `number | function` | — | Maximum leash radius (distance from home); can be dynamic (via function). |
| `inst` | `Entity` | — | Reference to the owning entity instance. |
| `returndist` | `number | function` | — | Strict return radius; entity actively moves home only when outside this distance. |
| `running` | `boolean | function` | `false` | Controls whether the entity runs (`true`) or walks (`false`) when moving home; supports functions for dynamic behavior. |
| `findavoidanceobjectfn` | `function?` | `nil` | Optional callback that returns an `Entity` to avoid during movement. |
| `avoid_dist` | `number?` | `0` | Minimum lateral distance to maintain from the avoidance target. |
| `avoidtarget` | `Entity?` | `nil` | Cached avoidance target set during `Visit()`; only valid for the current run. |

## Main Functions
### `LeashAndAvoid:Visit()`
* **Description:** The core execution method of the behaviour. Evaluates the entity's position relative to the home location and leash/return boundaries. If outside the return distance, it calculates a destination toward home (with optional avoidance offset) and commands `Locomotor.GoToPoint`; otherwise, it succeeds. If already inside the leash radius, it fails immediately.  
* **Parameters:** None.  
* **Returns:** `nil` — Status is stored internally (`FAILED`, `RUNNING`, or `SUCCESS`).

### `LeashAndAvoid:GetHomePos()`
* **Description:** Resolves and returns the current home position, evaluating if `homepos` is a function.  
* **Parameters:** None.  
* **Returns:** `vector3?` — The home position, or `nil` if unresolved.

### `LeashAndAvoid:GetDistFromHomeSq()`
* **Description:** Computes the squared distance from the entity to the home position.  
* **Parameters:** None.  
* **Returns:** `number?` — Squared distance, or `nil` if home position is unavailable.

### `LeashAndAvoid:IsInsideLeash()`
* **Description:** Checks whether the entity is currently inside the leash radius.  
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if the squared distance to home is less than the squared leash radius.

### `LeashAndAvoid:IsOutsideReturnDist()`
* **Description:** Checks whether the entity is farther from home than the return distance.  
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if the entity should actively move home.

### `LeashAndAvoid:GetMaxDistSq()`
* **Description:** Returns the squared leash radius (used to determine if the entity is too far and should *not* flee).  
* **Parameters:** None.  
* **Returns:** `number` — `maxdist^2`.

### `LeashAndAvoid:GetReturnDistSq()`
* **Description:** Returns the squared return distance (used to trigger active homing).  
* **Parameters:** None.  
* **Returns:** `number` — `returndist^2`.

## Events & Listeners
None — This behaviour interacts solely via direct component calls (`Locomotor`) and internal state transitions.