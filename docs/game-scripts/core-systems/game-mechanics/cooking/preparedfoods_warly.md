---
id: preparedfoods-warly
title: Prepared Foods - Warly
description: Warly-specific portable cookpot recipes with unique effects and enhanced culinary options
sidebar_position: 4

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Prepared Foods - Warly

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `preparedfoods_warly.lua` module defines Warly-specific recipes that can only be crafted in his portable cookpot. These recipes offer unique effects and enhanced nutritional benefits compared to standard recipes, reflecting Warly's culinary expertise and mastery of advanced cooking techniques.

## Module Structure

The module exports a table of food definitions where each recipe includes test conditions, nutritional values, special effects, and cooking parameters specific to Warly's portable cookpot system.

```lua
local foods = {
    [recipe_name] = {
        test = function(cooker, names, tags) -- Recipe requirements
        priority = number, -- Recipe priority
        foodtype = FOODTYPE, -- Food classification
        health = number, -- Health restoration
        hunger = number, -- Hunger restoration
        sanity = number, -- Sanity change
        perishtime = number, -- Spoilage time
        cooktime = number, -- Cooking duration
        oneatenfn = function(inst, eater) -- Special effects
        -- Additional properties...
    }
}
```

## Special Effect Recipes

### nightmarepie {#nightmare-pie}

**Status:** `stable`

**Description:** A dark culinary creation that swaps the eater's health and sanity percentages.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return names.nightmarefuel and names.nightmarefuel == 2 
           and (names.potato or names.potato_cooked) 
           and (names.onion or names.onion_cooked)
end
```

**Nutritional Values:**
- Health: `TUNING.HEALING_TINY`
- Hunger: `TUNING.CALORIES_MED`
- Sanity: `TUNING.SANITY_TINY`
- Perish Time: `TUNING.PERISH_MED`

**Special Effect:** Swaps eater's current health and sanity percentages
**Tags:** `masterfood`, `unsafefood`

### voltgoatjelly {#volt-goat-jelly}

**Status:** `stable`

**Description:** Electrified jelly that grants the eater electric attack capabilities.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return names.lightninggoathorn 
           and tags.sweetener and tags.sweetener >= 2 
           and not tags.meat
end
```

**Nutritional Values:**
- Health: `TUNING.HEALING_SMALL`
- Hunger: `TUNING.CALORIES_LARGE`
- Sanity: `TUNING.SANITY_SMALL`
- Perish Time: `TUNING.PERISH_MED`

**Special Effect:** Applies `buff_electricattack` debuff for electric melee attacks
**Pot Level:** `high`

### glowberrymousse {#glow-berry-mousse}

**Status:** `stable`

**Description:** Luminous mousse that provides a light source for the eater.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return (names.wormlight or (names.wormlight_lesser and names.wormlight_lesser >= 2))
           and tags.fruit and tags.fruit >= 2 
           and not tags.meat and not tags.inedible
end
```

**Nutritional Values:**
- Health: `TUNING.HEALING_SMALL`
- Hunger: `TUNING.CALORIES_LARGE`
- Sanity: `TUNING.SANITY_SMALL`
- Perish Time: `TUNING.PERISH_FASTISH`

**Special Effect:** Spawns `wormlight_light_greater` for enhanced illumination
**Pot Level:** `low`

## Buff-Providing Recipes

### frogfishbowl {#frog-fish-bowl}

**Status:** `stable`

**Description:** Amphibious dish that provides moisture immunity.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return ((names.froglegs and names.froglegs >= 2) 
            or (names.froglegs_cooked and names.froglegs_cooked >= 2)
            or (names.froglegs and names.froglegs_cooked))
           and tags.fish and tags.fish >= 1 
           and not tags.inedible
end
```

**Special Effect:** Applies `buff_moistureimmunity` debuff
**Pot Level:** `low`

### dragonchilisalad {#dragon-chili-salad}

**Status:** `stable`

**Description:** Spicy salad that provides warming temperature effect.

**Properties:**
- **Temperature:** `TUNING.HOT_FOOD_BONUS_TEMP`
- **Temperature Duration:** `TUNING.BUFF_FOOD_TEMP_DURATION`
- **No Chill:** `true` (prevents cooling effects)

### gazpacho {#gazpacho}

**Status:** `stable`

**Description:** Cold soup that provides cooling temperature effect.

**Properties:**
- **Temperature:** `TUNING.COLD_FOOD_BONUS_TEMP`
- **Temperature Duration:** `TUNING.BUFF_FOOD_TEMP_DURATION`

## High-Nutrition Recipes

### freshfruitcrepes {#fresh-fruit-crepes}

**Status:** `stable`

**Description:** Premium dessert with exceptional nutritional benefits.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return tags.fruit and tags.fruit >= 1.5 
           and names.butter and names.honey
