---
id: cooking
title: "Cooking"
description: "Cooking system for ingredient processing and recipe management in Don't Starve Together"
sidebar_position: 1
slug: /api-vanilla/core-systems/cooking
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Cooking 🟢

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current stable implementation with mod integration |

## Overview

The cooking system manages ingredient processing, recipe calculation, and prepared food creation in Don't Starve Together. It provides the foundation for all cooking mechanics including crock pots, spice stations, and custom cooking devices.

## Overview

The cooking module provides:
- **Ingredient System**: Tag-based classification of cooking ingredients
- **Recipe Management**: Dynamic recipe calculation and validation
- **Cooker Support**: Multiple cooking device types with shared logic
- **Cookbook Integration**: Recipe display and categorization
- **Mod Support**: Extensible framework for custom recipes and ingredients

## Functions

### AddCookerRecipe(cooker, recipe, is_mod_food) {#add-cooker-recipe}

**Status:** `stable`

**Description:**
Registers a recipe for a specific cooking device type.

**Parameters:**
- `cooker` - Cooker type identifier (`"cookpot"`, `"portablecookpot"`, `"portablespicer"`, etc.)
- `recipe` - Recipe definition table
- `is_mod_food` - Boolean indicating if this is a mod-added recipe

**Usage:**
```lua
-- Register a recipe for cook pots
local my_recipe = {
    name = "meatballs",
    test = function(cooker, names, tags)
        return tags.meat and not tags.inedible
    end,
    priority = -1,
    weight = 1,
    cooktime = 1,
}

AddCookerRecipe("cookpot", my_recipe)

-- Register for multiple cooker types
AddCookerRecipe("cookpot", my_recipe)
AddCookerRecipe("portablecookpot", my_recipe)
AddCookerRecipe("archive_cookpot", my_recipe)
```

### AddIngredientValues(names, tags, cancook, candry) {#add-ingredient-values}

**Status:** `stable`

**Description:**
Defines cooking properties for ingredient items.

**Parameters:**
- `names` - Array of prefab names to assign values
- `tags` - Table of tag-value pairs for cooking classification
- `cancook` - Whether to create cooked variants with same values
- `candry` - Whether to create dried variants with same values

**Usage:**
```lua
-- Add vegetable properties
AddIngredientValues(
    {"carrot", "corn", "pumpkin"},
    {veggie = 1},
    true,  -- Create cooked versions
    false  -- Don't create dried versions
)

-- Add meat with multiple tags
AddIngredientValues(
    {"monstermeat"},
    {meat = 1, monster = 1},
    true,  -- Create monstermeat_cooked
    true   -- Create monstermeat_dried
)

-- Add complex ingredient
AddIngredientValues(
    {"fishmeat"},
    {meat = 1, fish = 1},
    true
)
```

### CalculateRecipe(cooker, names) {#calculate-recipe}

**Status:** `stable`

**Description:**
Determines which recipe to produce from given ingredients.

**Parameters:**
- `cooker` - Cooker type identifier
- `names` - Array of ingredient prefab names

**Returns:**
- `recipe_name` - Name of the recipe to produce
- `cooktime` - Cooking time multiplier

**Usage:**
```lua
-- Calculate recipe from ingredients
local recipe_name, cooktime = CalculateRecipe("cookpot", 
    {"meat", "meat", "berries", "twigs"})
-- Returns: "meatballs", 1
```

### IsCookingIngredient(prefabname) {#is-cooking-ingredient}

**Status:** `stable`

**Description:**
Checks if an item can be used in cooking.

**Parameters:**
- `prefabname` - Item prefab name to check

**Returns:**
- Boolean indicating if item is a valid cooking ingredient

**Usage:**
```lua
if IsCookingIngredient("meat") then
    print("Meat can be used in cooking")
end

if IsCookingIngredient("log") then
    print("This won't print - logs aren't ingredients")
end
```

### GetCandidateRecipes(cooker, ingdata) {#get-candidate-recipes}

**Status:** `stable`

**Description:**
Finds and prioritizes all recipes that match the given ingredients.

**Parameters:**
- `cooker` (string): Cooker type identifier
- `ingdata` (table): Processed ingredient data with names and tags

**Returns:**
- (table): Array of recipe candidates sorted by priority

**Usage:**
```lua
local ingdata = GetIngredientValues({"meat", "meat", "berries", "twigs"})
local candidates = GetCandidateRecipes("cookpot", ingdata)
for _, recipe in ipairs(candidates) do
    print("Recipe:", recipe.name, "Priority:", recipe.priority or 0)
end
```

### IsModCookingProduct(cooker, name) {#is-mod-cooking-product}

**Status:** `stable`

