---
id: worldgen
title: World Generation
sidebar_position: 4
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# World Generation

World generation in Don't Starve Together is a complex process that creates the game world through a series of steps involving rooms, tasks, and terrain generation. This document explains how the world generation system works and how it can be customized.

## World Generation Process

The world generation in DST follows these main steps:

1. **Level Selection**: The game selects a level configuration based on the chosen preset (e.g., "Survival Together", "Caves", etc.)
2. **Task Assignment**: Tasks are assigned to different regions of the map
3. **Room Placement**: Rooms are placed within tasks based on task requirements
4. **Terrain Generation**: Terrain is generated for each room
5. **Object Placement**: Objects are placed within rooms according to their distribution rules
6. **Finalization**: Final adjustments are made, such as placing setpieces and connecting regions

### Key Components

- **Levels**: Define the overall world configuration (forest, caves, etc.)
- **Tasks**: Represent gameplay objectives and areas (e.g., "Make a pick", "Dig that rock")
- **Rooms**: Define specific areas with terrain and object distributions (e.g., "Forest", "Rocky", "Marsh")
- **Setpieces**: Pre-designed arrangements of objects (e.g., "Maxwell's Throne", "Pig Village")

## Customizing World Generation

### Using the World Customization Screen

The in-game customization screen allows you to modify many world generation parameters:

- **World Size**: Affects the overall size of the generated world
- **Branching**: Controls how many branches the world has
- **Loops**: Determines whether paths loop back on themselves
- **Resource Abundance**: Controls the frequency of various resources
- **Season Length**: Adjusts the duration of each season
- **Special Events**: Toggles special events like Winter's Feast

### Programmatic Customization

To programmatically customize world generation, you need to understand the following files:

- `map/levels.lua`: Defines world presets
- `map/tasks.lua`: Defines tasks for world generation
- `map/rooms/*.lua`: Defines rooms and their contents
- `map/terrain.lua`: Defines terrain types and their properties

## Creating Custom Rooms

Rooms are the basic building blocks of world generation. Each room has a terrain type and a set of objects to spawn.

```lua
-- Example of a custom room definition
AddRoom("MyCustomRoom", {
    colour = {r=0.3, g=0.5, b=0.6, a=0.3},
    value = WORLD_TILES.GRASS,  -- Base terrain type
    tags = {"ExitPiece", "Chester_Eyebone"},
    contents = {
        distributepercent = 0.15,  -- Density of objects
        distributeprefabs = {
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

## Creating Custom Tasks

Tasks are collections of rooms that fulfill a specific gameplay purpose.

```lua
-- Example of a custom task
AddTask("MyCustomTask", {
    locks = {LOCKS.TIER1},
    keys_given = {KEYS.WOOD, KEYS.TIER2},
    room_choices = {
        ["Forest"] = 2,
        ["BarePlain"] = 1,
        ["MyCustomRoom"] = 1
    },
    room_bg = WORLD_TILES.GRASS,
    background_room = "BGGrass",
    colour = {r=0.2, g=0.6, b=0.2, a=1}
})
```

### Task Properties

- `locks`: Requirements to access this task
- `keys_given`: Resources or capabilities provided by this task
- `room_choices`: Rooms to include (with counts)
- `room_bg`: Default terrain type
- `background_room`: Room type for empty areas

## Terrain Customization

Terrain is defined in `map/terrain.lua` and includes properties for each terrain type.

```lua
-- Example of terrain customization
WORLD_TILES.MYTERRAIN = 42  -- Add a new terrain type with ID 42

terrain.names[WORLD_TILES.MYTERRAIN] = "myterrain"
terrain.ground_names[WORLD_TILES.MYTERRAIN] = "My Custom Terrain"

