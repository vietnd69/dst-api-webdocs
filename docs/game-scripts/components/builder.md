---
id: builder
title: Builder
description: Manages crafting recipes, prototyper access, tech tree progress, and ingredient consumption for builder-type entities.
tags: [crafting, inventory, player, techtree]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4e2bad0f
system_scope: crafting
---

# Builder

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Builder` is a core component that enables entities (primarily players) to craft items, access prototyper machines, manage unlocked recipes, and consume ingredient costs—including character-based costs like health, sanity, and tech-levels. It integrates with `inventory`, `craftingstation`, `prototyper`, `sanity`, `health`, `hunger`, `locomotor`, `petleash`, and `itemmimic` components, and synchronizes state via replica updates.

The component dynamically evaluates nearby prototyper machines, updates accessible tech trees (including bonuses and temporary bonuses), and supports buffered builds, free build mode, and ingredient mimics.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("builder")

-- Unlock a specific recipe (requires tech and recipe constraints)
inst.components.builder:UnlockRecipe("stone_pickaxe")

-- Check if a recipe is known and buildable
if inst.components.builder:KnowsRecipe("stone_pickaxe") then
    -- Attempt to build at a position
    inst.components.builder:MakeRecipe("stone_pickaxe", inst:GetPosition(), 0, nil)
end

-- Set free build mode (grants access to all recipes)
inst.components.builder:GiveAllRecipes()
```

## Dependencies & tags
**Components used:** `container`, `craftingstation`, `equippable`, `giftreceiver`, `health`, `hunger`, `inventory`, `inventoryitem`, `itemmimic`, `locomotor`, `petleash`, `prototyper`, `rider`, `sanity`, `skilltreeupdater`, `stackable`, `talker`  
**Tags added/removed:** None identified by `Builder` itself. It checks tags like `"INLIMBO"`, `"fire"`, `"prototyper"`, and `v.owner_tag` from `CUSTOM_RECIPETABS`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `recipes` | table (array of strings) | `{}` | List of unlocked recipe names (by name). |
| `station_recipes` | table (key: string, value: number or `true`) | `{}` | Recipes available via current crafting station; `true` if unlimited, otherwise max allowed per station. |
| `accessible_tech_trees` | TechTree | `TechTree.Create()` | Current effective tech levels (base + temp bonuses). |
| `accessible_tech_trees_no_temp` | TechTree | `TechTree.Create()` | Tech levels without temporary bonuses. |
| `old_accessible_tech_trees` | table | `{}` | Backup of previous tech tree for change detection. |
| `current_prototyper` | Entity (optional) | `nil` | Closest valid prototyper machine in range. |
| `buffered_builds` | table | `{}` | Set of recipe names that are buffered for build-on-command. |
| `ingredientmod` | number | `1` | Multiplier for ingredient amounts (e.g., from equipment like chef’s hat). |
| `freebuildmode` | boolean | `false` | If `true`, skip ingredient/recipe checks and grant access to all recipes. |
| `override_current_prototyper` | Entity (optional) | `nil` | Override used to force a specific prototyper. |
| `exclude_tags` | table | `{"INLIMBO", "fire"}` | Tags that exclude prototyper entities from consideration. |
| `temptechbonus_count` | number (optional) | `nil` | Counter for how many pending temp bonus consumptions exist. |

## Main functions
### `ActivateCurrentResearchMachine(recipe)`
*   **Description:** Attempts to activate the current prototyper/crafting station to prototype a recipe (e.g., to unlock it).
*   **Parameters:** `recipe` (table or string) — Recipe to activate.
*   **Returns:** Nothing.
*   **Error states:** No-op if `current_prototyper` is invalid or missing `prototyper` component.

### `OnSave()`
*   **Description:** Serializes state for world save, including buffered builds, unlocked recipes, hungry builder state, and temporary tech bonuses.
*   **Parameters:** None.
*   **Returns:** Table containing `buffered_builds`, `recipes`, `hungrytime`, `hungrypt`, `tempbonuses`, `temptechbonus_count`.

### `OnLoad(data)`
*   **Description:** Restores builder state from save data.
*   **Parameters:** `data` (table) — Serialized builder state.
*   **Returns:** Nothing.

