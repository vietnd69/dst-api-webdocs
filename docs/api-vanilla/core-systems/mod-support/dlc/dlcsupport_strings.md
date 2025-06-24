---
id: dlcsupport_strings
title: DLC Support Strings
description: String handling system for DLC content with prefix/suffix management and adjective construction
sidebar_position: 2
slug: api-vanilla/core-systems/dlcsupport-strings
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# DLC Support Strings

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `dlcsupport_strings` module provides specialized string handling for DLC content, focusing on prefix and suffix management for item names with adjectives. It determines whether adjectives should appear before or after item names based on language and context rules.

## Usage Example

```lua
-- Configure string prefix behavior
SetUsesPrefix("wetfood", true)

-- Construct names with adjectives
local name = ConstructAdjectivedName(inst, "meat", "wet")
-- Result could be "wet meat" or "meat wet" depending on configuration

-- Change all adjectives to prefixes
MakeAllPrefixes()
```

## Global Variables

### USE_PREFIX

**Type:** `table`

**Status:** `stable`

**Description:**
Table mapping string values to boolean values indicating whether they should use prefixes (true) or suffixes (false) when constructing adjective names.

**Pre-configured Values:**
```lua
USE_PREFIX[STRINGS.SMOLDERINGITEM] = true
USE_PREFIX[STRINGS.WITHEREDITEM] = true
USE_PREFIX[STRINGS.WET_PREFIX.FOOD] = true
USE_PREFIX[STRINGS.WET_PREFIX.CLOTHING] = true
USE_PREFIX[STRINGS.WET_PREFIX.TOOL] = true
USE_PREFIX[STRINGS.WET_PREFIX.FUEL] = true
USE_PREFIX[STRINGS.WET_PREFIX.GENERIC] = true
USE_PREFIX[STRINGS.WET_PREFIX.WETGOOP] = true
USE_PREFIX[STRINGS.NAMES.WETGOOP] = true
USE_PREFIX[STRINGS.WET_PREFIX.RABBITHOLE] = true
USE_PREFIX[STRINGS.NAMES.RABBITHOLE] = true
```

## Core Functions

### ConstructAdjectivedName(inst, name, adjective) {#constructadjectivename}

**Status:** `stable`

**Description:**
Constructs a display name by combining an item name with an adjective, using prefix or suffix based on configuration rules.

**Parameters:**
- `inst` (Entity): Entity instance (used for fallback name lookup)
- `name` (string): Base item name
- `adjective` (string): Adjective to apply

**Returns:**
- (string): Constructed name with adjective placed as prefix or suffix

**Logic:**
1. Uses adjective's configuration first
2. Falls back to name's configuration if adjective not configured
3. If configuration is a function, calls it and uses result if it returns a string
4. Defaults to prefix format if no configuration found

**Example:**
```lua
-- With prefix configuration
local wet_meat = ConstructAdjectivedName(inst, "meat", "wet")
-- Returns: "wet meat"

-- With suffix configuration  
local meat_rotten = ConstructAdjectivedName(inst, "meat", "rotten")
-- Returns: "meat rotten"

-- With function configuration
local special_name = ConstructAdjectivedName(inst, "tool", "magic")
-- Calls function and uses result
```

### SetUsesPrefix(item, usePrefix) {#setusesprefix}

**Status:** `stable`

**Description:**
Configures whether a specific item should use prefix or suffix formatting. Also attempts to ensure coverage by looking up related strings.

**Parameters:**
- `item` (string): String value to configure
- `usePrefix` (boolean|function): true for prefix, false for suffix, or function for dynamic behavior

**Example:**
```lua
-- Set specific items to use prefixes
SetUsesPrefix("wetfood", true)
SetUsesPrefix("rottenfood", false)

-- Use function for dynamic behavior
SetUsesPrefix("specialitem", function(inst, name, adjective)
    if inst.components.magic then
        return "magical " .. name
    end
    return nil -- Use default behavior
end)
```

### MakeAllPrefixes(fn) {#makeallprefixes}

**Status:** `stable`

**Description:**
Sets all configured items to use prefix formatting.

**Parameters:**
- `fn` (function): Optional function to use instead of boolean true (defaults to true)

**Example:**
```lua
-- Make all adjectives use prefix format
MakeAllPrefixes()

-- Use custom function for all items
MakeAllPrefixes(function(inst, name, adjective)
    return string.upper(adjective) .. " " .. name
end)
```

### MakeAllSuffixes(fn) {#makeallsuffixes}

**Status:** `stable`

**Description:**
Sets all configured items to use suffix formatting.

**Parameters:**
- `fn` (function): Optional function to use instead of boolean false (defaults to false)

**Example:**
```lua
-- Make all adjectives use suffix format
MakeAllSuffixes()

-- Use custom function for all items
MakeAllSuffixes(function(inst, name, adjective)
    return name .. " (" .. adjective .. ")"
end)
```

## Internal Functions

