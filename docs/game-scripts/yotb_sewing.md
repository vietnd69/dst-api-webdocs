---
id: yotb_sewing
title: Yotb Sewing
description: Provides recipe selection and validation logic for a sewing-based crafting system using costume sets.
tags: [crafting, validation, ai]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 7834edc0
system_scope: crafting
---

# Yotb Sewing

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`yotb_sewing.lua` is a utility module that implements recipe selection and validation for a custom sewing/costume crafting system. It loads costume definitions from `yotb_costumes.lua`, processes ingredient lists, and determines the highest-priority valid recipe based on custom test logic and priority values. It does *not* define a component, but instead exposes stateless functions intended for use in crafting recipes or AI decisions.

## Usage example
```lua
local yotb_sewing = require "yotb_sewing"

local ingredients = {"wool", "thread", "wood"}
local recipe_name, craft_time = yotb_sewing.CalculateRecipe(ingredients)
if recipe_name then
    print("Best recipe:", recipe_name, "takes", craft_time, "seconds")
end
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `recipes` | table | `{}` | Array of costume recipe definitions loaded from `set_data.costumes`. Each entry contains at least `prefab_name`, `priority` (number, optional), and a `test` function. |

## Main functions
### `GetIngredientValues(prefablist)`
*   **Description:** Converts a flat list of ingredient prefabs into a frequency map (e.g., `{"wool", "wool", "thread"}` → `{ wool = 2, thread = 1 }`).
*   **Parameters:** `prefablist` (array of strings) – list of ingredient prefab names.
*   **Returns:** `table` – a map of prefab name → count.

### `GetCandidateRecipes(ingdata)`
*   **Description:** Filters and sorts all loaded recipes to find the highest-priority valid ones based on the provided ingredient data.
*   **Parameters:** `ingdata` (table) – ingredient frequency map from `GetIngredientValues`.
*   **Returns:** `table` – array of recipe tables matching the highest priority. Empty if no candidates found.

### `IsRecipeValid(names)`
*   **Description:** Checks whether *any* valid recipe exists for the given ingredient list.
*   **Parameters:** `names` (array of strings) – list of ingredient prefab names.
*   **Returns:** `boolean` – `true` if at least one recipe is valid; `false` otherwise.

### `CalculateRecipe(names)`
*   **Description:** Computes the best matching recipe for the given ingredients, returning its output prefab and crafting time.
*   **Parameters:** `names` (array of strings) – list of ingredient prefab names.
*   **Returns:**  
    * `prefab_name` (string or `nil`) – the prefab name of the selected recipe, or `nil` if no recipe matches.  
    * `time` (number) – the crafting time in seconds, defaulting to `1` if unspecified in the recipe.
*   **Error states:** Returns `nil, 1` when no valid recipe exists.

## Events & listeners
Not applicable