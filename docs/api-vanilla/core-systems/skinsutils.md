---
id: skinsutils
title: Skins Utils
description: Comprehensive utility system for managing character skins, items, colors, and inventory
sidebar_position: 270
slug: core-systems/skinsutils
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Skins Utils

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `skinsutils.lua` module provides a comprehensive set of utility functions for managing the skin and customization system in Don't Starve Together. It handles skin data retrieval, rarity management, color schemes, inventory operations, item filtering, and UI display logic.

## Usage Example

```lua
-- Get skin information
local rarity = GetRarityForItem("wilson_formal")
local color = GetColorForItem("wilson_formal")
local skin_name = GetSkinName("wilson_formal")

-- Check ownership and display
if TheInventory:CheckOwnership("wilson_formal") then
    local display_name = GetModifiedRarityStringForItem("wilson_formal")
end
```

## Constants

### SKIN_RARITY_COLORS

**Status:** `stable`

**Description:**
Color definitions for different item rarities used throughout the UI.

**Type:** `table<string, table<number>>`

**Values:**
- `Common`: `{ 0.718, 0.824, 0.851, 1 }` - Light blue for common items
- `Classy`: `{ 0.255, 0.314, 0.471, 1 }` - Dark blue for uncommon items
- `Spiffy`: `{ 0.408, 0.271, 0.486, 1 }` - Purple for rare items
- `Distinguished`: `{ 0.729, 0.455, 0.647, 1 }` - Pink for very rare items
- `Elegant`: `{ 0.741, 0.275, 0.275, 1 }` - Red for extremely rare items
- `HeirloomElegant`: `{ 0.933, 0.365, 0.251, 1 }` - Orange for heirloom items
- `Loyal`: `{ 0.635, 0.769, 0.435, 1 }` - Green for loyalty rewards
- `Event`: `{ 0.957, 0.769, 0.188, 1 }` - Yellow for event items

### RARITY_ORDER

**Status:** `stable`

**Description:**
Numerical ordering for sorting items by rarity, with lower numbers appearing first.

**Type:** `table<string, number>`

### DEFAULT_SKIN_COLOR

**Status:** `stable`

**Description:**
Default color used when an item's rarity cannot be determined.

**Value:** `SKIN_RARITY_COLORS["Common"]`

## Core Functions

### GetSkinData(item) {#get-skin-data}

**Status:** `stable`

**Description:**
Retrieves the complete skin data for an item from all item categories.

**Parameters:**
- `item` (string): The item key to look up

**Returns:**
- (table): The skin data table, or empty table if not found

**Example:**
```lua
local skin_data = GetSkinData("wilson_formal")
print("Rarity:", skin_data.rarity)
print("Type:", skin_data.type)
```

### GetRarityForItem(item) {#get-rarity-for-item}

**Status:** `stable`

**Description:**
Gets the rarity string for an item.

**Parameters:**
- `item` (string): The item key

**Returns:**
- (string): Rarity name ("Common", "Elegant", etc.), defaults to "Common"

**Example:**
```lua
local rarity = GetRarityForItem("wilson_formal")
-- Returns: "Elegant"
```

### GetColorForItem(item) {#get-color-for-item}

**Status:** `stable`

**Description:**
Gets the RGBA color values for an item based on its rarity.

**Parameters:**
- `item` (string): The item key

**Returns:**
- (table): RGBA color array `{r, g, b, a}`

**Example:**
```lua
local color = GetColorForItem("wilson_formal")
-- Returns: { 0.741, 0.275, 0.275, 1 } for Elegant rarity
```

### GetSkinName(item) {#get-skin-name}

**Status:** `stable`

**Description:**
Gets the display name for a skin item.

**Parameters:**
- `item` (string): The item key

**Returns:**
- (string): Localized display name

**Example:**
```lua
local name = GetSkinName("wilson_formal")
-- Returns: "The Dapper"
```

### GetTypeForItem(item) {#get-type-for-item}

**Status:** `stable`

**Description:**
Determines the type category of an item.

**Parameters:**
- `item` (string): The item key

**Returns:**
- (string): Type category ("base", "body", "hand", "legs", "feet", "item", etc.)
- (string): Normalized item name in lowercase

