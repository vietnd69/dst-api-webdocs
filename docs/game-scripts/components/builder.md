---
id: builder
title: Builder
description: Manages an entity's ability to craft items, learn recipes, and interact with prototyping stations.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: crafting
source_hash: 4e2bad0f
---

# Builder

## Overview
The Builder component is the core of the crafting system for player characters. It manages all aspects of crafting, including tracking learned recipes, calculating accessible technology levels from nearby crafting stations (prototypers), and handling the consumption of ingredients. It also manages character-specific crafting bonuses, temporary tech boosts, and "buffered" builds for placeable structures. This component is essential for any entity that can create items or structures from recipes.

## Dependencies & Tags

**Dependencies:**
* `inventory`: Required for checking and removing item ingredients.
* `health`: Used for recipes that have a health cost.
* `sanity`: Used for recipes with a sanity cost and for the sanity gain upon learning a new recipe.
* `locomotor`: Used to initiate the `BUILD` action.
* `rider`: Checked to prevent crafting while mounted.
* `petleash`: Checked for recipes with pet-related restrictions.

**Tags:**
* `prototyper`: The Builder scans for entities with this tag to determine available crafting stations.
* `hungrybuilder`: If the owner has this tag, crafting can consume Hunger for a speed boost.
* `INLIMBO`, `fire`: Tags on a prototyper that will prevent it from being used.
* `builder_tag` / `no_builder_tag`: Specific tags on the owner that can be required (or disallowed) by certain recipes.

## Properties

| Property | Type | Default Value | Description |
|---|---|---|---|
| `recipes` | `table` | `{}` | A list of recipe names the entity has permanently unlocked. |
| `station_recipes` | `table` | `{}` | A map of recipe names available from the current crafting station. |
| `accessible_tech_trees` | `table` | `TechTree.Create()` | The current effective technology levels, including from stations and all bonuses. |
| `accessible_tech_trees_no_temp` | `table` | `TechTree.Create()` | The current technology levels, excluding any temporary bonuses. |
| `current_prototyper` | `Entity` | `nil` | The crafting station entity the builder is currently using. |
| `buffered_builds` | `table` | `{}` | A map of recipe names for which ingredients have been consumed but the item has not yet been placed in the world. |
| `ingredientmod` | `number` | `1` | A multiplier affecting the number of ingredients required for crafting. A value less than 1 represents a discount. |
| `freebuildmode` | `boolean` | `false` | If true, the entity can craft anything without needing ingredients. |
| `exclude_tags` | `table` | `{ "INLIMBO", "fire", ... }` | A list of tags that will prevent a nearby prototyper from being used. |

## Main Functions

### `GiveAllRecipes()`
Toggles `freebuildmode`. When enabled, all recipes become available without ingredient costs. This also pushes an `unlockrecipe` event to refresh the crafting UI.

### `UnlockRecipe(recname)`
* **Description:** Permanently learns a recipe for the character. This grants a medium sanity boost, adds the recipe to the `recipes` table, and pushes an `unlockrecipe` event. Will not unlock recipes marked as `nounlock`.
* **Parameters:**
    * `recname` (`string`): The name of the recipe to unlock.

### `EvaluateTechTrees()`
* **Description:** This is the core update function for the component. It scans for nearby entities with the `prototyper` tag, determines the closest valid one, and calculates the final accessible technology levels by combining station tech with the character's inherent and temporary bonuses. It updates the client with any changes to tech levels or available station-specific recipes.

### `UsePrototyper(prototyper)`
* **Description:** Attempts to force the builder to use a specific prototyping station. This is used for actions like right-clicking on a science machine. It will fail if the target is invalid or if crafting is disabled.
* **Parameters:**
    * `prototyper` (`Entity`): The crafting station entity to use.

### `DoBuild(recname, pt, rotation, skin)`
* **Description:** Executes the final step of crafting. It consumes ingredients (unless in free build mode or if it's a buffered build), spawns the product, and places it in the player's inventory or in the world. It also handles logic for special cases like the `hungrybuilder` perk and item mimics.
* **Parameters:**
    * `recname` (`string`): The name of the recipe to build.
    * `pt` (`Point`): The world position to build the item at (for structures).
    * `rotation` (`number`): The rotation to apply to the placed structure.
    * `skin` (`string`): The name of the skin to apply to the crafted item.

### `KnowsRecipe(recipe, ignore_tempbonus)`
* **Description:** Checks if the builder can craft a given recipe. It verifies against permanently unlocked recipes, station-specific recipes, and current technology levels. It also checks for character-specific tag and skill requirements.
* **Parameters:**
    * `recipe` (`string` or `table`): The recipe name or recipe data table.
    * `ignore_tempbonus` (`boolean`): If true, temporary tech bonuses will not be considered in the calculation.

### `HasIngredients(recipe)`
* **Description:** Checks if the builder possesses all the necessary item and character-stat ingredients (like health or sanity) to craft a given recipe.
* **Parameters:**
    * `recipe` (`string` or `table`): The recipe name or recipe data table.

### `MakeRecipeFromMenu(recipe, skin)`
* **Description:** An RPC function called from the client when a player clicks a recipe in the crafting menu. It performs validation and then initiates the crafting process via `MakeRecipe`. For recipes that are ingredients for another item, it can recursively craft the prerequisite.
* **Parameters:**
    * `recipe` (`table`): The recipe data table.
    * `skin` (`string`): The name of the skin selected by the player.

### `BufferBuild(recname)`
* **Description:** An RPC function called from the client for placeable items. It consumes the ingredients immediately but does not spawn the item. Instead, it "buffers" the build, allowing the player to enter placement mode. The actual item is created later by `MakeRecipeAtPoint`.
* **Parameters:**
    * `recname` (`string`): The name of the recipe to buffer.

### `MakeRecipeAtPoint(recipe, pt, rot, skin)`
* **Description:** An RPC function called from the client when a player confirms the placement of a buffered build. It calls `MakeRecipe` to create the final structure at the specified location.
* **Parameters:**
    * `recipe` (`table`): The recipe data table.
    * `pt` (`Point`): The world position to place the structure.
    * `rot` (`number`): The final rotation of the structure.
    * `skin` (`string`): The skin to apply to the structure.

## Events & Listeners

This component pushes the following events:

*   **`unlockrecipe`**: Fired when a recipe is learned or when `freebuildmode` is toggled.
*   **`techtreechange`**: Fired when the available technology levels change, typically after moving near or away from a crafting station.
*   **`makerecipe`**: Fired when a crafting action is initiated.
*   **`consumeingredients`**: Fired after ingredients have been removed from the player's inventory for a craft.
*   **`consumehealthcost`**: Fired specifically when a craft costs health.
*   **`builditem`**: Fired when an inventory item has been successfully crafted.
*   **`buildstructure`**: Fired when a structure has been successfully built in the world.
*   **`refreshcrafting`**: Fired when a build is successfully initiated, used to update UI.
*   **`hungrybuild`**: Fired when a character with the `hungrybuilder` tag performs a fast craft.