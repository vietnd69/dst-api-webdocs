---
id: farmtiller
title: Farmtiller
description: Provides functionality to till soil at a given point in the world.
tags: [farming, soil, utility]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a9f30aa2
system_scope: world
---

# Farmtiller

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FarmTiller` is a utility component that enables tilling of soil at a specified world position. It is typically attached to entities (e.g., tools like the hoe) that interact with terrain to prepare farmland. The component delegates terrain validation and modification to the `World.Map` system.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("farmtiller")

local point = Vector3(10, 0, -5)
local success = inst.components.farmtiller:Till(point, player)
if success then
    -- soil was tilled successfully
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `Till(pt, doer)`
* **Description:** Attempts to till the soil at the specified world point. Validates the location using the world map, collapses the existing soil, spawns a `farm_soil` prefab, and optionally notifies the actor.
* **Parameters:**  
  `pt` (`Vector3`) — World position (x, y, z) where tilling should occur.  
  `doer` (`Entity` or `nil`) — The entity performing the tilling action; if provided, receives a `"tilling"` event.
* **Returns:** `true` if tilling succeeded, `false` otherwise.
* **Error states:** Returns `false` if `TheWorld.Map:CanTillSoilAtPoint()` returns `false` for the given coordinates.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:**  
  - `"tilling"` — Sent to `doer` only if `doer` is non-`nil`.
