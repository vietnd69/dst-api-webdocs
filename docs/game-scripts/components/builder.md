---
id: builder
title: Builder
description: The Builder component handles recipe unlocking, tech tree evaluation, prototyper interaction, ingredient management, crafting logic, recipe validation, item spawning, and build buffering for entities.
tags: [crafting, building, player, recipes, techtree]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: components
source_hash: c76de506
system_scope: crafting
---

# Builder

> Based on game build **718694** | Last updated: 2026-04-04

## Overview

The Builder component is the core system responsible for all crafting and building operations in Don't Starve Together. It manages recipe knowledge by tracking which recipes a player has unlocked through tech tree progression, skill trees, or direct unlocking. The component continuously evaluates nearby prototypers to determine accessible tech tree levels, updating the player's crafting capabilities in real-time as they move between different crafting stations.

When a player attempts to craft an item, the Builder component validates recipe requirements including tech tree levels, ingredient availability, character costs (health, sanity, hunger), and special conditions like skin unlocks. It handles ingredient collection from the player's inventory and open containers, applying discounts from equipped items and managing special cases like item mimics that can sabotage crafting attempts. For structure placement, the component supports build buffering allowing players to queue multiple builds before executing them.

The component integrates with the replica system to sync tech trees, unlocked recipes, and build buffer state across all clients in multiplayer sessions. It also supports temporary tech bonuses that can be consumed for limited-time crafting access, and handles special game modes like free build for debugging or creative scenarios. Event notifications keep the UI and other systems informed of recipe unlocks, ingredient consumption, and successful builds.

## Usage example

```lua
-- Access the builder component on a player entity
local player = ThePlayer
local builder = player.components.builder

-- Check if player knows a recipe
if builder:KnowsRecipe("wall_stone") then
    -- Check if player has required ingredients
    if builder:HasIngredients("wall_stone") then
        -- Build the structure at a specific position
        local pos = player:GetPosition()
        builder:DoBuild("wall_stone", pos, 0, nil)
    end
end

-- Unlock a recipe programmatically
builder:UnlockRecipe("firepit")

-- Apply temporary tech bonus
builder:GiveTempTechBonus({ SCIENCE = 1 })
```

## Dependencies & tags

**External dependencies:**
- `techtree` -- Required module for TechTree constants and creation.
- `TheSim` -- Used to find entities near the player.
- `TheWorld` -- Accessed for state wetness in ingredient wetness calculation.
- `TheInventory` -- Used to check client ownership of skins.
- `GLOBAL` -- Accesses TUNING, AllRecipes, ACTIONS, BufferedAction, GetTime, Point, and other globals.
- `TUNING` -- Used for hungry builder timing and hunger delta constants
- `TechTree` -- Used for tech tree level definitions and bonuses

**Components used:**
- `prototyper` -- Checked on nearby entities to determine accessible tech trees.
- `craftingstation` -- Used to get recipes and crafting limits from prototypers.
- `giftreceiver` -- Linked to giftmachine prototyper if available.
- `inventory` -- Used to get crafting ingredients and remove items.
- `inventoryitem` -- Checked for moisture and drop physics.
- `itemmimic` -- Checked on ingredients to trigger TurnEvil.
- `sanity` -- Modified when unlocking recipes or paying sanity costs.
- `health` -- Modified when paying health costs or penalties.
- `locomotor` -- Used to push build actions and stop movement.
- `player_classified` -- Checked to see if crafting is enabled.
- `replica.builder` -- Syncs tech trees, recipes, and build buffers to clients.
- `rider` -- Checked to prevent building while mounted
- `petleash` -- Checked for pet limits when building orphanage recipes
- `hunger` -- Modified when hungry builder builds
- `equippable` -- Checked for equip slots and restrictions
- `stackable` -- Used to set stack size for multiple built items
- `talker` -- Used to say failure messages for mimic items
- `skilltreeupdater` -- Checked for skill-based recipe unlocks
- `builder` -- Accessed via replica to sync build buffer state
- `transform` -- Used to set position and rotation of built structures

