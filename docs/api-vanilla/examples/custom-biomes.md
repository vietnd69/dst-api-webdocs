---
id: custom-biomes
title: Creating Custom Biomes
sidebar_position: 12
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Creating Custom Biomes

This guide focuses specifically on creating custom biomes in Don't Starve Together. While custom biomes are part of world generation, they have unique requirements and considerations that deserve special attention.

## What Makes a Biome?

A biome in Don't Starve Together consists of several key elements:

1. **Ground Type**: The unique terrain texture and properties
2. **Vegetation**: Trees, plants, and other flora specific to the biome
3. **Resources**: Rocks, minerals, and harvestable items
4. **Creatures**: Animals and monsters that inhabit the biome
5. **Weather Effects**: Special weather conditions that occur in the biome
6. **Visual Effects**: Lighting, particles, and other visual elements

## Ground Type Creation

The foundation of any biome is its ground type. Here's how to create a custom ground type:

```lua
-- In modmain.lua
local GROUND = GLOBAL.GROUND
local GROUND_NAMES = GLOBAL.STRINGS.NAMES.GROUND
local GROUND_TILES = GLOBAL.GROUND_TILES

-- Register new ground type
GROUND.MYBIOME = #GROUND_TILES + 1
GROUND_NAMES.MYBIOME = "My Custom Biome"
GROUND_TILES[GROUND.MYBIOME] = "mybiome"

-- Add the ground assets
AddGamePostInit(function()
    local GroundAtlas = GLOBAL.resolvefilepath("levels/textures/ground_noise.xml")
    local GroundImage = GLOBAL.resolvefilepath("levels/textures/ground_noise.tex")
    
    -- Add our custom ground
    GLOBAL.TheWorld.components.groundcreep:AddGroundDef(
        GROUND.MYBIOME,
        GroundAtlas,
        GroundImage,
        "levels/textures/mybiome_noise.tex",
        "mybiome"
    )
end)

-- Set ground properties
AddSimPostInit(function()
    for k, v in pairs(GLOBAL.GROUND_FLOORING) do
        if v == GROUND.MYBIOME then
            -- Fertility affects plant growth
            GLOBAL.SetGroundFertility(v, 0.3)
            
            -- Ground class affects sound and visual effects
            GLOBAL.SetGroundClass(v, "forest")
            
            -- Speed multiplier affects movement speed
            GLOBAL.SetGroundSpeedMultiplier(v, 1.0)
        end
    end
end)
```

### Ground Texture Requirements

For a complete custom ground, you'll need to create these texture files:

1. `levels/tiles/mybiome.tex` - The base texture for the ground
2. `levels/textures/mybiome_noise.tex` - The noise texture for variation
3. `minimap/mybiome.tex` - The minimap representation

### Ground Properties

Ground properties affect how the biome behaves:

| Property | Description | Common Values |
|----------|-------------|---------------|
| Fertility | Affects plant growth rate | 0.0 (barren) to 1.0 (fertile) |
| Ground Class | Affects sounds and effects | "forest", "rocky", "savanna", "marsh" |
| Speed Multiplier | Affects movement speed | 0.8 (slow) to 1.2 (fast) |
| Damage Per Second | Damage dealt to players | 0 (safe) to 10+ (dangerous) |

## Biome Room Creation

Once you have your ground type, you need to create rooms that use it:

```lua
-- In scripts/map/rooms/mybiome.lua
AddRoom("MyBiome_Clearing", {
    colour = {r=0.5, g=0.6, b=0.5, a=0.3},
    value = WORLD_TILES.MYBIOME,
    tags = {"ExitPiece", "MyBiome"},
    contents = {
        distributepercent = 0.15,
        distributeprefabs = {
            custom_tree = 0.3,
            custom_rock = 0.2,
            grass = 0.1,
            sapling = 0.1,
            flower = 0.05,
            flint = 0.05,
            custom_creature = 0.01,
        }
    }
})

AddRoom("MyBiome_Dense", {
    colour = {r=0.4, g=0.5, b=0.4, a=0.3},
    value = WORLD_TILES.MYBIOME,
    tags = {"MyBiome"},
    contents = {
        distributepercent = 0.25,
        distributeprefabs = {
            custom_tree = 0.5,
            custom_rock = 0.3,
            grass = 0.05,
            sapling = 0.05,
            flint = 0.03,
            custom_creature = 0.02,
        }
    }
})

-- Background room for empty areas
AddRoom("BGMyBiome", {
    colour = {r=0.5, g=0.6, b=0.5, a=0.3},
    value = WORLD_TILES.MYBIOME,
    tags = {"MyBiome", "RoadPoison"},
    contents = {
        distributepercent = 0.07,
        distributeprefabs = {
            custom_tree = 0.1,
            custom_rock = 0.1,
            grass = 0.05,
            sapling = 0.05,
        }
    }
})
```

### Room Variations

Creating multiple room types for your biome adds variety:

1. **Clearings**: Open areas with sparse vegetation
2. **Dense Areas**: Heavily populated with trees and resources
3. **Special Areas**: Unique features like ponds, caves, or structures
4. **Background**: Default room type for empty areas

## Biome Task Creation

Tasks group rooms together to form a coherent biome area:

```lua
-- In scripts/map/tasks/mybiome_task.lua
AddTask("mybiome_task", {
    locks = {LOCKS.NONE},
    keys_given = {KEYS.TIER1},
    room_choices = {
        ["MyBiome_Clearing"] = 2,
        ["MyBiome_Dense"] = {2, 3},
        ["MyBiome_Special"] = 1,
    },
    room_bg = WORLD_TILES.MYBIOME,
    background_room = "BGMyBiome",
    colour = {r=0.5, g=0.6, b=0.5, a=0.9}
})
```

### Task Properties

Task properties control how your biome integrates with the world:

| Property | Description |
|----------|-------------|
| locks | Requirements to access this biome |
| keys_given | Resources or capabilities provided by this biome |
| room_choices | Rooms to include (with counts) |
| room_bg | Default terrain type |
| background_room | Room type for empty areas |

## Biome Integration

To add your biome to the world generation:

```lua
-- In modmain.lua
AddLevelPreInitAny(function(level)
    if level.location == "forest" then
        -- Add our task to the level
        table.insert(level.tasks, "mybiome_task")
        
        -- Control biome placement
        level.overrides = level.overrides or {}
        level.overrides.task_distribute = level.overrides.task_distribute or {}
        level.overrides.task_distribute.mybiome_task = 1.0 -- Normal weight
        
        -- Add special setpieces
        if level.random_set_pieces then
            table.insert(level.random_set_pieces, "MyBiomeSetpiece")
        end
    end
end)
```

### Biome Placement Strategies

Different strategies for placing your biome in the world:

1. **Random Placement**: Let the world generator decide (default)
2. **Edge Placement**: Force the biome to generate near the edge of the map
3. **Center Placement**: Force the biome to generate near the center
4. **Story Placement**: Use ordered_story_setpieces for specific day placement

```lua
-- For edge placement
level.overrides.task_distribute.mybiome_task = 0.5 -- Lower weight
level.ordered_story_setpieces = level.ordered_story_setpieces or {}
table.insert(level.ordered_story_setpieces, {"MyBiomeSetpiece", "Day 25"})

-- For center placement
level.overrides.task_distribute.mybiome_task = 1.5 -- Higher weight
level.ordered_story_setpieces = level.ordered_story_setpieces or {}
table.insert(level.ordered_story_setpieces, {"MyBiomeSetpiece", "Day 10"})
```

## Custom Vegetation

Creating unique vegetation for your biome:

