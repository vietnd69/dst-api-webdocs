---
id: cooking
title: Cooking
description: Provides cooking recipe registration, ingredient value tracking, and recipe calculation utilities for all cooker entities.
tags: [cooking, recipes, ingredients, utility]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 5d243aa2
system_scope: crafting
---

# Cooking

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
The `cooking` module provides central utilities for managing cooking recipes and ingredient values across all cooker entities in Don't Starve Together. It handles recipe registration, ingredient tag calculations, and deterministic recipe selection based on ingredient combinations. This module is imported by cooker prefabs and cooking-related systems to determine what food product results from combining specific ingredients.

## Usage example
```lua
local cooking = require("cooking")

-- Check if a prefab is a valid cooking ingredient
if cooking.IsCookingIngredient("meat") then
    -- Get ingredient values for a list of prefabs
    local ingdata = cooking.GetIngredientValues({"meat", "carrot", "berries"})
    
    -- Find candidate recipes for a cookpot
    local candidates = cooking.GetCandidateRecipes("cookpot", ingdata)
    
    -- Calculate the final recipe that will be produced
    local recipe_name, cooktime = cooking.CalculateRecipe("cookpot", {"meat", "carrot", "berries"})
end
```

## Dependencies & tags
**Components used:** None (this is a utility module, not an entity component)
**Tags:** None identified (module does not add or check entity tags)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `recipes` | table | `{}` | Contains all registered recipes organized by cooker type. |
| `ingredients` | table | `{}` | Contains ingredient values and tags for all valid cooking ingredients. |
| `cookbook_recipes` | table | `{}` | Recipes organized by cookbook category for UI display. |
| `recipe_cards` | table | `{}` | Recipe card definitions for cookbook visualization. |
| `official_foods` | table | `{}` | Tracks which foods are official (non-mod) recipes. |

## Main functions
### `AddCookerRecipe(cooker, recipe, is_mod_food)`
*   **Description:** Registers a new recipe for a specific cooker entity. Called during initialization to populate the recipe database.
*   **Parameters:** `cooker` (string) - the cooker prefab name (e.g., `cookpot`, `portablecookpot`). `recipe` (table) - recipe definition table containing name, test function, priority, weight, and other properties. `is_mod_food` (boolean) - whether this recipe comes from a mod.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `AddIngredientValues(names, tags, cancook, candry)`
*   **Description:** Registers ingredient values and tags for one or more prefabs. Automatically creates cooked and dried variants if flags are enabled.
*   **Parameters:** `names` (table) - list of prefab names to register. `tags` (table) - key-value pairs of tag names and their values (e.g., `{meat=1, veggie=0.5}`). `cancook` (boolean) - whether to create a `_cooked` variant. `candry` (boolean) - whether to create a `_dried` variant.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `AddRecipeCard(cooker, recipe)`
*   **Description:** Registers a recipe card for cookbook UI display.
*   **Parameters:** `cooker` (string) - the cooker prefab name. `recipe` (table) - recipe definition with `name` property.
*   **Returns:** Nothing.

### `IsCookingIngredient(prefabname)`
*   **Description:** Checks whether a prefab name is a valid cooking ingredient.
*   **Parameters:** `prefabname` (string) - the prefab name to check.
*   **Returns:** `boolean` - `true` if the prefab is a registered cooking ingredient, `false` otherwise.
*   **Error states:** Handles alias mapping for inconsistent naming conventions.

### `IsModCookerFood(prefab)`
*   **Description:** Checks whether a food product comes from a mod rather than official game content.
*   **Parameters:** `prefab` (string) - the food product prefab name.
*   **Returns:** `boolean` - `true` if the food is from a mod, `false` if official.
*   **Error states:** Returns `false` if the mod is unloaded (cannot test against unloaded mod data).

### `HasModCookerFood()`
*   **Description:** Checks whether any mod cooking foods are currently registered.
*   **Parameters:** None.
*   **Returns:** `boolean` - `true` if mod cooking foods exist, `false` otherwise.

### `IsModCookingProduct(cooker, name)`
*   **Description:** Checks whether a specific recipe product for a cooker comes from an enabled mod.
*   **Parameters:** `cooker` (string) - the cooker prefab name. `name` (string) - the recipe product name.
*   **Returns:** `boolean` - `true` if the product is from an enabled mod, `false` otherwise.
*   **Error states:** Iterates through all enabled mods; may be performance-intensive with many mods.

### `GetIngredientValues(prefablist)`
*   **Description:** Calculates aggregated ingredient tags and counts for a list of prefabs.
*   **Parameters:** `prefablist` (table) - list of prefab names to analyze.
*   **Returns:** `table` - contains `tags` (aggregated tag values) and `names` (prefab counts).
*   **Error states:** Returns empty tables if no valid ingredients found.

### `GetRecipe(cooker, product)`
*   **Description:** Retrieves the recipe definition for a specific product from a specific cooker.
*   **Parameters:** `cooker` (string) - the cooker prefab name. `product` (string) - the recipe product name.
*   **Returns:** `table` or `nil` - the recipe definition table if found, `nil` otherwise.
*   **Error states:** Returns `nil` if no recipes registered for that cooker or product not found.

### `GetCandidateRecipes(cooker, ingdata)`
*   **Description:** Finds all potentially valid recipes for a given set of ingredients, sorted by priority.
*   **Parameters:** `cooker` (string) - the cooker prefab name. `ingdata` (table) - ingredient data from `GetIngredientValues`, containing `names` and `tags`.
*   **Returns:** `table` - list of candidate recipe tables sorted by priority (highest first). Returns top candidates only if multiple exist with same priority.
*   **Error states:** Returns empty table if no valid recipes found.

### `CalculateRecipe(cooker, names)`
*   **Description:** Determines the final recipe that will be produced from a set of ingredients using weighted random selection.
*   **Parameters:** `cooker` (string) - the cooker prefab name. `names` (table) - list of ingredient prefab names.
*   **Returns:** `string, number` - recipe name and cook time in seconds. Returns `nil` if no valid recipe found.
*   **Error states:** Returns `nil` if no candidate recipes match the ingredients. Uses `math.random()` for weighted selection among candidates.

## Events & listeners
Not applicable (this is a utility module, not an entity component with event listeners)