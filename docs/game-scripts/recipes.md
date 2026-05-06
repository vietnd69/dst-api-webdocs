---
id: recipes
title: Recipes
description: This file defines the complete crafting recipe registry for Don't Starve Together, registering all character-specific items, structures, tools, consumables, event items, and deconstruction recipes using Recipe2() and Ingredient() functions with technology tier requirements, ingredient costs, and validation callbacks.
tags: [crafting, recipes, configuration, items, registration]
sidebar_position: 10

last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: data_config
source_hash: 16719ea7
system_scope: crafting
---

# Recipes

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`recipes.lua` defines the `PROTOTYPER_DEFS` table for Don't Starve Together's crafting system. This table contains metadata for all prototypers and crafting stations (researchlab, ancient_altar, lunar_forge, etc.), including their icon atlas, icon image, whether they function as crafting stations, action strings, and filter text for the crafting UI. The file also creates alias entries where multiple prototyper keys share the same definition (e.g., various shrine types alias to perdshrine). This is a configuration file — it does not attach to entities as a component but is referenced by the crafting UI and recipe resolution systems to determine prototyper capabilities and categorization.

## Usage example
```lua
local Recipe2 = require "recipe"
local Ingredient = require "recipe"

-- Register a basic science recipe
Recipe2("torch", {
    Ingredient("cutgrass", 2),
    Ingredient("flint", 1)
}, TECH.SCIENCE_ONE, {
    numtogive = 1,
    actionstr = "CRAFT"
})

-- Register a recipe with placement validation
Recipe2("telebase", {
    Ingredient("boards", 4),
    Ingredient("rope", 2)
}, TECH.SCIENCE_TWO, {
    placer = "telebase_placer",
    testfn = telebase_testfn
})

-- Access recipe data via filtering system
local recipes_filter = require "recipes_filter"
local filters = recipes_filter.CRAFTING_FILTERS
```

## Dependencies & tags
**External dependencies:**
- `recipe` -- Provides Recipe2 and Ingredient functions for recipe registration
- `recipes_filter` -- Required for recipe filtering functionality
- `TECH` -- Used as tech tier argument in Recipe2 calls to define recipe unlock requirements
- `CHARACTER_INGREDIENT` -- Used in Ingredient definitions for health-based recipe costs

**Components used:**
- `skilltreeupdater` -- Checked via IsActivated to determine if skill bonuses apply (wendy_potion_yield, walter_ammo_efficiency)
- `petleash` -- Referenced in canbuild functions for Wormwood mutant recipes to check pet capacity via IsFullForPrefab()
- `leader` -- Accessed in canbuild function for ticoon_builder to count ticoon followers via CountFollowers()

**Tags:**
- `pocketwatch_inactive` -- check (used in pocketwatch_nodecon function)
- `oncooldown` -- check (used in shadow_beef_bell no_deconstruction function)
- `ticoon` -- check (used in ticoon_builder canbuild function)
- `shadow_forge` -- station_tag for shadow_beef_bell recipe

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| NUM_TEASHOP_LEVELS | number | 3 | Number of tea shop upgrade levels |
| NUM_COMMON_PETALS_FOR_TEASHOP_LEVEL | table | `{ 8, 6, 4 }` | Petals required per tea shop level for common petals |
| NUM_RARE_PETALS_FOR_TEASHOP_LEVEL | table | `{ 6, 4, 2 }` | Petals required per tea shop level for rare petals (weeds/succulents) |

## Main functions

### `canbuild (wormwood_carrat)(recipe, builder, pt, rotation, station, skin)`
* **Description:** Inline canbuild function for wormwood_carrat recipe that checks if builder has petleash component and verifies pet capacity is not full for this prefab using IsFullForPrefab().
* **Parameters:**
  - `recipe` -- Recipe definition table
  - `builder` -- Player entity attempting to craft
  - `pt` -- Placement position vector
  - `rotation` -- Placement rotation
  - `station` -- Crafting station entity
  - `skin` -- Skin identifier
* **Returns:** boolean -- true if builder can craft (has petleash and not at capacity), false otherwise
* **Error states:** None -- gracefully handles missing petleash component with nil check

### `canbuild (wormwood_lightflier)(recipe, builder, pt, rotation, station, skin)`
* **Description:** Inline canbuild function for wormwood_lightflier recipe that checks if builder has petleash component and verifies pet capacity is not full for this prefab using IsFullForPrefab().
* **Parameters:**
  - `recipe` -- Recipe definition table
  - `builder` -- Player entity attempting to craft
  - `pt` -- Placement position vector
  - `rotation` -- Placement rotation
  - `station` -- Crafting station entity
  - `skin` -- Skin identifier
