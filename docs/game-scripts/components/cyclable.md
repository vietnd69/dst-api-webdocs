---
id: cyclable
title: Cyclable
description: This component allows an entity to cycle through a series of discrete steps or states, often used for visual changes or functional modes.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: fc19b833
---

# Cyclable

## Overview
The `Cyclable` component provides functionality for an entity to manage a sequence of steps or states. It allows for setting the total number of steps, advancing or regressing through them, and executing a callback function when the current step changes. It also manages the "cancycle" tag on the entity to indicate whether it is currently cyclable.

## Dependencies & Tags
**Tags Added/Removed:**
*   `cancycle`: Added to the entity when `self.cancycle` is `true`, removed when `self.cancycle` is `false`.

## Properties
| Property    | Type       | Default Value | Description                                                                                                                                                                    |
| :---------- | :--------- | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inst`      | `Entity`   | -             | A reference to the entity this component is attached to.                                                                                                                       |
| `cancycle`  | `boolean`  | `true`        | Determines if the entity is currently capable of being cycled. Setting this property automatically adds or removes the "cancycle" tag from the entity.                         |
| `step`      | `number`   | `1`           | The current active step in the cycle. This value is clamped between 1 and `num_steps` to ensure it always represents a valid step.                                             |
| `num_steps` | `number`   | `3`           | The total number of steps or states available in the cycle. When this property is set, the current `step` is automatically re-clamped to fit within the new valid range.       |
| `oncyclefn` | `function` | `nil`         | An optional callback function that is executed whenever the cycle's `step` changes. It receives `self.inst`, the `new_step` value, and the `doer` as arguments.               |

## Main Functions
### `SetNumSteps(num)`
*   **Description:** Sets the total number of steps for the cycle. The component automatically clamps the current `step` to remain within the new valid range (1 to `num`).
*   **Parameters:**
    *   `num` (`number`): The new total number of steps for the cycle.

### `SetOnCycleFn(fn)`
*   **Description:** Assigns a callback function to be invoked whenever the current cycle step changes.
*   **Parameters:**
    *   `fn` (`function`): The function to be called. It should accept `(inst, new_step, doer)` as its arguments.

### `SetStep(step, doer, ignore_callback)`
*   **Description:** Directly sets the current step of the cycle. The provided `step` value is clamped between 1 and `num_steps`. If an `oncyclefn` is defined and `ignore_callback` is not `true`, the callback is triggered.
*   **Parameters:**
    *   `step` (`number`): The desired step number to set.
    *   `doer` (`Entity`, optional): The entity responsible for initiating the step change. This is passed to `oncyclefn`.
    *   `ignore_callback` (`boolean`, optional): If `true`, the `oncyclefn` will not be invoked. Defaults to `false`.

### `Cycle(doer, negative)`
*   **Description:** Advances the cycle to the next step. If `negative` is `true`, it cycles backward. The cycle wraps around (e.g., from `num_steps` to 1, or from 1 to `num_steps`). If an `oncyclefn` is defined, it is triggered.
*   **Parameters:**
    *   `doer` (`Entity`, optional): The entity that initiated the cycle. This is passed to `oncyclefn`.
    *   `negative` (`boolean`, optional): If `true`, the cycle decrements the step. If `false` or `nil`, it increments the step.

### `OnSave()`
*   **Description:** Serializes the component's current state, specifically the `step`, for game saving.
*   **Parameters:** None
*   **Returns:** A `table` containing the `step` property.

### `OnLoad(data)`
*   **Description:** Deserializes and restores the component's state from saved game data. If `data.step` is present, it will update the component's `step` property.
*   **Parameters:**
    *   `data` (`table`): The table containing saved component data.