---
id: ingredientui
title: Ingredientui
description: Renders a UI element representing a crafting ingredient in the recipe UI, handling visual state, quantity display, tooltip, and interactivity.
tags: [crafting, ui, recipe]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: ceb5998b
system_scope: ui
---

# Ingredientui

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`IngredientUI` is a custom widget that visually represents a single ingredient in the crafting menu UI. It extends `ImageButton` and displays the ingredient's icon, quantity (if applicable), and state (e.g., sufficient amount, insufficient amount, prototype, locked). It also handles user interaction, including click behavior and focus-based sub-ingredient previews. It integrates with the `AllRecipes`, `STRINGS.UI.CRAFTING`, and `TheInput` systems to provide localized, context-aware UI.

## Usage example
```lua
local IngredientUI = require "widgets/ingredientui"

local ingredient_widget = IngredientUI(
    resolvefilepath("images/hud.xml"),     -- atlas
    "wood.tex",                            -- image
    5,                                     -- quantity needed
    10,                                    -- on_hand
    true,                                  -- has_enough
    "Wood",                                -- name
    player,                                -- owner
    "workbench",                           -- recipe_type
    1.0,                                   -- quant_text_scale
    ingredient_recipe                      -- ingredient_recipe (optional)
)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Uses `player`'s `replica.builder` component (via `owner.replica.builder`) to compute ingredient modifiers.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ing` | `Image` | — | Child image widget displaying the ingredient icon. |
| `quant` | `Text` (optional) | `nil` | Child text widget displaying quantity (e.g., `10/5`), only present if `quantity` is non-`nil`. |
| `fg` | `Image` (optional) | `nil` | Foreground overlay (e.g., lock or craft icon), set when `ingredient_recipe.meta` is defined. |
| `recipe_type` | string (optional) | `nil` | Recipe category (e.g., `"workbench"`), used to check if recipe is valid. |
| `has_enough` | boolean | `false` | Whether the owner has sufficient quantity of this ingredient. |
| `owner` | entity (optional) | `nil` | Owner entity (e.g., player) whose builder component is used for modifiers. |
| `ingredient_recipe` | table (optional) | `nil` | Reference to the full recipe object containing meta and action info. |

## Main functions
No publicly exposed methods beyond constructor initialization.

## Events & listeners
- **Pushes:** `onclick`, `ongainfocus`, `onlosefocus` — internally handled callbacks for user interaction; no events fired to the game event system.