---
title: "Clothing"
description: "Character clothing and cosmetic item data structure for skins and appearance customization"
sidebar_position: 12
slug: /api-vanilla/core-systems/clothing
last_updated: "2024-01-15"
build_version: "675312"
change_status: "stable"
---

# Clothing System

The **Clothing** system defines all character clothing and cosmetic items available in Don't Starve Together. This data structure manages character appearance customization including body clothing, accessories, costumes, and skin properties. The system handles visual symbol overrides, rarity classifications, and marketplace configurations for all cosmetic items.

## Overview

The Clothing system is a comprehensive data table that defines every cosmetic item available in DST. Each clothing item specifies visual properties, character compatibility, rarity levels, and marketplace availability. The system supports multiple clothing types and provides character-specific customizations through symbol overrides and visual modifications.

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 675312 | 2024-01-15 | Current stable release with full clothing catalog |
| Previous | Various | Incremental clothing additions through game updates |

## Data Structure

### Global CLOTHING Table

The main `CLOTHING` table contains all clothing definitions organized by item ID:

```lua
CLOTHING = {
    clothing_item_id = {
        type = "body",                    -- Clothing type
        skin_tags = { "CLOTHING_BODY", "CLOTHING" },
        symbol_overrides = { "torso", "arm_upper" },
        rarity = "Spiffy",
        marketable = true,
        release_group = 0,
        -- Additional properties...
    }
}
```

### Clothing Types

The system supports multiple clothing categories:

#### Body Clothing (`type = "body"`)
- **Primary Torso Items**: Shirts, dresses, costumes, armor
- **Coverage**: Torso, arms, sometimes legs
- **Symbol Overrides**: `torso`, `arm_upper`, `arm_lower`, `torso_pelvis`

#### Hand Clothing (`type = "hand"`)
- **Accessories**: Gloves, gauntlets, bracers, cuffs
- **Coverage**: Hands and lower arms
- **Symbol Overrides**: `hand`, `arm_lower_cuff`

#### Leg Clothing (`type = "legs"`)
- **Lower Body Items**: Pants, skirts, leg armor, boots
- **Coverage**: Legs, sometimes feet
- **Symbol Overrides**: `leg`, `torso_pelvis`, `foot`

#### Feet Clothing (`type = "feet"`)
- **Footwear**: Shoes, boots, sandals
- **Coverage**: Feet only
- **Symbol Overrides**: `foot`

#### Head Clothing (`type = "head"`)
- **Headwear**: Hats, helmets, crowns, masks
- **Coverage**: Head area
- **Symbol Overrides**: Various head-related symbols

## Core Properties

### Essential Properties

#### `type` (string)
Defines the clothing category and equipment slot:
- `"body"` - Primary clothing items
- `"hand"` - Hand accessories and gloves
- `"legs"` - Lower body clothing
- `"feet"` - Footwear
- `"head"` - Headwear

#### `skin_tags` (table)
Classification tags for filtering and organization:
```lua
skin_tags = { 
    "CLOTHING_BODY",  -- Category identifier
    "CLOTHING",       -- General clothing tag
    "BLUE",          -- Color classification
    "FORMAL"         -- Style classification
}
```

#### `symbol_overrides` (table)
Character sprite symbols to replace with clothing variants:
```lua
symbol_overrides = { 
    "torso",      -- Main body symbol
    "arm_upper",  -- Upper arm symbol
    "arm_lower"   -- Lower arm symbol
}
```

### Visual Customization Properties

#### `symbol_hides` (table)
Character symbols to hide when wearing this clothing:
```lua
symbol_hides = { "arm_upper_skin", "skirt" }
```

#### `symbol_shows` (table)
Character symbols to force visible when wearing this clothing:
```lua
symbol_shows = { "arm_upper_skin" }
```

#### `symbol_in_base_hides` (table)
Base character symbols to hide in the character template:
```lua
symbol_in_base_hides = { "arm_lower_cuff" }
```

#### `symbol_overrides_powerup` (table)
Alternative symbol overrides for powered-up character states:
```lua
symbol_overrides_powerup = {
    torso = "torso_powerup",
    arm_upper = "arm_upper_powerup"
}
```

