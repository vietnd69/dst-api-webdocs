---
id: builder_replica
title: Builder Replica
description: Client-side replica of the builder component that mirrors crafting state, tech tree levels, and recipe knowledge to clients via classified netvars.
tags: [crafting, network, replication]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: replica
source_hash: d9c62ccb
system_scope: crafting
---

# Builder Replica

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Builder_Replica` is the client-side mirror of the master `builder` component. It provides read-only access to crafting-related state (tech tree levels, known recipes, ingredient modifiers) via netvars stored on the player's `classified` entity. On the client, it forwards build actions back to the master through `playercontroller` RPCs. On the master, it delegates directly to the master `builder` component.

This replica enables clients to display accurate crafting menu state without requiring round-trip queries to the server for every ingredient check or recipe unlock status.

## Usage example
```lua
-- Client-side: check if player can craft a recipe
local builder = inst.replica.builder
if builder ~= nil then
    local recipe = GetValidRecipe("axe")
    if builder:KnowsRecipe(recipe) and builder:HasIngredients(recipe) then
        builder:BufferBuild("axe")
    end
end

-- Master-side: set tech bonus (only valid on server)
if TheWorld.ismastersim then
    inst.replica.builder:SetTechBonus("SCIENCE", 2)
end

-- Check current prototyper
local prototyper = inst.replica.builder:GetCurrentPrototyper()
```

## Dependencies & tags
**External dependencies:**
- `techtree` -- provides TechTree constants for bonus/tech level lookups

**Components used:**
- `builder` -- master component; replica delegates to this on server
- `playercontroller` -- forwards build RPCs to server on client
- `inventory` (replica) -- checks ingredient availability via `replica.inventory`
- `health` (replica) -- checks health ingredient requirements
- `sanity` (replica) -- checks sanity ingredient requirements
- `skilltreeupdater` -- checks builder skill requirements for recipe access

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The entity instance that owns this component. |
| `classified` | entity | `nil` | The player_classified entity holding netvars for crafting state. Set in constructor or via `AttachClassified()`. |
| `ondetachclassified` | function | `nil` | Callback registered when classified is attached; fires on classified removal to call `DetachClassified()`. |

## Main functions
### `AttachClassified(classified)`
* **Description:** Attaches a classified entity to this replica and registers an `onremove` listener to auto-detach when classified is removed. Called automatically on client if `player_classified` exists.
* **Parameters:** `classified` -- entity instance (player_classified)
* **Returns:** nil
* **Error states:** None

### `DetachClassified()`
* **Description:** Clears the classified reference and removes the onremove listener callback. Called automatically when classified entity is removed.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `GetTechBonuses()`
* **Description:** Returns a table of all tech bonus values. On master, delegates to `builder:GetTechBonuses()`. On client, reads from classified netvars for each tech type in `TechTree.BONUS_TECH`.
* **Parameters:** None
* **Returns:** table -- bonus values keyed by tech name (e.g., `{ SCIENCE = 2, MAGIC = 1 }`)
* **Error states:** None

### `SetTechBonus(tech, bonus)`
* **Description:** Sets a permanent tech bonus level. **Master only** — writes to classified netvar which syncs to clients. No-op if classified is nil.
* **Parameters:**
  - `tech` -- string tech name (e.g., `"SCIENCE"`, `"MAGIC"`)
  - `bonus` -- number bonus level to set
* **Returns:** nil
* **Error states:** None (silently no-ops if classified is nil)

### `SetTempTechBonus(tech, bonus)`
* **Description:** Sets a temporary tech bonus level (consumed on craft). **Master only** — writes to classified netvar which syncs to clients. No-op if classified is nil.
* **Parameters:**
  - `tech` -- string tech name (e.g., `"SCIENCE"`, `"MAGIC"`)
  - `bonus` -- number bonus level to set
* **Returns:** nil
* **Error states:** None (silently no-ops if classified is nil)

### `SetIngredientMod(ingredientmod)`
* **Description:** Sets the ingredient modifier index. **Master only** — writes to classified netvar. Valid indices are looked up from `INGREDIENT_MOD` table.
* **Parameters:** `ingredientmod` -- string or number ingredient modifier identifier
* **Returns:** nil
* **Error states:** None (silently no-ops if classified is nil)

### `IngredientMod()`
* **Description:** Returns the current ingredient modifier multiplier. On master, reads from `builder.ingredientmod`. On client, looks up from classified netvar via `INGREDIENT_MOD_LOOKUP`.
* **Parameters:** None
* **Returns:** number -- multiplier value (default `1` if unavailable)
* **Error states:** None

### `SetIsFreeBuildMode(isfreebuildmode)`
* **Description:** Enables or disables free build mode (no ingredient cost). **Master only** — writes to classified netvar.
* **Parameters:** `isfreebuildmode` -- boolean
* **Returns:** nil
* **Error states:** None (silently no-ops if classified is nil)

### `IsFreeBuildMode()`
* **Description:** Returns whether free build mode is active. Reads from classified netvar on client.
* **Parameters:** None
* **Returns:** boolean
* **Error states:** None

### `SetCurrentPrototyper(prototyper)`
* **Description:** Sets the current prototyping station entity. **Master only** — writes to classified netvar.
* **Parameters:** `prototyper` -- entity instance or `nil` to clear
* **Returns:** nil
* **Error states:** None (silently no-ops if classified is nil)

### `GetCurrentPrototyper()`
* **Description:** Returns the current prototyping station entity. On master, reads from `builder.current_prototyper`. On client, reads from classified netvar.
* **Parameters:** None
* **Returns:** entity or `nil`
* **Error states:** None

### `OpenCraftingMenu()`
* **Description:** Pushes the `opencraftingmenuevent` on classified to trigger crafting menu open on client. **Master only** — clients cannot open menu via this method.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None (silently no-ops if classified is nil)

### `SetTechTrees(techlevels)`
* **Description:** Sets all tech tree levels at once. **Master only** — iterates `TechTree.AVAILABLE_TECH` and writes each level to classified netvars.
* **Parameters:** `techlevels` -- table of tech levels keyed by tech name
* **Returns:** nil
* **Error states:** None (silently no-ops if classified is nil)

### `GetTechTrees()`
* **Description:** Returns accessible tech tree levels. On master, returns `builder.accessible_tech_trees`. On client, returns classified `techtrees` table.
* **Parameters:** None
* **Returns:** table -- tech levels keyed by tech name
* **Error states:** None

### `GetTechTreesNoTemp()`
* **Description:** Returns accessible tech tree levels excluding temporary bonuses. On master, returns `builder.accessible_tech_trees_no_temp`. On client, returns classified `techtrees_no_temp` table.
* **Parameters:** None
* **Returns:** table -- tech levels keyed by tech name
* **Error states:** None

### `AddRecipe(recipename)`
* **Description:** Marks a recipe as known/unlocked. **Master only** — sets classified recipe netvar to `true`. No-op if recipe not in classified recipes table.
* **Parameters:** `recipename` -- string recipe name
* **Returns:** nil
* **Error states:** None (silently no-ops if classified is nil or recipe not tracked)

### `RemoveRecipe(recipename)`
* **Description:** Marks a recipe as unknown/locked. **Master only** — sets classified recipe netvar to `false`. No-op if recipe not in classified recipes table.
* **Parameters:** `recipename` -- string recipe name
* **Returns:** nil
* **Error states:** None (silently no-ops if classified is nil or recipe not tracked)

### `SetRecipeCraftingLimit(index, recipename, amount)`
* **Description:** Sets a crafting limit for a recipe at a specific slot index. **Master only** — writes recipe ID and amount to classified crafting limit netvars. If recipe is not in `CRAFTINGSTATION_LIMITED_RECIPES_LOOKUPS`, amount is forced to `0`.
* **Parameters:**
  - `index` -- number slot index (1 to `CRAFTINGSTATION_LIMITED_RECIPES_COUNT`)
  - `recipename` -- string recipe name
  - `amount` -- number maximum craftable amount
* **Returns:** nil
* **Error states:** None (silently no-ops if classified is nil)

### `GetAllRecipeCraftingLimits()`
* **Description:** Returns all recipe crafting limits. Combines classified limits with externally handled limits from `EXTERNALLY_HANDLED_LIMITED_RECIPES` (queried via `recipe:getlimitedrecipecount()`).
* **Parameters:** None
* **Returns:** table -- recipe names keyed to remaining craftable amounts
* **Error states:** None

### `BufferBuild(recipename)`
* **Description:** Buffers a build action. On master, delegates to `builder:BufferBuild()`. On client, calls `classified:BufferBuild()` which triggers the build RPC.
* **Parameters:** `recipename` -- string recipe name
* **Returns:** nil
* **Error states:** None

### `SetIsBuildBuffered(recipename, isbuildbuffered)`
* **Description:** Sets the buffered state for a recipe. **Master only** — writes to classified `bufferedbuilds` netvar.
* **Parameters:**
  - `recipename` -- string recipe name
  - `isbuildbuffered` -- boolean
* **Returns:** nil
* **Error states:** None (silently no-ops if classified is nil)

### `IsBuildBuffered(recipename)`
* **Description:** Returns whether a recipe is currently buffered for building. On master, delegates to `builder:IsBuildBuffered()`. On client, checks classified `bufferedbuilds` netvar and `_bufferedbuildspreview` table.
* **Parameters:** `recipename` -- string recipe name
* **Returns:** boolean
* **Error states:** None

### `HasCharacterIngredient(ingredient)`
* **Description:** Checks if the player has sufficient character-specific ingredients (health, sanity, max health, max sanity). On client, reads from `replica.health` and `replica.sanity`. Rounds values up to match UI display. For health ingredients, checks `health_as_oldage` tag to apply `TUNING.OLDAGE_HEALTH_SCALE`.
* **Parameters:** `ingredient` -- table with `type` and `amount` fields
* **Returns:** boolean, number -- has ingredient, current value (or penalty ratio for max stats)
* **Error states:** None (returns `false, 0` if replica components unavailable)

### `HasTechIngredient(ingredient)`
* **Description:** Checks if the player has sufficient tech level for a tech ingredient. On master, delegates to `builder:HasTechIngredient()`. On client, reads from classified `techtrees` netvar.
* **Parameters:** `ingredient` -- table with `type` (e.g., `"science_material"`) and `amount` fields
* **Returns:** boolean, number -- has ingredient, current tech level
* **Error states:** None

### `KnowsRecipe(recipe, ignore_tempbonus, cached_tech_trees)`
* **Description:** Returns whether the player knows/unlocks a recipe. Checks free build mode, skin unlocks, builder tags, builder skills, recipe unlock status, and tech tree levels. On master, delegates to `builder:KnowsRecipe()`. On client, evaluates all conditions against classified netvars.
* **Parameters:**
  - `recipe` -- string recipe name or recipe table
  - `ignore_tempbonus` -- boolean (optional) -- if true, excludes temp bonuses from tech level check
  - `cached_tech_trees` -- table (optional) -- cache for tech tree results
* **Returns:** boolean
* **Error states:** None

### `HasIngredients(recipe)`
* **Description:** Returns whether the player has all ingredients for a recipe. Checks inventory items, character ingredients (health/sanity), and tech ingredients. Returns `true` immediately if free build mode is active. Returns `false` if limited recipe count is `<= 0`.
* **Parameters:** `recipe` -- string recipe name or recipe table
* **Returns:** boolean
* **Error states:** None (returns `false` if classified is nil)

### `CanBuild(recipe_name)`
* **Description:** **Deprecated.** Legacy wrapper for `HasIngredients()`.
* **Parameters:** `recipe_name` -- string recipe name
* **Returns:** boolean
* **Error states:** None

### `CanLearn(recipename)`
* **Description:** Returns whether the player can learn a recipe (ignores ingredient availability). Checks builder tags and builder skills only. On master, delegates to `builder:CanLearn()`. On client, evaluates against classified state.
* **Parameters:** `recipename` -- string recipe name
* **Returns:** boolean
* **Error states:** None

### `CanBuildAtPoint(pt, recipe, rot)`
* **Description:** Returns whether a recipe can be deployed at the given point. Delegates to `TheWorld.Map:CanDeployRecipeAtPoint()`.
* **Parameters:**
  - `pt` -- Vector3 world position
  - `recipe` -- recipe table
  - `rot` -- number rotation in radians
* **Returns:** boolean
* **Error states:** None

### `MakeRecipeFromMenu(recipe, skin)`
* **Description:** Crafts a recipe from the crafting menu. On master, delegates to `builder:MakeRecipeFromMenu()`. On client, forwards via `playercontroller:RemoteMakeRecipeFromMenu()` RPC.
* **Parameters:**
  - `recipe` -- recipe table
  - `skin` -- string skin name (optional)
* **Returns:** nil
* **Error states:** None (silently no-ops if neither builder nor playercontroller available)

### `MakeRecipeAtPoint(recipe, pt, rot, skin)`
* **Description:** Crafts a recipe at a world position (for placers). On master, delegates to `builder:MakeRecipeAtPoint()`. On client, forwards via `playercontroller:RemoteMakeRecipeAtPoint()` RPC.
* **Parameters:**
  - `recipe` -- recipe table
  - `pt` -- Vector3 world position
  - `rot` -- number rotation in radians
  - `skin` -- string skin name (optional)
* **Returns:** nil
* **Error states:** None (silently no-ops if neither builder nor playercontroller available)

### `IsBusy()`
* **Description:** Returns whether the builder is currently busy (inventory or overflow container is busy). Returns `false` on master. On client, checks `inventory.classified:IsBusy()` and overflow container classified.
* **Parameters:** None
* **Returns:** boolean
* **Error states:** None

## Events & listeners
- **Listens to:** `onremove` (on classified entity) — triggers `DetachClassified()` when classified is removed (client only)