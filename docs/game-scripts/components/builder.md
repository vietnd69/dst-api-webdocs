---
id: builder
title: Builder
description: Manages crafting, recipe unlocking, and prototyping mechanics for player entities.
tags: [crafting, inventory, player]
sidebar_position: 10

last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: 6d6b39c8
system_scope: crafting
---

# Builder

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Builder` is the core crafting component attached to player entities. It manages recipe knowledge, tech tree progression, ingredient validation, and the actual construction of items and structures. The component tracks which recipes a player has unlocked, monitors nearby prototyping stations, handles temporary and permanent tech bonuses, and coordinates with the `inventory`, `health`, and `sanity` components for character ingredient costs. Network replication is handled through `inst.replica.builder` for client-server synchronization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("builder")

-- Unlock a specific recipe
inst.components.builder:UnlockRecipe("axe")

-- Check if player can build a recipe
local recipe = GetValidRecipe("campfire")
if inst.components.builder:HasIngredients(recipe) then
    inst.components.builder:DoBuild("campfire", inst:GetPosition(), 0)
end

-- Enable free build mode (debug)
inst.components.builder.freebuildmode = true
```

## Dependencies & tags
**External dependencies:**
- `techtree` -- TechTree class for managing technology tree structures and bonuses

**Components used:**
- `prototyper` -- Activates/turns on nearby research machines
- `craftingstation` -- Retrieves recipe limits and known recipes from stations
- `container` -- Drops contained items when crafting with container ingredients
- `inventory` -- Checks for ingredients, removes items, gives crafted products
- `inventoryitem` -- Checks moisture levels, handles item dropping
- `health` -- Applies health costs and penalties for character ingredients
- `sanity` -- Applies sanity costs and grants sanity on recipe unlock
- `locomotor` -- Stops movement during build actions
- `rider` -- Checks if player is mounted (blocks certain builds)
- `petleash` -- Checks pet capacity for orphanage recipes
- `giftreceiver` -- Links to gift machine when near prototyper
- `talker` -- Displays failure messages for item mimics
- `skilltreeupdater` -- Checks skill tree requirements for recipes
- `hunger` -- Applies hunger delta for hungry builder mechanic
- `rainimmunity` -- Checks rain immunity for ingredient wetness
- `equippable` -- Checks equip slots and restrictions
- `stackable` -- Manages stack sizes for multi-item crafts
- `itemmimic` -- Detects and reveals mimic items in ingredients

**Tags:**
- `INLIMBO` -- Excluded from prototyper search
- `fire` -- Excluded from prototyper search
- `prototyper` -- Identifies valid research machines
- `giftmachine` -- Identifies gift machine prototypers
- `hungrybuilder` -- Enables hungry builder mechanic
- `health_as_oldage` -- Scales health costs for old age
- `builder_tag` -- Recipe-specific tag requirement (checked, not added)
- `no_builder_tag` -- Recipe-specific tag exclusion (checked, not added)
- `nocrafting` -- Excludes items from being used as crafting ingredients (checked)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | The owning entity instance. |
| `recipes` | table | `{}` | List of unlocked recipe names. |
| `station_recipes` | table | `{}` | Recipes available from current crafting station. |
| `accessible_tech_trees` | table | `TechTree.Create()` | Current tech tree levels including temp bonuses. |
| `accessible_tech_trees_no_temp` | table | `TechTree.Create()` | Tech tree levels without temporary bonuses. |
| `old_accessible_tech_trees` | table | `{}` | Previous tech tree state for change detection. |
| `current_prototyper` | Entity | `nil` | Currently active prototyping station entity. |
| `buffered_builds` | table | `{}` | Map of recipe names that are buffered for placement. |
| `ingredientmod` | number | `1` | Multiplier for ingredient amounts (discounts). |
| `freebuildmode` | boolean | `false` | When true, all recipes are available without requirements. |
| `exclude_tags` | table | `{"INLIMBO", "fire"}` | Tags that exclude entities from prototyper consideration. |
| `last_hungry_build` | number | `nil` | Timestamp of last hungry builder action. |
| `last_hungry_build_pt` | Vector3 | `nil` | Position of last hungry builder action. |
| `temptechbonus_count` | number | `nil` | Counter for active temporary tech bonuses. |
| `override_current_prototyper` | Entity | `nil` | Manually overridden prototyper entity. |

## Main functions
### `ActivateCurrentResearchMachine(recipe)`
* **Description:** Activates the current prototyper for the given recipe, triggering the prototyper's Activate method.
* **Parameters:** `recipe` -- recipe table to activate for.
* **Returns:** None.
* **Error states:** None.

### `OnSave()`
* **Description:** Serializes builder state for save data including buffered builds, recipes, hungry builder state, and temp bonuses.
* **Parameters:** None.
* **Returns:** Table containing save data or `nil` if nothing to save.
* **Error states:** None.

