---
id: farmplantable
title: Farmplantable
description: Enables a seed or item to be planted into soil by spawning a plant prefab at the target's position.
tags: [farming, planting, world, item]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 19ff54ef
system_scope: world
---

# Farmplantable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Farmplantable` allows an entity (typically a seed) to be planted onto a valid soil target. It handles the logic of removing the seed, spawning the target plant prefab, positioning it correctly, and notifying the game of the planting action through events. The component is self-contained and does not rely on any other components internally.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("farmplantable")
inst.components.farmplantable.plant = "corn"
-- Later, when planting:
local success = inst.components.farmplantable:Plant(soil_entity, planter)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `plant` | string or function | `nil` | The prefab name (string) or a function that returns a prefab name, used to spawn the planted entity. Set externally after construction. |

## Main functions
### `Plant(target, planter)`
* **Description:** Attempts to plant the seed onto the given target entity. The target must have the `soil` tag; if successful, the seed is removed and a new plant prefab is spawned and positioned at the soil's location.
* **Parameters:**  
  - `target` (Entity) — the soil entity to plant on. Must have the `soil` tag.  
  - `planter` (Entity) — the entity performing the planting action (e.g., a player or tool).
* **Returns:**  
  `boolean` — `true` if planting succeeded, `false` otherwise (e.g., `plant` is `nil`, target lacks `soil` tag, or `plant_prefab` resolves to `nil`).
* **Error states:**  
  Returns `false` if `self.plant` is `nil`, if the target does not have the `soil` tag, or if the resolved `plant_prefab` is `nil`.

## Events & listeners
- **Listens to:** None  
- **Pushes:**  
  - `"on_planted"` on the spawned plant instance — passes `{ doer = planter, seed = self.inst, in_soil = true }`.  
  - `"itemplanted"` on `TheWorld` — passes `{ doer = planter, pos = pt }` at the planting location.
