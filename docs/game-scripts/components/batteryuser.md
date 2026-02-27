---
id: batteryuser
title: Batteryuser
description: Manages an entity's ability to consume charge from another entity that has a `battery` component.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 299c15cf
---

# Batteryuser

## Overview
The `batteryuser` component allows an entity to act as a consumer of electrical charge. It provides the logic for an entity to interact with and draw power from another entity that possesses a `battery` component.

## Dependencies & Tags
*   **Tags:** Adds the `batteryuser` tag to the entity upon initialization.

## Properties
| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `onbatteryused` | `function` | `nil` | An optional callback function that is executed before successfully using the battery. It can be used to add custom conditions or side effects. The function receives the user and the battery entity as arguments. |

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** A lifecycle function called when the component is removed from its entity. It cleans up by removing the `batteryuser` tag.
* **Parameters:** None.

### `ChargeFrom(charge_target)`
* **Description:** Attempts to draw a single charge from a target entity. This function first checks if the target's `battery` component can be used. It then calls the optional `onbatteryused` callback for additional validation. If all checks pass, it consumes a charge from the target and returns a success status.
* **Parameters:**
    *   `charge_target` (Entity): The entity instance with a `battery` component to draw charge from.
* **Returns:**
    *   `result` (boolean): `true` if the charge was successful, `false` otherwise.
    *   `reason` (string): A string explaining why the charge failed, if applicable.