---
id: spicedfoods
title: Spiced Foods
description: System for generating spiced variants of food items with additional effects and properties
sidebar_position: 6

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Spiced Foods

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `spicedfoods` system provides functionality for generating spiced variants of food items. It defines different spice types with unique effects and automatically creates spiced versions of all prepared foods with modified properties and additional buffs when consumed.

## Usage Example

```lua
-- The spiced foods are automatically generated when the module loads
local spicedfoods = require("spicedfoods")

-- Access a specific spiced food
local spiced_meatballs_garlic = spicedfoods["meatballs_spice_garlic"]
```

## Spice Types

### SPICE_GARLIC

**Status:** `stable`

**Description:**
Garlic spice that provides damage absorption when consumed.

**Effect:**
- Adds `buff_playerabsorption` debuff to the eater
- Provides damage reduction capabilities

**Example:**
```lua
local function oneaten_garlic(inst, eater)
    eater:AddDebuff("buff_playerabsorption", "buff_playerabsorption")
end
```

### SPICE_SUGAR

**Status:** `stable`

**Description:**
Sugar spice that enhances work effectiveness when consumed.

**Effect:**
- Adds `buff_workeffectiveness` debuff to the eater
- Improves work speed and efficiency

**Example:**
```lua
local function oneaten_sugar(inst, eater)
    eater:AddDebuff("buff_workeffectiveness", "buff_workeffectiveness")
end
```

### SPICE_CHILI

**Status:** `stable`

**Description:**
Chili spice that increases attack power and adds temperature effects when consumed.

**Effect:**
- Adds `buff_attack` debuff to the eater
- Increases damage output
- Adds or enhances temperature effects to the food

**Temperature Modifications:**
- For regular food: Adds permanent heat effect (`TUNING.HOT_FOOD_BONUS_TEMP`)
- For hot food: Upgrades to permanent heat with extended duration
- Sets `nochill = true` to prevent cooling

**Example:**
```lua
local function oneaten_chili(inst, eater)
    eater:AddDebuff("buff_attack", "buff_attack")
end
```

### SPICE_SALT

**Status:** `stable`

**Description:**
Salt spice with no additional effects beyond the base spiced food properties.

**Effect:**
- No special buff or debuff effects
- Only provides the standard spiced food modifications

## Functions

### GenerateSpicedFoods(foods) {#generate-spiced-foods}

**Status:** `stable`

**Description:**
Generates spiced variants for all foods in the provided food table. Creates new food entries with spice-specific modifications and effects.

**Parameters:**
- `foods` (table): Table of food definitions to generate spiced variants for

**Generated Properties:**
Each spiced food receives these modifications:
- `test` (function): Recipe test function checking for base food and spice
- `priority` (number): Recipe priority (100 for normal foods, -10 for wetgoop)
- `cooktime` (number): Fixed at 0.12 seconds
- `stacksize` (nil): Removes stacking capability
- `spice` (string): Spice type identifier (uppercase)
- `basename` (string): Original food name
- `name` (string): Generated name in format "foodname_spicename"
- `floater` (table): Floating properties `{"med", nil, {0.85, 0.7, 0.85}}`
- `official` (boolean): Always set to `true`
- `cookbook_category` (string): Prefixed with "spiced_" if original has category

**Special Handling:**
- **Wetgoop**: Uses simplified test function checking only for spice presence
- **Chili Spice**: Adds temperature effects and `nochill` property
- **Buff Integration**: Merges spice prefabs with existing food prefabs
- **Effect Chaining**: Combines spice effects with existing food effects

**Example:**
```lua
-- Generate spiced foods from prepared foods
GenerateSpicedFoods(require("preparedfoods"))
GenerateSpicedFoods(require("preparedfoods_warly"))

-- Resulting spiced food example
local spiced_meatballs = {
    name = "meatballs_spice_garlic",
    basename = "meatballs",
    spice = "SPICE_GARLIC",
    priority = 100,
    cooktime = 0.12,
    test = function(cooker, names, tags) 
        return names["meatballs"] and names["spice_garlic"] 
    end,
    oneatenfn = function(inst, eater)
        eater:AddDebuff("buff_playerabsorption", "buff_playerabsorption")
        -- Original meatballs effects would also be called
    end,
    prefabs = { "buff_playerabsorption" },
    floater = {"med", nil, {0.85, 0.7, 0.85}},
    official = true
}
```

## Constants

### SPICES

**Value:** Table containing spice definitions

**Status:** `stable`

**Description:** 
Central definition table for all available spices and their properties.

**Structure:**
```lua
local SPICES = {
    SPICE_GARLIC = { 
        oneatenfn = oneaten_garlic, 
        prefabs = { "buff_playerabsorption" } 
    },
    SPICE_SUGAR = { 
        oneatenfn = oneaten_sugar, 
        prefabs = { "buff_workeffectiveness" } 
    },
    SPICE_CHILI = { 
        oneatenfn = oneaten_chili, 
        prefabs = { "buff_attack" } 
    },
    SPICE_SALT = {}
}
```

## Module Initialization

The module automatically generates spiced foods for:
- Standard prepared foods from `preparedfoods.lua`
- Warly-specific prepared foods from `preparedfoods_warly.lua`

**Initialization Code:**
```lua
GenerateSpicedFoods(require("preparedfoods"))
GenerateSpicedFoods(require("preparedfoods_warly"))

return spicedfoods
```

## Recipe Testing

Spiced food recipes use specific test functions to validate ingredients:

**Standard Foods:**
```lua
newdata.test = function(cooker, names, tags) 
    return names[foodname] and names[spicename] 
end
```

**Wetgoop Exception:**
```lua
newdata.test = function(cooker, names, tags) 
    return names[spicename] 
end
```

## Related Modules

- [Prepared Foods](./preparedfoods.md): Base food definitions that get spiced variants
- [Prepared Foods Warly](./preparedfoods_warly.md): Warly-specific foods that get spiced variants
- [Tuning](./tuning.md): Contains temperature and timing constants used by spiced foods
- [Cooking](./cooking.md): Recipe system that processes spiced food recipes