**Tags:**
- `INLIMBO` -- check
- `fire` -- check
- `prototyper` -- check
- `giftmachine` -- check
- `health_as_oldage` -- check
- `hungrybuilder` -- check
- `critter` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.inst` | Entity | `inst` | The entity instance that owns this component. |
| `self.recipes` | table | `{}` | List of recipe names unlocked by this builder. |
| `self.station_recipes` | table | `{}` | Recipes available via the current crafting station. |
| `self.accessible_tech_trees` | table | `TechTree.Create()` | Current tech tree levels accessible to the player including temp bonuses. |
| `self.accessible_tech_trees_no_temp` | table | `TechTree.Create()` | Tech tree levels without temporary bonuses. |
| `self.old_accessible_tech_trees` | table | `{}` | Snapshot of tech trees from the previous update frame. |
| `self.current_prototyper` | Entity | `nil` | The prototyper entity currently being used by the player. |
| `self.buffered_builds` | table | `{}` | Map of recipe names that are buffered for building. |
| `self.ingredientmod` | number | `1` | Multiplier for ingredient costs (e.g., discounts). |
| `self.freebuildmode` | boolean | `false` | If true, crafting does not consume ingredients. |
| `self.exclude_tags` | table | `{ 'INLIMBO', 'fire' }` | Tags that exclude entities from being valid prototypers. |

## Main functions









### `ActivateCurrentResearchMachine(recipe)`
* **Description:** Activates the current prototyper's prototyper component for the given recipe.
* **Parameters:**
  - `recipe` -- table, the recipe being crafted.
* **Returns:** `nil`
* **Error states:** Returns early if no current prototyper or it is invalid.



### `OnSave()`
* **Description:** Serializes component state for saving, including buffered builds and tech bonuses.
* **Parameters:** None
* **Returns:** `table`
* **Error states:** None

### `OnLoad(data)`
* **Description:** Restores component state from saved data.
* **Parameters:**
  - `data` -- table, saved data from OnSave.
* **Returns:** `nil`
* **Error states:** None

### `IsBuildBuffered(recname)`
* **Description:** Checks if a recipe is currently buffered for building.
* **Parameters:**
  - `recname` -- string, the recipe name to check.
* **Returns:** `boolean`
* **Error states:** None

### `OnUpdate()`
* **Description:** Called every frame; evaluates tech trees and prototyper proximity.
* **Parameters:** None
* **Returns:** `nil`
* **Error states:** None

### `GiveAllRecipes()`
* **Description:** Toggles freebuildmode and pushes unlockrecipe event.
* **Parameters:** None
* **Returns:** `nil`
* **Error states:** None



### `UnlockRecipesForTech(tech)`
* **Description:** Unlocks all recipes that match the provided tech tree levels.
* **Parameters:**
  - `tech` -- table, tech tree levels to unlock recipes for.
* **Returns:** `nil`
* **Error states:** None

### `GetTechBonuses()`
* **Description:** Calculates total tech bonuses including permanent and temporary bonuses.
* **Parameters:** None
* **Returns:** `table`
* **Error states:** None

### `GetTempTechBonuses()`
* **Description:** Returns only the temporary tech bonuses.
* **Parameters:** None
* **Returns:** `table`
* **Error states:** None

### `GiveTempTechBonus(tech)`
* **Description:** Applies temporary tech bonuses and increments the consumption counter.
* **Parameters:**
  - `tech` -- table, mapping of tech names to bonus values.
* **Returns:** `nil`
* **Error states:** None

### `ConsumeTempTechBonuses()`
* **Description:** Decrements the temp bonus counter and clears bonuses if count reaches zero.
* **Parameters:** None
* **Returns:** `nil`
* **Error states:** Asserts in dev branch if count is nil.





### `EvaluateTechTrees()`
* **Description:** Scans for nearby prototypers, updates tech trees, and syncs crafting limits.
* **Parameters:** None
* **Returns:** `nil`
* **Error states:** None

### `UsePrototyper(prototyper)`
* **Description:** Overrides the current prototyper selection manually.
* **Parameters:**
  - `prototyper` -- Entity, the prototyper to use or nil to clear override.
* **Returns:** `boolean, string|nil`
* **Error states:** Returns false and fail reason if prototyper is invalid or restricted.

### `AddRecipe(recname)`
* **Description:** Adds a recipe to the unlocked list and replica.
* **Parameters:**
  - `recname` -- string, the recipe name to add.
* **Returns:** `nil`
* **Error states:** None

### `RemoveRecipe(recname)`
* **Description:** Removes a recipe from the unlocked list and replica.
* **Parameters:**
  - `recname` -- string, the recipe name to remove.
* **Returns:** `nil`
* **Error states:** None

### `UnlockRecipe(recname)`
* **Description:** Unlocks a recipe, grants sanity, and pushes unlock event.
* **Parameters:**
  - `recname` -- string, the recipe name to unlock.
* **Returns:** `nil`
* **Error states:** Returns early if recipe is invalid or nounlock.

### `GetIngredientWetness(ingredients)`
* **Description:** Calculates the total weighted wetness of ingredients used in crafting.
* **Parameters:**
  - `ingredients` -- table, map of items to entities used in crafting.
* **Returns:** `number`
* **Error states:** None

### `GetIngredients(recname)`
* **Description:** Retrieves the inventory items required for a recipe.
* **Parameters:**
  - `recname` -- string, the recipe name.
* **Returns:** `table, boolean`
* **Error states:** Returns nil if recipe not found.

### `CheckIngredientsForMimic(ingredients)`
* **Description:** Checks if any ingredient is an itemmimic and triggers TurnEvil.
* **Parameters:**
  - `ingredients` -- table, map of items to entities.
* **Returns:** `boolean`
* **Error states:** None

### `CheckDiscountEquipsForMimic()`
* **Description:** Checks equipped items for itemmimic (e.g., greenamulet) and triggers TurnEvil.
* **Parameters:** None
* **Returns:** `boolean`
* **Error states:** None

### `RemoveIngredients(ingredients, recname, discounted)`
* **Description:** Consumes ingredients, handles container drops, and applies character costs.
* **Parameters:**
  - `ingredients` -- table, map of items to remove.
  - `recname` -- string, the recipe name.
  - `discounted` -- boolean, whether ingredients were discounted.
* **Returns:** `nil`
* **Error states:** Returns early if freebuildmode is active.

### `HasCharacterIngredient(ingredient)`
* **Description:** Checks if the character has enough health/sanity to pay the ingredient cost.
* **Parameters:**
  - `ingredient` -- table, character ingredient definition (health, sanity, etc.).
* **Returns:** `boolean, number`
* **Error states:** None

### `HasTechIngredient(ingredient)`
* **Description:** Checks if the builder has the required tech level for the ingredient.
* **Parameters:**
  - `ingredient` -- table, tech ingredient definition.
* **Returns:** `boolean, number`
* **Error states:** None

### `MakeRecipe(recipe, pt, rot, skin, onsuccess)`
* **Description:** Initiates the building action via locomotor if ingredients are available.
* **Parameters:**
  - `recipe` -- table, the recipe object.
  - `pt` -- Vector3, build position.
  - `rot` -- number, build rotation.
  - `skin` -- string, skin name.
  - `onsuccess` -- function, callback on success.
* **Returns:** `boolean`
* **Error states:** Returns false if entity is drowning, falling, or floating.



### `DoBuild(recname, pt, rotation, skin)`
* **Description:** Executes the build action, validating recipes, checking ingredients, spawning the product, and handling inventory or placement logic.
* **Parameters:**
  - `recname` -- string, the name of the recipe to build
  - `pt` -- Vector3, the position where the item should be built
  - `rotation` -- number, the rotation angle for the built item
  - `skin` -- string, the skin ID to apply to the built item
* **Returns:** `boolean`, true if build was successful, false otherwise; may also return a failure reason string
* **Error states:** Returns false if mounted, has pet limits, lacks prototyper, missing skin unlock, custom canbuild check fails, or ingredients are mimicked.

### `KnowsRecipe(recipe, ignore_tempbonus, cached_tech_trees)`
* **Description:** Determines if the builder knows a specific recipe based on tech trees, skills, tags, and skin unlocks.
* **Parameters:**
  - `recipe` -- string or table, the recipe name or recipe definition
  - `ignore_tempbonus` -- boolean, whether to ignore temporary tech bonuses
  - `cached_tech_trees` -- table, optional cache for tech tree lookup results
* **Returns:** `boolean`, true if the recipe is known and accessible
* **Error states:** Returns false if recipe is nil, builder tags/skills do not match, or tech tree level is insufficient.

### `HasIngredients(recipe)`
* **Description:** Checks if the builder has all required ingredients for a recipe in their inventory.
* **Parameters:**
  - `recipe` -- string or table, the recipe name or recipe definition
* **Returns:** `boolean`, true if all ingredients are present
* **Error states:** Returns false if recipe is nil, freebuildmode is off, or any ingredient is missing.

### `CanBuild(recipe_name)`
* **Description:** Deprecated function that checks if ingredients are available for a recipe.
* **Parameters:**
  - `recipe_name` -- string, the name of the recipe
* **Returns:** `boolean`, result of HasIngredients
* **Error states:** None

### `CanLearn(recname)`
* **Description:** Checks if the builder is allowed to learn a recipe based on tags and skills.
* **Parameters:**
  - `recname` -- string, the name of the recipe
* **Returns:** `boolean`, true if the recipe can be learned
* **Error states:** Returns false if recipe is nil or builder tags/skills do not match requirements.

### `LongUpdate(dt)`
* **Description:** Periodic update function that decrements the hungry builder timer.
* **Parameters:**
  - `dt` -- number, delta time since last update
* **Returns:** `nil`
* **Error states:** None





### `MakeRecipeFromMenu(recipe, skin)`
* **Description:** Handles crafting initiated from the UI menu, including ingredient sub-crafting.
* **Parameters:**
  - `recipe` -- table, the recipe definition
  - `skin` -- string, the skin ID to apply
* **Returns:** `nil`
* **Error states:** Returns early if inventory is not opened by the player.

### `MakeRecipeAtPoint(recipe, pt, rot, skin)`
* **Description:** Handles crafting a placer recipe at a specific point if buffered and valid.
* **Parameters:**
  - `recipe` -- table, the recipe definition
  - `pt` -- Vector3, the position to build at
  - `rot` -- number, the rotation for the build
  - `skin` -- string, the skin ID to apply
* **Returns:** `nil`
* **Error states:** Returns early if inventory is not opened or build is not buffered.

### `BufferBuild(recname)`
* **Description:** Buffers a build action for a placer recipe, consuming ingredients and unlocking recipes.
* **Parameters:**
  - `recname` -- string, the name of the recipe to buffer
* **Returns:** `nil`
* **Error states:** Returns early if inventory is not opened, recipe is invalid, or ingredients are mimicked.

## Events & listeners

**Events pushed by this component:**
- `unlockrecipe` -- Pushed when a recipe is unlocked or freebuildmode toggled.
- `techtreechange` -- Pushed when accessible tech trees are updated.
- `consumehealthcost` -- Pushed when health is consumed as a crafting cost.
- `consumeingredients` -- Pushed when ingredients are removed for crafting.
- `makerecipe` -- Pushed when a recipe build action is initiated.
- `hungrybuild` -- Pushed when a hungry builder successfully builds after moving/time expiry
- `refreshcrafting` -- Pushed to refresh crafting UI state after a build
- `builditem` -- Pushed when an inventory item is successfully built
- `buildstructure` -- Pushed when a structure is successfully built
- `onbuilt` -- Pushed to the product entity when it is built

**Events listened to by this component:**
- None