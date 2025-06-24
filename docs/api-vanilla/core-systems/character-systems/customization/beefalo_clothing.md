---
title: Beefalo Clothing System
description: Documentation of the Don't Starve Together beefalo clothing system for cosmetic beefalo customization
sidebar_position: 2
slug: /api-vanilla/core-systems/beefalo-clothing
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Beefalo Clothing System

The Beefalo Clothing system in Don't Starve Together provides cosmetic customization options for domesticated beefalo. This system allows players to dress up their beefalo companions with various themed clothing sets, offering visual personalization without affecting gameplay mechanics.

## Version History

| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Updated documentation to match current implementation and corrected symbol override details |

## Overview

The beefalo clothing system serves multiple purposes:
- **Cosmetic Customization**: Allows players to personalize their beefalo's appearance
- **Collection Gameplay**: Provides collectible items through various acquisition methods
- **Visual Identity**: Helps distinguish domesticated beefalo from wild ones
- **Themed Sets**: Offers cohesive visual themes across different clothing pieces

The system is purely cosmetic and does not affect beefalo stats, behavior, or gameplay mechanics.

## Core Architecture

### Clothing Structure

Each beefalo clothing item follows a standardized structure:

```lua
beefalo_clothing_item = {
    type = "clothing_type",           -- Body part category
    skin_tags = { "TAG1", "TAG2" },   -- Classification tags
    symbol_overrides = { "symbol1", "symbol2" }, -- Graphics to replace
    symbol_hides = { "symbol3" },     -- Graphics to hide (optional)
    rarity = "rarity_level",          -- Item rarity
    rarity_modifier = "modifier",     -- Special rarity modifier (optional)
    release_group = number,           -- Release batch identifier
}
```

### Clothing Properties

| Property | Type | Description |
|----------|------|-------------|
| `type` | String | Clothing category (beef_body, beef_feet, beef_head, beef_horn, beef_tail) |
| `skin_tags` | Array | Tags for categorization and filtering |
| `symbol_overrides` | Array | Animation symbols to replace with clothing graphics |
| `symbol_hides` | Array | Animation symbols to hide when clothing is equipped |
| `rarity` | String | Item rarity level (Complimentary, Spiffy, Distinguished, Elegant) |
| `rarity_modifier` | String | Special modifier like "Woven" for premium items |
| `release_group` | Number | Identifies which content update introduced the item |

## Clothing Categories

### Body Parts

The beefalo clothing system covers five distinct body parts:

| Type | Slot | Description | Symbol Overrides |
|------|------|-------------|------------------|
| `beef_body` | Body | Main torso clothing | `beefalo_body`, `beefalo_body_heat` |
| `beef_feet` | Feet | Hoof coverings | `beefalo_hoof` |
| `beef_head` | Head | Facial modifications | `beefalo_beard`, `beefalo_facebase`, `beefalo_headbase`, etc. |
| `beef_horn` | Horn | Horn decorations | `beefalo_antler` |
| `beef_tail` | Tail | Tail accessories | `beefalo_tail` |

### Clothing Themes

All clothing items are organized into thematic sets:

#### Beast Theme
Wild, primitive appearance with natural materials.

| Slot | Item Name | Rarity | Special Notes |
|------|-----------|--------|---------------|
| Body | `beefalo_body_beast` | Complimentary | |
| Feet | `beefalo_feet_beast` | Complimentary | |
| Head | `beefalo_head_beast` | Complimentary | Includes `beefalo_eye` override |
| Horn | `beefalo_horn_beast` | Complimentary | |
| Tail | `beefalo_tail_beast` | Complimentary | |

#### Doll Theme
Cute, toy-like appearance with fabric textures.

| Slot | Item Name | Rarity | Special Notes |
|------|-----------|--------|---------------|
| Body | `beefalo_body_doll` | Complimentary | |
| Feet | `beefalo_feet_doll` | Complimentary | |
| Head | `beefalo_head_doll` | Complimentary | Does not override `beefalo_eye` |
| Horn | `beefalo_horn_doll` | Complimentary | |
| Tail | `beefalo_tail_doll` | Complimentary | |

