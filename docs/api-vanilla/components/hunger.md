---
id: hunger
title: Hunger
sidebar_position: 7
last_updated: 2023-07-06
version: 619045
---

# Hunger Component

The Hunger component manages an entity's hunger state, including maximum hunger, hunger rate, and starvation effects.

## Basic Usage

```lua
-- Add a hunger component to an entity
local entity = CreateEntity()
entity:AddComponent("hunger")

-- Configure the hunger component
local hunger = entity.components.hunger
hunger:SetMax(150)
hunger:SetRate(TUNING.WILSON_HUNGER_RATE)
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `current` | Number | Current hunger value |
| `max` | Number | Maximum hunger value |
| `rate` | Number | Rate at which hunger decreases over time |
| `hungerrate` | Number | Multiplier for hunger rate |
| `burning` | Boolean | Whether hunger is currently being consumed |

## Key Methods

### SetMax

Sets the maximum hunger value for the entity.

```lua
-- Set maximum hunger capacity
hunger:SetMax(200)

-- Example with a custom character with higher hunger capacity
function MakeHungryCharacter()
    local inst = CreateEntity()
    
    -- Add required components
    inst:AddComponent("hunger")
    
    -- Give the character a larger hunger capacity
    inst.components.hunger:SetMax(200) -- 200 instead of default 150
    
    return inst
end
```

### SetRate

Sets the rate at which hunger decreases over time.

```lua
-- Set standard hunger rate
hunger:SetRate(1.5)

-- Example with conditional hunger rate
function ConfigureHungerRate(inst)
    local hunger = inst.components.hunger
    
    -- Make hunger deplete faster during winter
    inst:WatchWorldState("iswinter", function(inst, iswinter) 
        if iswinter then
            hunger:SetRate(TUNING.WILSON_HUNGER_RATE * 1.5) -- 50% faster in winter
        else
            hunger:SetRate(TUNING.WILSON_HUNGER_RATE)
        end
    end)
end
```

### DoDelta

Adds or removes hunger points.

```lua
-- Add 10 hunger points
hunger:DoDelta(10)

-- Remove 10 hunger points
hunger:DoDelta(-10)

-- Example of food consumption
function OnEatFood(inst, food)
    if inst.components.hunger ~= nil and food.components.edible ~= nil then
        -- Apply the food's hunger value
        inst.components.hunger:DoDelta(food.components.edible:GetHunger())
        
        -- Display a custom message based on hunger level
        if inst.components.hunger:GetPercent() < 0.25 then
            if inst.components.talker then
                inst.components.talker:Say("Still hungry...")
            end
        end
    end
end
```

### SetPercent

Sets hunger as a percentage of maximum (0-1).

```lua
-- Set to 50% of maximum hunger
hunger:SetPercent(0.5)

-- Example of setting initial hunger on world start
function SetupPlayerHunger(player, difficulty)
    if player.components.hunger ~= nil then
        if difficulty == "easy" then
            player.components.hunger:SetPercent(1.0) -- Full hunger
        elseif difficulty == "normal" then
            player.components.hunger:SetPercent(0.75) -- 75% hunger
        elseif difficulty == "hard" then
            player.components.hunger:SetPercent(0.5) -- 50% hunger
        end
    end
end
```

### GetPercent

Returns the current hunger as a percentage of maximum (0-1).

```lua
-- Get current hunger percentage
local hunger_percent = hunger:GetPercent()

-- Example of using hunger percentage to affect other components
function UpdateStaminaBasedOnHunger(inst)
    if inst.components.hunger ~= nil and inst.components.stamina ~= nil then
        local hunger_percent = inst.components.hunger:GetPercent()
        
        -- Stamina regeneration slows when hungry
        local stamina_regen = TUNING.STAMINA_REGEN * (0.5 + 0.5 * hunger_percent)
        inst.components.stamina:SetRegenRate(stamina_regen)
    end
end
```

### IsTooHungry

Checks if hunger is below a given threshold.

```lua
-- Check if too hungry to perform an action
local is_too_hungry = hunger:IsTooHungry() 

-- Example of hunger affecting actions
function CanCastSpell(inst)
    if inst.components.hunger ~= nil and inst.components.hunger:IsTooHungry() then
        if inst.components.talker ~= nil then
            inst.components.talker:Say("I'm too hungry to focus...")
        end
        return false
    end
    return true
end
```

### Pause/Resume

Pauses or resumes hunger depletion.

```lua
-- Pause hunger depletion
hunger:Pause()

-- Resume hunger depletion
hunger:Resume()

-- Example of pausing hunger when in a special area
function OnEnterMagicSanctuary(inst)
    if inst.components.hunger ~= nil then
        inst.components.hunger:Pause()
        if inst.components.talker ~= nil then
            inst.components.talker:Say("I don't feel hungry here...")
        end
    end
end

function OnExitMagicSanctuary(inst)
    if inst.components.hunger ~= nil then
        inst.components.hunger:Resume()
    end
