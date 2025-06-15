---
id: edible
title: Edible
sidebar_position: 22
version: 619045
---

# Edible Component

The Edible component defines the properties of items that can be eaten. It manages food values, spoilage effects, and special food effects.

## Basic Usage

```lua
-- Add an edible component to an entity
local entity = CreateEntity()
entity:AddComponent("edible")

-- Configure the edible component
local edible = entity.components.edible
edible:SetHealth(10)
edible:SetHunger(20)
edible:SetSanity(5)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `healthvalue` | Number | Health restored when eaten |
| `hungervalue` | Number | Hunger restored when eaten |
| `sanityvalue` | Number | Sanity restored when eaten |
| `foodtype` | String | Type of food (MEAT, VEGGIE, GENERIC, etc.) |
| `secondaryfoodtype` | String | Secondary food classification |
| `foodstate` | String | State of the food (FRESH, STALE, SPOILED) |
| `oneaten` | Function | Function called when eaten |
| `temperaturedelta` | Number | Temperature change when eaten |
| `temperatureduration` | Number | Duration of temperature effect |
| `stale_hunger` | Number | Hunger value when stale |
| `stale_health` | Number | Health value when stale |
| `spoiled_hunger` | Number | Hunger value when spoiled |
| `spoiled_health` | Number | Health value when spoiled |

## Key Methods

```lua
-- Set food values
edible:SetHealth(5) -- Health restored
edible:SetHunger(25) -- Hunger restored
edible:SetSanity(-10) -- Sanity effect (negative for sanity loss)

-- Set food type
edible:SetFoodType(FOODTYPE.MEAT)

-- Set temperature effects
edible:SetTemperature(10, 120) -- +10°C for 120 seconds

-- Get current food values based on freshness
local health, hunger, sanity = edible:GetHealth(), edible:GetHunger(), edible:GetSanity()

-- Set callback for when eaten
edible:SetOnEatenFn(function(inst, eater)
    -- Do something when this food is eaten
    print(eater.prefab .. " ate " .. inst.prefab)
end)
```

## Food Types

Common food types include:

- `FOODTYPE.MEAT` - Meat items
- `FOODTYPE.VEGGIE` - Vegetables
- `FOODTYPE.FRUIT` - Fruits
- `FOODTYPE.GENERIC` - Generic edibles
- `FOODTYPE.GOODIES` - Special treats
- `FOODTYPE.SEEDS` - Seeds
- `FOODTYPE.MONTSTER` - Monster foods
- `FOODTYPE.INSECT` - Insect foods

## Food States

Food can be in different states, which affect its values:

- **Fresh** - Full food values
- **Stale** - Reduced food values (typically 50-75% of fresh values)
- **Spoiled** - Significantly reduced food values (typically 25-50% of fresh values)

## Integration with Other Components

The Edible component often works with:

- `Perishable` - For food spoilage mechanics
- `Inventoryitem` - For storing food in inventory
- `Stackable` - For stacking identical food items
- `Eater` - The component that consumes edible items
- `FoodMemory` - For tracking eaten food preferences

## See also

- [Eater Component](eater.md) - For entities that can consume food
- [Perishable Component](perishable.md) - For food spoilage mechanics
- [Cookable Component](cookable.md) - For food that can be cooked
- [Stackable Component](stackable.md) - For stacking food items
- [Health Component](health.md) - For health effects from food
- [Hunger Component](hunger.md) - For hunger effects from food
- [Sanity Component](sanity.md) - For sanity effects from food

## Example: Creating an Edible Food Item

```lua
local function MakeFood()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Make it an inventory item
    inst:AddComponent("inventoryitem")
    
    -- Make it edible
    inst:AddComponent("edible")
    local edible = inst.components.edible
    edible:SetHealth(1)
    edible:SetHunger(12.5)
    edible:SetSanity(0)
    edible:SetFoodType(FOODTYPE.VEGGIE)
    
    -- Make it perishable
    inst:AddComponent("perishable")
    inst.components.perishable:SetPerishTime(TUNING.PERISH_FAST)
    inst.components.perishable:StartPerishing()
    
    -- Add a special effect when eaten
    edible:SetOnEatenFn(function(inst, eater)
        if eater.components.temperature ~= nil then
            -- Cool down the eater slightly
            eater.components.temperature:SetTemperatureInBelly(-5, 120)
        end
    end)
    
    return inst
end 