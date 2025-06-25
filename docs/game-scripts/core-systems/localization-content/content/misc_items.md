---
id: misc_items
title: Misc Items
description: Comprehensive catalog of miscellaneous cosmetic items, emojis, loading screens, and purchasable content
sidebar_position: 1
slug: gams-scripts/core-systems/misc-items
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Misc Items

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `MISC_ITEMS` module contains a comprehensive catalog of all miscellaneous cosmetic items available in Don't Starve Together. This auto-generated data structure defines various types of cosmetic content including emojis, loading screens, character beards, and purchasable item packs.

This module serves as the central registry for all non-gameplay affecting items that can be collected, purchased, or unlocked through various means in the game.

## Data Structure

The `MISC_ITEMS` table is a large associative array where each key is an item identifier and each value is a table containing the item's properties and metadata.

### Basic Structure

```lua
MISC_ITEMS = {
    item_id = {
        type = "item_type",
        skin_tags = { "TAG1", "TAG2", ... },
        rarity = "rarity_level",
        rarity_modifier = "modifier_type",
        release_group = number,
        -- Additional properties based on item type
    },
    -- ... thousands of items
}
```

## Item Types

The module contains several distinct types of items, with varying quantities:

| Item Type | Count | Description |
|-----------|-------|-------------|
| `purchase` | 452 | Purchasable content packs |
| `profileflair` | 235 | Profile decorative elements |
| `playerportrait` | 135 | Player portrait backgrounds |
| `loading` | 116 | Loading screen backgrounds |
| `emoji` | 50 | Chat emojis |
| `beard` | 33 | Character facial hair |
| `mysterybox` | 18 | Random loot containers |
| `box` | 5 | Special containers |

### Emoji Items

**Type:** `"emoji"`

**Description:**
Cosmetic emojis that players can use in chat communication.

**Common Properties:**
- `type`: Always `"emoji"`
- `skin_tags`: Theme tags like `"VICTORIAN"`, `"LAVA"`, `"EMOJI"`
- `rarity`: Usually `"Common"`
- `rarity_modifier`: Usually `"Woven"`
- `release_group`: Numeric group identifier

**Example:**
```lua
emoji_abigail = {
    type = "emoji",
    skin_tags = { "VICTORIAN", "EMOJI" },
    rarity = "Common",
    rarity_modifier = "Woven",
    release_group = 43,
}
```

### Loading Screens

**Type:** `"loading"`

**Description:**
Decorative loading screen backgrounds that display while entering worlds.

**Common Properties:**
- `type`: Always `"loading"`
- `skin_tags`: Theme tags like `"LOADING"`, `"SHORTS"`, `"VICTORIAN"`
- `rarity`: Usually `"Classy"`
- `rarity_modifier`: Usually `"Woven"`
- `release_group`: Numeric group identifier

**Example:**
```lua
loading_wilson_feast = {
    type = "loading",
    skin_tags = { "ICE", "LOADING" },
    rarity = "Classy",
    rarity_modifier = "Woven",
    release_group = 54,
}
```

### Character Beards

**Type:** `"beard"`

**Description:**
Cosmetic facial hair options for applicable characters (primarily Wilson and Webber).

**Common Properties:**
- `type`: Always `"beard"`
- `skin_tags`: Character and theme tags like `"WILSON_BEARD"`, `"WEBBER_BEARD"`
- `rarity`: Usually `"Classy"`
- `rarity_modifier`: Usually `"Woven"`
- `release_group`: Numeric group identifier

**Example:**
```lua
wilson_beard_formal = {
    type = "beard",
    skin_tags = { "FORMAL", "WILSON_BEARD" },
    rarity = "Classy",
    rarity_modifier = "Woven",
    release_group = 97,
}
```

### Profile Flair

**Type:** `"profileflair"`

**Description:**
Decorative elements that can be displayed on player profiles, such as badges and emblems.

**Common Properties:**
- `type`: Always `"profileflair"`
- `skin_tags`: Theme tags like `"PROFILEFLAIR"`, `"LAVA"`, `"ROSE"`, `"PLANETS"`
- `rarity`: Often `"Common"` or `"Loyal"`
- `rarity_modifier`: Usually `"Woven"` (when present)
- `release_group`: Numeric group identifier

**Example:**
```lua
profileflair_amulet_red_rose = {
    type = "profileflair",
    skin_tags = { "ROSE", "PROFILEFLAIR" },
    rarity = "Loyal",
}
```

### Player Portraits

**Type:** `"playerportrait"`

**Description:**
Background images for player portraits in the game interface.

**Common Properties:**
- `type`: Always `"playerportrait"`
- `skin_tags`: Theme tags like `"PLAYERPORTRAIT"`, `"VICTORIAN"`, `"PLANETS"`
- `rarity`: Usually `"Classy"` or `"Loyal"`
- `rarity_modifier`: Usually `"Woven"` (when present)
- `release_group`: Numeric group identifier

