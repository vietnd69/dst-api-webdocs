---
id: craftingstation
title: Craftingstation
description: Manages learned crafting items, recipes, and their associated crafting limits for an entity.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: crafting
---

# Craftingstation

## Overview
The `Craftingstation` component is responsible for tracking an entity's knowledge of craftable items and recipes. It maintains lists of learned items and their corresponding recipes, and can also enforce crafting limits for specific recipes, forgetting them once the limit is reached. This component also handles saving and loading its learned state.

## Dependencies & Tags
None identified. This component interacts with a `builder` component on other entities (`doer.components.builder`) but does not directly depend on other components on its `inst`.

## Properties
| Property                  | Type    | Default Value | Description                                                                    |
| :------------------------ | :------ | :------------ | :----------------------------------------------------------------------------- |
| `self.inst`               | Entity  | `inst`        | A reference to the parent entity that owns this component.                     |
| `self.items`              | table   | `{}`          | A numerical table storing the names of all items the entity knows how to craft. |
| `self.recipes`            | table   | `{}`          | A numerical table storing the names of recipes, corresponding by index to `self.items`. |
| `self.recipecraftinglimit`| table   | `{}`          | A key-value table mapping recipe names to their remaining craftable amounts. |
| `self.nosave`             | boolean | `false`       | A flag indicating whether the component's state should be saved and loaded. |

## Main Functions
### `LearnItem(itemname, recipetouse)`
*   **Description:** Adds a new item and its associated recipe to the entity's crafting knowledge if it isn't already known.
*   **Parameters:**
    *   `itemname`: `string` - The name of the item being learned.
    *   `recipetouse`: `string` - The name of the recipe associated with `itemname`.

### `KnowsItem(itemname)`
*   **Description:** Checks if the entity knows how to craft a specific item.
*   **Parameters:**
    *   `itemname`: `string` - The name of the item to check.

### `KnowsRecipe(recipename)`
*   **Description:** Checks if the entity knows a specific recipe.
*   **Parameters:**
    *   `recipename`: `string` - The name of the recipe to check.

### `GetItems()`
*   **Description:** Returns the numerical table of all item names currently known by the entity.
*   **Parameters:** None.

### `GetRecipes()`
*   **Description:** Returns the numerical table of all recipe names currently known by the entity.
*   **Parameters:** None.

### `GetRecipeCraftingLimit(recipename)`
*   **Description:** Retrieves the current crafting limit for a specified recipe. Returns `nil` if no limit is set.
*   **Parameters:**
    *   `recipename`: `string` - The name of the recipe.

### `SetRecipeCraftingLimit(recipename, amount)`
*   **Description:** Sets or updates the crafting limit for a specified recipe.
*   **Parameters:**
    *   `recipename`: `string` - The name of the recipe.
    *   `amount`: `number` - The new crafting limit for the recipe.

### `RecipeCrafted(doers, recipename)`
*   **Description:** Decrements the crafting limit for a given recipe. If the limit drops to zero or below, the recipe is forgotten, and `builder` components of the `doers` are prompted to re-evaluate their tech trees.
*   **Parameters:**
    *   `doers`: `table` - A table of entities (`doer`) who performed the crafting, usually used to update their tech trees.
    *   `recipename`: `string` - The name of the recipe that was crafted.

### `ForgetItem(itemname)`
*   **Description:** Removes a specific item and its associated recipe and crafting limit from the entity's knowledge.
*   **Parameters:**
    *   `itemname`: `string` - The name of the item to forget.

### `ForgetRecipe(recipename)`
*   **Description:** Removes a specific recipe and its associated item and crafting limit from the entity's knowledge.
*   **Parameters:**
    *   `recipename`: `string` - The name of the recipe to forget.

### `ForgetAllItems()`
*   **Description:** Clears all learned items, recipes, and crafting limits, making the entity forget everything it knows how to craft.
*   **Parameters:** None.

### `OnSave()`
*   **Description:** Serializes the component's current state (learned items, recipes, and crafting limits) for persistence. Data is only returned if `self.nosave` is `false`.
*   **Parameters:** None.

### `OnLoad(data)`
*   **Description:** Deserializes and restores the component's state from saved `data`. Includes a check to reset knowledge if `self.items` and `self.recipes` array lengths do not match, preventing corrupted data. This operation is skipped if `self.nosave` is `true`.
*   **Parameters:**
    *   `data`: `table` - The table containing the saved component data.