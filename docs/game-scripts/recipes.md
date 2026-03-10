---
id: recipes
title: Recipes
description: Manages crafting recipe definitions, validation, and deconstruction logic, including dynamic resource generation, builder requirements, and tile-based placement constraints.
tags: [crafting, validation, placement, deconstruction]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: d84b3d2b
system_scope: crafting
---

# Recipes

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `recipes.lua` file defines and configures crafting recipes in DST using the `Recipe2` and `Ingredient` APIs from `recipe.lua`. It enforces placement constraints (e.g., marsh tiles), dynamic yield calculations based on player skills (via `skilltreeupdater`), pet limits (via `petleash`), and follower requirements (via `leader`). It also supports recipe deconstruction customization via `DeconstructRecipe`, including blocking deconstruction and specifying returned components. The system integrates with custom filters, world geometry queries, and event system hooks (e.g., `craftedextraelixir`) to enable feature-rich crafting behaviors.

## Usage example
```lua
local Recipe = require("recipe")
local recipes = require("recipes")

-- Register a marsh-only recipe with dynamic elixir yield
Recipe2("ghostly_elixir", {
    ingredients = {
        Ingredient("ghost_fragment", 1),
        Ingredient("_HEALTH", 1),
    },
    canbuild = function(inst, builder) 
        return TheWorld.Map:GetTileAtPoint(inst.x, inst.z) == WORLD_TILES.MARSH
    end,
    onbuild = function(inst, builder)
        local num = elixir_numtogive(recipe, builder)
        if num > 1 then
            builder:PushEvent("craftedextraelixir", { total = num })
        end
        return num
    end,
})

-- Define a deconstruction recipe with no deconstruction allowed
DeconstructRecipe("security_pulse_cage_full", {}, { no_deconstruction = true })
```

## Dependencies & tags
**Components used:**
- `leader` — via `builder.components.leader:CountFollowers(tag)` for follower-based constraints.
- `petleash` — via `builder.components.petleash:IsFullForPrefab(prefab)` to enforce per-pet-type limits.
- `skilltreeupdater` — via `doer.components.skilltreeupdater:IsActivated(skill)` for skill-based yield bonuses.

**Tags:**
- `"pocketwatch_inactive"` — used to determine deconstruction eligibility (inverted logic).
- `"plantkin"` — `builder_tag` for Wormwood recipes.
- `"clockmaker"` — `builder_tag` for pocketwatch recipes.
- `"balloonomancer"` — `builder_tag` for Wes recipes.
- `"ticoon"` — used in `CountFollowers("ticoon")` for Ticoon builder recipes.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `no_deconstruction` | `boolean` | `false` | If `true`, prevents the item from being deconstructed via hammering or deconstruction recipes. |
| `source_recipename` | `string` | `nil` | Specifies the underlying craftable recipe name, used during deconstruction reconstruction. |
| `builder_tag` | `string` | `nil` | Requires the builder to have the specified tag. |
| `no_builder_tag` | `string` | `nil` | Prohibits the builder from having the specified tag. |
| `builder_skill` | `string` | `nil` | Requires the builder to have the specified skill activated. |
| `action_str` | `string` | `nil` | Localized string override for the crafting action. |
| `filter_text` | `string` | `nil` | Recipe filter group key, validated via `recipes_filter` to ensure membership in `CRAFTING_FILTERS`. |

## Main functions
### `IsMarshLand(pt, rot)`
* **Description:** Checks if the tile at the given point is a marsh tile, used to restrict recipe placement to marsh terrain.
* **Parameters:**  
  - `pt`: Point object with `.x`, `.y`, `.z` fields (typically `inst.x`, `inst.z`).  
  - `rot`: Rotation angle (unused; present for API consistency with other tests).  
* **Returns:** `true` if `TheWorld.Map:GetTileAtPoint(pt.x, pt.z) == WORLD_TILES.MARSH`; otherwise `false` or `nil` (if tile data is missing).

### `telebase_testfn(pt, rot)`
* **Description:** Validates placement of telebase structures by checking three precomputed points around `pt` for visual ground (e.g., not water or void).
* **Parameters:**  
  - `pt`: Placement point with `.x`, `.y`, `.z`.  
  - `rot`: Rotation in degrees (converted internally to radians for point offset calculation).  
* **Returns:** `true` if `TheWorld.Map:IsVisualGroundAtPoint(...)` returns `true` for all three points; otherwise `false`.

### `elixir_numtogive(recipe, doer)`
* **Description:** Calculates the number of ghostly elixirs to award, applying luck-based bonuses based on activated skill and global tuning constants.
* **Parameters:**  
  - `recipe`: Recipe object (unused in logic; present for signature compatibility).  
  - `doer`: Entity performing the craft; must have `components.skilltreeupdater`.  
* **Returns:** Integer: `1` (base), increased by `+1` if `"wendy_potion_yield"` is activated and `"GHOSTLYELIXIR_EXTRA1_CHANCE"` luck roll passes, or `+2` if `"wendy_potion_yield"` is activated *and* `"GHOSTLYELIXIR_EXTRA2_CHANCE"` luck roll passes. Never returns `nil` in practice—defaults to `1` if component/skill is unavailable.  
* **Note:** Fires `craftedextraelixir` event on `doer` only if `total > 1`.

### `calc_slingshotammo_numtogive(recipe, doer)`
* **Description:** Returns adjusted slingshot ammo quantity when `"walter_ammo_efficiency"` skill is active.
* **Parameters:**  
  - `recipe`: Recipe object; its `numtogive` field is multiplied.  
  - `doer`: Entity performing the craft; must have `components.skilltreeupdater`.  
* **Returns:** `recipe.numtogive * 1.5` (float) if skill is activated; otherwise `nil`.

### `get_slingshotammo_sg_state(recipe, doer)`
* **Description:** Selects the appropriate stategraph action state for slingshot ammo crafting based on skill activation.
* **Parameters:**  
  - `recipe`: Unused.  
  - `doer`: Entity performing the craft.  
* **Returns:** `"domediumaction"` if `"walter_ammo_efficiency"` is activated; otherwise `nil`.

### `pocketwatch_nodecon(inst)`
* **Description:** Predicate function used to prevent deconstruction of active pocketwatch items. Returns `true` if deconstruction should be *blocked*.
* **Parameters:**  
  - `inst`: Entity instance (the crafted item).  
* **Returns:** `true` if `inst:HasTag("pocketwatch_inactive")` is `false` (i.e., item is active); otherwise `false`.

### `DeconstructRecipe(recipe_name, returns, options)`
* **Description:** Registers or overrides deconstruction logic for a recipe. Used to define what ingredients are returned when an item is deconstructed or hammered.
* **Parameters:**  
  - `recipe_name`: String — name of the original craftable recipe (e.g., `"cotl_tabernacle_level2"`).  
  - `returns`: Table — list of `Ingredient` objects returned on deconstruction.  
  - `options`: Optional table; supports:  
    - `no_deconstruction = true` — blocks deconstruction entirely.  
    - `source_recipename = "..."` — maps deconstructed item to its underlying craftable for reconstruction.  
* **Returns:** `nil` (side-effect: registers internal mapping in `DECONSTRUCT_RECIPES` table).  

## Events & listeners
**Pushes:**
- `craftedextraelixir` — fired on the `doer` entity when `elixir_numtogive` produces a yield > 1.  
  *Data payload:* `{ total = number }`, where `total` is the final elixir count.

**Listens to:** None explicitly defined in `recipes.lua`.