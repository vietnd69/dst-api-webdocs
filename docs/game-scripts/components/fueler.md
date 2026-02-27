---
id: fueler
title: Fueler
description: Manages fuel properties for an entity, including its type and value, and handles fuel consumption events.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 95b40cf8
---

# Fueler

## Overview
The Fueler component defines fuel-related behavior for an entity, such as its fuel value, type, and the ability to trigger logic when fuel is consumed. It automatically manages dynamic tags (e.g., `burnable_fuel`) based on the current fuel type and supports an optional callback for fuel-take events.

## Dependencies & Tags
- Uses `inst:AddTag()` and `inst:RemoveTag()` to apply/remove `"<fueltype>_fuel"` tags on the entity (e.g., `burnable_fuel`, `meat_fuel`).
- No explicit component dependencies (does not require or add other components).

## Properties

| Property      | Type     | Default Value      | Description                                                                 |
|---------------|----------|--------------------|-----------------------------------------------------------------------------|
| `fuelvalue`   | number   | `1`                | The amount of fuel this entity provides when used.                          |
| `fueltype`    | string   | `FUELTYPE.BURNABLE`| The category of fuel (e.g., `"burnable"`, `"meat"`), used to form tags.     |
| `ontaken`     | function | `nil`              | Optional callback function invoked when fuel is consumed (`fn(inst, taker)`). |

## Main Functions

### `SetOnTakenFn(fn)`
* **Description:** Sets the callback function to be executed when this fuel item is taken/consumed.
* **Parameters:**  
  `fn` (function) — A function that accepts two arguments: the fuel entity (`inst`) and the taker entity (`target`).

### `Taken(target)`
* **Description:** Signals that the fuel has been consumed. Triggers the `"fueltaken"` event and invokes the `ontaken` callback (if set).
* **Parameters:**  
  `target` (Entity) — The entity that consumed the fuel (e.g., a campfire or character).

## Events & Listeners

- **Listens for:** None  
- **Emits:**  
  - `"fueltaken"` — with payload `{ taker = target }` when fuel is consumed.  
  - Implicit tag changes via `onfueltype`: emits tag removal/addition for `"<oldtype>_fuel"` and `"<newtype>_fuel"` when `fueltype` is modified (handled via metatable setter).