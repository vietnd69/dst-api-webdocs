---
id: custom-world-generation
title: Custom World Generation
sidebar_position: 9
last_updated: 2023-07-06
---

# Custom World Generation

This guide provides a comprehensive overview of creating custom world generation in Don't Starve Together. You'll learn the fundamental concepts, approaches, and practical examples to create unique and engaging worlds for your mods.

## World Generation Fundamentals

Don't Starve Together's world generation system is built on several key components that work together to create the game world:

### Key Components

1. **Levels**: The overall world configuration (forest, caves, etc.)
2. **Tasks**: Gameplay areas with specific purposes (e.g., "Starting Area", "Resource Area")
3. **Rooms**: Specific areas with defined terrain and object distributions
4. **Tiles**: The basic ground types that make up the world
5. **Setpieces**: Pre-designed arrangements of objects

### World Generation Process

The world generation follows this sequence:

1. **Level Selection**: The game selects a level configuration based on the chosen preset
2. **Task Assignment**: Tasks are assigned to different regions of the map
3. **Room Placement**: Rooms are placed within tasks based on task requirements
4. **Terrain Generation**: Terrain is generated for each room
5. **Object Placement**: Objects are placed within rooms according to distribution rules
6. **Finalization**: Final adjustments are made, such as placing setpieces and connecting regions

## Creating a Custom World

To create a custom world generation, you'll need to:

1. Create custom rooms
2. Define custom tasks
3. Modify level definitions
4. Create custom ground types (optional)
5. Create custom setpieces (optional)

Let's walk through each step in detail.

## Step 1: Creating Custom Rooms

Rooms are the basic building blocks of world generation. Each room has a terrain type and a set of objects to spawn.

### Basic Room Structure

```lua
AddRoom("MyCustomRoom", {
    colour = {r=0.3, g=0.5, b=0.6, a=0.3},  -- Color on the minimap
    value = WORLD_TILES.GRASS,              -- Base terrain type
    tags = {"ExitPiece", "Chester_Eyebone"}, -- Tags for room selection
    contents = {
        distributepercent = 0.15,           -- Density of objects
        distributeprefabs = {               -- Objects to spawn
            evergreen = 3,
            grass = 0.5,
            sapling = 0.5,
            flint = 0.05,
            boulder = 0.01,
        },
    }
})
```

### Room Properties

- `colour`: Used for map visualization during development
- `value`: The base terrain type (from `WORLD_TILES` in `constants.lua`)
- `tags`: Special tags that affect room selection and object placement
- `contents`: Defines what objects appear in the room and their distribution

### Advanced Room Configuration

For more complex rooms, you can use additional properties:

```lua
AddRoom("ComplexRoom", {
    colour = {r=0.4, g=0.6, b=0.4, a=0.3},
    value = WORLD_TILES.FOREST,
    tags = {"ExitPiece", "Clearing"},
    contents = {
        countstaticlayout = {
            ["PigVillage"] = 1,  -- Include exactly one pig village
            ["Maxwell1"] = function() return math.random(0,1) end, -- Maybe include Maxwell statue
        },
        countprefabs = {
            pighouse = function() return 2 + math.random(2) end, -- 2-4 pighouses
        },
        distributepercent = 0.2,
        distributeprefabs = {
            evergreen = 3,
            grass = 0.5,
            sapling = 0.5,
            berrybush = 0.2,
            rock1 = 0.05,
            flint = 0.05,
        },
    }
})
```

### Mixed Terrain Types

You can create rooms with multiple terrain types:

```lua
AddRoom("MixedTerrainRoom", {
    colour = {r=0.4, g=0.5, b=0.5, a=0.3},
    tags = {"ExitPiece"},
    contents = {
        distributepercent = 0.15,
        distributeprefabs = {
            evergreen = 3,
            grass = 0.5,
            sapling = 0.5,
        },
    },
    ground_types = {WORLD_TILES.GRASS, WORLD_TILES.FOREST, WORLD_TILES.MARSH},
    ground_distribution = {
        [WORLD_TILES.GRASS] = 8,
        [WORLD_TILES.FOREST] = 4,
        [WORLD_TILES.MARSH] = 2,
    },
})
```

## Step 2: Creating Custom Tasks

Tasks are collections of rooms that fulfill a specific gameplay purpose.

