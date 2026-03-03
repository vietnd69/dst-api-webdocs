---
id: shadowlevel
title: Shadowlevel
description: Manages the shadow level state of an entity by storing a base level and an optional dynamic level function.
tags: [shadow, entity, level]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9ee8e2dd
system_scope: entity
---

# Shadowlevel

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ShadowLevel` is a lightweight component that tracks and computes the current shadow level for an entity. It stores a default level and optionally accepts a dynamic function (`levelfn`) to compute the level at runtime based on the entity instance. When added, the component automatically adds the `"shadowlevel"` tag to the entity and removes it on removal.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("shadowlevel")

-- Use default static level
inst.components.shadowlevel:SetDefaultLevel(3)

-- Or define a dynamic level function
inst.components.shadowlevel:SetLevelFn(function(entity)
    return entity:HasTag("nighttime") and 5 or 1
end)

local level = inst.components.shadowlevel:GetCurrentLevel()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `"shadowlevel"` on construction; removes `"shadowlevel"` on removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity instance that owns this component. |
| `level` | number | `1` | The fallback static shadow level. |
| `levelfn` | function or `nil` | `nil` | Optional function that computes the level dynamically using `inst` as argument. |

## Main functions
### `SetDefaultLevel(level)`
* **Description:** Sets the fallback static level used when no dynamic level function is defined.
* **Parameters:** `level` (number) — the integer shadow level to store.
* **Returns:** Nothing.

### `SetLevelFn(fn)`
* **Description:** Assigns a function used to dynamically determine the current shadow level at runtime.
* **Parameters:** `fn` (function) — a function that accepts the entity instance and returns a number.
* **Returns:** Nothing.

### `GetCurrentLevel()`
* **Description:** Returns the current shadow level. If `levelfn` is defined, it is called and its result returned; otherwise, the static `level` is returned.
* **Parameters:** None.
* **Returns:** number — the computed or default shadow level.
* **Error states:** If `levelfn` is set but does not return a number, the behavior is undefined.

## Events & listeners
None identified
