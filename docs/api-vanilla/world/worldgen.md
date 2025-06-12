---
id: worldgen
title: World Generation API
sidebar_position: 6
---

# World Generation API

Tools and systems for procedurally generating game worlds in Don't Starve Together.

## Overview

The World Generation API controls how game worlds are created, including terrain, biomes, and feature placement. It provides the foundation for procedurally generated worlds with various customization options.

## Generation Process

The world generation process follows these main steps:

1. **Level Selection**: Choose a level preset defining overall world characteristics
2. **Graph Construction**: Create a connected graph of tasks and rooms
3. **Node Population**: Fill nodes with terrain types and features
4. **Terrain Generation**: Convert abstract nodes to actual terrain tiles
5. **Feature Placement**: Add structures, resources, and other map features

### Detailed Generation Pipeline

The actual generation process consists of the following phases:

1. **Initialization**
   - Load level preset and configuration
   - Initialize random number generator
   - Set up world size and boundaries
   - Configure season and starting conditions

2. **Map Layout**
   - Generate task graph based on level definition
   - Connect tasks using lock and key system
   - Ensure proper progression path
   - Create branching paths and optional areas

3. **Room Placement**
   - Assign room types to graph nodes
   - Calculate room sizes and borders
   - Connect rooms with appropriate transitions
   - Place background and special rooms

4. **Terrain Generation**
   - Convert room types to terrain tiles
   - Generate terrain height and variation
   - Create water bodies and land masses
   - Apply noise and natural variation

