---
id: craftingmenuprofile
title: CraftingMenuProfile
description: Manages user-specific crafting menu preferences, including favorites, pinned recipes across multiple pages, and sort modes, with persistent storage support.
tags: [crafting, persistence, ui]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 0c20209a
system_scope: ui
---

# CraftingMenuProfile

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`CraftingMenuProfile` is a singleton-style component that stores and manages user-modifiable crafting interface preferences. It handles favorite recipes, pinned recipes organized into multiple pages, and sort mode selection. Data is persisted across sessions using `TheSim:SetPersistentString`. The component is not attached to entities via `AddComponent`; instead, it is instantiated as a standalone module and typically accessed as `CraftingMenuProfile()`.

## Usage example
```lua
local profile = CraftingMenuProfile()
profile:Load()
profile:AddFavorite("tent")
profile:SetSortMode(1)
profile:SetCurrentPage(2)
profile:SetPinnedRecipe(3, "campfire", "classic")
profile:Save(true)
```

## Dependencies & tags
**Components used:** None (uses `TheSim`, `json`, `table`, `cooking`, and `TUNING` modules)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `favorites` | table | `{}` | List of favorite recipe names (strings). |
| `favorites_ordered` | table | `{}` | Inverted lookup table mapping recipe name to index in `favorites`. |
| `pinned_pages` | table of tables | `{{}}` | Multi-page array of pinned recipes; holes allowed in indexing. |
| `pinned_page` | number | `1` | Index of the currently active pinned recipe page. |
| `pinned_recipes` | table | `self.pinned_pages[1]` | Reference to the pinned recipes table for the current page. |
| `sort_mode` | number? | `nil` | Currently selected sort mode identifier (e.g., `nil`, `1`, `2`, etc.). |
| `save_enabled` | boolean | `true` | Controls whether saving is enabled; does not force immediate writes. |
| `dirty` | boolean | `false` (implicit) | Tracks whether unsaved changes exist; set to `true` on modifications. |

## Main functions
### `Save(force_save)`
* **Description:** Serializes and saves current profile data to persistent storage if `save_enabled` is true and `dirty` is true, or if `force_save` is true.
* **Parameters:** `force_save` (boolean) — bypasses `dirty` and `save_enabled` checks to force a write.
* **Returns:** Nothing.
* **Error states:** Uses `pcall` around `json.decode` in `Load`; no errors expected here.

### `Load()`
* **Description:** Asynchronously loads saved profile data from persistent storage and restores state fields.
* **Parameters:** None.
* **Returns:** Nothing (operation is asynchronous via `TheSim:GetPersistentString`).
* **Error states:** Logs failure message to console if JSON decoding fails; default fallback values remain in place.

### `SetSortMode(mode)`
* **Description:** Sets the active sort mode for the crafting menu and marks the profile as dirty.
* **Parameters:** `mode` (number) — sort mode identifier (e.g., `0`, `1`, `2`).
* **Returns:** Nothing.

### `GetSortMode()`
* **Description:** Returns the currently configured sort mode.
* **Parameters:** None.
* **Returns:** `number?` — current sort mode, or `nil` if unset.

### `GetFavorites()`
* **Description:** Returns the ordered list of favorite recipe names.
* **Parameters:** None.
* **Returns:** `table` — array of recipe name strings.

### `GetFavoritesOrder()`
* **Description:** Returns the inverted lookup table for favorites.
* **Parameters:** None.
* **Returns:** `table` — map from recipe name to index in `favorites`.

### `IsFavorite(recipe_name)`
* **Description:** Checks if a recipe is in the favorites list.
* **Parameters:** `recipe_name` (string) — name of the recipe to check.
* **Returns:** `boolean` — `true` if recipe is favorited, otherwise `false`.

### `AddFavorite(recipe_name)`
* **Description:** Adds a recipe to the favorites list if not already present.
* **Parameters:** `recipe_name` (string) — name of the recipe to favorite.
* **Returns:** Nothing.
* **Error states:** Silently logs an error and returns early if `recipe_name` is not a string.

### `RemoveFavorite(recipe_name)`
* **Description:** Removes a recipe from the favorites list.
* **Parameters:** `recipe_name` (string) — name of the recipe to remove.
* **Returns:** Nothing.
* **Error states:** Uses `table.removearrayvalue`; no errors documented internally.

### `SetPinnedRecipe(slot, recipe_name, skin_name)`
* **Description:** Sets or clears a pinned recipe in the current page at the given slot index.
* **Parameters:** 
  * `slot` (number) — index (1-based) of the pinned recipe slot.
  * `recipe_name` (string? | nil) — recipe identifier; `nil` to clear the slot.
  * `skin_name` (string? | nil) — optional skin override for the recipe icon.
* **Returns:** Nothing.

### `GetPinnedRecipes()`
* **Description:** Returns the pinned recipes table for the current page.
* **Parameters:** None.
* **Returns:** `table` — array of pinned recipe entries, each with `recipe_name` and `skin_name`.

### `GetCurrentPage()`
* **Description:** Returns the index of the currently active pinned page.
* **Parameters:** None.
* **Returns:** `number` — current page index (1-based).

### `SetCurrentPage(page_num)`
* **Description:** Switches to the specified pinned page, creating it if necessary, and updates `pinned_recipes`.
* **Parameters:** `page_num` (number) — target page index.
* **Returns:** Nothing.

### `NextPage()`
* **Description:** Cycles to the next pinned page (wraps to page `1` after the last).
* **Parameters:** None.
* **Returns:** Nothing.

### `PrevPage()`
* **Description:** Cycles to the previous pinned page (wraps to the last page from page `1`).
* **Parameters:** None.
* **Returns:** Nothing.

### `MakeDefaultPinnedRecipes()`
* **Description:** Initializes pinned pages with default recipes from `TUNING.DEFAULT_PINNED_RECIPES` and `TUNING.DEFAULT_PINNED_RECIPES_2`.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified.
