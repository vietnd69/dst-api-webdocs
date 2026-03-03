---
id: knownlocations
title: Knownlocations
description: Manages a collection of named coordinate positions associated with an entity for persistent tracking and recall.
tags: [map, persistence, storage]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 5febcc7d
system_scope: world
---

# Knownlocations

> Based on game build **7140014** | Last updated: 2026-03-03

## Overview
`KnownLocations` is a lightweight component that stores and retrieves named world positions (`Vector3`) on an entity. It supports serialization for save/load functionality and provides debugging output via `GetDebugString`. While currently unused for debugging in active code (the debugger integration is commented out), it is designed to support tools and systems that need to track specific points of interest relative to an entity, such as bosses, structures, or dynamic world markers.

The component does not manage spatial logic or pathfinding; it acts purely as a key-value store for positions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("knownlocations")

inst.components.knownlocations:RememberLocation("spawn", Vector3(10, 0, -20))
inst.components.knownlocations:RememberLocation("exit", Vector3(-5, 0, 15), true) -- do not overwrite if exists

local spawn_pos = inst.components.knownlocations:GetLocation("spawn")
local saved_data = inst.components.knownlocations:OnSave()
inst.components.knownlocations:OnLoad(saved_data)
```

## Dependencies & tags
**Components used:** `debugger` (commented out; not actively used)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `locations` | table (map of string → `Vector3`) | `{}` | Internal dictionary storing named positions. |

## Main functions
### `GetDebugString()`
* **Description:** Returns a human-readable string listing all known location names and their positions. Intended for debugging/logs.
* **Parameters:** None.
* **Returns:** `string` — formatted as `"location_name: Vector3(x, y, z) ..."` for all entries.
* **Error states:** None. If no locations exist, returns an empty string.

### `SerializeLocations()`
* **Description:** Serializes all stored locations into a plain table suitable for save data.
* **Parameters:** None.
* **Returns:** `table?` — `nil` if no locations exist; otherwise, a table of objects with keys `{name, x, y, z}` for each location.
* **Error states:** Returns `nil` if `self.locations` is empty.

### `DeserializeLocations(data)`
* **Description:** Restores locations from serialized data (e.g., loaded from save).
* **Parameters:** `data` (table) — a table of location objects, each with keys `{name, x, y, z}`.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Helper method to prepare component state for world/entity saving.
* **Parameters:** None.
* **Returns:** `{locations = ...}` (table) or `nil` — only returns a non-`nil` table if locations exist.
* **Error states:** Returns `nil` if `locations` is empty.

### `OnLoad(data)`
* **Description:** Restores component state from saved data during load.
* **Parameters:** `data` (table) — expected to contain a `locations` key matching the output of `SerializeLocations()`.
* **Returns:** Nothing.

### `RememberLocation(name, pos, dont_overwrite)`
* **Description:** Records or updates a named location.
* **Parameters:**  
  - `name` (string) — unique identifier for the location.  
  - `pos` (`Vector3`) — world position to store.  
  - `dont_overwrite` (boolean?) — if `true`, does not overwrite an existing entry (optional; defaults to `nil` → overwrite allowed).
* **Returns:** Nothing.
* **Error states:** If `pos` contains invalid numbers (NaN or inf), prints an error message to console and raises a Lua error.

### `GetLocation(name)`
* **Description:** Retrieves a stored location by name.
* **Parameters:** `name` (string) — the identifier of the location.
* **Returns:** `Vector3?` — the stored position, or `nil` if not found.

### `ForgetLocation(name)`
* **Description:** Removes a location from the store.
* **Parameters:** `name` (string) — the identifier to remove.
* **Returns:** Nothing.

## Events & listeners
None identified.
