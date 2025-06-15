---
id: world-overview
title: World API Overview
sidebar_position: 1
last_updated: 2023-07-06
slug: /api/world
---

# World API Overview

APIs for world generation, management and manipulation in Don't Starve Together.

## Core Components

The World API consists of several interconnected systems that handle different aspects of the game world:

### Map Generation

The [Map API](map.md) provides functionality for generating and manipulating the physical terrain of the game world. It handles:

- Terrain types and tile definitions
- Biome placement and distributions
- Procedural generation algorithms
- World layout and structures

### Seasonal System

The [Seasons API](seasons.md) controls the cyclical nature of the game world, including:

- Season transitions and durations
- Day/night cycle adjustments per season
- Environmental effects (temperature, precipitation)
- Season-specific events and mechanics

### World Settings

The [World Settings API](worldsettings.md) provides customization options for various world behaviors:

- Entity spawn rates and regeneration times
- Difficulty settings and scaling
- Resource availability and distribution
- Event timing and frequency

## Common Usage Patterns

### Accessing World Components

Most world systems can be accessed through `TheWorld` global object:

```lua
-- Access map functions
local is_land = TheWorld.Map:IsLand(x, y, z)

-- Access season information
local current_season = TheWorld.components.seasons:GetSeason()

-- Access world settings
local worldsettingstimer = TheWorld.components.worldsettingstimer
```

### Listening for World Events

Components can register for world events to respond to changes:

```lua
-- Listen for season changes
inst:ListenForEvent("seasonchange", OnSeasonChange, TheWorld)

-- Listen for day/night transitions
inst:ListenForEvent("cycleschanged", OnCycleChanged, TheWorld)

-- Listen for weather events
inst:ListenForEvent("ms_stormlevel", OnStormLevelChanged, TheWorld)
```

## Advanced Features

### Shard Management

For multi-shard worlds (connected server instances), the World API provides:

- Synchronization of world states across shards
- Shard-specific world generation parameters
- Cross-shard entity and player migration

### World State Persistence

The world state is persisted between game sessions through:

- World save data serialization
- Component-specific save/load methods
- Data migration during version updates

## Related Systems

The World API interacts with several other core systems:

- **Entity System**: Spawning and managing entities in the world
- **Player Systems**: Handling player interactions with the world
- **Network System**: Synchronizing world state across clients 
