---
id: skinsutils
title: Skinsutils
description: A utility module providing helper functions and data tables for skin rarity, inventory management, pack operations, and item categorization in Don't Starve Together.
tags: [skins, inventory, ui, commerce, utility]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: root
source_hash: f5008a41
system_scope: ui
---

# Skinsutils

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`skinsutils.lua` is a utility module that provides comprehensive helper functions and data tables for managing skin-related operations in Don't Starve Together. It defines skin rarity colors, event icon mappings, rarity sorting orders, and numerous functions for retrieving skin data, managing inventory, handling purchase packs, and validating item selections. This module is required by UI screens, inventory systems, and commerce features that need to display or manipulate skin information. It does not attach to entities as a component but serves as a global utility library accessed via `require()`.

## Usage example
```lua
require "skinsutils"

-- Get skin rarity color for display
local rarity = GetRarityForItem("wilson_chef")
local color = GetColorForItem("wilson_chef")

-- Check if a pack is a bundle
local isBundle, value = IsPackABundle("pack_starter_2019")

-- Get owned item counts for collection tracking
local counts = GetOwnedItemCounts()

-- Sort items by rarity for display
local sorted = GetInventorySkinsList(true)
```

## Dependencies & tags
**External dependencies:**
- `skin_affinity_info` -- required for character-skin affinity mappings
- `skin_set_info` -- required for skin set/ensemble definitions
- `dbui_no_package/debug_skins_data/hooks` -- conditional debug UI hooks (only if `CAN_USE_DBUI`)

**Components used:**
- `TheInventory` -- accessed for ownership checks, inventory retrieval, and commerce operations
- `TheItems` -- accessed for IAP definitions and barter pricing
- `TheFrontEnd` -- accessed for pushing UI screens (popups, dialogs)
- `TheSim` -- accessed for data collection settings
- `Profile` -- accessed for entitlement tracking and customization state
- `scheduler` -- accessed for periodic task execution (ExecutePeriodic)

