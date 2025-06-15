---
id: custom-weather-effects
title: Creating Custom Weather Effects
sidebar_position: 13
---

# Creating Custom Weather Effects

This guide focuses on creating custom weather effects in Don't Starve Together. Weather effects can add immersion, gameplay challenges, and unique visual elements to your mod.

## Understanding Weather in DST

Don't Starve Together's weather system consists of several components:

1. **Precipitation**: Rain, snow, and other falling particles
2. **Visual Effects**: Fog, lightning, screen overlays
3. **Sound Effects**: Thunder, wind, ambient sounds
4. **Gameplay Effects**: Temperature changes, wetness, lightning strikes
5. **World State**: Season-dependent weather conditions

## Basic Weather Effect Structure

A custom weather effect typically requires:

1. A prefab for the weather controller
2. Visual effects (particles, screen shaders)
3. Sound effects
4. Integration with the world state
5. Gameplay impact (optional)

## Creating a Simple Rain Effect

Let's create a custom colored rain effect as a basic example:

```lua
-- In scripts/prefabs/colored_rain.lua
local assets = {
    Asset("ANIM", "anim/rain.zip"),
    Asset("ANIM", "anim/splash_ripple.zip"),
    Asset("ANIM", "anim/splash_sink.zip"),
}

local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddNetwork()
    
    -- Add the precipitation component
    if not TheNet:IsDedicated() then
        inst:AddComponent("precipitation")
        
        -- Set custom rain color (purple rain in this example)
        inst.components.precipitation.tint = Vector3(0.8, 0.5, 1.0)
        inst.components.precipitation:SetLevel(1)
    end
    
    inst:AddTag("FX")
    inst:AddTag("NOCLICK")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    inst.persists = false
    
    return inst
end

return Prefab("colored_rain", fn, assets)
```

## Weather Controller

To manage your custom weather, create a weather controller:

```lua
-- In scripts/prefabs/custom_weather_controller.lua
local function OnUpdate(inst)
    -- Update weather conditions periodically
    if TheWorld.state.isday then
        -- Daytime weather behavior
        if math.random() < 0.1 then
            -- 10% chance to start rain during day
            inst:StartRain()
        end
    else
        -- Nighttime weather behavior
        if math.random() < 0.2 then
            -- 20% chance to start rain during night
            inst:StartRain()
        end
    end
end

local function StartRain(inst)
    if not inst.is_raining then
        inst.is_raining = true
        
        -- Spawn the rain effect
        if inst.rain_fx == nil then
            inst.rain_fx = SpawnPrefab("colored_rain")
        end
        
        -- Play rain sound
        if not inst.sound_playing then
            inst.SoundEmitter:PlaySound("dontstarve/rain/rain", "rain")
            inst.sound_playing = true
        end
        
        -- Notify world of rain state
        TheWorld:PushEvent("customrainstatechanged", { raining = true })
        
        -- Schedule rain to stop after some time
        inst.rain_task = inst:DoTaskInTime(10 + math.random() * 30, function()
            inst:StopRain()
        end)
    end
end

local function StopRain(inst)
    if inst.is_raining then
        inst.is_raining = false
        
        -- Remove rain effect
        if inst.rain_fx ~= nil then
            inst.rain_fx:Remove()
            inst.rain_fx = nil
        end
        
        -- Stop rain sound
        if inst.sound_playing then
            inst.SoundEmitter:KillSound("rain")
            inst.sound_playing = false
        end
        
        -- Notify world of rain state
        TheWorld:PushEvent("customrainstatechanged", { raining = false })
        
        -- Cancel any pending rain task
        if inst.rain_task ~= nil then
            inst.rain_task:Cancel()
            inst.rain_task = nil
        end
    end
end

local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()
    
    inst:AddTag("CLASSIFIED")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    inst.is_raining = false
    inst.sound_playing = false
    
    -- Add methods
    inst.StartRain = StartRain
    inst.StopRain = StopRain
    
    -- Start periodic updates
    inst:DoPeriodicTask(60, OnUpdate) -- Check weather changes every minute
    
    -- Respond to season changes
    inst:WatchWorldState("season", function(inst, season)
        if season == "winter" then
            -- No rain in winter
            inst:StopRain()
        elseif season == "spring" then
            -- More frequent rain in spring
            if math.random() < 0.5 then
                inst:StartRain()
            end
        end
    end)
    
    return inst
end

return Prefab("custom_weather_controller", fn)
```

