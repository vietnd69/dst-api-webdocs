---
id: fuelmaster
title: Fuelmaster
description: Calculates and applies a multiplicative fuel efficiency bonus to an entity based on custom logic and a base multiplier.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: c310f291
---

# Fuelmaster

## Overview
The `Fuelmaster` component enhances an entity's fuel efficiency calculations by allowing dynamic adjustment of fuel usage multipliers. It provides a mechanism to override or augment how much fuel a device consumes when operating, using both a simple scalar multiplier and an optional custom callback function.

## Dependencies & Tags
None identified

## Properties

| Property    | Type     | Default Value | Description |
|-------------|----------|---------------|-------------|
| `inst`      | `Entity` | *(from arg)*  | Reference to the entity this component is attached to. |
| `bonusmult` | `number` | `1`           | Base multiplier applied to fuel usage calculations. |
| `bonusfn`   | `function?` | `nil`       | Optional callback function used to compute an additional multiplier per fuel usage event. |

## Main Functions

### `SetBonusMult(mult)`
* **Description:** Sets the base fuel usage multiplier (`bonusmult`) applied to all fuel calculations.
* **Parameters:**
  * `mult` (`number`): The new multiplicative factor. Must be a numeric value (typically > 0).

### `SetBonusFn(fn)`
* **Description:** Assigns a custom callback function to dynamically determine fuel usage adjustments per item/target pair.
* **Parameters:**
  * `fn` (`function`): A function expecting three arguments: `(instance, item, target)`, and returning a numeric multiplier.

### `GetBonusMult(item, target)`
* **Description:** Computes and returns the final fuel efficiency bonus multiplier by combining the base multiplier (`bonusmult`) and the result of the optional callback (`bonusfn`). Used when determining fuel consumption for items or devices.
* **Parameters:**
  * `item` (`Entity`): The item being consumed as fuel.
  * `target` (`Entity`): The entity consuming the fuel (e.g., a fire, lantern, or engine).
  * **Returns:** `number` – The effective multiplier used to scale fuel consumption (e.g., higher values = more fuel used).

## Events & Listeners
None