---
id: lootdropper
title: LootDropper
sidebar_position: 28
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# LootDropper Component

*API Version: 619045*

The LootDropper component handles dropping items when entities die or are destroyed. It manages loot tables, randomized drops, custom loot functions, and drop positioning.

## Basic Usage

```lua
-- Add a lootdropper component to an entity
local entity = CreateEntity()
entity:AddComponent("lootdropper")

-- Configure the lootdropper component
local lootdropper = entity.components.lootdropper
lootdropper:SetLoot({"meat", "bone"})
lootdropper:AddRandomLoot("goldnugget", 0.5)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `loot` | Table | Array of prefab names that will always drop |
| `randomloot` | Table | Table of prefabs that have a chance to drop |
| `randomlootcount` | Number | How many random loot items to drop |
| `numrandomloot` | Number | Alternate way to set random loot count |
| `chanceloot` | Table | Table of prefabs with specific drop chances |
| `ifnotchanceloot` | Table | Table of fallback loot if no chanceloot drops |
| `droppingchanceloot` | Boolean | Whether chanceloot is being processed |
| `trappable` | Boolean | Whether drops can be affected by traps |

## Key Methods

### Loot Configuration

```lua
-- Set fixed loot (always drops)
lootdropper:SetLoot({"meat", "meat", "pelt"})

-- Set random loot (chance to drop)
lootdropper:AddRandomLoot("goldnugget", 0.3) -- 30% chance
lootdropper:AddRandomLoot("redgem", 0.1) -- 10% chance
lootdropper:SetRandomLootCount(2) -- Drop 2 random items

-- Set chanceloots (exclusive drops)
lootdropper:AddChanceLoot("lightninggoathorn", 0.5) -- 50% chance
lootdropper:AddChanceLoot("meat", 1.0) -- 100% chance (fallback)
```

### Drop Management

```lua
-- Drop all configured loot
lootdropper:DropLoot()

-- Drop loot at a specific position
lootdropper:DropLoot(Vector3(x, y, z))

-- Drop a specific prefab
lootdropper:SpawnLootPrefab("meat")

-- Drop a single random item from the random loot table
lootdropper:DropRandomLoot()
```

### Custom Loot Functions

```lua
-- Set a custom loot function
lootdropper:SetLootSetupFn(function(lootdropper)
    -- Do custom setup before dropping loot
    local inst = lootdropper.inst
    if inst.components.health:GetPercent() < 0.5 then
        lootdropper:AddChanceLoot("meat", 0.5)
    else
        lootdropper:AddChanceLoot("meat", 1.0)
    end
end)

-- Set a custom chance loot function
lootdropper:SetChanceLootFunction(function(lootdropper)
    -- Custom chance loot logic
    local inst = lootdropper.inst
    local season = TheWorld.state.season
    
    if season == "winter" then
        return {"ice", "ice", "ice"}
    elseif season == "summer" then
        return {"cutgrass", "twigs"}
    else
        return {"berries"}
    end
end)
```

## Loot Types

The LootDropper component supports several types of loot:

- **Fixed Loot**: Items that always drop
- **Random Loot**: Items with a chance to drop, with a configurable count
- **Chance Loot**: Mutually exclusive loot options with specific chances
- **Fallback Loot**: Items that drop if no chance loot is selected

## Integration with Other Components

The LootDropper component often works with:

- `Health` - To trigger drops on death
- `Workable` - To trigger drops when worked
- `Combat` - For combat-related drops
- `Burnable` - For drops when burned
- `Growable` - For different drops at different growth stages

## See also

- [Health Component](health.md) - For death triggers that drop loot
- [Combat Component](combat.md) - For combat interactions that lead to loot drops
- [Workable Component](workable.md) - For work actions that produce loot
- [Growable Component](growable.md) - For growth stages with different loot
- [Inventory Component](inventory.md) - For storing collected loot

## Example: Basic Enemy with Loot

```lua
local function MakeEnemy()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Add health and combat
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(100)
    
    inst:AddComponent("combat")
    inst.components.combat:SetDefaultDamage(10)
    
    -- Configure loot
    inst:AddComponent("lootdropper")
    local lootdropper = inst.components.lootdropper
    
    -- Always drop one meat
    lootdropper:SetLoot({"meat"})
    
    -- Chance to drop special items
    lootdropper:AddRandomLoot("goldnugget", 0.2)
    lootdropper:AddRandomLoot("redgem", 0.05)
    lootdropper:SetRandomLootCount(1)
    
    -- Link death to loot dropping
    inst:ListenForEvent("death", function(inst)
        inst.components.lootdropper:DropLoot(inst:GetPosition())
    end)
    
    return inst
end

-- Example of a boss with progressive loot based on health
local function MakeBoss()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Add health and combat
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(1000)
    
    inst:AddComponent("combat")
    inst.components.combat:SetDefaultDamage(50)
    
    -- Configure loot
    inst:AddComponent("lootdropper")
    local lootdropper = inst.components.lootdropper
    
    -- Set progressive loot function
    lootdropper:SetLootSetupFn(function(lootdropper)
        local inst = lootdropper.inst
        local health_percent = inst.components.health:GetPercent()
        
        -- Always drop these
        lootdropper:SetLoot({"meat", "meat", "meat", "meat"})
        
        -- Add more loot based on how quickly boss was killed
        if health_percent > 0.7 then
            -- Boss was killed very efficiently
            lootdropper:AddChanceLoot("gianthorn", 1.0)
            lootdropper:AddChanceLoot("purplegem", 0.8)
        elseif health_percent > 0.4 then
            -- Boss was killed somewhat efficiently
            lootdropper:AddChanceLoot("purplegem", 0.6)
            lootdropper:AddChanceLoot("bluegem", 0.8)
        else
            -- Boss was killed inefficiently
            lootdropper:AddChanceLoot("bluegem", 0.5)
            lootdropper:AddChanceLoot("redgem", 0.5)
        end
    end)
    
    -- Link death to loot dropping
    inst:ListenForEvent("death", function(inst)
        inst.components.lootdropper:DropLoot(inst:GetPosition())
    end)
    
    return inst
end
``` 