**Description:**
Checks if a recipe name is provided by an enabled mod for a specific cooker type.

**Parameters:**
- `cooker` (string): Cooker type identifier
- `name` (string): Recipe name to check

**Returns:**
- (boolean): True if recipe is from an enabled mod

### HasModCookerFood() {#has-mod-cooker-food}

**Status:** `stable`

**Description:**
Checks if any mod-added recipes are currently available in the cookbook.

**Returns:**
- (boolean): True if mod recipes exist in cookbook

### IsModCookerFood(prefab) {#is-mod-cooker-food}

**Status:** `stable`

**Description:**
Determines if a food item is from a mod rather than the base game.

**Parameters:**
- `prefab` (string): Food prefab name

**Returns:**
- (boolean): True if food is mod-added

### AddRecipeCard(cooker, recipe) {#add-recipe-card}

**Status:** `stable`

**Description:**
Registers a recipe card for cookbook display. Used internally when recipes have card_def defined.

**Parameters:**
- `cooker` (string): Cooker type identifier
- `recipe` (table): Recipe definition with card_def

**Usage:**
```lua
-- Automatically called for recipes with card_def
local recipe = {
    name = "meatballs",
    card_def = {
        ingredients = {{"meat", 2}, {"berries", 1}}
    },
    -- ... other properties
}
AddCookerRecipe("cookpot", recipe)
-- AddRecipeCard is called automatically if card_def exists
```

## Ingredient Tag System

### Available Tags

The cooking system uses these ingredient tags for recipe matching:

| Tag | Description | Example Items |
|-----|-------------|---------------|
| `meat` | Meat value | meat, monstermeat, fishmeat |
| `fish` | Fish value | fish, eel, oceanfish variants |
| `veggie` | Vegetable value | carrot, corn, mushrooms |
| `fruit` | Fruit value | berries, dragonfruit, pomegranate |
| `egg` | Egg value | egg, tallbirdegg, bird_egg |
| `sweetener` | Sweetener value | honey, honeycomb, royal_jelly |
| `dairy` | Dairy value | butter, goatmilk, milkywhites |
| `fat` | Fat value | butter (combined with dairy) |
| `decoration` | Decoration value | butterflywings, refined_dust |
| `inedible` | Inedible value | twigs, lightninggoathorn |
| `frozen` | Frozen value | ice |
| `seed` | Seed value | acorn |
| `magic` | Magic value | mandrake, nightmarefuel |
| `monster` | Monster value | monstermeat, durian |

### Special Tags

Processed ingredients gain additional tags:

```lua
-- Cooked variants get "precook" tag
ingredients["meat_cooked"].tags.precook = 1

-- Dried variants get "dried" tag  
ingredients["meat_dried"].tags.dried = 1
```

## Recipe Definition Structure

Recipes are defined as tables with specific properties:

```lua
local recipe = {
    name = "recipe_name",
    
    -- Test function determines if ingredients match
    test = function(cooker, names, tags)
        -- names: table of ingredient prefab names and counts
        -- tags: table of tag totals from all ingredients
        return boolean
    end,
    
    -- Recipe selection priority (higher = tested first)
    priority = 0,
    
    -- Weight for random selection among same priority
    weight = 1,
    
    -- Cooking time multiplier
    cooktime = 1,
    
    -- Optional cookbook category
    cookbook_category = "main",
    
    -- Cookbook card definition
    card_def = {
        ingredients = {
            {"ingredient1", quantity},
            {"ingredient2", quantity},
        }
    },
    
    -- Exclude from cookbook
    no_cookbook = false,
}
```

## Cooker Types

### Standard Cook Pots

**Supported Cookers:** `cookpot`, `portablecookpot`, `archive_cookpot`

These share the same recipe pool from `preparedfoods.lua`:

```lua
-- Recipes are added to all standard cook pot types
local foods = require("preparedfoods")
for k, recipe in pairs(foods) do
    AddCookerRecipe("cookpot", recipe)
    AddCookerRecipe("portablecookpot", recipe)
    AddCookerRecipe("archive_cookpot", recipe)
end
```

### Portable Cook Pot (Warly Exclusive)

**Cooker:** `portablecookpot`

Gets additional exclusive recipes from `preparedfoods_warly.lua`:

```lua
-- Warly's special recipes
local portable_foods = require("preparedfoods_warly")
for k, recipe in pairs(portable_foods) do
    AddCookerRecipe("portablecookpot", recipe)
end
```

### Portable Spicer

**Cooker:** `portablespicer`

Uses spice recipes from `spicedfoods.lua`:

```lua
-- Spice recipes for enhancing prepared foods
local spicedfoods = require("spicedfoods")
for k, recipe in pairs(spicedfoods) do
    AddCookerRecipe("portablespicer", recipe)
end
```