5. **Prefab Distribution**
   - Place required structures (Maxwell's Door, etc.)
   - Distribute resources based on biome rules
   - Add creatures and spawners
   - Place vegetation and natural features

6. **Set Piece Placement**
   - Add pre-designed layouts
   - Place special structures
   - Add story-related elements
   - Include random set pieces

7. **Finalization**
   - Validate map connectivity
   - Ensure resource availability
   - Add player spawn points
   - Apply final polish and cleanup

## Key Components

### Level Configuration

Levels define the high-level parameters for world generation:

```lua
local level = {
    id = "SURVIVAL_DEFAULT",
    name = "Default",
    desc = "The standard Don't Starve Together experience.",
    location = "forest",
    version = 4,
    overrides = {
        season_start = "autumn",
        wormhole_prefab = "wormhole" 
    },
    tasks = { "Make a pick", "Resource-rich", "The other side" },
    optional_tasks = { "Forest hunters", "Befriend the pigs" },
    numoptionaltasks = 2
}
```

### Tasks

Tasks represent connected clusters of rooms that form distinct areas:

```lua
AddTask("Make a pick", {
    locks = {{LOCKS.NONE, LOCKS.ROCKS}},
    keys_given = {KEYS.PICKAXE},
    room_choices = {
        ["Plain"] = { ["Forest"] = 1, ["Clearing"] = 1 }
    },
    room_bg = GROUND.GRASS,
    background_room = "BGGrass",
    colour = {r=0, g=1, b=0, a=1}
})
```

### Rooms

Rooms define the contents of specific areas:

```lua
AddRoom("Forest", {
    colour = {r=0.1, g=0.8, b=0.1, a=0.3},
    value = GROUND.FOREST,
    tags = {"ExitPiece", "Chester_Eyebone"},
    contents = {
        distributepercent = 0.3,
        distributeprefabs = {
            evergreen = 6,
            grass = 0.3,
            sapling = 0.5,
            flint = 0.05,
            fireflies = 0.01
        }
    }
})
```

## Lock and Key System

The "Lock and Key" system controls progression through the world and helps structure the layout. It creates a natural game flow by requiring players to gather resources or complete tasks before accessing new areas.

### Locks

Locks represent barriers that must be overcome to progress. They don't necessarily manifest as physical barriers, but represent resource or equipment requirements:

```lua
LOCKS = {
    NONE = 0,           -- No requirement
    ROCKS = 1,          -- Requires pickaxe (rock resource)
    TREES = 2,          -- Requires axe (wood resource)
    SPIDERS = 3,        -- Requires combat capability
    TIER1 = 4,          -- Requires basic resources
    TIER2 = 5,          -- Requires advanced resources
    MEAT = 6,           -- Requires hunting capability
    GRASS = 7,          -- Requires basic resources
    TWIGS = 8,          -- Requires basic resources
    NIGHTTIME = 9,      -- Requires light sources
    HAMMER = 10,        -- Requires hammer tool
    MINERHAT = 11,      -- Requires miner hat
    MONSTERS = 12,      -- Requires combat capability
    -- and more
}
```

### Keys

Keys represent the tools, resources, or capabilities that allow players to overcome locks:

```lua
KEYS = {
    NONE = 0,           -- No key
    PICKAXE = 1,        -- Basic pickaxe
    AXE = 2,            -- Basic axe
    MEAT = 3,           -- Meat resource
    WOOD = 4,           -- Wood resource
    GRASS = 5,          -- Grass resource
    TIER1 = 6,          -- Basic resources
    TIER2 = 7,          -- Advanced resources
    LIGHT = 8,          -- Light sources
    -- and more
}
```

### Using Locks and Keys

When defining tasks, you specify which locks they have and which keys they provide:

```lua
AddTask("Starting Area", {
    locks = {LOCKS.NONE},  -- No requirements to enter
    keys_given = {KEYS.AXE, KEYS.PICKAXE},  -- Provides basic tools
    room_choices = {
        ["Base"] = {
            ["ForestStart"] = 1,
            ["Clearing"] = 1
        }
    },
    room_bg = GROUND.GRASS,
    background_room = "BGGrass",
    colour = {r=0, g=1, b=0, a=1}
})

AddTask("Rocky Territory", {
    locks = {LOCKS.ROCKS},  -- Requires pickaxe
    keys_given = {KEYS.TIER1},  -- Provides tier 1 resources
    room_choices = {
        ["Rocky"] = {
            ["Rocky"] = 2,
            ["RockyBadlands"] = 1
        }
    },
    room_bg = GROUND.DIRT,
    background_room = "BGRocky",
    colour = {r=0.6, g=0.6, b=0.0, a=1}
})
```

## World Customization

The game allows customization of world generation through several parameters:

```lua
-- Customize world size
worldgendata.overrides.worldsize = "large"

-- Customize resource distribution
worldgendata.overrides.boons = "more"
worldgendata.overrides.trees = "lots"

-- Customize terrain features
worldgendata.overrides.branching = "most"
worldgendata.overrides.loop = "never"
```

### Override Options

World generation can be customized through override parameters:

| Parameter | Options | Description |
|-----------|---------|-------------|
| `worldsize` | "small", "medium", "large", "huge" | Controls overall map size |
| `branching` | "never", "least", "default", "most" | Controls how many branches tasks have |
| `loop` | "never", "default", "always" | Whether tasks form loops |
| `resources` | "few", "default", "many", "max" | Overall resource abundance |
| `season_start` | "autumn", "winter", "spring", "summer" | Starting season |
| `touchstone` | "none", "default", "many" | Number of revival stones |
| `boons` | "none", "few", "default", "many" | Skeleton/supply drops frequency |
| `prefabswaps_start` | "default", "classic", "highly random" | How predictable prefab placement is |
| `beefalo` | "none", "rare", "default", "often", "always" | Beefalo abundance |
| `pigs` | "none", "rare", "default", "often", "always" | Pig house abundance |
| `spiders` | "none", "rare", "default", "often", "always" | Spider den abundance |
| `rabbits` | "none", "rare", "default", "often", "always" | Rabbit hole abundance |
| `trees` | "none", "rare", "default", "often", "always" | Tree abundance |
| `rocks` | "none", "rare", "default", "often", "always" | Rock abundance |
| `carrots` | "none", "rare", "default", "often", "always" | Carrot abundance |
| `grass` | "none", "rare", "default", "often", "always" | Grass abundance |

### World Generation Properties

The following are common prefabs and properties used in world generation:

#### Structures
| Prefab | Description | Default Distribution |
|--------|-------------|---------------------|
| `pighouse` | Pig houses | 0.12 per room in Forest biomes |
| `mermhouse` | Merm houses | 0.1 per room in Marsh biomes |
| `spiderden` | Spider dens | 0.15 per room in Forest/Rocky biomes |
| `rabbithouse` | Rabbit hutches | 0.08 per room in Deciduous biomes |
| `beehive` | Bee hives | 0.05 per room in Forest/Meadow biomes |
| `wasphive` | Killer bee hives | 0.03 per room in Meadow biomes |
| `tallbirdnest` | Tallbird nests | 0.08 per room in Rocky biomes |

#### Resources
| Prefab | Description | Default Distribution |
|--------|-------------|---------------------|
| `evergreen` | Pine trees | 6.0 per Forest room |
| `deciduoustree` | Birchnut trees | 4.0 per Deciduous room |
| `rock1` | Boulder | 0.05 per Rocky room |
| `rock2` | Gold vein | 0.02 per Rocky room |
| `flint` | Flint | 0.05 per room |
| `grass` | Grass tufts | 0.3 per Grassland room |
| `sapling` | Saplings | 0.5 per Forest room |
| `reeds` | Reeds | 0.3 per Marsh room |
| `flower` | Flowers | 0.2 per Meadow room |
| `carrot_planted` | Carrots | 0.1 per Grassland room |
| `berrybush` | Berry bushes | 0.2 per Forest room |
| `berrybush2` | Juicy berry bushes | 0.1 per Forest room |

#### Special Features
| Prefab | Description | Default Distribution |
|--------|-------------|---------------------|
| `wormhole` | Wormholes | 2-4 pairs per world |
| `cave_entrance` | Cave entrances | 4-8 per world |
| `pond` | Ponds | 0.1 per Grassland room |
| `pond_mos` | Mosquito ponds | 0.15 per Marsh room |
| `fireflies` | Firefly lights | 0.1 per Forest room |
| `skeleton` | Skeleton set pieces | Based on 'boons' setting |
| `beefaloherd` | Beefalo herds | Based on 'beefalo' setting |

#### Terrain Features
| Feature | Description | Default Weight |
|---------|-------------|----------------|
| `GROUND.ROAD` | Roads | Generated between tasks |
| `GROUND.FOREST` | Forest terrain | 1.0 in Forest rooms |
| `GROUND.GRASS` | Grassland terrain | 1.0 in Grassland rooms |
| `GROUND.MARSH` | Marsh terrain | 1.0 in Marsh rooms |
| `GROUND.ROCKY` | Rocky terrain | 1.0 in Rocky rooms |
| `GROUND.SAVANNA` | Savanna terrain | 1.0 in Savanna rooms |
| `GROUND.DIRT` | Dirt terrain | Used for transitions |
| `GROUND.WOODFLOOR` | Wooden flooring | Used in set pieces |
| `GROUND.CARPET` | Carpeted flooring | Used in set pieces |

### Creating Custom World Settings

You can define custom world settings in your mod:

```lua
-- In modworldgenmain.lua
GLOBAL.TUNING.WORLDGEN_DENSITY_MULTIPLIER = 0.8 -- Reduce overall density
GLOBAL.terrain.filter.multiply.GRASS = 1.5 -- Increase grass density

-- Custom level preset
AddLevelPreset("CUSTOM_WORLD", {
    name = "Custom World",
    desc = "A customized world with unique features.",
    location = "forest",
    version = 1,
    overrides = {
        start_location = "default",
        world_size = "medium",
        resource_renewal = "always",
        spring = "rare",
        boons = "many",
        weather = "rare",
        roads = "never",
        spiders = "often",
        beefalo = "rare",
        pigs = "often"
    }
})
```

## Special Feature Placement

Special features like set pieces have dedicated placement systems:

```lua
-- Add a guaranteed set piece
level.ordered_story_setpieces = {
    "PigKingLayout",
    "MaxwellThrone"
}

-- Add potential random set pieces
level.random_set_pieces = {
    "Chessy_1",
    "Chessy_2",
    "Chessy_3",
    "Chessy_4",
    "Chessy_5",
    "Chessy_6"
}
```

## Creating Custom Rooms

You can create custom rooms for your mod:

```lua
-- Define a custom room
AddRoom("MyCustomForest", {
    colour = {r=0.2, g=0.7, b=0.1, a=0.3},
    value = GROUND.FOREST,
    tags = {"ExitPiece", "MyCustomTag"},
    contents = {
        distributepercent = 0.4, -- Higher density than regular forest
        distributeprefabs = {
            evergreen = 8,
            grass = 0.5,
            sapling = 0.7,
            berrybush = 0.2,
            red_mushroom = 0.1,
            fireflies = 0.02,
            goldnugget = 0.05,
            flint = 0.1,
            blue_mushroom = 0.02
        }
    }
})

-- Add a task that uses your custom room
AddTask("MyCustomTask", {
    locks = {LOCKS.NONE},
    keys_given = {KEYS.PICKAXE, KEYS.AXE},
    room_choices = {
        ["Plain"] = {
            ["MyCustomForest"] = 2,
            ["Clearing"] = 1
        }
    },
    room_bg = GROUND.GRASS,
    background_room = "BGGrass",
    colour = {r=0.2, g=0.6, b=0.2, a=1}
})

-- Add your task to a level
AddLevel("SURVIVAL_DEFAULT", {
    tasks = {"Make a pick", "MyCustomTask", "The other side"}
})
```

### Room Content Types

Rooms can distribute contents in different ways:

```lua
-- Standard distribution (random placement based on percentages)
contents = {
    distributepercent = 0.3,
    distributeprefabs = {
        evergreen = 6,
        grass = 0.3,
        sapling = 0.5
    }
}

-- Exact counts (place exactly this many of each prefab)
contents = {
    countstaticlayouts = {
        ["PigHouse"] = 3,
        ["BerryPatch"] = 2
    }
}

-- Mixed approach
contents = {
    distributepercent = 0.2,
    distributeprefabs = {
        evergreen = 5,
        grass = 0.4
    },
    countprefabs = {
        pighouse = 2,
        spiderden = 1
    }
}
```

## Custom Terrain Creation

To create custom terrain types:

```lua
-- Define a new terrain type
GROUND.MYTERRAIN = 99 -- Choose an unused number
GROUND_NAMES[GROUND.MYTERRAIN] = "MyTerrain"

-- Add assets for the new terrain
local function AddAssets()
    return {
        Asset("IMAGE", "levels/tiles/myterrain.tex"),
        Asset("FILE", "levels/tiles/myterrain.xml")
    }
end

-- Use the terrain in a custom room
AddRoom("MyTerrainRoom", {
    colour = {r=0.5, g=0.5, b=0.2, a=0.3},
    value = GROUND.MYTERRAIN,
    contents = {
        distributepercent = 0.2,
        distributeprefabs = {
            rocks = 0.1,
            grass = 0.5,
            myprefab = 0.3
        }
    }
})
```

### Advanced Room Creation

When creating custom rooms, you have several advanced options available:

```lua
AddRoom("CustomAdvancedRoom", {
    -- Basic properties
    colour = {r=0.3, g=0.3, b=0.3, a=0.3},
    value = GROUND.FOREST,
    
    -- Tags control room behavior and placement
    tags = {
        "ExitPiece",         -- Can be used as an exit
        "Hutch_Fishbowl",    -- Can spawn Hutch
        "Chester_Eyebone",   -- Can spawn Chester's eyebone
        "StagehandGarden",   -- Can spawn Stagehand
        "HasMonsters",       -- Contains hostile creatures
        "Mist",             -- Has mist effects
        "RoadPoison",       -- Roads are dangerous here
        "Forest",           -- Forest biome tag
        "MoonIsland"        -- Moon island biome tag
    },
    
    -- Advanced content distribution
    contents = {
        -- Percentage of room to fill with distributed items
        distributepercent = 0.4,
        
        -- Random distribution of prefabs
        distributeprefabs = {
            evergreen = {
                weight = 6,           -- Relative spawn weight
                min_spacing = 2,      -- Minimum spacing between trees
                avoid_player = true,  -- Avoid spawning near players
                clustering = 0.5      -- How much items cluster together (0-1)
            },
            grass = {
                weight = 0.3,
                min_spacing = 1.5,
                clustering = 0.2
            },
            berrybush = {
                weight = 0.2,
                min_spacing = 1.8,
                avoid_secondary = true -- Avoid other tagged items
            }
        },
        
        -- Exact count prefabs
        countprefabs = {
            pighouse = 2,    -- Exactly 2 pig houses
            spiderden = 1    -- Exactly 1 spider den
        },
        
        -- Static layouts (pre-designed arrangements)
        countstaticlayouts = {
            ["PigVillage"] = 1,
            ["SpiderCity"] = 1
        }
    },
    
    -- Custom generation parameters
    gen_params = {
        ground_types = {     -- Multiple ground types in one room
            [GROUND.FOREST] = 3,
            [GROUND.GRASS] = 1
        },
        water_percentage = 0.2,  -- Amount of water
        has_border = true,      -- Add terrain border
        border_size = 2,        -- Size of border in tiles
        edge_padding = 1        -- Padding from room edge
    },
    
    -- Custom placement rules
    custom_tiles = {
        GeneratorFunction = function(room, entity, x, y, z)
            -- Custom placement logic
            return true -- or false to prevent placement
        end
    },
    
    -- Room-specific handlers
    handlers = {
        -- Called when room is first created
        OnCreate = function(room)
            -- Initialize room-specific data
        end,
        
        -- Called when entities are being placed
        OnPopulate = function(room)
            -- Add custom entities
        end,
        
        -- Called after all entities are placed
        OnPostPopulate = function(room)
            -- Final room modifications
        end
    }
})
```

### Terrain Patterns and Mixing

You can create complex terrain patterns by mixing different ground types:

```lua
-- Create a checkerboard pattern
local function CreateCheckerboardTerrain(room)
    local size = room.size
    for x = 0, size.x do
        for y = 0, size.y do
            if (x + y) % 2 == 0 then
                room:SetTile(x, y, GROUND.FOREST)
            else
                room:SetTile(x, y, GROUND.GRASS)
            end
        end
    end
end

-- Create terrain gradients
local function CreateTerrainGradient(room)
    local size = room.size
    for x = 0, size.x do
        local percent = x / size.x
        if percent < 0.33 then
            room:SetTile(x, y, GROUND.FOREST)
        elseif percent < 0.66 then
            room:SetTile(x, y, GROUND.GRASS)
        else
            room:SetTile(x, y, GROUND.MARSH)
        end
    end
end

-- Add noise to terrain
local function AddTerrainNoise(room)
    local size = room.size
    for x = 0, size.x do
        for y = 0, size.y do
            if math.random() < 0.2 then
                -- Randomly change 20% of tiles
                room:SetTile(x, y, GROUND.DIRT)
            end
        end
    end
end
```

### Custom Room Connections

You can define how rooms connect to each other:

```lua
AddRoom("CustomConnectedRoom", {
    -- ... other room properties ...
    
    -- Define valid connections
    connections = {
        {
            name = "Forest",      -- Connect to Forest rooms
            direction = "north",  -- From north side
            guards = "spiderden" -- Guard with spider dens
        },
        {
            name = "Rocky",       -- Connect to Rocky rooms
            direction = "east",   -- From east side
            distance = 2,        -- Must be 2 rooms away
            required = true      -- Must have this connection
        }
    },
    
    -- Custom connection handling
    OnConnect = function(room, other_room, direction)
        -- Add custom logic when rooms connect
        if direction == "north" then
            -- Add special features at north connection
        end
    end
})
```

## Static Layouts

Static layouts allow you to create custom "set pieces" with precise object placement:

```lua
-- Define a static layout
local mylayout = StaticLayout.Get(
    "map/static_layouts/my_custom_layout",
    {
        start_mask = PLACE_MASK.NORMAL,
        fill_mask = PLACE_MASK.IGNORE_IMPASSABLE,
        layout_position = LAYOUT_POSITION.CENTER
    }
)

-- Add it to the set pieces that can be placed
table.insert(level.random_set_pieces, "my_custom_layout")
```

The layout file would define exact positions for objects:

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
  tilesets = {},
  layers = {
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
          x = 64,
          y = 80,
          width = 0,
          height = 0
        },
        {
          name = "firepit",
          type = "firepit",
          shape = "rectangle",
          x = 128,
          y = 128,
          width = 0,
          height = 0
        }
      }
    }
  }
}
```

## Debugging World Generation

When creating custom world generation, debugging is essential. Here are some useful techniques:

### Visualization Tools

```lua
-- In your modmain, add a debug command to visualize the world graph
local function VisualizeWorldGraph()
    local graph = TheWorld.topology
    
    -- Highlight each node in the graph
    for i, node in ipairs(graph.nodes) do
        local x, y, z = node.x, 0, node.y
        local marker = SpawnPrefab("flint") -- Use any visible prefab
        marker.Transform:SetPosition(x, y, z)
        marker:DoTaskInTime(30, marker.Remove) -- Clean up after 30 seconds
        marker.AnimState:SetMultColour(1, 0, 0, 1) -- Make it red
        
        -- Show node info
        print("Node", i, ":", node.type, "at", x, ",", z)
    end
    
    -- Highlight each edge in the graph
    for i, edge in ipairs(graph.edges) do
        local node1 = graph.nodes[edge[1]]
        local node2 = graph.nodes[edge[2]]
        
        -- Create a line of markers between the nodes
        local steps = 10
        for j = 0, steps do
            local percent = j / steps
            local x = node1.x + (node2.x - node1.x) * percent
            local z = node1.y + (node2.y - node1.y) * percent
            
            local marker = SpawnPrefab("goldnugget")
            marker.Transform:SetPosition(x, 0, z)
            marker:DoTaskInTime(30, marker.Remove)
        end
    end
end

AddPlayerPostInit(function(player)
    player:ListenForEvent("ms_debug_worldgen", VisualizeWorldGraph)
end)
```

### Logging World Generation

```lua
-- In modworldgenmain.lua, add logging
local oldAddTask = AddTask
AddTask = function(name, data)
    print("WORLDGEN: Adding task", name)
    for k, v in pairs(data.room_choices or {}) do
        print("  Room Group:", k)
        for room, count in pairs(v) do
            print("    Room:", room, "Count:", count)
        end
    end
    return oldAddTask(name, data)
end

local oldAddRoom = AddRoom
AddRoom = function(name, data)
    print("WORLDGEN: Adding room", name, "with ground", data.value)
    return oldAddRoom(name, data)
end
```

## Related Components

- **Network System**: Handles connections between different areas
- **Lock and Key System**: Controls progression through the world
- **Room System**: Defines individual areas' contents
- **Map System**: Translates the generation plan into actual terrain 