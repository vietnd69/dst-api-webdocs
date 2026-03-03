---
id: startlocations
title: Startlocations
description: Manages world start location configurations for the sandbox menu, supporting both built-in and mod-defined start locations.
tags: [world, sandbox, menu, modding]
sidebar_position: 100
last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: f083765e
---
# Startlocations

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This module provides the game's foundational data and utilities for managing player start locations across different world types (e.g., forest, caves, lava arena). It stores and retrieves start location definitions—including display names, target world type, and initial map piece/node assignments—and supports dynamic registration of mod-provided start locations. It is primarily used by the frontend sandbox menu to populate world creation options and configure initial spawn placement.

The module is stateful and stores two internal registries: `startlocations` for built-in entries and `modstartlocations` for mod-provided entries. It does not function as an ECS component (i.e., no entities, tags, or component instances) and instead exposes global functions for registration, querying, and mod management.

## Usage example
```lua
-- Register a custom start location in your mod
AddStartLocation("my_custom_start", {
    name = "My Custom Start",
    location = "forest",
    start_setpeice = "MyCustomLayout",
    start_node = {"Forest", "SpiderForest"},
})

-- Retrieve all available start locations for the forest world
local locations = GetGenStartLocations("forest")
-- locations is an array of {text = string, data = string} pairs

-- Retrieve a specific start location definition by name
local start_data = GetStartLocation("my_custom_start")
-- start_data.start_node can be a string or array of strings
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  
This module is standalone and does not attach components to entities or interact with the ECS.

## Properties
This module does not define properties on a component instance (as it is not a component). Instead, it exposes internal module-level variables.

| Variable                 | Type     | Default Value                            | Description                                                                                     |
|--------------------------|----------|------------------------------------------|-------------------------------------------------------------------------------------------------|
| `startlocations`         | Table    | `{}`                                     | Stores built-in start location definitions keyed by unique string name.                        |
| `modstartlocations`      | Table    | `{}`                                     | Nested table mapping mod names to their registered start locations, keyed by location name.    |

## Main functions
### `GetGenStartLocations(world)`
* **Description:** Returns a list of available start locations, optionally filtered by `world` type (e.g., `"forest"`, `"cave"`). Used by the frontend to populate dropdown or tab options. Falls back to the `"default"` entry if no matching locations exist.
* **Parameters:**  
  `world` (string?|nil) — Optional world type filter. If `nil`, returns all start locations across all world types.
* **Returns:**  
  `table` — An array of tables with keys `text` (localized display name) and `data` (unique start location name/key).
* **Error states:** None.

### `GetStartLocation(name)`
* **Description:** Retrieves a deep copy of the start location definition with the given `name`, searching modded entries first, then built-in entries.
* **Parameters:**  
  `name` (string) — Unique identifier of the start location (e.g., `"caves"`, `"plus"`).
* **Returns:**  
  `table` — A table containing the start location configuration (e.g., `{name, location, start_setpeice, start_node}`), or `nil` if not found.
* **Error states:** Returns `nil` if no start location with `name` exists.

### `ClearModData(mod)`
* **Description:** Clears mod-provided start location data. If `mod` is `nil`, clears *all* mod data.
* **Parameters:**  
  `mod` (string?|nil) — Mod identifier to clear. If `nil`, resets the entire `modstartlocations` registry.
* **Returns:** Nothing.
* **Error states:** None.

### `RefreshWorldTabs()`
* **Description:** Forces the frontend world tabs to refresh their options—used after adding a mod start location to ensure UI updates. Only executes if `TheFrontEnd` is available.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Silent no-op if the frontend is not loaded or `ServerCreationScreen` is not active.

### `AddStartLocation(name, data)`
* **Description:** Registers a new built-in start location. Automatically delegates to `AddModStartLocation` if a mod is currently loading.
* **Parameters:**  
  `name` (string) — Unique identifier for the start location.  
  `data` (table) — Start location configuration (must contain `name`, `location`, `start_setpeice`, `start_node`).
* **Returns:** Nothing.
* **Error states:** Throws an `assert` error if a start location with `name` already exists (built-in or modded).

### `AddModStartLocation(mod, name, data)`
* **Description:** Registers a new mod-provided start location. Updates the frontend UI after registration.
* **Parameters:**  
  `mod` (string) — Mod identifier (must be non-nil).  
  `name` (string) — Unique identifier for the start location.  
  `data` (table) — Start location configuration.
* **Returns:** Nothing.
* **Error states:** Logs a mod error via `moderror` if `name` already exists; registration fails silently in that case.

## Events & listeners
This module does not listen to or dispatch game events. UI refresh (`RefreshWorldTabs`) is performed directly on the frontend screens, not via event system.

