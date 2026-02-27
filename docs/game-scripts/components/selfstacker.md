---
id: selfstacker
title: Selfstacker
description: Enables an item to automatically find and merge with compatible同类 items within range, handling stacking logic based on state, tags, and velocity.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 8eb1f79c
---

# Selfstacker

## Overview
The `SelfStacker` component implements autonomous stacking behavior for items: it periodically checks for nearby compatible items (same prefab, skin, and stackability), establishes a mutual pairing, and merges stacks when conditions permit. It is designed for items that should self-organize in the world—such as food or tools—without player intervention.

## Dependencies & Tags
- **Adds Tag:** `"selfstacker"` on instantiation and removes it in `OnRemoveEntity`.
- **Requires Components:** `stackable`, `inventoryitem`, `Physics`.  
- **Conditionally Depends On:**  
  - `burnable`: Used in `CanSelfStack()` to prevent stacking while burning.  
  - `bait`: Used in `CanSelfStack()` to ensure not attached (i.e., `IsFree()` must be true).  
- **No direct `AddComponent()` calls**—assumes callers have already added required components.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to. |
| `searchradius` | `number` | `20` | Radius (in world units) within which to search for stack partners. |
| `stackpartner` | `Entity?` | `nil` | Currently paired entity for stacking; `nil` if none or pairing broken. |
| `ignoremovingfast` | `boolean?` | `nil` | If `true`, disables velocity check (allows stacking while moving). |
| `isvalidpartnerfn` | `function` | — | Predicate function to validate potential stack partners (same prefab, skin, and valid state). |
| `stacktask` | `Task?` | `nil` | Pending delayed task that executes `DoStack()`; cancels on entity wake/destroy. |

## Main Functions

### `SetIgnoreMovingFast(ignorespeedcheck)`
* **Description:** Enables or disables the velocity check during `CanSelfStack()`.  
* **Parameters:**  
  - `ignorespeedcheck` (`boolean`): If `true`, allows stacking regardless of entity movement speed.

### `CanSelfStack()`
* **Description:** Determines whether the entity *currently* meets all conditions to participate in stacking.  
* **Returns:** `boolean` — `true` if the entity is stable and eligible to initiate stacking.  
* **Conditions Checked:**  
  - Not attached to bait (`bait == nil` or `IsFree()` is true).  
  - Not burning (`burnable == nil` or `IsBurning()` is false).  
  - Has a non-full `stackable` component.  
  - Not held in inventory (`inventoryitem:IsHeld()` is false).  
  - Stationary or `ignoremovingfast` is true (`Physics:GetVelocity():LengthSq() < 1`).  
  - No existing `stackpartner`.

### `OnRemoveEntity()`
* **Description:** Cleanup method called when the entity is removed from the world. Cancels pending stacking tasks and removes the `"selfstacker"` tag.

### `FindItemToStackWith()`
* **Description:** Searches for a valid partner within `searchradius` that satisfies `isvalidpartnerfn`. If found, sets mutual `stackpartner` references.  
* **Returns:** `Entity?` — The found stack partner, or `nil`.  
* **Search Logic:** Uses `FindEntity()` with:  
  - `must_tags = {"selfstacker"}`  
  - `cant_tags = {"outofreach"}`.

### `DoStack()`
* **Description:** Merges the current entity’s stack with its `stackpartner`. Attempts to transfer as many items as the current entity’s stack can accept (`RoomLeft()`).  
* **Behavior:**  
  - Cancels any pending `stacktask`.  
  - Calls `FindItemToStackWith()` to refresh the partner.  
  - If a partner exists:  
    - Requests `stackpartner.components.stackable:Get(num)` items.  
    - Puts them into `self.inst.components.stackable`.

### `OnEntityWake()`
* **Description:** Triggered when the entity becomes active (e.g., due to world re-entry or physics update). Resets `stackpartner`, and if stackable, schedules a delayed `DoStack()` call (0–0.1 seconds) with jitter.  
* **Behavior:**  
  - Clears `stackpartner`.  
  - Evaluates `CanSelfStack()`.  
  - If true, cancels any existing `stacktask` and schedules a new one.

## Events & Listeners
- Listens for:  
  - `"wake"` → calls `OnEntityWake()`  
  - `"onremove"` → calls `OnRemoveEntity()`  
- Does *not* push any custom events.