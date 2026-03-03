---
id: teacher
title: Teacher
description: Teaches a specific recipe to a target entity by interacting with the Builder component.
tags: [crafting, teaching, interaction]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7870cd9f
system_scope: crafting
---

# Teacher

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Teacher` is a lightweight component designed to enable entities to teach recipes to other entities. It works by storing a single recipe name and invoking the `UnlockRecipe` function on a target's `builder` component when the `Teach` method is called. This component is typically attached to consumable or interactive items (e.g., scrolls, tutors, or NPCs) that grant craftable knowledge.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("teacher")
inst.components.teacher:SetRecipe("stoneaxe")
-- Later, teach the recipe to a player:
local success, reason = inst.components.teacher:Teach(player)
if success then
    print("Recipe unlocked!")
else
    print("Failed to teach:", reason)
end
```

## Dependencies & tags
**Components used:** `builder`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `recipe` | string? | `nil` | The name of the recipe to be taught. Set via `SetRecipe()`. |
| `onteach` | function? | `nil` | Optional callback function invoked after successful teaching; receives `(teacher_inst, target)` as arguments. |

## Main functions
### `SetRecipe(recipe)`
*   **Description:** Sets the recipe this Teacher instance will attempt to teach.
*   **Parameters:** `recipe` (string) - the name of a valid recipe (e.g., `"stoneaxe"`).
*   **Returns:** Nothing.

### `Teach(target)`
*   **Description:** Attempts to teach the stored recipe to the target entity. Validates the recipe, checks knowledge and learnability, and unlocks it if possible.
*   **Parameters:** `target` (entity) - the entity that will receive the recipe; must have the `builder` component.
*   **Returns:** `true` if the recipe was successfully taught and the Teacher entity was removed; `false` otherwise.
*   **Error states:**  
    - Returns `false, "KNOWN"` if the target already knows the recipe.  
    - Returns `false, "CANTLEARN"` if the target cannot learn the recipe (e.g., due to builder tag or skill requirements).  
    - Returns `false` and removes the Teacher entity if `recipe` is `nil`.

## Events & listeners
- **Pushes:** `remove` (implicit via `self.inst:Remove()`) — the Teacher entity destroys itself after successfully teaching a recipe.