### `IsBuildBuffered(recname)`
*   **Description:** Checks if `recname` is currently buffered for later build.
*   **Parameters:** `recname` (string) — Recipe name.
*   **Returns:** `boolean` — Whether the recipe is buffered.

### `GiveAllRecipes()`
*   **Description:** Toggles free build mode (grants access to all recipes) and fires `unlockrecipe`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UnlockRecipesForTech(tech)`
*   **Description:** Unlocks all recipes whose tech levels are satisfied by `tech`.
*   **Parameters:** `tech` (table) — Tech level map.
*   **Returns:** Nothing.

### `GetTechBonuses()`
*   **Description:** Returns combined permanent and temporary tech bonuses.
*   **Parameters:** None.
*   **Returns:** Table mapping tech keys (e.g., `"PERCEPTION"`) to numeric bonus values.

### `GetTempTechBonuses()`
*   **Description:** Returns only temporary tech bonuses.
*   **Parameters:** None.
*   **Returns:** Table mapping tech keys to temporary bonus values.

### `GiveTempTechBonus(tech)`
*   **Description:** Applies temporary tech bonuses and increments `temptechbonus_count`.
*   **Parameters:** `tech` (table) — Map of tech keys to bonus values.
*   **Returns:** Nothing.

### `ConsumeTempTechBonuses()`
*   **Description:** Decrements `temptechbonus_count` and clears temp bonuses if count reaches `0`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Asserts in dev builds if called without `temptechbonus_count` set.

### `EvaluateTechTrees()`
*   **Description:** Scans nearby prototyper entities, updates accessible tech trees, syncs crafting station recipes, and notifies listeners of changes. Also updates gift machine state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UsePrototyper(prototyper)`
*   **Description:** Forces the builder to use a specific prototyper (overrides automatic selection).
*   **Parameters:** `prototyper` (Entity or `nil`) — Prototyper instance.
*   **Returns:** `boolean` — Success; `fail_reason` string if failure (e.g., `"RESTRICTEDTAG"`).
*   **Error states:** Returns `false` if target lacks `prototyper` tag, is excluded by `exclude_tags`, or fails `restrictedtag` checks.

### `AddRecipe(recname)`
*   **Description:** Adds a recipe to the unlocked list and replicates addition.
*   **Parameters:** `recname` (string) — Recipe name.
*   **Returns:** Nothing.

### `RemoveRecipe(recname)`
*   **Description:** Removes a recipe from the unlocked list and replicates removal.
*   **Parameters:** `recname` (string) — Recipe name.
*   **Returns:** Nothing.

### `UnlockRecipe(recname)`
*   **Description:** Unlocks a recipe, grants sanity, and fires `unlockrecipe` event.
*   **Parameters:** `recname` (string) — Recipe name.
*   **Returns:** Nothing.
*   **Error states:** No-op if recipe does not exist or has `nounlock = true`.

### `GetIngredientWetness(ingredients)`
*   **Description:** Computes average wetness of ingredients based on item moisture and world wetness.
*   **Parameters:** `ingredients` (table) — Map of item instances to counts.
*   **Returns:** number — Total wetness sum.

### `GetIngredients(recname)`
*   **Description:** Finds and returns ingredient items and their available counts for `recname`.
*   **Parameters:** `recname` (string) — Recipe name.
*   **Returns:** `ingredients` (table), `discounted` (boolean). `ingredients` maps item types to slot/item counts; `discounted` indicates if some ingredients fell short.

### `CheckIngredientsForMimic(ingredients)`
*   **Description:** Scans ingredients for item mimics; triggers evil reveal if found.
*   **Parameters:** `ingredients` (table) — Map of item instances to counts.
*   **Returns:** `boolean` — `true` if any mimic triggered.

### `CheckDiscountEquipsForMimic()`
*   **Description:** Scans equipped items (e.g., green amulet) for mimics.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if mimic triggered.

### `RemoveIngredients(ingredients, recname, discounted)`
*   **Description:** Deducts items from inventory and applies character-based costs (health, sanity, etc.). Skips if `freebuildmode`.
*   **Parameters:** `ingredients` (table), `recname` (string), `discounted` (boolean).
*   **Returns:** Nothing.

