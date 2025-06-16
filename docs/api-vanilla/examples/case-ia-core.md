---
id: case-ia-core
title: Case Study - Island Adventures Core
sidebar_position: 3
last_updated: 2023-07-06
version: 619045
---
*Last Update: 2023-07-06*
# Case Study: Island Adventures Core

This case study examines "Island Adventures Core", a comprehensive mod that ports content from Don't Starve's single-player DLCs (Shipwrecked and Hamlet) to Don't Starve Together. It demonstrates advanced techniques for creating new biomes, mechanics, characters, and integrating them seamlessly with the base game.
- [Gitlab](https://gitlab.com/IslandAdventures/ia-core)
- [Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=3435352667)

## Overview

Island Adventures Core is the foundation module for a series of mods that transform Don't Starve Together into a tropical archipelago experience. Key features include:

- Island and volcano biomes with unique world generation
- Weather systems including wind, tropical storms, and seasons
- New characters from Shipwrecked (Walani, Wilbur, Woodlegs)
- Ocean mechanics with waves, boats, and sea traversal
- New tools like machetes and specialized items
- Complete integration with DST's multiplayer framework
- Custom components for wind effects, poisoning, sailing, and more

## Code Structure

The mod follows a well-organized structure:

```
ia-core/
├── anim/                   # Custom animations
├── bigportraits/           # Character portraits
├── images/                 # UI and textures
├── levels/                 # World generation data
├── main/                   # Core mod systems
├── postinit/               # Extensions to existing game systems
│   ├── behaviours/         # Modified behaviors
│   ├── brains/             # Modified AI
│   ├── components/         # Extended components
│   ├── engine_components/  # Engine modifications
│   ├── map/                # World gen modifications
│   ├── prefabs/            # Modified prefabs
│   ├── screens/            # UI modifications
│   ├── sim/                # Simulation modifications
│   ├── stategraphs/        # Animation state modifications
│   └── widgets/            # UI widget modifications
├── scripts/                # New gameplay systems
│   ├── brains/             # New AI behaviors
│   ├── components/         # New components
│   ├── map/                # New world generation
│   ├── prefabs/            # New entities
│   ├── screens/            # Custom UI screens
│   ├── stategraphs/        # Custom animation states
│   ├── tools/              # Utility functions
│   └── widgets/            # Custom UI elements
├── shaders/                # Custom visual effects
├── sound/                  # Custom audio
├── strings/                # Localization
├── modinfo.lua             # Mod configuration
└── modmain.lua             # Main entry point
```

## Technical Implementation

### Custom Components

Island Adventures Core introduces numerous custom components to support its unique gameplay features:

```lua
-- Example: Sailor Component (for boat handling)
function Sailor:Mount(boat)
    self:Dismount()
    
    self.mounttask = nil
    self.boat = boat
    self.is_sailing = true

    if boat.components.boatphysics ~= nil then
        boat.components.boatphysics:AddSailor(self.inst)
    end
    
    self.inst:AddTag("sailing")
    self.inst:PushEvent("mounted_boat", {boat = boat})
end

function Sailor:GetWindDirection()
    if TheWorld.components.worldwind ~= nil then
        return TheWorld.components.worldwind:GetWindDirection()
    end
    return 0
end
```

Key components include:

- `sailor` - For boat control and navigation
- `poisonable` - For poison status effects
- `windvisuals` - For wind-based visual effects
- `blowinwindgust` - For wind physics on objects
- `boatjumper` - For jumping between boats
- `hackable` - For harvesting new resources like bamboo
- `ia_drownable` - For ocean drowning mechanics
- `telescope` - For scouting distant locations

### Weather Systems

The mod implements comprehensive weather systems with wind, waves, and storms:

```lua
-- Wind system implementation (simplified)
function WorldWind:OnUpdate(dt)
    self.direction = self.direction + self.directionspeed * dt
    if self.direction >= 2*PI then
        self.direction = self.direction - 2*PI
    end

    self.timer = self.timer - dt
    if self.timer <= 0 then
        local season = TheWorld.state.season
        local gusts = false
        
        if season == "hurricane" then
            gusts = true
            self:SetWindSpeed(math.random() * 0.5 + 1.0, true)
        elseif season == "mild" then
            self:SetWindSpeed(math.random() * 0.3, true)
        end
        
        if gusts and math.random() < 0.2 then
            self:StartGust()
        end
        
        self.timer = math.random() * TUNING.WIND_CHANGE_TIME
    end
    
    self:UpdateEntities()
end
```

### Ocean and Sailing

The mod adds robust ocean and sailing mechanics:

```lua
-- Wave system implementation (simplified)
WaveManager.GenerateWaveAtPoint = function(self, wave_type, pt, dir_rad)
    local inst = SpawnPrefab(self.wave_prefabs[wave_type])
    local dir_vec = Vector3(math.cos(dir_rad), 0, -math.sin(dir_rad))
    
    inst.Transform:SetPosition(pt.x, 0, pt.z)
    inst.Transform:SetRotation(dir_rad / DEGREES)
    inst.components.waveobstacle:SetDirection(dir_vec)
    
    return inst
end

-- Boat trawling system for fishing while moving
function BoatTrawler:StartTrawling()
    self.trawling = true
    self.trawltime = 0
    self:SetTrawlDistance(0)
    self.inst:StartUpdatingComponent(self)
    self.inst:PushEvent("trawlstart")
end
```

### World Integration

The mod seamlessly integrates with DST's world system, allowing travel between regular world and island worlds:

```lua
-- Sea/Skyworthy (portal) implementation (simplified)
local function OnActivate(inst, doer)
    if not inst:HasTag("active") then
        return false
    elseif not (doer ~= nil and doer:HasTag("player")) then
        return false, "NOTPLAYER"
    end

    local world = TheWorld
    if world == nil or world.net == nil then
        return false
    end

    local target_shard = nil
    for shard_id, _ in pairs(world.net.components.shardstate:GetConnectedShards()) do
        target_shard = shard_id
        break
    end

    if target_shard == nil then
        return false, "NOWORLD"
    end

    -- Initiate migration to other world
    TheWorld:PushEvent("ms_playerdespawnandmigrate", {
        player = doer, 
        worldid = target_shard,
        portal_id = inst.components.worldmigrator.id
    })
    
    return true
end
```

### Poison Mechanics

The mod implements a poison system that affects players and mobs:

```lua
-- Poisonable component (simplified)
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

            if self.task == nil then
                self.task = self.inst:DoPeriodicTask(1, DoPoisonDamage, 0, self)
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

## API Usage Highlights

### Postinit System

The mod makes extensive use of DST's component postinit system to extend existing components:

```lua
-- Extending locomotor component for swimming
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

### Entity System Modifications

The mod modifies the entity system to handle ocean/land transitions:

```lua
-- Example of entity script extension for water interactions
AddPrefabPostInit("player_classified", function(inst)
    if not TheWorld.ismastersim then
        inst:ListenForEvent("ia_drownabledirty", function()
            if inst.ia_drownable ~= nil then
                local val = inst.ia_drownable:value()
                
                if val > 0 then
                    inst._parent:AddTag("drownable")
                    if val == 2 then
                        inst._parent:AddTag("drowning")
                    else
                        inst._parent:RemoveTag("drowning")
                    end
                else
                    inst._parent:RemoveTag("drownable")
                    inst._parent:RemoveTag("drowning")
                end
            end
        end)
    end
end)
```

### World State Management

The mod adds new world state variables to track tropical seasons and events:

```lua
-- Adding new world states 
AddPrefabPostInit("world", function(inst)
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
    
    -- Add hurricane season state
    if inst.state ~= nil then
        inst.state.ishurricaneseason = false
    end
end)
```

### Custom Actions

The mod adds new player actions for island-specific interactions:

```lua
-- Hack action for machetes
local HACK = Action({ priority=2, mount_valid=true })
HACK.id = "HACK"
HACK.str = STRINGS.ACTIONS.HACK
HACK.fn = function(act)
    if act.target ~= nil and act.target.components.hackable ~= nil then
        return act.target.components.hackable:Hack(act.doer, act.invobject)
    end
end

-- Register the action
AddAction(HACK)

-- Add component action handlers
AddComponentAction("SCENE", "hackable", function(inst, doer, actions, right)
    if right and inst:HasTag("hackable") then
        table.insert(actions, ACTIONS.HACK)
    end
end)
```

### Seamless Multiplayer Integration

The mod implements network synchronization for custom components:

```lua
-- Network synchronization (simplified)
function Sailor:OnSave()
    return {
        is_sailing = self.is_sailing,
        has_overhead_sail = self.has_overhead_sail
    }
end

function Sailor:OnLoad(data)
    if data ~= nil then
        self.is_sailing = data.is_sailing or false
        self.has_overhead_sail = data.has_overhead_sail or false
    end
end

function Sailor_Replica:OnRemoteBoatInfo(info)
    self.is_sailing = info.is_sailing
    self.has_overhead_sail = info.has_overhead_sail
    
    if self.inst.player_classified ~= nil then
        self.inst.player_classified:SetValue("is_sailing", self.is_sailing)
    end
end
```

## Key Lessons

### 1. Large-Scale Systems Integration

The mod demonstrates how to integrate large-scale systems:
- Creating biome-specific mechanics that work alongside base game systems
- Extending existing components rather than replacing them
- Maintaining compatibility with the core game

### 2. Custom Components Architecture

The mod showcases effective component design:
- Creating specialized components for unique mechanics (sailing, wind, poison)
- Ensuring components are reusable and modular
- Properly handling component interactions and dependencies

### 3. World Generation Extensions

The mod demonstrates sophisticated world generation techniques:
- Creating custom biomes with unique rules
- Connecting multiple world types through portals
- Managing biome-specific resources and spawning

### 4. Network Synchronization

The mod implements robust networking for multiplayer compatibility:
- Creating client/server component pairs (replicas)
- Efficiently synchronizing state across players
- Handling latency and disconnections gracefully

## Conclusion

Island Adventures Core showcases advanced techniques for creating a comprehensive expansion to Don't Starve Together. By studying its implementation, developers can learn how to effectively extend DST with new biomes, mechanics, and custom components while maintaining multiplayer compatibility and performance.

## See Also

- [Component System](../core/component-system.md) - For understanding how components work
- [Event System](../core/event-system.md) - For event handling as used in this mod
- [Network System](../core/network-system.md) - For multiplayer synchronization
- [World Generation](../world/worldgen.md) - For custom biome creation
- [Custom Component Example](custom-component.md) - For learning how to create custom components
