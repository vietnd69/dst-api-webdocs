---
id: crafting
title: Crafting Recipes
sidebar_position: 2
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Crafting Recipes

The crafting recipe system allows players to create items, tools, and structures by combining various ingredients.

## Recipe Definition

Crafting recipes are defined using the `Recipe2` function:

```lua
Recipe2(
    name,               -- String: Recipe name/identifier
    ingredients,        -- Table: List of Ingredient objects
    tech_level,         -- TECH enum: Technology level required
    config              -- Table: Additional configuration
)
```

### Ingredient Definition

Ingredients are defined using the `Ingredient` class:

```lua
Ingredient(
    type,               -- String: Item prefab name or CHARACTER_INGREDIENT enum
    amount,             -- Number: Quantity required
    atlas,              -- String (optional): Custom atlas path
    deconstruct,        -- Boolean (optional): Whether this ingredient is returned on deconstruction
    imageoverride       -- String (optional): Custom image name
)
```

### Configuration Options

The `config` table supports these options:

```lua
{
    placer = "prefab_name",                   -- Placer prefab for buildables
    min_spacing = 3.2,                        -- Minimum spacing between placeable objects
    nounlock = false,                         -- Whether the recipe is unlocked by default
    numtogive = 1,                            -- How many items the recipe produces
    builder_tag = "tag_name",                 -- Character tag required to craft
    atlas = "path/to/atlas.xml",              -- Custom atlas for recipe icon
    image = "image_name.tex",                 -- Custom image for recipe icon
    testfn = function(pt, rot) ... end,       -- Custom placement test function
    product = "result_prefab",                -- Prefab name of crafting result
    build_mode = BUILDMODE.LAND,              -- Build mode (LAND, WATER, etc.)
    build_distance = 1,                       -- Build distance
    no_deconstruction = true,                 -- Whether the recipe can be deconstructed
    station_tag = "tag_name",                 -- Required station tag
    sg_state = "custom_stategraph"            -- Custom stategraph state for crafting
}
```

## Technology Levels

Recipes are locked behind technology levels defined in the `TECH` enum:

- `TECH.NONE` - Available without any science structure
- `TECH.SCIENCE_ONE` - Requires Science Machine
- `TECH.SCIENCE_TWO` - Requires Alchemy Engine
- `TECH.MAGIC_TWO` - Requires Prestihatitator
- `TECH.MAGIC_THREE` - Requires Shadow Manipulator
- `TECH.ANCIENT_TWO` - Requires Ancient Pseudoscience Station
- `TECH.ANCIENT_FOUR` - Requires Ancient Fuelweaver's crafting station

## Character-Specific Recipes

Recipes can be restricted to specific characters using:

1. `builder_tag` - Character-specific tag like "pyromaniac" for Willow
2. `builder_skill` - Skill from character's skill tree

## API Functions

### Adding Recipes

```lua
-- Add a standard crafting recipe
Recipe2("spear", {Ingredient("twigs", 2), Ingredient("flint", 1)}, TECH.NONE)

-- Add a character-specific recipe
Recipe2("lighter", {Ingredient("rope", 1), Ingredient("goldnugget", 1)}, TECH.NONE, {builder_tag="pyromaniac"})
```

### Recipe Testing

```lua
-- Check if a recipe is valid in the current game mode
IsRecipeValidInGameMode(game_mode, recipe_name)

-- Get a valid recipe object by name
GetValidRecipe(recipe_name)

-- Test if a recipe can be crafted
IsRecipeValid(recipe_name)
```

## Deconstruction Recipes

Special recipes for breaking down items:

```lua
DeconstructRecipe(
    "prefab_name",
    {Ingredient("boards", 2), Ingredient("rope", 1)},
    {config_options}
)
``` 