### Basic Task Structure

```lua
AddTask("MyCustomTask", {
    locks = {LOCKS.TIER1},           -- Requirements to access this task
    keys_given = {KEYS.WOOD, KEYS.TIER2}, -- Resources/capabilities provided
    room_choices = {
        ["Forest"] = 2,              -- Include 2 Forest rooms
        ["BarePlain"] = 1,           -- Include 1 BarePlain room
        ["MyCustomRoom"] = 1         -- Include 1 of our custom rooms
    },
    room_bg = WORLD_TILES.GRASS,     -- Default terrain type
    background_room = "BGGrass",     -- Room type for empty areas
    colour = {r=0.2, g=0.6, b=0.2, a=1} -- Color on the map
})
```

### Task Properties

- `locks`: Requirements to access this task
- `keys_given`: Resources or capabilities provided by this task
- `room_choices`: Rooms to include (with counts)
- `room_bg`: Default terrain type
- `background_room`: Room type for empty areas

### Advanced Task Configuration

For more complex tasks, you can use additional properties:

```lua
AddTask("ComplexTask", {
    locks = {LOCKS.TIER2, LOCKS.ROCKS},
    keys_given = {KEYS.TIER3, KEYS.GOLD},
    room_choices = {
        ["Forest"] = {1, 3},         -- 1-3 Forest rooms
        ["DeepForest"] = {2, 3},     -- 2-3 DeepForest rooms
        ["Clearing"] = 1,            -- Exactly 1 Clearing
    },
    room_bg = WORLD_TILES.FOREST,
    background_room = "BGForest",
    colour = {r=0.1, g=0.4, b=0.1, a=1},
    substitutes = {"ComplexTask2"},  -- Alternate task if this one can't be placed
    make_loop = true,               -- Try to make this area loop back on itself
})
```

## Step 3: Modifying Level Definitions

To include your custom tasks in the world generation, you need to modify the level definitions.

### Basic Level Modification

```lua
AddLevelPreInit("SURVIVAL_TOGETHER", function(level)
    -- Add our custom task to the list of tasks
    if level.tasks then
        table.insert(level.tasks, "MyCustomTask")
    end
    
    -- Add our custom room to the list of rooms
    if level.rooms then
        table.insert(level.rooms, "MyCustomRoom")
    end
    
    -- Add a setpiece to the world
    if level.random_set_pieces then
        table.insert(level.random_set_pieces, "MyCustomSetpiece")
    end
})
```

### Advanced Level Modification

For more complex level modifications:

```lua
AddLevelPreInit("SURVIVAL_TOGETHER", function(level)
    -- Modify task distribution
    level.overrides = level.overrides or {}
    level.overrides.task_distribute = level.overrides.task_distribute or {}
    level.overrides.task_distribute.MyCustomTask = 1.5  -- Higher weight
    
    -- Add required setpieces
    if level.required_setpieces then
        table.insert(level.required_setpieces, "MyImportantSetpiece")
    end
    
    -- Change starting location
    level.start_location = "MyCustomStart"
    
    -- Modify resource distribution
    level.overrides.berrybush = "often"
    level.overrides.trees = "mostly"
    level.overrides.flint = "default"
    level.overrides.grass = "plenty"
})
```

### Creating a Completely New Level

For a completely custom world:

```lua
local my_level = {
    id = "CUSTOM_WORLD",
    name = "My Custom World",
    desc = "A completely custom world experience.",
    location = "forest",
    version = 4,
    overrides = {
        task_distribute = {
            MyCustomTask = 1.5,
            AnotherTask = 0.8,
        },
        -- Resource distribution
        berrybush = "often",
        trees = "mostly",
        grass = "plenty",
        -- Season settings
        season_start = "autumn",
        autumn = "longseason",
        winter = "shortseason",
        spring = "default",
        summer = "shortseason",
    },
    tasks = {
        "Make a pick",
        "MyCustomTask",
        "AnotherTask",
        "Dig that rock",
        "Great Plains",
    },
    numoptionaltasks = 4,
    optionaltasks = {
        "Befriend the pigs",
        "Kill the spiders",
        "The hunters",
        "Magic meadow",
        "MyOptionalTask",
    },
    required_setpieces = {
        "Sculptures_1",
        "MaxwellThrone",
        "MyRequiredSetpiece",
    },
    numrandom_set_pieces = 5,
    random_set_pieces = {
        "Chessy_1",
        "Chessy_2",
        "Chessy_3",
        "Maxwell1",
        "Maxwell2",
        "Maxwell3",
        "MyRandomSetpiece",
    },
    ordered_story_setpieces = {
        {"MyStorySetpiece1", "Day 10"},
        {"MyStorySetpiece2", "Day 25"},
    },
}

AddLevel(LEVELTYPE.SURVIVAL, my_level)
```

