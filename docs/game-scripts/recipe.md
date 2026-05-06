---
id: recipe
title: Recipe
description: Defines the core classes and global tables for the crafting recipe system, including Ingredient, Recipe, Recipe2, and DeconstructRecipe classes.
tags: [crafting, recipes, ingredients, system]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: root
source_hash: e7fafd20
system_scope: crafting
---

# Recipe

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`recipe.lua` defines the core class hierarchy for Don't Starve Together's crafting system. It provides the `Ingredient` class for representing individual crafting costs, and the `Recipe` class (with `Recipe2` and `DeconstructRecipe` extensions) for defining craftable items. The file maintains global registries `AllRecipes` and `AllBuilderTaggedRecipes` that track all registered recipes for lookup and filtering. This is a system definition file, not an entity component — recipes are referenced by the crafting UI and builder components but do not attach to entities directly.

## Usage example
```lua
local Recipe = require "recipe"

-- Create an ingredient
local logs = Ingredient(INGREDIENT.LOGS, 2)

-- Create a recipe
local campfire = Recipe("campfire", {logs}, RECIPETABS.SURVIVAL, TECH.NONE, {
    placer = "campfire",
    description = "A basic fire for warmth and cooking."
})

-- Access a registered recipe
local recipe = AllRecipes["campfire"]
print(recipe.name)        -- "campfire"
print(recipe.numtogive)   -- 1

-- Check if recipe is valid in current game mode
local valid = IsRecipeValid("campfire")
```

## Dependencies & tags
**External dependencies:**
- `techtree` -- used for `TechTree.Create(level)` to convert tech level constants

**Components used:**
None identified

