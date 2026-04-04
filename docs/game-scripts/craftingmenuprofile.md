---
id: craftingmenuprofile
title: CraftingMenuProfile
description: Manages player crafting menu preferences including favorites, pinned recipes, and sort settings.
tags: [crafting, ui, persistence]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 0c20209a
system_scope: ui
---

# CraftingMenuProfile

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`CraftingMenuProfile` is a standalone class that manages player preferences for the crafting menu interface. It tracks favorite recipes, pinned recipe slots across multiple pages, and sorting preferences. The class handles persistent storage of this data using `TheSim:SetPersistentString` and `TheSim:GetPersistentString`, allowing player preferences to survive game sessions. This class is not attached to entities but operates independently to maintain user configuration state.

## Usage example
```lua
local CraftingMenuProfile = require("craftingmenuprofile")
local profile = CraftingMenuProfile()

profile:AddFavorite("cookpot")
profile:SetPinnedRecipe(1, "cookpot", "default")
profile:SetCurrentPage(1)
profile:Save()
```

## Dependencies & tags
**Components used:** None (this is a standalone class, not an entity component)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `favorites` | table | `{}` | Array of favorited recipe names |
| `favorites_ordered` | table | `{}` | Inverted lookup table for favorite recipes |
| `pinned_pages` | table | `{{}}` | Array of pages containing pinned recipe slots |
| `pinned_page` | number | `1` | Current active page number |
| `pinned_recipes` | table | `self.pinned_pages[1]` | Reference to current page's recipe array |
| `sort_mode` | number | `nil` | Current sorting mode identifier |
| `save_enabled` | boolean | `true` | Whether automatic saving is enabled |
| `dirty` | boolean | `nil` | Tracks if data has been modified since last save |

## Main functions
### `Save(force_save)`
*   **Description:** Persists profile data to disk using `TheSim:SetPersistentString`. Only saves if `force_save` is true or if `save_enabled` and `dirty` are both true.
*   **Parameters:** `force_save` (boolean) - forces save regardless of dirty state
*   **Returns:** Nothing
*   **Error states:** May fail if persistent string storage is unavailable

### `Load()`
*   **Description:** Loads profile data from disk using `TheSim:GetPersistentString`. Parses JSON and restores all properties including favorites, sort mode, and pinned pages.
*   **Parameters:** None
*   **Returns:** Nothing
*   **Error states:** Prints error message if JSON decoding fails

### `SetSortMode(mode)`
*   **Description:** Updates the sorting mode and marks data as dirty for saving.
*   **Parameters:** `mode` (number) - sort mode identifier
*   **Returns:** Nothing

### `GetSortMode()`
*   **Description:** Returns the current sorting mode.
*   **Parameters:** None
*   **Returns:** number - current sort mode or nil

### `GetFavorites()`
*   **Description:** Returns the array of favorited recipe names.
*   **Parameters:** None
*   **Returns:** table - favorites array

### `GetFavoritesOrder()`
*   **Description:** Returns the inverted lookup table for favorites.
*   **Parameters:** None
*   **Returns:** table - favorites_ordered lookup table

### `IsFavorite(recipe_name)`
*   **Description:** Checks if a recipe is in the favorites list.
*   **Parameters:** `recipe_name` (string) - name of the recipe to check
*   **Returns:** boolean - true if recipe is favorited

### `AddFavorite(recipe_name)`
*   **Description:** Adds a recipe to favorites. Validates that input is a string.
*   **Parameters:** `recipe_name` (string) - name of the recipe to favorite
*   **Returns:** Nothing
*   **Error states:** Prints error and returns early if `recipe_name` is not a string

### `RemoveFavorite(recipe_name)`
*   **Description:** Removes a recipe from favorites and rebuilds the lookup table.
*   **Parameters:** `recipe_name` (string) - name of the recipe to remove
*   **Returns:** Nothing

### `SetPinnedRecipe(slot, recipe_name, skin_name)`
*   **Description:** Sets a pinned recipe at a specific slot on the current page. Creates new slot entry if needed.
*   **Parameters:** `slot` (number) - slot index, `recipe_name` (string|nil) - recipe name or nil to clear, `skin_name` (string|nil) - skin identifier
*   **Returns:** Nothing

### `GetPinnedRecipes()`
*   **Description:** Returns the current page's pinned recipe array.
*   **Parameters:** None
*   **Returns:** table - pinned_recipes array

### `GetCurrentPage()`
*   **Description:** Returns the current page number.
*   **Parameters:** None
*   **Returns:** number - current page number

### `SetCurrentPage(page_num)`
*   **Description:** Switches to a different page and updates the pinned_recipes reference. Creates new page array if it doesn't exist.
*   **Parameters:** `page_num` (number) - page number to switch to
*   **Returns:** Nothing

### `NextPage()`
*   **Description:** Advances to the next page, wrapping to page 1 if at the maximum.
*   **Parameters:** None
*   **Returns:** Nothing
*   **Error states:** Uses `Profile:GetCraftingNumPinnedPages()` to determine max pages

### `PrevPage()`
*   **Description:** Goes to the previous page, wrapping to the maximum page if at page 1.
*   **Parameters:** None
*   **Returns:** Nothing
*   **Error states:** Uses `Profile:GetCraftingNumPinnedPages()` to determine max pages

### `MakeDefaultPinnedRecipes()`
*   **Description:** Initializes pinned pages with default recipes from `TUNING.DEFAULT_PINNED_RECIPES` and `TUNING.DEFAULT_PINNED_RECIPES_2`. Resets to page 1.
*   **Parameters:** None
*   **Returns:** Nothing

## Events & listeners
None identified. This class does not use the entity event system.