### `OnLoad(data)`
* **Description:** Restores builder state from save data, re-applying buffered builds, recipes, and temp bonuses.
* **Parameters:** `data` -- table containing saved builder state.
* **Returns:** None.
* **Error states:** None.

### `IsBuildBuffered(recname)`
* **Description:** Checks if a recipe is currently buffered for placement.
* **Parameters:** `recname` -- string recipe name.
* **Returns:** Boolean indicating if recipe is buffered.
* **Error states:** None.

### `OnUpdate()`
* **Description:** Called every frame via StartUpdatingComponent; evaluates tech trees for nearby prototypers.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `GiveAllRecipes()`
* **Description:** Toggles free build mode and pushes unlockrecipe event.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `UnlockRecipesForTech(tech)`
* **Description:** Unlocks all recipes that match the given tech tree levels.
* **Parameters:** `tech` -- tech tree table with level requirements.
* **Returns:** None.
* **Error states:** None.

### `GetTechBonuses()`
* **Description:** Returns combined permanent and temporary tech bonuses for all tech types.
* **Parameters:** None.
* **Returns:** Table mapping tech types to bonus values.
* **Error states:** None.

### `GetTempTechBonuses()`
* **Description:** Returns only temporary tech bonuses (excludes permanent bonuses).
* **Parameters:** None.
* **Returns:** Table mapping tech types to temporary bonus values.
* **Error states:** None.

### `GiveTempTechBonus(tech)`
* **Description:** Applies temporary tech bonuses and increments the temp bonus counter.
* **Parameters:** `tech` -- table mapping tech types to bonus values.
* **Returns:** None.
* **Error states:** None.

### `ConsumeTempTechBonuses()`
* **Description:** Decrements temp bonus counter and clears bonuses when counter reaches zero.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Asserts in dev branch if `temptechbonus_count` is nil when called.

### `EvaluateTechTrees()`
* **Description:** Scans for nearby prototypers, updates accessible tech trees, and syncs station recipes.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `UsePrototyper(prototyper)`
* **Description:** Manually sets the current prototyper, validating tags and restrictions.
* **Parameters:** `prototyper` -- entity to use as prototyper or `nil` to clear.
* **Returns:** Boolean success, optional fail reason string.
* **Error states:** None.

### `AddRecipe(recname)`
* **Description:** Adds a recipe to the unlocked list and replicates to clients.
* **Parameters:** `recname` -- string recipe name.
* **Returns:** None.
* **Error states:** None.

### `RemoveRecipe(recname)`
* **Description:** Removes a recipe from the unlocked list and replicates to clients.
* **Parameters:** `recname` -- string recipe name.
* **Returns:** None.
* **Error states:** None.

### `UnlockRecipe(recname)`
* **Description:** Unlocks a recipe, grants sanity, and adds to unlocked list if not nounlock.
* **Parameters:** `recname` -- string recipe name.
* **Returns:** None.
* **Error states:** None.

### `GetIngredientWetness(ingredients)`
* **Description:** Calculates total wetness from crafting ingredients for moisture inheritance.
* **Parameters:** `ingredients` -- table of ingredient entities and counts.
* **Returns:** Number representing total wetness value.
* **Error states:** None.

### `GetIngredients(recname)`
* **Description:** Retrieves all ingredient items from inventory for a recipe, applying ingredientmod.
* **Parameters:** `recname` -- string recipe name.
* **Returns:** Table of ingredients, boolean indicating if discounted.
* **Error states:** Errors if `inst.components.inventory` is nil (no guard present).

### `CheckIngredientsForMimic(ingredients)`
* **Description:** Checks ingredients for item mimics and reveals them if found.
* **Parameters:** `ingredients` -- table of ingredient entities.
* **Returns:** Boolean indicating if mimic was found and revealed.
* **Error states:** None.

### `CheckDiscountEquipsForMimic()`
* **Description:** Checks equipped items (specifically green amulet) for item mimics.
* **Parameters:** None.
* **Returns:** Boolean indicating if mimic was found and revealed.
* **Error states:** None.

### `RemoveIngredients(ingredients, recname, discounted)`
* **Description:** Consumes ingredients from inventory, applies character costs, and drops container contents.
* **Parameters:**
  - `ingredients` -- table of ingredient entities and counts
  - `recname` -- string recipe name
  - `discounted` -- boolean indicating if ingredients were discounted
* **Returns:** None.
* **Error states:** Errors if `inst.components.inventory` or `inst.components.health` or `inst.components.sanity` is nil when character ingredients require them.

### `HasCharacterIngredient(ingredient)`
* **Description:** Checks if player has required character ingredients (health, sanity, max health, max sanity).
* **Parameters:** `ingredient` -- character ingredient table with type and amount.
* **Returns:** Boolean has ingredient, number representing current/remaining value.
* **Error states:** None.

