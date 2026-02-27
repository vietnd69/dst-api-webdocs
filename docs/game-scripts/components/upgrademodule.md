---
id: upgrademodule
title: Upgrademodule
description: Manages the state and lifecycle of an upgrade module that can be attached to an entity, including activation, deactivation, and cleanup logic via callback functions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 8ecfc643
---

# Upgrademodule

## Overview
This component encapsulates the core logic for an upgrade module that can be attached to an entity (typically via an `upgrademoduleowner`). It tracks whether the module is activated, manages the number of slots it occupies, holds a reference to a target entity, and executes optional callback functions when activated, deactivated, or removed from its owner.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (injected via constructor) | Reference to the entity the component is attached to. |
| `slots` | `number` | `1` | Number of upgrade slots this module occupies; configurable via `SetRequiredSlots`. |
| `activated` | `boolean` | `false` | Whether the module is currently active. |
| `target` | `Entity?` | `nil` | Optional reference to a target entity; set via `SetTarget`. |
| `onactivatedfn` | `function?` | `nil` | Optional callback executed when the module is activated. |
| `ondeactivatedfn` | `function?` | `nil` | Optional callback executed when the module is deactivated. |
| `onremovedfromownerfn` | `function?` | `nil` | Optional callback executed when the module is removed from its owner. |

> **Note:** The `onactivatedfn`, `ondeactivatedfn`, and `onremovedfromownerfn` fields are commented out in the constructor but are still used in the class methods, implying they are expected to be assigned externally (e.g., by the `upgrademoduleowner` component or in user code).

## Main Functions

### `SetRequiredSlots(slots)`
* **Description:** Sets the number of upgrade slots required by this module.
* **Parameters:**  
  `slots` (`number`) — The number of slots to assign.

### `SetTarget(target)`
* **Description:** Sets the target entity for this module (e.g., the entity being upgraded or affected).
* **Parameters:**  
  `target` (`Entity?`) — The target entity; may be `nil`.

### `TryActivate(isloading)`
* **Description:** Activates the module if it is not already active. Executes the `onactivatedfn` callback (if set) with the module instance, target, and loading state.
* **Parameters:**  
  `isloading` (`boolean`) — Indicates whether activation is happening during world/entity loading (e.g., from save data).

### `TryDeactivate()`
* **Description:** Deactivates the module if currently active. Executes the `ondeactivatedfn` callback (if set) with the module instance and target.
* **Parameters:** None.

### `RemoveFromOwner()`
* **Description:** Handles cleanup when the module is removed from its owner. Clears the target and executes the `onremovedfromownerfn` callback (if set) with the module instance.
* **Parameters:** None.

## Events & Listeners
None.