## Advanced Precipitation Effects

### Custom Snow Effect

```lua
-- In scripts/prefabs/custom_snow.lua
local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddNetwork()
    
    if not TheNet:IsDedicated() then
        inst:AddComponent("precipitation")
        
        -- Configure as snow
        inst.components.precipitation.type = "snow"
        inst.components.precipitation:SetLevel(1)
        
        -- Custom snow color (blue tint)
        inst.components.precipitation.tint = Vector3(0.7, 0.8, 1.0)
    end
    
    inst:AddTag("FX")
    inst:AddTag("NOCLICK")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    inst.persists = false
    
    return inst
end

return Prefab("custom_snow", fn)
```

### Acid Rain Effect

```lua
-- In scripts/prefabs/acid_rain.lua
local function OnRainImpact(inst, x, y, z)
    -- Spawn acid splash effect
    local splash = SpawnPrefab("acid_splash")
    if splash then
        splash.Transform:SetPosition(x, 0, z)
    end
    
    -- Damage entities in the area
    local ents = TheSim:FindEntities(x, 0, z, 1, nil, {"FX", "NOCLICK", "DECOR", "INLIMBO"})
    for _, ent in ipairs(ents) do
        if ent.components.health ~= nil and not ent:HasTag("acidproof") then
            ent.components.health:DoDelta(-1) -- Small damage from acid rain
        end
    end
end

local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddNetwork()
    
    if not TheNet:IsDedicated() then
        inst:AddComponent("precipitation")
        
        -- Set acid rain color (greenish)
        inst.components.precipitation.tint = Vector3(0.7, 1.0, 0.3)
        inst.components.precipitation:SetLevel(1)
        
        -- Add impact callback
        inst.components.precipitation.OnRainImpact = OnRainImpact
    end
    
    inst:AddTag("FX")
    inst:AddTag("NOCLICK")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    inst.persists = false
    
    return inst
end

return Prefab("acid_rain", fn)
```

## Visual Weather Effects

### Fog Effect

```lua
-- In scripts/prefabs/custom_fog.lua
local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddNetwork()
    
    -- Add fog component
    if not TheNet:IsDedicated() then
        inst:AddComponent("fogmanager")
        inst.components.fogmanager:SetFogColor(0.8, 0.8, 0.9) -- Light gray fog
        inst.components.fogmanager:SetFogScale(0.5) -- Medium density
        inst.components.fogmanager:StartFog()
    end
    
    inst:AddTag("FX")
    inst:AddTag("NOCLICK")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    inst.persists = false
    
    return inst
end

return Prefab("custom_fog", fn)
```

### Lightning Effect

```lua
-- In scripts/prefabs/custom_lightning.lua
local function DoLightningStrike(inst, x, z)
    -- Create visual effect
    local fx = SpawnPrefab("lightning")
    if fx ~= nil then
        fx.Transform:SetPosition(x, 0, z)
    end
    
    -- Create thunder sound
    inst.SoundEmitter:PlaySound("dontstarve/rain/thunder_close")
    
    -- Damage nearby entities
    local ents = TheSim:FindEntities(x, 0, z, 4, nil, {"FX", "NOCLICK", "DECOR", "INLIMBO"})
    for _, ent in ipairs(ents) do
        if ent.components.health ~= nil and not ent:HasTag("lightningproof") then
            ent.components.health:DoDelta(-TUNING.LIGHTNING_DAMAGE)
        end
        
        -- Set things on fire
        if ent.components.burnable ~= nil then
            ent.components.burnable:Ignite()
        end
    end
end

local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()
    
    inst:AddTag("FX")
    inst:AddTag("NOCLICK")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Periodically spawn lightning
    inst:DoPeriodicTask(5 + math.random() * 10, function()
        -- Find a valid position
        local x, z
        if ThePlayer ~= nil then
            local px, py, pz = ThePlayer.Transform:GetWorldPosition()
            local angle = math.random() * 2 * PI
            local dist = 10 + math.random() * 20
            x = px + math.cos(angle) * dist
            z = pz + math.sin(angle) * dist
        else
            x, z = 0, 0
        end
        
        -- Do the lightning strike
        DoLightningStrike(inst, x, z)
    end)
    
    inst.persists = false
    
    return inst
end

return Prefab("custom_lightning", fn)
```

