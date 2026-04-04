---
id: crafting_sorting
title: Crafting Sorting
description: Organizes and filters crafting recipes for the HUD based on availability and user preferences.
tags: [crafting, ui, menu]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 26316ab5
system_scope: crafting
---

# Crafting Sorting

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
The `crafting_sorting` module provides a collection of sorting classes used to organize recipes within the crafting menu interface. It categorizes recipes based on filter definitions, craftability status (buffered, craftable, uncraftable), and user favorite settings. These classes are typically instantiated by the crafting HUD widget to determine the display order of recipe buttons.

## Usage example
```lua
local Sorting = require("crafting_sorting")

-- Assume widget is a valid crafting HUD widget instance
local widget = ThePlayer.HUD.crafting
local sorter = Sorting.DefaultSort(widget)

-- Iterate through sorted recipes
for index, recipe_name in sorter:__ipairs() do
    print(index, recipe_name)
end

-- Refresh sorting logic if recipes change
sorter:Refresh()
```

## Dependencies & tags
**Components used:** None (UI utility class).
**Dependencies:** `metaclass`
**Globals:** `CRAFTING_FILTERS`, `AllRecipes`, `TheCraftingMenuProfile`, `STRINGS`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `widget` | table | `nil` | Reference to the parent crafting widget. |
| `sorted` | table | `{}` | List of recipes explicitly defined in the filter. |
| `unsorted` | table | `{}` | List of recipes not defined in the filter. |
| `fullupdate` | boolean | `false` | Flag indicating a full UI refresh is required. |
| `craftable` | table | `{}` | (`CraftableSort`) Recipes currently craftable by the player. |
| `favorite` | table | `{}` | (`FavoriteSort`) Recipes marked as favorites by the player. |
| `alpha_sorted` | table | `{}` | (`AlphaSort`) List of all recipes sorted alphabetically. |

## Main functions
### `Constructor(widget)`
*   **Description:** Initializes the sorting instance. Specific behavior varies by class (`DefaultSort`, `CraftableSort`, `FavoriteSort`, `AlphaSort`).
*   **Parameters:** `widget` (table) - The crafting HUD widget instance managing the menu.
*   **Returns:** Self (instance).

### `Refresh()`
*   **Description:** Updates internal sorting tables based on current game state (e.g., inventory changes, favorite toggles). Triggers a widget update if changes occurred.
*   **Parameters:** None.
*   **Returns:** `boolean` - `true` if the widget requires an update, `false` otherwise.

### `GetSorted()`
*   **Description:** Retrieves the list of recipes that belong to the current filter's sorted definition.
*   **Parameters:** None.
*   **Returns:** `table` - List of sorted recipe names. Returns empty table if no filter is selected.

### `GetUnsorted()`
*   **Description:** Retrieves the list of recipes that do not belong to the current filter's sorted definition.
*   **Parameters:** None.
*   **Returns:** `table` - List of unsorted recipe names.

### `__ipairs()`
*   **Description:** Lua metamethod enabling iteration over the sorter instance. Yields indices and recipe names in the calculated order (sorted then unsorted, categorized by specific sort logic).
*   **Parameters:** None.
*   **Returns:** `function` - An iterator function compatible with `for i, v in ipairs(sorter) do`.

### `OnFavoriteChanged(recipe_name, is_favorite_recipe)`
*   **Description:** Callback triggered when a recipe's favorite status changes. Updates internal favorite tables and marks for refresh.
*   **Parameters:** `recipe_name` (string) - The name of the recipe. `is_favorite_recipe` (boolean) - The new favorite status.
*   **Returns:** Nothing.

### `OnSelected()`
*   **Description:** Called when the sorting mode or filter is selected. Rebuilds internal tables to reflect the new selection.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `BuildCraftableTable()`
*   **Description:** (`CraftableSort`) Scans valid recipes and categorizes them into buffered, craftable, or uncraftable tables based on build state.
*   **Parameters:** None.
*   **Returns:** `boolean` - `true` if any category table changed.

### `BuildFavoriteTable()`
*   **Description:** (`FavoriteSort` / `DefaultSort`) Rebuilds the favorite vs non-favorite categorization based on `TheCraftingMenuProfile`.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (Does not use `inst:ListenForEvent`).
- **Pushes:** None (Does not use `inst:PushEvent`).
- **Widget Callbacks:** Calls `widget:ApplyFilters()` internally when `Refresh()` detects changes.