---
id: skinsutils
title: Skins Utils
description: Comprehensive utility system for managing character skins, items, colors, and inventory
sidebar_position: 270

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

### GetWeaveableSkinFilter() {#get-weaveable-skin-filter}

**Status:** `stable`

**Description:**
Creates a filter function that only allows items that can be woven.

**Returns:**
- (function): Filter function for weaveable items

**Example:**
```lua
local weaveable_filter = GetWeaveableSkinFilter()
local can_weave = weaveable_filter("wilson_formal")
```

### GetLockedSkinFilter() {#get-locked-skin-filter}

**Status:** `stable`

**Description:**
Creates a filter function that only allows default skins or owned items.

**Returns:**
- (function): Filter function for owned/default items

## Sorting and Comparison Functions

### CompareItemDataForSortByRelease(item_key_a, item_key_b) {#compare-item-data-for-sort-by-release}

**Status:** `stable`

**Description:**
Compares two items for sorting by release group, then rarity, then name.

**Parameters:**
- `item_key_a` (string): First item key
- `item_key_b` (string): Second item key

**Returns:**
- (boolean): True if item_key_a should come before item_key_b

### CompareItemDataForSortByRarity(item_key_a, item_key_b) {#compare-item-data-for-sort-by-rarity}

**Status:** `stable`

**Description:**
Compares two items for sorting by rarity, then name.

**Parameters:**
- `item_key_a` (string): First item key
- `item_key_b` (string): Second item key

**Returns:**
- (boolean): True if item_key_a should come before item_key_b

### CompareItemDataForSortByName(item_key_a, item_key_b) {#compare-item-data-for-sort-by-name}

**Status:** `stable`

**Description:**
Compares two items for sorting by name.

**Parameters:**
- `item_key_a` (string): First item key
- `item_key_b` (string): Second item key

**Returns:**
- (boolean): True if item_key_a should come before item_key_b

### CompareItemDataForSortByCount(item_key_a, item_key_b, item_counts) {#compare-item-data-for-sort-by-count}

**Status:** `stable`

**Description:**
Compares two items for sorting by owned count.

**Parameters:**
- `item_key_a` (string): First item key
- `item_key_b` (string): Second item key
- `item_counts` (table): Map of item_key to count

**Returns:**
- (boolean): True if item_key_a should come before item_key_b

## Build and Asset Functions

### GetBuildForItem(name) {#get-build-for-item}

**Status:** `stable`

**Description:**
Gets the build name for an item, using override if available.

**Parameters:**
- `name` (string): Item key

**Returns:**
- (string): Build name for the item

### GetBigPortraitAnimForItem(item_key) {#get-big-portrait-anim-for-item}

**Status:** `stable`

**Description:**
Gets the big portrait animation data for an item.

**Parameters:**
- `item_key` (string): Item key

**Returns:**
- (table|nil): Animation data or nil if not available

### GetPortraitNameForItem(item_key) {#get-portrait-name-for-item}

**Status:** `stable`

**Description:**
Gets the portrait name for display purposes.

**Parameters:**
- `item_key` (string): Item key

**Returns:**
- (string): Portrait name

### GetSkinInvIconName(item) {#get-skin-inv-icon-name}

**Status:** `stable`

**Description:**
Gets the inventory icon name for a skin item.

**Parameters:**
- `item` (string): Item key

**Returns:**
- (string): Icon name for inventory display

## Collection and Set Functions

### GetItemCollectionName(item_type) {#get-item-collection-name}

**Status:** `stable`

**Description:**
Gets the collection name for an item if it belongs to a collection.

**Parameters:**
- `item_type` (string): Item key

**Returns:**
- (string|nil): Collection name or nil if not in collection

### IsItemInCollection(item_type) {#is-item-in-collection}

**Status:** `stable`

**Description:**
Checks if an item is part of a collection/ensemble.

**Parameters:**
- `item_type` (string): Item key

**Returns:**
- (boolean): True if item is in collection
- (string): Bonus item key if in collection

### WillUnravelBreakEnsemble(item_type) {#will-unravel-break-ensemble}

**Status:** `stable`

**Description:**
Checks if unraveling an item would break a completed ensemble.

**Parameters:**
- `item_type` (string): Item key

**Returns:**
- (boolean): True if unraveling would break ensemble

### GetSkinCollectionCompletionForHero(herocharacter) {#get-skin-collection-completion-for-hero}

**Status:** `stable`

**Description:**
Gets collection completion status for a character.

**Parameters:**
- `herocharacter` (string): Character name

**Returns:**
- (number): Count of owned items
- (number): Count of needed items
- (boolean): Has heirloom bonus

## Mystery Box Functions

### GetMysteryBoxCounts() {#get-mystery-box-counts}

**Status:** `stable`

**Description:**
Gets count of mystery boxes by type.

**Returns:**
- (table): Map of box type to count

### GetTotalMysteryBoxCount() {#get-total-mystery-box-count}

**Status:** `stable`

**Description:**
Gets total count of all mystery boxes.

**Returns:**
- (number): Total mystery box count

### GetMysteryBoxItemID(item_type) {#get-mystery-box-item-id}

**Status:** `stable`

**Description:**
Gets the item ID for a specific mystery box type.

**Parameters:**
- `item_type` (string): Mystery box type

**Returns:**
- (number): Item ID or 0 if not found

## Shop and Commerce Functions

### CalculateShopHash() {#calculate-shop-hash}

**Status:** `stable`

**Description:**
Calculates a hash representing the current shop state.

**Returns:**
- (string): Shop hash for comparison

