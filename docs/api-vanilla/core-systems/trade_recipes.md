---
id: trade-recipes
title: Trade Recipes
description: Configuration system for item trading and upgrade recipes in Don't Starve Together
sidebar_position: 168
slug: api-vanilla/core-systems/trade-recipes
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Trade Recipes

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `trade_recipes` module defines the configuration system for item trading and upgrade recipes in Don't Starve Together. It provides a centralized table of trade recipes that specify the requirements and outcomes for various item upgrades, particularly focusing on rarity-based upgrade systems.

## Usage Example

```lua
-- Access trade recipes configuration
local recipe = TRADE_RECIPES.classy_upgrade
print(recipe.name) -- "9_CLASSY_UPGRADE"
print(recipe.inputs.number) -- 9
print(recipe.inputs.rarity) -- "Classy"
```

## Constants

### TRADE_RECIPES

**Type:** `table`

**Status:** `stable`

**Description:** Global table containing all available trade recipe configurations. Each recipe defines the inputs required and the upgrade outcome for item trading systems.

**Structure:**
```lua
TRADE_RECIPES = {
    [recipe_id] = {
        name = "RECIPE_NAME",
        inputs = {
            number = number_required,
            rarity = "rarity_type"
        }
    }
}
```

## Recipe Definitions

### classy_upgrade

**Status:** `stable`

**Description:** Upgrade recipe for trading 9 Classy rarity items.

**Properties:**
- `name` (string): `"9_CLASSY_UPGRADE"` - Identifier for the upgrade type
- `inputs.number` (number): `9` - Number of items required for the trade
- `inputs.rarity` (string): `"Classy"` - Required rarity level of input items

**Example:**
```lua
local classy_recipe = TRADE_RECIPES.classy_upgrade
-- Requires 9 items of Classy rarity to perform upgrade
if player_items.rarity == classy_recipe.inputs.rarity and 
   player_items.count >= classy_recipe.inputs.number then
    -- Perform upgrade
end
```

### common_upgrade

**Status:** `stable`

**Description:** Upgrade recipe for trading 9 Common rarity items.

**Properties:**
- `name` (string): `"9_COMMON_UPGRADE"` - Identifier for the upgrade type
- `inputs.number` (number): `9` - Number of items required for the trade
- `inputs.rarity` (string): `"Common"` - Required rarity level of input items

**Example:**
```lua
local common_recipe = TRADE_RECIPES.common_upgrade
-- Check if player has enough common items for upgrade
if CanPerformUpgrade(common_recipe.inputs.rarity, common_recipe.inputs.number) then
    ExecuteUpgrade(common_recipe.name)
end
```

### spiffy_upgrade

**Status:** `stable`

**Description:** Upgrade recipe for trading 9 Spiffy rarity items.

**Properties:**
- `name` (string): `"9_SPIFFY_UPGRADE"` - Identifier for the upgrade type
- `inputs.number` (number): `9` - Number of items required for the trade
- `inputs.rarity` (string): `"Spiffy"` - Required rarity level of input items

**Example:**
```lua
local spiffy_recipe = TRADE_RECIPES.spiffy_upgrade
-- Process spiffy item upgrade
ProcessRarityUpgrade(spiffy_recipe.inputs.rarity, 
                    spiffy_recipe.inputs.number, 
                    spiffy_recipe.name)
```

## Common Usage Patterns

### Validating Trade Requirements

```lua
function CanAffordUpgrade(recipe_id, player_inventory)
    local recipe = TRADE_RECIPES[recipe_id]
    if not recipe then return false end
    
    local items_of_rarity = CountItemsByRarity(player_inventory, recipe.inputs.rarity)
    return items_of_rarity >= recipe.inputs.number
end
```

### Processing Upgrades

```lua
function ProcessUpgrade(recipe_id, player)
    local recipe = TRADE_RECIPES[recipe_id]
    if not recipe then return false end
    
    -- Remove required items
    RemoveItemsByRarity(player, recipe.inputs.rarity, recipe.inputs.number)
    
    -- Grant upgrade reward
    GrantUpgradeReward(player, recipe.name)
    
    return true
end
```

### Iterating Through Available Recipes

```lua
function GetAvailableUpgrades(player_inventory)
    local available = {}
    
    for recipe_id, recipe in pairs(TRADE_RECIPES) do
        if CanAffordUpgrade(recipe_id, player_inventory) then
            table.insert(available, {
                id = recipe_id,
                name = recipe.name,
                cost = recipe.inputs.number .. " " .. recipe.inputs.rarity .. " items"
            })
        end
    end
    
    return available
end
```

## Integration Notes

### Rarity System Integration

The trade recipes system integrates with the game's item rarity classification:

- **Common**: Basic tier items, most frequently obtained
- **Classy**: Mid-tier items with enhanced properties  
- **Spiffy**: High-tier items with premium characteristics

### Trading System Workflow

1. **Validation**: Check if player has required number of items with correct rarity
2. **Consumption**: Remove the specified items from player inventory
3. **Reward**: Grant upgrade reward based on recipe name identifier
4. **Feedback**: Provide user feedback on successful or failed trades

## Related Modules

- [Inventory Systems](./inventory.md): Item storage and management
- [Player Profile](./playerprofile.md): Player progression and rewards
- [Skin Systems](./prefabskins.md): Item appearance and rarity management

## Source Reference

**File Location:** `scripts/trade_recipes.lua`

**Global Access:** Available globally as `TRADE_RECIPES` table
