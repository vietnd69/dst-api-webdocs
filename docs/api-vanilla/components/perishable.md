---
id: perishable
title: Perishable
sidebar_position: 11
version: 619045
---

# Perishable Component

The Perishable component allows items to spoil or deteriorate over time, particularly food items. It manages spoilage rates, preservation effects, and the resulting state changes.

## Basic Usage

```lua
-- Add a perishable component to an entity
local entity = CreateEntity()
entity:AddComponent("perishable")

-- Configure the perishable component
local perishable = entity.components.perishable
perishable:SetPerishTime(TUNING.PERISH_FAST)
perishable:StartPerishing()
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `perishtime` | Number | Total time in seconds before the item fully perishes |
| `perishremainingtime` | Number | Remaining time before the item fully perishes |
| `perishfn` | Function | Function called when the item fully perishes |
| `onperishreplacement` | String | Prefab to spawn when the item perishes |
| `perishpresfn` | Function | Custom function for modifying the perish rate |
| `frozenfiremult` | Number | Multiplier for perish rate when frozen |

## Key Methods

```lua
-- Set time until fully perished
perishable:SetPerishTime(TUNING.PERISH_MED) -- Medium perish time

-- Set current freshness (0-1, where 1 is fresh)
perishable:SetPercent(0.5) -- Half spoiled

-- Start the spoilage process
perishable:StartPerishing()

-- Pause spoilage
perishable:StopPerishing()

-- Get the current freshness percentage
local freshness = perishable:GetPercent()

-- Set replacement prefab when fully spoiled
perishable:SetOnPerishFn(function(inst)
    local spoiled = SpawnPrefab("spoiled_food")
    -- Transfer position, owner, etc.
    return spoiled
end)
```

## Spoilage States

Items typically have three spoilage states:
- **Fresh** (> 50% remaining time)
- **Stale** (between 50% and 20% remaining time)
- **Spoiled** (< 20% remaining time)

Each state may affect the item's properties, such as hunger/health/sanity values for food.

## Preservation Factors

Several factors can affect spoilage rate:

- Containers like Ice Box slow spoilage (typically 0.5x rate)
- Winter season slows spoilage (typically 0.75x rate)
- Being frozen stops spoilage completely
- Certain characters may have perish rate modifiers

## Integration with Other Components

The Perishable component often works with:

- `Edible` - Food values change as items spoil
- `Stackable` - Stacking may average perish times
- `Inventoryitem` - Containers affect perish rate
- `FoodMemory` - For tracking when food was eaten

## See also

- [Edible Component](edible.md) - For food values that change as items spoil
- [Cookable Component](cookable.md) - For cooking effects on spoilage rates
- [Stackable Component](stackable.md) - For stacking perishable items
- [Container Component](container.md) - For containers that preserve items
- [Eater Component](eater.md) - For consuming perishable food

## Example: Creating a Perishable Food Item

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
    inst.components.edible.healthvalue = 1
    inst.components.edible.hungervalue = 10
    inst.components.edible.sanityvalue = 5
    
    -- Make it perishable
    inst:AddComponent("perishable")
    inst.components.perishable:SetPerishTime(TUNING.PERISH_MED)
    inst.components.perishable:StartPerishing()
    inst.components.perishable:SetOnPerishFn(function(inst)
        local spoiled = SpawnPrefab("spoiled_food")
        if inst.components.stackable ~= nil then
            spoiled.components.stackable:SetStackSize(inst.components.stackable:StackSize())
        end
        return spoiled
    end)
    
    return inst
end
```