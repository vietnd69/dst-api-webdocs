---
id: builder_replica
title: Builder Replica
description: Serves as the client-side replica component for the Builder, syncing crafting, recipe, and technology tree state between server and client.
tags: [crafting, network, inventory, player, techtree]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7b213b34
system_scope: network
---

# Builder Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Builder Replica` is the network-replicated counterpart of the `builder` component. It runs on the client and synchronizes recipe unlocks, technology tree levels, bonuses, ingredient modifiers, and build buffering state from the server's `builder` component. It primarily bridges data from `player_classified` network variables to the client and delegates actions (e.g., crafting or buffering builds) back to the server via `playercontroller` RPCs when not in `mastersim`. This ensures consistent UI and recipe availability across all clients.

## Usage example
```lua
-- Typically added automatically via player_classified; manual usage is rare
local inst = ThePlayer
if inst ~= nil and inst.components.builder_replica ~= nil then
    -- Get current tech tree levels (client-side view)
    local tech_trees = inst.components.builder_replica:GetTechTrees()
    
    -- Check if a recipe is known (respects temp bonuses and free build mode)
    local knows = inst.components.builder_replica:KnowsRecipe("tent")
    
    -- Get cached recipe crafting limits
    local limits = inst.components.builder_replica:GetAllRecipeCraftingLimits()
end
```

## Dependencies & tags
**Components used:** `builder`, `playercontroller`, `skilltreeupdater`, `inventory`, `health`, `sanity`, `player_classified` (via `inst.player_classified`)  
**Tags:** None directly added/removed; checks `builder_tag`, `no_builder_tag`, and `health_as_oldage` tags on `inst`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `classified` | `PlayerClassified?` | `nil` | Reference to the `player_classified` network object, used to read/write replicated state. |

## Main functions
### `GetTechBonuses()`
* **Description:** Returns a table of technology bonuses (e.g., `WOOD`, `STONE`) for the entity. Pulls from the server's `builder` component if available, otherwise reads from `classified` network variables.
* **Parameters:** None.
* **Returns:** A table `{ [tech] = level }`, where `tech` is a string like `"WOOD"`. Returns `{}` if neither `builder` nor `classified` is available.

### `SetTechBonus(tech, bonus)`
* **Description:** Sets a permanent technology bonus for a given tech type (e.g., after unlocking a tech node).
* **Parameters:**  
  `tech` (string) – the tech key (e.g., `"WOOD"`).  
  `bonus` (number) – the bonus value to set.
* **Returns:** Nothing.
* **Error states:** Only has effect if `classified` is non-`nil`. Silently no-ops otherwise.

### `SetTempTechBonus(tech, bonus)`
* **Description:** Sets a temporary technology bonus (e.g., from a time-limited buff).
* **Parameters:**  
  `tech` (string) – the tech key.  
  `bonus` (number) – the temporary bonus value.
* **Returns:** Nothing.
* **Error states:** Only has effect if `classified` is non-`nil`.

### `IngredientMod()`
* **Description:** Returns the ingredient cost modifier (e.g., `1` for normal, `0.5` for halved cost).
* **Parameters:** None.
* **Returns:** `number` – ingredient modifier value. Defaults to `1` if neither `builder` nor `classified` is available.

### `SetIngredientMod(ingredientmod)`
* **Description:** Sets the ingredient cost modifier (e.g., from equippable items like backpacks).
* **Parameters:** `ingredientmod` (string) – key from `INGREDIENT_MOD`, e.g., `"HALF_COST"`.
* **Returns:** Nothing.

### `IsFreeBuildMode()`
* **Description:** Returns whether free build mode is active (bypasses ingredient checks and unlocks).
* **Parameters:** None.
* **Returns:** `boolean` – `true` if free build mode is enabled.

### `SetIsFreeBuildMode(isfreebuildmode)`
* **Description:** Sets free build mode state.
* **Parameters:** `isfreebuildmode` (boolean).
* **Returns:** Nothing.

### `GetCurrentPrototyper()`
* **Description:** Returns the current prototyper entity being used (e.g., `workbench`).
* **Parameters:** None.
* **Returns:** `Entity?` – the prototyper entity or `nil`.

### `SetCurrentPrototyper(prototyper)`
* **Description:** Sets the current prototyper entity reference.
* **Parameters:** `prototyper` (`Entity?`).
* **Returns:** Nothing.