#### `symbol_overrides_by_character` (table)
Character-specific symbol override mappings:
```lua
symbol_overrides_by_character = {
    default = { hand = "hand_wilson" },
    walter = { hand = "hand_walter" },
    wurt = { hand = "hand_wurt" }
}
```

### Visual Styling Properties

#### `torso_tuck` (string)
How the clothing integrates with lower body items:
- `"untucked"` - Clothing hangs loose
- `"full"` - Fully tucked appearance
- `"pelvis_skirt"` - Tucked at pelvis level
- `"skirt"` - Skirt-style tucking

#### `feet_cuff_size` (number)
Size of clothing cuffs over footwear (0-5 scale)

#### `legs_cuff_size` (number)
Size of leg clothing cuffs (0-5 scale)

#### `has_leg_boot` (boolean)
Whether the clothing includes built-in boot styling

#### `spinnable_tail` (boolean)
Whether clothing includes animated tail elements

### Item Classification Properties

#### `rarity` (string)
Item rarity classification affecting visual presentation:
- `"Common"` - Basic items
- `"Spiffy"` - Uncommon items
- `"Classy"` - Rare items
- `"Distinguished"` - Epic items
- `"HeirloomDistinguished"` - Legendary items

#### `rarity_modifier` (string)
Additional rarity classification:
- `"Woven"` - Indicates obtainable through weaving system

#### `marketable` (boolean)
Whether the item can be traded on Steam marketplace

#### `release_group` (number)
Release version group for content updates

### Alternative Build Properties

#### `build_name_override` (string)
Alternative build file to use for rendering:
```lua
build_name_override = "body_catcoon_costume"
```

## Common Clothing Examples

### Basic Body Clothing
```lua
body_buttons_blue_sky = {
    type = "body",
    skin_tags = { "CLOTHING_BODY", "CLOTHING", "BLUE" },
    symbol_overrides = { "torso", "arm_upper" },
    torso_tuck = "untucked",
    marketable = true,
    release_group = 0
}
```

### Character Costume
```lua
body_catcoon_costume = {
    type = "body",
    skin_tags = { "COSTUME", "CLOTHING_BODY", "CLOTHING" },
    symbol_overrides = { 
        "arm_lower", "arm_upper_skin", "hand", 
        "torso", "torso_pelvis", "leg", "foot", "tail" 
    },
    symbol_hides = { "skirt", "arm_upper" },
    symbol_in_base_hides = { "arm_lower_cuff" },
    torso_tuck = "untucked",
    rarity = "HeirloomDistinguished",
    spinnable_tail = true,
    marketable = true,
    release_group = 15
}
```

### Character-Specific Hand Item
```lua
hand_winona_ice = {
    type = "hand",
    skin_tags = { "CLOTHING_HAND", "CLOTHING", "ICE" },
    symbol_overrides = { "hand" },
    symbol_overrides_by_character = {
        default = { hand = "hand_wilson" },
        walter = { hand = "hand_walter" },
        wurt = { hand = "hand_wurt" },
        wx78 = { hand = "hand_wx78" }
    },
    symbol_in_base_hides = { "arm_lower_cuff" },
    rarity = "Spiffy",
    rarity_modifier = "Woven",
    release_group = 109
}
```

### Woven Variant Clothing
```lua
body_chester_costumep = {
    type = "body",
    build_name_override = "body_chester_costume",
    skin_tags = { "COSTUME", "CLOTHING_BODY", "CLOTHING" },
    symbol_overrides = { 
        "arm_lower", "arm_upper", "arm_upper_skin", 
        "hand", "torso", "torso_pelvis", "leg", "foot" 
    },
    symbol_hides = { "skirt" },
    symbol_in_base_hides = { "arm_lower_cuff" },
    torso_tuck = "untucked",
    rarity = "Distinguished",
    rarity_modifier = "Woven",
    release_group = 105
}
```

## Usage Patterns

