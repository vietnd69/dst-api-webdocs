---
id: knowndynamiclocations
title: Knowndynamiclocations
description: Manages named dynamic positions associated with an entity, supporting platform-relative storage and persistence across saves.
tags: [world, position, persistence, dynamic]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: ca6d8753
system_scope: world
---

# Knowndynamiclocations

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`KnownDynamicLocations` is a component that stores and manages named dynamic position references relative to walkable platforms or absolute world space. It allows entities to remember and retrieve positions with optional platform attachment (e.g., for floating structures) and supports loading, saving, and handling platform removal events. It integrates with DST’s dynamic position system and worldgen lifecycle hooks (`POPULATING`, `LoadPostPass`).

This component is typically attached to entities that need to persist spatial references (like beehives, beefalo pens, or procedural structures) across save/load cycles and platform changes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("knowndynamiclocations")

-- Remember a new location named "spawner_pos"
inst.components.knowndynamiclocations:RememberLocation("spawner_pos", Vector3(10, 0, 20))

-- Retrieve the stored position as a Vector3
local pos = inst.components.knowndynamiclocations:GetLocation("spawner_pos")

-- Store additional locations as needed
inst.components.knowndynamiclocations:RememberLocation("exit_pos", Vector3(-5, 0, 15), true) -- dont_overwrite = true

-- Cleanup on removal
inst:RemoveComponent("knowndynamiclocations")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
No public properties.

## Main functions
### `GetLocation(name)`
* **Description:** Returns the absolute world-space position of a remembered location as a `Vector3`. Returns `nil` if the name is not found.
* **Parameters:** `name` (string) – the identifier used when remembering the location.
* **Returns:** `Vector3?` – world-space position or `nil`.

### `GetDynamicLocation(name)`
* **Description:** Returns the raw `DynamicPosition` object for a remembered location (enabling platform-aware position updates). Returns `nil` if the name is not found.
* **Parameters:** `name` (string) – the identifier used when remembering the location.
* **Returns:** `DynamicPosition?` – dynamic position object or `nil`.

### `RememberLocation(name, pt, dont_overwrite)`
* **Description:** Records a new position `pt` under the given `name`. If `dont_overwrite` is `true`, it does not overwrite an existing entry; otherwise, any prior entry is removed first. Handles deferred loading (`POPULATING`) and automatic platform attachment.
* **Parameters:**  
  `name` (string) – unique identifier for the location.  
  `pt` (Vector3) – position coordinates (x, y, z). Must be valid numbers (non-NaN/Inf).  
  `dont_overwrite` (boolean, optional) – if `true`, preserves existing entry; defaults to `false`.
* **Returns:** Nothing.
* **Error states:** Throws an error if `pt` contains invalid numeric values (e.g., `NaN`, `Inf`).

### `ForgetLocation(name)`
* **Description:** Removes a remembered location by name, unsubscribing from any associated platform removal events.
* **Parameters:** `name` (string) – the identifier of the location to forget.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes all remembered locations into a data table suitable for saving. Excludes entries if none exist.
* **Parameters:** None.
* **Returns:** `{ locations = { { name = "string", x = number, y = number?, z = number } } }` or `nil`.

### `OnLoad(data)`
* **Description:** Reconstructs remembered locations from saved data. Clears prior entries before reloading.
* **Parameters:** `data` (table) – the saved data table containing a `locations` array.
* **Returns:** Nothing.

### `LoadPostPass(ents, data)`
* **Description:** Called during post-load initialization to finalize platform-relative positions deferred during initial load (`POPULATING` state). Converts static `local_pt` positions into full `DynamicPosition` objects and attaches platform listeners.
* **Parameters:**  
  `ents` (table) – entity mapping for resolution (unused in current implementation).  
  `data` (table) – loaded data (unused in current implementation).
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable string listing all remembered locations and their `DynamicPosition` representations. Returns `nil` if no locations exist.
* **Parameters:** None.
* **Returns:** `string?` – formatted debug string or `nil`.

### `OnRemoveFromEntity()`
* **Description:** Called when the component is removed from its entity. Stops watching all registered platforms to prevent dangling event callbacks.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` – registered per-platform entry to detect when a walkable platform is removed, updating the stored position to world-space absolute coordinates.
- **Pushes:** None identified.
