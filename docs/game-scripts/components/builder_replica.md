---
id: builder_replica
title: Builder Replica
description: Synchronizes server-side crafting logic and tech tree state to the client for UI and validation.
tags: [crafting, network, replica, player]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: replicas
source_hash: 26b62f9f
system_scope: crafting
---

# Builder Replica

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
The `builder` replica is the client-side mirror of the server-side `builder` component. It manages networked variables stored in `player_classified` to synchronize crafting capabilities, tech tree progression, and recipe knowledge from the server to the client. This allows the client UI to accurately display crafting availability, ingredient requirements, and prototyping status without requiring constant server round-trips for validation. Actual crafting actions are delegated to the `playercontroller` for remote execution or the server-side `builder` component if running on the host. Access this replica via `inst.replica.builder`, not through the component system.

## Usage example
```lua
-- Note: inst must be a player entity with initialized replicas
local inst = ThePlayer
local builder = inst.replica.builder

-- Check if the player knows a specific recipe
local can_craft = builder:KnowsRecipe("axe")

-- Verify ingredient availability before attempting to build
if builder:HasIngredients("axe") then
    builder:BufferBuild("axe")
end
```

## Dependencies & tags
**Components used:** `builder`, `playercontroller`, `skilltreeupdater`, `inventory` (replica), `health` (replica), `sanity` (replica).
**Tags:** Checks `health_as_oldage`, `builder_tag`, `no_builder_tag` (via recipe data). Does not add or remove tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | The entity instance that owns this replica. |
| `classified` | Table | `nil` | Reference to `player_classified` containing networked variables. |
| `ondetachclassified` | Function | `nil` | Callback function triggered when the classified object is removed. |

## Main functions
### `AttachClassified(classified)`
*   **Description:** Links the replica to the `player_classified` networked data container and sets up event listeners for detachment.
*   **Parameters:** `classified` (Table) - The classified data container instance.
*   **Returns:** Nothing.

### `DetachClassified()`
*   **Description:** Detaches the classified data container and clears references.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetTechBonuses()`
*   **Description:** Retrieves a table of current technology bonuses, combining permanent bonuses and temporary bonuses.
*   **Parameters:** None.
*   **Returns:** `table` - A map of tech types to their bonus values. Returns empty table if data is unavailable.

### `SetTechBonus(tech, bonus)`
*   **Description:** Sets a permanent technology bonus for a specific tech type.
*   **Parameters:** `tech` (string) - The technology type identifier. `bonus` (number) - The bonus value to set.
*   **Returns:** Nothing.

### `SetTempTechBonus(tech, bonus)`
*   **Description:** Sets a temporary technology bonus for a specific tech type.
*   **Parameters:** `tech` (string) - The technology type identifier. `bonus` (number) - The bonus value to set.
*   **Returns:** Nothing.

### `SetIngredientMod(ingredientmod)`
*   **Description:** Sets the ingredient modifier (e.g., for discounts or increased costs).
*   **Parameters:** `ingredientmod` (string|number) - The ingredient modifier identifier (key for INGREDIENT_MOD table).
*   **Returns:** Nothing.

### `IngredientMod()`
*   **Description:** Returns the current ingredient modifier multiplier (e.g., for discounts or increased costs).
*   **Parameters:** None.
*   **Returns:** `number` - The modifier value (default `1`).

### `SetIsFreeBuildMode(isfreebuildmode)`
*   **Description:** Sets whether the player is in free build mode (ignores ingredient costs).
*   **Parameters:** `isfreebuildmode` (boolean) - Whether to enable free build mode.
*   **Returns:** Nothing.

### `IsFreeBuildMode()`
*   **Description:** Checks if the player is currently in free build mode (ignores ingredient costs).
*   **Parameters:** None.
*   **Returns:** `boolean` - `true` if free build mode is active.

### `GetTechTrees()`
*   **Description:** Retrieves the accessible technology tree levels.
*   **Parameters:** None.
*   **Returns:** `table|number` - The tech tree data structure. Returns `TECH.NONE` if unavailable.

### `GetTechTreesNoTemp()`
*   **Description:** Retrieves accessible technology tree levels excluding temporary bonuses.
*   **Parameters:** None.
*   **Returns:** `table|number` - The tech tree data structure without temp bonuses. Returns `TECH.NONE` if unavailable.

### `SetCurrentPrototyper(prototyper)`
*   **Description:** Sets the current prototyper entity reference.
*   **Parameters:** `prototyper` (Entity|string) - The prototyper entity or identifier.
*   **Returns:** Nothing.

### `GetCurrentPrototyper()`
*   **Description:** Retrieves the current prototyper entity reference.
*   **Parameters:** None.
*   **Returns:** `string|number` - The current prototyper.

### `OpenCraftingMenu()`
*   **Description:** Pushes the opencraftingmenuevent to signal the UI to open the crafting menu.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetTechTrees(techlevels)`
*   **Description:** Sets the accessible technology tree levels.
*   **Parameters:** `techlevels` (table) - A table mapping tech types to their levels.
*   **Returns:** Nothing.

### `AddRecipe(recipename)`
*   **Description:** Marks a specific recipe as known/unlocked for the player.
*   **Parameters:** `recipename` (string) - The name of the recipe to unlock.
*   **Returns:** Nothing.