### IsShopNew(user_profile) {#is-shop-new}

**Status:** `stable`

**Description:**
Checks if the shop has new items since last visit.

**Parameters:**
- `user_profile` (table): User profile data

**Returns:**
- (boolean): True if shop has new items

### IsAnyItemNew(user_profile) {#is-any-item-new}

**Status:** `stable`

**Description:**
Checks if any items are new since last collection check.

**Parameters:**
- `user_profile` (table): User profile data

**Returns:**
- (boolean): True if any items are new

## UI Layout Functions

### GetBoxPopupLayoutDetails(num_item_types) {#get-box-popup-layout-details}

**Status:** `stable`

**Description:**
Calculates layout parameters for item box popups.

**Parameters:**
- `num_item_types` (number): Number of items to display

**Returns:**
- (number): Number of columns
- (boolean): Should resize root
- (boolean): Should resize small
- (boolean): Should resize small higher
- (boolean): Should resize really big

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

### GetSkinDescription(item) {#get-skin-description}

**Status:** `stable`

**Description:**
Gets the description text for a skin item.

**Parameters:**
- `item` (string): Item key

**Returns:**
- (string): Localized description text

### GetFirstOwnedItemId(item_key) {#get-first-owned-item-id}

**Status:** `stable`

**Description:**
Gets the item ID of the first owned instance of an item.

**Parameters:**
- `item_key` (string): Item key to search for

**Returns:**
- (number|nil): Item ID of first owned instance

## Advanced Features

### Pack Management

The module provides comprehensive pack management functionality:

```lua
-- Check pack contents and bundle status
local output_items = GetPurchasePackOutputItems("pack_winter_2019")
local is_bundle, total_value = IsPackABundle("pack_winter_2019")

-- Check pack ownership and restrictions
local owns_pack = OwnsSkinPack("pack_winter_2019")
local collection_name = GetPackCollection("pack_winter_2019")
```

### Character State Management

Advanced character state handling for complex characters:

```lua
-- Get all available skin modes for Woodie
local woodie_modes = GetSkinModes("woodie")
-- Returns: normal, ghost, werebeaver, weremoose, weregoose modes

-- Get badge display data for different states
local bank, anim, skin_type, scale, offset = GetPlayerBadgeData("woodie", false, true, false, false)
-- Returns werebeaver display data
```

### Collection Completion Tracking

Track collection progress and ensemble completions:

```lua
-- Check collection completion for a character
local owned, needed, has_heirloom = GetSkinCollectionCompletionForHero("wilson")
print("Wilson collection: " .. owned .. "/" .. (owned + needed))

-- Check if unraveling would break ensembles
if WillUnravelBreakEnsemble("forge_wilson_body") then
    -- Warn user about breaking ensemble
end
```

### Advanced Filtering

Create dynamic filters for different UI contexts:

```lua
-- Create character-specific filter
local wilson_filter = GetAffinityFilterForHero("wilson")

-- Create commerce filters
local weaveable_filter = GetWeaveableSkinFilter()
local owned_filter = GetLockedSkinFilter()

-- Combine filters for complex queries
local function combined_filter(item_key)
    return wilson_filter(item_key) and weaveable_filter(item_key)
end
```

## Performance Considerations

### Expensive Operations

Several functions are marked as expensive and should be used carefully:

- **GetOwnedItemCounts()**: Very expensive, avoid calling multiple times per frame
- **GetInventorySkinsList()**: Expensive when sorting is enabled
- **Collection functions**: Can be expensive with large inventories

### Optimization Strategies

```lua
-- Cache expensive operations
local item_counts = GetOwnedItemCounts() -- Cache this result

-- Use efficient sorting
local skins = GetInventorySkinsList(false) -- Sort manually if needed
table.sort(skins, function(a, b)
    return CompareItemDataForSortByRarity(a.item, b.item)
end)

-- Batch validation operations
ValidateItemsLocal(character, all_selected_skins) -- Single validation call
```

## Error Handling

The module includes robust error handling:

- **Missing Data**: Functions return safe defaults for missing items
- **Invalid Keys**: Gracefully handles malformed item keys
- **Ownership Checks**: Safe handling of offline/online inventory states
- **Collection Validation**: Prevents crashes from corrupted collection data

## Debug and Development

When `SKIN_DEBUGGING` is enabled:

```lua
-- Debug mode returns raw item keys instead of localized names
SKIN_DEBUGGING = true
local name = GetSkinName("wilson_formal") -- Returns "wilson_formal" instead of "The Dapper"
```

## Related Modules

- [`skinsfiltersutils`](./skinsfiltersutils.md): Filtering utilities for skins lists
- [`skinstradeutils`](./skinstradeutils.md): Trading-specific utilities
- [`item_blacklist`](./item_blacklist.md): Items excluded from display
- [`skin_affinity_info`](./skin_affinity_info.md): Character-item relationships
- [`skin_set_info`](./skin_set_info.md): Item set and collection definitions
- [`skin_assets`](./skin_assets.md): Asset and texture definitions
- [`clothing`](./clothing.md): Clothing item definitions
- [`misc_items`](./misc_items.md): Miscellaneous item definitions

## Constants Reference

The module defines several important constant tables:

- **SKIN_RARITY_COLORS**: Color definitions for UI display
- **RARITY_ORDER**: Numerical ordering for sorting operations
- **EVENT_ICONS**: Mapping of tags to event icons
- **DEFAULT_SKIN_COLOR**: Fallback color for unknown items

These constants ensure consistent behavior across the entire skin system.