* **Returns:** boolean -- true if builder can craft (has petleash and not at capacity), false otherwise
* **Error states:** None -- gracefully handles missing petleash component with nil check

### `canbuild (wormwood_fruitdragon)(recipe, builder, pt, rotation, station, skin)`
* **Description:** Inline canbuild function for wormwood_fruitdragon recipe that checks if builder has petleash component and verifies pet capacity is not full for this prefab using IsFullForPrefab().
* **Parameters:**
  - `recipe` -- Recipe definition table
  - `builder` -- Player entity attempting to craft
  - `pt` -- Placement position vector
  - `rotation` -- Placement rotation
  - `station` -- Crafting station entity
  - `skin` -- Skin identifier
* **Returns:** boolean -- true if builder can craft (has petleash and not at capacity), false otherwise
* **Error states:** None -- gracefully handles missing petleash component with nil check

### `getlimitedrecipecount(recipe, builder)`
* **Description:** Inline function passed to Recipe2 options for wx78_backupbody and wx78_drone_scout. Returns the number of free backup bodies or scouting drones available for the WX-78 character by calling builder.wx78_classified:GetNumFreeBackupBodies() or GetNumFreeScoutingDrones().
* **Parameters:**
  - `recipe` -- table -- the recipe definition table
  - `builder` -- Entity -- the player/entity attempting to craft
* **Returns:** number -- count of available items (0 if builder.wx78_classified is nil)
* **Error states:** Errors if builder.wx78_classified is nil (unguarded method call on builder.wx78_classified:GetNumFreeBackupBodies() or GetNumScoutingDrones())

### `recipedisplaynamefn(recipe, builder)`
* **Description:** Inline function passed to Recipe2 options for wx78_backupbody. Returns formatted display name using subfmt(STRINGS.NAMES.WX78_BACKUPBODY_FMT, `{name = builder:GetDisplayName()}`) when free backup bodies are available, or nil to hide the recipe.
* **Parameters:**
  - `recipe` -- table -- the recipe definition table
  - `builder` -- Entity -- the player/entity attempting to craft
* **Returns:** string or nil -- formatted recipe name or nil to hide recipe from display
* **Error states:** None -- gracefully returns nil if conditions not met

### `canbuild(recipe, builder, pt, rotation, station, skin)`
* **Description:** Inline function passed to Recipe2 options for wx78_drone_scout. Validates build permission by checking if builder has free scouting drones and if flying is permitted from the placement point using IsFlyingPermittedFromPoint(builder.Transform:GetWorldPosition()). Also used for boards_bunch and cutstone_bunch recipes to check if the crafting station is busy.
* **Parameters:**
  - `recipe` -- table -- the recipe definition table
  - `builder` -- Entity -- the player attempting to craft
  - `pt` -- Vector3 -- placement position in world space
  - `rotation` -- number -- placement rotation angle
  - `station` -- Entity -- crafting station entity reference
  - `skin` -- string -- skin identifier for the item
* **Returns:** `true` if build allowed, `false` otherwise, or the string literal `"BUSY_STATION"` when station validation fails
* **Error states:** Errors if builder.Transform is nil (unguarded chained access on builder.Transform:GetWorldPosition())

### `layeredimagefn(skin_name, custom)`
* **Description:** Generates layered image configuration for the w_radio prefab skin system. Decodes custom JSON data and builds an array of layer definitions for antenna, base, right_side, left_side, face, and plate components using variation numbers from custom data or defaults to 1.
* **Parameters:**
  - `skin_name` -- String identifier for the skin being applied
  - `custom` -- JSON string containing custom variation data or nil
* **Returns:** table -- array of layer definitions with atlas and image properties
* **Error states:** None

### `_add_layer(partname, variation)` (local)
* **Description:** Internal helper function nested within `layeredimagefn`. Not part of the public API - cannot be called externally from this module. Appends a layer definition to the layers table by formatting the texture filename using partname and zero-padded variation number.
* **Parameters:**
  - `partname` -- String name of the radio part (antenna, base, right_side, etc.)
  - `variation` -- Numeric variation index for the part texture
* **Returns:** nil (modifies layers table by reference)
* **Error states:** None

## Events & listeners
**Pushes:**
- `craftedextraelixir` -- Pushed when extra elixirs are crafted due to successful luck rolls