```lua
-- In scripts/prefabs/custom_tree.lua
local function fn()
    local inst = CreateEntity()
    
    -- Standard entity setup
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()
    inst.entity:AddMiniMapEntity()
    
    -- Set minimap icon
    inst.MiniMapEntity:SetIcon("custom_tree.tex")
    
    -- Set physics
    MakeObstaclePhysics(inst, 0.25)
    
    -- Set animations
    inst.AnimState:SetBank("custom_tree")
    inst.AnimState:SetBuild("custom_tree")
    inst.AnimState:PlayAnimation("idle", true)
    
    -- Add tags
    inst:AddTag("tree")
    inst:AddTag("mybiome_object")
    inst:AddTag("workable")
    
    -- Server-only components
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add components
    inst:AddComponent("inspectable")
    
    inst:AddComponent("workable")
    inst.components.workable:SetWorkAction(ACTIONS.CHOP)
    inst.components.workable:SetWorkLeft(3)
    inst.components.workable:SetOnFinishCallback(OnChopDown)
    inst.components.workable:SetOnWorkCallback(OnChop)
    
    inst:AddComponent("lootdropper")
    inst.components.lootdropper:AddRandomLoot("custom_resource", 1.0)
    inst.components.lootdropper:AddRandomLoot("log", 0.5)
    
    return inst
end

return Prefab("custom_tree", fn, assets, prefabs)
```

### Vegetation Considerations

When creating vegetation:

1. **Visual Distinctiveness**: Make it visually distinct from existing vegetation
2. **Resource Balance**: Consider what resources it provides and their rarity
3. **Seasonal Changes**: Add seasonal variations if appropriate
4. **Special Effects**: Consider adding unique effects like light or particles

## Custom Resources

Resources unique to your biome:

```lua
-- In scripts/prefabs/custom_resource.lua
local function fn()
    local inst = CreateEntity()
    
    -- Standard entity setup
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Set physics
    MakeInventoryPhysics(inst)
    
    -- Set animations
    inst.AnimState:SetBank("custom_resource")
    inst.AnimState:SetBuild("custom_resource")
    inst.AnimState:PlayAnimation("idle")
    
    -- Add tags
    inst:AddTag("molebait")
    inst:AddTag("mybiome_resource")
    
    -- Server-only components
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add components
    inst:AddComponent("inspectable")
    
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.atlasname = "images/inventoryimages/custom_resource.xml"
    
    inst:AddComponent("stackable")
    inst.components.stackable.maxsize = 40
    
    -- Add unique properties
    inst:AddComponent("fuel")
    inst.components.fuel.fuelvalue = TUNING.MED_FUEL
    inst.components.fuel.fueltype = "CUSTOM"
    
    return inst
end

return Prefab("custom_resource", fn, assets, prefabs)
```

### Resource Integration

Make your resources useful:

1. **Crafting Recipes**: Add recipes that use your resources
2. **Fuel Properties**: Make them usable as fuel with special properties
3. **Food Values**: If edible, set appropriate food values
4. **Special Uses**: Add unique interactions with other game systems

## Custom Creatures

Adding unique creatures to your biome:

```lua
-- In scripts/prefabs/custom_creature.lua
local brain = require "brains/custom_creature_brain"

local function fn()
    local inst = CreateEntity()
    
    -- Standard entity setup
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddDynamicShadow()
    inst.entity:AddNetwork()
    
    -- Set physics
    MakeCharacterPhysics(inst, 100, 0.5)
    
    -- Set animations
    inst.AnimState:SetBank("custom_creature")
    inst.AnimState:SetBuild("custom_creature")
    inst.AnimState:PlayAnimation("idle", true)
    
    -- Add tags
    inst:AddTag("animal")
    inst:AddTag("mybiome_creature")
    
    -- Server-only components
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add components
    inst:AddComponent("inspectable")
    
    inst:AddComponent("health")
    inst.components.health:SetMaxHealth(100)
    
    inst:AddComponent("combat")
    inst.components.combat:SetDefaultDamage(10)
    inst.components.combat:SetAttackPeriod(2)
    
    inst:AddComponent("lootdropper")
    inst.components.lootdropper:AddRandomLoot("meat", 0.5)
    inst.components.lootdropper:AddRandomLoot("custom_resource", 1.0)
    
    inst:AddComponent("locomotor")
    inst.components.locomotor.walkspeed = 4
    inst.components.locomotor.runspeed = 7
    
    -- Set AI
    inst:SetStateGraph("SGcustom_creature")
    inst:SetBrain(brain)
    
    return inst
end

return Prefab("custom_creature", fn, assets, prefabs)
```

