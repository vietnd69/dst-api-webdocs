---
id: inspectable
title: Inspectable
sidebar_position: 27
version: 619045
---

# Inspectable Component

The Inspectable component allows entities to be examined by players, displaying descriptive text when interacted with. It manages custom descriptions, conditional examination text, and localization.

## Basic Usage

```lua
-- Add an inspectable component to an entity
local entity = CreateEntity()
entity:AddComponent("inspectable")

-- Configure the inspectable component
local inspectable = entity.components.inspectable
inspectable.nameoverride = "custom_name"
inspectable.descriptionfn = function(inst, viewer)
    return "This is a custom description."
end
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `nameoverride` | String | Custom name for the entity when inspected |
| `descriptionfn` | Function | Function that returns a custom description |
| `getstatus` | Function | Function that returns entity status |
| `description` | String | Static custom description string |
| `getspecialdescription` | Function | Function for special descriptions |
| `noanim` | Boolean | If true, doesn't play examine animation when inspected |

## Key Methods

```lua
-- Set custom description function
inspectable:SetDescriptionFn(function(inst, viewer)
    if viewer.components.hunger.current < 10 then
        return "I'm too hungry to examine this properly."
    else
        return "This is a normal description."
    end
end)

-- Get description when inspected
local description = inspectable:GetDescription(viewer)
```

## Inspection Status

The component can return different status information that's appended to the basic description:

```lua
-- Set status function
inspectable.getstatus = function(inst)
    if inst.components.growable ~= nil then
        if inst.components.growable:IsGrowable() then
            return "GROWING"
        elseif inst.components.growable:GetStage() >= 3 then
            return "MATURE"
        else
            return "YOUNG"
        end
    end
    return nil
end
```

## Multilingual Support

The inspect system supports translations through:

- `STRINGS.CHARACTERS[charactername].DESCRIBE[prefab]` - Character-specific descriptions
- `STRINGS.CHARACTERS.GENERIC.DESCRIBE[prefab]` - Generic descriptions for all characters

## Integration with Other Components

The Inspectable component often works with:

- `Named` - For customizing entity names
- `Perishable` - For showing spoilage status
- `Growable` - For showing growth stage
- `Health` - For showing health status
- `Armor` - For showing durability status

## See also

- [Named Component](other-components.md) - For customizing entity names
- [Perishable Component](perishable.md) - For showing spoilage status
- [Growable Component](growable.md) - For showing growth stage information
- [Health Component](health.md) - For showing health status
- [Talker Component](other-components.md) - For displaying character dialogue

## Example: Basic Inspectable Entity

```lua
local function MakeInspectableEntity()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Make it inspectable
    inst:AddComponent("inspectable")
    
    -- Simple static description
    inst.components.inspectable.description = "This is a simple entity that can be examined."
    
    return inst
end

-- Example of conditional inspection
local function MakeComplexInspectable()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Add health for status
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(100)
    
    -- Make it inspectable with conditions
    inst:AddComponent("inspectable")
    inst.components.inspectable:SetDescriptionFn(function(inst, viewer)
        local health_percent = inst.components.health:GetPercent()
        
        if health_percent > 0.75 then
            return "It looks very healthy."
        elseif health_percent > 0.5 then
            return "It has some minor injuries."
        elseif health_percent > 0.25 then
            return "It looks badly wounded."
        else
            return "It's on the verge of death."
        end
    end)
    
    return inst
end

-- Example of season-dependent descriptions
local function MakeSeasonalInspectable()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    
    -- Make it inspectable
    inst:AddComponent("inspectable")
    inst.components.inspectable:SetDescriptionFn(function(inst)
        local world = TheWorld
        if world.state.isspring then
            return "It blooms beautifully in spring."
        elseif world.state.issummer then
            return "It's thriving in the summer heat."
        elseif world.state.isautumn then
            return "Its leaves are changing color for autumn."
        elseif world.state.iswinter then
            return "It's dormant during the winter."
        end
        return "It's a plant."
    end)
    
    return inst
end
``` 