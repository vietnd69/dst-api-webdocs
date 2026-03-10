---
id: prefabs
title: Prefabs
description: Defines core data structures for registering and managing game prefabs and their associated assets.
tags: [prefab, asset, registration]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 13d22071
system_scope: entity
---

# Prefabs

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `prefabs.lua` file defines two core Lua classes: `Prefab` and `Asset`. These classes are used to declaratively register game entities (prefabs) and their required resources (assets) during mod initialization. The `Prefab` class holds metadata about an entity—including its name, creation function, assets, and dependencies—and automatically incorporates skin-related dependencies if defined in `PREFAB_SKINS`. The `Asset` class represents a single asset requirement (e.g., texture, sound, or animation file) with its type, path, and optional parameters.

This module forms the foundational layer for entity creation in DST—before an entity can be instantiated via `Prefab(name, ...)`, it must be registered using this system.

## Usage example
```lua
-- Define assets
local assets = {
    Asset("ANIM", "anim.zip"),
    Asset("SOUND", "sounds/foobar"),
}

-- Register a new prefab
local MyPrefab = Prefab("myprefab", function()
    local inst = CreateEntity()
    inst:AddTag("myprefab")
    return inst
end, assets)

-- Later, spawn the prefab
local entity = TheWorld:SpawnPrefab("myprefab")
```

## Dependencies & tags
**Components used:** None directly (this is a definition layer, not a runtime component).  
**Tags:** None identified.  
**External files used:** `prefabskins.lua` (imports skin dependency metadata).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `name` | string | — | The unique identifier for the prefab (path-stripped to remove legacy directory prefixes). |
| `desc` | string | `""` | Optional human-readable description (populated manually by modders). |
| `fn` | function | — | The factory function that constructs and returns the entity instance. |
| `assets` | table | `{}` | Array of `Asset` objects defining required resources. |
| `deps` | table | `{}` | Array of additional dependencies (e.g., prefab skins, referenced prefabs). |
| `force_path_search` | boolean | `false` | If `true`, forces the engine to search for assets using full paths rather than optimized lookups. |

## Main functions
### `Prefab(name, fn, assets, deps, force_path_search)`
* **Description:** Constructor for the `Prefab` class. Initializes metadata and automatically appends skin dependencies from `PREFAB_SKINS` if applicable.
* **Parameters:**  
  - `name` (string) — Unique identifier for the prefab (e.g., `"myprefab"`). Path segments are stripped to retain only the basename.  
  - `fn` (function) — Factory function that creates the entity instance (`inst`) and returns it.  
  - `assets` (table, optional) — List of `Asset` instances. Defaults to empty table if omitted.  
  - `deps` (table, optional) — List of additional dependencies. Defaults to empty table.  
  - `force_path_search` (boolean, optional) — Forces fallback path resolution. Defaults to `false`.  
* **Returns:** A new `Prefab` instance.

### `Asset(type, file, param)`
* **Description:** Constructor for the `Asset` class. Represents a single asset requirement for a prefab.
* **Parameters:**  
  - `type` (string) — Asset category (e.g., `"ANIM"`, `"SOUND"`, `"IMAGE"`, `"MINIMAP"`).  
  - `file` (string) — Relative path to the asset (e.g., `"anim/myanim.zip"`).  
  - `param` (string or number, optional) — Optional parameter (e.g., animation state name, atlas margin).  
* **Returns:** A new `Asset` instance.

### `Prefab:__tostring()`
* **Description:** String representation of the `Prefab` for debugging.
* **Parameters:** None.
* **Returns:** String in the format `"Prefab <name> - <desc>"`.

## Events & listeners
None.