**Example:**
```lua
local item_type, normalized_name = GetTypeForItem("WILSON_FORMAL")
-- Returns: "base", "wilson_formal"
```

## Rarity and Display Functions

### CompareRarities(item_key_a, item_key_b) {#compare-rarities}

**Status:** `stable`

**Description:**
Compares two items by rarity for sorting purposes.

**Parameters:**
- `item_key_a` (string): First item key
- `item_key_b` (string): Second item key

**Returns:**
- (boolean): True if item_key_a should come before item_key_b

### IsHeirloomRarity(rarity) {#is-heirloom-rarity}

**Status:** `stable`

**Description:**
Checks if a rarity is considered an heirloom type.

**Parameters:**
- `rarity` (string): Rarity name

**Returns:**
- (boolean): True if rarity is heirloom variant

**Example:**
```lua
local is_heirloom = IsHeirloomRarity("HeirloomElegant")
-- Returns: true
```

### GetModifiedRarityStringForItem(item) {#get-modified-rarity-string}

**Status:** `stable`

**Description:**
Gets the full rarity display string including any modifiers.

**Parameters:**
- `item` (string): The item key

**Returns:**
- (string): Complete rarity string for display

## Item Classification Functions

### IsDefaultSkin(item_key) {#is-default-skin}

**Status:** `stable`

**Description:**
Checks if an item is a default skin (owned by all players).

**Parameters:**
- `item_key` (string): The item key

**Returns:**
- (boolean): True if this is a default skin

### IsDefaultCharacterSkin(item_key) {#is-default-character-skin}

**Status:** `stable`

**Description:**
Checks if an item is a default character skin (ends with "_none").

**Parameters:**
- `item_key` (string): The item key

**Returns:**
- (boolean): True if this is a default character skin

### IsClothingItem(name) {#is-clothing-item}

**Status:** `stable`

**Description:**
Determines if an item is a clothing item.

**Parameters:**
- `name` (string): The item name

**Returns:**
- (boolean): True if item is clothing

### IsGameplayItem(name) {#is-gameplay-item}

**Status:** `stable`

**Description:**
Checks if an item is used in actual gameplay (not just cosmetic).

**Parameters:**
- `name` (string): The item name

**Returns:**
- (boolean): True if item affects gameplay

## Inventory and Ownership Functions

### GetInventorySkinsList(do_sort) {#get-inventory-skins-list}

**Status:** `stable`

**Description:**
Retrieves a list of all skins in the player's inventory.

**Parameters:**
- `do_sort` (boolean): Whether to sort the list by rarity

**Returns:**
- (table): Array of skin data objects with type, item, rarity, timestamp, and item_id

**Example:**
```lua
local skins = GetInventorySkinsList(true)
for _, skin in ipairs(skins) do
    print(skin.item, skin.rarity)
end
```

### GetOwnedItemCounts() {#get-owned-item-counts}

**Status:** `stable`

**Description:**
Gets count of owned items by item key. This is an expensive operation.

**Returns:**
- (table): Map of item_key to count

**Example:**
```lua
local counts = GetOwnedItemCounts()
local wilson_count = counts["wilson_formal"] or 0
```

### ShouldDisplayItemInCollection(item_type) {#should-display-item-in-collection}

**Status:** `stable`

**Description:**
Determines if an item should be shown in collection displays based on blacklist and ownership rules.

**Parameters:**
- `item_type` (string): The item key

**Returns:**
- (boolean): True if item should be displayed

**Example:**
```lua
if ShouldDisplayItemInCollection("wilson_formal") then
    -- Show item in collection UI
end
```

## Pack and Bundle Functions

### GetPurchasePackOutputItems(item_key) {#get-purchase-pack-output-items}

**Status:** `stable`

**Description:**
Gets the list of items contained in a purchase pack.

**Parameters:**
- `item_key` (string): The pack item key

**Returns:**
- (table): Array of item keys contained in the pack

### IsPackABundle(item_key) {#is-pack-a-bundle}

**Status:** `stable`

**Description:**
Determines if a pack is a bundle (contains sub-packs) and calculates total value.

