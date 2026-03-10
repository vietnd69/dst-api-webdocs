---
id: cooking
title: Cooking
description: Centralizes cooking recipe registration, ingredient classification, and recipe selection logic for cookers in DST.
tags: [crafting, recipes, ingredients]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 5d243aa2
system_scope: crafting
---

# Cooking

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`cooking.lua` is a script that manages cooking recipe definitions, ingredient classification, and recipe resolution logic for cookers (e.g., `cookpot`, `portablecookpot`, `portablespicer`). It does not define a component but instead returns a module table with utility functions and data structures used by other parts of the game—particularly by the `cookpot` and `preparedfoods` systems. It reads ingredient definitions, registers recipes, and resolves weighted recipe selection based on provided ingredients.

## Usage example
```lua
local cooking = require "cooking"

-- Check if a prefab can be used as a cooking ingredient
if cooking.IsCookingIngredient("meat") then
    print("meat is an ingredient")
end

-- Resolve a recipe from a list of ingredient prefabs
local recipe_name, cooktime = cooking.CalculateRecipe("cookpot", {"meat", "carrot", "honey"})
print("Result:", recipe_name, "in", cooktime, "seconds")
```

## Dependencies & tags
**Components used:** None (this file is a pure data/module utility, not an ECS component).  
**Tags:** Not applicable.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `official_foods` | table | `{}` | Set of official (non-mod) food prefab names used as keys for quick lookup. |
| `cookerrecipes` | table | `{}` | Nested table mapping cooker names (e.g., `"cookpot"`) to recipe name → recipe table maps. |
| `cookbook_recipes` | table | `{}` | Nested table mapping cookbook categories (e.g., `"mod"`) to recipe name → recipe table maps (excludes `portablespicer`). |
| `recipe_cards` | table | `{}` | Flat list of `{recipe_name, cooker_name}` pairs used to populate the recipe card UI. |
| `ingredients` | table | `{}` | Map of ingredient prefab names to their metadata, including `tags` (e.g., `meat`, `fruit`) and optional prefixed forms (`_cooked`, `_dried`). |
| `MOD_COOKBOOK_CATEGORY` | string | `"mod"` | Constant string representing the category for mod-added recipes in the cookbook. |

## Main functions
### `AddCookerRecipe(cooker, recipe, is_mod_food)`
*   **Description:** Registers a cooking recipe for a specific cooker and populates global data structures accordingly.
*   **Parameters:**  
    `cooker` (string) — Name of the cooker (e.g., `"cookpot"`, `"portablespicer"`).  
    `recipe` (table) — Recipe definition table, expected to contain at least `name`, and optionally `test`, `priority`, `weight`, `cooktime`, and `no_cookbook`.  
    `is_mod_food` (boolean) — If `true`, marks the recipe as modded and adds it to the `"mod"` cookbook category.
*   **Returns:** Nothing.

### `AddIngredientValues(names, tags, cancook, candry)`
*   **Description:** Registers ingredient definitions for one or more prefabs, optionally adding `_cooked` and/or `_dried` variants.
*   **Parameters:**  
    `names` (table of strings) — List of prefab names to register as ingredients.  
    `tags` (table) — Key-value map of tag names (e.g., `"meat"`, `"fruit"`) to numeric values.  
    `cancook` (boolean, optional, default `false`) — If `true`, adds a `"_cooked"` variant with `precook` tag.  
    `candry` (boolean, optional, default `false`) — If `true`, adds a `"_dried"` variant with `dried` tag.
*   **Returns:** Nothing.

### `IsCookingIngredient(prefabname)`
*   **Description:** Checks whether a given prefab name is registered as a cooking ingredient.
*   **Parameters:**  
    `prefabname` (string) — Prefab name to check.
*   **Returns:** `true` if `prefabname` (or its alias) exists in `ingredients`, otherwise `false`.

### `GetRecipe(cooker, product)`
*   **Description:** Retrieves a specific recipe table by cooker and product name.
*   **Parameters:**  
    `cooker` (string) — Name of the cooker.  
    `product` (string) — Name of the recipe product (i.e., output prefab).
*   **Returns:** Recipe table (if found), otherwise `nil`.

### `GetCandidateRecipes(cooker, ingdata)`
*   **Description:** Finds all recipes for a given cooker that satisfy the `test` function against the provided ingredients.
*   **Parameters:**  
    `cooker` (string) — Name of the cooker.  
    `ingdata` (table) — Table with fields `names` (count map of ingredient prefabs) and `tags` (summed tag values), typically from `GetIngredientValues`.
*   **Returns:** Table of candidate recipe tables, sorted descending by `priority`; only highest-priority recipes are retained if multiple share top priority.

### `CalculateRecipe(cooker, names)`
*   **Description:** Selects a random recipe (weighted by `weight`) from the candidate recipes for the given ingredients.
*   **Parameters:**  
    `cooker` (string) — Name of the cooker.  
    `names` (table of strings) — List of ingredient prefab names.
*   **Returns:** Two values:  
    `name` (string) — Name of the chosen recipe product.  
    `cooktime` (number) — Cook time in seconds (defaults to `1` if not specified in recipe).  
*   **Error states:** If no candidates exist, returns `nil`.

### `GetIngredientValues(prefablist)`
*   **Description:** Converts a list of ingredient prefabs into aggregated name counts and tag sums, handling aliases and variant suffixes.
*   **Parameters:**  
    `prefablist` (table of strings) — List of ingredient prefab names.
*   **Returns:** Table with two keys:  
    `names` (table) — Map of prefab name → count.  
    `tags` (table) — Map of tag name → summed numeric value.

### `IsModCookerFood(prefab)`
*   **Description:** Checks whether a given prefab is a mod-added cooking product (not in `official_foods`).
*   **Parameters:**  
    `prefab` (string) — Prefab name to check.
*   **Returns:** `true` if mod-added, `false` otherwise.

### `HasModCookerFood()`
*   **Description:** Checks whether *any* mod has registered food recipes in the `"mod"` cookbook category.
*   **Parameters:** None.
*   **Returns:** `true` if `cookbook_recipes["mod"]` is non-`nil`, otherwise `false`.

## Events & listeners
None. This script is a utility module and does not interact with the game event system.