---
id: uniqueprefabids
title: Uniqueprefabids
description: Tracks unique instance IDs per prefab type to ensure each spawned entity instance receives a distinct sequential identifier.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 47e975b9
---

# Uniqueprefabids

## Overview
This component maintains a counter for each prefab name to assign unique, sequential IDs to instances of the same prefab. It is used to differentiate multiple instances of identical prefabs (e.g., multiple `log` or `rock` entities) by appending an incremented index, typically for debugging, serialization, or gameplay logic requiring instance-level uniqueness.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `table` (entity reference) | `nil` (assigned via constructor) | Reference to the entity instance the component is attached to. |
| `topprefabids` | `table` (dictionary) | `{}` | Map storing the highest assigned ID (counter) per prefab name. |

## Main Functions
### `GetNextID(prefabname)`
* **Description:** Retrieves and increments the next sequential ID for the given prefab name. If the prefab name has not been seen before, initializes its counter to 1 before returning it.
* **Parameters:**  
  `prefabname` (*string*): The name of the prefab for which to get the next unique ID.

### `OnSave()`
* **Description:** Returns a table containing the current state of `topprefabids`, used for saving the component's data to disk.
* **Parameters:** None.  
* **Returns:** `table` — A table with a single key `topprefabids`, mapping to the internal ID counter dictionary.

### `OnLoad(data)`
* **Description:** Restores the component’s state from saved data during world or entity load.
* **Parameters:**  
  `data` (*table*): The saved data table, expected to contain a `topprefabids` key.

### `GetDebugString()`
* **Description:** Returns a space-separated string of all stored prefab ID mappings for debugging (e.g., `"log: 3 rock: 5"`).
* **Parameters:** None.  
* **Returns:** `string` — A human-readable representation of the current ID counters.

## Events & Listeners
None.