### `HasCharacterIngredient(ingredient)`
*   **Description:** Checks if the builder meets character-based ingredient requirements.
*   **Parameters:** `ingredient` (table) — `{type = HEALTH | MAX_HEALTH | SANITY | MAX_SANITY, amount = number}`.
*   **Returns:** `canafford` (boolean), `current_amount` (number or `0`).

### `HasTechIngredient(ingredient)`
*   **Description:** Checks if the builder meets tech-level ingredient requirements.
*   **Parameters:** `ingredient` (table) — `{type = TECH_MATERIAL, amount = number}`.
*   **Returns:** `canafford` (boolean), `level` (number or `0`).

### `MakeRecipe(recipe, pt, rot, skin, onsuccess)`
*   **Description:** Prepares a buffered build action (not immediate).
*   **Parameters:** `recipe` (table), `pt` (Vector3 or `nil`), `rot` (number), `skin` (string), `onsuccess` (function or `nil`).
*   **Returns:** `boolean` — `true` if buffered action was queued.

### `DoBuild(recname, pt, rotation, skin)`
*   **Description:** Performs full crafting logic: checks ingredients, spawns product, modifies inventory/character stats, handles stacking/equipping.
*   **Parameters:** `recname` (string), `pt` (Vector3), `rotation` (number), `skin` (string).
*   **Returns:** `success` (boolean), `failure_reason` (string or `nil`) — `"MOUNTED"`, `"HASPET"`, `"ITEMMIMIC"`, or `nil`.
*   **Error states:** No-op if built from a mounted entity, invalid prototyper, or mimics present.

### `KnowsRecipe(recipe, ignore_tempbonus, cached_tech_trees)`
*   **Description:** Checks if the recipe is known, unlocked, or available via temp bonus or free build.
*   **Parameters:** `recipe` (string or table), `ignore_tempbonus` (boolean), `cached_tech_trees` (table, optional).
*   **Returns:** `boolean`.

### `HasIngredients(recipe)`
*   **Description:** Checks if all ingredient, character, and tech requirements for a recipe are met.
*   **Parameters:** `recipe` (string or table).
*   **Returns:** `boolean`.

### `CanBuild(recipe_name)`
*   **Description:** *Deprecated*. Alias for `HasIngredients(recipe)`.
*   **Parameters:** `recipe_name` (string).
*   **Returns:** `boolean`.

### `CanLearn(recname)`
*   **Description:** Checks if the recipe’s builder/skill constraints are satisfied (ignores unlocks).
*   **Parameters:** `recname` (string).
*   **Returns:** `boolean`.

### `MakeRecipeFromMenu(recipe, skin)`
*   **Description:** Handles crafting initiated from an open inventory UI, including recipe buffering and ingredient substitution for nested recipes.
*   **Parameters:** `recipe` (table), `skin` (string).
*   **Returns:** Nothing.

### `BufferBuild(recname)`
*   **Description:** Buffers a build action for later execution (placers only), consuming ingredients and unlocking if possible.
*   **Parameters:** `recname` (string).
*   **Returns:** Nothing.
*   **Error states:** No-op if inventory not open, non-placer, already buffered, or ingredients missing.

### `LongUpdate(dt)`
*   **Description:** Updates time-sensitive state like `last_hungry_build`.
*   **Parameters:** `dt` (number) — Delta time in seconds.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` (via `inst:ListenForEvent`) for doers (players) when using prototyper machines.
- **Pushes:** `unlockrecipe`, `healthdelta`, `sanitydelta`, `builditem`, `buildstructure`, `consumeingredients`, `refreshcrafting`, `techtreechange`, `hungrybuild`, `makerecipe`.
- **Replica updates:** Sets `IsBuildBuffered`, `AddRecipe`, `RemoveRecipe`, `SetTechTrees`, `SetTechBonus`, `SetTempTechBonus`, `SetIngredientMod`, `SetIsFreeBuildMode`, `SetCurrentPrototyper`, `SetRecipeCraftingLimit`.
