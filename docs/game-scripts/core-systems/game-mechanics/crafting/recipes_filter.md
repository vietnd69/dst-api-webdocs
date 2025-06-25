---
id: recipes_filter
title: Recipe Filters
description: Crafting menu categorization system for organizing recipes into filtered groups and categories
sidebar_position: 4
slug: game-scripts/core-systems/recipes_filter
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Recipe Filters

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `recipes_filter` module defines the categorization system for Don't Starve Together's crafting menu. It organizes recipes into logical groups, provides filtering capabilities, and manages the display order and visual presentation of craftable items in the user interface.

The system supports both static and dynamic recipe lists, character-specific categories, and special event filtering to enhance the crafting experience.

## Filter Definitions Structure

### CRAFTING_FILTER_DEFS

**Type:** `table`

**Status:** `stable`

**Description:** Array defining all available crafting filter categories with their properties.

**Filter Definition Properties:**
- `name` (string): Unique filter identifier
- `atlas` (function): Function returning atlas path
- `image` (function/string): Image file or function returning image
- `custom_pos` (boolean): Uses custom positioning in UI
- `image_size` (number): Override default image size
- `recipes` (table/function): Static recipe list or dynamic function
- `show_hidden` (boolean): Show normally hidden recipes
- `default_sort_values` (table/function): Recipe sort order

### CRAFTING_FILTERS

**Type:** `table`

**Status:** `stable`

**Description:** Dictionary lookup for filter definitions keyed by filter name.

## Core Filters

### Special Position Filters

#### FAVORITES
**Position:** Custom  
**Atlas:** Crafting menu atlas  
**Image:** `filter_favorites.tex`  
**Recipes:** Dynamic function returning user favorites

```lua
CRAFTING_FILTERS.FAVORITES.recipes = function() 
    return TheCraftingMenuProfile:GetFavorites() 
end
```

#### CRAFTING_STATION
**Position:** Custom  
**Atlas:** Crafting menu atlas  
**Image:** `filter_none.tex`  
**Recipes:** Filtered by station tags dynamically

