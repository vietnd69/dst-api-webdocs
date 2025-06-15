---
id: other-components
title: Other Components
sidebar_position: 30
last_updated: 2023-07-06
version: 619045
---

# Other Components

This page provides a brief overview of additional important components available in Don't Starve Together. Each component is described with its primary purpose and key properties.

## Movement and Physics Components

### Flotation
Allows entities to float on water.
- `floodlevel`: Height threshold at which the entity starts floating
- `float_speed`: Speed at which the entity floats upward

```lua
-- Adding flotation to an entity
local function MakeFloatable(inst)
    if inst.components.flotation == nil then
        inst:AddComponent("flotation")
    end
    inst.components.flotation.floodlevel = 2
    inst.components.flotation.float_speed = 4
end

-- Using the flotation component
if inst.components.flotation ~= nil then
    inst.components.flotation:SetFloatOnLiquid(true)
end
```

### Walkableplatform
Makes entities act as walkable surfaces, like boats.
- `platform_radius`: Radius of the walkable area
- `player_collision_prefab`: Prefab used for player collision

```lua
-- Adding walkable platform to a boat
local function AddWalkablePlatform(inst)
    inst:AddComponent("walkableplatform")
    inst.components.walkableplatform.platform_radius = 4.5
    inst.components.walkableplatform.player_collision_prefab = "boat_player_collision"
end

-- Getting entities on platform
local function GetEntitiesOnBoat(boat)
    if boat.components.walkableplatform ~= nil then
        local entities = boat.components.walkableplatform:GetEntitiesOnPlatform()
        -- Do something with entities
    end
end
```

### Physics
Controls physical properties and collision.
- `mass`: Entity mass
- `friction`: Surface friction coefficient
- `collisiongroup`: Which collision group this entity belongs to
- `ignorewalls`: Whether entity ignores wall collisions

```lua
-- Setting up physics on an entity
local function SetupPhysics(inst)
    inst:AddComponent("physics")
    inst.components.physics:SetMass(10)
    inst.components.physics:SetFriction(0.1)
    inst.components.physics:SetCollisionGroup(COLLISION.CHARACTERS)
    inst.components.physics:SetCollisionMask(COLLISION.WORLD)
    inst.components.physics:SetActive(true)
end
```

## Interaction Components

### Activatable
Allows entities to be activated (like switches or levers).
- `inactive`: Whether the entity is currently inactive
- `onactivate`: Function called when activated
- `standingactivation`: Whether it activates when stood upon

```lua
-- Setting up an activatable lever
local function MakeLever(inst)
    inst:AddComponent("activatable")
    
    inst.components.activatable.OnActivate = function(inst, doer)
        if inst.components.activatable.inactive then
            inst.components.activatable.inactive = false
            -- Do something when activated
            return true
        end
    end
    
    inst.components.activatable.standingactivation = false
    inst.components.activatable.inactive = true
end
```

### Useable
Makes entities useable through the "use" action.
- `onuse`: Function called when entity is used
- `usedurabilityloss`: Durability loss per use
- `inuse`: Whether entity is currently being used

```lua
-- Make an item useable
local function MakeUseable(inst)
    inst:AddComponent("useable")
    inst.components.useable:SetOnUseFn(function(inst, doer)
        -- Do something when used
        return true
    end)
    inst.components.useable:SetUseTime(1)
    inst.components.useable.usedurabilityloss = 1
end
```

### Button
Makes entities act as clickable buttons.
- `onclick`: Function called when button is clicked
- `enabled`: Whether button is currently enabled
- `text`: Text displayed on the button

```lua
-- Creating a button
local function MakeButton(inst)
    inst:AddComponent("button")
    inst.components.button:SetOnClick(function()
        -- Action when clicked
        print("Button was clicked!")
    end)
    inst.components.button:SetText("Press Me")
    inst.components.button:SetEnabled(true)
end
```

## Environmental Components