**Example:**
```lua
playerportrait_bg_amuletredrose = {
    type = "playerportrait",
    skin_tags = { "ROSE", "PLAYERPORTRAIT" },
    rarity = "Loyal",
    release_group = 155,
}
```

### Mystery Boxes

**Type:** `"mysterybox"`

**Description:**
Special containers that provide random cosmetic items when opened.

**Common Properties:**
- `type`: Always `"mysterybox"`
- `skin_tags`: Usually contains `"MYSTERYBOX"`
- `build_name_override`: Display build name
- `box_build`: Box style for interface display
- `rarity`: Usually `"Common"`
- `rarity_modifier`: Usually `"Woven"`
- `release_group`: Numeric group identifier

**Example:**
```lua
mysterybox_beards = {
    type = "mysterybox",
    skin_tags = { "MYSTERYBOX" },
    build_name_override = "mysterybox_classic_4",
    box_build = "box_mystery_classic",
    rarity = "Common",
    rarity_modifier = "Woven",
    release_group = 97,
}
```

### Purchase Packs

**Type:** `"purchase"`

**Description:**
Purchasable content packs containing multiple cosmetic items, often character skin sets.

**Properties:**
- `type`: Always `"purchase"`
- `skin_tags`: Usually empty array
- `featured_pack`: Boolean indicating if prominently featured
- `steam_dlc_id`: Steam DLC identifier (for paid content)
- `display_order`: Numeric order for UI display
- `build_name_override`: Override build name for display
- `display_atlas`: Atlas file for pack preview
- `display_tex`: Texture file for pack preview
- `box_build`: Box style for display
- `display_items`: Array of items shown in preview
- `output_items`: Array of all items received when purchased
- `release_group`: Numeric group identifier

**Example:**
```lua
pack_walter_deluxe = {
    type = "purchase",
    skin_tags = {},
    featured_pack = true,
    steam_dlc_id = 1338540,
    display_order = 1,
    build_name_override = "pack_common",
    display_atlas = "images/iap_images_walter_deluxe.xml",
    display_tex = "walter_deluxe.tex",
    box_build = "box_shop_plain",
    display_items = { "walter_formal", "walterhat_formal", "walter_detective" },
    output_items = { "walter_formal", "body_walter_formal", "feet_walter_formal" },
    release_group = 99,
}
```

### Special Boxes

**Type:** `"box"`

**Description:**
Special container items with unique properties, fewer in number than mystery boxes.

**Common Properties:**
- `type`: Always `"box"`
- Additional properties vary by specific box type
- `release_group`: Numeric group identifier

## Item Properties

### Universal Properties

All items in the MISC_ITEMS catalog share these common properties:

#### type

**Type:** `string`

**Description:** Defines the category of the item. Determines how the item is used and displayed.

**Valid Values:**
- `"emoji"` - Chat emojis (50 items)
- `"loading"` - Loading screen backgrounds (116 items)
- `"beard"` - Character facial hair (33 items)
- `"purchase"` - Purchasable content packs (452 items)
- `"profileflair"` - Profile decorative elements (235 items)
- `"playerportrait"` - Player portrait backgrounds (135 items)
- `"mysterybox"` - Random loot containers (18 items)
- `"box"` - Special containers (5 items)

#### skin_tags

**Type:** `table (array of strings)`

**Description:** Array of tags that categorize the item's theme, character association, or event.

**Common Tags:**
- **Theme Tags:** `"VICTORIAN"`, `"LAVA"`, `"ICE"`, `"SHADOW"`, `"ROSE"`, `"FORMAL"`, `"PLANETS"`
- **Character Tags:** `"WILSON_BEARD"`, `"WEBBER_BEARD"`
- **Type Tags:** `"EMOJI"`, `"LOADING"`, `"PROFILEFLAIR"`, `"PLAYERPORTRAIT"`, `"MYSTERYBOX"`
- **Event Tags:** `"HALLOWED"`, `"YULE"`, `"SHORTS"`

#### rarity

**Type:** `string`

**Description:** Indicates the item's rarity level, affecting its perceived value and availability.

**Valid Values:**
- `"Common"` - Most emoji items and mystery boxes
- `"Classy"` - Loading screens, beards, and portraits
- `"Loyal"` - Special loyalty rewards (profile flair, portraits)
- `"Spiffy"` - Higher tier items
- `"Distinguished"` - Premium items
- `"Elegant"` - Rare items

#### rarity_modifier

**Type:** `string`

**Description:** Additional modifier for rarity classification.

**Common Values:**
- `"Woven"` - Standard modifier for most items

#### release_group

**Type:** `number`

**Description:** Numeric identifier grouping items by their release batch or update cycle.

**Examples:**
- `32` - Lava Arena content
- `43` - Victorian theme items
- `97` - Character-specific formal sets
- `135` - Recent content additions

