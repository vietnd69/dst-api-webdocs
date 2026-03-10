---
id: skinsutils
title: Skinsutils
description: Central utility module for managing skins, packs, inventory, commerce, and UI rendering in Don't Starve Together.
tags: [ui, inventory, skin, commerce, profile]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 8cfe7cbb
system_scope: ui
---

# Skinsutils

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
Skinsutils is the core utility module responsible for managing skins, pack definitions, ownership tracking, commerce logic, UI display conventions, and profile state in Don't Starve Together. It acts as the intermediary between the client UI and backend inventory/profile systems, providing functions for rarity navigation, skin selection (including looping through owned skins), price formatting, IAP/sale handling, pack composition analysis (e.g., bundles vs clothing-only packs), collection completion, and popup generation (DLC unlocks, inventory failures, character unowned prompts). It integrates closely with the `TheInventory`, `Profile`, and `STRINGS` systems, and defines no components—its functions are standalone utilities consumed by UI screens and logic layers.

## Usage example
```lua
-- Determine if a pack is a bundle and format its savings
local is_bundle, total_value = IsPackABundle("pack_starter_2019")
if is_bundle then
    local iap_def = GetIAPDef("pack_starter_2019")
    local sale_active, _ = IsSaleActive(iap_def)
    local price_str = BuildPriceStr(total_value, iap_def, sale_active)
    local savings = GetPackSavings(iap_def, total_value, sale_active)
    print(subfmt(STRINGS.UI.PACK_SAVINGS, {savings, price_str}))
end

-- Get next owned skin for a character, skipping locked ones
local next_skin = GetNextOwnedSkin("wilson", "wilson_cowboy")
if next_skin then
    -- Use next_skin to update client skin state
    TheFrontEnd:GetActiveScreen():DoCommerceForDefaultItem(next_skin)
end
```

