---
id: recipe
title: Recipe
description: Manages crafting recipes, including ingredients, unlocks, and deconstruction logic.
tags: [crafting, inventory, network]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 55b9b413
system_scope: crafting
---

# Recipe

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `recipe.lua` module defines the core data structures and utility functions for crafting recipes in DST. It provides two main classes: `Ingredient` for declaring recipe components, and `Recipe` (and its subclasses `Recipe2` and `DeconstructRecipe`) for defining craftable items, their unlock requirements, and associated metadata. Recipes are globally registered in `AllRecipes` and filtered by builder tags or skill levels. The module depends on `techtree.lua` for tier/tech-level management.

## Usage example
```lua
local Recipe = require("recipe")
local TECH = require("tech")

local myrecipe = Recipe(
    "my_craftable",
    {
        Ingredient("Twig", 2),
        Ingredient("Flint", 1),
        Ingredient(CHARACTER_INGREDIENT.HEALTH, 5),
    },
    nil, -- tab (deprecated)
    TECH.SCIENCE_ONE, -- tech level
    {placer = "wall" },
    3.2, -- min_spacing
    false, -- nounlock
    1, -- numtogive
    nil, -- builder_tag
    "images/inventoryimages.xml",
    "my_craftable.tex",
    nil, -- testfn
    "my_craftable", -- product
    BUILDMODE.LAND, -- build_mode
    1 -- build_distance
)
```

## Dependencies & tags
**Components used:** None (this is a data module, not a component).
**Tags:** None added or removed by the module itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `type` | `CHARACTER_INGREDIENT` or `TECH_INGREDIENT` or string | — | Ingredient type (e.g., `"Twig"`, `CHARACTER_INGREDIENT.HEALTH`). |
| `amount` | number | — | Quantity required. For character ingredients, must be a multiple of `CHARACTER_INGREDIENT_SEG`. |
| `atlas` | string | `nil` | Path to atlas XML for ingredient icons. |
| `image` | string | inferred from `type` | Image filename (e.g., `"health.tex"`). |
| `deconstruct` | boolean | `nil` | Unused or legacy field (no usage found). |
| `name` | string | — | Unique identifier for the recipe. |
| `product` | string | recipe `name` | The prefab name produced by the recipe. |
| `ingredients` | table | `{}` | Non-character, non-tech ingredients. |
| `character_ingredients` | table | `{}` | Ingredients tied to player stats (health/sanity). |
| `tech_ingredients` | table | `{}` | Ingredients tied to tech/progression (e.g., tech levels). |
| `tab` | any | `nil` | Deprecated field for UI grouping. |
| `nameoverride` | string | `nil` | Custom display name in crafting UI. |
| `description` | string | `nil` | Custom description in crafting UI. |
| `level` | `TechTree.Level` | `TechTree.Create(level)` | Unlock tech level for the recipe. |
| `placer` | function or string | `nil` | Function or string hint for how to place the item. |
| `min_spacing` | number | `3.2` | Minimum distance required between placed instances. |
| `nounlock` | boolean | `false` | If true, recipe is always craftable (not hidden). |
| `builder_tag` | string | `nil` | Restricts recipe visibility to builders with this tag (e.g., `"waxwell"`). |
| `builder_skill` | string | `nil` | Restricts recipe to builders with this skill (e.g., `"waxwell"`). |
| `no_builder_tag` | boolean | `nil` | Exclude builders with the specified tag. |
| `no_builder_skill` | boolean | `nil` | Exclude builders with the specified skill. |
| `filter` | any | `nil` | Custom filtering function or value (used by some mod systems). |
| `layeredimagefn` | function | `nil` | For layered image generation (e.g., outfits). |
| `imagefn` | function | `nil` | Dynamic image function. |
| `is_deconstruction_recipe` | boolean | `false` | True for deconstruction recipes only. |