### Purchase Pack Specific Properties

#### featured_pack

**Type:** `boolean`

**Description:** Whether this pack should be prominently displayed in the store interface.

#### steam_dlc_id

**Type:** `number`

**Description:** Steam DLC identifier for paid content integration.

#### display_order

**Type:** `number`

**Description:** Numeric ordering for store display priority.

#### display_atlas and display_tex

**Type:** `string`

**Description:** File paths for pack preview images in the store interface.

#### display_items vs output_items

**Type:** `table (array of strings)`

**Description:** 
- `display_items`: Items shown in the pack preview (subset)
- `output_items`: Complete list of all items received when purchased

### Mystery Box Specific Properties

#### build_name_override

**Type:** `string`

**Description:** Override build name for display purposes in the mystery box interface.

#### box_build

**Type:** `string`

**Description:** Specifies the visual style/build for the mystery box container display.

## Usage Patterns

### Accessing Item Data

```lua
-- Get specific item information
local emoji_data = MISC_ITEMS.emoji_abigail
print(emoji_data.type) -- "emoji"
print(emoji_data.rarity) -- "Common"

-- Check if item exists
if MISC_ITEMS.wilson_beard_formal then
    print("Formal beard is available")
end
```

### Filtering Items by Type

```lua
-- Get all emoji items
local emojis = {}
for item_id, item_data in pairs(MISC_ITEMS) do
    if item_data.type == "emoji" then
        emojis[item_id] = item_data
    end
end

-- Get all profile flair items
local profile_flair = {}
for item_id, item_data in pairs(MISC_ITEMS) do
    if item_data.type == "profileflair" then
        profile_flair[item_id] = item_data
    end
end

-- Get all mystery boxes
local mystery_boxes = {}
for item_id, item_data in pairs(MISC_ITEMS) do
    if item_data.type == "mysterybox" then
        mystery_boxes[item_id] = item_data
    end
end
```

### Finding Items by Theme

```lua
-- Get all Victorian-themed items
local victorian_items = {}
for item_id, item_data in pairs(MISC_ITEMS) do
    for _, tag in ipairs(item_data.skin_tags) do
        if tag == "VICTORIAN" then
            victorian_items[item_id] = item_data
            break
        end
    end
end
```

### Purchase Pack Analysis

```lua
-- Get all featured purchase packs
local featured_packs = {}
for item_id, item_data in pairs(MISC_ITEMS) do
    if item_data.type == "purchase" and item_data.featured_pack then
        featured_packs[item_id] = item_data
    end
end
```

## Content Categories

### Theme Collections

Items are organized into thematic collections:

- **Victorian**: Classic Don't Starve aesthetic
- **Lava Arena**: Forge event content
- **Ice/Yule**: Winter and holiday themes
- **Shadow**: Dark, mysterious themes
- **Rose**: Elegant floral themes
- **Formal**: Sophisticated dress styles
- **Survivor**: Rugged, practical themes

### Character-Specific Content

Many items are designed for specific characters:

- **Wilson**: Formal suits, various beard styles
- **Webber**: Character-appropriate beard variants
- **Walter**: Detective, formal, and survivor themes
- **Wanda**: Time-themed and steampunk aesthetics

### Event Content

Special items tied to game events:

- **Hallowed Nights**: Halloween-themed items
- **Winter's Feast**: Holiday winter content
- **Forge/Gorge**: Temporary event content
- **Year of the [Animal]**: Lunar New Year themes

## Technical Notes

### File Generation

This file is automatically generated by `export_accountitems.lua`, meaning:

- Manual edits will be overwritten during updates
- Content is synchronized with the game's item database
- New items are automatically included in builds

### Performance Considerations

- The table contains 1,044+ items across 8 different types (~10,705 lines total)
- Consider caching frequently accessed subsets by type
- Use efficient iteration patterns for bulk operations
- Index by type or tags for faster lookups
- Purchase packs (452 items) are the most numerous type

### Integration Points

The misc items system integrates with:

- Steam Workshop and DLC system
- In-game store interface
- Character customization systems
- Chat emoji system
- Loading screen rotation

## Related Modules

- [Skin Utils](./skinsutils.md): Utilities for managing character skins
- [Skin Assets](./skin_assets.md): Asset definitions for cosmetic items
- [Emotes](./emotes.md): Character emote system
- [Player Profile](./playerprofile.md): Player customization and preferences

## Data Integrity

### Validation Rules

When working with MISC_ITEMS data:

1. **Type Validation**: Ensure `type` field matches expected categories
2. **Tag Consistency**: Verify skin_tags contain valid, consistent values
3. **Rarity Hierarchy**: Confirm rarity levels follow established hierarchy
4. **Release Group**: Ensure release_group numbers are positive integers
5. **Pack Completeness**: Verify purchase packs have all required display properties
