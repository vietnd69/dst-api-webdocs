---
id: tacklesketch
title: Tacklesketch
description: Provides a prototype for teaching a tackle sketch recipe to a crafting station when consumed or applied.
tags: [crafting, item, recipe]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: aee4ad16
system_scope: crafting
---

# Tacklesketch

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Tacklesketch` is a simple component attached to sketch items that represent tackle designs (e.g., fish trap or net sketches). When used, it transfers a specific recipe to the target's `craftingstation` component and removes itself from the entity. It ensures the associated recipe is only added once via `LearnItem`, and notifies the target that a new tackle sketch has been learned.

## Usage example
```lua
local inst = Prefab("tackle_sketch_fancy_net")
inst:AddComponent("tacklesketch")

-- Later, when teaching the recipe:
local target = GetPlayer()
inst.components.tacklesketch:Teach(target)
```

## Dependencies & tags
**Components used:** `craftingstation` (via `target.components.craftingstation`)
**Tags:** Adds `"tacklesketch"` on initialization; removes it on entity removal.

## Properties
No public properties.

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Removes the `"tacklesketch"` tag when the component is removed from the entity.
* **Parameters:** None.
* **Returns:** Nothing.

### `Teach(target)`
* **Description:** Teaches the recipe associated with this sketch to the target entity's `craftingstation`. It uses the sketch's specific prefab and recipe name to register the recipe, pushes a `"onlearnednewtacklesketch"` event on the target, and removes the sketch entity.
* **Parameters:**  
  `target` (Entity) – The entity whose `craftingstation` should learn the recipe.
* **Returns:** Nothing.
* **Error states:** Assumes `target.components.craftingstation` exists. If missing, this will raise a runtime error.

## Events & listeners
- **Pushes:** `"onlearnednewtacklesketch"` on the `target` entity after successfully teaching the recipe.
