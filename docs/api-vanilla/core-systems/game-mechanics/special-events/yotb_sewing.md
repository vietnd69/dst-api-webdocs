---
id: yotb-sewing
title: YOTB Sewing
description: Year of the Beefalo sewing system for costume recipe calculation and validation
sidebar_position: 4
slug: api-vanilla/core-systems/yotb-sewing
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# YOTB Sewing

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `yotb_sewing` module provides the recipe calculation and validation system for Year of the Beefalo (YOTB) costume sewing. It processes pattern fragment ingredients to determine valid costume recipes based on priority and availability.

## Usage Example

```lua
local yotb_sewing = require("yotb_sewing")

-- Check if a recipe is valid
local ingredients = {"yotb_pattern_fragment_1", "yotb_pattern_fragment_1", "yotb_pattern_fragment_2"}
local is_valid = yotb_sewing.IsRecipeValid(ingredients)
print("Recipe valid:", is_valid) -- true

-- Calculate the best recipe
local result_prefab, sewing_time = yotb_sewing.CalculateRecipe(ingredients)
print("Result:", result_prefab) -- "war_blueprint"
print("Time:", sewing_time) -- 1 (BASE_SEWING_TIME from tuning)
```

## Functions

### IsRecipeValid(names) {#is-recipe-valid}

**Status:** `stable`

**Description:**
Validates whether a given set of ingredient names can produce any valid costume recipe.

**Parameters:**
- `names` (table): Array of ingredient prefab names

**Returns:**
- (boolean): `true` if at least one valid recipe exists, `false` otherwise

**Example:**
```lua
-- Valid WAR costume ingredients
local valid_ingredients = {
    "yotb_pattern_fragment_1",
    "yotb_pattern_fragment_1", 
    "yotb_pattern_fragment_2"
}
local result = yotb_sewing.IsRecipeValid(valid_ingredients) -- true

-- Invalid ingredients (not enough fragments)
local invalid_ingredients = {
    "yotb_pattern_fragment_1"
}
local result = yotb_sewing.IsRecipeValid(invalid_ingredients) -- false
```

### CalculateRecipe(names) {#calculate-recipe}

**Status:** `stable`

**Description:**
Calculates the best costume recipe from a given set of ingredients based on priority ranking. Returns the highest priority valid recipe.

**Parameters:**
- `names` (table): Array of ingredient prefab names

**Returns:**
- (string): Prefab name of the resulting costume blueprint
- (number): Sewing time required for the recipe

**Example:**
```lua
-- Multiple valid recipes (DOLL has higher priority than others)
local ingredients = {
    "yotb_pattern_fragment_2",
    "yotb_pattern_fragment_2",
    "yotb_pattern_fragment_3"
}
local prefab, time = yotb_sewing.CalculateRecipe(ingredients)
print(prefab) -- "doll_blueprint" (priority 2)
print(time) -- 1 (BASE_SEWING_TIME)

-- WAR costume (highest priority when conditions met)
local war_ingredients = {
    "yotb_pattern_fragment_1",
    "yotb_pattern_fragment_1",
    "yotb_pattern_fragment_2"
}
local prefab, time = yotb_sewing.CalculateRecipe(war_ingredients)
print(prefab) -- "war_blueprint" (priority 1)
```

## Internal Functions

### GetIngredientValues(prefablist) {#get-ingredient-values}

**Status:** `stable`

**Description:**
Internal function that processes ingredient list into counted frequency table.

**Parameters:**
- `prefablist` (table): Array of prefab names

**Returns:**
- (table): Table mapping ingredient names to quantities

**Example:**
```lua
-- Internal usage - counts duplicate ingredients
local ingredients = {"yotb_pattern_fragment_1", "yotb_pattern_fragment_1", "yotb_pattern_fragment_2"}
local counts = GetIngredientValues(ingredients)
-- Returns: {
--   ["yotb_pattern_fragment_1"] = 2,
--   ["yotb_pattern_fragment_2"] = 1
-- }
```

### GetCandidateRecipes(ingdata) {#get-candidate-recipes}

**Status:** `stable`

**Description:**
Internal function that finds all valid recipes for given ingredient data and sorts them by priority.

**Parameters:**
- `ingdata` (table): Ingredient frequency table from `GetIngredientValues`

**Returns:**
- (table): Array of valid recipe candidates sorted by priority (highest first)

**Example:**
```lua
-- Internal usage - finds and prioritizes valid recipes
local ingdata = {
    ["yotb_pattern_fragment_1"] = 2,
    ["yotb_pattern_fragment_2"] = 1
}
local candidates = GetCandidateRecipes(ingdata)
-- Returns array with WAR costume (priority 1) as first element
```

## Recipe Priority System

