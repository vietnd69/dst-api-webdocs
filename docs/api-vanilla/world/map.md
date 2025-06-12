---
id: map
title: Map API
sidebar_position: 2
---

# Map API

Interfaces for map generation and manipulation.

## Overview

The Map API provides functionality for working with the game world's terrain, layout, and features. It includes tools for generation, customization, and runtime manipulation of the map.

## Key Components

### Map Generation

- **Level Generation**: Control the generation of world levels with customizable presets and parameters
- **Task-based Generation**: Create map layouts using tasks, rooms, and connections
- **Terrain Management**: Define and manipulate terrain types, tiles, and biomes

### World Features

- **Resource Distribution**: Control placement of resources, structures, and spawners
- **Layouts**: Apply predefined static layouts for special locations or events
- **Protected Resources**: Define areas with restricted resource spawning

### Runtime Manipulation

- **Retrofit Functions**: Modify existing worlds with new features or content
- **Ocean Management**: Control ocean generation, islands, and water-based content
- **Maze Generation**: Generate complex maze structures with custom parameters

## Common Functions

```lua
-- Get tile at a specific world position
local tile = TheWorld.Map:GetTileAtPoint(x, y, z)

-- Check if a point is on land
local is_land = TheWorld.Map:IsLand(x, y, z)

-- Find a valid point for spawning an entity
local x, y, z = TheWorld.Map:FindValidPositionByFan(angle, radius, attempts, center_x, center_z)

-- Check path accessibility between points
local is_accessible = TheWorld.Map:IsAboveGroundAtPoint(x, y, z)
```

## Related Components

- **Minimap**: Interface for the player's minimap functionality
- **Pathfinder**: Navigation system for entities traversing the map
- **WorldStateComponent**: Controls global map states and transitions 