**Tags:**
None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `AllRecipes` | table | `{}` | Global table mapping recipe name strings to Recipe class instances. |
| `AllBuilderTaggedRecipes` | table | `{}` | Global table mapping recipe names to their builder tag or skill requirement. |
| `mod_protect_Recipe` | boolean | `false` | Flag that triggers a warning if Recipe constructor is called from a mod. |
| `Ingredient.type` | constant | — | Ingredient type constant (e.g., `INGREDIENT.LOGS`, `CHARACTER_INGREDIENT.HEALTH`). |
| `Ingredient.amount` | number | — | Quantity of this ingredient required. |
| `Ingredient.atlas` | string or nil | `nil` | Resolved file path to the inventory atlas XML. |
| `Ingredient.image` | string or nil | `nil` | Texture filename override for the ingredient icon. |
| `Ingredient.deconstruct` | boolean or nil | `nil` | Whether this ingredient is returned on deconstruction. |
| `Recipe.name` | string | — | Unique internal name identifier for the recipe. |
| `Recipe.ingredients` | table | `{}` | Array of standard Ingredient objects required. |
| `Recipe.character_ingredients` | table | `{}` | Array of character-specific ingredients (health/sanity costs). |
| `Recipe.tech_ingredients` | table | `{}` | Array of tech-level ingredients (prototyper requirements). |
| `Recipe.filter` | constant or nil | `nil` | Crafting filter category for menu organization. |
| `Recipe.product` | string | `name` | Prefab name of the item produced by this recipe. |
| `Recipe.tab` | constant | — | DEPRECATED: Legacy tab reference. |
| `Recipe.nameoverride` | string or nil | `nil` | Override string key for the recipe name in the crafting menu. |
| `Recipe.description` | string or nil | `nil` | Override string key for the recipe description in the crafting menu. |
| `Recipe.image` | string or function | — | Texture filename or function returning the image path. |
| `Recipe.atlas` | string or nil | `nil` | Resolved file path to the recipe's inventory atlas. |
| `Recipe.sortkey` | number | auto-increment | Numeric sort order for recipe display. |
| `Recipe.rpc_id` | number | auto-increment | Network RPC identifier for recipe synchronization. |
| `Recipe.level` | techtree node | — | Tech tree node created via `TechTree.Create(level)`. |
| `Recipe.placer` | string or nil | `nil` | Prefab name of the placer entity for structure recipes. |
| `Recipe.min_spacing` | number | `3.2` | Minimum distance required between placements of this structure. |
| `Recipe.testfn` | function or nil | `nil` | Custom placer test function for build validity checks. |
| `Recipe.canbuild` | function or nil | `nil` | Custom function returning fail message if building is not allowed. |
| `Recipe.unlocks_from_skin` | constant or nil | `nil` | Skin unlock context (`SKINUNLOCKS.ALWAYS` or `SKINUNLOCKS.CRAFTINGSTATION`). |
| `Recipe.nounlock` | boolean | `false` | Whether this recipe bypasses normal unlock requirements. |
| `Recipe.numtogive` | number | `1` | Quantity of items granted per craft. |
| `Recipe.override_numtogive_fn` | function or nil | `nil` | Function to dynamically calculate quantity granted. |
| `Recipe.builder_tag` | string or nil | `nil` | Entity tag required on the builder to craft this recipe. |
| `Recipe.builder_skill` | constant or nil | `nil` | Skill tree requirement to craft this recipe. |
| `Recipe.no_builder_tag` | boolean or nil | `nil` | Flag to exclude recipes with builder tags from certain queries. |
| `Recipe.no_builder_skill` | boolean or nil | `nil` | Flag to exclude recipes with skill requirements from certain queries. |
| `Recipe.forward_ingredients` | table or nil | `nil` | Alternate recipe mappings for skill tree ingredient substitution. |
| `Recipe.sg_state` | string or nil | `nil` | Stategraph state override for crafting animation. |
| `Recipe.build_mode` | constant | `BUILDMODE.LAND` | Build mode constant (LAND, WALL, etc.). |
| `Recipe.build_distance` | number | `1` | Build distance multiplier from the builder. |
| `Recipe.no_deconstruction` | boolean or function or nil | `nil` | Prevents or controls deconstruction of this item. |
| `Recipe.decon_ignores_finiteuses` | boolean or function or nil | `nil` | Whether deconstruction ignores finite uses remaining. |
| `Recipe.require_special_event` | constant or nil | `nil` | Special event that must be active for this recipe to be available. |
| `Recipe.always_allow_buffered_placer` | boolean or nil | `nil` | Skips KnowsRecipe check for buffered placer actions. |
| `Recipe.dropitem` | boolean or nil | `nil` | Whether crafted item should be dropped instead of added to inventory. |
| `Recipe.actionstr` | string or nil | `nil` | Custom action string for the craft action. |
| `Recipe.recipedisplaynamefn` | function or nil | `nil` | Function to generate dynamic display name. |
| `Recipe.hint_msg` | string or nil | `nil` | Hint message shown when recipe is locked. |
| `Recipe.force_hint` | boolean or nil | `nil` | Show locked recipe hint even if nounlock is true. |
| `Recipe.manufactured` | boolean or nil | `nil` | If true, crafting station handles item creation instead of builder. |
| `Recipe.station_tag` | string or nil | `nil` | Prototyper tag required for this recipe to appear in crafting station filter. |
| `Recipe.limitedamount` | boolean or nil | `nil` | Whether this recipe has a crafting limit. |
| `Recipe.getlimitedrecipecount` | function or nil | `nil` | Function to retrieve the current craft limit count. |
| `Recipe.is_deconstruction_recipe` | boolean | `false` | Whether this is a deconstruction recipe (tab == nil). |
| `Recipe.source_recipename` | string or nil | `nil` | Base recipe name this object was derived from (e.g., Winona scanner). |

## Main functions
### `Ingredient(ingredienttype, amount, atlas, deconstruct, imageoverride)`
* **Description:** Constructor for the Ingredient class. Validates character ingredients (health/sanity) are multiples of 5. Stores ingredient type, amount, and visual assets.
* **Parameters:**
  - `ingredienttype` -- constant from INGREDIENT, CHARACTER_INGREDIENT, or TECH_INGREDIENT
  - `amount` -- number quantity required
  - `atlas` -- string path to inventory atlas XML (optional)
  - `deconstruct` -- boolean whether returned on deconstruction (optional)
  - `imageoverride` -- string texture filename override (optional)
* **Returns:** Ingredient class instance
* **Error states:** Asserts if character ingredient amount is not a multiple of 5 (last digit is not 0 or 5).

### `Ingredient:GetAtlas()`
* **Description:** Returns the resolved atlas file path, computing it from the image if not already set.
* **Parameters:** None
* **Returns:** String file path to atlas XML
* **Error states:** None

### `Ingredient:GetImage()`
* **Description:** Returns the texture filename, defaulting to `<type>.tex` if not set.
* **Parameters:** None
* **Returns:** String texture filename
* **Error states:** None

