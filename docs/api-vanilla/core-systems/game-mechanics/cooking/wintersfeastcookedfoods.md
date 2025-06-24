---
id: wintersfeastcookedfoods
title: Winter's Feast Cooked Foods
description: Event food configuration data for Winter's Feast holiday cooking mechanics
sidebar_position: 7
slug: api-vanilla/core-systems/wintersfeastcookedfoods
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Winter's Feast Cooked Foods

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `wintersfeastcookedfoods` module provides configuration data for special holiday foods available during the Winter's Feast event. This module defines cooking times and properties for 18 unique festive recipes that can only be prepared during the holiday season.

## Usage Example

```lua
local wintersfeast_foods = require("wintersfeastcookedfoods")
local foods_data = wintersfeast_foods.foods

-- Access specific food data
local gravy_data = foods_data.gravy
print("Gravy cook time:", gravy_data.cooktime) -- Output: 1
print("Food name:", gravy_data.name) -- Output: "gravy"
```

## Data Structure

### foods

**Type:** `table`

**Description:**
A table containing configuration data for all Winter's Feast foods. Each food entry is keyed by its internal name and contains cooking properties.

**Structure:**
```lua
foods = {
    [food_name] = {
        cooktime = number,  -- Cooking duration in game time units
        name = string,      -- Internal food identifier (auto-assigned)
        -- Optional overrides (commented in source):
        -- uses = number,        -- Item durability
        -- wet_prefix = string,  -- Wet state prefix
        -- floater = table,      -- Floating parameters
    }
}
```

## Food Definitions

### Appetizers and Sides

#### berrysauce
**Cook Time:** `0.8`
**Description:** Sweet berry-based sauce, quick cooking appetizer

#### cabbagerolls
**Cook Time:** `0.8` 
**Description:** Stuffed cabbage rolls, traditional holiday side dish

#### gravy
**Cook Time:** `1.0`
**Description:** Rich sauce typically served with main courses

#### latkes
**Cook Time:** `0.8`
**Description:** Crispy potato pancakes, traditional holiday food

#### stuffing
**Cook Time:** `1.0`
**Description:** Savory bread-based stuffing for holiday meals

### Main Courses

#### festivefish
**Cook Time:** `1.0`
**Description:** Special holiday preparation of fish

#### lutefisk
**Cook Time:** `1.4`
**Description:** Traditional Nordic fish dish, longest cooking time

#### pickledherring
**Cook Time:** `1.2`
**Description:** Preserved fish preparation, medium cooking time

#### roastturkey
**Cook Time:** `1.2`
**Description:** Traditional holiday roasted turkey, centerpiece meal

#### tourtiere
**Cook Time:** `1.0`
**Description:** French-Canadian meat pie, traditional holiday dish

### Baked Goods and Desserts

#### bibingka
**Cook Time:** `1.0`
**Description:** Filipino rice cake, traditional holiday dessert

#### panettone
**Cook Time:** `1.0`
**Description:** Italian sweet bread, classic holiday treat

#### pavlova
**Cook Time:** `1.0`
**Description:** Meringue-based dessert with cream and fruit

#### polishcookie
**Cook Time:** `1.0`
**Description:** Traditional Polish holiday cookies

#### pumpkinpie
**Cook Time:** `1.0`
**Description:** Classic spiced pumpkin dessert pie

### Beverages and Treats

#### mulleddrink
**Cook Time:** `1.0`
**Description:** Warm spiced holiday beverage

#### sweetpotato
**Cook Time:** `1.0`
**Description:** Prepared sweet potato holiday dish

#### tamales
**Cook Time:** `1.0`
**Description:** Traditional wrapped and steamed corn-based dish

## Implementation Details

### Data Processing

The module uses a simple iteration pattern to assign name properties:

```lua
for k, v in pairs(foods) do
    v.name = k
end
```

This ensures each food entry contains its own identifier as a `name` field.

### Return Structure

The module returns a single table with the `foods` key:

```lua
return { foods = foods }
```

### Commented Features

The source code includes commented override options that can be enabled for specific foods:

- `uses`: Item durability/usage count
- `wet_prefix`: Prefix for wet state variations  
- `floater`: Floating behavior parameters `{"size", nil, height}`

## Cook Time Categories

| Time Range | Foods | Count |
|------------|-------|-------|
| 0.8 | berrysauce, cabbagerolls, latkes | 3 |
| 1.0 | bibingka, festivefish, gravy, mulleddrink, panettone, pavlova, polishcookie, pumpkinpie, stuffing, sweetpotato, tamales, tourtiere | 12 |
| 1.2 | pickledherring, roastturkey | 2 |
| 1.4 | lutefisk | 1 |

## Integration

This module integrates with the game's cooking system during Winter's Feast events, providing:

- Recipe definitions for holiday-specific foods
- Cooking time configurations for proper game balance
- Extensible structure for additional food properties

## Related Modules

- [Cooking](./cooking.md): Core cooking mechanics and systems
- [Prepared Foods](./preparedfoods.md): Standard non-holiday food definitions  
- [Recipes](./recipes.md): Recipe crafting and requirements system
- [Events](./events.md): Holiday event management and triggers
