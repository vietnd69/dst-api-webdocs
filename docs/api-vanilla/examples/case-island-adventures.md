---
id: case-island-adventures
title: Case Study - Island Adventures Gameplay
sidebar_position: 4
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Case Study: Island Adventures Gameplay

This case study examines the gameplay systems of "Island Adventures", a comprehensive mod that ports content from Don't Starve's single-player DLCs (Shipwrecked and Hamlet) to Don't Starve Together. It demonstrates advanced techniques for creating engaging gameplay mechanics that integrate with the base game.
- [Gitlab](https://gitlab.com/IslandAdventures/IslandAdventures/)
- [Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=1467214795)

## Overview

Island Adventures transforms Don't Starve Together into a tropical archipelago experience with unique gameplay mechanics. Key gameplay features include:

- Weather systems including wind, tropical storms, and seasons
- Ocean mechanics with waves, boats, and sea traversal
- Poison and disease mechanics
- Treasure hunting and exploration
- Volcano eruptions and natural disasters
- New crafting systems and resources
- Economy and trading with NPCs

## Gameplay Systems

### Tropical Seasons

The mod implements a complete seasonal cycle different from the base game:

```lua
-- Tropical seasons implementation
local function InitSeasons(self)
    self.seasons = {
        mild = { name = "mild", temperature = TUNING.MILD_TEMPERATURE },
        wet = { name = "wet", temperature = TUNING.WET_TEMPERATURE },
        green = { name = "green", temperature = TUNING.GREEN_TEMPERATURE },
        dry = { name = "dry", temperature = TUNING.DRY_TEMPERATURE },
        hurricane = { name = "hurricane", temperature = TUNING.HURRICANE_TEMPERATURE }
    }
    
    -- Default season lengths
    self.seasonlength = {
        mild = 15,
        wet = 20,
        green = 15,
        dry = 10,
        hurricane = 8
    }
    
    -- Set initial season
    self:SetSeason("mild")
    
    -- Register season change callbacks
    self.onseasonchange = function(self, season)
        if season == "hurricane" then
            TheWorld:PushEvent("ms_forceprecipitation", true)
            TheWorld:PushEvent("ms_stormchanged", true)
        elseif season == "wet" then
            TheWorld:PushEvent("ms_forceprecipitation", true)
        else
            TheWorld:PushEvent("ms_forceprecipitation", false)
            if self.prev_season == "hurricane" then
                TheWorld:PushEvent("ms_stormchanged", false)
            end
        end
    end
end
```

### Ocean Navigation

The mod introduces a robust ocean navigation system with boats, sailing mechanics, and wave physics:

```lua
-- Boat physics system
function BoatPhysics:OnUpdate(dt)
    -- Apply wind forces
    if TheWorld.components.worldwind ~= nil then
        local wind_speed = TheWorld.components.worldwind:GetWindSpeed()
        local wind_direction = TheWorld.components.worldwind:GetWindDirection()
        
        -- Calculate wind force based on direction and sail state
        local sail_force = 0
        if self.has_sail and self.sail_raised then
            -- Calculate angle between boat and wind
            local boat_angle = self.inst.Transform:GetRotation() * DEGREES
            local angle_diff = math.abs(DiffAngle(boat_angle, wind_direction))
            
            if angle_diff < 45 * DEGREES then
                -- Wind is behind, strong push
                sail_force = wind_speed * TUNING.BOAT.WIND_FORCE * 1.5
            elseif angle_diff < 90 * DEGREES then
                -- Wind is to the side, moderate push
                sail_force = wind_speed * TUNING.BOAT.WIND_FORCE
            elseif angle_diff < 135 * DEGREES then
                -- Wind is at an angle, slight push
                sail_force = wind_speed * TUNING.BOAT.WIND_FORCE * 0.5
            else
                -- Wind is against, minimal push
                sail_force = wind_speed * TUNING.BOAT.WIND_FORCE * 0.1
            end
        end
        
        -- Apply force in boat's forward direction
        local angle = self.inst.Transform:GetRotation() * DEGREES
        local vx = math.cos(angle) * sail_force
        local vz = -math.sin(angle) * sail_force
        
        self.velocity_x = self.velocity_x + vx * dt
        self.velocity_z = self.velocity_z + vz * dt
    end
    
    -- Apply wave forces
    if self.in_wave then
        local wave_force = TUNING.BOAT.WAVE_FORCE
        local wave_angle = self.wave_direction
        
        local vx = math.cos(wave_angle) * wave_force
        local vz = -math.sin(wave_angle) * wave_force
        
        self.velocity_x = self.velocity_x + vx * dt
        self.velocity_z = self.velocity_z + vz * dt
    end
    
    -- Apply drag
    local speed = math.sqrt(self.velocity_x * self.velocity_x + self.velocity_z * self.velocity_z)
    if speed > 0 then
        local drag = TUNING.BOAT.DRAG * speed * speed * dt
        local drag_percent = math.min(drag / speed, 1)
        
        self.velocity_x = self.velocity_x * (1 - drag_percent)
        self.velocity_z = self.velocity_z * (1 - drag_percent)
    end
    
    -- Update position
    local x, y, z = self.inst.Transform:GetWorldPosition()
    x = x + self.velocity_x * dt
    z = z + self.velocity_z * dt
    
    -- Check for land collision
    if not TheWorld.Map:IsOceanAtPoint(x, 0, z) then
        -- Handle collision with land
        self.velocity_x = -self.velocity_x * 0.5
        self.velocity_z = -self.velocity_z * 0.5
    else
        -- Update position if still in water
        self.inst.Transform:SetPosition(x, y, z)
    end
end
```

### Poison System

The mod implements a poison system that affects players and creatures:

```lua
-- Poison component implementation
function Poisonable:SetPoisoned(dopoisoned, poisonbuildup)
    if dopoisoned then
        if poisonbuildup ~= nil then
            self.poisonbuildup = poisonbuildup
        end

        if self.poisonbuildup >= TUNING.POISON_BUILD_UP_THRESHOLD then
            self.poisoned = true
            self.poisonbuilduprate = 0
            self.inst:AddTag("poisoned")
            self.inst:PushEvent("poisoned")

            -- Start poison damage over time
            if self.task == nil then
                self.task = self.inst:DoPeriodicTask(1, function(inst, self)
                    if inst.components.health ~= nil then
                        -- Damage scales with poison buildup
                        local damage = TUNING.POISON_DAMAGE_PER_TICK * (self.poisonbuildup / TUNING.POISON_BUILD_UP_THRESHOLD)
                        inst.components.health:DoDelta(-damage, nil, "poison")
                        
                        -- Visual effects
                        if inst.components.talker ~= nil then
                            inst.components.talker:Say(GetString(inst, "ANNOUNCE_POISONED"))
                        end
                        
                        -- Spawn poison FX
                        SpawnPrefab("poison_fx").entity:SetParent(inst.entity)
                    end
                end, 0, self)
            end
        end
    else
        self.poisoned = false
        self.poisonbuildup = 0
        self.inst:RemoveTag("poisoned")
        self:StopDamage()
    end
end
```

### Treasure Hunting

The mod adds a treasure hunting system with buried treasure and treasure maps:

```lua
-- Treasure map system
function TreasureMap:Activate(doer)
    if self.treasure_prefab ~= nil and doer ~= nil then
        -- Generate treasure location based on map
        local x, y, z = doer.Transform:GetWorldPosition()
        local radius = math.random(30, 50)
        local angle = math.random() * 2 * PI
        
        local treasure_x = x + radius * math.cos(angle)
        local treasure_z = z + radius * math.sin(angle)
        
        -- Find suitable location (must be on land)
        local max_tries = 30
        local tries = 0
        while tries < max_tries do
            if TheWorld.Map:IsLandAtPoint(treasure_x, 0, treasure_z) then
                break
            end
            
            angle = angle + PI/8
            treasure_x = x + radius * math.cos(angle)
            treasure_z = z + radius * math.sin(angle)
            tries = tries + 1
        end
        
        if tries < max_tries then
            -- Create buried treasure
            local treasure = SpawnPrefab("buried_treasure")
            treasure.Transform:SetPosition(treasure_x, 0, treasure_z)
            treasure:SetTreasure(self.treasure_prefab, self.treasure_loot)
            
            -- Mark on player's map
            if doer.player_classified ~= nil then
                doer.player_classified.treasure_map_location:set_local(Vector3(treasure_x, 0, treasure_z))
                doer.player_classified.has_treasure_map:set(true)
            end
            
            -- Visual effect
            local effect = SpawnPrefab("sand_puff")
            effect.Transform:SetPosition(treasure_x, 0, treasure_z)
            
            -- Notify player
            if doer.components.talker ~= nil then
                doer.components.talker:Say(GetString(doer, "ANNOUNCE_READ_TREASURE_MAP"))
            end
            
            return true
        end
    end
    
    return false
end
```

### Volcano Eruptions

The mod features a volcano system with eruptions and falling debris:

```lua
-- Volcano eruption system
function VolcanoManager:StartEruption()
    if not self.erupting then
        self.erupting = true
        self.warning_time = TUNING.VOLCANO_WARNING_TIME
        
        -- Trigger warning effects
        TheWorld:PushEvent("volcano_warning")
        
        -- Schedule actual eruption
        self.task = self.inst:DoTaskInTime(self.warning_time, function()
            self:DoEruption()
        end)
    end
end

function VolcanoManager:DoEruption()
    -- Start eruption sequence
    self.eruption_time = TUNING.VOLCANO_ERUPTION_TIME
    self.debris_timer = 0
    
    -- Visual and sound effects
    TheWorld:PushEvent("volcano_erupt")
    
    -- Schedule end of eruption
    self.end_task = self.inst:DoTaskInTime(self.eruption_time, function()
        self:StopEruption()
    end)
    
    -- Start updating to spawn debris
    self.inst:StartUpdatingComponent(self)
end

function VolcanoManager:OnUpdate(dt)
    if self.erupting then
        self.debris_timer = self.debris_timer - dt
        
        if self.debris_timer <= 0 then
            -- Spawn volcanic debris
            self:SpawnDebris()
            
            -- Reset timer with random interval
            self.debris_timer = math.random() * TUNING.VOLCANO_DEBRIS_INTERVAL
        end
    end
end

function VolcanoManager:SpawnDebris()
    -- Find all players
    local players = {}
    for i, v in ipairs(AllPlayers) do
        table.insert(players, v)
    end
    
    if #players > 0 then
        -- Target random player
        local target = players[math.random(#players)]
        local x, y, z = target.Transform:GetWorldPosition()
        
        -- Add random offset
        local offset = 15
        x = x + math.random(-offset, offset)
        z = z + math.random(-offset, offset)
        
        -- Spawn appropriate debris based on location
        local debris_type = "volcano_rock"
        if TheWorld.Map:IsOceanAtPoint(x, 0, z) then
            debris_type = "volcano_rock_water"
        end
        
        -- Create shadow first
        local shadow = SpawnPrefab("volcano_rock_shadow")
        shadow.Transform:SetPosition(x, 0, z)
        
        -- Create actual debris with delay
        self.inst:DoTaskInTime(TUNING.VOLCANO_DEBRIS_SHADOW_TIME, function()
            local debris = SpawnPrefab(debris_type)
            if debris ~= nil then
                debris.Transform:SetPosition(x, 20, z)
                
                -- Set damage and radius based on difficulty
                debris.components.areaaware:SetRadius(TUNING.VOLCANO_DEBRIS_RADIUS)
                debris.components.combat:SetDefaultDamage(TUNING.VOLCANO_DEBRIS_DAMAGE)
            end
        end)
    end
end
```

### Trading System

The mod includes a trading system with merchants and currency:

```lua
-- Trading component for merchants
function Trader:IsTradingWith(inst)
    return self.trading and self.trader == inst
end

function Trader:SetPriceForItem(item_name, price)
    if not self.prices then
        self.prices = {}
    end
    self.prices[item_name] = price
end

function Trader:GetPriceForItem(item)
    if not self.prices then
        return nil
    end
    return self.prices[item.prefab]
end

function Trader:HasItemForTrade(item_name)
    if not self.stock then
        return false
    end
    return self.stock[item_name] ~= nil and self.stock[item_name] > 0
end

function Trader:TradeItem(item_name, buyer)
    if self:HasItemForTrade(item_name) and buyer ~= nil then
        -- Check if buyer has enough currency
        local price = self.prices[item_name] or 1
        local has_currency = false
        
        if buyer.components.inventory ~= nil then
            has_currency = buyer.components.inventory:Has("dubloon", price)
        end
        
        if has_currency then
            -- Remove currency from buyer
            for i = 1, price do
                local coin = buyer.components.inventory:FindItem(function(item) return item.prefab == "dubloon" end)
                if coin ~= nil then
                    buyer.components.inventory:RemoveItem(coin, true)
                    coin:Remove()
                end
            end
            
            -- Give item to buyer
            local item = SpawnPrefab(item_name)
            if item ~= nil then
                buyer.components.inventory:GiveItem(item)
                
                -- Reduce stock
                self.stock[item_name] = self.stock[item_name] - 1
                
                -- Play trade sound
                self.inst.SoundEmitter:PlaySound("dontstarve/common/coin_drop")
                
                return true
            end
        else
            -- Not enough currency
            if buyer.components.talker ~= nil then
                buyer.components.talker:Say(GetString(buyer, "ANNOUNCE_TRADE_NOT_ENOUGH_GOLD"))
            end
        end
    end
    
    return false
end
```

## Integration with Base Game

### Player Adaptation

The mod seamlessly integrates with the base game's player system, adding new capabilities:

```lua
-- Adding swimming capability to players
AddComponentPostInit("locomotor", function(self)
    local _oldGetRunSpeed = self.GetRunSpeed
    function self:GetRunSpeed()
        local speed = _oldGetRunSpeed(self)
        
        -- Apply swimming speed modifiers
        if self.inst:HasTag("swimming") then
            speed = speed * TUNING.SWIMMING_SPEED_MULT
            
            if self.inst.components.sailor ~= nil and self.inst.components.sailor:IsSailing() then
                speed = speed * TUNING.SAILBOAT_SPEED
            end
            
            if TheWorld.components.worldwind ~= nil then
                local wind_speed = TheWorld.components.worldwind:GetWindSpeed()
                local wind_angle = self:GetWindSailingAngle()
                
                if wind_angle < 45 then
                    -- Sailing with the wind
                    speed = speed + (wind_speed * TUNING.WIND_SAIL_BOOST)
                elseif wind_angle > 135 then
                    -- Sailing against the wind
                    speed = speed - (wind_speed * TUNING.WIND_SAIL_PENALTY)
                end
            end
        end
        
        return speed
    end
end)
```

### World Integration

The mod integrates with the world generation and management systems:

```lua
-- Integrating with world generation
AddPrefabPostInit("world", function(inst)
    -- Add tropical world components
    if not TheWorld.ismastersim then
        return
    end
    
    -- Add wind system
    inst:AddComponent("worldwind")
    
    -- Add tide system
    inst:AddComponent("tidemanager")
    
    -- Add volcano manager
    inst:AddComponent("volcanomanager")
    
    -- Add tropical seasons
    local _SetPhase = inst.SetPhase
    inst.SetPhase = function(inst, phase)
        _SetPhase(inst, phase)
        
        if inst.state.isday then
            -- Update island-specific day events
            if inst.components.volcanomanager ~= nil then
                inst.components.volcanomanager:OnDayChange()
            end
            
            -- Update tides
            if inst.components.tidemanager ~= nil then
                inst.components.tidemanager:OnDayChange()
            end
        end
    end
    
    -- Add tropical season states
    if inst.state ~= nil then
        inst.state.ismild = false
        inst.state.iswet = false
        inst.state.isgreen = false
        inst.state.isdry = false
        inst.state.ishurricane = false
    end
end)
```

### Item Integration

The mod adds new items that work with existing systems:

```lua
-- Integration with existing crafting system
local tech_level = TECH.SCIENCE_TWO

-- Add new recipe tab
AddRecipeTab(STRINGS.TABS.NAUTICAL, 998, "images/inventoryimages/tab_nautical.tex", "tab_nautical")

-- Add boat recipe
AddRecipe("boat", 
    {Ingredient("boards", 4), Ingredient("rope", 2)}, 
    RECIPETABS.NAUTICAL, 
    tech_level, 
    nil, -- placer
    nil, -- min_spacing
    nil, -- nounlock
    nil, -- numtogive
    "images/inventoryimages/boat.tex", -- atlas
    "boat.tex" -- image
)

-- Add machete recipe
AddRecipe("machete", 
    {Ingredient("twigs", 1), Ingredient("flint", 3)}, 
    RECIPETABS.TOOLS, 
    TECH.SCIENCE_ONE, 
    nil, -- placer
    nil, -- min_spacing
    nil, -- nounlock
    nil, -- numtogive
    "images/inventoryimages/machete.tex", -- atlas
    "machete.tex" -- image
)
```

## Gameplay Balance

The mod carefully balances its new mechanics with the base game:

```lua
-- Tuning values for gameplay balance
TUNING.BOAT = {
    HEALTH = 200,
    MASS = 500,
    SPEED = 2.5,
    DRAG = 0.15,
    WIND_FORCE = 1.2,
    WAVE_FORCE = 3.0,
}

TUNING.POISON = {
    DAMAGE_PER_TICK = 1,
    BUILD_UP_THRESHOLD = 100,
    DURATION = 120,
    ANTIDOTE_HEALING = 50,
}

TUNING.TROPICAL_SEASONS = {
    MILD_TEMPERATURE = 35,
    WET_TEMPERATURE = 30,
    GREEN_TEMPERATURE = 35,
    DRY_TEMPERATURE = 45,
    HURRICANE_TEMPERATURE = 25,
}

TUNING.VOLCANO = {
    WARNING_TIME = 60,
    ERUPTION_TIME = 120,
    DEBRIS_INTERVAL = 3,
    DEBRIS_SHADOW_TIME = 2,
    DEBRIS_RADIUS = 3,
    DEBRIS_DAMAGE = 75,
}
```

## Key Lessons

### 1. Comprehensive Gameplay Systems

The mod demonstrates how to create interconnected gameplay systems:
- Weather affects sailing which affects travel speed
- Seasons affect resource availability and hazards
- Treasure hunting creates exploration incentives

### 2. Player Progression

The mod implements meaningful progression systems:
- New crafting recipes unlock more efficient travel and resource gathering
- Trading system provides goals for resource collection
- Treasure hunting rewards exploration

### 3. Environmental Storytelling

The mod uses environmental systems to create narrative:
- Volcano eruptions create tension and urgency
- Weather patterns affect planning and strategy
- Seasonal changes drive different gameplay activities

### 4. Balancing Challenge and Fun

The mod carefully balances new challenges with player capabilities:
- Poison is dangerous but curable
- Sailing is efficient but has risks
- Volcano eruptions are dangerous but predictable

## Conclusion

Island Adventures demonstrates how to create engaging gameplay systems that extend Don't Starve Together in meaningful ways. By studying its implementation, developers can learn how to design interconnected systems that provide both challenge and enjoyment while maintaining the core feel of the base game.

## See Also

- [Case Study - Island Adventures Core](case-ia-core.md) - For technical implementation details
- [Component System](../core/component-system.md) - For understanding how components work
- [Event System](../core/event-system.md) - For event handling as used in this mod
- [Custom Weather Effects](custom-weather-effects.md) - For implementing weather systems
- [Custom Game Mode](custom-game-mode.md) - For creating alternative game modes