## Screen Effects

### Sandstorm Effect

```lua
-- In scripts/prefabs/sandstorm_effect.lua
local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddNetwork()
    
    if not TheNet:IsDedicated() then
        -- Add screen flash component for the sandstorm effect
        inst:AddComponent("screenflash")
        inst.components.screenflash:SetColor(0.9, 0.7, 0.3) -- Sandy color
        inst.components.screenflash:SetIntensity(0.2) -- Subtle effect
        inst.components.screenflash:StartFlash()
        
        -- Add ambient sound
        inst.entity:AddSoundEmitter()
        inst.SoundEmitter:PlaySound("dontstarve/common/sandstorm", "sandstorm")
    end
    
    inst:AddTag("FX")
    inst:AddTag("NOCLICK")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add gameplay effects
    inst:DoPeriodicTask(1, function()
        -- Affect players in the world
        for _, player in ipairs(AllPlayers) do
            -- Reduce visibility
            if player.components.playervision ~= nil then
                player.components.playervision:SetCustomCCTable({
                    brightness = 0,
                    contrast = 0,
                    saturation = -0.3,
                    tint = {r = 0.9, g = 0.8, b = 0.6}
                })
            end
            
            -- Slow movement
            if player.components.locomotor ~= nil then
                player.components.locomotor:SetExternalSpeedMultiplier(inst, "sandstorm", 0.7)
            end
        end
    end)
    
    inst.persists = false
    
    return inst
end

return Prefab("sandstorm_effect", fn)
```

## Integrating Weather with Seasons

To make your weather effects respond to seasons:

```lua
-- In modmain.lua
AddPrefabPostInit("world", function(inst)
    if TheWorld.ismastersim then
        -- Spawn our weather controller
        local weather_controller = SpawnPrefab("custom_weather_controller")
        
        -- Track seasons
        inst:WatchWorldState("season", function(inst, season)
            if season == "winter" then
                -- Winter weather
                if weather_controller.current_effect ~= nil then
                    weather_controller.current_effect:Remove()
                end
                weather_controller.current_effect = SpawnPrefab("custom_snow")
            elseif season == "summer" then
                -- Summer weather
                if weather_controller.current_effect ~= nil then
                    weather_controller.current_effect:Remove()
                end
                weather_controller.current_effect = SpawnPrefab("sandstorm_effect")
            elseif season == "spring" then
                -- Spring weather (more rain)
                if weather_controller.current_effect ~= nil then
                    weather_controller.current_effect:Remove()
                end
                weather_controller.current_effect = SpawnPrefab("colored_rain")
            else
                -- Default weather
                if weather_controller.current_effect ~= nil then
                    weather_controller.current_effect:Remove()
                    weather_controller.current_effect = nil
                end
            end
        end)
    end
end)
```

## Biome-Specific Weather

To create weather that only occurs in specific biomes:

```lua
-- In modmain.lua
AddPrefabPostInit("world", function(inst)
    if TheWorld.ismastersim then
        -- Check for players in specific biomes periodically
        inst:DoPeriodicTask(10, function()
            for _, player in ipairs(AllPlayers) do
                local x, y, z = player.Transform:GetWorldPosition()
                local tile = TheWorld.Map:GetTileAtPoint(x, y, z)
                
                if tile == GROUND.MARSH then
                    -- Special weather in marsh biome
                    local fx = SpawnPrefab("marsh_fog")
                    fx.Transform:SetPosition(x, 0, z)
                elseif tile == GROUND.DESERT then
                    -- Special weather in desert biome
                    local fx = SpawnPrefab("sandstorm_effect")
                    fx.Transform:SetPosition(x, 0, z)
                end
            end
        end)
    end
end)
```

