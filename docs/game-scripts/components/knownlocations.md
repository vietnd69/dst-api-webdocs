---
id: knownlocations
title: Knownlocations
description: Tracks and persists named world coordinates associated with an entity, allowing locations to be remembered, retrieved, forgotten, and saved across sessions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 5febcc7d
---

# Knownlocations

## Overview
This component manages a collection of named 3D world positions (`Vector3`) associated with an entity. It provides functionality to remember (store), retrieve, forget, serialize, and deserialize these locations—making it particularly useful for saving and loading persistent world landmarks or waypoints. It integrates with the game’s save/load system via `OnSave` and `OnLoad` methods.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `locations` | `table` | `{}` | A dictionary mapping location names (strings) to `Vector3` position values. |
| `inst` | `Entity` | passed to constructor | Reference to the entity this component is attached to. |

## Main Functions
### `RememberLocation(name, pos, dont_overwrite)`
* **Description:** Stores a named position in the `locations` table. If `dont_overwrite` is `true`, the position is only stored if the name does not already exist. Includes validation to detect invalid (NaN/Inf) coordinates and logs an error if found.
* **Parameters:**  
  - `name` (string): The identifier for the location.  
  - `pos` (`Vector3`): The 3D world position to store.  
  - `dont_overwrite` (boolean, optional): If `true`, prevents overwriting an existing entry for the same `name`.

### `GetLocation(name)`
* **Description:** Returns the stored `Vector3` position for a given location name, or `nil` if not found.
* **Parameters:**  
  - `name` (string): The identifier of the location to retrieve.

### `ForgetLocation(name)`
* **Description:** Removes a named location from the `locations` table.
* **Parameters:**  
  - `name` (string): The identifier of the location to remove.

### `SerializeLocations()`
* **Description:** Converts the internal `locations` table into a serializable array of tables, each containing `name`, `x`, `y`, and `z`.
* **Parameters:** None.  
* **Returns:** `table?` — A list of location records, or `nil` if no locations exist.

### `DeserializeLocations(data)`
* **Description:** Restores locations from serialized data by calling `RememberLocation` for each entry.
* **Parameters:**  
  - `data` (table): An array of location records (as returned by `SerializeLocations`).

### `OnSave()`
* **Description:** Serializes and returns the stored locations for saving to disk. Used by the save system.
* **Parameters:** None.  
* **Returns:** `table?` — A table of the form `{ locations = serialized_data }`, or `nil` if no locations exist.

### `OnLoad(data)`
* **Description:** Loads previously saved location data and restores them. Used by the load system.
* **Parameters:**  
  - `data` (table): Save data containing `data.locations`, if any.

### `GetDebugString()`
* **Description:** Returns a string listing all known location names and their positions, primarily for debugging display (e.g., via debugger UI). Includes commented-out visualization logic.
* **Parameters:** None.  
* **Returns:** `string` — A space-separated string of `"name: position"` entries.

## Events & Listeners
None.