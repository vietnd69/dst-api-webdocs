---
id: eater
title: Eater
sidebar_position: 23
---

# Eater Component

The Eater component allows entities to consume edible items. It manages diet restrictions, eating behaviors, and handles the effects of consumed food.

## Basic Usage

```lua
-- Add an eater component to an entity
local entity = CreateEntity()
entity:AddComponent("eater")

-- Configure the eater component
local eater = entity.components.eater
eater:SetDiet({FOODTYPE.VEGGIE, FOODTYPE.MEAT}, {FOODTYPE.ELEMENTAL, FOODTYPE.GEARS})
eater:SetCanEatHorrible(true)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `preferseating` | Table | List of food types the entity prefers to eat |
| `caneat` | Table | List of food types the entity can eat |
| `cannoteat` | Table | List of food types the entity cannot eat |
| `caneathealthvalue` | Boolean | Whether entity benefits from food health value |
| `caneathungervalue` | Boolean | Whether entity benefits from food hunger value |
| `caneatsanityvalue` | Boolean | Whether entity benefits from food sanity value |
| `caneatrawe` | Boolean | Whether entity can eat raw meat |
| `strongstomach` | Boolean | Whether entity is immune to monster food penalties |
| `abletoeat` | Boolean | Whether entity can currently eat |
| `eatsizecallback` | Function | Called to determine how much of a stack to eat |

## Key Methods

### Diet Configuration

```lua
-- Set which food types can be eaten
eater:SetDiet({FOODTYPE.MEAT}, {FOODTYPE.VEGGIE})  -- Can eat meat, cannot eat veggies

-- Set which food values are applied
eater:SetAbsorptionModifiers(1, 1, 0.5) -- Full health/hunger, half sanity

-- Configure special eating abilities
eater:SetCanEatHorrible(true) -- Can eat monster meat without penalties
eater:SetCanEatRaw(false) -- Cannot eat raw meat
eater:SetStrongStomach(true) -- Immune to food spoilage penalties
```

### Eating Actions

```lua
-- Try to eat a specific food
local did_eat = eater:Eat(food_item)

-- Check if can eat a specific food
local can_eat = eater:CanEat(food_item)

-- Calculate food values when eaten by this eater
local health, hunger, sanity = eater:GetEdibleValue(food_item)

-- Set callback for when food is eaten
eater:SetOnEatFn(function(inst, food)
    -- Do something when food is eaten
    print(inst.prefab .. " ate " .. food.prefab)
end)
```

## Diet Types

Eaters can have various diet restrictions:

- **Omnivore** - Can eat everything (default for players)
- **Carnivore** - Can only eat meat
- **Vegetarian** - Can only eat vegetables/fruits
- **Specialized** - Custom diet restrictions (like only eating wood, souls, etc.)

## Integration with Other Components

The Eater component often works with:

- `Edible` - For items that can be eaten
- `Health` - To apply health effects from food
- `Hunger` - To apply hunger effects from food
- `Sanity` - To apply sanity effects from food
- `Temperature` - For temperature effects from food
- `Inventory` - For managing eaten items

## See also

- [Edible Component](edible.md) - For defining food properties
- [Health Component](health.md) - For health effects from eating
- [Hunger Component](hunger.md) - For hunger effects from eating
- [Sanity Component](sanity.md) - For sanity effects from eating
- [Temperature Component](temperature.md) - For temperature effects from food
- [Perishable Component](perishable.md) - For food spoilage effects

## Example: Creating a Specialized Eater

```lua
local function MakeWoodEater()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    
    -- Add health and hunger
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(150)
    
    inst:AddComponent("hunger")
    inst.components.hunger:SetMax(100)
    
    -- Configure specialized eater that only eats wood
    inst:AddComponent("eater")
    local eater = inst.components.eater
    
    -- Can only eat items with FOODTYPE.WOOD
    eater:SetDiet({FOODTYPE.WOOD}, {FOODTYPE.MEAT, FOODTYPE.VEGGIE, FOODTYPE.GENERIC})
    
    -- Apply only hunger value, no health/sanity
    eater:SetAbsorptionModifiers(0, 1, 0)
    
    -- Add special effect when eating wood
    eater:SetOnEatFn(function(inst, food)
        -- Gain armor temporarily when eating wood
        if inst.components.armor == nil then
            inst:AddComponent("armor")
        end
        inst.components.armor:SetPercent(1)
        inst.components.armor:SetAbsorption(0.5)
        
        -- Remove armor after 60 seconds
        inst:DoTaskInTime(60, function()
            inst:RemoveComponent("armor")
        end)
    end)
    
    return inst
end
``` 