### Accessing Clothing Data
```lua
-- Get specific clothing item
local clothing_item = CLOTHING["body_catcoon_costume"]

-- Check clothing type
if clothing_item.type == "body" then
    print("This is body clothing")
end

-- Access symbol overrides
for _, symbol in ipairs(clothing_item.symbol_overrides) do
    print("Overrides symbol:", symbol)
end
```

### Filtering by Properties
```lua
-- Find all body clothing
local body_items = {}
for item_id, item_data in pairs(CLOTHING) do
    if item_data.type == "body" then
        body_items[item_id] = item_data
    end
end

-- Find marketable items
local marketable_items = {}
for item_id, item_data in pairs(CLOTHING) do
    if item_data.marketable then
        marketable_items[item_id] = item_data
    end
end
```

### Checking Rarity Classifications
```lua
-- Categorize by rarity
local rarity_categories = {}
for item_id, item_data in pairs(CLOTHING) do
    local rarity = item_data.rarity or "Common"
    if not rarity_categories[rarity] then
        rarity_categories[rarity] = {}
    end
    table.insert(rarity_categories[rarity], item_id)
end
```

## Character Integration

### Symbol Override System
The clothing system uses symbol overrides to replace character sprite elements:

1. **Base Character Symbols**: Default character appearance
2. **Clothing Symbols**: Replacement sprites from clothing build files
3. **Character-Specific Overrides**: Per-character customizations
4. **Powerup Variants**: Alternative sprites for enhanced states

### Visual Layering
Clothing items layer over character sprites using:
- **Symbol Replacement**: Direct symbol substitution
- **Symbol Hiding**: Concealing base character elements
- **Symbol Showing**: Forcing visibility of specific elements
- **Layering Order**: Proper visual stacking of clothing elements

## Data Management

### Auto-Generation
The clothing data is auto-generated by `export_accountitems.lua`:
```lua
-- AUTOGENERATED CODE BY export_accountitems.lua
CLOTHING = {
    -- Generated clothing definitions...
}
```

### Release Groups
Items are organized by release groups corresponding to game updates:
- **Group 0**: Base game items
- **Group 3**: Lunar New Year items
- **Group 15**: Halloween costume items
- **Group 64**: General seasonal items

### Content Updates
New clothing items are added through:
1. **Game Updates**: Official content releases
2. **Seasonal Events**: Limited-time cosmetics
3. **DLC Content**: Expansion-specific items
4. **Community Items**: Workshop integration

## Performance Considerations

### Data Access
- **Direct Lookup**: Use item IDs for efficient access
- **Caching**: Store frequently accessed properties locally
- **Filtering**: Pre-compute category lists for better performance

### Memory Usage
- **Large Dataset**: Contains thousands of clothing definitions
- **Symbol References**: Multiple symbol override tables per item
- **Character Variants**: Expanded data for character-specific overrides

## Integration Points

### Related Systems
- **Character System**: Visual customization and appearance
- **Inventory System**: Item management and storage
- **UI System**: Clothing selection and preview interfaces
- **Network System**: Cosmetic synchronization between clients

### External Dependencies
- **Steam Workshop**: Community content integration
- **Marketplace API**: Trading and item valuation
- **Build System**: Sprite and animation asset loading

## Best Practices

### Data Usage
- Use direct table lookups with known item IDs
- Cache clothing properties for frequently accessed items
- Validate clothing data before applying visual changes
- Handle missing or invalid clothing gracefully

### Performance Optimization
- Minimize clothing data iteration in performance-critical code
- Use clothing categories for efficient filtering
- Cache symbol override calculations
- Batch clothing changes when possible

### Content Management
- Follow naming conventions for new clothing items
- Maintain consistent rarity classifications
- Document custom clothing properties clearly
- Test clothing compatibility across all characters

## Related Systems

- **[Character Systems](../character-systems/)** - Character customization and appearance management
- **[Components](../components/)** - Inventory and equipment component integration
- **[Prefabs](../prefabs.md)** - Character prefab integration with clothing
- **[Networking](../networking.md)** - Cosmetic data synchronization

The Clothing system provides the foundation for all character appearance customization in Don't Starve Together, offering extensive visual modification capabilities while maintaining character identity and game aesthetics.
