---
id: skinstradeutils
title: Skins Trade Utils
description: Utility functions for skin trading interface and recipe matching
sidebar_position: 104
slug: api-vanilla/core-systems/skinstradeutils
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Skins Trade Utils

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `skinstradeutils` module provides utility functions for the skin trading interface in Don't Starve Together. It handles trade recipe matching, filter generation, and selection validation for the trading system. This module works in conjunction with the trade recipes system to enable players to exchange skins for different rarities and types.

## Dependencies

This module requires:
- [`skinsutils`](./skinsutils.md): Core skins utility functions
- [`trade_recipes`](./trade_recipes.md): Trade recipe definitions and rules

## Core Concepts

### Trade Recipe System

The trading system uses recipes that define:
- **Input Requirements:** What items can be traded
- **Output Results:** What items are received
- **Restrictions:** Special conditions that must be met
- **Rarity Matching:** Ensuring input/output rarity consistency

### Selection Management

Trade interfaces must track:
- **Selected Items:** Items player wants to trade
- **Recipe Matching:** Which recipes apply to current selection
- **Filter Generation:** Dynamic filters based on recipe requirements
- **Validation:** Ensuring selections meet recipe restrictions

## Functions

### GetNumberSelectedItems(selections) {#get-number-selected-items}

**Status:** `stable`

**Description:**
Counts the total number of items currently selected for trading.

**Parameters:**
- `selections` (table): Table of selected items indexed by selection ID

**Returns:**
- (number): Count of selected items

**Example:**
```lua
local selections = {
    ["item1"] = {item = "wilson_axe", rarity = "Common"},
    ["item2"] = {item = "wilson_pickaxe", rarity = "Common"},
    ["item3"] = {item = "wilson_shovel", rarity = "Common"}
}

local count = GetNumberSelectedItems(selections)
-- count = 3
```

### GetBasicRecipeMatch(selections) {#get-basic-recipe-match}

**Status:** `stable`

**Description:**
Finds the basic trade recipe that matches the rarity of currently selected items. Returns the first matching recipe name from the basic recipe list.

**Parameters:**
- `selections` (table): Table of selected items with rarity information

**Returns:**
- (string|nil): Recipe name if match found, nil otherwise

**Example:**
```lua
local selections = {
    ["item1"] = {item = "wilson_axe", rarity = "Common"},
    ["item2"] = {item = "wilson_pickaxe", rarity = "Common"}
}

local recipe_name = GetBasicRecipeMatch(selections)
-- recipe_name = "common_to_classy" (if such recipe exists)

-- No selections
local empty_recipe = GetBasicRecipeMatch({})
-- empty_recipe = nil
```

**Recipe Matching Logic:**
1. Extracts rarity from first selected item
2. Searches TRADE_RECIPES for matching input rarity
3. Returns first matching recipe name
4. Returns nil if no selections or no matching recipe

### GetBasicFilters(recipe_name) {#get-basic-filters}

**Status:** `stable`

**Description:**
Generates filter criteria for basic trade recipes. Returns filters that match the input requirements of the specified recipe, or default filters if no recipe is provided.

**Parameters:**
- `recipe_name` (string|nil): Name of the trade recipe to generate filters for

**Returns:**
- (table): Array of filter groups for use with filtering functions

**Example:**
```lua
-- Get filters for specific recipe
local filters = GetBasicFilters("common_to_classy")
-- filters = {{"Common"}} (if recipe requires Common rarity input)

-- Get default filters when no recipe specified
local default_filters = GetBasicFilters(nil)
-- default_filters = {{"Common"}, {"Classy"}, {"Spiffy"}}

-- Usage with filtering system
local filtered_items = ApplyFilters(full_skins_list, filters)
```

**Filter Generation:**
- **With Recipe:** Returns filter for recipe's input rarity requirement
- **Without Recipe:** Returns default filters for common trading rarities
- **Format:** Returns array of filter groups compatible with filtering system

### GetSpecialFilters(recipe_data, selected_items) {#get-special-filters}

**Status:** `stable`

**Description:**
Generates specialized filters based on complex trade recipe restrictions and currently selected items. Analyzes unsatisfied restrictions to create targeted filters that help users find compatible items.

**Parameters:**
- `recipe_data` (table): Complete recipe data including restrictions
- `selected_items` (table): Currently selected items for validation

**Returns:**
- (table): Array of specialized filter groups targeting unsatisfied restrictions

**Example:**
```lua
local recipe_data = {
    Restrictions = {
        {
            ItemType = "wilson_axe",
            Rarity = "Elegant",
            Tags = {"body_tag"}
        },
        {
            Rarity = "Distinguished", 
            Tags = {"legs_tag"}
        }
    }
}

local selected_items = {
    {item = "wilson_axe", rarity = "Elegant"}
}

local filters = GetSpecialFilters(recipe_data, selected_items)
-- filters = {{"Distinguished", "legs"}} (for unsatisfied restriction)
```

**Filter Generation Process:**
1. **Analyze Restrictions:** Checks which recipe restrictions are unsatisfied
2. **Extract Requirements:** Identifies item types, rarities, and tags needed
3. **Build Filters:** Creates filter groups for each unsatisfied restriction
4. **Type Mapping:** Converts restriction tags to filter-compatible types
5. **Deduplication:** Ensures no duplicate filter criteria

**Filter Components:**
- **Item Type:** Specific item IDs required by restrictions
- **Clothing Type:** Derived from restriction tags (body, legs, etc.)
- **Rarity:** Required rarity levels for unsatisfied restrictions

## Usage Examples

### Basic Trading Interface

