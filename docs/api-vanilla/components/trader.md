---
id: trader
title: Trader
sidebar_position: 28
---

# Trader Component

The Trader component allows entities to participate in trading interactions, accepting items from players or other entities. It manages trade acceptance, rejection, and the resulting effects of successful trades.

## Basic Usage

```lua
-- Add a trader component to an entity
local entity = CreateEntity()
entity:AddComponent("trader")

-- Configure the trader component
local trader = entity.components.trader
trader:SetAcceptTest(function(inst, item)
    return item.prefab == "goldnugget"
end)
trader.onaccept = function(inst, giver, item)
    giver.components.inventory:GiveItem(SpawnPrefab("cutstone"))
end
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `accepttest` | Function | Function that tests if an item is acceptable for trade |
| `onaccept` | Function | Callback when a trade is accepted |
| `onrefuse` | Function | Callback when a trade is refused |
| `deleteitemonaccept` | Boolean | Whether to delete the traded item on acceptance |
| `trading` | Boolean | Whether the entity is currently trading |
| `enabled` | Boolean | Whether trading is currently enabled |
| `gold_value` | Number | Value of this entity for gold-based trades |
| `rocktribute_value` | Number | Value of this entity for rock tributes |

## Key Methods

### Trade Configuration

```lua
-- Set a test function for accepting trades
trader:SetAcceptTest(function(inst, item, giver)
    -- Only accept gold nuggets
    return item.prefab == "goldnugget"
end)

-- Set callbacks for trade outcomes
trader.onaccept = function(inst, giver, item)
    -- Do something when trade is accepted
    local reward = SpawnPrefab("blueprint")
    giver.components.inventory:GiveItem(reward)
end

trader.onrefuse = function(inst, giver, item)
    -- Do something when trade is refused
    inst:PushEvent("refusetrade")
end
```

### Managing Trades

```lua
-- Enable or disable trading
trader:Enable(true)

-- Check if an item is acceptable
local will_accept = trader:IsTryingToTradeWithMe(giver, item)

-- Manually accept a trade
trader:AcceptGift(giver, item)
```

## Trade Types

Various types of trading interactions are possible:

- **Item for Item**: Giving an item and receiving another in return
- **Item for Service**: Giving an item to trigger an effect (like statues)
- **NPC Trading**: More complex trade interactions with characters
- **Tributes**: Giving items to appease entities or gain bonuses

## Integration with Other Components

The Trader component often works with:

- `Inventory` - For managing items involved in trades
- `Talker` - For dialogue during trading
- `Named` - For naming trade partners
- `SpawnPrefab` - For creating reward items
- `ItemDropper` - For dropping traded items

## See also

- [Inventory Component](inventory.md) - For managing items involved in trades
- [Talker Component](other-components.md) - For dialogue during trading
- [LootDropper Component](lootdropper.md) - For dropping items as rewards
- [Combat Component](combat.md) - For hostile traders that may attack
- [Inspectable Component](inspectable.md) - For examining traders

## Example: Simple Item Trader

```lua
local function MakeItemTrader()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Make it a trader
    inst:AddComponent("trader")
    
    -- Configure trading
    local trader = inst.components.trader
    
    -- Accept test function
    trader:SetAcceptTest(function(inst, item)
        -- Only accept gold nuggets and gems
        return item.prefab == "goldnugget" or item:HasTag("gem")
    end)
    
    -- When trade is accepted
    trader.onaccept = function(inst, giver, item)
        -- Different rewards based on what was given
        local reward = nil
        
        if item.prefab == "goldnugget" then
            -- Gold gets a random tool
            local tools = {"axe", "pickaxe", "shovel"}
            reward = SpawnPrefab(tools[math.random(#tools)])
        elseif item:HasTag("gem") then
            -- Gems get a random magical item
            local magic_items = {"icestaff", "firestaff", "telestaff"}
            reward = SpawnPrefab(magic_items[math.random(#magic_items)])
        end
        
        if reward ~= nil then
            giver.components.inventory:GiveItem(reward)
            -- Play success animation
            inst.AnimState:PlayAnimation("happy")
        end
    end
    
    -- When trade is refused
    trader.onrefuse = function(inst, giver, item)
        -- Play refuse animation
        inst.AnimState:PlayAnimation("refuse")
        -- Maybe say something
        if inst.components.talker ~= nil then
            inst.components.talker:Say("I don't want that!")
        end
    end
    
    return inst
end

-- Example of a shop-like trader
local function MakeShopKeeper()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Make it a trader
    inst:AddComponent("trader")
    
    -- Configure pricing
    local prices = {
        spear = 3,       -- 3 gold for a spear
        armor = 5,       -- 5 gold for armor
        heatrock = 2,    -- 2 gold for a heat rock
    }
    
    -- Accept test function
    inst.components.trader:SetAcceptTest(function(inst, item, giver)
        -- Only accept gold
        if item.prefab ~= "goldnugget" then
            return false
        end
        
        -- Check if player has selected an item to buy
        if inst.itemtobuy == nil then
            return false
        end
        
        -- Check if they have enough gold
        local gold_count = 0
        if item.components.stackable ~= nil then
            gold_count = item.components.stackable:StackSize()
        else
            gold_count = 1
        end
        
        return gold_count >= prices[inst.itemtobuy]
    end)
    
    -- When trade is accepted
    inst.components.trader.onaccept = function(inst, giver, item)
        -- Create the purchased item
        local purchase = SpawnPrefab(inst.itemtobuy)
        giver.components.inventory:GiveItem(purchase)
        
        -- Reset shop state
        inst.itemtobuy = nil
    end
    
    -- Add talking for the shop
    inst:AddComponent("talker")
    
    -- Function to show wares
    inst.ShowWares = function(inst, giver)
        inst.components.talker:Say("I sell spears (3 gold), armor (5 gold), and heat rocks (2 gold).")
    end
    
    return inst
end
``` 