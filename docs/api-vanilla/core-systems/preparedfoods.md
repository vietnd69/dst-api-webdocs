---
id: preparedfoods
title: Prepared Foods
description: Standard cookpot recipes system defining all craftable food items in DST
sidebar_position: 37
slug: api-vanilla/core-systems/preparedfoods
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Prepared Foods

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `preparedfoods.lua` module defines all standard recipes that can be crafted in regular cookpots throughout Don't Starve Together. This comprehensive system includes over 60 unique recipes ranging from basic sustenance to specialized dishes with unique effects, temperature modifications, and nutritional benefits.

## Module Structure

The module exports a table of food definitions where each recipe includes test conditions, nutritional values, cooking parameters, and optional special effects:

```lua
local foods = {
    [recipe_name] = {
        test = function(cooker, names, tags) -- Ingredient requirements
        priority = number, -- Recipe selection priority
        foodtype = FOODTYPE, -- Primary food classification
        health = number, -- Health restoration value
        hunger = number, -- Hunger restoration value
        sanity = number, -- Sanity change value
        perishtime = number, -- Spoilage duration
        cooktime = number, -- Cooking time required
        -- Optional special properties...
    }
}
```

## Recipe Categories

### Basic Sustenance Recipes

#### meatballs {#meatballs}

**Status:** `stable`

**Description:** Basic meat dish with minimal ingredient requirements.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return tags.meat and not tags.inedible
end
```

**Properties:**
- Priority: `-1` (fallback recipe)
- Health: `TUNING.HEALING_SMALL`
- Hunger: `TUNING.CALORIES_SMALL * 5`
- Pot Level: `high`

#### ratatouille {#ratatouille}

**Status:** `stable`

**Description:** Basic vegetable dish for vegetarian sustenance.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return not tags.meat and tags.veggie and tags.veggie >= 0.5 and not tags.inedible
end
```

**Properties:**
- Priority: `0`
- Foodtype: `FOODTYPE.VEGGIE`

### Specialty Meat Dishes

#### honeyham {#honey-ham}

**Status:** `stable`

**Description:** Premium meat dish with honey enhancement.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return names.honey and tags.meat and tags.meat > 1.5 and not tags.inedible
end
```

**Properties:**
- Health: `TUNING.HEALING_MEDLARGE`
- Hunger: `TUNING.CALORIES_HUGE`
- Temperature: `TUNING.HOT_FOOD_BONUS_TEMP`
- Temperature Duration: `TUNING.FOOD_TEMP_AVERAGE`
- Tags: `honeyed`

#### surfnturf {#surf-n-turf}

**Status:** `stable`

**Description:** Luxury dish combining meat and fish for maximum benefits.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return tags.meat and tags.meat >= 2.5 
           and tags.fish and tags.fish >= 1.5 
           and not tags.frozen
end
```

**Properties:**
- Priority: `30`
- Health: `TUNING.HEALING_HUGE`
- Hunger: `TUNING.CALORIES_LARGE`
- Sanity: `TUNING.SANITY_LARGE`
- Pot Level: `high`

### Desserts and Treats

#### icecream {#ice-cream}

**Status:** `stable`

**Description:** Frozen dessert providing significant sanity restoration and cooling.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return tags.frozen and tags.dairy and tags.sweetener 
           and not tags.meat and not tags.veggie and not tags.inedible and not tags.egg
end
```

**Properties:**
- Foodtype: `FOODTYPE.GOODIES`
- Sanity: `TUNING.SANITY_HUGE`
- Temperature: `TUNING.COLD_FOOD_BONUS_TEMP`
- Temperature Duration: `TUNING.FOOD_TEMP_LONG`
- Perish Time: `TUNING.PERISH_SUPERFAST`

#### jellybean {#jellybean}

**Status:** `stable`

**Description:** Special confection providing health regeneration over time.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return names.royal_jelly and not tags.inedible and not tags.monster
end
```

**Special Properties:**
- Non-perishable (`perishtime = nil`)
- Stackable (`stacksize = 3`)
- Health regeneration buff via `oneatenfn`
- Tags: `honeyed`

### Unique Effect Recipes

#### mandrakesoup {#mandrake-soup}

**Status:** `stable`