### `IsCharacterIngredient(ingredienttype)`
* **Description:** Checks if an ingredient type is a character-specific ingredient (health, sanity, etc.). Caches results in a local table after first call.
* **Parameters:** `ingredienttype` -- constant to check
* **Returns:** `true` if character ingredient, `false` otherwise
* **Error states:** None

### `IsTechIngredient(ingredienttype)`
* **Description:** Checks if an ingredient type is a tech-level ingredient (prototyper requirement). Caches results in a local table after first call.
* **Parameters:** `ingredienttype` -- constant to check
* **Returns:** `true` if tech ingredient, `false` otherwise
* **Error states:** None

### `Recipe(name, ingredients, tab, level, placer_or_more_data, min_spacing, nounlock, numtogive, builder_tag, atlas, image, testfn, product, build_mode, build_distance)`
* **Description:** Constructor for the Recipe class. Registers the recipe in `AllRecipes` and `AllBuilderTaggedRecipes` if applicable. Triggers mod post-init callbacks. Accepts either a placer string or a config table for extended options.
* **Parameters:**
  - `name` -- unique string identifier for the recipe
  - `ingredients` -- array of Ingredient objects
  - `tab` -- crafting tab constant (DEPRECATED, use config.filter)
  - `level` -- tech tree level constant (e.g., `TECH.NONE`, `TECH.SCIENCE_TWO`)
  - `placer_or_more_data` -- string placer prefab OR config table with extended options
  - `min_spacing` -- number minimum placement spacing (default `3.2`)
  - `nounlock` -- boolean to bypass unlock requirements (default `false`)
  - `numtogive` -- number quantity crafted (default `1`)
  - `builder_tag` -- string tag required on builder entity
  - `atlas` -- string atlas path override
  - `image` -- string or function for recipe icon
  - `testfn` -- function for custom placement validation
  - `product` -- string prefab name of crafted item (default `name`)
  - `build_mode` -- constant build mode (default `BUILDMODE.LAND`)
  - `build_distance` -- number build distance multiplier (default `1`)
* **Returns:** Recipe class instance
* **Error states:** Prints warning if `mod_protect_Recipe` is true (mod calling Recipe directly instead of AddRecipe). May error if `TheSim` is nil when declaring limited recipes.

### `Recipe:GetAtlas()`
* **Description:** Returns the resolved atlas file path, computing it from the image if not already set.
* **Parameters:** None
* **Returns:** String file path to atlas XML
* **Error states:** None

### `Recipe:SetModRPCID()`
* **Description:** Computes and assigns a hash-based RPC ID for network synchronization. Checks for hash collisions with existing recipes.
* **Parameters:** None
* **Returns:** None
* **Error states:** Prints error if hash collision detected with another recipe name.

### `Recipe2(name, ingredients, tech, config)`
* **Description:** Extended Recipe constructor that passes config table parameters to the base Recipe constructor. Sets `is_deconstruction_recipe` to false explicitly.
* **Parameters:**
  - `name` -- unique string identifier
  - `ingredients` -- array of Ingredient objects
  - `tech` -- tech tree level constant
  - `config` -- table with optional parameters (min_spacing, nounlock, numtogive, builder_tag, atlas, image, testfn, product, build_mode, build_distance)
* **Returns:** Recipe2 class instance
* **Error states:** None

### `DeconstructRecipe(name, return_ingredients, config)`
* **Description:** Specialized Recipe constructor for deconstruction recipes. Sets tech level to `TECH.NONE`, marks as deconstruction recipe, and sets `nounlock` to true.
* **Parameters:**
  - `name` -- unique string identifier
  - `return_ingredients` -- array of Ingredient objects returned on deconstruct
  - `config` -- table with optional parameters
* **Returns:** DeconstructRecipe class instance
* **Error states:** None

### `GetValidRecipe(recname)`
* **Description:** Validates and returns a recipe if it exists, is not a deconstruction recipe, and meets game mode and special event requirements.
* **Parameters:** `recname` -- string recipe name to look up
* **Returns:** Recipe instance or `nil` if invalid
* **Error states:** None (returns nil gracefully if TheNet is nil or recipe invalid)

### `IsRecipeValid(recname)`
* **Description:** Convenience wrapper that checks if a recipe is valid by calling GetValidRecipe.
* **Parameters:** `recname` -- string recipe name to check
* **Returns:** `true` if valid, `false` otherwise
* **Error states:** None

### `RemoveAllRecipes()`
* **Description:** Clears all registered recipes by resetting global tables and counter. Used for testing or world regeneration.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

## Events & listeners
None.