## Weather with Gameplay Impact

### Meteor Shower

```lua
-- In scripts/prefabs/meteor_shower.lua
local function SpawnMeteor(inst)
    -- Find a valid position
    local x, z
    if ThePlayer ~= nil then
        local px, py, pz = ThePlayer.Transform:GetWorldPosition()
        local angle = math.random() * 2 * PI
        local dist = 5 + math.random() * 15
        x = px + math.cos(angle) * dist
        z = pz + math.sin(angle) * dist
    else
        x, z = 0, 0
    end
    
    -- Spawn warning effect
    local warning = SpawnPrefab("meteor_shadow")
    warning.Transform:SetPosition(x, 0, z)
    
    -- Spawn actual meteor after delay
    inst:DoTaskInTime(2, function()
        local meteor = SpawnPrefab("meteor")
        meteor.Transform:SetPosition(x, 20, z)
        
        -- Apply velocity for falling effect
        meteor.Physics:SetVel(0, -15, 0)
        
        -- Set up impact
        meteor:DoTaskInTime(1, function()
            -- Create explosion
            local explosion = SpawnPrefab("explode_small")
            explosion.Transform:SetPosition(x, 0, z)
            
            -- Damage nearby entities
            local ents = TheSim:FindEntities(x, 0, z, 3, nil, {"FX", "NOCLICK", "DECOR", "INLIMBO"})
            for _, ent in ipairs(ents) do
                if ent.components.health ~= nil then
                    ent.components.health:DoDelta(-20)
                end
                
                if ent.components.burnable ~= nil then
                    ent.components.burnable:Ignite()
                end
            end
            
            -- Spawn resources
            local rocks = math.random(1, 3)
            for i = 1, rocks do
                local rock = SpawnPrefab("rocks")
                rock.Transform:SetPosition(x + math.random(-1, 1), 0, z + math.random(-1, 1))
            end
            
            -- Sometimes spawn rare resources
            if math.random() < 0.2 then
                local goldnugget = SpawnPrefab("goldnugget")
                goldnugget.Transform:SetPosition(x, 0, z)
            end
            
            -- Remove meteor
            meteor:Remove()
        end)
    end)
end

local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()
    
    inst:AddTag("FX")
    inst:AddTag("NOCLICK")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Spawn meteors periodically
    inst:DoPeriodicTask(5 + math.random() * 5, function()
        SpawnMeteor(inst)
    end)
    
    -- Play ambient sound
    inst.SoundEmitter:PlaySound("dontstarve/common/meteor_shower", "meteor_shower")
    
    -- Auto-remove after some time
    inst:DoTaskInTime(60 + math.random() * 60, function()
        inst:Remove()
    end)
    
    inst.persists = false
    
    return inst
end

return Prefab("meteor_shower", fn)
```

## Client-Server Weather Synchronization

For multiplayer compatibility, ensure weather effects are properly synchronized:

```lua
-- In modmain.lua
-- Define network variables
AddModRPCHandler("CustomWeather", "SyncWeather", function(player, weather_type, intensity)
    -- Server received weather sync request
    if TheWorld.ismastersim then
        -- Broadcast to all clients
        for _, p in ipairs(AllPlayers) do
            if p ~= player then
                SendModRPCToClient(GetClientModRPC("CustomWeather", "ApplyWeather"), p.userid, weather_type, intensity)
            end
        end
        
        -- Apply weather on server
        local weather = SpawnPrefab(weather_type)
        if weather ~= nil and weather.components.precipitation ~= nil then
            weather.components.precipitation:SetLevel(intensity)
        end
    end
end)

AddModRPCHandler("CustomWeather", "ApplyWeather", function(player, weather_type, intensity)
    -- Client received weather sync
    if not TheWorld.ismastersim then
        local weather = SpawnPrefab(weather_type)
        if weather ~= nil and weather.components.precipitation ~= nil then
            weather.components.precipitation:SetLevel(intensity)
        end
    end
end)

-- Weather controller with network sync
AddPrefabPostInit("custom_weather_controller", function(inst)
    if TheWorld.ismastersim then
        -- Add method to sync weather
        inst.SyncWeatherToClients = function(weather_type, intensity)
            for _, player in ipairs(AllPlayers) do
                SendModRPCToClient(GetClientModRPC("CustomWeather", "ApplyWeather"), player.userid, weather_type, intensity)
            end
        end
        
        -- Use this method when changing weather
        local old_start_rain = inst.StartRain
        inst.StartRain = function(inst)
            old_start_rain(inst)
            inst:SyncWeatherToClients("colored_rain", 1)
        end
    end
end)
```