### Heater
Allows entities to emit heat or cold.
- `heat`: Heat value emitted
- `insulation`: Cold insulation provided
- `equippedheat`: Heat when equipped
- `range`: Range of heating effect

```lua
-- Creating a heat source
local function MakeHeater(inst)
    inst:AddComponent("heater")
    inst.components.heater:SetHeat(15)
    inst.components.heater:SetRange(10)
    inst.components.heater.equippedheat = 10
    inst.components.heater.insulation = 40
end

-- Checking if player is warm
local function IsPlayerWarm(player, heater)
    if heater.components.heater ~= nil then
        local heat = heater.components.heater:GetHeat()
        local range = heater.components.heater:GetRange()
        local distance = player:GetDistanceSqToInst(heater)
        return distance <= range * range and heat > 0
    end
    return false
end
```

### Weather
Controls weather conditions and effects.
- `moisture`: Current moisture level
- `precipitationrate`: Rate of precipitation
- `lightning`: Whether lightning is enabled
- `seasonmanager`: Controls season-specific weather

```lua
-- Manipulating weather
local function ControlWeather(world)
    if world.components.weather ~= nil then
        -- Start rain
        world.components.weather:StartPrecipitation()
        
        -- Set precipitation rate
        world.components.weather.precipitationrate = 0.1
        
        -- Enable/disable lightning
        world.components.weather:EnableLightning(true)
        
        -- Get current moisture
        local moisture = world.components.weather.moisture
    end
end
```

### Moisture
Handles wetness for entities.
- `moisture`: Current moisture level
- `maxmoisture`: Maximum possible moisture
- `dryrate`: Rate at which entity dries
- `inherentdryrate`: Base drying rate

```lua
-- Setting up moisture on an entity
local function SetupMoisture(inst)
    inst:AddComponent("moisture")
    inst.components.moisture.maxmoisture = 100
    inst.components.moisture.dryrate = 0.1
    
    -- Make entity wet
    inst.components.moisture:DoDelta(50)
    
    -- Check if entity is wet
    if inst.components.moisture:GetMoisture() > 35 then
        print("Entity is wet!")
    end
end
```

## Resource Components

### Harvestable
Allows entities to be harvested for resources.
- `product`: Item produced when harvested
- `productregen`: Time to regenerate product
- `maxproduce`: Maximum number of items produced
- `onharvest`: Function called when harvested

```lua
-- Making a berry bush harvestable
local function MakeHarvestable(inst)
    inst:AddComponent("harvestable")
    inst.components.harvestable:SetUp("berries", 3)
    inst.components.harvestable.productregen = TUNING.BERRY_REGROW_TIME
    inst.components.harvestable.maxproduce = 3
    
    inst.components.harvestable.onharvestfn = function(inst, picker)
        -- What happens when harvested
        inst.AnimState:PlayAnimation("picked")
    end
end
```

### Preserver
Slows down spoilage of perishable items.
- `preservefn`: Function to calculate preservation multiplier
- `preserveperishable`: Whether it preserves perishable items

```lua
-- Creating an icebox preserver
local function MakeIcebox(inst)
    inst:AddComponent("preserver")
    inst.components.preserver:SetPerishRateMultiplier(function(inst, item)
        -- Ice Box preserves food 4x longer
        if item.components.perishable ~= nil then
            return TUNING.ICEBOX_PERISH_RATE_MULTIPLIER
        end
        return 1
    end)
end

-- Using a preserver
local function StoreItemInPreserver(item, container)
    if container.components.preserver ~= nil and item.components.perishable ~= nil then
        -- Item will perish slower in this container
        container.components.container:GiveItem(item)
    end
end
```

### Rechargeable
Allows entities to recharge over time.
- `charge`: Current charge level
- `maxcharge`: Maximum charge capacity
- `chargetime`: Time to fully recharge
- `onchargedfn`: Function called when fully charged