## Step 4: Creating Custom Ground Types

To create a completely unique biome, you may want to add custom ground types.

### Registering a New Ground Type

```lua
-- In modmain.lua

-- Add the new ground type
local GROUND = GLOBAL.GROUND
local GROUND_NAMES = GLOBAL.STRINGS.NAMES.GROUND
local GROUND_TILES = GLOBAL.GROUND_TILES

-- Register new ground type
GROUND.MYTERRAIN = #GROUND_TILES + 1
GROUND_NAMES.MYTERRAIN = "My Custom Terrain"
GROUND_TILES[GROUND.MYTERRAIN] = "myterrain"

-- Add the ground assets
AddGamePostInit(function()
    local GroundAtlas = GLOBAL.resolvefilepath("levels/textures/ground_noise.xml")
    local GroundImage = GLOBAL.resolvefilepath("levels/textures/ground_noise.tex")
    
    -- Add our custom ground
    GLOBAL.TheWorld.components.groundcreep:AddGroundDef(
        GROUND.MYTERRAIN,
        GroundAtlas,
        GroundImage,
        "levels/textures/myterrain_noise.tex",
        "myterrain"
    )
end)

-- Add custom tile physics
AddSimPostInit(function()
    for k, v in pairs(GLOBAL.GROUND_FLOORING) do
        if v == GROUND.MYTERRAIN then
            GLOBAL.SetGroundFertility(v, 0.5)  -- Medium fertility
            GLOBAL.SetGroundClass(v, "forest") -- Forest class
            GLOBAL.SetGroundSpeedMultiplier(v, 1.1) -- Slightly faster movement
        end
    end
end)

-- Add required assets
Assets = {
    Asset("IMAGE", "levels/textures/myterrain.tex"),
    Asset("IMAGE", "levels/textures/myterrain_noise.tex"),
    Asset("IMAGE", "minimap/myterrain.tex"),
}
```

### Creating Ground Textures

For a complete custom ground, you'll need to create these texture files:

1. `levels/tiles/myterrain.tex` - The base texture for the ground
2. `levels/textures/myterrain_noise.tex` - The noise texture for variation
3. `minimap/myterrain.tex` - The minimap representation

## Step 5: Creating Custom Setpieces

Setpieces are pre-designed layouts that can be placed in the world.

### Creating a Static Layout

