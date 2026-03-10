---
id: cookbookdata
title: Cookbookdata
description: Manages the player's unlocked recipes, food discovery status, and cooking filters for the cooking system.
tags: [crafting, inventory, persistence, ui]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: ef55e365
system_scope: crafting
---

# Cookbookdata

> Based on game build **7140014** | Last updated: 2026-03-10

## Overview
`CookbookData` is a client-side component that tracks which prepared foods a player has unlocked (via cooking or eating), their recipes, and which dishes were recently discovered (`newfoods`). It persists unlocked data across sessions using `TheSim:SetPersistentString`, and supports syncing with online inventory data when available. It works closely with the `cooking` system to validate recipes and manage data encoding/decoding for storage. This component is intended for use on the player entity to power the in-game cookbook UI.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("cookbookdata")

-- Load persisted data
inst.components.cookbookdata:Load()

-- Learn a newly eaten food
inst.components.cookbookdata:LearnFoodStats("crockpot_stew")

-- Add a newly unlocked recipe (e.g., after cooking)
inst.components.cookbookdata:AddRecipe("crockpot_stew", {"berries", "egg", "honey"})

-- Check discovery status
if inst.components.cookbookdata:IsNewFood("crockpot_stew") then
    -- show UI indicator
end

-- Clear flags after UI presentation
inst.components.cookbookdata:ClearNewFlags()
```

## Dependencies & tags
**Components used:** `TheSim`, `TheInventory`, `TheFrontEnd`, `TheNet`, `cooking`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `preparedfoods` | table | `{}` | Map of `product_name -> {recipes = {...}, has_eaten = boolean}` for all unlocked foods. |
| `newfoods` | table | `{}` | Set of recently discovered products (consumed but not yet presented in UI). |
| `filters` | table | `{}` | User-applied filter state for cookbook UI (e.g., `"category" -> value`). |
| `dirty` | boolean | `false` | Flag indicating local unsaved changes. |
| `save_enabled` | boolean | Not set (nil) | Controls whether `:Save()` writes data (controlled externally via `self.save_enabled`). |
| `synced` | boolean | `false` | Indicates whether online inventory data has been applied via `:ApplyOnlineProfileData()`. |

## Main functions
### `GetKnownPreparedFoods()`
* **Description:** Returns the internal table of all unlocked prepared foods.
* **Parameters:** None.
* **Returns:** `table` — Map of product names to recipe metadata (`{recipes, has_eaten}`).

### `Save(force_save)`
* **Description:** Persists current state to disk using `TheSim:SetPersistentString`, but only if `force_save` is `true` or (`save_enabled` and `dirty`).
* **Parameters:** `force_save` (boolean) — Bypass `save_enabled` and `dirty` checks.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; relies on `TheSim` for persistence.

### `Load()`
* **Description:** Loads persisted cookbook data from disk. On parse failure, attempts recovery via `:ApplyOnlineProfileData()` and clears data if both fail.
* **Parameters:** None.
* **Returns:** Nothing.

### `ApplyOnlineProfileData()`
* **Description:** Fills `preparedfoods` from online inventory data (via `TheInventory:GetLocalCookBook()`), using decoding helpers. Only executes if online mode and inventory is available.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if online data was successfully applied.
* **Error states:** Returns `false` if online sync is not available or `TheInventory` lacks data.

### `LearnFoodStats(product)`
* **Description:** Records that the player has eaten a food (`has_eaten = true`), marks it as `newfoods`, and triggers network and disk persistence.
* **Parameters:** `product` (string) — The prepared food name (e.g., `"crockpot_stew"`).
* **Returns:** `boolean` — `true` if new data was recorded (`has_eaten` changed), otherwise `false`.
* **Error states:** Silently returns `false` if `product` is invalid or not in `cooking.cookbook_recipes`.

### `AddRecipe(product, ingredients)`
* **Description:** Adds or updates a recipe for a prepared food, up to `MAX_RECIPES = 6`. Moves new recipes to the front and deduplicates if already known.
* **Parameters:** 
  * `product` (string) — Prepared food name.
  * `ingredients` (table of strings) — Ordered list of ingredient names.
* **Returns:** `boolean` — `true` if the recipe list changed, otherwise `false`.
* **Error states:** Silently returns `false` if `product` or `ingredients` is `nil` or invalid. Normalizes ingredient names by stripping `"cooked"`/`"_cooked_"` suffixes before storage.

### `IsNewFood(product)`
* **Description:** Checks if the food was recently discovered (i.e., in `newfoods`).
* **Parameters:** `product` (string) — Prepared food name.
* **Returns:** `boolean` — `true` if recently discovered.

### `ClearNewFlags()`
* **Description:** Clears all `newfoods` entries (typically after presenting them in UI).
* **Parameters:** None.
* **Returns:** Nothing.

### `ClearFilters()`
* **Description:** Resets all filter settings and marks data as dirty.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetFilter(category, value)`
* **Description:** Sets a UI filter value for a given category (e.g., `"type"`, `"difficulty"`), marking data as dirty on change.
* **Parameters:** 
  * `category` (string) — Filter key.
  * `value` (any) — Filter value.
* **Returns:** Nothing.

### `GetFilter(category)`
* **Description:** Returns the current value of a UI filter.
* **Parameters:** `category` (string) — Filter key.
* **Returns:** `any` — Current filter value or `nil`.

### `IsUnlocked(product)`
* **Description:** Checks if a prepared food is unlocked (exists in `preparedfoods`).
* **Parameters:** `product` (string) — Prepared food name.
* **Returns:** `boolean` — `true` if unlocked.

### `IsValidEntry(product)`
* **Description:** Validates that `product` is a known recipe in the `cooking.cookbook_recipes` table.
* **Parameters:** `product` (string) — Prepared food name.
* **Returns:** `boolean` — `true` if valid.

### `RemoveCookedFromName(ingredients)`
* **Description:** Normalizes ingredient names by stripping `"cooked"`, `"_cooked_"`, etc., from strings in the list.
* **Parameters:** `ingredients` (table of strings) — Raw ingredient names.
* **Returns:** `table of strings` — Normalized ingredient names.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.