## Dependencies & tags
**Components used:** TheInventory, Profile, TheFrontEnd, TheSim, TheItems, scheduler, softresolvefilepath  
**Tags:** `"CLOTHING_BODY"`, `"CHARACTER"`, `"EMOTE"`, `"EMOJI"`, `"ODDMENT"`, `"LOADING"`, `"PLAYERPORTRAIT"`, `"PROFILEFLAIR"`, `"MISC_BODY"`, `"LAVA"`, `"ICE"`, `"WINTER"`, `"VARG"`, `"VICTORIAN"`, `"HALLOWED"`, `"YULE"`, `"heirloom"`, `"common"`, `"proofofpurchase"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `dailyGiftType` | string\|nil | nil | Global tracking pending daily gift item type. |
| `newSkinDLCEntitlements` | table | {} | Global list of pending DLC entitlements for UI popups. |

## Main functions
### `GetNextRarity(rarity)`
* **Description:** Returns the next higher rarity in the predefined progression chain (Common → Classy → Spiffy → Distinguished → Elegant). Used by the tradescreen to determine upgrade paths.  
* **Parameters:** `rarity` (string) – current rarity name.  
* **Returns:** string – next rarity name, or `""` if none (e.g., for Elegant or non-mapped rarities).  

### `IsHeirloomRarity(rarity)`
* **Description:** Checks whether a given rarity is one of the heirloom rarities (HeirloomElegant, HeirloomClassy, HeirloomSpiffy, HeirloomDistinguished).  
* **Parameters:** `rarity` (string).  
* **Returns:** boolean – `true` if `rarity` is a heirloom variant.  

### `GetFrameSymbolForRarity(rarity)`
* **Description:** Returns the lowercase string or `"heirloom"` used for UI frame icons corresponding to the rarity.  
* **Parameters:** `rarity` (string).  
* **Returns:** string – lowercased rarity name, `"heirloom"` (for heirloom rarities), `"common"` (for Complimentary), or `"proofofpurchase"` (for Resurrected).  

### `GetBuildForItem(name)`
* **Description:** Returns the build name for an item, possibly overridden in its skin data.  
* **Parameters:** `name` (string) – item key.  
* **Returns:** string – `skin_data.build_name_override` if present, otherwise `name`.  

### `GetBigPortraitAnimForItem(item_key)`
* **Description:** Recursively fetches the `bigportrait_anim` for an item’s prefab, following `share_bigportrait_name` if present.  
* **Parameters:** `item_key` (string).  
* **Returns:** string or `nil` – anim asset name, or `nil` if not found.  

### `GetPortraitNameForItem(item_key)`
* **Description:** Returns the name used for portrait display, defaulting to item key if default character skin; otherwise uses `share_bigportrait_name` or build name.  
* **Parameters:** `item_key` (string).  
* **Returns:** string – portrait name.  

### `GetPackCollection(item_key)`
* **Description:** Attempts to extract a single collection name from the items in a pack. Returns `nil` if items belong to multiple collections.  
* **Parameters:** `item_key` (string) – pack item key.  
* **Returns:** string or `nil` – collection name (from `STRINGS.SKIN_TAG_CATEGORIES.COLLECTION[skin_tag]`), or `nil` if multiple/none.  

### `GetPackTotalItems(item_key)`
* **Description:** Returns the count of items in the output_items list for the pack.  
* **Parameters:** `item_key` (string).  
* **Returns:** number – count of items.  

### `IsItemInAnyPack(item_key)`
* **Description:** Checks whether `item_key` appears as an output item in any IAP pack.  
* **Parameters:** `item_key` (string).  
* **Returns:** boolean.  

### `GetPackTotalSets(item_key)`
* **Description:** Returns the count of unique sub-packs (non-zero only for bundles). Special-cases `"pack_starter_2019"`.  
* **Parameters:** `item_key` (string).  
* **Returns:** number – count.  

### `IsPackABundle(item_key)`
* **Description:** Memoized check whether `item_key` is a bundle (i.e., contains at least one non-free sub-pack).  
* **Parameters:** `item_key` (string).  
* **Returns:** two values:  
  - boolean – `true` if bundle (cost > 0).  
  - number – total cost of sub-packs (sum of `iap.virtual_currency_cost`, `iap.cents`, or `iap.rail_price`).  

### `GetPriceFromIAPDef(iap_def, sale_active)`
* **Description:** Returns the appropriate price field (virtual/steam/rail) based on IAP type and sale status.  
* **Parameters:**  
  - `iap_def` (table) – IAP definition table.  
  - `sale_active` (boolean).  
* **Returns:** number – price in cents or virtual currency units.  

### `BuildPriceStr(value, iap_def, sale_active)`
* **Description:** Formats a price value into a localized string, handling virtual/Steam/Rail currencies.  
* **Parameters:**  
  - `value` (number or iap_def) – may be precomputed price or IAP definition (if so, `value` is resolved first).  
  - `iap_def` (table).  
  - `sale_active` (boolean).  
* **Returns:** string – formatted price string.  

### `IsSaleActive(iap_def)`
* **Description:** Checks whether the IAP has an active sale.  
* **Parameters:** `iap_def` (table).  
* **Returns:** two values:  
  - boolean – `true` if sale in effect (`sale_percent > 0` and `sale_end > os.time()`).  
  - number – remaining duration in seconds.  

### `GetPackSavings(iap_def, total_value, sale_active)`
* **Description:** Computes percentage savings of a pack vs. total value of its contents.  
* **Parameters:**  
  - `iap_def` (table).  
  - `total_value` (number) – sum of individual item prices.  
  - `sale_active` (boolean).  
* **Returns:** number – floor of percentage savings.  

### `IsPackClothingOnly(item_key)`
* **Description:** Checks whether *all* items in the pack are clothing (type ∈ `{base, body, hand, legs, feet}`).  
* **Parameters:** `item_key` (string).  
* **Returns:** boolean.  

### `IsPackBelongingsOnly(item_key)`
* **Description:** Checks whether *all* items in the pack are of `type == "item"` (belongings).  
* **Parameters:** `item_key` (string).  
* **Returns:** boolean.  

### `IsPackFeatured(item_key)`
* **Description:** Checks `pack_data.featured_pack` field.  
* **Parameters:** `item_key` (string).  
* **Returns:** boolean.  

### `IsPackGiftable(item_key)`
* **Description:** Checks if pack has a `steam_dlc_id`.  
* **Parameters:** `item_key` (string).  
* **Returns:** boolean.  

### `GetPackGiftDLCID(item_key)`
* **Description:** Returns `steam_dlc_id` for gifting.  
* **Parameters:** `item_key` (string).  
* **Returns:** string or `nil`.  

### `GetReleaseGroup(item_key)`
* **Description:** Returns `data.release_group` from skin data, defaulting to `999`.  
* **Parameters:** `item_key` (string).  
* **Returns:** number.  

### `GetPurchaseDisplayForItem(item_key)`
* **Description:** Returns `{ display_atlas, display_tex }` if both present.  
* **Parameters:** `item_key` (string).  
* **Returns:** table with two strings or `nil`.  

### `GetBoxBuildForItem(item_key)`
* **Description:** Returns `pack_data.box_build` if defined; otherwise `"box_build undefined"`.  
* **Parameters:** `item_key` (string).  
* **Returns:** string.  

### `OwnsSkinPack(item_key)`
* **Description:** Checks whether the player owns *all* items in the pack. Returns `false` for currency packs.  
* **Parameters:** `item_key` (string).  
* **Returns:** boolean.  

### `IsPurchasePackCurrency(item_key)`
* **Description:** Checks whether the pack is a currency pack via `output_klei_currency_cost`.  
* **Parameters:** `item_key` (string).  
* **Returns:** boolean.  

### `GetPurchasePackCurrencyOutput(item_key)`
* **Description:** Returns `output_klei_currency_cost` or `nil`.  
* **Parameters:** `item_key` (string).  
* **Returns:** number or `nil`.  

### `GetPurchasePackDisplayItems(item_key)`
* **Description:** Returns `display_items` or `{}`.  
* **Parameters:** `item_key` (string).  
* **Returns:** table.  

### `GetPurchasePackOutputItems(item_key)`
* **Description:** Returns `output_items` or `{}`.  
* **Parameters:** `item_key` (string).  
* **Returns:** table.  

### `DoesPackHaveBelongings(pack_key)`
* **Description:** Checks if any item in the pack has type `"item"` (belongings).  
* **Parameters:** `pack_key` (string).  
* **Returns:** boolean.  

### `DoesPackHaveItem(pack_key, item_key)`
* **Description:** Checks if `item_key` is in the pack’s output items.  
* **Parameters:** `pack_key`, `item_key` (strings).  
* **Returns:** boolean.  

### `DoesPackHaveACharacter(pack_key)`
* **Description:** Checks if any item is a default character skin (via `IsDefaultCharacterSkin`).  
* **Parameters:** `pack_key` (string).  
* **Returns:** boolean.  

### `DoesPackHaveSkinsForCharacter(pack_key, character)`
* **Parameters:** `pack_key` (string), `character` (string).  
* **Returns:** boolean – `true` if any pack item appears in `SKIN_AFFINITY_INFO[character]`.  

### `IsClothingItem(name)`
* **Parameters:** `name` (string).  
* **Returns:** boolean – `true` if `CLOTHING[name]` exists.  

### `IsGameplayItem(name)`
* **Parameters:** `name` (string).  
* **Returns:** boolean – `true` if `GetTypeForItem(name) == "item"`.  

### `IsItemId(name)`
* **Parameters:** `name` (string).  
* **Returns:** boolean – `true` if found in any category table returned by `GetAllItemCategories()`.  

### `IsItemMarketable(item)`
* **Parameters:** `item` (string).  
* **Returns:** boolean – `skin_data.marketable`.  

### `GetSkinData(item)`
* **Parameters:** `item` (string).  
* **Returns:** table – first matching skin data from categories, else `{}`.  

### `GetColorForItem(item)`
* **Parameters:** `item` (string).  
* **Returns:** table `{r,g,b,a}` – `SKIN_RARITY_COLORS[rarity]` or `DEFAULT_SKIN_COLOR`.  

### `GetModifiedRarityStringForItem(item)`
* **Parameters:** `item` (string).  
* **Returns:** string – concatenated rarity modifier and base rarity strings (from `STRINGS.UI.RARITY`). Handles missing modifier gracefully.  

### `GetRarityModifierForItem(item)`
* **Parameters:** `item` (string).  
* **Returns:** string or `nil`.  

### `GetRarityForItem(item)`
* **Parameters:** `item` (string).  
* **Returns:** string – `skin_data.rarity`, defaulting to `"Common"`.  

### `GetEventIconForItem(item)`
* **Parameters:** `item` (string).  
* **Returns:** string or `nil` – key of first matching event (`event_forge`, etc.) based on `EVENT_ICONS` and `DoesItemHaveTag`.  

### `GetSkinUsableOnString(item_type, popup_txt)`
* **Parameters:**  
  - `item_type` (string).  
  - `popup_txt` (boolean) – selects variant of `USABLE_ON_*` string.  
* **Returns:** string – formatted string listing items the skin is usable on, or `""`. Handles up to 3 items.  

### `IsUserCommerceAllowedOnItemData(item_data)`
* **Parameters:** `item_data` (table).  
* **Returns:** boolean – `false` if `is_dlc_owned` and `owned_count == 1`; otherwise defers to `IsUserCommerceAllowedOnItemType`.  

### `IsUserCommerceAllowedOnItemType(item_key)`
* **Parameters:** `item_key` (string).  
* **Returns:** boolean – delegate to `IsUserCommerceSellAllowedOnItem` or `IsUserCommerceBuyAllowedOnItem` depending on ownership.  

### `IsUserCommerceSellAllowedOnItem(item_type)`
* **Parameters:** `item_type` (string).  
* **Returns:** boolean – `true` if owned (`num_owned > 0`) and `BarterSellPrice(item_type) ~= 0`.  

### `GetCharacterRequiredForItem(item_type)`
* **Parameters:** `item_type` (string).  
* **Returns:** string – `data.base_prefab`, or prints error and returns `nil`.  

### `IsUserCommerceBuyRestrictedDueType(item_type)`
* **Parameters:** `item_type` (string).  
* **Returns:** boolean – `true` if `rarity_modifier == nil`.  

### `IsUserCommerceBuyRestrictedDueToOwnership(item_type)`
* **Parameters:** `item_type` (string).  
* **Returns:** boolean – `true` if item is unrestricted character base and character not owned.  

### `IsPackRestrictedDueToOwnership(item_type)`
* **Parameters:** `item_type` (string).  
* **Returns:** three values:  
  - `""`, or `"warning"`, or `"error"`.  
  - character prefab name (if applicable), or `nil`.  

### `IsUserCommerceBuyAllowedOnItem(item_type)`
* **Parameters:** `item_type` (string).  
* **Returns:** boolean – `true` if not restricted and `owned_count == 0` and `BarterBuyPrice ~= 0`.  

### `GetTypeForItem(item)`
* **Parameters:** `item` (string).  
* **Returns:** two values:  
  - string – `"unknown"`, `"base"`, `"body"`, `"item"`, etc.  
  - string – normalized (lowercased) item name.  

### `DoesItemHaveTag(item, tag)`
* **Parameters:**  
  - `item`, `tag` (strings).  
* **Returns:** boolean – checks `skin_tags` in `CLOTHING`, `MISC_ITEMS`, `EMOTE_ITEMS`, or `Prefabs[item]`.  

### `GetSkinName(item)`
* **Parameters:** `item` (string).  
* **Returns:** string – localized name from `STRINGS.SKIN_NAMES`, or `"missing"` if missing (unless debugging, then returns raw item).  

### `GetSkinDescription(item)`
* **Parameters:** `item` (string).  
* **Returns:** string – localized description or `"missing"`.  

### `GetSkinInvIconName(item)`
* **Parameters:** `item` (string).  
* **Returns:** string – cleaned icon name (strips `_builder`, `_none`, empty → `"default"`).  

### `CompareItemDataForSortByRelease(item_key_a, item_key_b)`
* **Parameters:** Two item keys.  
* **Returns:** boolean – sort order by release group, then rarity, then name. Handles default skins.  

### `CompareItemDataForSortByName(item_key_a, item_key_b)`
* **Parameters:** Two item keys.  
* **Returns:** boolean – sort order by lexically combined name+key (default skins first).  

### `CompareItemDataForSortByRarity(item_key_a, item_key_b)`
* **Parameters:** Two item keys.  
* **Returns:** boolean – same as `CompareItemDataForSortByRelease`, but skip release group check.  

### `CompareItemDataForSortByCount(item_key_a, item_key_b, item_counts)`
* **Parameters:** Two item keys, and `item_counts` (table).  
* **Returns:** boolean – sort by descending count, then lexically.  

### `GetInventoryTimestamp()`
* **Returns:** number – latest `modified_time` among inventory items.  

### `GetInventorySkinsList(do_sort)`
* **Parameters:** `do_sort` (boolean).  
* **Returns:** table – list of `{type, item, rarity, timestamp, item_id}` entries. Sorted only if `do_sort`.  

### `GetOwnedItemCounts()`
* **Returns:** table – `{item_key = count}`. Very expensive; use ≤ once/frame.  

### `GetFirstOwnedItemId(item_key)`
* **Parameters:** `item_key` (string).  
* **Returns:** number – first matching item_id (excluding `TEMP_ITEM_ID`), or `nil`.  

### `CopySkinsList(list)`
* **Parameters:** `list` (table).  
* **Returns:** new table with shallow-copied entries (keys: `type`, `item`, `item_id`, `timestamp = modified_time`).  

### `GetItemCollectionName(item_type)`
* **Parameters:** `item_type` (string).  
* **Returns:** string or `nil` – collection name from `STRINGS.SKIN_TAG_CATEGORIES.COLLECTION` if item has a matching tag.  

### `IsItemInCollection(item_type)`
* **Parameters:** `item_type` (string).  
* **Returns:** two values:  
  - boolean – `true` if item is a set bonus or in any set.  
  - string or `nil` – bonus item key if found.  

### `IsItemIsReward(item_type)`
* **Parameters:** `item_type` (string).  
* **Returns:** boolean – `true` if item is a set bonus.  

### `WillUnravelBreakEnsemble(item_type)`
* **Parameters:** `item_type` (string).  
* **Returns:** boolean – `true` if unraveling would break the currently fulfilled ensemble.  

### `WillUnravelBreakRestrictedCharacter(item_type)`
* **Parameters:** `item_type` (string).  
* **Returns:** boolean – `true` if unraveling the *only* owned instance of a restricted default character skin.  

### `HasHeirloomItem(herocharacter)`
* **Parameters:** `herocharacter` (string).  
* **Returns:** boolean – `true` if any affinity item has heirloom rarity.  

### `GetSkinCollectionCompletionForHero(herocharacter)`
* **Parameters:** `herocharacter` (string).  
* **Returns:** three values:  
  - number – count of owned (unique build) skins.  
  - number – count of missing (unique build) skins.  
  - boolean – whether heirloom is owned.  

### `GetNullFilter()`
* **Returns:** function – always returns `true`.  

### `GetAffinityFilterForHero(herocharacter)`
* **Returns:** function – filters `item_key` if default or in `SKIN_AFFINITY_INFO[herocharacter]`.  

### `GetLockedSkinFilter()`
* **Returns:** function – filters `item_key` if default or owned.  

### `GetWeaveableSkinFilter()`
* **Returns:** function – filters `item_key` if default or has `BarterBuyPrice ~= 0`.  

### `GetMysteryBoxCounts()`
* **Returns:** table – `{mysterybox_item_key = count}`.  

### `GetTotalMysteryBoxCount()`
* **Returns:** number – total count of all mystery box items.  

### `GetMysteryBoxItemID(item_type)`
* **Parameters:** `item_type` (string).  
* **Returns:** number – `item_id` of first owned instance, or `0`.  

### `CalculateShopHash()`
* **Returns:** string – hash of concatenated IAP item types (filtered to those with `MISC_ITEMS` data).  

### `IsShopNew(user_profile)`
* **Parameters:** `user_profile` (table).  
* **Returns:** boolean – `true` if shop hash differs or IAP defs empty.  

### `IsAnyItemNew(user_profile)`
* **Parameters:** `user_profile` (table).  
* **Returns:** boolean – `true` if any inventory item is newer than stored collection timestamp.  

### `ShouldDisplayItemInCollection(item_type)`
* **Parameters:** `item_type` (string).  
* **Returns:** boolean – `false` if blacklisted; for rare rarities, only if owned.  

### `IsRestrictedCharacter(prefab)`
* **Parameters:** `prefab` (string).  
* **Returns:** boolean – `data.is_restricted` for `prefab.."_none"`.  

### `IsCharacterOwned(prefab)`
* **Parameters:** `prefab` (string).  
* **Returns:** boolean – `IsDefaultSkinOwned(prefab.."_none")`.  

### `IsDefaultSkinOwned(item_key)`
* **Parameters:** `item_key` (string).  
* **Returns:** boolean – for default skins: if restricted, checks ownership; otherwise `true`.  

### `IsDefaultSkin(item_key)`
* **Parameters:** `item_key` (string).  
* **Returns:** boolean – `true` if default clothing/beefclothing/character skin.  

### `IsPrefabSkinned(prefab)`
* **Parameters:** `prefab` (string).  
* **Returns:** boolean – `true` if `PREFAB_SKINS[prefab]` exists.  

### `IsDefaultCharacterSkin(item_key)`
* **Parameters:** `item_key` (string).  
* **Returns:** boolean – `true` if ends with `"_none"`.  

### `IsDefaultClothing(item_key)`
* **Parameters:** `item_key` (string).  
* **Returns:** boolean – `true` if `CLOTHING[item_key].is_default`.  

### `IsDefaultBeefClothing(item_key)`
* **Parameters:** `item_key` (string).  
* **Returns:** boolean – `true` if `BEEFALO_CLOTHING[item_key].is_default`.  

### `IsDefaultMisc(item_key)`
* **Parameters:** `item_key` (string).  
* **Returns:** boolean – `true` if `MISC_ITEMS[item_key].is_default`.  

### `GetCharacterSkinBases(hero)`
* **Parameters:** `hero` (string).  
* **Returns:** table – `{item_key = PrefabTable}` for character head (non-gameplay) skins.  

### `GetAllGameplayItems()`
* **Returns:** table – `{item_key = PrefabTable}` for gameplay item skins.  

### `IsValidClothing(name)`
* **Parameters:** `name` (string).  
* **Returns:** boolean – `true` if non-default clothing.  

### `IsValidBeefaloClothing(name)`
* **Parameters:** `name` (string).  
* **Returns:** boolean – `true` if non-default beefalo clothing.  

### `ValidatePreviewItems(currentcharacter, preview_skins, filter)`
* **Parameters:**  
  - `currentcharacter` (string).  
  - `preview_skins` (table).  
  - `filter` (function) – unused in this chunk.  
* **Modifies:** removes invalid entries from `preview_skins` (non-clothing/non-beefclothing, except `"base"`).  

### `ValidateItemsLocal(currentcharacter, selected_skins)`
* **Parameters:**  
  - `currentcharacter`, `selected_skins` (table/string).  
* **Modifies:** removes items from `selected_skins` if unowned or invalid type (clothing/beefclothing).  

### `ValidateItemsInProfile(user_profile)`
* **Parameters:** `user_profile` (table).  
* **Modifies:** revokes unowned items in profile; forces offline cache load if needed.  

### `CacheCurrentVanityItems(user_profile)`
* **Parameters:** `user_profile` (table).  
* **Calls:** `TheInventory:SetLocalVanityItems(all_vanity)`.  

### `GetRemotePlayerVanityItem(active_cosmetics, item_type)`
* **Parameters:**  
  - `active_cosmetics` (table), `item_type` (string).  
* **Returns:** string or `nil` – first item matching `item_type`.  

### `GetSkinsDataFromClientTableData(data)`
* **Parameters:** `data` (table) – from client.  
* **Returns:** five values:  
  - `base_skin`, `clothing` (table with `body/hand/legs/feet`), `playerportrait`, `profileflair`, `eventlevel`.  

### `BuildListOfSelectedItems(user_profile, item_type)`
* **Description:** Filters and returns a sorted list of owned, active customization items for a given item type from the user profile.  
* **Parameters:**  
  - `user_profile`: Profile object; must support `:GetCustomizationItemsForType(item_type)` returning a table of `{item_key → is_active}`.  
  - `item_type`: String indicating the type of customization item (e.g., "character", "back").  
* **Returns:** Table of `item_key` strings, sorted alphabetically. Only includes keys where `is_active == true` AND `TheInventory:CheckOwnership(item_key) == true`.  

### `GetNextOwnedSkin(prefab, cur_skin)`
* **Description:** Finds the next owned and valid skin in the list for a given prefab, wrapping around from end to start if needed. Skips skins in `PREFAB_SKINS_SHOULD_NOT_SELECT`, and (if locked) requires `IsSpecialEventActive` for event-locked skins.  
* **Parameters:**  
  - `prefab`: String, prefab name of the character/ item.  
  - `cur_skin`: Optional string, current skin name; used to find the next one.  
* **Returns:** String skin name or `nil`. If no next skin found, and `prefab` is in `PREFAB_SKINS_SHOULD_NOT_SELECT`, returns `cur_skin`.  

### `GetPrevOwnedSkin(prefab, cur_skin)`
* **Description:** Finds the previous owned and valid skin in the list for a given prefab, wrapping around from start to end if needed. Skips skins in `PREFAB_SKINS_SHOULD_NOT_SELECT`, and (if locked) requires `IsSpecialEventActive` for event-locked skins.  
* **Parameters:**  
  - `prefab`: String, prefab name.  
  - `cur_skin`: Optional string, current skin name.  
* **Returns:** String skin name or `nil`. If no prev skin found, and `prefab` is in `PREFAB_SKINS_SHOULD_NOT_SELECT`, returns `cur_skin`.  

### `GetMostRecentlySelectedItem(user_profile, item_type)`
* **Description:** Retrieves the last selected item key for a given item type from the user profile.  
* **Parameters:**  
  - `user_profile`: Profile object; must support `:GetCustomizationItemState(item_type, "last_item_key")`.  
  - `item_type`: String.  
* **Returns:** Stored `"last_item_key"` value (may be `nil`).  

### `GetLoaderAtlasAndTex(item_key)`
* **Description:** Returns the loader atlas XML and texture path for a skin item key, falling back to a default spiral if the skin loader files are missing.  
* **Parameters:**  
  - `item_key`: String, e.g., `"wilson"` or `"wx78"`.  
* **Returns:** Two strings: `atlas_path`, `tex_path`. On fallback, returns `"images/bg_spiral.xml"` and `"bg_spiral.tex"`.  

### `GetProfileFlairAtlasAndTex(item_key)`
* **Description:** Returns profile flair atlas path, texture path, and default fallback (if applicable).  
* **Parameters:**  
  - `item_key`: Optional string.  
* **Returns:**  
  - If `item_key` is present: `("images/profileflair.xml", item_key .. ".tex", "profileflair_none.tex")`  
  - If `nil`: `("images/profileflair.xml", "profileflair_none.tex")`  

### `GetPlayerPortraitAtlasAndTex(item_key)`
* **Description:** Returns player portrait atlas and texture path, with fallback if `item_key` is missing or missing files.  
* **Parameters:**  
  - `item_key`: Optional string.  
* **Returns:** Two strings: `atlas_path`, `tex_path`. Uses `"playerportrait_bg_none"` as fallback if `item_key` is `nil` or missing.  

### `SetDailyGiftItem(item_type)`
* **Description:** Sets a pending daily gift item type for later retrieval.  
* **Parameters:**  
  - `item_type`: String or `nil`.  
* **Returns:** None (sets global `dailyGiftType`).  

### `IsDailyGiftItemPending()`
* **Description:** Checks if a daily gift item is pending.  
* **Parameters:** None.  
* **Returns:** Boolean (`true` if `dailyGiftType ~= nil`).  

### `GetDailyGiftItem()`
* **Description:** Returns and clears the pending daily gift item.  
* **Parameters:** None.  
* **Returns:** Stored `dailyGiftType` value (string or `nil`). Clears global after retrieval.  

### `IsSkinDLCEntitlementReceived(entitlement)`
* **Description:** Checks if a given DLC entitlement has been received for the current profile.  
* **Parameters:**  
  - `entitlement`: String entitlement ID.  
* **Returns:** Boolean (`Profile:IsEntitlementReceived(entitlement)`).  

### `SetSkinDLCEntitlementReceived(entitlement)`
* **Description:** Marks a given DLC entitlement as received for the profile.  
* **Parameters:**  
  - `entitlement`: String entitlement ID.  
* **Returns:** None (sets in `Profile`).  

### `AddNewSkinDLCEntitlement(entitlement)`
* **Description:** Adds an entitlement to the pending DLC entitlements list (for popup testing).  
* **Parameters:**  
  - `entitlement`: String entitlement ID.  
* **Returns:** None (modifies global `newSkinDLCEntitlements` table).  

### `HasNewSkinDLCEntitlements()`
* **Description:** Checks if any pending DLC entitlements exist.  
* **Parameters:** None.  
* **Returns:** Boolean (`#newSkinDLCEntitlements > 0`).  

