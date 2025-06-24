---
id: techtree
title: TechTree
description: Technology tree system for managing crafting station requirements and research levels
sidebar_position: 3
slug: api-vanilla/core-systems/techtree
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# TechTree

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `TechTree` module manages the technology system in Don't Starve Together, defining available technology types and their relationships. It provides the foundation for crafting requirements and research progression across different crafting stations and game mechanics.

## Usage Example

```lua
local TechTree = require("techtree")

-- Create a new tech tree with default values
local player_tech = TechTree.Create()

-- Access available tech types
for i, tech_type in ipairs(TechTree.AVAILABLE_TECH) do
    print("Available tech:", tech_type)
end

-- Check if a tech can have bonuses
for i, tech_type in ipairs(TechTree.BONUS_TECH) do
    print("Bonus tech:", tech_type)
end
```

## Constants

### AVAILABLE_TECH

**Type:** `table` (array)

**Status:** `stable`

**Description:** Array containing all available technology types in the game. Each technology type represents a different crafting category or research area.

**Available Technology Types:**
- `"SCIENCE"` - Science Machine and related structures
- `"MAGIC"` - Shadow Manipulator and magic items
- `"ANCIENT"` - Ancient Pseudoscience Station
- `"CELESTIAL"` - Celestial Station and moon items
- `"MOON_ALTAR"` - **Deprecated** - Moved to CELESTIAL
- `"SHADOW"` - Shadow crafting station
- `"CARTOGRAPHY"` - Map-related crafting
- `"SEAFARING"` - Boat and ocean-related crafting
- `"SCULPTING"` - Potter's Wheel
- `"ORPHANAGE"` - Special tech type
- `"PERDOFFERING"` - Perd shrine offerings
- `"WARGOFFERING"` - Warg shrine offerings
- `"PIGOFFERING"` - Pig shrine offerings
- `"CARRATOFFERING"` - Carrat shrine offerings
- `"BEEFOFFERING"` - Beef shrine offerings
- `"CATCOONOFFERING"` - Catcoon shrine offerings
- `"RABBITOFFERING"` - Rabbit shrine offerings
- `"DRAGONOFFERING"` - Dragon shrine offerings
- `"MADSCIENCE"` - Mad Science crafting
- `"CARNIVAL_PRIZESHOP"` - Carnival prize shop
- `"CARNIVAL_HOSTSHOP"` - Carnival host shop
- `"FOODPROCESSING"` - Food processing stations
- `"FISHING"` - Fishing-related crafting
- `"WINTERSFEASTCOOKING"` - Winter's Feast cooking
- `"HERMITCRABSHOP"` - Hermit Crab shop
- `"RABBITKINGSHOP"` - Rabbit King shop
- `"WANDERINGTRADERSHOP"` - Wandering Trader shop
- `"WAGPUNK_WORKSTATION"` - Wagpunk crafting station
- `"TURFCRAFTING"` - Turf crafting
- `"MASHTURFCRAFTING"` - Mash turf crafting
- `"SPIDERCRAFT"` - Spider crafting
- `"ROBOTMODULECRAFT"` - Robot module crafting
- `"BOOKCRAFT"` - Book crafting
- `"LUNARFORGING"` - Lunar forging
- `"SHADOWFORGING"` - Shadow forging
- `"CARPENTRY"` - Carpentry crafting
- `"WORMOFFERING"` - Worm shrine offerings

**Example:**
```lua
-- Iterate through all available tech types
for i, tech_type in ipairs(TechTree.AVAILABLE_TECH) do
    print("Tech type " .. i .. ": " .. tech_type)
end

-- Check if a specific tech exists
local function HasTechType(tech_name)
    for _, v in ipairs(TechTree.AVAILABLE_TECH) do
        if v == tech_name then
            return true
        end
    end
    return false
end

if HasTechType("SCIENCE") then
    print("Science tech is available")
end
```

### BONUS_TECH

**Type:** `table` (array)

**Status:** `stable`

**Description:** Array containing technology types that can receive bonus levels. Only these technologies support temporary bonuses and enhanced research levels.

**Bonus-Capable Technologies:**
- `"SCIENCE"` - Science station bonuses
- `"MAGIC"` - Magic station bonuses
- `"SEAFARING"` - Seafaring bonuses
- `"ANCIENT"` - Ancient station bonuses
- `"MASHTURFCRAFTING"` - Mash turf crafting bonuses

**Example:**
```lua
-- Check if a technology supports bonuses
local function CanHaveBonus(tech_type)
    for _, v in ipairs(TechTree.BONUS_TECH) do
        if v == tech_type then
            return true
        end
    end
    return false
end

if CanHaveBonus("SCIENCE") then
    print("Science tech can have bonuses applied")
end

if not CanHaveBonus("FISHING") then
    print("Fishing tech cannot have bonuses")
end
```

### Cached Performance Tables

**Status:** `stable`