**Tags:**
None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SKIN_RARITY_COLORS` | table | — | Table mapping rarity names to RGBA color arrays (e.g., `Common`, `Elegant`, `HeirloomElegant`). |
| `SKIN_RARITY_COLORS.Common` | table | `{ 0.718, 0.824, 0.851, 1 }` | RGBA color for common rarity items. |
| `SKIN_RARITY_COLORS.Classy` | table | `{ 0.255, 0.314, 0.471, 1 }` | RGBA color for uncommon rarity items. |
| `SKIN_RARITY_COLORS.Spiffy` | table | `{ 0.408, 0.271, 0.486, 1 }` | RGBA color for rare items. |
| `SKIN_RARITY_COLORS.Distinguished` | table | `{ 0.729, 0.455, 0.647, 1 }` | RGBA color for very rare items. |
| `SKIN_RARITY_COLORS.Elegant` | table | `{ 0.741, 0.275, 0.275, 1 }` | RGBA color for extremely rare items. |
| `SKIN_RARITY_COLORS.HeirloomElegant` | table | `{ 0.933, 0.365, 0.251, 1 }` | RGBA color for heirloom elegant items. |
| `SKIN_RARITY_COLORS.Character` | table | `{ 0.718, 0.824, 0.851, 1 }` | RGBA color for character skins. |
| `SKIN_RARITY_COLORS.Timeless` | table | `{ 0.424, 0.757, 0.482, 1 }` | RGBA color for timeless items (not currently used). |
| `SKIN_RARITY_COLORS.Loyal` | table | `{ 0.635, 0.769, 0.435, 1 }` | RGBA color for one-time giveaway items. |
| `SKIN_RARITY_COLORS.ProofOfPurchase` | table | `{ 0.000, 0.478, 0.302, 1 }` | RGBA color for proof of purchase items. |
| `SKIN_RARITY_COLORS.Reward` | table | `{ 0.910, 0.592, 0.118, 1 }` | RGBA color for set bonus reward items. |
| `SKIN_RARITY_COLORS.Event` | table | `{ 0.957, 0.769, 0.188, 1 }` | RGBA color for event items. |
| `SKIN_RARITY_COLORS.Lustrous` | table | `{ 1.000, 1.000, 0.298, 1 }` | RGBA color for rarity modifier. |
| `SKIN_RARITY_COLORS.Complimentary` | table | — | Alias for `SKIN_RARITY_COLORS.Common`. |
| `SKIN_RARITY_COLORS.HeirloomClassy` | table | — | Alias for `SKIN_RARITY_COLORS.HeirloomElegant`. |
| `SKIN_RARITY_COLORS.HeirloomSpiffy` | table | — | Alias for `SKIN_RARITY_COLORS.HeirloomElegant`. |
| `SKIN_RARITY_COLORS.HeirloomDistinguished` | table | — | Alias for `SKIN_RARITY_COLORS.HeirloomElegant`. |
| `SKIN_RARITY_COLORS.Resurrected` | table | — | Alias for `SKIN_RARITY_COLORS.ProofOfPurchase`. |
| `DEFAULT_SKIN_COLOR` | table | `SKIN_RARITY_COLORS.Common` | Default color used when rarity color is not found. |
| `SKIN_DEBUGGING` | boolean | `false` | Debug flag that returns raw item keys instead of localized names. |
| `EVENT_ICONS` | table | — | Table mapping event keys to tag arrays for icon display. |
| `EVENT_ICONS.event_forge` | table | `{"LAVA"}` | Tags for forge event items. |
| `EVENT_ICONS.event_ice` | table | `{"ICE", "WINTER"}` | Tags for winter event items. |
| `EVENT_ICONS.event_yotv` | table | `{"VARG"}` | Tags for year of the vowhound event items. |
| `EVENT_ICONS.event_quagmire` | table | `{"VICTORIAN"}` | Tags for quagmire event items. |
| `EVENT_ICONS.event_hallowed` | table | `{"HALLOWED"}` | Tags for hallowed nights event items. |
| `EVENT_ICONS.event_yule` | table | `{"YULE"}` | Tags for winter's feast event items. |
| `RARITY_ORDER` | table | — | Table mapping rarity names to numeric sort order (lower = rarer). |
| `RARITY_ORDER.ProofOfPurchase` | number | `1` | Sort priority for proof of purchase items. |
| `RARITY_ORDER.Resurrected` | number | `1.5` | Sort priority for resurrected items. |
| `RARITY_ORDER.Timeless` | number | `2` | Sort priority for timeless items. |
| `RARITY_ORDER.Loyal` | number | `3` | Sort priority for loyal items. |
| `RARITY_ORDER.Reward` | number | `4` | Sort priority for reward items. |
| `RARITY_ORDER.Event` | number | `5` | Sort priority for event items. |
| `RARITY_ORDER.Character` | number | `6` | Sort priority for character items. |
| `RARITY_ORDER.HeirloomElegant` | number | `7` | Sort priority for heirloom elegant items. |
| `RARITY_ORDER.HeirloomDistinguished` | number | `8` | Sort priority for heirloom distinguished items. |
| `RARITY_ORDER.HeirloomSpiffy` | number | `9` | Sort priority for heirloom spiffy items. |
| `RARITY_ORDER.HeirloomClassy` | number | `10` | Sort priority for heirloom classy items. |
| `RARITY_ORDER.Elegant` | number | `11` | Sort priority for elegant items. |
| `RARITY_ORDER.Distinguished` | number | `12` | Sort priority for distinguished items. |
| `RARITY_ORDER.Spiffy` | number | `13` | Sort priority for spiffy items. |
| `RARITY_ORDER.Classy` | number | `14` | Sort priority for classy items. |
| `RARITY_ORDER.Common` | number | `15` | Sort priority for common items. |
| `RARITY_ORDER.Complimentary` | number | `16` | Sort priority for complimentary items. |

## Main functions
### `GetSpecialItemCategories()`
* **Description:** (internal) Returns a table of special item category tables that are built at runtime because the symbols do not exist when the file is first loaded.
* **Parameters:** None
* **Returns:** Table containing `MISC_ITEMS`, `CLOTHING`, `EMOTE_ITEMS`, `EMOJI_ITEMS`, `BEEFALO_CLOTHING`.
* **Error states:** None.

### `GetAllItemCategories()`
* **Description:** (internal) Returns a combined table of all item categories including prefabs and special categories.
* **Parameters:** None
* **Returns:** Table array containing `Prefabs` followed by special item categories.
* **Error states:** None.

### `CompareReleaseGroup(item_key_a, item_key_b)`
* **Description:** Compares two item keys by their release group for sorting purposes.
* **Parameters:**
  - `item_key_a` -- first item key string
  - `item_key_b` -- second item key string
* **Returns:** Boolean `true` if item A has a higher release group than item B.
* **Error states:** None.

### `CompareRarities(item_key_a, item_key_b)`
* **Description:** Compares two item keys by their rarity using `RARITY_ORDER` for sorting.
* **Parameters:**
  - `item_key_a` -- first item key string
  - `item_key_b` -- second item key string
* **Returns:** Boolean `true` if item A has a lower rarity order value (rarer) than item B.
* **Error states:** None.

### `GetNextRarity(rarity)`
* **Description:** Returns the next higher rarity tier for use in trade screen progression.
* **Parameters:** `rarity` -- current rarity string (e.g., `"Common"`, `"Classy"`)
* **Returns:** Next rarity string or empty string `""` if no next rarity exists.
* **Error states:** None.

### `IsHeirloomRarity(rarity)`
* **Description:** Checks if a rarity string belongs to the heirloom category.
* **Parameters:** `rarity` -- rarity string to check
* **Returns:** Boolean `true` if rarity is `HeirloomElegant`, `HeirloomDistinguished`, `HeirloomSpiffy`, or `HeirloomClassy`.
* **Error states:** None.

### `GetFrameSymbolForRarity(rarity)`
* **Description:** Returns the frame symbol name for UI display based on rarity.
* **Parameters:** `rarity` -- rarity string
* **Returns:** Lowercase rarity string or special symbol (`"heirloom"`, `"common"`, `"proofofpurchase"`).
* **Error states:** None.

### `GetBuildForItem(name)`
* **Description:** Returns the build name for an item, using override if available.
* **Parameters:** `name` -- item key string
* **Returns:** Build name string from `build_name_override` or the original name.
* **Error states:** None.

### `GetBigPortraitAnimForItem(item_key)`
* **Description:** Returns the big portrait animation asset for an item if the prefab defines it.
* **Parameters:** `item_key` -- item key string
* **Returns:** Animation name string or `nil` if not defined.
* **Error states:** None.

### `GetPortraitNameForItem(item_key)`
* **Description:** Returns the portrait name for an item, handling default character skins.
* **Parameters:** `item_key` -- item key string
* **Returns:** Portrait name string.
* **Error states:** None.

### `GetPackCollection(item_key)`
* **Description:** Returns the collection name for a pack if all items belong to the same collection.
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Collection name string or `nil` if items span multiple collections.
* **Error states:** None.

### `GetPackTotalItems(item_key)`
* **Description:** Returns the total number of items in a purchase pack.
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Number of items in the pack.
* **Error states:** None.

### `_IsPackInsideOther(pack_a, pack_b)`
* **Description:** (internal) Checks if all items in pack A are contained in pack B.
* **Parameters:**
  - `pack_a` -- first pack item key
  - `pack_b` -- second pack item key
* **Returns:** Boolean `true` if pack A is a subset of pack B.
* **Error states:** None.

### `GetFeaturedPacks()`
* **Description:** Returns a list of featured packs filtered by release group priority.
* **Parameters:** None
* **Returns:** Array of featured pack item keys.
* **Error states:** None.

### `_GetSubPacks(item_key)`
* **Description:** (internal) Memoized function that returns sub-packs contained within a pack.
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Table of sub-pack keys (memoized).
* **Error states:** None.

### `IsItemInAnyPack(item_key)`
* **Description:** Checks if an item is contained in any purchase pack.
* **Parameters:** `item_key` -- item key string
* **Returns:** Boolean `true` if item exists in any pack.
* **Error states:** None.

### `GetPackTotalSets(item_key)`
* **Description:** Returns the total number of skin sets in a pack.
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Number of sets (returns `0` for `pack_starter_2019` to avoid Wurt confusion).
* **Error states:** None.

### `IsPackABundle(item_key)`
* **Description:** Checks if a pack is a bundle and returns its total value.
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Boolean `true` if bundle, and numeric value of sub-packs.
* **Error states:** Prints error if platform pricing cannot be determined (non-Steam, non-Rail).

### `GetPriceFromIAPDef(iap_def, sale_active)`
* **Description:** Returns the price from an IAP definition, accounting for sales.
* **Parameters:**
  - `iap_def` -- IAP definition table
  - `sale_active` -- boolean indicating if sale is active
* **Returns:** Numeric price value based on platform and sale status.
* **Error states:** None.

### `BuildPriceStr(value, iap_def, sale_active)`
* **Description:** Builds a formatted price string for display.
* **Parameters:**
  - `value` -- numeric price or IAP definition table
  - `iap_def` -- IAP definition table
  - `sale_active` -- boolean indicating if sale is active
* **Returns:** Formatted price string with currency code.
* **Error states:** Prints error if platform pricing cannot be determined.

### `IsSaleActive(iap_def)`
* **Description:** Checks if a sale is currently active for an IAP definition.
* **Parameters:** `iap_def` -- IAP definition table
* **Returns:** Boolean `true` if sale is active, and remaining sale duration in seconds.
* **Error states:** None.

### `GetPackSavings(iap_def, total_value, sale_active)`
* **Description:** Calculates the percentage savings for a pack purchase.
* **Parameters:**
  - `iap_def` -- IAP definition table
  - `total_value` -- total value of items in pack
  - `sale_active` -- boolean indicating if sale is active
* **Returns:** Integer percentage savings.
* **Error states:** Prints error if platform pricing cannot be determined.

### `IsPackClothingOnly(item_key)`
* **Description:** Checks if a pack contains only clothing items (body, hand, legs, feet, base).
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Boolean `true` if pack contains only clothing.
* **Error states:** None.

### `IsPackBelongingsOnly(item_key)`
* **Description:** Checks if a pack contains only belonging items (type `"item"`).
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Boolean `true` if pack contains only belongings.
* **Error states:** None.

### `IsPackFeatured(item_key)`
* **Description:** Checks if a pack is marked as featured.
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Boolean value from `featured_pack` field.
* **Error states:** None.

### `IsPackGiftable(item_key)`
* **Description:** Checks if a pack can be gifted (has Steam DLC ID).
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Boolean `true` if `steam_dlc_id` exists.
* **Error states:** None.

### `GetPackGiftDLCID(item_key)`
* **Description:** Returns the Steam DLC ID for a giftable pack.
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Steam DLC ID or `nil`.
* **Error states:** None.

### `GetReleaseGroup(item_key)`
* **Description:** Returns the release group number for an item.
* **Parameters:** `item_key` -- item key string
* **Returns:** Release group number or `999` if not defined.
* **Error states:** None.

### `GetPurchaseDisplayForItem(item_key)`
* **Description:** Returns the display atlas and texture for a pack.
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Table `{atlas, tex}` or `nil` if not defined.
* **Error states:** None.

### `GetBoxBuildForItem(item_key)`
* **Description:** Returns the box build name for a pack.
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Box build string or `"box_build undefined"`.
* **Error states:** None.

### `OwnsSkinPack(item_key)`
* **Description:** Checks if the player owns all items in a skin pack.
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Boolean `true` if all items are owned.
* **Error states:** None.

### `IsPurchasePackCurrency(item_key)`
* **Description:** Checks if a pack is a currency purchase (Klei currency).
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Boolean `true` if pack has `output_klei_currency_cost`.
* **Error states:** None.

### `GetPurchasePackCurrencyOutput(item_key)`
* **Description:** Returns the Klei currency output for a currency pack.
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Currency amount or `nil`.
* **Error states:** None.

### `GetPurchasePackDisplayItems(item_key)`
* **Description:** Returns the display items for a pack.
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Array of display item keys or empty table.
* **Error states:** None.

### `GetPurchasePackOutputItems(item_key)`
* **Description:** Returns the output items contained in a pack.
* **Parameters:** `item_key` -- pack item key string
* **Returns:** Array of item keys or empty table.
* **Error states:** None.

### `DoesPackHaveBelongings(pack_key)`
* **Description:** Checks if a pack contains any belonging items.
* **Parameters:** `pack_key` -- pack item key string
* **Returns:** Boolean `true` if pack has items with type `"item"`.
* **Error states:** None.

### `DoesPackHaveItem(pack_key, item_key)`
* **Description:** Checks if a specific item is in a pack.
* **Parameters:**
  - `pack_key` -- pack item key string
  - `item_key` -- item key to search for
* **Returns:** Boolean `true` if item is in pack.
* **Error states:** None.

### `DoesPackHaveACharacter(pack_key)`
* **Description:** Checks if a pack contains a character skin.
* **Parameters:** `pack_key` -- pack item key string
* **Returns:** Boolean `true` if pack has a default character skin.
* **Error states:** None.

### `DoesPackHaveSkinsForCharacter(pack_key, character)`
* **Description:** Checks if a pack contains skins for a specific character.
* **Parameters:**
  - `pack_key` -- pack item key string
  - `character` -- character prefab name
* **Returns:** Boolean `true` if pack has skins for the character.
* **Error states:** None.

### `IsClothingItem(name)`
* **Description:** Checks if an item is a clothing item.
* **Parameters:** `name` -- item key string
* **Returns:** Boolean `true` if item exists in `CLOTHING` table.
* **Error states:** None.

### `IsGameplayItem(name)`
* **Description:** Checks if an item is a gameplay item (used in-game).
* **Parameters:** `name` -- item key string
* **Returns:** Boolean `true` if item type is `"item"`.
* **Error states:** None.

### `IsItemId(name)`
* **Description:** Checks if a name is a valid item ID across all categories.
* **Parameters:** `name` -- item key string
* **Returns:** Boolean `true` if item exists in any category.
* **Error states:** None.

### `IsItemMarketable(item)`
* **Description:** Checks if an item can be traded on the marketplace.
* **Parameters:** `item` -- item key string
* **Returns:** Boolean value from `marketable` field.
* **Error states:** None.

### `GetSkinData(item)`
* **Description:** Returns the skin data table for an item by searching all categories.
* **Parameters:** `item` -- item key string
* **Returns:** Skin data table or empty table if not found.
* **Error states:** None.

### `GetColorForItem(item)`
* **Description:** Returns the rarity color for an item.
* **Parameters:** `item` -- item key string
* **Returns:** RGBA color array or `DEFAULT_SKIN_COLOR`.
* **Error states:** None.

### `GetModifiedRarityStringForItem(item)`
* **Description:** Returns the full rarity string including modifier if present.
* **Parameters:** `item` -- item key string
* **Returns:** Localized rarity string from `STRINGS.UI.RARITY`.
* **Error states:** Prints error if rarity modifier is not defined in strings.

### `GetRarityModifierForItem(item)`
* **Description:** Returns the rarity modifier for an item.
* **Parameters:** `item` -- item key string
* **Returns:** Rarity modifier string or `nil`.
* **Error states:** None.

### `GetRarityForItem(item)`
* **Description:** Returns the rarity string for an item.
* **Parameters:** `item` -- item key string
* **Returns:** Rarity string or `"Common"` if not defined.
* **Error states:** None.

### `GetEventIconForItem(item)`
* **Description:** Returns the event icon key for an item based on its tags.
* **Parameters:** `item` -- item key string
* **Returns:** Event icon key (e.g., `"event_forge"`) or `nil`.
* **Error states:** None.

### `GetSkinUsableOnString(item_type, popup_txt)`
* **Description:** Returns a localized string describing what an item/skin is usable on.
* **Parameters:**
  - `item_type` -- item key string
  - `popup_txt` -- boolean to use popup variant of string
* **Returns:** Localized string or empty string.
* **Error states:** None.

### `IsUserCommerceAllowedOnItemData(item_data)`
* **Description:** Checks if commerce is allowed for an item based on ownership and DLC status.
* **Parameters:** `item_data` -- item data table with `is_dlc_owned` and `owned_count`
* **Returns:** Boolean `true` if commerce is allowed.
* **Error states:** None.

### `IsUserCommerceAllowedOnItemType(item_key)`
* **Description:** Checks if commerce is allowed for an item type based on ownership.
* **Parameters:** `item_key` -- item key string
* **Returns:** Boolean `true` if buy or sell is allowed.
* **Error states:** None.

### `IsUserCommerceSellAllowedOnItem(item_type)`
* **Description:** Checks if an item can be sold on the marketplace.
* **Parameters:** `item_type` -- item key string
* **Returns:** Boolean `true` if owned and has sell price.
* **Error states:** None.

### `GetCharacterRequiredForItem(item_type)`
* **Description:** Returns the character prefab required for a base skin item.
* **Parameters:** `item_type` -- item key string
* **Returns:** Character prefab string or `nil`.
* **Error states:** Prints error if unexpected item type is passed.

### `IsUserCommerceBuyRestrictedDueType(item_type)`
* **Description:** Checks if buying is restricted due to item type (no rarity modifier).
* **Parameters:** `item_type` -- item key string
* **Returns:** Boolean `true` if buy is restricted.
* **Error states:** None.

### `IsUserCommerceBuyRestrictedDueToOwnership(item_type)`
* **Description:** Checks if buying is restricted due to character ownership.
* **Parameters:** `item_type` -- item key string
* **Returns:** Boolean `true` if character is not owned.
* **Error states:** None.

### `IsPackRestrictedDueToOwnership(item_type)`
* **Description:** Checks if a pack is restricted due to character ownership requirements.
* **Parameters:** `item_type` -- pack item key string
* **Returns:** String `"warning"`, `"error"`, or `""` with character prefab if restricted.
* **Error states:** None.

### `IsUserCommerceBuyAllowedOnItem(item_type)`
* **Description:** Checks if an item can be purchased on the marketplace.
* **Parameters:** `item_type` -- item key string
* **Returns:** Boolean `true` if not owned and has buy price.
* **Error states:** None.

### `GetTypeForItem(item)`
* **Description:** Returns the type and lowercase name for an item.
* **Parameters:** `item` -- item key string
* **Returns:** Type string and lowercase item name.
* **Error states:** None.

### `DoesItemHaveTag(item, tag)`
* **Description:** Checks if an item has a specific skin tag.
* **Parameters:**
  - `item` -- item key string
  - `tag` -- tag string to search for
* **Returns:** Boolean `true` if item has the tag.
* **Error states:** None.

### `_ItemStringRedirect(item)`
* **Description:** (internal) Redirects item strings for skin name lookups.
* **Parameters:** `item` -- item key string
* **Returns:** Redirected item string (removes `_builder`, converts `default1` to `none`).
* **Error states:** None.

### `GetSkinName(item)`
* **Description:** Returns the localized skin name for an item.
* **Parameters:** `item` -- item key string
* **Returns:** Localized name from `STRINGS.SKIN_NAMES` or `"missing"`.
* **Error states:** None.

### `GetSkinDescription(item)`
* **Description:** Returns the localized skin description for an item.
* **Parameters:** `item` -- item key string
* **Returns:** Localized description from `STRINGS.SKIN_DESCRIPTIONS` or `"missing"`.
* **Error states:** None.

### `GetSkinInvIconName(item)`
* **Description:** Returns the inventory icon name for a skin.
* **Parameters:** `item` -- item key string
* **Returns:** Icon name string with suffixes removed.
* **Error states:** None.

### `SkinGridListConstructor(context, parent, scroll_list)`
* **Description:** DEPRECATED - Creates a grid of item image widgets for skin display.
* **Parameters:**
  - `context` -- screen context table
  - `parent` -- parent widget
  - `scroll_list` -- scroll list widget
* **Returns:** Widgets array, column count, spacing, row count, and scale factor.
* **Error states:** None.

### `UpdateSkinGrid(context, list_widget, data, data_index)`
* **Description:** DEPRECATED - Updates a skin grid widget with item data.
* **Parameters:**
  - `context` -- screen context table
  - `list_widget` -- widget to update
  - `data` -- item data table with `type`, `item`, `item_id`, `timestamp`
  - `data_index` -- index in the list
* **Returns:** None
* **Error states:** None.

### `GetLexicalSortLiteral(item_key)`
* **Description:** (internal) Returns a sort key combining skin name and item key.
* **Parameters:** `item_key` -- item key string
* **Returns:** Concatenated string for lexical sorting.
* **Error states:** None.

### `CompareItemDataForSortByRelease(item_key_a, item_key_b)`
* **Description:** Compares two item keys for sorting by release group, then rarity, then name.
* **Parameters:**
  - `item_key_a` -- first item key string
  - `item_key_b` -- second item key string
* **Returns:** Boolean `true` if A should come before B.
* **Error states:** None.

### `CompareItemDataForSortByName(item_key_a, item_key_b)`
* **Description:** Compares two item keys for sorting by name.
* **Parameters:**
  - `item_key_a` -- first item key string
  - `item_key_b` -- second item key string
* **Returns:** Boolean `true` if A should come before B.
* **Error states:** None.

### `CompareItemDataForSortByRarity(item_key_a, item_key_b)`
* **Description:** Compares two item keys for sorting by rarity, then name.
* **Parameters:**
  - `item_key_a` -- first item key string
  - `item_key_b` -- second item key string
* **Returns:** Boolean `true` if A should come before B.
* **Error states:** None.

### `CompareItemDataForSortByCount(item_key_a, item_key_b, item_counts)`
* **Description:** Compares two item keys for sorting by ownership count, then name.
* **Parameters:**
  - `item_key_a` -- first item key string
  - `item_key_b` -- second item key string
  - `item_counts` -- table mapping item keys to counts
* **Returns:** Boolean `true` if A should come before B.
* **Error states:** None.

### `GetInventoryTimestamp()`
* **Description:** Returns the most recent modification timestamp from the inventory.
* **Parameters:** None
* **Returns:** Numeric timestamp value.
* **Error states:** None.

### `GetInventorySkinsList(do_sort)`
* **Description:** Returns a list of all owned skins with type, rarity, and timestamp data.
* **Parameters:** `do_sort` -- boolean to sort by rarity
* **Returns:** Array of skin data tables.
* **Error states:** None.

### `GetOwnedItemCounts()`
* **Description:** Returns a table of item counts for all owned items. Expensive operation.
* **Parameters:** None
* **Returns:** Table mapping item keys to count values.
* **Error states:** None.

### `GetFirstOwnedItemId(item_key)`
* **Description:** Returns the item ID for the first owned instance of an item.
* **Parameters:** `item_key` -- item key string
* **Returns:** Item ID number or `nil` if not owned.
* **Error states:** None.

### `CopySkinsList(list)`
* **Description:** Creates a deep copy of a skins list.
* **Parameters:** `list` -- array of skin data tables
* **Returns:** New array with copied skin data.
* **Error states:** None.

### `GetItemCollectionName(item_type)`
* **Description:** Returns the collection name for an item (e.g., "Shadow Collection").
* **Parameters:** `item_type` -- item key string
* **Returns:** Collection name string or `nil`.
* **Error states:** None.

### `IsItemInCollection(item_type)`
* **Description:** Checks if an item is part of a skin set/ensemble.
* **Parameters:** `item_type` -- item key string
* **Returns:** Boolean `true` and bonus item key if in collection.
* **Error states:** None.

### `IsItemIsReward(item_type)`
* **Description:** Checks if an item is a set bonus reward.
* **Parameters:** `item_type` -- item key string
* **Returns:** Boolean `true` if item is a reward.
* **Error states:** None.

### `_BonusItemRewarded(bonus_item, item_counts)`
* **Description:** (internal) Checks if a bonus item reward has been earned.
* **Parameters:**
  - `bonus_item` -- bonus item key string
  - `item_counts` -- table of owned item counts
* **Returns:** Boolean `true` if all set items are owned.
* **Error states:** None.

### `WillUnravelBreakEnsemble(item_type)`
* **Description:** Checks if unraveling an item will break an ensemble/set bonus.
* **Parameters:** `item_type` -- item key string
* **Returns:** Boolean `true` if unraveling will break the ensemble.
* **Error states:** None.

### `WillUnravelBreakRestrictedCharacter(item_type)`
* **Description:** Checks if unraveling will leave a restricted character unowned.
* **Parameters:** `item_type` -- item key string
* **Returns:** Boolean `true` if unraveling will break character ownership.
* **Error states:** None.

### `HasHeirloomItem(herocharacter)`
* **Description:** Checks if a character has any heirloom rarity items.
* **Parameters:** `herocharacter` -- character prefab name
* **Returns:** Boolean `true` if character has heirloom items.
* **Error states:** None.

### `GetSkinCollectionCompletionForHero(herocharacter)`
* **Description:** Returns the completion status of a character's skin collection.
* **Parameters:** `herocharacter` -- character prefab name
* **Returns:** Owned count, needed count, and bonus earned boolean.
* **Error states:** Errors if `herocharacter` is nil (assert fails with no guard).

### `GetNullFilter()`
* **Description:** Returns a filter function that accepts all items.
* **Parameters:** None
* **Returns:** Filter function that always returns `true`.
* **Error states:** None.

### `GetAffinityFilterForHero(herocharacter)`
* **Description:** Returns a filter function for items affiliated with a character.
* **Parameters:** `herocharacter` -- character prefab name
* **Returns:** Filter function that checks `SKIN_AFFINITY_INFO`.
* **Error states:** None.

### `GetLockedSkinFilter()`
* **Description:** Returns a filter function for owned or default skins.
* **Parameters:** None
* **Returns:** Filter function that checks ownership or default status.
* **Error states:** None.

### `GetWeaveableSkinFilter()`
* **Description:** Returns a filter function for skins that can be woven.
* **Parameters:** None
* **Returns:** Filter function that checks barter buy price.
* **Error states:** None.

### `GetMysteryBoxCounts()`
* **Description:** Returns a table of mystery box counts by type.
* **Parameters:** None
* **Returns:** Table mapping box types to counts.
* **Error states:** None.

### `GetTotalMysteryBoxCount()`
* **Description:** Returns the total count of all mystery boxes owned.
* **Parameters:** None
* **Returns:** Total number of mystery boxes.
* **Error states:** None.

### `GetMysteryBoxItemID(item_type)`
* **Description:** Returns the item ID for a specific mystery box type.
* **Parameters:** `item_type` -- mystery box item key
* **Returns:** Item ID number or `0` if not found.
* **Error states:** None.

### `CalculateShopHash()`
* **Description:** Calculates a hash of the current shop items for change detection.
* **Parameters:** None
* **Returns:** Numeric hash value.
* **Error states:** None.

### `IsShopNew(user_profile)`
* **Description:** Checks if the shop has changed since last viewed.
* **Parameters:** `user_profile` -- user profile object
* **Returns:** Boolean `true` if shop hash differs and IAP defs exist.
* **Error states:** None.

### `IsAnyItemNew(user_profile)`
* **Description:** Checks if any new items have been added to inventory.
* **Parameters:** `user_profile` -- user profile object
* **Returns:** Boolean `true` if collection timestamp is older than inventory timestamp.
* **Error states:** None.

### `ShouldDisplayItemInCollection(item_type)`
* **Description:** Checks if an item should be displayed in the collection UI.
* **Parameters:** `item_type` -- item key string
* **Returns:** Boolean `true` if item should be displayed.
* **Error states:** None.

### `IsRestrictedCharacter(prefab)`
* **Description:** Checks if a character is restricted (requires DLC/ownership).
* **Parameters:** `prefab` -- character prefab name
* **Returns:** Boolean value from `is_restricted` field.
* **Error states:** None.

### `IsCharacterOwned(prefab)`
* **Description:** Checks if a character's default skin is owned.
* **Parameters:** `prefab` -- character prefab name
* **Returns:** Boolean `true` if default skin is owned.
* **Error states:** None.

### `IsDefaultSkinOwned(item_key)`
* **Description:** Checks if a default skin is owned (always true for default clothing).
* **Parameters:** `item_key` -- item key string
* **Returns:** Boolean `true` if default skin is considered owned.
* **Error states:** None.

### `IsDefaultSkin(item_key)`
* **Description:** Checks if an item key represents a default skin.
* **Parameters:** `item_key` -- item key string
* **Returns:** Boolean `true` if item is default clothing, beefalo clothing, or character skin.
* **Error states:** None.

### `IsPrefabSkinned(prefab)`
* **Description:** Checks if a prefab has skin variants.
* **Parameters:** `prefab` -- prefab name string
* **Returns:** Boolean `true` if prefab exists in `PREFAB_SKINS`.
* **Error states:** None.

### `IsDefaultCharacterSkin(item_key)`
* **Description:** Checks if an item key is a default character skin (ends with `_none`).
* **Parameters:** `item_key` -- item key string
* **Returns:** Boolean `true` if item key ends with `_none`.
* **Error states:** None.

### `IsDefaultClothing(item_key)`
* **Description:** Checks if an item is default clothing.
* **Parameters:** `item_key` -- item key string
* **Returns:** Boolean `true` if clothing exists and `is_default` is true.
* **Error states:** None.

### `IsDefaultBeefClothing(item_key)`
* **Description:** Checks if an item is default beefalo clothing.
* **Parameters:** `item_key` -- item key string
* **Returns:** Boolean `true` if beefalo clothing exists and `is_default` is true.
* **Error states:** None.

### `IsDefaultMisc(item_key)`
* **Description:** Checks if an item is a default miscellaneous item.
* **Parameters:** `item_key` -- item key string
* **Returns:** Boolean `true` if misc item exists and `is_default` is true.
* **Error states:** None.

### `GetCharacterSkinBases(hero)`
* **Description:** Returns a table of character skin bases (heads) for a hero.
* **Parameters:** `hero` -- character prefab name
* **Returns:** Table mapping item keys to prefab data.
* **Error states:** None.

### `GetAllGameplayItems()`
* **Description:** Returns a table of all gameplay items (non-character skins).
* **Parameters:** None
* **Returns:** Table mapping item keys to prefab data.
* **Error states:** None.

### `IsValidClothing(name)`
* **Description:** Checks if a clothing item is valid (exists and not default).
* **Parameters:** `name` -- clothing item key string
* **Returns:** Boolean `true` if clothing is valid.
* **Error states:** None.

### `IsValidBeefaloClothing(name)`
* **Description:** Checks if a beefalo clothing item is valid (exists and not default).
* **Parameters:** `name` -- beefalo clothing item key string
* **Returns:** Boolean `true` if beefalo clothing is valid.
* **Error states:** None.

### `ValidatePreviewItems(currentcharacter, preview_skins, filter)`
* **Description:** Validates and filters preview skin selections.
* **Parameters:**
  - `currentcharacter` -- current character prefab name
  - `preview_skins` -- table of preview skin selections
  - `filter` -- optional filter function
* **Returns:** None (modifies `preview_skins` in place)
* **Error states:** None.

### `ValidateItemsLocal(currentcharacter, selected_skins)`
* **Description:** Validates selected skins against local ownership.
* **Parameters:**
  - `currentcharacter` -- current character prefab name
  - `selected_skins` -- table of selected skin items
* **Returns:** None (modifies `selected_skins` in place)
* **Error states:** None.

### `ValidateItemsInProfile(user_profile)`
* **Description:** Validates and revokes items in user profile that are no longer owned.
* **Parameters:** `user_profile` -- user profile object
* **Returns:** None
* **Error states:** None.

### `CacheCurrentVanityItems(user_profile)`
* **Description:** Caches vanity items (player portrait, profile flair) for the current user.
* **Parameters:** `user_profile` -- user profile object
* **Returns:** None
* **Error states:** None.

### `GetRemotePlayerVanityItem(active_cosmetics, item_type)`
* **Description:** Returns a vanity item key from a remote player's active cosmetics.
* **Parameters:**
  - `active_cosmetics` -- array of active cosmetic item keys
  - `item_type` -- type string (`"playerportrait"` or `"profileflair"`)
* **Returns:** Item key string or `nil`.
* **Error states:** None.

### `GetSkinsDataFromClientTableData(data)`
* **Description:** Extracts skin data from client table data structure.
* **Parameters:** `data` -- client data table with skin fields
* **Returns:** Base skin, clothing table, player portrait, profile flair, and event level.
* **Error states:** None.

### `BuildListOfSelectedItems(user_profile, item_type)`
* **Description:** Builds a sorted list of selected items for a type from user profile.
* **Parameters:**
  - `user_profile` -- user profile object
  - `item_type` -- item type string
* **Returns:** Sorted array of owned and active item keys.
* **Error states:** None.

### `GetNextOwnedSkin(prefab, cur_skin)`
* **Description:** Returns the next owned skin in the prefab's skin list.
* **Parameters:**
  - `prefab` -- prefab name string
  - `cur_skin` -- current skin key or `nil`
* **Returns:** Next owned skin key or `cur_skin` if no next skin.
* **Error states:** None.

### `GetPrevOwnedSkin(prefab, cur_skin)`
* **Description:** Returns the previous owned skin in the prefab's skin list.
* **Parameters:**
  - `prefab` -- prefab name string
  - `cur_skin` -- current skin key or `nil`
* **Returns:** Previous owned skin key or `cur_skin` if no previous skin.
* **Error states:** None.

### `GetMostRecentlySelectedItem(user_profile, item_type)`
* **Description:** Returns the most recently selected item key for a type.
* **Parameters:**
  - `user_profile` -- user profile object
  - `item_type` -- item type string
* **Returns:** Item key string or `nil`.
* **Error states:** None.

### `GetOneAtlasPerImage_pkgref(atlas_fmt, item_key)`
* **Description:** (internal) Returns atlas and tex paths using pkgref format.
* **Parameters:**
  - `atlas_fmt` -- format string for atlas path
  - `item_key` -- item key string
* **Returns:** Atlas path and tex path strings.
* **Error states:** None.

### `GetOneAtlasPerImage_tex(atlas_fmt, item_key, defaults)`
* **Description:** (internal) Returns atlas and tex paths using tex format.
* **Parameters:**
  - `atlas_fmt` -- format string for atlas path
  - `item_key` -- item key string
  - `defaults` -- default values (unused in current implementation)
* **Returns:** Atlas path and tex path strings.
* **Error states:** None.

### `GetLoaderAtlasAndTex(item_key)`
* **Description:** Returns the loader atlas and texture for an item.
* **Parameters:** `item_key` -- item key string
* **Returns:** Atlas and tex paths, or default spiral if not found.
* **Error states:** None.

### `GetProfileFlairAtlasAndTex(item_key)`
* **Description:** Returns the profile flair atlas and texture.
* **Parameters:** `item_key` -- item key string or `nil`
* **Returns:** Atlas path, tex path, and default tex path.
* **Error states:** None.

### `GetPlayerPortraitAtlasAndTex(item_key)`
* **Description:** Returns the player portrait atlas and texture.
* **Parameters:** `item_key` -- item key string or `nil`
* **Returns:** Atlas and tex paths, or default background if not found.
* **Error states:** None.

### `SetDailyGiftItem(item_type)`
* **Description:** Sets a daily gift item for testing the daily gift popup.
* **Parameters:** `item_type` -- item type string
* **Returns:** None
* **Error states:** None.

### `IsDailyGiftItemPending()`
* **Description:** Checks if a daily gift item is pending.
* **Parameters:** None
* **Returns:** Boolean `true` if daily gift is set.
* **Error states:** None.

### `GetDailyGiftItem()`
* **Description:** Returns and clears the pending daily gift item.
* **Parameters:** None
* **Returns:** Item type string or `nil`.
* **Error states:** None.

### `IsSkinDLCEntitlementReceived(entitlement)`
* **Description:** Checks if a skin DLC entitlement has been received.
* **Parameters:** `entitlement` -- entitlement ID string
* **Returns:** Boolean value from `Profile:IsEntitlementReceived`.
* **Error states:** None.

### `SetSkinDLCEntitlementReceived(entitlement)`
* **Description:** Marks a skin DLC entitlement as received.
* **Parameters:** `entitlement` -- entitlement ID string
* **Returns:** None
* **Error states:** None.

### `AddNewSkinDLCEntitlement(entitlement)`
* **Description:** Adds a new skin DLC entitlement for testing the gifting popup.
* **Parameters:** `entitlement` -- entitlement ID string
* **Returns:** None
* **Error states:** None.

### `HasNewSkinDLCEntitlements()`
* **Description:** Checks if there are new skin DLC entitlements pending.
* **Parameters:** None
* **Returns:** Boolean `true` if entitlements exist.
* **Error states:** None.

### `GetNewSkinDLCEntitlement()`
* **Description:** Returns and removes the last new skin DLC entitlement.
* **Parameters:** None
* **Returns:** Entitlement ID string or `nil`.
* **Error states:** None.

### `MakeSkinDLCPopup(_cb)`
* **Description:** Creates and displays a skin DLC popup for new entitlements.
* **Parameters:** `_cb` -- callback function to call after popup closes
* **Returns:** None
* **Error states:** Prints error if pack data has no display items.

### `DisplayCharacterUnownedPopup(character, skins_subscreener)`
* **Description:** Displays a popup dialog when a character is not owned.
* **Parameters:**
  - `character` -- character prefab name
  - `skins_subscreener` -- subscreener object with screen references
* **Returns:** None
* **Error states:** None.

### `DisplayInventoryFailedPopup(screen)`
* **Description:** Displays a popup when inventory download fails.
* **Parameters:** `screen` -- screen object with poll task and state
* **Returns:** None
* **Error states:** None.

### `GetSkinModes(character)`
* **Description:** Returns the skin mode configurations for a character.
* **Parameters:** `character` -- character prefab name
* **Returns:** Array of skin mode tables with type, anim_bank, scale, and offset.
* **Error states:** None.

### `GetPlayerBadgeData(character, ghost, state_1, state_2, state_3)`
* **Description:** Returns badge animation data for a character's current state.
* **Parameters:**
  - `character` -- character prefab name
  - `ghost` -- boolean for ghost state
  - `state_1` -- boolean for alternate state 1
  - `state_2` -- boolean for alternate state 2
  - `state_3` -- boolean for alternate state 3
* **Returns:** Build name, anim name, skin type, scale, and offset values.
* **Error states:** None.

### `GetSkinModeFromBuild(player)`
* **Description:** Returns the skin mode based on a player's current build.
* **Parameters:** `player` -- player entity instance
* **Returns:** Skin mode string or `nil`.
* **Error states:** None.

### `GetBoxPopupLayoutDetails(num_item_types)`
* **Description:** Returns layout details for a box popup based on item count.
* **Parameters:** `num_item_types` -- number of item types in the box
* **Returns:** Column count and four boolean resize flags.
* **Error states:** Prints warning for unexpected item counts.

### `GetPurchasePackFromEntitlement(entitlement_id)`
* **Description:** Returns the pack type from a PSN entitlement ID.
* **Parameters:** `entitlement_id` -- PSN entitlement ID string
* **Returns:** Pack type string or `nil`.
* **Error states:** None.

## Events & listeners
None.