#### Festive Theme
Holiday-themed decorations and colors.

| Slot | Item Name | Rarity | Special Notes |
|------|-----------|--------|---------------|
| Body | `beefalo_body_festive` | Complimentary | |
| Feet | `beefalo_feet_festive` | Complimentary | |
| Head | `beefalo_head_festive` | Complimentary | Does not override `beefalo_eye` |
| Horn | `beefalo_horn_festive` | Complimentary | |
| Tail | `beefalo_tail_festive` | Complimentary | |

#### Formal Theme
Elegant, dress-up appearance for special occasions.

| Slot | Item Name | Rarity | Special Notes |
|------|-----------|--------|---------------|
| Body | `beefalo_body_formal` | Complimentary | |
| Feet | `beefalo_feet_formal` | Complimentary | |
| Head | `beefalo_head_formal` | Complimentary | Does not override `beefalo_eye` |
| Horn | `beefalo_horn_formal` | Complimentary | |
| Tail | `beefalo_tail_formal` | Complimentary | |

#### Ice Theme
Frozen, crystalline appearance with cool colors.

| Slot | Item Name | Rarity | Special Notes |
|------|-----------|--------|---------------|
| Body | `beefalo_body_ice` | Complimentary | |
| Feet | `beefalo_feet_ice` | Complimentary | |
| Head | `beefalo_head_ice` | Complimentary | Hides `beefalo_eye` |
| Horn | `beefalo_horn_ice` | Complimentary | |
| Tail | `beefalo_tail_ice` | Complimentary | |

#### Lunar Theme ⭐
Premium woven set with celestial motifs.

| Slot | Item Name | Rarity | Modifier | Special Notes |
|------|-----------|--------|----------|---------------|
| Body | `beefalo_body_lunar` | Distinguished | Woven | |
| Feet | `beefalo_feet_lunar` | Spiffy | Woven | |
| Head | `beefalo_head_lunar` | Elegant | Woven | Does not override `beefalo_eye` |
| Horn | `beefalo_horn_lunar` | Distinguished | Woven | |
| Tail | `beefalo_tail_lunar` | Spiffy | Woven | |

#### Nature Theme
Natural, plant-based appearance with earthy tones.

| Slot | Item Name | Rarity | Special Notes |
|------|-----------|--------|---------------|
| Body | `beefalo_body_nature` | Complimentary | |
| Feet | `beefalo_feet_nature` | Complimentary | |
| Head | `beefalo_head_nature` | Complimentary | Hides `beefalo_eye` |
| Horn | `beefalo_horn_nature` | Complimentary | |
| Tail | `beefalo_tail_nature` | Complimentary | |

#### Robot Theme
Mechanical, futuristic appearance with metallic textures.

| Slot | Item Name | Rarity | Special Notes |
|------|-----------|--------|---------------|
| Body | `beefalo_body_robot` | Complimentary | |
| Feet | `beefalo_feet_robot` | Complimentary | |
| Head | `beefalo_head_robot` | Complimentary | Does not override `beefalo_eye` |
| Horn | `beefalo_horn_robot` | Complimentary | |
| Tail | `beefalo_tail_robot` | Complimentary | |

#### Shadow Theme ⭐
Premium woven set with dark, mystical appearance.

| Slot | Item Name | Rarity | Modifier | Special Notes |
|------|-----------|--------|----------|---------------|
| Body | `beefalo_body_shadow` | Distinguished | Woven | |
| Feet | `beefalo_feet_shadow` | Spiffy | Woven | |
| Head | `beefalo_head_shadow` | Elegant | Woven | Does not override `beefalo_eye` |
| Horn | `beefalo_horn_shadow` | Distinguished | Woven | |
| Tail | `beefalo_tail_shadow` | Spiffy | Woven | |

#### Victorian Theme
Classic, vintage appearance with period-appropriate styling.