### `GetNewSkinDLCEntitlement()`
* **Description:** Pops and returns the last added DLC entitlement (LIFO).  
* **Parameters:** None.  
* **Returns:** String entitlement ID or `nil`. Removes from `newSkinDLCEntitlements`.  

### `MakeSkinDLCPopup(_cb)`
* **Description:** Displays a DLC/unlock popup (box opener or legacy thank-you) using pending entitlements. Recursively calls itself if removal yields `nil`.  
* **Parameters:**  
  - `_cb`: Optional callback executed when no DLC remains to show.  
* **Returns:** None (pushes screen(s)).  

### `DisplayCharacterUnownedPopup(character, skins_subscreener)`
* **Description:** Shows a popup for attempting to use an unowned character, offering to buy or visit shop.  
* **Parameters:**  
  - `character`: String prefab name (e.g., `"wolfgang"`).  
  - `skins_subscreener`: UI screen object; must have `sub_screens["base"].picker` with `:DoCommerceForDefaultItem` and `:DoShopForDefaultItem`.  
* **Returns:** None (pushes popup screen).  

### `DisplayInventoryFailedPopup(screen)`
* **Description:** Shows recovery popups for failed inventory sync — either login/restart prompts or fetching inventory dialog.  
* **Parameters:**  
  - `screen`: UI screen object with `leave_from_fail`, `poll_task`, `items_get_popup`, `Close`, and `FinishedFadeIn`.  
