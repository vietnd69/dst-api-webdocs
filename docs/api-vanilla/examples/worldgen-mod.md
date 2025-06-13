---
id: worldgen-mod
title: World Generation
sidebar_position: 8
---

# Modifying World Generation

This tutorial walks through the process of modifying world generation in Don't Starve Together. We'll create a mod that adds a custom biome and modifies the world layout.

## Project Overview

We'll create a mod that:
- Adds a new "Crystal Plains" biome with unique features
- Modifies the world generation parameters
- Adds custom decorations and set pieces to the world
- Ensures compatibility with existing world generation

## Step 1: Set Up the Mod Structure

Create these folders and files:

```
worldgen_mod/
├── modinfo.lua
├── modmain.lua
├── scripts/
│   ├── map/
│   │   ├── rooms/
│   │   │   └── crystal_plains.lua
│   │   └── tasks/
│   │       └── crystal_plains_task.lua
│   └── prefabs/
│       ├── crystal_formation.lua
│       └── crystal_turf.lua
└── anim/
    └── crystal_formations.zip
```

## Step 2: Create the modinfo.lua File

```lua
name = "Crystal Plains Biome"
description = "Adds a new Crystal Plains biome to the world"
author = "Your Name"
version = "1.0.0"

-- Compatible with Don't Starve Together
dst_compatible = true

-- Not compatible with Don't Starve
dont_starve_compatible = false
reign_of_giants_compatible = false

-- This mod is required on the server
all_clients_require_mod = true

-- This mod is not a client-only mod
client_only_mod = false

-- Icon displayed in the server list
icon_atlas = "modicon.xml"
icon = "modicon.tex"

-- Tags that describe your mod
server_filter_tags = {
    "world generation",
    "biome"
}

-- Configuration options
configuration_options = {
    {
        name = "biome_size",
        label = "Biome Size",
        options = {
            {description = "Small", data = "small"},
            {description = "Medium", data = "medium"},
            {description = "Large", data = "large"}
        },
        default = "medium"
    },
    {
        name = "crystal_density",
        label = "Crystal Density",
        options = {
            {description = "Low", data = 1},
            {description = "Medium", data = 2},
            {description = "High", data = 3}
        },
        default = 2
    },
    {
        name = "biome_placement",
        label = "Biome Placement",
        options = {
            {description = "Near Center", data = "center"},
            {description = "Near Edge", data = "edge"},
            {description = "Random", data = "random"}
        },
        default = "random"
    }
}
```

## Step 3: Create the Crystal Turf Prefab

Create `scripts/prefabs/crystal_turf.lua`:

```lua
local assets = {
    Asset("ANIM", "anim/crystal_turf.zip"),
}

-- Function to create a custom turf tile
local function MakeTurf(name)
    local function fn()
        local inst = CreateEntity()

        inst.entity:AddTransform()
        inst.entity:AddAnimState()
        inst.entity:AddNetwork()

        inst.AnimState:SetBank("turf")
        inst.AnimState:SetBuild("crystal_turf")
        inst.AnimState:PlayAnimation("crystal_turf")

        inst:AddTag("groundtile")
        inst:AddTag("molebait")

        inst.entity:SetPristine()
        if not TheWorld.ismastersim then
            return inst
        end

        inst:AddComponent("inventoryitem")
        inst.components.inventoryitem.atlasname = "images/inventoryimages/turf_crystal.xml"
        inst.components.inventoryitem.imagename = "turf_crystal"

        inst:AddComponent("stackable")
        inst.components.stackable.maxsize = TUNING.STACK_SIZE_LARGEITEM

        inst:AddComponent("fuel")
        inst.components.fuel.fuelvalue = TUNING.LARGE_FUEL
        
        inst:AddComponent("inspectable")

        inst:AddComponent("terraformer")
        inst.components.terraformer.tile = "CRYSTALPLAINS"
        inst.components.terraformer.tile_effect = "crystal_sparkle"
        
        MakeHauntableLaunch(inst)

        return inst
    end

    return Prefab("turf_" .. name, fn, assets)
end

-- Create the crystal turf
return MakeTurf("crystal")
```

## Step 4: Create the Crystal Formation Prefab

Create `scripts/prefabs/crystal_formation.lua`:

```lua
local assets = {
    Asset("ANIM", "anim/crystal_formations.zip"),
}

local prefabs = {
    "bluegem",
    "purplegem",
    "redgem",
}

-- Crystal colors and their corresponding gems
local crystal_types = {
    blue = {
        anim = "blue",
        loot = "bluegem",
        fx = "crystalshatter_blue",
    },
    purple = {
        anim = "purple",
        loot = "purplegem",
        fx = "crystalshatter_purple",
    },
    red = {
        anim = "red",
        loot = "redgem",
        fx = "crystalshatter_red",
    },
}

-- Function to create a crystal formation
local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddMiniMapEntity()
    inst.entity:AddNetwork()

    MakeObstaclePhysics(inst, .5)

    inst.MiniMapEntity:SetIcon("crystal_formation.tex")

    inst.AnimState:SetBank("crystal_formations")
    inst.AnimState:SetBuild("crystal_formations")

    -- Randomly select a crystal type
    local crystal_type = weighted_random_choice({
        blue = 0.5,
        purple = 0.3,
        red = 0.2,
    })
    
    inst.crystal_type = crystal_type
    inst.AnimState:PlayAnimation(crystal_types[crystal_type].anim)

    inst:AddTag("crystal")
    inst:AddTag("structure")

    inst.entity:SetPristine()
    if not TheWorld.ismastersim then
        return inst
    end

    -- Add workable component to allow mining
    inst:AddComponent("workable")
    inst.components.workable:SetWorkAction(ACTIONS.MINE)
    inst.components.workable:SetWorkLeft(TUNING.ROCKS_MINE)
    inst.components.workable:SetOnFinishCallback(function(inst, worker)
        -- Play break sound
        inst.SoundEmitter:PlaySound("dontstarve/common/destroy_stone")
        
        -- Spawn loot
        local loot = crystal_types[inst.crystal_type].loot
        local num_gems = math.random(1, 3)
        for i = 1, num_gems do
            local gem = SpawnPrefab(loot)
            if gem then
                local x, y, z = inst.Transform:GetWorldPosition()
                local angle = math.random() * 2 * PI
                local speed = 1 + math.random()
                local g = 9.8
                local px = x + math.cos(angle) * 0.2
                local pz = z + math.sin(angle) * 0.2
                
                gem.Physics:Teleport(px, 0.5, pz)
                gem.Physics:SetVel(speed * math.cos(angle), speed * 4, speed * math.sin(angle))
            end
        end
        
        -- Spawn break effect
        local fx = SpawnPrefab(crystal_types[inst.crystal_type].fx)
        if fx then
            fx.Transform:SetPosition(inst.Transform:GetWorldPosition())
        end
        
        -- Remove the crystal
        inst:Remove()
    end)

    -- Add light component for a subtle glow
    inst:AddComponent("lighttweener")
    local light_color = {
        blue = {0.2, 0.4, 0.8},
        purple = {0.6, 0.2, 0.8},
        red = {0.8, 0.2, 0.2},
    }
    local r, g, b = unpack(light_color[crystal_type])
    inst.components.lighttweener:StartTween(
        inst.entity:AddLight(), 
        0, 2, 0.5, {r, g, b}, 
        0, 
        function() 
            -- After the light is added, make it flicker slightly
            inst:DoPeriodicTask(0.3 + math.random() * 0.5, function()
                local intensity = 0.5 + math.random() * 0.2
                inst.Light:SetIntensity(intensity)
            end)
        end
    )
    
    -- Add inspectable component
    inst:AddComponent("inspectable")
    
    -- Add lootdropper component
    inst:AddComponent("lootdropper")
    
    return inst
end

return Prefab("crystal_formation", fn, assets, prefabs)
```

## Step 5: Create the Room Definition

Create `scripts/map/rooms/crystal_plains.lua`:

```lua
-- Import required modules
require "map/room_functions"

-- Define the room
local rooms = {}

-- Open area with crystal formations
rooms.CrystalPlains = function(prefab)
    local ground = WORLD_TILES.ROCKY
    local new_ground = "CRYSTALPLAINS"  -- Our custom tile
    
    -- Get crystal density from mod config
    local crystal_density = GetModConfigData("crystal_density") or 2
    
    -- Define the room contents
    local contents = {
        countstaticlayouts = {
            ["CrystalFormationLarge"] = function() return 1 + crystal_density end,
            ["CrystalFormationSmall"] = function() return 2 + crystal_density * 2 end,
        },
        countprefabs = {
            crystal_formation = function() return 5 + crystal_density * 3 end,
            rock1 = function() return 3 end,
            flint = function() return 3 end,
            blue_mushroom = function() return 1 end,
        },
    }
    
    -- Create the room
    return {
        type = "rocky",
        tags = {"ExitPiece", "Crystal"},
        contents = contents,
        ground_types = {new_ground, ground},
        ground_distribution = {
            [new_ground] = 9,
            [ground] = 1,
        },
        colour = {r = 0.3, g = 0.4, b = 0.8},
    }
end

-- Crystal formation set pieces
rooms.CrystalFormationLarge = StaticLayout.Get("map/static_layouts/crystal_formation_large")
rooms.CrystalFormationSmall = StaticLayout.Get("map/static_layouts/crystal_formation_small")

return rooms
```

## Step 6: Create the Task Definition

Create `scripts/map/tasks/crystal_plains_task.lua`:

```lua
-- Import required modules
require "map/room_functions"

-- Define the task
local tasks = {}

-- Get biome size from mod config
local biome_size = GetModConfigData("biome_size") or "medium"

-- Define size parameters based on config
local size_params = {
    small = {
        hub_room_count = 2,
        edge_room_count = 3,
    },
    medium = {
        hub_room_count = 3,
        edge_room_count = 5,
    },
    large = {
        hub_room_count = 5,
        edge_room_count = 8,
    },
}

-- Get the size parameters
local params = size_params[biome_size]

-- Create the Crystal Plains task
tasks.crystal_plains = {
    locks = {LOCKS.NONE},
    keys_given = {KEYS.TIER1},
    room_choices = {
        ["CrystalPlains"] = params.hub_room_count,
        ["Rocky"] = params.edge_room_count,
    },
    room_bg = WORLD_TILES.ROCKY,
    background_room = "BGRocky",
    colour = {r = 0.3, g = 0.4, b = 0.8},
}

return tasks
```

## Step 7: Create the modmain.lua File