### `HasTechIngredient(ingredient)`
* **Description:** Checks if player has required tech tree level for material ingredients.
* **Parameters:** `ingredient` -- tech ingredient table with type and amount.
* **Returns:** Boolean has ingredient, number representing current tech level.
* **Error states:** None.

### `MakeRecipe(recipe, pt, rot, skin, onsuccess)`
* **Description:** Initiates build action through locomotor, creating buffered action for construction.
* **Parameters:**
  - `recipe` -- recipe table
  - `pt` -- Vector3 build position (optional)
  - `rot` -- number rotation in radians (optional)
  - `skin` -- string skin name (optional)
  - `onsuccess` -- function callback on success (optional)
* **Returns:** Boolean indicating if build action was initiated.
* **Error states:** Errors if `inst.components.locomotor` is nil (no guard present).

### `DoBuild(recname, pt, rotation, skin)`
* **Description:** Executes the actual build, spawning prefab, consuming ingredients, and giving item to player.
* **Parameters:**
  - `recname` -- string recipe name
  - `pt` -- Vector3 build position (optional)
  - `rotation` -- number rotation in radians (optional)
  - `skin` -- string skin name (optional)
* **Returns:** Boolean success, optional fail reason string.
* **Error states:** Errors if `inst.components.inventory`, `inst.components.rider`, or `inst.components.petleash` is nil when recipe checks require them.

### `KnowsRecipe(recipe, ignore_tempbonus, cached_tech_trees)`
* **Description:** Checks if player knows/can craft a recipe based on unlocks, tech trees, tags, and skills.
* **Parameters:**
  - `recipe` -- recipe table or string recipe name
  - `ignore_tempbonus` -- boolean to exclude temp bonuses (optional)
  - `cached_tech_trees` -- table for caching tech tree checks (optional)
* **Returns:** Boolean indicating if recipe is known.
* **Error states:** None.

### `HasIngredients(recipe)`
* **Description:** Checks if player has all required ingredients including inventory, character, and tech ingredients.
* **Parameters:** `recipe` -- recipe table or string recipe name.
* **Returns:** Boolean indicating if all ingredients are available.
* **Error states:** Errors if `inst.components.inventory` is nil (no guard present).

### `CanBuild(recipe_name)`
* **Description:** Deprecated alias for HasIngredients.
* **Parameters:** `recipe_name` -- string recipe name.
* **Returns:** Boolean indicating if ingredients are available.
* **Error states:** None.

### `CanLearn(recname)`
* **Description:** Checks if player meets tag and skill requirements to learn a recipe (ignores ingredients).
* **Parameters:** `recname` -- string recipe name.
* **Returns:** Boolean indicating if recipe can be learned.
* **Error states:** None.

### `LongUpdate(dt)`
* **Description:** Called periodically; decrements hungry builder timer.
* **Parameters:** `dt` -- number delta time in seconds.
* **Returns:** None.
* **Error states:** None.

### `MakeRecipeFromMenu(recipe, skin)`
* **Description:** Handles recipe crafting from the crafting menu UI, including ingredient recipe chaining.
* **Parameters:**
  - `recipe` -- recipe table
  - `skin` -- string skin name (optional)
* **Returns:** None.
* **Error states:** Errors if `inst.components.inventory` is nil when checking IsOpenedBy.

### `MakeRecipeAtPoint(recipe, pt, rot, skin)`
* **Description:** Handles buffered placement crafting at a specific map point.
* **Parameters:**
  - `recipe` -- recipe table
  - `pt` -- Vector3 build position
  - `rot` -- number rotation in radians
  - `skin` -- string skin name (optional)
* **Returns:** None.
* **Error states:** Errors if `inst.components.inventory` is nil when checking IsOpenedBy.

### `BufferBuild(recname)`
* **Description:** Buffers a build for later placement, consuming ingredients immediately.
* **Parameters:** `recname` -- string recipe name.
* **Returns:** None.
* **Error states:** Errors if `inst.components.inventory` or `inst.components.talker` is nil.

## Events & listeners
- **Listens to:** None directly (uses `StartUpdatingComponent` for OnUpdate cycle)
- **Pushes:**
  - `unlockrecipe` -- fired when a recipe is unlocked (with recipe name in data)
  - `techtreechange` -- fired when accessible tech trees change (with level table in data)
  - `consumehealthcost` -- fired when health is consumed for character ingredients
  - `consumeingredients` -- fired when ingredients are consumed (with discounted flag in data)
  - `makerecipe` -- fired when starting to make a recipe (with recipe in data)
  - `hungrybuild` -- fired when hungry builder hunger delta is applied
  - `refreshcrafting` -- fired before build execution
  - `builditem` -- fired when inventory item is built (with item, recipe, skin, prototyper in data)
  - `buildstructure` -- fired when structure is built (with item, recipe, skin in data)