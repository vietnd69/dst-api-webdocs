---
id: teacher
title: Teacher
description: This component enables an entity to teach a specific crafted recipe to a player or builder entity.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 7870cd9f
---

# Teacher

## Overview
The `Teacher` component provides functionality for an entity (typically a consumable or temporary object) to grant a predefined recipe to a target entity that possesses a `builder` component. It validates the target's ability to learn the recipe and unlocks it upon successful teaching, then removes itself.

## Dependencies & Tags
- Requires the target entity to have the `builder` component for recipe unlocking.
- No tags are added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in) | Reference to the entity instance that owns this component. |
| `recipe` | `string` or `nil` | `nil` | The name of the recipe to be taught. Set via `SetRecipe`. |

## Main Functions
### `SetRecipe(recipe)`
* **Description:** Assigns the recipe to be taught by this component.
* **Parameters:**  
  `recipe` (string) — The identifier (recipe name) of the recipe to teach.

### `Teach(target)`
* **Description:** Attempts to teach the stored recipe to the specified target entity. Returns a boolean indicating success and an optional status string (`KNOWN` or `CANTLEARN`) on failure. Removes the teacher entity upon success.
* **Parameters:**  
  `target` (Entity) — The entity to teach the recipe to. Must have a `builder` component.

## Events & Listeners
- Listens for custom event `onteach` (optional callback) — invoked with `self.inst` and `target` as arguments if defined and teaching succeeds.
- Triggers `self.inst:Remove()` after successful teaching or if no recipe is set.
- Does not use standard event listeners (`inst:ListenForEvent`) or push custom events via `inst:PushEvent`.