```lua
-- Import globals into the environment
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Add asset files
Assets = {
    -- Crystal turf
    Asset("ANIM", "anim/crystal_turf.zip"),
    
    -- Crystal formations
    Asset("ANIM", "anim/crystal_formations.zip"),
}

-- Register prefabs
PrefabFiles = {
    "crystal_turf",
    "crystal_formation",
}

-- Add custom strings
STRINGS.NAMES.TURF_CRYSTAL = "Crystal Turf"
STRINGS.RECIPE_DESC.TURF_CRYSTAL = "Sparkly ground from the Crystal Plains."
STRINGS.CHARACTERS.GENERIC.DESCRIBE.TURF_CRYSTAL = "It's sparkly and cold."

STRINGS.NAMES.CRYSTAL_FORMATION = "Crystal Formation"
STRINGS.CHARACTERS.GENERIC.DESCRIBE.CRYSTAL_FORMATION = "It's beautiful and full of gems."

-- Add custom tile
local GROUND_CRYSTAL = "CRYSTALPLAINS"
GLOBAL.GROUND_NAMES[GROUND_CRYSTAL] = "crystal_plains"
GLOBAL.GROUND_TILES[GROUND_CRYSTAL] = #GLOBAL.GROUND_NAMES
GLOBAL.GROUND_PROPERTIES[GROUND_CRYSTAL] = {
    name = "crystal_plains",
    noise_texture = "levels/textures/crystal_noise.tex",
    damage_per_second = 0,
    walk_speed = 1.0,
    is_ground = true,
}

-- Add custom turf recipe
AddRecipe("turf_crystal", 
    {Ingredient("rocks", 1), Ingredient("bluegem", 1)}, 
    GLOBAL.RECIPETABS.REFINE, 
    GLOBAL.TECH.SCIENCE_ONE, 
    nil, nil, nil, nil, nil, 
    "images/inventoryimages/turf_crystal.xml")

-- Add custom tile assets
AddGameAsset("levels/tiles/crystal_plains.tex")
AddGameAsset("levels/textures/crystal_noise.tex")
AddGameAsset("minimap/crystal_plains.tex")

-- Add custom minimap icon
AddMinimapAtlas("minimap/crystal_formation.xml")

-- Add custom room and task
AddRoomPreInit("CrystalPlains", function(room)
    -- This will be called when the room is initialized
end)

-- Add the custom biome to world generation
AddLevelPreInit("SURVIVAL_TOGETHER", function(level)
    -- Get biome placement from mod config
    local biome_placement = GetModConfigData("biome_placement") or "random"
    
    -- Add our custom task
    if level.tasks then
        table.insert(level.tasks, "crystal_plains")
    end
    
    -- Add our custom room
    if level.rooms then
        table.insert(level.rooms, "CrystalPlains")
    end
    
    -- Modify task layout based on placement preference
    if level.task_set and level.task_set == "default" then
        if biome_placement == "center" then
            -- Place near center by adding to the second ring
            if level.ordered_story_setpieces then
                table.insert(level.ordered_story_setpieces, {"CrystalFormationLarge", "Day 10"})
            end
        elseif biome_placement == "edge" then
            -- Place near edge by adding to the last tasks
            if level.ordered_story_setpieces then
                table.insert(level.ordered_story_setpieces, {"CrystalFormationLarge", "Day 25"})
            end
        else
            -- Random placement (default)
            if level.random_set_pieces then
                table.insert(level.random_set_pieces, "CrystalFormationLarge")
                table.insert(level.random_set_pieces, "CrystalFormationSmall")
            end
        end
    end
end)

-- Add custom world generation setpieces
AddTask("crystal_plains", require("map/tasks/crystal_plains_task").crystal_plains)
AddRoom("CrystalPlains", require("map/rooms/crystal_plains").CrystalPlains)
AddRoom("CrystalFormationLarge", require("map/rooms/crystal_plains").CrystalFormationLarge)
AddRoom("CrystalFormationSmall", require("map/rooms/crystal_plains").CrystalFormationSmall)

-- Add custom effects for the crystal turf
local function OnIsDay(inst, isday)
    if not isday then
        -- At night, make crystals glow more
        for _, v in ipairs(GLOBAL.TheSim:FindEntities(0, 0, 0, 10000, {"crystal"})) do
            if v.Light then
                v.Light:SetIntensity(0.8)
                v.Light:SetRadius(3)
            end
        end
    else
        -- During day, reduce glow
        for _, v in ipairs(GLOBAL.TheSim:FindEntities(0, 0, 0, 10000, {"crystal"})) do
            if v.Light then
                v.Light:SetIntensity(0.5)
                v.Light:SetRadius(2)
            end
        end
    end
end

-- Add day/night effects for crystals
AddPrefabPostInit("world", function(inst)
    if GLOBAL.TheWorld.ismastersim then
        inst:WatchWorldState("isday", OnIsDay)
    end
end)
```

## Step 8: Create Static Layouts

For a complete mod, you'll need to create static layout files for your crystal formations:

1. Create `map/static_layouts/crystal_formation_large.lua`:
```lua
return {
  version = "1.1",
  luaversion = "5.1",
  orientation = "orthogonal",
  width = 16,
  height = 16,
  tilewidth = 16,
  tileheight = 16,
  properties = {},
  tilesets = {
    {
      name = "tiles",
      firstgid = 1,
      tilewidth = 64,
      tileheight = 64,
      spacing = 0,
      margin = 0,
      image = "../../../../tools/tiled/dont_starve/tiles.png",
      imagewidth = 512,
      imageheight = 384,
      properties = {}
    }
  },
  layers = {
    {
      type = "tilelayer",
      name = "BG_TILES",
      x = 0,
      y = 0,
      width = 16,
      height = 16,
      visible = true,
      opacity = 1,
      properties = {},
      encoding = "lua",
      data = {}
    },
    {
      type = "objectgroup",
      name = "FG_OBJECTS",
      visible = true,
      opacity = 1,
      properties = {},
      objects = {
        {
          name = "crystal_formation",
          type = "crystal_formation",
          shape = "rectangle",
          x = 128,
          y = 128,
          width = 0,
          height = 0,
          visible = true,
          properties = {}
        },
        {
          name = "crystal_formation",
          type = "crystal_formation",
          shape = "rectangle",
          x = 96,
          y = 160,
          width = 0,
          height = 0,
          visible = true,
          properties = {}
        },
        {
          name = "crystal_formation",
          type = "crystal_formation",
          shape = "rectangle",
          x = 160,
          y = 96,
          width = 0,
          height = 0,
          visible = true,
          properties = {}
        },
        {
          name = "bluegem",
          type = "bluegem",
          shape = "rectangle",
          x = 128,
          y = 96,
          width = 0,
          height = 0,
          visible = true,
          properties = {}
        }
      }
    }
  }
}
```

