---
id: dryingracksaltcollector
title: Dryingracksaltcollector
description: This component manages and tracks salt quantities and their specific slots on an entity, particularly for objects like drying racks.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 6a23ea9a
---

# Dryingracksaltcollector

## Overview
This component is responsible for collecting, tracking, and managing the presence of salt in specific "slots" on an associated entity, such as a drying rack. It maintains a count of the total salt pieces and provides an interface for adding, removing, querying, saving, and loading this salt data. It can also notify an external function when the salt count changes.

## Dependencies & Tags
None identified. This script does not explicitly rely on other components via `AddComponent` calls or manage specific entity tags.

## Properties
| Property          | Type                      | Default Value | Description                                                              |
| :---------------- | :------------------------ | :------------ | :----------------------------------------------------------------------- |
| `inst`            | `table`                   | `nil`         | A reference to the entity that this component is attached to.            |
| `slots`           | `table`                   | `{}`          | A table used as a set, where keys are slot identifiers and values are `true` if salt is present in that slot. |
| `numsalts`        | `number`                  | `0`           | The current total count of salt pieces managed by this collector.        |
| `onsaltchangedfn` | `function` or `nil`       | `nil`         | An optional callback function to be executed when `numsalts` changes. This function receives `(inst, numsalts)` as arguments. |

## Main Functions
### `SetOnSaltChangedFn(fn)`
*   **Description:** Assigns a callback function that will be invoked whenever the number of salts managed by this component changes (i.e., when `AddSalt` or `RemoveSalt` is successfully called).
*   **Parameters:**
    *   `fn` (`function`): The function to be called. It will receive two arguments: `self.inst` (the entity) and `self.numsalts` (the current count of salts).

### `AddSalt(slot)`
*   **Description:** Attempts to add salt to a specified slot. If the slot is not already occupied by salt, it marks the slot as having salt, increments the total salt count, and triggers the `onsaltchangedfn` if set.
*   **Parameters:**
    *   `slot` (`any`): A unique identifier (e.g., a number or string) representing the slot where salt is to be added.
*   **Returns:** `boolean` - `true` if salt was successfully added to a previously empty slot, `false` otherwise (if the slot already had salt).

### `RemoveSalt(slot)`
*   **Description:** Attempts to remove salt from a specified slot. If the slot is currently occupied by salt, it clears the slot, decrements the total salt count, and triggers the `onsaltchangedfn` if set.
*   **Parameters:**
    *   `slot` (`any`): A unique identifier (e.g., a number or string) representing the slot from which salt is to be removed.
*   **Returns:** `boolean` - `true` if salt was successfully removed from an occupied slot, `false` otherwise (if the slot was already empty).

### `HasSalt(slot)`
*   **Description:** Checks for the presence of salt. If a `slot` is provided, it checks if that specific slot contains salt. If no `slot` is provided, it checks if there is any salt at all in the collector (`numsalts > 0`).
*   **Parameters:**
    *   `slot` (`any`, optional): The specific slot identifier to check. If omitted, the function checks if any salt exists.
*   **Returns:** `boolean` - `true` if salt is found in the specified slot (or anywhere if `slot` is `nil`), `false` otherwise.

### `GetNumSalts()`
*   **Description:** Retrieves the current total number of salts being managed by this component.
*   **Parameters:** None.
*   **Returns:** `number` - The current value of `self.numsalts`.

### `OnSave()`
*   **Description:** Serializes the component's current state to be saved with the game world. It collects all occupied slot identifiers if `numsalts` is greater than zero.
*   **Parameters:** None.
*   **Returns:** `table` or `nil` - A table with a `slots` key containing an array of occupied slot identifiers if `numsalts > 0`; otherwise, `nil`.

### `OnLoad(data)`
*   **Description:** Deserializes the component's state from saved game data. It populates the `slots` and `numsalts` based on the provided data, and triggers the `onsaltchangedfn` if set.
*   **Parameters:**
    *   `data` (`table`): The table containing the saved component data, expected to have a `slots` array if salt was saved.