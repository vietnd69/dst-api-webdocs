---
id: recipe
title: Recipe
description: Defines the Recipe and Ingredient classes for managing crafting recipes, tech tree requirements, and deconstruction data in the crafting system.
tags: [crafting, recipes, tech-tree]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: root
source_hash: c5bbfcd1
system_scope: crafting
---

# Recipe

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
`recipe.lua` defines the core data structures for the crafting system. It provides the `Ingredient` class for representing individual recipe costs, the `Recipe` class for full crafting recipes with tech tree requirements, and helper functions for recipe validation and registration. Recipes are stored in the global `AllRecipes` table and are used by the crafting UI and builder components to determine what players can craft. This file also handles deconstruction recipes and builder-tagged recipes for specialized crafting restrictions.

## Usage example
```lua
require("recipe") -- Loads Recipe and Ingredient globals

-- Create an ingredient
local log_ingredient = Ingredient(INGREDIENT.LOG, 2)

-- Create a recipe with tech tree requirement
local axe_recipe = Recipe("axe", 
    {log_ingredient, Ingredient(INGREDIENT.FLINT, 1)}, 
    RECIPETABS.TOOLS, 
    TECH.SCIENCE_ONE, 
    "axe_placer"
)

-- Check if recipe is valid in current game mode
if IsRecipeValid("axe") then
    print("Axe recipe is available")
end

-- Get a validated recipe
local valid_recipe = GetValidRecipe("axe")
```

## Dependencies & tags
**External dependencies:** `class` -- Class definition framework, `util` -- Utility functions (resolvefilepath), `techtree` -- TechTree.Create() for tech level requirements.
**Components used:** None identified (this is a data/class file, not an entity component)
**Tags:** None identified (recipe definitions do not directly manipulate entity tags)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `AllRecipes` | table | `{}` | Global table storing all registered recipes keyed by recipe name. |
| `AllBuilderTaggedRecipes` | table | `{}` | Global table storing recipes that require specific builder tags or skills. |
| `Ingredient.type` | constant | — | The ingredient type constant (e.g., `INGREDIENT.LOG`, `CHARACTER_INGREDIENT.HEALTH`). |
| `Ingredient.amount` | number | — | Quantity of this ingredient required. |
| `Ingredient.atlas` | string or nil | `nil` | Path to the inventory atlas image for this ingredient. |
| `Ingredient.image` | string or nil | `nil` | Image override for the ingredient icon. |
| `Ingredient.deconstruct` | boolean or nil | `nil` | Whether this ingredient is returned on deconstruction. |
| `Recipe.name` | string | — | Unique identifier name for this recipe. |
| `Recipe.ingredients` | table | `{}` | Array of standard `Ingredient` objects required for crafting. |
| `Recipe.character_ingredients` | table | `{}` | Array of character-specific ingredients (health/sanity costs). |
| `Recipe.tech_ingredients` | table | `{}` | Array of tech tree ingredients (prototyper requirements). |
| `Recipe.level` | TechTree node | — | Tech tree requirement created via `TechTree.Create(level)`. |
| `Recipe.placer` | string or nil | `nil` | Prefab name to spawn when this recipe is crafted (for structures). |
| `Recipe.product` | string | `name` | The prefab name of the item produced by this recipe. |
| `Recipe.tab` | table or nil | `nil` | Crafting tab category (deprecated in favor of filter system). |
| `Recipe.image` | string or function or nil | `nil` | Image path or function for the recipe icon in the crafting menu. |
| `Recipe.atlas` | string or nil | `nil` | Atlas path for the recipe icon. |
| `Recipe.builder_tag` | string or nil | `nil` | Tag required on the builder entity to craft this recipe. |
| `Recipe.build_mode` | constant | `BUILDMODE.LAND` | Where this can be built (LAND, WATER, etc.). |
| `Recipe.numtogive` | number | `1` | Quantity of items produced per craft. |
| `Recipe.nounlock` | boolean | `false` | If true, recipe does not unlock when prototyped. |
| `Recipe.is_deconstruction_recipe` | boolean | `false` | If true, this is a deconstruction recipe rather than a craft recipe. |
| `Recipe.rpc_id` | number | auto-generated | Hash-based RPC identifier for network synchronization. |

## Main functions
### `Ingredient(ingredienttype, amount, atlas, deconstruct, imageoverride)`
*   **Description:** Constructor for creating an ingredient object representing a cost in a recipe.
*   **Parameters:**
    *   `ingredienttype` (constant) — Type of ingredient (e.g., `INGREDIENT.LOG`, `CHARACTER_INGREDIENT.HEALTH`, `TECH_INGREDIENT.SCIENCE`).
    *   `amount` (number) — Quantity required. Health and sanity costs must be multiples of 5.
    *   `atlas` (string or nil) — Optional path to the inventory atlas image.
    *   `deconstruct` (boolean or nil) — Whether this ingredient is returned when the item is deconstructed.
    *   `imageoverride` (string or nil) — Optional image path override.
*   **Returns:** `Ingredient` instance.
*   **Error states:** Asserts if health/sanity ingredient amounts are not multiples of 5.

