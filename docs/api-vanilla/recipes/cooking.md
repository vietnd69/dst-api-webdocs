---
id: cooking
title: Cooking Recipes
sidebar_position: 3
last_updated: 2023-07-06
---

# Cooking Recipes

The cooking system allows players to combine ingredients in cooking stations to create food items with various effects.

## Cooking Stations

There are several cooking stations in the game:

- **Crock Pot** - Standard cooking station
- **Portable Crock Pot** - Warly's portable version
- **Portable Seasoning Station** - For applying spices to food
- **Lunar Forge** - For special lunar recipes
- **Shadow Forge** - For special shadow recipes

## Recipe Definition

Cooking recipes are defined as Lua tables with specific properties:

```lua
local recipe = {
    name = "butterflymuffin",                      -- Recipe identifier
    test = function(cooker, names, tags) ... end,  -- Function to test if ingredients match recipe
    priority = 1,                                  -- Priority among matching recipes (higher = preferred)
    weight = 1,                                    -- Weight for random selection
    foodtype = FOODTYPE.VEGGIE,                    -- Food category
    health = TUNING.HEALING_MED,                   -- Health restoration
    hunger = TUNING.CALORIES_LARGE,                -- Hunger restoration
    sanity = TUNING.SANITY_TINY,                   -- Sanity restoration
    perishtime = TUNING.PERISH_SLOW,               -- Spoilage time
    cooktime = 2,                                  -- Time to cook
    temperature = TUNING.HOT_FOOD_BONUS_TEMP,      -- Temperature effect (optional)
    temperatureduration = TUNING.FOOD_TEMP_AVERAGE, -- Duration of temperature effect (optional)
    tags = {"honeyed"},                            -- Special food tags (optional)
    cookbook_category = "farmplants",              -- Category in cookbook (optional)
    card_def = {                                   -- Recipe card definition (optional)
        ingredients = {
            {"butterflywings", 1}, 
            {"carrot", 2}, 
            {"berries", 1}
        }
    }
}
```

## Ingredient System

The cooking system uses a tag-based ingredient system:

```lua
-- Adding ingredient values
AddIngredientValues(
    {"carrot", "corn", "pumpkin"},  -- Ingredient prefab names
    {veggie = 1},                   -- Tags and values
    true                            -- Can be cooked
)
```

Common ingredient tags:

- `meat` - Meat value
- `fish` - Fish value
- `veggie` - Vegetable value
- `fruit` - Fruit value
- `egg` - Egg value
- `sweetener` - Sweetness value
- `monster` - Monster food value
- `inedible` - Non-food items

## Recipe Testing

The `test` function determines if a set of ingredients matches a recipe:

```lua
test = function(cooker, names, tags)
    -- Example: requires butterfly wings, veggie tag >= 0.5, and no meat
    return (names.butterflywings or names.moonbutterflywings) and 
           not tags.meat and 
           tags.veggie and 
           tags.veggie >= 0.5
end
```

## Registration Functions

```lua
-- Add a recipe to a cooking station
AddCookerRecipe("cookpot", recipe, is_mod_food)

-- Add a recipe card for the recipe
AddRecipeCard("cookpot", recipe)
```

## Recipe Cards

Recipe cards are collectible items that teach the player specific cooking recipes. They can be defined in the recipe's `card_def` field:

```lua
card_def = {
    ingredients = {
        {"butterflywings", 1}, 
        {"carrot", 2}, 
        {"berries", 1}
    }
}
```

## API Functions

```lua
-- Get all valid recipes for a set of ingredients
GetCandidateRecipes("cookpot", ingredient_data)

-- Test if a cooking product is from a mod
IsModCookingProduct("cookpot", "butterflymuffin")
```

## Common Cooking Patterns

Most food recipes follow specific patterns:

1. **Meat-based** - At least 0.5 meat value creates meat dishes
2. **Vegetable-based** - At least 0.5 veggie value creates vegetable dishes
3. **Fish-based** - Fish value creates fish dishes
4. **Sweetened** - Adding honey or other sweeteners affects recipes
5. **Monster food** - Using monster meat creates lower quality or special recipes 