**Parameters:**
- `item_key` (string): The pack item key

**Returns:**
- (boolean): True if pack is a bundle
- (number): Total value of all sub-packs

### OwnsSkinPack(item_key) {#owns-skin-pack}

**Status:** `stable`

**Description:**
Checks if the player owns all items in a skin pack.

**Parameters:**
- `item_key` (string): The pack item key

**Returns:**
- (boolean): True if all pack items are owned

## Character and Skin Mode Functions

### GetSkinModes(character) {#get-skin-modes}

**Status:** `stable`

**Description:**
Gets available skin modes for a character (normal, ghost, transformation states).

**Parameters:**
- `character` (string): Character name

**Returns:**
- (table): Array of skin mode definitions with type, animations, and display properties

**Example:**
```lua
local modes = GetSkinModes("woodie")
-- Returns modes for normal, ghost, werebeaver, weremoose, weregoose
```

### GetPlayerBadgeData(character, ghost, state_1, state_2, state_3) {#get-player-badge-data}

**Status:** `stable`

**Description:**
Gets display data for player badges based on character and states.

**Parameters:**
- `character` (string): Character name
- `ghost` (boolean): Is ghost state
- `state_1` (boolean): First transformation state
- `state_2` (boolean): Second transformation state  
- `state_3` (boolean): Third transformation state

**Returns:**
- (string): Animation bank
- (string): Animation name
- (string): Skin type
- (number): Scale factor
- (number): Y offset

## Commerce and Trading Functions

### IsUserCommerceAllowedOnItemType(item_key) {#is-user-commerce-allowed}

**Status:** `stable`

**Description:**
Checks if player can buy/sell an item through commerce.

**Parameters:**
- `item_key` (string): The item key

**Returns:**
- (boolean): True if commerce is allowed

### GetCharacterRequiredForItem(item_type) {#get-character-required-for-item}

**Status:** `stable`

**Description:**
Gets the character required to use a base skin item.

**Parameters:**
- `item_type` (string): The item key

**Returns:**
- (string): Required character prefab name

## Validation and Filtering Functions

### ValidateItemsLocal(currentcharacter, selected_skins) {#validate-items-local}

**Status:** `stable`

**Description:**
Validates that selected skins are owned and valid for local use.

**Parameters:**
- `currentcharacter` (string): Current character
- `selected_skins` (table): Map of slot to item_key

**Side Effects:**
Removes invalid items from the selected_skins table.

### GetAffinityFilterForHero(herocharacter) {#get-affinity-filter-for-hero}

**Status:** `stable`

**Description:**
Creates a filter function that only allows items usable by a specific character.

**Parameters:**
- `herocharacter` (string): Character name

**Returns:**
- (function): Filter function that takes item_key and returns boolean

**Example:**
```lua
local wilson_filter = GetAffinityFilterForHero("wilson")
local can_use = wilson_filter("wilson_formal") -- Returns true
```

## Utility Functions

### DoesItemHaveTag(item, tag) {#does-item-have-tag}

**Status:** `stable`

**Description:**
Checks if an item has a specific tag.

**Parameters:**
- `item` (string): Item key
- `tag` (string): Tag to check for

**Returns:**
- (boolean): True if item has the tag

### GetEventIconForItem(item) {#get-event-icon-for-item}

**Status:** `stable`

**Description:**
Gets the event icon identifier for an item based on its tags.

**Parameters:**
- `item` (string): Item key

**Returns:**
- (string|nil): Event icon key or nil if no event

### CopySkinsList(list) {#copy-skins-list}

**Status:** `stable`

**Description:**
Creates a deep copy of a skins list.

**Parameters:**
- `list` (table): Array of skin data objects

**Returns:**
- (table): Deep copy of the list

## Related Modules

- [Item Blacklist](./item_blacklist.md): Used for filtering displayable items
- [Prefabs](./prefabs.md): Contains skin definitions
- [Clothing](./clothing.md): Clothing item definitions
- [Misc Items](./misc_items.md): Miscellaneous item definitions
- [Skin Affinity Info](./skin_affinity_info.md): Character-item relationships
- [Skin Set Info](./skin_set_info.md): Item set and collection data