* **Returns:** None (pushes popup(s)).  

### `GetSkinModes(character)`
* **Description:** Returns an array of skin mode descriptors for a given character, including anim_bank, scale, offsets, and state flags.  
* **Parameters:**  
  - `character`: String prefab name (e.g., `"woodie"`, `"wolfgang"`).  
* **Returns:** Array of tables; each has keys like `type`, `play_emotes`, `anim_bank`, `scale`, `offset`. Falls back to `default`.  

### `GetPlayerBadgeData(character, ghost, state_1, state_2, state_3)`
* **Description:** Returns animation and skin data needed to render player badges (e.g., in lobby). Uses hard-coded logic per character.  
* **Parameters:**  
  - `character`: String prefab.  
  - `ghost`: Boolean, whether showing ghost variant.  
  - `state_1`, `state_2`, `state_3`: Booleans for special states (e.g., Wolie’s wereforms, Wormwood stages).  
* **Returns:** Five values: `anim_bank` (string), `anim_state` (string), `skin_name` (string), `scale` (number), `y_offset` (number).  

### `GetSkinModeFromBuild(player)`
* **Description:** Maps an entity’s current `AnimState:GetBuild()` to a skin type key.  
* **Parameters:**  
  - `player`: Entity; must have `AnimState` with `:GetBuild()` and `prefab` property.  
* **Returns:** String skin mode (e.g., `"normal_skin"`, `"werebeaver_skin"`) or `nil`.  

### `GetBoxPopupLayoutDetails(num_item_types)`
* **Description:** Determines popup layout configuration for item box popups — columns and resize flags based on item count.  
* **Parameters:**  
  - `num_item_types`: Integer, number of item types in the box.  
* **Returns:** Five values:  
  - `columns` (int),  
  - `resize_root` (bool or `nil`),  
  - `resize_root_small` (bool or `nil`),  
  - `resize_root_small_higher` (bool or `nil`),  
  - `resize_root_thisisreallybig` (bool or `nil`).  

### `GetPurchasePackFromEntitlement(entitlement_id)`
* **Description:** Looks up purchase pack type from entitlement ID.  
* **Parameters:**  
  - `entitlement_id`: String entitlement ID.  
* **Returns:** `pack_type` string (currently only supports PSN mapping, but logic always uses it).  

## Events & listeners
No events are defined or emitted by this component. It consumes events (via listeners) indirectly via dependencies like `TheInventory` but does not register its own.