---
id: preparednonfoods
title: Prepared Non-Foods
description: Non-food cookpot recipes for crafting special items and utility objects
sidebar_position: 5

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Prepared Non-Foods

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `preparednonfoods.lua` module defines special cookpot recipes that produce non-food items rather than consumable foods. These unique recipes allow crafting utility items, specialized equipment, and special materials using the cookpot system, expanding its functionality beyond traditional cooking.

## Module Structure

Unlike standard food recipes, non-food recipes reference prefabs that are defined elsewhere in the codebase. The module structure follows the same pattern as food recipes but with additional properties for non-consumable items:

```lua
local items = {
    [item_name] = {
        test = function(cooker, names, tags) -- Ingredient requirements
        priority = number, -- Recipe priority
        cooktime = number, -- Cooking duration
        perishtime = number, -- Item spoilage time
        cookpot_perishtime = number, -- Spoilage while in cookpot
        noprefab = boolean, -- Indicates external prefab definition
        -- Utility properties for non-consumables
    }
}
```

## Non-Food Recipe Types

### Utility Equipment

#### batnosehat {#bat-nose-hat}

**Status:** `stable`

**Description:** Wearable hat that provides hunger regeneration functionality.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return names.batnose and names.kelp
           and (tags.dairy and tags.dairy >= 1)
end
```

**Properties:**
- Priority: `55` (very high priority)
- Cook Time: `2`
- Perish Time: `TUNING.PERISH_SLOW`
- Cookpot Perish Time: `0` (doesn't spoil in cookpot)

**Special Characteristics:**
- Override Build: `"hat_batnose"`
- Override Symbol Name: `"swap_cookpot"`
- Provides hunger regeneration when worn
- Non-food prefab (`noprefab = true`)

**Cookbook Stats:**
- Health: `0`
- Hunger: `TUNING.HUNGERREGEN_TICK_VALUE`
- Sanity: `0`

### Special Materials

#### dustmeringue {#dust-meringue}

**Status:** `stable`

**Description:** Specialized food item designed specifically for Dust Moth consumption.

**Test Conditions:**
```lua
function(cooker, names, tags)
    return names.refined_dust
end
```

**Properties:**
- Priority: `100` (highest priority)
- Foodtype: `FOODTYPE.ELEMENTAL`
- Perish Time: `nil` (non-perishable)
- Cook Time: `2`

**Visual Properties:**
- Override Build: `"cook_pot_food6"`
- Floater: `{"small", 0.05, 1}`

**Nutritional Values:**
- Health: `0`
- Hunger: `TUNING.CALORIES_SMALL`
- Sanity: `0`

## Recipe Properties System

### Standard Properties

All non-food recipes include the fundamental recipe properties:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | string | key | Recipe identifier |
| `weight` | number | 1 | Recipe weight for selection |
| `priority` | number | 0 | Selection priority |
| `cookbook_category` | string | "cookpot" | Recipe book categorization |

### Non-Food Specific Properties

| Property | Type | Description |
|----------|------|-------------|
| `noprefab` | boolean | Indicates prefab is defined elsewhere |
| `cookpot_perishtime` | number | Spoilage time while in cookpot |
| `overridebuild` | string | Custom visual appearance |
| `overridesymbolname` | string | Custom symbol for visual override |

### Equipment Properties

For wearable items like the bat nose hat:

| Property | Type | Description |
|----------|------|-------------|
| `oneat_desc` | string | Description of item's effect |
| `floater` | table | Floating animation parameters |

## Recipe Testing and Priority

### High Priority Systems

Non-food recipes typically use higher priorities than food recipes to ensure they're selected when their specific ingredients are present:

- `batnosehat`: Priority `55`
- `dustmeringue`: Priority `100`

This prevents these specialized recipes from being overshadowed by generic food recipes that might match the same ingredients.

### Ingredient Specificity

Non-food recipes often require very specific ingredients:

```lua
-- Bat nose hat requires exact ingredients
test = function(cooker, names, tags)
    return names.batnose -- Specific bat nose required
           and names.kelp -- Specific kelp required
           and (tags.dairy and tags.dairy >= 1) -- Any dairy item
