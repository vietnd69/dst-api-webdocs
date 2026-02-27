---
id: fuel
title: Fuel
description: Manages fuel properties and behavior for entities, including fuel type tagging, value, and events triggered when the fuel is consumed.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: d5c01b6a
---

# Fuel

## Overview
The `Fuel` component attaches to entities to represent their capacity and type as fuel. It automatically maintains relevant entity tags (e.g., `burnable_fuel`) based on the current fuel type, exposes fuel consumption logic, and supports custom callbacks when the fuel is taken or used.

## Dependencies & Tags
- Relies on `inst:AddTag()` and `inst:RemoveTag()` methods provided by the base entity system.
- Adds/Removes dynamic tags based on `fueltype`, e.g., `burnable_fuel`, `food_fuel`, etc.
- No other components are explicitly added or required by this script.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `1` | Numeric fuel value representing how much energy this item provides. Currently unused in this snippet but likely used by consuming systems. |
| `fueltype` | string (FUELTYPE.*) | `FUELTYPE.BURNABLE` | Type of fuel (e.g., `FUELTYPE.BURNABLE`, `FUELTYPE.FOOD`, etc.). Triggers tag changes via `onfueltype`. |
| `ontaken` | function or `nil` | `nil` | Optional callback function invoked when the fuel is taken/consumed. |

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** Cleans up the fuel tag (e.g., `burnable_fuel`) when the component is removed from the entity. Prevents stale tags from remaining on the entity.
* **Parameters:** None.

### `SetOnTakenFn(fn)`
* **Description:** Registers a custom callback function (`fn`) to be executed when the fuel is taken (i.e., consumed).
* **Parameters:**  
  - `fn`: A function with signature `fn(inst, target)`, where `inst` is the fuel entity and `target` is the consumer.

### `Taken(target)`
* **Description:** Triggers the fuel-taken event and executes the registered `ontaken` callback. Indicates the fuel has been consumed (e.g., by a fire or character).
* **Parameters:**  
  - `target`: The entity consuming the fuel (e.g., a player or fire). Passed to both the event and the callback.

## Events & Listeners
- Listens for changes to the `fueltype` property via the `onfueltype` callback (defined in class definition).
- Listens for component removal to clean up tags (handled in `OnRemoveFromEntity`).
- Pushes the `"fueltaken"` event when `Taken()` is called, with payload `{ taker = target }`.