---
id: moistureabsorbersource
title: Moistureabsorbersource
description: A component that allows an entity to serve as a moisture-absorbing source for entities with moisture, integrating with the moistureabsorberuser component to apply drying effects.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: 4ffead68
---

# Moistureabsorbersource

## Overview
This component enables an entity to act as a moisture-absorbing source in the game world. It integrates with the `moistureabsorberuser` component on owner entities (e.g., characters or structures) to provide drying functionality. When attached to an entity and placed in an inventory or equipped, it automatically registers itself with nearby moisture users and provides drying rate and application logic via optional custom callbacks.

## Dependencies & Tags
- `inst:AddComponent("moistureabsorberuser")` — conditionally added to owner entities during ownership changes.
- `MakeComponentAnInventoryItemSource(self)` — called in constructor to enable inventory item source behavior.
- `RemoveComponentInventoryItemSource(self)` — called on removal to clean up inventory source state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(none)* | Reference to the entity this component is attached to. |
| `getdryingratefn` | `function (optional)` | `nil` | Custom callback returning the drying rate for a given input rate. Set via `SetGetDryingRateFn`. |
| `applydryingfn` | `function (optional)` | `nil` | Custom callback to apply the actual drying effect. Set via `SetApplyDryingFn`. |

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** Cleanup handler called when the component is removed from its entity. Removes the entity from the inventory item source registry.
* **Parameters:** None.

### `OnItemSourceRemoved(owner)`
* **Description:** Handles cleanup when this source is removed from an owner (e.g., unequipped or removed from inventory). Notifies the owner's `moistureabsorberuser` to stop using this source.
* **Parameters:** `owner` — the entity that previously owned this source.

### `OnItemSourceNewOwner(owner)`
* **Description:** Registers this source with a new owner's `moistureabsorberuser` component if the owner has moisture capabilities. Creates the `moistureabsorberuser` component if missing.
* **Parameters:** `owner` — the entity that now owns this source.

### `SetGetDryingRateFn(fn)`
* **Description:** Assigns a custom function to compute the drying rate. This function is invoked during rate calculations.
* **Parameters:** `fn` — a function expecting arguments `(entity, rate)` and returning a numeric drying rate.

### `GetDryingRate(rate)`
* **Description:** Computes and returns the effective drying rate, applying a multiplier if `rate > 0` (e.g., during rain).
* **Parameters:** `rate` — the base drying rate value.

### `SetApplyDryingFn(fn)`
* **Description:** Assigns a custom function to apply the drying effect (e.g., reducing moisture level).
* **Parameters:** `fn` — a function expecting arguments `(entity, rate, dt)`.

### `ApplyDrying(rate, dt)`
* **Description:** Invokes the custom drying application function, if defined, with current rate and delta time.
* **Parameters:**  
  - `rate` — the computed drying rate.  
  - `dt` — delta time for the tick/frame.

## Events & Listeners
None identified.