end
```

> **Related functions**: When hunger drops to zero, the component typically calls the [Health Component's](health.md) `DoDelta()` method to apply starvation damage. Food consumption through the [Eater Component](eater.md) triggers `DoDelta()` with positive values to restore hunger. Hunger levels may influence [Sanity Component](sanity.md) drain rates and can affect how quickly an entity gets cold via the [Temperature Component](temperature.md).

## Events

The Hunger component triggers these events:

- `hungerdelta` - When hunger value changes
- `startstarving` - When entity starts starving
- `stopstarving` - When entity stops starving

```lua
-- Example of handling hunger events
function SetupHungerEvents(inst)
    -- React to hunger changes
    inst:ListenForEvent("hungerdelta", function(inst, data)
        -- data.oldpercent and data.newpercent contain the before/after values
        if data.newpercent < 0.25 and data.oldpercent >= 0.25 then
            -- Hunger just dropped below 25%
            if inst.components.talker ~= nil then
                inst.components.talker:Say("My stomach is growling...")
            end
        end
    end)
    
    -- React to starvation state
    inst:ListenForEvent("startstarving", function(inst)
        -- Apply movement speed penalty when starving
        if inst.components.locomotor ~= nil then
            inst.components.locomotor:SetExternalSpeedMultiplier(inst, "hunger_penalty", 0.7)
        end
    end)
    
    inst:ListenForEvent("stopstarving", function(inst)
        -- Remove movement speed penalty
        if inst.components.locomotor ~= nil then
            inst.components.locomotor:RemoveExternalSpeedMultiplier(inst, "hunger_penalty")
        end
    end)
end
```

## Integration with Other Components

The Hunger component often works with:

- `Health` - For starvation damage
- `Eater` - For consuming food to restore hunger
- `Temperature` - Hunger can affect temperature management 

```lua
-- Example of Hunger integration with Health for starvation
function SetupStarvationDamage(inst)
    -- Configure starvation damage
    if inst.components.hunger ~= nil and inst.components.health ~= nil then
        inst.components.hunger.onStarving = function(inst)
            -- Apply damage when starving
            inst.components.health:DoDelta(-TUNING.STARVE_DAMAGE)
            
            -- Play hunger sound
            inst.SoundEmitter:PlaySound("dontstarve/wilson/hungry")
        end
    end
end

-- Example of Hunger integration with Temperature
function SetupHungerTemperatureEffect(inst)
    if inst.components.hunger ~= nil and inst.components.temperature ~= nil then
        -- Add periodic check for hunger affecting temperature
        inst:DoPeriodicTask(1, function(inst)
            local hunger_percent = inst.components.hunger:GetPercent()
            
            -- Get colder faster when hungry
            local temp_modifier = math.min(1, 0.5 + hunger_percent * 0.5)
            inst.components.temperature.inherentinsulation = TUNING.INSULATION_SMALL * temp_modifier
        end)
    end
end
```

## See also

- [Health Component](health.md) - For starvation damage
- [Eater Component](eater.md) - For consuming food to restore hunger
- [Edible Component](edible.md) - For food properties that affect hunger
- [Temperature Component](temperature.md) - For hunger effects on temperature
- [Sanity Component](sanity.md) - For another vital stat that works similarly 

## Example: Creating an Entity with Custom Hunger

```lua
local function MakeHungryCreature()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Add health for starvation damage
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(150)
    
    -- Configure hunger
    inst:AddComponent("hunger")
    local hunger = inst.components.hunger
    hunger:SetMax(200) -- Higher than standard hunger capacity
    hunger:SetRate(1.25 * TUNING.WILSON_HUNGER_RATE) -- Gets hungry faster
    
    -- Configure starvation damage
    local old_hunger_update = hunger.OnUpdate
    hunger.OnUpdate = function(self, dt)
        old_hunger_update(self, dt)
        
        -- Apply starvation damage when completely hungry
        if self:GetPercent() <= 0 then
            inst.components.health:DoDelta(-TUNING.STARVE_DAMAGE)
            
            -- Play starving effects
            if inst.SoundEmitter ~= nil then
                inst.SoundEmitter:PlaySound("dontstarve/wilson/hungry")
            end
            
            if inst.components.talker ~= nil then
                inst.components.talker:Say("So... hungry...")
            end
        end
    end
    
    -- Configure hunger visual effects
    inst:ListenForEvent("hungerdelta", function(inst, data)
        if data.newpercent <= 0.25 and data.oldpercent > 0.25 then
            -- Visual indication of hunger
            if inst.components.talker ~= nil then
                inst.components.talker:Say("I need food!")
            end
            
            -- Slow down when very hungry
            if inst.components.locomotor ~= nil then
                inst.components.locomotor:SetExternalSpeedMultiplier(inst, "hunger_penalty", 0.75)
            end
        elseif data.newpercent > 0.25 and data.oldpercent <= 0.25 then
            -- Remove slowdown when no longer very hungry
            if inst.components.locomotor ~= nil then
                inst.components.locomotor:RemoveExternalSpeedMultiplier(inst, "hunger_penalty")
            end
        end
    end)
    
    return inst
end
``` 