### `Recipe(name, ingredients, tab, level, placer_or_more_data, min_spacing, nounlock, numtogive, builder_tag, atlas, image, testfn, product, build_mode, build_distance)`
*   **Description:** Constructor for creating a crafting recipe. Registers the recipe in `AllRecipes` automatically.
*   **Parameters:**
    *   `name` (string) — Unique recipe identifier.
    *   `ingredients` (table) — Array of `Ingredient` objects.
    *   `tab` (table or nil) — Crafting tab (deprecated).
    *   `level` (TECH constant) — Tech tree requirement.
    *   `placer_or_more_data` (string or table) — Either a placer prefab name string, or a table with `placer` and additional config options.
    *   `min_spacing` (number or nil) — Minimum spacing for placement (default `3.2`).
    *   `nounlock` (boolean or nil) — Whether recipe unlocks on prototype (default `false`).
    *   `numtogive` (number or nil) — Quantity produced (default `1`).
    *   `builder_tag` (string or nil) — Tag required on builder entity.
    *   `atlas` (string or nil) — Icon atlas path.
    *   `image` (string or function or nil) — Icon image path or function.
    *   `testfn` (function or nil) — Custom placer test function.
    *   `product` (string or nil) — Output prefab name (defaults to `name`).
    *   `build_mode` (constant or nil) — Build mode (default `BUILDMODE.LAND`).
    *   `build_distance` (number or nil) — Build distance (default `1`).
*   **Returns:** `Recipe` instance.
*   **Error states:** Prints warning if called from a mod (should use `AddRecipe` instead). Hash collision error if recipe name conflicts with existing `rpc_id`.

### `Recipe2(name, ingredients, tech, config)`
*   **Description:** Simplified Recipe subclass constructor that accepts a config table for optional parameters.
*   **Parameters:**
    *   `name` (string) — Recipe identifier.
    *   `ingredients` (table) — Array of `Ingredient` objects.
    *   `tech` (TECH constant) — Tech tree requirement.
    *   `config` (table or nil) — Optional table containing any Recipe constructor parameters (e.g., `min_spacing`, `builder_tag`, `product`).
*   **Returns:** `Recipe2` instance (subclass of `Recipe`).
*   **Error states:** None.

### `DeconstructRecipe(name, return_ingredients, config)`
*   **Description:** Constructor for deconstruction recipes that define what ingredients are returned when an item is deconstructed.
*   **Parameters:**
    *   `name` (string) — Recipe identifier.
    *   `return_ingredients` (table) — Array of `Ingredient` objects returned on deconstruction.
    *   `config` (table or nil) — Optional config table for additional parameters.
*   **Returns:** `DeconstructRecipe` instance.
*   **Error states:** None.

### `IsCharacterIngredient(ingredienttype)`
*   **Description:** Checks if an ingredient type is a character-specific ingredient (health or sanity cost).
*   **Parameters:**
    *   `ingredienttype` (constant) — The ingredient type to check.
*   **Returns:** `boolean` — `true` if the ingredient is a character ingredient.
*   **Error states:** None.

### `IsTechIngredient(ingredienttype)`
*   **Description:** Checks if an ingredient type is a tech tree ingredient (prototyper requirement).
*   **Parameters:**
    *   `ingredienttype` (constant) — The ingredient type to check.
*   **Returns:** `boolean` — `true` if the ingredient is a tech ingredient.
*   **Error states:** None.

### `GetValidRecipe(recname)`
*   **Description:** Retrieves a recipe if it is valid for the current game mode and any special event requirements are met.
*   **Parameters:**
    *   `recname` (string) — Recipe name to look up.
*   **Returns:** `Recipe` or `nil` — The recipe object if valid, `nil` otherwise.
*   **Error states:** Returns `nil` if `TheNet` is unavailable, recipe is deconstruction-only, or special event requirement is not active.

### `IsRecipeValid(recname)`
*   **Description:** Convenience function to check if a recipe is valid without retrieving the full recipe object.
*   **Parameters:**
    *   `recname` (string) — Recipe name to check.
*   **Returns:** `boolean` — `true` if recipe is valid and available.
*   **Error states:** None.

### `RemoveAllRecipes()`
*   **Description:** Clears all registered recipes from `AllRecipes` and `AllBuilderTaggedRecipes`. Used for world regeneration or testing.
*   **Parameters:** None.
*   **Returns:** None.
*   **Error states:** None.

### `Recipe:GetAtlas()`
*   **Description:** Resolves and returns the atlas path for the recipe icon, caching the result.
*   **Parameters:** None.
*   **Returns:** `string` — Path to the atlas file.
*   **Error states:** None.

### `Recipe:SetModRPCID()`
*   **Description:** Generates and assigns a hash-based RPC ID for the recipe. Checks for collisions with existing recipes.
*   **Parameters:** None.
*   **Returns:** None (sets `self.rpc_id`).
*   **Error states:** Prints error if hash collision detected with another recipe name.

## Events & listeners
None. This file defines data classes and does not interact with the event system directly.