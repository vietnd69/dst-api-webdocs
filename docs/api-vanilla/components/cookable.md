---
id: cookable
title: Cookable
sidebar_position: 10
---

# Cookable Component

The Cookable component allows entities to be cooked, typically on a fire or in a cooking station, transforming them into a cooked variant.

## Basic Usage

```lua
-- Add a cookable component to an entity
local entity = CreateEntity()
entity:AddComponent("cookable")

-- Configure the cookable component
local cookable = entity.components.cookable
cookable:SetProduct("cookedcarrot")
cookable:SetCookTime(1)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `product` | String | Prefab name of the item that will be created when cooked |
| `cooktime` | Number | Time in seconds it takes to cook this item |
| `oncookfn` | Function | Custom function called when the item is cooked |

## Key Methods

```lua
-- Set the product that will be created when cooked
cookable:SetProduct("cookedmeat")

-- Set how long it takes to cook (in seconds)
cookable:SetCookTime(2.5)

-- Set a callback for when the item is cooked
cookable:SetOnCookedFn(function(inst, cooker, chef)
    -- Do something when cooked
    print(chef.name .. " cooked " .. inst.prefab)
end)
```

## Events

The Cookable component doesn't directly trigger any events, but cooking an item typically results in the original item being removed and a new cooked version being created.

## Integration with Other Components

The Cookable component often works with:

- `Perishable` - Cooked items may have different spoilage rates
- `Edible` - Cooking typically changes the food values of items
- `Stackable` - Cooking may affect stack size or properties
- `Inventoryitem` - The cooked item becomes a new inventory item

## Example: Creating a Cookable Item

```lua
local function MakeCookableItem()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Make it an inventory item
    inst:AddComponent("inventoryitem")
    
    -- Make it cookable
    inst:AddComponent("cookable")
    inst.components.cookable:SetProduct("cookeditem")
    inst.components.cookable:SetCookTime(1.5)
    
    return inst
end
``` 