### Creature Considerations

When creating creatures:

1. **Ecological Role**: Consider how they fit into the biome ecosystem
2. **Difficulty Balance**: Balance their strength and aggression
3. **Unique Behaviors**: Add special behaviors that make them interesting
4. **Resource Drops**: Consider what resources they provide when killed

## Weather Effects

Adding special weather to your biome:

```lua
-- In modmain.lua
AddPrefabPostInit("world", function(inst)
    if GLOBAL.TheWorld.ismastersim then
        -- Check for players in the biome periodically
        inst:DoPeriodicTask(10, function()
            for _, player in ipairs(GLOBAL.AllPlayers) do
                local x, y, z = player.Transform:GetWorldPosition()
                local tile = GLOBAL.TheWorld.Map:GetTileAtPoint(x, y, z)
                
                if tile == GROUND.MYBIOME then
                    -- Player is in our biome, start special weather
                    StartSpecialWeather(player)
                end
            end
        end)
    end
end)

function StartSpecialWeather(player)
    -- Create weather effects
    local fx = SpawnPrefab("custom_weather_fx")
    if fx then
        fx.Transform:SetPosition(player.Transform:GetWorldPosition())
        
        -- Add gameplay effects
        player:DoPeriodicTask(5, function()
            -- For example, spawn resources or apply status effects
        end, 0, 5)
    end
end
```

### Weather Types

Different weather effects you can create:

1. **Precipitation**: Rain, snow, or custom particles
2. **Sky Effects**: Aurora, strange colors, or darkness
3. **Ground Effects**: Glowing ground, mist, or puddles
4. **Sound Effects**: Unique ambient sounds
5. **Gameplay Effects**: Status effects, resource spawning, or damage

## Visual Effects

Enhancing your biome with visual effects:

```lua
-- In modmain.lua
-- Add post-processing effects when in the biome
AddPlayerPostInit(function(player)
    -- Track current biome
    player.current_biome = nil
    
    -- Check biome periodically
    player:DoPeriodicTask(0.5, function()
        local x, y, z = player.Transform:GetWorldPosition()
        local tile = GLOBAL.TheWorld.Map:GetTileAtPoint(x, y, z)
        
        if tile == GROUND.MYBIOME and player.current_biome ~= "mybiome" then
            -- Player entered our biome
            player.current_biome = "mybiome"
            ApplyBiomeEffects(player, true)
        elseif tile ~= GROUND.MYBIOME and player.current_biome == "mybiome" then
            -- Player left our biome
            player.current_biome = nil
            ApplyBiomeEffects(player, false)
        end
    end)
end)

function ApplyBiomeEffects(player, entering)
    if entering then
        -- Apply visual effects when entering
        GLOBAL.TheWorld:PushEvent("screenflash", 0.5)
        
        -- Add ambient sounds
        player.SoundEmitter:PlaySound("dontstarve/common/specialbiome_ambience", "mybiome_ambience")
        
        -- Add screen overlay
        player.components.playervision:SetCustomCCTable({
            brightness = 0,
            contrast = 0.05,
            saturation = 0.2,
            tint = {x=0.9, y=1.0, z=1.1}
        })
    else
        -- Remove effects when leaving
        player.SoundEmitter:KillSound("mybiome_ambience")
        player.components.playervision:SetCustomCCTable(nil)
    end
end
```

### Visual Effect Types

Types of visual effects to consider:

1. **Lighting**: Custom light colors and intensities
2. **Particles**: Floating particles or ground effects
3. **Screen Effects**: Color correction or post-processing
4. **Sound Design**: Ambient sounds and music
5. **Animation**: Special animations for players or objects

## Testing and Debugging

Tips for testing your custom biome:

1. **Console Commands**: Use `c_regenerateworld()` to quickly regenerate the world
2. **Debug Mode**: Enable debug mode with `TheInput:EnableDebugToggle(true)`
3. **Map Reveal**: Use `minimap:ShowArea(0, 0, 0, 10000)` to reveal the map
4. **Teleportation**: Use `c_goto(x, y, z)` to teleport to specific coordinates
5. **Entity Search**: Use `c_findnext("mybiome_object")` to find your custom entities

### Common Issues

Solutions to common biome creation problems:

1. **Biome Not Generating**: Check task integration and room definitions
2. **Missing Textures**: Verify texture paths and formats
3. **Creature AI Issues**: Debug brain logic and state graphs
4. **Performance Problems**: Optimize weather and visual effects
5. **Compatibility Issues**: Ensure compatibility with other mods

## Advanced Techniques

For more complex biome creation:

### Biome Transitions

Creating smooth transitions between biomes:

```lua
-- In scripts/map/rooms/transition_rooms.lua
AddRoom("MyBiome_ForestTransition", {
    colour = {r=0.5, g=0.6, b=0.5, a=0.3},
    tags = {"ExitPiece", "MyBiome", "Forest"},
    contents = {
        distributepercent = 0.15,
        distributeprefabs = {
            custom_tree = 0.2,
            evergreen = 0.2,
            grass = 0.1,
            sapling = 0.1,
        }
    },
    ground_types = {WORLD_TILES.MYBIOME, WORLD_TILES.FOREST},
    ground_distribution = {
        [WORLD_TILES.MYBIOME] = 6,
        [WORLD_TILES.FOREST] = 4,
    },
})
```

### Seasonal Changes

Making your biome respond to seasons:

```lua
-- In modmain.lua
AddPrefabPostInit("world", function(inst)
    if GLOBAL.TheWorld.ismastersim then
        inst:WatchWorldState("season", function(inst, season)
            -- Update biome based on season
            UpdateBiomeForSeason(season)
        end)
    end
end)

function UpdateBiomeForSeason(season)
    -- Find all biome-specific objects
    local biome_objects = GLOBAL.TheSim:FindEntities(0, 0, 0, 10000, {"mybiome_object"})
    
    for _, obj in ipairs(biome_objects) do
        if season == "winter" then
            -- Winter appearance
            obj.AnimState:SetMultColor(0.8, 0.8, 1, 1)
        elseif season == "summer" then
            -- Summer appearance
            obj.AnimState:SetMultColor(1, 0.9, 0.8, 1)
        else
            -- Default appearance
            obj.AnimState:SetMultColor(1, 1, 1, 1)
        end
    end
end
```

### Interactive Elements

Adding interactive elements to your biome:

```lua
-- In scripts/prefabs/biome_portal.lua
local function fn()
    local inst = CreateEntity()
    
    -- Standard entity setup
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()
    
    -- Set animations
    inst.AnimState:SetBank("biome_portal")
    inst.AnimState:SetBuild("biome_portal")
    inst.AnimState:PlayAnimation("idle", true)
    
    -- Add tags
    inst:AddTag("structure")
    inst:AddTag("mybiome_object")
    
    -- Server-only components
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Add components
    inst:AddComponent("inspectable")
    
    -- Add interaction
    inst:AddComponent("activatable")
    inst.components.activatable.OnActivate = function(inst, doer)
        -- Teleport player to another location
        if doer and doer.Physics then
            -- Find destination
            local dest_x, dest_y, dest_z = FindTeleportDestination()
            if dest_x then
                doer.Physics:Teleport(dest_x, dest_y, dest_z)
                return true
            end
        end
        return false
    end
    
    return inst
end

return Prefab("biome_portal", fn, assets, prefabs)
```

## Conclusion

Creating a custom biome is one of the most comprehensive modding challenges in Don't Starve Together. It combines many aspects of modding:

- World generation
- Custom prefabs and components
- Visual and audio design
- Game mechanics and balancing

By following this guide, you should be able to create a unique biome that seamlessly integrates with the game world while providing players with new experiences and challenges.

For more detailed examples, check out the [Crystal Plains Biome](worldgen-mod.md) and [Crystal Forest Project](project-biome.md) tutorials. 
