---
id: craftingmenu_ingredients
title: Craftingmenu Ingredients
description: Renders and manages ingredient UI widgets for the crafting menu, displaying available and missing requirements for the selected recipe.
tags: [crafting, ui, inventory]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 1adf9ba6
system_scope: ui
---

# Craftingmenu Ingredients

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CraftingMenuIngredients` is a UI widget responsible for visually rendering ingredient requirements of a crafting recipe. It dynamically constructs a row of `IngredientUI` child widgets based on the recipe’s `ingredients`, `character_ingredients`, `tech_ingredients`, and optional amulet discount display. It interacts with the player's `builder` and `inventory` replicated components to determine ingredient availability and uses game mode properties to control visual effects like `ui_cc` shaders.

## Usage example
```lua
local owner = ThePlayer
local recipe = GetRecipe("stone_patina")
local ingredients_widget = CreateWidget(CraftingMenuIngredients, owner, 6, recipe, nil)
ingredients_widget:SetPosition(0, 0)
```

## Dependencies & tags
**Components used:** `builder`, `inventory` (accessed via `owner.replica`)
**Tags:** Checks `greenamulet` on equipped body item to conditionally show amulet discount; checks `health_as_oldage` to substitute health ingredient.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | `nil` | The entity (typically player) whose builder/inventory are used for checks. |
| `max_ingredients_wide` | number | `nil` | Maximum horizontal space (in UI units) available for ingredient rendering, used for scaling. |
| `extra_quantity_scale` | number? | `nil` | Optional multiplier to scale quantity text size. |
| `recipe` | RecipeData? | `nil` | The currently active recipe being displayed (set via `SetRecipe`). |
| `ingredient_widgets` | table | `{}` | Array of `IngredientUI` widgets created and displayed for each ingredient. |
| `num_items` | number | `0` | Total count of ingredients rendered (including character, tech, and optional amulet). |
| `hint_tech_ingredient` | string? | `nil` | Uppercase name of the first missing tech ingredient (if any), used for hint display. |

## Main functions
### `SetRecipe(recipe)`
* **Description:** Rebuilds the ingredient display UI for the given recipe. Clears all existing children, calculates layout and scaling, and creates `IngredientUI` widgets for each ingredient type. Handles tech, material, character, and amulet-based ingredients. Sets `hint_tech_ingredient` for use in downstream UI logic.
* **Parameters:** 
  * `recipe` (RecipeData) — the recipe to display ingredients for.
* **Returns:** Nothing.
* **Error states:** If `recipe.ingredients` is missing, `#recipe.ingredients` evaluates to `0`. If `equippedBody.prefab ~= "greenamulet"` or no discount is applicable, `showamulet` remains `false`.

## Events & listeners
None identified.