The sewing system uses a priority-based recipe selection when multiple recipes are valid:

### Priority Levels

| Priority | Costumes |
|----------|----------|
| 1 | WAR |
| 2 | DOLL |
| 3 | ROBOT, NATURE, FORMAL, VICTORIAN, ICE, FESTIVE, BEAST |

### Priority Resolution

1. **Find Valid Recipes**: Test all recipes against ingredient requirements
2. **Sort by Priority**: Order valid recipes by priority value (lower number = higher priority)
3. **Select Highest**: Choose the first recipe from the highest priority group
4. **Tie Breaking**: When multiple recipes have the same priority, the first one encountered is selected

**Example:**
```lua
-- These ingredients can make FORMAL (priority 3) and VICTORIAN (priority 3)
local ingredients = {
    "yotb_pattern_fragment_1",
    "yotb_pattern_fragment_2", 
    "yotb_pattern_fragment_2",
    "yotb_pattern_fragment_2",
    "yotb_pattern_fragment_3"
}

-- FORMAL requires: fragment_2 > 2 ✓
-- VICTORIAN requires: fragment_1 ≥ 1 AND fragment_2 ≥ 1 AND fragment_3 ≥ 1 ✓
-- Both have priority 3, so first valid one is selected
```

## Recipe Data

### recipes Table

**Status:** `stable`

The module exposes a `recipes` table containing all costume definitions from the `yotb_costumes` module.

**Structure:**
```lua
local yotb_sewing = require("yotb_sewing")
for i, recipe in ipairs(yotb_sewing.recipes) do
    print("Recipe:", recipe.skin_name)
    print("Prefab:", recipe.prefab_name)
    print("Priority:", recipe.priority)
    print("Time:", recipe.time)
    -- Test function available as recipe.test(ingredients)
end
```

## Integration Example

### Complete Sewing Workflow

```lua
local yotb_sewing = require("yotb_sewing")

-- Player has collected various pattern fragments
local player_inventory = {
    "yotb_pattern_fragment_1",
    "yotb_pattern_fragment_1",
    "yotb_pattern_fragment_2",
    "yotb_pattern_fragment_3"
}

-- Check if any costume can be made
if yotb_sewing.IsRecipeValid(player_inventory) then
    -- Calculate the best recipe
    local costume_prefab, sewing_time = yotb_sewing.CalculateRecipe(player_inventory)
    
    print("Can create:", costume_prefab)
    print("Sewing time:", sewing_time)
    
    -- This would trigger the actual sewing process
    -- SpawnPrefab(costume_prefab)
else
    print("No valid costume recipes available")
end
```

### Recipe Testing

```lua
local yotb_sewing = require("yotb_sewing")

-- Test specific ingredient combinations
local test_cases = {
    -- WAR costume test
    {
        ingredients = {"yotb_pattern_fragment_1", "yotb_pattern_fragment_1", "yotb_pattern_fragment_2"},
        expected = "war_blueprint"
    },
    -- DOLL costume test  
    {
        ingredients = {"yotb_pattern_fragment_2", "yotb_pattern_fragment_2", "yotb_pattern_fragment_3"},
        expected = "doll_blueprint"
    },
    -- Invalid recipe test
    {
        ingredients = {"yotb_pattern_fragment_1"},
        expected = nil
    }
}

for _, test in ipairs(test_cases) do
    local is_valid = yotb_sewing.IsRecipeValid(test.ingredients)
    if is_valid then
        local result, time = yotb_sewing.CalculateRecipe(test.ingredients)
        print("Test result:", result, "Expected:", test.expected)
    else
        print("Invalid recipe as expected")
    end
end
```

## Error Handling

The sewing system handles edge cases gracefully:

### Empty Ingredients
```lua
local result = yotb_sewing.IsRecipeValid({}) -- false
local prefab, time = yotb_sewing.CalculateRecipe({}) -- nil, nil
```

### Invalid Ingredients
```lua
local invalid = {"invalid_item", "another_invalid_item"}
local result = yotb_sewing.IsRecipeValid(invalid) -- false
```

### Insufficient Quantities
```lua
local insufficient = {"yotb_pattern_fragment_1"} -- Need at least 2 for most recipes
local result = yotb_sewing.IsRecipeValid(insufficient) -- false
```

## Dependencies

### Required Modules

- `tuning`: Provides `TUNING.BASE_SEWING_TIME` constant
- `yotb_costumes`: Provides costume definitions and test functions

### Module Loading
```lua
require "tuning"
local set_data = require("yotb_costumes")
```

## Related Modules

- [YOTB Costumes](./yotb_costumes.md): Provides costume definitions and requirements
- [Tuning](./tuning.md): Provides sewing time constants
- [Beefalo Clothing](./beefalo_clothing.md): Related beefalo customization system