## Recipe Selection Algorithm

The cooking system follows this priority order for recipe selection:

1. **Collect Ingredients**: Process ingredient list into name counts and tag totals
2. **Test Recipes**: Run each recipe's test function against ingredients
3. **Filter by Priority**: Group recipes by priority level (higher first)
4. **Weighted Selection**: Among same priority, randomly select based on weight

```lua
function GetCandidateRecipes(cooker, ingdata)
    local recipes = cookerrecipes[cooker] or {}
    local candidates = {}

    -- Find all potentially valid recipes
    for k, v in pairs(recipes) do
        if v.test(cooker, ingdata.names, ingdata.tags) then
            table.insert(candidates, v)
        end
    end

    -- Sort by priority (highest first)
    table.sort(candidates, function(a, b) 
        return (a.priority or 0) > (b.priority or 0) 
    end)
    
    return candidates
end
```

## Example Recipe Tests

### Basic Meat Recipe
```lua
-- Meatballs - fallback meat recipe
meatballs = {
    name = "meatballs",
    test = function(cooker, names, tags)
        return tags.meat and not tags.inedible
    end,
    priority = -1, -- Low priority fallback
    weight = 1,
    cooktime = 1,
}
```

### Complex Requirements
```lua
-- Honey Ham - requires specific amounts
honeyed_ham = {
    name = "honeyed_ham",
    test = function(cooker, names, tags)
        return names.honey and tags.meat and tags.meat >= 2 and not tags.inedible
    end,
    priority = 2,
    weight = 1,
    cooktime = 1,
}
```

### Ingredient-Specific Recipe
```lua
-- Dragonpie - requires specific fruit, excludes meat
dragonpie = {
    name = "dragonpie", 
    test = function(cooker, names, tags)
        return (names.dragonfruit or names.dragonfruit_cooked) and not tags.meat
    end,
    priority = 1,
    weight = 1,
    cooktime = 1,
}
```

## Ingredient Examples

### Fruits
```lua
-- Standard fruits
local fruits = {"pomegranate", "dragonfruit", "cave_banana"}
AddIngredientValues(fruits, {fruit = 1}, true)

-- Berries (half fruit value)
AddIngredientValues({"berries"}, {fruit = 0.5}, true)
AddIngredientValues({"berries_juicy"}, {fruit = 0.5}, true)

-- Monster fruit
AddIngredientValues({"durian"}, {fruit = 1, monster = 1}, true)
```

### Vegetables
```lua
-- Standard vegetables  
local veggies = {"carrot", "corn", "pumpkin", "eggplant", "onion", "garlic"}
AddIngredientValues(veggies, {veggie = 1}, true)

-- Mushrooms (half veggie value)
local mushrooms = {"red_cap", "green_cap", "blue_cap", "moon_cap"}
AddIngredientValues(mushrooms, {veggie = 0.5}, true)

-- Special vegetables
AddIngredientValues({"mandrake"}, {veggie = 1, magic = 1}, true)
AddIngredientValues({"kelp"}, {veggie = 0.5}, true, true)
```

### Meats
```lua
-- Standard meat
AddIngredientValues({"meat"}, {meat = 1}, true, true)

-- Monster meat
AddIngredientValues({"monstermeat"}, {meat = 1, monster = 1}, true, true)

-- Small meats
AddIngredientValues({"smallmeat", "batnose"}, {meat = 0.5}, true, true)
AddIngredientValues({"froglegs", "drumstick", "batwing"}, {meat = 0.5}, true)

-- Fish meats
AddIngredientValues({"fish"}, {meat = 1, fish = 1}, true)
AddIngredientValues({"eel"}, {meat = 0.5, fish = 1}, true)
```

### Ocean Fish Integration
```lua
-- Ocean fish use dynamic ingredient values
local oceanfishdefs = require("prefabs/oceanfishdef")
for _, fish_def in pairs(oceanfishdefs.fish) do
    if fish_def.cooker_ingredient_value ~= nil then
        AddIngredientValues({fish_def.prefab.."_inv"}, 
                          fish_def.cooker_ingredient_value, false)
    end
end
```

## Cookbook System

### Recipe Categories

Recipes are organized into cookbook categories:

```lua
-- Official recipes get default category
if not is_mod_food then
    official_foods[recipe.name] = true
    recipe.cookbook_atlas = "images/cookbook_"..recipe.name..".xml"
end

-- Mod recipes get special category
if is_mod_food then
    recipe.cookbook_category = MOD_COOKBOOK_CATEGORY
end
```

### Recipe Cards

Cookbook entries require card definitions:

```lua
-- Add recipe card for cookbook display
function AddRecipeCard(cooker, recipe)
    table.insert(recipe_cards, {
        recipe_name = recipe.name, 
        cooker_name = cooker
    })
end

-- Recipe must define card_def for cookbook
recipe.card_def = {
    ingredients = {
        {"meat", 2},
        {"honey", 1},
        {"berries", 1},
    }
}
```

## Mod Integration

### Adding Custom Recipes

```lua
-- Define custom recipe
local my_recipe = {
    name = "my_custom_food",
    test = function(cooker, names, tags)
        return tags.meat >= 2 and tags.veggie >= 1 and not tags.monster
    end,
    priority = 5,
    weight = 1,
    cooktime = 2,
    card_def = {
        ingredients = {{"meat", 2}, {"carrot", 1}}
    }
}

-- Register as mod food
AddCookerRecipe("cookpot", my_recipe, true)
```

### Adding Custom Ingredients

```lua
-- Add new ingredient type
AddIngredientValues({"my_custom_ingredient"}, {
    veggie = 1,
    magic = 0.5,
    decoration = 1
}, true, false)
```

### Mod Detection

The system tracks mod-added content:

```lua
-- Check if recipe is from mod
local function IsModCookerFood(prefab)
    return not official_foods[prefab]
end

-- Check if any mod foods exist
local function HasModCookerFood()
    return cookbook_recipes[MOD_COOKBOOK_CATEGORY] ~= nil
end
```

## Advanced Features

### Ingredient Aliases

The system supports ingredient name aliases:

```lua
local aliases = {
    cookedsmallmeat = "smallmeat_cooked",
    cookedmonstermeat = "monstermeat_cooked", 
    cookedmeat = "meat_cooked",
}
```

### Dynamic Recipe Testing

Recipe tests receive full ingredient context:

```lua
function(cooker, names, tags)
    -- names: {meat = 2, berries = 1, twigs = 1}
    -- tags: {meat = 2, fruit = 0.5, inedible = 1}
    
    -- Check specific ingredients
    if names.honey then
        return tags.meat >= 2
    end
    
    -- Check tag totals
    if tags.veggie and tags.veggie >= 3 then
        return not tags.meat
    end
    
    return false
end
```

## Integration Examples

### Container Integration

The cooking system works with container validation:

```lua
-- In containers.lua
function params.cookpot.itemtestfn(container, item, slot)
    return cooking.IsCookingIngredient(item.prefab) and not container.inst:HasTag("burnt")
end
```

### Prefab Integration

Cooking recipes define the products created:

```lua
-- Recipe references prefab name
local recipe = {
    name = "meatballs", -- Must match prefab name
    -- ... other properties
}

-- Prefab must exist in prefabs/meatballs.lua
```

## Constants

### MOD_COOKBOOK_CATEGORY

**Value:** `"mod"`

**Status:** `stable`

**Description:** Category identifier for mod-added recipes in the cookbook system.

### Official Foods Table

**Description:** Internal table tracking official (non-mod) food recipes for cookbook categorization and online synchronization.

## Module Exports

The cooking module returns a table with the following API:

```lua
return {
    CalculateRecipe = CalculateRecipe,
    IsCookingIngredient = IsCookingIngredient,
    recipes = cookerrecipes,
    ingredients = ingredients,
    GetRecipe = GetRecipe,
    cookbook_recipes = cookbook_recipes,
    recipe_cards = recipe_cards,
    HasModCookerFood = HasModCookerFood,
    IsModCookerFood = IsModCookerFood
}
```

### Exported Properties

| Property | Type | Description |
|----------|------|-------------|
| `recipes` | table | All cooker recipe tables indexed by cooker type |
| `ingredients` | table | All ingredient definitions with tags and properties |
| `cookbook_recipes` | table | Cookbook-visible recipes organized by category |
| `recipe_cards` | table | Recipe card definitions for cookbook display |

## Related Modules

- **[Containers](./containers.md)** - Cooking container configurations
- **[Prefabs](./prefabs.md)** - Prepared food prefab definitions
- **[Components](./components/)** - Cookable and stewer components
- **[Tuning](./tuning.md)** - Cooking time and spoilage constants

## Technical Notes

- Core cooking functions provide stable API across game updates
- Recipe priority system prevents conflicts with base game recipes
- Extensive mod support through ingredient and recipe registration
- Recipe calculation optimized for real-time cooking decisions
- Ingredient aliases handle naming convention inconsistencies
- Ocean fish integration uses dynamic ingredient value system

---

*This documentation covers the Cooking module as of build 676042. The cooking system provides comprehensive ingredient processing and recipe management for all cooking mechanics.*