### UsesPrefix(item) {#usesprefix-internal}

**Status:** `stable` (internal)

**Description:**
Checks if a specific item uses prefix formatting.

**Parameters:**
- `item` (string): String to check

**Returns:**
- (boolean|function|nil): Configuration value for the item

### TryGuaranteeCoverage(item, usePrefix) {#tryguaranteecoverage-internal}

**Status:** `stable` (internal)

**Description:**
Internal function that attempts to ensure comprehensive coverage by looking up related strings in `STRINGS.NAMES` and `STRINGS.WET_PREFIX` tables.

**Parameters:**
- `item` (string): Item to ensure coverage for
- `usePrefix` (boolean): Prefix configuration to apply

## Complete Example

```lua
-- Setup custom string handling
print("Configuring string prefixes...")

-- Check initial configuration
local function TestConstruction(name, adjective)
    local result = ConstructAdjectivedName(nil, name, adjective)
    print(string.format("'%s' + '%s' = '%s'", adjective, name, result))
end

-- Test with default configuration
TestConstruction("meat", "wet")
TestConstruction("tool", "broken")

-- Configure specific items
SetUsesPrefix("meat", true)   -- "wet meat"
SetUsesPrefix("tool", false)  -- "tool broken"

print("\nAfter custom configuration:")
TestConstruction("meat", "wet")
TestConstruction("tool", "broken")

-- Use function-based configuration
SetUsesPrefix("food", function(inst, name, adjective)
    if adjective == "spoiled" then
        return "spoiled " .. name  -- Always prefix for spoiled
    elseif adjective == "fresh" then
        return name .. " (fresh)"  -- Always suffix with parentheses for fresh
    end
    return nil  -- Use default behavior for other adjectives
end)

-- Test function behavior
local spoiled_result = ConstructAdjectivedName(nil, "food", "spoiled")
local fresh_result = ConstructAdjectivedName(nil, "food", "fresh")
local wet_result = ConstructAdjectivedName(nil, "food", "wet")

print("\nFunction-based configuration:")
print("Spoiled food:", spoiled_result)
print("Fresh food:", fresh_result)
print("Wet food:", wet_result)

-- Mass configuration changes
print("\nMaking all prefixes:")
MakeAllPrefixes()
TestConstruction("weapon", "damaged")
TestConstruction("armor", "reinforced")

print("\nMaking all suffixes:")
MakeAllSuffixes()
TestConstruction("weapon", "damaged")
TestConstruction("armor", "reinforced")

-- Custom mass configuration
print("\nCustom mass configuration:")
MakeAllPrefixes(function(inst, name, adjective)
    return "[" .. adjective .. "] " .. name
end)
TestConstruction("item", "special")

-- Restore defaults for important items
SetUsesPrefix(STRINGS.WET_PREFIX.FOOD, true)
SetUsesPrefix(STRINGS.SMOLDERINGITEM, true)
```

## Language Localization Integration

The module integrates with the game's string system:

```lua
-- Example of how strings are configured
-- These are typically set up in localization files

-- For wet items (usually prefixes in English)
STRINGS.WET_PREFIX = {
    FOOD = "Wet",
    CLOTHING = "Damp", 
    TOOL = "Wet",
    FUEL = "Soggy",
    GENERIC = "Wet"
}

-- Usage in game code
local wet_meat_name = ConstructAdjectivedName(
    meat_inst, 
    STRINGS.NAMES.MEAT, 
    STRINGS.WET_PREFIX.FOOD
)
```

## Advanced Function Configuration

You can use functions for sophisticated naming logic:

```lua
-- Advanced function example
SetUsesPrefix("equipment", function(inst, name, adjective)
    -- Check entity properties
    if inst and inst.components.armor then
        if adjective == "broken" then
            return name .. " (needs repair)"
        elseif adjective == "reinforced" then
            return "reinforced " .. name
        end
    end
    
    -- Check player preferences
    if ThePlayer and ThePlayer.HUD and ThePlayer.HUD.prefixPreference then
        return adjective .. " " .. name
    end
    
    -- Default to suffix
    return name .. " " .. adjective
end)
```

## Common Use Cases

### Wet Items
```lua
-- Wet items typically use prefixes
SetUsesPrefix(STRINGS.WET_PREFIX.FOOD, true)
-- Result: "Wet Meat" instead of "Meat Wet"
```

### Damaged Items
```lua
-- Damaged items might use suffixes
SetUsesPrefix("damaged", false)
-- Result: "Axe Damaged" instead of "Damaged Axe"
```

### Special States
```lua
-- Special states can use custom formatting
SetUsesPrefix("smoldering", function(inst, name, adjective)
    return name .. " (on fire!)"
end)
```

## Related Modules

- [DLC Support](./dlcsupport.md): Main DLC management system
- [DLC Support Worldgen](./dlcsupport_worldgen.md): DLC world generation support
- [Localization](./localization.md): String localization system
- [Entity Script](./entityscript.md): Entity string handling