## Main functions
### `Ingredient(type, amount, atlas, deconstruct, imageoverride)`
* **Description:** Constructor for an `Ingredient`. Validates character ingredient amounts (must be multiples of `CHARACTER_INGREDIENT_SEG = 5`) and stores recipe input data.
* **Parameters:**
  * `type` (string or enum) — Ingredient type; if `CHARACTER_INGREDIENT.HEALTH` or `.SANITY`, must be multiple of 5.
  * `amount` (number) — Quantity required.
  * `atlas` (string or `nil`) — Optional custom atlas path.
  * `deconstruct` (any) — Unused (deprecated).
  * `imageoverride` (string or `nil`) — Optional custom image filename.
* **Returns:** `Ingredient` instance.

### `GetAtlas()`
* **Description:** Resolves and caches the ingredient’s atlas path if not already set; otherwise returns cached value.
* **Parameters:** None.
* **Returns:** `string` — Atlas path.

### `GetImage()`
* **Description:** Returns the ingredient’s image filename, defaulting to `type..".tex"` if not explicitly overridden.
* **Parameters:** None.
* **Returns:** `string` — Image filename.

### `Recipe(name, ingredients, tab, level, placer_or_more_data, ...)`
* **Description:** Main constructor for craftable items. Parses ingredients into categorized tables, registers to `AllRecipes`, and performs mod post-initialization hooks.
* **Parameters:**
  * `name` (string) — Unique recipe identifier.
  * `ingredients` (table of `Ingredient`) — List of required ingredients.
  * `tab` (any) — Deprecated UI grouping field.
  * `level` (any) — Tech level required to unlock the recipe (processed by `TechTree.Create`).
  * `placer_or_more_data` (function/string or table) — Placer hint or `more_data` table with keys like `nameoverride`, `description`, `canbuild`, `builder_tag`, etc.
  * `min_spacing`, `nounlock`, `numtogive`, `builder_tag`, `atlas`, `image`, `testfn`, `product`, `build_mode`, `build_distance` — Optional overrides (see class definition).
* **Returns:** `Recipe` instance.
* **Error states:** Prints a deprecation warning to console if called directly from mod code (use `AddRecipe()` in `modmain.lua` instead).

### `GetValidRecipe(recname)`
* **Description:** Validates that a recipe is available for the current game mode and any special events. Excludes deconstruction recipes.
* **Parameters:** `recname` (string) — Recipe name.
* **Returns:** `Recipe` instance or `nil`.

### `IsRecipeValid(recname)`
* **Description:** Convenience wrapper for `GetValidRecipe()` — returns `true` if the recipe exists and is valid.
* **Parameters:** `recname` (string) — Recipe name.
* **Returns:** `boolean`.

### `RemoveAllRecipes()`
* **Description:** Resets all recipe collections (`AllRecipes`, `AllBuilderTaggedRecipes`) and the internal recipe counter.
* **Parameters:** None.
* **Returns:** Nothing.

### `Recipe2(name, ingredients, tech, config)`
* **Description:** Enhanced constructor with an optional `config` table for structured parameter passing. Calls `Recipe._ctor` internally.
* **Parameters:**
  * `name`, `ingredients`, `tech`, `config` (see `Recipe` constructor).
* **Returns:** `Recipe2` instance (subclass of `Recipe`).
* **Note:** Sets `is_deconstruction_recipe` to `false`.

### `DeconstructRecipe(name, return_ingredients, config)`
* **Description:** Specialized constructor for deconstruction recipes. Always unlocks (`nounlock = true`) and sets `is_deconstruction_recipe = true`.
* **Parameters:**
  * `name` (string) — Name of the item being deconstructed.
  * `return_ingredients` (table of `Ingredient`) — Ingredients produced on deconstruction.
  * `config` (table or `nil`) — Optional `more_data`.
* **Returns:** `DeconstructRecipe` instance (subclass of `Recipe`).

## Events & listeners
*None identified.*