```lua
-- Setting up a rechargeable item
local function MakeRechargeable(inst)
    inst:AddComponent("rechargeable")
    inst.components.rechargeable:SetMaxCharge(100)
    inst.components.rechargeable:SetRate(1) -- 1 point per second
    inst.components.rechargeable:SetChargeTime(100) -- 100 seconds to full charge
    
    inst.components.rechargeable:SetOnChargedFn(function(inst)
        -- Do something when fully charged
        print("Item fully charged!")
    end)
end

-- Using charge
if inst.components.rechargeable ~= nil then
    local current_charge = inst.components.rechargeable:GetCharge()
    if current_charge >= 50 then
        inst.components.rechargeable:Discharge(50)
        -- Use 50 charge points
    end
end
```

## Character Components

### Talker
Enables entities to display speech bubbles.
- `font`: Font used for speech text
- `fontsize`: Size of the text
- `offset`: Position offset for speech bubble
- `colour`: Text color

```lua
-- Setting up a talker
local function MakeTalker(inst)
    inst:AddComponent("talker")
    inst.components.talker.fontsize = 35
    inst.components.talker.font = TALKINGFONT
    inst.components.talker.offset = Vector3(0, -400, 0)
    inst.components.talker.colour = Vector3(1, 1, 1)
end

-- Making an entity speak
local function SaySomething(inst, text)
    if inst.components.talker ~= nil then
        inst.components.talker:Say(text)
    end
end
```

### Follower
Allows entities to follow other entities.
- `leader`: Entity being followed
- `followdistance`: Target distance to maintain
- `followvehicle`: Whether to follow vehicles

```lua
-- Setting up a follower
local function MakeFollower(inst)
    inst:AddComponent("follower")
    inst.components.follower.followdistance = 3
    inst.components.follower.followvehicle = true
end

-- Making an entity follow the player
local function StartFollowing(inst, player)
    if inst.components.follower ~= nil then
        inst.components.follower:SetLeader(player)
    end
end

-- Stop following
local function StopFollowing(inst)
    if inst.components.follower ~= nil then
        inst.components.follower:StopFollowing()
    end
end
```

### Birdattractor
Attracts birds to the entity.
- `radius`: Attraction radius
- `maxbirds`: Maximum birds attracted
- `spawntime`: Time between spawning birds

```lua
-- Creating a bird attractor
local function MakeBirdAttractor(inst)
    inst:AddComponent("birdattractor")
    inst.components.birdattractor.radius = 20
    inst.components.birdattractor.maxbirds = 4
    inst.components.birdattractor.spawntime = {min=10, max=20}
end
```

## Crafting Components

### Prototyper
Allows crafting of higher-tier recipes when nearby.
- `trees`: Tech tree levels provided
- `onturnon`: Function called when turned on
- `onturnoff`: Function called when turned off

```lua
-- Setting up a science machine
local function MakeScienceMachine(inst)
    inst:AddComponent("prototyper")
    inst.components.prototyper.trees = {SCIENCE = 1}
    
    inst.components.prototyper.onturnon = function(inst)
        inst.AnimState:PlayAnimation("idle_on")
    end
    
    inst.components.prototyper.onturnoff = function(inst)
        inst.AnimState:PlayAnimation("idle_off")
    end
end
```

### Deployable
Allows items to be deployed as structures or placed objects.
- `ondeploy`: Function called when deployed
- `deploymode`: How the item is deployed
- `deploytarget`: Valid deployment target tags

```lua
-- Making an item deployable
local function MakeDeployable(inst)
    inst:AddComponent("deployable")
    inst.components.deployable.ondeploy = function(inst, pt, deployer)
        -- Create the deployed object
        local fire = SpawnPrefab("campfire")
        fire.Transform:SetPosition(pt.x, pt.y, pt.z)
        
        -- Remove the item
        inst:Remove()
    end
    inst.components.deployable:SetDeployMode(DEPLOYMODE.PLANT)
    inst.components.deployable:SetDeploySpacing(DEPLOYSPACING.DEFAULT)
end
```

