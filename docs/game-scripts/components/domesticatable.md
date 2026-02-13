---
id: domesticatable
title: Domesticatable
description: This component manages an entity's domestication and obedience levels, controlling their progression, decay, and associated behavioral state changes.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Domesticatable

## Overview
The `Domesticatable` component is responsible for implementing the domestication system for creatures within Don't Starve Together. It tracks and manages an entity's `domestication` and `obedience` values, allowing them to progress towards a domesticated state or revert to a feral state. It handles the continuous decay of these stats, triggers state changes (like becoming domesticated or feral), and integrates with other components for saving/loading and applying skill-based modifiers.

## Dependencies & Tags
This component relies on or interacts with the following:

*   **Components**:
    *   `hunger`: Used to check the entity's hunger percentage for determining feral state.
    *   `rideable` (optional): Used for saving/loading rideable-specific data related to domestication and for identifying the rider as a potential doer for domestication gains.
    *   `skilltreeupdater` (optional): Used by a `doer` (e.g., a player) to check for relevant domestication skill tags that modify domestication gain rates.

*   **Tags**:
    *   Adds `"domesticatable"` to the entity upon instantiation.
    *   Removes `"domesticatable"` from the entity upon removal of the component.
    *   Adds `"domesticated"` to the entity when it becomes domesticated.
    *   Removes `"domesticated"` from the entity when it becomes feral.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `domesticated` | boolean | `false` | A flag indicating whether the entity is currently considered fully domesticated. |
| `domestication` | number | `0` | The current domestication progress, a value between 0 and 1. |
| `domestication_latch` | boolean | `false` | A internal flag that becomes true when domestication reaches 1.0, enabling the `BecomeDomesticated` action. |
| `lastdomesticationgain` | number | `0` | The `GetTime()` timestamp when the entity last gained domestication. Used to calculate domestication loss. |
| `domestication_triggerfn` | function | `nil` | A callback function, expected to return `true` if the entity meets conditions to gain domestication, causing positive domestication changes. |
| `obedience` | number | `0` | The current obedience level of the entity, a value typically between `minobedience` and `maxobedience`. |
| `minobedience` | number | `0` | The minimum possible obedience level for this entity. |
| `maxobedience` | number | `1` | The maximum possible obedience level for this entity. |
| `domesticationdecaypaused` | boolean | `false` | A flag that, when true, pauses the decay of domestication, but not obedience. |
| `tendencies` | table | `{}` | A table storing various behavioral tendencies as key-value pairs (e.g., "brave": 0.5). |
| `decaytask` | task | `nil` | The handle for the periodic task that manages domestication and obedience decay. |

## Main Functions
### `OnRemoveFromEntity()`
*   **Description:** Called when the component is removed from the entity. It cancels the periodic decay task and removes the "domesticatable" tag.
*   **Parameters:** None.

### `SetDomesticationTrigger(fn)`
*   **Description:** Sets a callback function that determines when the entity should gain domestication. This function will be called periodically by the decay task.
*   **Parameters:**
    *   `fn`: `function` - A function that takes the entity as an argument and returns `true` if domestication should be gained.

### `GetObedience()`
*   **Description:** Returns the current obedience level of the entity.
*   **Parameters:** None.

### `GetDomestication()`
*   **Description:** Returns the current domestication progress of the entity.
*   **Parameters:** None.

### `Validate()`
*   **Description:** Checks if the conditions for the domestication decay task to run are met. If obedience, hunger, and domestication are all at their minimum/zero values, the task is cancelled.
*   **Parameters:** None.

### `CheckForChanges()`
*   **Description:** Evaluates the current domestication level and hunger to determine if the entity should become domesticated (if `domestication_latch` is set) or become feral. Pushes relevant events upon state changes.
*   **Parameters:** None.

### `BecomeDomesticated()`
*   **Description:** Transitions the entity to the fully domesticated state, clears the `domestication_latch`, sets the `domesticated` flag, and pushes a "domesticated" event.
*   **Parameters:** None.

