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

## Related Components

- **Network System**: Handles connections between different areas
- **Lock and Key System**: Controls progression through the world
- **Room System**: Defines individual areas' contents
- **Map System**: Translates the generation plan into actual terrain 