| Slot | Item Name | Rarity | Special Notes |
|------|-----------|--------|---------------|
| Body | `beefalo_body_victorian` | Complimentary | |
| Feet | `beefalo_feet_victorian` | Complimentary | |
| Head | `beefalo_head_victorian` | Complimentary | Does not override `beefalo_eye` |
| Horn | `beefalo_horn_victorian` | Complimentary | |
| Tail | `beefalo_tail_victorian` | Complimentary | |

#### War Theme
Military, armored appearance with battle-ready styling.

| Slot | Item Name | Rarity | Special Notes |
|------|-----------|--------|---------------|
| Body | `beefalo_body_war` | Complimentary | |
| Feet | `beefalo_feet_war` | Complimentary | |
| Head | `beefalo_head_war` | Complimentary | Does not override `beefalo_eye` |
| Horn | `beefalo_horn_war` | Complimentary | |
| Tail | `beefalo_tail_war` | Complimentary | |

## Rarity System

### Rarity Levels

The clothing system uses a four-tier rarity system:

| Rarity | Description | Acquisition |
|--------|-------------|------------|
| **Complimentary** | Standard items freely available | Various in-game methods |
| **Spiffy** | Uncommon items with enhanced appearance | Special events or drops |
| **Distinguished** | Rare items with unique designs | Premium content or achievements |
| **Elegant** | Ultra-rare items with exceptional quality | Exclusive content or limited releases |

### Rarity Modifiers

Special modifiers can enhance rarity:

| Modifier | Description | Examples |
|----------|-------------|----------|
| **Woven** | Premium items obtained through special weaving system | Lunar and Shadow sets |

### Release Groups

Items are organized by release groups for content management:

| Release Group | Description | Themes Included |
|---------------|-------------|-----------------|
| **112** | Initial beefalo clothing release | Beast, Doll, Festive, Formal, Ice, Nature, Robot, Victorian, War |
| **158** | Premium woven clothing update | Lunar, Shadow |

## Implementation Usage

### Accessing Clothing Data

```lua
-- Get all beefalo clothing items
local clothing = require("beefalo_clothing")

-- Access specific clothing item
local lunar_body = BEEFALO_CLOTHING["beefalo_body_lunar"]
print("Type:", lunar_body.type)
print("Rarity:", lunar_body.rarity)
print("Modifier:", lunar_body.rarity_modifier)
```

### Filtering by Category

```lua
-- Get all body clothing
local function GetBodyClothing()
    local body_items = {}
    for name, item in pairs(BEEFALO_CLOTHING) do
        if item.type == "beef_body" then
            body_items[name] = item
        end
    end
    return body_items
end
```

### Filtering by Theme

```lua
-- Get all items from a specific theme
local function GetThemeItems(theme)
    local theme_items = {}
    for name, item in pairs(BEEFALO_CLOTHING) do
        if string.find(name, "_" .. theme .. "$") then
            theme_items[name] = item
        end
    end
    return theme_items
end

-- Get all lunar theme items
local lunar_items = GetThemeItems("lunar")
```

### Rarity Filtering

```lua
-- Get items by rarity
local function GetItemsByRarity(rarity, modifier)
    local filtered_items = {}
    for name, item in pairs(BEEFALO_CLOTHING) do
        if item.rarity == rarity then
            if not modifier or item.rarity_modifier == modifier then
                filtered_items[name] = item
            end
        end
    end
    return filtered_items
end

-- Get all woven items
local woven_items = GetItemsByRarity(nil, "Woven")
```

## Symbol Management

### Symbol Override System

The clothing system uses symbol overrides to replace beefalo graphics. Each head item has a different set of symbol overrides:

```lua
-- Access symbol override data
print("Override symbols:")
for symbol in pairs(BEEFALO_CLOTHING_SYMBOLS) do
    print("  " .. symbol)
end

-- Check if symbol is used by clothing
local function IsClothingSymbol(symbol)
    return BEEFALO_CLOTHING_SYMBOLS[symbol] == true
end

-- Example: Compare head item symbol overrides
local beast_head = BEEFALO_CLOTHING["beefalo_head_beast"]
local doll_head = BEEFALO_CLOTHING["beefalo_head_doll"]

print("Beast head symbols:", table.concat(beast_head.symbol_overrides, ", "))
-- Output: beefalo_beard, beefalo_eye, beefalo_facebase, beefalo_headbase, beefalo_jowls, beefalo_lip_crease, beefalo_mouthmouth, beefalo_nose, beffalo_lips

print("Doll head symbols:", table.concat(doll_head.symbol_overrides, ", "))
-- Output: beefalo_beard, beefalo_facebase, beefalo_headbase, beefalo_jowls, beefalo_lip_crease, beefalo_mouthmouth, beefalo_nose, beffalo_lips
-- Note: Does not include beefalo_eye
```

### Symbol Hiding System

Some clothing items hide specific symbols:

```lua
-- Access symbol hide data
print("Hidden symbols:")
for symbol in pairs(BEEFALO_HIDE_SYMBOLS) do
    print("  " .. symbol)
end

-- Check if symbol is hidden by clothing
local function IsHiddenSymbol(symbol)
    return BEEFALO_HIDE_SYMBOLS[symbol] == true
end
```

### Complete Theme Sets

```lua
-- Validate complete theme set
local function HasCompleteSet(theme)
    local required_types = {"beef_body", "beef_feet", "beef_head", "beef_horn", "beef_tail"}
    for _, clothing_type in ipairs(required_types) do
        local item_name = "beefalo_" .. clothing_type:sub(6) .. "_" .. theme
        if not BEEFALO_CLOTHING[item_name] then
            return false
        end
    end
    return true
end
```

## Animation Integration

### Symbol Replacement

```lua
-- Apply clothing symbols to beefalo animation
local function ApplyClothing(beefalo, clothing_item)
    if clothing_item.symbol_overrides then
        for _, symbol in ipairs(clothing_item.symbol_overrides) do
            beefalo.AnimState:OverrideSymbol(symbol, clothing_item.build, symbol)
        end
    end
    
    if clothing_item.symbol_hides then
        for _, symbol in ipairs(clothing_item.symbol_hides) do
            beefalo.AnimState:HideSymbol(symbol)
        end
    end
end
```

### Clothing Removal

```lua
-- Remove clothing and restore original symbols
local function RemoveClothing(beefalo, clothing_item)
    if clothing_item.symbol_overrides then
        for _, symbol in ipairs(clothing_item.symbol_overrides) do
            beefalo.AnimState:ClearOverrideSymbol(symbol)
        end
    end
    
    if clothing_item.symbol_hides then
        for _, symbol in ipairs(clothing_item.symbol_hides) do
            beefalo.AnimState:ShowSymbol(symbol)
        end
    end
end
```

## Best Practices

### 1. Theme Consistency

```lua
-- Good: Apply complete theme sets
local function ApplyThemeSet(beefalo, theme)
    local types = {"body", "feet", "head", "horn", "tail"}
    for _, part in ipairs(types) do
        local item_name = "beefalo_" .. part .. "_" .. theme
        local clothing = BEEFALO_CLOTHING[item_name]
        if clothing then
            ApplyClothing(beefalo, clothing)
        end
    end
end

-- Bad: Mixing incompatible themes
-- ApplyClothing(beefalo, BEEFALO_CLOTHING["beefalo_body_formal"])
-- ApplyClothing(beefalo, BEEFALO_CLOTHING["beefalo_head_robot"]) -- Visual mismatch!
```

### 2. Rarity-Based Availability

```lua
-- Control clothing availability based on rarity
local function CanUnlockClothing(player, clothing_item)
    if clothing_item.rarity == "Complimentary" then
        return true -- Always available
    elseif clothing_item.rarity_modifier == "Woven" then
        return player:HasWeavingAccess() -- Check special access
    else
        return player:HasRarityUnlocked(clothing_item.rarity)
    end
end
```

### 3. Performance Optimization