### Constructionsite
Represents a structure being built.
- `constructionprefab`: Prefab to create when construction is complete
- `progress`: Current construction progress
- `materials`: Materials required to complete

```lua
-- Setting up a construction site
local function MakeConstructionSite(inst)
    inst:AddComponent("constructionsite")
    inst.components.constructionsite:SetConstructionPrefab("tent")
    
    -- Define required materials
    inst.components.constructionsite:AddMaterial("cutgrass", 6)
    inst.components.constructionsite:AddMaterial("twigs", 4)
    
    -- Construction complete callback
    inst.components.constructionsite:SetOnConstructedFn(function(inst, builder)
        -- Do something when construction is complete
    end)
end
```

## Other Important Components

### Light
Emits light.
- `radius`: Light radius
- `intensity`: Light intensity
- `falloff`: Light falloff rate
- `colour`: Light color

```lua
-- Adding light to an entity
local function MakeLight(inst)
    inst:AddComponent("light")
    inst.components.light:SetRadius(5)
    inst.components.light:SetIntensity(0.8)
    inst.components.light:SetFalloff(0.7)
    inst.components.light:SetColour(235/255, 165/255, 12/255)
    inst.components.light:Enable(true)
end

-- Changing light properties
local function PulsateLight(inst)
    if inst.components.light ~= nil then
        local radius = inst.components.light:GetRadius()
        inst.components.light:SetRadius(radius * 0.9)
    end
end
```

### Timer
Manages timed events.
- `timers`: List of active timers
- `timerfn`: Functions called when timers expire

```lua
-- Using timers
local function SetupTimer(inst)
    inst:AddComponent("timer")
    
    -- Start a timer
    inst.components.timer:StartTimer("recharge", 60)
    
    -- Check if timer is active
    if inst.components.timer:TimerExists("recharge") then
        local time_left = inst.components.timer:GetTimeLeft("recharge")
        print("Time left: " .. time_left)
    end
    
    -- Set a callback for when timer ends
    inst:ListenForEvent("timerdone", function(inst, data)
        if data.name == "recharge" then
            -- Timer is done, do something
            print("Recharge timer completed!")
        end
    end)
end
```

### Tiletracker
Tracks tiles that the entity is on or near.
- `ontileschanged`: Function called when tiles change
- `trackedtiles`: List of currently tracked tiles

```lua
-- Setting up tile tracking
local function SetupTileTracker(inst)
    inst:AddComponent("tiletracker")
    
    inst.components.tiletracker:SetOnTileChangedFn(function(inst, new_tile)
        -- Do something when tile changes
        print("Entity moved to a new tile type: " .. tostring(new_tile))
    end)
    
    -- Start tracking tiles
    inst.components.tiletracker:Start()
end
```

### Drownable
Makes entities able to drown in water.
- `drowntime`: Time until drowning occurs
- `sinktimer`: Current sink timer
- `splashresistance`: Resistance to splashing

```lua
-- Making an entity drownable
local function MakeDrownable(inst)
    inst:AddComponent("drownable")
    inst.components.drownable.drowntime = 6
    inst.components.drownable.splashresistance = 0
    
    -- Set callbacks
    inst.components.drownable:SetOnDrownFn(function(inst)
        -- What happens when entity drowns
    end)
    
    inst.components.drownable:SetOnStartDrownFn(function(inst)
        -- What happens when entity starts to drown
    end)
end
```

### Grogginess
Controls stun and grogginess effects.
- `groggyness`: Current grogginess level
- `knockouttime`: Time to remain knocked out
- `recoverrate`: Rate of recovery from grogginess

```lua
-- Setting up grogginess
local function SetupGrogginess(inst)
    inst:AddComponent("grogginess")
    inst.components.grogginess.knockouttime = 4
    inst.components.grogginess.recoverrate = 1
    
    -- Make entity groggy
    inst.components.grogginess:AddGrogginess(5)
    
    -- Check if knocked out
    if inst.components.grogginess:IsKnockedOut() then
        print("Entity is knocked out!")
    end
end
```