### `DeltaObedience(delta)`
*   **Description:** Adjusts the entity's obedience level by the given `delta` amount, clamping it between `minobedience` and `maxobedience`. If the obedience changes, it pushes an "obediencedelta" event and ensures the decay task is running.
*   **Parameters:**
    *   `delta`: `number` - The amount to add or subtract from the current obedience.

### `DeltaDomestication(delta, doer)`
*   **Description:** Adjusts the entity's domestication progress by the given `delta` amount, clamping it between 0 and 1. If `delta` is positive, it applies skill-based multipliers if a `doer` with relevant skills is provided. If domestication changes, it pushes a "domesticationdelta" event, checks for state changes, and ensures the decay task is running.
*   **Parameters:**
    *   `delta`: `number` - The amount to add or subtract from the current domestication.
    *   `doer`: `entity` (optional) - The entity (e.g., a player) responsible for the domestication change, used for skill checks.

### `DeltaTendency(tendency, delta)`
*   **Description:** Adjusts the value of a specific behavioral tendency by the given `delta`. If the tendency doesn't exist, it's initialized.
*   **Parameters:**
    *   `tendency`: `string` - The name of the tendency to modify (e.g., "brave", "lazy").
    *   `delta`: `number` - The amount to add to the tendency's value.

### `PauseDomesticationDecay(pause)`
*   **Description:** Sets a flag to pause or unpause the decay of domestication. Obedience decay is unaffected.
*   **Parameters:**
    *   `pause`: `boolean` - `true` to pause decay, `false` to resume.

### `TryBecomeDomesticated()`
*   **Description:** Checks if the `domestication_latch` is set and, if so, calls `BecomeDomesticated()` to finalize the domestication process.
*   **Parameters:** None.

### `CancelTask()`
*   **Description:** Cancels the periodic decay task if it is currently running.
*   **Parameters:** None.

### `CheckAndStartTask()`
*   **Description:** Validates the current state and, if appropriate, starts the periodic decay task if it's not already running.
*   **Parameters:** None.

### `SetDomesticated(domesticated)`
*   **Description:** Sets the internal `domesticated` flag and adds or removes the "domesticated" tag from the entity accordingly. Also triggers a validation check.
*   **Parameters:**
    *   `domesticated`: `boolean` - `true` to mark as domesticated, `false` otherwise.

### `IsDomesticated()`
*   **Description:** Returns `true` if the entity is currently domesticated, `false` otherwise.
*   **Parameters:** None.

### `SetMinObedience(min)`
*   **Description:** Sets the minimum obedience level for the entity. If the current obedience is below this new minimum, it is adjusted upwards. Also ensures the decay task is running.
*   **Parameters:**
    *   `min`: `number` - The new minimum obedience value.

### `OnSave()`
*   **Description:** Gathers the current state of the component's properties into a table for saving persistence. Includes specific handling for the `rideable` component if present.
*   **Parameters:** None.

### `OnLoad(data, newents)`
*   **Description:** Restores the component's state from saved `data`. Handles default values for missing data and specific loading for the `rideable` component if present. Ensures the decay task starts after loading.
*   **Parameters:**
    *   `data`: `table` - The saved data table.
    *   `newents`: `table` - A table of new entities created during world loading (currently unused in this component's `OnLoad`).

### `GetDebugString()`
*   **Description:** Returns a formatted string containing debug information about the entity's domestication, obedience, and tendencies.
*   **Parameters:** None.

## Events & Listeners
This component pushes the following events:

*   `"goneferal"`: Triggered when the entity's domestication and hunger reach zero, indicating it has reverted to a wild state. Contains `domesticated` (boolean) indicating if it *was* previously domesticated.
*   `"domesticated"`: Triggered when the entity fully reaches the domesticated state. Contains `tendencies` (table) reflecting its final behavioral tendencies.
*   `"obediencedelta"`: Triggered when the entity's obedience level changes. Contains `old` (number) and `new` (number) obedience values.
*   `"domesticationdelta"`: Triggered when the entity's domestication progress changes. Contains `old` (number) and `new` (number) domestication values.