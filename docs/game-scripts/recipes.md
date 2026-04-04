---
id: recipes
title: Recipes
description: This file defines the complete crafting recipe registry for Don't Starve Together, registering character-specific recipes, placement validation helpers, deconstruction logic, and event-specific items across all technology tiers using the Recipe2 API.
tags: [crafting, recipes, items, characters, events]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: root
source_hash: 0a26f152
system_scope: crafting
---

# Recipes

> Based on game build **718694** | Last updated: 2026-04-04

## Overview

This file defines the `PROTOTYPER_DEFS` table containing crafting station prototype data for Don't Starve Together. It depends on the `recipe` module (loaded via `require("recipe")`) and populates the global `PROTOTYPER_DEFS` table with prototyper definitions. Each prototyper entry specifies an icon atlas, icon image, whether it functions as a crafting station, and optional action strings and filter text for categorization. Prototypers include science machines (`researchlab`, `researchlab2`), magic stations (`researchlab3`, `researchlab4`), seafaring stations, fishing tackle stations, turf crafting stations, book stations, ancient altars, critter orphanages, cartography desks, sculpting tables, celestial stations, lunar and shadow forges, hermit crab shops, shellweaver stations, rabbit king shops, wandering trader shops, Wagstaff workstations, carpentry stations, shadow journals, portable blenders, and various event-specific stations (Carnival, Winter's Feast, Mad Science Lab, shrines). The file also establishes alias mappings where multiple shrine variants reference the same prototyper definition as `perdshrine`.
## Usage example

```lua
-- Register a new crafting recipe using Recipe2
local recipe = Recipe2("my_custom_item", {
    Ingredient("cutgrass", 3),
    Ingredient("twigs", 2),
}, RECIPETABS.SURVIVAL, TECH.NONE, {
    name = "My Custom Item",
    desc = "A useful custom item",
    tab_weight = 1,
})

-- Add a custom build validation function
recipe.atlas = CRAFTING_ICONS_ATLAS
recipe.numtogive = 1
recipe.crafttestfn = function(recipe, builder, pt, rotation, station)
    if builder.components.health ~= nil and builder.components.health.currenthealth < 50 then
        return false, "LOW_HEALTH"
    end
    return true
end

-- Register deconstruction recipe for when structure is hammered
DeconstructRecipe("my_structure", {
    Ingredient("cutgrass", 2),
    Ingredient("twigs", 1),
})
```

## Dependencies & tags

**External dependencies:**
- `recipe` -- Required module providing Recipe2 and Ingredient functions
- `recipes_filter` -- Required module for crafting filter functionality

**Components used:**
- `skilltreeupdater` -- Checked on doer to determine if wendy_potion_yield or walter_ammo_efficiency skills are activated
- `petleash` -- Checked in canbuild closures to limit Wormwood mutant pet count
- `leader` -- Accessed via builder.components.leader to count ticoon followers

**Tags:**
- `pocketwatch_inactive` -- check
- `oncooldown` -- check
## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PROTOTYPER_DEFS` | table | `{}` | Top-level container for shrine prototype mappings. Contains shrine definitions (e.g., `wargshrine`, `pigshrine`, `yotc_carratshrine`) that map to base prototype definitions like `perdshrine`. |
| `NUM_TEASHOP_LEVELS` | number | `3` | Number of upgrade levels available for the Teashop building. |
| `NUM_COMMON_PETALS_FOR_TEASHOP_LEVEL` | table | `{8, 6, 4}` | Array of petal costs for each Teashop upgrade level. Index 1 = level 1 cost (8 petals), index 2 = level 2 cost (6 petals), index 3 = level 3 cost (4 petals). |
| `NUM_RARE_PETALS_FOR_TEASHOP_LEVEL` | table | `{6, 4, 2}` | Array of rare petal costs for each Teashop upgrade level. Index 1 = level 1 cost (6 petals), index 2 = level 2 cost (4 petals), index 3 = level 3 cost (2 petals). Lower costs reflect higher value of weeds and succulents. |
## Main functions

### `canbuild_boards_bunch(recipe, builder, pt, rotation, station)`
* **Description:** Validates if the carpentry station is busy before allowing bulk board crafting. Returns 'BUSY_STATION' if station is animating use
* **Parameters:**
  - `recipe` -- The recipe table being evaluated
  - `builder` -- The entity attempting to build
  - `pt` -- The position target for the build
  - `rotation` -- The rotation of the build
  - `station` -- The crafting station entity
* **Returns:** Boolean true if build allowed, or string error code
* **Error states:** None
### `canbuild_cutstone_bunch`(recipe, builder, pt, rotation, station)
* **Description:** Validates if the carpentry station is busy before allowing bulk cutstone crafting. Returns 'BUSY_STATION' if station is animating use
* **Parameters:**
  - `recipe` -- The recipe table being evaluated
  - `builder` -- The entity attempting to build
  - `pt` -- The position target for the build
  - `rotation` -- The rotation of the build
  - `station` -- The crafting station entity
* **Returns:** Boolean true if build allowed, or string error code
* **Error states:** None
### `canbuild(inst, builder)`
* **Description:** Checks if the builder already has a ticoon follower before allowing construction. Returns 'TICOON' if builder already leads a ticoon
* **Parameters:**
  - `inst` -- The recipe instance
  - `builder` -- The entity attempting to build
* **Returns:** Boolean true if build allowed, or string 'TICOON' if builder already leads a ticoon
* **Error states:** None
### `w_radio(skin_name, custom)`
* **Description:** Generates image layers for the w_radio skin based on custom configuration
* **Parameters:**
  - `skin_name` -- The name of the skin
  - `custom` -- Custom skin configuration string
* **Returns:** Table of layer configurations
* **Error states:** None
## Events & listeners

**Events pushed:**
- `craftedextraelixir` -- Pushed when Wendy crafts extra elixir due to skill luck rolls

**Events listened to:**
- None