### Resurrector
Allows resurrection of dead players.
- `onresurrect`: Function called on resurrection
- `penalty`: Health penalty applied after resurrection

```lua
-- Setting up a resurrection item
local function MakeResurrector(inst)
    inst:AddComponent("resurrector")
    
    inst.components.resurrector.onresurrectfn = function(inst, user)
        -- What happens when player is resurrected
        inst:Remove()
    end
    
    inst.components.resurrector.penalty = 0.25 -- 25% health penalty
end
```

### Wisecracker
Enables entity to make comments about surroundings.
- `sayings`: Table of possible comments
- `timesincewisequip`: Time since last comment

```lua
-- Setting up wisecracker
local function SetupWisecracker(inst)
    inst:AddComponent("wisecracker")
    inst.components.wisecracker.sayings = {
        "What a lovely day!",
        "I'm hungry...",
        "Something is watching me..."
    }
end

-- Making a comment
local function MakeComment(inst, event)
    if inst.components.wisecracker ~= nil then
        inst.components.wisecracker:Crack(event)
    end
end
```

### Teleporter
Allows teleportation to other locations.
- `targetpos`: Destination position
- `ontelefn`: Function called when teleporting
- `offsettarget`: Offset for teleport location

```lua
-- Setting up a teleporter
local function MakeTeleporter(inst)
    inst:AddComponent("teleporter")
    
    -- Set target position
    inst.components.teleporter.targetpos = Vector3(0, 0, 0)
    
    -- Set teleport function
    inst.components.teleporter.ontelefn = function(inst, obj)
        -- Do something when teleporting
        print(obj.name .. " is being teleported!")
    end
    
    -- Set offset
    inst.components.teleporter.offsettarget = Vector3(2, 0, 0)
end

-- Teleporting an entity
local function TeleportEntity(teleporter, entity)
    if teleporter.components.teleporter ~= nil then
        teleporter.components.teleporter:Activate(entity)
    end
end
```

### Murderable
Allows entity to be murdered by players.
- `onmurder`: Function called when murdered
- `murdersound`: Sound played when murdered

```lua
-- Setting up a murderable entity
local function MakeMurderable(inst)
    inst:AddComponent("murderable")
    
    inst.components.murderable.onmurderfn = function(inst, murderer)
        -- What happens when murdered
        SpawnPrefab("smallmeat").Transform:SetPosition(inst.Transform:GetWorldPosition())
        inst:Remove()
    end
    
    inst.components.murderable.murdersound = "dontstarve/rabbit/scream"
end
```

### Shard_player
Handles player transitions between shards (server instances).
- `shard`: Current shard ID
- `migrationdata`: Data for migration between shards

```lua
-- Using shard player component
local function HandleShardMigration(player)
    if player.components.shard_player ~= nil then
        -- Prepare for migration
        player.components.shard_player:SetMigrationData({
            health = player.components.health.currenthealth,
            hunger = player.components.hunger.current,
            sanity = player.components.sanity.current
        })
        
        -- Migrate to another shard
        player.components.shard_player:DoMigration(TheWorld.meta.shardid + 1)
    end
end
```

### Tradable
Makes an item tradable to NPCs.
- `goldvalue`: Value in gold nuggets
- `rocktribute`: Whether usable as rock tribute
- `tradeable`: Whether currently tradable 

```lua
-- Making an item tradable
local function MakeTradable(inst)
    inst:AddComponent("tradable")
    inst.components.tradable.goldvalue = 5
    inst.components.tradable.rocktribute = true
    
    -- Set trade function
    inst.components.tradable:SetOnTradeFn(function(inst, trader, goldvalue)
        -- What happens when traded
        print("Item traded for " .. tostring(goldvalue) .. " gold!")
    end)
end
``` 
