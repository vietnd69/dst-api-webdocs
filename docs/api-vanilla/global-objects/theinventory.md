---
id: theinventory
title: TheInventory
sidebar_position: 6
---

# TheInventory

TheInventory is the global object that manages the player's item collection, including character skins, clothing items, and other inventory-related functionality. It primarily deals with Steam inventory items and skins in Don't Starve Together.

## Basic Usage

```lua
-- Check if a player owns a specific item (skin)
local has_skin = TheInventory:CheckOwnership("wilson_formal_skin")

-- Check if client has ownership of an item
local has_item = TheInventory:CheckClientOwnership(userid, item_type)

-- Check if an item (skin) exists
local skin_exists = TheInventory:CheckItemExists("wilson_formal_skin")

-- Get the total count of items owned
local item_count = TheInventory:GetOwnedItemCount()

-- Check ownership of virtual items (like rewards)
local has_virtual_item = TheInventory:CheckOwnershipGetLatest(item_type)
```

## Skin Management

```lua
-- Get all owned skins for a specific item
local skins = TheInventory:GetAllOwnedSkinsForItem("backpack")

-- Check if a skin is valid for a specific item
local is_valid = TheInventory:CheckValidSkinForItem("backpack_musicalchest_skin", "backpack")

-- Get the last used skin for an item
local last_skin = TheInventory:GetLastUsedSkinForItem("backpack")

-- Mark a skin as used for an item
TheInventory:SetLastUsedSkinForItem("backpack", "backpack_musicalchest_skin")

-- Get a list of recent skins
local recent_skins = TheInventory:GetRecentSkins()

-- Check if a skin is a character skin
local is_character_skin = TheInventory:IsCharacterSkin("wilson_formal_skin")

-- Get a list of all owned character skins
local character_skins = TheInventory:GetOwnedCharacterSkins()
```

## Item Classification

```lua
-- Get the item type of a skin
local item_type = TheInventory:GetItemType("wilson_formal_skin")

-- Get the rarity value of a skin
local rarity = TheInventory:GetRarityValueOfItem("wilson_formal_skin")
-- 0: Common, 1: Classy, 2: Spiffy, 3: Distinguished, 4: Elegant, 5: Event

-- Check if a skin belongs to an event
local is_event_item = TheInventory:GetIsItemEventItem("wilson_formal_skin")

-- Get the event name for an event item
local event_name = TheInventory:GetItemEventName("wilson_formal_skin")

-- Check if an item is a DLC item
local is_dlc_item = TheInventory:IsDLCItem("wilson_formal_skin")
```

## Virtual Currency and Rewards

```lua
-- Get available virtual currency
local currency = TheInventory:GetVirtualIAPCurrency()

-- Get current sale information
local sale_info = TheInventory:GetSalesInfo()

-- Check if a specific sale is active
local sale_active = TheInventory:IsItemOnSale("wilson_formal_skin")

-- Get the discount percentage for an item
local discount = TheInventory:GetItemDiscountPercentage("wilson_formal_skin")

-- Get progression rewards
local rewards = TheInventory:GetPersistentCompletionRewards(key)
```

## Collection Interfaces

```lua
-- Get all collections
local collections = TheInventory:GetAllCollections()

-- Get owned items in a collection
local owned_items = TheInventory:GetOwnedItemsInCollection(collection_name)

-- Get all items in a collection
local all_items = TheInventory:GetAllItemsInCollection(collection_name)
```

## Trading and Gifting

```lua
-- Check if we can trade with a player
local can_trade = TheInventory:CanTradeWithUser(user)

-- Check if an item is tradeable
local is_tradeable = TheInventory:IsItemTradable("wilson_formal_skin")

-- Check if an item is giftable
local is_giftable = TheInventory:IsItemGiftable("wilson_formal_skin")

-- Start a trade with a user
TheInventory:StartTrade(user)
```

## Item Appearance

```lua
-- Get the display name of a skin
local display_name = TheInventory:GetDisplayNameForItem("wilson_formal_skin")

-- Get the base clothing type
local clothing_type = TheInventory:GetBaseItemFromClothingItem("wilson_formal_skin")

-- Check if an item is clothing
local is_clothing = TheInventory:IsItemIsClothing("wilson_formal_skin")
```

## Important Considerations

1. **Client-Side Only**: Most TheInventory functions only work on the client, not on dedicated servers
2. **Steam Integration**: TheInventory primarily interacts with Steam inventory, so offline mode may have limited functionality
3. **Ownership Verification**: Always check ownership before applying skins to avoid errors
4. **Performance**: Avoid excessive inventory checks in frequently called functions
5. **Item Validity**: Always verify if skins are valid for specific items to prevent errors

## Common Use Cases

- **Skin Selection**: Allowing players to choose from their owned skins
- **Inventory Management**: Displaying owned items and skins in UI
- **Currency Systems**: Integrating with virtual currency and rewards
- **Collection Tracking**: Showing progress in completing collections
- **Trading Systems**: Implementing item trading functionality 