```lua
-- Initialize trading interface
function TradeWidget:InitializeTrading()
    self.selected_items = {}
    self.current_recipe = nil
    self.available_filters = {}
end

-- Handle item selection
function TradeWidget:OnItemSelected(item)
    self.selected_items[item.id] = item
    
    -- Update recipe matching
    self.current_recipe = GetBasicRecipeMatch(self.selected_items)
    
    -- Update available filters
    if self.current_recipe then
        self.available_filters = GetBasicFilters(self.current_recipe)
    else
        self.available_filters = GetBasicFilters(nil)
    end
    
    -- Refresh UI
    self:UpdateTradeInterface()
end

-- Check selection count
function TradeWidget:UpdateTradeButton()
    local count = GetNumberSelectedItems(self.selected_items)
    self.trade_button:SetEnabled(count > 0 and self.current_recipe ~= nil)
end
```

### Advanced Recipe Handling

```lua
-- Handle complex recipe requirements
function TradeWidget:HandleSpecialRecipe(recipe_data)
    local special_filters = GetSpecialFilters(recipe_data, self.selected_items)
    
    if #special_filters > 0 then
        -- Show specialized filters to help user
        self:ShowRequiredItemFilters(special_filters)
    else
        -- All restrictions satisfied
        self:EnableTradeExecution()
    end
end

-- Dynamic filter management
function TradeWidget:UpdateDynamicFilters()
    local basic_filters = GetBasicFilters(self.current_recipe)
    local special_filters = {}
    
    if self.current_recipe_data then
        special_filters = GetSpecialFilters(self.current_recipe_data, self.selected_items)
    end
    
    -- Combine filters for comprehensive filtering
    local combined_filters = {}
    for _, filter in ipairs(basic_filters) do
        table.insert(combined_filters, filter)
    end
    for _, filter in ipairs(special_filters) do
        table.insert(combined_filters, filter)
    end
    
    -- Apply combined filters
    self.filtered_items = ApplyFilters(self.full_inventory, combined_filters)
    self:RebuildItemList()
end
```

### Selection Validation

```lua
-- Validate trading selections
function TradeWidget:ValidateSelection()
    local count = GetNumberSelectedItems(self.selected_items)
    
    if count == 0 then
        self:ShowMessage("Please select items to trade")
        return false
    end
    
    local recipe = GetBasicRecipeMatch(self.selected_items)
    if not recipe then
        self:ShowMessage("Selected items don't match any trade recipe")
        return false
    end
    
    -- Check for special recipe requirements
    if self.current_recipe_data and self.current_recipe_data.Restrictions then
        local special_filters = GetSpecialFilters(self.current_recipe_data, self.selected_items)
        if #special_filters > 0 then
            self:ShowMessage("Selection doesn't meet all recipe requirements")
            return false
        end
    end
    
    return true
end
```

## Integration Guidelines

### Trade Interface Requirements

Trade interfaces using these utilities should:

1. **Selection Tracking:**
```lua
self.selected_items = {} -- Track user selections
```

2. **Recipe Management:**
```lua
self.current_recipe = nil -- Current matching recipe
self.recipe_data = nil    -- Full recipe data for validation
```

3. **Filter Integration:**
```lua
-- Use generated filters with filtering system
local filters = GetBasicFilters(recipe_name)
local filtered_items = ApplyFilters(inventory, filters)
```

### Performance Considerations

- **Cache Recipe Lookups:** Store recipe data to avoid repeated searches
- **Batch Filter Updates:** Update filters only when selections change significantly
- **Lazy Filter Generation:** Generate special filters only when needed
- **Selection Debouncing:** Avoid excessive validation on rapid selection changes

## Error Handling

The module includes safety measures for:

- **Empty Selections:** Functions handle empty or nil selections gracefully
- **Invalid Recipes:** Returns appropriate defaults for unknown recipes
- **Missing Data:** Safely handles missing recipe or item data
- **Malformed Restrictions:** Skips invalid restriction data

## Recipe Integration

### Basic Recipe Flow

1. **Selection:** User selects items for trading
2. **Matching:** `GetBasicRecipeMatch()` finds applicable recipe
3. **Filtering:** `GetBasicFilters()` generates appropriate filters
4. **Validation:** Selection count and recipe match validation
5. **Execution:** Trade processing with validated items

### Special Recipe Flow

1. **Complex Recipe Detection:** Recipe has special restrictions
2. **Restriction Analysis:** `GetSpecialFilters()` identifies unmet requirements
3. **Guided Selection:** Filters help user find required items
4. **Validation:** Ensure all restrictions are satisfied
5. **Completion:** Execute trade when all requirements met

## Related Modules

- [`skinsfiltersutils`](./skinsfiltersutils.md): Core filtering utilities for skins
- [`trade_recipes`](./trade_recipes.md): Trade recipe definitions and rules
- [`skinsutils`](./skinsutils.md): Core skins functionality and utilities
- [`skin_assets`](./skin_assets.md): Skin asset definitions and properties

## Constants and Dependencies

This module relies on external constants:
- **TRADE_RECIPES:** Defined in trade_recipes module
- **Rarity Functions:** From skinsutils module (GetRarityForItem)
- **Type Functions:** Tag-to-type conversion utilities
- **Item Validation:** Item ID and type checking functions

## Best Practices

- **Selection Validation:** Always validate selections before executing trades
- **User Feedback:** Provide clear feedback about missing requirements
- **Filter Clarity:** Use generated filters to guide user selections
- **Error Recovery:** Handle invalid states gracefully with clear messaging
- **Performance:** Cache expensive operations like recipe lookups