#### SPECIAL_EVENT
**Position:** Custom  
**Atlas:** Crafting menu atlas  
**Image:** `filter_events.tex`  
**Recipes:** Event-specific items (Winter's Feast, Halloween, etc.)

#### MODS
**Position:** Custom  
**Atlas:** Crafting menu atlas  
**Image:** `filter_modded.tex`  
**Recipes:** Empty array for mod-added recipes

### Character Filter

#### CHARACTER
**Atlas:** Dynamic character atlas  
**Image:** Character-specific avatar  
**Image Size:** 80 pixels  
**Recipes:** Character-specific crafting abilities

**Character Atlas Resolution:**
```lua
local function GetCharacterAtlas(owner)
    if owner ~= nil and table.contains(MODCHARACTERLIST, owner.prefab) then
        local atlas_name = (MOD_CRAFTING_AVATAR_LOCATIONS[owner.prefab] or 
                           MOD_CRAFTING_AVATAR_LOCATIONS.Default) .. 
                          "avatar_" .. owner.prefab .. ".xml"
        if softresolvefilepath(atlas_name) == nil then
            atlas_name = (MOD_AVATAR_LOCATIONS[owner.prefab] or 
                         MOD_AVATAR_LOCATIONS.Default) .. 
                        "avatar_" .. owner.prefab .. ".xml"
        end
        return atlas_name
    else
        return resolvefilepath("images/crafting_menu_avatars.xml")
    end
end
```

## Recipe Categories

### Survival Equipment

#### TOOLS
**Image:** `filter_tool.tex`  
**Content:** Basic survival tools

**Key Recipe Types:**
- Harvesting tools: axe, pickaxe, shovel, hammer
- Farming tools: farm_hoe, pitchfork, wateringcan
- Utility tools: bugnet, razor, compass, sewing_kit
- Character tools: winona_remote, spider_whistle, wx78_scanner

#### WEAPONS
**Image:** `filter_weapon.tex`  
**Content:** Combat equipment

**Key Recipe Types:**
- Melee weapons: spear, hambat, nightsword, whip
- Ranged weapons: slingshot, boomerang, blowdart variants
- Magical weapons: firestaff, icestaff, staff_tornado
- Explosives: gunpowder, sleepbomb, beemine

#### ARMOUR
**Image:** `filter_armour.tex`  
**Content:** Protective equipment

**Key Recipe Types:**
- Basic armor: armorgrass, armorwood, footballhat
- Advanced armor: armormarble, armordreadstone, armorwagpunk
- Character armor: wathgrithrhat, armor_bramble

### Character Needs

#### RESTORATION
**Image:** `filter_health.tex`  
**Content:** Health and revival items

**Key Recipe Types:**
- Healing items: healingsalve, bandage, tillweedsalve
- Revival items: reviver, lifeinjector, tent, amulet
- Character healing: spider_healer_item, wx78module_bee

#### CLOTHING
**Image:** `filter_warable.tex`  
**Content:** Wearable items and accessories

**Key Recipe Types:**
- Seasonal clothing: winterhat, strawhat, raincoat
- Utility clothing: backpack, minerhat, umbrella
- Character clothing: balloonhat, walterhat, tophat_magician

### Utility Categories

#### LIGHT
**Image:** `filter_fire.tex`  
**Content:** Light sources and fire

**Key Recipe Types:**
- Portable light: torch, lighter, lantern, minerhat
- Structures: campfire, firepit, nightlight
- Advanced light: winona_spotlight, mushroom_light

#### CONTAINERS
**Image:** `filter_containers.tex`  
**Content:** Storage solutions

**Key Recipe Types:**
- Backpacks: backpack, piggyback, icepack, spicepack
- Chests: treasurechest, dragonflychest, icebox
- Special containers: candybag, slingshotammo_container

### Advanced Categories

#### PROTOTYPERS
**Image:** `filter_science.tex`  
**Content:** Crafting stations

**Key Recipe Types:**
- Science: researchlab, researchlab2, researchlab4
- Specialized: tacklestation, cartographydesk, sculptingtable
- Event stations: wintersfeastoven, madscience_lab

#### MAGIC
**Image:** `filter_skull.tex`  
**Content:** Magical items

**Key Recipe Types:**
- Magical tools: nightsword, telestaff, panflute
- Magical structures: resurrectionstatue, townportal
- Magical resources: nightmarefuel, purplegem

### Seasonal and Environmental

#### SEAFARING
**Image:** `filter_sailing.tex`  
**Content:** Ocean and boat items

**Key Recipe Types:**
- Boats: boat_item, oar, anchor_item, mast_item
- Boat accessories: boat_cannon_kit, mastupgrade_lamp_item
- Ocean tools: oceanfishingrod, fish_box, winch

#### GARDENING
**Image:** `filter_gardening.tex`  
**Content:** Farming and plant care

**Key Recipe Types:**
- Farm tools: farm_hoe, wateringcan, fertilizer
- Garden structures: beebox, mushroom_farm, compostingbin
- Plant care: treegrowthsolution, soil_amender

#### FISHING
**Image:** `filter_fishing.tex`  
**Content:** Fishing equipment

**Key Recipe Types:**
- Rods: fishingrod, oceanfishingrod
- Lures: oceanfishinglure variants, chum
- Equipment: pocket_scale, fish_box, ocean_trawler_kit

## Character-Specific Recipes

### CHARACTER Filter Recipes

The CHARACTER filter contains recipes exclusive to specific characters:

#### Wilson (Transmutation)
```lua
"transmute_log", "transmute_twigs", "transmute_flint",
"transmute_bluegem", "transmute_redgem", "transmute_purplegem"
```

#### Willow (Fire Mastery)
```lua
"lighter", "bernie_inactive"
```

#### Warly (Cooking)
```lua
"portablecookpot_item", "portableblender_item", "spicepack"
```

#### Wurt (Merm Buildings)
```lua
"mermhouse_crafted", "mermthrone_construction", "mermhat"
```

#### Walter (Slingshot & Camping)
```lua
"slingshot", "slingshotammo_rock", "portabletent_item"
```

#### Wendy (Ghostly Abilities)
```lua
"abigail_flower", "sisturn", "ghostlyelixir_slowregen"
```

## Special Event Recipes

### SPECIAL_EVENT Filter

Event-specific recipes available during seasonal events:

#### Winter's Feast
```lua
"wintersfeastoven", "table_winters_feast", "giftwrap"
```

#### Halloween
```lua
"madscience_lab", "candybag"
```

#### Yearly Events
```lua
"perdshrine", "yotc_carratshrine", "yotb_beefaloshrine",
"yot_catcoonshrine", "yotr_rabbitshrine"
```

## Crafting Station Integration

### CRAFTING_STATION Filter

Recipes that require specific crafting stations:

#### Ancient Station Recipes
```lua
"thulecite", "orangeamulet", "ruinshat", "armorruins"
```

#### Lunar Forge Recipes  
```lua
"armor_lunarplant", "lunarplanthat", "staff_lunarplant"
```

#### Shadow Forge Recipes
```lua
"armor_voidcloth", "voidclothhat", "shadow_battleaxe"
```

#### Specialized Stations
```lua
-- Cartography
"mapscroll",

-- Sculpting
"chesspiece_hornucopia_builder", "chesspiece_deerclops_builder",

-- Carpentry
"wood_chair", "stone_table_round", "decor_lamp"
```

## Filter Helper Functions

### GetCharacterAtlas(owner)

**Status:** `stable`

**Description:**
Resolves the appropriate atlas for character avatars in the crafting menu.

**Parameters:**
- `owner` (EntityScript): Character entity

**Returns:**
- (string): Atlas path for character avatar

**Resolution Priority:**
1. Mod-specific crafting avatar atlas
2. Mod-specific general avatar atlas  
3. Default crafting menu avatars

### GetCharacterImage(owner)

**Status:** `stable`

**Description:**
Gets the image filename for character avatar.

**Parameters:**
- `owner` (EntityScript): Character entity

**Returns:**
- (string): Image filename (e.g., "avatar_wilson.tex")

### GetCraftingMenuAtlas()

**Status:** `stable`

**Description:**
Returns the standard crafting menu icons atlas path.

**Returns:**
- (string): Resolved path to crafting icons atlas

## Filter Recipe Management

### Static Recipe Lists

Most filters use static recipe arrays:
```lua
CRAFTING_FILTERS.TOOLS.recipes = {
    "axe", "pickaxe", "shovel", "hammer",
    -- ... more recipes
}
```

### Dynamic Recipe Lists

Special filters use functions for dynamic content:
```lua
CRAFTING_FILTERS.FAVORITES.recipes = function() 
    return TheCraftingMenuProfile:GetFavorites() 
end

CRAFTING_FILTERS.FAVORITES.default_sort_values = function() 
    return TheCraftingMenuProfile:GetFavoritesOrder() 
end
```

### Sort Order Management

Filters maintain default sort values for consistent ordering:
```lua
for _, filter in pairs(CRAFTING_FILTERS) do
    if filter.recipes ~= nil then
        filter.default_sort_values = table.invert(filter.recipes)
    end
end
```

## Usage Examples

### Adding Recipes to Filters

```lua
-- Add recipe to specific filter
table.insert(CRAFTING_FILTERS.TOOLS.recipes, "my_custom_tool")

-- Add to character filter (in character's prefab)
table.insert(CRAFTING_FILTERS.CHARACTER.recipes, "character_special_item")
```

### Custom Filter Creation

```lua
-- Define new filter
local my_filter = {
    name = "CUSTOM_CATEGORY",
    atlas = GetCraftingMenuAtlas,
    image = "filter_custom.tex",
    recipes = {
        "custom_recipe1",
        "custom_recipe2"
    }
}

-- Add to system
table.insert(CRAFTING_FILTER_DEFS, my_filter)
CRAFTING_FILTERS[my_filter.name] = my_filter
```

### Recipe Filter Assignment

```lua
-- In recipe definition
Recipe2("my_item",
    ingredients,
    tech_level,
    {
        filter = "TOOLS" -- Assigns to TOOLS filter
    }
)
```

## Integration Points

### Crafting Menu Integration

- Recipe categorization for UI organization
- Filter buttons and navigation
- Search and favorite functionality
- Character-specific recipe visibility

### Mod System Integration

- Automatic mod recipe detection
- MOD_CRAFTING_AVATAR_LOCATIONS support
- Custom filter definitions
- Recipe filter override capabilities

### Character System Integration

- Character tag-based recipe filtering
- Skill tree recipe unlocks
- Dynamic character avatar display
- Builder tag restrictions

## Related Modules

- [Recipe System Core](./recipe.md): Core recipe definitions
- [Recipes](./recipes.md): Complete recipe implementations
- [Builder Component](../components/builder.md): Crafting logic
- [Crafting Menu Profile](./craftingmenuprofile.md): User preferences and favorites
- [Constants](./constants.md): Filter and category constants
