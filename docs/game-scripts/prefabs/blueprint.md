---
id: blueprint
title: Blueprint
description: Represents a craftable item that teaches a random or specific recipe to players when used, with support for common and rare variants.
tags: [crafting, item, inventory, network]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8dc3428c
system_scope: crafting
---

# Blueprint

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `blueprint` prefab represents an in-game item that players can use to learn new recipes. It is typically generated as either a *common* blueprint (learning any available recipe) or a *rare* blueprint (which has special behavior, including hauntable interaction). The item integrates with the `teacher`, `named`, `inspectable`, `fuel`, `inventoryitem`, and `hauntable` components. Blueprints are created via factory functions (`MakeAnyBlueprint`, `MakeSpecificBlueprint`) and support persistence across saves.

## Usage example
```lua
-- Create a common blueprint that teaches a random available recipe
local common_bp = MakeAnyBlueprint()

-- Create a specific blueprint for "torch"
local torch_bp = MakeSpecificBlueprint("torch")()

-- Create a rare blueprint for "advanced_clay"
local rare_bp = MakeSpecificBlueprint("advanced_clay")()
rare_bp.is_rare = true
rare_bp.AnimState:SetBank("blueprint_rare")
rare_bp.AnimState:SetBuild("blueprint_rare")
rare_bp.components.inventoryitem:ChangeImageName("blueprint_rare")
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `erasablepaper`, `named`, `teacher`, `fuel`, `hauntable`.  
**Tags:** Adds `_named` internally during initialization; uses `MakeHauntableLaunch(inst)` internally (not direct tag manipulation by this file).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `recipetouse` | string or nil | `nil` | Name of the recipe the blueprint teaches. Set during creation and by hauntable reaction. |
| `is_rare` | boolean or nil | `nil` | Flag indicating if this blueprint is a rare variant (higher haunt chance, different assets). |

## Main functions
### `MakeAnyBlueprint()`
* **Description:** Creates and returns a common blueprint instance with a randomly selected teachable recipe. Selects from recipes unknown to all players first, otherwise falls back to known recipes. Only runs on the master simulation.
* **Parameters:** None.
* **Returns:** Entity instance (`inst`) representing the blueprint.
* **Error states:** Returns early on non-master clients (returns the base entity without recipe assignment).

### `MakeSpecificBlueprint(specific_item)`
* **Description:** Returns a factory function that, when invoked, creates a blueprint for a specific item. Rareness is inferred from the recipe's tech level (≥ 10 = rare).
* **Parameters:** `specific_item` (string) — the recipe name to bind to the blueprint.
* **Returns:** Function — a zero-argument factory that returns the blueprint instance.
* **Error states:** Recipe name may resolve to `"unknown"` if `GetValidRecipe(specific_item)` returns `nil` or `nounlock` is true.

### `OnHaunt(inst, haunter)`
* **Description:** Custom hauntable reaction. Attempts to change the blueprint's recipe to a new random one if haunted by a player. Only triggers for common blueprints, with a 50% chance per `TUNING.HAUNT_CHANCE_HALF`. The new recipe must be valid, unlearned by the haunter (but learnable), and from the same tab as the original recipe.
* **Parameters:** `inst` (Entity), `haunter` (Entity) — the player causing the haunt.
* **Returns:** `true` if the recipe was successfully changed; `false` otherwise.
* **Error states:** Returns `false` if haunt chance fails, blueprint is rare, or no suitable replacement recipe exists.

### `CanBlueprintRandomRecipe(recipe)`
* **Description:** Predicate to determine if a recipe is eligible to be assigned to a randomly generated blueprint. Excludes craftable stations, character-specific recipes, and recipes requiring `TECH.LOST`.
* **Parameters:** `recipe` (table) — a recipe definition.
* **Returns:** `true` if the recipe can appear on a blueprint; `false` otherwise.
* **Error states:** Always returns `false` for recipes with `nounlock`, `builder_tag`, or `TECH.LOST` level; also returns `false` if the recipe has no positive tech level entries.

### `CanBlueprintSpecificRecipe(recipe)`
* **Description:** Predicate to determine if a specific blueprint instance should be generated for a recipe (e.g., for tab-specific or named blueprints like `"war_blueprint"`). Excludes craftable stations and character-specific recipes. Requires at least one positive tech level.
* **Parameters:** `recipe` (table) — a recipe definition.
* **Returns:** `true` if a specific blueprint should be generated; `false` otherwise.
* **Error states:** Returns `false` for recipes with `nounlock`, `builder_tag`, or only `TECH.NONE` (all tech levels zero).

## Events & listeners
- **Listens to:** None directly.
- **Pushes:** None directly.

> **Note:** The `teacher` component’s `onteach` field is set to `OnTeach`, which fires the `learnrecipe` event on the learner entity when the blueprint is used to teach a recipe. This is the primary interaction event for the player-facing workflow.