---
id: crafting_sorting
title: Crafting Sorting
description: Manages recipe sorting and ordering logic for the crafting menu across multiple filter types and states.
tags: [crafting, ui, filtering, sorting]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 26316ab5
system_scope: crafting
---

# Crafting Sorting

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `crafting_sorting.lua` module defines four sorting strategy classes (`DefaultSort`, `CraftableSort`, `FavoriteSort`, and `AlphaSort`) used by the crafting menu UI to organize recipe lists. Each class implements a custom iterator via `__ipairs` to return recipes in a specific order based on filter context (e.g., favorite, craftability, alphabetical). Classes are designed to work with a shared `widget` (typically the crafting menu) and communicate changes via callbacks like `OnFavoriteChanged`, `Refresh`, and `OnSelected`. It uses global tables such as `AllRecipes`, `CRAFTING_FILTERS`, and `STRINGS.NAMES`, and relies on helper functions like `FunctionOrValue`, `shallowcopy`, and `table.removearrayvalue`.

## Usage example
```lua
local widget = CreateEntity()
widget:AddComponent("craftingmenu")

-- Initialize default sort (used when no specific filter is active)
local default_sort = DefaultSort(widget)

-- Use favorite sort with default sort as dependency
local favorite_sort = FavoriteSort(widget, default_sort)

-- Iterate over sorted recipes (e.g., for rendering in the UI)
for i, recipe_name in ipairs(favorite_sort) do
    print("Recipe", i, recipe_name)
end

-- Trigger a refresh after a favorite change
favorite_sort:OnFavoriteChanged("rock_goose", true)
favorite_sort:Refresh()
```

## Dependencies & tags
**Components used:** None identified (uses global functions and tables such as `AllRecipes`, `TheCraftingMenuProfile`, `CRAFTING_FILTERS`, `FunctionOrValue`, `shallowcopy`, `table.removearrayvalue`, `stringidsorter`).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `widget` | table (crafting menu UI widget) | `nil` (assigned in constructor) | Reference to the parent crafting menu widget that holds state like `current_filter_name` and `valid_recipes`. |
| `fullupdate` | boolean | `nil` (only in `DefaultSort`) | When set, forces full filter rebuild on next `Refresh()`. |
| `buffered`, `craftable`, `uncraftable`, `recipelookup` | tables | Empty tables | State tracking tables in `CraftableSort` indicating build state categories for each recipe. |
| `favorite`, `nonfavorite` | tables | Empty tables | State tracking tables in `FavoriteSort` indicating favorite status for each recipe. |
| `alpha_sorted` | array | `nil` (initialized in constructor) | Pre-sorted list of recipe names in `AlphaSort`. |

## Main functions
### `DefaultSort:BuildFavoriteTable()`
* **Description:** Reinitializes the `FAVORITES` filter table by copying from `CRAFTING_FILTERS.FAVORITES`, and marks the unsorted set as those not in the default sort values.
* **Parameters:** None.
* **Returns:** Nothing.
* **Side effects:** Sets `self.FAVORITES.unsorted` and `self.fullupdate = true`.

### `DefaultSort:Refresh()`
* **Description:** Triggers filter application if a full update was requested; otherwise returns `false`.
* **Parameters:** None.
* **Returns:** `true` if filters were applied (`fullupdate` was set), `false` otherwise.

### `DefaultSort:GetSorted()`
* **Description:** Returns the sorted list of recipe names for the current filter.
* **Parameters:** None.
* **Returns:** `array` — sorted list of recipe names for the current filter, or empty array if no filter selected.

### `DefaultSort:GetUnsorted()`
* **Description:** Returns the unsorted set of recipe names (as keys) for the current filter, or global `self.unsorted` if no filter selected.
* **Parameters:** None.
* **Returns:** `table` — set of unsorted recipe names (keys are strings, values are `true`).

### `CraftableSort:BuildCraftableTable()`
* **Description:** Re-sorts recipes into `buffered`, `craftable`, or `uncraftable` tables based on `valid_recipes` and their `build_state` (`buffered`, `freecrafting`, `has_ingredients`, `prototype`). Updates cached sorted/unsorted arrays if needed.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if any recipe moved between categories (i.e., state changed).

### `CraftableSort:ClearSortTables()`
* **Description:** Clears cached sorted/unsorted arrays if the current filter changed (to avoid stale caching across filters).
* **Parameters:** None.
* **Returns:** Nothing.

### `FavoriteSort:BuildFavoriteTable()`
* **Description:** Syncs `self.favorite` and `self.nonfavorite` sets with `TheCraftingMenuProfile:IsFavorite()` for all recipes. Marks cached arrays for rebuild if any changes occurred.
* **Parameters:** None.
* **Returns:** Nothing.
* **Side effects:** Resets `self.favorite_sorted`, `self.nonfavorite_sorted`, etc. if favorites changed.

### `FavoriteSort:OnFavoriteChanged(recipe_name, is_favorite_recipe)`
* **Description:** Updates internal state when a recipe’s favorite status changes (e.g., after user toggle). Invalidates sorted arrays in affected categories and triggers a full update.
* **Parameters:**  
  - `recipe_name` (string) — name of the recipe.  
  - `is_favorite_recipe` (boolean) — whether the recipe is now a favorite.  
* **Returns:** Nothing.
* **Side effects:** Modifies `self.favorite`/`self.nonfavorite`, clears cached arrays, and sets `defaultsort.fullupdate = true`.

### `AlphaSort:__ipairs()`
* **Description:** Returns an iterator over pre-sorted recipe names alphabetically by localized name (using `STRINGS.NAMES`).
* **Parameters:** None.
* **Returns:** `function, table, number` — standard Lua iterator signature for `ipairs`.

### `DefaultSort:__ipairs()`, `CraftableSort:__ipairs()`, `FavoriteSort:__ipairs()`
* **Description:** Custom iterators that yield recipes in filter-aware order: (1) sorted items first, then (2) unsorted items, in order of category (e.g., craftable/favorite/buffered). Uses coroutines to avoid state externally.
* **Parameters:** None.
* **Returns:** `function, table, number` — standard Lua iterator signature for `ipairs`.
* **Category order per class:**
  - `DefaultSort`: `[sorted] → [unsorted]`
  - `CraftableSort`: `[buffered sorted] → [buffered unsorted] → [craftable sorted] → [craftable unsorted] → [uncraftable sorted] → [uncraftable unsorted]`
  - `FavoriteSort`: `[favorite sorted] → [favorite unsorted] → [nonfavorite sorted] → [nonfavorite unsorted]`

## Events & listeners
**None identified** — this file does not register or fire DST events via `inst:ListenForEvent` or `inst:PushEvent`. It uses callback-style integration via methods like `OnFavoriteChanged`, `Refresh`, and `OnSelected`, which are presumably invoked by the parent UI widget.