---
id: builder_replica
title: Builder Replica
description: Manages the client-side representation of a player's crafting abilities, recipe knowledge, and technology levels.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: crafting
---

# Builder Replica

## Overview
The Builder Replica component is the client-side counterpart to the main `builder` component. Its primary responsibility is to mirror the player's crafting state from the server to the client. This includes tracking known recipes, current technology levels, ingredient modifiers, and active tech bonuses. It provides functions for the client to check crafting prerequisites (like ingredients, tech level, and character stats) without needing to query the server directly. When a craft is initiated, it forwards the request to the server via the `playercontroller` component.

## Dependencies & Tags
**Dependencies:**
- `playercontroller`: Used to send crafting requests to the server.
- `inventory` (replica): Checked for item ingredients.
- `health` (replica): Checked for health-based crafting costs.
- `sanity` (replica): Checked for sanity-based crafting costs.
- `skilltreeupdater`: Checked for skill-based recipe requirements.

**Tags:**
- None identified.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | `entity` | `inst` | A reference to the entity instance this component is attached to. |
| `classified` | `table` | `nil` | A reference to the `player_classified` object, which contains networked data from the server-side `builder` component. |
| `ondetachclassified` | `function` | `nil` | A reference to the function used as a callback when the `classified` object is removed. |

## Main Functions
### `GetTechBonuses()`
* **Description:** Calculates and returns the total technology bonuses for the player, combining both permanent and temporary bonuses. It retrieves these values from the networked `classified` object.
* **Parameters:** None.

### `IngredientMod()`
* **Description:** Returns the current ingredient cost modifier for the player. For example, a value of 0.5 means recipes cost half the normal ingredients. If the master-side `builder` component is present, it returns its value; otherwise, it reads from the networked `classified` object.
* **Parameters:** None.

### `IsFreeBuildMode()`
* **Description:** Checks if the player is currently in "free build mode", where crafting has no cost.
* **Parameters:** None.

### `OpenCraftingMenu()`
* **Description:** Pushes a networked event to signal that the crafting menu should be opened for this player.
* **Parameters:** None.

### `GetTechTrees()`
* **Description:** Retrieves the player's current effective technology levels, including any temporary proximity bonuses from structures.
* **Parameters:** None.

### `GetTechTreesNoTemp()`
* **Description:** Retrieves the player's base technology levels, ignoring any temporary proximity bonuses.
* **Parameters:** None.

### `AddRecipe(recipename)`
* **Description:** Marks a specific recipe as known by the player by setting its corresponding networked variable to true.
* **Parameters:**
    * `recipename` (`string`): The name of the recipe to learn.

### `GetAllRecipeCraftingLimits()`
* **Description:** Returns a table of all recipes that have a limited number of crafts available from a specific crafting station, along with their remaining craft counts.
* **Parameters:** None.

### `HasCharacterIngredient(ingredient)`
* **Description:** Checks if the player meets a specific character-based ingredient cost, such as having enough current health, max health, sanity, or max sanity to perform a craft.
* **Parameters:**
    * `ingredient` (`table`): A table describing the character-based ingredient requirement.

### `KnowsRecipe(recipe, ignore_tempbonus, cached_tech_trees)`
* **Description:** A comprehensive check to determine if the player knows a specific recipe. It verifies tech level requirements, character-specific tags/skills, whether the recipe has been explicitly learned, or if it's unlocked via an owned skin.
* **Parameters:**
    * `recipe` (`table` or `string`): The recipe object or recipe name to check.
    * `ignore_tempbonus` (`boolean`, optional): If true, temporary tech bonuses from nearby structures are ignored.
    * `cached_tech_trees` (`table`, optional): An optional table for memoization to speed up repeated checks.

### `HasIngredients(recipe)`
* **Description:** Checks if the player possesses all the required ingredients (items, character stats, tech materials) to craft a given recipe.
* **Parameters:**
    * `recipe` (`table` or `string`): The recipe object or recipe name to check.

### `CanLearn(recipename)`
* **Description:** Determines if a character is capable of learning a specific recipe, based on their character-specific tags and unlocked skills.
* **Parameters:**
    * `recipename` (`string`): The name of the recipe to check.

### `MakeRecipeFromMenu(recipe, skin)`
* **Description:** Initiates a crafting action for a recipe that does not require placement in the world. This function delegates the request to the `playercontroller` component, which sends it to the server for execution.
* **Parameters:**
    * `recipe` (`table`): The recipe object to be crafted.
    * `skin` (`string`, optional): The name of the skin to apply to the crafted item.

### `MakeRecipeAtPoint(recipe, pt, rot, skin)`
* **Description:** Initiates a crafting action for a placeable recipe (e.g., a structure). This function delegates the request to the `playercontroller` component, which sends it to the server with the desired position and rotation.
* **Parameters:**
    * `recipe` (`table`): The recipe object to be crafted.
    * `pt` (`vector3`): The world position where the object should be placed.
    * `rot` (`number`): The rotation to apply to the placed object.
    * `skin` (`string`, optional): The name of the skin to apply to the crafted structure.

## Events & Listeners
- **Listens To `onremove` on `classified`:** When the associated `player_classified` entity is removed, this component cleans up its reference to it by calling `DetachClassified`.
- **Pushes `opencraftingmenuevent` on `classified`:** When `OpenCraftingMenu()` is called, it triggers a networked event on the `player_classified` object to open the crafting UI.