**Description:** The following tables are performance optimizations for builder component calculations. These are implementation details and may change in future versions.

⚠️ **Warning:** Mod developers should avoid using these cached tables directly as they are not guaranteed to exist in future versions.

**Available Cached Tables:**
- `AVAILABLE_TECH_BONUS` - Tech bonus string cache
- `AVAILABLE_TECH_TEMPBONUS` - Tech temporary bonus string cache
- `AVAILABLE_TECH_BONUS_CLASSIFIED` - Classified bonus string cache
- `AVAILABLE_TECH_TEMPBONUS_CLASSIFIED` - Classified temporary bonus string cache
- `AVAILABLE_TECH_LEVEL_CLASSIFIED` - Classified level string cache

## Functions

### Create(t) {#create}

**Status:** `stable`

**Description:**
Creates and initializes a new technology tree table with default values. All available technology types are set to level 0 unless specified in the input table.

**Parameters:**
- `t` (table, optional): Existing table to initialize. If not provided, creates a new empty table.

**Returns:**
- (table): Technology tree table with all available tech types initialized to 0 or existing values

**Example:**
```lua
-- Create a new tech tree with default values
local tech_tree = TechTree.Create()
print(tech_tree.SCIENCE) -- Output: 0
print(tech_tree.MAGIC)   -- Output: 0

-- Create with some preset values
local custom_tech = TechTree.Create({
    SCIENCE = 1,
    MAGIC = 2
})
print(custom_tech.SCIENCE)    -- Output: 1
print(custom_tech.MAGIC)      -- Output: 2
print(custom_tech.ANCIENT)    -- Output: 0 (default)

-- Modify existing tech tree
local existing_tech = { SCIENCE = 3 }
local updated_tech = TechTree.Create(existing_tech)
print(updated_tech.SCIENCE)   -- Output: 3
print(updated_tech.MAGIC)     -- Output: 0 (added by Create)
```

## Common Usage Patterns

### Checking Technology Requirements

```lua
-- Check if player meets crafting requirements
local function MeetsRequirements(player_tech, required_tech)
    for tech_type, required_level in pairs(required_tech) do
        if (player_tech[tech_type] or 0) < required_level then
            return false
        end
    end
    return true
end

local player_tech = TechTree.Create({ SCIENCE = 1, MAGIC = 2 })
local recipe_requirements = { SCIENCE = 1, MAGIC = 1 }

if MeetsRequirements(player_tech, recipe_requirements) then
    print("Can craft this item!")
end
```

### Technology Progression

```lua
-- Advance technology level
local function AdvanceTech(tech_tree, tech_type, levels)
    if tech_tree[tech_type] then
        tech_tree[tech_type] = tech_tree[tech_type] + (levels or 1)
    end
end

local player_tech = TechTree.Create()
AdvanceTech(player_tech, "SCIENCE", 1)  -- Science level 0 -> 1
AdvanceTech(player_tech, "MAGIC", 2)    -- Magic level 0 -> 2

print("Science level:", player_tech.SCIENCE)  -- Output: 1
print("Magic level:", player_tech.MAGIC)      -- Output: 2
```

### Bonus Technology Handling

```lua
-- Apply temporary bonuses only to supported tech types
local function ApplyTechBonus(tech_tree, tech_type, bonus_amount)
    -- Check if this tech type supports bonuses
    for _, bonus_tech in ipairs(TechTree.BONUS_TECH) do
        if bonus_tech == tech_type then
            local bonus_key = tech_type .. "_BONUS"
            tech_tree[bonus_key] = (tech_tree[bonus_key] or 0) + bonus_amount
            return true
        end
    end
    return false  -- Tech type doesn't support bonuses
end

local player_tech = TechTree.Create()
if ApplyTechBonus(player_tech, "SCIENCE", 1) then
    print("Applied science bonus")
else
    print("Cannot apply bonus to this tech type")
end
```

## Integration with Game Systems

### Recipe System

The TechTree module integrates with the recipe system to determine crafting requirements:

```lua
-- Example of how recipes might use tech requirements
local example_recipe = {
    ingredients = { { "twigs", 2 }, { "flint", 1 } },
    tech = { SCIENCE = 1 },  -- Requires Science level 1
    builder_tag = "science"
}
```

### Builder Component

The cached tables optimize performance in the builder component's `KnowsRecipe` calculations, reducing string allocation overhead during frequent recipe checks.

## Related Modules

- [Recipe](./recipe.md): Uses tech requirements for crafting validation
- [Builder Component](../components/builder.md): Implements tech requirement checking
- [Recipes](./recipes.md): Contains individual recipe definitions with tech requirements

## Source Reference

**File:** `scripts/techtree.lua`

**Key Implementation Notes:**
- Performance optimization through cached string tables
- Backward compatibility maintained for mod support
- Clear separation between bonus-capable and standard tech types
- Deprecated MOON_ALTAR tech type maintained for compatibility
