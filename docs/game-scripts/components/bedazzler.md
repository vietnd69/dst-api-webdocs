---
id: bedazzler
title: Bedazzler
description: Manages the logic for an item to apply the 'bedazzled' effect to a target entity, including condition checks and resource consumption.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Bedazzler

## Overview
The Bedazzler component is attached to items that can apply a "bedazzle" effect to other entities. It is responsible for checking if a target is in a valid state to be bedazzled and for executing the bedazzling action, which in turn activates the `bedazzlement` component on the target and consumes uses from the item.

## Dependencies & Tags
**Dependencies:**
*   `finiteuses` (on self): Used to consume charges when the `Bedazzle` action is performed.
*   `bedazzlement` (on target): This component is activated on the target entity.
*   `burnable` (on target): Checked to see if the target is currently burning.
*   `freezable` (on target): Checked to see if the target is currently frozen.

**Tags:**
*   This component checks for the tags `burnt` and `bedazzled` on the target entity but does not add or remove any tags itself.

## Properties
| Property     | Type   | Default Value            | Description                                                                                          |
|--------------|--------|--------------------------|------------------------------------------------------------------------------------------------------|
| `inst`       | Entity | The entity instance      | A reference to the entity this component is attached to.                                             |
| `use_amount` | number | `1` (in `Bedazzle` call) | The number of uses to consume from the `finiteuses` component. Set via `SetUseAmount`. Defaults to 1 if not set. |

## Main Functions
### `SetUseAmount(use_amount)`
* **Description:** Sets the number of uses that the item will consume from its `finiteuses` component each time it successfully bedazzles a target.
* **Parameters:**
    * `use_amount` (number): The number of uses to consume per action.

### `CanBedazzle(target)`
* **Description:** Checks if a target entity is in a valid state to be bedazzled. It returns `false` and a reason string if the target is burning, burnt, frozen, or already bedazzled.
* **Parameters:**
    * `target` (Entity): The entity to check for bedazzling eligibility.
* **Returns:** `(boolean, string)`: Returns `true` if the target can be bedazzled, or `false` and a reason key (e.g., "BURNING", "FROZEN") if it cannot.

### `Bedazzle(target)`
* **Description:** Applies the bedazzle effect to a target. This function calls the `Start` method on the target's `bedazzlement` component and consumes a specified number of uses from its own `finiteuses` component.
* **Parameters:**
    * `target` (Entity): The entity to apply the bedazzle effect to.