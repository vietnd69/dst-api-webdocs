---
id: quagmire_recipebook
title: Quagmire Recipebook
description: Manages persistent storage, filtering, and state for Quagmire Festival recipes, including unlocks, sessions, and appraisal data.
tags: [crafting, persistence, event]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 1c5c8a41
system_scope: crafting
---

# Quagmire Recipebook

> Based on game build **714004** | Last updated: 2026-03-10

## Overview
`QuagmireRecipeBook` is a persistent data component that tracks discovered Quagmire Festival recipes, their cooking sessions, valid ingredients (with deduplication), and appraisal values (coin tiers and tags like `snack` or `matchedcraving`). It operates independently of specific entities and is typically instantiated at the world level, listening for global events like `"quagmire_recipediscovered"` and `"quagmire_recipeappraised"` to update its state. It saves to and loads from persistent storage using `"recipebook"` as the key, and pushes UI update events when changes occur.

## Usage example
```lua
-- Assumes QuagmireRecipeBook is loaded and registered in a world context
local recipe_book = QuagmireRecipeBook()
recipe_book:Load()
recipe_book:RegisterWorld(TheWorld)
-- Recipe discovery/appraisal events are handled automatically after registration
```

## Dependencies & tags
**Components used:** `EventAchievements`, `TheNet`, `TheSim`, `TheWorld`  
**Tags:** None directly added or removed. Checks `achievement` string `"food_<name>"` for unlocks.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `recipes` | table | `{}` | Map from recipe product string (e.g., `"quagmire_stew"`) to recipe metadata (ingredients, stations, tags, appraisal values, session info). |
| `dirty` | boolean | `false` | Flag indicating whether unsaved changes exist; triggers save on next operation. |
| `filters` | table | `{}` | Reserved field; no functional usage observed in current implementation. |

## Main functions
### `IsRecipeUnlocked(product)`
* **Description:** Checks whether a recipe is unlocked via Quagmire achievements for the current event season.
* **Parameters:** `product` (string) — Full product name of the recipe (e.g., `"quagmire_stew"`).
* **Returns:** `boolean` — `true` if the corresponding achievement `"food_<last_part>"` is unlocked; `false` otherwise.

### `GetValidRecipes()`
* **Description:** Returns a filtered copy of `recipes`, including only those either unlocked via achievement or currently active in the player’s session.
* **Parameters:** None.
* **Returns:** `table` — A shallow-copied table with keys for all valid recipes; only recipes matching either achievement unlock *or* current `sessionid` are included.

### `Load()`
* **Description:** Asynchronously loads recipe data from persistent storage (`"recipebook"`) using `TheSim:GetPersistentString`, decodes JSON, and runs deduplication cleanup. Clears `dirty` on success.
* **Parameters:** None.
* **Returns:** Nothing. The operation is asynchronous; state is updated via callback.

### `Save()`
* **Description:** Saves current `recipes` table to persistent storage as JSON. Triggers `"quagmire_refreshrecipbookwidget"` on `TheWorld` if `dirty` is `true`. Clears `dirty` upon successful write.
* **Parameters:** None.
* **Returns:** Nothing.

### `RegisterWorld(world)`
* **Description:** Registers event listeners for `"quagmire_recipediscovered"` and `"quagmire_recipeappraised"` on the provided world instance to drive updates.
* **Parameters:** `world` (entity) — The world instance to attach event listeners to.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"quagmire_recipediscovered"` — Triggers `OnRecipeDiscovered` to record new recipes, update stations, and deduplicate ingredient combos.  
  - `"quagmire_recipeappraised"` — Triggers `OnRecipeAppraised` to update coin appraisal values and recipe tags (`snack`, `matchedcraving`).  
- **Pushes:**  
  - `"quagmire_refreshrecipbookwidget"` — Fired during save if `dirty == true`.  
  - `"quagmire_notifyrecipeupdated"` — Fired with a deep copy of recipe data (including `new_recipe` boolean) after each discovery or appraisal event.