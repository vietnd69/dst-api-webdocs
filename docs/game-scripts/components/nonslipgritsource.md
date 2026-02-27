---
id: nonslipgritsource
title: Nonslipgritsource
description: Provides a source of non-slip grit that can be attached to entities to counteract slippery feet mechanics.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 0a50c550
---

# Nonslipgritsource

## Overview
This component acts as an inventory item source for non-slip grit, enabling it to be attached to entities with the `slipperyfeet` component. When attached, it automatically grants non-slip grit functionality via the `nonslipgrituser` component, and provides hooks for delta-time updates.

## Dependencies & Tags
- Uses `MakeComponentAnInventoryItemSource(self)` during construction.
- Relies on the presence of the `nonslipgrituser` component on the owner entity (creates it on-demand if missing).
- Requires the `slipperyfeet` component on the owner to trigger activation.
- Relies on the `inventoryitem` component for standard inventory item behavior (via `MakeComponentAnInventoryItemSource`).
- Removes its inventory source behavior via `RemoveComponentInventoryItemSource` when removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the owning entity (assigned in constructor). |
| `ondeltafn` | `function` | `nil` | Optional callback function used for per-frame (delta-time) processing; set via `SetOnDeltaFn`. |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Cleans up when the component is removed from its entity. Removes the associated inventory item source behavior.
* **Parameters:** None.

### `OnItemSourceRemoved(owner)`
* **Description:** Called when this source is removed from an owner. Notifies the owner's `nonslipgrituser` component (if present) to remove this source.
* **Parameters:**
  * `owner` (`Entity`): The entity from which this source is being removed.

### `OnItemSourceNewOwner(owner)`
* **Description:** Called when this source is attached to a new owner. If the owner has the `slipperyfeet` component, ensures the owner has the `nonslipgrituser` component and registers this source with it.
* **Parameters:**
  * `owner` (`Entity`): The new owner entity.

### `SetOnDeltaFn(fn)`
* **Description:** Sets a callback function to be invoked during delta-time updates (`DoDelta`). This allows external code to register periodic behavior (e.g., grit consumption or decay).
* **Parameters:**
  * `fn` (`function`): Function of the form `function(inst, dt)` where `inst` is this component's entity and `dt` is the time elapsed since the last frame.

### `DoDelta(dt)`
* **Description:** Executes the registered delta callback (if any) with the current delta time. Used for time-based logic such as grit depletion or refresh.
* **Parameters:**
  * `dt` (`number`): Delta time in seconds.

## Events & Listeners
None.