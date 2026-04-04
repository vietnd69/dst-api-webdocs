---
id: cookbookdata
title: Cookbookdata
description: Manages player cookbook progression data including discovered foods, learned recipes, and UI filter settings.
tags: [cooking, progression, inventory, data]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: ef55e365
system_scope: inventory
---

# Cookbookdata

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`CookbookData` is a standalone data management class that tracks player progression through the cooking system. It maintains records of which prepared foods have been discovered, which recipes have been learned for each food, and user interface filter preferences. The class handles persistence by saving and loading data from disk, and supports synchronization with online profile data when available. This component is not attached to entities via the component system but is instantiated as a utility class for managing cookbook state.

## Usage example
```lua
local CookbookData = require("cookbookdata")
local cookbook = CookbookData()

cookbook:Load()
cookbook:LearnFoodStats("meatballs")
cookbook:AddRecipe("meatballs", {"meat", "meat", "meat", "meat"})
cookbook:SetFilter("category", "meat")
cookbook:Save(true)
```

## Dependencies & tags
**Components used:** None (this is a standalone class, not an entity component)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `preparedfoods` | table | `{}` | Stores all discovered prepared food entries with their recipes and eaten status. |
| `newfoods` | table | `{}` | Tracks which foods were newly discovered this session. |
| `filters` | table | `{}` | Stores UI filter settings for the cookbook interface. |
| `dirty` | boolean | `nil` | Indicates whether data has changed and needs to be saved. |
| `synced` | boolean | `nil` | Indicates whether online profile data has been synchronized. |
| `save_enabled` | boolean | `nil` | Controls whether automatic saving is enabled (commented in constructor). |

## Main functions
### `GetKnownPreparedFoods()`
*   **Description:** Returns the table containing all discovered prepared foods.
*   **Parameters:** None.
*   **Returns:** Table of prepared food data.

### `Save(force_save)`
*   **Description:** Persists cookbook data to disk using `TheSim:SetPersistentString`. Only saves if `force_save` is true or if `save_enabled` and `dirty` are both true.
*   **Parameters:** `force_save` (boolean) - forces save regardless of dirty state.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if save conditions are not met.

### `Load()`
*   **Description:** Loads cookbook data from persistent storage. Attempts to decode JSON data and handles corruption by falling back to online profile data.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** May fail to load if persistent string is corrupted; attempts recovery via online profile data.

### `ApplyOnlineProfileData()`
*   **Description:** Synchronizes cookbook data with the player's online inventory profile. Only executes if not already synced and inventory support is available.
*   **Parameters:** None.
*   **Returns:** Boolean indicating whether sync was successful.
*   **Error states:** Returns `false` if sync conditions are not met or inventory data is unavailable.

### `IsNewFood(product)`
*   **Description:** Checks if a food product was newly discovered this session.
*   **Parameters:** `product` (string) - the prepared food name.
*   **Returns:** Boolean.

### `ClearNewFlags()`
*   **Description:** Resets all new food discovery flags.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ClearFilters()`
*   **Description:** Removes all filter settings and marks data as dirty.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetFilter(category, value)`
*   **Description:** Sets a filter value for a specific category and marks data as dirty if changed.
*   **Parameters:** `category` (string) - filter category name, `value` (any) - filter value.
*   **Returns:** Nothing.

### `GetFilter(category)`
*   **Description:** Retrieves the current filter value for a category.
*   **Parameters:** `category` (string) - filter category name.
*   **Returns:** The filter value or `nil` if not set.

### `IsUnlocked(product)`
*   **Description:** Checks if a prepared food product has been discovered.
*   **Parameters:** `product` (string) - the prepared food name.
*   **Returns:** Boolean or the prepared food entry table if unlocked.

### `IsValidEntry(product)`
*   **Description:** Validates whether a product exists in the cooking recipe database.
*   **Parameters:** `product` (string) - the prepared food name.
*   **Returns:** Boolean.

### `LearnFoodStats(product)`
*   **Description:** Marks a food product as eaten/learned. Updates new food flags and triggers save if enabled.
*   **Parameters:** `product` (string) - the prepared food name.
*   **Returns:** Boolean indicating whether the record was updated.
*   **Error states:** Returns `false` if product is `nil` or not a valid entry.

### `AddRecipe(product, ingredients)`
*   **Description:** Adds a recipe combination to a prepared food entry. Maintains a maximum of 6 recipes per food, prioritizing new combinations.
*   **Parameters:** `product` (string) - the prepared food name, `ingredients` (table) - list of ingredient names.
*   **Returns:** Boolean indicating whether the record was updated.
*   **Error states:** Returns `false` if product or ingredients are `nil` or product is not valid.

### `RemoveCookedFromName(ingredients)`
*   **Description:** Normalizes ingredient names by removing cooking-related suffixes and prefixes.
*   **Parameters:** `ingredients` (table) - list of ingredient names.
*   **Returns:** Table of normalized ingredient names.

## Events & listeners
Not applicable. This class does not interact with the entity event system.