### `OpenCraftingMenu()`
* **Description:** Triggers the crafting menu open event on the client.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetTechTrees()`
* **Description:** Returns the effective tech tree levels, including bonuses.
* **Parameters:** None.
* **Returns:** `table` – `{ [tech] = level }`, or `TECH.NONE` if unavailable.

### `GetTechTreesNoTemp()`
* **Description:** Returns tech tree levels *excluding* temporary bonuses (e.g., for determining baseline prototype capability).
* **Parameters:** None.
* **Returns:** `table` – `{ [tech] = level }`, or `TECH.NONE` if unavailable.

### `SetTechTrees(techlevels)`
* **Description:** Sets the full tech tree level table on the client via `classified`.
* **Parameters:** `techlevels` (table) – `{ [tech] = level }` map.
* **Returns:** Nothing.

### `AddRecipe(recipename)`
* **Description:** Marks a recipe as known/unlocked on the client.
* **Parameters:** `recipename` (string) – recipe name (e.g., `"tent"`).
* **Returns:** Nothing.

### `RemoveRecipe(recipename)`
* **Description:** Marks a recipe as locked (unknown) on the client.
* **Parameters:** `recipename` (string).
* **Returns:** Nothing.

### `SetRecipeCraftingLimit(index, recipename, amount)`
* **Description:** Sets the crafting limit for a limited recipe at a given slot index.
* **Parameters:**  
  `index` (number) – slot index (`1` to `CRAFTINGSTATION_LIMITED_RECIPES_COUNT`).  
  `recipename` (string) – recipe name.  
  `amount` (number) – limit amount.
* **Returns:** Nothing.

### `GetAllRecipeCraftingLimits()`
* **Description:** Returns a table of currently set recipe crafting limits.
* **Parameters:** None.
* **Returns:** `table` – `{ [recipename] = amount }`. Empty if `classified` is `nil`.

### `BufferBuild(recipename)`
* **Description:** Attempts to buffer (queue) a build recipe, delegating to `builder` or `classified.BufferBuild` depending on context.
* **Parameters:** `recipename` (string).
* **Returns:** Nothing.

### `SetIsBuildBuffered(recipename, isbuildbuffered)`
* **Description:** Sets the buffered state for a recipe (used for client-side preview consistency).
* **Parameters:**  
  `recipename` (string)  
  `isbuildbuffered` (boolean)
* **Returns:** Nothing.

### `IsBuildBuffered(recipename)`
* **Description:** Returns whether a recipe is currently buffered.
* **Parameters:** `recipename` (string).
* **Returns:** `boolean` – `true` if buffered.

### `HasCharacterIngredient(ingredient)`
* **Description:** Checks whether the entity has sufficient character resource (e.g., health, sanity) to pay a character ingredient cost. Used when crafting (e.g., cutting hair, eating to craft).
* **Parameters:** `ingredient` (table) – ingredient object with `type` and `amount` fields (e.g., `type = CHARACTER_INGREDIENT.HEALTH`, `amount = 20`).
* **Returns:** `boolean, number` –  
  - `true`/`false` — whether the ingredient cost is satisfied.  
  - `number` — current amount of the resource (e.g., current health).  
* **Error states:** Returns `(false, 0)` on missing `health`/`sanity` replicas or if ingredient type is unsupported.

### `HasTechIngredient(ingredient)`
* **Description:** Checks whether the entity meets the tech ingredient requirement (e.g., wood material level `>= 2`).
* **Parameters:** `ingredient` (table) – ingredient with `type = "..._material"` and `amount`.
* **Returns:** `boolean, number` — success status and current tech level. Returns `(false, 0)` if ingredient is not a tech material or unknown.

### `KnowsRecipe(recipe, ignore_tempbonus, cached_tech_trees)`
* **Description:** Determines whether the entity knows (has unlocked) a given recipe, considering free build mode, skins, and temporary tech bonuses.
* **Parameters:**  
  `recipe` (string or table) — recipe name or recipe table.  
  `ignore_tempbonus` (boolean, optional) — if `true`, ignores temporary tech bonuses.  
  `cached_tech_trees` (table, optional) — if provided, used for memoization.
* **Returns:** `boolean` — `true` if recipe is known or can be built via free build/skins.

### `HasIngredients(recipe)`
* **Description:** Checks whether the entity has all inventory, character, and tech ingredients required to craft a recipe. Respects ingredient modifier and free build mode.
* **Parameters:** `recipe` (string or table) — recipe name or recipe table.
* **Returns:** `boolean` — `true` if all ingredients are available.

### `CanBuild(recipe_name)` — deprecated
* **Description:** Alias for `HasIngredients(recipe)`. Deprecated in favor of `HasIngredients`.
* **Parameters:** `recipe_name` (string).
* **Returns:** `boolean`.

### `CanLearn(recipename)`
* **Description:** Checks whether the recipe is learnable (i.e., satisfies tag and skill requirements, independent of unlock status).
* **Parameters:** `recipename` (string).
* **Returns:** `boolean` — `true` if the recipe meets character/skill requirements.

### `CanBuildAtPoint(pt, recipe, rot)`
* **Description:** Checks whether the recipe can be built at a given world point (e.g., not blocked).
* **Parameters:**  
  `pt` (Vec3-like table) — build position.  
  `recipe` (table) — recipe table.  
  `rot` (number) — rotation angle in radians.
* **Returns:** `boolean` — result of `TheWorld.Map:CanDeployRecipeAtPoint`.

### `MakeRecipeFromMenu(recipe, skin)`
* **Description:** Attempts to craft a recipe selected from the crafting menu. Delegates to `builder` on mastersim or `playercontroller:RemoteMakeRecipeFromMenu` on client.
* **Parameters:**  
  `recipe` (table) — recipe table.  
  `skin` (string, optional) — skin name.
* **Returns:** Nothing.

### `MakeRecipeAtPoint(recipe, pt, rot, skin)`
* **Description:** Attempts to craft a recipe at a specific point and rotation. Delegates to `builder` on mastersim or `playercontroller:RemoteMakeRecipeAtPoint` on client.
* **Parameters:**  
  `recipe` (table)  
  `pt` (Vec3-like table)  
  `rot` (number)  
  `skin` (string, optional)
* **Returns:** Nothing.

### `IsBusy()`
* **Description:** Returns whether the player is currently busy (e.g., inventory open, crafting, or using overflow container).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if busy.

## Events & listeners
- **Listens to:** `onremove` on `player_classified` — triggers `DetachClassified()` to clean up references when the classified object is removed.  
- **Pushes:** `opencraftingmenuevent` — via `OpenCraftingMenu()`, triggers on the client to open the crafting menu UI.