### `RemoveRecipe(recipename)`
*   **Description:** Marks a specific recipe as unknown/locked for the player.
*   **Parameters:** `recipename` (string) - The name of the recipe to lock.
*   **Returns:** Nothing.

### `SetRecipeCraftingLimit(index, recipename, amount)`
*   **Description:** Sets a crafting limit for a specific recipe at the given index.
*   **Parameters:** `index` (number) - The limit slot index. `recipename` (string) - The recipe name. `amount` (number) - The crafting limit amount.
*   **Returns:** Nothing.

### `GetAllRecipeCraftingLimits()`
*   **Description:** Retrieves all recipe crafting limits.
*   **Parameters:** None.
*   **Returns:** `table` - A map of recipe names to their limit amounts.

### `KnowsRecipe(recipe, ignore_tempbonus, cached_tech_trees)`
*   **Description:** Determines if the player can prototype or already knows a recipe. Checks tech levels, tags, skills, and skin unlocks. Returns `true` immediately if Free Build Mode is active (unless recipe is restricted by skin selection rules).
*   **Parameters:** `recipe` (string|table) - Recipe name or recipe table. `ignore_tempbonus` (boolean, optional) - If true, ignores temporary tech bonuses. `cached_tech_trees` (table, optional) - Cache for tech tree lookups.
*   **Returns:** `boolean` - `true` if the recipe is known or prototypeable.

### `HasIngredients(recipe)`
*   **Description:** Verifies if the player possesses all required ingredients, including character stats (health/sanity) and tech levels.
*   **Parameters:** `recipe` (string|table) - The recipe to check.
*   **Returns:** `boolean` - `true` if all ingredients are available.

### `CanBuild(recipe_name)`
*   **Description:** Checks if the player can build a recipe. **Deprecated:** Use `HasIngredients` instead.
*   **Parameters:** `recipe_name` (string) - The name of the recipe to check.
*   **Returns:** `boolean` - `true` if the player can build the recipe.

### `CanLearn(recipename)`
*   **Description:** Checks if the player can learn a recipe based on builder_tag and builder_skill requirements.
*   **Parameters:** `recipename` (string) - The recipe name to check.
*   **Returns:** `boolean` - `true` if the recipe can be learned.

### `CanBuildAtPoint(pt, recipe, rot)`
*   **Description:** Checks if a recipe can be deployed at a specific world position via TheWorld.Map.
*   **Parameters:** `pt` (Vector3) - The position to check. `recipe` (table) - The recipe object. `rot` (number) - The rotation.
*   **Returns:** `boolean` - `true` if the recipe can be built at the specified location.

### `HasCharacterIngredient(ingredient)`
*   **Description:** Checks if the player meets character-specific ingredient requirements (e.g., health cost, sanity cost).
*   **Parameters:** `ingredient` (table) - The ingredient definition containing type and amount.
*   **Returns:** `boolean`, `number` - Success status and relevant metric value (e.g., current health or remaining penalty ratio).

### `HasTechIngredient(ingredient)`
*   **Description:** Checks if the player meets technology-based ingredient requirements.
*   **Parameters:** `ingredient` (table) - The tech ingredient definition.
*   **Returns:** `boolean`, `number` - Success status and current tech level.

### `BufferBuild(recipename)`
*   **Description:** Buffers a build action to be executed. Delegates to server `builder` or classified logic.
*   **Parameters:** `recipename` (string) - The name of the recipe to buffer.
*   **Returns:** Nothing.

### `SetIsBuildBuffered(recipename, isbuildbuffered)`
*   **Description:** Sets whether a specific build action is buffered.
*   **Parameters:** `recipename` (string) - The recipe name. `isbuildbuffered` (boolean) - Whether the build is buffered.
*   **Returns:** Nothing.

### `IsBuildBuffered(recipename)`
*   **Description:** Checks if a specific build action is currently buffered.
*   **Parameters:** `recipename` (string) - The recipe name to check.
*   **Returns:** `boolean` - `true` if the build is buffered.

### `MakeRecipeFromMenu(recipe, skin)`
*   **Description:** Initiates crafting a recipe from the UI menu. Delegates to server `builder` or `playercontroller` for remote execution.
*   **Parameters:** `recipe` (table) - The recipe object. `skin` (string, optional) - The skin to apply.
*   **Returns:** Nothing.

### `MakeRecipeAtPoint(recipe, pt, rot, skin)`
*   **Description:** Initiates crafting a structure at a specific world position. Delegates to server `builder` or `playercontroller` for remote execution.
*   **Parameters:** `recipe` (table) - The recipe object. `pt` (Vector3) - The position to build. `rot` (number) - The rotation. `skin` (string, optional) - The skin to apply.
*   **Returns:** Nothing.

### `IsBusy()`
*   **Description:** Checks if the player's inventory is currently busy, which would prevent crafting actions.
*   **Parameters:** None.
*   **Returns:** `boolean` - `true` if the inventory is busy.

## Events & listeners
- **Listens to:** `onremove` (on `classified` object) - Triggers `DetachClassified` when the classified data is removed.
- **Pushes:** `opencraftingmenuevent` (on `classified` object) - Signals the UI to open the crafting menu.