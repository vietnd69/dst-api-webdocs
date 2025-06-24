---
id: item-blacklist
title: Item Blacklist
description: Blacklist system for controlling item display visibility in the UI
sidebar_position: 104
slug: core-systems/item-blacklist
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Item Blacklist

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `item_blacklist.lua` module defines a blacklist system that controls which items should not be displayed in various UI contexts. This is primarily used to hide items that are variants, duplicates, or internal items that shouldn't be shown to players.

## Usage Example

```lua
-- Check if an item should be hidden from display
if ITEM_DISPLAY_BLACKLIST[item_key] then
    -- Item is blacklisted, don't show it
    return
end
```

## Constants

### ITEM_DISPLAY_BLACKLIST

**Status:** `stable`

**Description:**
A table that maps item keys to `true` values for items that should be hidden from display in the UI. This blacklist is automatically generated and includes various skin variants, builder items, and other items that shouldn't be shown to players.

**Type:** `table<string, boolean>`

**Usage Pattern:**
Items are blacklisted for several reasons:
- **Skin Variants**: Items like `abigail_flower_ancient`, `abigail_flower_creepy` that are variants of base items
- **Builder Items**: Items ending in `_builder` that are construction variants
- **Internal Items**: Items used internally but not meant for player display
- **Duplicate Variants**: Multiple versions of the same conceptual item

**Example:**
```lua
-- Check if an item is blacklisted
local function ShouldDisplayItem(item_key)
    return not ITEM_DISPLAY_BLACKLIST[item_key]
end

-- Filter a list of items
local function FilterDisplayableItems(item_list)
    local filtered = {}
    for _, item_key in ipairs(item_list) do
        if not ITEM_DISPLAY_BLACKLIST[item_key] then
            table.insert(filtered, item_key)
        end
    end
    return filtered
end
```

**Common Blacklisted Categories:**
- Abigail flower variants (ancient, creepy, formal, etc.)
- Bernie variants for different forms
- Building/construction item variants
- Skin variants for various items
- Internal boat and dock components
- Upgraded versions of base items

## Related Modules

- [Skins Utils](./skinsutils.md): Uses this blacklist in `ShouldDisplayItemInCollection()`
- [Prefabs](./prefabs.md): Item definitions that may be blacklisted
- [Misc Items](./misc_items.md): Contains item data that this blacklist filters