**Description:** Powerful soup made from mandrake with exceptional restorative properties.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return names.mandrake
end
```

**Properties:**
- Priority: `10`
- Health: `TUNING.HEALING_SUPERHUGE`
- Hunger: `TUNING.CALORIES_SUPERHUGE`
- Perish Time: `TUNING.PERISH_FAST`

#### shroomcake {#shroom-cake}

**Status:** `stable`

**Description:** Magical cake that provides sleep resistance and immunity.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return names.moon_cap and names.red_cap and names.blue_cap and names.green_cap
end
```

**Special Effects:**
- Resets grogginess
- Applies sleep resistance and immunity buffs
- Requires all four mushroom cap types

### Monster Food

#### monsterlasagna {#monster-lasagna}

**Status:** `stable`

**Description:** Unappetizing dish made primarily from monster meat.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return tags.monster and tags.monster >= 2 and not tags.inedible
end
```

**Properties:**
- Health: `-TUNING.HEALING_MED` (negative)
- Sanity: `-TUNING.SANITY_MEDLARGE` (negative)
- Foodtype: `FOODTYPE.MEAT`
- Secondary Foodtype: `FOODTYPE.MONSTER`
- Tags: `monstermeat`

### Special Utility Foods

#### powcake {#pow-cake}

**Status:** `stable`

**Description:** Long-lasting emergency ration with poor taste but infinite shelf life.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return names.twigs and names.honey 
           and (names.corn or names.corn_cooked or names.oceanfish_small_5_inv or names.oceanfish_medium_5_inv)
end
```

**Properties:**
- Health: `-TUNING.HEALING_SMALL` (negative)
- Hunger: `0`
- Perish Time: `9000000` (effectively infinite)
- Tags: `honeyed`, `donotautopick`

### Beefalo Feed

#### beefalofeed {#beefalo-feed}

**Status:** `stable`

**Description:** Basic feed suitable for beefalo consumption.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return tags.inedible and not tags.monster and not tags.meat 
           and not tags.fish and not tags.egg and not tags.fat 
           and not tags.dairy and not tags.magic
end
```

**Properties:**
- Priority: `-5`
- Foodtype: `FOODTYPE.ROUGHAGE`
- Secondary Foodtype: `FOODTYPE.WOOD`
- Special cookbook behavior for beefalo

#### beefalotreat {#beefalo-treat}

**Status:** `stable`

**Description:** Premium beefalo feed with enhanced nutrition.

**Properties:**
- Priority: `-4`
- Health: `TUNING.HEALING_MOREHUGE`
- Pot Level: `high`

## Recipe Properties System

### Standard Properties

All recipes include these fundamental properties:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | string | key | Recipe identifier |
| `weight` | number | 1 | Recipe weight for selection |
| `priority` | number | 0 | Selection priority (higher wins) |
| `cookbook_category` | string | "cookpot" | Recipe book categorization |

### Nutritional Properties

| Property | Type | Description |
|----------|------|-------------|
| `health` | number | Health points restored (can be negative) |
| `hunger` | number | Hunger points restored |
| `sanity` | number | Sanity points changed (can be negative) |
| `perishtime` | number | Time before spoilage (nil = non-perishable) |

### Cooking Properties

| Property | Type | Description |
|----------|------|-------------|
| `cooktime` | number | Time required to cook |
| `potlevel` | string | Required pot upgrade level |
| `overridebuild` | string | Custom visual appearance |

### Special Effect Properties

| Property | Type | Description |
|----------|------|-------------|
| `temperature` | number | Temperature change applied to eater |
| `temperatureduration` | number | Duration of temperature effect |
| `oneatenfn` | function | Custom function executed when consumed |
| `prefabs` | table | Required prefabs for special effects |
| `oneat_desc` | string | Description of eating effects |

## Food Type Classifications

### Primary Food Types

- `FOODTYPE.MEAT`: Meat-based dishes
- `FOODTYPE.VEGGIE`: Vegetarian dishes
- `FOODTYPE.GOODIES`: Desserts and treats
- `FOODTYPE.ROUGHAGE`: Animal feed

### Secondary Food Types

- `FOODTYPE.MONSTER`: Monster meat content
- `FOODTYPE.WOOD`: Woody content for animals
- `FOODTYPE.ELEMENTAL`: Special elemental foods

## Recipe Testing System

### Ingredient Matching

The recipe system uses test functions to match ingredients:

```lua
test = function(cooker, names, tags)
    -- Check for specific named ingredients
    if names.specific_ingredient then
        -- Specific ingredient check
    end
    
    -- Check ingredient tag totals
    if tags.category and tags.category >= minimum then
        -- Category requirement met
    end
    
    -- Check exclusions
    if not tags.unwanted or tags.unwanted < maximum then
        -- Unwanted ingredients within limits
    end
    
    return all_conditions_met
