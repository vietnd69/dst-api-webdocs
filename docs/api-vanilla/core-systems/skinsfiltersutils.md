---
id: skinsfiltersutils
title: Skins Filters Utils
description: Utility functions for filtering skins lists in inventory and trading interfaces
sidebar_position: 103
slug: api-vanilla/core-systems/skinsfiltersutils
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Skins Filters Utils

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `skinsfiltersutils` module provides utility functions for filtering skins lists in inventory and trading interfaces. It enables widgets and screens to filter large skins collections based on type, rarity, color, and item criteria. This module is essential for creating user-friendly interfaces that allow players to quickly find specific skins.

## Dependencies

This module requires:
- [`skinsutils`](./skinsutils.md): Core skins utility functions

## Usage Requirements

Widgets using these filter utilities must implement:
- `owner.full_skins_list`: Complete unfiltered skins list
- `owner.skins_list`: Filtered results list  
- `BuildInventoryList(skins_list)`: Function to rebuild UI with filtered results

## Filter Categories

### Type Filters

Supported clothing and item types:

| Type | Description |
|------|-------------|
| `base` | Base character appearance |
| `body` | Body clothing items |
| `hand` | Hand/glove items |
| `legs` | Leg/pants items |
| `feet` | Foot/shoe items |
| `item` | Tool and equipment skins |

### Rarity Filters

Supported skin rarity levels:

| Rarity | Description |
|--------|-------------|
| `Complimentary` | Free promotional items |
| `Common` | Standard drop items |
| `Classy` | Uncommon quality items |
| `Spiffy` | Rare quality items |
| `Distinguished` | Very rare items |
| `Elegant` | Extremely rare items |
| `Timeless` | Limited time items |
| `Reward` | Achievement rewards |
| `Loyal` | Loyalty program items |
| `Resurrected` | Returning legacy items |
| `ProofOfPurchase` | Purchase bonus items |
| `Event` | Special event items |

### Color Filters

Supported color categories:

| Color | Hex Values |
|-------|------------|
| `black` | Dark tones |
| `blue` | Blue spectrum |
| `brown` | Brown/tan spectrum |
| `green` | Green spectrum |
| `grey` | Grey spectrum |
| `navy` | Dark blue tones |
| `orange` | Orange spectrum |
| `pink` | Pink spectrum |
| `purple` | Purple spectrum |
| `red` | Red spectrum |
| `tan` | Light brown tones |
| `teal` | Teal/turquoise spectrum |
| `white` | Light/white tones |
| `yellow` | Yellow spectrum |

## Functions

### ApplyFilters(full_skins_list, filters) {#apply-filters}

**Status:** `stable`

**Description:**
Applies a list of filter criteria to a complete skins list and returns items matching any filter group. Each filter group represents an OR condition, while criteria within a group use AND logic.

**Parameters:**
- `full_skins_list` (table): Complete list of skin items to filter
- `filters` (table): Array of filter groups, each containing filter criteria

**Returns:**
- (table): Filtered list containing only matching, marketable skin items

**Filter Logic:**
- **Between Groups:** OR logic (item matches ANY group)
- **Within Groups:** AND logic (item must match ALL criteria in group)
- **Special Case:** "none" filter returns complete unfiltered list

**Example:**
```lua
-- Filter for Classy legs OR Common items of any type
local filters = {
    {"Classy", "legs"},  -- Must be both Classy AND legs
    {"Common"}           -- Must be Common (any type)
}

local filtered_skins = ApplyFilters(full_skins_list, filters)

-- Filter by specific item and rarity
local weapon_filters = {
    {"spear", "Spiffy"},     -- Spiffy spear skins
    {"axe", "Distinguished"} -- Distinguished axe skins
}

local weapon_skins = ApplyFilters(inventory_list, weapon_filters)

-- Clear all filters
local no_filters = {{"none"}}
local all_skins = ApplyFilters(full_skins_list, no_filters)
```

**Filter Processing:**
1. Iterates through each skin item in the full list
2. For each item, tests against each filter group
3. Within each group, all criteria must match (AND logic)
4. If any group matches completely, item is included (OR logic)
5. Only includes marketable items (excludes temporary items)

**Performance Notes:**
- Filters are processed in order provided
- Processing stops on first matching filter group per item
- Large filter lists may impact UI responsiveness

## Usage Examples

### Basic Widget Integration

```lua
-- Initialize filtering in a widget
function MyWidget:InitializeFilters(full_skins_list)
    self.full_skins_list = full_skins_list
    self.applied_filters = {}
    self.skins_list = nil
end

-- Apply type filter
function MyWidget:FilterByType(clothing_type)
    local filters = {{clothing_type}}
    self.skins_list = ApplyFilters(self.full_skins_list, filters)
    self:BuildInventoryList(self.skins_list)
end

-- Apply combined filters
function MyWidget:FilterByTypeAndRarity(clothing_type, rarity)
    local filters = {{clothing_type, rarity}}
    self.skins_list = ApplyFilters(self.full_skins_list, filters)
    self:BuildInventoryList(self.skins_list)
end
```

### Advanced Multi-Filter Usage

```lua
-- Complex filter combining multiple criteria
function MyWidget:ApplyAdvancedFilters()
    local filters = {
        {"body", "Elegant", "blue"},     -- Blue elegant body items
        {"legs", "Distinguished"},       -- Any distinguished leg items  
        {"wilson_axe", "Timeless"},     -- Timeless Wilson axe skins
        {"red"}                         -- Any red items
    }
    
    self.skins_list = ApplyFilters(self.full_skins_list, filters)
    self:BuildInventoryList(self.skins_list)
end

-- Event-specific filtering
function MyWidget:FilterEventItems()
    local filters = {
        {"Event"},           -- Event items of any type
        {"Reward"},          -- Reward items
        {"ProofOfPurchase"}  -- Proof of purchase items
    }
    
    self.skins_list = ApplyFilters(self.full_skins_list, filters)
    self:BuildInventoryList(self.skins_list)
end
```

## Integration Guidelines

### Widget Requirements

Widgets implementing skin filtering must provide:

1. **Full Skins List Storage:**
```lua
self.full_skins_list = GetInventorySkinsList() -- From skinsutils
```

2. **Filtered Results Storage:**
```lua
self.skins_list = nil -- Will contain filtered results
```

3. **UI Rebuild Function:**
```lua
function MyWidget:BuildInventoryList(skins_list)
    -- Rebuild UI elements with filtered list
end
```

### Performance Considerations

- **Cache Filter Results:** Store commonly used filter results
- **Debounce Rapid Filtering:** Avoid filtering on every keystroke
- **Batch UI Updates:** Update UI only after filtering completes
- **Limit Simultaneous Filters:** Too many complex filters can impact performance

## Error Handling

The module includes built-in safety measures:

- **Invalid Filters:** Unknown filter values are ignored
- **Empty Lists:** Returns empty table for empty input
- **Malformed Data:** Skips items with missing required properties
- **Temporary Items:** Automatically excludes temporary/placeholder items

## Related Modules

- [`skinsutils`](./skinsutils.md): Core skins functionality and list generation
- [`skinstradeutils`](./skinstradeutils.md): Trading-specific filter utilities
- [`skin_assets`](./skin_assets.md): Skin asset definitions and properties
- [`skins_defs_data`](./skins_defs_data.md): Comprehensive skin definitions

## Constants Reference

This module defines filter validation tables for:
- **typeList:** Valid clothing/item types
- **rarityList:** Valid rarity levels  
- **coloursList:** Valid color categories

These tables ensure filter criteria validity and prevent invalid filter application.
