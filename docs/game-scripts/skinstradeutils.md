---
id: skinstradeutils
title: Skinstradeutils
description: Provides utility functions for validating and matching skin trade recipes based on selected items and restrictions.
tags: [crafting, trade, inventory, util]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 410a3ac3
system_scope: crafting
---

# Skinstradeutils

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`skinstradeutils` is a Lua utility module that provides helper functions for validating and processing skin trade recipes. It is not a component (i.e., it does not attach to entities), but rather a collection of standalone functions used by the trade UI (e.g., `tradescreen.lua`) and recipe logic. It relies on `skinsutils.lua` for item categorization (e.g., rarity, type) and `trade_recipes.lua` for defining valid trade recipes.

## Usage example
```lua
local selections = {
    { item = "chopsticks" },
    { item = "fancy_hat" },
}
local count = GetNumberSelectedItems(selections)
local recipe = GetBasicRecipeMatch(selections)
local filters = GetBasicFilters(recipe)
```

## Dependencies & tags
**Components used:** None.  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `GetNumberSelectedItems(selections)`
*   **Description:** Counts the number of selected items in the trade UI selection list.
*   **Parameters:** `selections` (table) — a list (array-like table) of item selection entries, each typically containing an `item` field.
*   **Returns:** number — the number of items in the `selections` list.
*   **Error states:** None.

### `GetBasicRecipeMatch(selections)`
*   **Description:** Determines the name of a basic trade recipe that matches the rarity of the first selected item, if any. It inspects only the first item's rarity and compares against `TRADE_RECIPES` in `trade_recipes.lua`.
*   **Parameters:** `selections` (table) — a list of selected item entries.
*   **Returns:** string or nil — the name of the matching recipe (e.g., `"fancy_trades"`), or `nil` if no match is found or rarity cannot be determined.
*   **Error states:** Returns `nil` if `selections` is empty or the first item's rarity is `nil`.

### `GetBasicFilters(recipe_name)`
*   **Description:** Returns a list of acceptable filters for the basic trade UI based on a recipe name. Used to restrict selection options in the trade UI.
*   **Parameters:** `recipe_name` (string or nil) — the name of a trade recipe from `TRADE_RECIPES`.
*   **Returns:** table — an array of arrays, where each inner array contains filter strings (e.g., `{{"Common"}, {"Classy"}, {"Spiffy"}}` or a single rarity-based filter).
*   **Error states:** Returns `{{"Common"}, {"Classy"}, {"Spiffy"}}` if `recipe_name` is `nil`.

### `GetSpecialFilters(recipe_data, selected_items)`
*   **Description:** Computes a list of active filters required to satisfy a special (non-basic) trade recipe based on its defined restrictions and the currently selected items. It avoids duplicate filters and considers item type, rarity, and tags.
*   **Parameters:**
    *   `recipe_data` (table or nil) — the recipe configuration table from `TRADE_RECIPES`, expected to contain a `Restrictions` field.
    *   `selected_items` (table) — list of currently selected items.
*   **Returns:** table — an array of filter lists (each a table of strings), representing constraints that remain unsatisfied.
*   **Error states:** Returns an empty table `{}` if `recipe_data` is `nil`, or if all restrictions are satisfied (not implemented; see commented-out code). Filters are omitted if already present in the result.

## Events & listeners
Not applicable.