end
```

**Nutritional Values:**
- Health: `TUNING.HEALING_HUGE`
- Hunger: `TUNING.CALORIES_SUPERHUGE`
- Sanity: `TUNING.SANITY_MED`

**Pot Level:** `high`

### bonesoup {#bone-soup}

**Status:** `stable`

**Description:** Hearty soup made from bone shards with exceptional hunger restoration.

**Nutritional Values:**
- Health: `TUNING.HEALING_MEDSMALL * 4`
- Hunger: `TUNING.CALORIES_LARGE * 4`

### moqueca {#moqueca}

**Status:** `stable`

**Description:** Brazilian-inspired fish stew with high nutritional value.

**Nutritional Values:**
- Health: `TUNING.HEALING_MED * 3`
- Hunger: `TUNING.CALORIES_LARGE * 3`
- Sanity: `TUNING.SANITY_LARGE`

## Recipe Properties

### Common Properties

All Warly recipes include these standard properties:

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Recipe identifier (auto-assigned) |
| `weight` | number | Recipe weight (default: 1) |
| `priority` | number | Recipe priority (default: 0) |
| `cookbook_category` | string | Always "portablecookpot" |

### Special Properties

| Property | Type | Description |
|----------|------|-------------|
| `potlevel` | string | Required pot level ("low", "high") |
| `tags` | table | Recipe tags (masterfood, unsafefood, etc.) |
| `prefabs` | table | Required prefabs for special effects |
| `oneat_desc` | string | Description of eating effects |
| `oneatenfn` | function | Function executed when consumed |
| `floater` | table | Floating animation parameters |

### Temperature Effects

Some recipes provide temperature modulation:

| Property | Type | Description |
|----------|------|-------------|
| `temperature` | number | Temperature change value |
| `temperatureduration` | number | Duration of temperature effect |
| `nochill` | boolean | Prevents cooling when true |

## Food Classifications

### Primary Food Types

- `FOODTYPE.VEGGIE`: Vegetarian dishes
- `FOODTYPE.MEAT`: Meat-based dishes  
- `FOODTYPE.GOODIES`: Special treats and desserts

### Secondary Food Types

- `FOODTYPE.MONSTER`: Monster meat dishes (e.g., monstertartare)

## Recipe Testing System

### Test Function Structure

Each recipe uses a test function to determine ingredient compatibility:

```lua
test = function(cooker, names, tags)
    -- Check specific ingredients by name
    if names.specific_ingredient then
        -- Ingredient present
    end
    
    -- Check ingredient categories by tag
    if tags.category and tags.category >= minimum_amount then
        -- Sufficient category ingredients
    end
    
    -- Check exclusions
    if not tags.unwanted_category then
        -- Unwanted ingredients absent
    end
    
    return conditions_met
end
```

### Ingredient Parameters

- **names**: Table of specific ingredient names and quantities
- **tags**: Table of ingredient categories and their total values
- **cooker**: Reference to the cooking container

## Special Effects System

### Buff Application

Many Warly recipes apply temporary buffs:

```lua
oneatenfn = function(inst, eater)
    eater:AddDebuff("buff_name", "buff_name")
end
```

### Health/Sanity Manipulation

Advanced recipes can directly modify player stats:

```lua
oneatenfn = function(inst, eater)
    if eater.components.sanity ~= nil and eater.components.health ~= nil then
        -- Direct stat manipulation
        eater.components.sanity:DoDelta(amount)
        eater.components.health:DoDelta(amount, nil, source)
    end
end
```

### Light Generation

Some recipes create light sources:

```lua
oneatenfn = function(inst, eater)
    local light = SpawnPrefab("light_prefab")
    light.components.spell:SetTarget(eater)
    light.components.spell:StartSpell()
end
```

## Integration with Portable Cookpot

### Cookbook Category

All recipes are categorized as `"portablecookpot"` to ensure they only appear in Warly's portable cookpot recipe book.

### Priority System

Higher priority recipes take precedence when multiple recipes match the same ingredients:

- Priority 30+: Unique effect recipes
- Priority 20-29: Standard enhanced recipes  
- Priority 10-19: Basic enhanced recipes

## Usage Examples

### Creating Custom Warly Recipe

```lua
local custom_recipe = {
    test = function(cooker, names, tags)
        return names.custom_ingredient and tags.sweetener >= 1
    end,
    priority = 25,
    foodtype = FOODTYPE.GOODIES,
    health = TUNING.HEALING_MED,
    hunger = TUNING.CALORIES_LARGE,
    sanity = TUNING.SANITY_SMALL,
    perishtime = TUNING.PERISH_MED,
    cooktime = 1.5,
    oneatenfn = function(inst, eater)
        -- Custom effect
    end,
    tags = {"masterfood"}
}
```

### Recipe Testing

```lua
-- Example ingredient check
local ingredients = {
    names = {nightmarefuel = 2, potato = 1, onion = 1},
    tags = {veggie = 2, inedible = 0}
}

-- Test if nightmarepie recipe matches
if foods.nightmarepie.test(nil, ingredients.names, ingredients.tags) then
    -- Recipe can be made
end
```

## Related Modules

- [`preparedfoods`](./preparedfoods.md): Standard cookpot recipes
- [`cooking`](./cooking.md): Core cooking system mechanics
- [`tuning`](./constants.md): Nutritional value constants
- [`components/cookpot`](../components/cookpot.md): Cookpot component logic

## Notes

- All Warly recipes require the portable cookpot to craft
- Special effects are only available through Warly's enhanced recipes
- Recipe priority determines precedence when ingredient combinations overlap
- The `masterfood` tag indicates recipes exclusive to master chef characters
- Temperature effects stack with other temperature modifiers in the game