2. Create `map/static_layouts/crystal_formation_small.lua`:
```lua
return {
  version = "1.1",
  luaversion = "5.1",
  orientation = "orthogonal",
  width = 8,
  height = 8,
  tilewidth = 16,
  tileheight = 16,
  properties = {},
  tilesets = {
    {
      name = "tiles",
      firstgid = 1,
      tilewidth = 64,
      tileheight = 64,
      spacing = 0,
      margin = 0,
      image = "../../../../tools/tiled/dont_starve/tiles.png",
      imagewidth = 512,
      imageheight = 384,
      properties = {}
    }
  },
  layers = {
    {
      type = "tilelayer",
      name = "BG_TILES",
      x = 0,
      y = 0,
      width = 8,
      height = 8,
      visible = true,
      opacity = 1,
      properties = {},
      encoding = "lua",
      data = {}
    },
    {
      type = "objectgroup",
      name = "FG_OBJECTS",
      visible = true,
      opacity = 1,
      properties = {},
      objects = {
        {
          name = "crystal_formation",
          type = "crystal_formation",
          shape = "rectangle",
          x = 64,
          y = 64,
          width = 0,
          height = 0,
          visible = true,
          properties = {}
        },
        {
          name = "bluegem",
          type = "bluegem",
          shape = "rectangle",
          x = 80,
          y = 48,
          width = 0,
          height = 0,
          visible = true,
          properties = {}
        }
      }
    }
  }
}
```

## Step 9: Create Texture Assets

For a complete mod, you'll need to create these texture files:

1. **Crystal Turf**: Create textures for the new ground tile
   - `levels/tiles/crystal_plains.tex`
   - `levels/textures/crystal_noise.tex`
   - `minimap/crystal_plains.tex`

2. **Crystal Formation**: Create textures for the crystal formations
   - `anim/crystal_formations.zip` with animations for different crystal types
   - `minimap/crystal_formation.tex` for minimap icon

## Step 10: Testing Your World Generation Mod

1. Launch Don't Starve Together
2. Enable your mod in the Mods menu
3. Create a new world
4. Explore to find your Crystal Plains biome
5. Test the features:
   - Check that the custom turf appears correctly
   - Mine crystal formations to get gems
   - Verify that crystals glow brighter at night

## Understanding World Generation

Don't Starve Together's world generation system is built on several key components:

### Tiles

Tiles are the basic ground types in the world. Each tile has:
- A unique ID and name
- Visual appearance (texture)
- Properties (walk speed, damage, etc.)

### Rooms

Rooms are areas with specific contents and ground types:
- Define what prefabs spawn in the area
- Specify the distribution of ground tiles
- Can include static layouts (predefined object arrangements)

### Tasks

Tasks are collections of rooms that form a gameplay area:
- Define what rooms appear and how many
- Specify locks and keys for progression
- Control the overall layout of the world

### Level

The level is the complete world definition:
- Combines multiple tasks into a complete world
- Defines the overall world shape and size
- Controls story setpieces and random setpieces

## Customization Options

Here are some ways to enhance your world generation mod:

### Add Season-Specific Features

```lua
-- In modmain.lua, add seasonal changes
AddPrefabPostInit("world", function(inst)
    if GLOBAL.TheWorld.ismastersim then
        inst:WatchWorldState("season", function(inst, season)
            if season == "winter" then
                -- Enhance crystals in winter
                for _, v in ipairs(GLOBAL.TheSim:FindEntities(0, 0, 0, 10000, {"crystal"})) do
                    if v.Light then
                        v.Light:SetIntensity(1.0)
                        v.Light:SetRadius(4)
                    end
                end
            elseif season == "summer" then
                -- Dim crystals in summer
                for _, v in ipairs(GLOBAL.TheSim:FindEntities(0, 0, 0, 10000, {"crystal"})) do
                    if v.Light then
                        v.Light:SetIntensity(0.3)
                        v.Light:SetRadius(1.5)
                    end
                end
            end
        end)
    end
end)
```

### Add Unique Creatures

Create a crystal elemental that spawns in your biome:

```lua
-- In a new prefab file crystal_elemental.lua
local assets = {
    Asset("ANIM", "anim/crystal_elemental.zip"),
}

local function fn()
    local inst = CreateEntity()
    
    -- [Standard entity setup code...]
    
    -- Make it a monster
    inst:AddComponent("combat")
    inst.components.combat:SetDefaultDamage(20)
    
    -- Make it drop gems when killed
    inst:AddComponent("lootdropper")
    inst.components.lootdropper:AddRandomLoot("bluegem", 0.5)
    inst.components.lootdropper:AddRandomLoot("purplegem", 0.3)
    inst.components.lootdropper:AddRandomLoot("redgem", 0.2)
    
    -- Only spawn in crystal biome
    inst:AddComponent("periodicspawner")
    inst.components.periodicspawner:SetPrefab("crystal_shard")
    inst.components.periodicspawner:SetRandomTimes(40, 60)
    inst.components.periodicspawner:Start()
    
    return inst
end

return Prefab("crystal_elemental", fn, assets)
```

### Add Weather Effects

Create a special weather effect for your biome:

```lua
-- In modmain.lua, add custom weather
AddPrefabPostInit("world", function(inst)
    if GLOBAL.TheWorld.ismastersim then
        -- Add crystal shower weather
        inst:DoPeriodicTask(60, function()
            -- Check if player is in crystal biome
            local player = GLOBAL.ThePlayer
            if player and player:GetCurrentTileType() == GLOBAL.GROUND_TILES[GROUND_CRYSTAL] then
                -- Start crystal shower
                local fx = SpawnPrefab("crystal_shower_fx")
                if fx then
                    fx.Transform:SetPosition(player.Transform:GetWorldPosition())
                    
                    -- Spawn crystal shards during the shower
                    player:DoPeriodicTask(5, function()
                        local x, y, z = player.Transform:GetWorldPosition()
                        local angle = math.random() * 2 * PI
                        local dist = 5 + math.random() * 10
                        local shard = SpawnPrefab("crystal_shard")
                        if shard then
                            shard.Transform:SetPosition(
                                x + math.cos(angle) * dist,
                                0,
                                z + math.sin(angle) * dist
                            )
                        end
                    end, 0, 5) -- 5 times, every 5 seconds
                end
            end
        end)
    end
end)
```

### Add Special Resources

Create a unique resource that only spawns in your biome:

```lua
-- In a new prefab file crystal_shard.lua
local assets = {
    Asset("ANIM", "anim/crystal_shard.zip"),
}

local function fn()
    local inst = CreateEntity()
    
    -- [Standard entity setup code...]
    
    -- Make it pickable
    inst:AddComponent("inventoryitem")
    
    -- Add special crafting ingredient tag
    inst:AddTag("molebait")
    inst:AddTag("crystal_crafting")
    
    -- Make it usable as fuel with special effects
    inst:AddComponent("fuel")
    inst.components.fuel.fuelvalue = TUNING.MED_FUEL
    inst.components.fuel.fueltype = "CRYSTAL"
    
    return inst
end

return Prefab("crystal_shard", fn, assets)
```

## Common Issues and Solutions

### Problem: Biome not appearing in world
**Solution**: Check that you've properly added your task to the level definition and that the task references valid rooms

### Problem: Custom tile showing as default ground
**Solution**: Verify that you've correctly added all tile assets and registered the ground type

### Problem: Objects not spawning in the biome
**Solution**: Check your room definition to ensure the object counts and distribution are correct

### Problem: Setpieces not appearing
**Solution**: Verify that your static layout files are correctly formatted and referenced

### Problem: Compatibility with other mods
**Solution**: Use AddLevelPreInitAny instead of targeting specific level types:

```lua
-- Make your mod compatible with custom worldgen mods
AddLevelPreInitAny(function(level)
    if level.tasks then
        table.insert(level.tasks, "crystal_plains")
    end
    
    if level.rooms then
        table.insert(level.rooms, "CrystalPlains")
    end
end)
```

## Next Steps

Now that you've created a custom biome, you can:

1. **Add More Features**: Create additional objects and creatures for your biome
2. **Improve Integration**: Add special effects when players enter or leave your biome
3. **Create Unique Resources**: Add resources that can only be found in your biome
4. **Add Special Events**: Create events that only happen in your biome

For more advanced world generation, check out the [World Generation](../world/worldgen.md) documentation to learn about the full capabilities of the world generation system. 