end
```

### Priority Resolution

When multiple recipes match the same ingredients:
1. Higher priority numbers take precedence
2. Equal priorities may result in random selection
3. Negative priorities serve as fallback options

### Common Ingredient Tags

| Tag | Description | Examples |
|-----|-------------|----------|
| `meat` | Meat content value | Raw meat, cooked meat |
| `veggie` | Vegetable content value | Carrots, potatoes |
| `fruit` | Fruit content value | Berries, dragon fruit |
| `fish` | Fish content value | Fish meat, eels |
| `egg` | Egg content value | Bird eggs, tall bird eggs |
| `dairy` | Dairy content value | Butter, milk |
| `sweetener` | Sweetening content | Honey, royal jelly |
| `frozen` | Frozen content value | Ice, frozen foods |
| `inedible` | Inedible content value | Twigs, stones |
| `monster` | Monster content value | Monster meat |

## Special Effects Implementation

### Temperature Effects

Many recipes provide temporary temperature modifications:

```lua
-- Hot food example
temperature = TUNING.HOT_FOOD_BONUS_TEMP,
temperatureduration = TUNING.FOOD_TEMP_LONG,

-- Cold food example
temperature = TUNING.COLD_FOOD_BONUS_TEMP,
temperatureduration = TUNING.FOOD_TEMP_AVERAGE,
```

### Buff Application

Some recipes apply temporary character buffs:

```lua
oneatenfn = function(inst, eater)
    eater:AddDebuff("buff_name", "buff_name")
end,
prefabs = { "buff_prefab_name" },
```

### Stat Manipulation

Advanced recipes can directly modify character statistics:

```lua
oneatenfn = function(inst, eater)
    if eater.components.sanity ~= nil then
        eater.components.sanity:DoDelta(amount)
    end
end
```

## Visual Customization

### Override Builds

Some recipes use custom visual appearances:

```lua
overridebuild = "cook_pot_food2", -- Custom food appearance
```

### Floating Parameters

Animation parameters for food items:

```lua
floater = {"size", y_offset, scale}, -- Animation configuration
```

## Recipe Integration Examples

### Creating a New Recipe

```lua
local new_recipe = {
    test = function(cooker, names, tags)
        return names.custom_ingredient and tags.meat >= 1
    end,
    priority = 15,
    foodtype = FOODTYPE.MEAT,
    health = TUNING.HEALING_MED,
    hunger = TUNING.CALORIES_LARGE,
    sanity = TUNING.SANITY_SMALL,
    perishtime = TUNING.PERISH_MED,
    cooktime = 1.0,
    potlevel = "high"
}
```

### Testing Recipe Matches

```lua
-- Simulate ingredient collection
local test_ingredients = {
    names = {meat = 2, berries = 1, honey = 1},
    tags = {meat = 2, fruit = 1, sweetener = 1}
}

-- Test against honeyham recipe
if foods.honeyham.test(nil, test_ingredients.names, test_ingredients.tags) then
    print("Can make honey ham!")
end
```

## Related Modules

- [`preparedfoods_warly`](./preparedfoods-warly.md): Warly-specific portable cookpot recipes
- [`preparednonfoods`](./preparednonfoods.md): Non-food cookpot recipes
- [`cooking`](./cooking.md): Core cooking system mechanics
- [`components/cookpot`](../components/cookpot.md): Cookpot component implementation
- [`tuning`](./constants.md): Game balance constants and values

## Notes

- Recipe priority determines selection when multiple recipes match
- All recipes are categorized as "cookpot" for the standard cookbook
- Temperature effects provide gameplay benefits beyond nutrition
- Special effect recipes often require rare ingredients as balance mechanisms
- The `donotautopick` tag prevents certain recipes from being auto-selected
- Monster food provides high hunger but negative health/sanity as a trade-off
- Some recipes have stacksize limitations for balance purposes
