---
id: entity
title: Entity
sidebar_position: 2
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Entity

Entity is the most basic node type in Don't Starve Together, representing all objects in the game from characters and items to structures.

## Overview

Entities are the fundamental building blocks of the game world. Each entity exists in the world and can have various components attached to it that define its behavior, appearance, and functionality.

## Entity Creation

Entities are typically created through prefabs, but can also be created directly:

```lua
local entity = CreateEntity()
entity:AddTag("myentity")
entity.entity:AddTransform()
entity.entity:AddAnimState()
entity.entity:AddNetwork()

-- Set up other entity properties
entity.entity:SetPristine()

if not TheWorld.ismastersim then
    return entity
end

-- Server-side component setup
entity:AddComponent("inventoryitem")

return entity
```

## Core Entity Parts

Each entity can have these core parts:

- **Transform**: Position, rotation, and scale
- **AnimState**: Animations and visual appearance
- **SoundEmitter**: Sound effects
- **Network**: Multiplayer synchronization
- **Physics**: Collision and physical interactions
- **Light**: Light emission
- **MiniMapEntity**: Appearance on the minimap

## Entity Tags

Tags are lightweight markers that identify entity characteristics:

```lua
entity:AddTag("player")
entity:AddTag("scarytoprey")

if entity:HasTag("player") then
    -- Do something with player entities
end

entity:RemoveTag("scarytoprey")
```

Common tags include:
- `player`: Player character
- `monster`: Hostile creature
- `structure`: Built structure
- `burnt`: Burned object
- `irreplaceable`: Cannot be replaced once destroyed

## Entity Lifecycle

Entities have a lifecycle in the game:

1. **Creation**: Entity is created through prefab or directly
2. **Setup**: Components and properties are configured
3. **Activation**: Entity becomes active in the world
4. **Updates**: Entity is updated each frame
5. **Removal**: Entity is removed from the world

## Entity Manipulation

Common operations on entities:

```lua
-- Get entity position
local x, y, z = entity.Transform:GetWorldPosition()

-- Set entity position
entity.Transform:SetPosition(x, y, z)

-- Make entity face a direction
entity.Transform:SetRotation(angle)

-- Set entity scale
entity.Transform:SetScale(1.5, 1.5, 1.5)

-- Remove entity from game
entity:Remove()
```

## Finding Entities

Entities can be found using various functions:

```lua
-- Find entities near a position
local entities = TheSim:FindEntities(x, y, z, radius, {"player"}, {"ghost"})

-- Find closest entity
local entity = FindClosestEntity(x, y, z, radius, {"tree"})

-- Find entities in a given area
local entities = FindEntitiesInArea(x1, y1, z1, x2, y2, z2, {"monster"})
```

## Related Systems

- Component system
- Prefab system
- Network replication
- Tag system
- Entity event system 
