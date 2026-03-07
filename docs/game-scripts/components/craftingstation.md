---
id: craftingstation
title: Craftingstation
description: Tracks which items and recipes a crafting station has learned and manages per-recipe crafting limits.
tags: [crafting, progression, inventory]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f4ef8672
system_scope: crafting
---

# Craftingstation

> Based on game build **7140014** | Last updated: 2026-03-03

## Overview
`CraftingStation` manages the list of items and recipes known to a crafting entity (e.g., a workbench or forge). It stores learned items and their corresponding recipes, tracks per-recipe crafting limits, and handles serialization for save/load. When a recipe reaches its crafting limit and is crafted again, it automatically forgets the recipe and triggers technology tree evaluation on the doer(s) via the `builder` component.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("craftingstation")

inst.components.craftingstation:LearnItem("carving_knife", "carving_knife_recipe")
inst.components.craftingstation:SetRecipeCraftingLimit("carving_knife_recipe", 1)

-- Craft the recipe once (reaches limit and is forgotten)
inst.components.craftingstation:RecipeCraftingLimit({char = true}, "carving_knife_recipe")
```

## Dependencies & tags
**Components used:** `builder` — accessed via `doer.components.builder:EvaluateTechTrees()` when a recipe with a crafting limit expires.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `items` | table (array of strings) | `{}` | List of item names known by this station. |
| `recipes` | table (array of strings) | `{}` | List of recipe names known, aligned 1:1 with `items`. |
| `recipecraftinglimit` | table (string → number) | `{}` | Maps recipe names to remaining allowed crafts. |
| `nosave` | boolean or nil | `false` | If true, save/load data is bypassed; internal use only. |

## Main functions
### `LearnItem(itemname, recipetouse)`
* **Description:** Adds a new item and its corresponding recipe to the learned list if not already known.
* **Parameters:**  
  `itemname` (string) — name of the item to learn.  
  `recipetouse` (string) — name of the associated recipe.
* **Returns:** Nothing.

### `KnowsItem(itemname)`
* **Description:** Checks whether the station has learned a specific item.
* **Parameters:**  
  `itemname` (string) — item name to check.
* **Returns:** `true` if known, otherwise `false`.

### `KnowsRecipe(recipename)`
* **Description:** Checks whether the station has learned a specific recipe.
* **Parameters:**  
  `recipename` (string) — recipe name to check.
* **Returns:** `true` if known, otherwise `false`.

### `GetItems()`
* **Description:** Returns the full list of learned item names.
* **Parameters:** None.
* **Returns:** table (array of strings) — list of item names.

### `GetRecipes()`
* **Description:** Returns the full list of learned recipe names.
* **Parameters:** None.
* **Returns:** table (array of strings) — list of recipe names.

### `GetRecipeCraftingLimit(recipename)`
* **Description:** Returns the remaining crafting limit for a recipe.
* **Parameters:**  
  `recipename` (string) — recipe name.
* **Returns:** number or `nil` — remaining allowed crafts, or `nil` if unlimited.

### `SetRecipeCraftingLimit(recipename, amount)`
* **Description:** Sets the maximum number of times a recipe may be crafted.
* **Parameters:**  
  `recipename` (string) — recipe name.  
  `amount` (number) — non-negative limit; a value of `0` effectively disables crafting.
* **Returns:** Nothing.

### `RecipeCrafted(doers, recipename)`
* **Description:** Decrements the crafting limit for the given recipe. If the limit reaches `0`, forgets the recipe and calls `EvaluateTechTrees` on each doer’s `builder` component.
* **Parameters:**  
  `doers` (table) — map (usually `{[entity] = true}`) of entities performing the craft.  
  `recipename` (string) — recipe being crafted.
* **Returns:** Nothing.
* **Error states:** If `recipename` is not in `recipecraftinglimit`, no action is taken.

### `ForgetItem(itemname)`
* **Description:** Removes a specific item and its corresponding recipe from all tracking tables.
* **Parameters:**  
  `itemname` (string) — item to forget.
* **Returns:** Nothing.

### `ForgetRecipe(recipename)`
* **Description:** Removes a specific recipe (and its corresponding item) from all tracking tables.
* **Parameters:**  
  `recipename` (string) — recipe to forget.
* **Returns:** Nothing.

### `ForgetAllItems()`
* **Description:** Clears all learned items, recipes, and recipe limits.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Returns serializable state for saving, or `nil` if `nosave` is true.
* **Parameters:** None.
* **Returns:** table or `nil` — state with keys `items`, `recipes`, and `recipecraftinglimit`.

### `OnLoad(data)`
* **Description:** Restores saved state. Validates that `items` and `recipes` arrays are same length; if not, clears all data.
* **Parameters:**  
  `data` (table) — state returned from a prior `OnSave()` call.
* **Returns:** Nothing.

## Events & listeners
None identified.
