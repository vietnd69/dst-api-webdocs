---
id: custom-recipes
title: Custom Crafting Recipes and Tech Trees
sidebar_position: 4
last_updated: 2023-07-06
---

# Custom Crafting Recipes and Tech Trees

This guide demonstrates how to create custom crafting recipes and tech trees in Don't Starve Together. We'll cover basic recipes, recipe categories, tech level requirements, and creating entirely new crafting tabs.

## Basic Recipe Creation

The most straightforward way to add a new recipe is through the `AddRecipe` function:

```lua
-- Basic recipe structure
AddRecipe(
    "recipe_name",       -- Internal name of the recipe
    {ingredients},       -- Table of ingredients
    tab,                 -- Crafting tab where this recipe appears
    tech_level,          -- Tech level requirement
    placer,              -- Placer prefab (for structures)
    min_spacing,         -- Minimum spacing between placeable structures
    nounlock,            -- If true, recipe won't show as "new" when unlocked
    numtogive,           -- Number of items crafted
    builder_tag,         -- Tag required to see/craft this recipe
    atlas,               -- Custom atlas for the recipe icon
    image                -- Custom image for the recipe icon
)

-- Example: Simple spear recipe
AddRecipe(
    "spear",
    {
        Ingredient("twigs", 2),
        Ingredient("flint", 1),
        Ingredient("grass", 3)
    },
    RECIPETABS.TOOLS,
    TECH.NONE,
    nil, nil, nil, nil, nil
)
```

## Ingredients

Ingredients are specified using the `Ingredient` function:

```lua
Ingredient("item_prefab", count, "atlas", "image", "ingredient_type")
```

- `item_prefab`: The prefab name of the required item
- `count`: Number of items required
- `atlas` and `image`: Optional custom icon
- `ingredient_type`: Optional type specification (e.g., "SPECIAL")

### Ingredient Types

```lua
-- Standard ingredient that is consumed when crafting
Ingredient("log", 2)

-- Tag-based ingredient (any item with this tag works)
Ingredient("nightmarefuel", 2, nil, nil, "TAG")

-- Special ingredient types
Ingredient("boards", 1, nil, nil, "SPECIAL")
```

## Tech Levels

Tech levels determine what crafting stations are required to craft an item. The standard tech levels are defined in `TECH`:

```lua
TECH = {
    NONE = 0,               -- No crafting station required
    SCIENCE_ONE = 1,        -- Science Machine
    SCIENCE_TWO = 2,        -- Alchemy Engine
    MAGIC_TWO = 2,          -- Prestihatitator
    MAGIC_THREE = 3,        -- Shadow Manipulator
    ANCIENT_TWO = 2,        -- Ancient Pseudoscience Station
    ANCIENT_THREE = 3,      -- Ancient Pseudoscience Station (higher tier)
    ANCIENT_FOUR = 4,       -- Ancient Pseudoscience Station (highest tier)
    CELESTIAL_ONE = 1,      -- Moon Stone
    CELESTIAL_THREE = 3,    -- Celestial Altar
    LOST = 10,              -- Lost technology (not normally accessible)
    CARTOGRAPHY_TWO = 2,    -- Cartography Desk
}
```

Example of setting tech levels for recipes:

```lua
-- Basic recipe (no tech required)
AddRecipe("torch", {...}, RECIPETABS.LIGHT, TECH.NONE)

-- Science Machine recipe
AddRecipe("spear", {...}, RECIPETABS.TOOLS, TECH.SCIENCE_ONE)

-- Alchemy Engine recipe
AddRecipe("icestaff", {...}, RECIPETABS.TOOLS, TECH.SCIENCE_TWO)

-- Magic recipe
AddRecipe("nightsword", {...}, RECIPETABS.MAGIC, TECH.MAGIC_THREE)
```

## Recipe Tabs

Recipe tabs organize recipes into categories in the crafting menu. The standard tabs are defined in `RECIPETABS`:

```lua
RECIPETABS = {
    TOOLS = {str = "TOOLS", sort = 0, icon = "tab_tools.tex"},
    LIGHT = {str = "LIGHT", sort = 1, icon = "tab_light.tex"},
    SURVIVAL = {str = "SURVIVAL", sort = 2, icon = "tab_survival.tex"},
    FARM = {str = "FARM", sort = 3, icon = "tab_farm.tex"},
    SCIENCE = {str = "SCIENCE", sort = 4, icon = "tab_science.tex"},
    TOWN = {str = "TOWN", sort = 5, icon = "tab_town.tex"},
    REFINE = {str = "REFINE", sort = 6, icon = "tab_refine.tex"},
    MAGIC = {str = "MAGIC", sort = 7, icon = "tab_magic.tex"},
    DRESS = {str = "DRESS", sort = 8, icon = "tab_dress.tex"},
    ANCIENT = {str = "ANCIENT", sort = 9, icon = "tab_ancient.tex"},
    CELESTIAL = {str = "CELESTIAL", sort = 10, icon = "tab_celestial.tex"},
    CARTOGRAPHY = {str = "CARTOGRAPHY", sort = 11, icon = "tab_cartography.tex"},
}
```

## Creating Custom Recipe Tabs

You can create your own recipe tab for organizing mod recipes:

```lua
-- In modmain.lua
local CUSTOM_RECIPETAB = AddRecipeTab(
    "MYCUSTOMTAB",         -- Tab ID
    "Custom Tab",          -- Tab name
    "images/tab_custom.tex", -- Tab icon
    "images/tab_custom.xml", -- Tab icon atlas
    100                     -- Sort order
)

-- Then use it for recipes
AddRecipe("myitem", {...}, CUSTOM_RECIPETAB, TECH.NONE)
```

## Character-Specific Recipes

To create recipes that only specific characters can craft:

```lua
-- Recipe only visible to Wickerbottom
AddRecipe(
    "papyrus",
    {Ingredient("cutreeds", 4)},
    RECIPETABS.REFINE,
    TECH.NONE,
    nil, nil, nil, nil,
    "bookbuilder" -- Wickerbottom's unique tag
)

-- Recipe only visible to Winona
AddRecipe(
    "sewing_tape",
    {Ingredient("silk", 1), Ingredient("cutgrass", 3)},
    RECIPETABS.REFINE,
    TECH.NONE,
    nil, nil, nil, nil,
    "handyperson" -- Winona's unique tag
)
```

## Custom Tech Trees

You can create your own tech trees by defining new tech levels and crafting stations:

```lua
-- In modmain.lua
-- Define new tech level
GLOBAL.TECH.MYCUSTOM_ONE = 5 -- Choose a number not used by existing tech levels

-- Create a custom prototyper (crafting station)
local function MakeCustomPrototyper()
    local inst = CreateEntity()
    
    -- Add required components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Make it placeable
    MakeObstaclePhysics(inst, 1)
    
    -- Set up animations
    inst.AnimState:SetBank("custom_prototyper")
    inst.AnimState:SetBuild("custom_prototyper")
    inst.AnimState:PlayAnimation("idle")
    
    -- Add prototyper component on the server
    if not TheWorld.ismastersim then
        return inst
    end
    
    inst:AddComponent("prototyper")
    inst.components.prototyper.trees = {TECH.MYCUSTOM_ONE = 1}
    
    return inst
end

-- Register the prefab
AddPrefab("custom_prototyper", MakeCustomPrototyper)

-- Add a recipe for the prototyper itself
AddRecipe(
    "custom_prototyper",
    {
        Ingredient("log", 4),
        Ingredient("goldnugget", 2),
        Ingredient("transistor", 1)
    },
    RECIPETABS.SCIENCE,
    TECH.SCIENCE_ONE
)

-- Add recipes that require the custom tech
AddRecipe(
    "custom_item",
    {Ingredient("log", 2), Ingredient("goldnugget", 1)},
    RECIPETABS.TOOLS,
    TECH.MYCUSTOM_ONE
)
```

## Modifying Existing Recipes

You can modify existing recipes to change their ingredients, tech requirements, or crafting tabs:

```lua
-- In modmain.lua
-- Get the recipe
local recipe = GLOBAL.AllRecipes["spear"]

-- Modify ingredients
recipe.ingredients = {
    Ingredient("twigs", 1),
    Ingredient("flint", 2),
    Ingredient("goldnugget", 1)
}

-- Change tech level
recipe.level = TECH.SCIENCE_ONE

-- Change crafting tab
recipe.tab = RECIPETABS.SURVIVAL
```

## Complete Example: Custom Crafting System

Here's a complete example that adds a new crafting tab, tech level, and several recipes:

```lua
-- modmain.lua

-- Import globals into the environment
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Add assets
Assets = {
    Asset("IMAGE", "images/inventoryimages/magic_wand.tex"),
    Asset("ATLAS", "images/inventoryimages/magic_wand.xml"),
    Asset("IMAGE", "images/inventoryimages/magic_staff.tex"),
    Asset("ATLAS", "images/inventoryimages/magic_staff.xml"),
    Asset("IMAGE", "images/tab_arcane.tex"),
    Asset("ATLAS", "images/tab_arcane.xml"),
}

-- Add prefabs
PrefabFiles = {
    "magic_wand",
    "magic_staff",
    "arcane_station",
}

-- Define new tech level
GLOBAL.TECH.ARCANE_ONE = 6
GLOBAL.TECH.ARCANE_TWO = 7

-- Create a new recipe tab
local ARCANE_TAB = AddRecipeTab(
    "ARCANE", 
    "Arcane",
    "images/tab_arcane.tex",
    "images/tab_arcane.xml",
    66
)

-- Add recipe for the crafting station
AddRecipe(
    "arcane_station",
    {
        Ingredient("boards", 2),
        Ingredient("nightmarefuel", 3),
        Ingredient("purplegem", 1)
    },
    RECIPETABS.MAGIC,
    TECH.MAGIC_TWO,
    "arcane_station_placer", -- Placer prefab
    1.5, -- Min spacing
    nil, 
    nil,
    nil,
    "images/inventoryimages/arcane_station.xml",
    "arcane_station.tex"
)

-- Add recipes that use the new tech level
AddRecipe(
    "magic_wand",
    {
        Ingredient("twigs", 1),
        Ingredient("nightmarefuel", 2),
        Ingredient("redgem", 1)
    },
    ARCANE_TAB,
    TECH.ARCANE_ONE,
    nil, nil, nil, nil, nil,
    "images/inventoryimages/magic_wand.xml",
    "magic_wand.tex"
)

AddRecipe(
    "magic_staff",
    {
        Ingredient("magic_wand", 1),
        Ingredient("nightmarefuel", 3),
        Ingredient("purplegem", 1)
    },
    ARCANE_TAB,
    TECH.ARCANE_TWO,
    nil, nil, nil, nil, nil,
    "images/inventoryimages/magic_staff.xml",
    "magic_staff.tex"
)

-- Add strings for the new items
GLOBAL.STRINGS.NAMES.ARCANE_STATION = "Arcane Station"
GLOBAL.STRINGS.RECIPE_DESC.ARCANE_STATION = "Unlock the secrets of arcane crafting"

GLOBAL.STRINGS.NAMES.MAGIC_WAND = "Magic Wand"
GLOBAL.STRINGS.RECIPE_DESC.MAGIC_WAND = "A basic tool for arcane crafting"

GLOBAL.STRINGS.NAMES.MAGIC_STAFF = "Magic Staff"
GLOBAL.STRINGS.RECIPE_DESC.MAGIC_STAFF = "A powerful arcane tool"

-- Add a postinit for the arcane station
AddPrefabPostInit("arcane_station", function(inst)
    if not GLOBAL.TheWorld.ismastersim then
        return
    end
    
    if not inst.components.prototyper then
        inst:AddComponent("prototyper")
    end
    
    inst.components.prototyper.trees = {
        TECH.ARCANE_ONE = 1,
        TECH.ARCANE_TWO = 1
    }
end)
```

## Common Issues and Solutions

### Recipe Not Showing Up

If your recipe isn't appearing in the crafting menu:

1. Check that you've defined the recipe with the correct tab and tech level
2. Verify that the player has access to the required tech level
3. Ensure any character-specific tags are correct
4. Check for errors in the console

### Ingredients Not Being Recognized

If ingredients aren't being recognized:

1. Make sure the ingredient prefab name is correct
2. Check if you're using the correct ingredient type
3. Verify that the ingredient exists in the game or your mod

### Tech Level Issues

If tech level requirements aren't working correctly:

1. Ensure your custom prototyper correctly defines its tech trees
2. Check that the tech level number doesn't conflict with existing tech levels
3. Verify that the recipe is using the correct tech level constant

## See also

- [Recipe Mod Example](recipe-mod.md) - For a complete mod example focused on recipes
- [Mod Structure](../core/mod-structure.md) - For understanding how mods are organized
- [Builder Component](../components/builder.md) - For the component that handles crafting
- [Prototyper Component](../components/other-components.md) - For crafting stations
