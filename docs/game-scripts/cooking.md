---
id: cooking
title: Cooking
description: Central registry and calculation system for all cooking recipes, ingredients, and cookbook data in Don't Starve Together.
tags: [cooking, food, recipes, crafting]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: data_config
source_hash: 8565f5d1
system_scope: crafting
---

# Cooking

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`cooking.lua` defines the global cooking system that tracks all recipes, ingredients, and cookbook entries for cookers (cookpot, portablecookpot, archive_cookpot, portablespicer). It provides functions to register new recipes and ingredients, query valid recipes for given ingredients, and calculate final cooking results. This file is a configuration source — it is not a component and does not attach to entities; it is required by cooking-related components and prefabs that need to resolve recipe outcomes.

## Usage example
```lua
local cooking = require("cooking")

-- Check if a prefab is a valid cooking ingredient
if cooking.IsCookingIngredient("meat") then
    print("meat can be used in cooking")
end

-- Get a specific recipe by cooker and product name
local recipe = cooking.GetRecipe("cookpot", "meatballs")

-- Check if any mod cooker foods are registered
local has_mod_foods = cooking.HasModCookerFood()

-- Calculate what recipe will be produced from given ingredients
local product, cooktime = cooking.CalculateRecipe("cookpot", {"meat", "meat", "carrot", "ice"})

-- Access exported tables directly
local all_recipes = cooking.recipes["cookpot"]
local all_ingredients = cooking.ingredients
```

## Dependencies & tags
**External dependencies:**
- `tuning` -- global balance constants (imported but not directly used in exported functions)
- `prefabs/oceanfishdef` -- provides ocean fish definitions for ingredient registration
- `preparedfoods` -- standard cookpot recipes loaded into cookerrecipes table
- `preparedfoods_warly` -- Warly's portable cookpot exclusive recipes
- `spicedfoods` -- portable spicer recipes
- `preparednonfoods` -- non-food cooking products (e.g., soap, fuels)

**Components used:** None identified

**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `official_foods` | table | `{}` | Tracks prefab names of official (non-mod) foods. Used by `IsModCookerFood()` to distinguish mod-added recipes. |
| `cookerrecipes` | table | `{}` | Maps cooker names (`"cookpot"`, `"portablecookpot"`, `"archive_cookpot"`, `"portablespicer"`) to tables of recipe definitions keyed by product name. |
| `cookbook_recipes` | table | `{}` | Maps cookbook category names to recipe tables. Excludes recipes with `no_cookbook = true` and portablespicer recipes. |
| `recipe_cards` | table | `{}` | Array of recipe card entries `{recipe_name = name, cooker_name = cooker}`. Used for cookbook UI display. |
| `ingredients` | table | `{}` | Maps ingredient prefab names to tag value tables. Includes cooked/dried variants when `cancook`/`candry` flags are set. |
| `aliases` | table (local) | `{...}` | Maps inconsistent prefab naming conventions (e.g., `cookedsmallmeat` → `smallmeat_cooked`). Used internally by `IsCookingIngredient` and `GetIngredientValues` for name resolution. |
| `MOD_COOKBOOK_CATEGORY` | constant (local) | `"mod"` | Category name used for mod-added recipes in the cookbook. |

## Main functions




### `IsModCookerFood(prefab)`
* **Description:** Checks if a prefab name corresponds to a mod-added cooking product (not in official_foods table).
* **Parameters:** `prefab` -- string prefab name of cooking product
* **Returns:** `true` if mod-added, `false` if official food or unknown
* **Error states:** None.

### `HasModCookerFood()`
* **Description:** Checks if any mod cooker foods are currently registered in the cookbook.
* **Parameters:** None
* **Returns:** `true` if `cookbook_recipes["mod"]` exists, `false` otherwise
* **Error states:** None.



### `IsCookingIngredient(prefabname)`
* **Description:** Checks if a prefab name is registered as a valid cooking ingredient (exists in `ingredients` table after alias resolution).
* **Parameters:** `prefabname` -- string prefab name to check
* **Returns:** `true` if valid ingredient, `false` otherwise
* **Error states:** None.


### `GetRecipe(cooker, product)`
* **Description:** Retrieves a specific recipe definition by cooker name and product name.
* **Parameters:**
  - `cooker` -- string cooker name
  - `product` -- string product prefab name
* **Returns:** Recipe table or `nil` if not found
* **Error states:** None.

### `GetIngredientValues(prefablist)`
* **Description:** Aggregates ingredient tags and counts from a list of prefab names. Resolves aliases and sums tag values for matching ingredients.
* **Parameters:** `prefablist` -- table array of ingredient prefab names
* **Returns:** Table with `tags` (table of tag name to value sums) and `names` (table of prefab name to count).
* **Error states:** None.

### `GetCandidateRecipes(cooker, ingdata)`
* **Description:** Finds all potentially valid recipes matching given ingredients. Filters recipes by testing against ingredient names and tags, then sorts by priority and returns highest-priority candidates.
* **Parameters:**
  - `cooker` -- string cooker name
  - `ingdata` -- table from GetIngredientValues with `tags` and `names` fields
* **Returns:** Array of recipe tables sorted by priority (highest first). Returns empty table if no matches.
* **Error states:** None.

### `CalculateRecipe(cooker, names)`
* **Description:** Determines the final cooking result from a list of ingredient prefab names. Gets ingredient values, finds candidate recipes, then uses weighted random selection based on recipe `weight` values.
* **Parameters:**
  - `cooker` -- string cooker name
  - `names` -- table array of ingredient prefab names
* **Returns:** `product_name` (string or nil), `cooktime` (number or nil). When no recipes match, returns nil, nil (no explicit return in source when candidates table is empty).
* **Error states:** None.

### `AddCookerRecipe(cooker, recipe, is_mod_food)`
* **Description:** Registers a recipe definition for a specific cooker. Adds the recipe to `cookerrecipes` table and optionally to `cookbook_recipes` and `official_foods` based on `is_mod_food` flag.
* **Parameters:**
  - `cooker` -- string cooker name (e.g., "cookpot", "portablecookpot", "archive_cookpot", "portablespicer")
  - `recipe` -- table recipe definition with fields: `name` (string), `test` (function), `priority` (number), `weight` (number), `cooktime` (number), `no_cookbook` (boolean), `card_def` (table)
  - `is_mod_food` -- boolean, if true sets `cookbook_category` to "mod" and skips official_foods registration
* **Returns:** None
* **Error states:** Errors if `cooker` or `recipe` is nil (no nil guards in source — `cookerrecipes[cooker]` and `recipe.name` will nil-dereference).

### `AddIngredientValues(names, tags, cancook, candry)`
* **Description:** Registers ingredient prefab names with tag values for cooking system. Creates entries in `ingredients` table and optionally generates cooked/dried variants when `cancook`/`candry` flags are set.
* **Parameters:**
  - `names` -- table array of ingredient prefab names
  - `tags` -- table mapping tag names to numeric values (e.g., `{meat=1, veggie=0.5}`)
  - `cancook` -- boolean, if true creates `prefab_cooked` variant with `precook` tag
  - `candry` -- boolean, if true creates `prefab_dried` variant with `dried` tag
* **Returns:** None
* **Error states:** Errors if `names` or `tags` is nil (no nil guards in source — `pairs(names)` and `pairs(tags)` will error on nil).

## Events & listeners
None.