end
```

### Exclusivity Patterns

These recipes use precise ingredient matching to ensure they only trigger for their intended combinations, avoiding conflicts with food recipes.

## Prefab Integration

### External Prefab References

Non-food items use the `noprefab = true` flag to indicate their prefabs are defined in other modules:

```lua
batnosehat = {
    -- Recipe definition
    noprefab = true, -- Prefab defined in hats.lua
    -- Other properties...
}
```

### Visual Customization

Override builds allow non-food items to have custom appearances different from standard cookpot foods:

```lua
overridebuild = "hat_batnose", -- Custom hat appearance
overridesymbolname = "swap_cookpot", -- Symbol for cookpot display
```

## Special Functionality

### Equipment Effects

The bat nose hat provides ongoing hunger regeneration:

```lua
oneat_desc = STRINGS.UI.COOKBOOK.FOOD_EFFECTS_HUNGER_REGEN,
-- Actual effect implemented in hats.lua
hunger = TUNING.HUNGERREGEN_TICK_VALUE, -- For cookbook display
```

### Creature-Specific Items

Dust meringue serves as specialized creature food:

```lua
foodtype = FOODTYPE.ELEMENTAL, -- Special classification
oneat_desc = STRINGS.UI.COOKBOOK.FOOD_EFFECTS_DUST_MOTH_FOOD,
```

## Cookbook Integration

### Display Statistics

Non-food items still provide nutritional statistics for cookbook display purposes, even though their primary function isn't nutrition:

```lua
-- Bat nose hat cookbook stats
health = 0,
hunger = TUNING.HUNGERREGEN_TICK_VALUE, -- Shows regeneration value
sanity = 0,
```

### Category Classification

All items maintain the standard "cookpot" category for consistent cookbook organization.

## Usage Examples

### Creating Non-Food Recipe

```lua
local utility_item = {
    test = function(cooker, names, tags)
        return names.specific_component 
               and tags.required_category >= 1
    end,
    priority = 60, -- Higher than most food recipes
    cooktime = 3,
    perishtime = TUNING.PERISH_MED,
    cookpot_perishtime = 0, -- Doesn't spoil in pot
    overridebuild = "custom_item_build",
    noprefab = true, -- Defined elsewhere
    
    -- Cookbook display values
    health = 0,
    hunger = 0,
    sanity = TUNING.SANITY_SMALL,
    
    oneat_desc = STRINGS.UI.COOKBOOK.CUSTOM_EFFECT_DESC,
}
```

### Recipe Testing

```lua
-- Test if bat nose hat can be made
local ingredients = {
    names = {batnose = 1, kelp = 1, butter = 1},
    tags = {dairy = 1}
}

if items.batnosehat.test(nil, ingredients.names, ingredients.tags) then
    print("Can craft bat nose hat!")
end
```

## Integration with Cooking System

### Recipe Resolution

Non-food recipes integrate seamlessly with the cooking system:

1. High priority ensures selection over food alternatives
2. Specific ingredient requirements prevent accidental triggering
3. Standard cooking mechanics apply (cook time, spoilage, etc.)

### Cookpot Behavior

Items behave differently from foods in certain contexts:

```lua
cookpot_perishtime = 0, -- Some items don't spoil in cookpot
perishtime = TUNING.PERISH_SLOW, -- But do spoil in inventory
```

## Visual and Animation Systems

### Floating Parameters

Non-food items use floating parameters for visual consistency:

```lua
floater = {"med", 0.05, 0.7}, -- Size, y-offset, scale
```

### Build Overrides

Custom visual builds distinguish non-foods from regular food items:

```lua
overridebuild = "cook_pot_food6", -- Uses food6 appearance
overridebuild = "hat_batnose", -- Uses hat-specific appearance
```

## Related Modules

- [`preparedfoods`](./preparedfoods.md): Standard food recipes
- [`preparedfoods_warly`](./preparedfoods-warly.md): Warly-specific recipes
- [`cooking`](./cooking.md): Core cooking system mechanics
- [`components/cookpot`](../components/cookpot.md): Cookpot component implementation
- [`prefabs/hats`](../perfabs/hats.md): Hat prefab definitions
- [`tuning`](./constants.md): Game balance constants

## Notes

- Non-food recipes require higher priorities to override food recipe selection
- The `noprefab` flag indicates external prefab definitions
- Cookbook statistics are provided for display purposes even for non-consumables
- Special spoilage rules can apply (e.g., not spoiling in cookpot)
- Visual overrides ensure non-foods appear distinct from regular foods
- Equipment items like hats have their primary functionality defined in their prefab modules
- Creature-specific foods use special food type classifications
- Recipe testing follows the same pattern as food recipes but with more specific requirements
