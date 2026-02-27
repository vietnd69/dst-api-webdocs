---
id: roseinspectable
title: Roseinspectable
description: This component provides customizable hooks and flags for managing rose-related inspection behavior, including residue creation, activation, and cooldown induction logic.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: af74711a
---

# Roseinspectable

## Overview
The `RoseInspectable` component allows entities to define custom behaviors and permissions related to rose inspection, such as when a residue is created or activated, and whether inspecting the entity should trigger a cooldown. It acts as a configuration interface for roses (e.g., items that leave behind a residue upon use) and does not manage game state directly—it relies on callbacks and flags set by consumers.

## Dependencies & Tags
None identified

## Properties
No public properties are explicitly initialized in the constructor. All mutable state is stored as optional instance fields (`self.*`) that default to `nil` and are only assigned values when explicit setter methods are called.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(passed in)* | Reference to the owner entity passed to the constructor. |
| `forcedinducedcooldown` | `boolean?` | `nil` | Optional override that forces cooldown induction on activation. |
| `willinducecooldownonactivatefn` | `function?` | `nil` | Optional callback returning a boolean that determines if a cooldown should be induced. |
| `onresidueactivatedfn` | `function?` | `nil` | Callback executed when the rose residue is activated (e.g., inspected). |
| `onresiduecreatedfn` | `function?` | `nil` | Callback executed when a residue is created for this entity. |
| `canresiduebespawnedbyfn` | `function?` | `nil` | Callback returning a boolean that determines if a given doer can spawn a residue. |

## Main Functions

### `SetOnResidueActivated(fn)`
* **Description:** Assigns a callback function to be invoked when a residue is activated (e.g., inspected) on this entity.
* **Parameters:**  
  `fn` (`function`) — A function with signature `(inst: Entity, doer: Entity) → void`.

### `SetOnResidueCreated(fn)`
* **Description:** Assigns a callback function to be invoked when a residue is created for this entity.
* **Parameters:**  
  `fn` (`function`) — A function with signature `(inst: Entity, residueowner: Entity, residue: Entity) → void`.

### `SetCanResidueBeSpawnedBy(fn)`
* **Description:** Assigns a callback that determines whether a given entity (doer) is allowed to spawn a residue on this entity.
* **Parameters:**  
  `fn` (`function`) — A function with signature `(inst: Entity, doer: Entity) → boolean`.

### `CanResidueBeSpawnedBy(doer)`
* **Description:** Returns `true` if a residue can be spawned by the given doer. If no custom callback is set, defaults to `true`.
* **Parameters:**  
  `doer` (`Entity`) — The entity attempting to spawn the residue.

### `SetForcedInduceCooldownOnActivate(bool)`
* **Description:** Overrides the cooldown-induction behavior: if `true`, will always induce a cooldown on activation; if `false`, will never induce one (unless overridden by a callback).
* **Parameters:**  
  `bool` (`boolean`) — Whether to force cooldown induction.

### `SetWillInduceCooldownOnActivate(fn)`
* **Description:** Assigns a callback to dynamically determine whether a cooldown should be induced on activation.
* **Parameters:**  
  `fn` (`function`) — A function with signature `(inst: Entity, doer: Entity) → boolean`.

### `WillInduceCooldownOnActivate(doer)`
* **Description:** Determines whether a cooldown should be induced on activation. Checks `forcedinducedcooldown` first; if `nil`, falls back to `willinducecooldownonactivatefn`; otherwise returns `false`.
* **Parameters:**  
  `doer` (`Entity`) — The entity performing the activation.

### `HookupResidue(residueowner, residue)`
* **Description:** Triggers the `onresiduecreatedfn` callback (if set) to notify that a residue was created.
* **Parameters:**  
  `residueowner` (`Entity`) — The entity that owns the residue (typically the same as `self.inst`).  
  `residue` (`Entity`) — The residue entity that was spawned.

### `DoRoseInspection(doer)`
* **Description:** Triggers the `onresidueactivatedfn` callback (if set) to signal that the residue has been activated/inspected by a doer.
* **Parameters:**  
  `doer` (`Entity`) — The entity performing the inspection/activation.

## Events & Listeners
None — this component does not register or dispatch any events internally.