Create a file in `map/static_layouts/my_setpiece.lua`:

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
          name = "evergreen",
          type = "evergreen",
          shape = "rectangle",
          x = 128,
          y = 128,
          width = 0,
          height = 0,
          visible = true,
          properties = {}
        },
        {
          name = "evergreen",
          type = "evergreen",
          shape = "rectangle",
          x = 96,
          y = 160,
          width = 0,
          height = 0,
          visible = true,
          properties = {}
        },
        {
          name = "pighouse",
          type = "pighouse",
          shape = "rectangle",
          x = 160,
          y = 96,
          width = 0,
          height = 0,
          visible = true,
          properties = {}
        },
        {
          name = "firepit",
          type = "firepit",
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

### Registering the Setpiece

```lua
-- In modmain.lua
AddLevelPreInit("SURVIVAL_TOGETHER", function(level)
    if level.random_set_pieces then
        table.insert(level.random_set_pieces, "my_setpiece")
    end
end)

-- Register the layout
AddRoom("my_setpiece", StaticLayout.Get("map/static_layouts/my_setpiece"))
```

## Practical Examples

Let's look at some practical examples of custom world generation.

### Example 1: Adding a Desert Biome

```lua
-- In modmain.lua

-- Register new ground type
GROUND.DESERT = #GROUND_TILES + 1
GROUND_NAMES.DESERT = "Desert"
GROUND_TILES[GROUND.DESERT] = "desert"

-- Add custom room
AddRoom("DesertRoom", {
    colour = {r=0.8, g=0.7, b=0.5, a=0.3},
    value = GROUND.DESERT,
    tags = {"ExitPiece", "Desert"},
    contents = {
        distributepercent = 0.06,
        distributeprefabs = {
            cactus = 0.5,
            rock1 = 0.3,
            houndbone = 0.2,
            flint = 0.1,
        }
    }
})

-- Add custom task
AddTask("DesertTask", {
    locks = {LOCKS.TIER2},
    keys_given = {KEYS.TIER3},
    room_choices = {
        ["DesertRoom"] = {3, 5},
        ["Rocky"] = {1, 2},
    },
    room_bg = GROUND.DESERT,
    background_room = "BGDesert",
    colour = {r=0.8, g=0.7, b=0.5, a=1}
})

-- Add background room
AddRoom("BGDesert", {
    colour = {r=0.8, g=0.7, b=0.5, a=0.3},
    value = GROUND.DESERT,
    tags = {"Desert", "RoadPoison"},
    contents = {
        distributepercent = 0.03,
        distributeprefabs = {
            rock1 = 0.05,
            flint = 0.05,
        }
    }
})

-- Add to level
AddLevelPreInit("SURVIVAL_TOGETHER", function(level)
    if level.tasks then
        table.insert(level.tasks, "DesertTask")
    end
    
    if level.rooms then
        table.insert(level.rooms, "DesertRoom")
        table.insert(level.rooms, "BGDesert")
    end
    
    -- Add oasis setpiece
    if level.random_set_pieces then
        table.insert(level.random_set_pieces, "DesertOasis")
    end
})
```

### Example 2: Creating a Custom Start Area

```lua
-- Custom starting area with plenty of resources
AddRoom("CustomStart", {
    colour = {r=0.3, g=0.8, b=0.5, a=0.3},
    value = WORLD_TILES.GRASS,
    tags = {"ExitPiece", "StartArea"},
    contents = {
        countstaticlayout = {
            ["DefaultStart"] = 1,  -- Include the default start layout
        },
        countprefabs = {
            firepit = 1,
            tent = 1,
        },
        distributepercent = 0.2,
        distributeprefabs = {
            sapling = 1,
            grass = 1,
            berrybush = 0.5,
            flint = 0.4,
            rocks = 0.4,
            evergreen = 0.3,
        }
    }
})

-- Custom start task
AddTask("CustomStartTask", {
    locks = {LOCKS.NONE},
    keys_given = {KEYS.TIER1, KEYS.AXE, KEYS.PICKAXE},
    room_choices = {
        ["CustomStart"] = 1,
        ["Forest"] = {1, 2},
        ["BarePlain"] = 1,
    },
    room_bg = WORLD_TILES.GRASS,
    background_room = "BGGrass",
    colour = {r=0.3, g=0.8, b=0.5, a=1}
})

-- Add to level
AddLevelPreInit("SURVIVAL_TOGETHER", function(level)
    -- Replace the default start task
    if level.tasks then
        for i, task in ipairs(level.tasks) do
            if task == "Make a pick" then
                level.tasks[i] = "CustomStartTask"
                break
            end
        end
    end
    
    -- Set the start location
    level.start_location = "CustomStart"
})
```

### Example 3: Adding a Dangerous Biome

```lua
-- Add a dangerous swamp biome
AddRoom("DangerousSwamp", {
    colour = {r=0.4, g=0.3, b=0.5, a=0.3},
    value = WORLD_TILES.MARSH,
    tags = {"ExitPiece", "Swamp", "Dangerous"},
    contents = {
        distributepercent = 0.2,
        distributeprefabs = {
            marsh_tree = 0.5,
            marsh_bush = 0.3,
            tentacle = 0.4,
            reeds = 0.2,
            mermhouse = 0.1,
        }
    }
})

-- Add a dangerous swamp task
AddTask("DangerousSwampTask", {
    locks = {LOCKS.TIER3},
    keys_given = {KEYS.TIER4, KEYS.SWAMP},
    room_choices = {
        ["DangerousSwamp"] = {3, 4},
        ["Marsh"] = {1, 2},
    },
    room_bg = WORLD_TILES.MARSH,
    background_room = "BGMarsh",
    colour = {r=0.4, g=0.3, b=0.5, a=1}
})

-- Add to level
AddLevelPreInit("SURVIVAL_TOGETHER", function(level)
    if level.tasks then
        table.insert(level.tasks, "DangerousSwampTask")
    end
    
    -- Add a special setpiece
    if level.random_set_pieces then
        table.insert(level.random_set_pieces, "SwampAltar")
    end
    
    -- Make it appear later in the game
    if level.ordered_story_setpieces then
        table.insert(level.ordered_story_setpieces, {"SwampBoss", "Day 35"})
    end
})
```

## Advanced Techniques

### Custom World Generation

For more advanced customization, you can create a mod that hooks into the world generation process:

```lua
-- In modmain.lua
local function CustomizeWorldGeneration(world)
    -- Modify world generation parameters
    world.topology.overrides.berrybush = "never"
    world.topology.overrides.spiders = "always"
    
    -- Add custom tasks or rooms
    -- ...
end

AddPrefabPostInit("world", CustomizeWorldGeneration)
```

### Custom Room Distribution

You can create custom distribution rules for objects in rooms:

```lua
-- Custom distribution function
local function CustomDistribution(room, prefab, points_x, points_y, width, height)
    -- Custom placement logic
    local custom_points = {}
    
    -- Example: Place objects in a circle
    local center_x = width / 2
    local center_y = height / 2
    local radius = math.min(width, height) / 3
    
    for i = 1, 8 do
        local angle = (i - 1) * (2 * math.pi / 8)
        local x = center_x + radius * math.cos(angle)
        local y = center_y + radius * math.sin(angle)
        table.insert(custom_points, {x = x, y = y})
    end
    
    return custom_points
end

-- Hook into room generation
AddRoomPreInit("Forest", function(room)
    room.custom_distribution = CustomDistribution
end)
```

### Seasonal Changes

You can make your world generation respond to seasons:

```lua
-- In modmain.lua
AddPrefabPostInit("world", function(inst)
    if GLOBAL.TheWorld.ismastersim then
        inst:WatchWorldState("season", function(inst, season)
            if season == "winter" then
                -- Change world properties in winter
                inst.components.worldstate.data.snowlevel = 1.0
                
                -- Spawn more winter-specific creatures
                local x, y, z = inst.Transform:GetWorldPosition()
                local ents = TheSim:FindEntities(x, y, z, 10000, {"winter_spawner"})
                for _, ent in ipairs(ents) do
                    if ent.components.childspawner then
                        ent.components.childspawner:SetMaxChildren(10)
                    end
                end
            end
        end)
    end
end)
```

## Troubleshooting

### Common Issues and Solutions

- **World Too Small**: Increase `world_size` parameter or add more tasks
- **Resources Too Scarce**: Increase specific resource parameters (e.g., `berrybush = "often"`)
- **Too Many Enemies**: Decrease enemy parameters (e.g., `spiders = "rare"`)
- **Disconnected Regions**: Increase `branching` and `loop` parameters
- **Missing Biomes**: Ensure all required tasks are included in the task set
- **Crashes During Generation**: Check for syntax errors or invalid references in your room/task definitions

### Debugging World Generation

Use these techniques to debug world generation:

```lua
-- Print debug information during world generation
AddPrefabPostInit("world", function(inst)
    print("World Generation Debug:")
    print("Tasks:", #inst.topology.tasks)
    print("Nodes:", #inst.topology.nodes)
    
    for i, node in ipairs(inst.topology.nodes) do
        print(string.format("Node %d: %s at (%.1f, %.1f)", i, node.type, node.x, node.z))
    end
    
    -- Save a map of the world for debugging
    if inst.minimap then
        inst.minimap:Save("worldgen_debug.png")
    end
end)
```

## Conclusion

Creating custom world generation in Don't Starve Together allows for incredibly unique and engaging player experiences. By understanding the system's components and how they interact, you can create worlds tailored to specific gameplay experiences.

Whether through simple modifications to existing worlds or creating entirely new ones, the possibilities for world generation are vast. Experiment with different combinations of rooms, tasks, and setpieces to create the perfect world for your mod.

For more specific examples and advanced techniques, check out the [World Generation Mod Example](../examples/worldgen-mod.md) and [New Biome Project](../examples/project-biome.md) tutorials. 