-- Define terrain properties
terrain.texture_names[WORLD_TILES.MYTERRAIN] = "myterrain"
terrain.minimap_colors[WORLD_TILES.MYTERRAIN] = {r=0.5, g=0.3, b=0.1, a=1}
```

## Setpieces

Setpieces are pre-designed layouts that can be placed in the world.

```lua
-- Example of adding a setpiece to a level
local my_level = {
    id = "SURVIVAL_CUSTOM",
    name = "My Custom Level",
    desc = "A custom level with special setpieces",
    location = "forest",
    version = 4,
    overrides = {},
    required_setpieces = {
        "Sculptures_1",
        "MaxwellThrone"
    },
    numrandom_set_pieces = 3,
    random_set_pieces = {
        "Chessy_1",
        "Chessy_2",
        "Chessy_3",
        "Maxwell1",
        "Maxwell2",
        "MyCustomSetpiece"
    }
}
AddLevel(LEVELTYPE.SURVIVAL, my_level)
```

### Creating Custom Setpieces

Custom setpieces can be created using the Tiled map editor and converted to Lua:

1. Create a `.tmx` file in Tiled
2. Export it to the `data/scripts/map/static_layouts` directory
3. Create a Lua file that loads the layout:

```lua
return {
    type = LAYOUT.STATIC,
    layout_file = "map/static_layouts/my_setpiece",
    areas = {
        my_area = {
            -- Define special properties for this area
        }
    },
    -- Additional properties
}
```

## World Generation Properties

The world generation system uses many properties to control the generation process. These properties can be set through the in-game customization screen or programmatically in mods.

### Global Properties

- `task_set`: Determines which set of tasks to use (e.g., "default", "classic")
- `start_location`: Controls the starting location type ("default", "plus", "darkness", etc.)
- `world_size`: Controls the overall world size ("small", "medium", "default", "huge")
- `branching`: Controls how many branches the world has ("never", "least", "default", "most", "random")
- `loop`: Determines whether paths loop back on themselves ("never", "default", "always")
- `roads`: Controls road generation ("never", "default", "often")
- `prefabswaps_start`: Determines how predictable prefab placement is ("classic", "default", "highly random")
- `keep_disconnected_tiles`: Whether to keep disconnected landmasses ("default", "always")
- `layout_mode`: Controls the overall layout pattern ("LinkNodesByKeys", "RestrictNodesByKey")
- `wormhole_prefab`: Specifies the prefab to use for wormholes (default: "wormhole")

### Season Properties

- `season_start`: Determines which season the world starts in ("default", "winter", "spring", "summer", "autumn|spring", "winter|summer", "random")
- `autumn`: Controls autumn length ("noseason", "veryshortseason", "shortseason", "default", "longseason", "verylongseason", "random")
- `winter`: Controls winter length ("noseason", "veryshortseason", "shortseason", "default", "longseason", "verylongseason", "random")
- `spring`: Controls spring length ("noseason", "veryshortseason", "shortseason", "default", "longseason", "verylongseason", "random")
- `summer`: Controls summer length ("noseason", "veryshortseason", "shortseason", "default", "longseason", "verylongseason", "random")
- `day`: Controls day/night cycle ("default", "longday", "longdusk", "longnight", "noday", "nodusk", "nonight", "onlyday", "onlydusk", "onlynight")

### Resource Properties

#### Basic Resources
- `berrybush`: Controls berry bush abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `grass`: Controls grass tuft abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `sapling`: Controls sapling abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `reeds`: Controls reed abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `trees`: Controls tree abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `flint`: Controls flint abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `rock`: Controls rock abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `rock_ice`: Controls ice rock abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `meteorspawner`: Controls meteor shower frequency ("never", "rare", "uncommon", "default", "often", "mostly", "always")
- `meteorshowers`: Controls meteor shower frequency ("never", "rare", "uncommon", "default", "often", "mostly", "always")

#### Food Resources
- `carrot`: Controls carrot abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `berrybush_juicy`: Controls juicy berry bush abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `cactus`: Controls cactus abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `marshbush`: Controls marsh bush abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `flowers`: Controls flower abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `moon_tree`: Controls moon tree abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `moon_sapling`: Controls moon sapling abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `moon_berrybush`: Controls rock avocado bush abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `moon_rock`: Controls moon rock abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `moon_hotspring`: Controls hot spring abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")

#### Ocean Resources
- `ocean_seastack`: Controls sea stack abundance ("ocean_never", "ocean_rare", "ocean_uncommon", "ocean_default", "ocean_often", "ocean_mostly", "ocean_always", "ocean_insane")
- `ocean_shoal`: Controls fish shoal abundance ("ocean_never", "ocean_rare", "ocean_uncommon", "ocean_default", "ocean_often", "ocean_mostly", "ocean_always", "ocean_insane")
- `ocean_waterplant`: Controls sea weed abundance ("ocean_never", "ocean_rare", "ocean_uncommon", "ocean_default", "ocean_often", "ocean_mostly", "ocean_always", "ocean_insane")
- `ocean_wobsterden`: Controls wobster den abundance ("ocean_never", "ocean_rare", "ocean_uncommon", "ocean_default", "ocean_often", "ocean_mostly", "ocean_always", "ocean_insane")
- `ocean_bullkelp`: Controls bull kelp abundance ("ocean_never", "ocean_rare", "ocean_uncommon", "ocean_default", "ocean_often", "ocean_mostly", "ocean_always", "ocean_insane")
- `ocean_otterdens`: Controls otter den abundance ("ocean_never", "ocean_rare", "ocean_uncommon", "ocean_default", "ocean_often", "ocean_mostly", "ocean_always", "ocean_insane")

### Creature Properties

#### Passive Creatures
- `rabbits`: Controls rabbit hole abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `moles`: Controls molehill abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `butterfly`: Controls butterfly abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `birds`: Controls bird abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `pigs`: Controls pig house abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `beefalo`: Controls beefalo herd abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `bees`: Controls beehive abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `catcoon`: Controls catcoon den abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `lightninggoat`: Controls lightning goat abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `buzzard`: Controls buzzard abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `merm`: Controls mermhouse abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `bunnymen`: Controls rabbit hutch abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `rocky`: Controls rocklobster abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `monkey`: Controls monkey abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")

#### Hostile Creatures
- `spiders`: Controls spider den abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `cave_spiders`: Controls cave spider abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `houndmound`: Controls hound mound abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `tallbirds`: Controls tallbird nest abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `tentacles`: Controls tentacle abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `chess`: Controls clockwork monster abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `walrus`: Controls MacTusk camp abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `angrybees`: Controls killer bee hive abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `deciduousmonster`: Controls Birchnut tree abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `moon_spiders`: Controls moon spider den abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `moon_carrot`: Controls planted carrat abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `moon_fruitdragon`: Controls fruit dragon abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `moon_fissure`: Controls moon fissure abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `moon_starfish`: Controls starfish trap abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")
- `moon_bullkelp`: Controls beached bullkelp abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always", "insane")

### Special Features

- `touchstone`: Controls resurrection touchstone abundance ("never", "rare", "uncommon", "default", "often", "mostly", "always")
- `boons`: Controls setpiece skeleton/supply drops frequency ("never", "rare", "uncommon", "default", "often", "mostly", "always")
- `frograin`: Controls frog rain frequency ("never", "rare", "uncommon", "default", "often", "mostly", "always")
- `wildfires`: Controls wildfire frequency ("never", "rare", "uncommon", "default", "often", "mostly", "always")
- `petrification`: Controls forest petrification rate ("none", "few", "default", "many", "max")
- `lightning`: Controls lightning frequency ("never", "rare", "uncommon", "default", "often", "mostly", "always")
- `weather`: Controls rain frequency ("never", "rare", "uncommon", "default", "often", "mostly", "always")
- `disease_delay`: Controls disease onset timing ("none", "random", "long", "default", "short")
- `terrariumchest`: Controls the presence of the Terrarium chest ("never", "default")
- `stageplays`: Controls the presence of stageplays ("never", "default")
- `regrowth`: Controls how quickly destroyed resources regrow ("never", "veryslow", "slow", "default", "fast", "veryfast")
- `extrastartingitems`: Controls extra starting items ("0", "5", "default", "15", "20", "none")
- `specialevent`: Controls special events ("none", "default")
- `atrium_gate`: Controls atrium gate regeneration speed ("veryslow", "slow", "default", "fast", "veryfast")

### Boss Properties

- `bearger`: Controls Bearger spawn frequency ("never", "rare", "default", "often", "always")
- `deerclops`: Controls Deerclops spawn frequency ("never", "rare", "default", "often", "always")
- `goosemoose`: Controls Moose/Goose spawn frequency ("never", "rare", "default", "often", "always")
- `dragonfly`: Controls Dragonfly spawn frequency ("never", "rare", "default", "often", "always")
- `antliontribute`: Controls Antlion tribute frequency ("never", "rare", "default", "often", "always")
- `klaus`: Controls Klaus spawn frequency ("never", "rare", "default", "often", "always")
- `malbatross`: Controls Malbatross spawn frequency ("never", "rare", "default", "often", "always")
- `crabking`: Controls Crab King spawn frequency ("never", "rare", "default", "often", "always")
- `beequeen`: Controls Bee Queen spawn frequency ("never", "rare", "default", "often", "always")
- `toadstool`: Controls Toadstool spawn frequency ("never", "rare", "default", "often", "always")
- `stalker`: Controls Ancient Fuelweaver spawn frequency ("never", "rare", "default", "often", "always")
- `minotaur`: Controls Ancient Guardian spawn frequency ("never", "rare", "default", "often", "always")
- `deciduousmonster`: Controls Poison Birchnut Tree spawn frequency ("never", "rare", "default", "often", "always")

### Effect on Gameplay

Different property settings can dramatically change the gameplay experience:

- **Resource Abundance**: Setting resources to "often" or "mostly" creates a more relaxed survival experience, while "rare" or "never" creates a challenging scarcity
- **Creature Balance**: Increasing passive creatures while decreasing hostile ones creates a more peaceful world, while the opposite creates a combat-focused challenge
- **Season Length**: Longer winters with shorter summers creates a harsh environment focused on cold survival, while the opposite allows for more farming and exploration
- **World Structure**: High branching with loops creates a more interconnected world with multiple paths, while low branching creates a more linear experience
- **Boss Frequency**: Increasing boss spawns creates a more combat-focused game with frequent high-stakes encounters

### Property Interactions

Some properties interact with each other in interesting ways:

- Setting `season_start` to "winter" while making `winter` "longseason" creates an extended initial challenge
- Increasing `spiders` while decreasing `pigs` shifts the natural balance of the world toward a spider-dominated landscape
- Setting `regrowth` to "fast" while making resources "rare" creates a dynamic where resources are scarce but renewable
- Combining "default" `world_size` with "most" `branching` creates large, complex worlds with many interconnected areas
- Setting `roads` to "never" while increasing resource abundance encourages more exploration on foot

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

## Common Issues and Solutions

- **World Too Small**: Increase `world_size` parameter
- **Resources Too Scarce**: Increase specific resource parameters (e.g., `berrybush = "often"`)
- **Too Many Enemies**: Decrease enemy parameters (e.g., `spiders = "rare"`)
- **Disconnected Regions**: Increase `branching` and `loop` parameters
- **Missing Biomes**: Ensure all required tasks are included in the task set

## Conclusion

World generation in Don't Starve Together offers extensive customization options. By understanding the system's components and how they interact, you can create unique worlds tailored to specific gameplay experiences. Whether through the in-game customization screen or programmatic modifications, the possibilities for world generation are vast. 
