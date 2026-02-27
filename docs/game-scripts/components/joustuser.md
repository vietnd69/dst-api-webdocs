---
id: joustuser
title: Joustuser
description: Provides configurable logic and safety checks for jousting behavior by allowing custom validation, startup, and teardown callbacks, plus edge-detection via multi-angle terrain checks.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 6d35db8b
---

# Joustuser

## Overview
The `JoustUser` component manages jousting state and behavior for an entity by enabling customizable callbacks for joust eligibility (`CanJoust`), initiation (`StartJoust`), and termination (`EndJoust`), as well as performing safety checks to prevent jousting near map edges via the `CheckEdge` method. It does not manage jousting state directly but acts as a utility for coordinating external joust logic.

## Dependencies & Tags
- Requires the `Transform` and `Map` systems via `TheWorld.Map` for position and terrain queries.
- No components are added or removed by this script.
- No tags are applied or removed.
- None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | Reference to the owning entity instance. |
| `edgedistance` | `number` | `2` | Radial distance (in tiles) used to sample terrain for edge detection around the entity. |
| `canjoustfn` | `function?` | `nil` | Optional callback that validates whether a joust is allowed; returns `true` or a fail reason. |
| `onstartjoustfn` | `function?` | `nil` | Optional callback executed when a joust begins. |
| `onendjoustfn` | `function?` | `nil` | Optional callback executed when a joust ends. |

## Main Functions
### `SetCanJoustFn(fn)`
* **Description:** Sets a custom function that determines whether the joust is valid to proceed. The function receives the entity instance and may return `true` (allow joust), `false` (deny joust), or a string fail reason.
* **Parameters:**  
  `fn` (*function*) – A predicate function with signature `fn(entity) → boolean|string`.

### `CanJoust()`
* **Description:** Returns `true` if no custom validation function is set, or invokes the `canjoustfn` to check if jousting is allowed. Used to gate joust initiation.
* **Parameters:** None.

### `SetOnStartJoustFn(fn)`
* **Description:** Registers a callback function to execute when a joust starts.
* **Parameters:**  
  `fn` (*function*) – A callback with signature `fn(entity)`.

### `StartJoust()`
* **Description:** Invokes the registered `onstartjoustfn` callback if it exists, signaling the beginning of a joust action.
* **Parameters:** None.

### `SetOnEndJoustFn(fn)`
* **Description:** Registers a callback function to execute when a joust ends.
* **Parameters:**  
  `fn` (*function*) – A callback with signature `fn(entity)`.

### `EndJoust()`
* **Description:** Invokes the registered `onendjoustfn` callback if it exists, signaling the end of a joust action.
* **Parameters:** None.

### `CheckEdge()`
* **Description:** Checks for dangerous terrain edges in three angular directions (±30° around the entity's facing direction). Returns `true` only if an edge (non-ground or blocked ground) is detected at *all three* sample points — a conservative safety check to prevent jousting near cliffs or voids.
* **Parameters:** None.

### `SetEdgeDistance(distance)`
* **Description:** Updates the radial distance (in tiles) used for sampling terrain around the entity during edge checks.
* **Parameters:**  
  `distance` (*number*) – New edge-detection radius.

## Events & Listeners
None.