## Weather Particle Systems

For custom weather particles:

```lua
-- In scripts/prefabs/leaf_storm.lua
local function fn()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddNetwork()
    
    -- Add particle emitter
    inst:AddComponent("particleemitter")
    inst.components.particleemitter:SetParticleTexture("fx/leaf.tex")
    inst.components.particleemitter:SetSpawnRate(20)
    inst.components.particleemitter:SetMaxLifetime(5)
    inst.components.particleemitter:SetMaxParticles(100)
    inst.components.particleemitter:SetRotationStatus(true)
    inst.components.particleemitter:SetColourEnvelope(
        Colour(1, 1, 1, 0.5),  -- Start color
        Colour(1, 1, 1, 0)     -- End color
    )
    inst.components.particleemitter:SetScaleEnvelope(
        Vector3(0.5, 0.5, 0.5),  -- Start scale
        Vector3(0.2, 0.2, 0.2)   -- End scale
    )
    inst.components.particleemitter:SetAcceleration(Vector3(1, -0.1, 1))  -- Wind direction
    inst.components.particleemitter:SetSortOrder(3)
    inst.components.particleemitter:EnableDepthTest(true)
    inst.components.particleemitter:Start()
    
    inst:AddTag("FX")
    inst:AddTag("NOCLICK")
    
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    inst.persists = false
    
    return inst
end

return Prefab("leaf_storm", fn)
```

## Best Practices

1. **Performance**: Weather effects can be resource-intensive. Use particle systems efficiently and consider reducing effects for players with lower-end hardware.

2. **Multiplayer Compatibility**: Always synchronize weather effects between server and clients using network variables or RPCs.

3. **Seasonal Integration**: Make your weather effects respond to the game's seasons for a more integrated experience.

4. **Biome Specificity**: Consider making weather effects specific to certain biomes for more variety.

5. **Gameplay Impact**: Balance any gameplay effects from weather to ensure they're challenging but not frustrating.

6. **Sound Design**: Include appropriate sound effects to enhance immersion.

7. **Visual Clarity**: Ensure weather effects don't obscure important gameplay elements or make the game unplayable.

## Troubleshooting

### Common Issues

1. **Weather not appearing**: Check that your prefabs are properly registered and spawned.

2. **Client-server desync**: Ensure you're properly synchronizing weather states between server and clients.

3. **Performance issues**: Reduce particle count or effect complexity if players experience lag.

4. **Weather persisting after reload**: Make sure to set `inst.persists = false` for weather effect entities.

5. **Weather not responding to seasons**: Verify your season watchers are properly set up.

### Debugging Tips

```lua
-- Add debug commands to test weather
GLOBAL.TheInput:AddKeyDownHandler(GLOBAL.KEY_F9, function()
    if GLOBAL.TheWorld.ismastersim then
        print("Spawning test weather")
        local weather = SpawnPrefab("colored_rain")
        if weather ~= nil and weather.components.precipitation ~= nil then
            weather.components.precipitation:SetLevel(1)
        end
    end
end)
```

## Conclusion

Creating custom weather effects allows you to add unique atmosphere and gameplay elements to your Don't Starve Together mods. By combining visual effects, sounds, and gameplay impacts, you can create immersive weather systems that enhance the player experience.

For more advanced weather integration, consider combining these techniques with custom biomes or seasons to create a fully realized environmental experience.

See also:
- [Custom Biomes](custom-biomes.md) - For creating custom environments
- [Custom World Generation](custom-world-generation.md) - For integrating weather with world generation
- [Particle Effects](../core/particle-effects.md) - For more details on particle systems
- [Network Bandwidth Optimization](../core/network-bandwidth-optimization.md) - For optimizing networked weather effects