```lua
-- Cache clothing lookups for frequently accessed data
local clothing_cache = {}

local function GetClothingByType(clothing_type)
    if not clothing_cache[clothing_type] then
        clothing_cache[clothing_type] = {}
        for name, item in pairs(BEEFALO_CLOTHING) do
            if item.type == clothing_type then
                clothing_cache[clothing_type][name] = item
            end
        end
    end
    return clothing_cache[clothing_type]
end
```

### 4. Validation

```lua
-- Validate clothing data integrity
local function ValidateClothingItem(name, item)
    local required_fields = {"type", "skin_tags", "symbol_overrides", "rarity", "release_group"}
    for _, field in ipairs(required_fields) do
        if not item[field] then
            print("Warning: Missing field '" .. field .. "' in " .. name)
            return false
        end
    end
    return true
end
```

## Troubleshooting

### Common Issues

**Clothing not appearing**: Check that symbol overrides are correctly applied

```lua
-- Debug clothing application
local function DebugClothing(beefalo, clothing_item)
    print("Applying clothing:", clothing_item.type)
    for _, symbol in ipairs(clothing_item.symbol_overrides) do
        print("  Override symbol:", symbol)
        -- Verify override was applied
        if beefalo.AnimState:IsSymbolOverridden(symbol) then
            print("    ✓ Applied successfully")
        else
            print("    ✗ Override failed")
        end
    end
end
```

**Symbol conflicts**: Ensure clothing items don't conflict with other overrides

```lua
-- Check for symbol conflicts
local function CheckSymbolConflicts(clothing1, clothing2)
    local conflicts = {}
    for _, symbol1 in ipairs(clothing1.symbol_overrides) do
        for _, symbol2 in ipairs(clothing2.symbol_overrides) do
            if symbol1 == symbol2 then
                table.insert(conflicts, symbol1)
            end
        end
    end
    return conflicts
end
```

**Missing clothing data**: Verify clothing item exists

```lua
-- Safe clothing access
local function GetClothingSafe(item_name)
    local clothing = BEEFALO_CLOTHING[item_name]
    if not clothing then
        print("Warning: Clothing item not found:", item_name)
        return nil
    end
    return clothing
end
```

### Debugging Tools

```lua
-- Comprehensive clothing debug information
local function DebugClothingSystem()
    print("=== Beefalo Clothing Debug ===")
    print("Total clothing items:", GetTableSize(BEEFALO_CLOTHING))
    
    local type_counts = {}
    local rarity_counts = {}
    local theme_counts = {}
    
    for name, item in pairs(BEEFALO_CLOTHING) do
        -- Count by type
        type_counts[item.type] = (type_counts[item.type] or 0) + 1
        
        -- Count by rarity
        local rarity_key = item.rarity .. (item.rarity_modifier and ("_" .. item.rarity_modifier) or "")
        rarity_counts[rarity_key] = (rarity_counts[rarity_key] or 0) + 1
        
        -- Count by theme
        local theme = name:match("_([^_]+)$")
        if theme then
            theme_counts[theme] = (theme_counts[theme] or 0) + 1
        end
    end
    
    print("\nBy Type:")
    for type_name, count in pairs(type_counts) do
        print("  " .. type_name .. ": " .. count)
    end
    
    print("\nBy Rarity:")
    for rarity, count in pairs(rarity_counts) do
        print("  " .. rarity .. ": " .. count)
    end
    
    print("\nBy Theme:")
    for theme, count in pairs(theme_counts) do
        print("  " .. theme .. ": " .. count)
    end
    
    print("\nSymbol Statistics:")
    print("  Override symbols:", GetTableSize(BEEFALO_CLOTHING_SYMBOLS))
    print("  Hidden symbols:", GetTableSize(BEEFALO_HIDE_SYMBOLS))
end
```

## See Also

- [Character Systems](character-systems/) - Player progression and unlockables
- [Clothing System](../character-systems/clothing) - Human character clothing
- [Skins System](../character-systems/skins) - General skin system
- [Beefalo Domestication](domesticated_beefalo) - Beefalo taming mechanics
