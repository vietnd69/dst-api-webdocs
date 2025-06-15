---
id: temperature
title: Temperature
sidebar_position: 6
version: 619045
---

# Temperature Component

The Temperature component manages an entity's temperature state, including warming, cooling, freezing, and overheating effects. It's a key component for survival mechanics in Don't Starve Together.

## Basic Usage

```lua
-- Add a temperature component to an entity
local entity = CreateEntity()
entity:AddComponent("temperature")

-- Configure the temperature component
local temperature = entity.components.temperature
temperature:SetTemp(20) -- Set temperature to 20°C
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `current` | Number | Current temperature value in degrees |
| `maxtemp` | Number | Maximum possible temperature (default: 90) |
| `mintemp` | Number | Minimum possible temperature (default: -20) |
| `overheattemp` | Number | Temperature threshold for overheating (default: 70) |
| `hurtrate` | Number | Health damage rate when freezing |
| `overheathurtrate` | Number | Health damage rate when overheating |
| `inherentinsulation` | Number | Built-in insulation against cold |
| `inherentsummerinsulation` | Number | Built-in insulation against heat |
| `shelterinsulation` | Number | Additional insulation when sheltered |
| `sheltered` | Boolean | Whether entity is currently sheltered |
| `sheltered_level` | Number | Level of shelter protection (1-3) |
| `maxmoisturepenalty` | Number | Maximum cooling effect from moisture |

## Key Methods

### Temperature Management

```lua
-- Set temperature directly
temperature:SetTemperature(25)

-- Change temperature by a delta
temperature:DoDelta(5) -- Increase by 5 degrees

-- Set a temporary temperature modifier from food
temperature:SetTemperatureInBelly(10, 60) -- +10 degrees for 60 seconds

-- Get current temperature
local current_temp = temperature:GetCurrent()

-- Check temperature states
local is_freezing = temperature:IsFreezing()
local is_overheating = temperature:IsOverheating()
```

### Modifiers and Insulation

```lua
-- Add a temperature modifier (from an item, buff, etc.)
temperature:SetModifier("winterhat", 120) -- +120 insulation from winter hat

-- Remove a modifier
temperature:RemoveModifier("winterhat")

-- Get current insulation values
local winter_insulation, summer_insulation = temperature:GetInsulation()
```

### Heat Sources

```lua
-- Configure heat source detection
temperature:IgnoreTags("INLIMBO", "player", "FX") -- Ignore these tags when finding heaters

-- Set up a campfire as a heat source (on the campfire entity)
campfire:AddComponent("heater")
campfire.components.heater:SetThermics(true, false) -- Warms in winter, doesn't cool in summer
campfire.components.heater:SetHeat(10) -- Heat output amount
```

## Temperature System

The temperature system works by:

1. Starting at `TUNING.STARTING_TEMP` (usually 25°C)
2. Moving toward the ambient world temperature
3. Being influenced by modifiers like:
   - Insulating clothing
   - Heat sources nearby
   - Weather conditions
   - Food consumption
   - Moisture level
   - Shelter status

Temperature boundaries:
- Below 0°C: Freezing damage begins
- Above `overheattemp` (usually 70°C): Overheating damage begins
- Temperature is clamped between `mintemp` and `maxtemp`

## Events

The Temperature component responds to and triggers various events:

- `temperaturedelta` - Triggered when temperature changes
- `startfreezing` - Triggered when entity starts freezing
- `stopfreezing` - Triggered when entity stops freezing
- `startoverheating` - Triggered when entity starts overheating
- `stopoverheating` - Triggered when entity stops overheating
- `sheltered` - Listened for when entity becomes sheltered

## Integration with Other Components

The Temperature component often works with:

- `Health` - For temperature-related damage
- `Heater` - For sources of heat or cooling
- `Moisture` - For wetness effects on temperature
- `Insulator` - For items that provide insulation

## See also

- [Health Component](health.md) - For temperature-related damage
- [Hunger Component](hunger.md) - For hunger effects on temperature
- [Sanity Component](sanity.md) - For sanity effects from temperature
- [Edible Component](edible.md) - For food that affects temperature
- [Equippable Component](equippable.md) - For items that provide insulation

## Examples

```lua
-- Create a basic entity with temperature
local function MakeTemperatureEntity()
    local inst = CreateEntity()
    
    -- Add required components
    inst:AddComponent("temperature")
    
    -- Configure temperature
    local temperature = inst.components.temperature
    temperature:SetTemp(TUNING.STARTING_TEMP)
    temperature:SetFreezingHurtRate(TUNING.WILSON_HEALTH / TUNING.FREEZING_KILL_TIME)
    temperature:SetOverheatHurtRate(TUNING.WILSON_HEALTH / TUNING.OVERHEATING_KILL_TIME)
    
    -- Add event handling for temperature changes
    inst:ListenForEvent("temperaturedelta", function(inst, data)
        if data.new < 0 and data.last >= 0 then
            -- Started freezing, play animation or sound
        elseif data.new > temperature.overheattemp and data.last <= temperature.overheattemp then
            -- Started overheating, play animation or sound
        end
    end)
    
    return inst
end

-- Create an insulating item (like clothing)
local function MakeWinterHat()
    local inst = CreateEntity()
    
    -- Add required components
    inst:AddComponent("insulator")
    inst:AddComponent("inventoryitem")
    inst:AddComponent("equippable")
    
    -- Configure insulation
    inst.components.insulator:SetInsulation(TUNING.INSULATION_LARGE)
    inst.components.insulator:SetSummer(false) -- Not for summer insulation
    
    -- Configure equipment
    inst.components.equippable.equipslot = EQUIPSLOTS.HEAD
    
    -- Add callback when equipped
    inst.components.equippable:SetOnEquip(function(inst, owner)
        if owner.components.temperature ~= nil then
            owner.components.temperature:SetModifier("winterhat", TUNING.INSULATION_LARGE)
        end
    end)
    
    -- Add callback when unequipped
    inst.components.equippable:SetOnUnequip(function(inst, owner)
        if owner.components.temperature ~= nil then
            owner.components.temperature:RemoveModifier("winterhat")
        end
    end)
    
    return inst
end

-- Create a heat source (like a campfire)
local function MakeCampfire()
    local inst = CreateEntity()
    
    -- Add required components
    inst:AddComponent("heater")
    
    -- Configure heat source
    local heater = inst.components.heater
    heater:SetThermics(true, false) -- Warms in winter, doesn't cool in summer
    heater:SetHeat(10)
    heater:SetRange(10) -- Heat effect radius
    
    return inst
end 