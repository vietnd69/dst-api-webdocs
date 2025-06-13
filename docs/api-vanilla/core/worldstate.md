---
id: worldstate
title: WorldState API
sidebar_position: 12
---

# WorldState API

WorldState is the system that manages the world state in Don't Starve Together. It stores and tracks information such as seasons, weather, time, and other game world states.

## Accessing WorldState

WorldState can be accessed through TheWorld object:

```lua
local world_state = TheWorld.state
```

## WorldState Properties

WorldState provides many properties to query the current state of the world:

### Time and Day/Night

```lua
-- Current day number (starting from 1)
local current_day = world_state.cycles + 1

-- Time of day (0.0 - 1.0, 0=dawn, 0.5=noon, 1=dusk)
local time_of_day = world_state.time

-- Current phase (day, dusk, night)
local current_phase = world_state.phase

-- Check phase
if world_state.isday then
    -- It's daytime
elseif world_state.isdusk then
    -- It's dusk
elseif world_state.isnight then
    -- It's nighttime
end

-- Length of each phase
local day_length = world_state.remainingdaylight
local dusk_length = world_state.remainingdusk
local night_length = world_state.remainingnight
```

### Seasons

```lua
-- Current season
local current_season = world_state.season

-- Check season
if world_state.isautumn then
    -- It's autumn
elseif world_state.iswinter then
    -- It's winter
elseif world_state.isspring then
    -- It's spring
elseif world_state.issummer then
    -- It's summer
end

-- Days remaining in current season
local days_left = world_state.remainingdaysinseason

-- Total days in season
local days_in_season = world_state.elapseddaysinseason + world_state.remainingdaysinseason
```

### Weather

```lua
-- Current rain/snow amount (0.0 - 1.0)
local precipitation = world_state.precipitation

-- Check if raining or snowing
if world_state.israining then
    -- It's raining
    local rain_intensity = world_state.precipitation -- Rain intensity
elseif world_state.issnowing then
    -- It's snowing
    local snow_intensity = world_state.precipitation -- Snow intensity
end

-- Moisture (0.0 - 100.0)
local moisture = world_state.moisture
local moisture_limit = world_state.moistureceil

-- Lightning
if world_state.islightning then
    -- There's lightning
end
```

### Temperature

```lua
-- World temperature
local temperature = world_state.temperature

-- Winter (cold) or summer (hot)
if world_state.iswinter then
    -- Cold temperature
elseif world_state.issummer then
    -- Hot temperature
end
```

### Special Events

```lua
-- Frog rain
if world_state.isfrog then
    -- There's a frog rain
end

-- Meteor shower
if world_state.ismeteorshower then
    -- There's a meteor shower
end

-- Full moon
if world_state.isfullmoon then
    -- It's a full moon night
end
```

## Listening for State Changes

You can register listeners for state changes:

```lua
-- Listen for day/night phase changes
TheWorld:ListenForEvent("phasechanged", function(world, data)
    local new_phase = data.newphase
    print("Phase changed to: " .. new_phase)
end)

-- Listen for season changes
TheWorld:ListenForEvent("seasonchange", function(world, data)
    local new_season = data.season
    print("Season changed to: " .. new_season)
end)

-- Listen for rain start
TheWorld:ListenForEvent("rainstart", function()
    print("Rain has started")
end)

-- Listen for rain stop
TheWorld:ListenForEvent("rainstop", function()
    print("Rain has stopped")
end)
```

## Changing WorldState in Mods

In mods, you can change world states (only works on server):

```lua
-- Only execute on server
if TheWorld.ismastersim then
    -- Change season
    TheWorld:PushEvent("ms_setseason", "winter")
    
    -- Change time
    TheWorld:PushEvent("ms_setphase", "night")
    
    -- Change weather
    TheWorld:PushEvent("ms_forceprecipitation", true) -- Start rain
    TheWorld:PushEvent("ms_forceprecipitation", false) -- Stop rain
    
    -- Set time segments
    TheWorld:PushEvent("ms_setclocksegs", {
        day = 10,   -- Number of day segments
        dusk = 4,   -- Number of dusk segments
        night = 2   -- Number of night segments
    })
    
    -- Set time speed
    TheWorld:PushEvent("ms_setspeedmult", 2) -- Double speed
end
```

## Using WorldState in Prefabs

```lua
-- In prefab function
local function fn()
    local inst = CreateEntity()
    
    -- Add basic components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- React to worldstate changes
    inst:WatchWorldState("phase", function(inst, phase)
        if phase == "day" then
            inst.AnimState:PlayAnimation("idle_day")
        elseif phase == "dusk" then
            inst.AnimState:PlayAnimation("idle_dusk")
        elseif phase == "night" then
            inst.AnimState:PlayAnimation("idle_night")
        end
    end)
    
    inst:WatchWorldState("isfullmoon", function(inst, isfullmoon)
        if isfullmoon then
            inst:AddTag("fullmoonactive")
        else
            inst:RemoveTag("fullmoonactive")
        end
    end)
    
    return inst
end
```

## WorldState in Caves

In a multi-shard system, caves have their own WorldState:

```lua
-- Check if in a cave
if TheWorld:HasTag("cave") then
    -- Caves have some different worldstate properties
    -- No normal day/night cycle
    
    -- But still track seasons from overworld
    if TheWorld.state.isspring then
        -- Spring affects caves (e.g., earthquakes)
    end
end
```

## Other Useful Properties

```lua
-- Deerclops hunger level
world_state.deerclopswarning

-- Wind strength (ocean)
world_state.windspeed

-- Moon phase ID
world_state.moonphase

-- Ghost night (Halloween)
world_state.ghostenabled

-- Is Hallowed Nights (Halloween)
world_state.ishalloween

-- Time speed (normally 1)
world_state.clocksegs
world_state.clockspeed
``` 